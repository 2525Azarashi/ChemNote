/**
 * ===================================================================
 * 章インデックス（自動生成ファイル・手で編集しないこと）
 * ===================================================================
 *
 * ★このファイルは scripts/gen-chapter-index.mts が生成する。★
 * 手で書き換えても次の生成で消えるので、直したい場合は
 * 教科データ本体（src/data/*.ts）を直してから
 *
 *     npm run gen:index
 *
 * を実行すること。
 *
 * -------------------------------------------------------------------
 * ■ これは何か
 * -------------------------------------------------------------------
 * 教科データから「章ID・章名・その章の大問数」だけを抜いた軽い索引。
 * 問題文・選択肢・解説は含まない。
 *
 * ホーム画面（Home.tsx）は起動直後に必ず出るが、出しているのは
 * 進捗の数字と次の章名だけで、問題文は1文字も表示していない。
 * それにも関わらず教科データ本体を全部読み込んでいたため、
 * 起動時に src/data から 50 ファイル・約 2.6MB を読んでいた。
 * この索引に切り替えると、ホームが読むのはこのファイル1枚だけになる。
 *
 * 問題を増やしてもこのファイルは章の数（現在 162 章）ぶんしか増えない。
 * 「問題数が莫大になっても起動が重くならない」ことがこの索引の目的である。
 *
 * -------------------------------------------------------------------
 * ■ 中身が本体とズレないこと
 * -------------------------------------------------------------------
 * tests/chapterIndex.test.ts が、教科データ本体から数え直した結果と
 * この索引を1件ずつ突き合わせる。問題を足して再生成を忘れると
 * そのテストが落ちるので、古い索引のままリリースされることはない。
 *
 * -------------------------------------------------------------------
 * ■ このファイルは他の src を一切 import しない（葉モジュール）
 * -------------------------------------------------------------------
 * ここから教科データを import してしまうと、索引にした意味が無くなる
 * （結局本体が読み込まれる）。★何も import しないことが仕様である。★
 */

/** 章1つぶんの索引。フィールド名は Home.tsx が元々読んでいたものと同じ。 */
export interface ChapterIndexEntry {
  id: string;
  title?: string;
  abstractTitle?: string;
  /** この章の大問数（miniTest ＋ practiceProblems） */
  problemCount: number;
}

/** 教科1つぶんの索引。並び順・表示名も持たせて、画面が SUBJECTS を見ずに済むようにしている。 */
export interface SubjectIndexEntry {
  id: string;
  /** 画面に出す教科名（data/allChapters.ts の SUBJECTS の label と同じ） */
  label: string;
  chapters: readonly ChapterIndexEntry[];
}

/**
 * 教科の索引一覧。
 *
 * ★並び順は data/allChapters.ts の SUBJECTS と同じ★
 * （ホーム画面の教科別進捗はこの順に縦に並ぶため、順序が意味を持つ）。
 * 一致は tests/chapterIndex.test.ts が検査する。
 */
export const SUBJECT_INDEX: readonly SubjectIndexEntry[] = [
  {
    "id": "chemistry_basic",
    "label": "化学基礎",
    "chapters": [
      {
        "id": "c1_1",
        "problemCount": 8,
        "abstractTitle": "① 純物質と混合物"
      },
      {
        "id": "c1_2_A",
        "problemCount": 11,
        "abstractTitle": "②-A 物質の分離と精製"
      },
      {
        "id": "c1_2_B",
        "problemCount": 10,
        "abstractTitle": "②-B 物質の構成と成分元素の検出"
      },
      {
        "id": "c1_3",
        "problemCount": 5,
        "abstractTitle": "③ 粒子の熱運動と物質の三態"
      },
      {
        "id": "c2_1",
        "problemCount": 14,
        "abstractTitle": "① 原子の構造と電子配置・元素の周期表"
      },
      {
        "id": "c2_2",
        "problemCount": 5,
        "abstractTitle": "② イオン"
      },
      {
        "id": "c2_3",
        "problemCount": 4,
        "abstractTitle": "③ イオン生成とエネルギー"
      },
      {
        "id": "c2_4",
        "problemCount": 8,
        "abstractTitle": "④ 原子の大きさとイオンの大きさ"
      },
      {
        "id": "c3_1",
        "problemCount": 4,
        "abstractTitle": "① 結合の種類"
      },
      {
        "id": "c3_2",
        "problemCount": 18,
        "abstractTitle": "② 結晶の種類と性質"
      },
      {
        "id": "c3_3",
        "problemCount": 6,
        "abstractTitle": "③ 分子の相互作用と性質"
      },
      {
        "id": "c4_1",
        "problemCount": 7,
        "abstractTitle": "① 原子量"
      },
      {
        "id": "c4_2",
        "problemCount": 8,
        "abstractTitle": "② 物質量"
      },
      {
        "id": "c4_3",
        "problemCount": 5,
        "abstractTitle": "③ 化学反応式とイオン反応式の作り方"
      },
      {
        "id": "c4_4",
        "problemCount": 5,
        "abstractTitle": "④ 濃度"
      },
      {
        "id": "c5_1",
        "problemCount": 2,
        "abstractTitle": "① 酸と塩基の定義"
      },
      {
        "id": "c5_2",
        "problemCount": 3,
        "abstractTitle": "② 酸と塩基の強さ"
      },
      {
        "id": "c5_3",
        "problemCount": 9,
        "abstractTitle": "③ pHについて"
      },
      {
        "id": "c5_4",
        "problemCount": 8,
        "abstractTitle": "④ 中和とは何か"
      },
      {
        "id": "c5_5",
        "problemCount": 3,
        "abstractTitle": "⑤ 中和反応の計算"
      },
      {
        "id": "c5_6",
        "problemCount": 3,
        "abstractTitle": "⑥ 中和滴定の道具と方法"
      },
      {
        "id": "c5_7",
        "problemCount": 2,
        "abstractTitle": "⑦ 滴定曲線と二段階滴定"
      },
      {
        "id": "c6_1",
        "problemCount": 6,
        "abstractTitle": "① 酸化と還元・酸化数"
      },
      {
        "id": "c6_2",
        "problemCount": 4,
        "abstractTitle": "② 半反応式と酸化還元反応式"
      },
      {
        "id": "c6_3",
        "problemCount": 5,
        "abstractTitle": "③ 酸化還元滴定と量的関係"
      },
      {
        "id": "c6_4",
        "problemCount": 2,
        "abstractTitle": "④ 酸化力・還元力の強さ"
      },
      {
        "id": "c6_5",
        "problemCount": 3,
        "abstractTitle": "⑤ 金属のイオン化傾向"
      },
      {
        "id": "c6_6",
        "problemCount": 2,
        "abstractTitle": "⑥ 電池"
      },
      {
        "id": "c6_7",
        "problemCount": 4,
        "abstractTitle": "⑦ 金属の製錬と電気分解"
      }
    ]
  },
  {
    "id": "chemistry",
    "label": "化学",
    "chapters": [
      {
        "id": "a1_1",
        "problemCount": 1,
        "abstractTitle": "① 粒子の熱運動と物質の三態"
      },
      {
        "id": "a1_2",
        "problemCount": 0,
        "abstractTitle": "② 気液平衡と蒸気圧"
      },
      {
        "id": "a1_3",
        "problemCount": 0,
        "abstractTitle": "③ 状態図"
      },
      {
        "id": "a1_4",
        "problemCount": 0,
        "abstractTitle": "④ ボイル・シャルルの法則"
      },
      {
        "id": "a1_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 気体の状態方程式"
      },
      {
        "id": "a1_6",
        "problemCount": 0,
        "abstractTitle": "⑥ 混合気体と分圧"
      },
      {
        "id": "a1_7",
        "problemCount": 0,
        "abstractTitle": "⑦ 理想気体と実在気体"
      },
      {
        "id": "a2_1",
        "problemCount": 0,
        "abstractTitle": "① 溶解のしくみ"
      },
      {
        "id": "a2_2",
        "problemCount": 0,
        "abstractTitle": "② 固体の溶解度"
      },
      {
        "id": "a2_3",
        "problemCount": 0,
        "abstractTitle": "③ 気体の溶解度"
      },
      {
        "id": "a2_4",
        "problemCount": 0,
        "abstractTitle": "④ 希薄溶液の性質（沸点上昇・凝固点降下）"
      },
      {
        "id": "a2_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 浸透圧"
      },
      {
        "id": "a2_6",
        "problemCount": 0,
        "abstractTitle": "⑥ コロイド"
      },
      {
        "id": "a3_1",
        "problemCount": 9,
        "abstractTitle": "① 反応エンタルピー"
      },
      {
        "id": "a3_2",
        "problemCount": 5,
        "abstractTitle": "② ヘスの法則"
      },
      {
        "id": "a3_3",
        "problemCount": 4,
        "abstractTitle": "③ 結合エネルギー"
      },
      {
        "id": "a3_4",
        "problemCount": 1,
        "abstractTitle": "④ 光とエネルギー"
      },
      {
        "id": "a4_1",
        "problemCount": 0,
        "abstractTitle": "① 電池のしくみと種類"
      },
      {
        "id": "a4_2",
        "problemCount": 0,
        "abstractTitle": "② 電気分解のしくみ"
      },
      {
        "id": "a4_3",
        "problemCount": 0,
        "abstractTitle": "③ 電気量と物質量（ファラデーの法則）"
      },
      {
        "id": "a5_1",
        "problemCount": 0,
        "abstractTitle": "① 反応速度の表し方"
      },
      {
        "id": "a5_2",
        "problemCount": 0,
        "abstractTitle": "② 反応速度を変える条件"
      },
      {
        "id": "a5_3",
        "problemCount": 0,
        "abstractTitle": "③ 反応速度式"
      },
      {
        "id": "a6_1",
        "problemCount": 0,
        "abstractTitle": "① 可逆反応と化学平衡"
      },
      {
        "id": "a6_2",
        "problemCount": 0,
        "abstractTitle": "② 平衡定数"
      },
      {
        "id": "a6_3",
        "problemCount": 0,
        "abstractTitle": "③ 平衡移動（ルシャトリエの原理）"
      },
      {
        "id": "a6_4",
        "problemCount": 0,
        "abstractTitle": "④ 電離平衡"
      },
      {
        "id": "a6_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 緩衝液と塩の加水分解"
      },
      {
        "id": "a6_6",
        "problemCount": 0,
        "abstractTitle": "⑥ 溶解度積"
      },
      {
        "id": "a7_1",
        "problemCount": 0,
        "abstractTitle": "① 周期表と元素の分類"
      },
      {
        "id": "a7_2",
        "problemCount": 0,
        "abstractTitle": "② 水素と希ガス"
      },
      {
        "id": "a7_3",
        "problemCount": 0,
        "abstractTitle": "③ ハロゲン（17族）"
      },
      {
        "id": "a7_4",
        "problemCount": 0,
        "abstractTitle": "④ 酸素・硫黄（16族）"
      },
      {
        "id": "a7_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 窒素・リン（15族）"
      },
      {
        "id": "a7_6",
        "problemCount": 0,
        "abstractTitle": "⑥ 炭素・ケイ素（14族）"
      },
      {
        "id": "a7_7",
        "problemCount": 0,
        "abstractTitle": "⑦ 気体の製法と性質のまとめ"
      },
      {
        "id": "a8_1",
        "problemCount": 0,
        "abstractTitle": "① アルカリ金属（1族）"
      },
      {
        "id": "a8_2",
        "problemCount": 0,
        "abstractTitle": "② アルカリ土類金属（2族）"
      },
      {
        "id": "a8_3",
        "problemCount": 0,
        "abstractTitle": "③ アルミニウム・亜鉛（両性金属）"
      },
      {
        "id": "a8_4",
        "problemCount": 0,
        "abstractTitle": "④ スズ・鉛"
      },
      {
        "id": "a9_1",
        "problemCount": 0,
        "abstractTitle": "① 遷移元素の特徴"
      },
      {
        "id": "a9_2",
        "problemCount": 0,
        "abstractTitle": "② 鉄"
      },
      {
        "id": "a9_3",
        "problemCount": 0,
        "abstractTitle": "③ 銅・銀"
      },
      {
        "id": "a9_4",
        "problemCount": 0,
        "abstractTitle": "④ クロム・マンガン"
      },
      {
        "id": "a9_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 錯イオンと配位結合"
      },
      {
        "id": "a9_6",
        "problemCount": 0,
        "abstractTitle": "⑥ 金属イオンの分離と系統分析"
      },
      {
        "id": "a10_1",
        "problemCount": 0,
        "abstractTitle": "① 有機化合物の特徴と分類"
      },
      {
        "id": "a10_2",
        "problemCount": 0,
        "abstractTitle": "② 元素分析と組成式の決定"
      },
      {
        "id": "a10_3",
        "problemCount": 0,
        "abstractTitle": "③ 異性体"
      },
      {
        "id": "a11_1",
        "problemCount": 0,
        "abstractTitle": "① アルカン"
      },
      {
        "id": "a11_2",
        "problemCount": 0,
        "abstractTitle": "② アルケン"
      },
      {
        "id": "a11_3",
        "problemCount": 0,
        "abstractTitle": "③ アルキン"
      },
      {
        "id": "a12_1",
        "problemCount": 0,
        "abstractTitle": "① アルコールとエーテル"
      },
      {
        "id": "a12_2",
        "problemCount": 0,
        "abstractTitle": "② アルデヒドとケトン"
      },
      {
        "id": "a12_3",
        "problemCount": 0,
        "abstractTitle": "③ カルボン酸"
      },
      {
        "id": "a12_4",
        "problemCount": 0,
        "abstractTitle": "④ エステルと油脂"
      },
      {
        "id": "a13_1",
        "problemCount": 0,
        "abstractTitle": "① ベンゼンとその構造"
      },
      {
        "id": "a13_2",
        "problemCount": 0,
        "abstractTitle": "② フェノール類"
      },
      {
        "id": "a13_3",
        "problemCount": 0,
        "abstractTitle": "③ 芳香族カルボン酸"
      },
      {
        "id": "a13_4",
        "problemCount": 0,
        "abstractTitle": "④ 芳香族アミンとアゾ化合物"
      },
      {
        "id": "a13_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 有機化合物の分離"
      },
      {
        "id": "a14_1",
        "problemCount": 0,
        "abstractTitle": "① 高分子化合物の基礎"
      },
      {
        "id": "a14_2",
        "problemCount": 0,
        "abstractTitle": "② 糖類（炭水化物）"
      },
      {
        "id": "a14_3",
        "problemCount": 0,
        "abstractTitle": "③ アミノ酸とタンパク質"
      },
      {
        "id": "a14_4",
        "problemCount": 0,
        "abstractTitle": "④ 核酸"
      },
      {
        "id": "a14_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 合成高分子化合物"
      }
    ]
  },
  {
    "id": "english_listening",
    "label": "英語リスニング",
    "chapters": [
      {
        "id": "el1_A",
        "problemCount": 14,
        "abstractTitle": "第1問 A"
      },
      {
        "id": "el1_B",
        "problemCount": 15,
        "abstractTitle": "第1問 B"
      },
      {
        "id": "el2",
        "problemCount": 0,
        "abstractTitle": "第2問"
      },
      {
        "id": "el3",
        "problemCount": 15,
        "abstractTitle": "第3問"
      },
      {
        "id": "el4_A",
        "problemCount": 0,
        "abstractTitle": "第4問 A"
      },
      {
        "id": "el4_B",
        "problemCount": 0,
        "abstractTitle": "第4問 B"
      },
      {
        "id": "el5",
        "problemCount": 0,
        "abstractTitle": "第5問"
      },
      {
        "id": "el6_A",
        "problemCount": 0,
        "abstractTitle": "第6問 A"
      },
      {
        "id": "el6_B",
        "problemCount": 0,
        "abstractTitle": "第6問 B"
      }
    ]
  },
  {
    "id": "math",
    "label": "数学",
    "chapters": [
      {
        "id": "m1_1",
        "problemCount": 2,
        "abstractTitle": "① 基本公式（累乗・指数・対数・三角）"
      },
      {
        "id": "m1_2",
        "problemCount": 2,
        "abstractTitle": "② f(ax+b) 型（1/a 倍を忘れない）"
      },
      {
        "id": "m1_3",
        "problemCount": 2,
        "abstractTitle": "③ 微分接触型（置換積分の主役）"
      },
      {
        "id": "m1_4",
        "problemCount": 2,
        "abstractTitle": "④ log 型（分子が分母の微分）"
      },
      {
        "id": "m1_5",
        "problemCount": 2,
        "abstractTitle": "⑤ 部分積分（消去型）"
      },
      {
        "id": "m1_6",
        "problemCount": 1,
        "abstractTitle": "⑥ 部分積分（同形出現・2回転）"
      },
      {
        "id": "m1_7",
        "problemCount": 1,
        "abstractTitle": "⑦ 部分分数分解"
      },
      {
        "id": "m1_8",
        "problemCount": 2,
        "abstractTitle": "⑧ sin・cos の n 乗（次数下げと接触）"
      },
      {
        "id": "m1_9",
        "problemCount": 1,
        "abstractTitle": "⑨ 積和公式・tan の処理"
      },
      {
        "id": "m1_10",
        "problemCount": 3,
        "abstractTitle": "⑩ x = a sinθ・x = a tanθ・その他の置換"
      },
      {
        "id": "m2_1",
        "problemCount": 2,
        "abstractTitle": "⑪ 偶関数・奇関数と King Property"
      },
      {
        "id": "m2_2",
        "problemCount": 3,
        "abstractTitle": "⑫ 定積分で表された関数・区分求積・漸化式"
      },
      {
        "id": "mv_1",
        "problemCount": 2,
        "abstractTitle": "① 演算・成分・大きさ・単位ベクトル"
      },
      {
        "id": "mv_2",
        "problemCount": 2,
        "abstractTitle": "② 内積・なす角・垂直条件・|a+tb|の最小"
      },
      {
        "id": "mv_3",
        "problemCount": 2,
        "abstractTitle": "③ 内分・外分・重心"
      },
      {
        "id": "mv_4",
        "problemCount": 2,
        "abstractTitle": "④ 交点（係数比較）・共線条件 s+t=1"
      },
      {
        "id": "mv_5",
        "problemCount": 2,
        "abstractTitle": "⑤ 三角形の面積・正射影ベクトル"
      },
      {
        "id": "mv_6",
        "problemCount": 2,
        "abstractTitle": "⑥ 直線・円のベクトル方程式"
      },
      {
        "id": "mv_7",
        "problemCount": 2,
        "abstractTitle": "⑦ 空間の成分・内積・垂直・距離"
      },
      {
        "id": "mv_8",
        "problemCount": 2,
        "abstractTitle": "⑧ 共面条件 s+t+u=1・球面"
      },
      {
        "id": "mp_1",
        "problemCount": 2,
        "abstractTitle": "① P と C の使い分け・最短経路"
      },
      {
        "id": "mp_2",
        "problemCount": 2,
        "abstractTitle": "② 円順列・重複順列・組分け"
      },
      {
        "id": "mp_3",
        "problemCount": 2,
        "abstractTitle": "③ 同様に確からしい・サイコロ・玉"
      },
      {
        "id": "mp_4",
        "problemCount": 2,
        "abstractTitle": "④ 余事象・和事象"
      },
      {
        "id": "mp_5",
        "problemCount": 2,
        "abstractTitle": "⑤ 反復試行・優勝決定の確率"
      },
      {
        "id": "mp_6",
        "problemCount": 2,
        "abstractTitle": "⑥ 条件付き確率・原因の確率"
      },
      {
        "id": "mp_7",
        "problemCount": 2,
        "abstractTitle": "⑦ 期待値"
      },
      {
        "id": "mp_8",
        "problemCount": 2,
        "abstractTitle": "⑧ 総合問題（パターンの融合）"
      },
      {
        "id": "mi_1",
        "problemCount": 2,
        "abstractTitle": "① 約数の個数・総和・最大公約数と最小公倍数"
      },
      {
        "id": "mi_2",
        "problemCount": 2,
        "abstractTitle": "② ユークリッドの互除法・ax+by=c の整数解"
      },
      {
        "id": "mi_3",
        "problemCount": 2,
        "abstractTitle": "③ 積の形×約数の組合せ・素数条件"
      },
      {
        "id": "mi_4",
        "problemCount": 2,
        "abstractTitle": "④ 余りの計算・余りで分類する証明"
      },
      {
        "id": "mi_5",
        "problemCount": 2,
        "abstractTitle": "⑤ 範囲の絞り込み・n進法"
      }
    ]
  },
  {
    "id": "biology_basic",
    "label": "生物基礎",
    "chapters": [
      {
        "id": "bio1_1",
        "problemCount": 5,
        "abstractTitle": "① 生物の共通性・細胞・代謝・酵素・顕微鏡"
      },
      {
        "id": "bio2_1",
        "problemCount": 5,
        "abstractTitle": "② DNA・複製・転写翻訳・ゲノム"
      },
      {
        "id": "bio3_1",
        "problemCount": 6,
        "abstractTitle": "③ 体液・肝腎・自律神経・ホルモン・免疫"
      },
      {
        "id": "bio4_1",
        "problemCount": 4,
        "abstractTitle": "④ 植生・遷移・バイオーム"
      },
      {
        "id": "bio5_1",
        "problemCount": 4,
        "abstractTitle": "⑤ 生態系・物質循環・環境保全"
      }
    ]
  },
  {
    "id": "english_grammar",
    "label": "英文法",
    "chapters": [
      {
        "id": "eg1_1",
        "problemCount": 1,
        "abstractTitle": "① 基本5文型と自動詞・他動詞"
      },
      {
        "id": "eg1_2",
        "problemCount": 1,
        "abstractTitle": "② 基本時制と時制の一致"
      },
      {
        "id": "eg1_3",
        "problemCount": 1,
        "abstractTitle": "③ 完了形（現在・過去・未来）"
      },
      {
        "id": "eg1_4",
        "problemCount": 1,
        "abstractTitle": "④ 助動詞と助動詞＋have p.p."
      },
      {
        "id": "eg1_5",
        "problemCount": 1,
        "abstractTitle": "⑤ 受動態・知覚動詞・使役動詞"
      },
      {
        "id": "eg2_1",
        "problemCount": 1,
        "abstractTitle": "⑥ 不定詞（3用法と重要構文）"
      },
      {
        "id": "eg2_2",
        "problemCount": 1,
        "abstractTitle": "⑦ 動名詞と to do / doing の使い分け"
      },
      {
        "id": "eg2_3",
        "problemCount": 1,
        "abstractTitle": "⑧ 分詞と分詞構文"
      },
      {
        "id": "eg2_4",
        "problemCount": 1,
        "abstractTitle": "⑨ 関係代名詞（格と what・that）"
      },
      {
        "id": "eg2_5",
        "problemCount": 1,
        "abstractTitle": "⑩ 関係副詞と複合関係詞"
      },
      {
        "id": "eg3_1",
        "problemCount": 1,
        "abstractTitle": "⑪ 仮定法過去・過去完了・未来"
      },
      {
        "id": "eg3_2",
        "problemCount": 1,
        "abstractTitle": "⑫ if を使わない仮定表現"
      },
      {
        "id": "eg3_3",
        "problemCount": 1,
        "abstractTitle": "⑬ 原級・比較級・最上級と重要表現"
      },
      {
        "id": "eg3_4",
        "problemCount": 1,
        "abstractTitle": "⑭ 強調・倒置・省略・同格・無生物主語"
      },
      {
        "id": "eg4_1",
        "problemCount": 1,
        "abstractTitle": "⑮ 動詞の語法（自他・語形・型）"
      },
      {
        "id": "eg4_2",
        "problemCount": 1,
        "abstractTitle": "⑯ 名詞・代名詞・冠詞の語法"
      },
      {
        "id": "eg4_3",
        "problemCount": 1,
        "abstractTitle": "⑰ 形容詞・副詞の語法"
      },
      {
        "id": "eg4_4",
        "problemCount": 1,
        "abstractTitle": "⑱ 前置詞の語法"
      },
      {
        "id": "eg5_1",
        "problemCount": 1,
        "abstractTitle": "⑲ 動詞を含む熟語・群動詞"
      },
      {
        "id": "eg5_2",
        "problemCount": 1,
        "abstractTitle": "⑳ 会話表現と多義語・語い"
      }
    ]
  }
];

/**
 * 指定した教科の章索引を返す。
 *
 * 未知の教科IDのときは空配列ではなく先頭の教科（化学基礎）を返す。
 * これは data/allChapters.ts の getChaptersOfSubject と同じ既定の振る舞いで、
 * 画面が空にならないようにするためのもの。
 */
export function getChapterIndexOfSubject(
  subjectId: string | null | undefined,
): readonly ChapterIndexEntry[] {
  const entry = SUBJECT_INDEX.find((subject) => subject.id === subjectId) ?? SUBJECT_INDEX[0];
  return entry ? entry.chapters : [];
}

/**
 * 科目選択画面（タイトル画面）のカードに出す「収録ボリューム」の数字。
 *
 * -------------------------------------------------------------------
 * ■ なぜここに数字を置くのか
 * -------------------------------------------------------------------
 * 科目選択画面はオンボーディング直後に必ず出る画面だが、
 * 教科データから取っていたのは
 *
 *     「全29単元・演習174問」「配点100点・マーク37個」
 *
 * のような★数字だけ★で、問題文は1文字も表示していない。
 * それにも関わらず6教科ぶんのデータを丸ごと読み込んでいたため、
 * 依存グラフを辿ると 47 ファイル / 2,578,344 バイトになっていた。
 * 問題を増やせばこの数字がそのまま増える場所だった。
 *
 * -------------------------------------------------------------------
 * ■ 数字がズレない仕組み
 * -------------------------------------------------------------------
 * この値は生成時に★本物の集計関数★
 * （getListeningStats / getMathStats / getBiologyStats /
 *   getGrammarStats / countProblemsInChapters）を実際に呼び、
 * その戻り値をそのまま埋め込んだものである。
 * さらに tests/chapterIndex.test.ts が実行時にも本物の関数と
 * 1フィールドずつ突き合わせるので、
 * 問題を足して再生成を忘れるとテストが落ちる。
 *
 * 教科ごとに持っているキーが違うのは意図的で、
 * カードに出す数字の種類が教科ごとに違うため
 * （無理に統一するとカードの文言が変わってしまう）。
 */
export interface SubjectStatsEntry {
  chapters?: number;
  questions?: number;
  sections?: number;
  units?: number;
  points?: number;
  marks?: number;
}

export const SUBJECT_STATS: Readonly<Record<string, SubjectStatsEntry>> = {
  "chemistry_basic": {
    "chapters": 29,
    "questions": 174
  },
  "chemistry": {
    "chapters": 66,
    "questions": 20
  },
  "english_listening": {
    "sections": 6,
    "units": 9,
    "points": 100,
    "marks": 37,
    "questions": 44
  },
  "math": {
    "chapters": 33,
    "questions": 65
  },
  "biology_basic": {
    "chapters": 5,
    "questions": 24
  },
  "english_grammar": {
    "chapters": 20,
    "questions": 20,
    "marks": 100
  }
};

/**
 * 指定した教科の収録ボリュームを返す。
 *
 * 未知の教科IDでも画面が壊れないよう、空オブジェクトを返す
 * （呼び出し側は数字が undefined のときの表示を持っている）。
 */
export function getSubjectStats(subjectId: string | null | undefined): SubjectStatsEntry {
  return SUBJECT_STATS[String(subjectId)] ?? {};
}
