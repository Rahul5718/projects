const Sequelize = require('sequelize');

// 1. Explicitly require the driver file at the top
const mysql2 = require('mysql2'); 

// 2. Pass it directly inside your configuration object
const sequelize = new Sequelize('groupchatapp', 'root', 'Rahul@123', {
    host: 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2, // <-- ADD THIS LINE RIGHT HERE
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;