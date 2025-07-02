# Eco Dairy Bot

A voice-driven scenario explorer that lets users "brain dump" their thoughts and generates counterintuitive scenario projections using AI.

## Features

- 🎤 Voice recording with automatic transcription
- 💭 Free-form text input for brain dumps
- 🧠 AI-powered theme extraction and scenario generation
- 📊 Interactive time-series visualizations
- 📚 Conversation history (last 5 entries)
- 📱 Fully mobile responsive

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   NEXT_PUBLIC_LOG_LEVEL=info
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

Deploy to Vercel:
```bash
vercel deploy --prod
```

Make sure to add your environment variables in the Vercel dashboard:
- `OPENAI_API_KEY`: Required for GPT-4 analysis
- `ELEVENLABS_API_KEY`: Required for speech-to-text  
- `NEXT_PUBLIC_LOG_LEVEL`: Optional debug level ('debug' | 'info' | 'warn' | 'error', default: 'info')

## Tech Stack

- Next.js with TypeScript
- ElevenLabs API for speech-to-text
- OpenAI GPT-4 for analysis
- Recharts for data visualization
- Tailwind CSS for styling

## Usage

1. Click the microphone button to start recording your thoughts
2. Click stop when done, then transcribe
3. Or type directly in the text area
4. Click "Analyze" to generate scenario projections
5. View themes and interactive charts
6. Access previous analyses from the history drawer

## Debug Logging

Enable verbose debug logs for development:

- **URL parameter**: Add `?debug` to any URL to enable debug mode
- **localStorage**: Set `eco_dairy_bot_log_level` to `debug` in browser Dev Tools
- **Environment**: Set `NEXT_PUBLIC_LOG_LEVEL=debug` in `.env.local` or Vercel

Debug logs include:
- API request tracking with unique requestIds
- Frontend component state changes
- Performance timings
- Error details with upstream responses