import { Link } from 'react-router-dom';
import { DELIVERY_ZONES, PICKUP_POINT } from '../data/zones.js';
import { FREE_DELIVERY_FROM, MAX_PER_ITEM, MIN_DELIVERY_ORDER } from '../rules/orderRules.js';
import { formatPrice } from '../utils/format.js';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Home-style meals for Islamabad students</h1>
        <p>
          Margalla Meal Co. cooks fresh daal, biryani, karahi and weekly bundles every morning. Collect from
          H-11 or have it delivered to your sector. This is a fictional demo business.
        </p>
        <Link className="btn btn-primary" to="/menu">See today&rsquo;s menu</Link>
      </section>

      <section aria-labelledby="how-title">
        <h2 id="how-title">How ordering works</h2>
        <ol className="steps">
          <li>Browse the menu and search by dish or ingredient.</li>
          <li>Open a dish to check price, spice level, nuts and how many are left.</li>
          <li>Build your cart and choose collection or delivery.</li>
          <li>Enter your details and place a simulated order.</li>
        </ol>
      </section>

      <section aria-labelledby="costs-title">
        <h2 id="costs-title">Costs and rules, before you order</h2>
        <ul>
          <li>Delivery minimum: {formatPrice(MIN_DELIVERY_ORDER)}. Free delivery from {formatPrice(FREE_DELIVERY_FROM)}.</li>
          <li>Collection: {PICKUP_POINT}. No minimum, no fee.</li>
          <li>Up to {MAX_PER_ITEM} of each dish per order, and never more than today&rsquo;s remaining portions.</li>
          <li>Nut allergy setting blocks dishes that contain nuts.</li>
        </ul>
        <table className="zones">
          <caption>Delivery zones and fees</caption>
          <thead>
            <tr><th scope="col">Zone</th><th scope="col">Delivery fee</th></tr>
          </thead>
          <tbody>
            {DELIVERY_ZONES.map((zone) => (
              <tr key={zone.id}><th scope="row">{zone.name}</th><td>{formatPrice(zone.fee)}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
