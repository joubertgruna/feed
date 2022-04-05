//importing sequelize 
const sequelize = require('sequelize')
const conn = new sequelize('feedBase', 'root', '20IDEbrasil@20M', {
    host: '208.68.38.173',
    dialect: 'mysql'
})

//verifing the conection with database 
conn.authenticate()//authenticate function
    .then( //if ok execute then
        console.log('DB [feedBase] Conected..')
    )
    .catch(//if the conn is not ok execute the catch
        (error) => {
            console.log(error)
        }
    )

module.exports = conn

