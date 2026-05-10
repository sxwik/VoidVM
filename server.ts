import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add a proxy for copy.sh CDN so that we bypass CORS constraints when fetching images
  app.use('/proxy/copy.sh', (req, res, next) => {
    delete req.headers.origin;
    delete req.headers.referer;
    req.headers.origin = 'https://copy.sh';
    req.headers.referer = 'https://copy.sh/';
    next();
  }, createProxyMiddleware({
    target: 'https://i.copy.sh',
    changeOrigin: true,
    pathRewrite: {
      '^/proxy/copy.sh': '', // remove base path
    },
    secure: false
  }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
