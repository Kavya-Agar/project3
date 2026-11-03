import { query } from '../db/pool.js';
import { notFoundError } from '../utils/httpError.js';
import { groupIntoTickets } from '../utils/tickets.js';
import { ORDER_EVENTS, publish } from './orderEvents.js';

const TICKET_ROWS_SQL = `
  SELECT o.order_id AS "orderId", o.source,
         to_char(o.order_time, 'HH12:MI AM') AS "placedAt",
         GREATEST(EXTRACT(EPOCH FROM (now() - o.order_time)), 0)::int AS "ageSeconds",
         p.name, oi.quantity, oi.toppings,
         oi.ice_level AS "iceLevel", oi.sugar_level AS "sugarLevel"
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.order_id
    JOIN products p ON p.product_id = oi.product_id`;

export async function listOpenTickets() {
  const rows = await query(
    `${TICKET_ROWS_SQL} WHERE o.status = 'open' ORDER BY o.order_time, oi.order_item_id`,
  );
  return groupIntoTickets(rows);
}

export async function getTicket(orderId) {
  const rows = await query(`${TICKET_ROWS_SQL} WHERE o.order_id = $1 ORDER BY oi.order_item_id`, [orderId]);
  return groupIntoTickets(rows)[0] ?? null;
}

export async function completeTicket(orderId) {
  const rows = await query(
    `UPDATE orders SET status = 'completed' WHERE order_id = $1 AND status = 'open' RETURNING order_id`,
    [orderId],
  );
  if (!rows.length) throw notFoundError('Open ticket not found');
  publish(ORDER_EVENTS.COMPLETED, { orderId });
}
