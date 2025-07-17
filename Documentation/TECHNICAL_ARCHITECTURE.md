# Stock Portfolio Tracker - Technical Architecture (Personal Edition)

## System Overview
A privacy-focused, single-user web application for tracking and analyzing personal stock investments, with a focus on simplicity, local data storage, and user-friendly analytics.

---

## Architecture Diagram
```
┌──────────────────────────────┐
│        Frontend (Next.js)    │
│  - React + TypeScript        │
│  - Tailwind CSS              │
│  - Recharts/Chart.js         │
│  - Zustand/local state       │
│  - Local Storage/SQLite      │
└──────────────────────────────┘
```

---

## Data Storage
- **Local Storage**: All portfolio data, transactions, and goals are stored in the browser (IndexedDB/localStorage) for privacy.
- **Optional**: Use SQLite/Prisma for persistent storage if running as a desktop app (e.g., with Electron or Vercel KV for cloud backup).
- **No user authentication or multi-user support required.**

---

## Core Data Models

### StockHolding
- id
- symbol
- name
- exchange
- currency (INR/USD)
- quantity
- averageBuyPrice
- transactions: [Transaction]
- sector (optional)

### Transaction
- id
- holdingId
- type (buy/sell/dividend)
- date
- quantity
- price
- brokerage (optional)

### Goal
- id
- name
- targetAmount
- targetDate
- notes (optional)

---

## Key Components
- **Dashboard**: Portfolio summary, value, returns, and progress toward goals
- **Holdings Table**: List of all stocks/funds with analytics
- **Transaction Manager**: Add/edit/delete transactions
- **Goal Tracker**: Set and monitor financial goals
- **Charts**: Historical value, allocation, and progress
- **Import/Export**: CSV/Excel import/export for data backup

---

## Analytics & Calculations
- **Returns**: XIRR, absolute, and annualized returns
- **Projections**: Estimate future value based on user input
- **Benchmarks**: Compare to Nifty 50, S&P 500, or custom index
- **Allocation**: Pie charts for sector/currency breakdown

---

## Security & Privacy
- **All data is local**: No data leaves your device unless you export it
- **No third-party sharing**: 100% private by design
- **Optional**: Encrypted local storage for sensitive data

---

## User Experience
- **Mobile-first, responsive UI**
- **Simple, intuitive navigation**
- **Accessible design**

---

## What’s Not Included
- No backend server, multi-user, or authentication
- No real-time price streaming (use daily/periodic updates)
- No advanced risk analytics or automation
- No social or sharing features 