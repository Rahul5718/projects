const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense';
const databaseName = process.env.MONGO_DATABASE || 'expense';
let client;
let db;

async function connectDatabase() {
    if (db) return db;

    client = new MongoClient(uri);
    await client.connect();
    db = client.db(databaseName);
    console.log(`Connected to MongoDB database "${databaseName}".`);
    return db;
}

function getDb() {
    if (!db) throw new Error('MongoDB is not connected.');
    return db;
}

async function closeDatabase() {
    if (client) await client.close();
    client = undefined;
    db = undefined;
}

module.exports = { connectDatabase, getDb, closeDatabase };

