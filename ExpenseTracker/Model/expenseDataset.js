const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

function idQuery(id) {
    return ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: String(id) };
}

function matchesWhere(document, where = {}) {
    return Object.entries(where).every(([key, value]) => document[key] === value);
}

class Expense {
    constructor(data) {
        Object.assign(this, data);
        this.id = data.id || data._id;
    }

    static async create(data) {
        const expense = {
            amount: Number(data.amount),
            description: data.description,
            category: data.category || 'General',
            type: data.type || 'expense',
            userId: data.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await getDb().collection('expenses').insertOne(expense);
        return new Expense({ ...expense, _id: result.insertedId, id: result.insertedId.toString() });
    }

    static async findByPk(id) {
        const expense = await getDb().collection('expenses').findOne(idQuery(id));
        return expense ? new Expense(expense) : null;
    }

    static async findAll(options = {}) {
        const where = options.where || {};
        let expenses = await getDb().collection('expenses').find(where).sort({ createdAt: -1 }).toArray();
        if (options.limit) expenses = expenses.slice(0, options.limit);
        return expenses.map(expense => new Expense(expense));
    }

    static async findAndCountAll(options = {}) {
        const where = options.where || {};
        const all = await getDb().collection('expenses').find(where).sort({ createdAt: -1 }).toArray();
        const offset = options.offset || 0;
        const rows = all.slice(offset, offset + (options.limit || all.length));
        return { count: all.length, rows: rows.map(expense => new Expense(expense)) };
    }

    static async sum(field, options = {}) {
        const expenses = await Expense.findAll(options);
        return expenses.reduce((total, expense) => total + Number(expense[field] || 0), 0);
    }

    async destroy() {
        await getDb().collection('expenses').deleteOne({ _id: this._id });
    }
}

module.exports = Expense;