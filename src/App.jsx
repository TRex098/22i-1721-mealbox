import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import DemoControls from './components/DemoControls.jsx';
import StickyCartBar from './components/StickyCartBar.jsx';
import { DELIVERY_ZONES } from './data/zones.js';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ItemPage from './pages/ItemPage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { calculateTotals, describeCart, hasNutConflict, validateQuantity } from './rules/orderRules.js';
import { loadMenu, submitOrder } from './services/mockApi.js';
import { readJson, writeJson } from './storage.js';

const CART_KEY = 'mmc.cart.v1';
const PREFS_KEY = 'mmc.prefs.v1';
const ORDER_KEY = 'mmc.lastOrder.v1';
const DEFAULT_DEMO = { failLoad: false, changeAvailability: false, emptyMenu: false };

// Saved data is untrusted: check its shape before using it.
function readSavedCart() {
  const saved = readJson(CART_KEY, []);
  if (!Array.isArray(saved)) return [];
  return saved.filter((entry) => entry && typeof entry.id === 'string' && Number.isInteger(entry.quantity) && entry.quantity > 0);
}

function readSavedPrefs() {
  const saved = readJson(PREFS_KEY, {}) ?? {};
  return {
    fulfilment: saved.fulfilment === 'delivery' ? 'delivery' : 'collection',
    zoneId: typeof saved.zoneId === 'string' ? saved.zoneId : '',
    nutAllergy: saved.nutAllergy === true,
  };
}

export default function App() {
  // ---- Shared state: one source of truth for every page ----
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [demo, setDemo] = useState(DEFAULT_DEMO);
  const [cart, setCart] = useState(readSavedCart); // [{ id, quantity }]
  const [prefs, setPrefs] = useState(readSavedPrefs);
  const [lastOrder, setLastOrder] = useState(() => readJson(ORDER_KEY, null));

  // ---- Effect: load the menu from the async mock service ----
  useEffect(() => {
    let cancelled = false; // cleanup flag: ignore results from a stale request
    loadMenu({ shouldFail: demo.failLoad, changedAvailability: demo.changeAvailability, emptyMenu: demo.emptyMenu })
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setErrorMessage('');
        setStatus('ready');
      })
      .catch((error) => {
        if (cancelled) return;
        setErrorMessage(error.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [attempt, demo]);

  // ---- Effects: persist cart and preferences ----
  useEffect(() => {
    writeJson(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    writeJson(PREFS_KEY, prefs);
  }, [prefs]);

  // ---- Derived values (calculated, never stored) ----
  const { lines, issues } = status === 'ready' ? describeCart(cart, items, prefs.nutAllergy) : { lines: [], issues: [] };
  const zone = DELIVERY_ZONES.find((candidate) => candidate.id === prefs.zoneId) ?? null;
  const totals = calculateTotals(lines, prefs.fulfilment, zone);
  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  // ---- Callbacks passed down to pages ----
  function retryLoad() {
    setStatus('loading');
    setAttempt((current) => current + 1);
  }

  function changeDemo(patch) {
    setDemo((previous) => ({ ...previous, ...patch }));
    setStatus('loading');
  }

  function changePrefs(patch) {
    setPrefs((previous) => ({ ...previous, ...patch }));
  }

  // Returns { ok, message } so the calling page can show feedback.
  function addToCart(item, quantity) {
    if (hasNutConflict(item, prefs.nutAllergy)) {
      return { ok: false, message: `${item.name} contains nuts. Turn off the nut allergy setting to add it.` };
    }
    const already = cart.find((entry) => entry.id === item.id)?.quantity ?? 0;
    const check = validateQuantity(already + quantity, item.stock);
    if (!check.valid) {
      const extra = already > 0 ? ` You already have ${already} in your cart.` : '';
      return { ok: false, message: `${check.message}${extra}` };
    }
    setCart((previous) => {
      const existing = previous.find((entry) => entry.id === item.id);
      if (existing) {
        return previous.map((entry) => (entry.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry));
      }
      return [...previous, { id: item.id, quantity }];
    });
    return { ok: true, message: `Added ${quantity} × ${item.name} to your cart.` };
  }

  function setQuantity(id, quantity) {
    setCart((previous) => previous.map((entry) => (entry.id === id ? { ...entry, quantity } : entry)));
  }

  function removeFromCart(id) {
    setCart((previous) => previous.filter((entry) => entry.id !== id));
  }

  async function placeOrder(slot) {
    // Only ids and the total are "submitted". Name, phone and address stay in the form.
    const result = await submitOrder({ itemIds: lines.map((line) => line.item.id), total: totals.total });
    const order = {
      orderId: result.orderId,
      fulfilment: prefs.fulfilment,
      zoneName: zone?.name ?? '',
      slot,
      lines: lines.map(({ item, quantity }) => ({ name: item.name, quantity, lineTotal: item.price * quantity })),
      totals,
    };
    setLastOrder(order);
    writeJson(ORDER_KEY, order);
    setCart([]);
    return order;
  }

  const sharedData = { items, status, errorMessage, onRetry: retryLoad, lines, prefs };

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>

      <header className="site-header">
        <div className="wrap header-inner">
          <Link to="/" className="brand">Margalla Meal Co.</Link>
          <nav aria-label="Main">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/menu">Menu</NavLink>
            <NavLink to="/cart">
              Cart <span className="count">{cartCount}<span className="sr-only"> items in cart</span></span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main" className="wrap">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage {...sharedData} onPrefsChange={changePrefs} onAdd={addToCart} />} />
          <Route path="/items/:id" element={<ItemPage {...sharedData} onAdd={addToCart} />} />
          <Route
            path="/cart"
            element={
              <CartPage {...sharedData} cart={cart} issues={issues} zone={zone} totals={totals}
                onPrefsChange={changePrefs} onSetQuantity={setQuantity} onRemove={removeFromCart} />
            }
          />
          <Route
            path="/checkout"
            element={<CheckoutPage {...sharedData} issues={issues} zone={zone} totals={totals} onPlaceOrder={placeOrder} />}
          />
          <Route path="/confirmation" element={<ConfirmationPage lastOrder={lastOrder} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <StickyCartBar cartCount={cartCount} subtotal={totals.subtotal} />

      <footer className="site-footer">
        <div className="wrap">
          <p>Margalla Meal Co. is a fictional business made for a university assignment. Orders are simulated.</p>
          <DemoControls demo={demo} onChange={changeDemo} />
        </div>
      </footer>
    </>
  );
}
