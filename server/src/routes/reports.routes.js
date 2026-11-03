import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { clampDays, salesByDay, salesSummary, topProducts } from '../services/reportService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(requireAuth);

const daysFrom = (req) => clampDays(req.query.days);

router.get('/summary', asyncHandler(async (req, res) => res.json(await salesSummary(daysFrom(req)))));
router.get('/sales-by-day', asyncHandler(async (req, res) => res.json(await salesByDay(daysFrom(req)))));
router.get('/top-products', asyncHandler(async (req, res) => res.json(await topProducts(daysFrom(req)))));

export default router;
