
const { randomUUID } = require('crypto');
const { getDb } = require('../util/database');

class ForgotPasswordRequest {
    static async create(data) {
        const request = { _id: data.id || randomUUID(), ...data, createdAt: new Date() };
        await getDb().collection('passwordRequests').insertOne(request);
        return request;
    }

    static async findOne(options = {}) {
        const request = await getDb().collection('passwordRequests').findOne(options.where || options);
        return request ? new ForgotPasswordRequest(request) : null;
    }

    constructor(data) {
        Object.assign(this, data);
    }

    async save() {
        const { _id, ...values } = this;
        await getDb().collection('passwordRequests').updateOne({ _id }, { $set: values });
        return this;
    }
}

module.exports = ForgotPasswordRequest;