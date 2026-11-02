import { AUTH } from '../config.js';
import { verifySession } from '../services/authService.js';
import { unauthorized } from '../utils/httpError.js';

const BEARER_PREFIX = 'Bearer ';

// Guards manager-only endpoints. Passes through when auth is not configured.
export function requireAuth(req, res, next) {
  if (!AUTH.ENABLED) return next();
  const header = req.get('Authorization') ?? '';
  if (!header.startsWith(BEARER_PREFIX)) return next(unauthorized());
  try {
    req.user = verifySession(header.slice(BEARER_PREFIX.length));
    return next();
  } catch (error) {
    return next(error);
  }
}
