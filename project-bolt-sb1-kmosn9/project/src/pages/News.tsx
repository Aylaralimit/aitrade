import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { getFinanceNews, NewsItem } from '../services/newsApi';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TradingView Ticker Tape Widget'ı
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        {
          "proName": "BIST:XU100",
          "title": "BIST 100"
        },
        {
          "proName": "FX_IDC:USDTRY",
          "title": "USD/TRY"
        },
        {
          "proName": "BITSTAMP:BTCUSD",
          "title": "BTC/USD"
        },
        {
          "proName": "BITSTAMP:ETHUSD",
          "title": "ETH/USD"
        },
        {
          "description": "EURO/TRY",
          "proName": "FX_IDC:EURTRY"
        },
        {
          "description": "ALTIN/TRY",
          "proName": "BIST:XAUUSD"
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "light",
      "isTransparent": false,
      "displayMode": "adaptive",
      "locale": "tr"
    });

    const widgetContainer = document.getElementById('tradingview-widget-container');
    if (widgetContainer) {
      const widget = document.createElement('div');
      widget.className = 'tradingview-widget-container__widget';
      widgetContainer.appendChild(widget);
      widgetContainer.appendChild(script);
    }

    return () => {
      const container = document.getElementById('tradingview-widget-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const newsData = await getFinanceNews();
        setNews(newsData);
        setError(null);
      } catch (err) {
        setError('Haberler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Her 5 dakikada bir güncelle

    return () => clearInterval(interval);
  }, []);

  const refreshNews = async () => {
    setLoading(true);
    try {
      const newsData = await getFinanceNews();
      setNews(newsData);
      setError(null);
    } catch (err) {
      setError('Haberler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Hata</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={refreshNews}
              className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Yeniden Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* TradingView Ticker Tape Widget */}
      <div id="tradingview-widget-container" className="mb-8">
        <div className="tradingview-widget-container__widget"></div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Newspaper className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finans Haberleri</h1>
        </div>
        <button
          onClick={refreshNews}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Yenile
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <article
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {item.urlToImage && (
              <img
                src={item.urlToImage}
                alt={item.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(item.publishedAt), 'dd MMMM yyyy HH:mm', { locale: tr })}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {item.title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{item.source.name}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-500"
                >
                  Devamını Oku
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Haber bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default News;