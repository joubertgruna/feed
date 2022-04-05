//importing express
const express = require('express')
//set express cliente 
const cliente = express.Router()

//importing database connection 
const conn = require('../DB/conn')

const CliModel = require('../DB/ClientesModel')
const Empresas = require('../DB/EmpresasModel')

cliente.get('/avaliacao-finalizada', (req, res) => {
    res.render('./clientes/registerEndCliente')
})

//render main cliente
cliente.get('/clientes', (req, res) => {
    CliModel.findAll({ row: true, order: [['id', 'DESC']] }).then(result => {
        CliModel.findAndCountAll({ include: [{ model: Empresas }], row: true, order: [['id', 'DESC']] })
            .then(clientes => {
                var clientes = clientes
                CliModel.findAll({ include: [{ model: Empresas }], row: true, order: [['id', 'DESC']] })
                    .then((avaliacoes, index) => {
                        var ava = avaliacoes

                        Empresas.findAndCountAll({ include: [{ model: CliModel }], row: true, order: [['id', 'DESC']] })
                            .then(empresas => {
                                var empresas = empresas
                                //console.log(empresas)
                                res.render('./clientes/indexCliente', {
                                    emp: result,
                                    countEmpresas: empresas.count,
                                    countClientes: clientes.count,
                                    somaAvaliacoes: clientes.count * 3
                                })
                            })
                    })
            })

    })
})

//render cadastro cliente
cliente.get('/cadastro', (req, res) => {
    res.render('./clientes/addCliente')
})

//render and edit data
cliente.get('/editar/id/:id', (req, res) => {
    var id = req.params.id
    CliModel.findAll({
        where: {
            id: id
        }, row: true,
        order: [['id', 'DESC']]
    }).then(result => {
        res.render('./clientes/editCliente', {
            id: result[0],
        })
        // console.log(":::", result)
    })
})

//Criando um registro
cliente.post('/cadCliente', (req, res) => { //definindo a rota 
    // definindo as variáveis 
    var nome = req.body.nome
    var email = req.body.email
    var celular = req.body.celular
    var dataNascimento = req.body.dataNascimento
    var resposta1 = req.body.resposta1
    var resposta2 = req.body.resposta2
    var resposta3 = req.body.resposta3
    var empresaURL = req.body.empresaURL
    var somaResp = parseInt(resposta1) + parseInt(resposta2) + parseInt(resposta3)

    CliModel.create({ //Salvando os dados no banco de dados usando a função create
        nome: nome,
        email: email,
        celular: celular,
        dataNascimento: dataNascimento,
        resposta1: resposta1,
        resposta2: resposta2,
        resposta3: resposta3,
        empresaURL: empresaURL,
        somaResp: somaResp
    })
        .then((CliModel) => { //Recebendo os dados cadastrados atraves da função create e passando eles para CliModel

            //Verifica se os dados obrigatórios foram enviados 
            if (CliModel.nome == '' && CliModel.email == '' && CliModel.celular == '' && CliModel.dataNascimento == '' && CliModel.resposta1 == '' && CliModel.resposta2 == '' && CliModel.resposta3 == '') {
                res.statusCode = 405
                // res.json({
                //     erro: "Erro 405 - Dados não enviados"
                // })
                //Verifica se os dados não vieram vazios
            } else if (CliModel.nome != '' && CliModel.email != '' && CliModel.celular != '' && CliModel.dataNascimento != '' && CliModel.resposta1 != '' && CliModel.resposta2 != '' && CliModel.resposta3 != '') {
                res.statusCode = 200; //Retorna status sucesso dados inseridos no banco
                res.redirect('/cliente/clientes')
                // res.json(CliModel)//Retorna json com os dados cadastrados para o front

            }
            //verifica se todos os campos obrigatórios foram preenchidos 
            else if (CliModel.nome == '' || CliModel.email == '' || CliModel.celular == '' || CliModel.dataNascimento == '' || CliModel.resposta1 == '' || CliModel.resposta2 == '' || CliModel.resposta3 == '') {
                res.statusCode = 400
                // res.json({
                //     erro: 'Erro 400 - Dado incompleto'
                // })
            }
        }

        )

})
//Criando um registro
cliente.post('/regCliente', (req, res) => { //definindo a rota 
    // definindo as variáveis 
    var nome = req.body.nome
    var email = req.body.email
    var celular = req.body.celular
    var dataNascimento = req.body.dataNascimento
    var resposta1 = req.body.resposta1
    var resposta2 = req.body.resposta2
    var resposta3 = req.body.resposta3
    var empresaURL = req.body.empresaURL
    var somaResp = parseInt(resposta1) + parseInt(resposta2) + parseInt(resposta3)

    CliModel.create({ //Salvando os dados no banco de dados usando a função create
        nome: nome,
        email: email,
        celular: celular,
        dataNascimento: dataNascimento,
        resposta1: resposta1,
        resposta2: resposta2,
        resposta3: resposta3,
        empresaURL: empresaURL,
        somaResp: somaResp
    })
        .then((CliModel) => { //Recebendo os dados cadastrados atraves da função create e passando eles para CliModel

            //Verifica se os dados obrigatórios foram enviados 
            if (CliModel.nome == '' && CliModel.email == '' && CliModel.celular == '' && CliModel.dataNascimento == '' && CliModel.resposta1 == '' && CliModel.resposta2 == '' && CliModel.resposta3 == '') {
                res.statusCode = 405
                // res.json({
                //     erro: "Erro 405 - Dados não enviados"
                // })
                //Verifica se os dados não vieram vazios
            } else if (CliModel.nome != '' && CliModel.email != '' && CliModel.celular != '' && CliModel.dataNascimento != '' && CliModel.resposta1 != '' && CliModel.resposta2 != '' && CliModel.resposta3 != '') {
                res.statusCode = 200; //Retorna status sucesso dados inseridos no banco
                res.redirect('/cliente/avaliacao-finalizada')
                // res.json(CliModel)//Retorna json com os dados cadastrados para o front

            }
            //verifica se todos os campos obrigatórios foram preenchidos 
            else if (CliModel.nome == '' || CliModel.email == '' || CliModel.celular == '' || CliModel.dataNascimento == '' || CliModel.resposta1 == '' || CliModel.resposta2 == '' || CliModel.resposta3 == '') {
                res.statusCode = 400
                // res.json({
                //     erro: 'Erro 400 - Dado incompleto'
                // })
            }
        }

        )

})

//listando todos os Clientes
cliente.get('/all', (req, res) => { //criando a rota 
    CliModel.findAll({ //Buscando todos os dados no banco 
        row: true,
        order: [['id', 'DESC']]
    })
        .then((CliModel) => {//Retorno do dados da function finsAll para a var CliModel
            res.statusCode = 200 //Retorno código de sucesso
            var list = CliModel
            // res.json(list)
        })
})

//listando um único Cliente
cliente.get('/id/:id?', (req, res) => { //Definindo rota e passando parametro
    var id = req.params.id //pegando o parametro id passado via url e add na var id
    if (id != undefined) { //verifica se foi passado algum dado no parametro id
        if (isNaN(id)) { // Verifica se o é um número se não for cai aqui 
            res.StatusCode = 700
            // res.json({ erro: 'Erro 700 - ID Inválida' })
        } else {
            CliModel.findAll({//Busca todos os dados da tabela CliModel
                where: { //Onde o id for igual o id passado no parametro
                    id: id,
                }
            }).then((CliModel) => {//Passando os dados da função findAll para a var CliModel 
                if (CliModel == '') {//Verifica se o CliModel veio vazio caio aqui 
                    res.StatusCode = '600 - Dados não encontrados'
                    // res.json({ erro: '600 - Dados não encontrados' })
                } else if (CliModel.id == CliModel.id) { //Verifica se o id passado é igual o id já existente no banco 
                    var listUser = CliModel //passando os dados da var CliModel para a var listuser
                    // res.json(listUser)//enviando lista no formato json para o end point solicitado
                }
            })
        }
    }
})

//Editar Registros
cliente.post('/edit/:id?', (req, res) => {

    //Definindo as variaveis 
    var id = req.params.id
    var nome = req.body.nome
    var email = req.body.email
    var celular = req.body.celular
    var dataNascimento = req.body.dataNascimento
    var resposta1 = req.body.resposta1
    var resposta2 = req.body.resposta2
    var resposta3 = req.body.resposta3

    if (id != undefined) { //Verificando se de fato foi passado algúm dado para a ID

        if (isNaN(id)) { //Se foi passado, verificando se o dado é numérico, se não for cai nessa condição
            res.StatusCode = 700 //Enviando código de status 700
            res.send('Erro 700 - ID Inválida') //Enviando resposta para o front-end
        } else { //Se o ID for de fato numérico
            // CliModel.findAll({ //Buscando todos os dados no banco 
            //     row: true, //retornando linha por linha 
            //     order:[['id','DESC']] //ordenando pela do maior para o menor 
            // })
            CliModel.update({ //Chamando a model CliModel e especificado quais os campos podem ser atualizados
                nome: nome,
                email: email,
                celular: celular,
                dataNascimento: dataNascimento,
                resposta1: resposta1,
                resposta2: resposta2,
                resposta3: resposta3
            }, { //E aqui eu especifco onde eu quero atualizar os dados com base no identificador passado
                where: {
                    id: id
                }
            })
                .then((CliModel) => { //Recebendo o retorno da atualização dos dados e passando para a var CliModel
                    if (CliModel) {// Se os dados foram editados
                        res.statusCode = 200 //Envia código de status sucesso 
                        res.redirect('/cliente/clientes')
                        // res.json({ sucesso: 'Sucesso 200 - Dado editado', CliModel })
                    } else if (CliModel == '') {//Se não se o retorno do CliModel veio em vazio 
                        res.statusCode = 600//Envia código de status erro
                        // res.json({ erro: 'Erro 600 - Dado não encontrado' })//Envia resposta para o front-end
                    }
                })
        }
    } else { // Se a id não contiver nem um dado sendo passado cai nessa condição
        res.StatusCode = 700 //Enviando código de status erro
        res.json({ erro: 'Erro 700 - ID Inválida' })
    }

})

//Deletar Registros 
cliente.post('/delete', (req, res) => {
    //Definindo a minha variável 
    var id = req.body.id

    if (id != undefined) { // verificando se foi passado de fato algum dado pra variável id 

        if (isNaN(id)) { //Se caso a var id tiver dados nela, eu verifico se os dados são numéricos, se não forem caem nessa condição
            res.statusCode = 700
            // res.json({ erro: 'Erro 700 - ID Inválido.' })
        } else { // Se não o id é um número e cai dentro dessa condição 
            CliModel.destroy({ // E então chamo a model CliModel, utilizando o metodo destroy para deletar o id do banco for igual ao id passado
                where: {
                    id: id
                }
            })
                .then((delCliModel) => {//Recebendo os dados apagados com o metodo destroy, e passando para a vaiável delCliModel
                    console.log('ID Deletado: ', id) //imprimindo no console os dados que foram apagados no indice especificado
                    if (delCliModel) { //Cai nessa condição quando os dados são deletados
                        res.statusCode = 200 //Envia o código de status 
                        res.redirect('/cliente/clientes')
                        // res.json({ sucesso: `Sucesso - Dado deletado: ${delCliModel}` }) //Resposta json para o requisição do fron-end
                    } else {
                        res.statusCode = 600
                        // res.json({ erro: "Erro 600 - Dado não encontrado" })
                    }
                })
        }
    }
})

module.exports = cliente
