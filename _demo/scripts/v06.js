/* v06 — צ׳אט פנימי */
window.SCENARIO = {
  id: 'v06',
  title: 'צ׳אט',
  steps: [
    {
      caption: '',
      captionPos: 'top',
      narration: 'הצ׳אט של שיתופא הוא בשביל הדברים הקטנים: "מי מגיע לשיעור", "תביא את הגמרא", "שכחתי את המפתח". הוא עובד בין המחשבים בלבד, בלי אינטרנט ובלי וואטסאפ.',
      action: async (demo) => {
        await demo.title('צ׳אט פנימי', 'הודעה אחת — לכל העמיתים, בלי אינטרנט', 2500);
        await H.nav(demo, 'chat');
        await demo.wait(800);
      }
    },
    {
      caption: 'כותבים הודעה — והיא מגיעה לכולם',
      captionPos: 'top',
      narration: 'כותבים למטה, ולוחצים שלח. ההודעה מגיעה לכל העמיתים המאומתים בבת אחת — לא צריך לבחור נמען ולא לפתוח קבוצה.',
      action: async (demo) => {
        await demo.type('#chat-input', 'מי מגיע לשיעור הערב?', 24);
        await demo.wait(400);
        await demo.click('#page-chat .chat-input-row .btn-primary', { after: 800 });
        await demo.wait(1800);
      }
    },
    {
      caption: 'תשובה מגיעה — עם התראה',
      captionPos: 'top',
      narration: 'כשמישהו עונה, ההודעה מופיעה אצלו ואצלך. אם התוכנה סגורה או ממוזערת, קופצת התראה של ווינדוס — כך אתה לא מפספס.',
      action: async (demo) => {
        window.__demo.emit('chat_message', { from: '7f3a91c2d4e5b608', from_alias: 'LAPTOP-BLUE', text: 'אני מגיע. מישהו יכול להביא את החומש?' });
        await demo.wait(2600);
      }
    },
    {
      caption: 'תיוג: @ ואז שם העמית',
      captionPos: 'top',
      narration: 'אם אתה צריך מישהו מסוים, מקלידים שטרודל ואת השם. התוכנה מציעה את שמות העמיתים, ואם תבחר אחד — הוא יקבל התראה מיוחדת שהזכירו אותו.',
      action: async (demo) => {
        await demo.type('#chat-input', 'תביא את ', 26);
        await demo.typeKeys('@LA', 14);
        await demo.wait(900);
        await demo.highlight('#mention-popup', 2200);
        await demo.wait(400);
        await demo.click('#mention-popup .mention-item', { after: 700 });
        await demo.wait(800);
      }
    },
    {
      caption: 'מגיבים להודעה — בלי להקליד',
      captionPos: 'top',
      narration: 'לכל הודעה יש סרגל קטן: אפשר להגיב עליה, או לסמן סימון מהיר — לייק, "בוצע", "דורש מחשבה". הרבה פעמים זה חוסך הודעה שלמה.',
      action: async (demo) => {
        const bubble = H.q('#chat-messages .msg.theirs') || H.q('#chat-messages .msg');
        await demo.hover(bubble);
        await demo.wait(700);
        await demo.click(bubble.querySelector('.msg-actions .msg-action-btn'), { after: 900 });
        await demo.wait(900);
        await demo.type('#chat-input', 'בשמחה, אני אביא', 26);
        await demo.click('#page-chat .chat-input-row .btn-primary', { after: 800 });
        await demo.wait(1600);
      }
    },
    {
      caption: 'שמירת היסטוריה — לבחירתך',
      captionPos: 'top',
      narration: 'כברירת מחדל הצ׳אט לא נשמר אחרי סגירת התוכנה. אם אתה רוצה שההודעות יישמרו במחשב, יש סימון קטן למעלה. ההחלטה שלך, ולא של אף אחד אחר.',
      action: async (demo) => {
        await demo.scrollTo('#save-chat-history-toggle', 'center');
        await demo.wait(600);
        await demo.click('#save-chat-history-toggle', { after: 800 });
        await demo.wait(1800);
      }
    },
    {
      caption: '',
      captionPos: 'top',
      narration: 'וזה הכל. הצ׳אט הוא כלי עזר — הדבר העיקרי הוא שהקבצים פשוט מגיעים. בסרטון הבא נראה את הקבוצות, שבהן הצ׳אט והקבצים מופרדים לחברותא או לשיעור.',
      action: async (demo) => {
        await demo.slide(H.slideCard({
          eyebrow: 'צ׳אט',
          title: 'מה אפשר לעשות בו',
          lines: [
            'הודעה אחת לכל העמיתים',
            'תיוג @שם — לתשומת לב מיוחדת',
            'מענה על הודעה וסימונים מהירים',
            'שמירת היסטוריה — רק אם תבחר'
          ]
        }), 800);
        await demo.wait(3200);
      }
    }
  ]
};
