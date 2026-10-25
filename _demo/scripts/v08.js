/* v08 — בלוטות׳ וכבל */
window.SCENARIO = {
  id: 'v08',
  title: 'בלוטות׳ וכבל',
  steps: [
    {
      caption: '',
      narration: 'לפעמים הנקודה החמה לא נוחה, או שאין Wi-Fi בכלל. בשביל זה יש שתי דרכים נוספות: בלוטות׳ וכבל רשת. שתיהן עובדות בלי אינטרנט ובלי ראוטר.',
      action: async (demo) => {
        await demo.title('בלוטות׳ וכבל רשת', 'כשאין Wi-Fi בכלל', 2500);
        await demo.wait(900);
      }
    },
    {
      caption: 'בלוטות׳ — לשני מחשבים ליד השולחן',
      narration: 'אם שני המחשבים יושבים זה ליד זה, בלוטות׳ היא דרך נוחה. עושים זיווג פעם אחת בהגדרות ווינדוס, ומאותו רגע שיתופא מעבירה קבצים והודעות דרך האוויר.',
      action: async (demo) => {
        await demo.slide(H.methodsSlide(1), 800);
        await demo.wait(4200);
        await demo.slide(H.pairSlide('בלוטות׳ — ישירות בין המחשבים', 'טווח של כמה מטרים'), 700);
        await demo.wait(3800);
      }
    },
    {
      caption: 'מפעילים את הסנכרון דרך בלוטות׳',
      narration: 'בהגדרות יש מתג לסנכרון בלוטות׳. מפעילים אותו, והתוכנה מחפשת עמיתים מזווגים שנמצאים בקרבת מקום. אין צורך לעשות כלום נוסף.',
      action: async (demo) => {
        await H.nav(demo, 'settings');
        await demo.wait(600);
        const c = await H.showCard(demo, 'Bluetooth');
        if (c) await demo.highlight(c, 2200);
        await demo.click('#bt-enabled', { after: 900 });
        await demo.wait(1400);
      }
    },
    {
      caption: 'כבל רשת — המהיר ביותר',
      narration: 'ואם צריך להעביר הרבה קבצים, או קובץ ענק של שיעור מוקלט, כבל רשת הוא המהיר ביותר. מחברים כבל רגיל משקע לשקע — וזה עובד, גם בלי ראוטר בכלל.',
      action: async (demo) => {
        await demo.slide(H.methodsSlide(2), 700);
        await demo.wait(3400);
        await demo.slide(H.pairSlide('כבל רשת בין שני המחשבים', 'המהיר ביותר — מתאים לקבצים גדולים'), 700);
        await demo.wait(3400);
      }
    },
    {
      caption: 'ההסבר נמצא גם בתוך התוכנה',
      narration: 'כל ארבע הדרכים מוסברות גם בתוך התוכנה עצמה, במסך העמיתים. שם גם יש כפתורים שמפתחים את הגדרות ווינדוס הרלוונטיות, כדי שלא תצטרך לחפש.',
      action: async (demo) => {
        await H.nav(demo, 'peers');
        await demo.wait(500);
        await demo.click('#page-peers .btn-ghost', { after: 900 });
        await demo.wait(900);
        const modal = H.q('#connect-guide-modal .card');
        modal.scrollTop = 300;
        await demo.wait(900);
        await demo.highlight('#connect-guide-modal .card', 2600);
        await demo.wait(600);
        await demo.click('#connect-guide-modal .btn-primary', { after: 600 });
      }
    },
    {
      caption: '',
      narration: 'הכלל: כל מה שיוצר ביניכם רשת אחת — נקודה חמה, בלוטות׳, כבל או ראוטר — מספיק כדי ששיתופא תעבוד. האינטרנט עצמו לא נחוץ בכלל.',
      action: async (demo) => {
        await demo.slide(H.slideCard({
          eyebrow: 'לסיכום',
          title: 'דרך אחת חייבת להיות',
          lines: [
            'נקודה חמה — הכי נוח ליד שולחן',
            'בלוטות׳ — לשני מחשבים קרובים',
            'כבל רשת — לקבצים גדולים',
            'ראוטר — אם יש, גם בלי אינטרנט'
          ]
        }), 800);
        await demo.wait(3400);
      }
    }
  ]
};
