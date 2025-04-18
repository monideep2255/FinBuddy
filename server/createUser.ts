import { db } from "./db";
import { users } from "@shared/schema";
import { log } from "./vite";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createDemoUser() {
  try {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, "demo"));
    
    if (existingUser.length > 0) {
      log("Demo user already exists, skipping creation");
      return;
    }
    
    // Create a demo user
    const hashedPassword = await hashPassword("demo123");
    
    await db.insert(users).values({
      username: "demo",
      password: hashedPassword
    });
    
    log("Demo user created successfully");
  } catch (error) {
    console.error("Error creating demo user:", error);
  }
}

// Run the function
createDemoUser()
  .then(() => console.log("Demo user creation complete"))
  .catch(err => {
    console.error(err);
  });

export { createDemoUser };