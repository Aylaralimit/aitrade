import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.VITE_MONGODB_URI || '';
const client = new MongoClient(uri);

async function setupDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const db = client.db('trading-app');

    // Create collections
    await db.createCollection('users');
    await db.createCollection('trades');
    await db.createCollection('verification_documents');

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('trades').createIndex({ userId: 1 });
    await db.collection('verification_documents').createIndex({ userId: 1 });

    // Create admin user if not exists
    const adminUser = await db.collection('users').findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      await db.collection('users').insertOne({
        email: 'admin@example.com',
        name: 'Admin',
        accountType: 'real',
        balance: 1000000,
        isAdmin: true,
        verificationStatus: 'verified',
        createdAt: new Date(),
        lastLogin: new Date()
      });
      console.log('Admin user created');
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

setupDatabase();