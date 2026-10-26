/* MAISON NOIR COFFEE - script.js (vanilla JS) */
(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var KEYS = { cart: 'mn-cart', promo: 'mn-promo', wish: 'mn-wish', theme: 'mn-theme' };
  var PROMO_CODE = 'COFFEE10';
  var PROMO_RATE = 0.1;

  function store(key, val) { try { if (val === undefined) { var v = localStorage.getItem(key); return v === null ? null : JSON.parse(v); } localStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; } return null; }
  function money(n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function img(id, w) { return 'https://images.unsplash.com/photo-' + id + '?w=' + (w || 700) + '&q=80'; }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /* ---------- Data ---------- */
  var DRINK_SIZES = [{ n: 'Small', m: 0 }, { n: 'Medium', m: 0.5 }, { n: 'Large', m: 1 }];
  var FOOD_SIZES = [{ n: 'Single', m: 0 }, { n: 'Double', m: 1 }];

  var I = {
    hands: '1495474472287-4d71bcdd2085', cupsPlant: '1509042239860-f550ce710b93', beans: '1447933601403-0c6688de566e',
    pour: '1442512595331-e89e73853f31', portafilter: '1511920170033-f8396924c348', americano: '1514432324607-a09d9b4aefdd',
    bag: '1559056199-641a0ac8b55e', tray: '1497935586351-b67a49e012bf', iced: '1461023058943-07fcbe16d735',
    latte: '1541167760496-1628856ab772', cupping: '1498804103079-a6351b050096', espresso: '1510707577719-ae7c14805e3a',
    icedMilk: '1517701604599-bb29b565090c', icedTea: '1556679343-c7306c1976bc', cookieCup: '1544787219-7f47ccb76574',
    tea: '1571934811356-5cc061b6821f', cookies: '1558961363-fa8fdf82db35', croissant: '1555507036-ab1f4038808a',
    bread: '1509440159596-0249088772ff', breakfast: '1533089860892-a7c6f0a88666', spread: '1504754524776-8f4f37790ca0',
    eggToast: '1525351484163-7529414344d8', frenchToast: '1484723091739-30a097e8f929', whiteEspresso: '1559496417-e7f25cb247f3',
    beanJar: '1559525839-b184a4d698c7', bagGrinder: '1611854779393-1b2da9d400fe', latteGlass: '1570968915860-54d5c301fa9f',
    sandwich: '1521305916504-4a1121188589', teapot: '1564890369478-c89ca6d9cde9', cup: '1504630083234-14187a9df0f5',
    berry: '1495214783159-3503fd1b572d', blueCup: '1485808191679-5f86510681a2', beanCup: '1459755486867-b55449bb39ff',
    latteHands: '1495774856032-8b90bbb32b32', pourCup: '1522992319-0365e5f11656', beanLatte: '1512568400610-62da28bc8a13',
    cupBeans: '1497515114629-f71d768fd07c', cappuccino: '1517256064527-09c73fc73e38', velvet: '1507133750040-4a8f57021571'
  };

  var MENU_ITEMS = [
    { cat: 'Espresso', name: 'Espresso Doppio', desc: 'Double shot of our house blend, dense and sweet with dark cocoa notes.', price: 3.8, img: I.espresso, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Espresso', name: 'Flat White', desc: 'Two ristretto shots under a thin layer of velvety microfoam.', price: 4.6, img: I.cappuccino, tags: ['gluten free'], sizes: 'drink' },
    { cat: 'Espresso', name: 'Cappuccino', desc: 'Equal parts espresso, steamed milk and a cloud of foam, dusted with cocoa.', price: 4.5, img: I.cup, tags: ['gluten free'], sizes: 'drink' },
    { cat: 'Espresso', name: 'Long Black', desc: 'Espresso poured over hot water to keep the crema and the clarity.', price: 4.0, img: I.americano, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Espresso', name: 'Macchiato', desc: 'A single shot marked with a spoonful of warm milk foam.', price: 3.9, img: I.blueCup, tags: ['gluten free'], sizes: 'drink' },
    { cat: 'Espresso', name: 'Oat Milk Latte', desc: 'Espresso and steamed oat milk, naturally sweet and creamy.', price: 5.2, img: I.latte, tags: ['vegan'], sizes: 'drink' },

    { cat: 'Filter and Pour Over', name: 'V60 Pour Over', desc: 'Hand poured single origin, bright and clean with a long finish.', price: 5.5, img: I.pour, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Filter and Pour Over', name: 'Chemex for Two', desc: 'A sharing carafe of floral, tea-like filter coffee.', price: 9.5, img: I.pourCup, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Filter and Pour Over', name: 'Aeropress', desc: 'Rich, smooth and low in acidity. Ask for the daily recipe.', price: 5.2, img: I.cupBeans, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Filter and Pour Over', name: 'Batch Brew', desc: 'Today\'s filter, ready to go. Balanced, sweet and easy to drink.', price: 3.4, img: I.beanCup, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Filter and Pour Over', name: 'Clever Dripper', desc: 'Full immersion brew with the clarity of a filter. Syrupy and sweet.', price: 5.4, img: I.tray, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Filter and Pour Over', name: 'Cupping Flight', desc: 'Three small pours of our current seasonal lots, with notes.', price: 11.0, img: I.cupping, tags: ['vegan', 'gluten free'], sizes: 'food' },

    { cat: 'Cold Coffee', name: 'Ember Cold Brew', desc: 'Eighteen hours steeped, finished with burnt orange and brown sugar.', price: 5.75, img: I.icedMilk, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Cold Coffee', name: 'Iced Latte', desc: 'Double espresso poured over ice and cold milk.', price: 5.0, img: I.iced, tags: ['gluten free'], sizes: 'drink' },
    { cat: 'Cold Coffee', name: 'Espresso Tonic', desc: 'Espresso over tonic and a twist of lime. Bitter, bright, refreshing.', price: 5.6, img: I.icedTea, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Cold Coffee', name: 'Nitro Cold Brew', desc: 'Nitrogen-infused for a creamy, stout-like texture. No milk needed.', price: 6.0, img: I.whiteEspresso, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Cold Coffee', name: 'Vanilla Cold Foam', desc: 'Cold brew topped with house vanilla foam.', price: 6.2, img: I.latteGlass, tags: ['gluten free'], sizes: 'drink' },
    { cat: 'Cold Coffee', name: 'Iced Oat Latte', desc: 'Espresso, oat milk and a touch of maple, over ice.', price: 5.6, img: I.hands, tags: ['vegan'], sizes: 'drink' },

    { cat: 'Tea and Others', name: 'Jasmine Pearl Tea', desc: 'Hand-rolled green tea pearls scented with jasmine blossom.', price: 4.8, img: I.tea, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Tea and Others', name: 'Earl Grey Reserve', desc: 'Black tea with real bergamot oil, served in a pot.', price: 4.8, img: I.teapot, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Tea and Others', name: 'Chai Latte', desc: 'House spiced chai, slow simmered and finished with steamed milk.', price: 5.2, img: I.cupsPlant, tags: ['gluten free'], sizes: 'drink' },
    { cat: 'Tea and Others', name: 'Dark Hot Chocolate', desc: 'Seventy percent single origin chocolate melted into warm milk.', price: 5.4, img: I.cookieCup, tags: ['gluten free'], sizes: 'drink' },
    { cat: 'Tea and Others', name: 'Golden Turmeric Latte', desc: 'Turmeric, ginger and black pepper with oat milk and honey.', price: 5.4, img: I.latteHands, tags: ['vegan', 'gluten free'], sizes: 'drink' },
    { cat: 'Tea and Others', name: 'Iced Lime Tea', desc: 'Cold brewed black tea with fresh lime and mint.', price: 4.6, img: I.icedMilk, tags: ['vegan', 'gluten free'], sizes: 'drink' },

    { cat: 'Pastries', name: 'Butter Croissant', desc: 'Laminated for three days, baked each morning until deeply golden.', price: 4.2, img: I.croissant, tags: [], sizes: 'food' },
    { cat: 'Pastries', name: 'Seeded Rye Roll', desc: 'Dark rye with sunflower and flax seeds. Great with butter.', price: 3.8, img: I.bread, tags: ['vegan'], sizes: 'food' },
    { cat: 'Pastries', name: 'Chocolate Chip Cookie', desc: 'Brown butter, sea salt and big chunks of dark chocolate.', price: 3.6, img: I.cookies, tags: [], sizes: 'food' },
    { cat: 'Pastries', name: 'Berry Tart', desc: 'Almond cream, vanilla custard and seasonal berries.', price: 5.6, img: I.berry, tags: [], sizes: 'food' },
    { cat: 'Pastries', name: 'Oat and Raisin Cookie', desc: 'Chewy, spiced and entirely plant-based.', price: 3.4, img: I.cookieCup, tags: ['vegan'], sizes: 'food' },
    { cat: 'Pastries', name: 'Almond Financier', desc: 'A small buttery almond cake, naturally gluten free.', price: 3.9, img: I.cookies, tags: ['gluten free'], sizes: 'food' },

    { cat: 'Brunch', name: 'Egg on Sourdough', desc: 'Soft egg, whipped ricotta and chili oil on grilled sourdough.', price: 12.5, img: I.eggToast, tags: [], sizes: 'food' },
    { cat: 'Brunch', name: 'Noir Breakfast Plate', desc: 'Two eggs, toast, roasted tomato and a side salad.', price: 14.0, img: I.breakfast, tags: [], sizes: 'food' },
    { cat: 'Brunch', name: 'Brioche French Toast', desc: 'Caramelised brioche with berries, mascarpone and maple.', price: 13.5, img: I.frenchToast, tags: [], sizes: 'food' },
    { cat: 'Brunch', name: 'Brunch Board', desc: 'Pastries, fruit, cheese and preserves to share.', price: 22.0, img: I.spread, tags: ['vegan'], sizes: 'food' },
    { cat: 'Brunch', name: 'Chicken Club', desc: 'Roast chicken, bacon, avocado and aioli on toasted bread.', price: 13.0, img: I.sandwich, tags: [], sizes: 'food' },
    { cat: 'Brunch', name: 'Berry Granola Bowl', desc: 'Coconut yogurt, house granola and fresh berries.', price: 9.5, img: I.berry, tags: ['vegan', 'gluten free'], sizes: 'food' }
  ].map(function (it, i) { it.id = 'm-' + (i + 1) + '-' + slug(it.name); return it; });

  var SIGNATURES = {
    'sig-1': { id: 'sig-1', name: 'Velvet Noir Latte', kicker: 'Milk and espresso', price: 6.5, img: I.velvet, desc: 'Our most ordered drink: a double ristretto softened by silky milk and a pinch of smoked cocoa.', ingredients: 'Double ristretto, steamed whole milk, smoked cocoa, raw honey.', notes: 'Dark chocolate, toasted hazelnut, a long creamy finish.' },
    'sig-2': { id: 'sig-2', name: 'Ember Cold Brew', kicker: 'Cold, slow, deep', price: 5.75, img: I.icedMilk, desc: 'Eighteen hours of patient steeping produce a cold brew that is smooth, syrupy and never bitter.', ingredients: 'Cold brew concentrate, filtered water, burnt orange syrup, brown sugar, ice.', notes: 'Brown sugar, orange zest, black cherry.' },
    'sig-3': { id: 'sig-3', name: 'Brass Cortado', kicker: 'Short and balanced', price: 4.9, img: I.blueCup, desc: 'Equal parts espresso and warm milk, served in a hand-thrown cup for a perfectly balanced sip.', ingredients: 'Single origin espresso, warm steamed milk.', notes: 'Caramel, red apple, milk chocolate.' }
  };

  var BEANS = [
    { id: 'bean-ethiopia', name: 'Ethiopia Yirgacheffe', origin: 'Ethiopia', roast: 30, roastName: 'Light', notes: 'Blueberry, jasmine, lemon zest', p250: 19, p1k: 64, img: I.bag },
    { id: 'bean-colombia', name: 'Colombia Huila', origin: 'Colombia', roast: 50, roastName: 'Medium', notes: 'Red apple, caramel, cocoa', p250: 17, p1k: 58, img: I.bagGrinder },
    { id: 'bean-guatemala', name: 'Guatemala Antigua', origin: 'Guatemala', roast: 60, roastName: 'Medium', notes: 'Milk chocolate, orange, toasted almond', p250: 17.5, p1k: 60, img: I.beans },
    { id: 'bean-kenya', name: 'Kenya AA Nyeri', origin: 'Kenya', roast: 35, roastName: 'Light', notes: 'Blackcurrant, grapefruit, brown sugar', p250: 21, p1k: 72, img: I.beanJar },
    { id: 'bean-brazil', name: 'Brazil Santos', origin: 'Brazil', roast: 75, roastName: 'Medium dark', notes: 'Roasted peanut, dark chocolate, molasses', p250: 15, p1k: 50, img: I.beanCup },
    { id: 'bean-noir', name: 'House Noir Blend', origin: 'Blend', roast: 88, roastName: 'Dark', notes: 'Dark cocoa, black cherry, smoke', p250: 16, p1k: 54, img: I.beanLatte }
  ];

  var EVENTS = {
    'Latte Art Workshop': { id: 'event-latte-art', price: 65, img: I.latteHands },
    'Cupping Night': { id: 'event-cupping', price: 45, img: I.cupping }
  };

  var ITEMS_BY_ID = {};
  MENU_ITEMS.forEach(function (m) { ITEMS_BY_ID[m.id] = m; });

  /* ---------- State ---------- */
  var cart = store(KEYS.cart);
  if (!Array.isArray(cart)) cart = [];
  var promoApplied = store(KEYS.promo) === PROMO_CODE;
  var wishlist = store(KEYS.wish);
  if (!Array.isArray(wishlist)) wishlist = [];
  var state = { category: 'Espresso', query: '', tag: 'all' };

  /* ---------- Toasts ---------- */
  function toast(msg, isError) {
    var wrap = $('#toasts');
    if (!wrap) return;
    var t = document.createElement('div');
    t.className = 'toast' + (isError ? ' is-error' : '');
    t.textContent = msg;
    wrap.appendChild(t);
    while (wrap.children.length > 3) wrap.removeChild(wrap.firstChild);
    setTimeout(function () { t.classList.add('is-leaving'); setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 400); }, 3000);
  }

  /* ---------- Layers: focus handling for drawer / modals / lightbox ---------- */
  var layerStack = [];
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openLayer(el, opts) {
    opts = opts || {};
    layerStack.push({ el: el, opener: document.activeElement, onClose: opts.onClose });
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');
    if (opts.overlay) { opts.overlay.hidden = false; void opts.overlay.offsetWidth; opts.overlay.classList.add('is-open'); }
    setTimeout(function () {
      var target = $(opts.focus || '[data-autofocus]', el) || $$(FOCUSABLE, el).filter(function (n) { return n.offsetParent !== null; })[0];
      if (target) target.focus({ preventScroll: true });
    }, 60);
  }
  function closeLayer(el) {
    var idx = -1;
    layerStack.forEach(function (l, i) { if (l.el === el) idx = i; });
    if (idx < 0) return;
    var layer = layerStack.splice(idx, 1)[0];
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    var overlay = $('#overlay');
    if (el.id === 'cartDrawer' && overlay) { overlay.classList.remove('is-open'); setTimeout(function () { if (!layerStack.some(function (l) { return l.el.id === 'cartDrawer'; })) overlay.hidden = true; }, 400); }
    if (!layerStack.length && !body.classList.contains('menu-open')) body.classList.remove('no-scroll');
    if (layer.opener && layer.opener.focus) layer.opener.focus({ preventScroll: true });
    if (layer.onClose) layer.onClose();
  }
  function closeTopLayer() { if (layerStack.length) closeLayer(layerStack[layerStack.length - 1].el); }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (layerStack.length) { e.preventDefault(); closeTopLayer(); return; }
      if (body.classList.contains('menu-open')) { closeMobileMenu(); var mt = $('#menuToggle'); if (mt) mt.focus(); }
      return;
    }
    if (e.key === 'Tab' && layerStack.length) {
      var el = layerStack[layerStack.length - 1].el;
      var f = $$(FOCUSABLE, el).filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !el.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Preloader ---------- */
  function initPreloader() {
    var pre = $('#preloader'), bar = $('#preloaderBar'), count = $('#preloaderCount');
    var pct = 0, done = false, loaded = document.readyState === 'complete', started = Date.now();
    window.addEventListener('load', function () { loaded = true; });

    function finish() {
      if (done) return;
      done = true;
      clearInterval(timer);
      if (bar) bar.style.width = '100%';
      if (count) count.textContent = '100%';
      setTimeout(function () {
        if (pre) pre.classList.add('is-done');
        body.classList.add('is-loaded');
        revealHeroNow();
      }, 250);
    }
    var timer = setInterval(function () {
      var elapsed = Date.now() - started;
      var target = loaded ? 100 : Math.min(90, elapsed / 25);
      pct = Math.min(100, pct + Math.max(1, (target - pct) * 0.15));
      if (loaded && pct > 99) pct = 100;
      if (bar) bar.style.width = pct + '%';
      if (count) count.textContent = Math.round(pct) + '%';
      if (pct >= 100 && elapsed > 900) finish();
      if (elapsed > 3800) finish();
    }, 40);
    setTimeout(finish, 4000);
    setTimeout(function () { // hard fallback
      if (pre) pre.classList.add('is-done');
      root.classList.add('reveal-fallback');
    }, 6000);
  }
  function revealHeroNow() { $$('.hero .reveal').forEach(function (n) { n.classList.add('is-visible'); }); }

  /* ---------- Theme ---------- */
  function initTheme() {
    var btn = $('#themeToggle');
    var meta = $('meta[name="theme-color"]');
    function apply(light) {
      if (light) root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
      if (meta) meta.setAttribute('content', light ? '#F4EBDD' : '#14100D');
      if (btn) { btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme'); btn.setAttribute('aria-pressed', light ? 'true' : 'false'); }
    }
    var saved = null; try { saved = localStorage.getItem(KEYS.theme); } catch (e) {}
    apply(saved === 'light');
    if (btn) btn.addEventListener('click', function () {
      var light = root.getAttribute('data-theme') !== 'light';
      apply(light);
      try { localStorage.setItem(KEYS.theme, light ? 'light' : 'dark'); } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */
  function openMobileMenu() {
    var m = $('#mobileMenu'), t = $('#menuToggle');
    m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false');
    t.setAttribute('aria-expanded', 'true'); t.setAttribute('aria-label', 'Close menu');
    body.classList.add('menu-open', 'no-scroll');
  }
  function closeMobileMenu() {
    var m = $('#mobileMenu'), t = $('#menuToggle');
    if (!m) return;
    m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true');
    t.setAttribute('aria-expanded', 'false'); t.setAttribute('aria-label', 'Open menu');
    body.classList.remove('menu-open');
    if (!layerStack.length) body.classList.remove('no-scroll');
  }
  function initMobileMenu() {
    var t = $('#menuToggle');
    if (!t) return;
    t.addEventListener('click', function () { body.classList.contains('menu-open') ? closeMobileMenu() : openMobileMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1200 && body.classList.contains('menu-open')) closeMobileMenu(); });
  }

  /* ---------- Smooth scroll + scrollspy ---------- */
  function headerOffset() { var h = $('#siteHeader'); return (h ? h.offsetHeight : 64) + 8; }
  function scrollToTarget(hash) {
    if (hash === '#home' || hash === '#') { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    var el = $(hash);
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - (hash === '#main' ? 0 : headerOffset() - 8);
    window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var h = a.getAttribute('href');
      if (!h || h === '#' || !($(h) || h === '#home')) return;
      e.preventDefault();
      var wasOpen = body.classList.contains('menu-open');
      if (wasOpen) closeMobileMenu();
      setTimeout(function () { scrollToTarget(h); }, wasOpen ? 60 : 0);
      if (history.replaceState) history.replaceState(null, '', h);
    });
  }
  var spyIds = ['home', 'about', 'menu', 'signature', 'gallery', 'reviews', 'reserve', 'contact'];
  function updateSpy() {
    var y = window.pageYOffset + headerOffset() + window.innerHeight * 0.25;
    var current = 'home';
    spyIds.forEach(function (id) { var el = document.getElementById(id); if (el && el.offsetTop <= y) current = id; });
    // sections not in nav map to the nearest previous nav item
    $$('.nav-link, .mobile-link').forEach(function (l) {
      var on = l.getAttribute('href') === '#' + current;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
  }

  /* ---------- Scroll listeners: header glass, parallax, back to top ---------- */
  function initScrollListeners() {
    var header = $('#siteHeader'), hero = $('#heroBg'), btt = $('#backToTop');
    function onScroll() {
      var y = window.pageYOffset;
      if (header) header.classList.toggle('is-scrolled', y > 24);
      if (btt) btt.classList.toggle('is-visible', y > 700);
      if (hero && !reduceMotion && y < window.innerHeight * 1.2) hero.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0)';
      updateSpy();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    if (btt) btt.addEventListener('click', function () { scrollToTarget('#home'); });
  }

  /* ---------- Cursor + magnetic (fine pointer only) ---------- */
  function initCursor() {
    if (!finePointer) return;
    var dot = $('#cursorDot'), ring = $('#cursorRing');
    if (!dot || !ring) return;
    var x = 0, y = 0, rx = 0, ry = 0, shown = false;
    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      if (!shown) { shown = true; rx = x; ry = y; body.classList.add('cursor-on'); }
      var h = e.target.closest && e.target.closest('a, button, input, select, textarea, label');
      body.classList.toggle('cursor-hover', !!h);
    });
    document.addEventListener('mouseleave', function () { body.classList.remove('cursor-on'); shown = false; });
    (function loop() { rx += (x - rx) * 0.18; ry += (y - ry) * 0.18; ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)'; requestAnimationFrame(loop); })();
  }
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Reveal, counters, craft ---------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (n) { n.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (n) { io.observe(n); });
    // craft steps
    var steps = $('.craft-steps');
    if (steps) {
      $$('.craft-step', steps).forEach(function (s, i) { s.style.setProperty('--n', i + 1); });
      var cio = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { steps.classList.add('is-played'); cio.disconnect(); } }, { threshold: 0.15 });
      cio.observe(steps);
    }
  }
  function formatNum(n) { return n.toLocaleString('en-US'); }
  function initCounters() {
    var els = $$('.counter');
    function run(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      if (reduceMotion) { el.textContent = formatNum(target); return; }
      var start = Date.now(), dur = 1800;
      var tm = setInterval(function () {
        var p = Math.min(1, (Date.now() - start) / dur);
        el.textContent = formatNum(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p >= 1) clearInterval(tm);
      }, 40);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { if (el.textContent === '0') el.textContent = formatNum(parseInt(el.getAttribute('data-target'), 10) || 0); }); }, 12000);
  }

  /* ---------- Opening hours badge (cafe time: Portland) ---------- */
  function initHours() {
    var badge = $('#hoursBadge'), label = $('#hoursStatus');
    if (!badge || !label) return;
    var HOURS = { weekday: [7, 19], weekend: [8, 20] };
    var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    function fmt(h) { var s = h >= 12 ? 'PM' : 'AM'; return ((h + 11) % 12 + 1) + ':00 ' + s; }
    function range(d) { return (d === 0 || d === 6) ? HOURS.weekend : HOURS.weekday; }
    function cafeNow() {
      try {
        var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
        var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
        return { day: DAYS.indexOf(o.weekday), min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
      } catch (e) { var d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
    }
    function update() {
      var n = cafeNow(), r = range(n.day);
      var open = n.min >= r[0] * 60 && n.min < r[1] * 60;
      badge.classList.toggle('is-open', open);
      badge.classList.toggle('is-closed', !open);
      if (open) { label.textContent = 'Open now \u00b7 until ' + fmt(r[1]); return; }
      if (n.min < r[0] * 60) { label.textContent = 'Closed \u00b7 opens ' + fmt(r[0]); return; }
      var nd = (n.day + 1) % 7;
      label.textContent = 'Closed \u00b7 opens ' + fmt(range(nd)[0]) + ' ' + DAYS[nd];
    }
    update();
    setInterval(update, 60000);
  }

  /* ---------- Cart ---------- */
  function saveCart() { store(KEYS.cart, cart); }
  function cartSubtotal() { return cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0); }
  function cartCountTotal() { return cart.reduce(function (s, i) { return s + i.qty; }, 0); }

  function addToCart(item, qty, silent) {
    qty = qty || 1;
    var key = item.id + '|' + (item.size || '');
    var found = cart.filter(function (c) { return c.key === key; })[0];
    if (found) found.qty = Math.min(20, found.qty + qty);
    else cart.push({ key: key, id: item.id, name: item.name, size: item.size || '', price: item.price, img: item.img, qty: Math.min(20, qty) });
    saveCart(); renderCart();
    var cc = $('#cartCount'); if (cc) { cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump'); }
    if (!silent) toast(item.name + (item.size ? ' (' + item.size + ')' : '') + ' added to cart');
  }
  function changeQty(key, delta) {
    var it = cart.filter(function (c) { return c.key === key; })[0];
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) cart = cart.filter(function (c) { return c.key !== key; });
    it.qty = Math.min(20, it.qty);
    saveCart(); renderCart();
  }
  function removeFromCart(key) { cart = cart.filter(function (c) { return c.key !== key; }); saveCart(); renderCart(); }
  function totals() {
    var sub = cartSubtotal(), disc = promoApplied ? sub * PROMO_RATE : 0;
    return { sub: sub, disc: disc, total: sub - disc };
  }
  function renderCart() {
    var list = $('#cartItems'), count = $('#cartCount');
    var n = cartCountTotal();
    if (count) { count.textContent = n; count.classList.toggle('is-empty', n === 0); }
    var tg = $('#cartToggle'); if (tg) tg.setAttribute('aria-label', 'Open cart, ' + n + (n === 1 ? ' item' : ' items'));
    if (list) {
      if (!cart.length) list.innerHTML = '<p class="cart-empty">Your cart is empty.<br>Add something delicious from the menu.</p>';
      else list.innerHTML = cart.map(function (c) {
        return '<div class="cart-item" data-key="' + esc(c.key) + '">' +
          '<img src="' + esc(c.img) + '" alt="" width="72" height="72" loading="lazy">' +
          '<div><div class="cart-item-name">' + esc(c.name) + '</div><div class="cart-item-meta">' + (c.size ? esc(c.size) + ' &middot; ' : '') + money(c.price) + ' each</div>' +
          '<div class="qty" role="group" aria-label="Quantity for ' + esc(c.name) + '"><button type="button" data-act="dec" aria-label="Decrease quantity">&minus;</button><span class="qty-val" aria-live="polite">' + c.qty + '</span><button type="button" data-act="inc" aria-label="Increase quantity">+</button></div></div>' +
          '<div class="cart-item-side"><span class="cart-item-price">' + money(c.price * c.qty) + '</span><button type="button" class="remove-btn" data-act="rm" aria-label="Remove ' + esc(c.name) + '">Remove</button></div></div>';
      }).join('');
    }
    var t = totals();
    var set = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
    set('cartSubtotal', money(t.sub)); set('cartDiscount', '-' + money(t.disc)); set('cartTotal', money(t.total)); set('orderTotal', money(t.total));
    var dr = $('#discountRow'); if (dr) dr.hidden = !promoApplied || !cart.length;
    var cb = $('#checkoutBtn'); if (cb) cb.disabled = !cart.length;
    var pm = $('#promoMsg'); if (pm && promoApplied) { pm.textContent = 'Code ' + PROMO_CODE + ' applied: 10% off.'; pm.classList.remove('is-error'); }
  }
  function openCart() { var d = $('#cartDrawer'); if (d.classList.contains('is-open')) return; $('#cartToggle').setAttribute('aria-expanded', 'true'); openLayer(d, { overlay: $('#overlay'), focus: '#cartClose', onClose: function () { $('#cartToggle').setAttribute('aria-expanded', 'false'); } }); }
  function initCart() {
    $('#cartToggle').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', function () { closeLayer($('#cartDrawer')); });
    $('#overlay').addEventListener('click', function () { closeLayer($('#cartDrawer')); });
    $('#cartItems').addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var key = b.closest('.cart-item').getAttribute('data-key'), act = b.getAttribute('data-act');
      if (act === 'inc') changeQty(key, 1); else if (act === 'dec') changeQty(key, -1); else removeFromCart(key);
    });
    $('#promoForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#promoInput').value.trim().toUpperCase(), pm = $('#promoMsg');
      if (!v) { pm.textContent = 'Enter a promo code.'; pm.classList.add('is-error'); return; }
      if (v === PROMO_CODE) { promoApplied = true; store(KEYS.promo, PROMO_CODE); pm.classList.remove('is-error'); renderCart(); toast('Promo applied: 10% off'); }
      else { pm.textContent = 'That code is not valid.'; pm.classList.add('is-error'); }
    });
    $('#checkoutBtn').addEventListener('click', function () {
      if (!cart.length) { toast('Your cart is empty', true); return; }
      closeLayer($('#cartDrawer'));
      setTimeout(function () { resetOrderForm(); openLayer($('#orderModal'), { focus: '#oName' }); }, 120);
    });
    renderCart();
  }

  /* ---------- Menu ---------- */
  function sizeList(item) { return item.sizes === 'drink' ? DRINK_SIZES : FOOD_SIZES; }
  function menuCardHTML(it) {
    var sizes = sizeList(it);
    return '<article class="menu-card" data-id="' + it.id + '" data-base="' + it.price + '">' +
      '<div class="card-media"><img src="' + img(it.img, 640) + '" alt="' + esc(it.name) + '" loading="lazy" width="640" height="480"></div>' +
      '<div class="card-body"><div class="card-top"><h3 class="card-name">' + esc(it.name) + '</h3><span class="price" data-price>' + money(it.price) + '</span></div>' +
      '<p class="card-desc">' + esc(it.desc) + '</p>' +
      '<div class="tags">' + (it.tags.length ? it.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') : '<span class="tag">' + esc(it.cat) + '</span>') + '</div>' +
      '<div class="card-controls"><div class="control-row">' +
      '<div class="size-group" role="group" aria-label="Size for ' + esc(it.name) + '">' + sizes.map(function (s, i) { return '<button type="button" class="size-btn' + (i === 0 ? ' is-active' : '') + '" data-size="' + s.n + '" data-mult="' + s.m + '" aria-pressed="' + (i === 0) + '">' + s.n + '</button>'; }).join('') + '</div>' +
      '<div class="qty" role="group" aria-label="Quantity for ' + esc(it.name) + '"><button type="button" data-qty="-1" aria-label="Decrease quantity">&minus;</button><span class="qty-val">1</span><button type="button" data-qty="1" aria-label="Increase quantity">+</button></div></div>' +
      '<button type="button" class="btn btn-primary btn-small add-btn">Add to Cart</button></div></div></article>';
  }
  function renderMenu() {
    var grid = $('#menuGrid'), empty = $('#menuEmpty');
    var q = state.query.trim().toLowerCase();
    var list = MENU_ITEMS.filter(function (it) {
      if (q) { if ((it.name + ' ' + it.desc + ' ' + it.cat + ' ' + it.tags.join(' ')).toLowerCase().indexOf(q) < 0) return false; }
      else if (it.cat !== state.category) return false;
      if (state.tag !== 'all' && it.tags.indexOf(state.tag) < 0) return false;
      return true;
    });
    grid.innerHTML = list.map(menuCardHTML).join('');
    empty.hidden = list.length > 0;
    $$('.tab-btn').forEach(function (b) { var on = !q && b.getAttribute('data-category') === state.category; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
  }
  function initMenu() {
    renderMenu();
    $('#menuTabs').addEventListener('click', function (e) {
      var b = e.target.closest('.tab-btn'); if (!b) return;
      state.category = b.getAttribute('data-category'); state.query = ''; $('#menuSearch').value = ''; renderMenu();
    });
    $('#menuSearch').addEventListener('input', function (e) { state.query = e.target.value; renderMenu(); });
    $$('.tag-filter').forEach(function (b) {
      b.addEventListener('click', function () {
        state.tag = b.getAttribute('data-tag');
        $$('.tag-filter').forEach(function (x) { var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        renderMenu();
      });
    });
    $('#menuGrid').addEventListener('click', function (e) {
      var card = e.target.closest('.menu-card'); if (!card) return;
      var sb = e.target.closest('.size-btn');
      if (sb) {
        $$('.size-btn', card).forEach(function (x) { var on = x === sb; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        $('[data-price]', card).textContent = money(parseFloat(card.getAttribute('data-base')) + parseFloat(sb.getAttribute('data-mult')));
        return;
      }
      var qb = e.target.closest('[data-qty]');
      if (qb) { var v = $('.qty-val', card); v.textContent = Math.max(1, Math.min(10, parseInt(v.textContent, 10) + parseInt(qb.getAttribute('data-qty'), 10))); return; }
      if (e.target.closest('.add-btn')) {
        var it = ITEMS_BY_ID[card.getAttribute('data-id')], act = $('.size-btn.is-active', card);
        addToCart({ id: it.id, name: it.name, size: act.getAttribute('data-size'), price: it.price + parseFloat(act.getAttribute('data-mult')), img: img(it.img, 200) }, parseInt($('.qty-val', card).textContent, 10));
        $('.qty-val', card).textContent = '1';
      }
    });
  }

  /* ---------- Bean shop ---------- */
  function beanCardHTML(b) {
    var on = wishlist.indexOf(b.id) >= 0;
    return '<article class="bean-card" data-id="' + b.id + '">' +
      '<div class="card-media"><img src="' + img(b.img, 640) + '" alt="' + esc(b.name) + ' whole beans" loading="lazy" width="640" height="480"><span class="origin-tag">' + esc(b.origin) + '</span>' +
      '<button type="button" class="wish-btn' + (on ? ' is-on' : '') + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Remove ' : 'Add ') + esc(b.name) + (on ? ' from wishlist' : ' to wishlist') + '"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9-9.4C2 7.800 4.300 5 7.300 5c1.900 0 3.500 1 4.700 2.700C13.200 6 14.800 5 16.700 5 19.700 5 22 7.800 21 11.100c-1.500 4.800-9 9.400-9 9.400z"/></svg></button></div>' +
      '<div class="card-body"><div class="card-top"><h3 class="card-name">' + esc(b.name) + '</h3><span class="price" data-price>' + money(b.p250) + '</span></div>' +
      '<div class="roast"><div class="roast-label"><span>Roast</span><span>' + esc(b.roastName) + '</span></div><div class="roast-bar" role="img" aria-label="Roast level: ' + esc(b.roastName) + '"><span class="roast-fill" style="width:' + b.roast + '%"></span></div></div>' +
      '<p class="bean-notes"><strong>Tasting notes:</strong> ' + esc(b.notes) + '</p>' +
      '<div class="card-controls"><div class="control-row"><div class="size-group" role="group" aria-label="Weight for ' + esc(b.name) + '">' +
      '<button type="button" class="size-btn is-active" data-size="250g" data-price="' + b.p250 + '" aria-pressed="true">250g</button><button type="button" class="size-btn" data-size="1kg" data-price="' + b.p1k + '" aria-pressed="false">1kg</button></div>' +
      '<div class="qty" role="group" aria-label="Quantity for ' + esc(b.name) + '"><button type="button" data-qty="-1" aria-label="Decrease quantity">&minus;</button><span class="qty-val">1</span><button type="button" data-qty="1" aria-label="Increase quantity">+</button></div></div>' +
      '<button type="button" class="btn btn-primary btn-small add-btn">Add to Cart</button></div></div></article>';
  }
  function initBeans() {
    var grid = $('#beanGrid');
    grid.innerHTML = BEANS.map(beanCardHTML).join('');
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.bean-card'); if (!card) return;
      var b = BEANS.filter(function (x) { return x.id === card.getAttribute('data-id'); })[0];
      var sb = e.target.closest('.size-btn');
      if (sb) {
        $$('.size-btn', card).forEach(function (x) { var on = x === sb; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        $('[data-price]', card).textContent = money(parseFloat(sb.getAttribute('data-price'))); return;
      }
      var qb = e.target.closest('[data-qty]');
      if (qb) { var v = $('.qty-val', card); v.textContent = Math.max(1, Math.min(10, parseInt(v.textContent, 10) + parseInt(qb.getAttribute('data-qty'), 10))); return; }
      var wb = e.target.closest('.wish-btn');
      if (wb) {
        var i = wishlist.indexOf(b.id);
        if (i >= 0) wishlist.splice(i, 1); else wishlist.push(b.id);
        store(KEYS.wish, wishlist);
        var on = wishlist.indexOf(b.id) >= 0;
        wb.classList.toggle('is-on', on); wb.setAttribute('aria-pressed', on);
        wb.setAttribute('aria-label', (on ? 'Remove ' : 'Add ') + b.name + (on ? ' from wishlist' : ' to wishlist'));
        toast(on ? b.name + ' saved to wishlist' : b.name + ' removed from wishlist');
        return;
      }
      if (e.target.closest('.add-btn')) {
        var act = $('.size-btn.is-active', card);
        addToCart({ id: b.id, name: b.name, size: act.getAttribute('data-size'), price: parseFloat(act.getAttribute('data-price')), img: img(b.img, 200) }, parseInt($('.qty-val', card).textContent, 10));
        $('.qty-val', card).textContent = '1';
      }
    });
  }

  /* ---------- Quick view ---------- */
  function initQuickView() {
    var modal = $('#quickModal'), current = null;
    $$('.quick-view').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = SIGNATURES[b.getAttribute('data-id')]; if (!s) return;
        current = s;
        $('#qvImg').src = img(s.img, 900); $('#qvImg').alt = s.name;
        $('#qvKicker').textContent = s.kicker; $('#qvName').textContent = s.name; $('#qvDesc').textContent = s.desc;
        $('#qvIngredients').textContent = s.ingredients; $('#qvNotes').textContent = s.notes; $('#qvPrice').textContent = money(s.price);
        openLayer(modal, { focus: '#qvAdd' });
      });
    });
    $('#qvAdd').addEventListener('click', function () {
      if (!current) return;
      addToCart({ id: current.id, name: current.name, size: 'Regular', price: current.price, img: img(current.img, 200) }, 1);
      closeLayer(modal);
    });
  }

  /* ---------- Modal generic close ---------- */
  function initModals() {
    ['quickModal', 'orderModal'].forEach(function (id) {
      var m = document.getElementById(id);
      m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) closeLayer(m); });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  function initGallery() {
    var lb = $('#lightbox'), im = $('#lbImg'), cap = $('#lbCaption');
    var items = $$('.masonry-item'), idx = 0;
    function show(i) {
      idx = (i + items.length) % items.length;
      var src = $('img', items[idx]);
      im.src = src.src.replace(/w=\d+/, 'w=1400'); im.alt = src.alt;
      cap.textContent = src.alt + ' (' + (idx + 1) + ' / ' + items.length + ')';
    }
    items.forEach(function (b, i) { b.addEventListener('click', function () { show(i); openLayer(lb, { focus: '#lbClose' }); }); });
    $('#lbClose').addEventListener('click', function () { closeLayer(lb); });
    $('#lbPrev').addEventListener('click', function () { show(idx - 1); });
    $('#lbNext').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLayer(lb); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') show(idx - 1); else if (e.key === 'ArrowRight') show(idx + 1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) show(dx < 0 ? idx + 1 : idx - 1);
    });
  }

  /* ---------- Testimonials slider ---------- */
  function initSlider() {
    var track = $('#sliderTrack'), wrap = $('#reviewSlider'), dotsEl = $('#sliderDots');
    var slides = $$('.slide', track), idx = 0, timer = null, paused = false;
    slides.forEach(function (s, i) {
      var d = document.createElement('button'); d.type = 'button'; d.className = 'dot'; d.setAttribute('role', 'tab'); d.setAttribute('aria-label', 'Go to review ' + (i + 1));
      d.addEventListener('click', function () { go(i); restart(); }); dotsEl.appendChild(d);
    });
    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      $$('.dot', dotsEl).forEach(function (d, k) { d.classList.toggle('is-active', k === idx); d.setAttribute('aria-selected', k === idx ? 'true' : 'false'); });
      slides.forEach(function (s, k) { s.setAttribute('aria-hidden', k === idx ? 'false' : 'true'); });
    }
    function restart() { clearInterval(timer); if (!reduceMotion) timer = setInterval(function () { if (!paused && !document.hidden) go(idx + 1); }, 6000); }
    $('#sliderPrev').addEventListener('click', function () { go(idx - 1); restart(); });
    $('#sliderNext').addEventListener('click', function () { go(idx + 1); restart(); });
    wrap.addEventListener('mouseenter', function () { paused = true; });
    wrap.addEventListener('mouseleave', function () { paused = false; });
    wrap.addEventListener('focusin', function () { paused = true; });
    wrap.addEventListener('focusout', function () { paused = false; });
    var sx = null;
    wrap.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; paused = true; }, { passive: true });
    wrap.addEventListener('touchend', function (e) {
      paused = false; if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { go(dx < 0 ? idx + 1 : idx - 1); restart(); }
    });
    wrap.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { go(idx - 1); restart(); } else if (e.key === 'ArrowRight') { go(idx + 1); restart(); } });
    go(0); restart();
  }

  /* ---------- Events ---------- */
  function initEvents() {
    var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var weekdays = [6, 5];
    $$('.event-day').forEach(function (el, i) {
      var d = new Date(); d.setDate(d.getDate() + (parseInt(el.getAttribute('data-offset'), 10) || 7));
      while (d.getDay() !== weekdays[i % 2]) d.setDate(d.getDate() + 1);
      el.textContent = d.getDate();
      var m = el.parentNode.querySelector('.event-month'); if (m) m.textContent = MONTHS[d.getMonth()];
    });
    $$('.book-seat').forEach(function (b) {
      b.addEventListener('click', function () {
        var name = b.getAttribute('data-event'), ev = EVENTS[name];
        addToCart({ id: ev.id, name: name + ' (1 seat)', size: 'Seat', price: ev.price, img: img(ev.img, 200) }, 1);
        openCart();
      });
    });
  }

  /* ---------- Validation helpers ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setError(input, msg) {
    var f = input.closest('.field'); if (!f) return;
    var e = $('.field-error', f);
    f.classList.toggle('has-error', !!msg);
    if (e) e.textContent = msg || '';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function check(input, rule) { var msg = rule(input.value.trim()); setError(input, msg); return !msg; }
  var rules = {
    name: function (v) { return v.length < 2 ? 'Please enter your full name.' : ''; },
    email: function (v) { return !v ? 'Please enter your email.' : (EMAIL_RE.test(v) ? '' : 'Please enter a valid email address.'); },
    phone: function (v) { return v.replace(/\D/g, '').length < 7 ? 'Please enter a valid phone number.' : ''; },
    req: function (v) { return v ? '' : 'Please choose an option.'; },
    date: function (v) {
      if (!v) return 'Please choose a date.';
      var t = new Date(); var today = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
      return v < today ? 'Please choose today or a future date.' : '';
    }
  };

  function initNewsletter() {
    var f = $('#newsletterForm'), i = $('#nlEmail');
    i.addEventListener('input', function () { if (i.getAttribute('aria-invalid') === 'true') check(i, rules.email); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!check(i, rules.email)) { i.focus(); return; }
      $('#nlSuccess').hidden = false; f.reset(); toast('Welcome to the Noir Letter');
    });
  }

  function initReservation() {
    var f = $('#reserveForm'), d = $('#rDate');
    var t = new Date(); d.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    var map = [['#rName', rules.name], ['#rEmail', rules.email], ['#rPhone', rules.phone], ['#rDate', rules.date], ['#rTime', rules.req], ['#rGuests', rules.req]];
    map.forEach(function (m) { var el = $(m[0]); ['blur', 'change'].forEach(function (ev) { el.addEventListener(ev, function () { check(el, m[1]); }); }); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      map.forEach(function (m) { var el = $(m[0]); if (!check(el, m[1]) && !firstBad) firstBad = el; });
      if (firstBad) { firstBad.focus(); toast('Please check the highlighted fields', true); return; }
      $('#reserveSuccessText').textContent = 'Thank you, ' + $('#rName').value.trim() + '. We have requested a table for ' + $('#rGuests').value + (+$('#rGuests').value === 1 ? ' guest' : ' guests') + ' on ' + $('#rDate').value + ' at ' + $('#rTime').value + '. A confirmation will be sent to ' + $('#rEmail').value.trim() + '.';
      $$('.form-grid, .reserve-form > .btn', f).forEach(function (n) { n.hidden = true; });
      $('#reserveSuccess').hidden = false; $('#reserveSuccess').scrollIntoView({ block: 'nearest' });
    });
    $('#reserveAgain').addEventListener('click', function () {
      f.reset(); $('#reserveSuccess').hidden = true;
      $$('.form-grid, .reserve-form > .btn', f).forEach(function (n) { n.hidden = false; });
      $$('.field', f).forEach(function (x) { x.classList.remove('has-error'); });
      $('#rName').focus();
    });
  }

  function resetOrderForm() {
    var f = $('#orderForm'); f.reset(); f.hidden = false; $('#orderSuccess').hidden = true;
    $$('.field', f).forEach(function (x) { x.classList.remove('has-error'); });
    $$('.field-error', f).forEach(function (x) { x.textContent = ''; });
  }
  function initOrder() {
    var f = $('#orderForm');
    var map = [['#oName', rules.name], ['#oPhone', rules.phone], ['#oTime', rules.req]];
    map.forEach(function (m) { var el = $(m[0]); ['blur', 'change'].forEach(function (ev) { el.addEventListener(ev, function () { check(el, m[1]); }); }); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cart.length) { toast('Your cart is empty', true); closeLayer($('#orderModal')); return; }
      var bad = null;
      map.forEach(function (m) { var el = $(m[0]); if (!check(el, m[1]) && !bad) bad = el; });
      if (bad) { bad.focus(); return; }
      var svc = $('input[name="service"]:checked', f).value, t = totals();
      var num = 'MN-' + Math.floor(1000 + Math.random() * 9000);
      $('#orderSuccessText').textContent = 'Order ' + num + ' for ' + svc.toLowerCase() + ' (' + $('#oTime').value.toLowerCase() + ') totals ' + money(t.total) + '. Thank you, ' + $('#oName').value.trim() + '.';
      f.hidden = true; $('#orderSuccess').hidden = false;
      cart = []; promoApplied = false; saveCart(); store(KEYS.promo, null); renderCart();
      var pm = $('#promoMsg'); if (pm) pm.textContent = '';
      var s = $('#orderSuccess .btn'); if (s) s.focus();
    });
  }

  /* ---------- Footer ---------- */
  function initFooter() { var y = $('#year'); if (y) y.textContent = new Date().getFullYear(); }

  /* ---------- Init ---------- */
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.error(fn.name || 'init', e); } }
  function init() {
    safe(initPreloader);
    [initTheme, initMobileMenu, initSmoothScroll, initScrollListeners, initCursor, initMagnetic, initReveal, initCounters, initHours,
      initCart, initMenu, initBeans, initQuickView, initModals, initGallery, initSlider, initEvents, initNewsletter, initReservation, initOrder, initFooter].forEach(safe);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
