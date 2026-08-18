const { ObjectId } = require('mongodb');
const { dbAction } = require('../utils/db/db');

async function loginFunc(payload, db) {

    const existingUser = await dbAction(db, 'users', 'findone', { email: payload.email });
    if (!existingUser) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    if (existingUser.status === "Locked") {
        const error = new Error("Account is locked");
        error.status = 403;
        throw error;
    }

    if (existingUser.lockUntil && existingUser.lockUntil > Date.now()) {
        const error = new Error("Account is temporarily locked due to multiple failed login attempts. Please try again later.");
        error.status = 403;
        throw error;
    }

    const isMatch = await bcrypt.compare(payload?.password, existingUser?.password);
    if (!isMatch) {

        const failedAttempt = (existingUser?.failedAttempts || 0) + 1;
        const lockUntil = failedAttempt >= 5 ? Date.now() + 30 * 60 * 1000 : null; // Lock for 30 minutes after 5 failed attempts

        const updateData = { failedAttempts: failedAttempt, lockUntil: lockUntil, updatedAt: new Date() };

        const updateAction = await dbAction(db, 'users', 'update', { _id: existingUser?._id }, updateData);

        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    // Reset failed attempts
    await dbAction(db, 'users', 'update', { _id: existingUser._id }, {
        failedAttempts: 0,
        lockUntil: null,
        updatedAt: new Date()
    });

    // Issue JWT
    const token = jwt.sign(
        { userId: existingUser._id, email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    return { message: "Login successful", token };
}


module.exports = { loginFunc };