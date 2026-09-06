// このファイルは tools/build_app_pack.py が自動生成します。手で直さないでください。
// 原典: 三重県後期選抜入試対策理科最終プリント

export type RikaChapter = {
  no: number
  id: string
  /** 原典の単元名 */
  name: string
  /** 物理・化学・生物・地学 */
  field: string
  /** 原典の節の数 */
  sections: number
  total: number
  choice4: number
  word: number
  exam: number
}

/**
 * 単元の一覧。原典の並び順のまま。
 * total が 0 の単元は、原典にその単元の本文がほとんど無いということ。
 * （例: 中1物理① は見出しだけで中身が書かれていない）
 */
export const RIKA_CHAPTERS: readonly RikaChapter[] = [
  { no: 1, id: 'ch01', name: '生物➀〜身の回りの生物の観察', field: '生物', sections: 4, total: 56, choice4: 10, word: 46, exam: 0 },
  { no: 2, id: 'ch02', name: '生物②～植物のつくりと特徴', field: '生物', sections: 5, total: 106, choice4: 18, word: 88, exam: 0 },
  { no: 3, id: 'ch03', name: '生物➂・環境～光合成と呼吸・環境と生態系', field: '生物', sections: 6, total: 52, choice4: 0, word: 52, exam: 0 },
  { no: 4, id: 'ch04', name: '生物④～動物のつくりと分類', field: '生物', sections: 3, total: 97, choice4: 14, word: 83, exam: 0 },
  { no: 5, id: 'ch05', name: '生物⑤～細胞のつくりと消化と吸収', field: '生物', sections: 2, total: 45, choice4: 9, word: 36, exam: 0 },
  { no: 6, id: 'ch06', name: '生物⑥～光合成と呼吸・血液循環', field: '生物', sections: 6, total: 83, choice4: 8, word: 75, exam: 0 },
  { no: 7, id: 'ch07', name: '生物⑦～排出と感覚', field: '生物', sections: 11, total: 73, choice4: 5, word: 68, exam: 0 },
  { no: 8, id: 'ch08', name: '生物⑧～生殖と生態系', field: '生物', sections: 5, total: 56, choice4: 2, word: 54, exam: 0 },
  { no: 9, id: 'ch09', name: '生物⑨～遺伝の規則性と出題傾向（生物・環境編）', field: '生物', sections: 1, total: 23, choice4: 0, word: 23, exam: 0 },
  { no: 10, id: 'ch10', name: '物理①～光の法則', field: '物理', sections: 5, total: 46, choice4: 5, word: 41, exam: 0 },
  { no: 11, id: 'ch11', name: '物理②～音の法則', field: '物理', sections: 5, total: 34, choice4: 3, word: 31, exam: 0 },
  { no: 12, id: 'ch12', name: '物理➂～電流の性質', field: '物理', sections: 4, total: 24, choice4: 4, word: 20, exam: 0 },
  { no: 13, id: 'ch13', name: '物理④～電流の性質②と電力', field: '物理', sections: 2, total: 13, choice4: 0, word: 13, exam: 0 },
  { no: 14, id: 'ch14', name: '物理⑤～電流の正体と磁界', field: '物理', sections: 4, total: 46, choice4: 3, word: 43, exam: 0 },
  { no: 15, id: 'ch15', name: '物理⑥～電磁力と交流', field: '物理', sections: 4, total: 32, choice4: 1, word: 31, exam: 0 },
  { no: 16, id: 'ch16', name: '物理⑦～水圧と浮力・力の合成と分解・物体の運動', field: '物理', sections: 3, total: 38, choice4: 1, word: 37, exam: 0 },
  { no: 17, id: 'ch17', name: '物理⑧～仕事・エネルギー', field: '物理', sections: 3, total: 21, choice4: 0, word: 21, exam: 0 },
  { no: 18, id: 'ch18', name: '地学➄～天体と日周運動・年周運動', field: '地学', sections: 4, total: 59, choice4: 2, word: 57, exam: 0 },
  { no: 19, id: 'ch19', name: '地学➅～天体と天体の動き➁', field: '地学', sections: 1, total: 2, choice4: 0, word: 2, exam: 0 },
  { no: 20, id: 'ch20', name: '地学➀～大地の変化と地震', field: '地学', sections: 4, total: 13, choice4: 0, word: 13, exam: 0 },
  { no: 21, id: 'ch21', name: '中1地学編②', field: '地学', sections: 1, total: 7, choice4: 4, word: 3, exam: 0 },
  { no: 22, id: 'ch22', name: '中1地学編③', field: '地学', sections: 2, total: 2, choice4: 0, word: 2, exam: 0 },
  { no: 23, id: 'ch23', name: '中1科学編①', field: '化学', sections: 3, total: 1, choice4: 0, word: 1, exam: 0 },
  { no: 24, id: 'ch24', name: '中1科学編②', field: '化学', sections: 10, total: 18, choice4: 0, word: 18, exam: 0 },
  { no: 25, id: 'ch25', name: '中1化学③', field: '化学', sections: 7, total: 14, choice4: 0, word: 14, exam: 0 },
  { no: 26, id: 'ch26', name: '中1物理①', field: '物理', sections: 0, total: 0, choice4: 0, word: 0, exam: 0 },
  { no: 27, id: 'ch27', name: '中2生物①', field: '生物', sections: 5, total: 8, choice4: 0, word: 8, exam: 0 },
  { no: 28, id: 'ch28', name: '中2生物②', field: '生物', sections: 7, total: 11, choice4: 0, word: 11, exam: 0 },
  { no: 29, id: 'ch29', name: '中2生物③', field: '生物', sections: 4, total: 3, choice4: 0, word: 3, exam: 0 },
  { no: 30, id: 'ch30', name: '中2地学①', field: '地学', sections: 3, total: 4, choice4: 0, word: 4, exam: 0 },
  { no: 31, id: 'ch31', name: '中2地学②', field: '地学', sections: 2, total: 5, choice4: 0, word: 5, exam: 0 },
  { no: 32, id: 'ch32', name: '化学➁〜原子・分子、化学変化', field: '化学', sections: 37, total: 142, choice4: 2, word: 123, exam: 17 },
]
