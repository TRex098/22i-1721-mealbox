import { Link, useLocation } from 'react-router-dom';
import { formatPrice } from '../utils/format.js';

// Mobile only (hidden by CSS from 768px): keeps the next step in thumb reach.
export default function StickyCartBar({ cartCount, subtotal }) {
  const { pathname } = useLocation();
  const visible = cartCount > 0 && (pathname === '/menu' || pathname.startsWith('/items/'));
  if (!visible) return null;

  return (
    <div className="sticky-bar">
      <span>
        {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart{subtotal > 0 ? `, ${formatPrice(subtotal)}` : ''}
      </span>
      <Link className="btn btn-primary" to="/cart">View cart</Link>
    </div>
  );
}
