import { db } from "./db";
import { users } from "@shared/schema";
import { log } from "./vite";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createDemoUser() {
  try {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(({ id }) => id.equals(1));
    
    if (existingUser.length > 0) {
      log("Demo user already exists, skipping creation");
      return;
    }
    
    // Create a demo user
    const hashedPassword = await hashPassword("demo123");
    
    await db.insert(users).values({
      id: 1,
      username: "demo",
      password: hashedPassword,
      email: "demo@example.com",
      name: "Demo User",
      created_at: new Date()
    });
    
    log("Demo user created successfully");
  } catch (error) {
    console.error("Error creating demo user:", error);
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  createDemoUser()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

export { createDemoUser };