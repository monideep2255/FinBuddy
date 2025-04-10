import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTopicExplanation, generateQuizQuestions } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);

  return httpServer;
}
