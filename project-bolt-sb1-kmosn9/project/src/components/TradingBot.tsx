import React, { useEffect, useState } from 'react';
import { Bot, TrendingUp, TrendingDown, Target, Shield, Zap, AlertTriangle, Settings, BarChart2, Clock, Percent } from 'lucide-react';
import { useTradingStore } from '../store/tradingStore';
import { useAuthStore } from '../store/authStore';

const TradingBot = () => {
  const { user } = useAuthStore();
  const { 
    botActive, 
    riskLevel, 
    botStats, 
    botSettings,
    toggleBot, 
    setRiskLevel, 
    setBotSettings,
    executeBotTrade
  } = useTradingStore();

  const [settings, setSettings] = useState({
    stopLoss: botSettings.stopLoss,
    takeProfit: botSettings.takeProfit,
    tradeAmount: botSettings.tradeAmount
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const [tradeCount, setTradeCount] = useState(0);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const applySettings = () => {
    setBotSettings(settings);
    setLastAction('Ayarlar güncellendi! Bot yeni parametrelerle çalışmaya devam edecek.');
    setTimeout(() => setLastAction(''), 3000);
  };

  useEffect(() => {
    let tradeInterval: NodeJS.Timeout;
    
    if (botActive && user) {
      // Her 5-10 saniyede bir işlem yap
      tradeInterval = setInterval(() => {
        setIsProcessing(true);
        executeBotTrade(user.id);
        setTradeCount(prev => prev + 1);
        setTimeout(() => setIsProcessing(false), 1000);
      }, Math.random() * 5000 + 5000);
    }

    return () => {
      if (tradeInterval) clearInterval(tradeInterval);
    };
  }, [botActive, user, executeBotTrade]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
      <div className="relative">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
          <Bot className="h-5 w-5 mr-2" />
          Yapay Zeka Trading Botu
        </h2>
        
        {/* Bot Status */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-600 dark:text-gray-300">Durum</span>
          <div className="flex items-center">
            {isProcessing && (
              <span className="animate-pulse mr-2 text-blue-500">
                İşlem yapılıyor...
              </span>
            )}
            <span className={`px-3 py-1 text-sm rounded-full ${
              botActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {botActive ? 'Aktif' : 'Pasif'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <BarChart2 className="h-5 w-5 opacity-80" />
              <span className="text-xs opacity-80">Toplam İşlem</span>
            </div>
            <div className="text-2xl font-bold mt-2">{botStats.totalTrades}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <Target className="h-5 w-5 opacity-80" />
              <span className="text-xs opacity-80">Başarı Oranı</span>
            </div>
            <div className="text-2xl font-bold mt-2">%{botStats.successRate}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 opacity-80" />
              <span className="text-xs opacity-80">Toplam Kar</span>
            </div>
            <div className="text-2xl font-bold mt-2">₺{botStats.profit.toLocaleString('tr-TR')}</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 opacity-80" />
              <span className="text-xs opacity-80">Günlük İşlem</span>
            </div>
            <div className="text-2xl font-bold mt-2">{botStats.dailyTrades}</div>
          </div>
        </div>

        {/* Bot Settings */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bot Ayarları</h3>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stop Loss (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="stopLoss"
                  value={settings.stopLoss}
                  onChange={handleSettingsChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  step="0.1"
                  min="0.1"
                />
                <Percent className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Take Profit (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="takeProfit"
                  value={settings.takeProfit}
                  onChange={handleSettingsChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  step="0.1"
                  min="0.1"
                />
                <Percent className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                İşlem Miktarı (₺)
              </label>
              <input
                type="number"
                name="tradeAmount"
                value={settings.tradeAmount}
                onChange={handleSettingsChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                step="100"
                min="100"
              />
            </div>
          </div>

          <button
            onClick={applySettings}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ayarları Kaydet
          </button>

          {lastAction && (
            <div className="text-sm text-green-600 text-center animate-fade-in">
              {lastAction}
            </div>
          )}
        </div>

        {/* Risk Level */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Risk Seviyesi
          </label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value as any)}
          >
            <option value="Conservative">Muhafazakar</option>
            <option value="Moderate">Orta</option>
            <option value="Aggressive">Agresif</option>
          </select>
        </div>

        {/* Bot Control Button */}
        <button
          onClick={toggleBot}
          className={`w-full px-4 py-3 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            botActive
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          }`}
        >
          {botActive ? (
            <>
              <TrendingDown className="h-4 w-4 inline mr-1" /> Botu Durdur
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 inline mr-1" /> Botu Başlat
            </>
          )}
        </button>

        {botActive && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            Bot aktif çalışıyor - Toplam {tradeCount} işlem gerçekleştirildi
          </div>
        )}

        {/* Warning Card */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Geçmiş performans gelecekteki sonuçların garantisi değildir. Trading botu kullanırken risk yönetimi stratejilerinizi dikkatli belirleyin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradingBot;