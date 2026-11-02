// Same-origin by default; the Vite dev server proxies /api to the Express server.
export const API_BASE = import.meta.env.VITE_API_URL ?? '';
export const SESSION_STORAGE_KEY = 'reveille.session';
export const VENDOR_NAME = 'Reveille Brew Co.';
export const TEAM_NAME = 'Squad 45';
