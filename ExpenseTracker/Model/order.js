const { getDb } = require('../util/database');

class Order {
    static async create(data) {
        const order = { ...data, createdAt: new Date(), updatedAt: new Date() };
        const result = await getDb().collection('orders').insertOne(order);
        return { ...order, _id: result.insertedId };
    }

    static async findOne(options = {}) {
        const order = await getDb().collection('orders').findOne(options.where || options);
        return order ? new Order(order) : null;
    }

    constructor(data) {
        Object.assign(this, data);
    }

    async update(values) {
        await getDb().collection('orders').updateOne({ _id: this._id }, { $set: values });
        Object.assign(this, values);
        return this;
    }
}

module.exports = Order;