/* v07 — קבוצות */
window.SCENARIO = {
  id: 'v07',
  title: 'קבוצות',
  steps: [
    {
      caption: '',
      captionPos: 'top',
      narration: 'קבוצה היא כמו חדר נפרד: קבצים משלה וצ׳אט משלה. זה מתאים לחברותא, לשיעור, או לכמה אברכים שרוצים לעבוד יחד בלי לערבב עם כל הכולל.',
      action: async (demo) => {
        await demo.title('קבוצות', 'חברותא, שיעור — כל אחד לבד', 2500);
        await H.nav(demo, 'groups');
        await demo.wait(1000);
      }
    },
    {
      caption: 'יוצרים קבוצה — אתה המנהל שלה',
      captionPos: 'top',
      narration: 'לוחצים על "צור קבוצה חדשה", נותנים שם — למשל "חברותא סדר ב׳" — ומאשרים. מי שיצר את הקבוצה הוא המנהל שלה, והוא מחליט מי מצטרף.',
      action: async (demo) => {
        await demo.click('#groups-list-view > div:nth-child(3) .btn-primary', { after: 900 });
        await demo.wait(700);
        await demo.type('#new-group-name', 'חברותא סדר ב׳', 18);
        await demo.wait(500);
        await demo.click('#modal-create-group .btn-primary', { after: 1200 });
        await demo.wait(1800);
      }
    },
    {
      caption: 'מזמינים את החברים',
      captionPos: 'top',
      narration: 'נכנסים לקבוצה שנוצרה, ושם מזמינים עמיתים מחוברים. כל מוזמן מקבל הזמנה, והוא מצטרף רק אם הוא מאשר — בלי שהקבוצה תיפתח למי שלא צריך.',
      action: async (demo) => {
        const created = H.q('#groups-list .card:last-child');
        await demo.click(created, { after: 1400 });
        await demo.wait(1200);
        await demo.scrollTo('#detail-members-list', 'center');
        await demo.wait(700);
        await demo.highlight('#detail-members-list', 2200);
      }
    },
    {
      caption: 'קבצים של הקבוצה — בנפרד מכל השאר',
      captionPos: 'top',
      narration: 'בתוך הקבוצה יש תיקיית קבצים משלה. קובץ שתעלה לכאן יגיע רק לחברי הקבוצה, ולא לכל המחשבים שמחוברים אליך. זה בדיוק מה שצריך כשמדובר בחומר של חברותא.',
      action: async (demo) => {
        await demo.scrollTo('#detail-files-list', 'center');
        await demo.wait(600);
        await demo.highlight('#detail-files-list', 2600);
      }
    },
    {
      caption: 'מעלים קובץ לקבוצה',
      captionPos: 'top',
      narration: 'גוררים קובץ לתיבה הזאת, וכל חברי הקבוצה מקבלים אותו. אין צורך להיות מנהל כדי להעלות — כל חבר יכול לתרום לקבוצה.',
      action: async (demo) => {
        await demo.dragFile('בבא קמא — דף מקורות.pdf', '#group-drop-zone', 'PDF');
        await demo.wait(600);
        const list = H.q('#detail-files-list');
        const row = document.createElement('div');
        row.className = 'file-item';
        row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid var(--border);border-radius:6px;background:#fff;';
        row.innerHTML = '<span style="font-size:18px">📄</span><div style="flex:1"><div style="font-weight:600;font-size:13px">בבא קמא — דף מקורות.pdf</div><div style="font-size:11px;color:var(--muted)">נשלח לקבוצה · הרגע</div></div>';
        list.insertBefore(row, list.firstChild);
        await demo.wait(600);
        await demo.toast('הקובץ נשלח לכל חברי הקבוצה', 'success', 2400);
      }
    },
    {
      caption: 'צ׳אט קבוצתי — רק החברים רואים',
      captionPos: 'top',
      narration: 'בתחתית יש צ׳אט של הקבוצה. מה שנכתב כאן נשאר בתוך הקבוצה. ככה אפשר לתאם סדר, לשאול שאלות על הסוגיא, ולעדכן מי מביא מה.',
      action: async (demo) => {
        await demo.scrollTo('#detail-chat-messages', 'center');
        await demo.wait(800);
        await demo.type('#detail-chat-input', 'מחר נתחיל בסוגיא דף ב׳, תביאו את הגמרא', 22);
        await demo.wait(400);
        await demo.click('#group-detail-view .card:last-child .btn-primary', { after: 900 });
        await demo.wait(1600);
        window.__demo.emit('group_chat_message', { group_id: 'g1', from_alias: 'LAPTOP-BLUE', from: '7f3a91c2d4e5b608', text: 'בל״נ, אני אביא גם את הרמב״ם' });
        await demo.wait(2200);
      }
    },
    {
      caption: '',
      captionPos: 'top',
      narration: 'וכשמסיימים, פשוט יוצאים מהקבוצה — הקבצים שכבר נמצאים אצלך נשארים. הקבוצה היא כלי עבודה, לא התחייבות.',
      action: async (demo) => {
        await demo.slide(H.slideCard({
          eyebrow: 'קבוצות',
          title: 'מה מקבלים',
          lines: [
            'תיקיית קבצים נפרדת לכל קבוצה',
            'צ׳אט פנימי שרק החברים רואים',
            'מנהל שמחליט מי מצטרף',
            'כל חבר יכול להעלות קבצים'
          ]
        }), 800);
        await demo.wait(3200);
      }
    }
  ]
};
