const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

const PremiumLeader = sequelize.define('premiumLeader', {
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
    totalExpenses: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // premium download tracking
    lastExpenseDownloadAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
    expenseDownloadCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    // JSON stringified array of ISO timestamps: ["2026-...Z", ...]
    expenseDownloadHistory: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

module.exports = PremiumLeader;

