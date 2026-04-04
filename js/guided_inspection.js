
// ═══════════════════════════════════════════════════════
// GUIDED INSPECTION SYSTEM
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
// AUBEE VARROA THRESHOLDS & RECOMMENDATIONS
// ═══════════════════════════════════════════════════════
function getColonyPhase(period, broodless) {
  var m = new Date().getMonth() + 1;
  if (broodless) return 'dormant-no-brood';
  if (m === 1 || m === 2) return 'dormant-brood';
  if (m === 3 || m === 4) return 'population-increase';
  if (m === 5 || m === 6) return 'peak-population';
  if (m >= 7 && m <= 10) return 'population-decrease';
  if (m === 11) return 'population-decrease'; // Pre-winter — still transitioning in Alabama; broodless flag handles true dormancy
  return 'dormant-brood'; // December
}

var AUBEE_THRESHOLDS = {
  'dormant-brood':      { label:'Dormant with Brood',    acceptable:1,  danger:1,  months:'Jan–Feb' },
  'dormant-no-brood':   { label:'Dormant without Brood', acceptable:1,  danger:1,  months:'Nov–Jan broodless' },
  'population-increase':{ label:'Population Increase',   acceptable:1,  danger:2,  months:'Mar–Apr' },
  'peak-population':    { label:'Peak Population',       acceptable:2,  danger:3,  months:'May–Jun' },
  'population-decrease':{ label:'Population Decrease',   acceptable:2,  danger:3,  months:'Jul–Oct' }
};

function getVarroaRecs(pct, period, broodless) {
  var supersOn = period.supersOn;
  var phase = getColonyPhase(period, broodless);
  var thresh = AUBEE_THRESHOLDS[phase];

  // Determine alert level
  var level, label, msg;
  if (pct < thresh.acceptable) {
    level = 'green';
    label = '✅ Acceptable — No Threat';
    msg = 'Mite population poses no current threat. Continue regular monitoring per AUBEE schedule.';
    return { level, label, msg, recs:[], phase:thresh.label, thresh, nextWash: period.inspFreq * 2 };
  }
  if (pct < thresh.danger) {
    level = 'yellow';
    label = '⚠️ Caution — Prepare to Act';
    msg = 'Mite population is reading levels that may soon cause damage. Non-chemical control should be employed. Chemical control may need to be employed within a month. Resample in 14 days.';
    // Non-chemical first per AUBEE
    var cauRecs = [
      { id:'drone-brood', name:'🖼️ Drone Brood Frame Removal (Non-Chemical)', note:'Per AUBEE: first-line response at Caution level. Insert drone comb frame, allow queen to lay, remove and freeze when capped. Reduces mite load 30–40%.', warn:'', isNonChem:true }
    ];
    // Add supers-safe chemical options
    if (supersOn) {
      cauRecs.push({ id:'formic-pro', name:'Formic Pro (MAQS)', note:'Safe with supers on. Only treatment that penetrates capped brood.', warn:'⚠️ Temps 50–85°F. Above 92°F risks brood/queen mortality', isNonChem:false });
      cauRecs.push({ id:'hopguard3', name:'HopGuard 3', note:'Safe with supers on. Organic hop extract.', warn:'⚠️ Less effective with heavy brood', isNonChem:false });
    } else {
      cauRecs.push({ id:'formic-pro', name:'Formic Pro (MAQS)', note:'Penetrates capped brood. Can use with or without supers.', warn:'⚠️ Temps 50–85°F', isNonChem:false });
      cauRecs.push({ id:'apiguard', name:'Apiguard (Thymol gel)', note:'Natural, no resistance. Good fall option.', warn:'⚠️ Must be above 59°F (15°C)', isNonChem:false });
    }
    return { level, label, msg, recs:cauRecs, phase:thresh.label, thresh, nextWash:14 };
  }

  // Danger level
  level = 'red';
  label = '🔴 Danger — Colony Loss Likely';
  msg = 'Colony loss is likely unless the beekeeper controls mites. Begin treatment immediately. Do not repeat the same chemical used earlier this season.';
  var danRecs = [];
  if (supersOn) {
    danRecs.push({ id:'formic-pro', name:'Formic Pro (MAQS) — URGENT', note:'Only organic option safe during flow. Only treatment penetrating capped brood. Apply immediately.', warn:'⚠️ Temps must be 50–85°F. Above 92°F risks brood/queen mortality', isNonChem:false });
    danRecs.push({ id:'hopguard3', name:'HopGuard 3', note:'Safe with supers on. Use alongside Formic Pro if possible.', warn:'', isNonChem:false });
    danRecs.push({ id:'varroxsan', name:'Varroxsan (OA Strips)', note:'Safe with supers on. Slow-release oxalic acid.', warn:'', isNonChem:false });
  } else if (broodless) {
    danRecs.push({ id:'apibioxal-oav', name:'Api-Bioxal OAV — MOST EFFECTIVE', note:'Broodless = near 100% efficacy. All mites are exposed on bees. Treat immediately.', warn:'⛔ FULL PPE REQUIRED — respirator, gloves, goggles', isNonChem:false });
  } else {
    danRecs.push({ id:'apivar', name:'Apivar (Amitraz Strips) — MOST EFFECTIVE', note:'Most effective synthetic option when supers are off. 42–56 day treatment.', warn:'⚠️ Do not repeat if used earlier this season — resistance risk', isNonChem:false });
    danRecs.push({ id:'formic-pro', name:'Formic Pro (MAQS)', note:'Fast acting. Penetrates capped brood.', warn:'⚠️ Temps 50–85°F', isNonChem:false });
    danRecs.push({ id:'apiguard', name:'Apiguard (Thymol)', note:'Organic alternative. No resistance known.', warn:'⚠️ Must be above 59°F (15°C)', isNonChem:false });
    danRecs.push({ id:'apilife-var', name:'Api Life VAR', note:'Organic essential oil blend.', warn:'⚠️ Use 65–95°F only — not above 95°F', isNonChem:false });
  }
  return { level, label, msg, recs:danRecs, phase:thresh.label, thresh, nextWash:21 };
}
function getAlabamaSeason() {
  var m = new Date().getMonth() + 1; // 1-12
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'fall';
  return 'winter';
}
function getAlabamaPeriod() {
  var m = new Date().getMonth() + 1;
  if (m === 1 || m === 2) return { label:'Winter Cluster', inspFreq:30, miteThresh:1, supersOn:false, washNeeded:false, desc:'Only inspect on days above 55°F. Do not break cluster.' };
  if (m === 3) return { label:'Pre-Flow Buildup', inspFreq:14, miteThresh:1, supersOn:false, washNeeded:true, desc:'First full inspection of the year. Strict mite threshold — colonies are rebuilding.' };
  if (m === 4 || m === 5) return { label:'Spring Nectar Flow', inspFreq:7, miteThresh:2, supersOn:true, washNeeded:false, desc:'Peak swarm season. Check for swarm cells every visit. No mite treatments with supers on.' };
  if (m === 6) return { label:'End of Spring Flow', inspFreq:14, miteThresh:2, supersOn:false, washNeeded:true, desc:'Harvest window. Remove supers when flow ends. Critical time for summer mite wash.' };
  if (m === 7) return { label:'Summer Dearth', inspFreq:14, miteThresh:2, supersOn:false, washNeeded:false, desc:'Robbing pressure high. Keep entrance reduced. Monitor SHB closely in the heat.' };
  if (m === 8) return { label:'Peak Mite Season', inspFreq:14, miteThresh:2, supersOn:false, washNeeded:true, desc:'Most critical mite month in Alabama. Varroa populations explode. Treat aggressively if needed.' };
  if (m === 9 || m === 10) return { label:'Fall Flow & Winter Prep', inspFreq:21, miteThresh:2, supersOn:false, washNeeded:m===10, desc:'Goldenrod and asters flowing. Assess winter stores. Final treatment window before cold.' };
  return { label:'Pre-Winter', inspFreq:14, miteThresh:1, supersOn:false, washNeeded:true, desc:'Last treatment window before winter cluster. OA vaporization when broodless is near 100% effective. Reduce entrance. Ensure adequate stores for winter — this is the most critical month to catch a mite problem before it\'s too late.' };
}


// SHB recommendations
// NOTE: There is no scientifically established numeric threshold for SHB — unlike Varroa mite percentages,
// these levels are practical management guidelines based on colony strength vs. beetle pressure (per UA FSA7075).
// Alabama's summer heat accelerates the SHB lifecycle to ~23 days per generation (vs. ~39 days in cooler climates),
// meaning infestations can escalate faster here than in other regions (USDA ARS research).
function getSHBRecs(level) {
  if (level === 'low') return { level:'green', label:'✅ Low — Bees in Control', msg:'Beetle numbers manageable. Maintain traps and monitor. Note: there is no established numeric SHB threshold — these levels are management guidelines based on colony strength vs. beetle pressure.', recs:[
    { name:'Freeman Beetle Trap or Beetle Blaster', note:'Keep oil traps maintained on bottom board. Replace oil every 2–3 weeks in Alabama heat.', warn:'' },
    { name:'Full Sun Placement', note:'SHB larvae cannot survive in dry, hot soil. Full sun strongly discourages pupation and reproduction.', warn:'' }
  ]};
  if (level === 'moderate') return { level:'yellow', label:'⚠️ Moderate — Action Needed', msg:'Beetle numbers increasing. Alabama\'s heat means infestations can escalate fast — full SHB lifecycle can complete in ~23 days in summer. Add traps and inspect weekly.', recs:[
    { name:'Add Beetle Barn traps between frames', note:'Place 1–2 between brood frames where bees cluster.', warn:'' },
    { name:'Refresh oil traps weekly', note:'In Alabama summer heat, oil degrades quickly. Check every 7 days.', warn:'' },
    { name:'Reduce hive space', note:'Consolidate to what bees can actively defend. Remove any empty supers — over-supering gives beetles space to hide and lay.', warn:'' }
  ]};
  if (level === 'high') return { level:'orange', label:'🟠 High — Intervene Now', msg:'Beetles gaining ground. Immediate action required to prevent colony loss.', recs:[
    { name:'CheckMite+ (Coumaphos) — Corrugated Cardboard Method', note:'Cut ONE strip in half crossways. Staple both pieces to the corrugated side of a 4×4" cardboard square — cover the smooth side with tape so bees cannot chew it. Place strip-side DOWN in center of bottom board so beetles shelter in corrugations and contact the strip but bees cannot. If using a screen bottom board, place above the inner cover instead. Leave 42–45 days (min 42, never more than 45). Max 4 SHB treatments per year. Do not use during honey flow.', warn:'⚠️ Do not place honey supers until 14 days after strip removal. Chemical-resistant gloves required — not leather bee gloves.' },
    { name:'Reduce to single brood box', note:'Give bees only what they can actively defend. Remove supers — excess space is the beetle\'s greatest advantage.', warn:'' },
    { name:'GardStar soil drench around hive', note:'Mix 5ml GardStar 40% EC per gallon of water. Apply by watering can late evening — never spray near hive surfaces. Drench 18–24 inches around base. Kills beetle larvae before they can pupate. Remains active 30–90 days depending on soil conditions.', warn:'⚠️ Permethrin is highly toxic to bees — do not contact any hive surface or landing board. Apply late evening only.' }
  ]};
  return { level:'red', label:'🔴 Critical — Colony at Risk', msg:'Larvae visible or comb sliming present. Look for honey with a glistening, slimy appearance and a fermented odor like decaying oranges — these are positive signs of active beetle larvae damage. Colony could collapse within days without intervention.', recs:[
    { name:'Emergency consolidation', note:'Combine with a stronger colony immediately if possible.', warn:'⚠️ Check for disease before combining' },
    { name:'Remove and freeze affected comb', note:'24–48 hours at 10°F (−12°C) kills all beetle life stages. Ruined honey can be washed from comb before freezing — comb may be salvageable.', warn:'' },
    { name:'Steinernema carpocapsae nematodes in soil', note:'Auburn/USDA research confirms S. carpocapsae is the most effective biological control for Alabama soils — outperforms S. riobrave across all Alabama soil types tested, achieving up to 94% SHB colonization in sandy loam soils. Apply around hive base when soil is moist.', warn:'⚠️ Efficacy varies by soil type — best results in sandy loam soils common to Alabama' },
    { name:'CheckMite+ (Coumaphos) — Corrugated Cardboard Method', note:'Cut ONE strip in half. Staple to corrugated cardboard square strip-side DOWN. Place on bottom board (or above inner cover if SBB). 42–45 days. Max 4 treatments/year for SHB. Do not use during honey flow.', warn:'⚠️ Chemical-resistant gloves required. No supers until 14 days after removal.' }
  ]};
}

// Next inspection recommendation
function getNextInspDate(data, period) {
  var days = period.inspFreq;
  // Override based on findings
  if (data.queenSeen === 'No ✗') days = 5;
  else if (data.queenSeen === 'Eggs Only') days = 7;
  else if (data.varroa === 'High (>4%)') days = 7;
  else if (data.varroa === 'Medium (2-4%)') days = Math.min(days, 14);
  else if (data.shbLevel === 'high' || data.shbLevel === 'critical') days = 7;
  else if (data.population <= 2) days = Math.min(days, 7);
  else if (data.swarmCells === 'Yes') days = 5;
  var d = new Date();
  d.setDate(d.getDate() + days);
  return { date: d.toISOString().slice(0,10), days: days };
}

// State object for the guided inspection
var _GINSP = {};

function openInspChoice(hiveId) {
  if (!DATA.hives.length) { alert('Please add a hive first!'); return; }
  var h = '<div class="modal-title">🔍 Add Inspection</div>';
  h += '<button class="choice-btn" onclick="startGuidedInsp(\''+( hiveId||'')+'\')"><div class="choice-ico">🧭</div><div><div class="choice-title">Guided Walkthrough</div><div class="choice-sub">Step-by-step with Alabama seasonal recommendations & mite/SHB action plan</div></div></button>';
  h += '<button class="choice-btn" onclick="closeModal();openInspModal();"><div class="choice-ico">📋</div><div><div class="choice-title">Quick Entry</div><div class="choice-sub">Fill out the inspection form manually</div></div></button>';
  h += '<button class="btn btn-c" onclick="closeModal()" style="margin-top:4px">Cancel</button>';
  openModal(h);
}

function startGuidedInsp(hiveId) {
  var period = getAlabamaPeriod();
  var today = new Date().toISOString().slice(0,10);
  var WX = window._wx;
  var selWx = '☀️ Sunny';
  if (WX) {
    var dl = WX.desc.toLowerCase();
    if (dl.includes('rain')||dl.includes('drizzle')||dl.includes('thunder')) selWx='🌧️ Rainy';
    else if (dl.includes('cloud')||dl.includes('fog')||dl.includes('overcast')) selWx='⛅ Cloudy';
    else if (dl.includes('wind')) selWx='🌬️ Windy';
  }
  _GINSP = {
    step: 1, totalSteps: 5,
    hiveId: hiveId || (DATA.hives[0] ? DATA.hives[0].id : ''),
    date: today, weather: selWx, weatherSnap: WX ? {temp:WX.temp,desc:WX.desc,wind:WX.wind} : null,
    // Step 2
    entranceActivity:'Normal', beardingOrFanning:false, deadBeesOutside:false, robbingActivity:false,
    // Step 3
    queenSeen:'Yes ✓', population:3, brood:3, swarmCells:'No', temperament:'Calm',
    // Step 4
    honey:3, pollenAdequate:true, feedingNeeded:false,
    // Step 5 — mites & SHB
    miteWashDone:false, miteCount:0, miteTotal:100, shbLevel:'low',
    varroa:'Not checked',
    // Step 6 — actions
    actions:'', notes:'', period: period
  };
  renderGuidedStep();
}

function renderGuidedStep() {
  var s = _GINSP.step;
  var total = _GINSP.totalSteps;
  var period = _GINSP.period;

  // Progress bar
  var prog = '<div class="ginsp-progress">';
  for (var i=1; i<=total; i++) {
    prog += '<div class="ginsp-step-dot '+(i<s?'done':i===s?'active':'')+'"></div>';
  }
  prog += '</div>';

  var body = '';

  if (s === 1) {
    // Step 1: Hive selection, date, weather + seasonal context
    var hiveOpts = DATA.hives.map(function(h){ return '<option value="'+h.id+'"'+(_GINSP.hiveId===h.id?' selected':'')+'>'+esc(h.name)+'</option>'; }).join('');
    var WX = window._wx;
    var wxBanner = WX ? '<div style="background:linear-gradient(135deg,#1a3a5c,#2563a8);border-radius:12px;padding:11px;color:#fff;font-size:13px;display:flex;align-items:center;gap:10px;margin-bottom:12px"><span style="font-size:22px">'+WX.icon+'</span><span>'+WX.temp+'°F · '+WX.desc+' · 💨'+WX.wind+'mph</span></div>' : '';
    body += '<div class="ginsp-step-title">Step 1 — Setup</div>';
    body += '<div class="ginsp-step-sub">'+period.label+' · '+period.desc+'</div>';
    body += wxBanner;
    body += '<div class="ginsp-alert '+(period.label.includes('Winter')?'yellow':'green')+'">📅 <strong>Alabama '+period.label+'</strong> — Recommended inspection frequency: every <strong>'+period.inspFreq+' days</strong>.'+(period.washNeeded?' <strong>Alcohol wash recommended this month.</strong>':'')+'</div>';
    body += '<div class="fg"><label>Hive</label><select id="gi-hive" onchange="_GINSP.hiveId=this.value">'+hiveOpts+'</select></div>';
    body += '<div class="fg"><label>Date</label><input id="gi-date" type="date" value="'+_GINSP.date+'" onchange="_GINSP.date=this.value"></div>';
    body += '<div class="fg"><label>Weather</label>'+makePills('gi-wx',['☀️ Sunny','⛅ Cloudy','🌧️ Rainy','🌬️ Windy'],_GINSP.weather)+'</div>';

  } else if (s === 2) {
    // Step 2: Exterior check
    body += '<div class="ginsp-step-title">Step 2 — Exterior Check</div>';
    body += '<div class="ginsp-step-sub">Before opening — assess the hive from outside.</div>';
    body += '<div class="fg"><label>Entrance Activity</label>'+makePills('gi-entrance',['Normal','Sluggish','Very Active'],_GINSP.entranceActivity)+'</div>';
    body += '<div class="fg"><label>Bearding or Fanning at Entrance?</label>'+makePills('gi-beard',['No','Yes'],_GINSP.beardingOrFanning?'Yes':'No')+'</div>';
    body += '<div class="fg"><label>Dead Bees Outside Hive?</label>'+makePills('gi-dead',['No','A Few','Many'],_GINSP.deadBeesOutside)+'</div>';
    body += '<div class="fg"><label>Signs of Robbing?</label>'+makePills('gi-rob',['No','Possible','Yes'],_GINSP.robbingActivity)+'</div>';
    if (period.supersOn) body += '<div class="ginsp-alert yellow">🌸 <strong>Spring Flow Active</strong> — Watch closely for swarm preparations. Inspect for queen cells this visit.</div>';

  } else if (s === 3) {
    // Step 3: Brood & queen
    body += '<div class="ginsp-step-title">Step 3 — Brood & Queen</div>';
    body += '<div class="ginsp-step-sub">Work through the brood box frame by frame.</div>';
    body += '<div class="fg"><label>Queen Seen?</label>'+makePills('gi-queen',['Yes ✓','No ✗','Eggs Only'],_GINSP.queenSeen)+'</div>';
    body += '<div class="fg"><label>Population Strength</label>'+makeStars('gi-pop',_GINSP.population)+'</div>';
    body += '<div class="fg"><label>Brood Pattern</label>'+makeStars('gi-brood',_GINSP.brood)+'</div>';
    body += '<div class="fg"><label>Swarm Cells Present?</label>'+makePills('gi-swarm',['No','Yes — Removed','Yes — Left'],_GINSP.swarmCells)+'</div>';
    body += '<div class="fg"><label>Temperament</label>'+makePills('gi-temp',['Calm','Moderate','Defensive'],_GINSP.temperament)+'</div>';
    if (period.label.includes('Spring')) body += '<div class="ginsp-alert yellow">🐝 <strong>Swarm Season:</strong> Any capped queen cells at bottom of frame = swarm imminent. Act today if found.</div>';

  } else if (s === 4) {
    // Step 4: Stores & SHB
    body += '<div class="ginsp-step-title">Step 4 — Stores & Beetles</div>';
    body += '<div class="ginsp-step-sub">Assess food stores and small hive beetle pressure.</div>';
    body += '<div class="fg"><label>Honey Stores</label>'+makeStars('gi-honey',_GINSP.honey)+'</div>';
    body += '<div class="fg"><label>Pollen Adequate?</label>'+makePills('gi-pollen',['Yes','Low','No'],_GINSP.pollenAdequate?'Yes':'No')+'</div>';
    body += '<div class="fg"><label>Feeding Needed?</label>'+makePills('gi-feed',['No','Yes — 1:1 Syrup (Spring)','Yes — 2:1 Syrup (Fall)','Yes — Fondant / Candy Board (Winter)','Yes — Pollen Patties','Yes — Syrup & Patties'],_GINSP.feedingNeeded?'Yes — 1:1 Syrup (Spring)':'No')+'</div>';
    body += '<div class="fg"><label>Small Hive Beetle Level</label>'+makePills('gi-shb',['Low (0–5)','Moderate (5–20)','High (20+)','Critical — Larvae Visible'],_GINSP.shbLevel==='low'?'Low (0–5)':_GINSP.shbLevel==='moderate'?'Moderate (5–20)':_GINSP.shbLevel==='high'?'High (20+)':'Critical — Larvae Visible')+'</div>';
    if (period.label.includes('Summer')||period.label.includes('Dearth')||period.label.includes('Peak')) {
      body += '<div class="ginsp-alert orange">🪲 <strong>Peak SHB Season</strong> — Alabama July–August is highest risk. Check oil traps weekly. Full sun placement critical.</div>';
    }
    if (period.supersOn) body += '<div class="ginsp-alert green">📦 <strong>Supers On:</strong> If box is 60–70% full, consider adding another super to prevent swarm pressure.</div>';

  } else if (s === 5) {
    body += '<div class="ginsp-step-title">Step 5 — Varroa & Wrap Up</div>';
    body += '<div class="ginsp-step-sub">Record mite wash results and final notes.</div>';
    body += '<div class="fg"><label>Is Colony Currently Broodless?</label>'+makePills('gi-broodless',['No','Yes — No Capped Brood'],_GINSP.broodless?'Yes — No Capped Brood':'No')+'</div>';
    body += '<div class="fg"><label>Alcohol Wash Done This Visit?</label>'+makePills('gi-washdone',['No','Yes'],_GINSP.miteWashDone?'Yes':'No')+'</div>';
    body += '<div id="gi-wash-fields" style="'+(!_GINSP.miteWashDone?'display:none':'')+'"><div class="row2"><div class="fg"><label>Mites Counted</label><input id="gi-mitecount" type="number" value="'+_GINSP.miteCount+'" placeholder="0" min="0"></div><div class="fg"><label>Bees Sampled</label><input id="gi-mitetotal" type="number" value="'+_GINSP.miteTotal+'" placeholder="100" min="1"></div></div></div>';
    if (period.washNeeded) body += '<div class="ginsp-alert yellow">🧪 <strong>Wash Recommended This Month</strong> — '+period.label+' is a key AUBEE monitoring point for Alabama colonies.</div>';
    body += '<div class="fg" style="margin-top:4px"><label>Actions Taken</label><textarea id="gi-actions" placeholder="e.g. Added super, replaced oil trap, treated for varroa…">'+esc(_GINSP.actions)+'</textarea></div>';
    body += '<div class="fg"><label>Additional Notes</label><textarea id="gi-notes" placeholder="Observations, concerns, next steps…">'+esc(_GINSP.notes)+'</textarea></div>';
    body += '<script>document.getElementById("gi-washdone").addEventListener("click",function(e){if(e.target.classList.contains("pill")){var show=e.target.textContent==="Yes";document.getElementById("gi-wash-fields").style.display=show?"":"none";}});<\/script>';
  }

  // Nav buttons
  var nav = '<div class="ginsp-nav">';
  if (s > 1) nav += '<button class="btn btn-c" style="flex:1" onclick="ginspBack()">← Back</button>';
  if (s < total) nav += '<button class="btn btn-p" style="flex:2" onclick="ginspNext()">Next →</button>';
  else nav += '<button class="btn btn-p" style="flex:2" onclick="saveGuidedInsp()">💾 Save Inspection</button>';
  nav += '</div>';
  nav += '<button class="btn btn-c" style="margin-top:6px" onclick="closeModal()">Cancel</button>';

  openModal(prog + body + nav);
}

function ginspNext() {
  var s = _GINSP.step;
  var period = _GINSP.period;

  if (s === 1) {
    _GINSP.hiveId = document.getElementById('gi-hive').value;
    _GINSP.date = document.getElementById('gi-date').value;
    _GINSP.weather = getPill('gi-wx');
  } else if (s === 2) {
    _GINSP.entranceActivity = getPill('gi-entrance');
    _GINSP.beardingOrFanning = getPill('gi-beard') === 'Yes';
    _GINSP.deadBeesOutside = getPill('gi-dead');
    _GINSP.robbingActivity = getPill('gi-rob');
  } else if (s === 3) {
    _GINSP.queenSeen = getPill('gi-queen');
    _GINSP.population = getStar('gi-pop');
    _GINSP.brood = getStar('gi-brood');
    _GINSP.swarmCells = getPill('gi-swarm');
    _GINSP.temperament = getPill('gi-temp');
  } else if (s === 4) {
    _GINSP.honey = getStar('gi-honey');
    _GINSP.pollenAdequate = getPill('gi-pollen') === 'Yes';
    _GINSP.feedingNeeded = getPill('gi-feed') !== 'No';
    var shbPill = getPill('gi-shb');
    _GINSP.shbLevel = shbPill.includes('Low')?'low':shbPill.includes('Moderate')?'moderate':shbPill.includes('High')?'high':'critical';
  } else if (s === 5) {
    _GINSP.broodless = getPill('gi-broodless') === 'Yes — No Capped Brood';
    _GINSP.miteWashDone = getPill('gi-washdone') === 'Yes';
    if (_GINSP.miteWashDone) {
      _GINSP.miteCount = parseInt(document.getElementById('gi-mitecount').value) || 0;
      _GINSP.miteTotal = parseInt(document.getElementById('gi-mitetotal').value) || 100;
    }
    _GINSP.actions = document.getElementById('gi-actions').value.trim();
    _GINSP.notes = document.getElementById('gi-notes').value.trim();
  }

  _GINSP.step++;
  renderGuidedStep();
}

function ginspBack() {
  _GINSP.step--;
  renderGuidedStep();
}

async function saveGuidedInsp() {
  _GINSP.broodless = getPill('gi-broodless') === 'Yes — No Capped Brood';
  _GINSP.miteWashDone = getPill('gi-washdone') === 'Yes';
  if (_GINSP.miteWashDone) {
    _GINSP.miteCount = parseInt(document.getElementById('gi-mitecount').value) || 0;
    _GINSP.miteTotal = parseInt(document.getElementById('gi-mitetotal').value) || 100;
  }
  _GINSP.actions = document.getElementById('gi-actions').value.trim();
  _GINSP.notes = document.getElementById('gi-notes').value.trim();

  var period = _GINSP.period;

  // Calculate varroa %
  var mitePct = 0;
  var varroaLabel = 'Not checked';
  if (_GINSP.miteWashDone && _GINSP.miteTotal > 0) {
    mitePct = (_GINSP.miteCount / _GINSP.miteTotal) * 100;
    if (mitePct < 1) varroaLabel = 'Low (<2%)';
    else if (mitePct < 2) varroaLabel = 'Low (<2%)';
    else if (mitePct < 4) varroaLabel = 'Medium (2-4%)';
    else varroaLabel = 'High (>4%)';
  }

  // Build inspection notes with exterior & stores observations
  var autoNotes = [];
  if (_GINSP.entranceActivity !== 'Normal') autoNotes.push('Entrance: '+_GINSP.entranceActivity);
  if (_GINSP.beardingOrFanning) autoNotes.push('Bearding/fanning observed');
  if (_GINSP.deadBeesOutside && _GINSP.deadBeesOutside !== 'No') autoNotes.push('Dead bees outside: '+_GINSP.deadBeesOutside);
  if (_GINSP.robbingActivity && _GINSP.robbingActivity !== 'No') autoNotes.push('Robbing signs: '+_GINSP.robbingActivity);
  if (_GINSP.swarmCells !== 'No') autoNotes.push('Swarm cells: '+_GINSP.swarmCells);
  if (!_GINSP.pollenAdequate) autoNotes.push('Pollen stores low');
  if (_GINSP.feedingNeeded) autoNotes.push('Feeding recommended');
  if (_GINSP.shbLevel !== 'low') autoNotes.push('SHB level: '+_GINSP.shbLevel);
  if (_GINSP.miteWashDone) autoNotes.push('Alcohol wash: '+_GINSP.miteCount+'/'+_GINSP.miteTotal+' = '+mitePct.toFixed(1)+'%');
  var fullNotes = (autoNotes.length ? autoNotes.join(' · ') + (_GINSP.notes ? '\n' : '') : '') + (_GINSP.notes || '');

  // Save inspection to DB
  var tid = 'i' + Date.now();
  var obj = {
    hive_id: _GINSP.hiveId,
    date: _GINSP.date,
    weather: _GINSP.weather,
    weather_snap: _GINSP.weatherSnap,
    queen_seen: _GINSP.queenSeen,
    population: _GINSP.population,
    honey: _GINSP.honey,
    brood: _GINSP.brood,
    temperament: _GINSP.temperament,
    varroa: varroaLabel,
    actions: _GINSP.actions,
    notes: fullNotes
  };
  var row = await dbInsert('inspections', obj);
  if (row) DATA.inspections.push({...row, hiveId:row.hive_id, queenSeen:row.queen_seen, weatherSnap:row.weather_snap});

  closeModal();

  // Show results & recommendations
  showInspResults(mitePct, period);
}

function showInspResults(mitePct, period, broodless) {
  var varRec = _GINSP.miteWashDone ? getVarroaRecs(mitePct, period, _GINSP.broodless) : null;
  var shbRec = getSHBRecs(_GINSP.shbLevel);
  var nextInsp = getNextInspDate(_GINSP, period);
  var hive = DATA.hives.find(function(h){return h.id===_GINSP.hiveId;});

  var h = '<div class="modal-title">Inspection Complete</div>';
  h += '<div style="font-size:13px;color:var(--txt2);margin-bottom:14px">'+(hive?esc(hive.name)+' · ':'')+_GINSP.date+'</div>';

  // Varroa results
  if (varRec) {
    h += '<div style="font-family:\'Playfair Display\',serif;font-size:15px;color:var(--bark);margin-bottom:8px">🧪 Varroa Results</div>';
    h += '<div class="ginsp-alert '+varRec.level+'"><strong>'+varRec.label+'</strong><br>';
    h += '<span style="font-size:11px;opacity:.8">Phase: '+varRec.phase+' · Acceptable: &lt;'+varRec.thresh.acceptable+'% · Danger: &gt;'+varRec.thresh.danger+'%</span><br>';
    h += mitePct.toFixed(1)+'% ('+_GINSP.miteCount+' mites / '+_GINSP.miteTotal+' bees)<br>'+varRec.msg+'</div>';

    if (varRec.recs.length) {
      h += '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--txt2);margin:10px 0 6px">Recommended Actions — Tap to expand</div>';
      varRec.recs.forEach(function(r){
        var treatData = VARROA_TREATMENTS.find(function(t){return t.id===r.id;});
        h += '<div class="tref-card" style="margin-bottom:8px">';
        h += '<div class="tref-header" onclick="toggleTref(this)" style="padding:12px">';
        h += '<div class="tref-ico '+(r.isNonChem?'nonchemical':treatData?treatData.class:'organic')+'" style="width:36px;height:36px;font-size:16px">'+(r.isNonChem?'🌿':treatData?treatData.icon:'💊')+'</div>';
        h += '<div style="flex:1"><div class="tref-name" style="font-size:14px">'+esc(r.name)+'</div><div style="font-size:11px;color:var(--txt2);margin-top:2px">'+esc(r.note)+'</div></div>';
        h += '<div class="tref-chevron">▼</div>';
        h += '</div>';
        h += '<div class="tref-body">';
        if (r.warn) h += '<div class="tref-warn">'+esc(r.warn)+'</div>';
        if (r.isNonChem) {
          var nc = NONCHEMICAL_CONTROLS.find(function(n){return n.name.includes('Drone');});
          if (nc) {
            h += '<div class="tref-section"><div class="tref-section-title">How It Works</div><div style="font-size:13px;line-height:1.6">'+nc.desc+'</div></div>';
            h += '<div class="tref-section"><div class="tref-section-title">Steps</div>';
            nc.steps.forEach(function(s,i){ h += '<div class="tref-row"><span class="tref-row-ico">'+(i+1)+'.</span><span style="font-size:13px">'+s+'</span></div>'; });
            h += '</div>';
          }
        } else if (treatData) {
          h += '<div class="tref-section"><div class="tref-section-title">How to Apply</div>';
          treatData.howToApply.forEach(function(s,i){ h += '<div class="tref-row"><span class="tref-row-ico">'+(i+1)+'.</span><span style="font-size:13px;line-height:1.5">'+s+'</span></div>'; });
          h += '</div>';
          h += '<div class="tref-section"><div class="tref-section-title">Duration</div><div style="font-size:13px">⏱ '+treatData.duration+'</div></div>';
          h += '<div class="tref-section"><div class="tref-section-title">Temperature</div><div style="font-size:13px">🌡️ '+treatData.temperature+'</div></div>';
          h += '<div class="tref-section"><div class="tref-section-title">PPE Required</div><div style="font-size:13px;white-space:pre-line">🥼 '+treatData.ppe+'</div></div>';
          if (treatData.warnings.length) {
            h += '<div class="tref-section"><div class="tref-section-title">Warnings</div>';
            treatData.warnings.forEach(function(w){ h += '<div class="tref-warn" style="margin-bottom:4px">'+w+'</div>'; });
            h += '</div>';
          }
          h += '<div class="tref-note">'+treatData.followUp+'</div>';
        }
        h += '</div></div>';
      });
    }
  } else {
    h += '<div class="ginsp-alert yellow">🧪 No alcohol wash done this visit. AUBEE recommends 4 washes per year — see schedule in the 📚 Library tab.</div>';
  }

  // SHB results
  h += '<div style="font-family:\'Playfair Display\',serif;font-size:15px;color:var(--bark);margin:14px 0 8px">🪲 Small Hive Beetle</div>';
  h += '<div class="ginsp-alert '+shbRec.level+'"><strong>'+shbRec.label+'</strong><br>'+shbRec.msg+'</div>';
  if (shbRec.recs.length) {
    shbRec.recs.forEach(function(r){
      h += '<div class="ginsp-rec"><div class="ginsp-rec-name">'+esc(r.name)+'</div><div class="ginsp-rec-note">'+esc(r.note)+'</div>'+(r.warn?'<div class="ginsp-rec-warn">'+esc(r.warn)+'</div>':'')+'</div>';
    });
  }

  // Queen alert
  if (_GINSP.queenSeen === 'No ✗') {
    h += '<div class="ginsp-alert red" style="margin-top:14px">👑 <strong>Queen Not Seen</strong> — Check for eggs and young larvae. Recheck in 5 days. If no eggs found colony may be queenless.</div>';
  } else if (_GINSP.queenSeen === 'Eggs Only') {
    h += '<div class="ginsp-alert yellow" style="margin-top:14px">👑 <strong>Eggs Only — Queen Present But Unseen</strong> — Recheck in 7 days to confirm laying pattern.</div>';
  }

  // Swarm alert
  if (_GINSP.swarmCells && _GINSP.swarmCells !== 'No') {
    h += '<div class="ginsp-alert orange" style="margin-top:8px">🐝 <strong>Swarm Cells Found</strong> — Monitor closely. Consider splitting the colony to prevent a swarm.</div>';
  }

  // Next inspection
  h += '<div style="font-family:\'Playfair Display\',serif;font-size:15px;color:var(--bark);margin:14px 0 8px">📅 Next Inspection</div>';
  h += '<div class="ginsp-alert green">Recommended next visit in <strong>'+nextInsp.days+' days</strong> — <strong>'+fmtDate(nextInsp.date)+'</strong></div>';
  h += '<button class="btn btn-p" onclick="addInspReminder(\''+nextInsp.date+'\',\''+_GINSP.hiveId+'\')">📅 Add Reminder for '+fmtDate(nextInsp.date)+'</button>';
  if (varRec && varRec.nextWash && _GINSP.miteWashDone) {
    var washDate = new Date(); washDate.setDate(washDate.getDate() + varRec.nextWash);
    var washDateStr = washDate.toISOString().slice(0,10);
    h += '<button class="btn btn-s" style="margin-top:6px" onclick="addWashReminder(\''+washDateStr+'\',\''+_GINSP.hiveId+'\')">🧪 Add Mite Recheck Reminder ('+fmtDate(washDateStr)+')</button>';
  }
  h += '<button class="btn btn-c" style="margin-top:6px" onclick="closeModal();renderAll();">Done</button>';
  openModal(h);
}

async function addInspReminder(date, hiveId) {
  var hive = DATA.hives.find(function(h){return h.id===hiveId;});
  var obj = {rem_type:'Inspection', hive_id:hiveId, next_date:date, notes:'Next inspection — recommended by guided walkthrough', item_name:'', item_qty:'', item_cost:null, supplier_id:null, completed:false, added_to_finance:false};
  var row = await dbInsert('reminders', obj);
  if (row) DATA.reminders.push({...row, hiveId:row.hive_id, nextDate:row.next_date, remType:row.rem_type, itemName:row.item_name, itemCost:row.item_cost, itemQty:row.item_qty, supplierId:row.supplier_id, addedToFinance:row.added_to_finance});
  var btn = event.target; btn.textContent = '✅ Reminder Added!'; btn.disabled = true;
  btn.style.background = 'rgba(90,110,58,.2)'; btn.style.color = 'var(--moss)';
}

async function addWashReminder(date, hiveId) {
  var obj = {rem_type:'Inspection', hive_id:hiveId, next_date:date, notes:'Alcohol wash mite recheck — post-treatment follow-up', item_name:'', item_qty:'', item_cost:null, supplier_id:null, completed:false, added_to_finance:false};
  var row = await dbInsert('reminders', obj);
  if (row) DATA.reminders.push({...row, hiveId:row.hive_id, nextDate:row.next_date, remType:row.rem_type, itemName:row.item_name, itemCost:row.item_cost, itemQty:row.item_qty, supplierId:row.supplier_id, addedToFinance:row.added_to_finance});
  var btn = event.target; btn.textContent = '✅ Recheck Reminder Added!'; btn.disabled = true;
  btn.style.background = 'rgba(90,110,58,.2)'; btn.style.color = 'var(--moss)';
}

