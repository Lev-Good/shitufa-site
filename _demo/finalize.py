"""מעביר את הסרטונים לאתר: מעתיק ל-videos/, מייצר תמונות פתיח, ומעדכן
את index.html (data-file, data-poster ואורכי הסרטונים).

שימוש: python finalize.py
"""
import re
import shutil
import subprocess
from pathlib import Path

import imageio_ffmpeg

HERE = Path(__file__).resolve().parent
LANDING = HERE.parent
OUT = HERE / "out"
VID = LANDING / "videos"
INDEX = LANDING / "index.html"
FF = imageio_ffmpeg.get_ffmpeg_exe()


def duration(path: Path) -> float:
    r = subprocess.run([FF, "-i", str(path)], capture_output=True, text=True)
    m = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", r.stderr)
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


def fmt(sec: float) -> str:
    sec = round(sec)
    return f"{sec // 60}:{sec % 60:02d}"


def main():
    VID.mkdir(exist_ok=True)
    html = INDEX.read_text(encoding="utf-8")
    lengths = {}

    for mp4 in sorted(OUT.glob("v*.mp4")):
        key = mp4.stem
        dst = VID / mp4.name
        shutil.copyfile(mp4, dst)
        poster = VID / (key + ".jpg")
        subprocess.run([FF, "-y", "-loglevel", "error", "-ss", "2.2",
                        "-i", str(mp4), "-frames:v", "1", "-q:v", "4", str(poster)],
                       check=True)
        lengths[key] = duration(mp4)
        print(f"{key}: {fmt(lengths[key])}  {mp4.stat().st_size/1e6:.1f}MB")

    for key, sec in lengths.items():
        block = re.findall(r'<article[^>]*data-video="%s">.*?</article>' % key,
                           html, flags=re.S)
        if not block:
            print("  ! card not found:", key)
            continue
        new = block[0]
        new = re.sub(r'(<article[^>]*data-video="%s")' % key,
                     r' data-file="videos/%s.mp4" data-poster="videos/%s.jpg"' % (key, key), new)
        new = re.sub(r'<span class="vf-duration"[^>]*>[^<]*</span>',
                     '<span class="vf-duration" data-duration="%s">%s</span>' % (fmt(sec), fmt(sec)), new)
        new = re.sub(r'<span class="vf-soon">[^<]*</span>', '', new)
        new = re.sub(r'(<div class="video-tags">.*?)<span>\d+:\d+</span>(\s*</div>)',
                     r'<span>%s</span>' % fmt(sec), new, flags=re.S)
        html = html.replace(block[0], new)

    INDEX.write_text(html, encoding="utf-8")
    print("index.html עודכן")


if __name__ == "__main__":
    main()
