// Run with:  node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateQuantity, checkMinimumOrder, MAX_PER_ITEM } from './orderRules.js';

test('accepts an ordinary quantity', () => {
  const result = validateQuantity(3, 10);
  assert.equal(result.valid, true);
  assert.equal(result.code, 'ok');
});

test('accepts exactly the limit of six (boundary)', () => {
  const result = validateQuantity(MAX_PER_ITEM, 10);
  assert.equal(result.valid, true);
  assert.equal(result.max, 6);
});

test('rejects seven, one above the limit', () => {
  const result = validateQuantity(7, 10);
  assert.equal(result.valid, false);
  assert.equal(result.code, 'over-limit');
  assert.match(result.message, /at most 6/);
});

test('rejects more than the remaining stock even when under six', () => {
  const result = validateQuantity(5, 4);
  assert.equal(result.valid, false);
  assert.equal(result.code, 'over-stock');
});

test('rejects sold-out items, zero and fractions', () => {
  assert.equal(validateQuantity(1, 0).code, 'sold-out');
  assert.equal(validateQuantity(0, 10).code, 'below-min');
  assert.equal(validateQuantity(1.5, 10).code, 'not-a-number');
});

test('delivery minimum: Rs 800 passes, Rs 799 does not, collection has no minimum', () => {
  assert.equal(checkMinimumOrder(800, 'delivery').met, true);
  const short = checkMinimumOrder(799, 'delivery');
  assert.equal(short.met, false);
  assert.equal(short.shortfall, 1);
  assert.equal(checkMinimumOrder(100, 'collection').met, true);
});
