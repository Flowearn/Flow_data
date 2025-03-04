import React, { useState } from 'react';
import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

// Import components
import KlineChart from './components/KlineChart';
import OrderBook from './components/OrderBook';
import TradeVolume from './components/TradeVolume';
import FundingRate from './components/FundingRate';
import PriceChange from './components/PriceChange';
import VolumePulse from './components/VolumePulse';
import LiquidationPoints from './components/LiquidationPoints';
import AskMeAnything from './components/AskMeAnything';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#0a0e17',
      paper: '#131722',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
        },
      },
    },
  },
});

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${darkTheme.palette.background.default};
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${darkTheme.palette.background.default};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #2a2e39;
    border-radius: 4px;
  }
`;

const SectionTitle = styled(Typography)`
  margin-bottom: 8px;
  color: #d1d4dc;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #2a2e39;
    margin-left: 10px;
  }
`;

const StyledPaper = styled(Paper)`
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  background-color: ${darkTheme.palette.background.paper};
  border: 1px solid #1e2230;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2a2e39;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Trading pair options
const symbols = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'SOLUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'XRPUSDT',
  'DOTUSDT',
  'AVAXUSDT',
  'MATICUSDT',
];

// Time interval options
const intervals = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: 'Daily' },
];

function App() {
  // State
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1h');
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppContainer>
        <AppBar position="static" sx={{ backgroundColor: '#131722', boxShadow: 'none', borderBottom: '1px solid #1e2230' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Cryptocurrency Trading Data Analysis Platform
            </Typography>
            
            <Box sx={{ minWidth: 120, mr: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="symbol-select-label">Trading Pair</InputLabel>
                <Select
                  labelId="symbol-select-label"
                  id="symbol-select"
                  value={symbol}
                  label="Trading Pair"
                  onChange={(e) => setSymbol(e.target.value as string)}
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: '#2a2e39' 
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': { 
                      borderColor: '#3a3f4c' 
                    }
                  }}
                >
                  {symbols.map((sym) => (
                    <MenuItem key={sym} value={sym}>{sym}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="interval-select-label">Time Interval</InputLabel>
                <Select
                  labelId="interval-select-label"
                  id="interval-select"
                  value={interval}
                  label="Time Interval"
                  onChange={(e) => setInterval(e.target.value as string)}
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: '#2a2e39' 
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': { 
                      borderColor: '#3a3f4c' 
                    }
                  }}
                >
                  {intervals.map((int) => (
                    <MenuItem key={int.value} value={int.value}>{int.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Toolbar>
        </AppBar>
        
        <ContentContainer>
          <Grid container spacing={2}>
            {/* First row: Candlestick Chart */}
            <Grid item xs={12}>
              <SectionTitle variant="h6">Candlestick Chart</SectionTitle>
              <StyledPaper sx={{ height: 450 }}>
                <KlineChart symbol={symbol} interval={interval} height={450} />
              </StyledPaper>
            </Grid>
            
            {/* Second row: Order Book and Trade Volume */}
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h6">Order Book</SectionTitle>
              <StyledPaper sx={{ height: 400 }}>
                <OrderBook symbol={symbol} depth={10} refreshInterval={1000} />
              </StyledPaper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h6">Trade Volume</SectionTitle>
              <StyledPaper sx={{ height: 400 }}>
                <TradeVolume symbol={symbol} refreshInterval={5000} />
              </StyledPaper>
            </Grid>
            
            {/* Third row: Funding Rate and 24h Price Change */}
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h6">Funding Rate</SectionTitle>
              <StyledPaper sx={{ height: 300 }}>
                <FundingRate symbol={symbol} refreshInterval={60000} />
              </StyledPaper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h6">24h Price Change</SectionTitle>
              <StyledPaper sx={{ height: 300 }}>
                <PriceChange symbol={symbol} refreshInterval={10000} />
              </StyledPaper>
            </Grid>
            
            {/* Fourth row: Volume Pulse and Liquidation Points */}
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h6">Volume Pulse</SectionTitle>
              <StyledPaper sx={{ height: 300 }}>
                <VolumePulse symbol={symbol} interval={interval} />
              </StyledPaper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h6">Liquidation Points</SectionTitle>
              <StyledPaper sx={{ height: 300 }}>
                <LiquidationPoints symbol={symbol} />
              </StyledPaper>
            </Grid>
            
            {/* Fifth row: AI Assistant */}
            <Grid item xs={12}>
              <SectionTitle variant="h6">AI Analysis Assistant</SectionTitle>
              <StyledPaper sx={{ height: 350 }}>
                <AskMeAnything symbol={symbol} />
              </StyledPaper>
            </Grid>
          </Grid>
        </ContentContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
