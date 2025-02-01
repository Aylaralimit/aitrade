import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export const handler: Handler = async (event) => {
  if (!event.body) {
    return { statusCode: 400, body: 'Invalid request body' };
  }

  try {
    await client.connect();
    const { email, password } = JSON.parse(event.body);

    const db = client.db('trading-app');
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }

    // Gerçek uygulamada şifre kontrolü yapılmalı
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  } finally {
    await client.close();
  }
};