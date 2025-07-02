const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const os = require('os');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // Listen on all interfaces
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
  .once('error', (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, hostname, () => {
    console.log(`> Server ready on http://${hostname}:${port}`);
    
    // Get network interfaces
    const interfaces = os.networkInterfaces();
    console.log('\n> Also available on:');
    
    Object.keys(interfaces).forEach(name => {
      interfaces[name].forEach(interface => {
        if (interface.family === 'IPv4' && !interface.internal) {
          console.log(`  http://${interface.address}:${port}`);
        }
      });
    });
    
    console.log('\n> Environment:');
    console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  API Keys configured: ${!!process.env.OPENAI_API_KEY ? '✓' : '✗'} OpenAI, ${!!process.env.ELEVENLABS_API_KEY ? '✓' : '✗'} ElevenLabs`);
  });
});