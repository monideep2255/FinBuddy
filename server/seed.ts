import { db } from "./db";
import { topics, quizzes, scenarios, insertTopicSchema, insertQuizSchema, insertScenarioSchema, type QuizQuestion } from "@shared/schema";
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
      // Always reset the database to avoid duplicates
      const reset = await resetDatabase();
      if (!reset) {
        log("Failed to reset database, aborting seed operation.");
        return;
      }
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
        readingTime: "",
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
        readingTime: "",
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
        readingTime: "",
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
        readingTime: "",
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
        readingTime: "",
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
        readingTime: "",
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
        readingTime: "",
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
        readingTime: "",
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
        readingTime: "",
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
        readingTime: "",
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
    
    // Initial scenarios data
    const initialScenarios = [
      {
        title: "Fed Raises Interest Rates by 0.75%",
        description: "The Federal Reserve increases the federal funds rate by 75 basis points to combat inflation.",
        category: "Monetary Policy",
        scenarioType: "predefined",
        details: {
          change: {
            type: "interest_rate",
            value: 0.75,
            direction: "increase",
            magnitude: "significant",
            rationale: "The Federal Reserve is raising rates to combat persistent inflation that has exceeded its 2% target."
          },
          timeframe: "immediate"
        },
        impacts: {
          markets: {
            stocks: {
              overall: -5,
              description: "Stock markets typically react negatively to interest rate hikes as borrowing costs increase and future profit expectations decrease.",
              sectors: {
                "Technology": {
                  impact: -7,
                  reason: "Growth stocks with future earnings are more heavily discounted when rates rise."
                },
                "Financials": {
                  impact: 2,
                  reason: "Banks can benefit from higher interest rate spreads."
                },
                "Utilities": {
                  impact: -6,
                  reason: "High-dividend stocks become less attractive compared to bonds with higher yields."
                }
              }
            },
            bonds: {
              overall: -3,
              description: "Existing bonds lose value as rates rise because newer bonds offer higher yields.",
              types: {
                "Long-term Treasury": {
                  impact: -5,
                  reason: "Long-duration bonds are more sensitive to rate changes."
                },
                "Short-term Treasury": {
                  impact: -1,
                  reason: "Short-duration bonds are less affected by rate increases."
                },
                "Corporate Bonds": {
                  impact: -4,
                  reason: "Corporate borrowing becomes more expensive, increasing default risk."
                }
              }
            },
            commodities: {
              gold: -2,
              oil: -3,
              description: "Gold often falls as higher rates increase the opportunity cost of holding non-yielding assets. Oil may decline due to expectations of reduced economic activity."
            },
            economy: {
              employment: -1,
              inflation: -3,
              gdp: -2,
              description: "Higher rates are designed to slow economic activity, reducing inflation but potentially increasing unemployment and slowing GDP growth."
            }
          },
          analysis: "A 0.75% rate hike is a significant monetary tightening action that signals the Fed's strong commitment to controlling inflation. Markets typically experience volatility immediately after such announcements. The economy may take 6-12 months to fully reflect the impact of higher rates as businesses adjust investment plans and consumers reduce borrowing. While painful in the short term, this action aims to create a more sustainable economic growth path with stable prices.",
          learningPoints: [
            "Interest rates are the primary tool central banks use to control inflation",
            "Rate hikes typically cause immediate market reactions before the real economy changes",
            "Different asset classes and sectors respond differently to rate changes",
            "Bond prices move inversely to interest rates",
            "Monetary policy involves trade-offs between inflation, employment, and growth"
          ]
        },
        difficulty: 1,
        relatedTopicIds: [1, 2, 3]
      },
      {
        title: "Inflation Spikes to 6%",
        description: "Annual inflation rate rises unexpectedly from 3% to 6%, exceeding economist forecasts significantly.",
        category: "Inflation",
        scenarioType: "predefined",
        details: {
          change: {
            type: "inflation",
            value: 6.0,
            direction: "increase",
            magnitude: "significant",
            rationale: "Supply chain disruptions, rising energy costs, and strong consumer demand have pushed prices higher than expected."
          },
          timeframe: "immediate"
        },
        impacts: {
          markets: {
            stocks: {
              overall: -4,
              description: "High inflation typically pressures stock valuations as it erodes corporate profit margins and prompts expectations of interest rate hikes.",
              sectors: {
                "Consumer Discretionary": {
                  impact: -7,
                  reason: "Consumers cut back on non-essential purchases as their purchasing power decreases."
                },
                "Energy": {
                  impact: 5,
                  reason: "Energy companies benefit from higher commodity prices, which are often a key driver of inflation."
                },
                "Consumer Staples": {
                  impact: -2,
                  reason: "Essential goods see less demand reduction, but profit margins compress as input costs rise."
                }
              }
            },
            bonds: {
              overall: -6,
              description: "Bonds suffer during inflation spikes as it erodes the real value of future interest payments and principal.",
              types: {
                "Treasury Bonds": {
                  impact: -8,
                  reason: "Fixed-rate government bonds are particularly vulnerable to inflation erosion."
                },
                "TIPS (Treasury Inflation-Protected Securities)": {
                  impact: 3,
                  reason: "These securities are designed to increase in value during inflationary periods."
                },
                "High-Yield Corporate Bonds": {
                  impact: -4,
                  reason: "Less impacted than treasuries but still face price pressure from anticipated rate hikes."
                }
              }
            },
            commodities: {
              gold: 7,
              oil: 5,
              description: "Commodities often perform well during inflation as they represent real assets with intrinsic value."
            },
            economy: {
              employment: 1,
              inflation: 6,
              gdp: -2,
              description: "Initially, high inflation may coincide with strong employment, but eventually leads to economic slowdown as purchasing power erodes and central banks tighten policy."
            }
          },
          analysis: "A sudden spike in inflation to 6% represents a significant economic development that will likely trigger policy responses. Central banks would be expected to accelerate interest rate increases, potentially causing market volatility. While some assets like commodities and inflation-protected securities might benefit, most financial assets suffer as future cash flows are discounted at higher rates. For consumers, the impact is felt through reduced purchasing power, especially for lower-income households that spend higher percentages of income on necessities like food and energy.",
          learningPoints: [
            "Inflation erodes purchasing power and the real value of fixed-income investments",
            "Not all assets respond the same way to inflation – some provide natural hedges",
            "Central banks typically respond to high inflation by raising interest rates",
            "Inflation can create winners and losers across different economic sectors",
            "Higher input costs can squeeze corporate profit margins, affecting stock valuations"
          ]
        },
        difficulty: 2,
        relatedTopicIds: [1, 4, 7]
      },
      {
        title: "Tariffs Rise by 20% on Imports",
        description: "Government announces a 20% increase in tariffs on imported goods, affecting international trade relationships.",
        category: "Trade",
        scenarioType: "predefined",
        details: {
          change: {
            type: "tariff",
            value: 20.0,
            direction: "increase",
            magnitude: "significant",
            rationale: "Government is implementing protectionist policies to support domestic industries and reduce trade deficits."
          },
          timeframe: "short_term"
        },
        impacts: {
          markets: {
            stocks: {
              overall: -3,
              description: "Overall negative impact as global supply chains are disrupted and costs increase, but with significant sector variation.",
              sectors: {
                "Manufacturing": {
                  impact: 4,
                  reason: "Domestic manufacturers protected from foreign competition may see increased market share."
                },
                "Retail": {
                  impact: -6,
                  reason: "Retailers face higher costs for imported goods that cannot be easily passed on to consumers."
                },
                "Technology": {
                  impact: -5,
                  reason: "Global tech companies with international supply chains face disruption and higher component costs."
                }
              }
            },
            bonds: {
              overall: -1,
              description: "Minor negative impact as tariffs may contribute to inflation, putting pressure on central banks to raise rates.",
              types: {
                "Government Bonds": {
                  impact: -2,
                  reason: "Slight pressure due to potential inflation and budget impacts from reduced trade."
                },
                "Corporate Bonds": {
                  impact: -3,
                  reason: "Companies with global supply chains may face increased costs affecting their credit quality."
                },
                "Municipal Bonds": {
                  impact: 0,
                  reason: "Limited direct impact from international trade changes."
                }
              }
            },
            commodities: {
              gold: 2,
              oil: -1,
              description: "Gold benefits from economic uncertainty, while oil may face pressure from expectations of reduced global trade and economic activity."
            },
            economy: {
              employment: 1,
              inflation: 3,
              gdp: -2,
              description: "Short-term boost to domestic employment in protected industries, but higher inflation from import prices and lower overall economic efficiency resulting in reduced GDP growth."
            }
          },
          analysis: "A 20% tariff increase represents a significant shift in trade policy with widespread economic implications. While designed to protect domestic industries, tariffs typically lead to higher consumer prices, potential retaliation from trading partners, and disruption of global supply chains. The net effect tends to be inflationary and growth-reducing in the medium term. Certain industries may benefit from protection, but consumers and businesses reliant on imported goods face higher costs. Financial markets often react negatively to trade restrictions due to increased uncertainty and efficiency losses in the global economy.",
          learningPoints: [
            "Tariffs create both winners and losers in the domestic economy",
            "Trade restrictions typically increase prices for consumers",
            "Global supply chains can be significantly disrupted by trade policy changes",
            "Protectionist policies often trigger retaliation from trading partners",
            "Economic nationalism tends to reduce global economic efficiency while potentially supporting specific domestic industries"
          ]
        },
        difficulty: 2,
        relatedTopicIds: [3, 5, 8]
      },
      {
        title: "Corporate Tax Rate Cut by 10%",
        description: "Government passes legislation reducing the corporate tax rate from 25% to 15%, significantly changing business tax obligations.",
        category: "Fiscal Policy",
        scenarioType: "predefined",
        details: {
          change: {
            type: "tax_rate",
            value: 10.0,
            direction: "decrease",
            magnitude: "significant",
            rationale: "Government is implementing tax cuts to stimulate business investment and economic growth."
          },
          timeframe: "medium_term"
        },
        impacts: {
          markets: {
            stocks: {
              overall: 7,
              description: "Corporate tax cuts directly increase after-tax earnings, boosting stock valuations, especially for domestic companies with high effective tax rates.",
              sectors: {
                "Technology": {
                  impact: 8,
                  reason: "Tech companies with large domestic operations benefit substantially from lower corporate taxes."
                },
                "Financials": {
                  impact: 9,
                  reason: "Banks and financial institutions typically pay close to the full statutory rate and benefit significantly."
                },
                "Utilities": {
                  impact: 4,
                  reason: "Regulated utilities may be required to pass tax savings to consumers, limiting stock price gains."
                }
              }
            },
            bonds: {
              overall: -3,
              description: "Lower corporate taxes may boost economic growth and inflation expectations, potentially leading to higher interest rates.",
              types: {
                "Treasury Bonds": {
                  impact: -4,
                  reason: "Growth and inflation expectations may push yields higher and prices lower."
                },
                "Corporate Bonds": {
                  impact: -1,
                  reason: "Improved corporate fundamentals offset some of the negative impact from rising rates."
                },
                "Municipal Bonds": {
                  impact: -5,
                  reason: "Lower corporate rates reduce the relative tax advantage of municipal bonds."
                }
              }
            },
            commodities: {
              gold: -2,
              oil: 3,
              description: "Stronger economic growth expectations support oil prices, while gold may suffer from rising interest rates and a stronger dollar."
            },
            economy: {
              employment: 4,
              inflation: 2,
              gdp: 5,
              description: "Corporate tax cuts tend to stimulate business investment, hiring, and overall economic activity, with moderate inflationary pressure."
            }
          },
          analysis: "A substantial corporate tax rate reduction represents a major fiscal stimulus that typically boosts corporate earnings, business investment, and stock prices in the near term. The market impact is usually swift and positive for equities, while bonds may face pressure from higher growth and inflation expectations. The economic benefits include increased capital spending, job creation, and potentially higher wages, though the magnitude depends on how companies allocate the tax savings between shareholders, employees, and investments. Critics note that such cuts can increase budget deficits and may have limited long-term growth effects if not accompanied by other structural reforms.",
          learningPoints: [
            "Corporate tax cuts directly impact company earnings and valuations",
            "Different sectors benefit unevenly from corporate tax reductions",
            "Tax policy creates complex interactions between equity and fixed income markets",
            "Fiscal stimulus through tax cuts can boost economic growth but may increase deficits",
            "The effectiveness of tax cuts depends on how companies allocate the savings"
          ]
        },
        difficulty: 2,
        relatedTopicIds: [3, 6, 8]
      },
      {
        title: "Oil Price Surges 40%",
        description: "Global oil prices spike by 40% due to geopolitical tensions and supply disruptions in major oil-producing regions.",
        category: "Commodities",
        scenarioType: "predefined",
        details: {
          change: {
            type: "commodity_price",
            value: 40.0,
            direction: "increase",
            magnitude: "severe",
            rationale: "Major supply disruptions combined with limited spare production capacity have created a supply shortage in global oil markets."
          },
          timeframe: "immediate"
        },
        impacts: {
          markets: {
            stocks: {
              overall: -4,
              description: "Higher energy costs act as a tax on consumers and businesses, pressuring overall market valuations except for energy producers.",
              sectors: {
                "Energy": {
                  impact: 9,
                  reason: "Oil producers and service companies benefit directly from higher oil prices."
                },
                "Transportation": {
                  impact: -8,
                  reason: "Airlines, shipping, and logistics companies face sharply higher fuel costs."
                },
                "Consumer Discretionary": {
                  impact: -6,
                  reason: "Higher gasoline prices reduce consumers' disposable income for other purchases."
                }
              }
            },
            bonds: {
              overall: -3,
              description: "Oil price shocks tend to be inflationary, potentially leading to higher interest rates and lower bond prices.",
              types: {
                "Treasury Bonds": {
                  impact: -4,
                  reason: "Inflation concerns may push yields higher despite potential flight to safety."
                },
                "Corporate Bonds": {
                  impact: -5,
                  reason: "Energy-intensive industries may face credit deterioration due to higher costs."
                },
                "TIPS": {
                  impact: 2,
                  reason: "Inflation-protected securities benefit from rising inflation expectations."
                }
              }
            },
            commodities: {
              gold: 5,
              oil: 40,
              description: "Oil prices rise by definition in this scenario, while gold often benefits as an inflation hedge and safe haven."
            },
            economy: {
              employment: -2,
              inflation: 6,
              gdp: -3,
              description: "Oil price shocks tend to be stagflationary, increasing inflation while reducing economic growth and potentially employment."
            }
          },
          analysis: "A sudden 40% surge in oil prices represents a significant economic shock with far-reaching implications across markets and the global economy. Higher energy costs act as a regressive tax, disproportionately affecting lower-income households and energy-intensive industries. While energy producers benefit, most sectors of the economy face margin pressures and reduced consumer spending. Central banks face a difficult policy dilemma as inflation rises while growth slows. Historically, major oil price shocks have preceded economic downturns, though the global economy has become somewhat less oil-intensive in recent decades, potentially reducing the impact compared to historical episodes.",
          learningPoints: [
            "Oil price shocks create winners and losers across different economic sectors",
            "Energy price increases are inflationary and tend to slow economic growth",
            "Commodity price volatility can significantly impact consumer spending patterns",
            "Central banks face difficult policy choices when confronting supply-side inflation",
            "Energy price changes affect countries differently based on whether they are net importers or exporters"
          ]
        },
        difficulty: 3,
        relatedTopicIds: [1, 4, 7]
      },
      {
        title: "Housing Market Correction: 15% Price Drop",
        description: "Residential real estate prices decline by 15% nationwide after a period of rapid appreciation, affecting homeowners and the broader economy.",
        category: "Real Estate",
        scenarioType: "predefined",
        details: {
          change: {
            type: "housing_prices",
            value: 15.0,
            direction: "decrease",
            magnitude: "significant",
            rationale: "Rising mortgage rates, affordability concerns, and overbuilding in certain markets have triggered a correction in the housing market."
          },
          timeframe: "medium_term"
        },
        impacts: {
          markets: {
            stocks: {
              overall: -4,
              description: "Housing market corrections typically impact consumer wealth and spending, with broader effects across the economy.",
              sectors: {
                "Homebuilders": {
                  impact: -9,
                  reason: "Declining home prices directly impact homebuilder profitability and new construction demand."
                },
                "Financials": {
                  impact: -6,
                  reason: "Banks with mortgage exposure face increased default risk and reduced lending volume."
                },
                "Home Improvement": {
                  impact: -7,
                  reason: "Lower home values typically reduce home improvement spending and renovation activity."
                }
              }
            },
            bonds: {
              overall: 3,
              description: "Housing market weakness typically leads to lower interest rates as economic growth slows and inflation pressures ease.",
              types: {
                "Treasury Bonds": {
                  impact: 5,
                  reason: "Flight to safety and lower rate expectations benefit government bonds."
                },
                "Mortgage-Backed Securities": {
                  impact: -2,
                  reason: "Higher default risk and prepayment changes negatively impact MBS despite generally lower rates."
                },
                "Corporate Bonds": {
                  impact: 1,
                  reason: "Lower rates help, but credit concerns for housing-related industries create mixed impact."
                }
              }
            },
            commodities: {
              gold: 3,
              oil: -4,
              description: "Economic slowdown reduces energy demand and prices, while gold may benefit from financial uncertainty and lower real interest rates."
            },
            economy: {
              employment: -4,
              inflation: -2,
              gdp: -3,
              description: "Housing market corrections typically reduce construction activity, home equity extraction, and consumer confidence, slowing overall economic growth."
            }
          },
          analysis: "A 15% decline in housing prices represents a significant correction with widespread economic implications due to real estate's importance to household wealth and the financial system. The negative wealth effect reduces consumer spending, while construction activity and related industries contract. Financial institutions face increased mortgage delinquencies and tighter lending standards, potentially creating a credit crunch in severe cases. However, lower housing costs eventually improve affordability for new buyers, and lower interest rates (a typical central bank response) can eventually stabilize the market. The severity of broader economic impacts depends significantly on mortgage market structure, household leverage, and banking system exposure to real estate.",
          learningPoints: [
            "Housing wealth significantly influences consumer spending behavior",
            "Real estate corrections impact multiple sectors beyond just homebuilders",
            "Housing market health is closely tied to interest rate trends",
            "Property market corrections can create financial system stress through mortgage defaults",
            "Housing affordability improves during corrections, creating opportunities for new buyers"
          ]
        },
        difficulty: 3,
        relatedTopicIds: [2, 5, 8]
      }
    ];
    
    // Insert scenarios
    for (const scenarioData of initialScenarios) {
      const validatedScenario = insertScenarioSchema.parse(scenarioData);
      await db.insert(scenarios).values({
        ...validatedScenario,
        createdAt: new Date(),
        popularity: 0
      });
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