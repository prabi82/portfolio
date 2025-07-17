export interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  sector?: string;
}

export interface StockSearchResult {
  success: boolean;
  data?: StockData;
  error?: string;
}

// Multiple free APIs for comprehensive coverage
const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY || 'demo';
// Removed: const ALPHA_VANTAGE_API_KEY (not used due to CORS issues)

// For Indian stocks, we'll use NSE/BSE prefixes
const getExchangeFromSymbol = (symbol: string): string => {
  // Common Indian stock patterns
  if (symbol.includes('.NS') || symbol.includes('.BO')) {
    return symbol.includes('.NS') ? 'NSE' : 'BSE';
  }
  // Common Indian stocks without suffix
  const indianStocks = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'LT', 'ASIANPAINT'];
  if (indianStocks.includes(symbol.toUpperCase())) {
    return 'NSE';
  }
  // US stocks by default
  return 'NASDAQ';
};

const getCurrencyFromExchange = (exchange: string): string => {
  return ['NSE', 'BSE'].includes(exchange) ? 'INR' : 'USD';
};

// Expanded demo data for popular stocks
const getDemoStockData = (symbol: string): StockData | null => {
  const demoData: Record<string, Partial<StockData>> = {
    // Indian Stocks
    'RELIANCE': { name: 'Reliance Industries Limited', exchange: 'NSE', sector: 'Energy', price: 2500 },
    'TCS': { name: 'Tata Consultancy Services', exchange: 'NSE', sector: 'Technology', price: 3500 },
    'INFY': { name: 'Infosys Limited', exchange: 'NSE', sector: 'Technology', price: 1400 },
    'HDFCBANK': { name: 'HDFC Bank Limited', exchange: 'NSE', sector: 'Banking', price: 1600 },
    'ICICIBANK': { name: 'ICICI Bank Limited', exchange: 'NSE', sector: 'Banking', price: 1200 },
    'BHARTIARTL': { name: 'Bharti Airtel Limited', exchange: 'NSE', sector: 'Telecommunications', price: 1300 },
    'ITC': { name: 'ITC Limited', exchange: 'NSE', sector: 'Consumer Goods', price: 450 },
    'KOTAKBANK': { name: 'Kotak Mahindra Bank', exchange: 'NSE', sector: 'Banking', price: 1800 },
    'LT': { name: 'Larsen & Toubro Limited', exchange: 'NSE', sector: 'Construction', price: 3600 },
    'ASIANPAINT': { name: 'Asian Paints Limited', exchange: 'NSE', sector: 'Chemicals', price: 3200 },
    
    // US Stocks
    'AAPL': { name: 'Apple Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 190 },
    'MSFT': { name: 'Microsoft Corporation', exchange: 'NASDAQ', sector: 'Technology', price: 420 },
    'GOOGL': { name: 'Alphabet Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 165 },
    'TSLA': { name: 'Tesla, Inc.', exchange: 'NASDAQ', sector: 'Automotive', price: 220 },
    'META': { name: 'Meta Platforms, Inc.', exchange: 'NASDAQ', sector: 'Technology', price: 370 },
    'NVDA': { name: 'NVIDIA Corporation', exchange: 'NASDAQ', sector: 'Technology', price: 550 },
    'AMZN': { name: 'Amazon.com Inc.', exchange: 'NASDAQ', sector: 'Consumer Discretionary', price: 155 },
    'NFLX': { name: 'Netflix Inc.', exchange: 'NASDAQ', sector: 'Communication Services', price: 680 },
    'JPM': { name: 'JPMorgan Chase & Co.', exchange: 'NYSE', sector: 'Banking', price: 210 },
    'JNJ': { name: 'Johnson & Johnson', exchange: 'NYSE', sector: 'Healthcare', price: 160 },
  };

  const data = demoData[symbol.toUpperCase()];
  if (data) {
    const exchange = data.exchange || getExchangeFromSymbol(symbol);
    return {
      symbol: symbol.toUpperCase(),
      name: data.name || `${symbol} Company`,
      exchange,
      currency: getCurrencyFromExchange(exchange),
      price: data.price || 100, // Use clean demo price without random variation
      sector: data.sector || 'Unknown',
    };
  }
  return null;
};

// Try Financial Modeling Prep API (requires API key)
const tryFMPAPI = async (symbol: string): Promise<StockData | null> => {
  try {
    // Skip if no valid API key
    if (!FMP_API_KEY || FMP_API_KEY === 'demo' || FMP_API_KEY.length < 10) {
      console.log('FMP API: No valid API key, skipping');
      return null;
    }

    // Use quote endpoint for real-time price with CORS proxy
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const fmpUrl = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`;
    
    const quoteResponse = await fetch(
      `${corsProxy}${encodeURIComponent(fmpUrl)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!quoteResponse.ok) {
      throw new Error(`FMP Quote request failed: ${quoteResponse.status}`);
    }
    
    const quoteData = await quoteResponse.json();
    
    if (quoteData && quoteData.length > 0) {
      const quote = quoteData[0];
      
      // Get additional company info if needed
      if (quote.symbol && quote.price > 0) {
        return {
          symbol: quote.symbol || symbol.toUpperCase(),
          name: quote.name || `${symbol} Company`,
          exchange: quote.exchange || getExchangeFromSymbol(symbol),
          currency: getCurrencyFromExchange(quote.exchange || getExchangeFromSymbol(symbol)),
          price: quote.price || 0,
          sector: 'Unknown', // FMP quote doesn't include sector
        };
      }
    }
  } catch (error) {
    console.log(`FMP API error for ${symbol}:`, error);
  }
  return null;
};

// Removed: trySimpleStockAPI (not needed - using Next.js API route instead)

// Use our Next.js API route to fetch stock data (no CORS issues!)
const tryYahooFinance = async (symbol: string): Promise<StockData | null> => {
  try {
    console.log(`📊 Fetching real-time data for ${symbol} via backend API...`);
    
    // Call our own API route (no CORS issues)
    const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.log(`❌ API returned ${response.status} for ${symbol}`);
      return null;
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      const data = result.data;
      console.log(`✅ Successfully fetched ${symbol}: $${data.price} (real-time)`);
      
      return {
        symbol: data.symbol,
        name: data.name,
        exchange: data.exchange,
        currency: data.currency,
        price: data.price,
        sector: data.sector,
      };
    } else {
      console.log(`❌ No data returned for ${symbol}:`, result.error);
      return null;
    }
    
  } catch (error) {
    console.log(`❌ Backend API error for ${symbol}:`, error);
    return null;
  }
};

// Note: Alpha Vantage removed due to CORS restrictions
// You can implement this in a backend API route if needed

export const searchStock = async (symbol: string): Promise<StockSearchResult> => {
  if (!symbol || symbol.length < 1) {
    return { success: false, error: 'Symbol is required' };
  }

  console.log(`🔍 Searching for ${symbol}...`);
  
  // IMPORTANT: Always try real APIs first for accurate pricing
  // Only use demo data as last resort
  
  // 1. Try Yahoo Finance (most reliable free API)
  console.log(`📊 Attempting real-time data for ${symbol}...`);
  try {
    const stockData = await tryYahooFinance(symbol);
    if (stockData && stockData.price > 0) {
      console.log(`✅ Found ${symbol} via Yahoo Finance: $${stockData.price}`);
      return { success: true, data: stockData };
    }
  } catch (error) {
    console.log(`❌ Yahoo Finance failed for ${symbol}:`, error);
  }

  // 2. Try Financial Modeling Prep (if API key available)
  try {
    const stockData = await tryFMPAPI(symbol);
    if (stockData && stockData.price > 0) {
      console.log(`✅ Found ${symbol} via FMP API: $${stockData.price}`);
      return { success: true, data: stockData };
    }
  } catch (error) {
    console.log(`❌ FMP API failed for ${symbol}:`, error);
  }

  // If all real data sources fail, return error (no demo/fake data)
  console.log(`❌ Failed to fetch real data for ${symbol} from all sources`);
  return { 
    success: false, 
    error: `Unable to fetch real-time stock data for "${symbol}". Please verify the symbol is correct and try again later.` 
  };
};

// Alternative free APIs you can use:
// 1. Financial Modeling Prep: https://financialmodelingprep.com/developer/docs
// 2. Yahoo Finance (unofficial): https://query1.finance.yahoo.com/v1/finance/search?q=SYMBOL
// 3. Polygon.io: https://polygon.io/docs/stocks/get_v3_reference_tickers__ticker
// 4. IEX Cloud: https://iexcloud.io/docs/api/ 