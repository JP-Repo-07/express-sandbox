const { validate } = require('../utils/middleware/errorHandling');
const { ObjectId } = require('mongodb');
const { loginSchema } = require('../utils/schema/login');
const { loginFunc } = require('../function/login');

async function login(req, res) {
    const validation = validate(loginSchema, req.body || {}); // Validate the request body

    if (!validation.valid) {
        const error = new Error("Validation failed");
        error.status = 400;
        error.errors = validation.errors;
        throw error;
    }

    const { token, message } = await loginFunc(validation.data);

    // Set secure cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });

    res.status(200).json({ success: true, token, message });
}

module.exports = { login };
