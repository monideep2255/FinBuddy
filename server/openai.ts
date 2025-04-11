import OpenAI from "openai";
import { QuizQuestion, TopicContent } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const isApiKeyMissing = !process.env.OPENAI_API_KEY;

if (isApiKeyMissing) {
  console.warn("Warning: OPENAI_API_KEY environment variable not set. Using fallback content for AI-generated responses.");
}

// Create OpenAI instance only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Generate explanation and real-world example for a topic
export async function generateTopicExplanation(topic: string): Promise<TopicContent> {
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
    return [
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
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    return [
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
  }
}
