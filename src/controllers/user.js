// userController.js
const { userSchema } = require('../utils/schema/user');
const { createUserFunc, updateUserFunc } = require('../function/user');
const { validate } = require('../utils/middleware/errorHandling');
const { ObjectId } = require('mongodb');

async function createUser(req, res) {
        const db = req.app.locals.db;
        const validation = validate(userSchema, req.body || {}); // Validate the request body

        if (!validation.valid) {
            const error = new Error("Validation failed");
            error.status = 400;
            error.errors = validation.errors;
            throw error;
        }

        const data = await createUserFunc(validation.data, db);
        res.status(201).json(data);
}

async function updateUser(req, res) {
    const db = req.app.locals.db;
    const validation = validate(userSchema, req.body || {});
    const id = req.params.userId;

    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    // Validate ObjectId format first
    if (!ObjectId.isValid(id)) {
        const error = new Error("Invalid user ID format");
        error.status = 400;
        throw error;
    }

    if (!validation.valid) {
        const error = new Error("Validation failed");
        error.status = 400;
        error.details = validation.errors;
        throw error;
    }

    const data = await updateUserFunc(id, validation.data, db);
    res.status(200).json(data);
}

async function getUsers(req, res) {
    try {
        const db = req.app.locals.db;
        const users = await getUserCollection(db).find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createUser, updateUser, getUsers };
