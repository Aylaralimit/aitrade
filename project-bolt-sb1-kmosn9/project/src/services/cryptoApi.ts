import axios from 'axios';

const COINGECKO_API_KEY = 'CG-7ZEkVd4XNMzchYQ2oLGpsW1V';
const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-cg-demo-api-key': COINGECKO_API_KEY
  }
});

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export const getCryptoPrices = async (vsCurrency = 'try'): Promise<CryptoPrice[]> => {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: vsCurrency,
        order: 'market_cap_desc',
        per_page: 20,
        sparkline: false,
        locale: 'tr'
      }
    });
    return response.data;
  } catch (error) {
    console.error('CoinGecko API error:', error);
    throw new Error('Kripto para verileri alınamadı');
  }
};