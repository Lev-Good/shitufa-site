/* v09 — כשזה לא מתחבר */
window.SCENARIO = {
  id: 'v09',
  title: 'כשזה לא מתחבר',
  steps: [
    {
      caption: '',
      captionPos: 'top',
      narration: 'אם שני המחשבים מותקנים ולא רואים זה את זה — כמעט תמיד יש סיבה אחת משתיים: חומת האש של ווינדוס חוסמת, או שהמחשבים לא באמת על אותה רשת. הסרטון הזה מראה איך מגלים מה מהן.',
      action: async (demo) => {
        await demo.title('כשזה לא מתחבר', 'שתי סיבות, ושתי לחיצות', 2600);
        await demo.wait(900);
      }
    },
    {
      caption: 'הסיבה הראשונה: חומת האש של ווינדוס',
      captionPos: 'top',
      narration: 'ווינדוס חוסמת תעבורה נכנסת כברירת מחדל. לכן, אם לא אישרת בזמן ההתקנה, העמיתים לא ימצאו אותך בכלל — בלי שום הודעת שגיאה. זה נמצא בהגדרות, בכרטיס חומת האש.',
      action: async (demo) => {
        await H.nav(demo, 'settings');
        await demo.wait(600);
        const c = await H.showCard(demo, 'חומת אש');
        if (c) await demo.highlight(c, 2600);
      }
    },
    {
      caption: 'לוחצים "אשר תעבורה נכנסת" — מאשרים בחלון אחד',
      captionPos: 'top',
      narration: 'לוחצים על הכפתור הזה ומאשרים את החלון של ווינדוס. זה קורה פעם אחת, ודורש הרשאת מנהל. אחרי זה הכרטיס אמור להראות שהכל מסודר.',
      action: async (demo) => {
        await demo.click(H.btn('חומת אש', 'אשר תעבורה'), { after: 400 });
        await demo.toast('מבקש הרשאה מווינדוס…', 'success', 2200);
        await demo.wait(900);
        const status = H.q('#fw-status-text');
        if (status) { status.textContent = 'חומת האש מאשרת תעבורה נכנסת לשיתופא'; status.style.color = '#2e7d32'; }
        await demo.wait(1600);
      }
    },
    {
      caption: 'הסיבה השנייה: לא אותה רשת',
      captionPos: 'top',
      narration: 'הסיבה השנייה נפוצה עוד יותר: המחשבים נמצאים על רשתות שונות. למשל, אחד על ה-Wi-Fi של הכולל והשני על נקודה חמה אחרת — הם פשוט לא רואים זה את זה.',
      action: async (demo) => {
        const c = await H.showCard(demo, 'אבחון רשת');
        if (c) await demo.highlight(c, 2400);
      }
    },
    {
      caption: 'אבחון רשת — בודק ואומר בדיוק מה הבעיה',
      captionPos: 'top',
      narration: 'בשביל זה יש אבחון רשת. לוחצים "בדוק עכשיו", והתוכנה בודקת את כרטיסי הרשת, את חומת האש ואת המכשירים שסביבה. הבדיקה מקומית בלבד — שום דבר לא נשלח לאינטרנט.',
      action: async (demo) => {
        await demo.click(H.btn('אבחון רשת', 'בדוק עכשיו'), { after: 400 });
        await demo.wait(600);
        await demo.scrollTo('#diag-results', 'center');
        await demo.wait(2200);
      }
    },
    {
      caption: 'ככה נראית בדיקה שמצאה בעיה',
      captionPos: 'top',
      narration: 'אם יש בעיה, האבחון אומר אותה בשפה פשוטה: למשל שהמחשבים לא על אותה רשת, או שנקודת הגישה מבודדת לקוחות. לא צריך להבין ברשתות — צריך רק לקרוא את השורה האדומה.',
      action: async (demo) => {
        window.__demo.setDiagnostics({
          findings: [
            { severity: 'error', code: 'firewall_rule_missing', params: {} },
            { severity: 'warn', code: 'client_isolation_suspected', params: { other_hosts: 4 } },
            { severity: 'ok', code: 'firewall_ok', params: {} }
          ],
          facts: { interfaces: ['Wi-Fi'], other_hosts: 4, beacons_sent: 8, beacons_received: 0 }
        });
        await demo.click(H.btn('אבחון רשת', 'בדוק עכשיו'), { after: 400 });
        await demo.wait(700);
        await demo.scrollTo('#diag-results', 'center');
        await demo.wait(800);
        await demo.highlight('#diag-results', 3000);
      }
    },
    {
      caption: '',
      captionPos: 'top',
      narration: 'ואם עדיין לא מסתדר — יש מדריך בתוך התוכנה, וקהילה פעילה בפורומים. את הקישורים תמצאו בתחתית האתר. אין צורך להיאבק לבד.',
      action: async (demo) => {
        await demo.slide(H.slideCard({
          eyebrow: 'סדר הבדיקות',
          title: 'שלושה צעדים, ותמיד עובד',
          lines: [
            'שני המחשבים על אותה רשת?',
            'חומת האש אישרה תעבורה נכנסת?',
            'שני הצדדים אישרו זה את זה?',
            'ואם לא — אבחון רשת יגיד מה בדיוק'
          ]
        }), 800);
        await demo.wait(3600);
      }
    }
  ]
};
