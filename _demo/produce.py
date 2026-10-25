"""מפיק את סרטוני ההדרכה: קריינות עברית + הקלטת הממשק האמיתי + מיזוג ל-MP4.

שימוש:
    python produce.py v01 v02        # סרטונים מסוימים
    python produce.py --all          # כל הסרטונים בתיקיית scripts

השלבים לכל סרטון:
  1. קריינות edge-tts (קול עברי) לכל שלב, עם מטמון לפי תוכן.
  2. מדידת הפעולות בפועל (Playwright, ללא וידאו).
  3. קביעת אורך כל שלב = הארוך מבין הקריינות / הפעולה.
  4. הקלטת הממשק (1920x1080) ותזמון אמיתי של כל שלב.
  5. הנחת קריינות על ציר הזמן של הפעולות בפועל, ומיזוג ל-MP4.
"""
import asyncio
import hashlib
import json
import os
import ssl
import subprocess
import sys
import wave
from pathlib import Path

import edge_tts
import imageio_ffmpeg

HERE = Path(__file__).resolve().parent
SCRIPTS = HERE / "scripts"
OUT = HERE / "out"
CACHE = HERE / ".cache"
LOGO = HERE / "logo.png"

VOICE = "he-IL-AvriNeural"
RATE = "+6%"
PAD_AFTER_AUDIO = 0.55     # נשימה אחרי סוף המשפט
PAD_AFTER_ACTION = 0.35    # נשימה אחרי סיום הפעולה
MIN_STEP = 2.0
TAIL = 1.2

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


# ── עזרי מדיה ────────────────────────────────────────────────────────────────
def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        raise RuntimeError(f"command failed: {' '.join(map(str, cmd))}\n{r.stderr[-2000:]}")
    return r.stdout


def to_wav(src: Path, dst: Path):
    run([FFMPEG, "-y", "-loglevel", "error", "-i", str(src),
         "-ac", "1", "-ar", "24000", "-acodec", "pcm_s16le", str(dst)])


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as w:
        return w.getnframes() / float(w.getframerate())


def read_wav(path: Path):
    with wave.open(str(path), "rb") as w:
        return w.getframerate(), w.getnchannels(), w.getsampwidth(), w.readframes(w.getnframes())


# ── קריינות ──────────────────────────────────────────────────────────────────
def _patch_ssl():
    """בסביבה עם אנטי-וירוס/פרוקסי שמחליף תעודות — aiohttp מסרב להתחבר.

    edge_tts יוצר SSLContext יחיד בזמן import (עם certifi), ולכן משנים אותו
    במקום ולא את ברירת המחדל של המודול.
    """
    from edge_tts import communicate as _c

    if isinstance(getattr(_c, "_SSL_CTX", None), ssl.SSLContext):
        _c._SSL_CTX.check_hostname = False
        _c._SSL_CTX.verify_mode = ssl.CERT_NONE


async def _speak(text: str, mp3: Path):
    com = edge_tts.Communicate(text, VOICE, rate=RATE)
    await com.save(str(mp3))


def narration_wav(text: str) -> Path:
    """מחזיר WAV של הקריינות (עם מטמון לפי תוכן המשפט)."""
    key = hashlib.sha1((VOICE + RATE + text).encode("utf-8")).hexdigest()[:16]
    mp3 = CACHE / f"{key}.mp3"
    wav = CACHE / f"{key}.wav"
    if not wav.exists():
        mp3.parent.mkdir(parents=True, exist_ok=True)
        asyncio.run(_speak(text, mp3))
        to_wav(mp3, wav)
    return wav


# ── שליפת התסריט ──────────────────────────────────────────────────────────────
def scenario_meta(name: str) -> dict:
    stub = (
        "global.window={};require(process.argv[1]);"
        "const s=window.SCENARIO;"
        "process.stdout.write(JSON.stringify({id:s.id,title:s.title,"
        "narration:s.steps.map(x=>x.narration||'')}));"
    )
    out = run(["node", "-e", stub, str(SCRIPTS / f"{name}.js")], cwd=str(HERE))
    return json.loads(out)


# ── הקלטה ────────────────────────────────────────────────────────────────────
def record(name: str, mode: str):
    out = run(["node", "record.js", str(OUT), name, mode], cwd=str(HERE))
    line = [l for l in out.strip().splitlines() if l.startswith("{")][-1]
    return json.loads(line)


def timings(name: str) -> dict:
    return json.loads((OUT / f"{name}.timings.json").read_text(encoding="utf-8"))


# ── בניית פס הקול ────────────────────────────────────────────────────────────
def build_audio(parts, total: float, dst: Path):
    rate = nch = width = None
    for _, p in parts:
        rate, nch, width, _ = read_wav(p)
        break
    buf = bytearray(int(total * rate) * nch * width)
    for start, p in parts:
        r, c, w, data = read_wav(p)
        if (r, c, w) != (rate, nch, width):
            raise RuntimeError(f"audio format mismatch in {p}")
        off = int(start * rate) * c * w
        end = min(len(buf), off + len(data))
        buf[off:end] = data[: end - off]
    with wave.open(str(dst), "wb") as o:
        o.setnchannels(nch)
        o.setsampwidth(width)
        o.setframerate(rate)
        o.writeframes(bytes(buf))


# ── סרטון בודד ───────────────────────────────────────────────────────────────
def produce(name: str):
    meta = scenario_meta(name)
    narr = meta["narration"]
    print(f"\n=== {name} — {meta['title']} ({len(narr)} שלבים)")

    # 1. קריינות
    wavs = []
    for i, text in enumerate(narr):
        if not text.strip():
            wavs.append(None)
            continue
        w = narration_wav(text)
        wavs.append(w)
        print(f"  tts [{i+1}/{len(narr)}] {wav_duration(w):5.1f}s  {text[:48]}")

    # 2. מדידת הפעולות
    record(name, "measure")
    m = timings(name)
    actions = [t["action"] / 1000.0 for t in m["timings"]]

    # 3. אורכי שלבים
    durations = []
    for i in range(len(narr)):
        audio = wav_duration(wavs[i]) + PAD_AFTER_AUDIO if wavs[i] else 0.0
        durations.append(round(max(audio, actions[i] + PAD_AFTER_ACTION, MIN_STEP), 2))
    (OUT / f"{name}.durations.json").write_text(json.dumps(durations), encoding="utf-8")

    # 4. הקלטה
    rec = record(name, "record")
    t = timings(name)
    if t.get("error"):
        print(f"  ! שגיאה בתסריט: {t['error']}")
    real = t["timings"]
    end = real[-1]["end"] / 1000.0 + TAIL

    # 5. קריינות על ציר הזמן האמיתי
    parts = []
    for i, w in enumerate(wavs):
        if w:
            parts.append((real[i]["start"] / 1000.0 + 0.25, w))
    audio_wav = OUT / f"{name}.audio.wav"
    build_audio(parts, end, audio_wav)

    # 6. מיזוג
    webm = Path(rec["videoPath"]) if rec.get("videoPath") else None
    if not webm or not webm.exists():
        raise RuntimeError("no recorded video found")
    mp4 = OUT / f"{name}.mp4"
    pre = t["preMs"] / 1000.0
    run([FFMPEG, "-y", "-loglevel", "error",
         "-ss", f"{pre:.2f}", "-t", f"{end:.2f}", "-i", str(webm),
         "-i", str(audio_wav),
         "-map", "0:v:0", "-map", "1:a:0",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "21",
         "-pix_fmt", "yuv420p", "-r", "30",
         "-c:a", "aac", "-b:a", "160k", "-ac", "2",
         "-movflags", "+faststart", "-shortest", str(mp4)])
    print(f"  ✓ {mp4}  ({end:.1f}s)")
    try:  # הווידאו הגולמי גדול — לא נשאיר אותו אחרי המיזוג
        webm.unlink()
    except OSError:
        pass
    return mp4


def main():
    args = sys.argv[1:]
    if not args or args[0] == "--all":
        names = sorted(p.stem for p in SCRIPTS.glob("v*.js"))
    else:
        names = args

    OUT.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    _patch_ssl()

    done = []
    for n in names:
        try:
            done.append(produce(n))
        except Exception as e:  # סרטון אחד לא יפיל את כל הריצה
            print(f"  ✗ {n}: {type(e).__name__}: {e}")
    print("\nהושלמו:", ", ".join(p.name for p in done))


if __name__ == "__main__":
    main()
