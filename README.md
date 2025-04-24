
*Last Updated: April 23, 2025*

# FinBuddy - Your AI-Powered Finance Learning Companion

FinBuddy is an interactive learning tool that makes financial concepts accessible and engaging. It breaks down complex financial topics into simple explanations with real-world examples, helping users build confidence in understanding markets, economics, and personal finance.

## Links to Website and PRD
- [FinBuddy Website](https://financial-learning-buddy-monideepchakrab.replit.app/)
- [PRD](docs/FinBuddy_PRD.docx.pdf)

## Project Overview

### Background & Context
In a world where economic shifts impact our daily lives, most people remain confused about how financial forces actually work. FinBuddy bridges this gap by providing:
- Simple, jargon-free explanations
- Real-world examples and analogies
- Interactive learning experiences
- Live market data integration

### Problem Statement
- Financial concepts are intimidating and full of jargon
- Users lack context for market events
- Existing learning tools are either passive or too generic
- No app links finance education to real-time events



## Implemented Features

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

5. **Mobile Responsiveness**
   - Adjusted the display of text on smaller screens to ensure the login button is visible and text is properly legible
   - Enhanced home page login button
   - Improved card text display (Quiz, Explanation etc.)

### 📈 Phase 2: Live Market Data
1. **Real-time Market Data Integration**
   - Connected to Alpha Vantage API for live market data
   - Implemented secure API key handling via environment variables
   - Added data fetching with proper error handling and fallbacks

2. **Comprehensive Market Indicators**
   - Stock indices: S&P 500, NASDAQ
   - Treasury yields: 10-year and 2-year
   - Interest rates: Federal Funds Rate
   - Inflation metrics: Consumer Price Index (CPI)
   - Commodities: Gold and Oil prices

3. **Visual Data Representation**
   - Interactive line charts for historical data visualization
   - Color-coded indicators (green for positive, red for negative changes)
   - Data tooltips with detailed information on hover
   - Responsive charts that adapt to different screen sizes

4. **Market Context for Topics**
   - Added Live Data tab to topic pages showing relevant market data
   - Included explanatory text describing market indicators
   - Connected financial concepts to real-world market movements
   - Created a comprehensive Market Data dashboard page

5. **Enhanced User Experience**
   - Improved navigation with easy access to market data
   - Added helpful explanations about how to interpret data
   - Ensured consistent styling in both light and dark modes
   - Implemented proper mobile responsiveness for data visualization

## Future Phases

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

# Market Data API Configuration
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here

# Database Configuration (automatically set by Replit)
# DATABASE_URL=
# PGUSER=
# PGHOST=
# PGPASSWORD=
# PGDATABASE=
# PGPORT=
```

### API Keys

#### OpenAI API Key

To use the content generation features, you need to:

1. Sign up for an OpenAI account at [platform.openai.com](https://platform.openai.com)
2. Create an API key in your OpenAI dashboard
3. Add the API key to your `.env` file

If the OpenAI API key is not provided, the application will use fallback content instead of generating new explanations and quiz questions.

#### Alpha Vantage API Key

To display live market data, you need to:

1. Sign up for a free Alpha Vantage account at [www.alphavantage.co](https://www.alphavantage.co)
2. Get your API key from your Alpha Vantage dashboard
3. Add the API key to your `.env` file

If the Alpha Vantage API key is not provided, the application will display error messages in the market data sections.

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
    ├── client/                # Frontend React application
    │   ├── src/
    │   │   ├── components/    # UI components
    │   │   │   ├── ui/       # Reusable UI components
    │   │   │   └── ...       # Feature-specific components
    │   │   ├── hooks/        # Custom React hooks
    │   │   ├── lib/          # Shared utilities
    │   │   ├── pages/        # Page components
    │   │   └── App.tsx       # Root component
    │   └── index.html        # HTML entry point
    ├── server/               # Backend Express server
    │   ├── auth.ts          # Authentication logic
    │   ├── marketData.ts    # Market data handling
    │   ├── openai.ts        # OpenAI integration
    │   ├── routes.ts        # API routes
    │   ├── db.ts            # Database configuration
    │   └── seed.ts          # Seed data
    ├── shared/               # Shared code
    │   └── schema.ts        # Database schema
    └── docs/                 # Documentation
        ├── PRD.pdf          # Product Requirements
        └── Tech_Spec.pdf    # Technical Specification
```

## Legal Notice

This tool is designed for educational purposes only. Always conduct thorough research and consult qualified financial advisors before making investment decisions.
