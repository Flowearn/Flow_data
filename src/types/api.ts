/**
 * API Types
 * This file contains type definitions for API responses
 */

// Kline (Candlestick) data
export interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: string;
  quoteVolume: number;
  trades: number;
  takerBuyBaseVolume: number;
  takerBuyQuoteVolume: number;
  isRising: boolean;
}

// Order book data
export interface OrderData {
  price: number;
  amount: number;
  total?: number; // Calculated field
}

export interface OrderBook {
  lastUpdateId: number;
  bids: OrderData[];
  asks: OrderData[];
}

// 24-hour ticker price change statistics
export interface TickerPriceChange {
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
  weightedAvgPrice: number;
  prevClosePrice: number;
  lastPrice: number;
  lastQty: number;
  bidPrice: number;
  bidQty: number;
  askPrice: number;
  askQty: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  openTime: string;
  closeTime: string;
  firstId: number;
  lastId: number;
  count: number;
}

// Recent trades data
export interface Trade {
  id: number;
  price: number;
  quantity: number;
  quoteQuantity: number;
  time: string;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
  isBuy: boolean;
}

// Funding rate data
export interface FundingRate {
  symbol: string;
  time: string;
  rate: number;
}

// Liquidation orders data
export interface LiquidationOrder {
  symbol: string;
  price: number;
  origQty: number;
  executedQty: number;
  averagePrice: number;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  time: string;
} 