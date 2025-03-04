import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Box, Typography, TextField, Button, Paper, Avatar, 
  CircularProgress, Divider, IconButton 
} from '@mui/material';
import { Send as SendIcon, Person as PersonIcon, SmartToy as BotIcon } from '@mui/icons-material';

// Styled components
const Container = styled(Box)`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChatContainer = styled(Box)`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  padding-right: 8px;
  
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
`;

const InputContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

const MessageBubble = styled(Paper)<{ isUser: boolean }>`
  padding: 12px 16px;
  margin: 8px 0;
  max-width: 80%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isUser ? '#1a237e' : '#1e2230'};
  border: 1px solid ${props => props.isUser ? '#303f9f' : '#2a2e39'};
  border-radius: 12px;
  border-top-${props => props.isUser ? 'right' : 'left'}-radius: 4px;
`;

const MessageRow = styled(Box)<{ isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin: 16px 0;
`;

const StyledAvatar = styled(Avatar)<{ isUser: boolean }>`
  background-color: ${props => props.isUser ? '#303f9f' : '#2a2e39'};
  margin-${props => props.isUser ? 'left' : 'right'}: 12px;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
  margin-right: 12px;
  
  & .MuiOutlinedInput-root {
    background-color: #1e2230;
    
    & fieldset {
      border-color: #2a2e39;
    }
    
    &:hover fieldset {
      border-color: #3a3f4c;
    }
    
    &.Mui-focused fieldset {
      border-color: #303f9f;
    }
  }
  
  & .MuiInputLabel-root {
    color: #d1d4dc;
  }
  
  & .MuiOutlinedInput-input {
    color: #d1d4dc;
  }
`;

// Interface definitions
interface AskMeAnythingProps {
  symbol: string;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AskMeAnything: React.FC<AskMeAnythingProps> = ({ symbol }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm your AI Analysis Assistant. I can help you analyze market data and trends for ${symbol}. How can I assist you today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate AI response
      const aiResponse = generateAIResponse(input, symbol);
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  // Generate AI response (simulated)
  const generateAIResponse = (question: string, symbol: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('price') || lowerQuestion.includes('how much')) {
      return `The current price of ${symbol} is approximately ${getRandomPrice(symbol)}. In the past 24 hours, the price has ${Math.random() > 0.5 ? 'increased' : 'decreased'} by ${(Math.random() * 5).toFixed(2)}%.`;
    }
    
    if (lowerQuestion.includes('trend') || lowerQuestion.includes('movement')) {
      return `Based on technical analysis, ${symbol} is currently in a ${Math.random() > 0.5 ? 'bullish' : 'bearish'} trend. The MACD indicator shows ${Math.random() > 0.5 ? 'bullish' : 'bearish'} momentum strengthening, with an RSI of ${Math.floor(Math.random() * 100)}.`;
    }
    
    if (lowerQuestion.includes('volume') || lowerQuestion.includes('trading volume')) {
      return `The 24-hour trading volume for ${symbol} is approximately ${Math.floor(Math.random() * 10000) + 1000}, which is ${Math.random() > 0.5 ? 'up' : 'down'} ${(Math.random() * 20).toFixed(2)}% compared to yesterday.`;
    }
    
    if (lowerQuestion.includes('advice') || lowerQuestion.includes('should i')) {
      return `I cannot provide specific investment advice. Investment decisions should be based on your own research and risk tolerance. I recommend monitoring market dynamics, setting stop-losses, and only investing funds you can afford to lose.`;
    }
    
    return `Regarding your question about ${symbol}, current market data shows a volatility of ${(Math.random() * 100).toFixed(2)}% and a liquidity index of ${(Math.random() * 10).toFixed(2)}. More detailed analysis would require consideration of additional market factors. Do you have any other questions?`;
  };

  // Get random price based on trading pair
  const getRandomPrice = (symbol: string): string => {
    if (symbol === 'BTCUSDT') {
      return `$${(Math.random() * 5000 + 45000).toFixed(2)}`;
    } else if (symbol === 'ETHUSDT') {
      return `$${(Math.random() * 500 + 2500).toFixed(2)}`;
    } else if (symbol === 'BNBUSDT') {
      return `$${(Math.random() * 100 + 400).toFixed(2)}`;
    } else {
      return `$${(Math.random() * 50 + 50).toFixed(2)}`;
    }
  };

  // Handle sending on Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format time
  const formatTime = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <Container>
      <Typography variant="subtitle2" sx={{ mb: 1, color: '#d1d4dc' }}>
        AI Analysis Assistant
      </Typography>
      
      <Divider sx={{ mb: 2, backgroundColor: '#2a2e39' }} />
      
      <ChatContainer>
        {messages.map(message => (
          <MessageRow key={message.id} isUser={message.isUser}>
            {!message.isUser && (
              <StyledAvatar isUser={false}>
                <BotIcon />
              </StyledAvatar>
            )}
            
            <Box sx={{ maxWidth: '80%' }}>
              <MessageBubble isUser={message.isUser}>
                <Typography variant="body2" sx={{ color: '#d1d4dc' }}>
                  {message.text}
                </Typography>
              </MessageBubble>
              <Typography variant="caption" sx={{ 
                color: '#9e9e9e', 
                display: 'block',
                textAlign: message.isUser ? 'right' : 'left',
                mt: 0.5
              }}>
                {formatTime(message.timestamp)}
              </Typography>
            </Box>
            
            {message.isUser && (
              <StyledAvatar isUser={true}>
                <PersonIcon />
              </StyledAvatar>
            )}
          </MessageRow>
        ))}
        
        {loading && (
          <MessageRow isUser={false}>
            <StyledAvatar isUser={false}>
              <BotIcon />
            </StyledAvatar>
            <MessageBubble isUser={false}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#d1d4dc' }}>
                  Thinking...
                </Typography>
              </Box>
            </MessageBubble>
          </MessageRow>
        )}
        
        <div ref={chatEndRef} />
      </ChatContainer>
      
      <InputContainer>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Enter your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          disabled={loading}
        />
        <IconButton 
          color="primary" 
          onClick={handleSendMessage} 
          disabled={!input.trim() || loading}
          sx={{ 
            backgroundColor: '#303f9f',
            '&:hover': {
              backgroundColor: '#3949ab',
            },
            '&.Mui-disabled': {
              backgroundColor: '#1e2230',
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </Container>
  );
};

export default AskMeAnything; 