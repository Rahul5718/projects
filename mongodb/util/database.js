const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect('mongodb://localhost:27017/mydb')
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      if (callback) {
        callback();
      }
      return _db;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error('No database found!');
};

module.exports = { mongoConnect, getDb };