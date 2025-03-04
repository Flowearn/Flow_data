import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Typography, CircularProgress } from '@mui/material';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, ComposedChart
} from 'recharts';
import { fetchKlineData } from '../../api/binance';
import { KlineData as KlineDataType } from '../../types/api';
import { formatDate } from '../../utils/formatters';

// Styled components
const Container = styled(Box)`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MainChartContainer = styled(Box)`
  flex: 3;
`;

const VolumeChartContainer = styled(Box)`
  flex: 1;
  margin-top: 8px;
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

// Custom candlestick component
const CandlestickBar = (props: any) => {
  const { x, y, width, height, open, close, low, high } = props;
  const isRising = close > open;
  const color = isRising ? '#26a69a' : '#ef5350';
  
  // Calculate positions for the candle body
  const bodyY = isRising ? y + (high - close) / (high - low) * height : y + (high - open) / (high - low) * height;
  const bodyHeight = isRising 
    ? (close - open) / (high - low) * height 
    : (open - close) / (high - low) * height;
  
  // Ensure minimum body height for visibility
  const minBodyHeight = 1;
  const adjustedBodyHeight = Math.max(bodyHeight, minBodyHeight);
  
  // Calculate positions for the wick
  const wickX = x + width / 2;
  const wickTop = y;
  const wickBottom = y + height;
  
  return (
    <g>
      {/* Wick line */}
      <line 
        x1={wickX} 
        y1={wickTop} 
        x2={wickX} 
        y2={wickBottom} 
        stroke={color} 
        strokeWidth={1} 
      />
      {/* Candle body */}
      <rect 
        x={x} 
        y={bodyY} 
        width={width} 
        height={adjustedBodyHeight} 
        fill={color} 
        stroke={color} 
      />
    </g>
  );
};

// Interface definitions
interface KlineChartProps {
  symbol: string;
  interval: string;
  height?: number;
}

interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  // Add a property to determine if price is rising or falling
  isRising?: boolean;
}

const KlineChart: React.FC<KlineChartProps> = ({ symbol, interval, height = 400 }) => {
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real data from Binance API
        const data = await fetchKlineData(symbol, interval);
        
        // Transform the data to match our component's expected format
        const formattedData = data.map((item: KlineDataType) => ({
          time: formatDate(item.time, 'MM-DD HH:mm'),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
          isRising: item.isRising
        }));
        
        setKlineData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching kline data:', err);
        setError('Failed to fetch kline data');
        setLoading(false);
        
        // Fallback to mock data if API fails
        generateMockData();
      }
    };

    // Fallback function to generate mock data if API fails
    const generateMockData = () => {
      const mockData: KlineData[] = [];
      const now = new Date();
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
      
      // Generate 100 kline data points
      for (let i = 0; i < 100; i++) {
        const time = new Date(now.getTime() - (99 - i) * getIntervalMilliseconds(interval));
        const volatility = basePrice * 0.02; // 2% volatility
        
        const open = i === 0 ? basePrice : mockData[i - 1].close;
        const change = (Math.random() - 0.5) * volatility;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        const volume = Math.floor(Math.random() * 100) + 50;
        
        mockData.push({
          time: formatTime(time, interval),
          open,
          high,
          low,
          close,
          volume,
          isRising: close >= open
        });
      }
      
      setKlineData(mockData);
      setLoading(false);
    };

    fetchData();
    
    // Set up interval to refresh data
    const refreshInterval = setInterval(fetchData, 60000); // Refresh every minute
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [symbol, interval]);

  // Get milliseconds based on interval
  const getIntervalMilliseconds = (interval: string): number => {
    const value = parseInt(interval.slice(0, -1));
    const unit = interval.slice(-1);
    
    switch (unit) {
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'w': return value * 7 * 24 * 60 * 60 * 1000;
      default: return 60 * 1000; // Default 1 minute
    }
  };

  // Format time
  const formatTime = (date: Date, interval: string): string => {
    const unit = interval.slice(-1);
    
    if (unit === 'm') {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (unit === 'h') {
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
    } else {
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ 
          backgroundColor: '#1e2230', 
          border: '1px solid #2a2e39',
          p: 1,
          borderRadius: 1
        }}>
          <Typography variant="caption" sx={{ color: '#d1d4dc', display: 'block' }}>
            Time: {data.time}
          </Typography>
          <Typography variant="caption" sx={{ color: '#d1d4dc', display: 'block' }}>
            Open: {data.open.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#d1d4dc', display: 'block' }}>
            High: {data.high.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#d1d4dc', display: 'block' }}>
            Low: {data.low.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#d1d4dc', display: 'block' }}>
            Close: {data.close.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#d1d4dc', display: 'block' }}>
            Volume: {data.volume.toFixed(2)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

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

  // Prepare data for candlestick chart
  const candleData = klineData.map((item, index) => ({
    ...item,
    idx: index, // Add index for x-axis positioning
  }));

  return (
    <Container>
      <Typography variant="subtitle2" sx={{ mb: 1, color: '#d1d4dc' }}>
        {symbol} {interval} Candlestick Chart
      </Typography>
      
      <ChartContainer>
        <MainChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={candleData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#d1d4dc' }} 
                axisLine={{ stroke: '#2a2e39' }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fill: '#d1d4dc' }} 
                axisLine={{ stroke: '#2a2e39' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Custom rendering for candlesticks */}
              <Bar
                dataKey="idx"
                barSize={8}
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  return (
                    <CandlestickBar
                      x={x - width / 2}
                      y={y}
                      width={width}
                      height={height}
                      open={payload.open}
                      close={payload.close}
                      high={payload.high}
                      low={payload.low}
                    />
                  );
                }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </MainChartContainer>
        
        <VolumeChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={klineData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#d1d4dc' }} 
                axisLine={{ stroke: '#2a2e39' }}
              />
              <YAxis 
                tick={{ fill: '#d1d4dc' }} 
                axisLine={{ stroke: '#2a2e39' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="volume" 
                shape={(props: any) => {
                  const { x, y, width, height } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={props.payload.isRising ? '#26a69a' : '#ef5350'}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </VolumeChartContainer>
      </ChartContainer>
    </Container>
  );
};

export default KlineChart; 