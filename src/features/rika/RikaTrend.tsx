// このファイルは tools/build_app_pack.py が自動生成します。手で直さないでください。
// 原典: 三重県後期選抜入試対策理科最終プリント

import { useState } from 'react'
import {
  RIKA_TREND_ADVICE,
  RIKA_TREND_DIFF,
  RIKA_TREND_FINDINGS,
  RIKA_TREND_META,
  RIKA_TREND_SOURCES,
  RIKA_TREND_STRUCTURE,
  RIKA_TREND_YEARS,
} from './rikaTrendData'

function Style() {
  return (
    <style>{`
.rikat-wrap{max-width:760px;margin:0 auto;padding:16px;
  font-family:system-ui,-apple-system,'Hiragino Sans','Noto Sans JP',sans-serif;
  line-height:1.9;color:#1a1a1a}
.rikat-h{font-size:19px;font-weight:700;margin:0 0 4px;color:#0b4f8a}
.rikat-badge{display:inline-block;font-size:11px;background:#0b4f8a;color:#fff;
  border-radius:4px;padding:2px 8px;margin-left:8px;vertical-align:2px}
.rikat-note{font-size:12.5px;color:#5b6b7c;margin:0 0 10px}
.rikat-lead{font-size:13.5px;color:#33475c;margin:0 0 12px}
.rikat-card{border:1px solid #cfe0f7;border-radius:10px;padding:12px 14px;
  margin:0 0 12px;background:linear-gradient(#f6fbff,#fff)}
.rikat-sh{font-size:15px;font-weight:700;margin:0 0 6px;color:#0b4f8a}
.rikat-yr{font-size:14px;font-weight:700;margin:0 0 4px;color:#0b4f8a}
.rikat-ul{margin:4px 0 8px;padding-left:1.25em;font-size:13.5px}
.rikat-ul li{margin:3px 0}
.rikat-tw{overflow-x:auto;margin:6px 0 10px}
.rikat-t{border-collapse:collapse;width:100%;font-size:12.5px}
.rikat-t th,.rikat-t td{border:1px solid #cfe0f7;padding:5px 8px;
  vertical-align:top;text-align:left}
.rikat-t th{background:#eaf3fd;white-space:nowrap}
.rikat-cau{background:#fff8e1;border:1px solid #f0d69a;border-radius:6px;
  padding:6px 10px;font-size:12px;margin:4px 0 8px}
.rikat-vd{font-weight:700;color:#0b6b3a}
.rikat-src{font-size:11.5px;color:#5b6b7c;border-top:1px dashed #cfe0f7;
  margin-top:12px;padding-top:10px;word-break:break-all}
.rikat-src a{color:#0b4f8a}
.rikat-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}
.rikat-tab{font:inherit;font-size:12.5px;padding:6px 12px;border-radius:999px;
  border:1px solid #cfe0f7;background:#fff;color:#1a1a1a;cursor:pointer}
.rikat-tab[data-on="1"]{background:#0b4f8a;color:#fff;border-color:#0b4f8a}
`}</style>
  )
}

export default function RikaTrend() {
  const [year, setYear] = useState(
    RIKA_TREND_YEARS.length > 0 ? RIKA_TREND_YEARS[0]!.year : '',
  )
  const cur = RIKA_TREND_YEARS.find((y) => y.year === year)
  // 答えの型の列（出てくる順にそろえる）
  const kindCols: string[] = []
  for (const y of RIKA_TREND_YEARS) {
    for (const a of y.answerKinds) {
      if (!kindCols.includes(a.kind)) kindCols.push(a.kind)
    }
  }

  return (
    <div className="rikat-wrap">
      <Style />
      <p className="rikat-h">
        {RIKA_TREND_META.title}
        <span className="rikat-badge">調べて作成（原典外）</span>
      </p>
      <p className="rikat-note">
        対象：{RIKA_TREND_META.scope}　／　調べた年度：
        {RIKA_TREND_META.years.join('・')}　／　作成日：
        {RIKA_TREND_META.asOf}
      </p>
      <p className="rikat-lead">{RIKA_TREND_META.note}</p>

      <div className="rikat-card">
        <p className="rikat-sh">{RIKA_TREND_STRUCTURE.heading}</p>
        <ul className="rikat-ul">
          {RIKA_TREND_STRUCTURE.points.map((t, i) => (
            <li key={String(i)}>{t}</li>
          ))}
        </ul>
        {RIKA_TREND_STRUCTURE.pointTable.length > 0 && (
          <div className="rikat-tw">
            <table className="rikat-t">
              <tbody>
                <tr>
                  <th>大問</th>
                  {RIKA_TREND_STRUCTURE.pointTable.map((_, i) => (
                    <th key={String(i)}>{i + 1}</th>
                  ))}
                </tr>
                <tr>
                  <th>配点</th>
                  {RIKA_TREND_STRUCTURE.pointTable.map((v, i) => (
                    <td key={String(i)}>{v}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {RIKA_TREND_STRUCTURE.pointNote !== '' && (
          <p className="rikat-note">{RIKA_TREND_STRUCTURE.pointNote}</p>
        )}
      </div>

      {kindCols.length > 0 && (
        <div className="rikat-card">
          <p className="rikat-sh">
            答えの書かせ方（県の「採点基準」から数えた小問の数）
          </p>
          <div className="rikat-tw">
            <table className="rikat-t">
              <tbody>
                <tr>
                  <th>年度</th>
                  <th>小問数</th>
                  {kindCols.map((k) => (
                    <th key={k}>{k}</th>
                  ))}
                </tr>
                {RIKA_TREND_YEARS.map((y) => {
                  const d = new Map(y.answerKinds.map((a) => [a.kind, a.n]))
                  return (
                    <tr key={y.year}>
                      <td>{y.year}</td>
                      <td>{y.shoN}</td>
                      {kindCols.map((k) => (
                        <td key={k}>{d.has(k) ? String(d.get(k)) : ''}</td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="rikat-note">
            小問は毎年43〜45問。記号で選ばせる問いがいちばん多く、
            用語をそのまま書かせる問いはその次。数値（計算）・記述・
            並べかえ・作図も毎年必ず入る。用語だけ覚えても半分に届かない。
          </p>
        </div>
      )}

      <div className="rikat-card">
        <p className="rikat-sh">年度ごとの中身</p>
        <div className="rikat-tabs">
          {RIKA_TREND_YEARS.map((y) => (
            <button
              className="rikat-tab"
              key={y.year}
              data-on={y.year === year ? '1' : '0'}
              onClick={() => setYear(y.year)}
            >
              {y.year}
            </button>
          ))}
        </div>
        {cur !== undefined && (
          <div>
            <p className="rikat-yr">
              {cur.year}　合格者平均 {cur.avg} / 50点
            </p>
            {cur.caution !== '' && (
              <p className="rikat-cau">確認のおねがい：{cur.caution}</p>
            )}
            {cur.answerKinds.length > 0 && (
              <p className="rikat-note">
                小問 {cur.shoN} 問　／　
                {cur.answerKinds.map((a) => a.kind + String(a.n)).join('・')}
                {cur.saitenUrl !== '' && (
                  <>
                    　（
                    <a href={cur.saitenUrl} rel="noreferrer" target="_blank">
                      採点基準
                    </a>
                    ・
                    <a href={cur.itoUrl} rel="noreferrer" target="_blank">
                      出題意図
                    </a>
                    ）
                  </>
                )}
              </p>
            )}
            <div className="rikat-tw">
              {/* 検査で場所を特定できるように名前を付けている */}
              <table className="rikat-t rikat-dai">
                <tbody>
                  <tr>
                    <th>大問</th>
                    <th>分野</th>
                    <th>題材</th>
                    <th>配点</th>
                    <th>問われたこと</th>
                  </tr>
                  {cur.items.map((it) => (
                    <tr key={String(it.no)}>
                      <td>{it.no}</td>
                      <td>{it.field}</td>
                      <td>{it.topic}</td>
                      <td>{it.points}</td>
                      <td>{it.keys.join('／')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="rikat-card">
        <p className="rikat-sh">5年分からわかること</p>
        {RIKA_TREND_FINDINGS.map((f, i) => (
          <div key={String(i)}>
            <p className="rikat-yr">{f.heading}</p>
            <p className="rikat-lead">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="rikat-card">
        <p className="rikat-sh">どう対策するか</p>
        <ul className="rikat-ul">
          {RIKA_TREND_ADVICE.map((t, i) => (
            <li key={String(i)}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="rikat-card">
        <p className="rikat-sh">{RIKA_TREND_DIFF.heading}</p>
        <p className="rikat-yr">プリントに書かれていること</p>
        <ul className="rikat-ul">
          {RIKA_TREND_DIFF.printSays.map((t, i) => (
            <li key={String(i)}>{t}</li>
          ))}
        </ul>
        <p className="rikat-yr">過去問で確かめた結果</p>
        <div className="rikat-tw">
          <table className="rikat-t">
            <tbody>
              <tr>
                <th>プリントの記述</th>
                <th>確かめた内容</th>
                <th>判定</th>
              </tr>
              {RIKA_TREND_DIFF.checked.map((c, i) => (
                <tr key={String(i)}>
                  <td>{c.claim}</td>
                  <td>{c.result}</td>
                  <td className="rikat-vd">{c.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="rikat-yr">プリントの予想欄について</p>
        <ul className="rikat-ul">
          {RIKA_TREND_DIFF.printOnly.map((t, i) => (
            <li key={String(i)}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="rikat-src">
        <b>この画面の出典（すべて三重県教育委員会の公開資料）</b>
        <br />
        調べ方：{RIKA_TREND_META.howChecked}
        <br />
        {RIKA_TREND_SOURCES.map((s) => (
          <span key={s.url}>
            ・{s.label}　
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.url}
            </a>
            {s.pdf.map((p) => (
              <span key={p.url}>
                　（{p.name}:{' '}
                <a href={p.url} target="_blank" rel="noreferrer">
                  {p.url}
                </a>
                ）
              </span>
            ))}
            <br />
          </span>
        ))}
      </div>
    </div>
  )
}
