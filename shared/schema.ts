import { pgTable, text, serial, integer, jsonb, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Database Tables
 */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  readingTime: text("reading_time").notNull(),
  content: jsonb("content").notNull(),
  createdAt: text("created_at").notNull(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").references(() => topics.id).notNull(),
  questions: jsonb("questions").notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  topicId: integer("topic_id").references(() => topics.id).notNull(),
  completed: boolean("completed").default(false).notNull(),
  quizScore: integer("quiz_score"),
  quizAttempts: integer("quiz_attempts").default(0).notNull(),
  lastAccessed: timestamp("last_accessed").defaultNow().notNull(),
  notes: text("notes"),
  bookmarked: boolean("bookmarked").default(false).notNull(),
  difficultyRating: integer("difficulty_rating"), // User-rated difficulty (1-5)
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTopicSchema = createInsertSchema(topics).pick({
  title: true,
  description: true,
  category: true,
  readingTime: true,
  content: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  topicId: true,
  questions: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  topicId: true,
  completed: true,
  quizScore: true,
  quizAttempts: true,
  lastAccessed: true,
  notes: true,
  bookmarked: true,
  difficultyRating: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type Topic = typeof topics.$inferSelect;

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export interface QuizQuestion {
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

export interface TopicContent {
  explanation: string;
  realWorldExample: string;
}

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  example: text("example").notNull(),
  relatedTopicId: integer("related_topic_id").references(() => topics.id),
  relatedTopicTitle: text("related_topic_title").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  question: true,
  answer: true,
  example: true,
  relatedTopicId: true,
  relatedTopicTitle: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export interface ChatResponse {
  answer: string;
  example: string;
  relatedTopic: {
    id?: number;
    title: string;
  };
}

/**
 * Economic Scenario Tables and Types
 */

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "Monetary Policy", "Inflation", "Trade"
  scenarioType: text("scenario_type").notNull(),  // e.g., "predefined", "custom"
  details: jsonb("details").notNull(), // Economic change details
  impacts: jsonb("impacts").notNull(), // Impacts on various markets
  createdAt: timestamp("created_at").defaultNow().notNull(),
  difficulty: integer("difficulty").default(1).notNull(), // 1-3 (Beginner, Intermediate, Advanced)
  popularity: integer("popularity").default(0).notNull(), // Count of times the scenario has been run
  relatedTopicIds: integer("related_topic_ids").array().notNull(), // IDs of related topics for learning
});

export const userScenarios = pgTable("user_scenarios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  scenarioId: integer("scenario_id").references(() => scenarios.id).notNull(),
  customParameters: jsonb("custom_parameters"), // User's custom scenario parameters
  userNotes: text("user_notes"),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
  favorite: boolean("favorite").default(false).notNull(),
});

export const insertScenarioSchema = createInsertSchema(scenarios).pick({
  title: true,
  description: true,
  category: true,
  scenarioType: true,
  details: true,
  impacts: true,
  difficulty: true,
  relatedTopicIds: true,
});

export const insertUserScenarioSchema = createInsertSchema(userScenarios).pick({
  userId: true,
  scenarioId: true,
  customParameters: true,
  userNotes: true,
  favorite: true,
});

export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type Scenario = typeof scenarios.$inferSelect;

export type InsertUserScenario = z.infer<typeof insertUserScenarioSchema>;
export type UserScenario = typeof userScenarios.$inferSelect;

export interface ScenarioDetails {
  change: {
    type: string;         // e.g., "interest_rate", "tariff", "inflation"
    value: number;        // Numeric value of the change
    direction: string;    // "increase" or "decrease"
    magnitude: string;    // "slight", "moderate", "significant"
    rationale: string;    // Brief explanation of why this change occurred
  };
  timeframe: string;      // e.g., "immediate", "short_term", "long_term"
}

export interface ScenarioImpact {
  markets: {
    stocks: {
      overall: number;      // Overall impact score (-10 to 10)
      description: string;  // Description of impact
      sectors: {            // Sector-specific impacts
        [key: string]: {
          impact: number;
          reason: string;
        }
      }
    };
    bonds: {
      overall: number;
      description: string;
      types: {              // Different bond types impacts
        [key: string]: {
          impact: number;
          reason: string;
        }
      }
    };
    commodities: {
      gold: number;
      oil: number;
      description: string;
    };
    economy: {
      employment: number;
      inflation: number;
      gdp: number;
      description: string;
    };
  };
  analysis: string;        // Comprehensive analysis of impacts
  learningPoints: string[];  // Key learning points about this scenario
}
