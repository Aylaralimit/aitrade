import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import axios from 'axios';

interface BistStock {
  kod: string;
  ad: string;
  kapanis: number;
  dunkuKapanis: number;
  yuzde: number;
  hacimtl: number;
  piyasaDegeri: number;
}

const BistMarkets = () => {
  const [stocks, setStocks] = useState<BistStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('https://bigpara.hurriyet.com.tr/api/v1/hisse/list');
        setStocks(response.data.data.map((stock: any) => ({
          kod: stock.kod,
          ad: stock.ad,
          kapanis: parseFloat(stock.kapanis.replace(',', '.')),
          dunkuKapanis: parseFloat(stock.dunkuKapanis.replace(',', '.')),
          yuzde: parseFloat(stock.yuzde.replace(',', '.')),
          hacimtl: parseFloat(stock.hacimtl.replace(',', '.')),
          piyasaDegeri: parseFloat(stock.piyasaDegeri.replace(',', '.'))
        })));
        setError(null);
      } catch (err) {
        setError('BIST verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
        console.error('BigPara API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 60000); // Her 1 dakikada bir güncelle

    return () => clearInterval(interval);
  }, []);

  const filteredStocks = stocks.filter(stock =>
    stock.kod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.ad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Hisse senedi ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Şirket Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son Fiyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Değişim %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hacim (TL)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Piyasa Değeri
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStocks.map((stock) => (
              <tr key={stock.kod} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white">{stock.kod}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900 dark:text-white">{stock.ad}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-900 dark:text-white">
                    ₺{stock.kapanis.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${
                    stock.yuzde >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {stock.yuzde >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stock.yuzde).toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                  ₺{(stock.hacimtl / 1000000).toFixed(2)}M
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                  ₺{(stock.piyasaDegeri / 1000000).toFixed(2)}M
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BistMarkets;