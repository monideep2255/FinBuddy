
*Last Updated: April 10, 2025*

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
   - Foundational financial concepts
   - Categories: Economics, Investments, Personal Finance
   - Interactive topic cards with descriptions

2. **Content Structure**
   - Plain-English explanations
   - Relatable real-world examples
   - Interactive quizzes
   - Topic categorization

3. **User Experience**
   - Clean, minimal interface
   - Dark/light mode support
   - Search functionality
   - Category filtering
   - Sort by relevance

4. **Topic Coverage**
   - Economics: Inflation, Interest Rates, Tariffs
   - Investments: Stocks, Bonds, ETFs, Mutual Funds, Options, Yields
   - Personal Finance: Credit Scores, Risk Management, Tax Planning
   - Additional topics: Diversification

### Known Issues & To-Do
- [ ] Fix display of cards for all foundational topics (currently showing limited cards)
- [ ] Implement remaining topic cards from initial list
- [ ] Add support for user progress tracking
- [ ] Complete quiz generation for all topics

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
