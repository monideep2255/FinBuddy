import { pgTable, text, serial, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
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
