/* ══════════════════════════════════════════════════════════════════
   שיתופא — דף נחיתה. התנהגות בלבד, בלי תלויות.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── כותרת דביקה ───────────────────────────────────────────── */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // גיבוי לאירועי גלילה (חלק מהדפדפנים מדללים אותם): עוקבים אחרי עוגן
  // בראש העמוד, וברגע שהוא יוצא מהמסך — הכותרת מקבלת רקע אטום.
  var sentinel = document.getElementById('top');
  if (header && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        header.classList.toggle('scrolled', !entry.isIntersecting);
      });
    }, { threshold: 0 }).observe(sentinel);
  }

  /* ── תפריט מובייל ──────────────────────────────────────────── */
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('main-nav');

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ── נגני יוטיוב ───────────────────────────────────────────── */
  var videos = typeof SHITUFA_VIDEOS === 'object' && SHITUFA_VIDEOS ? SHITUFA_VIDEOS : {};

  function playVideo(card, facade) {
    var key = card.getAttribute('data-video');
    var id = (videos[key] || '').trim();

    if (!id) {
      toast('הסרטון הזה עוד בהכנה — בינתיים אפשר להוריד את התוכנה ולהתחיל.');
      return;
    }

    var frame = card.querySelector('.video-frame');
    if (!frame) return;

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
                 '?autoplay=1&rel=0&modestbranding=1&playsinline=1&hl=he&enablejsapi=1&origin=' +
                 encodeURIComponent(window.location.origin);
    iframe.title = (card.querySelector('h3') || {}).textContent || 'סרטון הדרכה';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

    facade.remove();
    frame.appendChild(iframe);

    // עצירה כשעוברים משם — כדי שסרטון לא ימשיך להתנגן ברקע
    if ('IntersectionObserver' in window) {
      var stopWhenHidden = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) return;
          try {
            iframe.contentWindow.postMessage(
              JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
              'https://www.youtube-nocookie.com'
            );
          } catch (err) { /* לא קריטי */ }
        });
      }, { threshold: 0.05 });
      stopWhenHidden.observe(frame);
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-video]'), function (card) {
    var facade = card.querySelector('.video-facade');
    if (!facade) return;

    var key = card.getAttribute('data-video');
    var id = (videos[key] || '').trim();
    var title = (card.querySelector('h3') || {}).textContent || '';

    if (id) {
      var img = document.createElement('img');
      img.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/maxresdefault.jpg';
      img.alt = '';
      img.loading = 'lazy';
      // לפעמים אין תמונת maxres — נופלים לתמונה הרגילה בלי לשבור את הכרטיס
      img.addEventListener('error', function () {
        if (img.dataset.fallback) return;
        img.dataset.fallback = '1';
        img.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/hqdefault.jpg';
      });
      img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
      facade.insertBefore(img, facade.firstChild);
      facade.setAttribute('aria-label', 'נגן את הסרטון: ' + title);
      var soon = facade.querySelector('.vf-soon');
      if (soon) soon.remove();
      facade.addEventListener('click', function () { playVideo(card, facade); });
    } else {
      facade.setAttribute('aria-label', 'הסרטון "' + title + '" עוד בהכנה');
      facade.addEventListener('click', function () { playVideo(card, facade); });
    }
  });

  /* ── הודעת "בהכנה" ─────────────────────────────────────────── */
  var toastEl = null;
  var toastTimer = null;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove('visible');
    }, 4200);
  }

  /* ── חשיפה בגלילה ──────────────────────────────────────────── */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll(
      '.section-head, .pain-card, .step, .connect-strip, .video-card, .feature, ' +
      '.table-wrap, .dl-card, .req-grid, .forum-card, .faq details, .final-inner'
    );

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealTargets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ── סימון המקטע הנוכחי בניווט ─────────────────────────────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ── הורדות: תמיד הגרסה האחרונה ────────────────────────────── */
  // ברירת המחדל בקישור היא עמוד השחרורים. אם ה-API זמין, הקישור מוחלף
  // ישירות בקובץ המתאים (Setup / Portable) — כך אין צורך לעדכן כתובות ידנית
  // בכל גרסה, ואם ה-API חסום או חורג ממכסה, נשאר עמוד השחרורים שעובד תמיד.
  (function initDownloads() {
    var setup = document.getElementById('dl-setup');
    var portable = document.getElementById('dl-portable');
    var versionEl = document.getElementById('hero-version');
    if (!setup && !portable) return;

    var API = 'https://api.github.com/repos/Lev-Good/shitufa-releases/releases/latest';

    fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (release) {
        if (!release || !Array.isArray(release.assets)) return;

        var assets = release.assets.filter(function (a) { return /\.exe$/i.test(a.name); });
        var setupAsset = assets.find(function (a) { return /setup/i.test(a.name); });
        var portableAsset = assets.find(function (a) { return /portable/i.test(a.name); });

        if (setup && setupAsset) setup.href = setupAsset.browser_download_url;
        if (portable && portableAsset) portable.href = portableAsset.browser_download_url;

        var version = String(release.tag_name || '').replace(/^v/i, '').trim();
        if (version && versionEl) versionEl.textContent = 'גרסה ' + version;
      })
      .catch(function () { /* נשארים על עמוד השחרורים */ });
  })();

  /* ── שנת זכויות יוצרים ─────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
