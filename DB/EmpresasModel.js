const Sequelize = require('sequelize')
//importing database connection 
const conn = require('./conn')
const Clientes = require('./ClientesModel')

const Empresas = conn.define('empresas', {

    empresa: {
        type: Sequelize.STRING,
        allownull: false
    },
    nome: {
        type: Sequelize.STRING,
        allownull: false
    },
    email: {
        type: Sequelize.STRING,
        allownull: false
    },
    url: {
        type: Sequelize.STRING,
        allownull: false
    },
    dataInicioContrato: {
        type: Sequelize.STRING,
        allownull: false
    },
    avaliacao1: {
        type: Sequelize.STRING,
        allownull: false
    },
    avaliacao2: {
        type: Sequelize.STRING,
        allownull: false
    },
    avaliacao3: {
        type: Sequelize.STRING,
        allownull: false
    },
    empresaURL: {
        type: Sequelize.STRING,
        allownull: false
    },

})

Empresas.hasMany(Clientes, { foreignKey: 'empresaId', sourceKey: 'empresaURL' });
Clientes.belongsTo(Empresas, { foreignKey: 'empresaId', targetKey: 'empresaURL' });
//o sync sincroniza o conteúdo do arquivo para que eu possa exporta-lo
// Empresas.sync({ force: true }) //Para quando a app for iniciada não sobreescrever os dados já gravados /  não recriar a tabela usa o {force: false}
if (Empresas) {
    console.log('Model [Empresas] started with success...')
} else {
    console.log('Warning same else is happens!')
}

module.exports = Empresas