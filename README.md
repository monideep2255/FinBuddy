
*Last Updated: April 17, 2025*

# FinBuddy - Your AI-Powered Finance Learning Companion

FinBuddy is an interactive learning tool designed to make financial concepts accessible and engaging. It breaks down complex financial topics into simple explanations with real-world examples, helping users build confidence in understanding markets, economics, and personal finance.

## Project Overview

### Background & Context
In a world where economic shifts impact our daily lives, most people remain confused about how financial forces actually work. FinBuddy bridges this gap by providing:
- Simple, jargon-free explanations
- Real-world examples and analogies
- Interactive learning experiences
- Live market data integration (coming soon)

### Problem Statement
- Financial concepts are intimidating and full of jargon
- Users lack context for market events
- Existing learning tools are either passive or too generic
- No app links finance education to real-time events

## Currently Implemented Features

### ✨ Phase 1: Topic Explorer + Concept Cards
1. **Core Topic List**
   - Foundational financial concepts implemented
   - Categories: Economics, Investments, Personal Finance
   - Interactive topic cards with dynamic loading
   - Progress tracking per topic

2. **Content Structure**
   - Plain-English explanations with AI-enhanced content
   - Detailed real-world examples with numerical breakdowns
   - Interactive multi-choice quizzes with scoring
   - Organized topic categorization with filtering

3. **User Experience**
   - Clean, responsive interface with shadcn/ui components
   - Seamless dark/light mode toggle
   - User authentication and progress persistence
   - Category-based navigation
   - Progress tracking visualization

4. **Topic Coverage**
   - Economics: Inflation, Interest Rates, Tariffs
   - Investments: Stocks, Bonds, ETFs, Mutual Funds, Options, Yields
   - Personal Finance: Credit Scores, Risk Management, Tax Planning
   - Additional topics: Diversification
5. Adjusted the display of text on smaller screens to ensure the login button is visible and text is properly legible.
   - Home page login button
   - Cards text (Quiz, Explanation etc.)

## Future Phases

### 📈 Phase 2: Live Market Data
- Real-time market data integration
- Visual data representations
- Current market context for topics

### 💬 Phase 3: Ask-Me-Anything
- Chat interface for questions
- Contextual topic suggestions
- Dynamic examples

### 🧪 Phase 4: Personalized Learning
- Progress tracking
- Customized learning paths
- Bookmarking system

### 🚀 Phase 5: Scenario Playground
- Interactive market simulations
- Economic impact analysis
- Real-world application testing

## Technical Stack

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Development**: Vite
- **Deployment**: Replit
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

## Project Structure

```
└── FinBuddy/
    ├── client/               # Frontend React application
    │   └── src/
    │       ├── components/   # UI components
    │       ├── pages/        # Page components
    │       └── lib/          # Shared utilities
    ├── server/              # Backend Express server
    │   ├── routes.ts        # API routes
    │   ├── db.ts           # Database configuration
    │   └── seed.ts         # Seed data
    └── shared/              # Shared code
        └── schema.ts        # Database schema
```

## Legal Notice

This tool is designed for educational purposes only. Always conduct thorough research and consult qualified financial advisors before making investment decisions.
