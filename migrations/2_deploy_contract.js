const VOTACIONES_CONTRACT = artifacts.require("VotacionContract");

module.exports = function(deployer) {
    deployer.deploy(VOTACIONES_CONTRACT);
};