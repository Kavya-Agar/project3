import 'dotenv/config';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const splitList = (value, fallback = '') =>
  (value ?? fallback)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const SRC_DIR = path.dirname(fileURLToPath(import.meta.url));

export const SERVER = {
  PORT: Number(process.env.PORT) || 3001,
  CORS_ORIGINS: splitList(process.env.CORS_ORIGINS, 'http://localhost:5173'),
  CLIENT_DIST_DIR: path.resolve(SRC_DIR, '../../client/dist'),
  SSE_HEARTBEAT_MS: 25_000,
};

export const DATABASE = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // The TAMU server rejects unencrypted connections. Certificates stay verified;
  // set DB_SSL_CA to a CA file path if the server cert is not publicly trusted.
  ssl: process.env.DB_SSL === 'false' ? false : { ca: process.env.DB_SSL_CA ? readFileSync(process.env.DB_SSL_CA, 'utf8') : undefined },
  max: 10,
  idleTimeoutMillis: 30_000,
};

// Sign-in is only enforced when a Google client id is configured, so local
// development works without OAuth credentials.
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
export const AUTH = {
  GOOGLE_CLIENT_ID: googleClientId,
  ENABLED: Boolean(googleClientId),
  SESSION_SECRET: process.env.SESSION_SECRET || '',
  SESSION_TTL: '8h',
  MANAGER_EMAILS: splitList(
    process.env.MANAGER_EMAILS,
    'reveille.bubbletea@gmail.com',
  ).map((email) => email.toLowerCase()),
};

export const MENU = {
  CATEGORIES: ['Milk Tea', 'Fruit Tea', 'Classic Tea', 'Slush', 'Specialty'],
  NAME_MAX_LENGTH: 100,
  PRICE_MAX: 50,
};

export const ORDERING = {
  SOURCES: { CASHIER: 'cashier', KIOSK: 'kiosk' },
  KIOSK_EMPLOYEE_ID: 0,
  CASHIER_ROLE: 'Cashier',
  TOPPING_PRICE: 0.5,
  MAX_TOPPINGS: 3,
  MAX_QUANTITY: 20,
  MAX_ITEMS_PER_ORDER: 50,
  // Ounces of the matching inventory item consumed per topping serving.
  TOPPING_INVENTORY_USE: 1,
  // Names must match inventory item names.
  TOPPINGS: ['Tapioca Pearls', 'Lychee Jelly', 'Pudding', 'Red Bean', 'Honey Jelly'],
  ICE_LEVELS: ['None', 'Less', 'Regular', 'Extra'],
  DEFAULT_ICE_LEVEL: 'Regular',
  SUGAR_LEVELS: [
    { value: 0, label: '0%' },
    { value: 0.3, label: '30%' },
    { value: 0.5, label: '50%' },
    { value: 0.75, label: '75%' },
    { value: 1, label: '100%' },
  ],
  DEFAULT_SUGAR_LEVEL: 0.5,
};

export const REPORTS = {
  DEFAULT_DAYS: 14,
  MAX_DAYS: 90,
  TOP_PRODUCT_LIMIT: 10,
};
