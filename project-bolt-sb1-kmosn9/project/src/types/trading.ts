export interface Position {
  id?: string;
  userId: string;
  symbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number;
  takeProfit: number;
  type: 'long' | 'short';
  status: 'open' | 'closed';
  market: 'stocks' | 'crypto' | 'commodities';
  createdAt?: Date;
  closedAt?: Date;
  exitPrice?: number;
  profitLoss?: number;
}

export type RiskLevel = 'Conservative' | 'Moderate' | 'Aggressive';

export interface BotStats {
  totalTrades: number;
  successRate: number;
  profit: number;
  dailyTrades: number;
  winningTrades: number;
  losingTrades: number;
}

// BIST30 hisseleri
const BIST30_STOCKS = [
  { symbol: 'BIST:THYAO', label: 'Türk Hava Yolları' },
  { symbol: 'BIST:GARAN', label: 'Garanti Bankası' },
  { symbol: 'BIST:ASELS', label: 'Aselsan' },
  { symbol: 'BIST:KRDMD', label: 'Kardemir' },
  { symbol: 'BIST:EREGL', label: 'Ereğli Demir Çelik' },
  { symbol: 'BIST:AKBNK', label: 'Akbank' },
  { symbol: 'BIST:YKBNK', label: 'Yapı Kredi' },
  { symbol: 'BIST:HALKB', label: 'Halkbank' },
  { symbol: 'BIST:VAKBN', label: 'Vakıfbank' },
  { symbol: 'BIST:SAHOL', label: 'Sabancı Holding' },
  { symbol: 'BIST:KCHOL', label: 'Koç Holding' },
  { symbol: 'BIST:PGSUS', label: 'Pegasus' },
  { symbol: 'BIST:BIMAS', label: 'BİM' },
  { symbol: 'BIST:TUPRS', label: 'Tüpraş' },
  { symbol: 'BIST:SISE', label: 'Şişe Cam' },
  { symbol: 'BIST:TAVHL', label: 'TAV Holding' },
  { symbol: 'BIST:TKFEN', label: 'Tekfen Holding' },
  { symbol: 'BIST:TOASO', label: 'Tofaş Oto' },
  { symbol: 'BIST:TCELL', label: 'Turkcell' },
  { symbol: 'BIST:TTKOM', label: 'Türk Telekom' },
  { symbol: 'BIST:DOHOL', label: 'Doğan Holding' },
  { symbol: 'BIST:EKGYO', label: 'Emlak Konut' },
  { symbol: 'BIST:FROTO', label: 'Ford Otosan' },
  { symbol: 'BIST:KOZAL', label: 'Koza Altın' },
  { symbol: 'BIST:KOZAA', label: 'Koza Madencilik' },
  { symbol: 'BIST:PETKM', label: 'Petkim' },
  { symbol: 'BIST:SODA', label: 'Soda Sanayii' },
  { symbol: 'BIST:VESTL', label: 'Vestel' },
  { symbol: 'BIST:ISDMR', label: 'İskenderun Demir' },
  { symbol: 'BIST:OYAKC', label: 'OYAK Çimento' }
];

// Top 30 Kripto Paralar
const TOP30_CRYPTO = [
  { symbol: 'BINANCE:BTCUSDT', label: 'Bitcoin' },
  { symbol: 'BINANCE:ETHUSDT', label: 'Ethereum' },
  { symbol: 'BINANCE:BNBUSDT', label: 'Binance Coin' },
  { symbol: 'BINANCE:XRPUSDT', label: 'Ripple' },
  { symbol: 'BINANCE:ADAUSDT', label: 'Cardano' },
  { symbol: 'BINANCE:DOGEUSDT', label: 'Dogecoin' },
  { symbol: 'BINANCE:SOLUSDT', label: 'Solana' },
  { symbol: 'BINANCE:DOTUSDT', label: 'Polkadot' },
  { symbol: 'BINANCE:MATICUSDT', label: 'Polygon' },
  { symbol: 'BINANCE:LTCUSDT', label: 'Litecoin' },
  { symbol: 'BINANCE:AVAXUSDT', label: 'Avalanche' },
  { symbol: 'BINANCE:LINKUSDT', label: 'Chainlink' },
  { symbol: 'BINANCE:UNIUSDT', label: 'Uniswap' },
  { symbol: 'BINANCE:ATOMUSDT', label: 'Cosmos' },
  { symbol: 'BINANCE:ETCUSDT', label: 'Ethereum Classic' },
  { symbol: 'BINANCE:XLMUSDT', label: 'Stellar' },
  { symbol: 'BINANCE:VETUSDT', label: 'VeChain' },
  { symbol: 'BINANCE:ICPUSDT', label: 'Internet Computer' },
  { symbol: 'BINANCE:FILUSDT', label: 'Filecoin' },
  { symbol: 'BINANCE:AAVEUSDT', label: 'Aave' },
  { symbol: 'BINANCE:ALGOUSDT', label: 'Algorand' },
  { symbol: 'BINANCE:XTZUSDT', label: 'Tezos' },
  { symbol: 'BINANCE:AXSUSDT', label: 'Axie Infinity' },
  { symbol: 'BINANCE:SANDUSDT', label: 'The Sandbox' },
  { symbol: 'BINANCE:MANAUSDT', label: 'Decentraland' },
  { symbol: 'BINANCE:THETAUSDT', label: 'Theta Network' },
  { symbol: 'BINANCE:FTMUSDT', label: 'Fantom' },
  { symbol: 'BINANCE:HBARUSDT', label: 'Hedera' },
  { symbol: 'BINANCE:NEARUSDT', label: 'NEAR Protocol' },
  { symbol: 'BINANCE:RUNEUSDT', label: 'THORChain' }
];

// Emtialar
const COMMODITIES = [
  { symbol: 'TVC:GOLD', label: 'Altın' },
  { symbol: 'TVC:SILVER', label: 'Gümüş' },
  { symbol: 'NYMEX:CL1!', label: 'Ham Petrol' },
  { symbol: 'TVC:USOIL', label: 'Brent Petrol' },
  { symbol: 'TVC:COPPER', label: 'Bakır' },
  { symbol: 'TVC:PLATINUM', label: 'Platin' },
  { symbol: 'TVC:PALLADIUM', label: 'Paladyum' },
  { symbol: 'NYMEX:NG1!', label: 'Doğal Gaz' },
  { symbol: 'NYMEX:ZC1!', label: 'Mısır' },
  { symbol: 'NYMEX:ZW1!', label: 'Buğday' }
];

export const TRADING_INSTRUMENTS = {
  stocks: BIST30_STOCKS,
  crypto: TOP30_CRYPTO,
  commodities: COMMODITIES
};