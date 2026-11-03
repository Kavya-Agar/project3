import { REPORTS } from '../config.js';
import { query } from '../db/pool.js';

// Reports cover the most recent `days` days of recorded sales, ending on the
// latest order date, so historical seed data still produces useful reports.
const WINDOW_START = `(SELECT MAX(order_time)::date FROM orders) - ($1::int - 1)`;

export function clampDays(value) {
  const days = Number.parseInt(value, 10);
  if (!Number.isInteger(days) || days < 1) return REPORTS.DEFAULT_DAYS;
  return Math.min(days, REPORTS.MAX_DAYS);
}

export const salesByDay = (days) =>
  query(
    `SELECT to_char(order_time::date, 'YYYY-MM-DD') AS day,
            COUNT(*) AS orders,
            SUM(total_cost) AS revenue
       FROM orders
      WHERE order_time >= ${WINDOW_START}
      GROUP BY order_time::date
      ORDER BY order_time::date`,
    [days],
  );

export async function salesSummary(days) {
  const [summary] = await query(
    `SELECT COUNT(*) AS orders,
            COALESCE(SUM(total_cost), 0) AS revenue,
            COALESCE(AVG(total_cost), 0) AS "averageOrder"
       FROM orders
      WHERE order_time >= ${WINDOW_START}`,
    [days],
  );
  return summary;
}

export const topProducts = (days, limit = REPORTS.TOP_PRODUCT_LIMIT) =>
  query(
    `SELECT p.name,
            SUM(oi.quantity) AS units,
            SUM(oi.quantity * oi.unit_price) AS revenue
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.order_id
       JOIN products p ON p.product_id = oi.product_id
      WHERE o.order_time >= ${WINDOW_START}
      GROUP BY p.name
      ORDER BY units DESC
      LIMIT $2`,
    [days, limit],
  );
