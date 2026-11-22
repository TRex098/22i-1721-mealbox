// Business rules. Pure functions with no React and no DOM, so they can be
// used by the app AND tested with `node --test`.
//
// Rule 1 (availability / capacity):  1 to 6 of one dish, never more than today's stock.
// Rule 2 (eligibility):              nut dishes cannot be ordered with the nut-allergy setting on.
// Rule 3 (pricing / fulfilment):     delivery needs a subtotal of at least Rs 800; free delivery from Rs 2,500.

export const MAX_PER_ITEM = 6;
export const MIN_DELIVERY_ORDER = 800;
export const FREE_DELIVERY_FROM = 2500;

// ---- Rule 1 -------------------------------------------------------------
export function validateQuantity(quantity, stock) {
  const max = Math.max(0, Math.min(MAX_PER_ITEM, stock));
  if (!Number.isInteger(quantity)) {
    return { valid: false, code: 'not-a-number', max, message: 'Enter a whole number.' };
  }
  if (stock <= 0) {
    return { valid: false, code: 'sold-out', max: 0, message: 'Sold out for today.' };
  }
  if (quantity < 1) {
    return { valid: false, code: 'below-min', max, message: 'Order at least 1.' };
  }
  if (quantity > MAX_PER_ITEM) {
    return { valid: false, code: 'over-limit', max, message: `You can order at most ${MAX_PER_ITEM} of one dish.` };
  }
  if (quantity > stock) {
    return { valid: false, code: 'over-stock', max, message: `Only ${stock} left today.` };
  }
  return { valid: true, code: 'ok', max, message: '' };
}

// ---- Rule 2 -------------------------------------------------------------
export function hasNutConflict(item, nutAllergy) {
  return nutAllergy === true && item.containsNuts === true;
}

// ---- Rule 3 -------------------------------------------------------------
export function checkMinimumOrder(subtotal, fulfilment) {
  if (fulfilment !== 'delivery') return { met: true, shortfall: 0 };
  const shortfall = Math.max(0, MIN_DELIVERY_ORDER - subtotal);
  return { met: shortfall === 0, shortfall };
}

export function calculateDeliveryFee(subtotal, fulfilment, zone) {
  if (fulfilment !== 'delivery' || !zone) return 0;
  return subtotal >= FREE_DELIVERY_FROM ? 0 : zone.fee;
}

// ---- Cart checks (used when a saved cart is restored or stock changes) ----
export function describeCart(entries, items, nutAllergy) {
  const lines = [];
  const issues = [];

  for (const entry of entries) {
    const item = items.find((candidate) => candidate.id === entry.id);
    if (!item) {
      issues.push({ id: entry.id, type: 'missing', message: 'An item in your saved cart is no longer on the menu.' });
      continue;
    }
    lines.push({ item, quantity: entry.quantity });

    const check = validateQuantity(entry.quantity, item.stock);
    if (!check.valid) {
      issues.push({ id: item.id, type: check.code, message: `${item.name}: ${check.message}`, fixTo: check.max });
    }
    if (hasNutConflict(item, nutAllergy)) {
      issues.push({ id: item.id, type: 'nut', message: `${item.name} contains nuts, which conflicts with your nut allergy setting.` });
    }
  }
  return { lines, issues };
}

export function calculateTotals(lines, fulfilment, zone) {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  const deliveryFee = calculateDeliveryFee(subtotal, fulfilment, zone);
  const minimum = checkMinimumOrder(subtotal, fulfilment);
  const prepMinutes = lines.reduce((longest, line) => Math.max(longest, line.item.prepMinutes), 0);
  const freeDeliveryRemaining =
    fulfilment === 'delivery' && subtotal < FREE_DELIVERY_FROM ? FREE_DELIVERY_FROM - subtotal : 0;

  return {
    itemCount,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    prepMinutes,
    meetsMinimum: minimum.met,
    shortfall: minimum.shortfall,
    freeDeliveryRemaining,
  };
}

// Everything that stops the customer from continuing to checkout, in plain words.
export function getCheckoutBlockers({ lineCount, issues, fulfilment, zone, totals }) {
  const blockers = [];
  if (lineCount === 0) blockers.push('Your cart is empty.');
  if (issues.length > 0) blockers.push('Fix the items marked above (change the quantity or remove them).');
  if (fulfilment === 'delivery' && !zone) blockers.push('Choose a delivery zone.');
  if (!totals.meetsMinimum) {
    blockers.push(`Delivery needs a minimum order of Rs ${MIN_DELIVERY_ORDER}. Add Rs ${totals.shortfall} more, or switch to collection.`);
  }
  return blockers;
}
