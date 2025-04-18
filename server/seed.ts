import { db } from "./db";
import { topics, quizzes, insertTopicSchema, insertQuizSchema, type QuizQuestion } from "@shared/schema";
import { log } from "./vite";
import { resetDatabase } from "./resetDb";
// Import OpenAI functions with alias to avoid naming conflicts
import { generateQuizQuestions as openAIGenerateQuizQuestions } from "./openai";

/**
 * Seeds the database with initial data
 * @param force If true, will reset the database before seeding
 */
export async function seedDatabase(force = false) {
  try {
    // Check if database already has data
    const existingTopics = await db.select().from(topics);
    
    // If force is true, reset the database even if it has data
    if (force && existingTopics.length > 0) {
      const reset = await resetDatabase();
      if (!reset) {
        log("Failed to reset database, aborting seed operation.");
        return;
      }
    } else if (existingTopics.length > 0) {
      log("Database already seeded, skipping...");
      return;
    }
    
    log("Seeding database with initial data...");
    
    // Initial topics data
    const initialTopics = [
      {
        title: "Inflation",
        description: "The gradual increase in prices and decrease in purchasing power over time. Learn how inflation affects your savings and investments.",
        category: "Economics",
        readingTime: "",
        content: {
          explanation: "Inflation is the rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power is falling. Central banks attempt to limit inflation, and avoid deflation, in order to keep the economy running smoothly.\n\nWhen inflation occurs, the value of currency declines, which means that the same amount of money can buy fewer goods and services over time. For instance, if the annual inflation rate is 2%, then a product that costs $100 today will cost $102 a year from now.\n\nEconomists typically measure inflation using price indexes. The most commonly used are the Consumer Price Index (CPI) and the Producer Price Index (PPI). The CPI measures the price changes in a basket of goods and services commonly purchased by households, while the PPI measures the changes in the selling prices received by domestic producers for their output.",
          realWorldExample: "Imagine you have $1,000 in a savings account that pays 1% interest per year. After one year, you'd have $1,010. However, if the annual inflation rate is 2%, the real value of your savings has actually decreased because the $1,010 can buy less than what $1,000 could buy a year ago.\n\nThis is why simply keeping money in a savings account may not be enough to maintain its purchasing power over time, especially during periods of high inflation. It's also why investors often seek assets that provide returns that outpace inflation.\n\nA classic historical example of extreme inflation (hyperinflation) occurred in Germany's Weimar Republic in the early 1920s, when prices doubled every few days. People would carry money in wheelbarrows to buy basics, and some would burn banknotes for fuel because they were worth less than the firewood they could buy."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Interest Rates",
        description: "How banks and governments use interest rates to control the economy. Understand why rates rise and fall, and how it affects you.",
        category: "Economics",
        readingTime: "",
        content: {
          explanation: "Interest rates are the cost of borrowing money or the reward for saving it. They are expressed as a percentage of the amount borrowed or saved over a specific period, typically a year.\n\nCentral banks, like the Federal Reserve in the U.S., set a target for a key interest rate—called the federal funds rate—which influences other interest rates throughout the economy, including those for mortgages, auto loans, credit cards, and savings accounts.\n\nWhen central banks want to stimulate economic growth, they lower interest rates to make borrowing cheaper, encouraging businesses and individuals to take out loans for investments and purchases. Conversely, when they want to slow down the economy (often to control inflation), they raise interest rates, making borrowing more expensive and saving more attractive.",
          realWorldExample: "Think of interest rates like the price of using someone else's money. When you take out a mortgage to buy a house, you're borrowing a large sum from a bank, and the interest rate determines how much extra you'll pay for that privilege.\n\nFor example, on a $300,000 30-year fixed-rate mortgage:\n- At 3% interest, your monthly payment would be about $1,265, and you'd pay approximately $155,000 in interest over the loan's lifetime.\n- At 6% interest, your monthly payment jumps to around $1,799, and you'd pay about $347,000 in interest over 30 years.\n\nThat 3 percentage point difference costs you an additional $534 per month and nearly $192,000 over the life of the loan!\n\nThis is why homebuyers often rush to purchase when interest rates are low and may hold off when rates are high. The same principle applies to car loans, credit cards, and business investments."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Bonds",
        description: "Fixed-income securities that represent loans to a company or government. Learn how bonds work and why they're considered safer than stocks.",
        category: "Investments",
        readingTime: "",
        content: {
          explanation: "A bond is essentially a loan that you, as an investor, make to a borrower like a government, municipality, or corporation. In return for your money, the borrower promises to pay a specified interest rate (the coupon) during the life of the bond and to repay the face value of the bond (the principal) when it matures, or comes due.\n\nBonds are considered fixed-income securities because they pay a fixed amount of interest on a regular schedule, typically semi-annually, quarterly, or annually. The predictability of these payments is why bonds are generally considered less risky than stocks.\n\nHowever, bonds are not risk-free. Their market value can fluctuate based on changes in interest rates (interest rate risk), the borrower's ability to repay (credit risk), and other factors. Generally, when interest rates rise, bond prices fall, and vice versa.",
          realWorldExample: "Let's say you purchase a 10-year corporate bond with a face value of $1,000 and a 5% annual coupon rate. Each year, you receive $50 in interest payments (5% of $1,000). After 10 years, when the bond matures, you receive back your original $1,000 investment.\n\nBut what if two years after you buy this bond, interest rates rise and new bonds with similar risk are being issued with a 7% coupon? Your 5% bond becomes less attractive in the secondary market, and if you tried to sell it before maturity, you might have to do so at a discount—perhaps $900 instead of $1,000.\n\nConversely, if interest rates fall to 3%, your 5% bond becomes more valuable, and you might be able to sell it for a premium—perhaps $1,100.\n\nThis is why understanding the relationship between interest rates and bond prices is crucial for bond investors. Many retirees rely on bonds for income, and corporations and governments depend on bond markets to finance their operations and projects."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Stocks",
        description: "Ownership shares in companies that can be bought and sold on stock exchanges. Learn the basics of stock investing and market analysis.",
        category: "Investments",
        readingTime: "6 min read",
        content: {
          explanation: "Stocks represent ownership in a company. When you buy a stock, you're purchasing a small piece of that company and become a shareholder. The value of your shares can increase or decrease based on the company's performance, market conditions, and investor sentiment.\n\nCompanies issue stocks to raise capital for growth, operations, or other business needs. Investors can profit from stocks in two ways: through price appreciation (buying low and selling high) and through dividends (regular payments some companies make to shareholders from their profits).",
          realWorldExample: "Let's say you invested $1,000 in Apple stock in 2010 when it was trading at around $10 per share (adjusted for splits). By 2023, with the stock trading above $150, your investment would be worth over $15,000. This example shows the potential for significant returns from long-term stock investing in successful companies."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Mutual Funds",
        description: "Investment vehicles that pool money from multiple investors to purchase a diversified portfolio of stocks, bonds, or other securities.",
        category: "Investments",
        readingTime: "7 min read",
        content: {
          explanation: "Mutual funds allow investors to pool their money together to invest in a diversified portfolio of securities. Professional fund managers make investment decisions on behalf of investors, choosing which securities to buy and sell based on the fund's objectives.\n\nMutual funds offer instant diversification and professional management, making them suitable for investors who don't have the time, knowledge, or resources to manage their own portfolio of individual securities.",
          realWorldExample: "Consider a $1,000 investment in a total stock market index fund. This would give you ownership in thousands of companies across different sectors and sizes, rather than being concentrated in just a few stocks. If one company performs poorly, its impact on your overall investment is minimal due to diversification."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "ETFs",
        description: "Exchange-traded funds that combine features of mutual funds and stocks. Learn how ETFs offer diversification with trading flexibility.",
        category: "Investments",
        readingTime: "6 min read",
        content: {
          explanation: "Exchange-Traded Funds (ETFs) are investment funds that trade on stock exchanges like individual stocks. They typically track an index, sector, commodity, or other asset, but can be bought and sold throughout the day like stocks.\n\nETFs often have lower fees than mutual funds and offer greater trading flexibility. They can be an efficient way to invest in a broad market index or specific sector while maintaining liquidity.",
          realWorldExample: "An S&P 500 ETF lets you invest in 500 of America's largest companies with a single purchase. If you invest $1,000 in such an ETF, you effectively own a small piece of companies like Apple, Microsoft, Amazon, and others, proportional to their weight in the index."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Options",
        description: "Financial contracts that give buyers the right, but not obligation, to buy or sell assets at specified prices within a set time period.",
        category: "Investments",
        readingTime: "8 min read",
        content: {
          explanation: "Options are contracts that give the holder the right, but not the obligation, to buy (call option) or sell (put option) an asset at a predetermined price within a specific time period. They can be used for speculation, hedging, or generating income.\n\nOptions are considered advanced investment instruments due to their complexity and potential for significant gains or losses.",
          realWorldExample: "Imagine you buy a call option on Apple stock with a strike price of $150 expiring in 3 months. If Apple's stock price rises to $170, you can exercise your option to buy at $150 and immediately sell at $170, profiting from the difference (minus the cost of the option)."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Yields",
        description: "The income return on investments, typically expressed as a percentage. Understand how different types of yields affect investment decisions.",
        category: "Investments",
        readingTime: "5 min read",
        content: {
          explanation: "Yield represents the income generated by an investment relative to its price. Common types include dividend yield for stocks, coupon yield for bonds, and yield to maturity for bonds held to maturity.\n\nYields help investors compare different investments and understand the income they can expect from each. Higher yields often indicate higher risk.",
          realWorldExample: "If a stock pays $2 in annual dividends and trades at $50 per share, its dividend yield is 4% ($2/$50). If interest rates rise and similar investments start offering 5% yields, the stock's price might fall to $40 to make its yield more competitive (now $2/$40 = 5%)."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Tariffs",
        description: "Taxes on imported goods that affect international trade and domestic prices. Learn how tariffs impact the global economy and consumer costs.",
        category: "Economics",
        readingTime: "5 min read",
        content: {
          explanation: "Tariffs are taxes imposed on imported goods and services. Governments use them to protect domestic industries, raise revenue, or achieve political objectives. When a tariff is imposed, it typically increases the price of imported goods, which can affect both businesses and consumers.\n\nTariffs can lead to trade disputes, retaliation from other countries, and changes in global supply chains.",
          realWorldExample: "When a 25% tariff is placed on imported steel, foreign steel becomes more expensive, leading domestic steel producers to raise their prices as well. This benefits domestic steel producers but increases costs for industries that use steel, like construction and automotive, potentially leading to higher prices for consumers."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Credit Scores",
        description: "A numerical representation of creditworthiness. Learn how credit scores are calculated and impact financial opportunities.",
        category: "Personal Finance",
        readingTime: "6 min read",
        content: {
          explanation: "Credit scores are numerical assessments of a person's creditworthiness, typically ranging from 300 to 850. They're calculated based on payment history, credit utilization, length of credit history, credit mix, and new credit applications.",
          realWorldExample: "Someone with a credit score of 750 might qualify for a 3.5% mortgage rate, while someone with a 600 score might pay 5.5% or be denied altogether. On a $300,000 mortgage, this difference could mean paying hundreds more per month."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Diversification",
        description: "The strategy of spreading investments across different assets to reduce risk. Learn why not putting all eggs in one basket matters.",
        category: "Investments",
        readingTime: "7 min read",
        content: {
          explanation: "Diversification is a risk management strategy that mixes different investments within a portfolio. The principle is that a portfolio constructed of different kinds of assets will pose a lower risk than any individual asset.",
          realWorldExample: "If you invested $10,000 only in airline stocks in 2020, you might have lost 60% during the pandemic. But if you had split that money between airlines, technology, healthcare, and government bonds, your losses would have been significantly reduced."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Risk Management",
        description: "Strategies to identify, assess and protect against financial risks. Learn how to protect your financial future.",
        category: "Personal Finance",
        readingTime: "8 min read",
        content: {
          explanation: "Risk management involves identifying potential financial risks and taking steps to minimize their impact. This includes insurance, emergency funds, and investment diversification.",
          realWorldExample: "A family maintains a 6-month emergency fund, has life and disability insurance, and diversifies investments between stocks and bonds. When the breadwinner loses their job, the emergency fund keeps them afloat until new employment is found."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Tax Planning",
        description: "Strategies to efficiently manage tax obligations. Learn about deductions, credits, and tax-advantaged accounts.",
        category: "Personal Finance",
        readingTime: "7 min read",
        content: {
          explanation: "Tax planning involves organizing your financial affairs to legally minimize tax liability. This includes understanding tax brackets, deductions, credits, and timing of income and expenses.",
          realWorldExample: "By contributing $6,000 to a traditional IRA, someone in the 24% tax bracket saves $1,440 in taxes that year. Over 30 years, these tax-deferred savings can grow substantially through compound interest."
        },
        createdAt: new Date().toISOString()
      }
    ];
    
    // Insert topics one by one and create associated quizzes
    for (const topicData of initialTopics) {
      // Validate and insert topic
      const validatedTopic = insertTopicSchema.parse(topicData);
      const [insertedTopic] = await db.insert(topics).values(validatedTopic).returning();
      
      // Create and insert quiz for this topic
      const quizQuestions = generateSampleQuestions(insertedTopic.title);
      const quizData = {
        topicId: insertedTopic.id,
        questions: quizQuestions
      };
      
      const validatedQuiz = insertQuizSchema.parse(quizData);
      await db.insert(quizzes).values(validatedQuiz);
    }
    
    log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

/**
 * Generates sample quiz questions based on topic
 * Used as a fallback when OpenAI generation fails
 */
function generateSampleQuestions(topicTitle: string): QuizQuestion[] {
  // Generate topic-specific questions
  switch (topicTitle) {
    case "Inflation":
      return [
        {
          question: "What is inflation?",
          options: [
            { text: "A decrease in the money supply", isCorrect: false },
            { text: "A general increase in prices and fall in purchasing power", isCorrect: true },
            { text: "An increase in the value of currency", isCorrect: false },
            { text: "A government policy to reduce taxes", isCorrect: false }
          ]
        },
        {
          question: "Which of the following is a common cause of inflation?",
          options: [
            { text: "Decreased consumer spending", isCorrect: false },
            { text: "Lower production costs", isCorrect: false },
            { text: "Expansion of the money supply", isCorrect: true },
            { text: "Increased unemployment", isCorrect: false }
          ]
        },
        {
          question: "What is the typical inflation target for most central banks?",
          options: [
            { text: "0%", isCorrect: false },
            { text: "2%", isCorrect: true },
            { text: "5%", isCorrect: false },
            { text: "10%", isCorrect: false }
          ]
        }
      ];
      
    case "Interest Rates":
      return [
        {
          question: "What happens when central banks lower interest rates?",
          options: [
            { text: "Economic growth tends to slow down", isCorrect: false },
            { text: "Borrowing becomes more expensive", isCorrect: false },
            { text: "Businesses are encouraged to take out loans", isCorrect: true },
            { text: "Inflation typically decreases", isCorrect: false }
          ]
        },
        {
          question: "Which of the following is most directly influenced by the federal funds rate?",
          options: [
            { text: "Stock prices", isCorrect: false },
            { text: "Commodity prices", isCorrect: false },
            { text: "Mortgage rates", isCorrect: true },
            { text: "Exchange rates", isCorrect: false }
          ]
        },
        {
          question: "Why might a central bank raise interest rates?",
          options: [
            { text: "To combat rising inflation", isCorrect: true },
            { text: "To increase unemployment", isCorrect: false },
            { text: "To reduce government tax revenue", isCorrect: false },
            { text: "To decrease the value of the country's currency", isCorrect: false }
          ]
        }
      ];
      
    case "Bonds":
      return [
        {
          question: "What happens to existing bond prices when interest rates rise?",
          options: [
            { text: "They increase", isCorrect: false },
            { text: "They decrease", isCorrect: true },
            { text: "They stay the same", isCorrect: false },
            { text: "It depends on the bond issuer", isCorrect: false }
          ]
        },
        {
          question: "What is the coupon rate of a bond?",
          options: [
            { text: "The bond's current market value", isCorrect: false },
            { text: "The interest rate promised by the bond issuer", isCorrect: true },
            { text: "The bond's maturity date", isCorrect: false },
            { text: "The discount rate applied at purchase", isCorrect: false }
          ]
        },
        {
          question: "Which type of bond is generally considered the safest?",
          options: [
            { text: "Corporate bonds", isCorrect: false },
            { text: "Municipal bonds", isCorrect: false },
            { text: "Junk bonds", isCorrect: false },
            { text: "Treasury bonds", isCorrect: true }
          ]
        }
      ];
      
    default:
      // Generic questions for other topics
      return [
        {
          question: `What is the primary focus of ${topicTitle}?`,
          options: [
            { text: "Economic policy", isCorrect: false },
            { text: "Personal financial management", isCorrect: true },
            { text: "Banking regulations", isCorrect: false },
            { text: "Corporate finance", isCorrect: false }
          ]
        },
        {
          question: `Why is understanding ${topicTitle} important?`,
          options: [
            { text: "It's required by law", isCorrect: false },
            { text: "It helps with making better financial decisions", isCorrect: true },
            { text: "It's only relevant for financial professionals", isCorrect: false },
            { text: "It has no practical application", isCorrect: false }
          ]
        },
        {
          question: "Which of these financial concepts is most important to master first?",
          options: [
            { text: "Advanced derivatives trading", isCorrect: false },
            { text: "International tax shelters", isCorrect: false },
            { text: "Basic budgeting and saving", isCorrect: true },
            { text: "Corporate merger strategy", isCorrect: false }
          ]
        }
      ];
  }
}