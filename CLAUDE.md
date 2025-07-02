# Eco Dairy Bot Project Instructions

## Overview
Building a React/Next.js + Vercel-hosted app called **Eco Dairy Bot** that:
- Lets users "brain dump" by speaking or typing unstructured thoughts
- Transcribes voice via ElevenLabs STT API
- Uses OpenAI GPT-4 to extract themes and generate counterintuitive scenario projections
- Renders interactive time-series visualizations
- Maintains 5-step conversation history
- Fully mobile responsive

## Technical Stack
- Next.js with TypeScript
- ElevenLabs API for speech-to-text
- OpenAI GPT-4 for analysis
- Recharts for data visualization
- Tailwind CSS for styling

## API Endpoints

### `/api/transcribe.ts`
- Accepts audio POST request
- Calls ElevenLabs STT using `ELEVENLABS_API_KEY`
- Returns `{ transcript: string }`

### `/api/analyze.ts`
- Accepts `{ transcript?: string, text?: string }`
- Uses GPT-4 with specific system prompt to generate themes and time series
- Returns JSON with themes and scenario metrics

## Environment Variables
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`

## Key Features
1. Voice recording with Web Speech API fallback
2. Manual text input option
3. Theme extraction and scenario generation
4. Interactive time-series charts
5. Conversation history (last 5 entries)
6. Mobile-first responsive design

## Deployment
- Vercel deployment with serverless functions
- CORS headers on API endpoints