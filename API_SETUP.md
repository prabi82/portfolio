# API Setup for Enhanced Stock Data

## Overview

Your portfolio tracker works out of the box with demo data and free APIs. However, you can optionally set up API keys for better coverage and real-time data.

## Supported APIs

### 1. Financial Modeling Prep (Recommended)
- **Coverage**: 70,000+ stocks worldwide, real-time data
- **Free Tier**: 250 requests/day
- **Setup**: 
  1. Visit: https://financialmodelingprep.com/
  2. Sign up for free account
  3. Get your API key from dashboard
  4. Add to `.env.local`: `NEXT_PUBLIC_FMP_API_KEY=your_key_here`

### 2. Alpha Vantage (Fallback)
- **Coverage**: Global stocks, good for fundamental data
- **Free Tier**: 500 requests/day
- **Setup**:
  1. Visit: https://www.alphavantage.co/
  2. Get free API key
  3. Add to `.env.local`: `NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_key_here`

## Environment Variables

Create a `.env.local` file in your project root:

```env
# Optional: Financial Modeling Prep API (Recommended)
NEXT_PUBLIC_FMP_API_KEY=your_fmp_api_key_here

# Optional: Alpha Vantage API (Fallback)
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alphavantage_key_here
```

## Without API Keys

The app works perfectly without any API keys using:

1. **Demo Data**: 20+ popular stocks (AAPL, RELIANCE, TCS, etc.) with realistic prices
2. **Yahoo Finance**: Free unofficial API for additional stock data
3. **Smart Fallbacks**: Automatically generates basic company info for any symbol

## Data Sources Priority

1. **Demo Data** (instant, for popular stocks)
2. **Financial Modeling Prep** (if API key provided)
3. **Yahoo Finance** (free, good coverage)
4. **Alpha Vantage** (if API key provided)
5. **Smart Fallback** (basic info for any symbol)

## Supported Stock Symbols

### Indian Stocks (NSE)
- RELIANCE, TCS, INFY, HDFCBANK, ICICIBANK
- BHARTIARTL, ITC, KOTAKBANK, LT, ASIANPAINT
- Any NSE stock symbol

### US Stocks
- AAPL, MSFT, GOOGL, TSLA, META, NVDA
- AMZN, NFLX, JPM, JNJ
- Any NASDAQ/NYSE symbol

### International Stocks
- Most global stocks supported through APIs
- Use proper exchange suffixes (e.g., RELIANCE.NS for NSE)

## Troubleshooting

### Rate Limits
- Demo data has no limits
- Free APIs have daily request limits
- App automatically falls back to other sources

### Missing Data
- App provides basic fallback info for any symbol
- You can manually edit company details after adding

### Indian Stocks
- Use symbols without .NS suffix (app adds automatically)
- Examples: RELIANCE, TCS, INFY (not RELIANCE.NS)

## Pro Tips

1. **Start Free**: App works great without any API keys
2. **Add FMP Key**: Best overall data quality and coverage
3. **Monitor Usage**: Check API usage in provider dashboards
4. **Mix Sources**: App automatically uses the best available source

Your portfolio tracker is designed to work seamlessly whether you use free data or premium APIs! 