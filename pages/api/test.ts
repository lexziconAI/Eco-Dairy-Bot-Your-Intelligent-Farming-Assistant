import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasElevenLabs = !!process.env.ELEVENLABS_API_KEY;
  
  return res.status(200).json({
    message: 'API is working',
    environment: process.env.NODE_ENV,
    hasOpenAI,
    hasElevenLabs,
    openAIKeyLength: process.env.OPENAI_API_KEY?.length || 0,
    timestamp: new Date().toISOString()
  });
}