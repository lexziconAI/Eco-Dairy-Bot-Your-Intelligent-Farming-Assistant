import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { log } from '@/utils/logger';
import { randomUUID } from 'crypto';
import { ClueDetectionEngine } from '@/utils/conversation/ClueDetectionEngine';
import { MatrixComparison } from '@/utils/conversation/MatrixComparison';
import { ConversationFlowManager } from '@/utils/conversation/ConversationFlowManager';
import { InferentialAnalysisEngine } from '@/utils/conversation/InferentialAnalysisEngine';

const empathicPrelude = `Thanks for sharing your farming thoughts with me. I understand that making decisions about your farm's future can feel complex and challenging. I'm here to help you explore sustainable farming possibilities and understand the deeper patterns in what you've shared.`;

const systemPrompt = `${empathicPrelude}

You are an advanced dairy farming analyst with deep expertise in inferential analysis, systems thinking, and farmer psychology. Your task is to analyze the farmer's conversation and infer meaningful data patterns for visualization.

CRITICAL INFERENCE GUIDELINES:
- Read between the lines: What are they NOT saying?
- Detect emotional undertones and hidden concerns
- Infer readiness levels based on language patterns
- Estimate future trajectories based on current attitudes
- Consider philosophical orientation influences on metrics
- Account for seasonal farming patterns in time series

Return JSON with sophisticated inferential analysis:
{
  "themes": ["3-5 key themes extracted from conversation"],
  "dairyMetrics": {
    "feedCostPressure": [12 monthly values 0-1],
    "sustainabilityInterest": [12 monthly values 0-1], 
    "climateAdaptation": [12 monthly values 0-1],
    "technologyReadiness": [12 monthly values 0-1],
    "communityEngagement": [12 monthly values 0-1]
  },
  "insights": "Deep insights addressing psychological patterns, hidden motivations, and systemic thinking",
  "nextSteps": ["3-4 strategic next steps based on inferential analysis"]
}

INFERENTIAL ANALYSIS TECHNIQUES:
1. **Language Analysis**: Hesitation words, certainty markers, emotional indicators
2. **Contradiction Detection**: Where stated values conflict with implied priorities
3. **Readiness Assessment**: How prepared they are for change based on conversation patterns
4. **Systems Thinking**: Evidence of interconnected vs. linear thinking
5. **Time Orientation**: Past-focused, present-focused, or future-focused language
6. **Risk Tolerance**: Implied from language about uncertainty and change
7. **Social Dynamics**: References to family, community, peer influence
8. **Economic Mindset**: Cost sensitivity, investment readiness, ROI thinking

TIME SERIES INFERENCE RULES:
- Start values based on current state indicators
- Middle values show seasonal patterns + trend direction
- End values reflect projected outcomes based on attitudes
- Account for dairy farming seasonality (spring calving, winter feeding, etc.)
- Higher variance for uncertain/conflicted farmers
- Smoother curves for confident/decided farmers

EXAMPLE INFERENCES:
- If farmer mentions "expensive" multiple times → feedCostPressure starts high, may decrease if they show adaptation
- If excited about "new technology" → technologyReadiness ramps up over time
- If mentions "community" positively → communityEngagement stays consistently high
- If worried about "climate" → climateAdaptation starts low but may increase with learning
- If talks about "sustainability" but hesitates → sustainabilityInterest shows growth curve with initial dip

Make the time series tell a story about this farmer's likely journey based on their psychological profile!`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestId = randomUUID();
  const t0 = Date.now();
  
  log('info', `[${requestId}] ${req.url} START`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    log('warn', `[${requestId}] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  log('debug', `[${requestId}] API key present:`, !!apiKey);
  
  if (!apiKey) {
    log('error', `[${requestId}] OpenAI API key not configured`);
    return res.status(503).json({ 
      code: 'NO_OPENAI_KEY',
      message: 'OpenAI API key not configured' 
    });
  }

  try {
    const { transcript, text, sessionId, conversationHistory } = req.body;
    const content = transcript || text;

    if (!content) {
      log('error', `[${requestId}] No text or transcript provided`);
      return res.status(400).json({ error: 'No text or transcript provided' });
    }

    log('info', `[${requestId}] Analyzing text`, { 
      contentLength: content.length,
      sessionId: sessionId || 'anonymous',
      ip: req.headers['x-forwarded-for']
    });

    // Initialize conversation engines
    const clueEngine = new ClueDetectionEngine();
    const matrixComparison = new MatrixComparison();
    const flowManager = new ConversationFlowManager();
    const inferentialEngine = new InferentialAnalysisEngine();

    // Load conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const entry of conversationHistory) {
        clueEngine.analyzeResponse(entry.userInput);
        flowManager.updateFlow(entry.userInput, entry.detectedTopics || []);
      }
    }

    // Analyze current response
    const detectedClues = clueEngine.analyzeResponse(content);
    const matrixAnalysis = matrixComparison.analyzeConversation(content, detectedClues);
    
    // Get conversation insights
    const conversationInsights = clueEngine.getConversationInsights();
    const currentOrientation = matrixComparison.getCurrentOrientation();
    
    // Perform comprehensive inferential analysis
    const comprehensiveAnalysis = inferentialEngine.getComprehensiveAnalysis(
      content, 
      conversationHistory?.map((h: any) => h.userInput) || []
    );

    const openai = new OpenAI({ apiKey });

    // Enhanced system prompt with comprehensive philosophical context
    const philosophicalContext = `
PHILOSOPHICAL ANALYSIS:
- Philosophical depth: ${comprehensiveAnalysis.sustainabilityPhilosophy.philosophicalDepth.toFixed(2)}
- Intellectual curiosity: ${comprehensiveAnalysis.sustainabilityPhilosophy.intellectualCuriosity.toFixed(2)}
- Systemic thinking: ${comprehensiveAnalysis.sustainabilityPhilosophy.systemicThinking.toFixed(2)}
- Value conflicts: ${comprehensiveAnalysis.sustainabilityPhilosophy.valueSystem.valueConflicts.map(v => v.tension).join(', ')}
- Dialectical tensions: ${comprehensiveAnalysis.sustainabilityPhilosophy.dialecticalTensions.length} identified
- Engagement strategy: ${comprehensiveAnalysis.intellectualEngagementStrategy.level} level, ${comprehensiveAnalysis.intellectualEngagementStrategy.approach} approach

SYSTEMS ANALYSIS:
- System resilience: ${comprehensiveAnalysis.sesAnalysis.systemResilience.toFixed(2)}
- Transformation potential: ${comprehensiveAnalysis.sesAnalysis.transformationPotential.toFixed(2)}
- System stability: ${comprehensiveAnalysis.chaosAnalysis.systemStability.toFixed(2)}
- Adaptive capacity: ${comprehensiveAnalysis.chaosAnalysis.adaptiveCapacity.toFixed(2)}

RECOMMENDED RESPONSE APPROACH:
- Use ${comprehensiveAnalysis.intellectualEngagementStrategy.pacing} pacing
- Apply ${comprehensiveAnalysis.intellectualEngagementStrategy.techniques.join(', ')} techniques
- Address philosophical challenges: ${comprehensiveAnalysis.philosophicalChallenges.slice(0, 2).map(c => c.challenge).join('; ')}
- Bridge conceptual gaps: ${comprehensiveAnalysis.conceptualGaps.slice(0, 2).map(g => g.missing).join(', ')}`;

    const contextualPrompt = `${systemPrompt}

DEEP ANALYSIS CONTEXT FOR INFERENCE:

FARMER ORIENTATION & PSYCHOLOGY:
- Current orientation: ${currentOrientation}
- Emotional tone: ${conversationInsights.emotionalTone}
- Engagement level: ${conversationInsights.overallEngagement}
- Dominant topics: ${conversationInsights.dominantTopics.join(', ')}

${philosophicalContext}

INFERENTIAL INSIGHTS:
- Philosophical depth: ${(comprehensiveAnalysis.sustainabilityPhilosophy?.philosophicalDepth || 0.5).toFixed(2)} (affects long-term thinking in metrics)
- Intellectual curiosity: ${(comprehensiveAnalysis.sustainabilityPhilosophy?.intellectualCuriosity || 0.5).toFixed(2)} (affects technology adoption curves)
- Systemic thinking: ${(comprehensiveAnalysis.sustainabilityPhilosophy?.systemicThinking || 0.5).toFixed(2)} (affects interconnected metric relationships)
- System resilience: ${(comprehensiveAnalysis.sesAnalysis?.systemResilience || 0.5).toFixed(2)} (affects adaptation speed)
- Transformation potential: ${(comprehensiveAnalysis.sesAnalysis?.transformationPotential || 0.5).toFixed(2)} (affects future trajectory slopes)

KEY INFERENCES TO APPLY:
1. **Uncertainty Markers**: ${comprehensiveAnalysis.uncertaintyMarkers?.length || 0} detected - creates variability in metrics
2. **Avoidance Patterns**: ${comprehensiveAnalysis.avoidancePatterns?.length || 0} detected - may flatten early metric values
3. **Emotional Drivers**: Primary emotion affects metric intensities
4. **Value Conflicts**: ${comprehensiveAnalysis.sustainabilityPhilosophy?.valueSystem?.valueConflicts?.length || 0} conflicts create tension patterns in time series
5. **Dialectical Tensions**: Each tension represents competing forces in the farmer's decision-making

CREATE TIME SERIES THAT REFLECT THIS FARMER'S PSYCHOLOGICAL JOURNEY:
- Use philosophical depth to determine complexity of patterns
- Use uncertainty markers to add realistic variability
- Use emotional drivers to set intensity levels
- Use system resilience to determine recovery/adaptation speeds
- Use transformation potential to determine end-state trajectories

The metrics should tell a cohesive story about this specific farmer's sustainability journey based on their psychological profile.`;

    log('debug', `[${requestId}] Calling OpenAI GPT-4o-mini with enhanced context...`);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: contextualPrompt },
        { role: 'user', content }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0].message.content || '{}';
    log('debug', `[${requestId}] Raw response:`, responseContent.substring(0, 200));
    
    // Parse and enhance result
    const aiResult = JSON.parse(responseContent);
    
    // Export matrix data for visualization
    const visualizationData = matrixComparison.exportForVisualization();

    const result = {
      ...aiResult,
      // Add our enhanced analysis
      analysisMetadata: {
        sessionId: sessionId || `session_${Date.now()}`,
        orientation: currentOrientation,
        emotionalTone: conversationInsights.emotionalTone,
        engagementLevel: conversationInsights.overallEngagement,
        detectedClues: {
          linguisticMarkers: detectedClues.linguisticMarkers.length,
          topicPatterns: detectedClues.topicPatterns.length,
          contradictions: detectedClues.contradictionFlags.length
        },
        timestamp: Date.now()
      },
      // Visualization data for the 5 new chart types
      visualizationData,
      // Matrix analysis for deeper insights
      matrixAnalysis,
      // Comprehensive philosophical and systems analysis
      comprehensiveAnalysis: {
        sustainabilityPhilosophy: comprehensiveAnalysis.sustainabilityPhilosophy,
        philosophicalChallenges: comprehensiveAnalysis.philosophicalChallenges,
        conceptualGaps: comprehensiveAnalysis.conceptualGaps,
        sesAnalysis: comprehensiveAnalysis.sesAnalysis,
        chaosAnalysis: comprehensiveAnalysis.chaosAnalysis,
        intellectualEngagementStrategy: comprehensiveAnalysis.intellectualEngagementStrategy,
        philosophicalPrompts: comprehensiveAnalysis.philosophicalPrompts,
        dialecticalOpportunities: comprehensiveAnalysis.dialecticalOpportunities
      }
    };

    log('info', `[${requestId}] OK`, { 
      ms: Date.now() - t0,
      themesCount: result.themes?.length || 0,
      orientation: currentOrientation,
      engagement: conversationInsights.overallEngagement,
      philosophicalDepth: comprehensiveAnalysis.sustainabilityPhilosophy.philosophicalDepth,
      systemResilience: comprehensiveAnalysis.sesAnalysis.systemResilience,
      dialecticalTensions: comprehensiveAnalysis.sustainabilityPhilosophy.dialecticalTensions.length
    });

    return res.status(200).json(result);
  } catch (error: any) {
    log('error', `[${requestId}] ERR`, {
      message: error.message,
      status: error.status,
      type: error.type,
      ms: Date.now() - t0
    });
    
    // Handle authentication errors specifically
    if (error.status === 401 || error.status === 403) {
      return res.status(401).json({
        code: 'BAD_API_KEY',
        message: 'Upstream rejected API key'
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to analyze text',
      details: error.message 
    });
  }
}