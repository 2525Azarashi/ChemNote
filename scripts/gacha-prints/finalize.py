#!/usr/bin/env python3
"""
ガチャ大当たりプリントの仕上げ（build-prints.mjs の後に実行）

  python3 scripts/gacha-prints/finalize.py [.tmpwork/prints-manifest.json]

  1) public/prints/*.pdf を圧縮（garbage collect + deflate。見た目は変わらない）
  2) 1ページ目を縮小して public/prints/thumbs/<id>.webp を作る
  3) src/data/gachaPrints.generated.ts を書き出す（★手で直さない★ このスクリプトで再生成）

必要: PyMuPDF (pip install pymupdf) と Pillow
"""
import json
import os
import sys
import io

import pymupdf
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MANIFEST = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '.tmpwork', 'prints-manifest.json')
PUBLIC = os.path.join(ROOT, 'public')
THUMBS = os.path.join(PUBLIC, 'prints', 'thumbs')
OUT_TS = os.path.join(ROOT, 'src', 'data', 'gachaPrints.generated.ts')
THUMB_WIDTH = 360

os.makedirs(THUMBS, exist_ok=True)
with open(MANIFEST, encoding='utf-8') as f:
    manifest = json.load(f)

entries = []
for item in manifest:
    pdf_path = os.path.join(PUBLIC, item['file'].lstrip('/'))
    doc = pymupdf.open(pdf_path)
    pages = doc.page_count
    # 圧縮（一時ファイルに書いて小さくなった時だけ置き換え）
    tmp = pdf_path + '.tmp'
    doc.save(tmp, garbage=4, deflate=True, deflate_fonts=True, clean=True)
    # サムネイル
    page = doc[0]
    zoom = THUMB_WIDTH / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    img = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
    img.save(os.path.join(THUMBS, item['id'] + '.webp'), 'WEBP', quality=78, method=6)
    doc.close()
    if os.path.getsize(tmp) < os.path.getsize(pdf_path):
        os.replace(tmp, pdf_path)
    else:
        os.remove(tmp)
    size = os.path.getsize(pdf_path)
    entries.append({
        'id': item['id'],
        'label': item['label'],
        'subject': item['subject'],
        'category': item['category'],
        'file': item['file'],
        'thumb': item['thumb'],
        'pages': pages,
        'kb': round(size / 1024),
    })
    print(f"✓ {item['id']}: {pages}p {round(size / 1024)}KB")

lines = [
    '// ★自動生成ファイル★ 手で直さない。',
    '// 再生成: npx tsx scripts/gacha-prints/dump-data.mts .tmpwork/prints-data.json',
    '//         node scripts/gacha-prints/build-prints.mjs .tmpwork/prints-data.json',
    '//         python3 scripts/gacha-prints/finalize.py',
    '',
    "export type GachaPrintCategory = '出題傾向' | '演習プリント' | '単語テスト';",
    '',
    'export interface GachaPrintDef {',
    '  /** ガチャのアイテム id（ITEMS にもこの id で入る） */',
    '  id: string;',
    '  label: string;',
    '  subject: string;',
    '  category: GachaPrintCategory;',
    '  /** public/ からの PDF パス */',
    '  file: string;',
    '  /** 1ページ目のサムネイル（webp） */',
    '  thumb: string;',
    '  pages: number;',
    '  kb: number;',
    '}',
    '',
    'export const GACHA_PRINTS: readonly GachaPrintDef[] = ' + json.dumps(entries, ensure_ascii=False, indent=2) + ';',
    '',
]
with open(OUT_TS, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print(f'done: {len(entries)} prints -> {os.path.relpath(OUT_TS, ROOT)}')
