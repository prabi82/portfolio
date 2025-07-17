# CORS Solution for Stock API

## Issue
Browser security prevents direct API calls to external stock APIs due to Cross-Origin Resource Sharing (CORS) restrictions.

## Current Solution
✅ **CORS Proxy**: Using `api.allorigins.win` as a proxy service
- Pros: Works immediately, no backend needed
- Cons: Dependent on third-party service, slower response times

## Alternative Solutions

### 1. **Next.js API Routes** (Recommended for Production)
Create backend endpoints that fetch data server-side:

```javascript
// pages/api/stock/[symbol].js
export default async function handler(req, res) {
  const { symbol } = req.query;
  
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
}
```

### 2. **Environment-based API Keys**
For production apps, get proper API keys:

```bash
# .env.local
NEXT_PUBLIC_FMP_API_KEY=your_fmp_api_key_here
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

### 3. **Fallback Strategy** (Current Implementation)
- Try Yahoo Finance via CORS proxy
- Try FMP API via CORS proxy  
- Fall back to demo data for popular stocks
- Create basic structure for manual entry

## Current Behavior
1. **Popular stocks** (AAPL, META, RELIANCE, etc.): Uses demo data with realistic prices
2. **Other stocks**: Creates basic structure for manual entry
3. **Real-time updates**: "Refresh Prices" button attempts API calls

## For Development
The current implementation should work for testing. For production deployment, implement Next.js API routes.

## Testing
Try these symbols:
- **US Stocks**: AAPL, META, GOOGL, TSLA, MSFT
- **Indian Stocks**: RELIANCE, TCS, INFY, HDFCBANK
- **Unknown stocks**: Creates placeholder for manual entry 