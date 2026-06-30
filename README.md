# Ohr Hanachal — storefront

Static marketing + storefront mockup for **ohrhanachal.com**, a Breslev seforim
publisher selling direct (formerly via breslevshop.com).

## Pages
| File | Page |
|------|------|
| `index.html` | Home |
| `about.html` | Our House / about |
| `collection.html` | Catalog (filters, search results) |
| `product.html` | Product detail |
| `wholesale.html` | Bulk / trade |
| `checkout.html` | Checkout |
| `confirmation.html` | Order confirmation |
| `wireframe.html` | Low-fi structural reference |

`styles.css` — shared styles · `cart.js` — persistent cart + drawer (localStorage)

## Run locally
Any static server, e.g. `npx serve` or `python -m http.server`.

## Deploy (Coolify)
Static site served by nginx via the included `Dockerfile`.
- Build pack: **Dockerfile**
- Base directory: repository root (this folder)
- Port: **80**

`nginx.conf` provides clean URLs (`/product` → `product.html`), gzip, and asset caching.
