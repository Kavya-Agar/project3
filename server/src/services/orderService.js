import { ORDERING } from '../config.js';
import { withTransaction } from '../db/pool.js';
import { badRequest } from '../utils/httpError.js';
import { orderTotal, unitPrice, validateOrderItems } from '../utils/pricing.js';
import { ORDER_EVENTS, publish } from './orderEvents.js';

const ORDER_STATUS_OPEN = 'open';

async function loadPrices(client, productIds) {
  const { rows } = await client.query(
    'SELECT product_id, price FROM products WHERE product_id = ANY($1) AND is_available',
    [productIds],
  );
  return new Map(rows.map((row) => [row.product_id, row.price]));
}

// Total inventory consumption keyed by inventory item id: recipe ingredients
// for each drink plus one portion per topping.
async function calculateInventoryUse(client, lines) {
  const productIds = [...new Set(lines.map((line) => line.productId))];
  const toppingNames = [...new Set(lines.flatMap((line) => line.toppings))];
  const [recipes, toppingItems] = await Promise.all([
    client.query(
      'SELECT product_id, item_id, quantity_used FROM product_ingredients WHERE product_id = ANY($1)',
      [productIds],
    ),
    client.query('SELECT item_id, name FROM inventory WHERE name = ANY($1)', [toppingNames]),
  ]);
  const toppingItemIds = new Map(toppingItems.rows.map((row) => [row.name, row.item_id]));

  const usage = new Map();
  const add = (itemId, amount) => usage.set(itemId, (usage.get(itemId) ?? 0) + amount);
  for (const line of lines) {
    for (const recipe of recipes.rows.filter((row) => row.product_id === line.productId)) {
      add(recipe.item_id, recipe.quantity_used * line.quantity);
    }
    for (const topping of line.toppings) {
      if (toppingItemIds.has(topping)) {
        add(toppingItemIds.get(topping), ORDERING.TOPPING_INVENTORY_USE * line.quantity);
      }
    }
  }
  return usage;
}

// Writes the order, its items and the inventory deductions using `client`,
// so callers control the transaction.
export async function createOrder(client, { items, employeeId, source }) {
  const requested = validateOrderItems(items);
  const prices = await loadPrices(client, [...new Set(requested.map((item) => item.productId))]);
  const missing = requested.find((item) => !prices.has(item.productId));
  if (missing) throw badRequest(`Product ${missing.productId} is not available`);

  const lines = requested.map((item) => ({
    ...item,
    unitPrice: unitPrice(prices.get(item.productId), item.toppings.length),
  }));
  const total = orderTotal(lines);

  const { rows: [order] } = await client.query(
    `INSERT INTO orders (order_id, order_time, total_cost, employee_id, status, source)
     VALUES (nextval('orders_order_id_seq'), now(), $1, $2, $3, $4)
     RETURNING order_id`,
    [total, employeeId, ORDER_STATUS_OPEN, source],
  );

  for (const line of lines) {
    await client.query(
      `INSERT INTO order_items
         (order_item_id, order_id, product_id, quantity, unit_price, toppings, ice_level, sugar_level)
       VALUES (nextval('order_items_order_item_id_seq'), $1, $2, $3, $4, $5, $6, $7)`,
      [order.order_id, line.productId, line.quantity, line.unitPrice,
        line.toppings.join(', ') || null, line.iceLevel, line.sugarLevel],
    );
  }

  const usage = await calculateInventoryUse(client, lines);
  for (const [itemId, amount] of usage) {
    await client.query(
      'UPDATE inventory SET quantity_on_hand = GREATEST(quantity_on_hand - $2, 0) WHERE item_id = $1',
      [itemId, amount],
    );
  }

  return { orderId: order.order_id, total };
}

// Places an order atomically, then notifies the kitchen display.
export async function placeOrder(request) {
  const result = await withTransaction((client) => createOrder(client, request));
  publish(ORDER_EVENTS.CREATED, { orderId: result.orderId });
  return result;
}
