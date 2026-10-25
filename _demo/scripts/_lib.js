/* _lib.js — עזרי תסריט משותפים לכל סרטוני ההדרכה (רצים בתוך הדף). */
window.H = {
  q: function (s) { return document.querySelector(s); },
  all: function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); },

  /* מעבר בין מסכים בסרגל הצד */
  nav: async function (demo, page) {
    var el = document.querySelector('.nav-item[onclick*="\'' + page + '\'"]');
    if (el) await demo.click(el, { after: 550 });
  },

  /* כרטיס בהגדרות לפי טקסט */
  card: function (needle) {
    return H.all('#page-settings .card').filter(function (c) {
      return c.textContent.indexOf(needle) > -1;
    })[0];
  },

  /* כפתור בתוך כרטיס בהגדרות, לפי טקסט */
  btn: function (needle, text) {
    var c = H.card(needle);
    if (!c) return null;
    return H.all('#page-settings .card').length && Array.prototype.slice.call(c.querySelectorAll('button'))
      .filter(function (b) { return b.textContent.indexOf(text) > -1; })[0];
  },

  showCard: async function (demo, needle) {
    var c = H.card(needle);
    if (!c) { console.warn('card not found: ' + needle); return null; }
    await demo.scrollTo(c, 'center');
    await demo.wait(320);
    return c;
  },

  /* ── שקופיות ─────────────────────────────────────────────────────────── */
  slideCard: function (o) {
    var lines = (o.lines || []).map(function (l) {
      return '<div style="display:flex;gap:16px;align-items:flex-start;font-size:32px;line-height:1.45;color:#dfe4f7">' +
        '<span style="color:#a78bfa;font-weight:900">✓</span><span>' + l + '</span></div>';
    }).join('');
    return '<div style="max-width:1400px;text-align:right;direction:rtl">' +
      (o.eyebrow ? '<div style="color:#a78bfa;font-size:26px;font-weight:700;letter-spacing:.02em;margin-bottom:14px">' + o.eyebrow + '</div>' : '') +
      '<div style="color:#fff;font-size:64px;font-weight:900;line-height:1.15;margin-bottom:34px">' + o.title + '</div>' +
      lines + '</div>';
  },

  /* שקופית ארבע דרכי חיבור, עם הדגשה של אחת */
  methodsSlide: function (active) {
    var methods = [
      { icon: '📶', name: 'נקודה חמה', sub: 'מהמחשב עצמו' },
      { icon: '🔵', name: 'בלוטות׳', sub: 'בלי שום רשת' },
      { icon: '🔌', name: 'כבל רשת', sub: 'ישיר בין המחשבים' },
      { icon: '📡', name: 'ראוטר', sub: 'אפילו בלי אינטרנט' }
    ];
    var cards = methods.map(function (m, i) {
      var on = i === active;
      return '<div style="flex:1;background:' + (on ? 'rgba(124,58,237,.22)' : 'rgba(255,255,255,.05)') +
        ';border:2px solid ' + (on ? '#8b5cf6' : 'rgba(255,255,255,.12)') +
        ';border-radius:22px;padding:34px 20px;text-align:center;transition:.3s">' +
        '<div style="font-size:52px;margin-bottom:14px;' + (on ? '' : 'filter:grayscale(.6);opacity:.65') + '">' + m.icon + '</div>' +
        '<div style="color:#fff;font-size:26px;font-weight:800">' + m.name + '</div>' +
        '<div style="color:#b9c0dc;font-size:19px;margin-top:6px">' + m.sub + '</div></div>';
    }).join('');
    return '<div style="width:100%;direction:rtl">' +
      '<div style="color:#fff;font-size:52px;font-weight:900;text-align:right;margin-bottom:44px">ארבע דרכים לחבר שני מחשבים</div>' +
      '<div style="display:flex;gap:22px;align-items:stretch">' + cards + '</div></div>';
  },

  /* שקופית שני מחשבים ומסלול ביניהם */
  pairSlide: function (label, note) {
    function laptop(tag) {
      return '<div style="text-align:center">' +
        '<div style="width:210px;height:132px;border-radius:12px;border:4px solid #a78bfa;background:rgba(124,58,237,.15);display:flex;align-items:center;justify-content:center;color:#c4b5fd;font-size:20px;font-weight:800">' + tag + '</div>' +
        '<div style="height:14px;width:250px;margin:0 auto;background:#8b5cf6;border-radius:0 0 10px 10px"></div></div>';
    }
    return '<div style="width:100%;direction:rtl;text-align:center">' +
      '<div style="color:#fff;font-size:50px;font-weight:900;margin-bottom:56px">' + label + '</div>' +
      '<div style="display:flex;align-items:center;justify-content:center;gap:40px">' +
      laptop('מחשב א׳') +
      '<div style="min-width:330px"><div style="height:4px;background:linear-gradient(90deg,#8b5cf6,#22d3ee);border-radius:2px"></div>' +
      '<div style="color:#a5f3fc;font-size:25px;font-weight:700;margin-top:16px">' + (note || '') + '</div></div>' +
      laptop('מחשב ב׳') + '</div></div>';
  }
};
