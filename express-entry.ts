import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { apiRouter } from '@backend/core/apiRouter';
import express from 'express';
import { renderPage } from 'vike/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = __dirname;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const hmrPort = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT, 10) : 24678;

export default (await startServer()) as unknown;

async function startServer() {
  const app = express();

  app.use((req, res, next) => {
    if (req.path === '/api/event') {
      const origin = req.headers.origin;
      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      }
    }

    next();
  });

  app.use('/api', await apiRouter());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(`${root}/dist/client`));
  } else {
    // Instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We should instantiate it *only* in development. (It isn't needed in production
    // and would unnecessarily bloat our server in production.)
    const vite = await import('vite');
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true, hmr: { port: hmrPort } },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.url,
      request: req,
      headers: req.headers,
      response: res,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) {
      return next();
    } else {
      const { body, statusCode, headers } = httpResponse;
      headers.forEach(([name, value]) => res.header(name, value));
      res.status(statusCode);

      return res.send(body);
    }
  });

  app.listen(port, () => {
    console.info(`Server listening on http://localhost:${port}`);
  });

  return app;
}
