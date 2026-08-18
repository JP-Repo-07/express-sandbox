const { ObjectId } = require('mongodb');
const { dbAction } = require('../utils/db/db');
const bcrypt = require('bcryptjs');


async function createUserFunc(payload, db) {

    const existingUser = await dbAction('users', 'findone', { email: payload.email });
    if (existingUser) {
        const error = new Error("User with this email already exists");
        error.status = 400;
        throw error;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(payload.password, 10); // salt rounds = 10

    const data = {
        ...payload,
        password: hashedPassword, // replace plain password
        status: "Active",
        failedAttempts: 0,
        lockUntil: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const collection = await dbAction('users', 'post', {}, data);
    return collection;
}

async function updateUserFunc(userId, payload, db) {
    const data = {
        ...payload,
        updatedAt: new Date(),
    }
    const collection = await dbAction('users', 'update', { _id: new ObjectId(userId) }, data);
    return collection;
}

module.exports = { updateUserFunc, createUserFunc };