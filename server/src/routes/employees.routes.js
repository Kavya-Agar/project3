import { Router } from 'express';
import { ORDERING } from '../config.js';
import { query } from '../db/pool.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Cashiers who can be selected on the cashier screen.
router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(
      await query(
        'SELECT employee_id AS "employeeId", name FROM employees WHERE role = $1 ORDER BY name, employee_id',
        [ORDERING.CASHIER_ROLE],
      ),
    );
  }),
);

export default router;
