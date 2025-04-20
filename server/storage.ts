import { 
  users, 
  topics, 
  quizzes, 
  userProgress,
  chatMessages,
  type User, 
  type InsertUser, 
  type Topic, 
  type InsertTopic, 
  type Quiz,
  type InsertQuiz,
  type UserProgress,
  type InsertUserProgress,
  type QuizQuestion,
  type TopicContent,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, sql } from "drizzle-orm";

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
  
  // User Progress operations
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getTopicProgress(userId: number, topicId: number): Promise<UserProgress | undefined>;
  updateTopicProgress(userId: number, topicId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  getCompletedTopics(userId: number): Promise<number[]>;
  
  // Chat operations
  getUserChatHistory(userId: number | null): Promise<ChatMessage[]>;
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private topics: Map<number, Topic>;
  private quizzes: Map<number, Quiz>;
  private userProgress: Map<string, UserProgress>; // key is userId:topicId
  private chatMessages: Map<number, ChatMessage>; // Chat messages for users
  
  currentUserId: number;
  currentTopicId: number;
  currentQuizId: number;
  currentProgressId: number;
  currentChatMessageId: number;

  constructor() {
    this.users = new Map();
    this.topics = new Map();
    this.quizzes = new Map();
    this.userProgress = new Map();
    this.chatMessages = new Map();
    
    this.currentUserId = 1;
    this.currentTopicId = 1;
    this.currentQuizId = 1;
    this.currentProgressId = 1;
    this.currentChatMessageId = 1;
    
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
  
  // User Progress Methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      progress => progress.userId === userId
    );
  }
  
  async getTopicProgress(userId: number, topicId: number): Promise<UserProgress | undefined> {
    const key = `${userId}:${topicId}`;
    return this.userProgress.get(key);
  }
  
  async updateTopicProgress(userId: number, topicId: number, progressData: Partial<InsertUserProgress>): Promise<UserProgress> {
    const key = `${userId}:${topicId}`;
    let progress = this.userProgress.get(key);
    
    if (progress) {
      // Update existing progress
      progress = { ...progress, ...progressData };
      this.userProgress.set(key, progress);
      return progress;
    } else {
      // Create new progress entry
      const id = this.currentProgressId++;
      const newProgress: UserProgress = {
        id,
        userId,
        topicId,
        completed: progressData.completed || false,
        quizScore: progressData.quizScore || null,
        quizAttempts: progressData.quizAttempts || 0,
        lastAccessed: progressData.lastAccessed || new Date(),
        notes: progressData.notes || null
      };
      this.userProgress.set(key, newProgress);
      return newProgress;
    }
  }
  
  async getCompletedTopics(userId: number): Promise<number[]> {
    const userProgress = Array.from(this.userProgress.values()).filter(
      progress => progress.userId === userId && progress.completed
    );
    return userProgress.map(progress => progress.topicId);
  }
  
  // Chat operations
  async getUserChatHistory(userId: number | null): Promise<ChatMessage[]> {
    // Convert Map to array
    const allMessages = Array.from(this.chatMessages.values());
    
    // If userId is provided, filter to only show that user's messages
    if (userId) {
      return allMessages
        .filter(message => message.userId === userId)
        .sort((a, b) => (b.timestamp as Date).getTime() - (a.timestamp as Date).getTime())
        .slice(0, 20);  // Limit to 20 most recent messages
    }
    
    // For anonymous users, return messages with no userId
    return allMessages
      .filter(message => message.userId === null)
      .sort((a, b) => (b.timestamp as Date).getTime() - (a.timestamp as Date).getTime())
      .slice(0, 10);  // Limit to 10 most recent messages
  }
  
  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const timestamp = new Date();
    
    const chatMessage: ChatMessage = {
      id,
      userId: message.userId || null,
      question: message.question,
      answer: message.answer,
      example: message.example,
      relatedTopicId: message.relatedTopicId || null,
      relatedTopicTitle: message.relatedTopicTitle,
      timestamp
    };
    
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
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
      },
      {
        title: "Credit Score",
        description: "A numerical rating of your creditworthiness. Learn how credit scores are calculated and ways to improve yours.",
        category: "Personal Finance",
        readingTime: "4 min read",
        content: {
          explanation: "A credit score is a numerical rating that represents your creditworthiness—essentially, how likely you are to repay borrowed money. In the United States, credit scores typically range from 300 to 850, with higher scores indicating better creditworthiness.\n\nCredit scores are calculated based on several factors:\n\n1. Payment history (35%): Whether you've paid your bills on time.\n2. Amounts owed (30%): How much debt you have, especially relative to your credit limits.\n3. Length of credit history (15%): How long you've been using credit.\n4. New credit (10%): How many recently opened accounts you have and recent credit inquiries.\n5. Credit mix (10%): The variety of credit accounts you have (credit cards, loans, mortgages, etc.).\n\nLenders use credit scores to decide whether to approve loan applications and what interest rates to charge. Higher scores typically result in better terms and lower interest rates, potentially saving you thousands of dollars over time.",
          realWorldExample: "Let's say two people apply for a $200,000 30-year mortgage: Alex with a credit score of 760 and Jordan with a score of 620.\n\nAlex might receive an interest rate of 3.75%, resulting in a monthly payment of about $926 and total interest of $133,360 over the life of the loan.\n\nJordan, with the lower score, might receive a rate of 5.25%, resulting in a monthly payment of about $1,104 and total interest of $197,440 over the loan's life.\n\nThe difference? Jordan would pay $178 more every month and an additional $64,080 in interest over 30 years—simply due to the lower credit score.\n\nThis example illustrates why maintaining a good credit score is so important. Even small improvements in your score can save you significant money, especially on large, long-term loans like mortgages."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Dollar Cost Averaging",
        description: "An investment strategy of buying fixed dollar amounts at regular intervals. Discover how this approach reduces the impact of market volatility.",
        category: "Investments",
        readingTime: "4 min read",
        content: {
          explanation: "Dollar cost averaging (DCA) is an investment strategy where you invest a fixed amount of money at regular intervals, regardless of the asset's price. Instead of trying to time the market with a large lump-sum investment, you spread your investments over time.\n\nThe key benefit of dollar cost averaging is that it automatically buys more shares when prices are low and fewer shares when prices are high. This approach can reduce the impact of market volatility and emotional decision-making on your investment returns.\n\nFor example, if you invest $100 monthly in a stock or fund, you'll purchase more shares when the price is $10 than when it's $20. Over time, this can lower your average cost per share compared to making a single purchase that might happen at a market high.",
          realWorldExample: "Let's compare two investors: Sarah uses dollar cost averaging, investing $300 every month for 4 months in a stock. Taylor makes a lump-sum investment of $1,200 at the beginning.\n\nHere's how Sarah's investment plays out:\n- Month 1: Share price $20, buys 15 shares ($300 ÷ $20)\n- Month 2: Share price $15, buys 20 shares ($300 ÷ $15)\n- Month 3: Share price $25, buys 12 shares ($300 ÷ $25)\n- Month 4: Share price $20, buys 15 shares ($300 ÷ $20)\n\nIn total, Sarah acquires 62 shares at an average cost of $19.35 per share ($1,200 ÷ 62 shares).\n\nTaylor invests all $1,200 in Month 1, purchasing 60 shares at $20 each.\n\nBy the end of Month 4, both have invested $1,200, but Sarah owns 62 shares while Taylor owns 60. If the stock price increases in the future, Sarah has a slight advantage. More importantly, she reduced her risk by spreading her purchases instead of potentially investing everything at a market peak.\n\nMany people practice dollar cost averaging through regular contributions to 401(k) plans or automated monthly investments, often without thinking about it as a specific strategy."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Compound Interest",
        description: "The concept of earning interest on both principal and previously earned interest. Understand how compound interest accelerates wealth growth over time.",
        category: "Personal Finance",
        readingTime: "5 min read",
        content: {
          explanation: "Compound interest is often called the 'eighth wonder of the world' because of its powerful wealth-building potential. It's the process of earning interest on both your original investment (the principal) and on the interest you've already accumulated.\n\nUnlike simple interest, which is calculated only on the initial principal, compound interest creates a snowball effect. As your investment grows, the interest earned grows too, accelerating your returns over time.\n\nThe formula for compound interest is: A = P(1 + r)^t\nWhere:\nA = Final amount\nP = Principal (initial investment)\nr = Interest rate (in decimal form)\nt = Time (in years)\n\nThe power of compound interest depends heavily on three factors:\n1. Time: The longer your money compounds, the more dramatic the growth.\n2. Rate of return: Higher rates create faster compounding.\n3. Frequency of compounding: More frequent compounding (daily vs. annually) results in more growth.",
          realWorldExample: "Consider two people: Liam and Olivia, both 25 years old.\n\nLiam invests $10,000 at age 25 in an index fund earning an average 7% annual return, and then never adds another dollar.\n\nOlivia waits until age 35 to start investing, then invests $10,000 per year for the next 30 years (a total of $300,000) in the same index fund earning 7% annually.\n\nBy age 65:\n\nLiam's single $10,000 investment grows to about $149,000, despite never adding more money.\n\nOlivia's multiple investments totaling $300,000 grow to about $1,010,000.\n\nDespite investing 30 times more money than Liam, Olivia only ends up with about 6.8 times more money. This demonstrates the incredible value of time in the compounding process.\n\nAnother way to look at it: If Liam had continued investing just $10,000 per year from age 25 to 65, he would have ended up with about $2,137,000, more than double what Olivia accumulated, despite investing only 33% more money ($400,000 vs. $300,000)."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Market Capitalization",
        description: "The total value of a company's outstanding shares of stock. Learn how market cap indicates company size and influences investment strategies.",
        category: "Markets",
        readingTime: "3 min read",
        content: {
          explanation: "Market capitalization, or 'market cap,' is the total dollar value of a company's outstanding shares of stock. It's calculated by multiplying the current share price by the total number of outstanding shares.\n\nMarket Cap = Current Share Price × Total Outstanding Shares\n\nMarket cap is used to categorize companies by size:\n\n- Large-cap: Companies valued at $10 billion or more, typically established industry leaders with more stable returns but slower growth\n- Mid-cap: Companies valued between $2-10 billion, often growing companies with moderate risk and potential for expansion\n- Small-cap: Companies valued between $300 million-$2 billion, typically newer or niche companies with higher risk and growth potential\n- Micro-cap: Companies valued below $300 million, often speculative investments with high risk\n\nInvestors use market cap as a basic measure of a company's size, stability, and growth prospects. It's more useful than share price alone, which doesn't tell you how large a company actually is.",
          realWorldExample: "Consider two companies: Company A has 10 million outstanding shares trading at $10 each, while Company B has 1 million outstanding shares trading at $50 each.\n\nCompany A's market cap: 10 million × $10 = $100 million\nCompany B's market cap: 1 million × $50 = $50 million\n\nDespite Company B having a higher share price, Company A is actually twice as large in terms of market value.\n\nThis distinction is important for diversification. If you wanted to invest in companies of different sizes to spread risk, you might include large-cap stocks like Apple (market cap over $2 trillion), mid-cap stocks like Pinterest (market cap around $20 billion), and small-cap stocks like Revolve Group (market cap around $1.5 billion).\n\nMany index funds and ETFs are specifically designed around market cap categories. For example, the S&P 500 includes large-cap stocks, while the Russell 2000 tracks small-cap companies. Understanding market cap helps investors build portfolios that align with their risk tolerance and investment goals."
        },
        createdAt: new Date().toISOString()
      },
      {
        title: "Monetary Policy",
        description: "Actions by central banks to influence the money supply and interest rates. Explore how monetary policy affects the economy and financial markets.",
        category: "Economics",
        readingTime: "7 min read",
        content: {
          explanation: "Monetary policy refers to the actions taken by a central bank, such as the Federal Reserve in the United States, to influence the amount of money and credit in an economy. By managing the money supply and interest rates, central banks aim to promote economic growth while controlling inflation and maintaining financial stability.\n\nThe main tools of monetary policy include:\n\n1. Interest rates: Central banks set a key interest rate (like the federal funds rate in the US) that influences borrowing costs throughout the economy.\n\n2. Reserve requirements: Banks must hold a certain percentage of their deposits as reserves, which affects how much they can lend.\n\n3. Open market operations: Central banks buy or sell government securities to increase or decrease the money supply.\n\n4. Quantitative easing: In extraordinary circumstances, central banks may purchase various financial assets to inject money directly into the economy.\n\nMonetary policy can be expansionary (stimulating growth by lowering rates and increasing money supply) or contractionary (fighting inflation by raising rates and reducing money supply).",
          realWorldExample: "During the 2008 financial crisis and its aftermath, the Federal Reserve implemented a series of monetary policy actions to prevent economic collapse and stimulate recovery:\n\n1. The Fed rapidly cut its key interest rate from 5.25% in September 2007 to nearly zero by December 2008.\n\n2. When interest rates hit the 'zero lower bound,' conventional monetary policy became less effective, so the Fed launched quantitative easing (QE) programs. Under QE, the Fed purchased trillions of dollars of Treasury bonds and mortgage-backed securities, injecting money into the financial system and keeping long-term interest rates low.\n\n3. These actions made borrowing cheaper for businesses and consumers. Mortgage rates fell to historic lows, helping to eventually stabilize the housing market. Businesses could borrow more affordably to invest and hire.\n\nThe real-world effects of these policies played out in everyday life. Homeowners could refinance mortgages at lower rates, saving hundreds of dollars on monthly payments. Auto loans became more affordable. Businesses expanded operations with cheaper credit. Stock markets rebounded partly due to the increased money supply and low returns on bonds, which pushed investors toward equities.\n\nHowever, the prolonged period of low interest rates also had side effects, such as reduced income for savers and potential asset bubbles. This illustrates how monetary policy involves complex tradeoffs and can affect different segments of society in different ways."
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

/**
 * Database Storage Implementation
 * 
 * This class implements the IStorage interface using a PostgreSQL database
 * with Drizzle ORM for data persistence.
 */
export class DatabaseStorage implements IStorage {
  /**
   * Get a user by ID
   */
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  /**
   * Get a user by username
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  /**
   * Create a new user
   */
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  /**
   * Get all topics
   */
  async getAllTopics(): Promise<Topic[]> {
    return db.select().from(topics).orderBy(asc(topics.id));
  }
  
  /**
   * Get a topic by ID
   */
  async getTopicById(id: number): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.id, id));
    return topic;
  }
  
  /**
   * Create a new topic
   */
  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const [topic] = await db.insert(topics).values(insertTopic).returning();
    return topic;
  }
  
  /**
   * Get quiz by topic ID
   */
  async getQuizByTopicId(topicId: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.topicId, topicId));
    return quiz;
  }
  
  /**
   * Create a new quiz
   */
  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(insertQuiz).returning();
    return quiz;
  }
  
  /**
   * Get all progress entries for a user
   */
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }
  
  /**
   * Get progress for a specific topic and user
   */
  async getTopicProgress(userId: number, topicId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.topicId, topicId)
      )
    );
    return progress;
  }
  
  /**
   * Update or create progress for a topic
   */
  async updateTopicProgress(userId: number, topicId: number, progressData: Partial<InsertUserProgress>): Promise<UserProgress> {
    // Check if progress already exists
    const existingProgress = await this.getTopicProgress(userId, topicId);
    
    if (existingProgress) {
      // Update existing progress
      const [updated] = await db.update(userProgress)
        .set({
          ...progressData,
          // Always update the lastAccessed timestamp unless explicitly provided
          lastAccessed: progressData.lastAccessed || new Date()
        })
        .where(eq(userProgress.id, existingProgress.id))
        .returning();
      return updated;
    } else {
      // Create new progress
      const [created] = await db.insert(userProgress)
        .values({
          userId,
          topicId,
          ...progressData,
          // Default values if not provided
          completed: progressData.completed !== undefined ? progressData.completed : false,
          quizAttempts: progressData.quizAttempts || 0,
          lastAccessed: progressData.lastAccessed || new Date()
        })
        .returning();
      return created;
    }
  }
  
  /**
   * Get list of topic IDs that the user has completed
   */
  async getCompletedTopics(userId: number): Promise<number[]> {
    const completed = await db.select({ topicId: userProgress.topicId })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.completed, true)
        )
      );
    return completed.map(record => record.topicId);
  }
  
  /**
   * Get chat message history for a user
   * If userId is null, returns only non-user-specific messages (for anonymous users)
   */
  async getUserChatHistory(userId: number | null): Promise<ChatMessage[]> {
    // For logged-in users, get their specific chat history
    if (userId) {
      return db.select()
        .from(chatMessages)
        .where(eq(chatMessages.userId, userId))
        .orderBy(desc(chatMessages.timestamp))
        .limit(20); // Limit to most recent 20 messages
    }
    
    // For anonymous users, return only non-user specific messages (demo or session-based)
    // Since direct null comparison is tricky, let's just get recent messages without a filter
    // and filter in memory
    const result = await db.select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.timestamp))
      .limit(50);
      
    // Filter for null userId in memory
    return result.filter(msg => msg.userId === null).slice(0, 10);
  }
  
  /**
   * Save a chat message to the database
   */
  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages)
      .values({
        ...message,
        // If userId is not provided, it will be null (for anonymous users)
        timestamp: new Date()
      })
      .returning();
    
    return newMessage;
  }
}

// Export the database storage instance
export const storage = new DatabaseStorage();
