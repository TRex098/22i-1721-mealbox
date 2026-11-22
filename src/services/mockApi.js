// Simulated back end. Nothing here touches a network.
import { ITEMS } from '../data/items.js';

const DELAY_MS = 700;

// Demo helper: pretends the kitchen changed stock after the menu was first loaded.
function applyAvailabilityChange(item) {
  if (item.id === 'chicken-biryani-box') return { ...item, stock: 0 };
  if (item.id === 'daal-chawal-bowl') return { ...item, stock: 2 };
  return { ...item };
}

export function loadMenu({ shouldFail = false, changedAvailability = false, emptyMenu = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('The menu service did not respond (simulated failure).'));
        return;
      }
      if (emptyMenu) {
        resolve([]);
        return;
      }
      resolve(ITEMS.map((item) => (changedAvailability ? applyAvailabilityChange(item) : { ...item })));
    }, DELAY_MS);
  });
}

// Only item ids and the total are "sent". No name, phone or address leaves the form.
export function submitOrder(order) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderId = `MMC-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      resolve({ orderId, received: order.itemIds.length });
    }, 800);
  });
}
