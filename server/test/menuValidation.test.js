import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MENU } from '../src/config.js';
import { validateMenuItem } from '../src/utils/menuValidation.js';

const valid = { name: '  Aggie Maroon Milk Tea ', price: '6.499', category: MENU.CATEGORIES[0] };

test('accepts a valid item and trims and rounds its values', () => {
  const { errors, value } = validateMenuItem(valid);
  assert.deepEqual(errors, []);
  assert.equal(value.name, 'Aggie Maroon Milk Tea');
  assert.equal(value.price, 6.5);
  assert.equal(value.isAvailable, true);
});

test('reports an error for every invalid field', () => {
  const { errors } = validateMenuItem({ name: '', price: -1, category: 'Soup' });
  assert.equal(errors.length, 3);
});

test('rejects prices above the configured maximum', () => {
  assert.equal(validateMenuItem({ ...valid, price: MENU.PRICE_MAX + 1 }).errors.length, 1);
});
