import { Router } from 'express';
import { AUTH } from '../config.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { issueSession, verifyGoogleCredential } from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { badRequest } from '../utils/httpError.js';

const router = Router();

router.get('/config', (req, res) => {
  res.json({ enabled: AUTH.ENABLED, clientId: AUTH.GOOGLE_CLIENT_ID });
});

router.post(
  '/google',
  asyncHandler(async (req, res) => {
    if (!AUTH.ENABLED) throw badRequest('Authentication is not configured');
    if (!req.body?.credential) throw badRequest('Missing credential');
    const user = await verifyGoogleCredential(req.body.credential);
    res.json({ token: issueSession(user), user });
  }),
);

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user ?? null });
});

export default router;
