import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();
import { IKeuzeModuleAppRepository } from '../interfaces/IKeuzeModuleAppRepository';
import { KeuzeModuleApp } from '../domain/entities/KeuzeModuleApp';
import { KeuzeModuleAppModel } from '../models/KeuzeModuleAppModel';
import { collectionName, toModel } from '../infrastructure/KeuzeModuleApp.Schema';

// require MONGO_URL in environment (.env or env vars)
let raw = process.env.MONGO_URL;
if (!raw) {
  console.error('[KeuzeModuleAppRepository] ERROR: MONGO_URL is not set. Put your MongoDB connection URI in .env as MONGO_URL and restart.');
  throw new Error('MONGO_URL is required (set in .env)');
}

// strip surrounding quotes if someone put the value in quotes in .env
raw = raw.trim();
if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
  raw = raw.slice(1, -1);
}

// Try to parse DB name from the connection string if not explicitly provided
const DB_NAME = process.env.MONGO_DB && process.env.MONGO_DB.trim().length > 0
  ? process.env.MONGO_DB.trim()
  : (() => {
      try {
        const afterSlash = raw.split('/').pop();
        if (!afterSlash) return 'KeuzeModuleApp';
        // if there is a ? then strip query params
        return afterSlash.split('?')[0] || 'KeuzeModuleApp';
      } catch (e) {
        return 'KeuzeModuleApp';
      }
    })();

export class KeuzeModuleAppRepository implements IKeuzeModuleAppRepository {
  private client: MongoClient;
  private connected = false;

  constructor() {
    this.client = new MongoClient(raw as string);
    console.log('[KeuzeModuleAppRepository] using MONGO_URL=', raw);
    console.log('[KeuzeModuleAppRepository] using DB_NAME=', DB_NAME);
  }

  private async ensureConnected() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  private async collection() {
    await this.ensureConnected();
    const db = this.client.db(DB_NAME);
    return db.collection(collectionName);
  }

  async findAll(): Promise<KeuzeModuleAppModel[]> {
    const col = await this.collection();
    let docs = await col.find().toArray();
    try {
      console.log(`[KeuzeModuleAppRepository] findAll: found ${docs.length} document(s)`);
      if (docs.length > 0) console.log('[KeuzeModuleAppRepository] sample:', JSON.stringify(docs[0]));
    } catch (e) {
      // ignore logging errors
    }
    // If primary collection is empty, try the common lowercase collection name as fallback
    if (docs.length === 0) {
      try {
        const altCol = (await this.client.db(DB_NAME)).collection('keuzemodules');
        const altDocs = await altCol.find().toArray();
        if (altDocs.length > 0) {
          console.log('[KeuzeModuleAppRepository] fallback: using collection keuzemodules with', altDocs.length, 'docs');
          return altDocs.map(toModel);
        }
      } catch (e) {
        // ignore
      }
    }
    return docs.map(toModel);
  }

  async findById(id: number): Promise<KeuzeModuleAppModel | null> {
    const col = await this.collection();
    let doc = await col.findOne({ id });
    if (!doc) {
      // try fallback collection name
      try {
        const altCol = (await this.client.db(DB_NAME)).collection('keuzemodules');
        doc = await altCol.findOne({ id });
        if (doc) console.log('[KeuzeModuleAppRepository] findById: found in fallback collection keuzemodules');
      } catch (e) {
        // ignore
      }
    }
    return doc ? toModel(doc) : null;
  }

  async create(item: KeuzeModuleApp): Promise<KeuzeModuleAppModel> {
    const col = await this.collection();
    const insertResult = await col.insertOne({ ...item });
    const doc = await col.findOne({ _id: insertResult.insertedId });
    return toModel(doc);
  }

  async update(id: number, item: Partial<KeuzeModuleApp>): Promise<KeuzeModuleAppModel | null> {
    const col = await this.collection();
  const res = await col.findOneAndUpdate({ id }, { $set: item }, { returnDocument: 'after' as any });
  const value = res && (res as any).value ? (res as any).value : null;
  return value ? toModel(value) : null;
  }

  async delete(id: number): Promise<boolean> {
    const col = await this.collection();
    const res = await col.deleteOne({ id });
    return res.deletedCount === 1;
  }
}
