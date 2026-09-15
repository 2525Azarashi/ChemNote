#!/usr/bin/env python3
"""
マナトビ英単語・英熟語 対戦プール生成器（独自編成版）
===================================================================

■ 何を作るか
  市販単語帳の公開一覧（複数冊）を「材料」として読み、
    ・全冊を合算して重複を除いた語彙の集合を作り
    ・語の重要度を独自に点数化して 4 段階（共通テスト基礎〜最難関）に振り分け
    ・訳語は複数冊に共通する核の意味だけを短い定型（～を…する）に正規化
  した「マナトビ独自の語彙リスト」を対戦プール（4択）として書き出す。

  ★特定の単語帳の「語の選択」「並び」「訳語の文言」は再現しない★
    - 語の選択  … 全冊の合算集合から重要度で選ぶ（1冊の目次を写さない）
    - 並び      … レベル → 使用頻度順（wordfreq）で独自に決める
    - 訳語      … 冊子横断の共通義を抽出し、定型に書き直す
    - 出典表記  … データにも画面にも単語帳名を残さない

■ 重要度の点数（独自）
    score = 0.55 × 収録冊数の割合（何冊に載っているか / 単語帳の冊数）
          + 0.45 × 英語の一般使用頻度（wordfreq の Zipf 値を 2.5〜6.0 で正規化）
  レベル分け（単語）：
    lv1 共通テスト 基礎   … score ≥ 0.62
    lv2 共通テスト 標準   … 0.46 ≤ score < 0.62
    lv3 二次・私大 標準   … 0.32 ≤ score < 0.46
    lv4 難関・最難関      … score < 0.32
  熟語は冊数と頻度から同じ式で 3 段階（ilv1〜ilv3）。

■ 使い方
    python3 scripts/gen-english-vocab-pool.py --fetch --html-dir ./vocab-html
    python3 scripts/gen-english-vocab-pool.py --html-dir ./vocab-html   # 保存済み HTML から
    npm run gen:battle-pool
  依存: pip install wordfreq
"""
from __future__ import annotations

import argparse
import collections
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

# 材料（公開一覧の URL スラッグと列位置）。出力には一切現れない。
WORD_SOURCES = [
    dict(slug="target-1900-word-list", en=2, ja=3),
    dict(slug="target-1400-word-list", en=1, ja=2),
    dict(slug="leap-modified-list", en=1, ja=2),
    dict(slug="teppeki-word-list", en=1, ja=2),
    dict(slug="systan-word-list", en=2, ja=3),
    dict(slug="passtan-p1-word-list", en=1, ja=2),
]
IDIOM_SOURCES = [
    dict(slug="sokujuku-list", en=3, ja=4),
    dict(slug="jukugo-target-1000-list", en=1, ja=2),
    dict(slug="complete-idiom-list", en=1, ja=2),
]
UA = "Mozilla/5.0 (compatible; manatobi-vocab-builder)"

WORD_LEVELS = [
    ("lv1", "共通テスト 基礎", 0.62),
    ("lv2", "共通テスト 標準", 0.46),
    ("lv3", "二次・私大 標準", 0.32),
    ("lv4", "難関・最難関", -1.0),
]
IDIOM_LEVELS = [
    ("ilv1", "熟語 基礎", 0.60),
    ("ilv2", "熟語 標準", 0.40),
    ("ilv3", "熟語 発展", -1.0),
]
UNIT_SIZE = 100


def fetch(slug: str) -> str:
    req = urllib.request.Request(f"https://ukaru-eigo.com/{slug}/", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def table_rows(doc: str) -> list[list[str]]:
    m = re.search(r"<table.*?</table>", doc, re.S)
    if not m:
        return []
    out = []
    for tr in re.findall(r"<tr.*?</tr>", m.group(0), re.S):
        out.append([html.unescape(re.sub(r"<[^>]+>", "", c)).strip()
                    for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, re.S)])
    return out


def load_doc(slug: str, html_dir: str | None, do_fetch: bool) -> str:
    path = os.path.join(html_dir, f"{slug}.html") if html_dir else None
    if path and os.path.exists(path) and not do_fetch:
        return open(path, encoding="utf-8").read()
    print(f"[fetch] {slug}", file=sys.stderr)
    doc = fetch(slug)
    if path:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, "w", encoding="utf-8").write(doc)
    return doc


# ---------------------------------------------------------------- 訳語の正規化
POS_TAG = re.compile(r"\[(自|他|名|形|副|前|接|助|代|間|動|自他)\]")
PAREN_NOTE = re.compile(r"[（(][^（）()]*[）)]")     # （人）（to do）など補足
BRACKET = re.compile(r"[〔［\[【][^〕］\]】]*[〕］\]】]")
REF = re.compile(r"[⇔≒⇒=]\s*[A-Za-z][A-Za-z\- ]*(\s*\d+)?")


def sense_atoms(raw: str) -> list[str]:
    """1冊の訳語欄を「意味の粒」に分ける。"""
    s = raw.replace("\u3000", " ")
    s = POS_TAG.sub("／", s)
    s = REF.sub("", s)
    s = BRACKET.sub("", s)
    s = re.sub(r"[①-⑳]", "／", s)
    s = PAREN_NOTE.sub("", s)
    s = re.sub(r"[；;／/、,，]", "／", s)
    # 日本語同士の空白区切り（速読英熟語の書式）も区切りとして扱う
    s = re.sub(r"(?<=[\u3040-\u30ff\u4e00-\u9fff])\s+(?=[\u3040-\u30ff\u4e00-\u9fff～])", "／", s)
    atoms = []
    for a in s.split("／"):
        a = a.strip(" 　。.…・")
        a = re.sub(r"\s+", " ", a)
        if not a or len(a) > 22:
            continue
        # 目的語マーカーを定型化：「を打つ」「に当たる」→「～を打つ」「～に当たる」
        a = re.sub(r"^(?:～|〜|…|\.\.\.)?\s*(を|に|と|が|へ|の)(?=[\u3040-\u9fff])", r"～\1", a)
        a = a.replace("〜", "～")
        atoms.append(a)
    return atoms


def atom_key(a: str) -> str:
    return re.sub(r"[～\s（）()・、]", "", a)


def merged_gloss(glosses: list[str], max_senses: int) -> tuple[str, str]:
    """
    複数冊の訳語から「共通の核」を抜き出す。
    返り値: (4択ボタン用の短い訳, 解答用のやや長い訳)
    """
    counter: collections.Counter[str] = collections.Counter()
    first_seen: dict[str, str] = {}
    order: dict[str, int] = {}
    for g in glosses:
        seen_here = set()
        for i, a in enumerate(sense_atoms(g)):
            k = atom_key(a)
            if not k or k in seen_here:
                continue
            seen_here.add(k)
            counter[k] += 1
            first_seen.setdefault(k, a)
            order[k] = min(order.get(k, 99), i)
    if not counter:
        return "", ""
    # 多くの冊子で一致 → 先頭に出る意味 → 短いもの、の順
    ranked = sorted(counter, key=lambda k: (-counter[k], order[k], len(first_seen[k])))
    senses = [first_seen[k] for k in ranked]
    short = senses[0]
    if len(senses) > 1 and len(short) + len(senses[1]) + 1 <= 16:
        short = f"{short}／{senses[1]}"
    long = "／".join(senses[:max_senses])
    return short, long


def category_of(gloss: str) -> str:
    """誤答を同じ品詞っぽいものから選ぶための粗い分類。"""
    g = gloss.split("／")[0]
    if re.search(r"(する|せる|れる|う|く|ぐ|す|つ|ぬ|ぶ|む|る)$", g) and not re.search(r"(こと|もの|ところ)$", g):
        return "verb"
    if re.search(r"(な|い|的|の)$", g):
        return "adj"
    if re.search(r"(に|く|て|ながら|ほど)$", g):
        return "adv"
    return "noun"


# ---------------------------------------------------------------- 重要度
def zipf(word: str) -> float:
    try:
        from wordfreq import zipf_frequency
    except ImportError:
        print("wordfreq が必要です: pip install wordfreq", file=sys.stderr)
        sys.exit(1)
    w = word.lower().strip()
    # 熟語は構成語の最小頻度（希少語を含むほど難しい）
    parts = [p for p in re.split(r"[^a-z']+", w) if p and p not in {"a", "an", "the", "to", "of", "in", "on", "at", "for", "with", "by", "from", "one's", "oneself", "sb", "sth", "do", "doing"}]
    if not parts:
        return zipf_frequency(w, "en")
    vals = [zipf_frequency(p, "en") for p in parts]
    return min(vals) if len(parts) > 1 else vals[0]


def importance(book_count: int, book_total: int, z: float) -> float:
    """
    収録冊数（受験での定番度）と一般使用頻度を合わせた独自の重要度。
    頻度が非常に高い語（Zipf ≥ 5.0 = 100万語に10回以上）は、収録冊数が少なくても
    「基礎語」として扱う（易しい語は多くの単語帳が最初から省くため、冊数だけ見ると
    かえって難語に見えてしまう）。
    """
    zn = max(0.0, min(1.0, (z - 2.5) / 3.5))
    base = 0.55 * (book_count / book_total) + 0.45 * zn
    if z >= 5.0:
        base = max(base, 0.62 + (z - 5.0) * 0.1)
    elif z >= 4.6:
        base = max(base, 0.46 + (z - 4.6) * 0.4)
    return base


def level_of(score: float, levels) -> tuple[str, str]:
    for lid, title, th in levels:
        if score >= th:
            return lid, title
    return levels[-1][0], levels[-1][1]


# ---------------------------------------------------------------- 出題の組み立て
def stable_rng(*parts: str) -> random.Random:
    h = hashlib.sha1("|".join(parts).encode("utf-8")).hexdigest()
    return random.Random(int(h[:12], 16))


def pick_distractors(pool: list[dict], me: dict, field: str, n: int, rng: random.Random) -> list[str]:
    my_key = atom_key(me[field])
    cands = [e for e in pool if e is not me and atom_key(e[field]) != my_key and e["en"] != me["en"]]
    # 同じ分類（品詞）を優先し、長さの近いものから取る
    same = [e for e in cands if e["cat"] == me["cat"]]
    base = same if len(same) >= n * 6 else cands
    base.sort(key=lambda e: abs(len(e[field]) - len(me[field])))
    near = base[: max(40, n * 12)]
    rng.shuffle(near)
    out, seen = [], {my_key}
    for e in near:
        k = atom_key(e[field])
        if k in seen:
            continue
        seen.add(k)
        out.append(e[field])
        if len(out) == n:
            break
    return out


def time_limit(n_chars: int) -> int:
    return max(10, min(20, 10 + n_chars // 12))


# 熟語の見出しに混ざる「型の説明」（比較級／名詞／wh- など）。4択で問う語句ではないので外す。
PATTERN_WORDS = re.compile(r"(比較級|名詞|動詞|形容詞|副詞|感情を表す|wh-|S\+V|S V|V\+|do＋|＋)")


def canonical_idiom(en: str) -> str:
    """表示用：目的語の印を ～ に統一し、余分な括弧・別表記を落とす。"""
    e = en.replace("〜", "～").replace("…", "～").replace("...", "～")
    e = re.sub(r"[〔［\[][^〕］\]]*[〕］\]]", "", e)          # 〔with〕 などの別表記
    e = re.sub(r"\s*\(\s*～\s*\)", " ～", e)                 # (～) → ～
    e = re.sub(r"\((that|of ～|to do|on ～|～)\)", "", e)      # (that) 等の省略可能語は落とす
    e = re.sub(r"\bsb\b|\bsomebody\b|\bsomeone\b", "人", e)
    e = re.sub(r"\bsth\b|\bsomething\b", "物", e)
    e = re.sub(r"\s*/\s*", "/", e)
    e = re.sub(r"\s+", " ", e).strip(" ,")
    e = re.sub(r"(～\s*)+$", "～", e)
    return e


def idiom_key(en: str) -> str:
    """同一視のキー：～・括弧・別表記・大文字小文字を無視。型の説明は空を返して除外。"""
    if PATTERN_WORDS.search(en):
        return ""
    k = canonical_idiom(en).lower()
    k = re.sub(r"[～()（）,\.…]", " ", k)
    k = re.sub(r"\s+", " ", k).strip()
    if not re.search(r"[a-z]", k) or len(k.split()) < 2 and not re.search(r"[a-z]{3,}", k):
        return ""
    return k


def is_phrase(en: str) -> bool:
    """2語以上（熟語・句）か。単語帳側に混ざる句表現を熟語側へ回すために使う。"""
    core = re.sub(r"\((.*?)\)", "", en).strip()
    return " " in core or "～" in core or "…" in core


def build_entries(sources, html_dir, do_fetch, levels, max_senses, want_phrase: bool,
                  extra_rows: list[tuple[str, str]] | None = None,
                  spill: list[tuple[str, str]] | None = None) -> list[dict]:
    glosses: dict[str, list[tuple[str, str]]] = collections.defaultdict(list)
    raw_rows: list[tuple[str, str]] = list(extra_rows or [])
    for src in sources:
        rows = table_rows(load_doc(src["slug"], html_dir, do_fetch))
        for r in rows[1:]:
            if len(r) <= max(src["en"], src["ja"]):
                continue
            raw_rows.append((r[src["en"]], r[src["ja"]]))
    for en_raw, ja_raw in raw_rows:
        en = re.sub(r"\s+", " ", en_raw.strip())
        ja = ja_raw.strip()
        if not en or not ja or not re.search(r"[A-Za-z]", en):
            continue
        if is_phrase(en) != want_phrase:
            if spill is not None:
                spill.append((en, ja))
            continue
        key = en.lower() if not want_phrase else idiom_key(en)
        if want_phrase and not key:
            continue
        glosses[key].append((canonical_idiom(en) if want_phrase else en, ja))
    total = len(sources)
    entries = []
    for key, pairs in glosses.items():
        gl = [ja for _, ja in pairs]
        # 表示用の綴りは「最も多い表記」（A/B の大文字などを保つ）
        en = collections.Counter(e for e, _ in pairs).most_common(1)[0][0]
        short, long = merged_gloss(gl, max_senses)
        if not short:
            continue
        z = zipf(en)
        score = importance(len(gl), total, z)
        lid, ltitle = level_of(score, levels)
        entries.append(dict(en=en, ja=short, ja_full=long, score=score, z=z, books=len(gl),
                            level=lid, level_title=ltitle, cat=category_of(short)))
    # 並び：レベル → 頻度の高い順（独自順）
    entries.sort(key=lambda e: ([l[0] for l in levels].index(e["level"]), -e["z"], e["en"]))
    return entries


def questions_for(entries: list[dict], prefix: str, two_way: bool) -> list[dict]:
    by_level: dict[str, list[dict]] = collections.defaultdict(list)
    for e in entries:
        by_level[e["level"]].append(e)
    out = []
    for lid, lst in by_level.items():
        for idx, e in enumerate(lst):
            no = idx + 1
            e["no"] = no
            unit = f"u{(idx // UNIT_SIZE) + 1}"
            base = f"{prefix}:{lid}:{no}"
            prompt_e2j = "意味を選べ" if two_way else "熟語の意味を選べ"
            rng = stable_rng(base, "e2j")
            wrong = pick_distractors(lst, e, "ja", 3, rng)
            if len(wrong) == 3:
                opts = wrong + [e["ja"]]
                rng.shuffle(opts)
                out.append(dict(id=f"{base}:e2j", chapterId=lid, problemId=unit, subQuestionId=str(no),
                                format="choice4", prompt=prompt_e2j, label=e["en"], options=opts,
                                answerIndex=opts.index(e["ja"]), panelOrder=[],
                                timeLimit=time_limit(sum(len(o) for o in opts) // 4), imageUrl="",
                                oneLine=f"{e['en']} ＝ {e['ja_full']}"))
            if two_way:
                rng = stable_rng(base, "j2e")
                wrong = pick_distractors(lst, e, "en", 3, rng)
                if len(wrong) == 3:
                    opts = wrong + [e["en"]]
                    rng.shuffle(opts)
                    out.append(dict(id=f"{base}:j2e", chapterId=lid, problemId=unit, subQuestionId=str(no),
                                    format="choice4", prompt="英単語を選べ", label=e["ja"], options=opts,
                                    answerIndex=opts.index(e["en"]), panelOrder=[],
                                    timeLimit=time_limit(len(e["ja"])), imageUrl="",
                                    oneLine=f"{e['en']} ＝ {e['ja_full']}"))
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--html-dir")
    ap.add_argument("--fetch", action="store_true")
    ap.add_argument("--out", default=OUT_DIR)
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    # 単語帳に混ざる句表現（例: "make it"）は熟語側へ回す（spill）。
    spill: list[tuple[str, str]] = []
    words = build_entries(WORD_SOURCES, args.html_dir, args.fetch, WORD_LEVELS, 3, want_phrase=False, spill=spill)
    idioms = build_entries(IDIOM_SOURCES, args.html_dir, args.fetch, IDIOM_LEVELS, 2, want_phrase=True, extra_rows=spill)
    qs = questions_for(words, "ev", True) + questions_for(idioms, "ei", False)
    qs.sort(key=lambda q: q["id"])

    json.dump(dict(subject="english_vocab", label="英単語・英熟語",
                   source="マナトビ独自編成（複数の公開語彙リストを合算し、重要度で再編）",
                   questions=qs),
              open(os.path.join(args.out, "english_vocab.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    # レベル別の語彙表（レビュー用。単語帳名は含まない）
    report = dict(levels=[])
    for lid, title, _ in WORD_LEVELS + IDIOM_LEVELS:
        lst = [e for e in (words + idioms) if e["level"] == lid]
        report["levels"].append(dict(id=lid, title=title, count=len(lst),
                                     sample=[f"{e['en']} = {e['ja']}" for e in lst[:12]]))
    json.dump(report, open(os.path.join(HERE, "english-vocab-levels.report.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    with open(os.path.join(HERE, "english-vocab-list.tsv"), "w", encoding="utf-8") as f:
        f.write("level\tno\tword\tgloss_short\tgloss_full\tscore\n")
        for e in words + idioms:
            f.write(f"{e['level']}\t{e['no']}\t{e['en']}\t{e['ja']}\t{e['ja_full']}\t{e['score']:.3f}\n")

    for lv in report["levels"]:
        print(f"{lv['id']:<5} {lv['title']:<12} {lv['count']:>5} 語")
    print(f"単語 {len(words)} 語 / 熟語 {len(idioms)} 語 / 出題 {len(qs)} 問")
    return 0


if __name__ == "__main__":
    sys.exit(main())
