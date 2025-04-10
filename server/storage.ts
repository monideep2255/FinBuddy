import { 
  users, 
  topics, 
  quizzes, 
  type User, 
  type InsertUser, 
  type Topic, 
  type InsertTopic, 
  type Quiz,
  type InsertQuiz,
  type QuizQuestion,
  type TopicContent
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Topic operations
  getAllTopics(): Promise<Topic[]>;
  getTopicById(id: number): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  
  // Quiz operations
  getQuizByTopicId(topicId: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private topics: Map<number, Topic>;
  private quizzes: Map<number, Quiz>;
  
  currentUserId: number;
  currentTopicId: number;
  currentQuizId: number;

  constructor() {
    this.users = new Map();
    this.topics = new Map();
    this.quizzes = new Map();
    
    this.currentUserId = 1;
    this.currentTopicId = 1;
    this.currentQuizId = 1;
    
    // Initialize with some topics
    this.seedInitialTopics();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }
  
  async getTopicById(id: number): Promise<Topic | undefined> {
    return this.topics.get(id);
  }
  
  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.currentTopicId++;
    const topic: Topic = { ...insertTopic, id };
    this.topics.set(id, topic);
    return topic;
  }
  
  async getQuizByTopicId(topicId: number): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(
      (quiz) => quiz.topicId === topicId
    );
  }
  
  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentQuizId++;
    const quiz: Quiz = { ...insertQuiz, id };
    this.quizzes.set(id, quiz);
    return quiz;
  }
  
  private seedInitialTopics() {
    const initialTopics: InsertTopic[] = [
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
      },
      {
        title: "Treasury Yields",
        description: "The return investors receive from holding US government debt securities. Understanding yields helps predict economic trends.",
        category: "Investments",
        readingTime: "6 min read",
        content: {
          explanation: "Treasury yields are the interest rates that the U.S. government pays to borrow money by issuing bonds. These bonds are considered one of the safest investments in the world because they're backed by the U.S. government.\n\nThink of it like this: when you buy a Treasury bond, you're loaning money to the U.S. government. In return, the government promises to pay you interest and eventually return your original investment (the principal).\n\nTreasury yields are incredibly important because they serve as a benchmark for many other interest rates in the economy, including mortgage rates, auto loans, and business loans. When Treasury yields go up, other interest rates typically follow.\n\nInvestors also watch Treasury yields closely because they can signal how people feel about the economy. Rising yields often mean investors are optimistic about economic growth and may be selling bonds to buy riskier investments like stocks. Falling yields might indicate that investors are worried about the economy and are moving money into the safety of Treasury bonds.",
          realWorldExample: "Imagine you purchase a 10-year Treasury bond with a face value of $1,000 and a fixed interest rate (coupon) of 2%. This means you'll receive $20 per year in interest payments. However, the yield on your bond can change based on its price in the secondary market.\n\nIf investors become concerned about economic risks and rush to buy safe Treasury bonds, the price of your bond might rise to $1,100. Even though the bond still pays $20 per year, its yield effectively drops to about 1.8% ($20 ÷ $1,100) because new buyers are paying more for the same interest payment.\n\nConversely, if the economy improves and investors sell Treasury bonds to buy stocks, the price of your bond might fall to $900. Its yield then rises to about 2.2% ($20 ÷ $900) because new buyers are paying less for the same interest payment.\n\nThis is why bond prices and yields move in opposite directions. It's also why the 'yield curve' (which shows yields for Treasuries of different maturities) is closely watched as an economic indicator. When short-term yields rise above long-term yields (an 'inverted yield curve'), it often precedes a recession."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "ETFs",
        description: "Exchange-Traded Funds that trade like stocks but contain multiple assets. Learn how ETFs offer instant diversification at low cost.",
        category: "Investments",
        readingTime: "6 min read",
        content: {
          explanation: "Exchange-Traded Funds (ETFs) are investment funds that trade on stock exchanges, much like individual stocks. However, unlike a single stock, an ETF typically holds a collection of assets—such as stocks, bonds, commodities, or a mix of these—often designed to track the performance of a particular index, sector, commodity, or asset class.\n\nETFs offer investors several advantages:\n\n1. Diversification: Even with a small investment, you instantly gain exposure to many different securities.\n\n2. Lower costs: Most ETFs have lower expense ratios than mutual funds because they're typically passively managed (tracking an index rather than having managers actively pick investments).\n\n3. Liquidity: ETFs trade throughout the day on exchanges, so you can buy or sell them whenever the market is open, unlike mutual funds that trade only once a day.\n\n4. Transparency: Most ETFs disclose their holdings daily, so you always know what you own.\n\n5. Tax efficiency: ETFs generally create fewer taxable events than mutual funds, potentially reducing your capital gains taxes.",
          realWorldExample: "Let's say you want to invest in the U.S. stock market but don't have the time or expertise to research and select individual companies. You could buy an S&P 500 ETF like SPY or VOO.\n\nWith a single purchase, you'd own a tiny slice of all 500 companies in the index—including giants like Apple, Microsoft, Amazon, and hundreds of others—weighted according to their market value. If you invested $1,000 in an S&P 500 ETF, you'd effectively own about $70 worth of Apple, $60 of Microsoft, $35 of Amazon, and so on, based on their weights in the index.\n\nThis diversification helps protect you from the poor performance of any single company. If one company in the index performs badly, it might be offset by others that perform well.\n\nETFs also make it easy to invest in specific sectors or themes. Want exposure to clean energy companies? There's an ETF for that. Interested in emerging market bonds? There's an ETF for that too. From technology to healthcare to dividend-paying stocks, ETFs offer easy access to virtually any segment of the market."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Tariffs",
        description: "Taxes imposed on imported goods. Discover how tariffs affect global trade, domestic prices, and your purchasing power.",
        category: "Economics",
        readingTime: "5 min read",
        content: {
          explanation: "Tariffs are taxes or duties imposed by a government on imported goods and services. These taxes are typically charged as a percentage of the imported item's value, though sometimes they can be a specific amount per unit (like $1 per barrel of oil).\n\nGovernments impose tariffs for several reasons:\n\n1. Revenue generation: Historically, before income taxes became common, tariffs were a major source of government revenue.\n\n2. Protection of domestic industries: By making imported goods more expensive, tariffs can help domestic producers compete against foreign companies that might have lower production costs.\n\n3. Political leverage: Countries sometimes use tariffs as bargaining chips in international negotiations or to pressure other nations on various issues.\n\nWhile tariffs can help specific industries within a country, economists generally view them as creating economic inefficiencies. When a country imposes tariffs, it typically leads to higher prices for consumers, reduced overall trade, and potential retaliation from other countries.",
          realWorldExample: "Imagine the U.S. places a 25% tariff on imported steel. Here's how various parties would be affected:\n\n1. Foreign steel producers: Their steel becomes 25% more expensive in the U.S. market, likely reducing their sales and profits.\n\n2. U.S. steel producers: They can potentially raise their prices (though not quite by 25%) and increase their market share since foreign competition has become more expensive.\n\n3. U.S. manufacturers that use steel (like automakers or appliance manufacturers): Their costs increase because all steel—both imported and domestic—is now more expensive. This might force them to raise prices, reduce production, or cut jobs.\n\n4. U.S. consumers: They pay higher prices for products containing steel, from cars to refrigerators to buildings.\n\n5. U.S. government: It collects revenue from the tariff.\n\nA real-world example occurred in 2018 when the U.S. imposed tariffs on steel and aluminum imports from many countries. In response, those countries imposed retaliatory tariffs on various U.S. exports, including agricultural products. American farmers lost access to some export markets, and the government ended up providing billions in aid to affected farmers."
        },
        createdAt: new Date().toISOString()
      }
    ];
    
    initialTopics.forEach((topic) => {
      const id = this.currentTopicId++;
      const newTopic: Topic = { ...topic, id };
      this.topics.set(id, newTopic);
      
      // Create corresponding quizzes
      this.createInitialQuiz(id, topic.title);
    });
  }
  
  private async createInitialQuiz(topicId: number, topicTitle: string) {
    const quizQuestions: QuizQuestion[] = this.generateSampleQuestions(topicTitle);
    
    const id = this.currentQuizId++;
    const quiz: Quiz = { 
      id, 
      topicId, 
      questions: quizQuestions 
    };
    
    this.quizzes.set(id, quiz);
  }
  
  private generateSampleQuestions(topicTitle: string): QuizQuestion[] {
    if (topicTitle === "Inflation") {
      return [
        {
          question: "What is inflation?",
          options: [
            { text: "The gradual increase in prices and decrease in purchasing power", isCorrect: true },
            { text: "The rapid decrease in unemployment rates", isCorrect: false },
            { text: "The expansion of government spending", isCorrect: false },
            { text: "The increase in a country's GDP", isCorrect: false }
          ]
        },
        {
          question: "How does inflation affect savings?",
          options: [
            { text: "It increases the real value of savings", isCorrect: false },
            { text: "It has no effect on savings", isCorrect: false },
            { text: "It decreases the purchasing power of savings", isCorrect: true },
            { text: "It only affects foreign currency savings", isCorrect: false }
          ]
        }
      ];
    } else if (topicTitle === "Interest Rates") {
      return [
        {
          question: "Who typically sets the benchmark interest rates in the United States?",
          options: [
            { text: "The President", isCorrect: false },
            { text: "Congress", isCorrect: false },
            { text: "The Federal Reserve", isCorrect: true },
            { text: "The Treasury Department", isCorrect: false }
          ]
        },
        {
          question: "What typically happens to the economy when interest rates are lowered?",
          options: [
            { text: "Economic growth tends to slow down", isCorrect: false },
            { text: "Borrowing becomes more expensive", isCorrect: false },
            { text: "Saving becomes more attractive than spending", isCorrect: false },
            { text: "Economic activity tends to increase", isCorrect: true }
          ]
        }
      ];
    } else if (topicTitle === "Bonds") {
      return [
        {
          question: "What happens to bond prices when interest rates rise?",
          options: [
            { text: "Bond prices rise", isCorrect: false },
            { text: "Bond prices fall", isCorrect: true },
            { text: "Bond prices remain unchanged", isCorrect: false },
            { text: "It depends on the type of bond", isCorrect: false }
          ]
        },
        {
          question: "What is a bond coupon?",
          options: [
            { text: "A discount offered when purchasing bonds", isCorrect: false },
            { text: "The maturity date of the bond", isCorrect: false },
            { text: "The interest payment made to bondholders", isCorrect: true },
            { text: "The penalty for selling a bond early", isCorrect: false }
          ]
        }
      ];
    } else if (topicTitle === "Treasury Yields") {
      return [
        {
          question: "Which of the following best describes Treasury yields?",
          options: [
            { text: "The total amount the U.S. government owes to foreign countries", isCorrect: false },
            { text: "The interest rates that the U.S. government pays to borrow money", isCorrect: true },
            { text: "The dividends paid by U.S. Treasury Department", isCorrect: false },
            { text: "The tax revenue collected by the U.S. Treasury", isCorrect: false }
          ]
        },
        {
          question: "What does an 'inverted yield curve' typically signal?",
          options: [
            { text: "Economic growth is accelerating", isCorrect: false },
            { text: "The Federal Reserve is about to raise interest rates", isCorrect: false },
            { text: "A potential recession may be approaching", isCorrect: true },
            { text: "Inflation is about to decrease significantly", isCorrect: false }
          ]
        }
      ];
    } else if (topicTitle === "ETFs") {
      return [
        {
          question: "What is a key advantage of ETFs compared to individual stocks?",
          options: [
            { text: "They always outperform the market", isCorrect: false },
            { text: "They provide instant diversification", isCorrect: true },
            { text: "They can only be purchased by institutional investors", isCorrect: false },
            { text: "They are not subject to market fluctuations", isCorrect: false }
          ]
        },
        {
          question: "How do most ETFs differ from actively managed mutual funds?",
          options: [
            { text: "ETFs typically have higher expense ratios", isCorrect: false },
            { text: "ETFs can only be bought at the end of the trading day", isCorrect: false },
            { text: "ETFs are typically designed to track an index rather than beat it", isCorrect: true },
            { text: "ETFs are not regulated by the SEC", isCorrect: false }
          ]
        }
      ];
    } else if (topicTitle === "Tariffs") {
      return [
        {
          question: "What is a tariff?",
          options: [
            { text: "A tax on domestic production", isCorrect: false },
            { text: "A tax on exported goods", isCorrect: false },
            { text: "A tax on imported goods", isCorrect: true },
            { text: "A tax on corporate profits", isCorrect: false }
          ]
        },
        {
          question: "Who typically pays for tariffs directly?",
          options: [
            { text: "Foreign governments", isCorrect: false },
            { text: "Importing companies", isCorrect: true },
            { text: "Exporting companies", isCorrect: false },
            { text: "Central banks", isCorrect: false }
          ]
        }
      ];
    } else {
      // Default questions for any other topic
      return [
        {
          question: `What is ${topicTitle}?`,
          options: [
            { text: "A correct definition", isCorrect: true },
            { text: "An incorrect definition", isCorrect: false },
            { text: "Another incorrect option", isCorrect: false },
            { text: "Yet another incorrect option", isCorrect: false }
          ]
        },
        {
          question: `How does ${topicTitle} affect the economy?`,
          options: [
            { text: "It has a positive effect", isCorrect: false },
            { text: "It has a negative effect", isCorrect: false },
            { text: "It has both positive and negative effects depending on context", isCorrect: true },
            { text: "It has no significant effect", isCorrect: false }
          ]
        }
      ];
    }
  }
}

export const storage = new MemStorage();
