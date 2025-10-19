import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import { Enrollment } from '../domain/entities/Enrollment';

dotenv.config();

let raw = process.env.MONGO_URI;
if (!raw) throw new Error('MONGO_URI is required');
raw = raw.trim();
if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) raw = raw.slice(1, -1);
const DB_NAME = process.env.MONGO_DB && process.env.MONGO_DB.trim().length > 0 ? process.env.MONGO_DB.trim() : 'KeuzeModuleApp';

export class EnrollmentRepository {
  private client: MongoClient;
  private connected = false;
  private collectionName = 'enrollments';

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
    return this.client.db(DB_NAME).collection(this.collectionName);
  }

  async create(enrollment: Enrollment): Promise<Enrollment> {
    const col = await this.collection();
    const now = new Date();
    // avoid duplicates: if exists, return existing
    const existing = await col.findOne({ userId: enrollment.userId, moduleId: enrollment.moduleId });
    if (existing) return existing as Enrollment;
    const doc = { ...enrollment, createdAt: now, updatedAt: now };
    const res = await col.insertOne(doc);
    return { ...doc, _id: res.insertedId } as Enrollment;
  }

  async findByUser(userId: string): Promise<Enrollment[]> {
    const col = await this.collection();
    return (await col.find({ userId }).toArray()) as any;
  }

  async upsertFirstChoice(userId: string, moduleId: number, firstChoice: boolean): Promise<Enrollment> {
    const col = await this.collection();
    if (firstChoice) {
      // ensure only one firstChoice per user
      await col.updateMany({ userId }, { $set: { firstChoice: false, updatedAt: new Date() } });
    }
    const res = await col.findOneAndUpdate(
      { userId, moduleId },
      { $set: { firstChoice, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, returnDocument: 'after' as any }
    );
    return (res as any).value as Enrollment;
  }
  async delete(userId: string, moduleId: string | number): Promise<{ deleted: boolean }> {
    const col = await this.collection();
    // moduleId kan als string of number opgeslagen zijn
      const res = await col.deleteOne({
        userId,
        $or: [
          { moduleId: Number(moduleId) },
          { moduleId: String(moduleId) }
        ]
    });
    return { deleted: res.deletedCount > 0 };
  }
}
