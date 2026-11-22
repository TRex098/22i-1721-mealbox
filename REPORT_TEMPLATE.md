# Report template (copy into Word / Google Docs and export to PDF)

Keep it short: tables, screenshots, bullets. Items marked **YOU** need your own evidence.

## 1. Student and project details
Name, roll number, section, business name **Margalla Meal Co.**, repository link, deployment link, final commit hash. (**YOU**)

## 2. Business profile
| Element | Detail |
|---|---|
| Business | Margalla Meal Co.: meal boxes and weekly bundles |
| Audience | University students in Islamabad |
| Operating area | Collection at H-11; delivery to H-11, H-12, G-11, G-13 |
| Main customer task | Choose meals, build a cart, order for collection or delivery |
| Business goal | Completed simulated orders |
| Offering | 13 dishes: meals, weekly bundles, sides, drinks (`src/data/items.js`) |

## 3. Operating rules
| Rule | Exact condition | Where users are told | Application response | Boundary case |
|---|---|---|---|---|
| Availability (numeric) | 1 to min(6, today's stock) of one dish | Beside the quantity control, on cards and cart ("Limit 6") | "+" disabled at limit; adding past it shows a message; stale carts are flagged and block checkout | 6 accepted, 7 refused ("at most 6"); 5 when 4 left is refused |
| Eligibility | Dish with `containsNuts` cannot be ordered when nut allergy is on | Card, details page and cart text | Add disabled; cart item marked with Remove button | Setting off: allowed; setting on after adding: flagged in cart |
| Pricing / fulfilment | Delivery subtotal at least Rs 800; free delivery from Rs 2,500 | Menu, details, cart summary | Checkout blocked with shortfall message | Rs 800 passes, Rs 799 blocked (Rs 1 short) |

## 4. Reference-site investigation (**YOU**)
For each of the three problems: URL, screenshot(s), task, what goes wrong, possible business consequence (labelled as a possible consequence, no invented statistics), how your site addresses it.
Candidate problems this app is built to address:
1. Search/filters reset and selections vanish after navigating (Decision 1).
2. Delivery minimum and fees appear only at checkout (Decision 2).
3. Vague form errors, valid input cleared (Decision 3).
Confirm each on a real site first. If a candidate does not occur on any real site you can find, tell me and I will change the feature.

## 5. Frontend decisions
Paste the three entries from `DECISIONS.md` (alternative, tradeoff, code location).

## 6. Implemented application
Annotated screenshots at 1280 px and 390 px of: home, menu with filters, details, cart with an issue, checkout with errors, confirmation. (**YOU**)

## 7. Verification
- Edge-case checklist: use the table in `README.md`, add observed result and a screenshot for each. (**YOU**)
- For each improvement: actions, expected, observed.
- Automated test: run `npm test`, paste the output (6 tests passing).

## 8. Limitations
Anything incomplete or untested.
