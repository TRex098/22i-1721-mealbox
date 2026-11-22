// Callback props: the parent owns the value and decides what a change means.
export default function QuantityStepper({ label, value, min = 1, max, onChange }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" className="btn-icon" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
        &minus;
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" className="btn-icon" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
