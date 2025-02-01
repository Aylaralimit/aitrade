import { Handler } from '@netlify/functions';
import { Client, query as q } from 'faunadb';

const client = new Client({
  secret: process.env.FAUNA_SECRET_KEY || ''
});

export const handler: Handler = async (event) => {
  try {
    switch (event.httpMethod) {
      case 'GET':
        // Tüm kullanıcıları getir
        const result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection('users'))),
            q.Lambda('ref', q.Get(q.Var('ref')))
          )
        );
        return {
          statusCode: 200,
          body: JSON.stringify(result)
        };

      case 'POST':
        // Yeni kullanıcı oluştur
        if (!event.body) return { statusCode: 400, body: 'Invalid request body' };
        
        const data = JSON.parse(event.body);
        const user = await client.query(
          q.Create(q.Collection('users'), {
            data: {
              ...data,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            }
          })
        );
        return {
          statusCode: 201,
          body: JSON.stringify(user)
        };

      default:
        return { statusCode: 405, body: 'Method not allowed' };
    }
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database error' })
    };
  }
};