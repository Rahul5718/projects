const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const UserExpense = sequelize.define('userExpense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    month: {
        type: Sequelize.STRING, // e.g., "January", "February"
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER, // e.g., 2026
        allowNull: false
    },
    totalExpenditure: {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0
    },
    totalCredit: {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0
    }
});

module.exports = UserExpense;