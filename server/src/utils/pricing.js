import { ORDERING } from '../config.js';
import { badRequest } from './httpError.js';

export const round2 = (amount) => Math.round(amount * 100) / 100;

export const unitPrice = (basePrice, toppingCount) =>
  round2(basePrice + toppingCount * ORDERING.TOPPING_PRICE);

export const orderTotal = (lines) =>
  round2(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));

const SUGAR_VALUES = ORDERING.SUGAR_LEVELS.map((level) => level.value);

function normalizeItem(item, index) {
  const label = `Item ${index + 1}`;
  const productId = Number.parseInt(item?.productId, 10);
  const quantity = Number.parseInt(item?.quantity, 10);
  const toppings = item?.toppings ?? [];
  const iceLevel = item?.iceLevel ?? ORDERING.DEFAULT_ICE_LEVEL;
  const sugarLevel = Number(item?.sugarLevel ?? ORDERING.DEFAULT_SUGAR_LEVEL);
  const errors = [];

  if (!Number.isInteger(productId)) errors.push(`${label}: invalid product`);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > ORDERING.MAX_QUANTITY) {
    errors.push(`${label}: quantity must be 1-${ORDERING.MAX_QUANTITY}`);
  }
  if (!Array.isArray(toppings) || toppings.length > ORDERING.MAX_TOPPINGS
      || new Set(toppings).size !== toppings.length
      || !toppings.every((topping) => ORDERING.TOPPINGS.includes(topping))) {
    errors.push(`${label}: invalid toppings`);
  }
  if (!ORDERING.ICE_LEVELS.includes(iceLevel)) errors.push(`${label}: invalid ice level`);
  if (!SUGAR_VALUES.includes(sugarLevel)) errors.push(`${label}: invalid sugar level`);

  return { errors, value: { productId, quantity, toppings, iceLevel, sugarLevel } };
}

// Validates the items of an order request; throws a 400 listing every problem.
export function validateOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) throw badRequest('Order has no items');
  if (items.length > ORDERING.MAX_ITEMS_PER_ORDER) {
    throw badRequest(`Orders are limited to ${ORDERING.MAX_ITEMS_PER_ORDER} items`);
  }
  const results = items.map(normalizeItem);
  const errors = results.flatMap((result) => result.errors);
  if (errors.length) throw badRequest('Invalid order', errors);
  return results.map((result) => result.value);
}
