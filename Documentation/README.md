# Stock Portfolio Tracker (Personal Edition) 📈

**Your Private, Personal Investment Dashboard**

A simple, privacy-focused web app for tracking your Indian and international stock investments, reviewing returns, estimating future value, and correlating with your personal financial goals.

---

## ✨ Features
- **Portfolio Dashboard**: Overview of value, returns, and holdings
- **Manual Entry**: Add/edit/delete stocks and transactions
- **Bulk Import**: Import from CSV/Excel
- **Performance Analytics**: XIRR, annualized/absolute returns, historical chart
- **Goal Tracking**: Set future goals, see progress, estimate future value
- **Simple Insights**: Asset allocation, sector/currency breakdown, benchmark comparison
- **Data Privacy**: All data stored locally (browser or SQLite), export/backup available
- **Mobile Friendly**: Responsive UI for all devices

---

## 🛠️ Technology Stack
- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **State**: Local storage (browser) or SQLite/Prisma (optional)
- **Charts**: Recharts or Chart.js
- **No backend, authentication, or multi-user features**

---

## 🚀 Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/stock-portfolio-tracker.git
   cd stock-portfolio-tracker
   ```
2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Run the App**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open in Browser**
   Go to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure
```
stock-portfolio-tracker/
├── app/                # Next.js App Router
├── components/         # UI components
├── lib/                # Utility libraries
├── hooks/              # Custom React hooks
├── stores/             # Zustand/local state
├── types/              # TypeScript types
├── public/             # Static assets
└── docs/               # Documentation
```

---

## 🔒 Privacy & Data
- **All data is stored locally** in your browser (IndexedDB/localStorage) or optionally in SQLite (for desktop use)
- **No data is sent to any server or third party**
- **Export/backup** your data anytime as CSV/Excel

---

## 📝 Development Roadmap
- [x] Manual entry for holdings and transactions
- [x] Portfolio dashboard and analytics
- [x] Goal setting and progress tracking
- [x] Import/export for data backup
- [x] Mobile-first, responsive design

---

## 🙏 Acknowledgments
- **Next.js** for the framework
- **Recharts/Chart.js** for charting
- **Tailwind CSS** for styling

---

**Made for personal use. 100% private.** 