const {DataTypes} = require('sequelize')
const sequelize = require('../util/database')

const OldMessage = sequelize.define('oldMessage',{
     id:{
          type:DataTypes.INTEGER,
          autoIncrement:true,
          allowNull : false,
          primaryKey:true,
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
          defaultValue: DataTypes.NOW 
      }
},
{
     tableName: 'oldMessages',
     timestamps: false  
}
)

module.exports = OldMessage