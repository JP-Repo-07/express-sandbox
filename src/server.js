const express = require('express');
const router = require('./route/route');
const { errorHandler } = require('./utils/middleware/errorHandling');
const { connectDB } = require('./config/config');

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
  if (!app.locals.db) {
    app.locals.db = await connectDB(); // connect once, cache
  }
  req.db = app.locals.db; // pass along
  next();
});

app.use('/api', router);
app.use(errorHandler);

// ✅ Conditional: local dev vs Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;