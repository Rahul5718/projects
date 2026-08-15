const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phn: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isPremiumUser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    totalExpenses:{
        type:Sequelize.DOUBLE,
        defaultValue:0.0,
        allowNull: false
    },
    totalCredits: {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0
    }
});

module.exports = User;