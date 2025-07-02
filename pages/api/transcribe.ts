import { NextApiRequest, NextApiResponse } from 'next';
import { log } from '@/utils/logger';
import { randomUUID } from 'crypto';
import FormData from 'form-data';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestId = randomUUID();
  const t0 = Date.now();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    log('error', `[${requestId}] OpenAI API key not configured`);
    return res.status(503).json({
      code: 'NO_OPENAI_KEY',
      message: 'OpenAI API key not configured'
    });
  }

  try {
    const { audio, audioBase64 } = req.body;
    const base64Audio = audioBase64 || audio;

    if (!base64Audio) {
      return res.status(400).json({ error: 'No audio data provided' });
    }

    // Extract base64 data and MIME type
    const matches = base64Audio.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid audio data format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const audioBuffer = Buffer.from(base64Data, 'base64');

    log('info', `[${requestId}] Processing audio`, {
      mimeType,
      bufferSize: audioBuffer.length,
    });

    // Create form data with proper configuration
    const form = new FormData();
    
    // CRITICAL: Add the buffer with proper metadata
    form.append('file', audioBuffer, {
      filename: 'audio.webm', // OpenAI accepts webm
      contentType: mimeType,
      knownLength: audioBuffer.length
    });
    
    form.append('model', 'whisper-1');
    form.append('language', 'en');
    form.append('response_format', 'json');

    // Make request using axios for better error handling
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      form,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          ...form.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    const transcript = response.data.text || '';
    
    log('info', `[${requestId}] Transcription successful`, {
      textLength: transcript.length,
      ms: Date.now() - t0
    });

    return res.status(200).json({ transcript });

  } catch (error: any) {
    log('error', `[${requestId}] Transcription error`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      ms: Date.now() - t0
    });

    if (error.response?.status === 401) {
      return res.status(401).json({
        code: 'BAD_API_KEY',
        message: 'OpenAI API key is invalid'
      });
    }

    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.error?.message || 'Invalid request format';
      return res.status(400).json({
        error: 'Transcription failed',
        details: errorMessage,
        hint: 'Audio must be less than 25MB and in a supported format'
      });
    }

    return res.status(500).json({
      error: 'Failed to transcribe audio',
      details: error.message
    });
  }
}