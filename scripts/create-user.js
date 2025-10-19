const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  const [,, username, password] = process.argv;
  if (!username || !password) {
    console.error('Usage: node scripts/create-user.js <username> <password>');
    process.exit(1);
  }

  const uri = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGO_URL;
  const dbName = process.env.MONGO_DB || 'KeuzeModuleApp';
  if (!uri) {
    console.error('MONGO_URI / MONGO_URL not set in .env');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');

    const hash = await bcrypt.hash(password, 10);
    const doc = { username, password: hash, createdAt: new Date() };
    const res = await users.insertOne(doc);
    console.log('Inserted user _id=', res.insertedId.toString());
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
