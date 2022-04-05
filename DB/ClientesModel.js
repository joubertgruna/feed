const Sequelize = require('sequelize')
//importing database connection 
const conn = require('./conn')
const Empresas = require('./EmpresasModel')

const Clientes = conn.define('clientes', {

    nome: {
        type: Sequelize.STRING,
        allownull: false
    },
    email: {
        type: Sequelize.STRING,
        allownull: false
    },
    celular: {
        type: Sequelize.STRING,
        allownull: false
    },
    dataNascimento: {
        type: Sequelize.STRING,
        allownull: false
    },
    resposta1: {
        type: Sequelize.STRING,
        allownull: false
    },
    resposta2: {
        type: Sequelize.STRING,
        allownull: false
    },
    resposta3: {
        type: Sequelize.STRING,
        allownull: false
    },
    empresaURL: {
        type: Sequelize.STRING,
        allownull: false
    },
    empresaId: {
        type: Sequelize.STRING,
        allownull: false,
        foreignKey: true
    },
    somaResp: {
        type: Sequelize.INTEGER,
        allownull: false,
    }
})

// Clientes.belongsTo(Empresas)
//o sync sincroniza o conteúdo do arquivo para que eu possa exporta-lo
// Clientes.sync({ force: true }) //Para quando a app for iniciada não sobreescrever os dados já gravados /  não recriar a tabela usa o {force: false}
if (Clientes) {
    console.log('Model [Clientes] started with success...')
} else {
    console.log('Warning same else is happens!')
}

module.exports = Clientes