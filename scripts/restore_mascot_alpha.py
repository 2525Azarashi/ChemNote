"""
アップスケール後(JPEG・白背景)のとびら君に、元PNGの透過を4倍拡大して戻す。
半透明の縁は白と混ざっているので、白を差し引いて元の色に戻す(un-premultiply)。
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

def restore(orig_path: str, up_path: str, out_path: str) -> None:
    orig = Image.open(orig_path).convert('RGBA')
    up = Image.open(up_path).convert('RGB')
    W, H = up.size
    # 元の透過を高品質リサイズして少しだけ滑らかに
    alpha = orig.split()[3].resize((W, H), Image.LANCZOS)
    # 元画像由来の白いフチを削るため、輪郭を2px内側に寄せてから滑らかに
    alpha = alpha.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(0.8))
    a = np.asarray(alpha).astype(np.float32) / 255.0
    rgb = np.asarray(up).astype(np.float32)
    # 白背景と合成された色 c = a*orig + (1-a)*255 → orig = (c - (1-a)*255)/a
    a_safe = np.clip(a, 0.02, 1.0)[..., None]
    un = (rgb - (1.0 - a_safe) * 255.0) / a_safe
    un = np.clip(un, 0, 255)
    # 完全透明の部分の色は不要なので0に
    un[a < 0.01] = 0
    out = np.dstack([un, a[..., None] * 255.0]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(out_path, optimize=True)
    print(out_path, (W, H))

if __name__ == '__main__':
    restore(*sys.argv[1:4])
