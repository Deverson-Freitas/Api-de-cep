const { buscarEndereco } = require("utils-playground");
const fs = require("fs/promises");


const selecionarEnderecos = async (requisicao, resposta) => {
    try {

        const { cep } = requisicao.params;
        const enderecos = await fs.readFile("./src/enderecos.json");
        const enderecosEmObjetos = JSON.parse(enderecos);

        const enderecoCadastrado = enderecosEmObjetos.find((endereco) => {
            const cepFormatado = endereco.cep.replace("-", "");
            return cepFormatado === cep;
        });

        if (enderecoCadastrado) {
            resposta.status(200).json(enderecoCadastrado);
        }

        else {
            const novoEndereco = await buscarEndereco(cep);

            if (novoEndereco.erro) {
                console.log(novoEndereco);
                resposta.status(500).json({ erro: "erro com o servidor" });
            } else {

                enderecosEmObjetos.push(novoEndereco);

                const enderecosEmString = JSON.stringify(enderecosEmObjetos);

                await fs.writeFile("./src/enderecos.json", enderecosEmString);

                return resposta.status(201).json(novoEndereco);
            };
        };

    } catch (erro) {
        console.log(erro);
        resposta.status(500).json({ erro: "erro com o servidor" });

    };

};

module.exports = { selecionarEnderecos };