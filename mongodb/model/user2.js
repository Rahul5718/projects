const mongodb = require('mongodb')
const  {getDb} = require('../util/database')
const ObjectID = mongodb.ObjectId

class User2{

    constructor(username,email){
     this.name = username
     this.email = email
    }

    save(){
     const db = getDb()
     return db.collection('users2').insertOne(this)
    }

    getUser(){
     const db = getDb()
     return db.collection('users2').findOne({name:this.name})
     .then(user=>{
          console.log(user);
          
          return user
     })
     .catch(err=>{
          console.log(err);
          return  err;
     })
    }

}
module.exports = User2