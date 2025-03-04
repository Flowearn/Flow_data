# Cryptocurrency Trading Data Analysis Platform

A modern dashboard for analyzing cryptocurrency trading data, featuring real-time data from Binance API.

## Features

- **Candlestick Chart**: Interactive chart displaying price movements with red and green candles
- **Order Book**: Real-time order book showing buy and sell orders
- **Trade Volume**: Analysis of trading volume by categories
- **Funding Rate**: Historical funding rate data for futures trading
- **Price Change**: 24-hour price statistics and changes
- **Volume Pulse**: Volume analysis over time
- **Liquidation Points**: Distribution of liquidation orders
- **AI Analysis Assistant**: Chat interface for data analysis questions

## API Integration

This project integrates with the Binance API to fetch real-time cryptocurrency trading data:

- **Spot API**: Used for candlestick data, order book, recent trades, and 24h statistics
- **Futures API**: Used for funding rate and liquidation data

The API integration is implemented with:

- API client functions in `src/api/binance.ts`
- Type definitions in `src/types/api.ts`
- Vercel API routes for proxy to avoid CORS issues

## Deployment

The application is deployed on Vercel with API proxy configuration:

1. **Vercel Configuration**: The `vercel.json` file includes:
   - CORS headers configuration
   - API route rewrites to proxy Binance API requests

2. **Environment Variables**:
   - `NODE_ENV`: Set to 'production' in the Vercel deployment

## Development

### Prerequisites

- Node.js 14+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/crypto-dashboard.git

# Navigate to the project directory
cd crypto-dashboard

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
# Build the application
npm run build
```

## Technologies Used

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Material-UI**: Component library
- **Recharts**: Charting library
- **Styled Components**: CSS-in-JS styling
- **Vercel**: Hosting and API proxy

## License

MIT
