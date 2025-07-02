# Deployment Instructions for Eco Dairy Bot

## Prerequisites
- GitHub account with access to create/push to `lexziconAI/kinetichat`
- Vercel account
- API keys for OpenAI and ElevenLabs

## Step 1: GitHub Setup

1. Create the repository on GitHub if it doesn't exist:
   - Go to https://github.com/new
   - Name: `kinetichat`
   - Owner: `lexziconAI`
   - Create repository

2. Push the code:
   ```bash
   git remote add origin git@github.com:lexziconAI/kinetichat.git
   git branch -M main
   git push -u origin main
   ```

   If using HTTPS:
   ```bash
   git remote set-url origin https://github.com/lexziconAI/kinetichat.git
   git push -u origin main
   ```

## Step 2: Vercel Deployment

1. Go to https://vercel.com/new
2. Import the GitHub repository `lexziconAI/kinetichat`
3. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. Add Environment Variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `ELEVENLABS_API_KEY`: Your ElevenLabs API key
   - `NEXT_PUBLIC_LOG_LEVEL`: Optional debug level ('debug' | 'info' | 'warn' | 'error', default: 'info')

5. Click "Deploy"

## Alternative: CLI Deployment

If you have Vercel CLI installed and authenticated:

```bash
# Link to Vercel project
vercel link --yes --project eco-dairy-bot

# Pull environment variables
vercel env pull .env.local

# Deploy to production
vercel --prod
```

## Post-Deployment

Your app will be available at:
- Production: `https://kinetichat.vercel.app` (or your custom domain)
- Preview: Generated for each git push

## Environment Variables

Make sure these are set in Vercel:
- `OPENAI_API_KEY`: Required for GPT-4 analysis
- `ELEVENLABS_API_KEY`: Required for speech-to-text
- `NEXT_PUBLIC_LOG_LEVEL`: Optional debug level for structured logging

## Testing

After deployment:
1. Visit your production URL
2. Test voice recording (requires HTTPS)
3. Test text analysis
4. Verify charts render correctly
5. Check mobile responsiveness