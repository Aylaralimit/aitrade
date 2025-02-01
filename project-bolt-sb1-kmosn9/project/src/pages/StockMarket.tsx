import React, { useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const StockMarket = () => {
  useEffect(() => {
    // TradingView Ticker Tape Widget
    const script1 = document.createElement('script');
    script1.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script1.async = true;
    script1.innerHTML = JSON.stringify({
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
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "light",
      "isTransparent": false,
      "displayMode": "adaptive",
      "locale": "tr"
    });
    document.getElementById('tradingview-ticker')?.appendChild(script1);

    // BIST 100 Advanced Chart Widget
    const script2 = document.createElement('script');
    script2.src = "https://s3.tradingview.com/tv.js";
    script2.async = true;
    script2.onload = () => {
      new (window as any).TradingView.widget({
        "width": "100%",
        "height": 500,
        "symbol": "BIST:XU100",
        "interval": "D",
        "timezone": "Europe/Istanbul",
        "theme": "light",
        "style": "1",
        "locale": "tr",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview-widget-xu100"
      });
    };
    document.head.appendChild(script2);

    // Market Overview Widget
    const script3 = document.createElement('script');
    script3.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script3.async = true;
    script3.innerHTML = JSON.stringify({
      "colorTheme": "light",
      "dateRange": "12M",
      "showChart": true,
      "locale": "tr",
      "largeChartUrl": "",
      "isTransparent": false,
      "showSymbolLogo": true,
      "width": "100%",
      "height": "660",
      "plotLineColorGrowing": "rgba(33, 150, 243, 1)",
      "plotLineColorFalling": "rgba(33, 150, 243, 1)",
      "gridLineColor": "rgba(240, 243, 250, 1)",
      "scaleFontColor": "rgba(120, 123, 134, 1)",
      "belowLineFillColorGrowing": "rgba(33, 150, 243, 0.12)",
      "belowLineFillColorFalling": "rgba(33, 150, 243, 0.12)",
      "symbolActiveColor": "rgba(33, 150, 243, 0.12)",
      "tabs": [
        {
          "title": "Endeksler",
          "symbols": [
            {
              "s": "BIST:XU100",
              "d": "BIST 100"
            },
            {
              "s": "BIST:XUSIN",
              "d": "BIST SINAİ"
            },
            {
              "s": "BIST:XBANK",
              "d": "BIST BANKA"
            },
            {
              "s": "BIST:XHOLD",
              "d": "BIST HOLDİNG"
            }
          ]
        },
        {
          "title": "Hisseler",
          "symbols": [
            {
              "s": "BIST:THYAO",
              "d": "THY"
            },
            {
              "s": "BIST:GARAN",
              "d": "GARANTİ BANKASI"
            },
            {
              "s": "BIST:ASELS",
              "d": "ASELSAN"
            },
            {
              "s": "BIST:KCHOL",
              "d": "KOÇ HOLDİNG"
            }
          ]
        }
      ]
    });
    document.getElementById('market-overview')?.appendChild(script3);

    // Screener Widget
    const script4 = document.createElement('script');
    script4.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script4.async = true;
    script4.innerHTML = JSON.stringify({
      "width": "100%",
      "height": 490,
      "defaultColumn": "overview",
      "defaultScreen": "general",
      "market": "turkey",
      "showToolbar": true,
      "colorTheme": "light",
      "locale": "tr",
      "isTransparent": false
    });
    document.getElementById('stock-screener')?.appendChild(script4);

    return () => {
      document.head.removeChild(script2);
      ['tradingview-ticker', 'market-overview', 'stock-screener'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = '';
      });
    };
  }, []);

  return (
    <div className="relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-stock-pattern bg-cover bg-center opacity-[0.02]"></div>

      <div className="relative max-w-7xl mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-8 w-8 text-white mr-3" />
            <h1 className="text-3xl font-bold text-white">Borsa İstanbul</h1>
          </div>
        </div>

        {/* TradingView Widgets */}
        <div id="tradingview-ticker" className="tradingview-widget-container"></div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div id="tradingview-widget-xu100"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div id="market-overview" className="tradingview-widget-container"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div id="stock-screener" className="tradingview-widget-container"></div>
        </div>
      </div>
    </div>
  );
};

export default StockMarket;