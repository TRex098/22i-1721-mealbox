// Illustration tile. Emoji on a tinted block is the built-in fallback, so a
// missing image can never break the layout.
export default function ItemImage({ item, size = 'card' }) {
  return (
    <div
      className={`tile tile-${size}`}
      style={{ backgroundColor: item.tint }}
      role="img"
      aria-label={`Illustration of ${item.name}`}
    >
      <span aria-hidden="true">{item.emoji}</span>
    </div>
  );
}
