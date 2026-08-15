const {Sequelize} = require('sequelize');
const mysql = require('mysql2/promise');
const databaseName = 'expense';

async function ensureDatabaseExists() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Rahul@123'
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
        console.log(`Database "${databaseName}" checked/created successfully.`);
        await connection.end();
    } catch (error) {
        console.error('Error creating database:', error);
    }
}

const sequelize = new Sequelize('expense','root','Rahul@123', {
    dialect: 'mysql',
    host: '127.0.0.1',
    port:3306
   
});

(async ()=>{
     try {
          await ensureDatabaseExists();
          await sequelize.authenticate();
          console.log("connection has been created");
          
     } catch (error) {
          console.log(error);
          
     }
})();

module.exports=sequelize

