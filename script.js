/* EMBER & OAK COFFEE - script.js (vanilla JS) */
(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var KEYS = { cart: 'eo-cart', promo: 'eo-promo', wish: 'eo-wish', theme: 'eo-theme' };
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
    { cat: 'Brunch', name: 'Oak Breakfast Plate', desc: 'Two eggs, toast, roasted tomato and a side salad.', price: 14.0, img: I.breakfast, tags: [], sizes: 'food' },
    { cat: 'Brunch', name: 'Brioche French Toast', desc: 'Caramelised brioche with berries, mascarpone and maple.', price: 13.5, img: I.frenchToast, tags: [], sizes: 'food' },
    { cat: 'Brunch', name: 'Brunch Board', desc: 'Pastries, fruit, cheese and preserves to share.', price: 22.0, img: I.spread, tags: ['vegan'], sizes: 'food' },
    { cat: 'Brunch', name: 'Chicken Club', desc: 'Roast chicken, bacon, avocado and aioli on toasted bread.', price: 13.0, img: I.sandwich, tags: [], sizes: 'food' },
    { cat: 'Brunch', name: 'Berry Granola Bowl', desc: 'Coconut yogurt, house granola and fresh berries.', price: 9.5, img: I.berry, tags: ['vegan', 'gluten free'], sizes: 'food' }
  ].map(function (it, i) { it.id = 'm-' + (i + 1) + '-' + slug(it.name); return it; });

  var SIGNATURES = {
    'sig-1': { id: 'sig-1', name: 'Velvet Oak Latte', kicker: 'Milk and espresso', price: 6.5, img: I.velvet, desc: 'Our most ordered drink: a double ristretto softened by silky milk and a pinch of smoked cocoa.', ingredients: 'Double ristretto, steamed whole milk, smoked cocoa, raw honey.', notes: 'Dark chocolate, toasted hazelnut, a long creamy finish.' },
    'sig-2': { id: 'sig-2', name: 'Ember Cold Brew', kicker: 'Cold, slow, deep', price: 5.75, img: I.icedMilk, desc: 'Eighteen hours of patient steeping produce a cold brew that is smooth, syrupy and never bitter.', ingredients: 'Cold brew concentrate, filtered water, burnt orange syrup, brown sugar, ice.', notes: 'Brown sugar, orange zest, black cherry.' },
    'sig-3': { id: 'sig-3', name: 'Brass Cortado', kicker: 'Short and balanced', price: 4.9, img: I.blueCup, desc: 'Equal parts espresso and warm milk, served in a hand-thrown cup for a perfectly balanced sip.', ingredients: 'Single origin espresso, warm steamed milk.', notes: 'Caramel, red apple, milk chocolate.' }
  };

  var BEANS = [
    { id: 'bean-ethiopia', flavor: 'fruit', name: 'Ethiopia Yirgacheffe', origin: 'Ethiopia', roast: 30, roastName: 'Light', notes: 'Blueberry, jasmine, lemon zest', p250: 19, p1k: 64, img: I.bag },
    { id: 'bean-colombia', flavor: 'choc', name: 'Colombia Huila', origin: 'Colombia', roast: 50, roastName: 'Medium', notes: 'Red apple, caramel, cocoa', p250: 17, p1k: 58, img: I.bagGrinder },
    { id: 'bean-guatemala', flavor: 'choc', name: 'Guatemala Antigua', origin: 'Guatemala', roast: 60, roastName: 'Medium', notes: 'Milk chocolate, orange, toasted almond', p250: 17.5, p1k: 60, img: I.beans },
    { id: 'bean-kenya', flavor: 'fruit', name: 'Kenya AA Nyeri', origin: 'Kenya', roast: 35, roastName: 'Light', notes: 'Blackcurrant, grapefruit, brown sugar', p250: 21, p1k: 72, img: I.beanJar },
    { id: 'bean-brazil', flavor: 'smoke', name: 'Brazil Santos', origin: 'Brazil', roast: 75, roastName: 'Medium dark', notes: 'Roasted peanut, dark chocolate, molasses', p250: 15, p1k: 50, img: I.beanCup },
    { id: 'bean-ember', flavor: 'smoke', name: 'House Ember Blend', origin: 'Blend', roast: 88, roastName: 'Dark', notes: 'Dark cocoa, black cherry, smoke', p250: 16, p1k: 54, img: I.beanLatte }
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
  function revealHeroNow() {
    $$('.hero .reveal, .hero .split').forEach(function (n) { n.classList.add('is-visible'); });
    setTimeout(function () { $$('.hero .reveal').forEach(function (n) { n.style.transitionDelay = ''; }); }, 2600);
  }

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
      if (!reduceMotion) { root.classList.add('theme-fade'); setTimeout(function () { root.classList.remove('theme-fade'); }, 750); }
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
  var spyIds = ['home', 'about', 'menu', 'signature', 'gallery', 'reviews', 'faq', 'reserve', 'contact'];
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
    $$('[data-stagger]').forEach(function (p) {
      Array.prototype.forEach.call(p.children, function (c, i) { c.classList.add('reveal'); if (!c.hasAttribute('data-delay')) c.setAttribute('data-delay', String(i * 90)); });
    });
    $$('.reveal').forEach(function (n) { var d = n.getAttribute('data-delay'); if (d) n.style.transitionDelay = d + 'ms'; });
    var all = $$('.reveal, .split');
    var els = all.filter(function (n) { return !n.closest('.hero'); });
    function clearDelay(n) { setTimeout(function () { n.style.transitionDelay = ''; }, 1800 + (parseInt(n.getAttribute('data-delay'), 10) || 0)); }
    if (reduceMotion || !('IntersectionObserver' in window)) { all.forEach(function (n) { n.classList.add('is-visible'); n.style.transitionDelay = ''; }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); clearDelay(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.01, rootMargin: '0px 0px -7% 0px' });
    els.forEach(function (n) { io.observe(n); });
    /* Safety net: clipped targets can report zero visible area, so also check geometry on scroll. */
    var pend = els.filter(function (n) { return n.getAttribute('data-reveal') === 'clip'; });
    if (pend.length) {
      var tick = false;
      var sweep = function () {
        tick = false;
        pend = pend.filter(function (n) {
          if (n.classList.contains('is-visible')) return false;
          var r = n.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.93 && r.bottom > 0) { n.classList.add('is-visible'); clearDelay(n); io.unobserve(n); return false; }
          return true;
        });
        if (!pend.length) { window.removeEventListener('scroll', onS); window.removeEventListener('resize', onS); }
      };
      var onS = function () { if (!tick) { tick = true; requestAnimationFrame(sweep); } };
      window.addEventListener('scroll', onS, { passive: true });
      window.addEventListener('resize', onS);
      onS();
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

  function addToCart(item, qty, silent, fromEl, color) {
    qty = qty || 1;
    var key = item.id + '|' + (item.size || '');
    var found = cart.filter(function (c) { return c.key === key; })[0];
    if (found) found.qty = Math.min(20, found.qty + qty);
    else cart.push({ key: key, id: item.id, name: item.name, size: item.size || '', price: item.price, img: item.img, qty: Math.min(20, qty) });
    saveCart(); renderCart();
    if (!(fromEl && flyToCart(fromEl, bumpCart, color))) bumpCart();
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
    updatePill();
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
  var HEART = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9-9.4C2 7.8 4.3 5 7.3 5c1.9 0 3.5 1 4.7 2.7C13.2 6 14.800 5 16.700 5 19.700 5 22 7.800 21 11.100c-1.500 4.800-9 9.400-9 9.400z"/></svg>';
  function wishBtn(id, name, on) {
    return '<button type="button" class="wish-btn' + (on ? ' is-on' : '') + '" data-wish="' + esc(id) + '" data-name="' + esc(name) + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Remove ' : 'Add ') + esc(name) + (on ? ' from favorites' : ' to favorites') + '">' + HEART + '</button>';
  }
  function handleWish(e) {
    var wb = e.target.closest('.wish-btn'); if (!wb) return false;
    var id = wb.getAttribute('data-wish'), name = wb.getAttribute('data-name');
    var i = wishlist.indexOf(id);
    if (i >= 0) wishlist.splice(i, 1); else wishlist.push(id);
    store(KEYS.wish, wishlist);
    var on = wishlist.indexOf(id) >= 0;
    wb.classList.toggle('is-on', on); wb.setAttribute('aria-pressed', on);
    wb.setAttribute('aria-label', (on ? 'Remove ' : 'Add ') + name + (on ? ' from favorites' : ' to favorites'));
    wb.classList.remove('pop'); void wb.offsetWidth; if (on) wb.classList.add('pop');
    toast(on ? name + ' saved to favorites' : name + ' removed from favorites');
    return true;
  }
  function hl(text, q) {
    if (!q) return esc(text);
    var lower = text.toLowerCase(), ql = q.toLowerCase(), out = '', i = 0, idx;
    while ((idx = lower.indexOf(ql, i)) > -1) { out += esc(text.slice(i, idx)) + '<mark>' + esc(text.slice(idx, idx + q.length)) + '</mark>'; i = idx + q.length; }
    return out + esc(text.slice(i));
  }
  function sizeList(item) { return item.sizes === 'drink' ? DRINK_SIZES : FOOD_SIZES; }
  function menuCardHTML(it, i, q) {
    var sizes = sizeList(it), on = wishlist.indexOf(it.id) >= 0;
    return '<article class="menu-card" data-id="' + it.id + '" data-base="' + it.price + '" style="--i:' + Math.min(i, 8) + '">' +
      '<div class="card-media"><img src="' + img(it.img, 640) + '" alt="' + esc(it.name) + '" loading="lazy" width="640" height="480">' +
      '<div class="card-overlay" aria-hidden="true"><span>' + esc(it.cat) + '</span><b>' + (it.tags.length ? esc(it.tags.join(' \u00b7 ')) : 'Made fresh daily') + '</b></div>' + wishBtn(it.id, it.name, on) + '</div>' +
      '<div class="card-body"><div class="card-top"><h3 class="card-name">' + hl(it.name, q) + '</h3><span class="price" data-price>' + money(it.price) + '</span></div>' +
      '<p class="card-desc">' + hl(it.desc, q) + '</p>' +
      '<div class="tags">' + (it.tags.length ? it.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') : '<span class="tag">' + esc(it.cat) + '</span>') + '</div>' +
      '<div class="card-controls"><div class="control-row">' +
      '<div class="size-group" role="group" aria-label="Size for ' + esc(it.name) + '">' + sizes.map(function (s, k) { return '<button type="button" class="size-btn' + (k === 0 ? ' is-active' : '') + '" data-size="' + s.n + '" data-mult="' + s.m + '" aria-pressed="' + (k === 0) + '">' + s.n + '</button>'; }).join('') + '</div>' +
      '<div class="qty" role="group" aria-label="Quantity for ' + esc(it.name) + '"><button type="button" data-qty="-1" aria-label="Decrease quantity">&minus;</button><span class="qty-val">1</span><button type="button" data-qty="1" aria-label="Increase quantity">+</button></div></div>' +
      '<button type="button" class="btn btn-primary btn-small add-btn">Add to Cart</button></div></div></article>';
  }
  function syncTabs() {
    var q = state.query.trim();
    $$('.tab-btn').forEach(function (b) { var on = !q && b.getAttribute('data-category') === state.category; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    moveTabIndicator();
  }
  function moveTabIndicator() {
    var ind = $('#tabIndicator'), tabs = $('#menuTabs'), a = $('.tab-btn.is-active');
    if (!ind || !tabs) return;
    if (!a) { ind.style.opacity = '0'; return; }
    ind.style.opacity = '1';
    ind.style.width = a.offsetWidth + 'px'; ind.style.height = a.offsetHeight + 'px';
    ind.style.top = a.offsetTop + 'px'; ind.style.transform = 'translateX(' + a.offsetLeft + 'px)';
  }
  function renderMenu(anim) {
    var grid = $('#menuGrid'), empty = $('#menuEmpty');
    var q = state.query.trim(), ql = q.toLowerCase();
    var list = MENU_ITEMS.filter(function (it) {
      if (ql) { if ((it.name + ' ' + it.desc + ' ' + it.cat + ' ' + it.tags.join(' ')).toLowerCase().indexOf(ql) < 0) return false; }
      else if (it.cat !== state.category) return false;
      if (state.tag !== 'all' && it.tags.indexOf(state.tag) < 0) return false;
      return true;
    });
    grid.classList.toggle('no-anim', !anim);
    grid.innerHTML = list.map(function (it, i) { return menuCardHTML(it, i, q); }).join('');
    empty.hidden = list.length > 0;
    syncTabs();
  }
  function initMenu() {
    var grid = $('#menuGrid'), tabs = $('#menuTabs'), swapTimer = null;
    function swap() {
      clearTimeout(swapTimer);
      if (reduceMotion) { renderMenu(false); return; }
      grid.classList.add('is-out');
      swapTimer = setTimeout(function () { renderMenu(true); grid.classList.remove('is-out'); }, 220);
    }
    renderMenu(true);
    window.addEventListener('resize', moveTabIndicator);
    window.addEventListener('load', moveTabIndicator);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveTabIndicator);
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('.tab-btn'); if (!b) return;
      state.category = b.getAttribute('data-category'); state.query = ''; $('#menuSearch').value = '';
      syncTabs();
      tabs.scrollTo({ left: b.offsetLeft - (tabs.clientWidth - b.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      swap();
    });
    $('#menuSearch').addEventListener('input', function (e) { state.query = e.target.value; clearTimeout(swapTimer); grid.classList.remove('is-out'); renderMenu(false); });
    $$('.tag-filter').forEach(function (b) {
      b.addEventListener('click', function () {
        state.tag = b.getAttribute('data-tag');
        $$('.tag-filter').forEach(function (x) { var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        swap();
      });
    });
    grid.addEventListener('click', function (e) {
      if (handleWish(e)) return;
      var card = e.target.closest('.menu-card'); if (!card) return;
      var sb = e.target.closest('.size-btn');
      if (sb) {
        $$('.size-btn', card).forEach(function (x) { var on = x === sb; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        var pr = $('[data-price]', card); pr.textContent = money(parseFloat(card.getAttribute('data-base')) + parseFloat(sb.getAttribute('data-mult')));
        pr.classList.remove('tick'); void pr.offsetWidth; pr.classList.add('tick');
        return;
      }
      var qb = e.target.closest('[data-qty]');
      if (qb) { var v = $('.qty-val', card); v.textContent = Math.max(1, Math.min(10, parseInt(v.textContent, 10) + parseInt(qb.getAttribute('data-qty'), 10))); return; }
      var ab = e.target.closest('.add-btn');
      if (ab) {
        var it = ITEMS_BY_ID[card.getAttribute('data-id')], act = $('.size-btn.is-active', card);
        addFlow(ab, { id: it.id, name: it.name, size: act.getAttribute('data-size'), price: it.price + parseFloat(act.getAttribute('data-mult')), img: img(it.img, 200) }, parseInt($('.qty-val', card).textContent, 10), $('.card-media img', card));
        $('.qty-val', card).textContent = '1';
      }
    });
  }

  /* ---------- Bean shop ---------- */
  var GRINDS = [
    ['Whole bean', 'Grind just before brewing for the fullest aroma.'],
    ['Espresso', 'Fine grind. Aim for 28 to 32 seconds for a double shot.'],
    ['Moka pot', 'Medium-fine grind. Fill the basket level and do not tamp.'],
    ['Filter / V60', 'Medium grind. Ratio 1:16 at 94 C, about three minutes.'],
    ['French press', 'Coarse grind. Steep for four minutes, then press slowly.']
  ];
  function beanCardHTML(b) {
    var on = wishlist.indexOf(b.id) >= 0;
    return '<article class="bean-card" data-id="' + b.id + '">' +
      '<div class="card-media"><img src="' + img(b.img, 640) + '" alt="' + esc(b.name) + ' whole beans" loading="lazy" width="640" height="480"><span class="origin-tag">' + esc(b.origin) + '</span>' +
      '<div class="card-overlay" aria-hidden="true"><span>' + esc(b.roastName) + ' roast</span><b>' + esc(b.notes) + '</b></div>' + wishBtn(b.id, b.name, on) + '</div>' +
      '<div class="card-body"><div class="card-top"><h3 class="card-name">' + esc(b.name) + '</h3><span class="price" data-price>' + money(b.p250) + '</span></div>' +
      '<div class="roast"><div class="roast-label"><span>Roast</span><span>' + esc(b.roastName) + '</span></div><div class="roast-bar" role="img" aria-label="Roast level: ' + esc(b.roastName) + '"><span class="roast-fill" style="width:' + b.roast + '%"></span></div></div>' +
      '<p class="bean-notes"><strong>Tasting notes:</strong> ' + esc(b.notes) + '</p>' +
      '<div class="grind-row"><label class="grind-label" for="grind-' + b.id + '">Grind</label><select class="grind-select" id="grind-' + b.id + '">' + GRINDS.map(function (g) { return '<option>' + g[0] + '</option>'; }).join('') + '</select></div>' +
      '<p class="brew-tip" aria-live="polite">' + GRINDS[0][1] + '</p>' +
      '<div class="card-controls"><div class="control-row"><div class="size-group" role="group" aria-label="Weight for ' + esc(b.name) + '">' +
      '<button type="button" class="size-btn is-active" data-size="250g" data-price="' + b.p250 + '" aria-pressed="true">250g</button><button type="button" class="size-btn" data-size="1kg" data-price="' + b.p1k + '" aria-pressed="false">1kg</button></div>' +
      '<div class="qty" role="group" aria-label="Quantity for ' + esc(b.name) + '"><button type="button" data-qty="-1" aria-label="Decrease quantity">&minus;</button><span class="qty-val">1</span><button type="button" data-qty="1" aria-label="Increase quantity">+</button></div></div>' +
      '<button type="button" class="btn btn-primary btn-small add-btn">Add to Cart</button></div></div></article>';
  }
  function initBeans() {
    var grid = $('#beanGrid');
    grid.innerHTML = BEANS.map(beanCardHTML).join('');
    grid.addEventListener('change', function (e) {
      var s = e.target.closest('.grind-select'); if (!s) return;
      var tip = $('.brew-tip', s.closest('.bean-card'));
      GRINDS.forEach(function (g) { if (g[0] === s.value) { tip.textContent = g[1]; tip.classList.remove('tick'); void tip.offsetWidth; tip.classList.add('tick'); } });
    });
    grid.addEventListener('click', function (e) {
      if (handleWish(e)) return;
      var card = e.target.closest('.bean-card'); if (!card) return;
      var b = BEANS.filter(function (x) { return x.id === card.getAttribute('data-id'); })[0];
      var sb = e.target.closest('.size-btn');
      if (sb) {
        $$('.size-btn', card).forEach(function (x) { var on = x === sb; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        var pr = $('[data-price]', card); pr.textContent = money(parseFloat(sb.getAttribute('data-price')));
        pr.classList.remove('tick'); void pr.offsetWidth; pr.classList.add('tick'); return;
      }
      var qb = e.target.closest('[data-qty]');
      if (qb) { var v = $('.qty-val', card); v.textContent = Math.max(1, Math.min(10, parseInt(v.textContent, 10) + parseInt(qb.getAttribute('data-qty'), 10))); return; }
      var ab = e.target.closest('.add-btn');
      if (ab) {
        var act = $('.size-btn.is-active', card), gr = $('.grind-select', card).value;
        addFlow(ab, { id: b.id, name: b.name, size: act.getAttribute('data-size') + ', ' + gr, price: parseFloat(act.getAttribute('data-price')), img: img(b.img, 200) }, parseInt($('.qty-val', card).textContent, 10), $('.card-media img', card));
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
      addToCart({ id: current.id, name: current.name, size: 'Regular', price: current.price, img: img(current.img, 200) }, 1, false, $('#qvImg'));
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
    var track = $('#sliderTrack'), wrap = $('#reviewSlider'), dotsEl = $('#sliderDots'), viewport = $('#sliderViewport'), prog = $('#sliderProgress');
    var slides = $$('.slide', track), idx = 0, paused = false, dragging = false, DURATION = 6500, startT = 0, elapsed = 0, raf = null;
    slides.forEach(function (s, i) {
      var d = document.createElement('button'); d.type = 'button'; d.className = 'dot'; d.setAttribute('role', 'tab'); d.setAttribute('aria-label', 'Go to review ' + (i + 1));
      d.addEventListener('click', function () { go(i); }); dotsEl.appendChild(d);
    });
    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transition = ''; track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      $$('.dot', dotsEl).forEach(function (d, k) { d.classList.toggle('is-active', k === idx); d.setAttribute('aria-selected', k === idx ? 'true' : 'false'); });
      slides.forEach(function (s, k) { s.setAttribute('aria-hidden', k === idx ? 'false' : 'true'); s.classList.toggle('is-current', k === idx); });
      elapsed = 0; startT = performance.now(); if (prog) prog.style.transform = 'scaleX(0)';
    }
    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (paused || dragging || document.hidden) { startT = now - elapsed; return; }
      elapsed = now - startT;
      if (prog) prog.style.transform = 'scaleX(' + Math.min(1, elapsed / DURATION).toFixed(4) + ')';
      if (elapsed >= DURATION) go(idx + 1);
    }
    if (!reduceMotion) { startT = performance.now(); raf = requestAnimationFrame(loop); }
    $('#sliderPrev').addEventListener('click', function () { go(idx - 1); });
    $('#sliderNext').addEventListener('click', function () { go(idx + 1); });
    wrap.addEventListener('mouseenter', function () { paused = true; wrap.classList.add('is-paused'); });
    wrap.addEventListener('mouseleave', function () { paused = false; wrap.classList.remove('is-paused'); });
    wrap.addEventListener('focusin', function () { paused = true; });
    wrap.addEventListener('focusout', function () { paused = false; });
    wrap.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(idx - 1); else if (e.key === 'ArrowRight') go(idx + 1); });
    // pointer drag / swipe
    var sx = 0, sy = 0, dx = 0, w = 1, pid = null, horiz = false;
    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pid = e.pointerId; sx = e.clientX; sy = e.clientY; dx = 0; horiz = false; w = viewport.offsetWidth || 1;
    });
    viewport.addEventListener('pointermove', function (e) {
      if (e.pointerId !== pid) return;
      var mx = e.clientX - sx, my = e.clientY - sy;
      if (!dragging) {
        if (Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my)) { dragging = true; horiz = true; track.style.transition = 'none'; try { viewport.setPointerCapture(pid); } catch (er) {} viewport.classList.add('is-dragging'); }
        else return;
      }
      dx = mx;
      var edge = (idx === 0 && dx > 0) || (idx === slides.length - 1 && dx < 0) ? 0.35 : 1;
      track.style.transform = 'translateX(calc(' + (-idx * 100) + '% + ' + (dx * edge).toFixed(1) + 'px))';
    });
    function endDrag(e) {
      if (e.pointerId !== pid) return;
      pid = null;
      viewport.classList.remove('is-dragging');
      if (!dragging) return;
      dragging = false; track.style.transition = '';
      if (Math.abs(dx) > w * 0.15 || Math.abs(dx) > 50) go(dx < 0 ? idx + 1 : idx - 1); else go(idx);
    }
    viewport.addEventListener('pointerup', endDrag); viewport.addEventListener('pointercancel', endDrag);
    go(0);
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
      submitFlow($('button[type="submit"]', f), function () { $('#nlSuccess').hidden = false; f.reset(); toast('Welcome to the Ember Letter'); }, 'Subscribed');
    });
  }

  function fmtDate(v) {
    var p = v.split('-'); if (p.length !== 3) return v;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
  function confetti(host) {
    if (reduceMotion || !host) return;
    host.innerHTML = '';
    var colors = ['#B88A4A', '#D9C2A3', '#F4EBDD', '#7BB56F', '#C46B5B'];
    for (var i = 0; i < 30; i++) {
      var s = document.createElement('i');
      s.style.setProperty('--x', (Math.random() * 260 - 130).toFixed(0) + 'px');
      s.style.setProperty('--y', (-(50 + Math.random() * 150)).toFixed(0) + 'px');
      s.style.setProperty('--r', (Math.random() * 720 - 360).toFixed(0) + 'deg');
      s.style.background = colors[i % colors.length]; s.style.animationDelay = (Math.random() * 0.15).toFixed(2) + 's';
      host.appendChild(s);
    }
    setTimeout(function () { host.innerHTML = ''; }, 2600);
  }

  function initReservation() {
    var f = $('#reserveForm'); if (!f) return;
    var d = $('#rDate'), timeIn = $('#rTime'), guestIn = $('#rGuests'), chipsEl = $('#timeChips'), gc = $('#guestCount'), note = $('#guestNote');
    var panels = $$('.step-panel', f), dots = $$('#stepper li'), back = $('#stepBack'), next = $('#stepNext'), submit = $('#stepSubmit');
    var step = 1, TOTAL = 4, guests = 2;
    d.min = ymd(new Date());
    var times = []; for (var h = 8; h <= 18; h++) times.push(('0' + h).slice(-2) + ':00');
    chipsEl.innerHTML = times.map(function (t) { return '<button type="button" class="chip" data-time="' + t + '" aria-pressed="false">' + t + '</button>'; }).join('');
    var rTimeRule = function (v) { return v ? '' : 'Please pick a time.'; };
    function refreshTimes() {
      var today = d.value === ymd(new Date()), nowH = new Date().getHours();
      $$('.chip', chipsEl).forEach(function (c) {
        var t = c.getAttribute('data-time'), past = today && parseInt(t, 10) <= nowH;
        c.disabled = past; if (past && timeIn.value === t) { timeIn.value = ''; c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); }
      });
    }
    function fieldsFor(n) {
      if (n === 1) return [[d, rules.date]];
      if (n === 2) return [[timeIn, rTimeRule]];
      if (n === 4) return [[$('#rName'), rules.name], [$('#rEmail'), rules.email], [$('#rPhone'), rules.phone]];
      return [];
    }
    function validate(n) {
      var bad = null;
      fieldsFor(n).forEach(function (p) { if (!check(p[0], p[1]) && !bad) bad = p[0]; });
      if (bad) { if (bad.type !== 'hidden') bad.focus(); return false; }
      return true;
    }
    function summary() { $('#reserveSummary').textContent = fmtDate(d.value) + ' at ' + timeIn.value + ' for ' + guests + (guests === 1 ? ' guest' : ' guests'); }
    function setStep(n, focus) {
      step = n;
      panels.forEach(function (p) { p.classList.toggle('is-active', +p.getAttribute('data-panel') === n); });
      dots.forEach(function (li) {
        var k = +li.getAttribute('data-step');
        li.classList.toggle('is-active', k === n); li.classList.toggle('is-done', k < n);
        if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      f.style.setProperty('--prog', ((n - 1) / (TOTAL - 1)).toFixed(3));
      back.hidden = n === 1; next.hidden = n === TOTAL; submit.hidden = n !== TOTAL;
      if (n === TOTAL) summary();
      if (focus) { var t = $('input:not([type="hidden"]), .chip:not([disabled]), #guestPlus', panels[n - 1]); if (t) t.focus({ preventScroll: true }); }
    }
    next.addEventListener('click', function () { if (validate(step)) setStep(step + 1, true); });
    back.addEventListener('click', function () { if (step > 1) setStep(step - 1, true); });
    d.addEventListener('change', function () { refreshTimes(); check(d, rules.date); });
    $('#quickDates').addEventListener('click', function (e) {
      var b = e.target.closest('[data-quick]'); if (!b) return;
      var v = b.getAttribute('data-quick'), t = new Date();
      if (v === 'sat') { var add = (6 - t.getDay() + 7) % 7; t.setDate(t.getDate() + add); } else t.setDate(t.getDate() + parseInt(v, 10));
      d.value = ymd(t); d.dispatchEvent(new Event('change'));
    });
    chipsEl.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c || c.disabled) return;
      $$('.chip', chipsEl).forEach(function (x) { var on = x === c; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      timeIn.value = c.getAttribute('data-time'); check(timeIn, rTimeRule);
    });
    function setGuests(n) {
      if (n > 8) { note.textContent = 'For more than 8 guests, please call +1-555-014-2280.'; note.classList.add('is-info'); return; }
      note.textContent = ''; note.classList.remove('is-info');
      guests = Math.max(1, n); gc.textContent = guests; guestIn.value = guests;
      gc.classList.remove('tick'); void gc.offsetWidth; gc.classList.add('tick');
    }
    $('#guestMinus').addEventListener('click', function () { setGuests(guests - 1); });
    $('#guestPlus').addEventListener('click', function () { setGuests(guests + 1); });
    [['#rName', rules.name], ['#rEmail', rules.email], ['#rPhone', rules.phone]].forEach(function (m) { var el = $(m[0]); el.addEventListener('blur', function () { check(el, m[1]); }); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (step < TOTAL) { next.click(); return; }
      for (var n = 1; n <= TOTAL; n++) { if (!validate(n)) { setStep(n, false); toast('Please check the highlighted fields', true); return; } }
      submitFlow(submit, function () {
        $('#reserveSuccessText').textContent = 'Thank you, ' + $('#rName').value.trim() + '. We have requested a table for ' + guests + (guests === 1 ? ' guest' : ' guests') + ' on ' + fmtDate(d.value) + ' at ' + timeIn.value + '. A confirmation will be sent to ' + $('#rEmail').value.trim() + '.';
        [$('#stepper'), $('#stepPanels'), $('#stepNav')].forEach(function (n) { n.hidden = true; });
        var ok = $('#reserveSuccess'); ok.hidden = false; ok.classList.remove('is-in'); void ok.offsetWidth; ok.classList.add('is-in');
        confetti($('#confetti'));
        toast('Table requested. See you soon!');
      }, 'Requested');
    });
    $('#reserveAgain').addEventListener('click', function () {
      f.reset(); guests = 2; gc.textContent = '2'; guestIn.value = '2'; timeIn.value = ''; note.textContent = '';
      $$('.chip', chipsEl).forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-pressed', 'false'); x.disabled = false; });
      $$('.field', f).forEach(function (x) { x.classList.remove('has-error'); });
      $$('.field-error', f).forEach(function (x) { x.textContent = ''; });
      $('#reserveSuccess').hidden = true;
      [$('#stepper'), $('#stepPanels'), $('#stepNav')].forEach(function (n) { n.hidden = false; });
      setStep(1, true);
    });
    setStep(1, false);
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
      submitFlow($('button[type="submit"]', f), function () {
        var num = 'EO-' + Math.floor(1000 + Math.random() * 9000);
        $('#orderSuccessText').textContent = 'Order ' + num + ' for ' + svc.toLowerCase() + ' (' + $('#oTime').value.toLowerCase() + ') totals ' + money(t.total) + '. Thank you, ' + $('#oName').value.trim() + '.';
        f.hidden = true; var os = $('#orderSuccess'); os.hidden = false; os.classList.remove('is-in'); void os.offsetWidth; os.classList.add('is-in');
        cart = []; promoApplied = false; saveCart(); store(KEYS.promo, null); renderCart();
        var pm = $('#promoMsg'); if (pm) pm.textContent = '';
        var sb = $('#orderSuccess .btn'); if (sb) sb.focus();
      }, 'Order placed');
    });
  }

  /* ---------- UI effects: ripple, fly-to-cart, add / submit flows ---------- */
  var CHECK_SVG = '<svg class="chk" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function stripRipples(btn) { $$('.ripple', btn).forEach(function (r) { r.parentNode.removeChild(r); }); }

  function initRipple() {
    document.addEventListener('pointerdown', function (e) {
      if (reduceMotion) return;
      var b = e.target.closest && e.target.closest('.btn, .chip, .slider-arrow, .quiz-opt');
      if (!b || b.disabled) return;
      var r = b.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2;
      var s = document.createElement('span'); s.className = 'ripple';
      s.style.width = s.style.height = size + 'px';
      s.style.left = (e.clientX - r.left - size / 2) + 'px'; s.style.top = (e.clientY - r.top - size / 2) + 'px';
      b.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
    });
  }

  function bumpCart() {
    var cc = $('#cartCount'); if (cc) { cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump'); }
    var tg = $('#cartToggle'); if (tg) { tg.classList.remove('wiggle'); void tg.offsetWidth; tg.classList.add('wiggle'); }
  }
  function flyToCart(src, done, color) {
    var tg = $('#cartToggle');
    if (reduceMotion || !src || !tg || !src.getBoundingClientRect || !tg.animate) return false;
    var r = src.getBoundingClientRect(), c = tg.getBoundingClientRect();
    if (r.width < 4 || c.width < 4 || r.bottom < 0 || r.top > window.innerHeight) return false;
    var isImg = src.tagName === 'IMG';
    var w = isImg ? Math.min(r.width, 170) : 56, h = isImg ? r.height * (w / r.width) : 56;
    var left = r.left + (r.width - w) / 2, top = r.top + (r.height - h) / 2;
    var f = document.createElement(isImg ? 'img' : 'div'); f.className = 'fly-img'; if (isImg) { f.alt = ''; f.src = src.currentSrc || src.src; } else f.style.background = color || '#B88A4A';
    f.style.cssText += 'left:' + left.toFixed(1) + 'px;top:' + top.toFixed(1) + 'px;width:' + w.toFixed(1) + 'px;height:' + h.toFixed(1) + 'px;';
    document.body.appendChild(f);
    var dx = (c.left + c.width / 2) - (left + w / 2), dy = (c.top + c.height / 2) - (top + h / 2), ended = false;
    var a = f.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: 'translate(' + (dx * 0.5).toFixed(1) + 'px,' + (dy * 0.5 - 70).toFixed(1) + 'px) scale(.55)', opacity: 0.95, offset: 0.5 },
      { transform: 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(.1)', opacity: 0.3 }
    ], { duration: 780, easing: 'cubic-bezier(.5,.05,.5,1)' });
    function end() { if (ended) return; ended = true; if (f.parentNode) f.parentNode.removeChild(f); done(); }
    a.onfinish = end; a.oncancel = end;
    setTimeout(end, 1200);
    return true;
  }
  function addFlow(btn, item, qty, fromEl, color) {
    addToCart(item, qty, false, fromEl, color);
    if (!btn || btn.classList.contains('is-added')) return;
    stripRipples(btn);
    var orig = btn.innerHTML;
    btn.classList.add('is-added'); btn.innerHTML = CHECK_SVG + '<span>Added</span>';
    setTimeout(function () { btn.classList.remove('is-added'); btn.innerHTML = orig; }, 1700);
  }
  function submitFlow(btn, work, doneLabel) {
    if (!btn || btn.classList.contains('is-loading') || btn.classList.contains('is-success')) return;
    stripRipples(btn);
    var orig = btn.innerHTML;
    btn.classList.add('is-loading'); btn.disabled = true;
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>Sending</span>';
    setTimeout(function () {
      btn.classList.remove('is-loading'); btn.classList.add('is-success');
      btn.innerHTML = CHECK_SVG + '<span>' + (doneLabel || 'Done') + '</span>';
      try { work(); } catch (e) { if (window.console) console.error(e); }
      setTimeout(function () { btn.classList.remove('is-success'); btn.disabled = false; btn.innerHTML = orig; }, 1400);
    }, reduceMotion ? 150 : 900);
  }

  /* ---------- Split titles ---------- */
  function initSplit() {
    $$('.section-title, .hero-title').forEach(function (el) {
      if (el.querySelector('.w')) return;
      var label = el.textContent.replace(/\s+/g, ' ').trim(), n = 0;
      el.setAttribute('aria-label', label);
      el.classList.add('split');
      (function walk(node, inEm) {
        Array.prototype.slice.call(node.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var parts = c.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
            parts.forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
              var wi = document.createElement('span'); wi.className = 'wi'; wi.style.setProperty('--wd', (n++ * 70) + 'ms'); wi.textContent = p;
              w.appendChild(wi); frag.appendChild(w);
            });
            node.replaceChild(frag, c);
          } else if (c.nodeType === 1) walk(c, true);
        });
      })(el);
    });
  }

  /* ---------- Scroll effects: progress, parallax, craft timeline, order pill ---------- */
  function initScrollFX() {
    var bar = $('#scrollBar'), pill = $('#orderPill'), heroInner = $('.hero-inner'), cup = $('.hero-cup');
    var par = reduceMotion ? [] : $$('[data-parallax]').map(function (el) { return { el: el, s: parseFloat(el.getAttribute('data-parallax')) || 0.05 }; });
    var track = $('#craftTrack'), line = $('#craftLine'), steps = $$('.craft-step'), brew = $('#brewCup'), now = $('#craftNow');
    var LIQ = ['#8a7a45', '#6b3f1d', '#3d1f0e', '#2b140a'];
    var ticking = false;
    function frame() {
      ticking = false;
      var y = window.pageYOffset, vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
      if (pill) pill.classList.toggle('is-visible', y > 500);
      if (!reduceMotion && y < vh * 1.3) {
        if (heroInner) heroInner.style.translate = '0 ' + (y * 0.12).toFixed(1) + 'px';
        if (cup) cup.style.translate = '0 ' + (y * -0.1).toFixed(1) + 'px';
      }
      par.forEach(function (p) {
        var r = p.el.parentNode.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var lim = r.height * 0.065, v = ((r.top + r.height / 2) - vh / 2) * -p.s;
        p.el.style.setProperty('--py', Math.max(-lim, Math.min(lim, v)).toFixed(1) + 'px');
      });
      if (track && line) {
        var r = track.getBoundingClientRect(), mark = vh * 0.55;
        var p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
        line.style.transform = 'scaleY(' + p.toFixed(4) + ')';
        var active = -1;
        steps.forEach(function (s, i) { var reached = s.getBoundingClientRect().top + 30 < mark; s.classList.toggle('is-reached', reached); if (reached) active = i; });
        steps.forEach(function (s, i) { s.classList.toggle('is-active', i === active); });
        var shown = Math.max(0, active);
        if (brew) { brew.style.setProperty('--fill', (8 + p * 86).toFixed(1) + '%'); brew.style.setProperty('--liquid', LIQ[shown]); }
        if (now) now.textContent = shown + 1;
      }
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    window.addEventListener('load', req);
    frame();
  }

  /* ---------- Collapse / expanders / FAQ accordion ---------- */
  function initCollapse() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-collapse]'); if (!b) return;
      var panel = document.getElementById(b.getAttribute('data-collapse')); if (!panel) return;
      var open = !panel.classList.contains('is-open');
      var group = b.getAttribute('data-group');
      if (group && open) {
        $$('[data-group="' + group + '"]').forEach(function (o) {
          if (o === b) return;
          var p = document.getElementById(o.getAttribute('data-collapse'));
          if (p) p.classList.remove('is-open');
          o.setAttribute('aria-expanded', 'false'); o.classList.remove('is-open');
        });
      }
      panel.classList.toggle('is-open', open);
      b.setAttribute('aria-expanded', open ? 'true' : 'false'); b.classList.toggle('is-open', open);
      var lbl = $('.lbl', b); if (lbl) lbl.textContent = open ? lbl.getAttribute('data-less') : lbl.getAttribute('data-more');
    });
  }

  /* ---------- 3D tilt + card spotlight (fine pointer), global cursor glow ---------- */
  function initTilt() {
    if (!finePointer || reduceMotion) return;
    ['#menuGrid', '#beanGrid', '.signature-grid'].forEach(function (sel) {
      var g = $(sel); if (!g) return;
      g.addEventListener('mousemove', function (e) {
        var c = e.target.closest('.menu-card, .bean-card, .signature-card'); if (!c || !g.contains(c)) return;
        var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.setProperty('--ry', ((px - 0.5) * 8).toFixed(2) + 'deg');
        c.style.setProperty('--rx', ((0.5 - py) * 8).toFixed(2) + 'deg');
        c.style.setProperty('--mx', (px * 100).toFixed(1) + '%'); c.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        c.classList.add('is-tilting');
      });
      g.addEventListener('mouseout', function (e) {
        var c = e.target.closest('.menu-card, .bean-card, .signature-card'); if (!c) return;
        if (e.relatedTarget && c.contains(e.relatedTarget)) return;
        c.classList.remove('is-tilting'); c.style.removeProperty('--rx'); c.style.removeProperty('--ry');
      });
    });
  }
  function initSpot() {
    if (!finePointer || reduceMotion) return;
    var s = $('#cursorSpot'); if (!s) return;
    var raf = false, x = 0, y = 0;
    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      if (raf) return; raf = true;
      requestAnimationFrame(function () { raf = false; s.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; s.classList.add('is-on'); });
    });
    document.addEventListener('mouseleave', function () { s.classList.remove('is-on'); });
  }

  /* ---------- Hero typewriter ---------- */
  function initTypewriter() {
    var el = $('#typeWord'); if (!el) return;
    var words = ['espresso', 'pour over', 'cold brew', 'cortado', 'flat white', 'chai'];
    if (reduceMotion) return;
    var wi = 0, ci = words[0].length, del = true;
    function tick() {
      var w = words[wi];
      if (del) {
        ci--; el.textContent = w.slice(0, Math.max(0, ci));
        if (ci <= 0) { del = false; wi = (wi + 1) % words.length; setTimeout(tick, 320); return; }
        setTimeout(tick, 45);
      } else {
        ci++; el.textContent = words[wi].slice(0, ci);
        if (ci >= words[wi].length) { del = true; setTimeout(tick, 1700); return; }
        setTimeout(tick, 85);
      }
    }
    setTimeout(tick, 2600);
  }

  /* ---------- Floating order pill (mobile) ---------- */
  var updatePill = function () {};
  function initPill() {
    var pill = $('#orderPill'), lab = $('#orderPillLabel'), cnt = $('#orderPillCount');
    if (!pill) return;
    pill.addEventListener('click', function () { if (cartCountTotal() > 0) openCart(); else scrollToTarget('#menu'); });
    updatePill = function () {
      var n = cartCountTotal();
      lab.textContent = n > 0 ? 'View cart' : 'Order now';
      cnt.hidden = n === 0; cnt.textContent = n;
      pill.setAttribute('aria-label', n > 0 ? 'View cart, ' + n + (n === 1 ? ' item' : ' items') : 'Order now');
    };
    updatePill();
  }

  /* ---------- Build your drink ---------- */
  function initBuilder() {
    var form = $('#buildForm'); if (!form) return;
    var cfg = {
      base: [{ n: 'Espresso', p: 3.8, dark: 1, c: '#3a1d0e', img: I.espresso }, { n: 'Americano', p: 4, dark: 1, c: '#4a2813', img: I.americano }, { n: 'Latte', p: 4.8, c: '#b98a5c', img: I.latte }, { n: 'Cappuccino', p: 4.6, c: '#a97a4c', img: I.cappuccino }, { n: 'Flat White', p: 4.7, c: '#a5764a', img: I.cup }, { n: 'Cold Brew', p: 5.2, dark: 1, c: '#2e170b', img: I.icedMilk }],
      milk: [{ n: 'No milk', p: 0 }, { n: 'Whole', p: 0 }, { n: 'Oat', p: 0.6 }, { n: 'Almond', p: 0.6 }, { n: 'Soy', p: 0.5 }],
      size: [{ n: 'Small', p: 0, f: 62, s: 0.92 }, { n: 'Medium', p: 0.5, f: 78, s: 1 }, { n: 'Large', p: 1, f: 94, s: 1.08 }],
      syrup: [{ n: 'None', p: 0, c: '#f4ebdd' }, { n: 'Vanilla', p: 0.5, c: '#f1e2c0' }, { n: 'Caramel', p: 0.5, c: '#d3a05e' }, { n: 'Hazelnut', p: 0.5, c: '#b98a62' }, { n: 'Maple', p: 0.5, c: '#c4813b' }]
    };
    var sel = { base: 2, milk: 1, size: 1, syrup: 0, shot: false };
    var ids = { base: 'optBase', milk: 'optMilk', size: 'optSize', syrup: 'optSyrup' };
    Object.keys(ids).forEach(function (g) {
      $('#' + ids[g]).innerHTML = cfg[g].map(function (o, i) {
        var extra = g === 'base' ? '<small>' + money(o.p) + '</small>' : (o.p ? '<small>+' + money(o.p) + '</small>' : '');
        return '<button type="button" class="chip" data-group="' + g + '" data-i="' + i + '" aria-pressed="false">' + esc(o.n) + ' ' + extra + '</button>';
      }).join('');
    });
    var cup = $('#buildCup'), priceEl = $('#buildPrice'), sum = $('#buildSummary');
    function price() { return cfg.base[sel.base].p + cfg.milk[sel.milk].p + cfg.size[sel.size].p + cfg.syrup[sel.syrup].p + (sel.shot ? 1 : 0); }
    function parts() {
      var p = []; if (sel.milk > 0) p.push(cfg.milk[sel.milk].n.toLowerCase() + ' milk'); if (sel.syrup > 0) p.push(cfg.syrup[sel.syrup].n.toLowerCase() + ' syrup'); if (sel.shot) p.push('an extra shot');
      return p;
    }
    function describe() {
      var p = parts(), tail = p.length ? ' with ' + (p.length > 1 ? p.slice(0, -1).join(', ') + ' and ' + p[p.length - 1] : p[0]) : '';
      return cfg.size[sel.size].n + ' ' + cfg.base[sel.base].n + tail;
    }
    function update() {
      $$('.chip[data-group]', form).forEach(function (c) { var on = sel[c.getAttribute('data-group')] === +c.getAttribute('data-i'); c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      var shot = $('#optShot'); shot.classList.toggle('is-active', sel.shot); shot.setAttribute('aria-pressed', sel.shot ? 'true' : 'false');
      var b = cfg.base[sel.base], liquid = b.c;
      if (sel.milk > 0 && b.dark) liquid = '#8a5a35';
      if (sel.milk === 0 && !b.dark) liquid = '#3a1d0e';
      cup.style.setProperty('--liquid', liquid);
      cup.style.setProperty('--fill', cfg.size[sel.size].f + '%');
      cup.style.setProperty('--scale', cfg.size[sel.size].s);
      cup.style.setProperty('--foam', cfg.syrup[sel.syrup].c);
      cup.classList.toggle('has-milk', sel.milk > 0);
      priceEl.textContent = money(price());
      priceEl.classList.remove('tick'); void priceEl.offsetWidth; priceEl.classList.add('tick');
      sum.textContent = describe() + '.';
    }
    form.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      if (c.id === 'optShot') sel.shot = !sel.shot; else sel[c.getAttribute('data-group')] = +c.getAttribute('data-i');
      update();
    });
    $('#buildAdd').addEventListener('click', function () {
      var b = cfg.base[sel.base];
      var size = [cfg.size[sel.size].n].concat(sel.milk > 0 ? [cfg.milk[sel.milk].n] : [], sel.syrup > 0 ? [cfg.syrup[sel.syrup].n] : [], sel.shot ? ['+shot'] : []).join(', ');
      addFlow(this, { id: 'build-' + slug(size + b.n), name: 'Custom ' + b.n, size: size, price: price(), img: img(b.img, 200) }, 1, $('.cup-body', cup), cup.style.getPropertyValue('--liquid'));
    });
    update();
  }

  /* ---------- Find your roast quiz ---------- */
  function initQuiz() {
    var card = $('#quizCard'); if (!card) return;
    var QS = [
      { q: 'How do you usually brew at home?', o: [['Espresso machine', { r: 75 }], ['Pour over or filter', { r: 35 }], ['French press or moka pot', { r: 60 }]] },
      { q: 'Which flavors do you reach for?', o: [['Bright and fruity', { f: 'fruit' }], ['Chocolate and nuts', { f: 'choc' }], ['Bold and smoky', { f: 'smoke' }]] },
      { q: 'How do you take your coffee?', o: [['Black, no sugar', { r: 40 }], ['With milk', { r: 80 }], ['A bit of both', { r: 60 }]] }
    ];
    var panel = $('#quizPanel'), resEl = $('#quizResult'), opts = $('#quizOptions'), back = $('#quizBack'), bar = $('#quizBar');
    var step = 0, ans = [], best = null, lock = false;
    function render() {
      var q = QS[step];
      $('#quizStep').textContent = 'Question ' + (step + 1) + ' of ' + QS.length;
      $('#quizQ').textContent = q.q;
      opts.innerHTML = q.o.map(function (o, i) { return '<button type="button" class="quiz-opt" data-i="' + i + '"><span class="qo-key">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o[0]) + '</span></button>'; }).join('');
      back.hidden = step === 0;
      bar.style.width = (step / QS.length * 100) + '%';
    }
    function swap(fn) {
      lock = true;
      if (reduceMotion) { fn(); lock = false; return; }
      panel.classList.add('is-out');
      setTimeout(function () { fn(); panel.classList.remove('is-out'); lock = false; }, 220);
    }
    function showResult() {
      var rs = [], f = '';
      ans.forEach(function (a) { if (a.r != null) rs.push(a.r); if (a.f) f = a.f; });
      var target = rs.reduce(function (s, v) { return s + v; }, 0) / (rs.length || 1), top = -1;
      BEANS.forEach(function (b) { var s = 100 - Math.abs(b.roast - target) + (b.flavor === f ? 30 : 0); if (s > top) { top = s; best = b; } });
      $('#quizImg').src = img(best.img, 700); $('#quizImg').alt = best.name + ' whole beans';
      $('#quizName').textContent = best.name; $('#quizNotes').textContent = 'Tasting notes: ' + best.notes + '.';
      $('#quizMeta').textContent = best.roastName + ' roast \u00b7 ' + best.origin + ' \u00b7 ' + money(best.p250) + ' / 250g';
      panel.hidden = true; resEl.hidden = false; resEl.classList.remove('is-in'); void resEl.offsetWidth; resEl.classList.add('is-in');
      bar.style.width = '100%';
    }
    opts.addEventListener('click', function (e) {
      var b = e.target.closest('.quiz-opt'); if (!b || lock) return;
      b.classList.add('is-picked');
      ans[step] = QS[step].o[+b.getAttribute('data-i')][1];
      setTimeout(function () {
        if (step < QS.length - 1) swap(function () { step++; render(); });
        else swap(showResult);
      }, reduceMotion ? 0 : 260);
    });
    back.addEventListener('click', function () { if (lock || step === 0) return; swap(function () { step--; ans.length = step; render(); }); });
    $('#quizRetake').addEventListener('click', function () { step = 0; ans = []; resEl.hidden = true; panel.hidden = false; render(); });
    $('#quizAdd').addEventListener('click', function () {
      if (!best) return;
      addFlow(this, { id: best.id, name: best.name, size: '250g, Whole bean', price: best.p250, img: img(best.img, 200) }, 1, $('#quizImg'));
    });
    render();
  }

  /* ---------- Footer ---------- */
  function initFooter() { var y = $('#year'); if (y) y.textContent = new Date().getFullYear(); }

  /* ---------- Init ---------- */
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.error(fn.name || 'init', e); } }
  function init() {
    root.classList.add('js-ready');
    safe(initPreloader);
    [initTheme, initMobileMenu, initSmoothScroll, initScrollListeners, initCursor, initSpot, initMagnetic, initRipple, initSplit, initReveal, initCounters, initHours,
      initCart, initPill, initMenu, initBeans, initBuilder, initQuiz, initQuickView, initModals, initGallery, initSlider, initEvents, initCollapse, initTilt,
      initTypewriter, initScrollFX, initNewsletter, initReservation, initOrder, initFooter].forEach(safe);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
