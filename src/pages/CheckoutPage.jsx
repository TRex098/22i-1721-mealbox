import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataGate from '../components/DataGate.jsx';
import FormField from '../components/FormField.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { PICKUP_POINT, TIME_SLOTS } from '../data/zones.js';
import { getCheckoutBlockers } from '../rules/orderRules.js';
import { NOTES_MAX, validateCheckout } from '../rules/validation.js';

const INITIAL_VALUES = { fullName: '', phone: '', address: '', slot: '', notes: '' };
const FIELD_ORDER = ['fullName', 'phone', 'address', 'slot', 'notes'];
const FIELD_LABELS = { fullName: 'Name', phone: 'Phone', address: 'Address', slot: 'Time slot', notes: 'Notes' };

export default function CheckoutPage({ status, errorMessage, onRetry, lines, issues, prefs, zone, totals, onPlaceOrder }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Derived on every render from the current values: never stored separately.
  const errors = validateCheckout(values, prefs.fulfilment);
  const errorEntries = FIELD_ORDER.filter((name) => errors[name]).map((name) => [name, errors[name]]);
  const blockers = getCheckoutBlockers({ lineCount: lines.length, issues, fulfilment: prefs.fulfilment, zone, totals });
  const errorFor = (name) => (touched[name] || submitAttempted ? errors[name] : '');

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value })); // new object, valid input is kept
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));
  }

  function focusField(name) {
    document.getElementById(`field-${name}`)?.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);
    if (errorEntries.length > 0) {
      focusField(errorEntries[0][0]);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await onPlaceOrder(values.slot);
      navigate('/confirmation');
    } catch {
      setSubmitError('The simulated order could not be placed. Your details are still here. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Your details</h1>
      <DataGate status={status} errorMessage={errorMessage} onRetry={onRetry}>
        {blockers.length > 0 ? (
          <div className="state-box">
            <h2>Your cart is not ready for checkout</h2>
            <ul>{blockers.map((text) => (<li key={text}>{text}</li>))}</ul>
            <Link className="btn btn-primary" to="/cart">Go to your cart</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <form onSubmit={handleSubmit} noValidate aria-label="Order details">
              <p className="hint">This is a simulated order. Use a made-up name and number; nothing leaves your browser.</p>

              {submitAttempted && errorEntries.length > 0 && (
                <div role="alert" className="error-summary">
                  <h2>Please fix {errorEntries.length} {errorEntries.length === 1 ? 'problem' : 'problems'}</h2>
                  <ul>
                    {errorEntries.map(([name, message]) => (
                      <li key={name}>
                        <button type="button" className="link-button" onClick={() => focusField(name)}>
                          {FIELD_LABELS[name]}: {message}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <FormField name="fullName" label="Name for the order" required value={values.fullName} onChange={handleChange} onBlur={handleBlur} error={errorFor('fullName')} autoComplete="off" />
              <FormField name="phone" label="Mobile number" required value={values.phone} onChange={handleChange} onBlur={handleBlur} error={errorFor('phone')} hint="Example: 0300 1234567" inputMode="tel" autoComplete="off" />

              {prefs.fulfilment === 'delivery' ? (
                <FormField name="address" label={`Delivery address in ${zone?.name ?? 'your zone'}`} required as="textarea" rows={3} value={values.address} onChange={handleChange} onBlur={handleBlur} error={errorFor('address')} hint="House number, street and sector." />
              ) : (
                <p className="callout">Collect from: {PICKUP_POINT}</p>
              )}

              <FormField name="slot" label={prefs.fulfilment === 'delivery' ? 'Delivery time slot' : 'Collection time slot'} required as="select" value={values.slot} onChange={handleChange} onBlur={handleBlur} error={errorFor('slot')}>
                <option value="">Choose a time slot</option>
                {TIME_SLOTS.map((slot) => (<option key={slot} value={slot}>{slot}</option>))}
              </FormField>

              <FormField name="notes" label="Notes for the kitchen" as="textarea" rows={2} value={values.notes} onChange={handleChange} onBlur={handleBlur} error={errorFor('notes')} hint={`${values.notes.length} of ${NOTES_MAX} characters`} />

              {submitError && <p role="alert" className="error-text">{submitError}</p>}

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Placing simulated order…' : 'Place simulated order'}
              </button>
              <Link className="btn btn-quiet" to="/cart">Back to cart</Link>
            </form>

            <aside>
              <SummaryCard totals={totals} fulfilment={prefs.fulfilment} zone={zone} />
            </aside>
          </div>
        )}
      </DataGate>
    </section>
  );
}
