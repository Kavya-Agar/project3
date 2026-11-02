import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ORDERING } from '../src/config.js';
import { orderTotal, unitPrice, validateOrderItems } from '../src/utils/pricing.js';

test('unitPrice adds the topping surcharge per topping', () => {
  assert.equal(unitPrice(5.5, 0), 5.5);
  assert.equal(unitPrice(5.5, 2), 5.5 + 2 * ORDERING.TOPPING_PRICE);
});

test('orderTotal sums quantity times unit price without float drift', () => {
  assert.equal(orderTotal([{ unitPrice: 5.95, quantity: 3 }, { unitPrice: 0.1, quantity: 2 }]), 18.05);
});

test('validateOrderItems fills defaults for optional fields', () => {
  const [item] = validateOrderItems([{ productId: 1, quantity: 2 }]);
  assert.deepEqual(item, {
    productId: 1,
    quantity: 2,
    toppings: [],
    iceLevel: ORDERING.DEFAULT_ICE_LEVEL,
    sugarLevel: ORDERING.DEFAULT_SUGAR_LEVEL,
  });
});

test('validateOrderItems rejects empty orders and bad customizations', () => {
  assert.throws(() => validateOrderItems([]), /no items/);
  assert.throws(() => validateOrderItems([{ productId: 1, quantity: 0 }]));
  assert.throws(() => validateOrderItems([{ productId: 1, quantity: 1, toppings: ['Gold Leaf'] }]));
  assert.throws(() => validateOrderItems([{ productId: 1, quantity: 1, iceLevel: 'Lots' }]));
  assert.throws(() => validateOrderItems([{ productId: 1, quantity: 1, sugarLevel: 0.42 }]));
});
