import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import DataGate from '../components/DataGate.jsx';
import ItemImage from '../components/ItemImage.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import StockBadge from '../components/StockBadge.jsx';
import { DELIVERY_ZONES } from '../data/zones.js';
import { FREE_DELIVERY_FROM, MAX_PER_ITEM, MIN_DELIVERY_ORDER } from '../rules/orderRules.js';
import { formatPrice } from '../utils/format.js';

const SPICE_LABELS = ['No heat', 'Mild', 'Medium', 'Hot'];

function ItemDetails({ item, inCart, nutBlocked, onAdd }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');

  const limit = Math.max(0, Math.min(MAX_PER_ITEM, item.stock));
  const room = Math.max(0, limit - inCart); // how many more this customer may add
  const shownQuantity = Math.min(quantity, Math.max(room, 1));
  const canAdd = !nutBlocked && room > 0;
  const fees = DELIVERY_ZONES.map((zone) => zone.fee);

  function handleAdd() {
    const result = onAdd(item, shownQuantity);
    setNotice(result.message);
    if (result.ok) setQuantity(1);
  }

  return (
    <article className="detail">
      {/* "default" means the page was opened directly, so there is no results page to go back to */}
      {location.key !== 'default' ? (
        <button type="button" className="btn btn-quiet" onClick={() => navigate(-1)}>Back to results</button>
      ) : (
        <Link className="btn btn-quiet" to="/menu">Back to menu</Link>
      )}

      <div className="detail-grid">
        <ItemImage item={item} size="large" />
        <div>
          <h1>{item.name}</h1>
          <p className="price price-large">{formatPrice(item.price)}</p>
          <p>{item.description || 'The kitchen has not added a description for this dish yet.'}</p>
          <StockBadge stock={item.stock} />
        </div>
      </div>

      <dl className="facts">
        <div><dt>Category</dt><dd>{item.category}</dd></div>
        <div><dt>Ready in</dt><dd>about {item.prepMinutes} min</dd></div>
        <div><dt>Spice</dt><dd>{SPICE_LABELS[item.spice] ?? 'Not listed'}</dd></div>
        <div><dt>Diet</dt><dd>{item.vegetarian ? 'Vegetarian' : 'Contains meat'}</dd></div>
        <div><dt>Nuts</dt><dd>{item.containsNuts ? 'Contains nuts' : 'No nuts listed'}</dd></div>
        <div><dt>Ingredients</dt><dd>{item.ingredients.join(', ')}</dd></div>
      </dl>

      <section className="callout" aria-label="Cost conditions">
        <p>
          <strong>Delivery conditions:</strong> minimum order {formatPrice(MIN_DELIVERY_ORDER)}, fee {formatPrice(Math.min(...fees))} to{' '}
          {formatPrice(Math.max(...fees))}, free from {formatPrice(FREE_DELIVERY_FROM)}. Collection is free.
        </p>
      </section>

      <section aria-labelledby="order-title" className="order-box">
        <h2 id="order-title">Add to cart</h2>
        {nutBlocked && <p className="warn-text">This dish contains nuts, so it cannot be ordered with your nut allergy setting.</p>}
        {item.stock <= 0 && <p className="warn-text">Sold out today. Browse the menu for alternatives.</p>}
        {inCart > 0 && <p className="selected-text">You already have {inCart} in your cart.</p>}
        <div className="qty-row">
          <QuantityStepper label={`${item.name} quantity`} value={shownQuantity} max={Math.max(room, 1)} onChange={setQuantity} />
          <p className="hint">Order 1 to {limit} of this dish (max {MAX_PER_ITEM} per order, {item.stock} left today).</p>
        </div>
        <button type="button" className="btn btn-primary" disabled={!canAdd} onClick={handleAdd}>
          Add {shownQuantity} to cart, {formatPrice(item.price * shownQuantity)}
        </button>
        <p role="status" className="notice">{notice}</p>
      </section>
    </article>
  );
}

export default function ItemPage({ items, status, errorMessage, onRetry, lines, prefs, onAdd }) {
  const { id } = useParams();
  const item = items.find((candidate) => candidate.id === id);

  return (
    <DataGate status={status} errorMessage={errorMessage} onRetry={onRetry}>
      {item ? (
        // key resets the quantity when moving between two dishes
        <ItemDetails
          key={item.id}
          item={item}
          inCart={lines.find((line) => line.item.id === item.id)?.quantity ?? 0}
          nutBlocked={prefs.nutAllergy && item.containsNuts}
          onAdd={onAdd}
        />
      ) : (
        <div className="state-box">
          <h1>We could not find that dish</h1>
          <p>There is no dish with the code &ldquo;{id}&rdquo;. It may have been removed, or the link may be wrong.</p>
          <Link className="btn btn-primary" to="/menu">Browse the menu</Link>
          {items.length > 0 && (
            <>
              <h2>Popular right now</h2>
              <ul>
                {items.slice(0, 3).map((candidate) => (
                  <li key={candidate.id}><Link to={`/items/${candidate.id}`}>{candidate.name}</Link></li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </DataGate>
  );
}
