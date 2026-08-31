#!/usr/bin/env python3
# =====================================================================
# アプリのアイコンを「正方形」に作り直すスクリプト
# =====================================================================
# ご指摘（原文）
#   > アプリケーションのアイコンが横に圧縮されているので
#   > 正常な比に直してください。
#
# ■ なぜ横に潰れていたのか（実際に測った結果）
#
#   public/manatob_bg.png     1000 x 358  → 横:縦 = 2.793 : 1（横長のロゴ）
#   src/assets/mntb_logo.png  1005 x 314  → 2.793 より更に横長
#   public/favicon.ico           1 x 1    → ★中身が空★
#   public/icons/                          → ★そもそも存在しない★
#
#   index.html は  <link rel="icon" href="/manatob_bg.png">
#   つまり ★横長のロゴをそのままアイコンに指定していた★。
#   アイコンの枠は OS もブラウザも必ず「正方形」なので、
#   横長の絵を入れると横方向に押し縮められて潰れる。
#
#   manifest.json は /icons/icon-192.png などを指していたが、
#   そのファイルが存在しないので、環境によっては
#   代わりに favicon（＝1x1 の空画像）や横長ロゴが使われていた。
#
# ■ どう直すか
#
#   ★画像を新しく描き起こすことはしない★（クレジットを使わないため）。
#   既に持っているロゴを、比を一切変えずに縮小し、
#   正方形のキャンバスの中央に置いて「余白を足す」だけにする。
#   （写真の「レターボックス」と同じ考え方）
#
#     元 1000x358 ─┐
#                  ├→ 512x512 の中央に 450x161 で配置し、上下に余白
#     比は 2.793 のまま ┘   → 潰れない
#
# ■ 「maskable」を別ファイルにする理由（ここが一番の落とし穴）
#
#   Android は purpose:"maskable" のアイコンを、端末ごとの形
#   （円・角丸四角・しずく型…）で ★切り抜いて★ 使う。
#   保証されるのは「中央の直径80%の円」だけ（セーフゾーン）。
#
#   これまでの manifest は purpose を "any maskable" と
#   1つのファイルに兼用させていた。しかしこの2つは要求が正反対で、
#     ・any      … 余白は少ない方が大きく綺麗に見える
#     ・maskable … 余白を多く取らないと端が切り落とされる
#   兼用すると「any で小さすぎる」か「maskable で切れる」の
#   どちらかが必ず起きる。だから ★2つに分ける★。
#
#   セーフゾーンに収まるかは計算で確かめられる。
#   幅 w・高さ h の長方形が半径 R の円に収まる条件は
#       (w/2)^2 + (h/2)^2 <= R^2
#   透明な余白を除いた実際のロゴは 981x305（比 3.216）なので、
#   maskable 版を w = 0.74S にすると h = 0.74S/3.216 = 0.2301S、R = 0.40S で
#       √(0.37^2 + 0.1151^2) = 0.3875 <= 0.40  ✅
#   （このスクリプトは実行時にこの検算も行い、外れたら止まる）
#
# ■ 使い方
#     python3 scripts/make-icons.py
#   いつでも作り直せるので、ロゴを差し替えたら再実行するだけでよい。
# =====================================================================
import os
import math
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_LOGO = os.path.join(ROOT, 'public', 'manatob_bg.png')
OUT_DIR = os.path.join(ROOT, 'public', 'icons')

# アイコンの地の色。
# アプリの紙（アイボリー #FDFBF7）に合わせる。
# ロゴの「n」の中に白い廊下の絵が入っているので、
# 真っ白に近いアイボリーが一番自然に馴染む。
BG = (253, 251, 247, 255)

# ロゴを正方形の何割の「幅」で置くか。
#   any      … タブ・ブックマーク・PWA の一覧に出る通常のアイコン
#   maskable … Android が端末ごとの形に切り抜くアイコン（一番小さめ）
#   apple    … iOS のホーム画面（角丸は iOS 側が付ける）
#
# ★★以前ここは 'any': 0.92 だった。それを 0.76 に改める★★
# ---------------------------------------------------------------------
# ■ 0.92 にしていた当時の理屈（＝今回覆す判断）
#     「横長のロゴを正方形に入れると上下に余白ができて小さく見える。
#       ならば横幅を取れるだけ取って、小さく見えるのを最小限にしよう」
#     と考えて幅 92% まで広げていた。
#
# ■ その結果として起きた不具合（ご指摘・原文）
#     > アイコンをこのように縮小し、全貌が収まるようにして。
#     添付されたタブのスクリーンショットでは、ワードマークの両端
#     （左の「m」と右の「b」）が枠の縁で切れていた。
#
# ■ なぜ切れたのか（推測ではなく実測で確定させた）
#     ご提供のタブ画像から favicon の領域を切り出すと ★24x24★ で、
#     その 24x24 を候補ファイルの 24x24 縮小版と平均絶対差で比べると
#         icon-512.png  11.42  ← 最も一致
#         icon-192.png  11.79
#         favicon-48.png 59.30 ← 全く別物
#     だった。つまりブラウザがタブに使っていたのは
#     ★<link rel="icon"> の「m」マークではなく、manifest.json 経由の
#       icon-192/512（purpose:"any"）＝このワードマーク★ だった。
#     そのファイルの絵の実測は
#         icon-192  絵の幅 177/192 = 92.2%（左右の余白が 3.6% しかない）
#         icon-512  絵の幅 471/512 = 92.0%（同 3.9%）
#     で、ブラウザはアイコンを角丸に切り抜いたり 24px まで縮めたりする
#     ので、3.6% の余白では両端が縁に飲まれてしまう。
#
# ■ 0.76 にする根拠
#     左右の余白が片側 12%（24px 換算で約 2.9px）確保できる。
#     角丸の切り抜きは四隅を削るもので、この絵は上下中央の細い帯なので
#     12% の横余白があれば端が縁に触らない。
#     上下の余白が増えて絵は前より小さくなるが、
#     ★「大きく見せる」より「全貌が収まる」を優先する★ のが今回のご指示。
#
# ■ 上下に余白ができるのは避けられない（潰さないことの代償）
#     比 3.216 のロゴを幅 76% で置くと高さは 76/3.216 = 23.6%。
#     ここを埋めようと縦に伸ばすと比が壊れて「横に圧縮」の不具合に戻る。
WIDTH_RATIO = {
    'any': 0.76,
    # maskable は切り抜かれるので any よりさらに小さくする。
    # 0.74 は check_safe_zone の上限 0.40 に対して 0.3875 と紙一重だったので、
    # any を下げるのに合わせてここも余裕のある値に落とす。
    'maskable': 0.62,
    'apple': 0.70,
}

# favicon（32/48 と .ico）に使う「m」マークを、枠の何割の幅で置くか。
# こちらは比 1.000 の正方形なので幅＝高さ。
# ★0.94 から 0.86 に下げる★
#   0.94 では実測で上下左右の余白が 1px しかなく、タブ側で角丸に
#   切り抜かれると四隅が削れる。7% の余白を持たせて全貌を守る。
MARK_RATIO = 0.86


def check_safe_zone(width_ratio: float, ratio: float) -> None:
    """maskable のセーフゾーン（中央の直径80%の円）に収まるか検算する。"""
    w = width_ratio
    h = width_ratio / ratio
    dist = math.hypot(w / 2, h / 2)
    limit = 0.40  # 直径80% ＝ 半径40%
    if dist > limit:
        raise SystemExit(
            f'maskable のセーフゾーンから出ます: 対角半径 {dist:.4f} > {limit}\n'
            f'  WIDTH_RATIO["maskable"] を小さくしてください。'
        )
    print(f'  セーフゾーン検算 OK: 対角半径 {dist:.4f} <= {limit}')


def crop_mark(logo: Image.Image) -> Image.Image:
    """ロゴの左端「m」（山のマーク）だけを正方形に切り出す。

    ★なぜ favicon だけ別の絵にするのか★
      ブラウザのタブに出る favicon は 16px 前後しかない。
      比 3.216 のワードマークを 16px 幅に収めると
      高さは 16/3.216 = 約 5px。
      これは「線が1〜2本の帯」で、何が描いてあるか判別できない。

      一方このロゴの左端「m」は、山の絵を抱いた
      ★ほぼ正方形（実測 305 x 305 = 比 1.000）★ の独立したマークで、
      これ単体でもブランドとして通じる。
      小さい枠では全体を諦めて頭文字を出す方が読める、という
      アプリのアイコン設計では一般的な考え方に従う。

      ★ここでも比は一切変えない★（切り出すだけ・伸縮しない）
    """
    w, h = logo.size
    # 高さと同じ幅を左端から取る＝正方形。
    # 「m」の右端は実測 h とほぼ一致するので、これで丁度1文字ぶん。
    side = min(h, w)
    return logo.crop((0, 0, side, side))


def letterbox(logo: Image.Image, size: int, width_ratio: float,
              transparent_bg: bool = False) -> Image.Image:
    """比を保ったまま縮小し、size x size の中央に置く（余白を足す）。"""
    lw, lh = logo.size
    target_w = max(1, round(size * width_ratio))
    # ★ここが「潰さない」ための唯一の要点★
    #   高さを幅から比で計算する。幅と高さを別々に決めてはいけない。
    target_h = max(1, round(target_w * lh / lw))

    resized = logo.resize((target_w, target_h), Image.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0) if transparent_bg else BG)
    canvas.alpha_composite(resized, ((size - target_w) // 2, (size - target_h) // 2))
    return canvas


def main() -> None:
    if not os.path.exists(SRC_LOGO):
        raise SystemExit(f'元のロゴが見つかりません: {SRC_LOGO}')

    logo = Image.open(SRC_LOGO).convert('RGBA')
    lw, lh = logo.size
    ratio = lw / lh
    print(f'元のロゴ: {lw}x{lh} (横:縦 = {ratio:.3f} : 1)')

    # 透明な余白ぶんを切り落としてから使う。
    # 元画像は上下左右にわずかな透明帯があり、それを含めると
    # 「実際のロゴ」が少し小さく見えてしまう。
    bbox = logo.getbbox()
    if bbox and bbox != (0, 0, lw, lh):
        logo = logo.crop(bbox)
        lw, lh = logo.size
        ratio = lw / lh
        print(f'透明な余白を除去: {lw}x{lh} (横:縦 = {ratio:.3f} : 1)')

    check_safe_zone(WIDTH_RATIO['maskable'], ratio)

    os.makedirs(OUT_DIR, exist_ok=True)

    made = []

    # --- 通常のアイコン（purpose: any）---
    for size in (192, 512):
        img = letterbox(logo, size, WIDTH_RATIO['any'])
        path = os.path.join(OUT_DIR, f'icon-{size}.png')
        img.save(path, 'PNG', optimize=True)
        made.append(path)

    # --- Android が切り抜いて使うアイコン（purpose: maskable）---
    for size in (192, 512):
        img = letterbox(logo, size, WIDTH_RATIO['maskable'])
        path = os.path.join(OUT_DIR, f'icon-maskable-{size}.png')
        img.save(path, 'PNG', optimize=True)
        made.append(path)

    # --- iOS のホーム画面用（角丸は iOS 側が付けるので透過にしない）---
    apple = letterbox(logo, 180, WIDTH_RATIO['apple'])
    apple_path = os.path.join(OUT_DIR, 'apple-touch-icon-180.png')
    apple.save(apple_path, 'PNG', optimize=True)
    made.append(apple_path)

    # --- ブラウザのタブ用（favicon）---
    # ★ここだけワードマーク全体ではなく「m」のマークを使う★
    #   理由は crop_mark() のコメントに書いた通り、
    #   16px 幅ではワードマーク全体が「高さ5px の帯」になり読めないため。
    mark = crop_mark(logo)
    mw, mh = mark.size
    print(f'  favicon 用に「m」を切り出し: {mw}x{mh} '
          f'(横:縦 = {mw / mh:.3f} : 1)')

    # ★32/48 だけでなく 96/192 も作る★
    #   ご指摘の不具合を調べたとき、ブラウザがタブに使っていたのは
    #   ここで作る「m」マークではなく、manifest.json 経由の
    #   icon-192/512（横長ワードマーク）だった（ピクセル照合で確定）。
    #   <link rel="icon"> に 48px までしか無いと、高解像度ディスプレイで
    #   もっと大きい絵が欲しいブラウザが「候補が足りない」と判断して
    #   manifest 側へ流れてしまう。
    #   同じ絵柄の大きいサイズを並べておけば、タブには「m」マークが
    #   選ばれるようになる（manifest 側も余白を広げたので、
    #   どちらが選ばれても全貌は収まる）。
    for size in (32, 48, 96, 192):
        img = letterbox(mark, size, MARK_RATIO)
        path = os.path.join(OUT_DIR, f'favicon-{size}.png')
        img.save(path, 'PNG', optimize=True)
        made.append(path)

    ico_path = os.path.join(ROOT, 'public', 'favicon.ico')
    base = letterbox(mark, 256, MARK_RATIO).convert('RGBA')
    base.save(ico_path, 'ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    made.append(ico_path)

    print('\n作成したファイル（すべて正方形＝比 1.000）:')
    ok = True
    for path in made:
        img = Image.open(path)
        w, h = img.size
        r = w / h
        mark = '✅' if abs(r - 1.0) < 1e-9 else '❌'
        if mark == '❌':
            ok = False
        rel = os.path.relpath(path, ROOT)
        print(f'  {mark} {rel:44s} {w}x{h} ratio={r:.3f}')

    if not ok:
        sys.exit(1)


if __name__ == '__main__':
    main()
