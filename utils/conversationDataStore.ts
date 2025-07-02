// Central conversation data store with proper structure
// This is the single source of truth for ALL visualizations

export interface ConversationExchange {
  id: number;
  userInput: string;
  botResponse: string;
  timestamp: Date;
  analysis: {
    orientation: string; // P-R, P-NR, PO-R, PO-NR, PC-R, PC-NR
    sentiment: number; // -1 to 1
    themes: string[]; // ["cost", "hesitation", "sustainability"]
    inferredMeanings: string[]; // ["fear of change", "economic pressure"]
    complexity: number; // 0 to 1
    topicDiversity: number; // 0 to 1
    emotionalVolatility: number; // 0 to 1
    narrativeTension: number; // 0 to 1
    // Quantum Storytelling Framework
    antenarrative: number; // Pre-structured tensions (0-1)
    grandNarrative: number; // Official/structured story (0-1)
    livingStory: number; // Embodied reality (0-1)
    // Detailed metrics
    questionCount: number;
    statementCount: number;
    uncertaintyMarkers: number;
    confidenceMarkers: number;
  };
}

export interface ConversationMetrics {
  totalExchanges: number;
  orientationJourney: string[]; // Track orientation changes over time
  narrativeTypeDistribution: {
    antenarrative: number;
    grandNarrative: number;
    livingStory: number;
  };
  averageComplexity: number;
  topicEvolution: string[][]; // Topics per exchange
  sentimentJourney: number[]; // Sentiment over time
}

export interface ConversationDataStore {
  exchanges: ConversationExchange[];
  metrics: ConversationMetrics;
  metadata: {
    startTime: Date;
    lastUpdated: Date;
    isComplete: boolean; // Whether enough data for full analysis
  };
}

// Analyze individual conversation exchange
export function analyzeExchange(
  userInput: string, 
  botResponse: string, 
  exchangeId: number,
  timestamp: Date
): ConversationExchange {
  const combinedText = userInput + ' ' + botResponse;
  const userText = userInput.toLowerCase();
  const sentences = combinedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Topic detection with farming-specific keywords
  const farmingTopics = {
    'sustainability': /sustain|environment|green|eco|climate|organic|carbon/gi,
    'technology': /tech|digital|ai|automation|sensor|precision|data/gi,
    'economics': /cost|profit|money|price|economic|financial|budget|income/gi,
    'community': /family|community|neighbor|local|tradition|social/gi,
    'welfare': /animal|welfare|care|health|treatment|comfort/gi,
    'future': /future|change|evolv|transform|next|tomorrow|generation/gi,
    'regulation': /government|regulation|policy|compliance|law/gi,
    'efficiency': /efficient|productivity|yield|output|optimize/gi
  };
  
  const detectedTopics = Object.keys(farmingTopics).filter(topic => 
    farmingTopics[topic as keyof typeof farmingTopics].test(combinedText)
  );
  
  // Calculate basic metrics
  const topicDiversity = detectedTopics.length / Object.keys(farmingTopics).length;
  
  // Emotional analysis
  const emotionalMarkers = (combinedText.match(/[!?]|\b(uncertain|worried|concerned|excited|hopeful|frustrated|confident)\b/gi) || []).length;
  const emotionalVolatility = Math.min(emotionalMarkers / sentences.length, 1);
  
  // Question vs statement analysis
  const questionCount = (combinedText.match(/\?/g) || []).length;
  const statementCount = sentences.length - questionCount;
  
  // Uncertainty vs confidence markers
  const uncertaintyMarkers = (userText.match(/maybe|might|uncertain|unclear|not sure|don't know|confused/gi) || []).length;
  const confidenceMarkers = (userText.match(/definitely|certainly|sure|confident|know|understand|clear/gi) || []).length;
  
  // Quantum Storytelling Analysis
  const anteMarkers = /but|however|maybe|might|uncertain|unclear|complex|challenge|tension|struggle/gi;
  const antenarrative = Math.min((userInput.match(anteMarkers) || []).length / 8, 1);
  
  const grandMarkers = /should|must|always|never|best practice|standard|proven|established|official|policy/gi;
  const grandNarrative = Math.min((combinedText.match(grandMarkers) || []).length / 6, 1);
  
  const livingMarkers = /we|i|my|our|actually|really|experience|feel|daily|practice|do|work|live/gi;
  const livingStory = Math.min((combinedText.match(livingMarkers) || []).length / 12, 1);
  
  // Narrative tension calculation
  const tensionMarkers = /conflict|tension|struggle|balance|difficult|torn|contradiction|competing/gi;
  const narrativeTension = Math.min((combinedText.match(tensionMarkers) || []).length / 4, 1);
  
  // Overall complexity score
  const complexity = (topicDiversity + emotionalVolatility + narrativeTension + (antenarrative + grandNarrative + livingStory) / 3) / 4;
  
  // Sentiment analysis (simplified)
  const positiveWords = (combinedText.match(/good|great|excited|hopeful|beneficial|improve|better|positive|optimistic/gi) || []).length;
  const negativeWords = (combinedText.match(/bad|terrible|worried|concerned|difficult|problem|negative|pessimistic/gi) || []).length;
  const sentiment = positiveWords > 0 || negativeWords > 0 ? 
    (positiveWords - negativeWords) / (positiveWords + negativeWords) : 0;
  
  // Infer farmer orientation based on language patterns
  const pragmaticMarkers = /practical|work|cost|profit|realistic|viable/gi;
  const environmentalMarkers = /environment|sustainable|green|climate|future/gi;
  const orientationScore = {
    pragmatic: (userInput.match(pragmaticMarkers) || []).length,
    environmental: (userInput.match(environmentalMarkers) || []).length
  };
  
  let orientation = "P-R"; // Default pragmatic-resistant
  if (orientationScore.environmental > orientationScore.pragmatic) {
    orientation = sentiment > 0 ? "PO-R" : "PC-R"; // Pro-environment
  } else if (sentiment > 0.3) {
    orientation = "P-NR"; // Pragmatic non-resistant
  }
  
  // Inferred meanings based on patterns
  const inferredMeanings: string[] = [];
  if (uncertaintyMarkers > 2) inferredMeanings.push("uncertainty about change");
  if (detectedTopics.includes('economics') && sentiment < 0) inferredMeanings.push("economic pressure");
  if (antenarrative > 0.5) inferredMeanings.push("emerging tensions");
  if (livingStory > grandNarrative) inferredMeanings.push("experience-driven thinking");
  if (topicDiversity > 0.5) inferredMeanings.push("systemic perspective");
  
  return {
    id: exchangeId,
    userInput,
    botResponse,
    timestamp,
    analysis: {
      orientation,
      sentiment,
      themes: detectedTopics,
      inferredMeanings,
      complexity,
      topicDiversity,
      emotionalVolatility,
      narrativeTension,
      antenarrative,
      grandNarrative,
      livingStory,
      questionCount,
      statementCount,
      uncertaintyMarkers,
      confidenceMarkers
    }
  };
}

// Calculate conversation-wide metrics
export function calculateConversationMetrics(exchanges: ConversationExchange[]): ConversationMetrics {
  if (exchanges.length === 0) {
    return {
      totalExchanges: 0,
      orientationJourney: [],
      narrativeTypeDistribution: { antenarrative: 0, grandNarrative: 0, livingStory: 0 },
      averageComplexity: 0,
      topicEvolution: [],
      sentimentJourney: []
    };
  }
  
  const orientationJourney = exchanges.map(e => e.analysis.orientation);
  const sentimentJourney = exchanges.map(e => e.analysis.sentiment);
  const topicEvolution = exchanges.map(e => e.analysis.themes);
  
  // Calculate average narrative type distribution
  const avgAntenarrative = exchanges.reduce((sum, e) => sum + e.analysis.antenarrative, 0) / exchanges.length;
  const avgGrandNarrative = exchanges.reduce((sum, e) => sum + e.analysis.grandNarrative, 0) / exchanges.length;
  const avgLivingStory = exchanges.reduce((sum, e) => sum + e.analysis.livingStory, 0) / exchanges.length;
  
  const averageComplexity = exchanges.reduce((sum, e) => sum + e.analysis.complexity, 0) / exchanges.length;
  
  return {
    totalExchanges: exchanges.length,
    orientationJourney,
    narrativeTypeDistribution: {
      antenarrative: avgAntenarrative,
      grandNarrative: avgGrandNarrative,
      livingStory: avgLivingStory
    },
    averageComplexity,
    topicEvolution,
    sentimentJourney
  };
}

// Validate data integrity before rendering charts
export function validateDataIntegrity(data: ConversationDataStore | null): boolean {
  if (!data || !data.exchanges) return false;
  if (data.exchanges.length === 0) return false;
  
  // Verify each exchange has required fields
  return data.exchanges.every(exchange => 
    exchange.userInput && 
    exchange.botResponse && 
    exchange.analysis &&
    typeof exchange.analysis.complexity === 'number' &&
    Array.isArray(exchange.analysis.themes)
  );
}

// Get minimum data points required for each chart type
export function getMinimumDataPoints(chartType: string): number {
  const requirements: Record<string, number> = {
    'complexity-timeline': 1,
    'orientation-journey': 2,
    'system-divergence': 3,
    'chaos-dynamics': 2,
    'narrative-flow': 1,
    'sentiment-analysis': 1
  };
  
  return requirements[chartType] || 1;
}

// Create conversation data store from message history
export function createConversationDataStore(messages: any[]): ConversationDataStore {
  if (!messages || messages.length < 2) {
    return {
      exchanges: [],
      metrics: calculateConversationMetrics([]),
      metadata: {
        startTime: new Date(),
        lastUpdated: new Date(),
        isComplete: false
      }
    };
  }
  
  const userMessages = messages.filter(msg => msg.type === 'user');
  const botMessages = messages.filter(msg => msg.type === 'bot');
  
  const exchanges: ConversationExchange[] = [];
  
  // Match user messages with bot responses
  for (let i = 0; i < userMessages.length; i++) {
    const userMsg = userMessages[i];
    const botMsg = botMessages.find(bot => bot.timestamp > userMsg.timestamp);
    
    if (botMsg) {
      const exchange = analyzeExchange(
        userMsg.content, 
        botMsg.content, 
        i + 1,
        new Date(userMsg.timestamp)
      );
      exchanges.push(exchange);
    }
  }
  
  const metrics = calculateConversationMetrics(exchanges);
  
  return {
    exchanges,
    metrics,
    metadata: {
      startTime: new Date(Math.min(...messages.map(m => m.timestamp))),
      lastUpdated: new Date(),
      isComplete: exchanges.length >= 3 // Minimum for full analysis
    }
  };
}