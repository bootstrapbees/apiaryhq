// ═══════════════════════════════════════════════════════
// APIARY HQ — ONBOARDING SLIDE DECK
// 5 slides, localStorage auto-suppress after completion
// © 2026 Bootstrap Beekeeping. All rights reserved.
// ═══════════════════════════════════════════════════════

var _onboardSlide = 0;
var _ONBOARD_KEY = 'apiaryhq_onboarded';

var ONBOARD_SLIDES = [
  {
    icon: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:72px;height:72px"><path d="M32 6L50 17V39L32 50L14 39V17L32 6Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M32 20L40 25V35L32 40L24 35V25L32 20Z" fill="currentColor" opacity=".2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    title: 'Welcome to Apiary HQ',
    body: 'Your complete beekeeping companion — built for real beekeepers who want smart records without the paperwork.',
    color: 'var(--amber)'
  },
  {
    icon: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:72px;height:72px"><rect x="10" y="8" width="44" height="48" rx="6" stroke="currentColor" stroke-width="3"/><line x1="20" y1="24" x2="44" y2="24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="20" y1="34" x2="44" y2="34" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="20" y1="44" x2="32" y2="44" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
    title: 'Log Every Inspection',
    body: 'Record queen status, brood patterns, Varroa levels, temperament and more. The app remembers everything so you don\'t have to.',
    color: 'var(--moss)'
  },
  {
    icon: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:72px;height:72px"><path d="M32 8C20 8 12 18 12 28c0 8 6 14 6 14h28s6-6 6-14c0-10-8-20-20-20z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M22 42v10M42 42v10M18 52h28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
    title: 'Smart Feeding Logs',
    body: 'Track syrup, patties, dry sugar and fondant separately. Add supplements like HiveAlive. Feeding logs never spam your inspection reminders.',
    color: 'var(--amber)'
  },
  {
    icon: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:72px;height:72px"><circle cx="32" cy="32" r="22" stroke="currentColor" stroke-width="3"/><path d="M32 20v12l8 4" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 32h4M46 32h4M32 14v4M32 46v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    title: 'Phase-Aware Reminders',
    body: 'The app knows if you\'re in new-package phase, swarm season, or post-harvest. Reminders adjust automatically — no manual scheduling needed.',
    color: 'var(--forest)'
  },
  {
    icon: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:72px;height:72px"><path d="M32 10L38 24H54L42 33L46 48L32 39L18 48L22 33L10 24H26L32 10Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round" fill="currentColor" opacity=".15"/></svg>',
    title: 'Built for Bootstrap Beekeepers',
    body: 'No expensive equipment required. Just your hives, your bees, and a phone. Let\'s get started — add your first hive from the Home screen.',
    color: 'var(--amber)'
  }
];

function showOnboarding() {
  // Skip if already completed
  if (localStorage.getItem(_ONBOARD_KEY) === '1') return;
  _onboardSlide = 0;
  renderOnboardSlide();
  document.getElementById('onboard-overlay').classList.add('open');
}

function renderOnboardSlide() {
  var slide = ONBOARD_SLIDES[_onboardSlide];
  var total = ONBOARD_SLIDES.length;
  var isLast = _onboardSlide === total - 1;

  // Dots
  var dots = ONBOARD_SLIDES.map(function(_, i) {
    return '<div class="ob-dot' + (i === _onboardSlide ? ' active' : '') + '"></div>';
  }).join('');

  document.getElementById('onboard-inner').innerHTML =
    '<div class="ob-icon" style="color:' + slide.color + '">' + slide.icon + '</div>' +
    '<div class="ob-title">' + slide.title + '</div>' +
    '<div class="ob-body">' + slide.body + '</div>' +
    '<div class="ob-dots">' + dots + '</div>' +
    '<button class="btn btn-p ob-btn" onclick="onboardNext()">' +
      (isLast ? 'Get Started 🐝' : 'Next →') +
    '</button>' +
    (!isLast ? '<button class="btn btn-c ob-skip" onclick="onboardDismiss()">Skip</button>' : '');
}

function onboardNext() {
  if (_onboardSlide < ONBOARD_SLIDES.length - 1) {
    _onboardSlide++;
    renderOnboardSlide();
  } else {
    onboardDismiss();
  }
}

function onboardDismiss() {
  localStorage.setItem(_ONBOARD_KEY, '1');
  document.getElementById('onboard-overlay').classList.remove('open');
}

// Touch/swipe support for slides
(function() {
  var startX = 0;
  document.addEventListener('touchstart', function(e) {
    var ol = document.getElementById('onboard-overlay');
    if (!ol || !ol.classList.contains('open')) return;
    startX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', function(e) {
    var ol = document.getElementById('onboard-overlay');
    if (!ol || !ol.classList.contains('open')) return;
    var diff = e.changedTouches[0].clientX - startX;
    if (diff < -50 && _onboardSlide < ONBOARD_SLIDES.length - 1) {
      _onboardSlide++;
      renderOnboardSlide();
    } else if (diff > 50 && _onboardSlide > 0) {
      _onboardSlide--;
      renderOnboardSlide();
    }
  }, { passive: true });
})();
