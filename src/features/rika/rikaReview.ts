// このファイルは tools/build_app_pack.py が自動生成します。手で直さないでください。
// 原典: 三重県後期選抜入試対策理科最終プリント

/**
 * まちがえた問題の記録。
 *
 * ★localStorage が使えない場合も動かす★
 *   端末の設定やプライベート表示では読み書きが例外になる。
 *   記録が取れないだけで練習そのものは続けられるべきなので、
 *   例外は飲み込んで「記録なし」として扱う。
 */
const KEY = 'manatobi.rika.wrong.v1'

function read(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return {}
    const v: unknown = JSON.parse(raw)
    return v && typeof v === 'object' ? (v as Record<string, number>) : {}
  } catch {
    return {}
  }
}

function write(v: Record<string, number>): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(v))
  } catch {
    /* 記録できなくても練習は続けられる */
  }
}

/** まちがえた回数を1増やす */
export function addWrong(id: string): void {
  const v = read()
  const n = v[id]
  v[id] = (typeof n === 'number' ? n : 0) + 1
  write(v)
}

/** 正解したので記録から外す */
export function clearWrong(id: string): void {
  const v = read()
  if (id in v) {
    delete v[id]
    write(v)
  }
}

/** まちがえた問題のid（まちがえた回数の多い順） */
export function wrongIds(): readonly string[] {
  const v = read()
  return Object.keys(v).sort((a, b) => (v[b] ?? 0) - (v[a] ?? 0))
}

export function wrongCount(): number {
  return Object.keys(read()).length
}

export function resetWrong(): void {
  write({})
}
