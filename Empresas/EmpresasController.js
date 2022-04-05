//importing express
const express = require('express')
const sequelize = require('sequelize')
//set express router 
const empresa = express.Router()
//importing database connection 
const conn = require('../DB/conn')

const empModel = require('../DB/EmpresasModel')
const Clientes = require('../DB/ClientesModel')

//render regiter cliente
empresa.get('/registro/:urlnome', (req, res) => {
    var empresaURL = req.params.urlnome
    empModel.findAll({
        where: {
            url: empresaURL
        }, row: true
        // order: [['id', 'DESC']]
    })
        .then(result => {
            res.render('./clientes/registerCliente', {
                empresaURL: result[0]
            })

        })
})

//empresa main router
empresa.get('/empresas', (req, res) => {

    empModel.findAndCountAll({ include: [{ model: Clientes }], row: true, order: [['id', 'DESC']] }).then(result => {
        var count = { result: result }
        var retorno = result
        console.log('Retorno: ', retorno)

        var rtn = retorno.rows.forEach(empresas => {
            avaliacoes = { emp: empresas.empresa, ava1: empresas.avaliacao1, ava2: empresas.avaliacao2, ava3: empresas.avaliacao3 }
            console.log(['ID: ', empresas.id, 'Empresa: ', avaliacoes.emp, 'AVA 1: ', avaliacoes.ava1, 'AVA 2: ', avaliacoes.ava2, 'AVA 3: ', avaliacoes.ava3]);

        });

        var contador = Clientes.findAndCountAll({ row: true, order: [['id', 'DESC']] })
            .then(retorno => {
                var contador = retorno
                var ctn = retorno.count

                console.log('TOTAL DE CLIENTES: ', ctn)


                contador.rows.forEach(contador => {
                    cls = contador
                    console.log('CLIENTESSS', cls)
                })
                return contador
            })

        var avaliacao = Clientes.findAndCountAll({
            include: [{ model: empModel }],
            row: true, order: [['id', 'DESC']]
        })
            .then(avaliacao => {
                var ava = avaliacao
                ava.rows.forEach(ava => {
                    ava = ava
                    console.log('EMPRESAS: ', ava)
                })
                var contAvaliacao = ava
                return contAvaliacao
            })

        contador.then(contador => {
            avaliacao.then(avaliacao => {
                res.render('./empresas/indexEmpresa', {
                    emp: result,
                    count: count.result.count,
                    contador: contador.count,
                    avaliacao: avaliacao.count * 3
                })
            })

        })

        // console.log(count.then(res => count))
    })

})

//empresa cadastrar dados
empresa.get('/cadastro', (req, res) => {
    res.render('./empresas/addEmpresa')
})

//empresa editar dados
empresa.get('/editar/id/:id?/:url?', (req, res) => {
    var id = req.params.id
    var url = req.params.url
    empModel.findAll({
        where: {
            id: id
        }, row: true,
        order: [['id', 'DESC']]
    }).then(result => {
        // console.log('XXXX: ', result)
        Clientes.findAndCountAll({
            where: {
                empresaURL: url
            }, row: true,
            order: [['id', 'DESC']]
        }).then(clientes => {
            Clientes.findAll({
                where: {
                    empresaURL: url
                }, row: true,
                order: [['id', 'DESC']]
            })
                .then(mediaAvalia => {
                    const ava = [mediaAvalia]
                    ava.forEach(ava => {
                        x = ava
                    })
                    const sum = x.map(element => element.somaResp).reduce((a, b) => a + b, 0);
                    console.log('TOTAL RESP: ', sum);
                    const average = parseInt(sum / 3);
                    console.log('MEDIA RESP: ', parseInt(average));

                    res.render('./empresas/editEmpresa', {
                        id: result[0],
                        clientes: clientes.count,
                        avaliacoes: clientes.count * 3,
                        mediaAvaliacao: average
                    })

                })

            // console.log(clientes.count)
        })
    })

})

//Criando um registro
empresa.post('/cadEmpresa', (req, res) => { //definindo a rota 
    // definindo as variáveis 
    var empresa = req.body.empresa
    var nome = req.body.nome
    var email = req.body.email
    var url = req.body.url
    var dataInicioContrato = req.body.dataInicioContrato
    var avaliacao1 = req.body.avaliacao1
    var avaliacao2 = req.body.avaliacao2
    var avaliacao3 = req.body.avaliacao3
    var empresaURL = req.body.url

    empModel.create({ //Salvando os dados no banco de dados usando a função create
        empresa: empresa,
        nome: nome,
        email: email,
        url: url,
        dataInicioContrato: dataInicioContrato,
        avaliacao1: avaliacao1,
        avaliacao2: avaliacao2,
        avaliacao3: avaliacao3,
        empresaURL: empresaURL
    })
        .then((empModel) => { //Recebendo os dados cadastrados atraves da função create e passando eles para empModel

            //Verifica se os dados obrigatórios foram enviados 
            if (empModel.nome == '' && empModel.email == '' && empModel.url == '' && empModel.dataInicioContrato == '' && empModel.avaliacao1 == '' && empModel.avaliacao2 == '' && empModel.avaliacao3 == '') {
                // res.json({
                //     erro: "Erro 405 - Dados não enviados"
                // })
                res.statusCode = 405
                //Verifica se os dados não vieram vazios
            } else if (empModel.nome != '' && empModel.email != '' && empModel.url != '' && empModel.dataInicioContrato != '' && empModel.avaliacao1 != '' && empModel.avaliacao2 != '' && empModel.avaliacao3 != '') {
                res.statusCode = 201; //Retorna status sucesso dados inseridos no banco
                // res.json(empModel)//Retorna json com os dados cadastrados para o front
                res.redirect('/empresa/empresas')
            }
            //verifica se todos os campos obrigatórios foram preenchidos 
            else if (empModel.nome == '' || empModel.email == '' || empModel.url == '' || empModel.dataInicioContrato == '' || empModel.avaliacao1 == '' || empModel.avaliacao2 == '' || empModel.avaliacao3 == '') {
                // res.json({
                //     erro: 'Erro 400 - Dado incompleto'
                // })
                res.statusCode = 400
            }
        }

        )

})

//listando todos os empresas
empresa.get('/all', (req, res) => { //criando a rota 
    empModel.findAll({ //Buscando todos os dados no banco 
        row: true,
        order: [['id', 'DESC']]
    })
        .then((empModel) => {//Retorno do dados da function finsAll para a var empModel
            res.statusCode = 200 //Retorno código de sucesso
            var list = empModel
            // res.json(list)
        })

})

//listando um único empresa
empresa.get('/id/:id?', (req, res) => { //Definindo rota e passando parametro
    var id = req.params.id //pegando o parametro id passado via url e add na var id
    if (id != undefined) { //verifica se foi passado algum dado no parametro id
        if (isNaN(id)) { // Verifica se o é um número se não for cai aqui 
            res.StatusCode = 700
            // res.json({ erro: 'Erro 700 - ID Inválida' })
        } else {
            empModel.findAll({//Busca todos os dados da tabela empModel
                where: { //Onde o id for igual o id passado no parametro
                    id: id,
                }
            }).then((empModel) => {//Passando os dados da função findAll para a var empModel 
                if (empModel == '') {//Verifica se o empModel veio vazio caio aqui 
                    res.StatusCode = '600 - Dados não encontrados'
                    // res.json({ erro: '600 - Dados não encontrados' })
                } else if (empModel.id == empModel.id) { //Verifica se o id passado é igual o id já existente no banco 
                    var listUser = empModel //passando os dados da var empModel para a var listuser
                    // res.json(listUser)//enviando lista no formato json para o end point solicitado
                }
            })
        }
    }
})

//Editando Regitros 
empresa.post('/edit/:id', (req, res) => {
    //Definindo as variaveis 
    var id = req.params.id
    var empresa = req.body.empresa
    var nome = req.body.nome
    var email = req.body.email
    var url = req.body.url
    var dataInicioContrato = req.body.dataInicioContrato
    var avaliacao1 = req.body.avaliacao1
    var avaliacao2 = req.body.avaliacao2
    var avaliacao3 = req.body.avaliacao3

    if (id != undefined) { //Verificando se de fato foi passado algúm dado para a ID

        if (isNaN(id)) { //Se foi passado, verificando se o dado é numérico, se não for cai nessa condição
            res.StatusCode = 700 //Enviando código de status 700
            res.send('Erro 700 - ID Inválida') //Enviando resposta para o front-end
        } else { //Se o ID for de fato numérico
            // empModel.findAll({ //Buscando todos os dados no banco 
            //     row: true, //retornando linha por linha 
            //     order:[['id','DESC']] //ordenando pela do maior para o menor 
            // })
            empModel.update({ //Chamando a model empModel e especificado quais os campos podem ser atualizados
                empresa: empresa,
                nome: nome,
                email: email,
                url: url,
                dataInicioContrato: dataInicioContrato,
                avaliacao1: avaliacao1,
                avaliacao2: avaliacao2,
                avaliacao3: avaliacao3
            }, { //E aqui eu especifco onde eu quero atualizar os dados com base no identificador passado
                where: {
                    id: id
                }
            })
                .then((empModel) => { //Recebendo o retorno da atualização dos dados e passando para a var empModel
                    if (empModel) {// Se os dados foram editados
                        res.redirect('/empresa/empresas')
                        res.statusCode = 200 //Envia código de status sucesso 
                        // res.json({ sucesso: 'Sucesso 200 - Dado editado', empModel })
                    } else if (empModel == '') {//Se não se o retorno do empModel veio em vazio 
                        res.statusCode = 600//Envia código de status erro
                        // res.json({ erro: 'Erro 600 - Dado não encontrado' })//Envia resposta para o front-end
                    }
                })
        }
    } else { // Se a id não contiver nem um dado sendo passado cai nessa condição
        res.StatusCode = 700 //Enviando código de status erro
        // res.json({ erro: 'Erro 700 - ID Inválida' })
    }

})

//Deletar Registros 
empresa.post('/delete', (req, res) => {
    //Definindo a minha variável 
    var id = req.body.id

    if (id != undefined) { // verificando se foi passado de fato algum dado pra variável id 

        if (isNaN(id)) { //Se caso a var id tiver dados nela, eu verifico se os dados são numéricos, se não forem caem nessa condição
            res.statusCode = 700
            // res.json({ erro: 'Erro 700 - ID Inválido.' })
        } else { // Se não o id é um número e cai dentro dessa condição 
            empModel.destroy({ // E então chamo a model empModel, utilizando o metodo destroy para deletar o id do banco for igual ao id passado
                where: {
                    id: id
                }
            })
                .then((delempModel) => {//Recebendo os dados apagados com o metodo destroy, e passando para a vaiável delempModel
                    console.log('ID Deletado: ', id) //imprimindo no console os dados que foram apagados no indice especificado
                    if (delempModel) { //Cai nessa condição quando os dados são deletados
                        res.redirect('/empresa/empresas')
                        res.statusCode = 200 //Envia o código de status 
                        // res.json({ sucesso: `Sucesso - Dado deletado: ${delempModel}` }) //Resposta json para o requisição do fron-end
                    } else {
                        res.statusCode = 600
                        // res.json({ erro: "Erro 600 - Dado não encontrado" })
                    }
                })
        }
    }
})

module.exports = empresa


