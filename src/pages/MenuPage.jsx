import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DataGate from '../components/DataGate.jsx';
import ItemCard from '../components/ItemCard.jsx';
import { DELIVERY_ZONES } from '../data/zones.js';
import { FREE_DELIVERY_FROM, MAX_PER_ITEM, MIN_DELIVERY_ORDER } from '../rules/orderRules.js';
import { CATEGORIES, SORT_OPTIONS, filterAndSort } from '../utils/browse.js';
import { formatPrice } from '../utils/format.js';

export default function MenuPage({ items, status, errorMessage, onRetry, lines, prefs, onPrefsChange, onAdd }) {
  // Filters live in the URL, so Back, Forward and refresh keep them.
  const [params, setParams] = useSearchParams();
  const [notice, setNotice] = useState('');

  const filters = {
    q: params.get('q') ?? '',
    category: params.get('category') ?? 'all',
    vegOnly: params.get('veg') === '1',
    inStockOnly: params.get('stock') === '1',
    sort: params.get('sort') ?? 'featured',
  };
  const hasFilters = filters.q !== '' || filters.category !== 'all' || filters.vegOnly || filters.inStockOnly;

  function setParam(key, value) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value === '' || value === 'all' || value === 'featured') next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  }

  function clearFilters() {
    setParams({}, { replace: true });
  }

  function handleAdd(item) {
    const result = onAdd(item, 1);
    setNotice(result.message);
  }

  const results = filterAndSort(items, filters);
  const hiddenSelected = lines.filter((line) => !results.some((item) => item.id === line.item.id));
  const fees = DELIVERY_ZONES.map((zone) => zone.fee);

  return (
    <section>
      <h1>Menu</h1>
      <p className="callout">
        <strong>Before you order:</strong> delivery has a {formatPrice(MIN_DELIVERY_ORDER)} minimum and a fee of{' '}
        {formatPrice(Math.min(...fees))} to {formatPrice(Math.max(...fees))} by zone, free from{' '}
        {formatPrice(FREE_DELIVERY_FROM)}. Collection is free. Up to {MAX_PER_ITEM} of each dish.
      </p>

      <DataGate status={status} errorMessage={errorMessage} onRetry={onRetry}>
        {items.length === 0 ? (
          <div className="state-box">
            <h2>No dishes on the menu yet</h2>
            <p>The kitchen has not published today&rsquo;s dishes. Reload to check again.</p>
            <button type="button" className="btn btn-primary" onClick={onRetry}>Reload menu</button>
          </div>
        ) : (
          <>
            <form className="filters" role="search" aria-label="Search and filter dishes" onSubmit={(event) => event.preventDefault()}>
              <div className="field field-wide">
                <label htmlFor="q">Search dishes</label>
                <input id="q" type="search" value={filters.q} placeholder="Try biryani, daal or chicken" onChange={(event) => setParam('q', event.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="category">Category</label>
                <select id="category" value={filters.category} onChange={(event) => setParam('category', event.target.value)}>
                  <option value="all">All categories</option>
                  {CATEGORIES.map((category) => (<option key={category} value={category}>{category}</option>))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="sort">Sort by</label>
                <select id="sort" value={filters.sort} onChange={(event) => setParam('sort', event.target.value)}>
                  {SORT_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                </select>
              </div>
              <div className="checks">
                <label className="choice">
                  <input type="checkbox" checked={filters.vegOnly} onChange={(event) => setParam('veg', event.target.checked ? '1' : '')} />
                  <span>Vegetarian only</span>
                </label>
                <label className="choice">
                  <input type="checkbox" checked={filters.inStockOnly} onChange={(event) => setParam('stock', event.target.checked ? '1' : '')} />
                  <span>In stock only</span>
                </label>
                <label className="choice">
                  <input type="checkbox" checked={prefs.nutAllergy} onChange={(event) => onPrefsChange({ nutAllergy: event.target.checked })} />
                  <span>I have a nut allergy</span>
                </label>
              </div>
            </form>

            <p role="status" className="notice">{notice}</p>

            {hiddenSelected.length > 0 && (
              <div className="callout callout-info">
                <p>
                  <strong>{hiddenSelected.length} {hiddenSelected.length === 1 ? 'item' : 'items'} in your cart {hiddenSelected.length === 1 ? 'is' : 'are'} hidden by these filters:</strong>{' '}
                  {hiddenSelected.map((line) => line.item.name).join(', ')}. They are still in your cart.
                </p>
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>Show all dishes</button>
              </div>
            )}

            <h2 className="results-title">Dishes</h2>
            <p role="status">Showing {results.length} of {items.length} dishes</p>

            {results.length === 0 ? (
              <div className="state-box">
                <h3>No dishes match{filters.q ? ` “${filters.q}”` : ' these filters'}</h3>
                <ul>
                  <li>Check the spelling or try a shorter word.</li>
                  <li>Remove a filter such as vegetarian or in stock only.</li>
                </ul>
                {hasFilters && (
                  <button type="button" className="btn btn-primary" onClick={clearFilters}>Clear search and filters</button>
                )}
              </div>
            ) : (
              <ul className="card-grid">
                {results.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    nutBlocked={prefs.nutAllergy && item.containsNuts}
                    inCart={lines.find((line) => line.item.id === item.id)?.quantity ?? 0}
                    onAdd={handleAdd}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </DataGate>
    </section>
  );
}
