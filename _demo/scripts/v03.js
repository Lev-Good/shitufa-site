/* v03 — חיבור שני מחשבים בלי אינטרנט */
window.SCENARIO = {
  id: 'v03',
  title: 'חיבור בין המחשבים',
  steps: [
    {
      caption: '',
      narration: 'זה החלק החשוב ביותר: איך שני מחשבים מוצאים זה את זה כשאין אינטרנט. אין צורך בראוטר, אין צורך בכבלים מיוחדים, ואין צורך בסיסמה של הרשת.',
      action: async (demo) => {
        await demo.title('חיבור בין המחשבים', 'בלי אינטרנט, בלי ראוטר, בלי טכנאי', 2600);
        await demo.wait(800);
      }
    },
    {
      caption: 'ארבע דרכים — הבסיסית ביותר: נקודה חמה',
      narration: 'יש ארבע דרכים לחבר. הראשונה, והכי פשוטה, היא נקודה חמה: המחשב הראשון הופך בעצמו לרשת אלחוטית, בדיוק כמו ראוטר קטן.',
      action: async (demo) => {
        await demo.slide(H.methodsSlide(0), 700);
        await demo.wait(4600);
      }
    },
    {
      caption: 'המחשב הראשון משדר, השני מתחבר אליו',
      narration: 'במחשב הראשון מפעילים נקודה חמה ניידת בהגדרות של ווינדוס. במחשב השני מתחברים לאותה רשת, ומזינים את הסיסמה שבחרתם. זה הכל.',
      action: async (demo) => {
        await demo.slide(H.pairSlide('נקודה חמה — המחשב הופך לרשת', 'רשת Wi-Fi בשם: כולל-בני-ברק'), 700);
        await demo.wait(4600);
      }
    },
    {
      caption: 'התוכנה עצמה מסבירה — בלחיצה אחת',
      narration: 'לא זוכרים איך עושים את זה? במסך העמיתים יש כפתור "איך מתחברים", והוא פותח הסבר מסודר עם כל השיטות, כולל כפתור שמפתח את הגדרות ווינדוס.',
      action: async (demo) => {
        await H.nav(demo, 'peers');
        await demo.wait(500);
        await demo.click('#page-peers .btn-ghost', { after: 900 });
        await demo.wait(1200);
        await demo.highlight('#connect-guide-modal .card > div:nth-child(3)', 2600);
      }
    },
    {
      caption: 'רגע אחרי החיבור — המחשב מופיע כממתין לאישור',
      narration: 'ברגע שהמחשבים על אותה רשת, המחשב החדש מופיע אצלך תחת "ממתינים לאישור". עד שלא תאשר אותו — שום קובץ לא עובר. זה מה שמונע מזרים לשלוח לך דברים.',
      action: async (demo) => {
        await demo.click('#connect-guide-modal .btn-primary', { after: 600 });
        window.__demo.setPending([{ device_id: '9ab30c4d5e6f7788', alias: 'DESK-07', address: '192.168.137.44', os: 'Windows 11' }]);
        await demo.wait(900);
        await demo.highlight('#pending-banner', 2400);
      }
    },
    {
      caption: 'לוחצים "אשר" — בשני הצדדים',
      narration: 'לוחצים על "אשר" כאן, ובמחשב השני עושים בדיוק אותו דבר. צריך לאשר בשני הצדדים, פעם אחת בחיים של המחשב.',
      action: async (demo) => {
        await demo.click('#pending-banner .btn', { after: 700 }).catch(() => {});
        await demo.wait(400);
        if (!document.querySelector('#pending-list .btn-success')) {
          await H.nav(demo, 'peers');
        }
        await demo.click('#pending-list .btn-success', { after: 900 });
        await demo.wait(1500);
        await demo.toast('גם במחשב השני אושר — החיבור קבוע', 'success', 2400);
      }
    },
    {
      caption: 'ומכאן — הקבצים עוברים לבד',
      narration: 'מאותו רגע החיבור קבוע, ולא צריך לעשות את זה שוב. כל קובץ שתכניס לתיקייה יגיע למחשב השני — גם אם הוא היה כבוי והדליקו אותו אחר כך.',
      action: async (demo) => {
        await H.nav(demo, 'files');
        await demo.wait(500);
        window.__demo.addFile('שיעור כללי — קול הלשון.mp3', 41943040, '9ab30c4d5e6f7788');
        await demo.wait(500);
        await demo.toast('קובץ חדש מ-DESK-07 התקבל', 'success', 2400);
        await demo.wait(1200);
      }
    }
  ]
};
