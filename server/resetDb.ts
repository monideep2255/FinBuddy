import { db } from "./db";
import { topics, quizzes, userProgress, chatMessages } from "@shared/schema";
import { log } from "./vite";

/**
 * Reset the database by dropping all data
 * Run this script to reset the database before re-seeding
 */
export async function resetDatabase() {
  try {
    log("Resetting database...");
    
    // First delete chat messages (due to foreign key constraints)
    await db.delete(chatMessages);

    // Delete quizzes (due to foreign key constraints)
    await db.delete(quizzes);
    
    // Delete user progress
    await db.delete(userProgress);
    
    // Delete topics
    await db.delete(topics);
    
    log("Database reset completed.");
    return true;
  } catch (error) {
    console.error("Error resetting database:", error);
    return false;
  }
}

// This is used when the file is executed directly via node/tsx
// Not using require.main === module since we're using ES modules
// If you want to run this file directly, use:
// tsx server/resetDb.ts