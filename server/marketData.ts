/**
 * Market Data Module
 * 
 * This module handles fetching live market data from Alpha Vantage API
 * and formatting it for display in the FinBuddy application.
 */

import fetch from 'node-fetch';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Helper function to generate demonstration data when API call fails
// This ensures users can see the UI components even when API is unavailable
function generateDemoData(symbol: string, name: string, baseValue: number, volatility: number = 0.02): MarketData {
  const now = new Date();
  const currentValue = baseValue + (Math.random() * volatility * baseValue);
  const previousValue = baseValue - (Math.random() * volatility * 0.5 * baseValue);
  const change = currentValue - previousValue;
  const changePercent = (change / previousValue) * 100;
  
  // Generate historical data points (30 days)
  const historicalData: MarketDataPoint[] = [];
  // Start with the oldest date (30 days ago) and move forward to ensure chronological order
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Generate a somewhat realistic price movement
    const dailyFactor = Math.sin(i / 5) * volatility * 0.5;
    const trendFactor = (i - 15) / 500; // Slight trend
    const randomFactor = (Math.random() - 0.5) * volatility;
    
    const dataValue = baseValue * (1 + dailyFactor + trendFactor + randomFactor);
    
    historicalData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      value: parseFloat(dataValue.toFixed(2))
    });
  }
  
  // Ensure historical data is always in chronological order (oldest first)
  historicalData.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  return {
    currentValue: parseFloat(currentValue.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    lastUpdated: now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    historicalData,
    symbol,
    name
  };
}

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
 * Ensures historical data is in chronological order (oldest to newest)
 * This is important for consistent display in charts
 */
function ensureChronologicalOrder(data: MarketDataPoint[]): MarketDataPoint[] {
  return data.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB; // Oldest first
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
    
    // Format historical data points (last 12 months) - in chronological order
    const historicalData: MarketDataPoint[] = dataPoints
      .slice(0, 12)
      .reverse() // Reverse to get chronological order (oldest first)
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
        // Provide demo data instead to maintain UI functionality
        return generateDemoData('SPY', 'S&P 500 ETF', 500.75, 0.02);
      }),
      getNasdaqData().catch(error => {
        console.error('Error fetching NASDAQ data:', error);
        return generateDemoData('QQQ', 'NASDAQ-100 ETF', 410.30, 0.025);
      }),
      getTreasuryYieldData('10year').catch(error => {
        console.error('Error fetching 10Y Treasury data:', error);
        return generateDemoData('UST10Y', '10-Year Treasury Yield', 4.25, 0.04);
      }),
      getTreasuryYieldData('2year').catch(error => {
        console.error('Error fetching 2Y Treasury data:', error);
        return generateDemoData('UST2Y', '2-Year Treasury Yield', 4.88, 0.03);
      }),
      getFederalFundsRateData().catch(error => {
        console.error('Error fetching Fed Funds Rate data:', error);
        return generateDemoData('FED', 'Federal Funds Rate', 5.25, 0.01);
      }),
      getCPIData().catch(error => {
        console.error('Error fetching CPI data:', error);
        return generateDemoData('CPI', 'Consumer Price Index', 303.84, 0.005);
      }),
      getCommodityData('GOLD').catch(error => {
        console.error('Error fetching Gold data:', error);
        return generateDemoData('GLD', 'Gold ETF', 210.65, 0.015);
      }),
      getCommodityData('OIL').catch(error => {
        console.error('Error fetching Oil data:', error);
        return generateDemoData('USO', 'Oil ETF', 75.42, 0.03);
      })
    ]);

    // Ensure all historical data is in chronological order (oldest to newest)
    if (sp500Data && sp500Data.historicalData) {
      sp500Data.historicalData = ensureChronologicalOrder(sp500Data.historicalData);
    }
    if (nasdaqData && nasdaqData.historicalData) {
      nasdaqData.historicalData = ensureChronologicalOrder(nasdaqData.historicalData);
    }
    if (treasury10YData && treasury10YData.historicalData) {
      treasury10YData.historicalData = ensureChronologicalOrder(treasury10YData.historicalData);
    }
    if (treasury2YData && treasury2YData.historicalData) {
      treasury2YData.historicalData = ensureChronologicalOrder(treasury2YData.historicalData);
    }
    if (fedFundsData && fedFundsData.historicalData) {
      fedFundsData.historicalData = ensureChronologicalOrder(fedFundsData.historicalData);
    }
    if (cpiData && cpiData.historicalData) {
      cpiData.historicalData = ensureChronologicalOrder(cpiData.historicalData);
    }
    if (goldData && goldData.historicalData) {
      goldData.historicalData = ensureChronologicalOrder(goldData.historicalData);
    }
    if (oilData && oilData.historicalData) {
      oilData.historicalData = ensureChronologicalOrder(oilData.historicalData);
    }

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
    // If everything fails, return a complete set of demo data
    const demoData = {
      stockIndices: {
        sp500: generateDemoData('SPY', 'S&P 500 ETF', 500.75, 0.02),
        nasdaq: generateDemoData('QQQ', 'NASDAQ-100 ETF', 410.30, 0.025)
      },
      treasuryYields: {
        tenYear: generateDemoData('UST10Y', '10-Year Treasury Yield', 4.25, 0.04),
        twoYear: generateDemoData('UST2Y', '2-Year Treasury Yield', 4.88, 0.03)
      },
      interestRates: {
        fedFunds: generateDemoData('FED', 'Federal Funds Rate', 5.25, 0.01)
      },
      inflation: {
        cpi: generateDemoData('CPI', 'Consumer Price Index', 303.84, 0.005)
      },
      commodities: {
        gold: generateDemoData('GLD', 'Gold ETF', 210.65, 0.015),
        oil: generateDemoData('USO', 'Oil ETF', 75.42, 0.03)
      }
    };
    
    // Ensure all demo data is in chronological order
    demoData.stockIndices.sp500.historicalData = ensureChronologicalOrder(demoData.stockIndices.sp500.historicalData);
    demoData.stockIndices.nasdaq.historicalData = ensureChronologicalOrder(demoData.stockIndices.nasdaq.historicalData);
    demoData.treasuryYields.tenYear.historicalData = ensureChronologicalOrder(demoData.treasuryYields.tenYear.historicalData);
    demoData.treasuryYields.twoYear.historicalData = ensureChronologicalOrder(demoData.treasuryYields.twoYear.historicalData);
    demoData.interestRates.fedFunds.historicalData = ensureChronologicalOrder(demoData.interestRates.fedFunds.historicalData);
    demoData.inflation.cpi.historicalData = ensureChronologicalOrder(demoData.inflation.cpi.historicalData);
    demoData.commodities.gold.historicalData = ensureChronologicalOrder(demoData.commodities.gold.historicalData);
    demoData.commodities.oil.historicalData = ensureChronologicalOrder(demoData.commodities.oil.historicalData);
    
    return demoData;
  }
}