// このファイルは tools/build_app_pack.py が自動生成します。手で直さないでください。
// 原典: 三重県後期選抜入試対策理科最終プリント

// ★このファイルの中身は原典（プリント）には書かれていません★
//   三重県教育委員会の公開資料を調べて作りました。
//   画面には「調べて作成（原典外）」と出し、出典URLも表示します。

export type RikaTrendSource = {
  label: string
  url: string
  pdf: readonly { name: string; url: string }[]
}

export type RikaTrendItem = {
  no: number
  field: string
  topic: string
  points: number
  keys: readonly string[]
}

export type RikaTrendYear = {
  year: string
  avg: number
  /** 読み取りに不確かさが残る場合の注意。空文字なら注意なし */
  caution: string
  /** その年の小問の数（県の「採点基準」から数えた） */
  shoN: number
  /**
   * 答えの書かせ方の内訳（用語・記号・数値・記述・並べかえ・作図）。
   * ★用語だけ覚えても半分に届かないことが、この数で分かる★
   */
  answerKinds: readonly { kind: string; n: number }[]
  /** 出典：三重県公式の「理科 採点基準」PDF */
  saitenUrl: string
  /** 出典：三重県公式の「出題意図」PDF */
  itoUrl: string
  items: readonly RikaTrendItem[]
}

export const RIKA_TREND_META = {
  title: '三重県公立高校入試 理科 出題傾向（今年版）',
  asOf: '2026-08-31',
  scope: '後期選抜 学力検査 理科',
  note: 'この節はプリント（原典）には書かれていない。三重県教育委員会が公開している問題用紙・出題意図・平均点を調べて作った。根拠のURLは sources に全部載せてある。プリント本体の記述と混ざらないよう、画面でも別扱いにしている。',
  howChecked: '三重県教育委員会が公開している問題用紙PDFを年度ごとに取り寄せ、大問ごとの題材・分野・配点を読み取った。令和8年度は本文が抽出できたのでそのまま読み、令和4〜7年度は画像だけのPDFなので文字を読み取る処理（OCR）にかけ、大問の書き出しの行と「（○点）」の表記を1題ずつ目で確認した。各年度で「大問8題・配点合計50点・4分野が各2題」が成り立つことを計算で確かめている。　さらに各年度の「理科 採点基準」PDFを取り込み、小問ごとの配点と答えの型（用語・記号・数値・記述・並べかえ・作図）を数え直した（8大問・合計50点で検算済み）。',
  years: ['令和8年度', '令和7年度', '令和6年度', '令和5年度', '令和4年度'],
}

export const RIKA_TREND_SOURCES: readonly RikaTrendSource[] = [
  { label: '令和8年度 学力検査問題等（後期選抜）', url: 'https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200393.htm', pdf: [{ name: '理科 問題用紙', url: 'https://www.pref.mie.lg.jp/common/content/001244602.pdf' }, { name: '出題意図', url: 'https://www.pref.mie.lg.jp/common/content/001244621.pdf' }, { name: '理科 採点基準', url: 'https://www.pref.mie.lg.jp/common/content/001244618.pdf' }] },
  { label: '令和7年度 学力検査問題等（後期選抜）', url: 'https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200029_00074.htm', pdf: [{ name: '理科 問題用紙', url: 'https://www.pref.mie.lg.jp/common/content/001184821.pdf' }, { name: '理科 採点基準', url: 'https://www.pref.mie.lg.jp/common/content/001184823.pdf' }, { name: '出題意図', url: 'https://www.pref.mie.lg.jp/common/content/001184824.pdf' }] },
  { label: '令和6年度 学力検査問題等（後期選抜）', url: 'https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200029_00067.htm', pdf: [{ name: '理科 問題用紙', url: 'https://www.pref.mie.lg.jp/common/content/001125173.pdf' }, { name: '理科 採点基準', url: 'https://www.pref.mie.lg.jp/common/content/001125175.pdf' }, { name: '出題意図', url: 'https://www.pref.mie.lg.jp/common/content/001125176.pdf' }] },
  { label: '令和5年度 学力検査問題等（後期選抜）', url: 'https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200029_00062.htm', pdf: [{ name: '理科 問題用紙', url: 'https://www.pref.mie.lg.jp/common/content/001065022.pdf' }, { name: '理科 採点基準', url: 'https://www.pref.mie.lg.jp/common/content/001065024.pdf' }, { name: '出題意図', url: 'https://www.pref.mie.lg.jp/common/content/001065025.pdf' }] },
  { label: '令和4年度 学力検査問題等（後期選抜）', url: 'https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200029_00056.htm', pdf: [{ name: '理科 問題用紙', url: 'https://www.pref.mie.lg.jp/common/content/001003781.pdf' }, { name: '理科 採点基準', url: 'https://www.pref.mie.lg.jp/common/content/001003785.pdf' }, { name: '出題意図', url: 'https://www.pref.mie.lg.jp/common/content/001003786.pdf' }] },
]

/** この5年間ずっと変わらない形 */
export const RIKA_TREND_STRUCTURE = {
  heading: '形はこの5年間ずっと同じ',
  points: ['大問は8題。50点満点。', '物理・化学・生物・地学が2題ずつで、4分野が必ず均等に出る。', '大問1〜4が軽く（各4〜5点）、大問5〜8が重い（各8〜9点）。', '大問1〜4は1分野1題、大問5〜8も1分野1題。同じ分野の2題は「軽い方」と「重い方」に分かれる。', '検査時間は45分。'],
  /** 令和8年度の大問ごとの配点 */
  pointTable: [4, 4, 5, 4, 8, 8, 8, 9],
  pointNote: '合計50点。大問1〜4で17点、大問5〜8で33点。',
}

export const RIKA_TREND_YEARS: readonly RikaTrendYear[] = [
  {
    year: '令和8年度',
    avg: 29.2,
    caution: '',
    shoN: 43,
    answerKinds: [{ kind: '用語', n: 12 }, { kind: '記号', n: 16 }, { kind: '数値', n: 7 }, { kind: '記述', n: 4 }, { kind: '並べかえ', n: 3 }, { kind: '作図など', n: 1 }],
    saitenUrl: 'https://www.pref.mie.lg.jp/common/content/001244618.pdf',
    itoUrl: 'https://www.pref.mie.lg.jp/common/content/001244621.pdf',
    items: [
      { no: 1, field: '地学', topic: '太陽の黒点の観察', points: 4, keys: ['恒星', '自転', '球形', '黒点の温度', '実際の直径の計算（地球の何倍か）'] },
      { no: 2, field: '物理', topic: '音の速さを測る実験', points: 4, keys: ['音の速さの計算（平均値を使う）', '振幅と大きさ', '光と音の速さのちがい（記述）'] },
      { no: 3, field: '生物', topic: '無性生殖と有性生殖', points: 5, keys: ['遺伝子が同じ理由（記述）', '減数分裂', '生殖細胞の染色体数', '胚の成長順（並べ替え）', '発生'] },
      { no: 4, field: '化学', topic: '水とエタノールの混合物の加熱（蒸留）', points: 4, keys: ['ガスバーナーの操作手順（並べ替え）', '沸騰の開始時刻をグラフから読む', '沸点のちがい', '蒸留'] },
      { no: 5, field: '地学', topic: '地震・緊急地震速報', points: 8, keys: ['震度（10階級）', 'マグニチュード', '主要動', '初期微動継続時間のグラフ作図', '地震発生時刻の計算', '緊急地震速報からS波到達までの距離の計算'] },
      { no: 6, field: '生物', topic: '光合成と呼吸（ふ入りの葉・BTB溶液）', points: 8, keys: ['デンプン', '師管', '葉緑体', '対照実験の比べ方', '葉のつき方の利点（記述）', '対照実験の目的（記述）', '二酸化炭素の出入りの考察'] },
      { no: 7, field: '化学', topic: 'イオンへのなりやすさと電池', points: 8, keys: ['銀と銅のイオンへのなりやすさ', 'セロハンを使う理由（記述）'] },
      { no: 8, field: '物理', topic: '電熱線の発熱と水の上昇温度', points: 9, keys: ['電力', '熱量', '上昇温度の関係'] },
    ],
  },
  {
    year: '令和7年度',
    avg: 31.4,
    caution: '',
    shoN: 44,
    answerKinds: [{ kind: '用語', n: 14 }, { kind: '記号', n: 19 }, { kind: '数値', n: 5 }, { kind: '記述', n: 4 }, { kind: '並べかえ', n: 1 }, { kind: '作図など', n: 1 }],
    saitenUrl: 'https://www.pref.mie.lg.jp/common/content/001184823.pdf',
    itoUrl: 'https://www.pref.mie.lg.jp/common/content/001184824.pdf',
    items: [
      { no: 1, field: '化学', topic: 'アンモニアの性質（発生・噴水）', points: 4, keys: ['塩化アンモニウムと水酸化カルシウム', '水に溶けやすい性質', 'アルカリ性'] },
      { no: 2, field: '地学', topic: '天気の変化と大気の動き（前線通過）', points: 5, keys: ['気温・風向・風力・天気の読み取り', '天気図'] },
      { no: 3, field: '生物', topic: '細胞のつくり（タマネギとオオカナダモ）', points: 4, keys: ['顕微鏡の操作', '植物細胞の共通点と違い'] },
      { no: 4, field: '物理', topic: '台形ガラスと光の進み方', points: 4, keys: ['屈折', '光の進む向きの変化'] },
      { no: 5, field: '化学', topic: '酸化銀の加熱（熱分解）', points: 8, keys: ['熱分解', '発生した気体の性質', '残った固体（銀）の性質', '質量の関係'] },
      { no: 6, field: '地学', topic: '地層の重なりと広がり', points: 8, keys: ['柱状図', '石灰岩の層', 'かぎ層', '地層の傾き'] },
      { no: 7, field: '生物', topic: 'メンデルの実験と遺伝の規則性', points: 8, keys: ['対立形質', '分離の法則', '子と孫の形質の比'] },
      { no: 8, field: '物理', topic: '物体にはたらく力（直方体）', points: 9, keys: ['力のつり合い', '圧力', '浮力'] },
    ],
  },
  {
    year: '令和6年度',
    avg: 32.2,
    caution: '',
    shoN: 45,
    answerKinds: [{ kind: '用語', n: 14 }, { kind: '記号', n: 19 }, { kind: '数値', n: 8 }, { kind: '記述', n: 2 }, { kind: '並べかえ', n: 2 }],
    saitenUrl: 'https://www.pref.mie.lg.jp/common/content/001125175.pdf',
    itoUrl: 'https://www.pref.mie.lg.jp/common/content/001125176.pdf',
    items: [
      { no: 1, field: '生物', topic: '動物の分類（イヌ・ハト・メダカ・イカ・エビ・クワガタ）', points: 4, keys: ['脊椎動物と無脊椎動物', '分類の基準'] },
      { no: 2, field: '地学', topic: '大気圧（ペットボトルがへこむ）', points: 4, keys: ['大気圧', '水蒸気の状態変化', '会話文からの考察'] },
      { no: 3, field: '物理', topic: '凸レンズによる実像', points: 5, keys: ['焦点距離10cm', '実像の位置と大きさ', '作図'] },
      { no: 4, field: '化学', topic: '化学変化と物質の質量（石灰石＋うすい塩酸）', points: 4, keys: ['質量保存の法則', '密閉容器', '発生した気体の質量'] },
      { no: 5, field: '地学', topic: '火山の活動と火成岩', points: 8, keys: ['斑晶と石基', 'マグマの性質と火山の形', '火成岩の観察'] },
      { no: 6, field: '生物', topic: 'タマネギの根の成長と細胞（体細胞分裂）', points: 8, keys: ['体細胞分裂', '染色', '細胞の大きさの変化', '分裂の順'] },
      { no: 7, field: '化学', topic: '中和（うすい塩酸＋うすい水酸化ナトリウム水溶液）', points: 9, keys: ['中和', '塩', 'イオンの数の変化のグラフ'] },
      { no: 8, field: '物理', topic: '電圧と電流の関係（抵抗器X・Y）', points: 8, keys: ['オームの法則', '直列と並列', '電流のグラフ'] },
    ],
  },
  {
    year: '令和5年度',
    avg: 29.9,
    caution: '',
    shoN: 44,
    answerKinds: [{ kind: '用語', n: 15 }, { kind: '記号', n: 15 }, { kind: '数値', n: 10 }, { kind: '記述', n: 3 }, { kind: '並べかえ', n: 1 }],
    saitenUrl: 'https://www.pref.mie.lg.jp/common/content/001065024.pdf',
    itoUrl: 'https://www.pref.mie.lg.jp/common/content/001065025.pdf',
    items: [
      { no: 1, field: '生物', topic: 'だ液によるデンプンの変化（消化）', points: 4, keys: ['消化酵素', 'ベネジクト液', 'ヨウ素液', '対照実験'] },
      { no: 2, field: '地学', topic: '雲のでき方', points: 4, keys: ['露点', '膨張と気温', '水蒸気'] },
      { no: 3, field: '物理', topic: '音の大きさ・高さと弦の振動', points: 5, keys: ['振幅', '振動数', '弦の長さと太さ'] },
      { no: 4, field: '化学', topic: '水とエタノールの混合物からエタノールをとり出す（蒸留）', points: 4, keys: ['蒸留', '沸点', '試験管に集めた液体の比較'] },
      { no: 5, field: '地学', topic: '星座の1年間の見かけの動き（年周運動）', points: 8, keys: ['年周運動', '地球の公転', '南中時刻の変化'] },
      { no: 6, field: '生物', topic: '植物の葉や茎のつくりとはたらき', points: 8, keys: ['蒸散', '気孔', '維管束', '道管と師管'] },
      { no: 7, field: '化学', topic: '銅の酸化と酸化銅の還元', points: 9, keys: ['酸化', '還元', '炭素との反応', '質量の比'] },
      { no: 8, field: '物理', topic: '道具を使う仕事と仕事の能率', points: 8, keys: ['仕事', '仕事の原理', '仕事率', '動滑車'] },
    ],
  },
  {
    year: '令和4年度',
    avg: 28.7,
    caution: '',
    shoN: 45,
    answerKinds: [{ kind: '用語', n: 17 }, { kind: '記号', n: 20 }, { kind: '数値', n: 4 }, { kind: '並べかえ', n: 3 }, { kind: '作図など', n: 1 }],
    saitenUrl: 'https://www.pref.mie.lg.jp/common/content/001003785.pdf',
    itoUrl: 'https://www.pref.mie.lg.jp/common/content/001003786.pdf',
    items: [
      { no: 1, field: '物理', topic: '光の進み方（半円形レンズと全円分度器）', points: 4, keys: ['入射角と屈折角', '全反射', '作図'] },
      { no: 2, field: '地学', topic: '金星の観測（太陽・金星・地球の位置関係）', points: 4, keys: ['惑星', '見える方位と時刻', '見かけの形の変化', '真夜中に見えない理由'] },
      { no: 3, field: '生物', topic: '遺伝の規則性（メダカの体色）', points: 4, keys: ['顕性形質', '分離の法則', '子と孫の比'] },
      { no: 4, field: '化学', topic: '水の温度によるとけ方のちがい（塩化ナトリウム・硝酸カリウム・ミョウバン）', points: 5, keys: ['溶解度曲線', '再結晶', '質量パーセント濃度'] },
      { no: 5, field: '生物', topic: '植物の観察と分類（マツ・アブラナ・ツツジ・イヌワラビ・スギゴケ）', points: 8, keys: ['スケッチのしかた', '裸子植物と被子植物', '子葉の枚数と茎の断面', '離弁花類'] },
      { no: 6, field: '化学', topic: '金属のイオンへのなりやすさと電池のしくみ', points: 8, keys: ['化学反応式', '素焼きの容器を使う理由', 'ダニエル電池'] },
      { no: 7, field: '地学', topic: '前線の通過と天気の変化・日本の天気（天気図の読み取り）', points: 8, keys: ['等圧線からの気圧の読み取り', '前線の通過と風向', '冬の気圧配置'] },
      { no: 8, field: '物理', topic: 'モーターのしくみ（先生との会話文）', points: 9, keys: ['電流が磁界から受ける力', '整流子のはたらき', '実験の注意点'] },
    ],
  },
]

/** 5年分からわかること */
export const RIKA_TREND_FINDINGS: readonly {
  heading: string
  body: string
}[] = [
  { heading: '① 4分野2題ずつ・50点・8大問は完全に固定', body: '令和4年度から令和8年度まで5年連続で、8大問・50点満点・生物／物理／化学／地学が各2題という形が1度も崩れていない。大問1〜4が各4〜5点の軽い題（合計17点）、大問5〜8が各8〜9点の重い題（合計33点）。同じ分野の2題が必ず「軽い方」と「重い方」に分かれる。' },
  { heading: '② 出題は「実験・観察の場面」から始まる', body: '5年間すべての大問が〈実験〉〈観察〉またはノート・会話文から始まっている。用語をそのまま聞く問いは少なく、器具の操作手順、対照実験の目的、結果の読み取りが問われる。用語を覚えるだけでは届かない。' },
  { heading: '③ 記述（文で書かせる問い）が毎年必ず出る', body: '令和8年度では「光と音の速さのちがい（光・音の2語を使う）」「無性生殖で親と同じ形質になる理由（遺伝子を使う）」「葉のつき方の利点」「対照実験の目的（試験管RのBTB溶液の色の変化は…に続けて）」「セロハンを使う理由」が記述だった。使う語を指定する形と、書き出しを指定する形の2通りがある。' },
  { heading: '④ 計算と作図も毎年出る', body: '令和8年度は、黒点の直径（地球の何倍か・四捨五入の指定つき）、音の速さ（平均値を使う）、地震発生時刻、緊急地震速報からS波到達までの距離、初期微動継続時間のグラフ作図。四捨五入の位まで指定されるので、指示を読み落とすと失点する。' },
  { heading: '⑤ 同じ題材が数年おきに戻ってくる', body: '蒸留は令和5年度（大問4・4点）と令和8年度（大問4・4点）。遺伝は令和4年度（メダカ）と令和7年度（メンデル）。イオンへのなりやすさと電池は令和4年度（大問6）と令和8年度（大問7）。天気・気象は令和4年度・令和5年度・令和6年度・令和7年度・令和8年度と毎年ある。光と音も5年間毎年出ている。3〜4年周期で戻ってくる題材がある。' },
  { heading: '⑥ 平均点は5年間ずっと30点前後', body: '令和4年度 28.7／令和5年度 29.9／令和6年度 32.2／令和7年度 31.4／令和8年度 29.2（いずれも後期選抜・全日制の合格者平均、50点満点）。5教科の中で理科が最も低い年もある。半分強が取れれば平均。' },
  { heading: '⑦ 県の「出題意図」は3点だけ', body: '令和8年度の出題意図（理科）は、(1) 基礎的・基本的な知識と観察・実験の技能、(2) 結果を分析して解釈する力・表現する力、(3) 概念や原理・法則を日常生活や社会に関連付けて考える力、の3つ。緊急地震速報や打ち上げ花火が題材になるのは (3) にあたる。' },
]

/** どう対策するか */
export const RIKA_TREND_ADVICE: readonly string[] = ['大問5〜8（各8〜9点）で33点。ここを取れるかで決まる。重い方の4題は必ず4分野に1題ずつなので、苦手分野を1つ残すと最大9点失う。', '実験器具の操作手順（ガスバーナー、顕微鏡、電流計・電圧計）は順番で問われる。手順を言葉で言えるようにする。', '対照実験は「何を明らかにするために、どの2つを比べるか」を言えるようにする。令和8年度は試験管Sの目的、葉のA〜Dのどれとどれを比べるかが問われた。', '記述は指定語・書き出しつきで出る。指定を守って40字程度で書く練習をする。', '計算は四捨五入の位まで指定される。答えの形（整数・小数第1位まで・単位）を必ず確認する。', '作図（グラフに点を打って線を引く）は毎年ではないが出る。表から値を計算して打点する練習をしておく。', '平均が30点前後なので、まず基礎的な用語と各分野の軽い題（大問1〜4の17点）を確実に取り、そのうえで重い題の前半の小問を拾うのが現実的。']

/** プリントの傾向欄との突き合わせ */
export const RIKA_TREND_DIFF = {
  heading: 'プリントの傾向欄との違い',
  printSays: ['物理・化学・生物・地学の各分野が2題ずつ出題（1題は大問1〜4、もう1題は大問5〜8）される。学年別にみても偏りなく、各学年で学習した内容からまんべんなく出題されている。', '過去15年では、出題傾向に変化が見られ、中1物理範囲からの出題が増えている。また平成31年度以降環境に関わる単元からの出題はなくなっている。実験問題が多いため、実験形式で理解をすることが大切である。'],
  printOnly: ['プリントの「今年の予想」欄には「植物の融合問題（顕微鏡・花のつくりと分類、または光合成の対照実験）」「動物の融合問題（血液循環や血液中の成分のはたらき、または感覚と運動）」と書かれている。', '令和8年度の生物2題は「無性生殖と有性生殖」（大問3）と「光合成と呼吸・ふ入りの葉とBTB溶液」（大問6）だった。プリントの予想のうち「光合成の対照実験」は当たっている。血液循環・感覚と運動は令和8年度には出ていないので、次に出る可能性は残っている。'],
  checked: [
  { claim: '4分野が2題ずつ、1題は大問1〜4・もう1題は大問5〜8', result: '令和4〜8年度の5年分すべてで、生物・物理・化学・地学が各2題、うち1題が大問1〜4（4〜5点）、もう1題が大問5〜8（8〜9点）だった。配点の合計も5年すべて50点で一致した。', verdict: '正しい' },
  { claim: '中1物理範囲からの出題が増えている', result: '令和4年度に光の進み方（大問1）、令和5年度に音と弦（大問3）、令和6年度に凸レンズ（大問3）、令和7年度に台形ガラスの屈折（大問4）、令和8年度に音の速さ（大問2）。5年間毎年、中1範囲の光か音が大問1〜4の軽い題として入っている。', verdict: '5年分では確認できる' },
  { claim: '平成31年度以降、環境に関わる単元からの出題はなくなっている', result: '令和4〜8年度の40題（8大問×5年）を確認したが、生態系・食物連鎖・地球環境を主題にした大問は1題もなかった。', verdict: '5年分では確認できる' },
  { claim: '実験問題が多い', result: '40題すべてが〈実験〉〈観察〉、または生徒のノート・会話文から始まっていた。用語だけを問う大問は5年間で1題もなかった。', verdict: '正しい' },
  ] as readonly { claim: string; result: string; verdict: string }[],
}
