import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

let raw = process.env.MONGO_URI;
if (!raw) {
  console.error('[UserRepository] ERROR: MONGO_URI is not set.');
  throw new Error('MONGO_URI is required');
}
raw = raw.trim();
if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
  raw = raw.slice(1, -1);
}
const DB_NAME = process.env.MONGO_DB && process.env.MONGO_DB.trim().length > 0 ? process.env.MONGO_DB.trim() : 'KeuzeModuleApp';

export class UserRepository {
  private client: MongoClient;
  private connected = false;

  constructor() {
    this.client = new MongoClient(raw as string);
  }

  private async ensureConnected() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  private async collection() {
    await this.ensureConnected();
    return this.client.db(DB_NAME).collection('users');
  }

  async findByUsername(username: string) {
    const col = await this.collection();
    return col.findOne({ username });
  }
}
