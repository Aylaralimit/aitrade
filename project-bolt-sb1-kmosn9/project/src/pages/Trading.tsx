import React, { useState, useEffect } from 'react';
import { LineChart, Wallet, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import TradingBot from '../components/TradingBot';
import { useTradingStore } from '../store/tradingStore';
import UserProfile from '../components/UserProfile';
import AdvancedAnalysis from '../components/AdvancedAnalysis';
import RiskManagement from '../components/RiskManagement';
import { TRADING_INSTRUMENTS } from '../types/trading';
import { useAuthStore } from '../store/authStore';

const Trading: React.FC = () => {
  const { user } = useAuthStore();
  const { positions, executeOrder } = useTradingStore();
  const [selectedSymbol, setSelectedSymbol] = useState('BIST:THYAO');
  const [selectedMarket, setSelectedMarket] = useState<'stocks' | 'crypto' | 'commodities'>('stocks');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      // Subscribe to positions
      const unsubscribe = useTradingStore.getState().subscribeToPositions(user.id);
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          "width": "100%",
          "height": 500,
          "symbol": selectedSymbol,
          "interval": "D",
          "timezone": "Europe/Istanbul",
          "theme": "light",
          "style": "1",
          "locale": "tr",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "container_id": "tradingview-widget"
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [selectedSymbol]);

  const handleTrade = async (type: 'long' | 'short') => {
    try {
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        setError('Geçerli bir işlem miktarı girin');
        return;
      }

      if (!user) {
        setError('Lütfen giriş yapın');
        return;
      }

      await executeOrder(selectedSymbol, amountValue, type, user.id);
      setAmount('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'İşlem gerçekleştirilemedi');
    }
  };

  // Mock data for AdvancedAnalysis
  const mockAnalysisData = {
    rsi: 45,
    macd: {
      value: 0.5,
      signal: 0.3,
      histogram: 0.2
    },
    bollingerBands: {
      upper: 105,
      middle: 100,
      lower: 95
    }
  };

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-trading-pattern bg-cover bg-center opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 space-y-6">
        {/* TradingView Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <LineChart className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Canlı Grafik
              </h2>
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="stocks">Hisseler</option>
                <option value="crypto">Kripto</option>
                <option value="commodities">Emtia</option>
              </select>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {TRADING_INSTRUMENTS[selectedMarket].map(instrument => (
                  <option key={instrument.symbol} value={instrument.symbol}>
                    {instrument.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div id="tradingview-widget"></div>
        </div>

        {/* Trading Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                İşlem Yap
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    İşlem Miktarı (₺)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Miktar girin"
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-600">
                    {error}
                  </div>
                )}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleTrade('long')}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Al
                  </button>
                  <button
                    onClick={() => handleTrade('short')}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Sat
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Açık Pozisyonlar
              </h3>
              {positions.length > 0 ? (
                <div className="space-y-4">
                  {positions.map((position, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {position.symbol}
                          </span>
                          <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                            position.type === 'long'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {position.type === 'long' ? 'UZUN' : 'KISA'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {position.amount} ₺
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Açık pozisyon bulunmuyor
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - User Profile and Risk Management */}
          <div className="space-y-6">
            <UserProfile />
            <RiskManagement 
              balance={user?.balance || 0}
              onSettingsChange={() => {}} 
            />
          </div>

          {/* Center Panel - Trading Bot */}
          <div className="lg:col-span-2">
            <TradingBot />
          </div>
        </div>

        {/* Bottom Panel - Advanced Analysis */}
        <div className="mt-6">
          <AdvancedAnalysis 
            symbol={selectedSymbol}
            data={mockAnalysisData}
          />
        </div>
      </div>
    </div>
  );
};

export default Trading;