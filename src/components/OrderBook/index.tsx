import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { fetchOrderBook } from '../../api/binance';
import { OrderData as OrderDataType } from '../../types/api';

// Styled components
const Container = styled(Box)`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const OrderBookContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

const StyledTableContainer = styled(TableContainer)`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #2a2e39;
    border-radius: 3px;
  }
  
  table {
    border-collapse: separate;
    border-spacing: 0;
  }
`;

const StyledTableCell = styled(TableCell)`
  border-bottom: 1px solid #1e2230;
  padding: 6px 16px;
  font-size: 0.8rem;
`;

const StyledTableHeaderCell = styled(StyledTableCell)`
  background-color: #131722;
  color: #d1d4dc;
  font-weight: 600;
`;

const PriceCell = styled(StyledTableCell)<{ type: 'buy' | 'sell' }>`
  color: ${props => props.type === 'buy' ? '#4caf50' : '#f44336'};
`;

const DepthBar = styled.div<{ width: number; type: 'buy' | 'sell' }>`
  position: absolute;
  top: 0;
  bottom: 0;
  ${props => props.type === 'buy' ? 'right: 0;' : 'left: 0;'}
  width: ${props => props.width}%;
  background-color: ${props => props.type === 'buy' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  z-index: 0;
`;

// Interface definitions
interface OrderBookProps {
  symbol: string;
  depth?: number;
  refreshInterval?: number;
}

interface OrderData {
  price: number;
  amount: number;
  total: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ 
  symbol, 
  depth = 10,
  refreshInterval = 1000
}) => {
  const [asks, setAsks] = useState<OrderData[]>([]);
  const [bids, setBids] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [maxTotal, setMaxTotal] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real data from Binance API
        const data = await fetchOrderBook(symbol, depth * 2);
        
        // Process asks data
        let askTotal = 0;
        const processedAsks = data.asks.slice(0, depth).map((ask: OrderDataType) => {
          askTotal += ask.amount;
          return {
            price: ask.price,
            amount: ask.amount,
            total: askTotal
          };
        });
        
        // Process bids data
        let bidTotal = 0;
        const processedBids = data.bids.slice(0, depth).map((bid: OrderDataType) => {
          bidTotal += bid.amount;
          return {
            price: bid.price,
            amount: bid.amount,
            total: bidTotal
          };
        });
        
        setAsks(processedAsks);
        setBids(processedBids);
        setMaxTotal(Math.max(askTotal, bidTotal));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order book:', err);
        setError('Failed to fetch order book data');
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
      
      const volatility = basePrice * 0.001; // 0.1% volatility
      
      // Generate asks data
      const mockAsks: OrderData[] = [];
      let askTotal = 0;
      
      for (let i = 0; i < depth; i++) {
        const price = basePrice + (i + 1) * volatility;
        const amount = Math.random() * 2 + 0.1;
        askTotal += amount;
        
        mockAsks.push({
          price,
          amount,
          total: askTotal
        });
      }
      
      // Generate bids data
      const mockBids: OrderData[] = [];
      let bidTotal = 0;
      
      for (let i = 0; i < depth; i++) {
        const price = basePrice - (i + 1) * volatility;
        const amount = Math.random() * 2 + 0.1;
        bidTotal += amount;
        
        mockBids.push({
          price,
          amount,
          total: bidTotal
        });
      }
      
      setAsks(mockAsks);
      setBids(mockBids);
      setMaxTotal(Math.max(askTotal, bidTotal));
      setLoading(false);
    };

    fetchData();
    
    // Set up interval to refresh data
    const intervalId = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [symbol, depth, refreshInterval]);

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
        {symbol} Order Book
      </Typography>
      
      <OrderBookContainer>
        <StyledTableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell align="right">Price</StyledTableHeaderCell>
                <StyledTableHeaderCell align="right">Amount</StyledTableHeaderCell>
                <StyledTableHeaderCell align="right">Total</StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {asks.slice().reverse().map((ask, index) => (
                <TableRow key={`ask-${index}`} sx={{ position: 'relative' }}>
                  <DepthBar width={(ask.total / maxTotal) * 100} type="sell" />
                  <PriceCell align="right" type="sell">{ask.price.toFixed(2)}</PriceCell>
                  <StyledTableCell align="right">{ask.amount.toFixed(4)}</StyledTableCell>
                  <StyledTableCell align="right">{ask.total.toFixed(4)}</StyledTableCell>
                </TableRow>
              ))}
              
              <TableRow>
                <StyledTableCell colSpan={3} align="center" sx={{ py: 1 }}>
                  <Typography variant="body2" sx={{ color: '#d1d4dc', fontWeight: 'bold' }}>
                    {bids.length > 0 ? bids[0].price.toFixed(2) : '0.00'}
                  </Typography>
                </StyledTableCell>
              </TableRow>
              
              {bids.map((bid, index) => (
                <TableRow key={`bid-${index}`} sx={{ position: 'relative' }}>
                  <DepthBar width={(bid.total / maxTotal) * 100} type="buy" />
                  <PriceCell align="right" type="buy">{bid.price.toFixed(2)}</PriceCell>
                  <StyledTableCell align="right">{bid.amount.toFixed(4)}</StyledTableCell>
                  <StyledTableCell align="right">{bid.total.toFixed(4)}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </OrderBookContainer>
    </Container>
  );
};

export default OrderBook; 