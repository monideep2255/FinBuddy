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
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{displayTitle}</h3>
          {data && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Last updated: {data.lastUpdated}</p>
          )}
        </div>
        
        {data && (
          <div className="text-right">
            <p className="text-2xl font-bold">{formatValue(data.currentValue)}</p>
            <p className={cn(
              "text-sm font-medium",
              data.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {data.change >= 0 ? "+" : ""}{formatValue(data.change)} ({formatPercent(data.changePercent)})
            </p>
          </div>
        )}
        
        {isLoading && (
          <div className="h-12 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
        )}
      </div>
      
      {/* Chart */}
      <div className="h-48 mt-4">
        {data && data.historicalData && data.historicalData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...data.historicalData].reverse()}>
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