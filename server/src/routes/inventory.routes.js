import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { listInventory, restockItem } from '../services/inventoryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { badRequest } from '../utils/httpError.js';

const router = Router();
router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => res.json(await listInventory({ lowOnly: req.query.low === 'true' }))),
);

router.post(
  '/:id/restock',
  asyncHandler(async (req, res) => {
    const itemId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(itemId)) throw badRequest('Invalid inventory item id');
    res.json(await restockItem(itemId));
  }),
);

export default router;
