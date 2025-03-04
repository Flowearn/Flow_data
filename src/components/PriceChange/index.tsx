import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { fetch24hTickerPriceChange } from '../../api/binance';
import { TickerPriceChange as TickerPriceChangeType } from '../../types/api';
import { formatLargeNumber } from '../../utils/formatters';

// Styled components
const Container = styled(Box)`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StatsContainer = styled(Grid)`
  flex: 1;
`;

const StatBox = styled(Paper)`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1e2230;
  border: 1px solid #2a2e39;
`;

const StatLabel = styled(Typography)`
  color: #d1d4dc;
  font-size: 0.75rem;
  margin-bottom: 8px;
`;

const StatValue = styled(Typography)<{ isPositive?: boolean }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.isPositive === undefined 
    ? '#d1d4dc' 
    : props.isPositive 
      ? '#4caf50' 
      : '#f44336'};
  display: flex;
  align-items: center;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ErrorContainer = styled(Box)`
  color: #ff5252;
  text-align: center;
  padding: 16px;
`;

// Interface definitions
interface PriceChangeProps {
  symbol: string;
  refreshInterval?: number;
}

interface PriceStats {
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
}

const PriceChange: React.FC<PriceChangeProps> = ({ symbol, refreshInterval = 10000 }) => {
  const [stats, setStats] = useState<PriceStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real data from Binance API
        const data: TickerPriceChangeType = await fetch24hTickerPriceChange(symbol);
        
        // Transform the data to match our component's expected format
        const priceStats: PriceStats = {
          lastPrice: data.lastPrice,
          priceChange: data.priceChange,
          priceChangePercent: data.priceChangePercent,
          highPrice: data.highPrice,
          lowPrice: data.lowPrice,
          volume: data.volume,
          quoteVolume: data.quoteVolume
        };
        
        setStats(priceStats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching price stats:', err);
        setError('Failed to fetch price data');
        setLoading(false);
        
        // Fallback to mock data if API fails
        generateMockData();
      }
    };

    // Fallback function to generate mock data if API fails
    const generateMockData = () => {
      let basePrice = 50000; // Base price
      
      if (symbol === 'BTCUSDT') {
        basePrice = 50000;
      } else if (symbol === 'ETHUSDT') {
        basePrice = 3000;
      } else if (symbol === 'BNBUSDT') {
        basePrice = 500;
      } else {
        basePrice = 100;
      }
      
      const volatility = basePrice * 0.05; // 5% volatility
      const lastPrice = basePrice + (Math.random() - 0.5) * volatility;
      const priceChange = (Math.random() - 0.5) * volatility;
      const priceChangePercent = (priceChange / basePrice) * 100;
      const highPrice = lastPrice + Math.random() * volatility * 0.5;
      const lowPrice = lastPrice - Math.random() * volatility * 0.5;
      const volume = Math.floor(Math.random() * 10000) + 1000;
      const quoteVolume = volume * lastPrice;
      
      const mockStats: PriceStats = {
        lastPrice,
        priceChange,
        priceChangePercent,
        highPrice,
        lowPrice,
        volume,
        quoteVolume
      };
      
      setStats(mockStats);
      setLoading(false);
    };

    fetchData();
    
    // Set up interval to refresh data
    const intervalId = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [symbol, refreshInterval]);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress size={40} />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <Typography variant="body1">{error}</Typography>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <Typography variant="subtitle2" sx={{ mb: 1, color: '#d1d4dc' }}>
        {symbol} 24h Price Change
      </Typography>
      
      {stats && (
        <StatsContainer container spacing={2}>
          <Grid item xs={12} md={6}>
            <StatBox>
              <StatLabel>Last Price</StatLabel>
              <StatValue>
                {stats.lastPrice.toFixed(2)}
              </StatValue>
            </StatBox>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StatBox>
              <StatLabel>Price Change</StatLabel>
              <StatValue isPositive={stats.priceChange >= 0}>
                {stats.priceChange >= 0 ? <ArrowDropUp /> : <ArrowDropDown />}
                {stats.priceChange.toFixed(2)} ({stats.priceChangePercent.toFixed(2)}%)
              </StatValue>
            </StatBox>
          </Grid>
          
          <Grid item xs={6}>
            <StatBox>
              <StatLabel>24h High</StatLabel>
              <StatValue>
                {stats.highPrice.toFixed(2)}
              </StatValue>
            </StatBox>
          </Grid>
          
          <Grid item xs={6}>
            <StatBox>
              <StatLabel>24h Low</StatLabel>
              <StatValue>
                {stats.lowPrice.toFixed(2)}
              </StatValue>
            </StatBox>
          </Grid>
          
          <Grid item xs={6}>
            <StatBox>
              <StatLabel>24h Volume</StatLabel>
              <StatValue>
                {formatLargeNumber(stats.volume, 2)}
              </StatValue>
            </StatBox>
          </Grid>
          
          <Grid item xs={6}>
            <StatBox>
              <StatLabel>24h Quote Volume</StatLabel>
              <StatValue>
                ${formatLargeNumber(stats.quoteVolume, 2)}
              </StatValue>
            </StatBox>
          </Grid>
        </StatsContainer>
      )}
    </Container>
  );
};

export default PriceChange;