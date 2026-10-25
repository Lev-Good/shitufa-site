/* v04 — אישור מחשבים ואמון */
window.SCENARIO = {
  id: 'v04',
  title: 'אישור מחשבים',
  steps: [
    {
      caption: '',
      narration: 'שיתופא לא נותנת לכל מחשב לשלוח לך קבצים. מחשב חדש צריך אישור שלך, פעם אחת. הסרטון הזה מראה בדיוק איך זה עובד, ומה עושים אם מחשב מפריע.',
      action: async (demo) => {
        await demo.title('אישור מחשבים', 'מי יכול לשלוח לך קבצים — ואיך חוסמים', 2600);
        window.__demo.setPending([{ device_id: '9ab30c4d5e6f7788', alias: 'DESK-07', address: '192.168.137.44', os: 'Windows 11' }]);
        await demo.wait(900);
      }
    },
    {
      caption: 'שלושה אזורים: מאומתים, ממתינים, חסומים',
      narration: 'במסך העמיתים יש שלושה אזורים. למעלה המחשבים המאומתים — אלה שכבר מחוברים אליך ומסתנכרנים איתך. מתחתיהם מחשבים שממתינים לאישור, ובתחתית החסומים.',
      action: async (demo) => {
        await H.nav(demo, 'peers');
        await demo.wait(600);
        await demo.highlight('#page-peers > div:nth-child(2)', 2200);
        await demo.scrollTo('#pending-list', 'center');
        await demo.wait(900);
        await demo.highlight('#pending-list', 2400);
      }
    },
    {
      caption: 'מחשב חדש ממתין — לא עובר כלום עד שתאשר',
      narration: 'המחשב DESK-07 מופיע כממתין. כל עוד לא אישרת אותו, הוא לא יכול לשלוח לך שום קובץ או הודעה. גם למעלה, בראש המסך, קופצת התראה כדי שלא תפספס.',
      action: async (demo) => {
        await demo.scrollTo('#pending-banner', 'center');
        await demo.wait(500);
        await demo.highlight('#pending-banner', 2400);
      }
    },
    {
      caption: 'לוחצים "אשר" — בשני המחשבים',
      narration: 'לוחצים על "אשר". חשוב לדעת: צריך לאשר בשני הצדדים — גם אצלך וגם אצל החבר. ברגע ששניהם אישרו, המחשב עובר לרשימת המאומתים ומתחיל להסתנכרן.',
      action: async (demo) => {
        await demo.scrollTo('#pending-list', 'center');
        await demo.wait(400);
        await demo.click('#pending-list .btn-success', { after: 900 });
        await demo.wait(1200);
        await demo.scrollTo('#trusted-list', 'center');
        await demo.wait(800);
        await demo.highlight('#trusted-list .peer-card:last-child', 2200);
      }
    },
    {
      caption: 'מחשב מפריע? חוסמים אותו',
      narration: 'אם מחשב מציק, או שזה מחשב של בחור אחר ולא צריך לערבב קבצים, לוחצים על "חסום". הוא לא יוכל לשלוח לך כלום, ולא יראה אותך.',
      action: async (demo) => {
        await demo.click('#trusted-list .peer-card:nth-child(3) .btn-ghost:last-child', { after: 900 });
        await demo.wait(900);
        await demo.scrollTo('#blocked-list', 'center');
        await demo.wait(700);
        await demo.highlight('#blocked-list', 2200);
      }
    },
    {
      caption: 'טעות? מסירים את החסימה',
      narration: 'ואם חסמת בטעות, לוחצים על "בטל חסימה". המחשב חוזר להיות ממתין, ואתה יכול לאשר אותו מחדש. שום דבר לא נמחק ולא הולך לאיבוד.',
      action: async (demo) => {
        await demo.click('#blocked-list .btn-ghost', { after: 900 });
        await demo.wait(1600);
      }
    },
    {
      caption: '',
      narration: 'הכלל פשוט: מה שאישרת — מסתנכרן. מה שלא אישרת — לא זז. וזה נשמר גם אחרי כיבוי המחשב.',
      action: async (demo) => {
        await demo.slide(H.slideCard({
          eyebrow: 'מודל האמון',
          title: 'אישור אחד — וחיבור קבוע',
          lines: [
            'מחשב חדש תמיד ממתין לאישור',
            'צריך לאשר בשני הצדדים, פעם אחת',
            'חסימה עוצרת הכל — בלי למחוק קבצים',
            'ההגדרה נשמרת גם אחרי כיבוי'
          ]
        }), 800);
        await demo.wait(3400);
      }
    }
  ]
};
