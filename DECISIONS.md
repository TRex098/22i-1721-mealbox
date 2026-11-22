# Frontend decisions

Business: **Margalla Meal Co.** (fictional meal boxes for university students in Islamabad).

> Fill in the **Problem** and **Evidence** fields yourself. The reference-site problems below are
> *candidates*: open a real restaurant / food-ordering site, confirm the behaviour happens there,
> and record the URL, screenshots and steps. Do not submit a problem you did not observe.

---

## Decision 1: Filters live in the URL, and hidden selections are announced (interaction / state)

| Field | Content |
|---|---|
| **Problem** | *(candidate)* On a reference site, search and filters reset after opening a dish and pressing Back, and items already added to the cart disappear from view when a filter hides them. URL: `ADD URL`. Screenshot: `ADD`. |
| **Decision** | Search, category, sort and toggles are stored in the URL query string (`/menu?q=biryani&veg=1`). A notice lists cart items hidden by the current filters and offers "Show all dishes". |
| **Alternative** | Keep filters in React state in `App` (lost on refresh) or in `localStorage` (shared across tabs, but not linkable). |
| **Reason** | Customers compare dishes across pages. URL state makes Back/Forward, refresh and shared links work, and the notice stops people forgetting what is already in the cart. |
| **Tradeoff** | More code than plain state (`useSearchParams`), and the URL can get long. Typing uses `replace` so it does not flood history. |
| **Code location** | `src/pages/MenuPage.jsx`: `useSearchParams` (line 12), `setParam` (line 24), `hiddenSelected` (line 46) and its notice (line 103). Filtering logic: `src/utils/browse.js` `filterAndSort`. |
| **Evidence** | *(add)* Steps: 1. Search "chicken". 2. Open a dish. 3. Press Back: search is still applied. 4. Add a vegetarian-incompatible item, tick "Vegetarian only": notice appears. Screenshots: `ADD`. |

---

## Decision 2: Costs and conditions appear before the cart (information hierarchy and mobile layout)

| Field | Content |
|---|---|
| **Problem** | *(candidate)* On a reference site the delivery minimum and fee only appear at checkout, after the customer has built an order. URL: `ADD URL`. Screenshot: `ADD`. |
| **Decision** | The menu page, every details page and the home page state the delivery minimum, fee range and free-delivery threshold. The cart summary shows live progress ("Add Rs X more"). On phones a sticky bar keeps the cart total and the "View cart" button in thumb reach. |
| **Alternative** | Show the fee only inside the cart or checkout, as many sites do, with a single generic note in the footer. |
| **Reason** | Customers decide what to order based on total cost. Seeing a minimum of Rs 800 early avoids abandoned carts and support questions. |
| **Tradeoff** | The same text appears on several pages, which adds visual noise. The values come from one constants file (`orderRules.js`), so they cannot disagree. |
| **Code location** | `src/pages/MenuPage.jsx` (callout, line 52), `src/pages/ItemPage.jsx` (line 59), `src/components/SummaryCard.jsx`, `src/components/StickyCartBar.jsx`, `.sticky-bar` in `src/styles/global.css` (line 197). Rule values: `src/rules/orderRules.js`. |
| **Evidence** | *(add)* Steps: open `/menu` at 390 px width, add a dish: sticky bar appears; switch to Delivery in the cart: shortfall message appears. Screenshots: `ADD`. |

---

## Decision 3: Specific, inline form errors that never clear valid input (form usability)

| Field | Content |
|---|---|
| **Problem** | *(candidate)* On a reference site checkout form, errors are vague ("Invalid input") or appear only at the top, and correcting one field clears the others. URL: `ADD URL`. Screenshot: `ADD`. |
| **Decision** | Controlled form with one `values` object. Each field has its own specific message, linked with `aria-describedby`. After a failed submit an error summary lists every problem; each item focuses its field. Valid fields keep their value. |
| **Alternative** | Validate only on submit and show one generic banner, or use native browser validation bubbles. |
| **Reason** | Customers fix errors faster when the message says exactly what is wrong and where, and they do not retype good data. |
| **Tradeoff** | Validation rules, touched-state and an error summary add code and need accessible wiring. |
| **Code location** | `src/rules/validation.js` (`validateCheckout`), `src/pages/CheckoutPage.jsx` (`errors` line 23, `errorFor` line 26, `handleChange` line 28, error summary line 76), `src/components/FormField.jsx`. |
| **Evidence** | *(add)* Steps: enter a valid name, type phone "123", submit: summary lists the phone problem, name is still filled, focus moves to phone. Screenshots: `ADD`. |
