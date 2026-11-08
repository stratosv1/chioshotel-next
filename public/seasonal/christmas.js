/* Christmas layer. Loaded only when SEASONAL_THEME in lib/seasonal-theme.ts is "christmas". */
(function () {
  var RED = '#8f1d1d';
  var BOOKING = /(rates|kratisi|hotelpreise|tarifs|prezzi|precios|rezervasyon)/i;
  var CANE = 'M17 34V12a6.5 6.5 0 0 0-13 0';
  function cane(cls, stripe) {
    return '<svg class="' + cls + '" viewBox="0 0 24 38" aria-hidden="true"><path d="' + CANE +
      '" fill="none" stroke="#fff7ea" stroke-width="6" stroke-linecap="round"/><path d="' + CANE +
      '" fill="none" stroke="' + stripe + '" stroke-width="6" stroke-dasharray="3 7"/></svg>';
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
    '"/><rect x="8" y="16" width="19" height="5" rx="2.5" fill="#fff" stroke="#a99c8a" stroke-width="1"/><circle cx="4.5" cy="16" r="3.2" fill="#fff" stroke="#a99c8a" stroke-width="1"/></svg>';

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
  function flakes(count) {
    var html = '';
    for (var i = 0; i < count; i++) {
      var size = 3 + (i * 7) % 4;
      html += '<span class="vh-flake" style="left:' + (i * 37) % 100 + '%;width:' + size + 'px;height:' + size +
        'px;opacity:' + (0.45 + (size - 3) * 0.13) + ';animation-duration:' + (9 + (i * 5) % 8) +
        's;animation-delay:-' + (i * 13) % 17 + 's"></span>';
    }
    return html;
  }
  function addHeroFx() {
    var hero = document.getElementById('home-hero');
    if (!hero || hero.querySelector('.vh-fx')) return;
    var mobile = window.innerWidth < 768;
    var fx = document.createElement('div');
    fx.className = 'vh-fx';
    fx.setAttribute('aria-hidden', 'true');
    var html = lightsHtml(mobile) +
      cane('vh-corner l', RED) + cane('vh-corner r', RED);
    html += flakes(mobile ? 12 : 28);
    fx.innerHTML = html;
    fx.style.setProperty('--vh-fall', hero.offsetHeight + 20 + 'px');
    hero.appendChild(fx);
  }
  var TREE = '<svg class="vh-deco" viewBox="0 0 24 28" aria-hidden="true"><rect x="10.5" y="23" width="3" height="4" fill="#6f3f1d"/><path d="M12 3L5 12h3L3 19h4L1.500 25h21L17 19h4l-5-7h3z" fill="#1f4d2b"/><path d="M12 0l1 2.200 2.400.3-1.800 1.600.5 2.400L12 5.300 9.900 6.500l.5-2.400L8.600 2.500l2.400-.3z" fill="#d9a441"/><circle cx="10" cy="13" r="1.400" fill="#b3261e"/><circle cx="15" cy="18" r="1.400" fill="#d9a441"/><circle cx="8" cy="21" r="1.400" fill="#d9a441"/><circle cx="16" cy="23" r="1.400" fill="#b3261e"/></svg>';
  var GIFT = '<svg class="vh-deco" viewBox="0 0 24 26" aria-hidden="true"><rect x="2" y="10" width="20" height="15" rx="1.500" fill="' + RED + '"/><rect x="1" y="7" width="22" height="5" rx="1.200" fill="#a82828"/><rect x="10.500" y="7" width="3" height="18" fill="#d9a441"/><path d="M12 7C9 1 3 2 5 5.500 6 7 9 7 12 7zM12 7c3-6 9-5 7-1.500C18 7 15 7 12 7z" fill="none" stroke="#d9a441" stroke-width="2"/></svg>';
  /* Homepage section titles, by their order on the page: hat on the title, tree or gift after it. */
  var TITLES = { 1: 'tree', 4: 'gift' };

  function badge(bg, art) {
    return '<svg class="vh-badge" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="' + bg + '"/>' + art + '</svg>';
  }
  var CREAM = '#f8dfa8', GOLD = '#d9a441', PINE = '#1f4d2b', NIGHT = '#21404a', MUSTARD = '#d8b52e';
  var BADGES = {
    fireplace: badge(RED, '<rect x="9" y="14" width="22" height="16" fill="#b5653a"/><path d="M9 19h22M9 24h22M15 14v5M25 14v5" stroke="#7d3f22"/><rect x="7" y="12" width="26" height="3" rx="1" fill="#f3d9b1"/><rect x="14" y="19" width="12" height="11" rx="1.500" fill="#1c1410"/><path d="M20 21c1 3 4 4 3 7a3 3 0 0 1-6 0c0-2 1-2 1.500-3.500.5 1 1 1.200 1.500.5.300-1.500-.2-2.500 0-4z" fill="#f2a33a"/><path d="M12 12v-6h4v6z" fill="#fff" opacity="0"/>'),
    stocking: badge(CREAM, '<path d="M15 12h10v12l4 3a4 4 0 0 1-3 7h-5a6 6 0 0 1-6-6z" fill="#b3261e"/><rect x="13.500" y="8" width="13" height="5.500" rx="1.800" fill="#fff"/><path d="M15 19l10-3M15 24l10-3" stroke="#fff" stroke-width="1.300"/>'),
    globe: badge(NIGHT, '<circle cx="20" cy="18" r="12" fill="#cfe6ec"/><path d="M8.500 21c4-2 8-2 11.500 0s8 2 11.500 0a12 12 0 0 1-23 0z" fill="#fff"/><path d="M15 21v-5l5-4 5 4v5z" fill="#b5653a"/><path d="M13.500 16.500L20 11l6.500 5.500" fill="none" stroke="' + RED + '" stroke-width="1.800"/><rect x="18.500" y="17" width="3" height="4" fill="#ffd56b"/><path d="M11 30h18l2 4H9z" fill="' + RED + '"/>'),
    sweets: badge(RED, '<ellipse cx="20" cy="21" rx="12" ry="8.500" fill="#8a4f1d"/><ellipse cx="20" cy="19.500" rx="12" ry="7.500" fill="#b87228"/><path d="M12 19c3-2 5 1 8 0s5-2 8 0" fill="none" stroke="#e7b061" stroke-width="1.600" stroke-linecap="round"/><circle cx="15" cy="16.500" r="1" fill="#5d3312"/><circle cx="22" cy="16" r="1" fill="#5d3312"/><circle cx="26" cy="21" r="1" fill="#5d3312"/><circle cx="18" cy="22.500" r="1" fill="#5d3312"/>'),
    beanie: badge(CREAM, '<path d="M9 26c0-10 5-15 11-15s11 5 11 15z" fill="#b3261e"/><path d="M12 20l4-3 4 3 4-3 4 3" fill="none" stroke="#fff" stroke-width="1.500"/><rect x="7.500" y="25" width="25" height="6" rx="2.500" fill="#fff"/><circle cx="20" cy="9.500" r="3.500" fill="#fff"/>'),
    mandarin: badge(PINE, '<circle cx="20" cy="22" r="11" fill="#e8892a"/><path d="M13 17a9 9 0 0 1 6-4" fill="none" stroke="#ffc27a" stroke-width="1.800" stroke-linecap="round"/><path d="M20 12c-1-4 3-7 8-6-1 5-4 7-8 6z" fill="#5f9e5f"/><path d="M14 33l6-5 6 5M20 28v-5" stroke="#b3261e" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="20" cy="28" r="1.800" fill="#b3261e"/>'),
    baubles: badge(MUSTARD, '<path d="M15 5v13M26 3v10" stroke="#7a5a12"/><circle cx="15" cy="23" r="7.500" fill="#b3261e"/><circle cx="26" cy="18" r="6" fill="#fff4d6"/><path d="M8 23c3 2 4-2 7 0s4-2 7 0" fill="none" stroke="#f8dfa8" stroke-width="1.300"/><path d="M24 30c3-4 6-3 9-1-1 4-5 6-9 1z" fill="' + PINE + '"/><circle cx="24" cy="30" r="1.700" fill="#b3261e"/>'),
    tree: badge(NIGHT, '<path d="M20 6l5 8h-3l6 8h-4l6 8H10l6-8h-4l6-8h-3z" fill="#5f9e5f"/><rect x="18" y="30" width="4" height="4" fill="#8a4f1d"/><circle cx="20" cy="6" r="2" fill="#ffd56b"/><circle cx="18" cy="16" r="1.300" fill="#fff"/><circle cx="23" cy="22" r="1.300" fill="#ffd56b"/><circle cx="16" cy="26" r="1.300" fill="#fff"/>')
  };
  /* Homepage title icons, in the order the titles appear. */
  var CHIPS = ['fireplace', 'stocking', 'mandarin', 'sweets', 'beanie', 'globe', 'baubles', 'tree', 'mandarin'];

  function addBadges() {
    if (!document.getElementById('home-hero')) return;
    document.querySelectorAll('main h2 span[data-icon]').forEach(function (chip, i) {
      if (!CHIPS[i] || chip.querySelector('.vh-badge')) return;
      chip.classList.add('vh-chip');
      chip.innerHTML = BADGES[CHIPS[i]];
    });
  }

  function hatOn(el) {
    if (!el || el.querySelector('.vh-title-hat')) return;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode()) && !/\p{L}/u.test(node.nodeValue));
    if (!node) return;
    var anchor = document.createElement('span');
    anchor.className = 'vh-title-hat';
    anchor.setAttribute('aria-hidden', 'true');
    anchor.innerHTML = HAT;
    node.parentNode.insertBefore(anchor, node);
  }

  var BOW = '<svg class="vh-bow" viewBox="0 0 40 36" aria-hidden="true"><path d="M20 15L12 33l6-3 2 5zM20 15l8 18-6-3-2 5z" fill="#a82828"/><path d="M20 14C10 2 1 4 3 12s10 7 17 2zM20 14c10-12 19-10 17-2s-10 7-17 2z" fill="' + RED + '" stroke="#6e1a1a" stroke-width="1"/><circle cx="20" cy="14" r="4" fill="#d9a441"/></svg>';
  var MINI_GIFT = '<svg class="vh-mini-gift" viewBox="0 0 24 26" aria-hidden="true"><rect x="2" y="10" width="20" height="15" rx="1.500" fill="' + RED + '"/><rect x="1" y="7" width="22" height="5" rx="1.200" fill="#a82828"/><rect x="10.500" y="7" width="3" height="18" fill="#d9a441"/><path d="M12 7C9 1 3 2 5 5.500 6 7 9 7 12 7zM12 7c3-6 9-5 7-1.500C18 7 15 7 12 7z" fill="none" stroke="#d9a441" stroke-width="2"/></svg>';

  function addBow(box) {
    if (!box || box.querySelector('.vh-bow')) return;
    box.classList.add('vh-rel');
    box.insertAdjacentHTML('beforeend', BOW);
  }
  /* Room cards, on every page that shows them. */
  function addRoomCards() {
    document.querySelectorAll('a[class*="scroll-mt-28"]').forEach(function (card) {
      addBow(card.querySelector(':scope > div'));
      var deal = card.querySelector('p[class*="166534"]');
      if (deal && !deal.querySelector('.vh-mini-gift')) deal.insertAdjacentHTML('afterbegin', MINI_GIFT);
    });
  }
  function lightsHtml(mobile) {
    var swags = Math.ceil(window.innerWidth / (mobile ? 160 : 240)) + 1;
    return '<div class="vh-lights">' + new Array(swags + 1).join(SWAG) + '</div>';
  }
  /* Rooms pages and room details: hat on the main title, bow on the photo, lights on top. */
  function addRoomHeroes() {
    var h1 = document.querySelector('main h1[id$="-hero-title"]') || document.querySelector('h1[id$="-hero-title"]');
    if (!h1) return;
    hatOn(h1);
    var box = h1.closest('section');
    var card = h1.parentElement && h1.parentElement.parentElement;
    if (card && card.className.indexOf('rounded-') >= 0) box = card;
    if (!box || box.querySelector('.vh-fx')) return;
    box.classList.add('vh-rel');
    var fx = document.createElement('div');
    fx.className = 'vh-fx';
    fx.setAttribute('aria-hidden', 'true');
    fx.innerHTML = lightsHtml(window.innerWidth < 768);
    box.appendChild(fx);
    var img = box.querySelector('img');
    if (img) addBow(img.closest('[class*="overflow-hidden"], [class*="rounded"]') || img.parentElement);
  }
  /* AI Room Finder: hat on the name, lights under its top bar, light snow behind the chat. Nothing else in the chat changes. */
  function addRoomFinder() {
    if (!/\/ai-assistant\/?$/.test(location.pathname)) return;
    var bar = document.querySelector('header');
    if (!bar) return;
    var name = bar.querySelector('h1');
    if (name) name.classList.add('vh-open');
    hatOn(name);
    var shell = bar.parentElement;
    if (!shell || shell.querySelector('.vh-ai-fx')) return;
    shell.classList.add('vh-ai-shell');
    var mobile = window.innerWidth < 768;
    var top = bar.offsetHeight + 'px';
    /* Snow sits behind the messages, so it never lands on text. */
    var snow = document.createElement('div');
    snow.className = 'vh-ai-fx vh-ai-snow';
    snow.setAttribute('aria-hidden', 'true');
    snow.style.top = top;
    snow.style.setProperty('--vh-fall', window.innerHeight + 'px');
    snow.innerHTML = flakes(mobile ? 8 : 16);
    /* Lights hang above the chat; the feed gets extra top room so they never touch a card. */
    var lights = document.createElement('div');
    lights.className = 'vh-ai-fx vh-ai-lights';
    lights.setAttribute('aria-hidden', 'true');
    lights.style.top = top;
    lights.innerHTML = lightsHtml(mobile);
    shell.insertBefore(snow, shell.firstChild);
    shell.appendChild(lights);
  }

  function addTitleDecor() {
    if (!document.getElementById('home-hero')) return;
    var titles = document.querySelectorAll('main h2');
    Object.keys(TITLES).forEach(function (i) {
      var h = titles[i];
      if (!h || h.querySelector('.vh-deco, .vh-title-hat')) return;
      if (TITLES[i] === 'hat') {
        hatOn(h);
      } else {
        h.insertAdjacentHTML('beforeend', TITLES[i] === 'tree' ? TREE : GIFT);
      }
    });
  }
  function run() {
    document.documentElement.classList.add('vh-xmas');
    addHat(); addCanes(); addHeroFx(); addTitleDecor(); addBadges(); addRoomCards(); addRoomHeroes(); addRoomFinder();
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
  /* Touch the page only after React has hydrated it, otherwise React throws the page away and redraws it. */
  function hydrated() {
    var el = document.querySelector('main') || document.querySelector('header');
    return !!el && Object.keys(el).some(function (k) { return k.indexOf('__reactFiber') === 0; });
  }
  var tries = 0;
  (function wait() {
    if (hydrated()) { setTimeout(start, 300); return; }
    if (++tries < 100) setTimeout(wait, 150);
  })();
})();
