// このファイルは tools/build_app_pack.py が自動生成します。手で直さないでください。
// 原典: 三重県後期選抜入試対策理科最終プリント

import type React from 'react'
import { useMemo, useState, type ReactNode } from 'react'
import {
  RIKA_FORECAST,
  RIKA_OVERVIEW,
  RIKA_SUMMARY,
  type RikaSummarySection,
} from './rikaSummaryData'

function Style() {
  return (
    <style>{`
.rikas-wrap{max-width:760px;margin:0 auto;padding:16px;
  font-family:system-ui,-apple-system,'Hiragino Sans','Noto Sans JP',sans-serif;
  line-height:1.9;color:#1a1a1a}
.rikas-h{font-size:18px;font-weight:700;margin:0 0 8px}
.rikas-row{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.rikas-chip{border:1px solid #c8ced6;background:#fff;border-radius:999px;
  padding:6px 14px;font-size:14px;cursor:pointer}
.rikas-chip[data-on="1"]{background:#1b5fbe;border-color:#1b5fbe;color:#fff}
.rikas-in{flex:1;min-width:180px;border:1px solid #c8ced6;border-radius:8px;
  padding:8px 12px;font-size:15px}
.rikas-ch{border:1px solid #dfe3e8;border-radius:12px;padding:14px;
  margin:12px 0;background:#fff}
.rikas-cht{font-size:16px;font-weight:700;margin:0 0 4px}
.rikas-sec{margin:14px 0 0}
.rikas-sh{font-size:15px;font-weight:700;color:#12457f;margin:0 0 4px}
.rikas-p{margin:2px 0;white-space:pre-wrap}
.rikas-t{border-collapse:collapse;margin:8px 0;font-size:14px;width:100%}
.rikas-t td{border:1px solid #c8ced6;padding:6px 8px;vertical-align:top}
.rikas-kw{background:#fff3bf;font-weight:700;border-radius:3px;padding:0 2px}
.rikas-wrap[data-hide="1"] .rikas-kw{background:#c92a2a;color:#c92a2a}
.rikas-note{font-size:13px;color:#5b6672}
.rikas-star{color:#e8a900;font-size:13px}
.rikas-exam{display:inline-block;background:#e7f0ff;color:#12457f;
  border:1px solid #9dbdea;border-radius:6px;padding:1px 8px;
  font-size:12px;font-weight:700;margin:2px 4px 2px 0}
.rikas-examnote{font-size:12px;color:#12457f;margin:0 0 4px}
    `}</style>
  )
}

const FIELDS = ['\u7269\u7406', '\u5316\u5b66', '\u751f\u7269', '\u5730\u5b66'] as const

/**
 * まとめ画面。原典のまとめプリントをそのまま読めるようにしたもの。
 * 「重要語をかくす」を押すと、原典が太字＋下線で示した語が塗り潰される
 * （赤シートと同じ）。
 */
export default function RikaSummary() {
  const [field, setField] = useState('')
  const [hide, setHide] = useState(false)
  const [examOnly, setExamOnly] = useState(false)
  const [q, setQ] = useState('')

  const chapters = useMemo(() => {
    const key = q.trim()
    return RIKA_SUMMARY.filter((c) => {
      if (field && c.field !== field) return false
      if (examOnly && !c.sections.some((s) => s.examYears.length > 0)) {
        return false
      }
      if (!key) return true
      if (c.name.includes(key)) return true
      return c.sections.some(
        (s) =>
          s.head.includes(key) ||
          s.keywords.some((w) => w.includes(key)) ||
          s.blocks.some(
            (b) =>
              b.text.includes(key) ||
              b.rows.some((r) => r.some((x) => x.includes(key)))
          )
      )
    })
  }, [field, q, examOnly])

  return (
    <div className="rikas-wrap" data-hide={hide ? '1' : '0'}>
      <Style />
      <p className="rikas-h">高校入試 理科 まとめ（三重県後期選抜対策）</p>
      <div className="rikas-row">
        {FIELDS.map((f) => (
          <button
            key={f}
            className="rikas-chip"
            data-on={field === f ? '1' : '0'}
            onClick={() => setField(field === f ? '' : f)}
          >
            {f}
          </button>
        ))}
        <button
          className="rikas-chip"
          data-on={hide ? '1' : '0'}
          onClick={() => setHide((v) => !v)}
        >
          重要語をかくす
        </button>
        <button
          className="rikas-chip"
          data-on={examOnly ? '1' : '0'}
          onClick={() => setExamOnly((v) => !v)}
        >
          入試で出た節だけ
        </button>
      </div>
      <div className="rikas-row">
        <input
          className="rikas-in"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="語をさがす（例：光合成）"
        />
      </div>

      {RIKA_OVERVIEW.length > 0 && (
        <div className="rikas-ch">
          <p className="rikas-cht">出題傾向（原典より）</p>
          {RIKA_OVERVIEW.map((t, i) => (
            <p className="rikas-p" key={String(i)}>
              {t}
            </p>
          ))}
          {RIKA_FORECAST.map((t, i) => (
            <p className="rikas-p" key={'f' + String(i)}>
              {t}
            </p>
          ))}
        </div>
      )}

      <p className="rikas-note">{chapters.length} 単元</p>
      {chapters.map((c) => (
        <div className="rikas-ch" key={c.id} id={c.id}>
          <p className="rikas-cht">
            {c.no}. {c.name}
          </p>
          <p className="rikas-note">{c.field}</p>
          {c.sections.length === 0 && (
            <p className="rikas-note">
              この単元は原典に本文が書かれていません。
            </p>
          )}
          {c.sections
            .filter((s) => !examOnly || s.examYears.length > 0)
            .map((s) => (
              <Section key={s.id} sec={s} />
            ))}
        </div>
      ))}
    </div>
  )
}

/**
 * ★アロー関数（const）で宣言している理由★
 * このリポジトリには @types/react が入っていないため、
 * function 宣言で書いたコンポーネントに key を渡すと型エラーになる
 * （RikaPractice.tsx の Question に同じ説明を書いてある）。
 * ★中身は変えていない。宣言の書き方だけ本体に合わせている。★
 */
const Section = (props: {
  sec: RikaSummarySection
  /**
   * ★key を props の型に書く理由★
   * RikaPractice.tsx の Question に同じ説明を書いてある。
   * @types/react が無い環境なので、独自コンポーネントに key を渡すには
   * props の型に key を持たせる必要がある（本体の SectionBoxProps と同じ書き方）。
   */
  key?: React.Key
}) => {
  const s = props.sec
  return (
    <div className="rikas-sec" id={s.id}>
      {s.head && <p className="rikas-sh">{s.head}</p>}
      {s.stars > 0 && (
        <p className="rikas-star">
          {'\u2605'.repeat(s.stars)}
          {s.rank ? '　' + s.rank : ''}
          {s.memo ? '　' + s.memo : ''}
        </p>
      )}
      {/* ★実際の入試で答えになった語がこの節にあるときの印★
          原典の★は著者の見立て、こちらは県の採点基準との照合結果。
          両方並べて見せると、どこを先にやるかの判断ができる。 */}
      {s.examYears.length > 0 && (
        <p className="rikas-examnote">
          {s.examYears.map((y) => (
            <span className="rikas-exam" key={y}>
              {y}に出た
            </span>
          ))}
          {s.examTerms.length > 0 && (
            <span>答えになった語：{s.examTerms.join('、')}</span>
          )}
        </p>
      )}
      {s.blocks.length === 0 && (
        <p className="rikas-note">この節は原典に中身が書かれていません。</p>
      )}
      {s.blocks.map((b, i) =>
        b.t === 'table' ? (
          <table className="rikas-t" key={String(i)}>
            <tbody>
              {b.rows.map((r, ri) => (
                <tr key={String(ri)}>
                  {r.map((cell, ci) => (
                    <td key={String(ci)}>
                      <Marked text={cell} words={s.keywords} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="rikas-p" key={String(i)}>
            <Marked text={b.text} words={s.keywords} />
          </p>
        )
      )}
    </div>
  )
}

/**
 * 原典が太字＋下線で示した語に印をつける。
 *
 * ★語の長い順に探す理由★
 *   「酸素」と「酸素の発生」の両方が重要語のとき、短い方から探すと
 *   長い語の一部だけに印がついて、途中で切れた見え方になる。
 */
function Marked(props: { text: string; words: readonly string[] }) {
  const out: ReactNode[] = []
  const words = props.words
    .filter((w) => w.length >= 2)
    .slice()
    .sort((a, b) => b.length - a.length)
  let rest = props.text
  let guard = 0
  let key = 0
  while (rest && guard < 2000) {
    guard += 1
    let hitAt = -1
    let hitWord = ''
    for (const w of words) {
      const at = rest.indexOf(w)
      if (at >= 0 && (hitAt < 0 || at < hitAt)) {
        hitAt = at
        hitWord = w
      }
    }
    if (hitAt < 0) {
      out.push(rest)
      break
    }
    if (hitAt > 0) out.push(rest.slice(0, hitAt))
    key += 1
    out.push(
      <span className="rikas-kw" key={String(key)}>
        {hitWord}
      </span>
    )
    rest = rest.slice(hitAt + hitWord.length)
  }
  return <>{out}</>
}
