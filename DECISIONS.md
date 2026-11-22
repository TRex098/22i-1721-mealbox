# Frontend decisions

Business: **Margalla Meal Co.** (fictional meal boxes for university students in Islamabad).

---

## Decision 1: Filters live in the URL, and hidden selections are announced (interaction / state)

| Field | Content |
|---|---|
| **Problem** | On foodpanda.pk, search and filters reset after opening a restaurant and pressing Back. Any search term typed in the search bar disappears completely on returning to the listing page, and filters such as cuisine type also reset. Items already added to the cart disappear from view when a filter hides them, with no warning shown. URL: `https://www.foodpanda.pk/restaurants`. Screenshot: [could not be captured due to internet outage at time of submission — behaviour based on prior observation]. |
| **Decision** | Search, category, sort and toggles are stored in the URL query string (`/menu?q=biryani&veg=1`). A notice lists cart items hidden by the current filters and offers "Show all dishes". |
| **Alternative** | Keep filters in React state in `App` (lost on refresh) or in `localStorage` (shared across tabs, but not linkable). |
| **Reason** | Customers compare dishes across pages. URL state makes Back/Forward, refresh and shared links work, and the notice stops people forgetting what is already in the cart. |
| **Tradeoff** | More code than plain state (`useSearchParams`), and the URL can get long. Typing uses `replace` so it does not flood history. |
| **Code location** | `src/pages/MenuPage.jsx`: `useSearchParams` (line 12), `setParam` (line 24), `hiddenSelected` (line 46) and its notice (line 103). Filtering logic: `src/utils/browse.js` `filterAndSort`. |
| **Evidence** | Steps on this app: 1. Go to `/menu`, search "chicken". 2. Open a dish. 3. Press Back: search is still applied and results are filtered. 4. Add a vegetarian-incompatible item, tick "Vegetarian only": a notice appears listing the hidden cart item with a "Show all dishes" button. Screenshot: [add screenshot of notice appearing]. |

---

## Decision 2: Costs and conditions appear before the cart (information hierarchy and mobile layout)

| Field | Content |
|---|---|
| **Problem** | On dominos.com.pk, no delivery fee or minimum order amount is shown on the menu page or item pages. The fee only appears at the final checkout step, after the customer has already spent time building their order. URL: `https://www.dominos.com.pk/en/menu`. Screenshot: [could not be captured due to internet outage at time of submission — behaviour based on prior observation]. |
| **Decision** | The menu page, every details page and the home page state the delivery minimum, fee range and free-delivery threshold. The cart summary shows live progress ("Add Rs X more"). On phones a sticky bar keeps the cart total and the "View cart" button in thumb reach. |
| **Alternative** | Show the fee only inside the cart or checkout, as many sites do, with a single generic note in the footer. |
| **Reason** | Customers decide what to order based on total cost. Seeing a minimum of Rs 800 early avoids abandoned carts and support questions. |
| **Tradeoff** | The same text appears on several pages, which adds visual noise. The values come from one constants file (`orderRules.js`), so they cannot disagree. |
| **Code location** | `src/pages/MenuPage.jsx` (callout, line 52), `src/pages/ItemPage.jsx` (line 59), `src/components/SummaryCard.jsx`, `src/components/StickyCartBar.jsx`, `.sticky-bar` in `src/styles/global.css` (line 197). Rule values: `src/rules/orderRules.js`. |
| **Evidence** | Steps on this app: 1. Open `/menu` at 390 px width, add a dish: sticky bar appears at the bottom showing cart total and "View cart" button. 2. Switch to Delivery in the cart: shortfall message appears immediately showing how much more is needed. 3. On the home page and every item page the delivery minimum and fee range are visible before any cart interaction. Screenshot: [add screenshot of sticky bar and callout on menu page]. |

---

## Decision 3: Specific, inline form errors that never clear valid input (form usability)

| Field | Content |
|---|---|
| **Problem** | On dominos.com.pk checkout, the error message shown for an invalid phone number is generic ("Please enter a valid number") with no format guidance. On some fields, submitting with one invalid field clears the values in other fields, forcing the customer to retype correct information. URL: `https://www.dominos.com.pk/en/checkout`. Screenshot: [could not be captured due to internet outage at time of submission — behaviour based on prior observation]. |
| **Decision** | Controlled form with one `values` object. Each field has its own specific message, linked with `aria-describedby`. After a failed submit an error summary lists every problem; each item focuses its field. Valid fields always keep their value. |
| **Alternative** | Validate only on submit and show one generic banner, or use native browser validation bubbles. |
| **Reason** | Customers fix errors faster when the message says exactly what is wrong and where, and they do not retype good data. |
| **Tradeoff** | Validation rules, touched-state and an error summary add code and need accessible wiring. |
| **Code location** | `src/rules/validation.js` (`validateCheckout`), `src/pages/CheckoutPage.jsx` (`errors` line 23, `errorFor` line 26, `handleChange` line 28, error summary line 76), `src/components/FormField.jsx`. |
| **Evidence** | Steps on this app: 1. Go to `/checkout`. 2. Enter a valid name "Muhammad Abdullah". 3. Type phone "123". 4. Click submit: the error summary appears listing only the phone problem, the name field still shows "Muhammad Abdullah", and focus moves automatically to the phone field. The specific message reads "Use a Pakistani mobile number like 0300 1234567 or +92 300 1234567". Screenshot: [add screenshot of error summary with name field still filled]. |
