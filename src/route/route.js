const express = require('express');
const { createUser, getUsers, updateUser } = require('../controllers/user');
const asyncHandler = require('../utils/middleware/asyncHandler');
const { login } = require('../controllers/login');
const loginLimiter = require('../utils/middleware/rateLimiter');
const router = express.Router();

router.post('/users', asyncHandler(createUser));
router.put('/users/:userId', asyncHandler(updateUser));
router.get('/users', asyncHandler(getUsers));

router.post('/login', loginLimiter, asyncHandler(login));

module.exports = router;