import { useAllMarketData } from "@/hooks/use-market-data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketDataCard from "@/components/MarketDataCard";
import Disclaimer from "@/components/Disclaimer";
import { Loader2 } from "lucide-react";

export default function MarketDataPage() {
  const { data: allMarketData, isLoading, error } = useAllMarketData();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Header />
      
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
            Financial Market Data
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl mb-8">
            Real-time financial market data to help you understand economic trends and make informed financial decisions.
          </p>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400">Loading market data...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="p-6 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg my-6">
              <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Error loading market data</h3>
              <p className="text-red-600 dark:text-red-400 mb-4">
                {error instanceof Error ? error.message : 'Please try again later.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Market data display */}
          {!isLoading && !error && allMarketData && (
            <div className="space-y-12">
              {/* Stock Indices */}
              <section>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  Stock Indices
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Stock market indices measure the performance of groups of stocks, providing a snapshot of market performance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  Treasury Yields
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Treasury yields represent the return on investment for U.S. government debt obligations. They are key indicators of economic sentiment and future interest rate expectations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  Interest Rates & Inflation
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Interest rates and inflation metrics are critical economic indicators that affect everything from mortgage rates to the stock market and overall economic growth.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <MarketDataCard
                      data={allMarketData.interestRates.fedFunds}
                      isLoading={isLoading}
                      title="Federal Funds Rate"
                    />
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                      The Federal Funds Rate is the target interest rate set by the Federal Reserve for overnight lending between banks. It influences all other interest rates in the economy.
                    </p>
                  </div>
                  <div>
                    <MarketDataCard
                      data={allMarketData.inflation.cpi}
                      isLoading={isLoading}
                      title="Consumer Price Index (CPI)"
                    />
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                      The Consumer Price Index measures the average change in prices over time that consumers pay for a basket of goods and services, commonly used to identify periods of inflation.
                    </p>
                  </div>
                </div>
              </section>
              
              {/* Commodities */}
              <section>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  Commodities
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Commodities like gold and oil are important economic indicators and investment assets that often move independently of stock markets.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <MarketDataCard
                      data={allMarketData.commodities.gold}
                      isLoading={isLoading}
                      title="Gold"
                    />
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                      Gold is often seen as a safe-haven asset and inflation hedge. It typically performs well during times of economic uncertainty or inflationary pressures.
                    </p>
                  </div>
                  <div>
                    <MarketDataCard
                      data={allMarketData.commodities.oil}
                      isLoading={isLoading}
                      title="Oil"
                    />
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                      Oil prices affect everything from transportation costs to consumer goods prices. They are influenced by global supply and demand, geopolitical events, and economic growth.
                    </p>
                  </div>
                </div>
              </section>
              
              {/* Data disclaimer */}
              <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">About this Data</h3>
                <p className="text-blue-700 dark:text-blue-400 mb-3">
                  All market data is provided by Alpha Vantage API and is updated approximately every 5 minutes during market hours.
                </p>
                <ul className="list-disc list-inside text-blue-700 dark:text-blue-400 space-y-1 text-sm">
                  <li>S&P 500 data is represented by SPY ETF (SPDR S&P 500 ETF Trust)</li>
                  <li>NASDAQ data is represented by QQQ ETF (Invesco QQQ Trust)</li>
                  <li>Gold data is represented by GLD ETF (SPDR Gold Shares)</li>
                  <li>Oil data is represented by USO ETF (United States Oil Fund)</li>
                  <li>Treasury yields, Federal Funds Rate, and CPI data are sourced directly from Alpha Vantage's economic indicators API</li>
                </ul>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-3">
                  Data is for informational purposes only and should not be considered financial advice.
                </p>
              </div>
            </div>
          )}
        </section>
        
        {/* Legal Disclaimer */}
        <Disclaimer />
      </main>
      
      <Footer />
    </div>
  );
}