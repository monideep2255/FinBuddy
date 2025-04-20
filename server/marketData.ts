/**
 * Market Data Module
 * 
 * This module handles fetching live market data from Alpha Vantage API
 * and formatting it for display in the FinBuddy application.
 */

import fetch from 'node-fetch';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export interface MarketDataPoint {
  date: string;
  value: number;
}

export interface MarketData {
  currentValue: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  historicalData: MarketDataPoint[];
  symbol: string;
  name: string;
}

/**
 * Formats date from Alpha Vantage API to a user-friendly format
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get S&P 500 index data
 */
export async function getSP500Data(): Promise<MarketData> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=SPY&outputsize=compact&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json() as any;
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort().reverse();
    
    // Get current and previous day values
    const currentValue = parseFloat(timeSeries[dates[0]]['4. close']);
    const previousValue = parseFloat(timeSeries[dates[1]]['4. close']);
    
    // Calculate change and percent change
    const change = currentValue - previousValue;
    const changePercent = (change / previousValue) * 100;
    
    // Format historical data points (last 30 days)
    const historicalData: MarketDataPoint[] = dates
      .slice(0, 30)
      .map(date => ({
        date: formatDate(date),
        value: parseFloat(timeSeries[date]['4. close'])
      }));
    
    return {
      currentValue,
      change,
      changePercent,
      lastUpdated: formatDate(dates[0]),
      historicalData,
      symbol: 'SPY',
      name: 'S&P 500 ETF'
    };
  } catch (error) {
    console.error('Error fetching S&P 500 data:', error);
    throw error;
  }
}

/**
 * Get NASDAQ data (using QQQ ETF as proxy)
 */
export async function getNasdaqData(): Promise<MarketData> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=QQQ&outputsize=compact&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json() as any;
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort().reverse();
    
    // Get current and previous day values
    const currentValue = parseFloat(timeSeries[dates[0]]['4. close']);
    const previousValue = parseFloat(timeSeries[dates[1]]['4. close']);
    
    // Calculate change and percent change
    const change = currentValue - previousValue;
    const changePercent = (change / previousValue) * 100;
    
    // Format historical data points (last 30 days)
    const historicalData: MarketDataPoint[] = dates
      .slice(0, 30)
      .map(date => ({
        date: formatDate(date),
        value: parseFloat(timeSeries[date]['4. close'])
      }));
    
    return {
      currentValue,
      change,
      changePercent,
      lastUpdated: formatDate(dates[0]),
      historicalData,
      symbol: 'QQQ',
      name: 'NASDAQ-100 ETF'
    };
  } catch (error) {
    console.error('Error fetching NASDAQ data:', error);
    throw error;
  }
}

/**
 * Get Treasury Yield data
 */
export async function getTreasuryYieldData(maturity: '10year' | '2year'): Promise<MarketData> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TREASURY_YIELD&interval=daily&maturity=${maturity}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json() as any;
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    const dataPoints = data['data'];
    
    if (!dataPoints || !Array.isArray(dataPoints) || dataPoints.length === 0) {
      throw new Error('No treasury yield data available');
    }
    
    // Sort data by date (descending)
    dataPoints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Get current and previous values
    const currentValue = parseFloat(dataPoints[0].value);
    const previousValue = parseFloat(dataPoints[1].value);
    
    // Calculate change and percent change
    const change = currentValue - previousValue;
    const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
    
    // Format historical data points (last 30 days)
    const historicalData: MarketDataPoint[] = dataPoints
      .slice(0, 30)
      .map(point => ({
        date: formatDate(point.date),
        value: parseFloat(point.value)
      }));
    
    const name = maturity === '10year' ? '10-Year Treasury Yield' : '2-Year Treasury Yield';
    
    return {
      currentValue,
      change,
      changePercent,
      lastUpdated: formatDate(dataPoints[0].date),
      historicalData,
      symbol: maturity === '10year' ? 'UST10Y' : 'UST2Y',
      name
    };
  } catch (error) {
    console.error(`Error fetching Treasury yield (${maturity}) data:`, error);
    throw error;
  }
}

/**
 * Get Federal Funds Rate data
 */
export async function getFederalFundsRateData(): Promise<MarketData> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=FEDERAL_FUNDS_RATE&interval=daily&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json() as any;
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    const dataPoints = data['data'];
    
    if (!dataPoints || !Array.isArray(dataPoints) || dataPoints.length === 0) {
      throw new Error('No Federal Funds Rate data available');
    }
    
    // Sort data by date (descending)
    dataPoints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Get current and previous values
    const currentValue = parseFloat(dataPoints[0].value);
    const previousValue = parseFloat(dataPoints[1].value);
    
    // Calculate change and percent change
    const change = currentValue - previousValue;
    const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
    
    // Format historical data points (last 30 days or however many are available)
    const historicalData: MarketDataPoint[] = dataPoints
      .slice(0, 30)
      .map(point => ({
        date: formatDate(point.date),
        value: parseFloat(point.value)
      }));
    
    return {
      currentValue,
      change,
      changePercent,
      lastUpdated: formatDate(dataPoints[0].date),
      historicalData,
      symbol: 'FED',
      name: 'Federal Funds Rate'
    };
  } catch (error) {
    console.error('Error fetching Federal Funds Rate data:', error);
    throw error;
  }
}

/**
 * Get CPI (Consumer Price Index) data for inflation
 */
export async function getCPIData(): Promise<MarketData> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=CPI&interval=monthly&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json() as any;
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    const dataPoints = data['data'];
    
    if (!dataPoints || !Array.isArray(dataPoints) || dataPoints.length === 0) {
      throw new Error('No CPI data available');
    }
    
    // Sort data by date (descending)
    dataPoints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Get current and previous values
    const currentValue = parseFloat(dataPoints[0].value);
    const previousValue = parseFloat(dataPoints[1].value);
    
    // Calculate change and percent change
    const change = currentValue - previousValue;
    const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
    
    // Format historical data points (last 12 months)
    const historicalData: MarketDataPoint[] = dataPoints
      .slice(0, 12)
      .map(point => ({
        date: formatDate(point.date),
        value: parseFloat(point.value)
      }));
    
    return {
      currentValue,
      change,
      changePercent,
      lastUpdated: formatDate(dataPoints[0].date),
      historicalData,
      symbol: 'CPI',
      name: 'Consumer Price Index'
    };
  } catch (error) {
    console.error('Error fetching CPI data:', error);
    throw error;
  }
}

/**
 * Get commodity data (Gold or Crude Oil)
 */
export async function getCommodityData(symbol: string): Promise<MarketData> {
  try {
    // For commodities, we can use the TIME_SERIES_DAILY function with appropriate symbols
    // GLD ETF for Gold, USO ETF for Oil
    const commoditySymbol = symbol.toUpperCase() === 'GOLD' ? 'GLD' : 'USO';
    const commodityName = symbol.toUpperCase() === 'GOLD' ? 'Gold ETF' : 'Oil ETF';
    
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${commoditySymbol}&outputsize=compact&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json() as any;
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort().reverse();
    
    // Get current and previous day values
    const currentValue = parseFloat(timeSeries[dates[0]]['4. close']);
    const previousValue = parseFloat(timeSeries[dates[1]]['4. close']);
    
    // Calculate change and percent change
    const change = currentValue - previousValue;
    const changePercent = (change / previousValue) * 100;
    
    // Format historical data points (last 30 days)
    const historicalData: MarketDataPoint[] = dates
      .slice(0, 30)
      .map(date => ({
        date: formatDate(date),
        value: parseFloat(timeSeries[date]['4. close'])
      }));
    
    return {
      currentValue,
      change,
      changePercent,
      lastUpdated: formatDate(dates[0]),
      historicalData,
      symbol: commoditySymbol,
      name: commodityName
    };
  } catch (error) {
    console.error(`Error fetching ${symbol} data:`, error);
    throw error;
  }
}

/**
 * Get all market data needed for the application
 */
export async function getAllMarketData() {
  try {
    const [
      sp500Data,
      nasdaqData,
      treasury10YData,
      treasury2YData,
      fedFundsData,
      cpiData,
      goldData,
      oilData
    ] = await Promise.all([
      getSP500Data().catch(error => {
        console.error('Error fetching S&P 500 data:', error);
        return null;
      }),
      getNasdaqData().catch(error => {
        console.error('Error fetching NASDAQ data:', error);
        return null;
      }),
      getTreasuryYieldData('10year').catch(error => {
        console.error('Error fetching 10Y Treasury data:', error);
        return null;
      }),
      getTreasuryYieldData('2year').catch(error => {
        console.error('Error fetching 2Y Treasury data:', error);
        return null;
      }),
      getFederalFundsRateData().catch(error => {
        console.error('Error fetching Fed Funds Rate data:', error);
        return null;
      }),
      getCPIData().catch(error => {
        console.error('Error fetching CPI data:', error);
        return null;
      }),
      getCommodityData('GOLD').catch(error => {
        console.error('Error fetching Gold data:', error);
        return null;
      }),
      getCommodityData('OIL').catch(error => {
        console.error('Error fetching Oil data:', error);
        return null;
      })
    ]);

    return {
      stockIndices: {
        sp500: sp500Data,
        nasdaq: nasdaqData
      },
      treasuryYields: {
        tenYear: treasury10YData,
        twoYear: treasury2YData
      },
      interestRates: {
        fedFunds: fedFundsData
      },
      inflation: {
        cpi: cpiData
      },
      commodities: {
        gold: goldData,
        oil: oilData
      }
    };
  } catch (error) {
    console.error('Error fetching all market data:', error);
    throw error;
  }
}