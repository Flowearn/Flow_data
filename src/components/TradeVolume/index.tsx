import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// 样式组件
const Container = styled(Box)`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartContainer = styled(Box)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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

// 颜色配置
const COLORS = ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0', '#607d8b'];

// 接口定义
interface TradeVolumeProps {
  symbol: string;
  refreshInterval?: number;
}

interface VolumeData {
  name: string;
  value: number;
}

const TradeVolume: React.FC<TradeVolumeProps> = ({ symbol, refreshInterval = 5000 }) => {
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolumeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 模拟API调用 - 在实际应用中替换为真实的API调用
        // 例如: const response = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=1000`);
        
        // 生成模拟数据
        const mockData: VolumeData[] = [
          { name: '大单买入', value: Math.floor(Math.random() * 1000) + 500 },
          { name: '大单卖出', value: Math.floor(Math.random() * 800) + 300 },
          { name: '中单买入', value: Math.floor(Math.random() * 600) + 200 },
          { name: '中单卖出', value: Math.floor(Math.random() * 500) + 150 },
          { name: '小单买入', value: Math.floor(Math.random() * 300) + 100 },
          { name: '小单卖出', value: Math.floor(Math.random() * 200) + 50 },
        ];
        
        setVolumeData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching volume data:', err);
        setError('获取交易量数据失败');
        setLoading(false);
      }
    };

    fetchVolumeData();
    
    // 设置定时刷新
    const intervalId = setInterval(fetchVolumeData, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [symbol, refreshInterval]);

  // 自定义工具提示
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, backgroundColor: '#1e2230', border: '1px solid #2a2e39' }}>
          <Typography variant="body2" sx={{ color: '#d1d4dc' }}>
            {payload[0].name}: {payload[0].value.toLocaleString()}
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
        {symbol} 交易量分类
      </Typography>
      
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={volumeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {volumeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default TradeVolume; 