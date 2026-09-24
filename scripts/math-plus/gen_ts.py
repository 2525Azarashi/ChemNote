# -*- coding: utf-8 -*-
"""検算済み問題 → TypeScript データファイル生成"""
import sys, json, collections
import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import integral_plus, vector_plus, probability_plus, integer_plus, ia_basic, ia_full, ia_drill, ia_drill_geo, ia_drill_trig, ia_enrich  # noqa: F401 (登録の副作用)
from harness import PROBLEMS

OUT_PLUS = os.path.join(ROOT, 'src/data/mathPlusProblems.ts')
OUT_IA   = os.path.join(ROOT, 'src/data/mathIAProblems.ts')


def ts_str(s):
    return json.dumps(s, ensure_ascii=False)


def ts_tpl(s):
    return '`' + s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${') + '`'


def emit(problems, header, const_prefix, map_name):
    by = collections.OrderedDict()
    for p in problems:
        by.setdefault(p['chapter'], []).append(p)
    out = [header, "import { sq } from './mathProblemKit';",
           "import type { MathProblem } from './mathProblemKit';", ""]
    names = {}
    for ch, ps in by.items():
        name = f"{const_prefix}_{ch}"
        names[ch] = name
        out.append(f"// ---- {ch} ----")
        out.append(f"export const {name}: MathProblem[] = [")
        for p in ps:
            out.append("  {")
            out.append(f"    id: {ts_str(p['id'])},")
            out.append(f"    category: {ts_str(p['category'])},")
            out.append(f"    text: {ts_tpl(p['text'])},")
            out.append("    subQuestions: [")
            for s in p['subs']:
                acc = [a for a in s['accepted'] if a != s['answer']]
                out.append(f"      sq({ts_str(s['id'])}, {ts_str(s['label'])}, {ts_str(s['answer'])}, {json.dumps(acc, ensure_ascii=False)}),")
            out.append("    ],")
            out.append(f"    explanation: {ts_tpl(p['explanation'])},")
            if p.get('image'):
                out.append(f"    imageUrl: {ts_str(p['image'])},")
                if p.get('imageCaption'):
                    out.append(f"    imageCaption: {ts_str(p['imageCaption'])},")
            out.append("    surroundingKnowledge: [],")
            out.append("    deepDiveTopics: [],")
            out.append("  },")
        out.append("];")
        out.append("")
    out.append("/** 章ID → 問題配列 */")
    out.append(f"export const {map_name}: Record<string, MathProblem[]> = {{")
    for ch, name in names.items():
        out.append(f"  {ch}: {name},")
    out.append("};")
    out.append("")
    return "\n".join(out)


plus = [p for p in PROBLEMS if not p['chapter'].startswith('ia')]
ia = [p for p in PROBLEMS if p['chapter'].startswith('ia')]

HDR_PLUS = """/**
 * ===================================================================
 * 数学「入試レベル強化」問題（全 33 単元 × 2 大問 = 66 大問）
 * ===================================================================
 *
 * ■ 位置づけ
 *   既存の 65 大問（各単元 1〜3 大問）に加えて、各単元へ入試標準〜やや難の
 *   大問を 2 つずつ追加する。mathData.ts の MATH_PROBLEMS で既存問題の
 *   後ろに spread して注入する（既存問題・ID・採点ロジックは一切変更しない）。
 *
 * ■ 品質保証
 *   このファイルは math-plus/gen_ts.py が自動生成する。
 *   全サブ設問の正答は sympy / Python 全列挙で機械検算済み
 *   （検算に通らない問題はここに出力されない）。
 *   手で編集せず、math-plus/*.py を直して再生成すること。
 *
 * ■ 表記ルールは既存ファイルと同じ（^ / / √( ) / log|x| / 積分定数 C）。
 */
"""
HDR_IA = """/**
 * ===================================================================
 * 数I・A 教科書全範囲 網羅（7 章 32 単元・単元別演習 ＋ マナトビ基本演習 Step 1〜86 ＋ 単元充実）
 * ===================================================================
 *
 * ■ 位置づけ
 *   基礎パート（math_ia）。1章 数と式 / 2章 2次関数 / 3章 図形と計量 / 4章 データの分析 /
 *   5章 場合の数と確率 / 6章 整数の性質 / 7章 図形の性質。
 *   「マナトビ基本演習 Step N」は基本事項を1つずつ確認する独自の演習（ia_drill*.py）。
 *   題名・問題文の言い回しは drill_naming.py で独自のものに統一している（数値・答えはそのまま）。
 *
 * ■ 品質保証
 *   math-plus/gen_ts.py が自動生成。全正答は sympy / Python で機械検算済み。
 *   手で編集せず、math-plus/ia_*.py を直して再生成すること。
 */
"""
open(OUT_PLUS, 'w').write(emit(plus, HDR_PLUS, 'plus', 'MATH_PLUS'))
open(OUT_IA, 'w').write(emit(ia, HDR_IA, 'ia', 'MATH_IA'))
print('plus problems', len(plus), 'subs', sum(len(p['subs']) for p in plus))
print('ia problems', len(ia), 'subs', sum(len(p['subs']) for p in ia))
ids = [s['id'] for p in PROBLEMS for s in p['subs']] + [p['id'] for p in PROBLEMS]
assert len(ids) == len(set(ids)), 'dup ids'
print('ids unique', len(ids))
