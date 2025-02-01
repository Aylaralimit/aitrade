import React from 'react';
import BistMarkets from '../components/BistMarkets';
import CryptoMarkets from '../components/CryptoMarkets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LineChart, TrendingUp } from 'lucide-react';

const Markets = () => {
  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-market-pattern bg-cover bg-center opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 mb-8 shadow-lg">
          <div className="flex items-center mb-4">
            <LineChart className="h-8 w-8 text-white mr-3" />
            <h1 className="text-3xl font-bold text-white">Piyasalar</h1>
          </div>
          <p className="text-blue-100 max-w-2xl">
            Canlı piyasa verilerini takip edin, fiyat hareketlerini analiz edin ve yatırım fırsatlarını değerlendirin.
          </p>
        </div>
        
        <Tabs defaultValue="bist" className="w-full">
          <TabsList className="mb-8 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg">
            <TabsTrigger value="bist" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              BIST Hisseleri
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center">
              <LineChart className="h-4 w-4 mr-2" />
              Kripto Paralar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bist">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 backdrop-blur-lg bg-opacity-95">
              <BistMarkets />
            </div>
          </TabsContent>
          
          <TabsContent value="crypto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 backdrop-blur-lg bg-opacity-95">
              <CryptoMarkets />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Markets;