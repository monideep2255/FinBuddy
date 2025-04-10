import { db } from "./db";
import { topics, quizzes, insertTopicSchema, insertQuizSchema, type QuizQuestion } from "@shared/schema";
import { log } from "./vite";

/**
 * Seeds the database with initial data
 */
export async function seedDatabase() {
  try {
    // Check if database already has data
    const existingTopics = await db.select().from(topics);
    
    if (existingTopics.length > 0) {
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
        readingTime: "5 min read",
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
        readingTime: "7 min read",
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
        readingTime: "8 min read",
        content: {
          explanation: "A bond is essentially a loan that you, as an investor, make to a borrower like a government, municipality, or corporation. In return for your money, the borrower promises to pay a specified interest rate (the coupon) during the life of the bond and to repay the face value of the bond (the principal) when it matures, or comes due.\n\nBonds are considered fixed-income securities because they pay a fixed amount of interest on a regular schedule, typically semi-annually, quarterly, or annually. The predictability of these payments is why bonds are generally considered less risky than stocks.\n\nHowever, bonds are not risk-free. Their market value can fluctuate based on changes in interest rates (interest rate risk), the borrower's ability to repay (credit risk), and other factors. Generally, when interest rates rise, bond prices fall, and vice versa.",
          realWorldExample: "Let's say you purchase a 10-year corporate bond with a face value of $1,000 and a 5% annual coupon rate. Each year, you receive $50 in interest payments (5% of $1,000). After 10 years, when the bond matures, you receive back your original $1,000 investment.\n\nBut what if two years after you buy this bond, interest rates rise and new bonds with similar risk are being issued with a 7% coupon? Your 5% bond becomes less attractive in the secondary market, and if you tried to sell it before maturity, you might have to do so at a discount—perhaps $900 instead of $1,000.\n\nConversely, if interest rates fall to 3%, your 5% bond becomes more valuable, and you might be able to sell it for a premium—perhaps $1,100.\n\nThis is why understanding the relationship between interest rates and bond prices is crucial for bond investors. Many retirees rely on bonds for income, and corporations and governments depend on bond markets to finance their operations and projects."
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
      const quizQuestions = generateQuizQuestions(insertedTopic.title);
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
 * Generates quiz questions based on topic
 */
function generateQuizQuestions(topicTitle: string): QuizQuestion[] {
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