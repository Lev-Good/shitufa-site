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
  var videoModal = document.getElementById('video-modal');
  var videoModalContent = document.getElementById('video-modal-content');

  function openVideoModal() {
    if (!videoModal) return;
    videoModal.classList.add('is-open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('is-open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (videoModalContent) {
      videoModalContent.innerHTML = '';
    }
  }

  if (videoModal) {
    videoModal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) {
        closeVideoModal();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && videoModal.classList.contains('is-open')) {
        closeVideoModal();
      }
    });
  }

  // סרטון יכול להתנגן משני מקורות: קובץ מקומי (data-file) או יוטיוב
  // (SHITUFA_VIDEOS). ברגע שממלאים מזהה יוטיוב — הוא גובר אוטומטית.
  function playVideo(card, facade) {
    var key = card.getAttribute('data-video');
    var id = (videos[key] || '').trim();
    var file = (card.getAttribute('data-file') || '').trim();

    if (!id && !file) {
      toast('הסרטון הזה עוד בהכנה — בינתיים אפשר להוריד את התוכנה ולהתחיל.');
      return;
    }

    if (!videoModalContent) return;

    videoModalContent.innerHTML = '';

    if (!id && file) {
      var video = document.createElement('video');
      video.src = file;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'metadata';
      var poster = card.getAttribute('data-poster');
      if (poster) video.poster = poster;
      video.setAttribute('aria-label', (card.querySelector('h3') || {}).textContent || 'סרטון הדרכה');
      videoModalContent.appendChild(video);
      openVideoModal();
      return;
    }

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
                 '?autoplay=1&rel=0&modestbranding=1&playsinline=1&hl=he&enablejsapi=1&origin=' +
                 encodeURIComponent(window.location.origin);
    iframe.title = (card.querySelector('h3') || {}).textContent || 'סרטון הדרכה';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

    videoModalContent.appendChild(iframe);
    openVideoModal();
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-video]'), function (card) {
    var facade = card.querySelector('.video-facade');
    if (!facade) return;

    var key = card.getAttribute('data-video');
    var id = (videos[key] || '').trim();
    var title = (card.querySelector('h3') || {}).textContent || '';

    if (!id && !facade.querySelector('img')) {
      // אין עדיין יוטיוב, אבל יש קובץ מקומי: משתמשים בתמונת הפתיח שלו
      var localPoster = card.getAttribute('data-poster');
      if (localPoster) {
        var posterImg = document.createElement('img');
        posterImg.src = localPoster;
        posterImg.alt = '';
        posterImg.loading = 'lazy';
        posterImg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
        facade.insertBefore(posterImg, facade.firstChild);
      }
      var soonLocal = facade.querySelector('.vf-soon');
      if (soonLocal) soonLocal.remove();
      facade.setAttribute('aria-label', 'נגן את הסרטון: ' + title);
      facade.addEventListener('click', function () { playVideo(card, facade); });
      return;
    }

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
  // שני הכפתורים נפתרים בזמן אמת מעמוד השחרורים של shitufa-releases:
  // האחד לקובץ ה-Setup והשני לקובץ ה-Portable, תמיד לגרסה האחרונה.
  // אם ה-API חסום או חורג ממכסה — הקישורים נשארים על עמוד השחרורים,
  // שגם הוא מוביל לאותם שני קבצים, ולכן אין מצב של כפתור מת.
  (function initDownloads() {
    var setup = document.getElementById('dl-setup');
    var portable = document.getElementById('dl-portable');
    var setupFile = document.getElementById('dl-setup-file');
    var portableFile = document.getElementById('dl-portable-file');
    var versionEl = document.getElementById('hero-version');
    var badgeVersion = document.getElementById('dl-version');
    if (!setup && !portable) return;

    var API = 'https://api.github.com/repos/Lev-Good/shitufa-releases/releases/latest';
    var CACHE_KEY = 'shitufa:latest-release:v1';
    var CACHE_TTL = 30 * 60 * 1000; // חצי שעה — חוסך את מכסת ה-API

    var sizeLabel = function (bytes) {
      if (!bytes || typeof bytes !== 'number') return '';
      return Math.round(bytes / 1000000) + ' MB';
    };

    var apply = function (release) {
      if (!release || !Array.isArray(release.assets)) return false;

      var assets = release.assets.filter(function (a) { return /\.exe$/i.test(a.name); });
      var setupAsset = assets.find(function (a) { return /setup/i.test(a.name); });
      var portableAsset = assets.find(function (a) { return /portable/i.test(a.name); });
      var version = String(release.tag_name || '').replace(/^v/i, '').trim();

      if (setup && setupAsset) {
        setup.href = setupAsset.browser_download_url;
        setup.setAttribute('download', setupAsset.name);
        if (setupFile) setupFile.textContent = setupAsset.name + (sizeLabel(setupAsset.size) ? ' · ' + sizeLabel(setupAsset.size) : '');
      }

      if (portable && portableAsset) {
        portable.href = portableAsset.browser_download_url;
        portable.setAttribute('download', portableAsset.name);
        if (portableFile) portableFile.textContent = portableAsset.name + (sizeLabel(portableAsset.size) ? ' · ' + sizeLabel(portableAsset.size) : '');
      }

      if (version) {
        if (versionEl) versionEl.textContent = 'גרסה ' + version;
        if (badgeVersion) badgeVersion.textContent = version;
      }

      return !!(setupAsset || portableAsset);
    };

    var readCache = function () {
      try {
        var raw = window.localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        var parsed = JSON.parse(raw);
        if (!parsed || !parsed.at || (Date.now() - parsed.at) > CACHE_TTL) return null;
        return parsed.release;
      } catch (err) { return null; }
    };

    var writeCache = function (release) {
      try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), release: release }));
      } catch (err) { /* מצב פרטי / אחסון חסום — לא קריטי */ }
    };

    var cached = readCache();
    if (cached) apply(cached);

    if (cached) return;

    fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (release) {
        if (apply(release)) writeCache(release);
      })
      .catch(function () { /* נשארים על עמוד השחרורים */ });
  })();

  /* ── שנת זכויות יוצרים ─────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
