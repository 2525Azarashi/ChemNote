// このファイルは tools/build_app_pack.py が自動生成します。手で直さないでください。
// 原典: 三重県後期選抜入試対策理科最終プリント

import type React from 'react'
import { useMemo, useState } from 'react'
import { RIKA_ITEMS, type RikaItem } from './rikaData'
import { RIKA_CHAPTERS } from './chapters.rika.generated'
import { judgeChoice, judgeWord, optionAt, splitBlank } from './rikaLogic'
import { addWrong, clearWrong, wrongIds } from './rikaReview'

const FIELDS = ['\u7269\u7406', '\u5316\u5b66', '\u751f\u7269', '\u5730\u5b66'] as const

function Style() {
  return (
    <style>{`
.rika-wrap{max-width:720px;margin:0 auto;padding:16px;
  font-family:system-ui,-apple-system,'Hiragino Sans','Noto Sans JP',sans-serif;
  line-height:1.8;color:#1a1a1a}
.rika-h{font-size:18px;font-weight:700;margin:0 0 12px}
.rika-row{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.rika-chip{border:1px solid #c8ced6;background:#fff;border-radius:999px;
  padding:6px 14px;font-size:14px;cursor:pointer}
.rika-chip[data-on="1"]{background:#1b5fbe;border-color:#1b5fbe;color:#fff}
.rika-btn{border:0;background:#1b5fbe;color:#fff;border-radius:8px;
  padding:10px 20px;font-size:15px;font-weight:700;cursor:pointer}
.rika-btn[disabled]{background:#9aa5b1;cursor:default}
.rika-btn2{border:1px solid #1b5fbe;background:#fff;color:#1b5fbe;
  border-radius:8px;padding:10px 20px;font-size:15px;cursor:pointer}
.rika-card{border:1px solid #dfe3e8;border-radius:12px;padding:16px;
  margin:12px 0;background:#fff}
.rika-ctx{font-size:12px;color:#5b6672;margin-bottom:6px}
.rika-q{font-size:16px;font-weight:600;margin-bottom:12px;
  white-space:pre-wrap}
.rika-bl{display:inline-block;min-width:76px;border-bottom:2px solid #1b5fbe;
  color:#1b5fbe;text-align:center}
.rika-opt{display:block;width:100%;text-align:left;border:1px solid #c8ced6;
  background:#fff;border-radius:8px;padding:12px 14px;margin:6px 0;
  font-size:15px;cursor:pointer}
.rika-opt:hover{background:#f2f6fc}
.rika-in{width:100%;box-sizing:border-box;border:1px solid #c8ced6;
  border-radius:8px;padding:12px;font-size:16px}
.rika-judge{margin-top:12px;padding:12px;border-radius:8px;font-size:15px}
.rika-ok{background:#e8f5ec;border:1px solid #57b374}
.rika-ng{background:#fdecec;border:1px solid #d9534f}
.rika-src{display:block;font-size:12px;color:#5b6672;margin-top:6px}
.rika-exam{display:inline-block;background:#e7f0ff;color:#12457f;
  border:1px solid #9dbdea;border-radius:6px;padding:1px 8px;
  font-size:12px;font-weight:700;margin-right:4px}
.rika-body{white-space:pre-wrap;font-size:15px;margin:4px 0}
.rika-ans{background:#f5f7fa;border-radius:8px;padding:12px;margin-top:8px;
  font-size:15px}
.rika-note{font-size:13px;color:#5b6672}
.rika-score{font-size:22px;font-weight:700;margin:12px 0}
    `}</style>
  )
}

type Log = { item: RikaItem; ok: boolean }

/**
 * 練習画面。
 * 出す条件を選ぶ → 1問ずつ解く → 結果 → まちがえた分だけやり直す。
 */
export default function RikaPractice() {
  const [fields, setFields] = useState<readonly string[]>([])
  const [chapterId, setChapterId] = useState('')
  const [wordMode, setWordMode] = useState(false)
  const [count, setCount] = useState(20)
  const [onlyWrong, setOnlyWrong] = useState(false)

  const [pool, setPool] = useState<readonly RikaItem[]>([])
  const [at, setAt] = useState(-1)
  const [log, setLog] = useState<readonly Log[]>([])

  const candidates = useMemo(() => {
    const wrong = onlyWrong ? new Set(wrongIds()) : null
    return RIKA_ITEMS.filter((it) => {
      if (fields.length && !fields.includes(it.field)) return false
      if (chapterId && it.chapterId !== chapterId) return false
      if (wrong && !wrong.has(it.id)) return false
      return true
    })
  }, [fields, chapterId, onlyWrong])

  const toggleField = (f: string) => {
    setFields((v) => (v.includes(f) ? v.filter((x) => x !== f) : [...v, f]))
  }

  const start = (src: readonly RikaItem[]) => {
    // 並べ替えは元の配列を壊さないように写しを作ってから行う
    const a = src.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const x = a[i]
      const y = a[j]
      if (x !== undefined && y !== undefined) {
        a[i] = y
        a[j] = x
      }
    }
    setPool(a.slice(0, Math.max(1, count)))
    setAt(0)
    setLog([])
  }

  const record = (item: RikaItem, ok: boolean) => {
    setLog((v) => [...v, { item, ok }])
    if (ok) clearWrong(item.id)
    else addWrong(item.id)
  }

  // ---- 設定画面
  if (at < 0) {
    return (
      <div className="rika-wrap">
        <Style />
        <p className="rika-h">
          高校入試 理科（三重県後期選抜対策）
        </p>
        <div className="rika-row">
          {FIELDS.map((f) => (
            <button
              key={f}
              className="rika-chip"
              data-on={fields.includes(f) ? '1' : '0'}
              onClick={() => toggleField(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="rika-row">
          <select
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
          >
            <option value="">単元をえらばない（すべて）</option>
            {RIKA_CHAPTERS.filter((c) => c.total > 0).map((c) => (
              <option key={c.id} value={c.id}>
                {c.no}. {c.name}（{c.total}問）
              </option>
            ))}
          </select>
          <select
            value={String(count)}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={String(n)}>
                {n}問
              </option>
            ))}
          </select>
        </div>
        <div className="rika-row">
          <button
            className="rika-chip"
            data-on={wordMode ? '1' : '0'}
            onClick={() => setWordMode((v) => !v)}
          >
            書いて答える
          </button>
          <button
            className="rika-chip"
            data-on={onlyWrong ? '1' : '0'}
            onClick={() => setOnlyWrong((v) => !v)}
          >
            まちがえた問題だけ
          </button>
        </div>
        <p className="rika-note">該当 {candidates.length} 問</p>
        <button
          className="rika-btn"
          disabled={candidates.length === 0}
          onClick={() => start(candidates)}
        >
          はじめる
        </button>
      </div>
    )
  }

  // ---- 結果画面
  if (at >= pool.length) {
    const ok = log.filter((l) => l.ok).length
    const wrong = log.filter((l) => !l.ok).map((l) => l.item)
    return (
      <div className="rika-wrap">
        <Style />
        <p className="rika-h">結果</p>
        <p className="rika-score">
          {ok} / {log.length} 問 正解
        </p>
        <div className="rika-row">
          {wrong.length > 0 && (
            <button className="rika-btn" onClick={() => start(wrong)}>
              まちがえた {wrong.length} 問をもう一度
            </button>
          )}
          <button className="rika-btn2" onClick={() => setAt(-1)}>
            条件を変えて解く
          </button>
        </div>
        {wrong.length > 0 && (
          <div className="rika-card">
            <p className="rika-note">まちがえた問題</p>
            {wrong.map((it) => (
              <p key={it.id} className="rika-body">
                ・{it.prompt}
                {it.answer ? '　→　' + it.answer : ''}
              </p>
            ))}
          </div>
        )}
      </div>
    )
  }

  const item = pool[at]
  if (item === undefined) {
    // 起こらないが、noUncheckedIndexedAccess のため必ず書く
    return (
      <div className="rika-wrap">
        <Style />
        <button className="rika-btn2" onClick={() => setAt(-1)}>
          最初から
        </button>
      </div>
    )
  }

  return (
    <div className="rika-wrap">
      <Style />
      <p className="rika-note">
        {at + 1} / {pool.length} 問
      </p>
      <Question
        key={item.id}
        item={item}
        wordMode={wordMode}
        onDone={(ok) => {
          record(item, ok)
          setAt(at + 1)
        }}
      />
    </div>
  )
}

/**
 * ★アロー関数（const）で宣言している理由★
 * このリポジトリには @types/react が入っておらず、JSX の型は
 * react 本体が持つ定義で解決されている。その定義では
 *   function Question(props: {...})
 * のように ★function 宣言★ で書いたコンポーネントに key を渡すと
 *   Property 'key' does not exist on type '{...}'
 * という型エラーになる（アロー関数なら通る）。
 * 本体側の同じ形のコンポーネント（InteractiveTree の TreeNode など）も
 * すべてアロー関数で書かれているので、そこに合わせた。
 * ★中身は1文字も変えていない。宣言の書き方だけを揃えている。★
 */
const Question = (props: {
  item: RikaItem
  wordMode: boolean
  onDone: (ok: boolean) => void
  /**
   * ★key を props の型に書く理由★
   * このリポジトリには @types/react が入っておらず、JSX の型は
   * react 本体が持つ定義で解決されている。その定義では
   * 独自コンポーネントに key を渡すと、props の型に key が無い限り
   *   Property 'key' does not exist on type '{...}'
   * という型エラーになる。
   * 本体側も同じ書き方で通している（ExplanationBody.tsx の
   * SectionBoxProps が `key?: React.Key` を持っている）。
   * ★受け取っても使わない。React が消費するものなので、
   *   型を通すための宣言だけを置いてある。★
   */
  key?: React.Key
}) => {
  const { item, wordMode } = props
  const [given, setGiven] = useState('')
  const [judged, setJudged] = useState<boolean | null>(null)

  // choiceOnly は表記のゆれが大きいので、記述モードでも4択で出す
  const asWord = wordMode && item.format === 'word'

  const src = (
    <span className="rika-src">
      {/* ★この答えが実際の入試で出ていたときの印★
          三重県公式の「理科 採点基準」令和4〜8年度と照合した結果。
          答えを見せたあとに出す（問題文の横に出すとヒントになる）。 */}
      {item.examYears.length > 0 && (
        <span className="rika-exam">
          {item.examYears.join('・')}の入試で出た
        </span>
      )}
      出典：{item.chapter}
      {item.section ? '／' + item.section : ''}
    </span>
  )

  // ---- 原典の練習問題（自己採点）
  if (item.format === 'exam') {
    return (
      <div className="rika-card" data-id={item.id} data-format="exam">
        <p className="rika-q">{item.prompt}</p>
        {item.body.map((t, i) => (
          <p className="rika-body" key={String(i)}>
            {t}
          </p>
        ))}
        {judged === null ? (
          <div className="rika-row">
            <button className="rika-btn2" onClick={() => setJudged(false)}>
              解答を見る
            </button>
          </div>
        ) : (
          <>
            <div className="rika-ans">
              {item.answerParts.map((a, i) => (
                <p className="rika-body" key={String(i)}>
                  ({a.no}) {a.answer}
                </p>
              ))}
              {src}
            </div>
            <div className="rika-row">
              <button className="rika-btn" onClick={() => props.onDone(true)}>
                解けた
              </button>
              <button className="rika-btn2" onClick={() => props.onDone(false)}>
                解けなかった
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  const showJudge = (ok: boolean) => (
    <div className={'rika-judge ' + (ok ? 'rika-ok' : 'rika-ng')}>
      <b>{ok ? '○ 正解' : '× まちがい'}</b>
      {!ok && <span>　正解：{item.answer}</span>}
      {src}
      <div className="rika-row">
        <button className="rika-btn" onClick={() => props.onDone(ok)}>
          次へ
        </button>
      </div>
    </div>
  )

  // ---- 記述
  if (asWord) {
    return (
      <div className="rika-card" data-id={item.id} data-format="word">
        {item.context && <p className="rika-ctx">{item.context}</p>}
        <Prompt text={item.prompt} />
        {judged === null ? (
          <>
            <input
              className="rika-in"
              value={given}
              onChange={(e) => setGiven(e.target.value)}
              placeholder="答えを入力"
            />
            <div className="rika-row">
              <button
                className="rika-btn"
                onClick={() => setJudged(judgeWord(item.answer, given))}
              >
                答え合わせ
              </button>
              <button
                className="rika-btn2"
                onClick={() => setJudged(false)}
              >
                わからない
              </button>
            </div>
          </>
        ) : (
          showJudge(judged)
        )}
      </div>
    )
  }

  // ---- 4択
  return (
    <div className="rika-card" data-id={item.id} data-format="choice4">
      {item.context && <p className="rika-ctx">{item.context}</p>}
      <Prompt text={item.prompt} />
      {judged === null ? (
        <div>
          {item.options.map((_, i) => (
            <button
              className="rika-opt"
              key={String(i)}
              onClick={() => setJudged(judgeChoice(item.answerIndex, i))}
            >
              {i + 1}. {optionAt(item.options, i)}
            </button>
          ))}
        </div>
      ) : (
        showJudge(judged)
      )}
    </div>
  )
}

/** 穴埋めの空欄を、下線として見せる */
function Prompt(props: { text: string }) {
  const parts = splitBlank(props.text)
  return (
    <p className="rika-q">
      {parts.map((t, i) => (
        <span key={String(i)}>
          {i > 0 && <span className="rika-bl">？</span>}
          {t}
        </span>
      ))}
    </p>
  )
}
