import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { MarketData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MarketDataCardProps {
  data: MarketData | null;
  isLoading: boolean;
  title?: string;
  className?: string;
}

export default function MarketDataCard({ 
  data, 
  isLoading, 
  title,
  className 
}: MarketDataCardProps) {
  const displayTitle = title || (data?.name || "Market Data");
  
  // Format currency with 2 decimal places
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format percentage with 2 decimal places
  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  // Format a number with 2 decimal places
  const formatNumber = (value: number) => {
    return value.toFixed(2);
  };
  
  // Format the value based on what type of data it is
  const formatValue = (value: number) => {
    // For stock indices and commodities, use currency format
    if (data?.symbol === 'SPY' || data?.symbol === 'QQQ' || 
        data?.symbol === 'GLD' || data?.symbol === 'USO') {
      return formatCurrency(value);
    }
    
    // For yields and rates, use percentage format with % sign
    if (data?.symbol === 'UST10Y' || data?.symbol === 'UST2Y' || 
        data?.symbol === 'FED') {
      return `${formatNumber(value)}%`;
    }
    
    // For CPI, just use the number
    if (data?.symbol === 'CPI') {
      return formatNumber(value);
    }
    
    // Default to just the number
    return formatNumber(value);
  };
  
  return (
    <div className={cn("p-4 rounded-lg border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{displayTitle}</h3>
            {data?.symbol && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
                {data.symbol}
              </span>
            )}
          </div>
          {data && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Last updated: {data.lastUpdated}
            </p>
          )}
        </div>
        
        {data && (
          <div className="text-right">
            <p className="text-2xl font-bold">{formatValue(data.currentValue)}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className={cn(
                "text-sm font-medium flex items-center",
                data.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {data.change >= 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                  </svg>
                )}
                {formatValue(Math.abs(data.change))}
              </span>
              <span className={cn(
                "text-xs py-0.5 px-1.5 rounded",
                data.change >= 0 ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : 
                                  "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
              )}>
                {formatPercent(data.changePercent)}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                today
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Previous close: {formatValue(data.currentValue - data.change)}
            </p>
          </div>
        )}
        
        {isLoading && (
          <div className="h-12 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
        )}
      </div>
      
      {/* Chart Info Header */}
      {data && !isLoading && (
        <div className="flex gap-2 mt-1 mb-2 border-t pt-3 border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between w-full text-xs text-neutral-600 dark:text-neutral-400">
            <div className="font-medium">Historical Data (30 Days)</div>
            <div className="text-xs text-neutral-500">
              Data shown: {data.historicalData?.[0]?.date} to {data.historicalData?.[data.historicalData.length-1]?.date}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-48">
        {data && data.historicalData && data.historicalData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...data.historicalData]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => {
                    // Only show certain dates to avoid crowding
                    const date = new Date(value);
                    // Show only 1st and 15th day of month
                    if (date.getDate() === 1 || date.getDate() === 15) {
                      return new Date(value).toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric'
                      });
                    }
                    return '';
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => {
                    // Simplify the y-axis labels
                    if (data.symbol === 'SPY' || data.symbol === 'QQQ' || 
                        data.symbol === 'GLD' || data.symbol === 'USO') {
                      return `$${value}`;
                    }
                    if (data.symbol === 'UST10Y' || data.symbol === 'UST2Y' || 
                        data.symbol === 'FED') {
                      return `${value}%`;
                    }
                    return value;
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => [formatValue(value), 'Value']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    color: '#333'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={data.change >= 0 ? "#10b981" : "#ef4444"} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-between text-xs text-neutral-500">
              <span>Previous close: {formatValue(data.currentValue - data.change)}</span>
              <span className="text-right">
                Updated: {new Date().toLocaleDateString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'America/New_York' 
                })} EDT
              </span>
            </div>
          </>
        ) : isLoading ? (
          <div className="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">No historical data available</p>
          </div>
        )}
      </div>
    </div>
  );
}