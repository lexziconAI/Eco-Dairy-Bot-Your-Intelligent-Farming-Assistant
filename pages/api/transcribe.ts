import { NextApiRequest, NextApiResponse } from 'next';
import { log } from '@/utils/logger';
import { randomUUID } from 'crypto';
import FormData from 'form-data';

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
  log('debug', `[${requestId}] OpenAI API key present:`, !!apiKey);
  
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
      log('error', `[${requestId}] No audio data provided in request`);
      return res.status(400).json({ error: 'No audio data provided' });
    }

    log('info', `[${requestId}] Processing audio with OpenAI Whisper`, { 
      payloadSize: base64Audio.length, 
      ip: req.headers['x-forwarded-for'] 
    });
    
    // Extract metadata and base64 data
    const matches = base64Audio.match(/^data:audio\/([^;]+);base64,(.+)$/);
    let mimeType = 'webm';
    let base64Data = base64Audio;
    
    if (matches) {
      mimeType = matches[1].replace(/;.*$/, ''); // Remove codec info
      base64Data = matches[2];
    }
    
    const audioBuffer = Buffer.from(base64Data, 'base64');
    
    // Determine file extension based on MIME type
    const extension = mimeType.includes('webm') ? 'webm' : 
                     mimeType.includes('mp4') ? 'mp4' : 
                     mimeType.includes('mpeg') ? 'mp3' : 
                     mimeType.includes('wav') ? 'wav' : 'webm';
    
    log('info', `[${requestId}] Audio details`, { 
      bufferSize: audioBuffer.length,
      mimeType,
      extension,
      detectedFormat: mimeType,
      base64Length: base64Data.length,
      audioBufferFirst10: audioBuffer.slice(0, 10).toString('hex')
    });

    // Create form data
    const form = new FormData();
    form.append('file', audioBuffer, {
      filename: `audio.${extension}`,
      contentType: `audio/${mimeType}`,
    });
    form.append('model', 'whisper-1');
    form.append('language', 'en');
    form.append('prompt', 'This is a conversation about dairy farming, agriculture, sustainability, and farm management.');

    log('debug', `[${requestId}] Calling OpenAI Whisper API...`);
    
    // Make the request
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...form.getHeaders(),
      },
      body: form as any,
    });

    if (!response.ok) {
      const errorText = await response.text();
      log('error', `[${requestId}] OpenAI API error`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries()),
        formBoundary: form.getBoundary(),
        audioSize: audioBuffer.length,
        mimeType,
        extension
      });
      
      if (response.status === 401) {
        return res.status(401).json({
          code: 'BAD_API_KEY',
          message: 'OpenAI API key is invalid'
        });
      }

      if (response.status === 400) {
        let errorDetail = 'Invalid audio format';
        let errorJson: any = {};
        try {
          errorJson = JSON.parse(errorText);
          errorDetail = errorJson.error?.message || errorJson.error || errorDetail;
        } catch {
          errorDetail = errorText || errorDetail;
        }
        
        log('error', `[${requestId}] 400 Error details`, {
          parsedError: errorJson,
          rawError: errorText,
          audioMimeType: mimeType,
          audioExtension: extension,
          audioSize: audioBuffer.length
        });
        
        return res.status(400).json({
          error: 'Audio transcription failed',
          details: errorDetail,
          hint: 'Try recording again. Supported formats: WebM, MP3, MP4, WAV',
          debug: {
            mimeType,
            extension,
            size: audioBuffer.length
          }
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json() as { text: string };
    const transcript = result.text || '';

    log('info', `[${requestId}] OK`, { 
      ms: Date.now() - t0, 
      textLength: transcript.length 
    });
    
    return res.status(200).json({ transcript });
    
  } catch (error: any) {
    log('error', `[${requestId}] ERR`, {
      message: error.message,
      stack: error.stack,
      ms: Date.now() - t0
    });
    
    return res.status(500).json({ 
      error: error.message || 'Failed to transcribe audio',
      details: error.message 
    });
  }
}