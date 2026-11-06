/* Christmas layer. Loaded only when SEASONAL_THEME in lib/seasonal-theme.ts is "christmas". */
(function () {
  var RED = '#8f1d1d';
  var CANE = 'M17 34V12a6.5 6.5 0 0 0-13 0';
  function cane(cls, stripe) {
    return '<svg class="' + cls + '" viewBox="0 0 24 38" aria-hidden="true"><path d="' + CANE +
      '" fill="none" stroke="#fff7ea" stroke-width="6" stroke-linecap="round"/><path d="' + CANE +
      '" fill="none" stroke="' + stripe + '" stroke-width="6" stroke-dasharray="4 6"/></svg>';
  }
  function bulbs(xs, y, cls) {
    return '<g class="vh-tw ' + cls + '">' + xs.map(function (x) {
      return '<circle cx="' + x + '" cy="' + y + '" r="9" fill="#ffc65c" opacity=".28"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#ffe7ae"/>';
    }).join('') + '</g>';
  }
  var SWAG = '<svg viewBox="0 0 240 40" aria-hidden="true"><path d="M0 2Q60 28 120 2Q180 28 240 2" fill="none" stroke="#2b1f14" stroke-width="1.6"/>' +
    bulbs([30, 210], 21, '') + bulbs([60, 150], 24, 'b') + bulbs([90, 180], 21, 'c') + '</svg>';
  var HAT = '<svg class="vh-hat" viewBox="0 0 30 26" aria-hidden="true"><path d="M25 18C24 9 19 2 12 3C7 4 4 9 3 14L6 14C8 11 9 10 11 10C11 13 10 15 10 18Z" fill="' + RED +
    '"/><rect x="8" y="16" width="19" height="5" rx="2.5" fill="#fff" stroke="#cfc6b8" stroke-width=".8"/><circle cx="4.5" cy="16" r="3.2" fill="#fff" stroke="#cfc6b8" stroke-width=".8"/></svg>';

  function addHat() {
    var logo = document.querySelector('header strong');
    if (!logo || logo.querySelector('.vh-hat') || logo.textContent.indexOf('House') < 0) return;
    logo.setAttribute('aria-label', logo.textContent.trim());
    logo.innerHTML = logo.innerHTML.replace('House', '<span class="vh-house">House' + HAT + '</span>');
  }
  function addCanes() {
    document.querySelectorAll('header a[href*="rates"], #home-hero a[href*="rates"]').forEach(function (a) {
      if (!a.querySelector('.vh-cane')) a.insertAdjacentHTML('afterbegin', cane('vh-cane', '#d9a441'));
    });
  }
  function addHeroFx() {
    var hero = document.getElementById('home-hero');
    if (!hero || hero.querySelector('.vh-fx')) return;
    var mobile = window.innerWidth < 768;
    var fx = document.createElement('div');
    fx.className = 'vh-fx';
    fx.setAttribute('aria-hidden', 'true');
    var swags = Math.ceil(window.innerWidth / (mobile ? 160 : 240)) + 1;
    var html = '<div class="vh-lights">' + new Array(swags + 1).join(SWAG) + '</div>' +
      cane('vh-corner l', RED) + cane('vh-corner r', RED);
    var count = mobile ? 12 : 28;
    for (var i = 0; i < count; i++) {
      var size = 3 + (i * 7) % 4;
      html += '<span class="vh-flake" style="left:' + (i * 37) % 100 + '%;width:' + size + 'px;height:' + size +
        'px;opacity:' + (0.45 + (size - 3) * 0.13) + ';animation-duration:' + (9 + (i * 5) % 8) +
        's;animation-delay:-' + (i * 13) % 17 + 's"></span>';
    }
    fx.innerHTML = html;
    fx.style.setProperty('--vh-fall', hero.offsetHeight + 20 + 'px');
    hero.appendChild(fx);
  }
  function run() {
    document.documentElement.classList.add('vh-xmas');
    addHat(); addCanes(); addHeroFx();
  }
  if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 2000 });
  else setTimeout(run, 300);
})();
