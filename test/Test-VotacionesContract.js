const VotacionContract = artifacts.require("VotacionContract");

contract("VotacionContract", () => {
    before(async() => {
        this.votacionContract = await VotacionContract.deployed();
    })

    //COMPROBAR SI SE HA DESPLEGADO CORRECTAMENTE (compruebo la direccion address)
    it('Contratos correctamente desplegados', async() => {
        address = this.votacionContract.address;

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })

    //COMPROBAR SI SE CREAN LOS MIEMBROS
    it('Creacion de candidatos correcta', async() => {
        primeraPersona = await this.votacionContract.personas(1);

        assert.equal(primeraPersona.id.toNumber(), 1);
        assert.equal(primeraPersona.nombre, "Vico");
        assert.equal(primeraPersona.descripcion, "Maestro de DAW, programacion en Java. Tambien es Jefe de Estudios");
    })

    //COMPROBAR SI SE PUEDE VOTAR A LOS CANDIDATOS
    it('Votacion a candidatos correctamente', async() => {
        persona = await this.votacionContract.personas(1);

        assert.equal(persona.votos.toNumber(), 0);

        votar = await this.votacionContract.votacionPersona(persona.id);
        persona = await this.votacionContract.personas(1);
        votarEvent = votar.logs[0].args

        assert.equal(persona.votos.toNumber(), 1);
        assert.equal(persona.id.toNumber(), 1);
        assert.equal(persona.nombre, "Vico");
        assert.equal(votarEvent.id.toNumber(), persona.id.toNumber());
        assert.equal(votarEvent.nombre, persona.nombre);
        assert.equal(votarEvent.numeroVotos, 1);
    })
})