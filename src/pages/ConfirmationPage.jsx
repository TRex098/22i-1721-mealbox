import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format.js';

export default function ConfirmationPage({ lastOrder }) {
  const headingRef = useRef(null);

  // Move keyboard and screen-reader focus to the result.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!lastOrder) {
    return (
      <section className="state-box">
        <h1 ref={headingRef} tabIndex={-1}>No recent order</h1>
        <p>You have not placed an order in this browser yet.</p>
        <Link className="btn btn-primary" to="/menu">Browse the menu</Link>
      </section>
    );
  }

  const { orderId, fulfilment, zoneName, slot, lines, totals } = lastOrder;

  return (
    <section className="confirmation">
      <h1 ref={headingRef} tabIndex={-1}>Order placed (simulated)</h1>
      <p className="success-text">
        <strong>Success:</strong> your order reference is <strong>{orderId}</strong>. No payment was taken and no food will be prepared.
      </p>
      <dl className="facts">
        <div><dt>{fulfilment === 'delivery' ? 'Delivery to' : 'Collection'}</dt><dd>{fulfilment === 'delivery' ? zoneName : 'H-11 Collection Point'}</dd></div>
        <div><dt>Time slot</dt><dd>{slot}</dd></div>
        <div><dt>Ready in about</dt><dd>{totals.prepMinutes} min</dd></div>
      </dl>
      <table className="zones">
        <caption>What you ordered</caption>
        <thead><tr><th scope="col">Dish</th><th scope="col">Qty</th><th scope="col">Price</th></tr></thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.name}><th scope="row">{line.name}</th><td>{line.quantity}</td><td>{formatPrice(line.lineTotal)}</td></tr>
          ))}
        </tbody>
        <tfoot>
          <tr><th scope="row" colSpan="2">Delivery fee</th><td>{totals.deliveryFee === 0 ? 'Free' : formatPrice(totals.deliveryFee)}</td></tr>
          <tr><th scope="row" colSpan="2">Total</th><td>{formatPrice(totals.total)}</td></tr>
        </tfoot>
      </table>
      <Link className="btn btn-primary" to="/menu">Order something else</Link>
    </section>
  );
}
