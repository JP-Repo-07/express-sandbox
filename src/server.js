const { connectDB } = require('./config/config');
const app = require('./app');

(async () => {
  const db = await connectDB();   // connect once
  app.locals.db = db;             // store db in app.locals

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
