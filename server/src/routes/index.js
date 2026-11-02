import { Router } from 'express';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROUTES_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROUTE_SUFFIX = '.routes.js';

// Mounts every `<name>.routes.js` file at `/api/<name>`, so a new feature
// only needs to add its own route file.
export async function buildApiRouter() {
  const router = Router();
  const files = readdirSync(ROUTES_DIR).filter((file) => file.endsWith(ROUTE_SUFFIX));
  for (const file of files) {
    const name = file.slice(0, -ROUTE_SUFFIX.length);
    try {
      const { default: routes } = await import(pathToFileURL(path.join(ROUTES_DIR, file)).href);
      router.use(`/${name}`, routes);
    } catch (error) {
      // Keeps the API up when a teammate's dependent files have not landed yet.
      console.warn(`Skipping /api/${name}: ${error.message}`);
    }
  }
  return router;
}
