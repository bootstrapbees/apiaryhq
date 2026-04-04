// ═══════════════════════════════════════════════════════
// TREATMENT REFERENCE LIBRARY — AUBEE / HBHC 8th Edition
// ═══════════════════════════════════════════════════════
var VARROA_TREATMENTS = [
  // ── FORMIC ACID ──────────────────────────────────────
  {
    id:'formic-pro',
    name:'Formic Pro (MAQS)',
    activeIngredient:'Formic Acid',
    class:'organic',
    supersOn:true,
    broodlessOnly:false,
    tempMin:50, tempMax:85,
    chemicalClass:'formic-acid',
    icon:'🟢',
    tags:['organic','supers-ok'],
    tagLabels:['Organic','✅ Supers On OK'],
    summary:'Only treatment that penetrates capped brood and kills mites inside sealed cells. Safe with honey supers on.',
    whatItIs:'Formic acid gel pad strips placed near the edges of the brood box. The only EPA-registered Varroa treatment that kills mites inside sealed brood cells — a critical advantage when brood is present. Sourced from Dadant catalog and HBHC 8th Edition.',
    howToApply:[
      'Check temperature forecast — daytime temps must be 50–85°F for full treatment period',
      'Apply two strips near the EDGES of the brood box — do not place in the center',
      'Leave strips in place for the full 14-day treatment period',
      'Honey supers may remain on during treatment',
      'Monitor hive daily during first 3 days — above 92°F (33°C) risks brood and queen mortality; remove strips if sustained high temps forecast'
    ],
    duration:'14 days. Do not remove early.',
    temperature:'Daytime temps must be 50–85°F. Remove immediately if above 85°F — risk of queen loss and brood damage, especially critical in Alabama summer.',
    remove:'Remove after 14 days. Dispose of used strips properly.',
    ppe:'Gloves and eye protection recommended. Avoid inhaling formic acid vapors.',
    warnings:[
      '⚠️ Remove IMMEDIATELY if daytime temps exceed 85°F — critical in Alabama summer',
      '⚠️ Do not place strips in center of brood box — edges only per Dadant label',
      '⚠️ Queen loss possible in small or stressed colonies',
      '⚠️ Do not use more than 2 applications per year',
      '⚠️ Monitor closely during first 72 hours of treatment'
    ],
    followUp:'Alcohol wash 21 days after treatment completion to verify efficacy.',
    resistance:'No known resistance to formic acid.'
  },
  // ── HOP ACIDS ──────────────────────────────────────
  {
    id:'hopguard3',
    name:'HopGuard 3',
    activeIngredient:'Potassium Salts of Hop Beta Acids',
    class:'organic',
    supersOn:true,
    broodlessOnly:false,
    tempMin:0, tempMax:999,
    chemicalClass:'hop-acids',
    icon:'🟢',
    tags:['organic','supers-ok'],
    tagLabels:['Organic','✅ Supers On OK'],
    summary:'Natural hop extract strips. Safe any time of year including during honey flow. Most effective when brood is limited.',
    whatItIs:'Cardboard strips impregnated with potassium salts of hop beta acids. A natural organic option derived from hops. No known resistance. Labeled for use with honey supers on. Most effective as a supplemental or rotation treatment when brood is limited.',
    howToApply:[
      'Insert 1 strip per 5 frames of bees — minimum 2 strips per colony',
      'Hang strips vertically between frames in the brood area',
      'Ensure bees have contact with both sides of the strip',
      'Honey supers may remain on during treatment',
      'Replace with fresh strips after 2 weeks — do not remoisten depleted strips',
      'Apply consecutive treatments per label to increase efficacy'
    ],
    duration:'2 weeks per application. Max 4 treatments per year per HBHC. Strips only effective while moist (~5 days) — efficacy drops as they dry.',
    temperature:'Above 50°F (10°C). Can be used year-round when temps permit.',
    remove:'Remove after 2 weeks. Discard leftover liquid — do not remoisten strips.',
    ppe:'No special PPE required. Gloves recommended as good practice.',
    warnings:[
      '⚠️ Less effective than other treatments when heavy brood is present',
      '⚠️ Best used as supplemental or rotation treatment',
      '⚠️ Do not exceed label application rates'
    ],
    followUp:'Alcohol wash 21 days after final application to verify efficacy.',
    resistance:'No known resistance.'
  },
  // ── OXALIC ACID STRIPS ──────────────────────────────────────
  {
    id:'varroxsan',
    name:'VarroxSan (Oxalic Acid Strips)',
    activeIngredient:'Oxalic Acid (slow-release strip)',
    class:'organic',
    supersOn:false,
    broodlessOnly:false,
    tempMin:0, tempMax:999,
    chemicalClass:'oxalic-acid',
    icon:'🟡',
    tags:['organic','supers-off'],
    tagLabels:['Organic','❌ No Supers — Avoid Nectar Flow'],
    summary:'Slow-release oxalic acid strips. Fold in half and drape over frames. Best in summer and fall, avoiding intense nectar flow.',
    whatItIs:'Per Dadant catalog: Oxalic acid strips applied by folding in half and draping down the sides of frames. Slow release over 42–56 days catches mites emerging from brood cells over time. No temperature restrictions. Best applied in summer and fall, avoiding periods of intense nectar flow.',
    howToApply:[
      'Apply 1 strip per every 2.5 brood frames',
      'FOLD EACH STRIP IN HALF — this is the correct application method per Dadant label',
      'DRAPE the folded strip down the sides of the frame so both faces contact bees',
      'Do not lay strips flat — draping is required for correct application',
      'Avoid applying during intense nectar flow periods',
      'Wear gloves — avoid skin contact with strips'
    ],
    duration:'42–56 days. Do not remove early.',
    temperature:'No temperature restrictions. Works year-round.',
    remove:'Remove after 42–56 days.',
    ppe:'Chemical resistant gloves required. Wash hands after handling.',
    warnings:[
      '⚠️ FOLD IN HALF and DRAPE down sides of frame — do not lay flat',
      '⚠️ Avoid periods of intense nectar flow',
      '⚠️ Do not use more than 2 treatments per year',
      '⚠️ Follow label directions strictly for dosage by colony size'
    ],
    followUp:'Alcohol wash 21 days after removal to verify efficacy.',
    resistance:'No known resistance to oxalic acid to date.'
  },
  // ── OXALIC ACID VAPORIZATION ──────────────────────────────────────
  {
    id:'apibioxal-oav',
    name:'Api-Bioxal / EZ-OX (Oxalic Acid Vaporization)',
    activeIngredient:'Oxalic Acid Dihydrate',
    class:'organic',
    supersOn:false,
    broodlessOnly:false,
    tempMin:0, tempMax:999,
    chemicalClass:'oxalic-acid',
    icon:'🟣',
    tags:['organic','supers-off','broodless'],
    tagLabels:['Organic','❌ No Supers','★ Best Broodless'],
    summary:'Near 100% effective when colony is broodless. Most powerful treatment available when timed correctly.',
    whatItIs:'Per Dadant catalog: Oxalic acid applied via vaporizer (powder or tablet method) or solution drenching method. 1–2 minutes per hive. Maximum 3 treatments, once every 4–5 days. Best used during the broodless period in late fall or early spring when there is little to no brood in the hive. When truly broodless all mites are exposed on bees with no capped cells to hide in — this is when OA is near 100% effective.',
    howToApply:[
      '⛔ PUT ON ALL PPE BEFORE STARTING — see PPE section below',
      'Load approved dosage of oxalic acid crystals into vaporizer per manufacturer instructions',
      'Seal all hive entrances completely with foam or tape',
      'Insert vaporizer through entrance — do NOT open hive',
      'Activate vaporizer — treatment takes 1–2 minutes per hive per Dadant',
      'Leave hive sealed for 10 minutes after vaporization is complete',
      'Remove vaporizer and unseal entrance',
      'Do NOT open hive for at least 10 minutes after treatment',
      'If brood present: repeat every 4–5 days for maximum 3 treatments total'
    ],
    duration:'Per Dadant: 1 treatment (approx 1–2 min per hive). Max 3 times, once every 4–5 days. Single treatment when truly broodless is most effective.',
    temperature:'Any temperature. Alabama winter broodless window (Nov–Jan) is the ideal treatment time.',
    remove:'N/A — vapor dissipates naturally.',
    ppe:'⛔ FULL PPE IS NON-NEGOTIABLE:\n• Half-face respirator with organic vapor cartridges\n• Chemical resistant gloves (nitrile minimum)\n• Safety goggles or face shield\n• Long sleeves and long pants\n• Closed-toe shoes\n\nInhaling oxalic acid vapor causes serious and permanent lung damage. This is not optional.',
    warnings:[
      '⛔ NEVER vaporize without proper respiratory protection — permanent lung damage risk',
      '⚠️ Do not use with honey supers in place',
      '⚠️ Do not vaporize in enclosed spaces — work outdoors only',
      '⚠️ Keep children, pets, and bystanders away during treatment',
      '⚠️ Maximum 3 applications per colony — once every 4–5 days per Dadant'
    ],
    followUp:'Alcohol wash 21 days after final treatment. Expect near-zero counts when truly broodless.',
    resistance:'No known resistance to oxalic acid.'
  },
  // ── OXALIC ACID DRENCHING ──────────────────────────────────────
  {
    id:'oa-drench',
    name:'Oxalic Acid Drenching (Api-Bioxal Solution)',
    activeIngredient:'Oxalic Acid Dihydrate',
    class:'organic',
    supersOn:false,
    broodlessOnly:true,
    tempMin:0, tempMax:999,
    chemicalClass:'oxalic-acid',
    icon:'🟣',
    tags:['organic','supers-off','broodless'],
    tagLabels:['Organic','❌ No Supers','Broodless Only'],
    summary:'Per Dadant: 1 treatment, 1 minute per hive. Most effective early spring or late fall with little to no brood.',
    whatItIs:'Per Dadant catalog: Oxalic acid applied as a solution drench directly onto bees between frames. 1 treatment, approximately 1 minute per hive. Most effective in early spring or late fall when there is little to no brood in the hive. Read package for solution method instructions as dosing is critical.',
    howToApply:[
      '⛔ PUT ON ALL PPE BEFORE STARTING',
      'Prepare oxalic acid solution per package instructions — dosing is critical, read label carefully',
      'Remove any honey supers before treatment',
      'Open hive and locate all frames with bees',
      'Apply solution by drenching directly onto bees in each seam between frames',
      'Do not over-apply — follow label dosing exactly',
      'Treatment takes approximately 1 minute per hive',
      'Close hive after application'
    ],
    duration:'1 treatment. Do not repeat beyond label directions.',
    temperature:'Any temperature. Most effective early spring or late fall with little to no brood.',
    remove:'N/A — solution applied directly.',
    ppe:'⛔ FULL PPE REQUIRED:\n• Chemical resistant gloves\n• Eye protection / goggles\n• Long sleeves and closed-toe shoes\n• Avoid skin contact with solution',
    warnings:[
      '⚠️ Read package for correct solution concentration — dosing is critical',
      '⚠️ Do not use with honey supers',
      '⚠️ Most effective when colony is broodless — mites cannot hide in capped cells',
      '⚠️ Do not repeat beyond label instructions'
    ],
    followUp:'Alcohol wash 21 days after treatment.',
    resistance:'No known resistance to oxalic acid.'
  },
  // ── THYMOL ──────────────────────────────────────
  {
    id:'apiguard',
    name:'Apiguard (Thymol Gel)',
    activeIngredient:'Thymol',
    class:'organic',
    supersOn:false,
    broodlessOnly:false,
    tempMin:60, tempMax:105,
    chemicalClass:'thymol',
    icon:'🟡',
    tags:['organic','supers-off'],
    tagLabels:['Organic','❌ No Supers'],
    summary:'Natural thymol gel. Two-treatment protocol. Best applied in fall. 59°F–105°F (15–40°C) required. No honey supers.',
    whatItIs:'Per Dadant catalog: Slow-release thymol gel delivered in a tray placed on top bar frames. Applied in two treatments. Should be applied during the fall unless infestation is severe. Temperatures must be 59°F–105°F (15–40°C) for thymol to vaporize effectively. No known resistance developed. Close off screened bottoms and vent holes during treatment.',
    howToApply:[
      'Remove all honey supers before treatment',
      'Place delivery tray on top of top bar frames — do not invert tray',
      'Ensure at least ¼ inch of space above the tray for bees to access',
      'CLOSE OFF screened bottom boards and vent holes during treatment — per Dadant label',
      '1st treatment: leave tray in place for 12–14 days',
      'After 12–14 days replace with second tray',
      '2nd treatment: leave second tray for 2–4 weeks',
      'Remove empty tray after second treatment period'
    ],
    duration:'Two treatments — 1st tray: 12–14 days. 2nd tray: 2–4 weeks. Per Dadant catalog.',
    temperature:'59°F–105°F (15–40°C) required. Thymol will not vaporize below 59°F making treatment ineffective. Check Alabama forecast before applying.',
    remove:'Remove empty tray after 2nd treatment period. Reopen screened bottoms and vent holes.',
    ppe:'Gloves recommended. Avoid prolonged skin contact — thymol can cause irritation.',
    warnings:[
      '⚠️ CLOSE screened bottom boards and vent holes during treatment — per Dadant',
      '⚠️ Will not work below 59°F (15°C) — do not apply when temps are below this threshold',
      '⚠️ Do not use with honey supers — thymol taints honey',
      '⚠️ Some colonies may abscond with heavy thymol exposure in small colonies',
      '⚠️ Also provides some benefit for control of Tracheal Mites per Dadant'
    ],
    followUp:'Alcohol wash 21 days after final tray removed.',
    resistance:'No known resistance.'
  },
  {
    id:'apilife-var',
    name:'Api Life VAR (Thymol Blend)',
    activeIngredient:'Thymol, Eucalyptol, Menthol, Camphor',
    class:'organic',
    supersOn:false,
    broodlessOnly:false,
    tempMin:65, tempMax:85,
    chemicalClass:'thymol',
    icon:'🟡',
    tags:['organic','supers-off'],
    tagLabels:['Organic','❌ No Supers'],
    summary:'Essential oil blend tablets. No known resistance. Temperature window 65–95°F (18–35°C). No honey supers.',
    whatItIs:'Vermiculite tablets impregnated with thymol and other essential oils including eucalyptol, menthol, and camphor. Similar active ingredient to Apiguard but in tablet form. No wax contamination risk and no known resistance. Temperature window is narrow — verify forecast before applying.',
    howToApply:[
      'Remove all honey supers before treatment',
      'Break each tablet in half — you will use 2 half-tablets per treatment',
      'Place 1 half-tablet on each of the TOP CORNERS of the brood box frames — do not place in center',
      'Do not place tablets directly over brood — corners only',
      'After 7–10 days replace with fresh tablets',
      'Complete 3 full treatments total — 7–10 days each'
    ],
    duration:'3 treatments of 7–10 days each. Total treatment period approximately 3–4 weeks.',
    temperature:'65–95°F (18–35°C) per HBHC. Ineffective below 65°F; do not use above 95°F as it may cause bees to abscond. Verify Alabama forecast before applying.',
    remove:'Remove tablet remnants between each treatment. Dispose of properly.',
    ppe:'Gloves recommended. Strong essential oil odor is normal.',
    warnings:[
      '⚠️ Use only between 65–95°F (18–35°C) — ineffective below 65°F, risks bee exodus above 95°F',
      '⚠️ Place tablets on TOP CORNERS only — never directly over brood',
      '⚠️ Do not use with honey supers',
      '⚠️ Risk of absconding in small or stressed colonies'
    ],
    followUp:'Alcohol wash 21 days after final treatment.',
    resistance:'No known resistance.'
  },
  // ── AMITRAZ / SYNTHETIC ──────────────────────────────────────
  {
    id:'apivar',
    name:'Apivar (Amitraz — Original)',
    activeIngredient:'Amitraz',
    class:'synthetic',
    supersOn:false,
    broodlessOnly:false,
    tempMin:50, tempMax:999,
    chemicalClass:'amitraz',
    icon:'🔵',
    tags:['synthetic','supers-off'],
    tagLabels:['Synthetic','❌ No Supers'],
    summary:'Per Dadant: 42 days. 1 strip per 4–5 frames. Works by contact. Place in high bee activity areas. Normally used as fall treatment.',
    whatItIs:'Per Dadant catalog: Amitraz-impregnated plastic strips. Works by contact — bees walk across strips and distribute the active ingredient through the colony via grooming. 42-day treatment. Place 1 strip per every 4–5 frames in high bee activity areas. Normally used as a fall treatment. Cannot be used with honey supers on. Most effective synthetic varroa treatment available — however resistance is emerging nationally.',
    howToApply:[
      'Remove ALL honey supers before treatment',
      'Hang 1 strip per every 4–5 frames of bees in high bee activity areas — per Dadant label',
      'Ensure strips hang freely and bees can contact both sides',
      'Place in the highest bee activity zone of the brood nest',
      'Record the date treatment started — must complete full 42 days',
      'Do not remove strips early — partial treatment accelerates resistance'
    ],
    duration:'42 days per Dadant catalog. Do not remove early.',
    temperature:'Above 50°F. Works through Alabama fall and winter except coldest days.',
    remove:'Remove all strips at exactly 42 days. Remove 14 days before adding honey supers.',
    ppe:'Gloves recommended. Wash hands after handling strips.',
    warnings:[
      '⚠️ RESISTANCE WARNING — Do not repeat in the same season',
      '⚠️ Do not use back-to-back seasons without rotating to a different chemical class',
      '⚠️ 1 strip per 4–5 frames per Dadant — do not overdose',
      '⚠️ Cannot be used with honey supers on',
      '⚠️ Normally a fall treatment per Dadant — do not use during honey flow',
      '⚠️ Do NOT use if Apistan (fluvalinate) was used earlier this season'
    ],
    followUp:'Alcohol wash 21 days after strip removal to verify efficacy.',
    resistance:'Resistance emerging nationally. Rotate with organic treatments between seasons.'
  },
  {
    id:'apivar2',
    name:'Apivar 2.0 (Amitraz — Extended)',
    activeIngredient:'Amitraz',
    class:'synthetic',
    supersOn:false,
    broodlessOnly:false,
    tempMin:0, tempMax:999,
    chemicalClass:'amitraz',
    icon:'🔵',
    tags:['synthetic','supers-off'],
    tagLabels:['Synthetic','❌ No Supers'],
    summary:'Per Dadant: 6–10 weeks. 1 strip per 5 frames per brood chamber. Can be used in spring and fall during periods of bee activity.',
    whatItIs:'Per Dadant catalog: Extended-duration amitraz strip treatment. Place 1 strip per five frames of bees in each brood chamber. Can be used in spring and fall during periods of bee activity — more flexible seasonal use than original Apivar. Same active ingredient (amitraz) as original Apivar — do not use both in the same season.',
    howToApply:[
      'Remove ALL honey supers before treatment',
      'Place 1 strip per 5 frames of bees in EACH brood chamber',
      'For a double brood box colony: treat both boxes separately',
      'Ensure strips hang freely for bee contact',
      'Record treatment start date',
      'Do not remove early — complete full treatment period'
    ],
    duration:'6–10 weeks per Dadant catalog.',
    temperature:'No specific temperature restriction noted by Dadant.',
    remove:'Remove after 6–10 weeks. Remove 14 days before adding honey supers.',
    ppe:'Gloves recommended. Wash hands after handling.',
    warnings:[
      '⚠️ Same chemical class as original Apivar — do NOT use both in the same season',
      '⚠️ Do not use with honey supers',
      '⚠️ Amitraz resistance emerging nationally — rotate with organics',
      '⚠️ Do NOT use if Apistan was used earlier this season'
    ],
    followUp:'Alcohol wash 21 days after removal.',
    resistance:'Same resistance risk as all amitraz products — emerging nationally.'
  },
  {
    id:'amiflex2',
    name:'Amiflex 2.0 (Amitraz — Short Treatment)',
    activeIngredient:'Amitraz',
    class:'synthetic',
    supersOn:false,
    broodlessOnly:false,
    tempMin:0, tempMax:999,
    chemicalClass:'amitraz',
    icon:'🔵',
    tags:['synthetic','supers-off'],
    tagLabels:['Synthetic','❌ No Supers'],
    summary:'Per Dadant: 7-day treatment. 2 doses per single body hive, 4 doses per double body. Can be used before or after honey flows. Always treat without honey supers.',
    whatItIs:'Per Dadant catalog: Short-duration amitraz treatment. Apply 2 doses per single hive body or 4 doses per double body hive. Can be used before or after honey flows — more flexible timing than Apivar. Always treat without honey supers on. 7-day treatment period.',
    howToApply:[
      'Remove ALL honey supers before treatment',
      'Apply 2 doses per single brood body hive',
      'Apply 4 doses per double brood body hive',
      'Apply before or after honey flow periods — not during',
      'Complete full 7-day treatment period',
      'Record date and doses applied'
    ],
    duration:'7 days per Dadant catalog.',
    temperature:'No specific temperature restriction noted by Dadant.',
    remove:'After 7 days. Do not use with supers on.',
    ppe:'Gloves recommended.',
    warnings:[
      '⚠️ Same chemical class as Apivar and Apivar 2.0 — do NOT use more than one amitraz product per season',
      '⚠️ Always remove honey supers before treatment',
      '⚠️ Do NOT use if Apistan was used earlier this season',
      '⚠️ Amitraz resistance emerging nationally'
    ],
    followUp:'Alcohol wash 21 days after treatment.',
    resistance:'Same resistance risk as all amitraz products.'
  },
  {
    id:'apistan',
    name:'Apistan (Tau-Fluvalinate)',
    activeIngredient:'Tau-Fluvalinate',
    class:'synthetic',
    supersOn:false,
    broodlessOnly:false,
    tempMin:50, tempMax:999,
    chemicalClass:'fluvalinate',
    icon:'🔴',
    tags:['synthetic','supers-off','resistance'],
    tagLabels:['Synthetic','❌ No Supers','⚠️ Resistance'],
    summary:'Per Dadant: 42–56 days. 1 strip per 5 frames. Above 50°F, spring and fall. ⚠️ Widespread resistance — last resort only.',
    whatItIs:'Per Dadant catalog: Fluvalinate-impregnated plastic strips. 42–56 days, 1 strip per 5 frames of bees, generally spring and fall when temperatures are above 50°F. Once the most widely used varroa treatment — however widespread resistance is now documented in many bee populations. Fluvalinate also accumulates in beeswax over time and has been shown to reduce drone fertility. Use only as a last resort when other options are unavailable.',
    howToApply:[
      'Remove all honey supers before treatment',
      'Hang 1 strip per every 5 frames of bees — per Dadant label',
      'Place in the brood nest where bee activity is highest',
      'Ensure strips hang freely for bee contact',
      'Record treatment start date',
      'Complete full treatment period — do not remove early'
    ],
    duration:'42–56 days per Dadant catalog.',
    temperature:'Generally above 50°F. Spring and fall per Dadant.',
    remove:'Remove by day 56. Do not leave in longer.',
    ppe:'Gloves recommended. Wash hands after handling.',
    warnings:[
      '⛔ WIDESPREAD RESISTANCE DOCUMENTED — verify kill with post-treatment alcohol wash',
      '⚠️ Fluvalinate accumulates in beeswax over time — limit use',
      '⚠️ Shown to reduce drone sperm viability and increase drone mortality',
      '⚠️ Do NOT use if any amitraz product (Apivar/Apivar 2.0/Amiflex) was used this season',
      '⚠️ Last resort only — exhaust all other options first'
    ],
    followUp:'Alcohol wash 21 days after removal — critical to verify treatment worked due to resistance risk.',
    resistance:'⚠️ WIDESPREAD RESISTANCE DOCUMENTED nationally.'
  }
];
// ═══════════════════════════════════════════════════════
// FEEDING GUIDE — Per Dadant Feed Chart
// ═══════════════════════════════════════════════════════
var ALABAMA_FEEDING_CALENDAR = [
  { months:'January–February', label:'Late Winter', icon:'❄️',
    situation:'Colony may be hungry — cluster cannot move to stores in cold. Critical period.',
    syrup:'2:1 heavy syrup ONLY if temperatures allow bees to take it (above 50°F). Fondant or candy board preferred when too cold for syrup.',
    patties:'✅ Pollen patties now — queen begins laying in January. Place on top of frames.',
    notes:'Do not break cluster to feed. Use candy board or top feeder. This is the most common time for starvation — heft hive to check weight.' },
  { months:'March–April', label:'Spring Buildup', icon:'🌸',
    situation:'Critical feeding window. Colony is rapidly expanding. Natural pollen beginning but may not be enough.',
    syrup:'1:1 sugar to water (equal parts). Stimulates brood rearing and foraging. Feed until strong nectar flow begins.',
    patties:'✅ Pollen patties strongly recommended. Supports explosive brood expansion. Remove when natural pollen is abundant to avoid swarming pressure.',
    notes:'Per Dadant: Spring is primary season for AP23/Brood Builder patties, HBH Super Plus, HBH Vitamin B, and Nozevit Plus. Add Honey-B-Healthy to syrup to stimulate feeding.' },
  { months:'May–June', label:'Spring Nectar Flow', icon:'🌺',
    situation:'Main nectar flow — usually no feeding needed. Bees should be self-sufficient.',
    syrup:'❌ Generally not needed. If feeding a new package or split, use 1:1 only until established.',
    patties:'❌ Remove pollen patties — can contribute to swarm pressure during heavy flow.',
    notes:'Do not feed during honey flow if you want to harvest — bees may store syrup in honey supers. New packages and nucs are the exception.' },
  { months:'July–August', label:'Summer Dearth', icon:'☀️',
    situation:'Alabama summer dearth — little to no nectar. Robbing pressure high. Weak colonies at risk.',
    syrup:'2:1 heavy syrup for weak colonies or nucs that need building up. Feed in the evening to reduce robbing. Use entrance reducer.',
    patties:'⚠️ Only if pollen is scarce and colony needs support. Monitor closely — can attract SHB.',
    notes:'Reduce entrance during dearth to limit robbing. Feed at night or use internal feeders. This is a high-risk period for weak colonies and new nucs.' },
  { months:'September–October', label:'Fall Prep', icon:'🍂',
    situation:'Goldenrod/aster flow begins. Critical time to build up winter stores after supers come off.',
    syrup:'2:1 heavy syrup (2 parts sugar to 1 part water). Bees convert and cap heavy syrup for winter. Feed until bees stop taking it or first hard frost.',
    patties:'✅ Pollen patties after miticide treatments per Dadant. Supports colony health going into winter.',
    notes:'Per Dadant: Fall is primary season for AP23/Brood Builder after miticide treatments. Goal is 60–80 lbs of capped honey stores for winter in Alabama.' },
  { months:'November–December', label:'Pre-Winter', icon:'🍃',
    situation:'Colony winding down. Minimize disturbance. Ensure adequate stores are in place.',
    syrup:'❌ Too cold for syrup. Switch to fondant or candy board if stores are low.',
    patties:'❌ Generally not needed. Add only if colony is very light on stores.',
    notes:'Heft the hive — a light hive in November means emergency feeding needed. Candy board is safest option when temps are below 50°F.' }
];

var FEEDING_SUPPLEMENTS = [
  {
    name:'AP23 & Brood Builder (Pollen Sub Patties)',
    icon:'🟡',
    summary:'Pollen substitute patties. Fed dry or in patty form. Primary supplement for colony population building.',
    whatItIs:'Per Dadant: These pollen subs may be fed either dry or in patty form. Primary purpose is boosting colony population and supporting brood rearing when natural pollen is unavailable or insufficient.',
    howToApply:[
      'If running single brood boxes: place patties on top of frames',
      'If running double brood boxes: place patties between the boxes',
      'Feed in spring to boost colony populations',
      'Feed in the fall after miticide treatments to restore colony strength',
      'Can be fed any time a pollen dearth occurs',
      'Feed to nucs, weak colonies, and swarms to accelerate buildup'
    ],
    timing:'Spring (primary) · Fall after miticide treatments · Any pollen dearth · Nucs and swarms',
    notes:'Remove when strong natural pollen flow begins to avoid contributing to swarm pressure.'
  },
  {
    name:'Honey-B-Healthy',
    icon:'🍯',
    summary:'Essential oil feeding stimulant. Mix into sugar syrup. Up to 4 tsp per quart. Can also be used as a smoker spray.',
    whatItIs:'Per Dadant: Mix 1–2 teaspoons per quart of sugar water when fed in sugar syrup. Can be increased to up to 4 teaspoons per quart. When used as a smoker spray use 1:1 syrup in the smoker to calm bees.',
    howToApply:[
      'Standard dose: Mix 1–2 tsp per quart of sugar syrup',
      'Can increase up to 4 tsp per quart if needed',
      'Add to either 1:1 spring syrup or 2:1 fall syrup',
      'As smoker spray: mix with 1:1 syrup and spray into smoker or directly on bees to calm them',
      'Feed during late winter/early spring',
      'Feed during fall dearths, with nucs, weak colonies, and swarms'
    ],
    timing:'Late winter/early spring · Fall dearths · Nucs · Weak colonies · Swarms',
    notes:'Stimulates feeding activity. Commonly used to encourage bees to accept syrup when they are reluctant to feed.'
  },
  {
    name:'HBH Super Plus',
    icon:'🟠',
    summary:'Feed supplement. Mix 1 tsp per quart of syrup (up to 3 tsp). For patties: 1 tsp per lb. Best in spring and fall. Feed with supers removed.',
    whatItIs:'Per Dadant: Mix 1 tsp per quart of various sugar water mixes — can be increased to 3 tsp per quart. For protein patties: 1 tsp per lb, adjust as needed. Best in spring and fall but can be used any time of year. Feed with honey supers removed.',
    howToApply:[
      'Standard dose: 1 tsp per quart of sugar syrup',
      'Can increase to 3 tsp per quart as needed',
      'For pollen patties: mix 1 tsp per lb of patty mix, adjust as needed',
      'Remove honey supers before feeding',
      'Feed in spring and fall as primary seasons'
    ],
    timing:'Best spring and fall — can be used any time of year. Always remove honey supers.',
    notes:'Remove supers before feeding to prevent contamination of honey crop.'
  },
  {
    name:'HBH Vitamin B',
    icon:'🟣',
    summary:'Vitamin B supplement. Add ½ tsp per quart of sugar water or liter. For patties: ½ tsp per 3 lbs dry mix. Best spring and fall. Remove supers.',
    whatItIs:'Per Dadant: Add ½ tsp to each quart or liter of sugar water when feeding. If used in protein patties add ½ tsp per 3 lbs dry patty mix. Best in spring and fall but can be used any time of year. Feed with honey supers removed.',
    howToApply:[
      'Add ½ tsp per quart (or liter) of sugar syrup',
      'For protein patties: add ½ tsp per 3 lbs of dry patty mix',
      'Remove honey supers before feeding',
      'Feed in spring and fall as primary seasons',
      'Can be combined with other supplements in the same syrup'
    ],
    timing:'Best spring and fall — can be used any time of year. Remove honey supers.',
    notes:'Can be used alongside HBH Super Plus in the same syrup mix.'
  },
  {
    name:'Complete',
    icon:'🟢',
    summary:'Complete nutritional supplement. Feed in syrup by drench method or in protein patties. Apply whenever feeding is needed.',
    whatItIs:'Per Dadant: Feed Complete anytime you are feeding sugar syrup — by drench method and in nutritional supplement protein patties. Apply Complete whenever feeding is needed.',
    howToApply:[
      'Add to sugar syrup and apply by drench method directly onto bees between frames',
      'Alternatively mix into protein patties per product directions',
      'Can be used anytime feeding is occurring',
      'Follow product label for specific mixing ratios'
    ],
    timing:'Apply Complete whenever feeding is needed — no seasonal restriction.',
    notes:'Versatile supplement — can be used in syrup or patties anytime.'
  },
  {
    name:'Nozevit Plus',
    icon:'🔵',
    summary:'Per Dadant: 15–20 drops per colony in ⅓ quart sugar syrup or sprayed on frames. 20 drops per lb in pollen patties. Use twice in spring and fall at 10-day intervals.',
    whatItIs:'Per Dadant: 15–20 drops per colony mixed in ⅓ quart sugar syrup or sprayed on frames. May also be fed in pollen patties at 20 drops per pound. Use as a feed supplement two times in spring and fall at 10-day intervals.',
    howToApply:[
      'Mix 15–20 drops per colony into ⅓ quart (approximately 10 oz) of sugar syrup',
      'Apply directly to colony or spray onto frames',
      'Alternatively: add 20 drops per lb of pollen patty mix',
      'Use twice per season — once then repeat 10 days later',
      'Apply in both spring and fall'
    ],
    timing:'Spring (2 applications, 10 days apart) · Fall (2 applications, 10 days apart).',
    notes:'Per Dadant: Use as a feed supplement twice in spring and fall at 10-day intervals.'
  },
  {
    name:'Optima',
    icon:'🟤',
    summary:'Per Dadant: 1–2 tsp per gallon of syrup. Drench ¼ quart or 10–12 oz per colony, 4 times at 4-day intervals. ¾ tsp per lb for pollen patties. Use whenever bees are stressed.',
    whatItIs:'Per Dadant: Mix 1–2 teaspoons of Optima per gallon of syrup. Drench at rate of ¼ quart or 10–12 ounces solution per colony. Apply 4 times at 4-day intervals. When feeding in pollen patties: ¾ teaspoon per lb of patty is recommended. A 100ml bottle will make 20 gallons of syrup. Use whenever feeding is needed or bees are overstressed.',
    howToApply:[
      'Mix 1–2 tsp of Optima per gallon of sugar syrup',
      'Apply by drench: ¼ quart (10–12 oz) of solution per colony per application',
      'Apply 4 times total at 4-day intervals per treatment course',
      'For pollen patties: mix ¾ tsp Optima per lb of patty mix',
      'Note: one 100ml bottle makes approximately 20 gallons of syrup'
    ],
    timing:'Whenever feeding is needed or bees are overstressed.',
    notes:'Per Dadant: 100ml bottle makes 20 gallons of syrup. Apply 4 times at 4-day intervals per course.'
  },
  {
    name:'Sugar Syrup',
    icon:'🍬',
    summary:'1:1 (spring) to stimulate foraging and brood rearing. 2:1 (fall) to build up winter stores. Apply when needed.',
    whatItIs:'Per Dadant: For spring feeding mix 1 part sugar to 1 part water to stimulate late foraging. For fall feeding mix 2 parts sugar to 1 part water to build up stores for winter. If not enough honey has been stored for winter, supplement accordingly. Measurement reference: 1 lb granulated sugar = approx 2¼ cups. Spring 1:1 quick mix: 2¼ cups sugar per 2¼ cups water. Fall 2:1 quick mix: 4½ cups sugar per 2¼ cups (1 pint) water.',
    howToApply:[
      'Spring 1:1 syrup: mix equal parts granulated sugar and warm water until dissolved. Approx 2¼ cups sugar per lb (or per quart of water for a slightly heavy 1:1)',
      'Fall 2:1 syrup: mix 2 parts sugar to 1 part water — thicker to mimic nectar and encourage capping. Approx 4½ cups sugar to 1 quart water (2 lbs sugar per quart)',
      'Use internal feeders or top feeders to reduce robbing',
      'Feed in the evening during dearth periods to minimize robbing',
      'Continue fall feeding until bees stop taking syrup or first frost'
    ],
    timing:'Spring 1:1: March–May to stimulate buildup · Fall 2:1: August–October to build winter stores.',
    notes:'Alabama winter stores goal: 60–80 lbs of capped honey. Heft hive in late fall to assess — a light hive needs emergency feeding.'
  }
];

var NONCHEMICAL_CONTROLS = [
  {
    name:'Drone Brood Frame Removal',
    icon:'🖼️',
    desc:'Insert a drone comb frame into the brood nest. Varroa preferentially infest drone brood (8–10x higher). Remove and freeze frame when capped (every 28 days per HBHC). Kills mites trapped in capped drone brood.',
    steps:['Insert empty drone comb frame in brood area','Allow queen to lay drone brood in frame','Remove frame when drone brood is 75–100% capped (approx 10 days after laying)','Place capped frame in freezer for minimum 48 hours at 20°F','Thaw, uncap, and return frame to hive — bees will clean it','Repeat every 28 days throughout season per HBHC 8th Edition'],
    note:'Per AUBEE: recommended first-line response at Caution level. Can reduce mite load 30–40% as a standalone measure.'
  },
  {
    name:'Brood Interruption / Artificial Swarm',
    icon:'✂️',
    desc:'Remove the queen for 24 days creating a broodless period. All mites become phoretic (on bees) and are then susceptible to OAV treatment. Highly effective when combined with Api-Bioxal.',
    steps:['Find and cage or temporarily remove queen to nuc box','Allow colony to become fully broodless (24 days)','Treat with Api-Bioxal OAV during broodless window for near-100% efficacy','Return queen after treatment'],
    note:'Most effective non-chemical strategy. Particularly valuable in summer when other treatments have temperature restrictions.'
  },
  {
    name:'Requeening with Hygienic Stock',
    icon:'👑',
    desc:'Replace queen with a hygienic or VSH (Varroa Sensitive Hygiene) bred queen. These colonies detect and remove mite-infested brood, naturally suppressing varroa populations over time.',
    steps:['Source VSH or hygienic-rated queen from reputable breeder','Requeen colony using standard introduction method','Allow 4–6 weeks for new queen genetics to impact colony behavior','Monitor mite levels — expect gradual improvement over 1–2 seasons'],
    note:'Long-term management strategy. Best combined with chemical treatments for immediate control.'
  }
];

// Treatment knowledge base (non-varroa pests and diseases — existing)
var PEST_CATEGORIES = {
  'Varroa Mites': {
    icon:'🔴', type:'pest',
    recommendations:[
      {name:'Apivar 2.0 (Amitraz)',note:'42-56 days. 1 strip per 5 frames. No supers. Best fall treatment. Most effective synthetic available.',warn:'⚠️ Remove supers. Do not use during honey flow.'},
      {name:'Formic Pro (MAQS)',note:'14 days. Supers OK. Only treatment that kills mites in capped brood. Temp 50-85°F.',warn:'⚠️ Remove if temps exceed 85°F — critical in Alabama summer.'},
      {name:'Api-Bioxal / EZ-OX (Oxalic Acid Vaporization)',note:'Near 100% effective when broodless. Best fall/winter treatment.',warn:'⛔ Full PPE required — respirator, gloves, goggles. Never without PPE.'},
      {name:'VarroxSan (Oxalic Acid Strips)',note:'Fold in half, drape over frames. 42-56 days. No temp restriction.',warn:'⚠️ Avoid intense nectar flow. Fold and drape — do not lay flat.'},
      {name:'Apiguard (Thymol Gel)',note:'Two-treatment protocol, 12-14 days each. Temp 59-105°F required.',warn:'⚠️ Close screened bottom and vents during treatment. No supers.'}
    ]
  },
  'Tracheal Mites': {
    icon:'🔴', type:'pest',
    recommendations:[
      {name:'Grease Patties (shortening + sugar)',note:'Disrupts mite pheromone detection. Preventative and treatment.',warn:''},
      {name:'Menthol Crystals',note:'Place in hive above frames.',warn:'⚠️ Must be above 59°F (15°C) to vaporize effectively'},
      {name:'Apivar (Amitraz)',note:'Also effective against tracheal mites.',warn:'⚠️ Remove before honey flow'},
      {name:'Requeen with Resistant Stock',note:'Long-term solution using hygienic or resistant queens.',warn:''}
    ]
  },
  'Small Hive Beetles': {
    icon:'🟤', type:'pest',
    recommendations:[
      {name:'Freeman Beetle Trap or Beetle Blaster',note:'Oil trap on bottom board. Replace oil every 2 weeks in Alabama summer heat. Alabama\'s heat shortens the SHB lifecycle to ~23 days — check traps more frequently June–September.',warn:''},
      {name:'Beetle Barn between frames',note:'In-hive trap placed between brood frames. Place 1–2 in the brood area where bees cluster.',warn:''},
      {name:'CheckMite+ (Coumaphos) — Corrugated Cardboard Method',note:'Only registered in-hive chemical for SHB. Cut ONE strip in half crossways. Staple both halves to the corrugated side of a 4×4" cardboard square — tape the smooth side so bees cannot chew it. Place strip-side DOWN on center of bottom board so beetles shelter in corrugations and contact the strip but bees cannot reach it. If screen bottom board is in use, place above the inner cover instead. Leave 42–45 days (min 42, never more than 45). Max 4 treatments per year for SHB use.',warn:'⚠️ Do not use during honey flow. No supers until 14 days after removal. Chemical-resistant gloves required — not leather bee gloves. Do not use more than 2x/year for Varroa use (separate from SHB limit).'},
      {name:'Reduce hive space',note:'Consolidate to what bees can actively defend. Over-supering is one of the most common causes of SHB outbreaks — excess space gives beetles room to hide and lay eggs.',warn:''},
      {name:'Full sun hive placement',note:'SHB larvae pupate in soil — dry, hot, sun-baked soil kills them before they can complete development. Alabama full sun is one of the most effective passive controls available.',warn:''},
      {name:'GardStar soil drench',note:'Mix 5ml GardStar 40% EC per gallon of water. Apply by watering can late evening around 18–24 inches of hive base. Kills larvae in soil before they pupate. Active 30–90 days. Never spray near hive surfaces.',warn:'⚠️ Permethrin is highly toxic to bees. Apply late evening only. Do not contact hive body or landing board.'},
      {name:'Steinernema carpocapsae nematodes',note:'Best biological control for Alabama soils per Auburn/USDA research. S. carpocapsae outperforms S. riobrave across all Alabama soil types — up to 94% SHB colonization in sandy loam. Apply to moist soil around hive base.',warn:'⚠️ Efficacy varies by soil type. Not yet confirmed through drought or overwintering in Alabama conditions — use as part of an IPM plan, not as sole control.'}
    ]
  },
  'Wax Moths': {
    icon:'🟡', type:'pest',
    recommendations:[
      {name:'Para-Moth (Paradichlorobenzene) — Stored Equipment ONLY',note:'Per Dadant: 6 tbsp per 15 supers. Duct tape ALL openings making hive as airtight as possible. Reapply crystals as needed. Apply particularly in warm weather. CRITICAL: Air out supers 1–2 weeks before placing back on hive.',warn:'⛔ STORED EQUIPMENT ONLY — toxic to bees. NEVER use in active hives. Air out 1–2 weeks before use on hive.'},
      {name:'B402 Certan (Biological Control)',note:'Per Dadant: Mix 1 part B402 to 19 parts water (5% solution). Apply after frames have been extracted — apply to both sides of each frame. 1 oz fluid per deep frame, 2/3 oz per medium, 1/2 oz per shallow. Allow to dry before putting into storage. Apply once after extraction before any wax moth infestation — gives protection through to next season. Kills young wax moth larvae.',warn:'⚠️ Apply AFTER extraction only. Allow to dry completely before storage. Apply once per season after extraction.'},
      {name:'Freeze Frames',note:'48 hours at 20°F kills all wax moth life stages. Free, chemical-free option for smaller quantities of comb.',warn:''},
      {name:'Strong Colony Maintenance',note:'Best prevention — well-populated colonies defend themselves against wax moths.',warn:''}
    ]
  },
  'American Foulbrood': {
    icon:'🔴', type:'disease', notifiable:true,
    recommendations:[
      {name:'Contact State Apiary Inspector IMMEDIATELY',note:'AFB is a notifiable disease. You are legally required to contact your state or local apiary inspector before treating, moving, or destroying any equipment. Alabama Apiary Protection Unit (ADAI): Brittaney Allen, State Survey Coordinator — (334) 240-7172 · brittaney.allen@agi.alabama.gov · agi.alabama.gov/plantprotection/apiary-protection-unit/',warn:'⛔ DO NOT TREAT OR DESTROY EQUIPMENT without contacting your state inspector first — this is the law'},
      {name:'Tetra-B Mix / Oxytetracycline (Preventative Only)',note:'Per Dadant: Three treatments at 4–5 day intervals. Sprinkle recommended dosage around edges of brood box on top bars of frames. Once a week for 3 weeks. Treat spring and fall. IMPORTANT: This is PREVENTATIVE only — does not cure active AFB infection.',warn:'⚠️ PREVENTATIVE USE ONLY — does NOT kill active AFB spores. Do not use as sole treatment for confirmed active infection.'},
      {name:'Tylosin (Tylan)',note:'Prescription antibiotic — requires veterinarian authorization. More effective than oxytetracycline for some strains.',warn:'⚠️ Prescription required from a licensed veterinarian'},
      {name:'Burning Infected Equipment',note:'Often legally required for confirmed active AFB. Only after consulting your state inspector. All infected comb, frames, and sometimes boxes must be destroyed.',warn:'⚠️ Only after consulting Alabama state apiary inspector — may be legally required'}
    ]
  },
  'European Foulbrood': {
    icon:'🟡', type:'disease',
    recommendations:[
      {name:'Tetra-B Mix / Oxytetracycline',note:'Per Dadant: Three treatments at 4–5 day intervals. Sprinkle recommended dosage around edges of brood box on top bars of frames. Once a week for 3 weeks. Treat spring and fall. More effective against EFB than AFB.',warn:'⚠️ Follow withdrawal periods before adding honey supers'},
      {name:'Improve Nutrition',note:'Supplement with pollen patties and syrup to reduce nutritional stress — a key driver of EFB outbreaks.',warn:''},
      {name:'Requeen with Hygienic Stock',note:'Hygienic queens detect and remove diseased larvae. Strong long-term management strategy.',warn:''}
    ]
  },
  'Chalkbrood': {
    icon:'🟡', type:'disease',
    recommendations:[
      {name:'Improve Ventilation',note:'Reduce moisture — add screened bottom board, tilt hive slightly forward to allow condensation to drain.',warn:''},
      {name:'Requeen with Hygienic Stock',note:'Strongest long-term management — hygienic colonies remove chalkbrood mummies before sporulation.',warn:''},
      {name:'Remove Affected Comb',note:'Remove and destroy heavily affected comb to reduce spore load in the hive.',warn:''},
      {name:'No Approved Chemical Treatment',note:'No registered chemical treatments for chalkbrood exist. Management is supportive — ventilation and hygienic genetics are the only proven tools.',warn:''}
    ]
  },
  'Sacbrood': {
    icon:'🟡', type:'disease',
    recommendations:[
      {name:'Requeen',note:'Usually self-limiting but requeening with hygienic stock speeds recovery significantly.',warn:''},
      {name:'Remove Affected Brood',note:'Remove frames with heavy sacbrood symptoms to reduce viral load in colony.',warn:''},
      {name:'No Approved Chemical Treatment',note:'No registered treatments for sacbrood. Management is supportive — colony usually recovers on its own with requeening.',warn:''}
    ]
  },
  'Nosema': {
    icon:'🟡', type:'disease',
    recommendations:[
      {name:'Fumagilin-B',note:'Per Dadant: Can be used spring or fall. Fumagilin-B can be dissolved in water or syrup at room temperature. Consult the product leaflet to ensure the correct quantities of Fumagilin-B and sugar — see product leaflet for proper dosage. Do not guess quantities.',warn:'⚠️ See product leaflet for proper dosage — quantities are critical. Check current legal status in your state before purchase.'},
      {name:'Improve Ventilation & Nutrition',note:'Reduce hive moisture — a primary driver of Nosema. Supplement with pollen patties during dearth periods.',warn:''},
      {name:'Spring Hive Reversal',note:'Moving the lower box to the top improves ventilation and reduces moisture buildup — key factor in Nosema management.',warn:''}
    ]
  },
  'Deformed Wing Virus': {
    icon:'🔴', type:'disease',
    recommendations:[
      {name:'Treat for Varroa',note:'DWV is transmitted by varroa. Varroa control is the primary treatment.',warn:''},
      {name:'Oxalic Acid Vaporization',note:'Reduces varroa load which carries DWV.',warn:'⚠️ PPE required'}
    ]
  },
  'Ants': {
    icon:'🟠', type:'pest',
    recommendations:[
      {name:'Cinnamon Around Hive Base',note:'Natural deterrent — sprinkle around stand legs.',warn:''},
      {name:'Oil/Water Barrier on Stand Legs',note:'Place stand legs in containers of oil or water.',warn:''},
      {name:'Commercial Ant Traps (away from hive)',note:'Place traps away from hive entrance.',warn:'⚠️ Keep bait traps away from entrance'}
    ]
  },
  'Rodents (Mice/Voles)': {
    icon:'🟠', type:'pest',
    recommendations:[
      {name:'Mouse Guard / Entrance Reducer',note:'Install before winter — allows bees but blocks mice.',warn:''},
      {name:'Raise Hive on Stand',note:'Elevation deters rodent access.',warn:''},
      {name:'Snap Traps Around Hive',note:'Place around (not inside) the hive.',warn:''}
    ]
  }
};

var PEST_NAMES = Object.keys(PEST_CATEGORIES);

function getTreatRecs(pestName) {
  var cat = PEST_CATEGORIES[pestName];
  if (!cat || !cat.recommendations || !cat.recommendations.length) return '';
  var afbAlert = '';
  if (cat.notifiable) {
    afbAlert = '<div class="afb-alert"><div class="afb-alert-title">⛔ NOTIFIABLE DISEASE</div><p>American Foulbrood is a notifiable disease. You are legally required to contact your state or local apiary inspector before treating, moving, or destroying any equipment. Do not delay.</p></div>';
  }
  var recs = cat.recommendations.map(function(r,i){
    return '<div class="rec-item">'+
      '<div class="rec-item-name">'+esc(r.name)+'</div>'+
      '<div class="rec-item-note">'+esc(r.note)+'</div>'+
      (r.warn?'<div class="rec-item-warn">'+esc(r.warn)+'</div>':'')+
      '<button class="use-btn" onclick="useTreatRec(\''+esc(r.name)+'\',\''+esc(pestName)+'\')">Use This →</button>'+
    '</div>';
  }).join('');
  return afbAlert + '<div class="rec-panel"><div class="rec-title">💊 Recommended Treatments</div>'+recs+'</div>';
}

function useTreatRec(productName, pestName) {
  var pInput = document.getElementById('f-trtproduct');
  if (pInput) pInput.value = productName;
  // Show a summary of the selected treatment if it's in VARROA_TREATMENTS
  var treat = VARROA_TREATMENTS.find(function(t){ return t.name === productName; });
  var recDiv = document.getElementById('treat-rec-area');
  if (treat && recDiv) {
    recDiv.innerHTML =
      '<div style="background:rgba(37,99,168,.06);border:1px solid rgba(37,99,168,.15);border-radius:12px;padding:12px;margin-bottom:10px">' +
      '<div style="font-size:12px;font-weight:700;color:var(--deep);margin-bottom:6px">' + esc(treat.name) + '</div>' +
      '<div style="font-size:12px;color:var(--txt2);line-height:1.6;margin-bottom:8px">' + esc(treat.summary) + '</div>' +
      '<div style="font-size:11px;color:var(--txt2)">' +
        '<strong>Duration:</strong> ' + esc(treat.duration) + '<br>' +
        '<strong>Temp:</strong> ' + esc(treat.temperature) +
      '</div>' +
      (treat.warnings && treat.warnings.length ?
        '<div style="margin-top:8px">' + treat.warnings.slice(0,2).map(function(w){
          return '<div style="font-size:11px;color:var(--warn);margin-top:3px">' + esc(w) + '</div>';
        }).join('') + '</div>' : '') +
      '</div>';
  } else if (recDiv) {
    recDiv.style.display = 'none';
  }
}

function onPestChange() {
  var sel = document.getElementById('f-trtpest');
  if (!sel) return;
  var val = sel.value;
  var recDiv = document.getElementById('treat-rec-area');
  if (recDiv) {
    recDiv.innerHTML = getTreatRecs(val);
    recDiv.style.display = val ? '' : 'none';
  }
}

// ═══════════════════════════════════════════════════════
// TREATMENT MODAL
// ═══════════════════════════════════════════════════════
function openTreatmentModal(item) {
  if (!DATA.hives.length) { alert('Please add a hive first!'); return; }
  var edit = !!item;
  var today = new Date().toISOString().slice(0,10);
  var opts = DATA.hives.map(function(h){return '<option value="'+h.id+'"'+(item&&item.hiveId===h.id?' selected':'')+'>'+esc(h.name)+'</option>';}).join('');
  var pestOpts = PEST_NAMES.map(function(n){return '<option value="'+esc(n)+'"'+(item&&(item.pestType===n||item.diseaseType===n)?' selected':'')+'>'+esc(n)+'</option>';}).join('');
  var h = '<div class="modal-title">'+(edit?'Edit':'Log')+' Treatment</div>';
  h += '<div class="fg"><label>Hive</label><select id="f-trthi">'+opts+'</select></div>';
  h += '<div class="fg"><label>Date Applied</label><input id="f-trtdate" type="date" value="'+(edit?item.date:today)+'"></div>';
  h += '<div class="fg"><label>Pest / Disease / Issue</label><select id="f-trtpest" onchange="onPestChange()"><option value="">— Select —</option>'+pestOpts+'</select></div>';
  h += '<div id="treat-rec-area" style="display:none"></div>';
  h += '<div class="fg"><label>Product / Method Used</label><input id="f-trtproduct" value="'+esc(item?item.product||'':'')+'" placeholder="e.g. Apivar strips, Oxalic acid…"></div>';
  h += '<div class="row2"><div class="fg"><label>Duration / Rounds</label><input id="f-trtdur" value="'+esc(item?item.duration||'':'')+'" placeholder="e.g. 42 days"></div><div class="fg"><label>Dose / Amount</label><input id="f-trtdose" value="'+esc(item?item.dose||'':'')+'" placeholder="e.g. 2 strips"></div></div>';
  h += '<div class="fg"><label>Withdrawal Period</label><input id="f-trtwithdraw" value="'+esc(item?item.withdrawal||'':'')+'" placeholder="e.g. Remove 8 weeks before honey harvest"></div>';
  h += '<div class="fg"><label>Outcome / Notes</label><textarea id="f-trtnotes">'+esc(item?item.notes||'':'')+'</textarea></div>';
  h += '<button class="btn btn-p" onclick="saveTreatment(\''+(edit?item.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Log Treatment 💊')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteTreatment(\''+item.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
  // Trigger recs if editing
  if (edit && (item.pestType || item.diseaseType)) {
    setTimeout(function(){
      var sel = document.getElementById('f-trtpest');
      if (sel) onPestChange();
    }, 100);
  }
}
async function saveTreatment(eid, isEdit) {
  var pestVal = gv('f-trtpest'), product = gv('f-trtproduct');
  if (!pestVal) { alert('Please select a pest or disease'); return; }
  var cat = PEST_CATEGORIES[pestVal];
  var obj = {hive_id:gv('f-trthi'),date:gv('f-trtdate'),pest_type:cat&&cat.type==='pest'?pestVal:'',disease_type:cat&&cat.type==='disease'?pestVal:'',category:pestVal,product:product||pestVal,duration:gv('f-trtdur'),dose:gv('f-trtdose'),withdrawal:gv('f-trtwithdraw'),notes:gv('f-trtnotes')};
  if (isEdit) {
    await dbUpdate('treatments', eid, obj);
    Object.assign(DATA.treatments.find(function(x){return x.id===eid;}), {...obj,hiveId:obj.hive_id,pestType:obj.pest_type,diseaseType:obj.disease_type});
  } else {
    var row = await dbInsert('treatments', obj);
    if (row) DATA.treatments.push({...row,hiveId:row.hive_id,pestType:row.pest_type,diseaseType:row.disease_type});
  }
  closeModal(); renderAll();
}
function deleteTreatment(id) {
  confirmDelete('Delete this treatment record?', async function(){
    await dbDelete('treatments',id); DATA.treatments=DATA.treatments.filter(function(t){return t.id!==id;}); renderAll();
  });
}
