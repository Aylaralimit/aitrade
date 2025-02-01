import { Handler } from '@netlify/functions';
import * as Realm from 'realm-web';

const APP_ID = process.env.VITE_MONGODB_APP_ID;
const API_KEY = process.env.VITE_MONGODB_API_KEY;

const app = new Realm.App({ id: APP_ID });

export const handler: Handler = async (event) => {
  try {
    // API Key ile kimlik doğrulama
    const credentials = Realm.Credentials.apiKey(API_KEY);
    const user = await app.logIn(credentials);
    
    const { path, httpMethod: method, body } = event;
    const functionName = path.split('/')[1];

    if (!functionName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Function name is required' })
      };
    }

    switch (method) {
      case 'GET':
        const result = await user.functions[functionName]();
        return {
          statusCode: 200,
          body: JSON.stringify(result)
        };

      case 'POST':
        const data = JSON.parse(body || '{}');
        const response = await user.functions[functionName](data);
        return {
          statusCode: 201,
          body: JSON.stringify(response)
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};