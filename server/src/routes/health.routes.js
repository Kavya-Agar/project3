import { Router } from 'express';
import { query } from '../db/pool.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    await query('SELECT 1');
    res.json({ status: 'ok' });
  }),
);

export default router;
