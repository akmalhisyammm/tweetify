const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db(process.env.MONGODB_NAME);

const connect = async () => {
  await client.connect();
  console.log('Database connected sucessfully 🔥');
};

module.exports = { client, db, connect };
