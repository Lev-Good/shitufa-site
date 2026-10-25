/* v01 — מה זה שיתופא (פתיחה והיכרות) */
window.SCENARIO = {
  id: 'v01',
  title: 'מה זה שיתופא',
  steps: [
    {
      caption: '',
      narration: 'שיתופא היא תוכנה קטנה שמחברת בין המחשבים בכולל, בלי שום אינטרנט. בסרטון הזה נראה בקצרה מה היא עושה, ולאן נכנסים כדי להשתמש בה.',
      action: async (demo) => {
        await demo.title('שיתופא', 'קבצים, צ׳אט וקבוצות בין המחשבים — בלי אינטרנט', 2600);
        await demo.wait(1200);
      }
    },
    {
      caption: 'כל קובץ בתיקייה מגיע לבד לכל המחשבים',
      narration: 'זה המסך שנפתח לך. כל קובץ שאתה מכניס לתיקייה הזאת נשלח מעצמו לכל המחשבים המחוברים — בלי ללחוץ שלח, ובלי לעשות כלום.',
      action: async (demo) => {
        await H.nav(demo, 'files');
        await demo.highlight('#drop-zone', 2400);
      }
    },
    {
      caption: 'גוררים את הקובץ לכאן — וזהו',
      narration: 'במקום להעביר דיסק און קי או לשלוח במייל, פשוט גוררים את הקובץ לכאן. תוך שניות הוא אצל כולם.',
      action: async (demo) => {
        await demo.dragFile('בבא קמא — דף מקורות (סרוק).pdf', '#drop-zone', 'PDF');
        window.__demo.addFile('בבא קמא — דף מקורות (סרוק).pdf', 1258291, 'self');
        await demo.wait(700);
        await demo.toast('הקובץ נוסף ויישלח לעמיתים', 'success', 2000);
      }
    },
    {
      caption: 'מסך העמיתים — מי מחובר אליי',
      narration: 'במסך העמיתים רואים מי מחובר אליך עכשיו. כאן גם מאשרים מחשב חדש, וכאן חוסמים מחשב שלא צריך לקבל ממנו קבצים.',
      action: async (demo) => {
        await H.nav(demo, 'peers');
        await demo.highlight('#trusted-list', 2600);
      }
    },
    {
      caption: 'צ׳אט פנימי — בלי וואטסאפ ובלי אינטרנט',
      captionPos: 'top',
      narration: 'יש גם צ׳אט. הודעה שאתה כותב כאן מגיעה לכל העמיתים בבת אחת, ישר למחשב. זה נוח לקבוע חברותא או להזכיר למישהו להביא גמרא.',
      action: async (demo) => {
        await H.nav(demo, 'chat');
        await demo.type('#chat-input', 'מי מביא את הגמרא למחר?', 26);
        await demo.wait(300);
        await demo.click('#page-chat .chat-input-row .btn-primary', { after: 600 });
        await demo.wait(500);
        window.__demo.emit('chat_message', { from: '7f3a91c2d4e5b608', from_alias: 'LAPTOP-BLUE', text: 'אני מביא, בל״נ. אשתדל להיות שם בשבע.' });
        await demo.wait(2200);
      }
    },
    {
      caption: 'קבוצות — לחברותא או לשיעור',
      narration: 'ואפשר לפתוח קבוצה נפרדת, למשל לחברותא שלך. לכל קבוצה יש קבצים משלה וצ׳אט משל עצמה, בנפרד מכל השאר.',
      action: async (demo) => {
        await H.nav(demo, 'groups');
        await demo.wait(500);
        await demo.click('#groups-list .card', { after: 1200 });
        await demo.wait(1800);
      }
    },
    {
      caption: '',
      narration: 'הכל עובד מקומית בין המחשבים: הקבצים עוברים מוצפנים, בלי שרת ובלי ענן. אין עלות חודשית, אין פרסומות, וזה לא תלוי בשום חברה.',
      action: async (demo) => {
        await demo.slide(H.slideCard({
          eyebrow: 'מה מיוחד בשיתופא',
          title: 'בלי אינטרנט. בלי שרת. מוצפן.',
          lines: [
            'הקבצים עוברים ישירות בין המחשבים, מוצפנים',
            'אין ענן, אין מנוי ואין פרסומות',
            'עובד גם כשאין אינטרנט בכולל — רק רשת בין המחשבים',
            'חינם, ובקוד פתוח'
          ]
        }), 1000);
        await demo.wait(4200);
      }
    }
  ]
};
