import { useAllMarketData } from "@/hooks/use-market-data";
import MarketDataCard from "./MarketDataCard";
import { Loader2 } from "lucide-react";

interface LiveDataTabProps {
  title: string;
}

export default function LiveDataTab({ title }: LiveDataTabProps) {
  const { data: allMarketData, isLoading, error } = useAllMarketData();

  return (
    <div className="py-6 font-serif w-full">
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
        Live Market Data: {title}
      </h3>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Loading market data...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg my-4">
          <p className="text-red-800 dark:text-red-300 font-medium">Error loading market data</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {error instanceof Error ? error.message : 'Please try again later.'}
          </p>
        </div>
      )}
      
      {/* Market data display */}
      {!isLoading && !error && allMarketData && (
        <div className="space-y-8">
          {/* Introduction and Connection to Topic */}
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 p-4 rounded-lg mb-6">
            <h4 className="text-lg font-medium text-primary-800 dark:text-primary-300 mb-2">
              Understanding {title} with Live Market Data
            </h4>
            <p className="text-primary-700 dark:text-primary-400 text-sm mb-3">
              Financial markets provide real-time insights into how economic concepts like {title.toLowerCase()} work in the real world. 
              Explore the current data below to see these principles in action.
            </p>
            <div className="flex items-start text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              <p className="text-primary-700 dark:text-primary-400">
                For more detailed analysis, visit our <a href="/market-data" className="underline font-medium">Market Data Dashboard</a> to see comprehensive data with explanations.
              </p>
            </div>
          </div>
          
          {/* Stock Indices */}
          <section>
            <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Stock Indices
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
              Stock market indices measure the performance of groups of stocks, providing a snapshot of overall market health.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarketDataCard
                data={allMarketData.stockIndices.sp500}
                isLoading={isLoading}
                title="S&P 500"
              />
              <MarketDataCard
                data={allMarketData.stockIndices.nasdaq}
                isLoading={isLoading}
                title="NASDAQ"
              />
            </div>
          </section>
          
          {/* Treasury Yields */}
          <section>
            <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Treasury Yields
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
              Treasury yields are interest rates on U.S. government debt and are key indicators of economic expectations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarketDataCard
                data={allMarketData.treasuryYields.tenYear}
                isLoading={isLoading}
                title="10-Year Treasury Yield"
              />
              <MarketDataCard
                data={allMarketData.treasuryYields.twoYear}
                isLoading={isLoading}
                title="2-Year Treasury Yield"
              />
            </div>
          </section>
          
          {/* Interest Rates & Inflation */}
          <section>
            <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Interest Rates & Inflation
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
              Interest rates and inflation metrics are critical economic indicators that affect borrowing costs and purchasing power.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarketDataCard
                data={allMarketData.interestRates.fedFunds}
                isLoading={isLoading}
                title="Federal Funds Rate"
              />
              <MarketDataCard
                data={allMarketData.inflation.cpi}
                isLoading={isLoading}
                title="Consumer Price Index (CPI)"
              />
            </div>
          </section>
          
          {/* Commodities */}
          <section>
            <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Commodities
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
              Commodities like gold and oil often move independently of stock markets and can serve as inflation hedges or economic indicators.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarketDataCard
                data={allMarketData.commodities.gold}
                isLoading={isLoading}
                title="Gold"
              />
              <MarketDataCard
                data={allMarketData.commodities.oil}
                isLoading={isLoading}
                title="Oil"
              />
            </div>
          </section>
          
          {/* How to use this data */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              How to Use This Data
            </h4>
            <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400 text-sm space-y-1">
              <li>Green values indicate increases, red values indicate decreases</li>
              <li>Hover over charts to see detailed values at specific dates</li>
              <li>Look for correlations between different metrics to understand market relationships</li>
              <li>Consider how changes in these metrics relate to the topic of {title}</li>
            </ul>
          </div>
          
          {/* Data disclaimer */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-1 font-medium">
              Data Information
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Market data is provided by Alpha Vantage. Data is refreshed approximately every 5 minutes.
              S&P 500 data is represented by SPY ETF and NASDAQ data by QQQ ETF. Gold data is represented by GLD ETF and Oil data by USO ETF.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}