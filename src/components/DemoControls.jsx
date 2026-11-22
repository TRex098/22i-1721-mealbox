// Labelled demonstration controls so edge cases can be reproduced on demand.
export default function DemoControls({ demo, onChange }) {
  return (
    <details className="demo">
      <summary>Demo controls (for testing edge cases)</summary>
      <p className="hint">These switches simulate problems. They only change this browser session.</p>
      <label className="choice">
        <input type="checkbox" checked={demo.failLoad} onChange={(event) => onChange({ failLoad: event.target.checked })} />
        <span>Simulate menu loading failure</span>
      </label>
      <label className="choice">
        <input type="checkbox" checked={demo.changeAvailability} onChange={(event) => onChange({ changeAvailability: event.target.checked })} />
        <span>Simulate changed availability (Chicken Biryani sells out, Daal Chawal drops to 2 left)</span>
      </label>
      <label className="choice">
        <input type="checkbox" checked={demo.emptyMenu} onChange={(event) => onChange({ emptyMenu: event.target.checked })} />
        <span>Simulate an empty menu</span>
      </label>
    </details>
  );
}
