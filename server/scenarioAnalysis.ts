import OpenAI from "openai";
import { ScenarioDetails, ScenarioImpact } from "@shared/schema";
import { log } from "./vite";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

/**
 * Generate impact analysis for an economic scenario
 * 
 * This function uses OpenAI to analyze how a specific economic change
 * would impact various markets and economic indicators.
 * 
 * @param details Details of the economic scenario (type, value, direction, etc.)
 * @returns A comprehensive impact analysis across markets and economic factors
 */
export async function generateScenarioImpacts(details: ScenarioDetails): Promise<ScenarioImpact> {
  if (!openai) {
    return generateFallbackImpacts(details);
  }

  try {
    const systemPrompt = `You are an expert financial analyst and economist. Your job is to analyze economic scenarios and provide detailed, realistic impacts across various markets and economic factors.
    
    Analyze the provided economic scenario and return a comprehensive analysis of how it would affect:
    1. Stock markets (overall and key sectors)
    2. Bond markets (different types of bonds)
    3. Commodities (gold and oil)
    4. The broader economy (employment, inflation, GDP)
    
    Use a scale from -10 to +10 to indicate impact severity, where:
    - Negative numbers indicate negative impacts (price drops, economic contraction)
    - Positive numbers indicate positive impacts (price increases, economic expansion)
    - The magnitude indicates severity (±1-3 = mild, ±4-7 = moderate, ±8-10 = severe)
    
    Your analysis should reflect real-world economic relationships and be based on historical precedents and economic theory.`;

    const userPrompt = `Please analyze this economic scenario:
    
    Type: ${details.change.type}
    Value: ${details.change.value}
    Direction: ${details.change.direction}
    Magnitude: ${details.change.magnitude}
    Rationale: ${details.change.rationale}
    Timeframe: ${details.timeframe}
    
    Provide impacts on markets and the economy, with reasoning for each. Include an overall analysis and key learning points for someone studying finance.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return result as ScenarioImpact;
  } catch (error) {
    log(`Error generating scenario impacts: ${error}`);
    return generateFallbackImpacts(details);
  }
}

/**
 * Analyze a custom economic scenario defined by the user
 * This is used when users want to explore impacts beyond predefined scenarios
 */
export async function analyzeCustomScenario(
  scenarioType: string,
  value: number,
  direction: string,
  customDetails?: string
): Promise<{ details: ScenarioDetails; impacts: ScenarioImpact }> {
  if (!openai) {
    const details = generateBasicScenarioDetails(scenarioType, value, direction, customDetails);
    return {
      details,
      impacts: generateFallbackImpacts(details)
    };
  }

  try {
    // First generate the detailed scenario
    const scenarioSystemPrompt = `You are an expert economist. Your task is to construct a realistic economic scenario based on user input.
    Format the scenario with proper economic terminology and details.`;

    const scenarioUserPrompt = `Create a detailed economic scenario for:
    Type: ${scenarioType}
    Value: ${value}
    Direction: ${direction}
    ${customDetails ? `Additional context: ${customDetails}` : ''}
    
    Return a properly formatted scenario details object with rationale and appropriate magnitude description.`;

    const scenarioResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: scenarioSystemPrompt },
        { role: "user", content: scenarioUserPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const details = JSON.parse(scenarioResponse.choices[0].message.content || "{}") as ScenarioDetails;
    
    // Then analyze the impacts of this scenario
    const impacts = await generateScenarioImpacts(details);
    
    return { details, impacts };
  } catch (error) {
    log(`Error analyzing custom scenario: ${error}`);
    const details = generateBasicScenarioDetails(scenarioType, value, direction, customDetails);
    return {
      details,
      impacts: generateFallbackImpacts(details)
    };
  }
}

/**
 * Generate simple scenario details when custom details can't be generated
 */
function generateBasicScenarioDetails(
  scenarioType: string,
  value: number,
  direction: string,
  customDetails?: string
): ScenarioDetails {
  const magnitude = value > 5 ? "significant" : value > 2 ? "moderate" : "slight";
  
  return {
    change: {
      type: scenarioType,
      value,
      direction,
      magnitude,
      rationale: customDetails || `${direction === "increase" ? "Rising" : "Falling"} ${scenarioType} due to changing economic conditions.`
    },
    timeframe: "immediate"
  };
}

/**
 * Generate fallback impacts when OpenAI is unavailable
 * This provides basic economic relationships without AI analysis
 */
function generateFallbackImpacts(details: ScenarioDetails): ScenarioImpact {
  // This provides standardized impacts based on common economic relationships
  // when AI analysis is unavailable
  
  const { type, value, direction } = details.change;
  const multiplier = direction === "increase" ? 1 : -1;
  const magnitude = value > 5 ? 3 : value > 2 ? 2 : 1;
  const impactValue = multiplier * magnitude;
  
  // Define impact based on scenario type
  let stocksOverall, bondsOverall, goldImpact, oilImpact, employmentImpact, inflationImpact, gdpImpact;
  let analysis = "";
  const learningPoints: string[] = [];
  
  switch (type) {
    case "interest_rate":
      stocksOverall = -impactValue;
      bondsOverall = -impactValue;
      goldImpact = -impactValue;
      oilImpact = -impactValue;
      employmentImpact = -impactValue * 0.5;
      inflationImpact = -impactValue;
      gdpImpact = -impactValue * 0.7;
      analysis = `Changes in interest rates typically affect borrowing costs and investment decisions across the economy.`;
      learningPoints.push("Interest rates impact the cost of borrowing throughout the economy");
      learningPoints.push("Bond prices typically move inversely to interest rates");
      learningPoints.push("Higher rates can slow economic activity by reducing borrowing and spending");
      break;
      
    case "inflation":
      stocksOverall = -impactValue;
      bondsOverall = -impactValue * 1.2;
      goldImpact = impactValue;
      oilImpact = impactValue * 0.5;
      employmentImpact = impactValue * 0.3;
      inflationImpact = impactValue;
      gdpImpact = -impactValue * 0.5;
      analysis = `Inflation affects purchasing power and the real value of fixed-income investments.`;
      learningPoints.push("Inflation erodes the purchasing power of fixed-income investments");
      learningPoints.push("Some assets like commodities can provide a hedge against inflation");
      learningPoints.push("High inflation often leads to monetary policy tightening");
      break;
      
    case "tariff":
      stocksOverall = -impactValue * 0.8;
      bondsOverall = -impactValue * 0.3;
      goldImpact = impactValue * 0.5;
      oilImpact = -impactValue * 0.5;
      employmentImpact = impactValue * 0.3;
      inflationImpact = impactValue * 0.7;
      gdpImpact = -impactValue * 0.5;
      analysis = `Tariffs typically impact global trade, causing market uncertainty and sector-specific effects.`;
      learningPoints.push("Tariffs can create both winners and losers in the domestic economy");
      learningPoints.push("Trade restrictions typically increase prices for consumers");
      learningPoints.push("Protectionist policies often lead to reduced global economic efficiency");
      break;
      
    default:
      stocksOverall = -impactValue * 0.5;
      bondsOverall = -impactValue * 0.5;
      goldImpact = impactValue * 0.5;
      oilImpact = impactValue * 0.5;
      employmentImpact = -impactValue * 0.5;
      inflationImpact = impactValue * 0.5;
      gdpImpact = -impactValue * 0.5;
      analysis = `This economic change would have varied impacts across markets and the economy.`;
      learningPoints.push("Economic changes often have complex impacts across different markets");
      learningPoints.push("Market reactions depend on expectations and current economic conditions");
      break;
  }
  
  return {
    markets: {
      stocks: {
        overall: stocksOverall,
        description: `Stock markets would likely ${stocksOverall > 0 ? 'rise' : 'fall'} in response to this change.`,
        sectors: {
          "Technology": {
            impact: stocksOverall * 1.2,
            reason: "Technology stocks tend to be more volatile in response to economic changes."
          },
          "Financials": {
            impact: type === "interest_rate" ? impactValue : stocksOverall,
            reason: "Financial sector is particularly sensitive to interest rate changes."
          },
          "Consumer Staples": {
            impact: stocksOverall * 0.7,
            reason: "Consumer staples tend to be more resistant to economic shifts."
          }
        }
      },
      bonds: {
        overall: bondsOverall,
        description: `Bond markets would experience ${bondsOverall > 0 ? 'gains' : 'pressure'} under these conditions.`,
        types: {
          "Government Bonds": {
            impact: bondsOverall,
            reason: "Government bonds reflect broad interest rate and inflation expectations."
          },
          "Corporate Bonds": {
            impact: bondsOverall * 1.1,
            reason: "Corporate bonds include additional credit risk considerations."
          }
        }
      },
      commodities: {
        gold: goldImpact,
        oil: oilImpact,
        description: `Commodities would show mixed reactions with gold ${goldImpact > 0 ? 'rising' : 'falling'} and oil ${oilImpact > 0 ? 'rising' : 'falling'}.`
      },
      economy: {
        employment: employmentImpact,
        inflation: inflationImpact,
        gdp: gdpImpact,
        description: `Economic indicators would adjust with employment ${employmentImpact > 0 ? 'increasing' : 'decreasing'}, inflation ${inflationImpact > 0 ? 'rising' : 'falling'}, and GDP growth ${gdpImpact > 0 ? 'accelerating' : 'slowing'}.`
      }
    },
    analysis,
    learningPoints: learningPoints.length ? learningPoints : ["Economic changes have complex effects across different markets and sectors"]
  };
}