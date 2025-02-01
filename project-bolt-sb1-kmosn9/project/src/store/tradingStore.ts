import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Position, RiskLevel, BotStats, TRADING_INSTRUMENTS } from '../types/trading';
import { db } from '../services/firebase';
import { doc, getDoc, writeBatch, collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';

interface TradingStore {
  positions: Position[];
  botActive: boolean;
  riskLevel: RiskLevel;
  botSettings: {
    stopLoss: number;
    takeProfit: number;
    tradeAmount: number;
  };
  botStats: BotStats;
  toggleBot: () => void;
  setRiskLevel: (level: RiskLevel) => void;
  setBotSettings: (settings: any) => void;
  executeOrder: (symbol: string, amount: number, type: 'long' | 'short', userId: string) => Promise<void>;
  executeBotTrade: (userId: string) => Promise<void>;
  closePosition: (positionId: string, userId: string) => Promise<void>;
  subscribeToPositions: (userId: string) => () => void;
  setPositions: (positions: Position[]) => void;
}

const store = (set, get) => ({
  positions: [],
  botActive: false,
  riskLevel: 'Moderate',
  botSettings: {
    stopLoss: 2,
    takeProfit: 5,
    tradeAmount: 1000
  },
  botStats: {
    totalTrades: 0,
    successRate: 92,
    profit: 0,
    dailyTrades: 0,
    winningTrades: 0,
    losingTrades: 0
  },

  toggleBot: () => set((state) => ({ botActive: !state.botActive })),
  setRiskLevel: (level) => set({ riskLevel: level }),
  setBotSettings: (settings) => set({ botSettings: settings }),
  setPositions: (positions) => set({ positions }),

  executeOrder: async (symbol: string, amount: number, type: 'long' | 'short', userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('Kullanıcı bulunamadı');
      }

      const userData = userSnap.data();
      if (userData.balance < amount) {
        throw new Error('Yetersiz bakiye');
      }

      const positionData = {
        userId,
        symbol,
        amount,
        entryPrice: 100 + Math.random() * 10,
        currentPrice: 100 + Math.random() * 10,
        stopLoss: 95,
        takeProfit: 105,
        type,
        status: 'open',
        market: 'stocks',
        createdAt: new Date()
      };

      const positionRef = await addDoc(collection(db, 'positions'), positionData);

      const batch = writeBatch(db);
      batch.update(userRef, {
        balance: userData.balance - amount
      });

      await batch.commit();

      set(state => ({
        positions: [...state.positions, { ...positionData, id: positionRef.id }],
        botStats: {
          ...state.botStats,
          totalTrades: state.botStats.totalTrades + 1,
          dailyTrades: state.botStats.dailyTrades + 1
        }
      }));
    } catch (error) {
      console.error('Execute order error:', error);
      throw error;
    }
  },

  closePosition: async (positionId: string, userId: string) => {
    try {
      const positionRef = doc(db, 'positions', positionId);
      const positionSnap = await getDoc(positionRef);
      
      if (!positionSnap.exists()) {
        throw new Error('Pozisyon bulunamadı');
      }

      const position = positionSnap.data() as Position;
      const successChance = Math.random();
      const profitMultiplier = successChance > 0.15 ? 1.05 : 0.98;
      const exitPrice = position.entryPrice * profitMultiplier;
      const profitLoss = (exitPrice - position.entryPrice) * position.amount * 
        (position.type === 'long' ? 1 : -1);

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('Kullanıcı bulunamadı');
      }

      const userData = userSnap.data();
      const batch = writeBatch(db);

      batch.update(positionRef, {
        status: 'closed',
        exitPrice,
        profitLoss,
        closedAt: new Date()
      });

      batch.update(userRef, {
        balance: userData.balance + position.amount + profitLoss
      });

      await batch.commit();

      set(state => {
        const newWinningTrades = profitLoss > 0 ? state.botStats.winningTrades + 1 : state.botStats.winningTrades;
        const newLosingTrades = profitLoss < 0 ? state.botStats.losingTrades + 1 : state.botStats.losingTrades;
        const totalTrades = newWinningTrades + newLosingTrades;
        
        const baseSuccessRate = (newWinningTrades / (totalTrades || 1)) * 100;
        const successRate = Math.max(85, Math.min(95, baseSuccessRate));

        return {
          positions: state.positions.filter(p => p.id !== positionId),
          botStats: {
            ...state.botStats,
            profit: state.botStats.profit + profitLoss,
            winningTrades: newWinningTrades,
            losingTrades: newLosingTrades,
            successRate
          }
        };
      });
    } catch (error) {
      console.error('Close position error:', error);
      throw error;
    }
  },

  executeBotTrade: async (userId: string) => {
    const state = get();
    if (!state.botActive) return;

    const instruments = Object.values(TRADING_INSTRUMENTS).flat();
    const randomInstrument = instruments[Math.floor(Math.random() * instruments.length)];
    const type = Math.random() > 0.5 ? 'long' : 'short';

    try {
      await state.executeOrder(
        randomInstrument.symbol,
        state.botSettings.tradeAmount,
        type,
        userId
      );
    } catch (error) {
      console.error('Bot trade error:', error);
    }
  },

  subscribeToPositions: (userId: string) => {
    const q = query(
      collection(db, 'positions'),
      where('userId', '==', userId),
      where('status', '==', 'open')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const positions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Position[];
      
      set({ positions });
    });

    return unsubscribe;
  }
});

export const useTradingStore = create<TradingStore>()(
  persist(
    store,
    {
      name: 'trading-store',
      version: 1
    }
  )
);