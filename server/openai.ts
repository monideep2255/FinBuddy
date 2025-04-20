import OpenAI from "openai";
import { QuizQuestion, TopicContent } from "@shared/schema";
import { log } from "./vite";

// Define the chat response interface
export interface ChatResponse {
  answer: string;
  example: string;
  relatedTopic: {
    id?: number;
    title: string;
  };
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const isApiKeyMissing = !process.env.OPENAI_API_KEY;

if (isApiKeyMissing) {
  console.warn("Warning: OPENAI_API_KEY environment variable not set. Using fallback content for AI-generated responses.");
}

// Create OpenAI instance only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Check if OpenAI integration is working properly
export async function verifyOpenAIConnection(): Promise<boolean> {
  if (!openai) return false;
  
  try {
    log("Verifying OpenAI connection...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: "This is a test message to verify the connection. Please respond with 'Connection successful'." }
      ],
      max_tokens: 10
    });
    
    const responseText = response.choices[0].message.content || "";
    const success = responseText.includes("successful");
    
    if (success) {
      log("OpenAI connection verified successfully.");
    } else {
      log("OpenAI connection verification failed: Unexpected response");
    }
    return success;
  } catch (error: any) {
    log(`OpenAI connection verification failed: ${error.message || 'Unknown error'}`);
    return false;
  }
}

// Generate explanation and real-world example for a topic
export async function generateTopicExplanation(topic: string): Promise<TopicContent> {
  // If OpenAI client is not available, return fallback content
  if (!openai) {
    return {
      explanation: `This is a placeholder explanation for ${topic}. The OpenAI API is not configured. Please add your API key to the .env file.`,
      realWorldExample: `This is a placeholder real-world example for ${topic}. The OpenAI API is not configured. Please add your API key to the .env file.`
    };
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a financial educator who explains complex concepts in simple, relatable terms. Provide clear explanations with real-world examples that help people understand financial concepts without jargon."
        },
        {
          role: "user",
          content: `Create educational content about "${topic}" with two sections:
          1. An explanation section that breaks down the concept in simple terms that a 12-year-old could understand. Include why it matters.
          2. A real-world example section that gives a tangible, relatable scenario showing how this concept works in practice.
          
          Format your response as JSON with "explanation" and "realWorldExample" keys.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      explanation: result.explanation || `Failed to generate explanation for ${topic}`,
      realWorldExample: result.realWorldExample || `Failed to generate a real-world example for ${topic}`
    };
  } catch (error) {
    console.error("Error generating topic explanation:", error);
    return {
      explanation: `We couldn't generate an explanation for ${topic} at this time. Please try again later.`,
      realWorldExample: `We couldn't generate a real-world example for ${topic} at this time. Please try again later.`
    };
  }
}

// Generate quiz questions for a topic
export async function generateQuizQuestions(topic: string): Promise<QuizQuestion[]> {
  // Default fallback questions
  const fallbackQuestions = [
    {
      question: `What is ${topic}?`,
      options: [
        { text: "The correct definition", isCorrect: true },
        { text: "An incorrect definition", isCorrect: false },
        { text: "Another incorrect definition", isCorrect: false },
        { text: "Yet another incorrect definition", isCorrect: false }
      ]
    },
    {
      question: `How does ${topic} impact the economy?`,
      options: [
        { text: "The correct impact", isCorrect: true },
        { text: "An incorrect impact", isCorrect: false },
        { text: "Another incorrect impact", isCorrect: false },
        { text: "Yet another incorrect impact", isCorrect: false }
      ]
    }
  ];

  // If OpenAI client is not available, return fallback questions
  if (!openai) {
    console.log(`Using fallback quiz questions for ${topic} (OpenAI API not configured)`);
    return fallbackQuestions;
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a financial education expert creating quiz questions to test understanding of finance concepts. Create questions that are clear and educational."
        },
        {
          role: "user",
          content: `Create 2 multiple-choice quiz questions about "${topic}". 
          Each question should have 4 options with exactly one correct answer.
          
          Format your response as a JSON array of questions, where each question has:
          1. A "question" field with the question text
          2. An "options" array, where each option has "text" and "isCorrect" (boolean) fields`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (Array.isArray(result.questions) && result.questions.length > 0) {
      return result.questions;
    }
    
    // Fallback questions if format is incorrect
    return fallbackQuestions;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    return fallbackQuestions;
  }
}

// Generate response for Ask-Me-Anything chat questions
export async function generateChatResponse(question: string, availableTopics: {id: number; title: string}[]): Promise<ChatResponse> {
  // Default fallback response
  const fallbackResponse: ChatResponse = {
    answer: `I couldn't generate an answer for "${question}" at this time. Please try again later.`,
    example: "Here's an example I'd normally provide to help illustrate the concept.",
    relatedTopic: {
      title: "General Finance"
    }
  };

  // If OpenAI client is not available, return fallback response
  if (!openai) {
    console.log(`Using fallback chat response for question: "${question}" (OpenAI API not configured)`);
    return fallbackResponse;
  }
  
  try {
    // First, format the available topics to provide context
    const topicsContext = availableTopics.map(t => `${t.id}: ${t.title}`).join('\n');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are FinBuddy, a financial education assistant who explains financial concepts in simple, 
          relatable terms without jargon. Your goal is to help users understand complex financial ideas.
          
          For each question:
          1. Provide a clear, concise answer using plain language
          2. Include a brief, practical real-world example that illustrates the concept
          3. Mention a related financial topic from our curriculum that would help the user learn more
          
          Available financial topics in our curriculum (ID: Topic Name):
          ${topicsContext}
          
          Always respond in JSON format with "answer", "example", and "relatedTopic" fields. 
          The "relatedTopic" should contain "id" and "title" from the available topics above.`
        },
        {
          role: "user",
          content: question
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Handle case when OpenAI returns without proper matching
    if (!result.relatedTopic || !result.relatedTopic.id) {
      // Find most relevant topic based on simple keyword matching
      const questionLower = question.toLowerCase();
      const matchedTopic = availableTopics.find(t => 
        questionLower.includes(t.title.toLowerCase())
      ) || availableTopics[0]; // Default to first topic if no match
      
      result.relatedTopic = {
        id: matchedTopic.id,
        title: matchedTopic.title
      };
    }
    
    return {
      answer: result.answer || fallbackResponse.answer,
      example: result.example || fallbackResponse.example,
      relatedTopic: {
        id: result.relatedTopic?.id,
        title: result.relatedTopic?.title || fallbackResponse.relatedTopic.title
      }
    };
  } catch (error) {
    console.error("Error generating chat response:", error);
    return fallbackResponse;
  }
}
