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

## Current Version: `apiaryhq-v5.5.6`

Changes in this version:
- Varroa monitoring section added to Quick Entry and Guided inspection forms
- Alcohol wash Yes/No pill, mites counted, sample size (100/300), live % calculation
- mite_count, sample_size, mite_pct columns added to inspections table
- FAB overlap fixed — padding-bottom added to all sub-tab list containers
- hives.js syntax errors fixed

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
    ├── finance.js          # Financial income/expense tracking
    ├── reminders.js        # Reminders and tasks modal
    ├── docs.js             # Documents + brand asset management
    ├── assets.js           # Brand assets (logos, graphics)
    ├── contacts.js         # Supplier/vet/inspector contacts
    ├── notes.js            # My Notes tab (cross-device sync)
    ├── offline.js          # IndexedDB offline queue + auto-sync
    ├── weather.js          # Weather widget
    ├── pollen.js           # Pollen & foraging forecast
    ├── zones.js            # USDA hardiness zone data
    ├── pdf_export.js       # PDF + CSV export
    ├── icons.js            # SVG icon library
    └── frames.js           # Frame logging
```

---

## Deployment

### Current Service Worker Version: `apiaryhq-v5.5.6`

### Rules — follow every time

1. Edit files locally in GitHub Desktop
2. **Always bump `CACHE_VERSION` in `sw.js`** before pushing
3. Push via GitHub Desktop
4. Cloudflare Pages auto-deploys from `main` within ~60 seconds

---

## Supabase Tables

| Table | Purpose |
|-------|---------|
| `hives` | Hive records |
| `inspections` | Inspection logs — now includes mite_count, sample_size, mite_pct |
| `treatments` | Treatment + IPM logs |
| `harvests` | Harvest records |
| `feedings` | Feeding + supplement logs |
| `transactions` | Financial income/expense records |
| `reminders` | Reminders and tasks |
| `docs` | Uploaded documents |
| `assets` | Brand assets |
| `photos` | Inspection and hive photos |
| `contacts` | Suppliers, vets, inspectors |
| `user_notes` | My Notes tab |

### Row Level Security
All tables use RLS with `auth.uid() = user_id` policies.

---

## Supabase Keep-Alive

A Cloudflare Worker (`supabase-keep-alive`) pings the Supabase project every 5 days to prevent free-tier pauses.
