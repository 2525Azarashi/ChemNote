#!/usr/bin/env python3
"""生成した第2問のイラストを public/listening_q2/ 用に整える。

第1問B の既存画像（900x900 / JPG / 約113kB）と同じ仕様に揃えることで、
アプリ側の表示（QuestionFigure）や配信サイズの傾向を第1問Bと同じにする。
生成物は 1024x1024 PNG なので、900x900 の JPG に変換する。
"""
import sys, pathlib
from PIL import Image

SIZE = 900          # 第1問B の既存画像と同じ一辺
QUALITY = 88        # 線画なので 88 で十分（q1b と同程度のファイルサイズになる）
OUT = pathlib.Path('public/listening_q2')


def convert(src: pathlib.Path) -> pathlib.Path:
    OUT.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert('RGB')
    if im.size != (SIZE, SIZE):
        im = im.resize((SIZE, SIZE), Image.LANCZOS)
    dst = OUT / (src.stem + '.jpg')
    im.save(dst, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    return dst


if __name__ == '__main__':
    targets = [pathlib.Path(a) for a in sys.argv[1:]] or sorted(
        pathlib.Path('scripts/data/q2_raw').glob('*.png'))
    for src in targets:
        dst = convert(src)
        print(f'{src.name} -> {dst} ({dst.stat().st_size // 1024} kB)')
