//importing express lib
const express = require('express')
//set express
const app = express()
//importing body-parser 
const bodyParser = require('body-parser')
//importing express-session
const session = require('express-session')


//importing database connection 
const conn = require('./DB/conn')
//importing Model Empresas
const EmpresaModel = require('./DB/EmpresasModel')
//importing Model Clientes
const ClientesModel = require('./DB/ClientesModel')
//importing Model Users
const UsersModel = require('./DB/UsersModel')
//importing clientes router
const clienteRouter = require('./Clientes/ClientesController')
//importing clientes router
const empresaRouter = require('./Empresas/EmpresasController')
//importing users router
const usersRouter = require('./Users/UsersController')

//set view engine
app.set('view engine', 'ejs')

//set express session
app.use(session({
    secret: 'fedd',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30000 } //config the secret of session and time of expiration
}))

//set to using body-parser 
app.use(bodyParser.urlencoded({ extended: false }))
//set to using json 
app.use(bodyParser.json())
//set static files folder
app.use(express.static('public'))


//set cliente router 
app.use('/cliente', clienteRouter)
//set empresa router
app.use('/empresa', empresaRouter)
//set Users router
app.use('/admin', usersRouter)

// app.get('/session', (req, res) => {
//     req.session.nome = 'Joubert'
//     req.session.id = 100
//     req.session.global = {
//         nome: req.session.nome,
//         id: req.session.id
//     }
//     res.json('Sessão gerada')
// })

// app.get('/sessleitura', (req, res) => {

//     res.json({
//         nome: req.session.nome,
//         id: req.session.id
//     })
// })
//default router of aplication 
app.get('/', (req, res) => {
    res.render('./site/site')
})

app.listen(3000, (error) => {
    if (error) {
        console.log('Erro')
    } else {
        console.log('Server run on port [3000]')
    }
})
