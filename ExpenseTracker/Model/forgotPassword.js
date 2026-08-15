
const { DataTypes } = require('sequelize');
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
});

module.exports = ForgotPasswordRequest;