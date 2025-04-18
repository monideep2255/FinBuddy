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
