const { MongoClient } = require('mongodb');
require('dotenv').config();
(async () => {
  try {
    const uri = process.env.MONGO_URL;
    const dbName = process.env.MONGO_DB || 'KeuzeModuleApp';
    if (!uri) return console.error('MONGO_URL not set');
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('KeuzeModuleApp');
    const count = await col.countDocuments();
    console.log('DB_NAME=', dbName, 'count=', count);
    const sample = await col.findOne({});
    console.log('SAMPLE=', JSON.stringify(sample));
    await client.close();
  } catch (e) {
    console.error('ERR', e.message);
    process.exit(1);
  }
})();
