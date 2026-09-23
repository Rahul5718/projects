const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

function toId(value) {
    if (value instanceof ObjectId) return value;
    return ObjectId.isValid(value) ? new ObjectId(value) : value;
}

class User {
    constructor(data = {}) {
        Object.assign(this, data);
        this.id = String(data.id || data._id);
        this._id = data._id || data.id;
    }

    static async create(data) {
        const db = getDb();
        const user = {
            name: data.name,
            email: data.email,
            password: data.password,
            phn: data.phn || '',
            isPremiumUser: Boolean(data.isPremiumUser),
            totalExpenses: Number(data.totalExpenses || 0),
            totalExpenditure: Number(data.totalExpenditure || 0),
            totalCredits: Number(data.totalCredits || 0),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await db.collection('users').insertOne(user);
        return new User({ ...user, _id: result.insertedId, id: result.insertedId.toString() });
    }

    static async findOne(options = {}) {
        const query = { ...(options.where || options) };
        if (query.id) {
            const id = query.id;
            delete query.id;
            query.$or = [{ id: String(id) }, { _id: toId(id) }];
        }
        const user = await getDb().collection('users').findOne(query);
        return user ? new User(user) : null;
    }

    static find(options = {}) {
        return User.findOne(options);
    }

    static async findByPk(id) {
        const db = getDb();
        const query = { $or: [{ _id: toId(id) }, { id: String(id) }] };
        const user = await db.collection('users').findOne(query);
        return user ? new User(user) : null;
    }

    static async findAll() {
        return (await getDb().collection('users').find().toArray()).map(user => new User(user));
    }

    async update(values) {
        const db = getDb();
        const id = this._id;
        await db.collection('users').updateOne({ _id: id }, { $set: { ...values, updatedAt: new Date() } });
        Object.assign(this, values);
        return this;
    }

    async save() {
        const { _id, id, ...values } = this;
        return this.update(values);
    }

    static hasMany() {}
    static belongsTo() {}
}

module.exports = User;