export interface Topic {
  id: number;
  title: string;
  description: string;
  category: string;
  readingTime: string;
  content: {
    explanation: string;
    realWorldExample: string;
  };
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

export interface Quiz {
  id: number;
  topicId: number;
  questions: QuizQuestion[];
}

export interface UserProgress {
  id: number;
  userId: number;
  topicId: number;
  completed: boolean;
  quizScore: number | null;
  quizAttempts: number;
  lastAccessed: string;
  notes: string | null;
}

export interface UserProgressResponse {
  userId: number;
  progressEntries: UserProgress[];
  completedTopics: number[];
  totalComplete: number;
}

// Market Data Types
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

export interface AllMarketData {
  stockIndices: {
    sp500: MarketData | null;
    nasdaq: MarketData | null;
  };
  treasuryYields: {
    tenYear: MarketData | null;
    twoYear: MarketData | null;
  };
  interestRates: {
    fedFunds: MarketData | null;
  };
  inflation: {
    cpi: MarketData | null;
  };
  commodities: {
    gold: MarketData | null;
    oil: MarketData | null;
  };
}
