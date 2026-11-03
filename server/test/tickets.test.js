import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groupIntoTickets } from '../src/utils/tickets.js';

const row = (orderId, name, extra = {}) => ({
  orderId, source: 'kiosk', placedAt: '3:05 PM', ageSeconds: 42,
  name, quantity: 1, toppings: null, iceLevel: 'Regular', sugarLevel: 0.5, ...extra,
});

test('groups rows of the same order into one ticket in order', () => {
  const tickets = groupIntoTickets([row(7, 'Taro Milk Tea'), row(7, 'Mango Slush'), row(8, 'Jasmine Green Tea')]);
  assert.deepEqual(tickets.map((ticket) => [ticket.orderId, ticket.items.length]), [[7, 2], [8, 1]]);
});

test('splits comma-separated toppings into a list', () => {
  const [ticket] = groupIntoTickets([row(1, 'Brown Sugar Milk Tea', { toppings: 'Pudding, Red Bean' })]);
  assert.deepEqual(ticket.items[0].toppings, ['Pudding', 'Red Bean']);
});

test('returns an empty list for no rows', () => {
  assert.deepEqual(groupIntoTickets([]), []);
});
