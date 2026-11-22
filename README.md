# Margalla Meal Co. (CS4032 Assignment 02)

**Name:** Muhammad Abdullah  **Roll No:** 22i-1721  **Section:** A

**GitHub:** `https://github.com/TRex098/22i-1721-mealbox`  **Deployment:** `https://22i-1721-mealbox.netlify.app`  **Final commit:** `f768b70`

## Description
A React website for a fictional meal-box business serving university students in Islamabad
(collection in H-11, delivery to H-11, H-12, G-11 and G-13). Customers browse 13 dishes, search and
filter, open a details page, build a cart, enter their details and receive a simulated confirmation.
All data is local; all orders are **simulated** (no payment, no real submission).

## Commands
```
npm install        # install dependencies
npm run dev        # development server
npm run build      # production build (output in dist/, not committed)
npm test           # runs: node --test   (business-rule tests)
```
`package.json` already includes `"test": "node --test"` and `"type": "module"`.

## Routes
| Route | Purpose |
|---|---|
| `/` | Home: how it works, costs, delivery zones |
| `/menu` | Search, filter, sort, add to cart (filters are in the URL) |
| `/items/:id` | Dish details; invalid ids show a helpful message |
| `/cart` | Quantities, fulfilment, nut allergy setting, summary |
| `/checkout` | Controlled form with validation |
| `/confirmation` | Simulated order result |
| `*` | Not found page |

## Operating rules
1. **Availability (numeric):** 1 to 6 of one dish, never more than today's stock. Shown beside the quantity control. 6 is accepted, 7 is refused.
2. **Eligibility:** dishes containing nuts cannot be ordered while "I have a nut allergy" is on. Shown on cards, details and cart.
3. **Pricing / fulfilment:** delivery needs a subtotal of at least Rs 800 (Rs 800 passes, Rs 799 does not); delivery is free from Rs 2,500; collection has no minimum.

## Reproducing edge cases (footer: "Demo controls")
| Case | How |
|---|---|
| Loading failure and retry | Tick "Simulate menu loading failure", watch the error, untick it, press Try again |
| Changed availability | Add Chicken Biryani Box (qty 3) and Daal Chawal Bowl (qty 5), then tick "Simulate changed availability". The cart marks both items and blocks checkout until fixed |
| Empty dataset | Tick "Simulate an empty menu" |
| No search matches | On `/menu` search for `zzz` |
| Invalid URL / dish | Visit `/items/does-not-exist` and `/nothing` |
| Restored invalid selection | Add a nut dish, turn nut allergy on after reloading; or edit `mmc.cart.v1` in DevTools to an unknown id |
| Invalid form input | Submit with a bad phone, check other fields keep their values |

## Simulated operations and limitations
- Orders, stock and the menu service are simulated in `src/services/mockApi.js`.
- Name, phone and address are not stored or sent; only item ids and the total are "submitted".
- Illustrations are emoji tiles (no image files). *(Update this if you add images.)*
- *(Add any known bugs here.)*

## Concept map
| Concept | File | Component / function |
|---|---|---|
| Components, props, callback props | `src/App.jsx`, `src/pages/*` | `App` passes `onAdd`, `onSetQuantity`, `onRemove` |
| State, functional updates | `src/App.jsx` | `addToCart`, `setQuantity`, `removeFromCart` |
| Immutable objects / arrays | `src/App.jsx`, `src/pages/CheckoutPage.jsx` | `setCart(prev => ...)`, `setValues(prev => ({...prev}))` |
| Shared state | `src/App.jsx` | `cart`, `prefs`, `items` lifted to `App` |
| Derived values | `src/App.jsx`, `src/rules/orderRules.js` | `describeCart`, `calculateTotals` |
| Effects, dependencies, cleanup | `src/App.jsx` | menu loading effect (`cancelled` flag), persistence effects |
| Async code and errors | `src/services/mockApi.js`, `src/App.jsx` | `loadMenu` (Promise), `placeOrder` (async/await) |
| Local storage | `src/storage.js`, `src/App.jsx` | `readJson`, `writeJson`, `readSavedCart` |
| Routing and URL params | `src/App.jsx`, `src/pages/ItemPage.jsx`, `src/pages/MenuPage.jsx` | `Routes`, `useParams`, `useSearchParams` |
| Lists and keys | `src/pages/MenuPage.jsx` | `results.map` with `key={item.id}` |
| Conditional rendering | `src/components/DataGate.jsx`, `src/pages/MenuPage.jsx` | loading, error, empty, no-match |
| Controlled form and validation | `src/pages/CheckoutPage.jsx`, `src/rules/validation.js` | `validateCheckout` |
| Business rules and test | `src/rules/orderRules.js`, `src/rules/orderRules.test.js` | `validateQuantity` |
