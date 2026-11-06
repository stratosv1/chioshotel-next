/* Christmas layer. Loaded only when SEASONAL_THEME in lib/seasonal-theme.ts is "christmas". */
(function () {
  var RED = '#8f1d1d';
  var BOOKING = /(rates|kratisi|hotelpreise|tarifs|prezzi|precios|rezervasyon)/i;
  var CANE = 'M17 34V12a6.5 6.5 0 0 0-13 0';
  function cane(cls, stripe) {
    return '<svg class="' + cls + '" viewBox="0 0 24 38" aria-hidden="true"><path d="' + CANE +
      '" fill="none" stroke="#fff7ea" stroke-width="6" stroke-linecap="round"/><path d="' + CANE +
      '" fill="none" stroke="' + stripe + '" stroke-width="6" stroke-dasharray="4 6"/></svg>';
  }
  function bulbs(xs, y, cls) {
    return '<g class="vh-tw ' + cls + '">' + xs.map(function (x) {
      return '<circle cx="' + x + '" cy="' + y + '" r="9" fill="#ffb938" opacity=".4"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#ffdc7a" stroke="#a8701a" stroke-width=".8"/>';
    }).join('') + '</g>';
  }
  var SWAG = '<svg viewBox="0 0 240 40" aria-hidden="true"><path d="M0 2Q60 28 120 2Q180 28 240 2" fill="none" stroke="#2b1f14" stroke-width="1.6"/>' +
    bulbs([30, 210], 16, '') + bulbs([60, 150], 19, 'b') + bulbs([90, 180], 16, 'c') + '</svg>';
  var HAT = '<svg class="vh-hat" viewBox="0 0 30 26" aria-hidden="true"><path d="M25 18C24 9 19 2 12 3C7 4 4 9 3 14L6 14C8 11 9 10 11 10C11 13 10 15 10 18Z" fill="' + RED +
    '"/><rect x="8" y="16" width="19" height="5" rx="2.5" fill="#fff" stroke="#cfc6b8" stroke-width=".8"/><circle cx="4.5" cy="16" r="3.2" fill="#fff" stroke="#cfc6b8" stroke-width=".8"/></svg>';

  function addHat() {
    var logo = document.querySelector('header strong');
    if (!logo || logo.querySelector('.vh-hat') || logo.textContent.indexOf('House') < 0) return;
    logo.setAttribute('aria-label', logo.textContent.trim());
    logo.innerHTML = logo.innerHTML.replace('House', '<span class="vh-house">House' + HAT + '</span>');
  }
  function addCanes() {
    var heroBook = document.querySelector('#home-hero .grid a:last-child');
    var path = heroBook && heroBook.getAttribute('href');
    var links = Array.prototype.slice.call(document.querySelectorAll('header a')).filter(function (a) {
      var href = a.getAttribute('href') || '';
      return a.offsetParent !== null && (href === path || BOOKING.test(href));
    });
    if (heroBook) links.push(heroBook);
    links.forEach(function (a) {
      a.classList.add('vh-book');
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
  var TREE = '<svg class="vh-deco" viewBox="0 0 24 28" aria-hidden="true"><rect x="10.5" y="23" width="3" height="4" fill="#6f3f1d"/><path d="M12 3L5 12h3L3 19h4L1.500 25h21L17 19h4l-5-7h3z" fill="#1f4d2b"/><path d="M12 0l1 2.200 2.400.3-1.800 1.600.5 2.400L12 5.300 9.900 6.500l.5-2.400L8.600 2.500l2.400-.3z" fill="#d9a441"/><circle cx="10" cy="13" r="1.400" fill="#b3261e"/><circle cx="15" cy="18" r="1.400" fill="#d9a441"/><circle cx="8" cy="21" r="1.400" fill="#d9a441"/><circle cx="16" cy="23" r="1.400" fill="#b3261e"/></svg>';
  var GIFT = '<svg class="vh-deco" viewBox="0 0 24 26" aria-hidden="true"><rect x="2" y="10" width="20" height="15" rx="1.500" fill="' + RED + '"/><rect x="1" y="7" width="22" height="5" rx="1.200" fill="#a82828"/><rect x="10.500" y="7" width="3" height="18" fill="#d9a441"/><path d="M12 7C9 1 3 2 5 5.500 6 7 9 7 12 7zM12 7c3-6 9-5 7-1.500C18 7 15 7 12 7z" fill="none" stroke="#d9a441" stroke-width="2"/></svg>';
  /* Homepage section titles, by their order on the page: hat on the title, tree or gift after it. */
  var TITLES = { 0: 'hat', 1: 'tree', 4: 'gift', 6: 'hat', 7: 'tree', 9: 'gift' };

  function addTitleDecor() {
    if (!document.getElementById('home-hero')) return;
    var titles = document.querySelectorAll('main h2');
    Object.keys(TITLES).forEach(function (i) {
      var h = titles[i];
      if (!h || h.querySelector('.vh-deco, .vh-title-hat')) return;
      if (TITLES[i] === 'hat') {
        var walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
        var node;
        while ((node = walker.nextNode()) && !/\p{L}/u.test(node.nodeValue));
        if (!node) return;
        var anchor = document.createElement('span');
        anchor.className = 'vh-title-hat';
        anchor.setAttribute('aria-hidden', 'true');
        anchor.innerHTML = HAT;
        node.parentNode.insertBefore(anchor, node);
      } else {
        h.insertAdjacentHTML('beforeend', TITLES[i] === 'tree' ? TREE : GIFT);
      }
    });
  }
  function run() {
    document.documentElement.classList.add('vh-xmas');
    addHat(); addCanes(); addHeroFx(); addTitleDecor();
  }
  function start() {
    run();
    var queued = false;
    new MutationObserver(function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; run(); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2000 });
  else setTimeout(start, 300);
})();
