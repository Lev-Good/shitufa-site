window.SCENARIO = {
  steps: [
    {
      caption: '',
      action: async (demo) => {
        await demo.title('שיתופא', 'בדיקת הקלטה — סמן, כיתוביות ומעברים', 2200);
      }
    },
    {
      caption: 'התוכנה מחברת מחשבים באותה רשת — בלי אינטרנט',
      action: async (demo) => { await demo.wait(1500); }
    },
    {
      caption: 'מסך העמיתים: מאומתים, ממתינים לאישור וחסומים',
      action: async (demo) => {
        await demo.click('[onclick*="nav(\'peers\'"]');
        await demo.wait(600);
        await demo.highlight('#pending-banner');
      }
    },
    {
      caption: 'וכאן הצ׳אט עם כל העמיתים',
      action: async (demo) => {
        await demo.click('[onclick*="nav(\'chat\'"]');
        await demo.wait(700);
      }
    }
  ]
};
