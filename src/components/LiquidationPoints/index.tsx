import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Typography, CircularProgress } from '@mui/material';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

// 样式组件
const Container = styled(Box)`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
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
interface LiquidationPointsProps {
  symbol: string;
}

interface LiquidationData {
  price: number;
  volume: number;
  type: 'long' | 'short';
}

const LiquidationPoints: React.FC<LiquidationPointsProps> = ({ symbol }) => {
  const [liquidationData, setLiquidationData] = useState<LiquidationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiquidationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 模拟API调用 - 在实际应用中替换为真实的API调用
        // 例如: const response = await fetch(`https://api.binance.com/fapi/v1/liquidationOrders?symbol=${symbol}`);
        
        // 生成模拟数据
        let basePrice = 50000; // 基础价格
        
        if (symbol === 'BTCUSDT') {
          basePrice = 50000;
        } else if (symbol === 'ETHUSDT') {
          basePrice = 3000;
        } else if (symbol === 'BNBUSDT') {
          basePrice = 500;
        } else {
          basePrice = 100;
        }
        
        const volatility = basePrice * 0.1; // 10%的波动率
        const mockData: LiquidationData[] = [];
        
        // 生成多头清算点
        for (let i = 0; i < 15; i++) {
          const price = basePrice - (Math.random() * volatility * 0.8);
          const volume = Math.floor(Math.random() * 10) + 1;
          
          mockData.push({
            price,
            volume,
            type: 'long'
          });
        }
        
        // 生成空头清算点
        for (let i = 0; i < 15; i++) {
          const price = basePrice + (Math.random() * volatility * 0.8);
          const volume = Math.floor(Math.random() * 10) + 1;
          
          mockData.push({
            price,
            volume,
            type: 'short'
          });
        }
        
        setLiquidationData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching liquidation data:', err);
        setError('获取清算点数据失败');
        setLoading(false);
      }
    };

    fetchLiquidationData();
  }, [symbol]);

  // 自定义工具提示
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
            价格: {data.price.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#d1d4dc', display: 'block' }}>
            数量: {data.volume}
          </Typography>
          <Typography variant="caption" sx={{ 
            color: data.type === 'long' ? '#f44336' : '#4caf50',
            display: 'block'
          }}>
            类型: {data.type === 'long' ? '多头清算' : '空头清算'}
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

  // 分离多头和空头清算数据
  const longLiquidations = liquidationData.filter(item => item.type === 'long');
  const shortLiquidations = liquidationData.filter(item => item.type === 'short');

  return (
    <Container>
      <Typography variant="subtitle2" sx={{ mb: 1, color: '#d1d4dc' }}>
        {symbol} 清算点分布
      </Typography>
      
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" />
            <XAxis 
              type="number" 
              dataKey="price" 
              name="价格" 
              tick={{ fill: '#d1d4dc' }} 
              axisLine={{ stroke: '#2a2e39' }}
              domain={['auto', 'auto']}
            />
            <YAxis 
              type="number" 
              dataKey="volume" 
              name="数量" 
              tick={{ fill: '#d1d4dc' }} 
              axisLine={{ stroke: '#2a2e39' }}
            />
            <ZAxis range={[60, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name="多头清算" data={longLiquidations} fill="#f44336" />
            <Scatter name="空头清算" data={shortLiquidations} fill="#4caf50" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default LiquidationPoints; 