import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  console.log(`🔍 Stock API called for symbol: ${symbol}`);

  if (!symbol) {
    console.log('❌ No symbol provided');
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Construct symbol for Yahoo (add .NS for Indian stocks if needed)
    let yahooSymbol = symbol.toUpperCase();
    
    // Add .NS for Indian stocks if not already present
    const indianStocks = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'LT', 'ASIANPAINT'];
    if (indianStocks.includes(yahooSymbol) && !yahooSymbol.includes('.')) {
      yahooSymbol += '.NS';
    }

    console.log(`🔍 Fetching from Yahoo Finance for: ${yahooSymbol}`);

    // Try multiple Yahoo Finance endpoints
    const endpoints = [
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`,
      `https://query2.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`,
      `https://finance.yahoo.com/quote/${yahooSymbol}`,
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Trying endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
        });

        console.log(`📊 Response status: ${response.status} ${response.statusText}`);

        if (response.ok) {
          const data = await response.json();
          
          // Handle chart API response format
          if (data.chart?.result?.[0]) {
            const result = data.chart.result[0];
            const meta = result.meta;
            
            if (meta?.regularMarketPrice) {
              const stockData = {
                symbol: symbol.toUpperCase(),
                name: meta.longName || meta.shortName || `${symbol.toUpperCase()} Corp`,
                exchange: meta.fullExchangeName || meta.exchangeName || 'Unknown',
                currency: meta.currency || 'USD',
                price: meta.regularMarketPrice,
                sector: meta.sector || 'Unknown',
                marketCap: meta.marketCap || null,
                peRatio: meta.trailingPE || null,
                change: meta.regularMarketChange || 0,
                changePercent: meta.regularMarketChangePercent || 0,
              };

              console.log(`✅ Successfully fetched real data for ${symbol}: $${stockData.price}`);
              return NextResponse.json({ success: true, data: stockData });
            }
          }
        }
      } catch (endpointError) {
        console.log(`❌ Endpoint ${endpoint} failed:`, endpointError);
        continue; // Try next endpoint
      }
    }

    // If all endpoints fail, try a simple HTTP request to a financial data provider
    try {
      console.log(`🔍 Trying alternative data source for ${symbol}...`);
      
      // Use a simple financial API that doesn't require authentication
      const alphaUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${yahooSymbol}&apikey=demo`;
      const alphaResponse = await fetch(alphaUrl, {
        headers: {
          'User-Agent': 'Portfolio-Tracker/1.0',
        }
      });

      if (alphaResponse.ok) {
        const alphaData = await alphaResponse.json();
        const quote = alphaData['Global Quote'];
        
        if (quote && quote['05. price']) {
          const stockData = {
            symbol: symbol.toUpperCase(),
            name: `${symbol.toUpperCase()} Corp`,
            exchange: 'Unknown',
            currency: 'USD',
            price: parseFloat(quote['05. price']),
            sector: 'Unknown',
            marketCap: null,
            peRatio: null,
            change: parseFloat(quote['09. change']) || 0,
            changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
          };

          console.log(`✅ Successfully fetched real data from Alpha Vantage for ${symbol}: $${stockData.price}`);
          return NextResponse.json({ success: true, data: stockData });
        }
      }
    } catch (alphaError) {
      console.log(`❌ Alpha Vantage failed:`, alphaError);
    }

    // If we reach here, all real data sources failed
    console.log(`❌ Failed to fetch real data for ${symbol} from all sources`);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Unable to fetch real-time stock data. Please try again later or check if the symbol is correct.',
        symbol: symbol.toUpperCase()
      },
      { status: 404 }
    );

  } catch (error) {
    console.error(`❌ Error fetching stock data for ${symbol}:`, error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stock data. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 