import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { createMenuItem, listMenu, updateMenuItem } from '../services/menuService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { badRequest } from '../utils/httpError.js';
import { validateMenuItem } from '../utils/menuValidation.js';

const router = Router();

function parseMenuItem(body) {
  const { errors, value } = validateMenuItem(body);
  if (errors.length) throw badRequest('Invalid menu item', errors);
  return value;
}

// Public: only items customers can order (kiosk and cashier).
router.get('/', asyncHandler(async (req, res) => res.json(await listMenu())));

// Manager: every item, including hidden ones.
router.get(
  '/all',
  requireAuth,
  asyncHandler(async (req, res) => res.json(await listMenu({ includeUnavailable: true }))),
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.status(201).json(await createMenuItem(parseMenuItem(req.body)));
  }),
);

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const productId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(productId)) throw badRequest('Invalid menu item id');
    res.json(await updateMenuItem(productId, parseMenuItem(req.body)));
  }),
);

export default router;
