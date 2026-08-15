const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('../util/Database');
const { SELECT } = require('sequelize/lib/query-types');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER || Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING || Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING || Sequelize.STRING,
    allowNull: false,
    unique:true
  },
  // store phone as string to keep leading zeros and match controller normalization
  phone: {
    type: DataTypes.STRING || Sequelize.STRING,
    allowNull: false,
    unique:true
  },
  password: {
    type: DataTypes.STRING || Sequelize.STRING,
    allowNull: false
  },
  lastLogin:{
     type:DataTypes.DATE ||Sequelize.DATE ,
     allowNull:true
  },
  lastLogout:{
     type:DataTypes.DATE || Sequelize.DATE ,
     allowNull:true
  }

});

module.exports = User;

