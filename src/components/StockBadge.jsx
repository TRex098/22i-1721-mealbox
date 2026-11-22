// Availability is always shown as text as well as colour.
export default function StockBadge({ stock }) {
  if (stock <= 0) return <span className="badge badge-out">Sold out today</span>;
  if (stock <= 5) return <span className="badge badge-low">Only {stock} left</span>;
  return <span className="badge badge-ok">In stock ({stock} left)</span>;
}
