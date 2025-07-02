import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { log } from '@/utils/logger';
import { randomUUID } from 'crypto';
import { ClueDetectionEngine } from '@/utils/conversation/ClueDetectionEngine';
import { MatrixComparison } from '@/utils/conversation/MatrixComparison';
import { ConversationFlowManager } from '@/utils/conversation/ConversationFlowManager';

const empathicPrelude = `Thanks for sharing your farming thoughts with me. I understand that making decisions about your farm's future can feel complex and challenging. I'm here to help you explore sustainable farming possibilities and understand the deeper patterns in what you've shared.`;

const systemPrompt = `${empathicPrelude}

You are an intelligent dairy farming assistant. Analyze the farmer's input for dairy-specific themes and provide practical insights. Return JSON:
{
  "themes": ["theme1", "theme2", "theme3"],
  "dairyMetrics": {
    "feedCostPressure": [12 numbers 0-1],
    "sustainabilityInterest": [12 numbers 0-1], 
    "climateAdaptation": [12 numbers 0-1],
    "technologyReadiness": [12 numbers 0-1],
    "communityEngagement": [12 numbers 0-1]
  },
  "insights": "Practical farming insights addressing the farmer directly with actionable advice",
  "nextSteps": ["step1", "step2", "step3"]
}

REQUIREMENTS:
1. Focus on dairy farming themes: feed costs, pasture management, emissions, sustainability practices, technology adoption, climate adaptation
2. Provide 12-point time series (representing months) for each metric
3. Give practical, actionable insights specific to dairy farming
4. Suggest concrete next steps the farmer can take`;

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

    const openai = new OpenAI({ apiKey });

    // Enhanced system prompt with context
    const contextualPrompt = `${systemPrompt}

CONTEXT:
- Current orientation: ${currentOrientation}
- Emotional tone: ${conversationInsights.emotionalTone}
- Engagement level: ${conversationInsights.overallEngagement}
- Dominant topics: ${conversationInsights.dominantTopics.join(', ')}

Tailor your response to match the farmer's orientation and emotional state.`;

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
      matrixAnalysis
    };

    log('info', `[${requestId}] OK`, { 
      ms: Date.now() - t0,
      themesCount: result.themes?.length || 0,
      orientation: currentOrientation,
      engagement: conversationInsights.overallEngagement
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