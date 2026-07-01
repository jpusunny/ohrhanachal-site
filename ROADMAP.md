# Ohr Hanachal — Product Roadmap

From static mockup → full direct-to-consumer commerce app with **two sales channels
(web + phone/IVR)**, publisher-operated, self-hosted on the existing Coolify server.

---

## 1. Vision
Sell Ohr Hanachal seforim direct — online **and by phone** — with a storefront customers love
and a back office the press can actually run: manage the catalog, take orders (web or IVR),
pick, pack, and ship. **Full self-service** on both channels. No reseller, no per-order platform fees.

---

## 2. Isolation principle (non-negotiable)
The server is shared with other tenants (SET-CRM, DEN-CRM, the DEN Supabase/MinIO stack).
**Everything for this project lives inside its own Coolify project "Ohr Hanachal":** its own
Postgres, Redis, and **its own MinIO bucket/instance** — we do **not** reuse the DEN Supabase-MinIO
or any other tenant's resources. Dedicated network, dedicated volumes, dedicated backups.

---

## 3. Where we are (done ✅)
- **Brand & design system** — espresso-leather + antique-gold, crown motif, lashon-kodesh titles, English UI.
- **Storefront mockup** — 8 pages, client-side cart, real catalog data.
- **Deployed** — nginx static site on Coolify from GitHub `jpusunny/ohrhanachal-site` (HTTP live).
- **Catalog data** — ~14 titles in Regular / Pocket / Pocket-Leather / Set, with prices, SKUs, stock, images.

> Catalog + cart are static/front-end only today. Everything below gives it a real, multi-channel backend.

---

## 4. Target architecture (decided: headless + API-first)
One commerce brain, two channels calling the same API.

```
   Web customers ─►┌────────────────────────────┐
                   │ Storefront (Next.js)       │  re-skin of current design
                   └──────────────┬─────────────┘
                                  │  Store API
   Phone callers ─►┌─────────────────────────────┐
   (Twilio Voice)  │ IVR service (Node + Twilio) │──┐  same API, different channel
                   └─────────────────────────────┘  │
                                  │                  │
                   ┌──────────────▼──────────────────▼─┐
   Press staff ───►│  Commerce engine — Medusa v2       │ products·orders·inventory·fulfillment
   (Admin UI)      │  + custom: picklist, wholesale,    │
                   │  IVR builder, Sola settings        │
                   └───┬──────────┬──────────┬──────────┘
              ┌────────▼─┐   ┌─────▼───┐  ┌───▼───────────┐
              │ Postgres │   │  Redis  │  │ MinIO (images │   ALL dedicated to this project
              └──────────┘   └─────────┘  │  + IVR audio) │
                   │                       └──────────────┘
            ┌──────▼───────────────┐     ┌──────────────────┐
            │ Sola → Cardknox API  │     │ Manual shipping: │  picklists + packing slips;
            │ (public API)         │     │ carrier + track# │  labels via carrier sites for now
            └──────────────────────┘     └──────────────────┘
```

**Stack:** Medusa v2 (Node/TS) · Postgres · Redis · MinIO (own bucket) · Next.js storefront ·
**Twilio** Programmable Voice for the IVR · **Sola payments via the Cardknox API** (public API;
web card capture via Cardknox **iFields** tokenization so raw PAN never touches our server) ·
manual shipping (automate later). All as Coolify apps inside the isolated **Ohr Hanachal** project.

---

## 5. Core data model (sketch)
- **product** (title EN + he, author, series, description, status, **voice_code** = short numeric id for phone)
- **variant** (format: Regular / Pocket / Pocket-Leather / Set · SKU · barcode · weight · dims)
- **image** (per product/variant · ordered · alt) → MinIO
- **price** (per variant · sale · **wholesale tiers / price-lists**)
- **inventory** (on-hand · reserved · reorder point)
- **customer** / **wholesale_account** (mosad, terms, tier)
- **cart** → **order** (channel: web | phone) → **order_item**
- **fulfillment** (picklist, packed_at, packer) · **shipment** (carrier, tracking, cost)
- **integration_setting** (encrypted **Sola/Cardknox keys**, per env; shipping + notification config)
- **ivr_flow** / **ivr_node** (menu tree: prompt text or audio, `keypress → next node`, action type) ·
  **business_hours** · **phone_number** (Twilio number, voice webhook, fallback/forward)

---

## 6. Phased roadmap

### Phase 0 — Foundations & isolation
Create the isolated **Ohr Hanachal** Coolify project. Stand up dedicated Postgres + Redis + MinIO + Medusa.
Secrets, env, automated backups, dedicated network.
**Deliverable:** running (empty) commerce engine + admin login, fully isolated from other tenants.

### Phase 1 — Catalog backend & admin CRUD  *(products / images / price / etc.)*
Import the Shopify export → products, variants, prices, inventory, images (to MinIO).
Admin CRUD for everything; publish/unpublish; low-stock + sold-out rules (mirrors current catalog).
**Deliverable:** the press manages the full catalog from a browser; DB is the source of truth.

### Phase 2 — Storefront on live data
Re-skin the current design as a Next.js storefront on the Store API — dynamic collection
(filters/search/sort), product page (edition switching), from-price grouping.
**Deliverable:** the public site renders the real, editable catalog.

### Phase 3 — Payments, settings & web checkout
- **Admin → Settings → Integrations page to configure the Sola/Cardknox API keys** (xKey etc.),
  stored **encrypted at rest**, with sandbox/live toggle and a "test connection" button.
- Server-side cart + checkout; **Cardknox iFields** for PCI-safe card entry; charge via the Cardknox API;
  confirmation email; shipping-fee + tax rules (free over $75).
**Deliverable:** self-configurable payments + a customer can complete a real, paid web purchase.

### Phase 4 — Order intake & management  *(receiving orders)*
Orders list + detail in admin; lifecycle (paid → picking → packed → shipped → delivered);
new-order + status notifications. **Deliverable:** every order (web or phone) in one place.

### Phase 5 — Fulfillment & picklists  *(produce picklist)*
**Picklist** per order and **batch** (combine the day's orders by SKU/bin); branded **packing slips**;
scan/check-off; partial fulfillment. **Deliverable:** staff print, pick, and pack against a list.

### Phase 6 — Shipping (manual)  *(process shipping)*
Enter carrier + tracking number per order → mark shipped → tracking email to customer; record cost.
Structured so we can drop in EasyPost/Shippo label-buying later without rework.
**Deliverable:** packed → tracked → customer notified.

### Phase 7 — Phone ordering (IVR) — full self-service  *(buy-by-phone)*
See **§10** for the full IVR design. Three parts:
- **7a — Flow engine + connect a number.** Twilio number → app webhook → app returns TwiML from the stored flow.
- **7b — IVR builder (admin).** Visual menu/flow manager: prompts (typed TTS or uploaded audio), `keypress → node`,
  business hours, fallback/forward, order-status lookup, test-call. *(This is the "IVR buildout/management.")*
- **7c — Self-service ordering by phone.** Caller enters a sefer's `voice_code` → hears title/price → qty →
  add more / checkout → identify (phone lookup or capture) → **pay** → order lands in the same system.
- **Payment over the phone:** PCI-sensitive — **OPEN, pending your confirmation** (see §8.2).
**Deliverable:** a caller can self-serve an order end-to-end; staff manage the whole IVR from the admin.

### Phase 8 — Wholesale portal
Tiered price-lists for mosdos (ties to the Wholesale page), quote → order, net-30 accounts.

### Phase 9 — Operations & launch
Staff auth/roles, automated Postgres + MinIO backups, analytics, SEO/sitemap,
**real domain + HTTPS** (Let's Encrypt; needs NSG port 80 open to `Any`), monitoring/error tracking.
**Deliverable:** production-ready on `ohrhanachal.com`.

---

## 7. Your requests → where they live
| Request | Phase |
|---|---|
| CRUD products / images / price / etc. | **Phase 1** |
| Configure **Sola/Cardknox API keys** (admin backend page) | **Phase 3** |
| Web payments (Sola → Cardknox) | **Phase 3** |
| Receiving orders | **Phase 4** |
| Produce picklist | **Phase 5** |
| Process shipping (manual) | **Phase 6** |
| Buy-by-phone IVR + **IVR management/builder** | **Phase 7** |

---

## 8. Open decisions / to confirm
1. **Sola / Cardknox** — resolved as the processor (public Cardknox API). Need: **sandbox + live API keys (xKey)**,
   which we'll store via the admin Settings page (Phase 3). Web capture via Cardknox iFields.
2. **Phone payments (IVR + Sola)** — **OPEN, you'll confirm.** Cardknox isn't a native Twilio `<Pay>` connector,
   so phone card capture likely means: Twilio `<Pay>` custom/agent flow → Cardknox charge, or Cardknox's own
   phone/IVR payment path, or agent-assisted capture. Decide before building Phase 7c payment.
3. **IVR scope** — resolved: **full self-service** keypad menus (agent transfer / voicemail as fallback + after-hours).
4. **Domain & HTTPS timing** — when to point `ohrhanachal.com` at the box and open port 80 to `Any`.

---

## 9. Immediate next steps
1. Get **Sola/Cardknox sandbox keys** so Phase 3 (settings page + web pay) can be built and tested.
2. Confirm the **IVR phone number** plan (new Twilio number vs. port/forward an existing number — see §10).
3. Phase 0: create the isolated **Ohr Hanachal** Coolify project with dedicated Postgres + Redis + MinIO + Medusa.
4. Phase 1: import the catalog and get CRUD working — first tangible backend win.

---

## 10. IVR design — connecting a number & handling the flow

**Telephony provider:** **Twilio Programmable Voice** (custom flows via webhooks; pay-as-you-go).
Alternatives: Telnyx / Plivo / Vonage (same model) — Twilio has the best docs/tooling.

**Connecting a phone number (3 options):**
- **New number:** buy a local/toll-free number in Twilio (~$1–2/mo + per-minute).
- **Keep your current number:** *forward* it (from your existing carrier) to the Twilio number — fastest, zero porting.
- **Port** your existing number into Twilio (a few days; then Twilio is the home carrier).
Then set the number's **Voice “A CALL COMES IN” webhook** → `POST https://api.ohrhanachal.com/ivr/voice`.

**How the app handles the flow (webhook state machine):**
1. Call arrives → Twilio POSTs to `/ivr/voice`. App loads the active **ivr_flow** from the DB and returns **TwiML**.
2. A **menu node** returns `<Gather input="dtmf">` with a `<Say>` (Amazon Polly TTS) **or** `<Play>` (branded/Hebrew
   audio from MinIO). Twilio collects the keypress and POSTs it back to `/ivr/handle`.
3. App maps `keypress → next node` and returns the next TwiML. Node types:
   - **message** (say/play info: hours, address, shipping)
   - **order_status** (gather order # or phone → look up in DB → speak status + tracking)
   - **order** (self-service: enter `voice_code` → confirm sefer/price → qty → add more / checkout)
   - **pay** (Sola/Cardknox — §8.2, open)
   - **transfer** (`<Dial>` staff/forward, gated by **business_hours**)
   - **voicemail** (`<Record>` → store in MinIO + email/Slack the press)
   - **repeat / back / hangup**
4. **After-hours / no-answer:** business-hours node routes to voicemail or an informational message.

**IVR management (admin — the part you want built):** a visual **flow builder**:
- CRUD nodes and their `keypress → node` mappings; reorder; enable/disable.
- Per-node prompt: **type text (TTS)** or **upload audio** (stored in MinIO) — good for the greeting & Hebrew names.
- Set **business hours**, **fallback/forward number**, **greeting**, and the mapping of **products → voice_code**.
- **Test-call** + versioning, so staff can change the menu without a developer.

**Open items for IVR:** phone-payment path (§8.2, you'll confirm); whether self-service ordering captures new
shipping addresses by voice or is limited to **reorder / known customers** (address-by-voice is error-prone —
recommendation: start with order-status + reorder + info + agent transfer, add new-address ordering after).
