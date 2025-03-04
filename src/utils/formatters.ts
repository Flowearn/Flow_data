/**
 * Formatter utilities
 * This file contains utility functions for formatting data
 */

/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency symbol (default: '$')
 * @param decimals - The number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: string = '$',
  decimals: number = 2
): string => {
  return `${currency}${value.toFixed(decimals)}`;
};

/**
 * Format a number as percentage
 * @param value - The number to format (e.g., 0.05 for 5%)
 * @param decimals - The number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format a number with thousands separators
 * @param value - The number to format
 * @param decimals - The number of decimal places (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Format a date as a string
 * @param date - The date to format (Date object or ISO string)
 * @param format - The format to use (default: 'MM-DD HH:mm')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  format: string = 'MM-DD HH:mm'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  
  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Format a time interval
 * @param interval - The interval string (e.g., '1m', '1h', '1d')
 * @returns Human-readable interval string
 */
export const formatInterval = (interval: string): string => {
  const value = interval.slice(0, -1);
  const unit = interval.slice(-1);
  
  const unitMap: Record<string, string> = {
    'm': 'Minute',
    'h': 'Hour',
    'd': 'Day',
    'w': 'Week',
    'M': 'Month'
  };
  
  const unitName = unitMap[unit] || unit;
  
  return `${value} ${unitName}${value !== '1' ? 's' : ''}`;
};

/**
 * Format a large number with abbreviations (K, M, B)
 * @param value - The number to format
 * @param decimals - The number of decimal places (default: 1)
 * @returns Formatted abbreviated number string
 */
export const formatLargeNumber = (value: number, decimals: number = 1): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  } else {
    return value.toFixed(decimals);
  }
}; 