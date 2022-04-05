const Sequelize = require('sequelize')
//importing database connection 
const conn = require('./conn')

const Users = conn.define('users', {

    userName: {
        type: Sequelize.STRING,
        allownull: false
    },
    email: {
        type: Sequelize.STRING,
        allownull: false
    },
    password: {
        type: Sequelize.STRING,
        allownull: false
    },

})

// Clientes.belongsTo(Empresas)
//o sync sincroniza o conteúdo do arquivo para que eu possa exporta-lo
// Users.sync({ force: true }) //Para quando a app for iniciada não sobreescrever os dados já gravados /  não recriar a tabela usa o {force: false}
if (Users) {
    console.log('Model [Users] started with success...')
} else {
    console.log('Warning same else is happens!')
}

module.exports = Users