import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { SERVER } from './config.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { buildApiRouter } from './routes/index.js';

export async function createApp() {
  const app = express();
  app.use(cors({ origin: SERVER.CORS_ORIGINS }));
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', await buildApiRouter());
  app.use('/api', notFound);

  // In production the API also serves the built React app.
  if (existsSync(SERVER.CLIENT_DIST_DIR)) {
    app.use(express.static(SERVER.CLIENT_DIST_DIR));
    app.use((req, res) => res.sendFile(path.join(SERVER.CLIENT_DIST_DIR, 'index.html')));
  }

  app.use(errorHandler);
  return app;
}
