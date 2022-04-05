//importing express
const express = require('express')
const bcrypt = require('bcryptjs')
//set express user 
const user = express.Router()

//Importing Model users
const Users = require('../DB/UsersModel')

//importing database connection 
const conn = require('../DB/conn')

//render main user
user.get('/users', (req, res) => {
    Users.findAll({ row: true, order: [['id', 'DESC']] }).then(result => {
        var users = result
        res.render('./users/indexUsers', {
            cli: users,
        })
    })
})

user.get('/login', (req, res) => {
    res.render('./users/login', {
        msgErr: '',
        msg: ''
    })
})

user.get('/addUser', (req, res) => {
    res.render('./users/addUser', { msgErr: '' })
})

user.post('/addUser', (req, res) => {
    var userName = req.body.userName
    var email = req.body.email
    var password = req.body.password

    Users.findOne({ where: { email: email } }).then(user => {
        var userEmail = user
        if (userEmail == undefined) {
            Users.create({
                userName: userName,
                email: email,
                password: password
            })
                .then(result => {
                    if (result) {
                        res.statusCode = 200
                        res.redirect('/admin/users')
                    } else {
                        console.log('Usuário não criado')
                    }
                })
        } else {
            res.render('./users/addUser', {
                msgErr: 'E-mail já cadastrado',
            })
        }
    })
    // var salt = bcrypt.genSaltSync(6)
    // var hash = bcrypt.hashSync(password, salt)

})

//render and edit data
user.get('/editar/id/:id', (req, res) => {
    var id = req.params.id
    Users.findAll({
        where: {
            id: id
        }, row: true,
        order: [['id', 'DESC']]
    }).then(result => {
        res.render('./users/editUser', {
            user: result[0],
        })
        // console.log(":::", result)
    })
})

//Editar Registros
user.post('/edit/:id?', (req, res) => {

    //Definindo as variaveis 
    var id = req.params.id
    var userName = req.body.userName
    var email = req.body.email
    var password = req.body.password

    if (id != undefined) { //Verificando se de fato foi passado algúm dado para a ID

        if (isNaN(id)) { //Se foi passado, verificando se o dado é numérico, se não for cai nessa condição
            res.StatusCode = 700 //Enviando código de status 700
            res.send('Erro 700 - ID Inválida') //Enviando resposta para o front-end
        } else { //Se o ID for de fato numérico
            // Users.findAll({ //Buscando todos os dados no banco 
            //     row: true, //retornando linha por linha 
            //     order:[['id','DESC']] //ordenando pela do maior para o menor 
            // })
            Users.update({ //Chamando a model Users e especificado quais os campos podem ser atualizados
                userName: userName,
                email: email,
                password: password
            }, { //E aqui eu especifco onde eu quero atualizar os dados com base no identificador passado
                where: {
                    id: id
                }
            })
                .then((Users) => { //Recebendo o retorno da atualização dos dados e passando para a var Users
                    if (Users) {// Se os dados foram editados
                        res.statusCode = 200 //Envia código de status sucesso 
                        res.redirect('/admin/users')
                        // res.json({ sucesso: 'Sucesso 200 - Dado editado', Users })
                    } else if (Users == '') {//Se não se o retorno do Users veio em vazio 
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
user.post('/delete', (req, res) => {
    //Definindo a minha variável 
    var id = req.body.id

    if (id != undefined) { // verificando se foi passado de fato algum dado pra variável id 

        if (isNaN(id)) { //Se caso a var id tiver dados nela, eu verifico se os dados são numéricos, se não forem caem nessa condição
            res.statusCode = 700
            // res.json({ erro: 'Erro 700 - ID Inválido.' })
        } else { // Se não o id é um número e cai dentro dessa condição 
            Users.destroy({ // E então chamo a model Users, utilizando o metodo destroy para deletar o id do banco for igual ao id passado
                where: {
                    id: id
                }
            })
                .then((delUsers) => {//Recebendo os dados apagados com o metodo destroy, e passando para a vaiável delUsers
                    console.log('ID Deletado: ', id) //imprimindo no console os dados que foram apagados no indice especificado
                    if (delUsers) { //Cai nessa condição quando os dados são deletados
                        res.statusCode = 200 //Envia o código de status 
                        res.redirect('/admin/users')
                        // res.json({ sucesso: `Sucesso - Dado deletado: ${delUsers}` }) //Resposta json para o requisição do fron-end
                    } else {
                        res.statusCode = 600
                        // res.json({ erro: "Erro 600 - Dado não encontrado" })
                    }
                })
        }
    }
})

user.post('/authenticate', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    // var salt = bcrypt.genSaltSync(10)
    // var hash = bcrypt.hashSync(password, salt)

    Users.findAll({ where: { email: email } })
        .then(validate => {
            var v = validate
            v.forEach(validate => {
                v = validate
            })
            console.log(':::', v.id)
            // console.log(':::', validate.id)
            if (email != v.email && password != v.password) {
                res.render('./users/login', {
                    msgErr: 'Email ou senha inválidos',
                    msg: ''
                })
            }
            else {
                res.redirect('/empresa/empresas')
            }
            // res.json({
            //     validate: validate
            // })
        })

})

module.exports = user
