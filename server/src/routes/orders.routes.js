import { Router } from 'express';
import { ORDERING } from '../config.js';
import { placeOrder } from '../services/orderService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { badRequest } from '../utils/httpError.js';

const router = Router();
const VALID_SOURCES = Object.values(ORDERING.SOURCES);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { items, source } = req.body ?? {};
    if (!VALID_SOURCES.includes(source)) throw badRequest('Unknown order source');

    // Kiosk orders are always attributed to the self-service kiosk employee.
    const employeeId = source === ORDERING.SOURCES.KIOSK
      ? ORDERING.KIOSK_EMPLOYEE_ID
      : Number.parseInt(req.body.employeeId, 10);
    if (!Number.isInteger(employeeId)) throw badRequest('Cashier is required');

    res.status(201).json(await placeOrder({ items, employeeId, source }));
  }),
);

export default router;
