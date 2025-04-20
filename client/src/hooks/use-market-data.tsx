import { useQuery } from "@tanstack/react-query";
import { 
  MarketData,
  AllMarketData
} from "@/lib/types";
import { getQueryFn } from "@/lib/queryClient";

/**
 * Hook to fetch all market data
 */
export function useAllMarketData() {
  return useQuery<AllMarketData>({
    queryKey: ["/api/market-data"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3
  });
}

/**
 * Hook to fetch S&P 500 data
 */
export function useSP500Data() {
  return useQuery<MarketData>({
    queryKey: ["/api/market-data/sp500"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3
  });
}

/**
 * Hook to fetch NASDAQ data
 */
export function useNasdaqData() {
  return useQuery<MarketData>({
    queryKey: ["/api/market-data/nasdaq"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3
  });
}

/**
 * Hook to fetch Treasury Yields data
 * @param maturity '10y' or '2y'
 */
export function useTreasuryYieldsData(maturity: '10y' | '2y') {
  return useQuery<MarketData>({
    queryKey: ["/api/market-data/treasury", maturity],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3
  });
}

/**
 * Hook to fetch Federal Funds Rate data
 */
export function useFedFundsRateData() {
  return useQuery<MarketData>({
    queryKey: ["/api/market-data/fed-funds"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3
  });
}

/**
 * Hook to fetch CPI (inflation) data
 */
export function useCPIData() {
  return useQuery<MarketData>({
    queryKey: ["/api/market-data/cpi"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3
  });
}

/**
 * Hook to fetch commodity data
 * @param symbol 'gold' or 'oil'
 */
export function useCommodityData(symbol: 'gold' | 'oil') {
  return useQuery<MarketData>({
    queryKey: ["/api/market-data/commodity", symbol],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3
  });
}