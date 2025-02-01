import React, { useState } from 'react';
import { Shield, DollarSign, Percent, AlertTriangle } from 'lucide-react';

interface RiskManagementProps {
  balance: number;
  onSettingsChange: (settings: {
    stopLoss: number;
    takeProfit: number;
    maxPositionSize: number;
    riskPerTrade: number;
  }) => void;
}

const RiskManagement: React.FC<RiskManagementProps> = ({ balance, onSettingsChange }) => {
  const [settings, setSettings] = useState({
    stopLoss: 2,
    takeProfit: 5,
    maxPositionSize: 20,
    riskPerTrade: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSettings = {
      ...settings,
      [name]: parseFloat(value)
    };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const calculateMaxLoss = () => {
    return (balance * settings.riskPerTrade) / 100;
  };

  const calculatePositionSize = () => {
    return (balance * settings.maxPositionSize) / 100;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Risk Yönetimi
        </h3>
      </div>

      <div className="space-y-6">
        {/* Stop Loss & Take Profit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stop Loss (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="stopLoss"
                value={settings.stopLoss}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                step="0.1"
                min="0.1"
              />
              <Percent className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Position Size & Risk Per Trade */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Maksimum Pozisyon (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="maxPositionSize"
                value={settings.maxPositionSize}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                step="1"
                min="1"
                max="100"
              />
              <Percent className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              İşlem Başına Risk (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="riskPerTrade"
                value={settings.riskPerTrade}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                step="0.1"
                min="0.1"
                max="10"
              />
              <Percent className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 text-blue-600 mr-1" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Maksimum Pozisyon
              </span>
            </div>
            <span className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              ₺{calculatePositionSize().toLocaleString('tr-TR')}
            </span>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-1" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Maksimum Kayıp
              </span>
            </div>
            <span className="text-lg font-semibold text-red-800 dark:text-red-200">
              ₺{calculateMaxLoss().toLocaleString('tr-TR')}
            </span>
          </div>
        </div>

        {/* Risk/Ödül Oranı */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Risk/Ödül Oranı
          </h4>
          <div className="flex items-center">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${(settings.takeProfit / (settings.stopLoss + settings.takeProfit)) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              1:{(settings.takeProfit / settings.stopLoss).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;