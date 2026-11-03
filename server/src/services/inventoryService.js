import { query } from '../db/pool.js';
import { notFoundError } from '../utils/httpError.js';

const INVENTORY_COLUMNS = `item_id AS "itemId", name, vendor, quantity_on_hand AS "quantityOnHand",
                           unit, reorder_level AS "reorderLevel", fill_amount AS "fillAmount",
                           quantity_on_hand <= reorder_level AS "isLow"`;

export const listInventory = ({ lowOnly = false } = {}) =>
  query(
    `SELECT ${INVENTORY_COLUMNS} FROM inventory
      WHERE NOT $1 OR quantity_on_hand <= reorder_level
      ORDER BY (quantity_on_hand / NULLIF(reorder_level, 0)), name`,
    [lowOnly],
  );

// Restocking adds one standard fill amount to the item.
export async function restockItem(itemId) {
  const [item] = await query(
    `UPDATE inventory SET quantity_on_hand = quantity_on_hand + fill_amount
      WHERE item_id = $1
      RETURNING ${INVENTORY_COLUMNS}`,
    [itemId],
  );
  if (!item) throw notFoundError('Inventory item not found');
  return item;
}
