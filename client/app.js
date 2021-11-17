App = {
    contracts: {},

    init: async() => {
        console.log("Cargada app.js");
        await App.loadEthereum();
        await App.loadAccount();
        await App.loadContracts();
        App.render();
        await App.renderPersonas();
        App.renderLogs();


    },

    //CARGAR WALLET METAMASK (COMPRUEBA SI ESTA INSTALADA)
    loadEthereum: async() => {
        if (window.ethereum) {
            console.log("Metamask esta disponible, red de Ether");
            App.web3Provider = window.ethereum;

            await window.ethereum.request({ method: 'eth_requestAccounts' });

        } else if (window.web3) {
            new Web3(window.web3.currentProvider);

        } else {
            alert("No se pudo encontrar ninguna red Ethereum en su navegador, instala metamask: https://metamask.io/");
        }
    },

    //CARGAR CUENTA DE METAMASK
    loadAccount: async() => {
        cuentaMetaMask = await window.ethereum.request({ method: 'eth_requestAccounts' });

        App.cuentaMetaMask = cuentaMetaMask[0];

        console.log(App.cuentaMetaMask);

    },

    //CARGAR CONTRATOS INTELIGENTES
    loadContracts: async() => {
        response = await fetch("VotacionContract.json");
        votacionesContractJSON = await response.json();

        App.contracts.votacionesContract = TruffleContract(votacionesContractJSON);
        App.contracts.votacionesContract.setProvider(App.web3Provider);
        App.votacionesContract = await App.contracts.votacionesContract.deployed();
    },

    //MANDAR ID WALLET AL FRONTEND
    render: () => {
        document.getElementById('cuenta').innerText = App.cuentaMetaMask;
    },

    //MANDAR INFORMACION DEL CONTRATO
    renderPersonas: async() => {
        contadorPersonas = await App.votacionesContract.contadorParticipantes();
        contadorPersonasNumber = contadorPersonas.toNumber();


        let html = '';

        for (let i = 1; i <= contadorPersonasNumber; i++) {
            personas = await App.votacionesContract.personas(i);

            personaId = personas[0];
            personaNombre = personas[1];
            personaDescripcion = personas[2];
            personaFechaCreacion = personas[3];
            personaVotos = personas[4];

            let contenidoVotos = `
            <div class="col-6">
                <div class="card bg-dark mb-2 shadow">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span class="h2">${personaNombre}</span>
                        <span class="text-info h6">[${personaVotos} / 10 Votos]</span> 
                        <div>
                            <input type="button" class="btn bg-success" data-id="${personaId}" value="Votar" onclick="App.votarPersona(this)">
                        </div>
                    </div>
                    <div class="card-body">
                        <span>Descripcion:</span>
                        <span>${personaDescripcion}</span>
                        <p class="text-muted">${new Date(personaFechaCreacion * 1000).toLocaleString()}</p>
                    </div>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="10" style="width:${personaVotos*100/10}%">
                            <span class="sr-only">${Math.round((personaVotos*100/10))}% Votos</span>
                        </div>
                    </div>
                    
                </div>
            </div>
            `;

            html += contenidoVotos;

        }

        document.querySelector("#votaciones").innerHTML = html;
    },

    votarPersona: async(element) => {
        personaId = element.dataset.id;
        showVote = await App.votacionesContract.votosAddress(App.cuentaMetaMask);


        if (!showVote.voto) {
            votarPersona = await App.votacionesContract.votacionPersona(personaId, { from: App.cuentaMetaMask });

            window.location.reload();

        } else {
            alert("Usted ya ha votado");
        }


    },

    renderLogs: async() => {
        contadorAddress = await App.votacionesContract.contadorAddress();
        contadorAddressNumber = contadorAddress.toNumber();

        let html = '';

        for (let i = 1; i <= contadorAddressNumber; i++) {
            address = await App.votacionesContract.addressAll(i);

            let contenidoLogs = `
                <div class="col-12 my-1 bg-dark rounded shadow">
                        <span class="text-success text-align-center">Voto confirmado!</span>
                        <span class="text-warning text-align-center">${address}</span>
                </div>
            `;

            html += contenidoLogs;
        }

        document.querySelector("#logs").innerHTML = html;

    }
}

App.init();