# Apiary HQ — Project Notes & Changelog
**Current SW Version: apiaryhq-v5.0.1**

## Project Overview
Apiary HQ is a PWA (Progressive Web App) beekeeping management tool hosted on Cloudflare Pages with a Supabase backend. Built for both desktop (Mac) and mobile (iPhone) use.

- **URL:** Cloudflare Pages deployment
- **Supabase Project:** https://czejecgdyxklfulndhpp.supabase.co
- **GitHub:** bootstrapbees / apiaryhq (private)
- **Copyright:** © 2026 Bootstrap Beekeeping. All rights reserved.

---

## File Structure
```
/ (root)
├── index.html          # App shell, CSS, HTML structure
├── styles.css          # Global styles
├── manifest.json       # PWA manifest (name: "ApiaryHQ")
├── sw.js               # Service Worker — bump CACHE_VERSION on every deploy
├── ApiaryHQ.jpg        # App logo
└── js/
    ├── offline.js      # IndexedDB offline queue + auto-sync
    ├── core.js         # Supabase init, auth, data loading
    ├── ui.js           # Tab switching, modals, photo picker
    ├── hives.js        # Hive + inspection modals
    ├── guided_inspection.js  # Step-by-step inspection flow
    ├── inspections.js  # Smart reminders from inspections
    ├── render.js       # All list/card rendering + reference library
    ├── notes.js        # My Notes (Supabase-backed, cross-device)
    ├── harvest.js      # Harvest logging
    ├── reminders.js    # Reminders & tasks
    ├── finance.js      # Income/expense tracking
    ├── docs.js         # Documents & brand assets
    ├── contacts.js     # Supplier/vet/inspector contacts
    ├── hive_history.js # Hive history overlay
    ├── treatments.js   # Treatment + feeding reference data (Dadant/AUBEE)
    ├── weather.js      # Tomorrow.io weather integration
    ├── pollen.js       # Pollen & foraging forecast widget
    ├── icons.js        # SVG icon library
    ├── pdf_export.js   # PDF report generation
    └── hive_history.js # Per-hive history timeline
```

---

## Deployment Rules

### ⚠️ ALWAYS bump sw.js CACHE_VERSION on every deployment
```javascript
var CACHE_VERSION = 'apiaryhq-v3.3';  // increment each deploy: v3.4, v3.5...
```
Version plan: v3.1 → v3.9, then v4.0 → v4.9, etc.

### Deployment checklist
1. Upload changed files to Cloudflare Pages (drag & drop)
2. Edit `sw.js` — bump CACHE_VERSION
3. Upload `sw.js`
4. Hard refresh browser after deploy (Cmd+Shift+R on Mac)
5. On iPhone — clear Safari cache or delete/re-add PWA if needed

### sw.js goes at ROOT — not in /js/ folder
The service worker must be at `/sw.js`, not `/js/sw.js`.

---

## Supabase Tables

| Table | Purpose |
|-------|---------|
| hives | Hive records |
| inspections | Inspection logs |
| treatments | Treatment logs |
| harvests | Harvest records |
| feedings | Feeding / supplemental feed logs |
| transactions | Financial records |
| reminders | Reminders & tasks |
| docs | Documents |
| assets | Brand assets |
| photos | Inspection/hive photos |
| contacts | Suppliers, vets, inspectors |
| user_notes | My Notes (cross-device) |

### user_notes table (manually created)
```sql
CREATE TABLE user_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text DEFAULT 'Misc',
  source text,
  body text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notes"
ON user_notes FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### feedings table (manually created)
```sql
CREATE TABLE feedings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  hive_id uuid NOT NULL,
  date date NOT NULL,
  feed_type text NOT NULL DEFAULT 'Sugar syrup 1:1',
  amount numeric,
  unit text,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE feedings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own feedings"
ON feedings FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

## Changelog

### Session — March 25–26, 2026 (v3.1 → v3.3)

**Bug Fixes**
- Fixed weather showing "undefined" in regular and guided inspection — `WX.icon` → `WX.wxSvg`
- Fixed Notes not syncing cross-device — rewrote `notes.js` to use Supabase `user_notes` table
- Fixed Library "Jump to Category" — added `jumpToLibSection()` and section IDs to `render.js`
- Fixed camera/photo picker rendering behind modal — dynamically injected at `document.body` level; removed `backdrop-filter` stacking contexts from all overlays
- Fixed nav icons floating on mobile scroll — flex layout on body; `.page.active` is its own scroll container
- Fixed FAB (+ button) hidden on dashboard only, visible on all other tabs
- Fixed offline badge and sync toast not showing — HTML elements were missing from `index.html`
- Fixed offline writes failing silently — replaced `navigator.onLine` trust with try/catch + 5s timeout on all Supabase calls
- Fixed PDF header color — changed from dark brown `(74,44,10)` to forest green `(26,58,42)`

**New Features**
- **Offline-first** (`offline.js`) — IndexedDB queue for inspections, harvests, reminders, transactions; auto-syncs on reconnect; pending badge + toast notifications
- **Inspection photo capture** — Add Photo button in regular inspection (`hives.js`) and guided inspection Step 5 (`guided_inspection.js`); photos saved to Supabase on submit
- **Service Worker** (`sw.js`) — caches all app files + CDN scripts for true offline app loading
- **Varroa Status widget** on dashboard — shows each hive's latest Varroa reading color coded green/yellow/red per AUBEE levels with date
- **Quick Actions widget** on dashboard — New Inspection and Log Harvest buttons (only shows when hives exist)

---

## Planned Features (Future Sessions)
- **Hands-free guided inspection** — Web Speech API (text-to-speech + voice recognition); works offline
- **AI apiary summary** — Claude API analyzes inspection history for seasonal health summary (requires Anthropic API credits)
- Offline queue end-to-end field testing

---

## Tech Notes

### Weather object structure
```javascript
window._wx = {
  temp, feels, wind, humidity,
  desc,       // text description
  wxSvg,      // SVG icon string — use wxSvg NOT .icon
  score, col, adv
}
```

### Offline-safe DB wrappers (offline.js)
Use these for tables that should support offline writes:
- `dbInsertSafe(table, obj)`
- `dbUpdateSafe(table, id, obj)`
- `dbDeleteSafe(table, id)`

### Photo system
- `PHOTOS` object keyed by `context_id`
- `buildGallery(tid)` renders photo grid for a given context
- `showPhotoSourcePicker(tid, 'photo')` opens camera/library picker
- Photos saved to `photos` table on record save

### Service Worker cache bypass
Supabase API calls (`*.supabase.co`) and Tomorrow.io always go to network.
CDN scripts (Supabase JS, jsPDF) are cached on SW install.

### FAB (+ button)
Hidden on dashboard tab, visible on all other tabs. Controlled in `ui.js` `showTab()` function.
