# Stock Portfolio Tracker - Features Documentation (Personal Edition)

## Project Overview
**Application Name**: Stock Portfolio Tracker  
**Tagline**: "Your Personal Investment Dashboard"  
**Description**: A simple, privacy-focused web application for tracking your Indian and international stock investments, reviewing returns, estimating future value, and correlating with your personal financial goals.

---

## Core Features

### 1. Portfolio Overview
- **Dashboard**: Clean summary of total portfolio value, invested amount, and current returns
- **Holdings List**: Table of all stocks/funds with quantity, average buy price, current price, market value, and gain/loss
- **Multi-currency Support**: INR and USD (auto conversion for international holdings)

### 2. Investment Tracking
- **Manual Entry**: Add/edit/delete stocks, quantity, buy price, date, and brokerage
- **Bulk Import**: CSV/Excel import for quick setup
- **Transaction History**: List of all buy/sell transactions for each holding

### 3. Performance & Returns
- **Return Calculations**: XIRR, absolute returns, annualized returns for each holding and the overall portfolio
- **Historical Value Chart**: Simple line chart showing portfolio value over time
- **Dividends Tracking**: (Optional) Add dividend receipts to see total returns

### 4. Future Goals & Projections
- **Goal Setting**: Define future financial goals (e.g., “Buy a house in 5 years”)
- **Projection Tool**: Estimate future portfolio value based on expected return rate and additional investments
- **Goal Progress**: Visual indicator of how close you are to each goal

### 5. Insights & Correlation
- **Benchmark Comparison**: Compare your portfolio’s performance to Nifty 50, S&P 500, or a custom index
- **Simple Analytics**: Asset allocation (pie chart), sector breakdown, and currency exposure
- **Correlation to Goals**: Show if you’re on track for your goals based on current and projected returns

### 6. User Experience
- **Mobile-First Design**: Easy to use on phone and desktop
- **Data Privacy**: All data stored locally or in your private cloud (no third-party sharing)
- **Export/Backup**: Export your data to CSV/Excel for backup

---

## What’s Not Included
- No social/community features
- No real-time price streaming (can use daily closing prices)
- No advanced risk analytics (VaR, Sharpe, etc.)
- No automation, alerts, or AI
- No multi-user or sharing features

---

## Technology Stack (Recommended)
- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **State**: Local storage (or SQLite/Prisma for persistence)
- **Charts**: Recharts or Chart.js
- **No authentication or multi-user features needed**

---

## Summary Table of Features

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| Portfolio Dashboard    | Overview of value, returns, and holdings                                    |
| Manual Entry           | Add/edit/delete stocks and transactions                                     |
| Bulk Import            | Import from CSV/Excel                                                       |
| Performance Analytics  | XIRR, annualized/absolute returns, historical chart                         |
| Goal Tracking          | Set future goals, see progress, estimate future value                       |
| Simple Insights        | Asset allocation, sector/currency breakdown, benchmark comparison           |
| Data Privacy           | Local/private storage, export/backup                                        |
| Mobile Friendly        | Responsive UI for all devices                                               | 