import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { log } from '@/utils/logger';
import { randomUUID } from 'crypto';

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
    const { messages, temperature = 0.8, max_tokens = 300 } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      log('error', `[${requestId}] No messages provided`);
      return res.status(400).json({ error: 'No messages provided' });
    }

    log('info', `[${requestId}] Generating chat response`, { 
      messageCount: messages.length,
      temperature,
      max_tokens,
      ip: req.headers['x-forwarded-for']
    });

    const openai = new OpenAI({ apiKey });

    log('debug', `[${requestId}] Calling OpenAI Chat Completion...`);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens,
      presence_penalty: 0.3, // Encourage varied responses
      frequency_penalty: 0.2  // Reduce repetition
    });

    const response = completion.choices[0].message.content || 'I appreciate what you\'ve shared. Could you tell me more about that?';
    
    log('debug', `[${requestId}] Response generated:`, response.substring(0, 100) + '...');
    
    log('info', `[${requestId}] OK`, { 
      ms: Date.now() - t0,
      responseLength: response.length,
      tokens_used: completion.usage?.total_tokens
    });

    return res.status(200).json({ 
      response,
      usage: completion.usage
    });
    
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
      error: 'Failed to generate chat response',
      details: error.message 
    });
  }
}