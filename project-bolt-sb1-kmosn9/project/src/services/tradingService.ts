import { db } from '../services/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { getSymbolData } from './marketService';

// Yeni işlem açma
export const openTrade = async (
  userId: string,
  symbol: string,
  type: 'long' | 'short',
  amount: number,
  stopLoss: number,
  takeProfit: number
) => {
  try {
    // Sembol verilerini al
    const marketData = await getSymbolData(symbol);
    if (!marketData) {
      throw new Error('Sembol bulunamadı');
    }

    // Kullanıcı bakiyesini kontrol et
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDocs(query(collection(db, 'users'), where('id', '==', userId)));
    const userData = userDoc.docs[0]?.data();
    
    if (!userData) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const requiredBalance = amount * marketData.price;
    
    if (userData.balance < requiredBalance) {
      throw new Error('Yetersiz bakiye');
    }

    // İşlemi oluştur
    const tradesRef = collection(db, 'trades');
    const trade = {
      userId,
      symbol,
      type,
      amount,
      entryPrice: marketData.price,
      stopLoss,
      takeProfit,
      status: 'open',
      createdAt: new Date()
    };

    await addDoc(tradesRef, trade);

    // Kullanıcı bakiyesini güncelle
    await updateDoc(userRef, {
      balance: userData.balance - requiredBalance
    });

    return trade;
  } catch (error) {
    console.error('İşlem açılırken hata:', error);
    throw error;
  }
};

// İşlem kapatma
export const closeTrade = async (tradeId: string, userId: string) => {
  try {
    const tradeRef = doc(db, 'trades', tradeId);
    const tradeDoc = await getDocs(query(collection(db, 'trades'), where('id', '==', tradeId)));
    const tradeData = tradeDoc.docs[0]?.data();

    if (!tradeData || tradeData.userId !== userId) {
      throw new Error('İşlem bulunamadı');
    }

    // Güncel fiyatı al
    const marketData = await getSymbolData(tradeData.symbol);
    if (!marketData) {
      throw new Error('Piyasa verisi bulunamadı');
    }

    // İşlemi kapat
    await updateDoc(tradeRef, {
      status: 'closed',
      exitPrice: marketData.price,
      closedAt: new Date()
    });

    // Kullanıcı bakiyesini güncelle
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDocs(query(collection(db, 'users'), where('id', '==', userId)));
    const userData = userDoc.docs[0]?.data();

    if (!userData) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const profitLoss = (marketData.price - tradeData.entryPrice) * tradeData.amount * 
      (tradeData.type === 'long' ? 1 : -1);

    await updateDoc(userRef, {
      balance: userData.balance + (tradeData.amount * marketData.price) + profitLoss
    });

    return {
      ...tradeData,
      exitPrice: marketData.price,
      profitLoss
    };
  } catch (error) {
    console.error('İşlem kapatılırken hata:', error);
    throw error;
  }
};

// Kullanıcının açık işlemlerini getir
export const getUserOpenTrades = async (userId: string) => {
  const tradesRef = collection(db, 'trades');
  const q = query(
    tradesRef,
    where('userId', '==', userId),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Kullanıcının işlem geçmişini getir
export const getUserTradeHistory = async (userId: string) => {
  const tradesRef = collection(db, 'trades');
  const q = query(
    tradesRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};