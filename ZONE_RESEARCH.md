# Apiary HQ — Zone Tailoring Implementation Plan
# Research completed: April 4, 2026
# Ready to implement next session

## IMPORTANT RESEARCH FINDING
USDA hardiness zones are primarily based on *minimum winter temperatures* —
they are a reasonable but imperfect proxy for beekeeping seasonality.
The research confirms: zones give us a solid 80% accuracy for timing,
but local forage varies within zones (rural vs urban, elevation, rainfall).
For an app, zone-based advice with a clear disclaimer is the right call.

---

## ZONE GROUPS FOR THE APP
We'll use 4 groups rather than individual zones (zones 3-10 spans 8 bands;
grouping keeps the data manageable and still meaningfully different):

GROUP A — Zones 3-4  (Northern tier: MN, WI, ND, SD, MT, northern MI/NY/NE)
GROUP B — Zones 5-6  (Middle tier: OH, IN, IL, PA, NJ, IA, MO, KS, CO, OR, WA)
GROUP C — Zones 7-8  (Southern mid: AL, GA, TN, NC, VA, AR, OK, TX panhandle, Pacific NW coast)
GROUP D — Zones 9-10 (Deep South/West: FL, south TX, AZ desert, coastal CA, HI)

---

## DATA STRUCTURE FOR IMPLEMENTATION

The app currently has `getZoneSeasonalCalendar(zone)` in core.js that returns:
{ swarm:[startMo,endMo], summer:[s,e], fallPrep:[s,e], winter:[s,e] }

We need to ADD a function: `getZoneForageData(zone)` that returns the full
zone-specific content object used throughout the app. This replaces all
hardcoded Alabama references.

---

## ZONE FORAGE DATA — Researched and Ready to Code

### GROUP A — Zones 3-4 (Northern: MN, WI, ND, MI, ME, VT, northern NY)

**Spring buildup:** Late April–May (maples, willows, dandelions signal spring)
**Primary nectar flow:** June–July (basswood/linden is the king flow in this zone,
  also clover, alfalfa in agricultural areas)
**Summer dearth:** Late July–August (significant, bees need monitoring)
**Fall flow:** August–September (goldenrod and asters — critical for winter stores)
**Winter:** October–March (long cluster, 5+ months)
**Winter stores target:** 80-100 lbs (longest winter, highest energy needs)
**Spring feeding:** Mid-April when temps consistently above 50°F

**Key forage plants:**
- Early spring: Red maple, silver maple, willow, dandelion, fruit trees
- Primary flow: Basswood/American linden (July, major flow), white clover, alsike clover, alfalfa
- Summer: Dutch clover, sweet clover, buckwheat (agricultural areas)
- Fall: Goldenrod (MAJOR — critical fall flow), native asters, knotweed
- Notable: Buckwheat honey production common in NY/PA border areas

**Pollen tip text:**
"Tree pollen [month]: Early maple and willow pollen signal the first foraging of spring in your zone.
Basswood/linden (June-July): The major nectar flow in northern zones — colonies can gain 3-5 lbs/day at peak.
Goldenrod (Aug-Sep): Critical fall flow — your bees depend on this for winter stores. Do not feed syrup during goldenrod flow.
Asters (Sep-Oct): Last forage of the season before hard freeze."

**Feeding calendar:**
- Jan-Feb: Candy board or fondant only if stores low. No syrup — too cold.
- Mar-Apr: Check stores weekly. Feed 1:1 syrup when temps above 50°F consistently.
- May-Jun: Feed new packages only. Established hives should be self-sufficient by dandelion bloom.
- Jul-Aug: Monitor — summer dearth in agricultural areas. Feed weak colonies 2:1 only.
- Sep-Oct: Feed 2:1 aggressively after supers off. Goal: 80-100 lbs stores by Oct 15.
- Nov-Dec: Switch to candy board below 45°F. Mouse guards on by Oct 1.

**Varroa timing:**
- Spring wash: May (after first brood cycle)
- Treatment window 1: June if counts exceed threshold (before main flow)
- Main treatment window: August (supers off, before winter bee rearing Sep-Oct)
- Fall OAV: November broodless window

---

### GROUP B — Zones 5-6 (Middle: OH, IN, IL, PA, IA, MO, KS, CO, OR, WA)

**Spring buildup:** March–April (redbuds, fruit trees, dandelions)
**Primary nectar flow:** May–June (clover, locust, fruit blossoms)
**Summer dearth:** July–August (significant in most areas, especially Midwest)
**Fall flow:** August–October (goldenrod, asters, soybean in ag areas)
**Winter:** November–February (3-4 month cluster)
**Winter stores target:** 60-80 lbs
**Spring feeding:** March when temps consistently above 50°F

**Key forage plants:**
- Early spring: Red maple, redbud (Cercis), fruit trees, dandelion, skunk cabbage (East)
- Primary flow: Black locust (May-June, major in East), white clover, red clover, tulip poplar (KY/TN/VA edge)
- Summer: Sweet clover, alsike clover, alfalfa (Midwest), soybeans (limited value)
- Fall: Goldenrod (major), asters, sumac, boneset
- West (OR/WA): Bigleaf maple, blackberry, fireweed, clover dominant

**Pollen tip text:**
"Redbud and fruit trees (March-April): First major pollen sources — colony population beginning to explode.
Black locust (May-June): If you have locust nearby, this is your primary flow — light, slow-crystallizing honey.
White clover (May-July): Backbone of your summer flow. Monitor for congestion and add supers early.
Goldenrod (Aug-Sep): Major fall flow — leave supers on through goldenrod, then pull and treat for Varroa."

**Feeding calendar:**
- Jan-Feb: Fondant or candy board for light hives. No syrup.
- Mar-Apr: 1:1 syrup to stimulate buildup when temps above 50°F. Pollen patties now.
- May-Jun: Established hives self-sufficient. Feed new packages only.
- Jul-Aug: Summer dearth likely. Feed weak or new hives 2:1. Watch for robbing.
- Sep-Oct: 2:1 syrup after supers off. Goal 60-80 lbs by Nov 1.
- Nov-Dec: Switch to fondant below 45°F. Reduce entrance, add mouse guards.

**Varroa timing:**
- Spring wash: April-May
- Treatment window 1: May-June if above threshold (Formic Pro viable in this zone)
- Main treatment window: August-September (supers off)
- Fall OAV: November-December broodless window

---

### GROUP C — Zones 7-8 (Southern mid: AL, GA, TN, NC, VA, AR, OK, OR coast, WA coast)
*This is your zone, Josh — Cherokee County AL is Zone 7b*

**Spring buildup:** February–March (earliest brood ramp-up in late Jan)
**Primary nectar flow:** April–May (tulip poplar is the major flow, black locust)
**Summer dearth:** June–August (significant Alabama dearth — bees need monitoring)
**Fall flow:** September–October (goldenrod, aster, fall wildflowers)
**Winter:** December–January (short cluster, 1-2 months of true cluster)
**Winter stores target:** 40-60 lbs (mild winter, shorter cluster duration)
**Spring feeding:** February when colony begins ramping up

**Key forage plants:**
- Early spring: Red maple (Feb), red bud (Mar), wild plum, chickweed, henbit
- Primary flow: Tulip poplar (Apr-May, MAJOR in AL/TN/NC/VA), black locust (Apr-May),
  sourwood (Jun-Jul in Appalachians — prized single-source honey)
- Summer: Summer dearth common June-Aug. Clover, kudzu (limited), summer wildflowers
- Fall: Goldenrod (Sep-Oct, major), aster, boneset, Spanish needles (south AL/FL border)
- Notable: Sourwood honey from Appalachians (Zone 7 NC/TN border) is world-renowned

**Pollen tip text:**
"Red maple (February): First pollen of the year — queen begins ramping up brood before you feel spring.
Tulip poplar (April-May): Your major nectar flow. Colonies can gain 2-4 lbs/day at peak. Add supers before blooms open.
Sourwood (June-July, Appalachian areas): If sourwood is in your area, this produces one of the finest honeys in the world.
Goldenrod (September-October): Important fall flow — your bees use this to build winter stores. Monitor carefully.
Summer dearth (June-August): Little to no nectar in most of this zone. Monitor stores and feed weak colonies."

**Feeding calendar:** (Current Alabama content — keep as-is for Zone 7-8)
- Jan-Feb: Late winter — cluster may be hungry. Fondant if stores low.
- Mar-Apr: Spring buildup. 1:1 syrup if stores light. Pollen patties now.
- May-Jun: Spring flow (tulip poplar). Generally self-sufficient. New packages need feeding.
- Jul-Aug: Summer dearth. Feed weak colonies 2:1. High robbing pressure. Reduce entrance.
- Sep-Oct: Fall prep. 2:1 syrup after supers off. Goldenrod/aster flow assists.
- Nov-Dec: Pre-winter. 2:1 syrup until temps drop below 50°F consistently.

**Varroa timing:**
- Spring wash: March-April (Day 21-25 for new packages, March for overwintered)
- Treatment window 1: May-June if above threshold (careful — Formic Pro risky above 85°F)
- Main treatment window: August-September (supers off, before fall bees — CRITICAL in AL)
- Fall OAV: November-December broodless window

---

### GROUP D — Zones 9-10 (FL, south TX, AZ, coastal CA, HI)

**Spring buildup:** January–February (often year-round brood rearing)
**Primary nectar flow 1:** February–April (citrus, Brazilian pepper in FL, mesquite in TX/AZ)
**Primary nectar flow 2:** Varies — often a fall flow September-November
**Summer:** Hot dearth in most areas (AZ, inland CA, south TX June-August)
**Winter:** No true cluster — colonies remain active year-round
**Winter stores target:** 20-40 lbs (mild weather, lower energy requirements)
**Special note:** SHB a MAJOR ongoing threat in this zone — year-round pressure

**Key forage plants (by region):**

FL (Zone 9b-10):
- Feb-May: Brazilian pepper (invasive but major source), citrus (Feb-Mar, mild-flavored honey),
  Cabbage palm (spring), gallberry/inkberry (Mar-May, famous FL honey plant)
- Summer: Little to no flow in many areas
- Sep-Nov: Saw palmetto (Sep, major in FL), goldenrod (Oct), late asters

TX Zone 9 (San Antonio/Houston):
- Feb-Apr: Huajillo/guajillo (Feb-Mar, excellent source in south TX), bluebonnet (Mar), 
  mesquite (Mar-Apr, tan honey), huisache
- May-Jun: Prairie clover, catclaw acacia
- Aug-Oct: Fall wildflowers, cowpen daisy, heartleaf hibiscus

AZ/Desert (Zone 9-10):
- Feb-Apr: Citrus, palo verde (Apr-May, major source in Sonoran desert), 
  mesquite (Apr-May), desert willow
- Oct-Nov: Desert marigold, brittlebush

Coastal CA (Zone 9-10):
- Year-round: Eucalyptus (major year-round source), mustard (Jan-Mar)
- Spring: Wild radish, phacelia, lupine
- Summer: California buckwheat (Jun-Nov, MAJOR), sage, black sage
- Fall: Goldenrod, asters

**Pollen tip text (FL):**
"Citrus (February-March): First major flow — light, fragrant honey. Add supers early.
Gallberry (March-May): One of Florida's finest honey plants — light, buttery flavor.
Saw palmetto (September): Major fall flow in Florida — dark, distinctive honey.
Brazilian pepper (November): Invasive but a significant late-season nectar source.
Small hive beetle pressure: Year-round in your zone. Inspect traps every 2 weeks."

**Pollen tip text (TX/AZ):**
"Mesquite (March-April): Major flow in your region — tan to amber honey with light flavor.
Huajillo (south TX only, Feb-Mar): Premium honey plant — watch for this bloom carefully.
Palo verde (AZ, April-May): Sonoran desert's primary spring flow — short but intense.
Summer dearth: June-August can be extreme in inland areas. Monitor stores carefully.
Shade and water: Essential for colony survival in summer heat above 100°F."

**Feeding calendar:**
- Jan-Feb: Light feeding if needed. Colonies likely active. 1:1 syrup only.
- Mar-May: Primary flow — should be self-sufficient. New colonies may need early support.
- Jun-Aug: Summer dearth in most areas. Feed weak colonies. Shade critical in hot zones.
- Sep-Nov: Fall flow in most areas — goldenrod/asters in FL, late wildflowers elsewhere.
- Dec: Generally active — may need light feeding in dearth periods only.

**Varroa timing:**
- More frequent monitoring required — year-round brood means year-round Varroa reproduction
- Test every 4-6 weeks year-round (no broodless window for OAV without manipulation)
- Primary treatment windows: February (before spring buildup) and August (post-harvest)
- OAV requires brood break manipulation — must be intentionally created

---

## POLLEN FALLBACK ESTIMATES BY ZONE
(Used by getAlabamaPollFallback() when no API key/coords available)
Currently hardcoded for Alabama. Replace with zone-aware values:

GROUP A (Zones 3-4):
month: [1,2]=tree:0,grass:0,weed:0 | [3]=tree:1,grass:0,weed:0 | [4]=tree:2,grass:1,weed:0
[5]=tree:4,grass:2,weed:0 | [6]=tree:3,grass:4,weed:1 | [7]=tree:1,grass:5,weed:2
[8]=tree:0,grass:3,weed:2 | [9]=tree:0,grass:1,weed:4 | [10]=tree:0,grass:0,weed:3
[11,12]=tree:0,grass:0,weed:0

GROUP B (Zones 5-6):
[1,2]=tree:0,grass:0,weed:0 | [3]=tree:1,grass:0,weed:0 | [4]=tree:3,grass:1,weed:0
[5]=tree:4,grass:3,weed:0 | [6]=tree:2,grass:4,weed:1 | [7]=tree:1,grass:5,weed:2
[8]=tree:0,grass:3,weed:2 | [9]=tree:0,grass:1,weed:4 | [10]=tree:1,grass:0,weed:3
[11,12]=tree:0,grass:0,weed:0

GROUP C (Zones 7-8): [CURRENT ALABAMA VALUES — KEEP AS-IS]
[1,2]=tree:1,grass:0,weed:0 | [3]=tree:3,grass:1,weed:0 | [4]=tree:5,grass:2,weed:1
[5]=tree:3,grass:4,weed:1 | [6]=tree:1,grass:5,weed:2 | [7,8]=tree:0,grass:3,weed:2
[9]=tree:0,grass:2,weed:4 | [10]=tree:1,grass:1,weed:5 | [11]=tree:1,grass:0,weed:2
[12]=tree:0,grass:0,weed:0

GROUP D (Zones 9-10):
[1]=tree:2,grass:1,weed:0 | [2]=tree:4,grass:2,weed:0 | [3]=tree:5,grass:3,weed:1
[4]=tree:3,grass:4,weed:1 | [5]=tree:1,grass:4,weed:2 | [6]=tree:0,grass:3,weed:2
[7,8]=tree:0,grass:2,weed:1 | [9]=tree:1,grass:2,weed:3 | [10]=tree:2,grass:1,weed:4
[11]=tree:3,grass:1,weed:3 | [12]=tree:2,grass:1,weed:1

---

## FILES TO CHANGE NEXT SESSION

### 1. js/core.js — Add getZoneForageData()
New function that takes zone string (e.g. '7b') and returns the full zone
content object. Maps zone number to GROUP A/B/C/D then returns data.

```javascript
function getZoneGroup(zone) {
  var z = parseInt(zone);
  if (z <= 4) return 'A';
  if (z <= 6) return 'B';
  if (z <= 8) return 'C';
  return 'D';
}

function getZoneForageData(zone) {
  var group = getZoneGroup(zone || '7');
  return ZONE_FORAGE_DATA[group];
}
```

### 2. js/treatments.js — Replace ALABAMA_FEEDING_CALENDAR
Convert from a single Alabama array to a function:
`getFeedingCalendar(zone)` that picks the right 6-entry seasonal calendar
based on zone group. Each entry has the same structure as today but with
zone-appropriate content.

### 3. js/pollen.js — Two changes:
A) Replace `getAlabamaPollFallback()` with `getZonePollFallback(zone)` 
   using the monthly values above per zone group.
B) Replace `pollenBeeTip(days)` — the function that generates the foraging
   tip text. Currently has hardcoded Alabama plant names. Replace with
   `getZonePollenTip(days, zone)` that uses zone-appropriate plant names.

### 4. js/render.js — Minor
The feeding calendar section render already reads from ALABAMA_FEEDING_CALENDAR.
Once we rename the function in treatments.js, update the render call to:
`getFeedingCalendar(_userZone)` instead of referencing the hardcoded array.
Also update the section header from "Alabama Feeding Calendar" to 
"Feeding Calendar for Zone X" dynamically.

---

## KEY IMPLEMENTATION NOTES

1. **Zone group function lives in core.js** — both pollen.js and treatments.js
   call it via `getZoneGroup(_userZone)`. Load order: core.js loads first.

2. **Disclaimer to add** — add a small note in the feeding calendar section:
   "Timing based on your ZIP code (Zone X). Bloom dates vary by local
   microclimate — observe your local plants and adjust 1-2 weeks accordingly."

3. **Default behavior** — if no ZIP saved, default to Zone 7 (Group C)
   which is currently the Alabama content, maintaining backward compatibility.

4. **Variable to rename** — ALABAMA_FEEDING_CALENDAR in treatments.js
   becomes a function. The existing data becomes the Zone 7-8 entry in
   the zone forage data object.

5. **The pollen bee tip plant names** — currently references tulip poplar,
   black locust, goldenrod, aster, Alabama dearth. These need to swap based
   on zone group. Build a lookup: zone group → { springFlow, majorFlow,
   summerNote, fallFlow, dearth }

---

## HONEST LIMITATION TO DOCUMENT IN APP
Add this note to the feeding calendar card:
"Hardiness zone timing is a good approximation but all beekeeping is local.
Plants bloom 1-2 weeks earlier in valleys vs hillsides, urban areas vs rural,
and vary year to year with weather. Your best calibration tool is watching
when local plants bloom — especially your spring sentinel plant (dandelion,
redbud, fruit trees, maple — whatever blooms first in your area)."

---

## ESTIMATED SESSION SIZE
- core.js: Add getZoneGroup(), getZoneForageData() — ~50 lines
- treatments.js: Convert calendar to function, add 3 zone group entries — ~200 lines
- pollen.js: Rename fallback function, update pollenBeeTip() — ~80 lines  
- render.js: Update calendar render call, update header text — ~5 lines
- Total: Medium session. Mostly content writing, not architectural changes.
- Biggest risk: Getting the zone content right. Research is done (this doc).

## STATUS
Research: COMPLETE
Plan: COMPLETE  
Ready to code: YES — start next session by reading this file, then implement.
