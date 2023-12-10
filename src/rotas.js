const express = require("express");

rotas = express();

const { selecionarEnderecos } = require("./controladores/cep");



rotas.get("/enderecos/:cep", selecionarEnderecos);


module.exports = rotas;