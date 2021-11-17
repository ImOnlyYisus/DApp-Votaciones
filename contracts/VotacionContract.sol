// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract VotacionContract{

    uint256 public contadorParticipantes = 0;
    uint256 public contadorDirecciones = 0;

    //Creo un puestos por defecto
    constructor(){
        crearPuesto("Vico", "Maestro de DAW, programacion en Java. Tambien es Jefe de Estudios");
        crearPuesto("Elon Musk", "Millonario y lider de diversas empresas como es TESLA y SpaceX");
        crearPuesto("Jeff Bezos", "Persona con un patrimonio neto de 201 miles de millones de dolares");
        crearPuesto("Mark Zuckerberg", "Un peligro para la informacion privada, creador de FaceBook");
    }

    event PersonasCreadas(
        uint256 id,
        string nombre,
        string descripcion,
        uint256 fechaCreacion,
        uint256 votos
    );

    event PersonasVotadas(
        uint id, 
        uint256 numeroVotos, 
        string nombre,
        address addressFrom
    );

    //Estructura de mi votacion
    struct PersonasStruct{
        uint256 id;
        string nombre;
        string descripcion;
        uint256 fechaCreacion;
        uint256 votos;
    }

    //mapping es como una lista con listas [0:{id=...},1:{id=..}]
    mapping (uint256 => PersonasStruct) public personas;


    //FUNCION PARA CREAR CANDIDATOS A SER VOTADOS
    function crearPuesto(string memory nombre, string memory descripcion) public{
        contadorParticipantes++;

        personas[contadorParticipantes] = PersonasStruct(contadorParticipantes, nombre, descripcion,block.timestamp, 0);

        emit PersonasCreadas(contadorParticipantes, nombre, descripcion,block.timestamp, 0);
    }

    //FUNCION PARA VOTACION
    function votacionPersona(uint256 id) public{
        PersonasStruct memory personaMod = personas[id];
        
        personaMod.votos = personaMod.votos + 1;

        personas[id] = personaMod;


        emit PersonasVotadas(id, personaMod.votos, personaMod.nombre, msg.sender);

    }

}