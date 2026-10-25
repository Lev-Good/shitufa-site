/* v10 — הגדרות, עדכונים ועזרה */
window.SCENARIO = {
  id: 'v10',
  title: 'הגדרות ועדכונים',
  steps: [
    {
      caption: '',
      captionPos: 'top',
      narration: 'בסרטון האחרון נעבור על ההגדרות שחשוב להכיר: השם, ההפעלה האוטומטית, מקום הקבצים, העדכונים ואיפה מוצאים עזרה.',
      action: async (demo) => {
        await demo.title('הגדרות ועדכונים', 'הדברים הקטנים שעושים את ההבדל', 2500);
        await H.nav(demo, 'settings');
        await demo.wait(900);
      }
    },
    {
      caption: 'שם המחשב — מה שהחברים רואים',
      captionPos: 'top',
      narration: 'השם הוא מה שהעמיתים רואים כשישלחו לך קובץ. שווה לתת שם מזוהה — "כולל בני ברק", "מחשב שלי" — ולא להשאיר את השם האוטומטי.',
      action: async (demo) => {
        await demo.scrollTo('#settings-name', 'center');
        await demo.wait(500);
        await demo.click('#settings-name', { after: 200 });
        H.q('#settings-name').value = '';
        await demo.type('#settings-name', 'חברותא אלחנן', 16);
        await demo.wait(400);
        await demo.click(H.btn('שם המכשיר', 'שמור'), { after: 900 });
        await demo.wait(1400);
      }
    },
    {
      caption: 'הפעלה אוטומטית — שהכל ימשיך לעבוד',
      captionPos: 'top',
      narration: 'עם הפעלה אוטומטית, שיתופא עולה לבד כשמדליקים את המחשב, ויושבת בשקט ליד השעון. אתה לא צריך לזכור לפתוח אותה, והקבצים ממשיכים לזרום.',
      action: async (demo) => {
        await demo.scrollTo('#autostart-toggle', 'center');
        await demo.wait(500);
        await demo.click('#autostart-toggle', { after: 900 });
        await demo.wait(1200);
      }
    },
    {
      caption: 'מקום הקבצים — שלא יתמלא הדיסק',
      captionPos: 'top',
      narration: 'אם קיבלת הרבה קבצים, אפשר להגביל כמה מקום הם תופסים. כשעוברים את המכסה, הקבצים הישנים ביותר נמחקים לבד — והחדשים ממשיכים להיכנס.',
      action: async (demo) => {
        const c = await H.showCard(demo, 'מכסת אחסון');
        if (c) await demo.highlight(c, 2400);
        await demo.click('#quota-enabled', { after: 600 });
        await demo.click('#quota-mb', { after: 200 });
        H.q('#quota-mb').value = '';
        await demo.type('#quota-mb', '2000', 12);
        await demo.wait(400);
        await demo.click(H.btn('מכסת אחסון', 'שמור'), { after: 900 });
        await demo.wait(1400);
      }
    },
    {
      caption: 'עדכונים — בלחיצה אחת',
      captionPos: 'top',
      narration: 'כשיוצאת גרסה חדשה, התוכנה מודיעה על זה כאן, ואפשר להתקין בלחיצה. אם אין אינטרנט במחשב, אפשר להוריד את הגרסה החדשה מהאתר ולהתקין ידנית — הקבצים והחיבורים נשמרים.',
      action: async (demo) => {
        const c = await H.showCard(demo, 'עדכוני תוכנה');
        if (c) await demo.highlight(c, 2600);
      }
    },
    {
      caption: 'אודות — גרסה ופרטים',
      captionPos: 'top',
      narration: 'במסך "אודות" רואים את מספר הגרסה ואת הפרטים של התוכנה. את המספר הזה כדאי לציין כששואלים עזרה בפורום — ככה מקבלים תשובה מדויקת.',
      action: async (demo) => {
        await H.nav(demo, 'about');
        await demo.wait(1000);
        await demo.scrollTo('#page-about .card', 'center');
        await demo.wait(800);
        await demo.highlight('#page-about .card', 2400);
      }
    },
    {
      caption: 'מדריך בתוך התוכנה',
      captionPos: 'top',
      narration: 'ויש גם מדריך מובנה, עם הסברים על חיבור, על קבצים ועל שאלות נפוצות. הוא לא דורש אינטרנט, ותמיד זמין — גם באמצע הסדר.',
      action: async (demo) => {
        await H.nav(demo, 'help');
        await demo.wait(1200);
        await demo.scrollTo('#page-help', 'top');
        await demo.wait(1000);
      }
    },
    {
      caption: '',
      captionPos: 'top',
      narration: 'זה הכל. עכשיו יש לך את כל מה שצריך: התקנה, חיבור, העברת קבצים, צ׳אט, קבוצות, ופתרון תקלות. בהצלחה, ושתהיה לימוד פורה.',
      action: async (demo) => {
        await demo.slide(H.slideCard({
          eyebrow: 'סיימת את כל הסדרה',
          title: 'מוכן לעבוד',
          lines: [
            'התקנה וחיבור — מאחוריך',
            'קבצים, צ׳אט וקבוצות — בדקות',
            'תקלות — אבחון רשת ימצא',
            'עזרה — בפורום ובאתר'
          ]
        }), 900);
        await demo.wait(3800);
      }
    }
  ]
};
