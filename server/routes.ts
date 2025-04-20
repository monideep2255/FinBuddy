import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTopicExplanation, generateQuizQuestions, generateChatResponse } from "./openai";
import { setupAuth } from "./auth";
import * as marketData from "./marketData";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Test endpoint
  app.get("/api/test", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ 
      status: "ok",
      message: "API is working",
      timestamp: new Date().toISOString()
    });
  });

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
      if (req.user && req.user.id !== userId) {
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
      if (req.user && req.user.id !== userId) {
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

  // Market Data API Routes

  // Get all market data
  app.get("/api/market-data", async (req, res) => {
    try {
      const data = await marketData.getAllMarketData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching all market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // Get S&P 500 data
  app.get("/api/market-data/sp500", async (req, res) => {
    try {
      const data = await marketData.getSP500Data();
      res.json(data);
    } catch (error) {
      console.error("Error fetching S&P 500 data:", error);
      res.status(500).json({ message: "Failed to fetch S&P 500 data" });
    }
  });

  // Get NASDAQ data
  app.get("/api/market-data/nasdaq", async (req, res) => {
    try {
      const data = await marketData.getNasdaqData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching NASDAQ data:", error);
      res.status(500).json({ message: "Failed to fetch NASDAQ data" });
    }
  });

  // Get Treasury Yield data (10 year or 2 year)
  app.get("/api/market-data/treasury/:maturity", async (req, res) => {
    try {
      const maturity = req.params.maturity === '10y' ? '10year' : '2year';
      const data = await marketData.getTreasuryYieldData(maturity as '10year' | '2year');
      res.json(data);
    } catch (error) {
      console.error(`Error fetching Treasury ${req.params.maturity} data:`, error);
      res.status(500).json({ message: `Failed to fetch Treasury ${req.params.maturity} data` });
    }
  });

  // Get Federal Funds Rate data
  app.get("/api/market-data/fed-funds", async (req, res) => {
    try {
      const data = await marketData.getFederalFundsRateData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching Federal Funds Rate data:", error);
      res.status(500).json({ message: "Failed to fetch Federal Funds Rate data" });
    }
  });

  // Get CPI data (inflation)
  app.get("/api/market-data/cpi", async (req, res) => {
    try {
      const data = await marketData.getCPIData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching CPI data:", error);
      res.status(500).json({ message: "Failed to fetch CPI data" });
    }
  });

  // Get commodity data (Gold or Oil)
  app.get("/api/market-data/commodity/:symbol", async (req, res) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      if (symbol !== 'GOLD' && symbol !== 'OIL') {
        return res.status(400).json({ message: "Invalid commodity symbol. Use 'gold' or 'oil'." });
      }

      const data = await marketData.getCommodityData(symbol);
      res.json(data);
    } catch (error) {
      console.error(`Error fetching ${req.params.symbol} data:`, error);
      res.status(500).json({ message: `Failed to fetch ${req.params.symbol} data` });
    }
  });
  
  // Chat API Routes
  
  // Submit a question to the chat (Ask-Me-Anything)
  app.post("/api/chat", async (req, res) => {
    try {
      const { question, userId } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ message: "Question is required" });
      }
      
      // Get all topics to provide context for the AI
      const topics = await storage.getAllTopics();
      
      // Generate response using OpenAI
      const chatResponse = await generateChatResponse(question, topics);
      
      // Save the chat message to the database for history
      const savedMessage = await storage.saveChatMessage({
        userId: userId || null, // Anonymous users will have null userId
        question,
        answer: chatResponse.answer,
        example: chatResponse.example,
        relatedTopicId: chatResponse.relatedTopic.id || null,
        relatedTopicTitle: chatResponse.relatedTopic.title
      });
      
      // Return the generated response with the message ID for reference
      res.status(201).json({
        id: savedMessage.id,
        question,
        response: chatResponse,
        timestamp: savedMessage.timestamp
      });
    } catch (error) {
      console.error("Error processing chat question:", error);
      res.status(500).json({ message: "Failed to process chat question" });
    }
  });
  
  // Get chat history for a user
  app.get("/api/chat/history", async (req, res) => {
    try {
      // If authenticated, use the user's ID, otherwise treat as anonymous
      const userId = req.isAuthenticated() ? (req.user as any).id : null;
      const history = await storage.getUserChatHistory(userId);
      
      res.json(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}