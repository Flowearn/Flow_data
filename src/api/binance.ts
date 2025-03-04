/**
 * Binance API client
 * This file contains functions to interact with the Binance API
 */

// Base URLs for Binance API
// We're using direct API calls to avoid Vercel authentication issues
const BINANCE_API_BASE_URL = 'https://api.binance.com';
const BINANCE_FUTURES_API_BASE_URL = 'https://fapi.binance.com';

/**
 * Fetch kline (candlestick) data for a symbol and interval
 * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param interval - Time interval (e.g., '1m', '1h', '1d')
 * @param limit - Number of data points to fetch (default: 100)
 * @returns Promise with kline data
 */
export const fetchKlineData = async (symbol: string, interval: string, limit: number = 100) => {
  try {
    const response = await fetch(
      `${BINANCE_API_BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching kline data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the data to a more usable format
    // Binance returns an array of arrays with the following structure:
    // [
    //   [
    //     1499040000000,      // Open time
    //     "0.01634790",       // Open
    //     "0.80000000",       // High
    //     "0.01575800",       // Low
    //     "0.01577100",       // Close
    //     "148976.11427815",  // Volume
    //     1499644799999,      // Close time
    //     "2434.19055334",    // Quote asset volume
    //     308,                // Number of trades
    //     "1756.87402397",    // Taker buy base asset volume
    //     "28.46694368",      // Taker buy quote asset volume
    //     "17928899.62484339" // Ignore
    //   ]
    // ]
    return data.map((item: any) => ({
      time: new Date(item[0]).toISOString(),
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
      closeTime: new Date(item[6]).toISOString(),
      quoteVolume: parseFloat(item[7]),
      trades: item[8],
      takerBuyBaseVolume: parseFloat(item[9]),
      takerBuyQuoteVolume: parseFloat(item[10]),
      isRising: parseFloat(item[4]) >= parseFloat(item[1])
    }));
  } catch (error) {
    console.error('Error fetching kline data:', error);
    throw error;
  }
};

/**
 * Fetch order book data for a symbol
 * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param limit - Depth of the order book (default: 20)
 * @returns Promise with order book data
 */
export const fetchOrderBook = async (symbol: string, limit: number = 20) => {
  try {
    const response = await fetch(
      `${BINANCE_API_BASE_URL}/api/v3/depth?symbol=${symbol}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching order book: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the data to a more usable format
    // Binance returns an object with the following structure:
    // {
    //   "lastUpdateId": 1027024,
    //   "bids": [
    //     [
    //       "4.00000000",     // Price
    //       "431.00000000"    // Quantity
    //     ]
    //   ],
    //   "asks": [
    //     [
    //       "4.00000200",
    //       "12.00000000"
    //     ]
    //   ]
    // }
    return {
      lastUpdateId: data.lastUpdateId,
      bids: data.bids.map((item: any) => ({
        price: parseFloat(item[0]),
        amount: parseFloat(item[1])
      })),
      asks: data.asks.map((item: any) => ({
        price: parseFloat(item[0]),
        amount: parseFloat(item[1])
      }))
    };
  } catch (error) {
    console.error('Error fetching order book:', error);
    throw error;
  }
};

/**
 * Fetch 24-hour ticker price change statistics
 * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @returns Promise with 24-hour price change statistics
 */
export const fetch24hTickerPriceChange = async (symbol: string) => {
  try {
    const response = await fetch(
      `${BINANCE_API_BASE_URL}/api/v3/ticker/24hr?symbol=${symbol}`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching 24h ticker: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the data as is, it's already in a usable format
    return {
      symbol: data.symbol,
      priceChange: parseFloat(data.priceChange),
      priceChangePercent: parseFloat(data.priceChangePercent),
      weightedAvgPrice: parseFloat(data.weightedAvgPrice),
      prevClosePrice: parseFloat(data.prevClosePrice),
      lastPrice: parseFloat(data.lastPrice),
      lastQty: parseFloat(data.lastQty),
      bidPrice: parseFloat(data.bidPrice),
      bidQty: parseFloat(data.bidQty),
      askPrice: parseFloat(data.askPrice),
      askQty: parseFloat(data.askQty),
      openPrice: parseFloat(data.openPrice),
      highPrice: parseFloat(data.highPrice),
      lowPrice: parseFloat(data.lowPrice),
      volume: parseFloat(data.volume),
      quoteVolume: parseFloat(data.quoteVolume),
      openTime: new Date(data.openTime).toISOString(),
      closeTime: new Date(data.closeTime).toISOString(),
      firstId: data.firstId,
      lastId: data.lastId,
      count: data.count
    };
  } catch (error) {
    console.error('Error fetching 24h ticker:', error);
    throw error;
  }
};

/**
 * Fetch recent trades for a symbol
 * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param limit - Number of trades to fetch (default: 100)
 * @returns Promise with recent trades data
 */
export const fetchRecentTrades = async (symbol: string, limit: number = 100) => {
  try {
    const response = await fetch(
      `${BINANCE_API_BASE_URL}/api/v3/trades?symbol=${symbol}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching recent trades: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the data to a more usable format
    // Binance returns an array of objects with the following structure:
    // [
    //   {
    //     "id": 28457,
    //     "price": "4.00000100",
    //     "qty": "12.00000000",
    //     "quoteQty": "48.000012",
    //     "time": 1499865549590,
    //     "isBuyerMaker": true,
    //     "isBestMatch": true
    //   }
    // ]
    return data.map((item: any) => ({
      id: item.id,
      price: parseFloat(item.price),
      quantity: parseFloat(item.qty),
      quoteQuantity: parseFloat(item.quoteQty),
      time: new Date(item.time).toISOString(),
      isBuyerMaker: item.isBuyerMaker,
      isBestMatch: item.isBestMatch,
      isBuy: !item.isBuyerMaker
    }));
  } catch (error) {
    console.error('Error fetching recent trades:', error);
    throw error;
  }
};

/**
 * Fetch funding rate for a symbol (for futures)
 * Note: This is a futures API endpoint, not spot
 * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param limit - Number of funding rates to fetch (default: 100)
 * @returns Promise with funding rate data
 */
export const fetchFundingRate = async (symbol: string, limit: number = 100) => {
  try {
    // Note: Using the futures API for funding rate
    const response = await fetch(
      `${BINANCE_FUTURES_API_BASE_URL}/fapi/v1/fundingRate?symbol=${symbol}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching funding rate: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the data to a more usable format
    // Binance returns an array of objects with the following structure:
    // [
    //   {
    //     "symbol": "BTCUSDT",
    //     "fundingTime": 1499865549590,
    //     "fundingRate": "0.00010000"
    //   }
    // ]
    return data.map((item: any) => ({
      symbol: item.symbol,
      time: new Date(item.fundingTime).toISOString(),
      rate: parseFloat(item.fundingRate)
    }));
  } catch (error) {
    console.error('Error fetching funding rate:', error);
    throw error;
  }
};

/**
 * Fetch liquidation orders (for futures)
 * Note: This is a futures API endpoint, not spot
 * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param limit - Number of liquidation orders to fetch (default: 100)
 * @returns Promise with liquidation orders data
 */
export const fetchLiquidationOrders = async (symbol: string, limit: number = 100) => {
  try {
    // Note: Using the futures API for liquidation orders
    const response = await fetch(
      `${BINANCE_FUTURES_API_BASE_URL}/fapi/v1/allForceOrders?symbol=${symbol}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching liquidation orders: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the data to a more usable format
    return data.map((item: any) => ({
      symbol: item.symbol,
      price: parseFloat(item.price),
      origQty: parseFloat(item.origQty),
      executedQty: parseFloat(item.executedQty),
      averagePrice: parseFloat(item.averagePrice),
      status: item.status,
      timeInForce: item.timeInForce,
      type: item.type,
      side: item.side,
      time: new Date(item.time).toISOString()
    }));
  } catch (error) {
    console.error('Error fetching liquidation orders:', error);
    throw error;
  }
}; 