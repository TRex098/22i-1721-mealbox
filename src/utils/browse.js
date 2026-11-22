// Search, filter and sort for the menu. Pure function: easy to reason about.
export const CATEGORIES = ['Meals', 'Weekly Bundles', 'Sides', 'Drinks'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'prep', label: 'Quickest first' },
];

export function filterAndSort(items, { q, category, vegOnly, inStockOnly, sort }) {
  const term = q.trim().toLowerCase();

  const matches = items.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (vegOnly && !item.vegetarian) return false;
    if (inStockOnly && item.stock <= 0) return false;
    if (term) {
      const haystack = [item.name, item.description, item.category, ...item.ingredients]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });

  const sorted = [...matches]; // copy so the original array is never mutated
  if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'prep') sorted.sort((a, b) => a.prepMinutes - b.prepMinutes);
  return sorted;
}
