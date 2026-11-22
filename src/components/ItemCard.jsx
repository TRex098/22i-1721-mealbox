import { Link } from 'react-router-dom';
import ItemImage from './ItemImage.jsx';
import StockBadge from './StockBadge.jsx';
import { formatPrice } from '../utils/format.js';

export default function ItemCard({ item, nutBlocked, inCart, onAdd }) {
  const soldOut = item.stock <= 0;
  const canAdd = !soldOut && !nutBlocked;

  return (
    <li className={soldOut ? 'card card-unavailable' : 'card'}>
      <ItemImage item={item} />
      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/items/${item.id}`}>{item.name}</Link>
        </h3>
        <p className="price">{formatPrice(item.price)}</p>
        <p className="meta">
          {item.category}, ready in {item.prepMinutes} min, {item.vegetarian ? 'vegetarian' : 'contains meat'}
        </p>
        <StockBadge stock={item.stock} />
        {item.containsNuts && <p className="warn-text">Contains nuts</p>}
        {nutBlocked && <p className="warn-text">Unavailable with your nut allergy setting</p>}
        {inCart > 0 && <p className="selected-text">In your cart: {inCart}</p>}
        <button type="button" className="btn btn-secondary" disabled={!canAdd} onClick={() => onAdd(item)}>
          {soldOut ? 'Sold out' : 'Add 1 to cart'}
        </button>
      </div>
    </li>
  );
}
