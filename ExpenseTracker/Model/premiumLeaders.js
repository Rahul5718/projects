const { getDb } = require('../util/database');

class PremiumLeader {
    static async findOne(options = {}) {
        return getDb().collection('premiumLeaders').findOne(options.where || options);
    }

    static async create(data) {
        const record = { ...data, createdAt: new Date(), updatedAt: new Date() };
        const result = await getDb().collection('premiumLeaders').insertOne(record);
        return { ...record, _id: result.insertedId };
    }

    async update(values) {
        await getDb().collection('premiumLeaders').updateOne(
            { _id: this._id },
            { $set: { ...values, updatedAt: new Date() } }
        );
        Object.assign(this, values);
        return this;
    }
}

module.exports = PremiumLeader;

