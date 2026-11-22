import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="state-box">
      <h1>Page not found</h1>
      <p>This address does not exist on our site. Try the menu or go back home.</p>
      <Link className="btn btn-primary" to="/menu">Browse the menu</Link>
      <Link className="btn btn-quiet" to="/">Home</Link>
    </section>
  );
}
