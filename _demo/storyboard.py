"""מייצר את מסמך התסריטים (docs/video-prompts.md) מתוך קבצי התסריט עצמם,
כדי שהמסמך והסרטונים לא ייפרדו זה מזה."""
import json
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
SCRIPTS = HERE / "scripts"
DOC = HERE.parent / "docs" / "video-prompts.md"

STUB = (
    "global.window={};require(process.argv[1]);"
    "const s=window.SCENARIO;"
    "process.stdout.write(JSON.stringify({id:s.id,title:s.title,"
    "steps:s.steps.map(x=>({caption:x.caption||'',narration:x.narration||''}))}));"
)

HEADER = """# סרטוני ההדרכה — תסריטים והפקה

המסמך הזה הוא התסריט המדויק של עשרת סרטוני ההדרכה באתר, ונוצר אוטומטית
מ[קובצי התסריט](../_demo/scripts/) — כך שהמסמך והסרטונים לא נפרדים.

## איך הסרטונים מופקים

הסרטונים הם **הקלטה של הממשק האמיתי** של שיתופא (`re/dashboard.html`), לא
איורים ולא הנפשה. כל סרטון מורכב משלבים; לכל שלב יש כיתוב על המסך, קריינות
בעברית, ופעולה אמיתית שמבוצעת בממשק (לחיצה, גרירת קובץ, הקלדה).

```text
re/dashboard.html            ← הממשק האמיתי (מקור האמת)
  └─ _demo/make_demo.py      ← מזריק שכבת נתונים מדומה (עמיתים, קבצים, קבוצות)
       └─ _demo/presenter.js ← סמן, כיתוביות, שקופיות הסבר
            └─ _demo/scripts/vNN.js  ← התסריט: כיתוב + קריינות + פעולה
                 ├─ produce.py  ← קריינות edge-tts, הקלטה, מיזוג ל-MP4
                 └─ finalize.py ← העברה ל-/videos, תמונות פתיח, עדכון index.html
```

### למה הקלטה ולא יצירת וידאו ב-AI

מודל וידאו (ג׳מיני, Sora וכדומה) לא מכיר את הממשק של שיתופא: הוא ממציא
מסכים, כפתורים וטקסט עברי משובש, ואין לו דרך להראות בדיוק על איזה כפתור
ללחוץ. הקלטה של הממשק האמיתי נותנת סרטון שאברך יכול לעקוב אחריו צעד-צעד.
העלות: הנתונים בסרטון הם דמו (קבצים ועמיתים לדוגמה), כי במחשב אחד אין
באמת שלושה מחשבים משתפים. הממשק, הכפתורים וההודעות — אמיתיים.

### הרצה מחדש

```bash
# שרת מקומי שמגיש את תיקיית האתר (צריך להיות פעיל ברקע)
python -m http.server 8899 --directory landing

cd landing
python _demo/make_demo.py            # בונה את עמוד הדמו מהממשק האמיתי
python _demo/produce.py --all        # מייצר מחדש את כל הסרטונים
python _demo/produce.py v03 v07      # או רק חלקם
python _demo/finalize.py             # מעדכן את האתר לפי הסרטונים
```

הקריינות נשמרת במטמון (`_demo/.cache`) לפי תוכן המשפט, כך ששינוי של משפט אחד
מייצר מחדש רק אותו.

### קריינות

קול: `he-IL-AvriNeural` (עברית, גברי), קצב +6%. כל שלב מקבל משפט אחד עד שלושה,
בשפה פשוטה ובלי מונחים טכניים, בגלל קהל היעד — אברכי כולל.

### העלאה ליוטיוב

`landing/assets/js/main.js` תומך בשני מצבים: קובץ מקומי (`data-file`) או
הטמעת יוטיוב. אחרי העלאה ליוטיוב ממלאים את `SHITUFA_VIDEOS` בקובץ
`landing/assets/js/videos.js` במזהי הסרטונים — והאתר יעדיף אותם אוטומטית,
אחרי שמוחקים את הקבצים המקומיים מ-`/videos`.

---
"""


def main():
    parts = [HEADER]
    for p in sorted(SCRIPTS.glob("v*.js")):
        out = subprocess.run(["node", "-e", STUB, str(p)], cwd=str(HERE),
                             capture_output=True, text=True, check=True)
        s = json.loads(out.stdout)
        parts.append(f"## {s['id']} — {s['title']}\n")
        parts.append("| # | כיתוב על המסך | קריינות |")
        parts.append("|---|---|---|")
        for i, st in enumerate(s["steps"], 1):
            cap = (st["caption"] or "—").replace("|", "\\|")
            nar = (st["narration"] or "—").replace("|", "\\|")
            parts.append(f"| {i} | {cap} | {nar} |")
        parts.append("")
    DOC.parent.mkdir(parents=True, exist_ok=True)
    DOC.write_text("\n".join(parts) + "\n", encoding="utf-8")
    print("wrote", DOC)


if __name__ == "__main__":
    main()
