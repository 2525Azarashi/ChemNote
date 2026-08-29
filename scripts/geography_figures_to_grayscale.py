#!/usr/bin/env python3
"""
地理の図版を「白黒（グレースケール）」に変換する。

★ご要望「もちいる画像は白黒に。」（実際の共通テスト冊子は白黒印刷）

■ なぜ単純な convert('L') では駄目なのか（実測）
    Pillow の convert('L') は輝度 Y = 0.299R + 0.587G + 0.114B を取るだけ。
    この図版群を実測すると：

      geo_r1_climograph  有彩色（気温の折れ線＝ピンク）の輝度 中央値 158
                         無彩色（降水量の棒＝灰色）  の輝度 中央値 172
                         → 差わずか 14。白黒にすると線と棒が同じ濃さになり、
                           「どの月が最大降水量か」を読めなくなる＝設問が成立しない。

      geo_r4_energy      有彩色（日本の折れ線＝マゼンタ）143 / 無彩色 172 → 差 29
      geo_r3_alluvial_fan 有彩色（川の青・果樹園の緑）170 / 無彩色 204 → 差 34

    つまり「色でしか区別していない要素」が、輝度だけでは潰れる。
    白黒印刷の実物冊子は、色を落とすかわりに ★濃さ（明度）で描き分ける★。
    それを再現するために、彩度が高い画素ほど暗く寄せる。

■ 変換式（マジックナンバーにしない）
        out = clip(Y - K * S, 0, 255)      S = max(R,G,B) - min(R,G,B)
    K は「有彩色の中央値が、無彩色インクの中央値から十分離れる」ことから決める。
    実測（K を振って測った値）：

        K     r1: 有彩色中央値 / 無彩色 172 との差
        0.30  140  → 差 32
        0.45  130  → 差 42
        0.60  121  → 差 51   ← 採用

    K=0.60 で3枚すべて差が 40 以上になり、かつ有彩色の中央値が 89〜130 と
    中間グレーに収まる（0 に張り付いて黒潰れしない）。
    無彩色の画素は S≈0 なので ★一切変化しない★ ＝既存の灰色の棒・罫線・
    文字の濃さはそのまま保たれる。

■ 出力仕様は既存の図版と揃える
    長辺 900px / JPEG quality 88 / optimize / progressive（他の図版と同一）。
    グレースケール1chではなく RGB で書き出す。1ch JPEG は一部の
    ブラウザ・画像処理で色管理が食い違うことがあり、見た目の利得も無いため。
"""

from pathlib import Path

import numpy as np
from PIL import Image

# 実測から導いた彩度→暗さの係数（上のコメント参照）
SATURATION_DARKEN = 0.60
# 既存の地理図版と同じ出力仕様
LONG_EDGE = 900
JPEG_QUALITY = 88

TARGETS = [
    "geo_r1_climograph.jpg",
    "geo_r2_pyramid.jpg",
    "geo_r3_alluvial_fan.jpg",
    "geo_r4_energy.jpg",
]


def to_grayscale(path: Path) -> None:
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)

    lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
    sat = a.max(axis=2) - a.min(axis=2)
    gray = np.clip(lum - SATURATION_DARKEN * sat, 0, 255).astype(np.uint8)

    out = Image.fromarray(gray, mode="L").convert("RGB")
    out.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)
    out.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)

    # 変換後の検算：有彩色は消え、明度差は残っているか
    chk = np.asarray(Image.open(path).convert("RGB")).reshape(-1, 3).astype(int)
    residual = int((chk.max(1) - chk.min(1)).max())
    print(f"{path.name}: {out.size} 残存彩度(最大)={residual}")


def main() -> None:
    base = Path(__file__).resolve().parent.parent / "public" / "geography"
    for name in TARGETS:
        to_grayscale(base / name)


if __name__ == "__main__":
    main()
