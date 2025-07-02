import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { log } from '@/utils/logger';
import { randomUUID } from 'crypto';

const ANTONIA_VOICE_ID = '3z9q8Y7plHbvhDZehEII';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

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

  const apiKey = process.env.ELEVENLABS_API_KEY;
  log('debug', `[${requestId}] API key present:`, !!apiKey);
  
  if (!apiKey) {
    log('error', `[${requestId}] ElevenLabs API key not configured`);
    return res.status(503).json({ 
      code: 'NO_ELEVEN_KEY',
      message: 'ElevenLabs API key not configured' 
    });
  }

  try {
    const { text } = req.body;
    
    if (!text) {
      log('error', `[${requestId}] No text provided in request`);
      return res.status(400).json({ error: 'No text provided' });
    }

    log('info', `[${requestId}] Generating speech`, { 
      textLength: text.length, 
      voiceId: ANTONIA_VOICE_ID,
      ip: req.headers['x-forwarded-for']
    });

    const payload = {
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    };

    log('debug', `[${requestId}] Calling ElevenLabs TTS API...`);
    const resp = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${ANTONIA_VOICE_ID}`,
      payload,
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        responseType: 'arraybuffer'
      }
    );

    log('info', `[${requestId}] OK`, { 
      ms: Date.now() - t0, 
      audioSize: resp.data.byteLength 
    });
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', resp.data.byteLength);
    res.send(Buffer.from(resp.data));
  } catch (error: any) {
    log('error', `[${requestId}] ERR`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      ms: Date.now() - t0
    });
    
    // Handle authentication errors specifically
    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(401).json({
        code: 'BAD_API_KEY',
        message: 'Upstream rejected API key'
      });
    }
    
    return res.status(500).json({ 
      error: error.message || 'Failed to generate speech',
      details: error.response?.data ? Buffer.from(error.response.data).toString() : error.message
    });
  }
}