import { DELIVERY_ZONES, PICKUP_POINT } from '../data/zones.js';
import { MIN_DELIVERY_ORDER } from '../rules/orderRules.js';
import { formatPrice } from '../utils/format.js';

export default function FulfilmentSettings({ prefs, onChange }) {
  return (
    <fieldset className="settings">
      <legend>How would you like your order?</legend>

      <label className="choice">
        <input type="radio" name="fulfilment" value="collection" checked={prefs.fulfilment === 'collection'} onChange={() => onChange({ fulfilment: 'collection' })} />
        <span>Collect from {PICKUP_POINT}. Free, no minimum.</span>
      </label>

      <label className="choice">
        <input type="radio" name="fulfilment" value="delivery" checked={prefs.fulfilment === 'delivery'} onChange={() => onChange({ fulfilment: 'delivery' })} />
        <span>Delivery. Minimum order {formatPrice(MIN_DELIVERY_ORDER)}, fee depends on your zone.</span>
      </label>

      {prefs.fulfilment === 'delivery' && (
        <div className="field">
          <label htmlFor="zone">Delivery zone</label>
          <select id="zone" value={prefs.zoneId} onChange={(event) => onChange({ zoneId: event.target.value })}>
            <option value="">Choose a zone</option>
            {DELIVERY_ZONES.map((zone) => (
              <option key={zone.id} value={zone.id}>{zone.name} ({formatPrice(zone.fee)})</option>
            ))}
          </select>
        </div>
      )}

      <label className="choice">
        <input type="checkbox" checked={prefs.nutAllergy} onChange={(event) => onChange({ nutAllergy: event.target.checked })} />
        <span>I have a nut allergy. Dishes containing nuts cannot be ordered.</span>
      </label>
    </fieldset>
  );
}
