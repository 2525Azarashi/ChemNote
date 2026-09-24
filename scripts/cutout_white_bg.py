"""
白背景で生成したとびら君の画像から背景を抜いて、余白を詰めた透過WebPを作る。
外周からつながっている「ほぼ白」の領域だけを背景とみなす(キャラ内部の白は残す)。
"""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

def cutout(src: str, dst: str, thresh: int = 232, pad: int = 24) -> None:
    im = Image.open(src).convert('RGB')
    rgb = np.asarray(im).astype(np.int16)
    h, w, _ = rgb.shape
    near_white = (rgb.min(axis=2) >= thresh)
    bg = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if near_white[y, x] and not bg[y, x]:
                bg[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if near_white[y, x] and not bg[y, x]:
                bg[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
            if 0 <= ny < h and 0 <= nx < w and near_white[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True; q.append((ny, nx))
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    # 輪郭を1pxだけ内側に寄せてから少しぼかし、白いフチを消す
    a_img = Image.fromarray(alpha).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    a = np.asarray(a_img).astype(np.float32) / 255.0
    # 半透明部分は白と混ざっているので差し引く
    a_safe = np.clip(a, 0.02, 1.0)[..., None]
    un = np.clip((rgb.astype(np.float32) - (1 - a_safe) * 255.0) / a_safe, 0, 255)
    un[a < 0.01] = 0
    out = np.dstack([un, a[..., None] * 255]).astype(np.uint8)
    ys, xs = np.where(a > 0.02)
    y0, y1 = max(0, ys.min() - pad), min(h, ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(w, xs.max() + pad)
    res = Image.fromarray(out[y0:y1, x0:x1], 'RGBA')
    res.save(dst, 'WEBP', quality=88, method=6)
    print(dst, res.size)

if __name__ == '__main__':
    cutout(sys.argv[1], sys.argv[2])
