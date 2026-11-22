import { Link } from 'react-router-dom';
import DataGate from '../components/DataGate.jsx';
import FulfilmentSettings from '../components/FulfilmentSettings.jsx';
import ItemImage from '../components/ItemImage.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import StockBadge from '../components/StockBadge.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { MAX_PER_ITEM, getCheckoutBlockers } from '../rules/orderRules.js';
import { formatPrice } from '../utils/format.js';

function IssueRow({ issue, onSetQuantity, onRemove }) {
  const canResize = typeof issue.fixTo === 'number' && issue.fixTo > 0;
  return (
    <li className="issue">
      <p><strong>Needs attention:</strong> {issue.message}</p>
      {canResize ? (
        <button type="button" className="btn btn-secondary" onClick={() => onSetQuantity(issue.id, issue.fixTo)}>
          Change quantity to {issue.fixTo}
        </button>
      ) : (
        <button type="button" className="btn btn-secondary" onClick={() => onRemove(issue.id)}>Remove from cart</button>
      )}
    </li>
  );
}

export default function CartPage({ status, errorMessage, onRetry, cart, lines, issues, prefs, zone, totals, onPrefsChange, onSetQuantity, onRemove }) {
  const blockers = getCheckoutBlockers({ lineCount: lines.length, issues, fulfilment: prefs.fulfilment, zone, totals });

  return (
    <section>
      <h1>Your cart</h1>
      <DataGate status={status} errorMessage={errorMessage} onRetry={onRetry}>
        {cart.length === 0 ? (
          <div className="state-box">
            <h2>Your cart is empty</h2>
            <p>Add a dish from the menu to start an order.</p>
            <Link className="btn btn-primary" to="/menu">Browse the menu</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div>
              {issues.length > 0 && (
                <ul className="issues" aria-label="Problems with your cart">
                  {issues.map((issue) => (
                    <IssueRow key={`${issue.id}-${issue.type}`} issue={issue} onSetQuantity={onSetQuantity} onRemove={onRemove} />
                  ))}
                </ul>
              )}

              <ul className="cart-list">
                {lines.map(({ item, quantity }) => {
                  const max = Math.max(0, Math.min(MAX_PER_ITEM, item.stock));
                  return (
                    <li key={item.id} className="cart-line">
                      <ItemImage item={item} size="small" />
                      <div className="cart-info">
                        <h2 className="cart-title"><Link to={`/items/${item.id}`}>{item.name}</Link></h2>
                        <p>{formatPrice(item.price)} each</p>
                        <StockBadge stock={item.stock} />
                      </div>
                      <div className="cart-controls">
                        <QuantityStepper label={`${item.name} quantity`} value={quantity} max={max} onChange={(next) => onSetQuantity(item.id, next)} />
                        <p className="hint">Limit {max}</p>
                        <p className="line-total">{formatPrice(item.price * quantity)}</p>
                        <button type="button" className="btn btn-quiet" aria-label={`Remove ${item.name} from cart`} onClick={() => onRemove(item.id)}>Remove</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <aside>
              <FulfilmentSettings prefs={prefs} onChange={onPrefsChange} />
              <SummaryCard totals={totals} fulfilment={prefs.fulfilment} zone={zone} />
              {blockers.length > 0 ? (
                <div className="blockers">
                  <p><strong>Before you can continue:</strong></p>
                  <ul>{blockers.map((text) => (<li key={text}>{text}</li>))}</ul>
                  <button type="button" className="btn btn-primary" disabled>Continue to your details</button>
                </div>
              ) : (
                <Link className="btn btn-primary btn-block" to="/checkout">Continue to your details</Link>
              )}
            </aside>
          </div>
        )}
      </DataGate>
    </section>
  );
}
