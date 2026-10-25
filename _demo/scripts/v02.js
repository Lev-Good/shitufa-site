/* v02 — הורדה והתקנה */
window.SCENARIO = {
  id: 'v02',
  title: 'התקנה',
  steps: [
    {
      caption: '',
      narration: 'בסרטון הזה נראה איך מתקינים את שיתופא, מההורדה ועד שהתוכנה עובדת. זה לוקח בערך שלוש דקות, ואין צורך בשום ידע במחשבים.',
      action: async (demo) => {
        await demo.title('התקנה', 'מההורדה ועד שהתוכנה עובדת — שלוש דקות', 2600);
        await demo.wait(900);
      }
    },
    {
      caption: 'שני כפתורים באתר: מתקין או גרסה ניידת',
      narration: 'נכנסים לאתר של שיתופא ויורדים לקטע ההורדה. יש שם שני כפתורים: האחד מוריד מתקין רגיל, והשני גרסה ניידת שלא צריכה התקנה בכלל. האתר תמיד מביא את הגרסה האחרונה.',
      action: async (demo) => {
        await demo.showSite('/index.html#download', 8200);
      }
    },
    {
      caption: 'מריצים את הקובץ שהורד — ומאשרים פעם אחת',
      narration: 'פותחים את הקובץ שהורד. אם ווינדוס שואלת אם לאשר, לוחצים כן — זה רק פעם אחת, וזה מה שמאפשר לעמיתים למצוא אותך.',
      action: async (demo) => {
        await demo.toast('מתקין את שיתופא…', 'success', 2200);
        await demo.wait(600);
        await demo.toast('ההתקנה הושלמה — שיתופא נפתחה', 'success', 2400);
      }
    },
    {
      caption: 'נותנים למחשב שם שהעמיתים יזהו',
      narration: 'בפעם הראשונה נותנים למחשב שם, למשל "כולל בני ברק" או "מחשב הבית". זה השם שהעמיתים יראו כשהם ישלחו לך קובץ.',
      action: async (demo) => {
        await H.nav(demo, 'settings');
        await demo.wait(400);
        await demo.click('#settings-name', { after: 200 });
        await demo.type('#settings-name', 'כולל בני ברק', 16);
        await demo.wait(500);
        await demo.click('#page-settings .card .btn-primary', { after: 700 });
        await demo.wait(1200);
      }
    },
    {
      caption: 'מסמנים "הפעל עם עליית Windows"',
      narration: 'כדאי מאוד לסמן את האפשרות שהתוכנה תעלה לבד עם הדלקת המחשב. ככה אתה לא צריך לזכור לפתוח אותה, והקבצים ממשיכים לעבור גם כשהמסך סגור.',
      action: async (demo) => {
        await demo.click('#autostart-toggle', { after: 900 });
        await demo.wait(1400);
      }
    },
    {
      caption: 'וזהו — עוברים לחבר את המחשב השני',
      narration: 'זה כל מה שצריך כדי להתקין. את החיבור בין המחשבים נראה בסרטון הבא, וכשהן מחוברות — כל קובץ פשוט מגיע.',
      action: async (demo) => {
        await H.nav(demo, 'files');
        await demo.wait(600);
        await demo.slide(H.slideCard({
          eyebrow: 'סיימנו להתקין',
          title: 'מה עכשיו?',
          lines: [
            'התוכנה מותקנת ועולה לבד עם Windows',
            'בסרטון הבא — חיבור שני מחשבים בלי אינטרנט',
            'בסרטון שאחריו — העברת הקבצים הראשונה'
          ]
        }), 800);
        await demo.wait(3600);
      }
    }
  ]
};
