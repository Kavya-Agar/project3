import { query } from '../db/pool.js';
import { notFoundError } from '../utils/httpError.js';

const MENU_COLUMNS = `product_id AS "productId", name, price, category,
                      is_available AS "isAvailable", popularity`;

export const listMenu = ({ includeUnavailable = false } = {}) =>
  query(
    `SELECT ${MENU_COLUMNS} FROM products
      WHERE $1 OR is_available
      ORDER BY category, name`,
    [includeUnavailable],
  );

export async function createMenuItem({ name, price, category, isAvailable }) {
  const [item] = await query(
    `INSERT INTO products (product_id, name, price, category, is_available)
     VALUES (nextval('products_product_id_seq'), $1, $2, $3, $4)
     RETURNING ${MENU_COLUMNS}`,
    [name, price, category, isAvailable],
  );
  return item;
}

export async function updateMenuItem(productId, { name, price, category, isAvailable }) {
  const [item] = await query(
    `UPDATE products SET name = $2, price = $3, category = $4, is_available = $5
      WHERE product_id = $1
      RETURNING ${MENU_COLUMNS}`,
    [productId, name, price, category, isAvailable],
  );
  if (!item) throw notFoundError('Menu item not found');
  return item;
}
