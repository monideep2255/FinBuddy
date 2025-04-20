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
          {/* Stock Indices */}
          <section>
            <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Stock Indices
            </h4>
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
            <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Treasury Yields
            </h4>
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
            <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Interest Rates & Inflation
            </h4>
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
            <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Commodities
            </h4>
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
          
          {/* Data disclaimer */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
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