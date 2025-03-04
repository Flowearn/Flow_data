import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
interface VolumePulseProps {
  symbol: string;
  interval: string;
}

interface VolumeData {
  time: string;
  volume: number;
  buyVolume: number;
  sellVolume: number;
}

const VolumePulse: React.FC<VolumePulseProps> = ({ symbol, interval }) => {
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolumeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 模拟API调用 - 在实际应用中替换为真实的API调用
        // 例如: const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=20`);
        
        // 生成模拟数据
        const mockData: VolumeData[] = [];
        const now = new Date();
        
        for (let i = 0; i < 20; i++) {
          const time = new Date(now.getTime() - (19 - i) * getIntervalMilliseconds(interval));
          const totalVolume = Math.floor(Math.random() * 100) + 20;
          const buyRatio = Math.random() * 0.6 + 0.2; // 20% - 80%
          const buyVolume = Math.floor(totalVolume * buyRatio);
          const sellVolume = totalVolume - buyVolume;
          
          mockData.push({
            time: formatTime(time, interval),
            volume: totalVolume,
            buyVolume,
            sellVolume
          });
        }
        
        setVolumeData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching volume data:', err);
        setError('获取成交量数据失败');
        setLoading(false);
      }
    };

    fetchVolumeData();
  }, [symbol, interval]);

  // 根据时间间隔获取毫秒数
  const getIntervalMilliseconds = (interval: string): number => {
    const value = parseInt(interval.slice(0, -1));
    const unit = interval.slice(-1);
    
    switch (unit) {
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'w': return value * 7 * 24 * 60 * 60 * 1000;
      default: return 60 * 1000; // 默认1分钟
    }
  };

  // 格式化时间
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

  // 自定义工具提示
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          backgroundColor: '#1e2230', 
          border: '1px solid #2a2e39',
          p: 1,
          borderRadius: 1
        }}>
          <Typography variant="caption" sx={{ color: '#d1d4dc', display: 'block' }}>
            时间: {payload[0].payload.time}
          </Typography>
          <Typography variant="caption" sx={{ color: '#4caf50', display: 'block' }}>
            买入量: {payload[0].payload.buyVolume}
          </Typography>
          <Typography variant="caption" sx={{ color: '#f44336', display: 'block' }}>
            卖出量: {payload[0].payload.sellVolume}
          </Typography>
          <Typography variant="caption" sx={{ color: '#d1d4dc', display: 'block' }}>
            总量: {payload[0].payload.volume}
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

  return (
    <Container>
      <Typography variant="subtitle2" sx={{ mb: 1, color: '#d1d4dc' }}>
        {symbol} {interval} 成交量脉冲
      </Typography>
      
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={volumeData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barGap={0}
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
            <Bar dataKey="buyVolume" stackId="a" fill="#4caf50" />
            <Bar dataKey="sellVolume" stackId="a" fill="#f44336" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default VolumePulse; 