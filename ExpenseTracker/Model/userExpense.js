const { getDb } = require('../util/database');

class UserExpense {
    static async create(data) {
        const record = { ...data, createdAt: new Date() };
        const result = await getDb().collection('userExpenses').insertOne(record);
        return { ...record, _id: result.insertedId };
    }
}

module.exports = UserExpense;