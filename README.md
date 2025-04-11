# FinBuddy - AI-Powered Financial Education Platform

FinBuddy is an educational platform that helps users understand complex financial concepts through AI-generated explanations, real-world examples, and interactive quizzes.

## Features

- **Topic Explorer**: Browse a curated collection of financial topics
- **Concept Cards**: Learn about financial concepts with detailed explanations
- **Interactive Quizzes**: Test your knowledge with multiple-choice questions
- **Responsive Design**: Access the platform on any device with a consistent experience
- **Dark Mode Support**: Choose between light and dark theme based on your preference

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4o API for content generation

## Environment Setup

### Required Environment Variables

The application requires certain environment variables to be set. Create a `.env` file in the root directory with the following variables:

```
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration (automatically set by Replit)
# DATABASE_URL=
# PGUSER=
# PGHOST=
# PGPASSWORD=
# PGDATABASE=
# PGPORT=
```

### OpenAI API Key

To use the content generation features, you need to:

1. Sign up for an OpenAI account at [platform.openai.com](https://platform.openai.com)
2. Create an API key in your OpenAI dashboard
3. Add the API key to your `.env` file

If the OpenAI API key is not provided, the application will use fallback content instead of generating new explanations and quiz questions.

## Getting Started

1. Clone the repository
2. Create the `.env` file with required environment variables
3. Install dependencies: `npm install`
4. Start the application: `npm run dev`
5. Open the application in your browser at http://localhost:5000

## Development Workflow

- **Server**: Express.js server handling API requests and database operations
- **Client**: React application using Vite for fast development and bundling
- **Database**: PostgreSQL database with Drizzle ORM for schema management

## UI Components

FinBuddy uses shadcn/ui components for consistent, accessible UI elements. The theme is configured in `theme.json` and can be customized as needed.