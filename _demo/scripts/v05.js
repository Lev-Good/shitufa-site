/* v05 — העברת קבצים */
window.SCENARIO = {
  id: 'v05',
  title: 'העברת קבצים',
  steps: [
    {
      caption: '',
      narration: 'הסרטון הזה על הקבצים עצמם: איך מעבירים אותם, איך מוצאים קובץ ישן, ומה קורה כשמישהו אחר שולח לך משהו.',
      action: async (demo) => {
        await demo.title('העברת קבצים', 'גורר, וזה כבר אצל כולם', 2500);
        await H.nav(demo, 'files');
        await demo.wait(800);
      }
    },
    {
      caption: 'כל הקבצים של כל המחשבים — במקום אחד',
      narration: 'זה מסך הקבצים. כל קובץ שנמצא אצלך, או שהגיע מעמית, מופיע כאן. ליד כל קובץ רואים מי שלח אותו ומתי, ולכן אין בלבול בין הגרסאות.',
      action: async (demo) => {
        await demo.wait(600);
        await demo.highlight('#file-list', 3000);
      }
    },
    {
      caption: 'גוררים קובץ — והוא נשלח לבד',
      narration: 'כדי להעביר קובץ, גוררים אותו מהשולחן או מהתיקייה אל התיבה הזאת. לא צריך לבחור לאן, ולא צריך ללחוץ שלח — הוא נשלח לכל העמיתים המאומתים.',
      action: async (demo) => {
        await demo.scrollTo('#drop-zone', 'center');
        await demo.wait(500);
        await demo.dragFile('חברותא — בבא מציעא.pdf', '#drop-zone', 'PDF');
        window.__demo.addFile('חברותא — בבא מציעא.pdf', 3355443, 'self');
        await demo.wait(500);
        await demo.toast('הקובץ נוסף ויישלח לעמיתים', 'success', 2200);
        await demo.wait(800);
      }
    },
    {
      caption: 'קובץ שהתקבל מעמית — מופיע לבד',
      narration: 'בכיוון ההפוך זה עוד יותר פשוט: כשחבר מכניס קובץ אצלו, הוא מופיע אצלך לבד, עם התראה קטנה. גם אם התוכנה שלך הייתה סגורה — הוא יגיע כשתפתח אותה.',
      action: async (demo) => {
        window.__demo.addFile('שיעור — הרב שטיינמן.mp3', 31457280, 'c14d77aa10bb23ef');
        await demo.wait(500);
        await demo.toast('התקבל קובץ מ-DESK-02', 'success', 2400);
        await demo.wait(1200);
      }
    },
    {
      caption: 'מחפשים קובץ — לפי שם',
      narration: 'כשמצטברים קבצים, מחפשים לפי שם. מקלידים חלק מהשם, והרשימה מצטמצמת מיד. זה עובד גם בעברית, עם או בלי ניקוד.',
      action: async (demo) => {
        await demo.scrollTo('#file-search', 'center');
        await demo.wait(400);
        await demo.type('#file-search', 'בבא', 20);
        await demo.wait(1400);
        H.q('#file-search').value = '';
        H.q('#file-search').dispatchEvent(new Event('input', { bubbles: true }));
        await demo.wait(700);
      }
    },
    {
      caption: 'תצוגת רשת — נוח כשיש הרבה קבצים',
      narration: 'אפשר להחליף בין תצוגת רשימה לתצוגת רשת, עם ריבועים גדולים. את הבחירה התוכנה זוכרת, כך שתמיד תפתח כמו שאתה אוהב.',
      action: async (demo) => {
        await demo.scrollTo('#file-view-toggle', 'center');
        await demo.wait(400);
        await demo.click('#view-btn-grid', { after: 900 });
        await demo.wait(1600);
        await demo.click('#view-btn-list', { after: 700 });
        await demo.wait(800);
      }
    },
    {
      caption: 'פותחים את התיקייה עצמה — כמו כל תיקייה בווינדוס',
      narration: 'הקבצים יושבים בתיקייה רגילה במחשב. כפתור "פתח תיקייה" פותח אותה, ואפשר לפתוח כל קובץ כמו תמיד — ב-PDF, בווורד או בנגן.',
      action: async (demo) => {
        await demo.click('#page-files .section-header .btn-ghost', { after: 900 });
        await demo.wait(1400);
      }
    },
    {
      caption: '',
      narration: 'ושווה לדעת: אפשר גם לחבר דיסק און קי ולהוסיף אותו לסנכרון, ואפשר להגביל כמה מקום הקבצים תופסים במחשב. את שתי האפשרויות רואים כאן.',
      action: async (demo) => {
        H.q('#usb-card').style.display = 'flex';
        H.q('#usb-path').textContent = 'E:\\';
        await demo.scrollTo('#usb-card', 'center');
        await demo.wait(700);
        await demo.highlight('#usb-card', 2600);
        await demo.wait(600);
        H.q('#usb-card').style.display = 'none';
      }
    }
  ]
};
