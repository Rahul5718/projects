const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database'); 

const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequest', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
        allowNull: false
    }
}, {
    // FORCE Sequelize to target the lowercased table name in MySQL
    tableName: 'forgotpasswordrequests',
    freezeTableName: true
});

module.exports = ForgotPasswordRequest;