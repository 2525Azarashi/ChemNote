#!/usr/bin/env python3
"""
英単語・英熟語 対戦プール生成器
===================================================================

ukaru-eigo.com の単語一覧ページ（HTMLの <table>）から
  ターゲット1900（6訂版）／ターゲット1400（5訂版）／LEAP 改訂版／鉄壁（改訂版）／
  システム英単語（5訂版）／速読英熟語［改訂版］／英熟語ターゲット1000（5訂版）／
  【有名熟語帳を網羅】大学入試英熟語 1,684 ／ 英検準1級 でる順パス単（5訂版）
を読み取り、対戦用の外部プール
  src/battle/data/external/english_vocab.json
と、単語帳ごとの語数レポート
  scripts/english-vocab-books.report.json
を書き出す（章タイトルは src/data/externalSubjects.ts に手で登録してある）。

■ 使い方
    python3 scripts/gen-english-vocab-pool.py --html-dir /path/to/saved/html
    python3 scripts/gen-english-vocab-pool.py --fetch      # サイトから取得して生成
  そのあと
    npm run gen:battle-pool

■ 出題形式（すべて choice4）
  ・英→日 … 見出し語を出し、意味を4択から選ぶ
  ・日→英 … 意味を出し、英単語を4択から選ぶ（単語帳のみ。熟語帳は英→日のみ）
  誤答は「同じ単語帳の中で、意味の長さが近い別の語」から決定論的に選ぶ
  （同じ乱数種 → 同じ誤答。生成の再現性のため）。
  同じ意味を持つ語（例: 「機会」が2語）は誤答から外す。

■ 出題ID
  ev:<book>:<no>:e2j  /  ev:<book>:<no>:j2e
  chapterId = book（単語帳ID）、problemId = "p<no//100>"（100語ごとの束）、
  subQuestionId = "<no>"。同じ語の英→日と日→英が1試合に両方出ないよう
  grouping は chapterId:subQuestionId で効く（battle.ts の drawQuestionIds）。
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import random
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "..", "src", "battle", "data", "external")

# 単語帳の定義: id, タイトル, URLスラッグ, 種別(word/idiom), 列の取り方
BOOKS = [
    dict(id="target1900", title="英単語ターゲット1900（6訂版）", slug="target-1900-word-list", kind="word",
         cols=dict(no=1, en=2, ja=3)),
    dict(id="target1400", title="英単語ターゲット1400（5訂版）", slug="target-1400-word-list", kind="word",
         cols=dict(no=0, en=1, ja=2)),
    dict(id="leap", title="必携英単語 LEAP 改訂版", slug="leap-modified-list", kind="word",
         cols=dict(no=0, en=1, ja=2)),
    dict(id="teppeki", title="鉄壁（改訂版）", slug="teppeki-word-list", kind="word",
         cols=dict(no=0, en=1, ja=2)),
    dict(id="systan", title="システム英単語（5訂版）", slug="systan-word-list", kind="word",
         cols=dict(no=1, en=2, ja=3)),
    dict(id="passtan_p1", title="英検準1級 でる順パス単（5訂版）", slug="passtan-p1-word-list", kind="word",
         cols=dict(no=0, en=1, ja=2)),
    dict(id="sokujuku", title="速読英熟語［改訂版］", slug="sokujuku-list", kind="idiom",
         cols=dict(no=0, en=3, ja=4)),
    dict(id="jukugo_target1000", title="英熟語ターゲット1000（5訂版）", slug="jukugo-target-1000-list", kind="idiom",
         cols=dict(no=0, en=1, ja=2)),
    dict(id="idiom1684", title="大学入試 英熟語 1,684（有名熟語帳を網羅）", slug="complete-idiom-list", kind="idiom",
         cols=dict(no=0, en=1, ja=2)),
]

UA = "Mozilla/5.0 (compatible; manatobi-vocab-builder)"


def fetch(slug: str) -> str:
    url = f"https://ukaru-eigo.com/{slug}/"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def table_rows(doc: str) -> list[list[str]]:
    m = re.search(r"<table.*?</table>", doc, re.S)
    if not m:
        return []
    rows = []
    for tr in re.findall(r"<tr.*?</tr>", m.group(0), re.S):
        cells = [html.unescape(re.sub(r"<[^>]+>", "", c)).strip()
                 for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, re.S)]
        rows.append(cells)
    return rows


# ---------------------------------------------------------------- 意味の整形
POS_TAG = re.compile(r"\[(自|他|名|形|副|前|接|助|代|間|動|自他)\]")
CIRCLED = re.compile(r"[①-⑳]")
REF = re.compile(r"[（(]\s*[⇔≒⇒=]\s*[^）)]*[）)]")  # （⇔ decrease ⇒ 223）など
ALT = re.compile(r"[〔［\[][^〕］\]]*[〕］\]]")


def clean_meaning(s: str, kind: str, book_id: str = "") -> str:
    s = s.replace("\u3000", " ")
    # 速読英熟語は複数の意味を「空白」で区切っている（例: 「続けて 立て続けに」）。
    # 日本語同士の間の空白だけを ／ に直す（英字を含む箇所は触らない）。
    if book_id == "sokujuku":
        s = re.sub(r"(?<=[\u3040-\u30ff\u4e00-\u9fff。、）」])\s+(?=[\u3040-\u30ff\u4e00-\u9fff（「～])", "／", s)
    s = POS_TAG.sub("", s)
    s = REF.sub("", s)
    s = re.sub(r"\s*[⇔≒⇒]\s*[A-Za-z][A-Za-z\- ]*(\s*\d+)?", "", s)
    s = CIRCLED.sub(" ／ ", s)
    s = re.sub(r"[；;]", "／", s)
    s = re.sub(r"\s*／\s*", "／", s)
    s = s.strip(" ／、,，")
    s = re.sub(r"／{2,}", "／", s)
    s = re.sub(r"\s{2,}", " ", s)
    return s.strip()


def short_meaning(s: str, limit: int = 34) -> str:
    """4択ボタンに載る長さに切る。区切り（／）単位で削り、最低1つは残す。"""
    parts = [p for p in s.split("／") if p]
    out: list[str] = []
    for p in parts:
        cand = "／".join(out + [p])
        if out and len(cand) > limit:
            break
        out.append(p)
        if len("／".join(out)) > limit:
            break
    text = "／".join(out) if out else s
    if len(text) > limit + 10:
        text = text[: limit + 8] + "…"
    return text


def norm_key(s: str) -> str:
    return re.sub(r"[\s／、,，・()（）～~]", "", s)


# ---------------------------------------------------------------- 誤答選び
def stable_rng(*parts: str) -> random.Random:
    h = hashlib.sha1("|".join(parts).encode("utf-8")).hexdigest()
    return random.Random(int(h[:12], 16))


def pick_distractors(entries: list[dict], idx: int, field: str, n: int, rng: random.Random) -> list[str]:
    me = entries[idx]
    my_key = norm_key(me[field])
    my_len = len(me[field])
    # 同じ意味・同じ語は避ける。長さが近いものを優先（見た目で分からないように）
    pool = [e for j, e in enumerate(entries) if j != idx and norm_key(e[field]) != my_key
            and e["en_key"] != me["en_key"]]
    pool.sort(key=lambda e: abs(len(e[field]) - my_len))
    near = pool[: max(40, n * 10)]
    rng.shuffle(near)
    out: list[str] = []
    seen = {my_key}
    for e in near:
        k = norm_key(e[field])
        if k in seen:
            continue
        seen.add(k)
        out.append(e[field])
        if len(out) == n:
            break
    return out


def time_limit(text_len: int) -> int:
    # 短い語は 10 秒、意味が長いものは少し延ばす（8〜20秒）
    return max(10, min(20, 10 + text_len // 12))


def build_book(book: dict, rows: list[list[str]]) -> tuple[list[dict], int]:
    c = book["cols"]
    entries: list[dict] = []
    skipped = 0
    for r in rows[1:]:
        if len(r) <= max(c.values()):
            skipped += 1
            continue
        no = r[c["no"]].strip()
        en = r[c["en"]].strip()
        ja_raw = r[c["ja"]].strip()
        if not re.fullmatch(r"\d+", no) or not en or not ja_raw:
            skipped += 1
            continue
        ja = clean_meaning(ja_raw, book["kind"], book["id"])
        if not ja:
            skipped += 1
            continue
        entries.append(dict(no=int(no), en=en, en_key=en.lower().strip(), ja=short_meaning(ja), ja_full=ja))

    questions: list[dict] = []
    seen_ids = set()
    for i, e in enumerate(entries):
        base_id = f"ev:{book['id']}:{e['no']}"
        if base_id in seen_ids:
            continue
        seen_ids.add(base_id)
        problem_id = f"p{e['no'] // 100}"

        # 英→日
        rng = stable_rng(book["id"], str(e["no"]), "e2j")
        wrong = pick_distractors(entries, i, "ja", 3, rng)
        if len(wrong) == 3:
            options = wrong + [e["ja"]]
            rng.shuffle(options)
            questions.append(dict(
                id=f"{base_id}:e2j", chapterId=book["id"], problemId=problem_id, subQuestionId=str(e["no"]),
                format="choice4",
                # ★prompt は短く★ 27,000 問すべてに同じ文が入るので、1文字が 27KB になる。
                prompt="意味を選べ" if book["kind"] == "word" else "熟語の意味を選べ",
                label=e["en"], options=options, answerIndex=options.index(e["ja"]),
                panelOrder=[], timeLimit=time_limit(sum(len(o) for o in options) // 4), imageUrl="",
                oneLine=f"{e['en']} ＝ {e['ja_full']}",
            ))
        # 日→英（単語帳のみ）
        if book["kind"] == "word":
            rng = stable_rng(book["id"], str(e["no"]), "j2e")
            wrong = pick_distractors(entries, i, "en", 3, rng)
            if len(wrong) == 3:
                options = wrong + [e["en"]]
                rng.shuffle(options)
                questions.append(dict(
                    id=f"{base_id}:j2e", chapterId=book["id"], problemId=problem_id, subQuestionId=str(e["no"]),
                    format="choice4",
                    prompt="英単語を選べ",
                    label=e["ja"], options=options, answerIndex=options.index(e["en"]),
                    panelOrder=[], timeLimit=time_limit(len(e["ja"])), imageUrl="",
                    oneLine=f"{e['en']} ＝ {e['ja_full']}",
                ))
    return questions, skipped


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--html-dir", help="保存済み HTML（<slug>.html）のディレクトリ")
    ap.add_argument("--fetch", action="store_true", help="サイトから取得する（--html-dir に保存もする）")
    ap.add_argument("--out", default=OUT_DIR)
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    all_q: list[dict] = []
    chapters: list[dict] = []
    report: list[str] = []
    for book in BOOKS:
        path = os.path.join(args.html_dir, f"{book['slug']}.html") if args.html_dir else None
        doc = None
        if path and os.path.exists(path) and not args.fetch:
            doc = open(path, encoding="utf-8").read()
        else:
            print(f"[fetch] {book['slug']}", file=sys.stderr)
            doc = fetch(book["slug"])
            if path:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                open(path, "w", encoding="utf-8").write(doc)
        rows = table_rows(doc)
        qs, skipped = build_book(book, rows)
        words = len({q["subQuestionId"] for q in qs})
        report.append(f"{book['id']:<20} {book['title']:<28} 語数 {words:>5} / 出題 {len(qs):>5}  (読み飛ばし {skipped})")
        all_q.extend(qs)
        chapters.append(dict(id=book["id"], title=f"{book['title']}（{words}語）", kind=book["kind"], count=words,
                             source=f"https://ukaru-eigo.com/{book['slug']}/"))

    all_q.sort(key=lambda q: q["id"])
    out = dict(
        subject="english_vocab",
        label="英単語・英熟語",
        source="ukaru-eigo.com 単語一覧（ターゲット1900/1400・LEAP・鉄壁・シス単・パス単準1級・速読英熟語・熟語ターゲット1000・英熟語1684）",
        questions=all_q,
    )
    with open(os.path.join(args.out, "english_vocab.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    # ★external/ に .json を増やさない★（gen-battle-pool は external/*.json を全部プールとして読む）
    with open(os.path.join(HERE, "english-vocab-books.report.json"), "w", encoding="utf-8") as f:
        json.dump(chapters, f, ensure_ascii=False, indent=1)
    print("\n".join(report))
    print(f"合計 出題 {len(all_q)} 問")
    return 0


if __name__ == "__main__":
    sys.exit(main())
