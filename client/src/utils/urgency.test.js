import assert from 'node:assert/strict';
import { test } from 'node:test';
import { URGENCY, URGENCY_THRESHOLDS, formatElapsed, getUrgency } from './urgency.js';

const minutes = (count) => count * 60;

test('fresh tickets are ok', () => {
  assert.equal(getUrgency(0), URGENCY.OK);
  assert.equal(getUrgency(minutes(URGENCY_THRESHOLDS.WARNING_MINUTES) - 1), URGENCY.OK);
});

test('tickets turn warning then late at the thresholds', () => {
  assert.equal(getUrgency(minutes(URGENCY_THRESHOLDS.WARNING_MINUTES)), URGENCY.WARNING);
  assert.equal(getUrgency(minutes(URGENCY_THRESHOLDS.LATE_MINUTES)), URGENCY.LATE);
});

test('formatElapsed pads seconds', () => {
  assert.equal(formatElapsed(65), '1:05');
  assert.equal(formatElapsed(0), '0:00');
});
