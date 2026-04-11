# Apiary HQ

**A Progressive Web App for beekeeping management**
Built by Bootstrap Beekeeping · © 2026 Bootstrap Beekeeping. All rights reserved.

---

## Overview

Apiary HQ is a full-featured beekeeping management PWA designed for real-world use in the field. It runs on iPhone, Mac, and any modern browser — and works offline. Data is synced to Supabase when connectivity returns. The app is built with vanilla JavaScript, no frameworks, and deployed to Cloudflare Pages.

- **Stack:** Vanilla JS PWA · Supabase (Postgres + Storage) · Cloudflare Pages
- **Deployment:** Auto-deploy from `main` branch via Cloudflare Pages
- **Supabase:** `https://czejecgdyxklfulndhpp.supabase.co`
- **Reference sources:** AUBEE 5-phase Varroa protocol · HBHC 8th Edition · Dadant & Sons catalog
- **Disclaimer:** This app references publicly available information from Dadant & Sons and AUBEE. It is not affiliated with or endorsed by either organization.

---

## File Structure

```
apiaryhq/
├── index.html              # App shell — HTML structure + script tags
├── styles.css              # Global stylesheet
├── manifest.json           # PWA manifest (name: "ApiaryHQ", no space)
├── sw.js                   # Service Worker — bump CACHE_VERSION every deploy
├── ApiaryHQ.jpg            # App icon / logo
└── js/
    ├── core.js             # Supabase init, auth, data loading, preferences
    ├── ui.js               # Tab/nav system, modals, photo picker
    ├── render.js           # All list + card rendering, reference library
    ├── hives.js            # Hive add/edit modal, split + requeen flows
    ├── inspections.js      # Inspection modal, smart auto-reminders
    ├── guided_inspection.js# Step-by-step hands-free inspection flow
    ├── hive_history.js     # Hive history overlay sheet
    ├── treatments.js       # Treatment modal + full AUBEE/HBHC reference data
    ├── feeding.js          # Feeding log modal (+ Log Another flow)
    ├── harvest.js          # Harvest logging modal
    ├── finance.js          # Income/expense tracking
    ├── reminders.js        # Reminders + tasks modal
    ├── docs.js             # Documents + brand asset management
    ├── contacts.js         # Supplier/vet/inspector contacts
    ├── notes.js            # My Notes (Supabase-backed, cross-device)
    ├── offline.js          # IndexedDB offline queue + auto-sync
    ├── weather.js          # Weather widget — Open-Meteo + wttr.in fallback
    ├── pollen.js           # Pollen & foraging forecast — zone-based seasonal
    ├── zones.js            # USDA hardiness zone data (used by pollen.js)
    ├── pdf_export.js       # PDF + CSV export for all record types
    ├── icons.js            # SVG icon library
    └── [future] guided_inspection.js — Web Speech API hands-free mode
```

---

## Deployment

### Current Service Worker Version: `apiaryhq-v5.4.0`

### Rules — follow every time

1. Edit files locally in GitHub Desktop
2. **Always bump `CACHE_VERSION` in `sw.js`** before pushing — without this, users get stale cached files
3. Push via GitHub Desktop (never via GitHub API for files over ~50KB)
4. Cloudflare Pages auto-deploys from `main` within ~60 seconds
5. Hard refresh after deploy: `Cmd+Shift+R` on Mac
6. On iPhone: clear Safari cache or delete + re-add PWA if changes don't appear

### Large file rule
Files over ~50KB (currently `render.js`, `treatments.js`, `index.html`) must be pushed via **GitHub Desktop only** — the GitHub API truncates large files causing white screen errors.

### sw.js location
Must be at `/sw.js` in the repo root — not inside `/js/`. The browser only registers service workers from the root scope.

---

## Supabase Tables

| Table | Purpose |
|-------|---------|
| `hives` | Hive records |
| `inspections` | Inspection logs with photos |
| `treatments` | Treatment + IPM logs |
| `harvests` | Harvest records |
| `feedings` | Feeding + supplement logs |
| `transactions` | Financial income/expense records |
| `reminders` | Reminders and tasks |
| `docs` | Uploaded documents (licenses, certs, etc.) |
| `assets` | Brand assets (logos, graphics) |
| `photos` | Inspection and hive photos |
| `contacts` | Suppliers, vets, inspectors |
| `user_notes` | My Notes tab (cross-device sync) |

### Row Level Security
All tables use RLS with `auth.uid() = user_id` policies. Every table enforces user data isolation — users can only read and write their own records.

### Offline-safe DB wrappers (`offline.js`)
Use these instead of raw Supabase calls for any write operations that should queue offline:
```javascript
dbInsertSafe(table, obj)
dbUpdateSafe(table, id, obj)
dbDeleteSafe(table, id)
```
These try Supabase first, fall back to IndexedDB queue, and auto-sync on reconnect.

---

## Weather & Pollen

### Weather — `weather.js`
- **Primary:** Open-Meteo (`api.open-meteo.com`) — free, no API key
- **Fallback:** wttr.in — free, no API key
- **Final fallback:** localStorage cache of last successful reading with "as of X ago" label
- Cache TTL: 30 minutes. Always fetches fresh on dashboard load if cache is stale.
- ZIP geocoded via Nominatim (free, no key). Coordinates saved to localStorage.

### Pollen — `pollen.js` + `zones.js`
- **No external API** — pure zone-based seasonal estimates derived from latitude
- Zone groups: A (3–4, northern US) · B (5–6, mid US) · C (7–8, southeast) · D (9–10, deep south/SW)
- Monthly pollen levels and forage plant tips per zone stored in `zones.js`
- `getZoneData(lat)` in `zones.js` returns 5-day forecast + foraging tip for the user's zone

### ZIP entry
- User enters ZIP once in the weather widget or Settings → Location
- `geocodeZip()` in `weather.js` calls Nominatim, saves lat/lng/location name to localStorage
- Both weather and pollen use the same saved coordinates automatically

---

## Reference Library

The reference library in the Library tab is sourced from:
- **AUBEE** — Alabama Certified Beekeeper training curriculum (Varroa thresholds, IPM)
- **HBHC 8th Edition** — Hive and the Honeybee
- **Dadant & Sons** — Product catalog and application guidelines

### Library sections (in order)
1. Pests & Diseases — SVG illustrations, descriptions, symptoms, recommended treatments
2. Varroa Mite Treatments — full AUBEE protocol with thresholds, warnings, temperatures
3. Non-Chemical Controls — drone comb removal, splits, requeening
4. Feeding Guide — seasonal Alabama feeding calendar
5. Feeding Supplements — HBH, AP23, Nozevit, Optima, etc.
6. Syrup Mixing Guide — Dadant ratios for 1:1, 2:1, candy board, fondant

---

## Key Technical Patterns

### Navigation
- Bottom nav: `Inspect | Home (raised center) | Hives | Finance | More`
- More tray contains: Inspect, Hives, Finance, Reminders, Docs, Contacts, Notes, Settings
- `_moreTabs` array in `ui.js` controls which tabs appear in More tray

### Photo Picker
- Single `<input type="file" accept="image/*">` — no custom camera sheet
- Device presents native picker (iPhone: Take Photo / Photo Library / Files)
- `showPhotoSourcePicker(tid, target)` in `ui.js` triggers the correct input directly

### PDF Export
- Uses jsPDF from CDN (cached by service worker)
- Star ratings rendered as `n/5` plain text (not emoji — causes strikethrough in jsPDF)
- Available for: Inspections, Treatments, Harvests, Feedings, Finance

### Reminders
- Each reminder card has inline **Edit / ✓ Done / Del** buttons
- Completing a supply or treatment reminder prompts to add cost to Finance
- Auto-reminders created from inspection saves (queen cage check, feed checks, mite baseline)

---

## Roadmap

### Up Next
- Onboarding slide deck (5 swipeable slides, localStorage, auto-suppress)
- Hands-free guided inspection via Web Speech API
- ZIP zone tailoring Phase 2 — feeding calendar, treatment windows, forage plants matched to zone

### Medium Term
- Dashboard AI hive summary (rule-based, offline) + pro-tier AI narrative via Anthropic API
- Multi-apiary support — header switcher, `apiaries` table, `apiary_id` on hives
- Receipt photo capture in Finance — Supabase Storage `receipts` bucket, optional OCR
- Stripe monetization — free/pro/lifetime tiers

---

## Supabase Keep-Alive

A Cloudflare Worker (`supabase-keep-alive`) pings the Supabase project every 5 days to prevent free-tier pauses:
- **Cron:** `0 12 */5 * *`
- **Target:** `https://czejecgdyxklfulndhpp.supabase.co`
