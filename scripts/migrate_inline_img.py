"""
インライン <img> を imageUrl / imageCaption フィールドへ移行するスクリプト。

背景:
  問題データの "text" に生の <img ...> を埋め込んでいたが、
  出力側の sanitizeInlineHtml() が <img> を許可していないため
  描画時にタグが落ち、図が表示されなかった（1章②A など）。

方針:
  図は QuestionFigure コンポーネント経由で描画するのが正しい設計なので、
  text 内の <img> を取り除き、同じ問題オブジェクトに
  "imageUrl" / "imageCaption" を追加する。
"""

import re
import sys

PATH = 'src/data/chemistryData.ts'

# JSON 文字列中にエスケープされた <img src=\"...\" alt=\"...\" ... />
IMG = re.compile(
    r'(?:\\n)*<img\s+src=\\"(?P<src>[^"\\]+)\\"\s+alt=\\"(?P<alt>[^"\\]+)\\"[^>]*?/>(?:\\n)*'
)


def main() -> int:
    with open(PATH, encoding='utf-8') as f:
        lines = f.read().split('\n')

    out: list[str] = []
    migrated = 0

    for line in lines:
        m = IMG.search(line)
        if m and '"text"' in line:
            src = m.group('src')
            alt = m.group('alt')
            # <img> を取り除き、前後の余分な改行エスケープを 1 つの段落区切りに整える
            new_line = IMG.sub(r'\\n\\n', line, count=1)
            indent = re.match(r'\s*', line).group(0)
            out.append(new_line)
            out.append(f'{indent}"imageUrl": "{src}",')
            out.append(f'{indent}"imageCaption": "{alt}",')
            migrated += 1
        else:
            out.append(line)

    print(f'migrated: {migrated}')
    if migrated:
        with open(PATH, 'w', encoding='utf-8') as f:
            f.write('\n'.join(out))
    return 0


if __name__ == '__main__':
    sys.exit(main())
