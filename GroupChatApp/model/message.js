// model/message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/Database');

const Message = sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  senderRole: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Automatically sets the current timestamp
  }
}, {
  // This ensures Sequelize maps exactly to your table preferences
  timestamps: false 
});

module.exports = Message;