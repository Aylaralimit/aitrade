import React, { useState } from 'react';
import { LineChart, BarChart2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface AnalysisProps {
  symbol: string;
  data: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
}

const AdvancedAnalysis: React.FC<AnalysisProps> = ({ symbol, data }) => {
  const [activeTab, setActiveTab] = useState<'technical' | 'signals'>('technical');

  const getTrendSignal = () => {
    const { rsi, macd, bollingerBands } = data;
    let bullishSignals = 0;
    let bearishSignals = 0;

    // RSI Analizi
    if (rsi > 70) bearishSignals++;
    else if (rsi < 30) bullishSignals++;

    // MACD Analizi
    if (macd.value > macd.signal) bullishSignals++;
    else if (macd.value < macd.signal) bearishSignals++;

    // Bollinger Bantları Analizi
    const currentPrice = bollingerBands.middle;
    if (currentPrice < bollingerBands.lower) bullishSignals++;
    else if (currentPrice > bollingerBands.upper) bearishSignals++;

    return {
      trend: bullishSignals > bearishSignals ? 'bullish' : 'bearish',
      strength: Math.max(bullishSignals, bearishSignals) / 3 * 100
    };
  };

  const signal = getTrendSignal();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Gelişmiş Analiz
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('technical')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === 'technical'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Teknik Göstergeler
          </button>
          <button
            onClick={() => setActiveTab('signals')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === 'signals'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sinyaller
          </button>
        </div>
      </div>

      {activeTab === 'technical' ? (
        <div className="space-y-6">
          {/* RSI */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">RSI</span>
              <span className={`text-sm font-medium ${
                data.rsi > 70 ? 'text-red-600'
                : data.rsi < 30 ? 'text-green-600'
                : 'text-gray-600'
              }`}>
                {data.rsi.toFixed(2)}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full ${
                  data.rsi > 70 ? 'bg-red-500'
                  : data.rsi < 30 ? 'bg-green-500'
                  : 'bg-blue-500'
                }`}
                style={{ width: `${data.rsi}%` }}
              ></div>
            </div>
          </div>

          {/* MACD */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">MACD</span>
              <span className={`text-sm font-medium ${
                data.macd.value > data.macd.signal ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.macd.value.toFixed(2)}
              </span>
            </div>
            <div className="flex space-x-2">
              <div className="h-4 bg-blue-100 rounded flex-1">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${Math.abs(data.macd.histogram) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Bollinger Bands */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Bollinger Bantları
            </span>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Alt: {data.bollingerBands.lower.toFixed(2)}</span>
              <span>Orta: {data.bollingerBands.middle.toFixed(2)}</span>
              <span>Üst: {data.bollingerBands.upper.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Trend Sinyali */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              {signal.trend === 'bullish' ? (
                <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-500 mr-2" />
              )}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {signal.trend === 'bullish' ? 'Yükseliş' : 'Düşüş'} Trendi
                </h4>
                <p className="text-sm text-gray-500">
                  Sinyal Gücü: {signal.strength.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Risk Seviyesi */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Risk Değerlendirmesi
                </h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
                  Volatilite: {data.rsi > 50 ? 'Yüksek' : 'Orta'}
                  <br />
                  Önerilen Stop Loss: %2
                  <br />
                  Önerilen Take Profit: %5
                </p>
              </div>
            </div>
          </div>

          {/* İşlem Önerileri */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              İşlem Önerileri
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {signal.trend === 'bullish'
                  ? 'Kademeli alım stratejisi uygulayın'
                  : 'Kar realizasyonu yapın'}
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {data.rsi > 70 || data.rsi < 30
                  ? 'Aşırı alım/satım bölgesinde dikkatli olun'
                  : 'Normal işlem hacminde devam edin'}
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Pozisyon büyüklüğünü portföyün %{Math.min(signal.strength / 2, 20).toFixed(0)}'si ile sınırlayın
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalysis;