import { MIN_DELIVERY_ORDER } from '../rules/orderRules.js';
import { formatPrice } from '../utils/format.js';

// Everything shown here is derived from the totals object; nothing is stored.
export default function SummaryCard({ totals, fulfilment, zone }) {
  const needsZone = fulfilment === 'delivery' && !zone;
  let feeText = 'Free';
  if (needsZone) feeText = 'Choose a zone';
  else if (totals.deliveryFee > 0) feeText = formatPrice(totals.deliveryFee);

  return (
    <section className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Order summary</h2>
      <dl>
        <div><dt>Items</dt><dd>{totals.itemCount}</dd></div>
        <div><dt>Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
        <div>
          <dt>{fulfilment === 'delivery' ? `Delivery${zone ? ` to ${zone.name}` : ''}` : 'Collection'}</dt>
          <dd>{feeText}</dd>
        </div>
        <div className="summary-total"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
        <div><dt>Ready in about</dt><dd>{totals.prepMinutes} min</dd></div>
      </dl>
      {fulfilment === 'delivery' && !totals.meetsMinimum && (
        <p className="warn-text" role="status">
          Add {formatPrice(totals.shortfall)} more to reach the {formatPrice(MIN_DELIVERY_ORDER)} delivery minimum.
        </p>
      )}
      {fulfilment === 'delivery' && totals.meetsMinimum && totals.freeDeliveryRemaining > 0 && (
        <p className="hint">Add {formatPrice(totals.freeDeliveryRemaining)} more for free delivery.</p>
      )}
      <p className="sim-note">Simulated order: no payment is taken and no food is prepared.</p>
    </section>
  );
}
