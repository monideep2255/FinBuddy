import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTopicExplanation, generateQuizQuestions } from "./openai";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // Get all topics
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  // Get a specific topic by ID
  app.get("/api/topics/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const topic = await storage.getTopicById(id);
      
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });

  // Get quiz for a specific topic
  app.get("/api/topics/:id/quiz", async (req, res) => {
    try {
      const topicId = parseInt(req.params.id);
      const topic = await storage.getTopicById(topicId);
      
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      
      let quiz = await storage.getQuizByTopicId(topicId);
      
      if (!quiz) {
        // Generate a quiz if it doesn't exist
        const questions = await generateQuizQuestions(topic.title);
        quiz = await storage.createQuiz({
          topicId,
          questions
        });
      }
      
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch or generate quiz" });
    }
  });

  // Create a new topic
  app.post("/api/topics", async (req, res) => {
    try {
      const { title, description, category, readingTime } = req.body;
      
      if (!title || !description || !category || !readingTime) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Generate content using OpenAI
      const content = await generateTopicExplanation(title);
      
      const newTopic = await storage.createTopic({
        title,
        description,
        category,
        readingTime,
        content,
        createdAt: new Date().toISOString()
      });
      
      res.status(201).json(newTopic);
    } catch (error) {
      res.status(500).json({ message: "Failed to create topic" });
    }
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "You must be logged in to access this resource" });
  };

  // Get user progress - requires authentication
  app.get("/api/users/:userId/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Make sure the user can only access their own progress
      if (req.user.id !== userId) {
        return res.status(403).json({ message: "You can only access your own progress" });
      }
      
      // Get all progress entries for this user
      const progressEntries = await storage.getUserProgress(userId);
      
      // Get completed topics
      const completedTopics = await storage.getCompletedTopics(userId);
      
      res.json({
        userId,
        progressEntries,
        completedTopics,
        totalComplete: completedTopics.length
      });
    } catch (error) {
      console.error(`Error getting progress for user ${req.params.userId}:`, error);
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });
  
  // Update topic progress - requires authentication
  app.post("/api/users/:userId/topics/:topicId/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const topicId = parseInt(req.params.topicId);
      
      // Make sure the user can only update their own progress
      if (req.user.id !== userId) {
        return res.status(403).json({ message: "You can only update your own progress" });
      }
      
      // Check if the topic exists
      const topic = await storage.getTopicById(topicId);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      
      // Update the progress
      const progress = await storage.updateTopicProgress(userId, topicId, req.body);
      
      res.json(progress);
    } catch (error) {
      console.error(`Error updating progress for user ${req.params.userId} on topic ${req.params.topicId}:`, error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
