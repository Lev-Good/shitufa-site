/* ══════════════════════════════════════════════════════════════════
   presenter.js — שכבת הצגה להקלטת סרטוני הדרכה.
   לא חלק מהאתר ולא מהתוכנה: מוזרק לעמוד הדמו בלבד.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LAYER, CURSOR, RIPPLE, CAPTION, RING, TITLE, PROGRESS;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function build() {
    LAYER = el('div', 'demo-layer');
    LAYER.setAttribute('aria-hidden', 'true');

    PROGRESS = el('div', 'demo-progress', '<i></i>');
    LAYER.appendChild(PROGRESS);

    RING = el('div', 'demo-ring');
    LAYER.appendChild(RING);

    RIPPLE = el('div', 'demo-ripple');
    LAYER.appendChild(RIPPLE);

    CURSOR = el('div', 'demo-cursor',
      '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 2.5 20 12l-7.2 1.3L9.6 21z" fill="#ffffff" stroke="#0a1024" stroke-width="1.6" stroke-linejoin="round"/></svg>');
    LAYER.appendChild(CURSOR);

    CAPTION = el('div', 'demo-caption');
    LAYER.appendChild(CAPTION);

    TITLE = el('div', 'demo-title');
    LAYER.appendChild(TITLE);

    document.body.appendChild(LAYER);

    var css = document.createElement('style');
    css.textContent = [
      '.demo-layer{position:fixed;inset:0;pointer-events:none;z-index:2147483000;font-family:"Heebo","Segoe UI",Arial,sans-serif;direction:rtl}',
      '.demo-progress{position:absolute;top:0;left:0;right:0;height:4px;background:rgba(255,255,255,.14);opacity:0;transition:opacity .4s}',
      '.demo-progress i{display:block;height:100%;width:0;background:linear-gradient(90deg,#4f46e5,#a855f7);transition:width .35s ease}',
      '.demo-cursor{position:absolute;left:0;top:0;width:26px;height:26px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.45));transform:translate3d(640px,360px,0);transition:transform .62s cubic-bezier(.22,.8,.24,1);will-change:transform;opacity:0}',
      '.demo-ripple{position:absolute;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:rgba(79,70,229,.55);border:2px solid rgba(255,255,255,.9);opacity:0;transform:scale(.4)}',
      '.demo-ripple.go{animation:demoRipple .55s ease-out}',
      '@keyframes demoRipple{0%{opacity:.95;transform:scale(.4)}100%{opacity:0;transform:scale(2.6)}}',
      '.demo-ring{position:absolute;border:3px solid #7c3aed;border-radius:12px;box-shadow:0 0 0 6px rgba(124,58,237,.18);opacity:0;transition:opacity .25s,box-shadow .25s}',
      '.demo-ring.on{opacity:1;animation:demoRing 1.6s ease-in-out infinite}',
      '@keyframes demoRing{0%,100%{box-shadow:0 0 0 5px rgba(124,58,237,.14)}50%{box-shadow:0 0 0 12px rgba(124,58,237,.05)}}',
      '.demo-caption{position:absolute;left:50%;bottom:52px;transform:translate(-50%,14px);max-width:1560px;background:rgba(10,16,36,.94);color:#fff;font-size:34px;line-height:1.35;font-weight:600;padding:18px 30px;border-radius:16px;border-top:3px solid #7c3aed;box-shadow:0 24px 60px -18px rgba(0,0,0,.65);opacity:0;transition:opacity .28s ease,transform .28s ease;text-align:center}',
      '.demo-caption.on{opacity:1;transform:translate(-50%,0)}',
      '.demo-caption.top{top:52px;bottom:auto;border-top:0;border-bottom:3px solid #7c3aed}',
      '.demo-title{position:absolute;inset:0;background:radial-gradient(120% 120% at 80% 0%,#1a2350,#0a1024 60%,#070c1c);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0;transition:opacity .5s ease}',
      '.demo-title.on{opacity:1}',
      '.demo-title img{width:120px;height:120px;border-radius:26px;background:#fff;padding:10px;box-shadow:0 30px 70px -24px rgba(0,0,0,.8)}',
      '.demo-title b{color:#fff;font-size:60px;font-weight:900;letter-spacing:-.02em}',
      '.demo-title span{color:#c4b5fd;font-size:30px;font-weight:600}',
      '.demo-chip{position:absolute;display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #e2e5f0;border-radius:12px;padding:12px 18px;box-shadow:0 18px 40px -16px rgba(16,26,52,.5);font-size:20px;font-weight:600;color:#1b2440;transform:translate3d(0,0,0);transition:transform .9s cubic-bezier(.3,.7,.2,1);will-change:transform}',
      '.demo-chip i{display:grid;place-items:center;width:34px;height:34px;border-radius:8px;background:#e05252;color:#fff;font-style:normal;font-size:11px;font-weight:800}',
      '.demo-site{position:absolute;inset:0;background:rgba(8,13,30,.55);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .35s ease}',
      '.demo-site.on{opacity:1}',
      '.demo-browser{width:88%;height:86%;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 60px 120px -40px rgba(0,0,0,.8);transform:scale(.97);transition:transform .35s ease;display:flex;flex-direction:column}',
      '.demo-site.on .demo-browser{transform:scale(1)}',
      '.demo-urlbar{display:flex;align-items:center;gap:12px;background:#eef0f7;border-bottom:1px solid #dde1ee;padding:12px 18px;direction:ltr}',
      '.demo-urlbar i{font-style:normal;font-size:16px}',
      '.demo-urlbar span{flex:1;background:#fff;border:1px solid #dde1ee;border-radius:999px;padding:7px 16px;font-size:16px;color:#4b5470;font-family:Segoe UI,Arial,sans-serif}',
      '.demo-browser iframe{flex:1;border:0;width:100%}',
      '.demo-slide{position:absolute;inset:0;background:radial-gradient(120% 120% at 75% 0%,#1b2454,#0a1024 55%,#070c1c);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .35s ease;padding:60px 90px}',
      '.demo-slide.on{opacity:1}',
      '.demo-slide svg{width:100%;height:100%;max-height:820px}'
    ].join('');
    document.head.appendChild(css);
  }

  function center(elmOrSel) {
    var e = typeof elmOrSel === 'string' ? document.querySelector(elmOrSel) : elmOrSel;
    if (!e) return null;
    var r = e.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2), r: r, el: e };
  }

  var demo = {
    ready: false,
    state: { step: 0, total: 0, running: false, done: false, error: null },

    showCursor: function (on) {
      CURSOR.style.opacity = on === false ? '0' : '1';
      if (PROGRESS) PROGRESS.style.opacity = on === false ? '0' : '1';
    },

    wait: function (ms) {
      return new Promise(function (r) { setTimeout(r, ms); });
    },

    moveTo: function (target, offset) {
      var c = center(target);
      if (!c) return Promise.resolve(null);
      var dx = offset && offset.x ? offset.x : 0;
      var dy = offset && offset.y ? offset.y : 0;
      CURSOR.style.transform = 'translate3d(' + (c.x + dx - 6) + 'px,' + (c.y + dy - 2) + 'px,0)';
      return demo.wait(620).then(function () { return c; });
    },

    ripple: function (x, y) {
      RIPPLE.style.left = x + 'px';
      RIPPLE.style.top = y + 'px';
      RIPPLE.classList.remove('go');
      void RIPPLE.offsetWidth;
      RIPPLE.classList.add('go');
    },

    click: async function (target, opts) {
      opts = opts || {};
      var c = await demo.moveTo(target);
      if (!c) return null;
      await demo.wait(opts.before || 120);
      demo.ripple(c.x, c.y);
      if (opts.native !== false && c.el) {
        try { c.el.click(); } catch (e) { c.el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
      }
      await demo.wait(opts.after || 260);
      return c.el;
    },

    hover: function (target) { return demo.moveTo(target); },

    highlight: function (target, ms) {
      var c = center(target);
      if (!c) return Promise.resolve();
      RING.style.left = (c.r.left - 8) + 'px';
      RING.style.top = (c.r.top - 8) + 'px';
      RING.style.width = (c.r.width + 16) + 'px';
      RING.style.height = (c.r.height + 16) + 'px';
      RING.classList.add('on');
      return demo.wait(ms || 1200).then(function () { RING.classList.remove('on'); });
    },

    caption: function (text, ms, pos) {
      if (!text) {
        CAPTION.classList.remove('on');
        return Promise.resolve();
      }
      CAPTION.classList.toggle('top', pos === 'top');
      CAPTION.textContent = text;
      CAPTION.classList.add('on');
      if (ms) return demo.wait(ms);
      return Promise.resolve();
    },

    clearCaption: function () { CAPTION.classList.remove('on'); },

    title: async function (main, sub, ms) {
      CURSOR.style.opacity = '0';
      CAPTION.classList.remove('on');
      TITLE.innerHTML = '<img src="logo.png" alt=""><b></b><span></span>';
      TITLE.querySelector('b').textContent = main || '';
      TITLE.querySelector('span').textContent = sub || '';
      TITLE.classList.add('on');
      await demo.wait(ms || 2600);
      TITLE.classList.remove('on');
      await demo.wait(420);
      CURSOR.style.opacity = '1';
    },

    /* מסך אתר בתוך מסגרת דפדפן (להדגמת ההורדה) */
    showSite: async function (url, ms) {
      var frame = el('div', 'demo-site');
      frame.innerHTML = '<div class="demo-browser"><div class="demo-urlbar"><i></i><span></span></div><iframe></iframe></div>';
      frame.querySelector('.demo-urlbar span').textContent = url.replace(/^https?:\/\//, '');
      frame.querySelector('.demo-urlbar i').textContent = '🔒';
      var iframe = frame.querySelector('iframe');
      iframe.src = url;
      LAYER.appendChild(frame);
      requestAnimationFrame(function () { frame.classList.add('on'); });
      await demo.wait(ms || 5000);
      frame.classList.remove('on');
      await demo.wait(400);
      frame.remove();
    },

    /* שקופית הסבר מצוירת (SVG) מעל הממשק */
    slide: async function (html, ms) {
      var s = el('div', 'demo-slide', html);
      LAYER.appendChild(s);
      requestAnimationFrame(function () { s.classList.add('on'); });
      await demo.wait(ms || 4500);
      s.classList.remove('on');
      await demo.wait(380);
      s.remove();
    },

    type: async function (target, text, cps) {
      var c = await demo.moveTo(target);
      if (!c) return;
      await demo.click(target, { after: 80 });
      var input = c.el;
      input.focus();
      input.value = '';
      var delay = 1000 / (cps || 22);
      for (var i = 0; i < text.length; i++) {
        input.value += text[i];
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await demo.wait(delay);
      }
      await demo.wait(160);
      return input;
    },

    typeKeys: async function (text, cps) {
      var active = document.activeElement;
      if (!active) return;
      var delay = 1000 / (cps || 22);
      for (var i = 0; i < text.length; i++) {
        active.value += text[i];
        active.dispatchEvent(new Event('input', { bubbles: true }));
        await demo.wait(delay);
      }
    },

    scrollTo: async function (target, block) {
      var e = typeof target === 'string' ? document.querySelector(target) : target;
      if (!e) return;
      e.scrollIntoView({ block: block || 'center', behavior: 'instant' });
      await demo.wait(350);
    },

    toast: async function (text, kind, ms) {
      if (typeof window.toast === 'function') window.toast(text, kind || 'success');
      await demo.wait(ms || 1600);
    },

    /* גרירת קובץ ויזואלית אל אזור ההפלה */
    dragFile: async function (fileName, dropSel, ext) {
      var target = document.querySelector(dropSel);
      if (!target) return;
      var r = target.getBoundingClientRect();
      var chip = el('div', 'demo-chip', '<i>' + (ext || 'PDF') + '</i><span></span>');
      chip.querySelector('span').textContent = fileName;
      var startX = r.right + 60;
      var startY = r.top + 40;
      chip.style.left = '0px';
      chip.style.top = '0px';
      chip.style.transform = 'translate3d(' + startX + 'px,' + startY + 'px,0) scale(.9)';
      LAYER.appendChild(chip);
      await demo.wait(120);
      chip.style.transform = 'translate3d(' + (r.left + r.width / 2 - 120) + 'px,' + (r.top + r.height / 2 - 20) + 'px,0) scale(1)';
      await demo.wait(950);
      chip.style.opacity = '0';
      chip.style.transition = 'opacity .3s';
      setTimeout(function () { chip.remove(); }, 400);
      await demo.wait(320);
    },

    progress: function (i, total) {
      PROGRESS.querySelector('i').style.width = Math.round((i / total) * 100) + '%';
    },

    /* מריץ תסריט: כל שלב מחזיק למשך duration שהוקצה מראש (לפי אורך הקריינות) */
    run: async function (steps, durations) {
      demo.state.running = true;
      demo.state.done = false;
      demo.state.error = null;
      demo.state.total = steps.length;
      demo.state.timings = [];
      demo.state.runStart = performance.now();
      demo.showCursor(true);
      for (var i = 0; i < steps.length; i++) {
        var step = steps[i];
        var started = performance.now();
        demo.state.step = i + 1;
        demo.state.timings[i] = { start: started - demo.state.runStart, action: 0, end: 0 };
        demo.progress(i, steps.length);
        try {
          if (step.caption !== undefined) await demo.caption(step.caption, undefined, step.captionPos);
          if (step.action) await step.action(demo);
        } catch (err) {
          demo.state.error = String(err && err.message || err);
        }
        var want = (durations && durations[i] != null ? durations[i] : 2.5) * 1000;
        var elapsed = performance.now() - started;
        demo.state.timings[i].action = Math.round(elapsed);
        var rest = Math.max(120, want - elapsed);
        await demo.wait(rest);
        demo.state.timings[i].end = Math.round(performance.now() - demo.state.runStart);
      }
      demo.caption('');
      demo.progress(steps.length, steps.length);
      demo.state.running = false;
      demo.state.done = true;
      return true;
    }
  };

  window.demo = demo;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { build(); demo.ready = true; });
  } else {
    build();
    demo.ready = true;
  }
})();
