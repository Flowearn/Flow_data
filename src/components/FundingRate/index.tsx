import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 样式组件
const Container = styled(Box)`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const RateContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const RateBox = styled(Paper)`
  padding: 12px;
  flex: 1;
  margin: 0 8px;
  text-align: center;
  background-color: #1e2230;
  border: 1px solid #2a2e39;
  
  &:first-child {
    margin-left: 0;
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

const ChartContainer = styled(Box)`
  flex: 1;
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

// 接口定义
interface FundingRateProps {
  symbol: string;
  refreshInterval?: number;
}

interface FundingRateData {
  time: string;
  rate: number;
}

const FundingRate: React.FC<FundingRateProps> = ({ symbol, refreshInterval = 60000 }) => {
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [nextRate, setNextRate] = useState<number>(0);
  const [avgRate, setAvgRate] = useState<number>(0);
  const [historyData, setHistoryData] = useState<FundingRateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFundingRateData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 模拟API调用 - 在实际应用中替换为真实的API调用
        // 例如: const response = await fetch(`https://api.binance.com/fapi/v1/fundingRate?symbol=${symbol}`);
        
        // 生成模拟数据
        const mockCurrentRate = (Math.random() * 0.002 - 0.001).toFixed(4);
        const mockNextRate = (Math.random() * 0.002 - 0.001).toFixed(4);
        
        // 生成历史数据
        const mockHistoryData: FundingRateData[] = [];
        const now = new Date();
        
        for (let i = 0; i < 24; i++) {
          const time = new Date(now.getTime() - (23 - i) * 3600000);
          const rate = parseFloat((Math.random() * 0.002 - 0.001).toFixed(4));
          
          mockHistoryData.push({
            time: `${time.getHours().toString().padStart(2, '0')}:00`,
            rate
          });
        }
        
        // 计算平均值
        const sum = mockHistoryData.reduce((acc, curr) => acc + curr.rate, 0);
        const avg = parseFloat((sum / mockHistoryData.length).toFixed(4));
        
        setCurrentRate(parseFloat(mockCurrentRate));
        setNextRate(parseFloat(mockNextRate));
        setAvgRate(avg);
        setHistoryData(mockHistoryData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching funding rate data:', err);
        setError('获取资金费率数据失败');
        setLoading(false);
      }
    };

    fetchFundingRateData();
    
    // 设置定时刷新
    const intervalId = setInterval(fetchFundingRateData, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [symbol, refreshInterval]);

  // 自定义工具提示
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, backgroundColor: '#1e2230', border: '1px solid #2a2e39' }}>
          <Typography variant="body2" sx={{ color: '#d1d4dc' }}>
            时间: {payload[0].payload.time}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: payload[0].value >= 0 ? '#4caf50' : '#f44336' 
          }}>
            费率: {payload[0].value.toFixed(4)}%
          </Typography>
        </Paper>
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

  return (
    <Container>
      <Typography variant="subtitle2" sx={{ mb: 1, color: '#d1d4dc' }}>
        {symbol} 资金费率
      </Typography>
      
      <RateContainer>
        <RateBox>
          <Typography variant="caption" sx={{ color: '#d1d4dc' }}>
            当前费率
          </Typography>
          <Typography variant="h6" sx={{ 
            color: currentRate >= 0 ? '#4caf50' : '#f44336',
            fontWeight: 'bold'
          }}>
            {currentRate.toFixed(4)}%
          </Typography>
        </RateBox>
        
        <RateBox>
          <Typography variant="caption" sx={{ color: '#d1d4dc' }}>
            预测费率
          </Typography>
          <Typography variant="h6" sx={{ 
            color: nextRate >= 0 ? '#4caf50' : '#f44336',
            fontWeight: 'bold'
          }}>
            {nextRate.toFixed(4)}%
          </Typography>
        </RateBox>
        
        <RateBox>
          <Typography variant="caption" sx={{ color: '#d1d4dc' }}>
            24小时平均
          </Typography>
          <Typography variant="h6" sx={{ 
            color: avgRate >= 0 ? '#4caf50' : '#f44336',
            fontWeight: 'bold'
          }}>
            {avgRate.toFixed(4)}%
          </Typography>
        </RateBox>
      </RateContainer>
      
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={historyData}
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
              tickFormatter={(value) => `${value.toFixed(4)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#8884d8" 
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default FundingRate; 