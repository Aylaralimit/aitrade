import axios from 'axios';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

// Piyasa verilerini güncelleme servisi
export const updateMarketData = async () => {
  try {
    // BIST verilerini güncelle
    const bistResponse = await axios.get('https://bigpara.hurriyet.com.tr/api/v1/hisse/list');
    const bistData = bistResponse.data.data.map((stock: any) => ({
      symbol: `BIST:${stock.kod}`,
      price: parseFloat(stock.kapanis.replace(',', '.')),
      change_24h: parseFloat(stock.yuzde.replace(',', '.')),
      volume: parseFloat(stock.hacimtl.replace(',', '.')),
      market_cap: parseFloat(stock.piyasaDegeri.replace(',', '.'))
    }));

    // Kripto para verilerini güncelle
    const cryptoResponse = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        sparkline: false,
        locale: 'tr',
        x_cg_demo_api_key: 'CG-7ZEkVd4XNMzchYQ2oLGpsW1V'
      }
    });
    const cryptoData = cryptoResponse.data.map((coin: any) => ({
      symbol: `BINANCE:${coin.symbol.toUpperCase()}USDT`,
      price: coin.current_price,
      change_24h: coin.price_change_percentage_24h,
      volume: coin.total_volume,
      market_cap: coin.market_cap
    }));

    // Verileri Firestore'a kaydet
    const marketDataRef = collection(db, 'market_data');
    const allData = [...bistData, ...cryptoData];
    
    for (const data of allData) {
      await addDoc(marketDataRef, {
        ...data,
        timestamp: new Date()
      });
    }

    return allData;
  } catch (error) {
    console.error('Piyasa verileri güncellenirken hata:', error);
    throw error;
  }
};

// Tüm piyasa verilerini getir
export const getAllMarketData = async () => {
  const marketDataRef = collection(db, 'market_data');
  const q = query(marketDataRef, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Belirli bir sembolün verilerini getir
export const getSymbolData = async (symbol: string) => {
  const marketDataRef = collection(db, 'market_data');
  const q = query(
    marketDataRef,
    where('symbol', '==', symbol),
    orderBy('timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs[0]?.data() || null;
};