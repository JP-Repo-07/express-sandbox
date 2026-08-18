const express = require('express');
const router = require('./route/route');
const { errorHandler } = require('./utils/middleware/errorHandling');

const app = express();

app.use(express.json());
app.use('/', router);
app.use(errorHandler);

module.exports = app;