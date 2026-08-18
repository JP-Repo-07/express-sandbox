const { getDb } = require("../../config/config");

// src/utils/dbHelper.js
async function dbAction(collectionName, action, query = {}, data = {}) {
  const db = await getDb(); // ✅ connection handled internally
  const collection = db.collection(collectionName);

  switch (action.toLowerCase()) {
    case 'get':
      return await collection.find(query).toArray();

    case 'findone':
      return await collection.findOne(query);

    case 'post':
      return await collection.insertOne(data);

    case 'update':
      return await collection.updateOne(query, { $set: data });

    case 'upsert':
      return await collection.updateOne(
        query,
        { $set: data },
        { upsert: true }
      );

    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}

module.exports = { dbAction };
