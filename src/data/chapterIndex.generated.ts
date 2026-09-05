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
  /**
   * 教科書上の章名（例「1章 物質の構成」）。
   *
   * 先生ダッシュボードの章名は `abstractTitle || realTitle || id` で決まるため、
   * abstractTitle が無い章のために必要。現在の実データでは全章が
   * abstractTitle を持っているので出番は無いが、無いと将来
   * 章名の代わりに生の章IDが表示される（しかも気づけない）。
   */
  realTitle?: string;
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
        "abstractTitle": "① 純物質と混合物",
        "realTitle": "1章 物質の構成"
      },
      {
        "id": "c1_2_A",
        "problemCount": 11,
        "abstractTitle": "②-A 物質の分離と精製",
        "realTitle": "1章 物質の構成"
      },
      {
        "id": "c1_2_B",
        "problemCount": 10,
        "abstractTitle": "②-B 物質の構成と成分元素の検出",
        "realTitle": "1章 物質の構成"
      },
      {
        "id": "c1_3",
        "problemCount": 5,
        "abstractTitle": "③ 粒子の熱運動と物質の三態",
        "realTitle": "1章 物質の構成"
      },
      {
        "id": "c2_1",
        "problemCount": 14,
        "abstractTitle": "① 原子の構造と電子配置・元素の周期表",
        "realTitle": "2章 物質の構成粒子"
      },
      {
        "id": "c2_2",
        "problemCount": 5,
        "abstractTitle": "② イオン",
        "realTitle": "2章 物質の構成粒子"
      },
      {
        "id": "c2_3",
        "problemCount": 4,
        "abstractTitle": "③ イオン生成とエネルギー",
        "realTitle": "2章 物質の構成粒子"
      },
      {
        "id": "c2_4",
        "problemCount": 8,
        "abstractTitle": "④ 原子の大きさとイオンの大きさ",
        "realTitle": "2章 物質の構成粒子"
      },
      {
        "id": "c3_1",
        "problemCount": 4,
        "abstractTitle": "① 結合の種類",
        "realTitle": "3章 化学結合"
      },
      {
        "id": "c3_2",
        "problemCount": 18,
        "abstractTitle": "② 結晶の種類と性質",
        "realTitle": "3章 化学結合"
      },
      {
        "id": "c3_3",
        "problemCount": 6,
        "abstractTitle": "③ 分子の相互作用と性質",
        "realTitle": "3章 化学結合"
      },
      {
        "id": "c4_1",
        "problemCount": 7,
        "abstractTitle": "① 原子量",
        "realTitle": "4章 物質量と化学反応式"
      },
      {
        "id": "c4_2",
        "problemCount": 8,
        "abstractTitle": "② 物質量",
        "realTitle": "4章 物質量と化学反応式"
      },
      {
        "id": "c4_3",
        "problemCount": 5,
        "abstractTitle": "③ 化学反応式とイオン反応式の作り方",
        "realTitle": "4章 物質量と化学反応式"
      },
      {
        "id": "c4_4",
        "problemCount": 5,
        "abstractTitle": "④ 濃度",
        "realTitle": "4章 物質量と化学反応式"
      },
      {
        "id": "c5_1",
        "problemCount": 2,
        "abstractTitle": "① 酸と塩基の定義",
        "realTitle": "5章 酸と塩基"
      },
      {
        "id": "c5_2",
        "problemCount": 3,
        "abstractTitle": "② 酸と塩基の強さ",
        "realTitle": "5章 酸と塩基"
      },
      {
        "id": "c5_3",
        "problemCount": 9,
        "abstractTitle": "③ pHについて",
        "realTitle": "5章 酸と塩基"
      },
      {
        "id": "c5_4",
        "problemCount": 8,
        "abstractTitle": "④ 中和とは何か",
        "realTitle": "5章 酸と塩基"
      },
      {
        "id": "c5_5",
        "problemCount": 3,
        "abstractTitle": "⑤ 中和反応の計算",
        "realTitle": "5章 酸と塩基"
      },
      {
        "id": "c5_6",
        "problemCount": 3,
        "abstractTitle": "⑥ 中和滴定の道具と方法",
        "realTitle": "5章 酸と塩基"
      },
      {
        "id": "c5_7",
        "problemCount": 2,
        "abstractTitle": "⑦ 滴定曲線と二段階滴定",
        "realTitle": "5章 酸と塩基"
      },
      {
        "id": "c6_1",
        "problemCount": 6,
        "abstractTitle": "① 酸化と還元・酸化数",
        "realTitle": "6章 酸化還元反応"
      },
      {
        "id": "c6_2",
        "problemCount": 4,
        "abstractTitle": "② 半反応式と酸化還元反応式",
        "realTitle": "6章 酸化還元反応"
      },
      {
        "id": "c6_3",
        "problemCount": 5,
        "abstractTitle": "③ 酸化還元滴定と量的関係",
        "realTitle": "6章 酸化還元反応"
      },
      {
        "id": "c6_4",
        "problemCount": 2,
        "abstractTitle": "④ 酸化力・還元力の強さ",
        "realTitle": "6章 酸化還元反応"
      },
      {
        "id": "c6_5",
        "problemCount": 3,
        "abstractTitle": "⑤ 金属のイオン化傾向",
        "realTitle": "6章 酸化還元反応"
      },
      {
        "id": "c6_6",
        "problemCount": 2,
        "abstractTitle": "⑥ 電池",
        "realTitle": "6章 酸化還元反応"
      },
      {
        "id": "c6_7",
        "problemCount": 4,
        "abstractTitle": "⑦ 金属の製錬と電気分解",
        "realTitle": "6章 酸化還元反応"
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
        "abstractTitle": "① 粒子の熱運動と物質の三態",
        "realTitle": "1章 物質の状態と平衡"
      },
      {
        "id": "a1_2",
        "problemCount": 0,
        "abstractTitle": "② 気液平衡と蒸気圧",
        "realTitle": "1章 物質の状態と平衡"
      },
      {
        "id": "a1_3",
        "problemCount": 0,
        "abstractTitle": "③ 状態図",
        "realTitle": "1章 物質の状態と平衡"
      },
      {
        "id": "a1_4",
        "problemCount": 0,
        "abstractTitle": "④ ボイル・シャルルの法則",
        "realTitle": "1章 物質の状態と平衡"
      },
      {
        "id": "a1_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 気体の状態方程式",
        "realTitle": "1章 物質の状態と平衡"
      },
      {
        "id": "a1_6",
        "problemCount": 0,
        "abstractTitle": "⑥ 混合気体と分圧",
        "realTitle": "1章 物質の状態と平衡"
      },
      {
        "id": "a1_7",
        "problemCount": 0,
        "abstractTitle": "⑦ 理想気体と実在気体",
        "realTitle": "1章 物質の状態と平衡"
      },
      {
        "id": "a2_1",
        "problemCount": 0,
        "abstractTitle": "① 溶解のしくみ",
        "realTitle": "2章 溶液"
      },
      {
        "id": "a2_2",
        "problemCount": 0,
        "abstractTitle": "② 固体の溶解度",
        "realTitle": "2章 溶液"
      },
      {
        "id": "a2_3",
        "problemCount": 0,
        "abstractTitle": "③ 気体の溶解度",
        "realTitle": "2章 溶液"
      },
      {
        "id": "a2_4",
        "problemCount": 0,
        "abstractTitle": "④ 希薄溶液の性質（沸点上昇・凝固点降下）",
        "realTitle": "2章 溶液"
      },
      {
        "id": "a2_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 浸透圧",
        "realTitle": "2章 溶液"
      },
      {
        "id": "a2_6",
        "problemCount": 0,
        "abstractTitle": "⑥ コロイド",
        "realTitle": "2章 溶液"
      },
      {
        "id": "a3_1",
        "problemCount": 9,
        "abstractTitle": "① 反応エンタルピー",
        "realTitle": "3章 化学反応とエネルギー"
      },
      {
        "id": "a3_2",
        "problemCount": 5,
        "abstractTitle": "② ヘスの法則",
        "realTitle": "3章 化学反応とエネルギー"
      },
      {
        "id": "a3_3",
        "problemCount": 4,
        "abstractTitle": "③ 結合エネルギー",
        "realTitle": "3章 化学反応とエネルギー"
      },
      {
        "id": "a3_4",
        "problemCount": 1,
        "abstractTitle": "④ 光とエネルギー",
        "realTitle": "3章 化学反応とエネルギー"
      },
      {
        "id": "a4_1",
        "problemCount": 0,
        "abstractTitle": "① 電池のしくみと種類",
        "realTitle": "4章 電池と電気分解"
      },
      {
        "id": "a4_2",
        "problemCount": 0,
        "abstractTitle": "② 電気分解のしくみ",
        "realTitle": "4章 電池と電気分解"
      },
      {
        "id": "a4_3",
        "problemCount": 0,
        "abstractTitle": "③ 電気量と物質量（ファラデーの法則）",
        "realTitle": "4章 電池と電気分解"
      },
      {
        "id": "a5_1",
        "problemCount": 0,
        "abstractTitle": "① 反応速度の表し方",
        "realTitle": "5章 化学反応の速さ"
      },
      {
        "id": "a5_2",
        "problemCount": 0,
        "abstractTitle": "② 反応速度を変える条件",
        "realTitle": "5章 化学反応の速さ"
      },
      {
        "id": "a5_3",
        "problemCount": 0,
        "abstractTitle": "③ 反応速度式",
        "realTitle": "5章 化学反応の速さ"
      },
      {
        "id": "a6_1",
        "problemCount": 0,
        "abstractTitle": "① 可逆反応と化学平衡",
        "realTitle": "6章 化学平衡"
      },
      {
        "id": "a6_2",
        "problemCount": 0,
        "abstractTitle": "② 平衡定数",
        "realTitle": "6章 化学平衡"
      },
      {
        "id": "a6_3",
        "problemCount": 0,
        "abstractTitle": "③ 平衡移動（ルシャトリエの原理）",
        "realTitle": "6章 化学平衡"
      },
      {
        "id": "a6_4",
        "problemCount": 0,
        "abstractTitle": "④ 電離平衡",
        "realTitle": "6章 化学平衡"
      },
      {
        "id": "a6_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 緩衝液と塩の加水分解",
        "realTitle": "6章 化学平衡"
      },
      {
        "id": "a6_6",
        "problemCount": 0,
        "abstractTitle": "⑥ 溶解度積",
        "realTitle": "6章 化学平衡"
      },
      {
        "id": "a7_1",
        "problemCount": 0,
        "abstractTitle": "① 周期表と元素の分類",
        "realTitle": "7章 非金属元素"
      },
      {
        "id": "a7_2",
        "problemCount": 0,
        "abstractTitle": "② 水素と希ガス",
        "realTitle": "7章 非金属元素"
      },
      {
        "id": "a7_3",
        "problemCount": 4,
        "abstractTitle": "③ ハロゲン（17族）",
        "realTitle": "7章 非金属元素"
      },
      {
        "id": "a7_4",
        "problemCount": 4,
        "abstractTitle": "④ 酸素・硫黄（16族）",
        "realTitle": "7章 非金属元素"
      },
      {
        "id": "a7_5",
        "problemCount": 4,
        "abstractTitle": "⑤ 窒素・リン（15族）",
        "realTitle": "7章 非金属元素"
      },
      {
        "id": "a7_6",
        "problemCount": 0,
        "abstractTitle": "⑥ 炭素・ケイ素（14族）",
        "realTitle": "7章 非金属元素"
      },
      {
        "id": "a7_7",
        "problemCount": 4,
        "abstractTitle": "⑦ 気体の製法と性質のまとめ",
        "realTitle": "7章 非金属元素"
      },
      {
        "id": "a8_1",
        "problemCount": 0,
        "abstractTitle": "① アルカリ金属（1族）",
        "realTitle": "8章 典型金属元素"
      },
      {
        "id": "a8_2",
        "problemCount": 0,
        "abstractTitle": "② アルカリ土類金属（2族）",
        "realTitle": "8章 典型金属元素"
      },
      {
        "id": "a8_3",
        "problemCount": 4,
        "abstractTitle": "③ アルミニウム・亜鉛（両性金属）",
        "realTitle": "8章 典型金属元素"
      },
      {
        "id": "a8_4",
        "problemCount": 0,
        "abstractTitle": "④ スズ・鉛",
        "realTitle": "8章 典型金属元素"
      },
      {
        "id": "a9_1",
        "problemCount": 0,
        "abstractTitle": "① 遷移元素の特徴",
        "realTitle": "9章 遷移元素"
      },
      {
        "id": "a9_2",
        "problemCount": 4,
        "abstractTitle": "② 鉄",
        "realTitle": "9章 遷移元素"
      },
      {
        "id": "a9_3",
        "problemCount": 4,
        "abstractTitle": "③ 銅・銀",
        "realTitle": "9章 遷移元素"
      },
      {
        "id": "a9_4",
        "problemCount": 0,
        "abstractTitle": "④ クロム・マンガン",
        "realTitle": "9章 遷移元素"
      },
      {
        "id": "a9_5",
        "problemCount": 4,
        "abstractTitle": "⑤ 錯イオンと配位結合",
        "realTitle": "9章 遷移元素"
      },
      {
        "id": "a9_6",
        "problemCount": 4,
        "abstractTitle": "⑥ 金属イオンの分離と系統分析",
        "realTitle": "9章 遷移元素"
      },
      {
        "id": "a10_1",
        "problemCount": 0,
        "abstractTitle": "① 有機化合物の特徴と分類",
        "realTitle": "10章 有機化合物の基礎"
      },
      {
        "id": "a10_2",
        "problemCount": 0,
        "abstractTitle": "② 元素分析と組成式の決定",
        "realTitle": "10章 有機化合物の基礎"
      },
      {
        "id": "a10_3",
        "problemCount": 0,
        "abstractTitle": "③ 異性体",
        "realTitle": "10章 有機化合物の基礎"
      },
      {
        "id": "a11_1",
        "problemCount": 0,
        "abstractTitle": "① アルカン",
        "realTitle": "11章 脂肪族炭化水素"
      },
      {
        "id": "a11_2",
        "problemCount": 0,
        "abstractTitle": "② アルケン",
        "realTitle": "11章 脂肪族炭化水素"
      },
      {
        "id": "a11_3",
        "problemCount": 0,
        "abstractTitle": "③ アルキン",
        "realTitle": "11章 脂肪族炭化水素"
      },
      {
        "id": "a12_1",
        "problemCount": 0,
        "abstractTitle": "① アルコールとエーテル",
        "realTitle": "12章 酸素を含む脂肪族化合物"
      },
      {
        "id": "a12_2",
        "problemCount": 0,
        "abstractTitle": "② アルデヒドとケトン",
        "realTitle": "12章 酸素を含む脂肪族化合物"
      },
      {
        "id": "a12_3",
        "problemCount": 0,
        "abstractTitle": "③ カルボン酸",
        "realTitle": "12章 酸素を含む脂肪族化合物"
      },
      {
        "id": "a12_4",
        "problemCount": 0,
        "abstractTitle": "④ エステルと油脂",
        "realTitle": "12章 酸素を含む脂肪族化合物"
      },
      {
        "id": "a13_1",
        "problemCount": 0,
        "abstractTitle": "① ベンゼンとその構造",
        "realTitle": "13章 芳香族化合物"
      },
      {
        "id": "a13_2",
        "problemCount": 0,
        "abstractTitle": "② フェノール類",
        "realTitle": "13章 芳香族化合物"
      },
      {
        "id": "a13_3",
        "problemCount": 0,
        "abstractTitle": "③ 芳香族カルボン酸",
        "realTitle": "13章 芳香族化合物"
      },
      {
        "id": "a13_4",
        "problemCount": 0,
        "abstractTitle": "④ 芳香族アミンとアゾ化合物",
        "realTitle": "13章 芳香族化合物"
      },
      {
        "id": "a13_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 有機化合物の分離",
        "realTitle": "13章 芳香族化合物"
      },
      {
        "id": "a14_1",
        "problemCount": 0,
        "abstractTitle": "① 高分子化合物の基礎",
        "realTitle": "14章 高分子化合物"
      },
      {
        "id": "a14_2",
        "problemCount": 0,
        "abstractTitle": "② 糖類（炭水化物）",
        "realTitle": "14章 高分子化合物"
      },
      {
        "id": "a14_3",
        "problemCount": 0,
        "abstractTitle": "③ アミノ酸とタンパク質",
        "realTitle": "14章 高分子化合物"
      },
      {
        "id": "a14_4",
        "problemCount": 0,
        "abstractTitle": "④ 核酸",
        "realTitle": "14章 高分子化合物"
      },
      {
        "id": "a14_5",
        "problemCount": 0,
        "abstractTitle": "⑤ 合成高分子化合物",
        "realTitle": "14章 高分子化合物"
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
        "abstractTitle": "第1問 A",
        "realTitle": "第1問 A"
      },
      {
        "id": "el1_B",
        "problemCount": 15,
        "abstractTitle": "第1問 B",
        "realTitle": "第1問 B"
      },
      {
        "id": "el2",
        "problemCount": 16,
        "abstractTitle": "第2問",
        "realTitle": "第2問"
      },
      {
        "id": "el3",
        "problemCount": 15,
        "abstractTitle": "第3問",
        "realTitle": "第3問"
      },
      {
        "id": "el4_A",
        "problemCount": 0,
        "abstractTitle": "第4問 A",
        "realTitle": "第4問 A"
      },
      {
        "id": "el4_B",
        "problemCount": 0,
        "abstractTitle": "第4問 B",
        "realTitle": "第4問 B"
      },
      {
        "id": "el5",
        "problemCount": 0,
        "abstractTitle": "第5問",
        "realTitle": "第5問"
      },
      {
        "id": "el6_A",
        "problemCount": 0,
        "abstractTitle": "第6問 A",
        "realTitle": "第6問 A"
      },
      {
        "id": "el6_B",
        "problemCount": 0,
        "abstractTitle": "第6問 B",
        "realTitle": "第6問 B"
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
        "abstractTitle": "① 基本公式（累乗・指数・対数・三角）",
        "realTitle": "1章 不定積分の土台"
      },
      {
        "id": "m1_2",
        "problemCount": 2,
        "abstractTitle": "② f(ax+b) 型（1/a 倍を忘れない）",
        "realTitle": "1章 不定積分の土台"
      },
      {
        "id": "m1_3",
        "problemCount": 2,
        "abstractTitle": "③ 微分接触型（置換積分の主役）",
        "realTitle": "2章 置換積分と微分接触"
      },
      {
        "id": "m1_4",
        "problemCount": 2,
        "abstractTitle": "④ log 型（分子が分母の微分）",
        "realTitle": "2章 置換積分と微分接触"
      },
      {
        "id": "m1_5",
        "problemCount": 2,
        "abstractTitle": "⑤ 部分積分（消去型）",
        "realTitle": "3章 部分積分"
      },
      {
        "id": "m1_6",
        "problemCount": 1,
        "abstractTitle": "⑥ 部分積分（同形出現・2回転）",
        "realTitle": "3章 部分積分"
      },
      {
        "id": "m1_7",
        "problemCount": 1,
        "abstractTitle": "⑦ 部分分数分解",
        "realTitle": "4章 分数関数と部分分数分解"
      },
      {
        "id": "m1_8",
        "problemCount": 2,
        "abstractTitle": "⑧ sin・cos の n 乗（次数下げと接触）",
        "realTitle": "5章 三角関数の積分"
      },
      {
        "id": "m1_9",
        "problemCount": 1,
        "abstractTitle": "⑨ 積和公式・tan の処理",
        "realTitle": "5章 三角関数の積分"
      },
      {
        "id": "m1_10",
        "problemCount": 3,
        "abstractTitle": "⑩ x = a sinθ・x = a tanθ・その他の置換",
        "realTitle": "6章 特殊な置換"
      },
      {
        "id": "m2_1",
        "problemCount": 2,
        "abstractTitle": "⑪ 偶関数・奇関数と King Property",
        "realTitle": "7章 定積分の技巧"
      },
      {
        "id": "m2_2",
        "problemCount": 3,
        "abstractTitle": "⑫ 定積分で表された関数・区分求積・漸化式",
        "realTitle": "7章 定積分の技巧"
      },
      {
        "id": "mv_1",
        "problemCount": 2,
        "abstractTitle": "① 演算・成分・大きさ・単位ベクトル",
        "realTitle": "1章 平面ベクトルの基本"
      },
      {
        "id": "mv_2",
        "problemCount": 2,
        "abstractTitle": "② 内積・なす角・垂直条件・|a+tb|の最小",
        "realTitle": "1章 平面ベクトルの基本"
      },
      {
        "id": "mv_3",
        "problemCount": 2,
        "abstractTitle": "③ 内分・外分・重心",
        "realTitle": "2章 位置ベクトルと図形"
      },
      {
        "id": "mv_4",
        "problemCount": 2,
        "abstractTitle": "④ 交点（係数比較）・共線条件 s+t=1",
        "realTitle": "2章 位置ベクトルと図形"
      },
      {
        "id": "mv_5",
        "problemCount": 2,
        "abstractTitle": "⑤ 三角形の面積・正射影ベクトル",
        "realTitle": "3章 面積とベクトル方程式"
      },
      {
        "id": "mv_6",
        "problemCount": 2,
        "abstractTitle": "⑥ 直線・円のベクトル方程式",
        "realTitle": "3章 面積とベクトル方程式"
      },
      {
        "id": "mv_7",
        "problemCount": 2,
        "abstractTitle": "⑦ 空間の成分・内積・垂直・距離",
        "realTitle": "4章 空間ベクトル"
      },
      {
        "id": "mv_8",
        "problemCount": 2,
        "abstractTitle": "⑧ 共面条件 s+t+u=1・球面",
        "realTitle": "4章 空間ベクトル"
      },
      {
        "id": "mp_1",
        "problemCount": 2,
        "abstractTitle": "① P と C の使い分け・最短経路",
        "realTitle": "1章 場合の数の土台"
      },
      {
        "id": "mp_2",
        "problemCount": 2,
        "abstractTitle": "② 円順列・重複順列・組分け",
        "realTitle": "1章 場合の数の土台"
      },
      {
        "id": "mp_3",
        "problemCount": 2,
        "abstractTitle": "③ 同様に確からしい・サイコロ・玉",
        "realTitle": "2章 確率の基本"
      },
      {
        "id": "mp_4",
        "problemCount": 2,
        "abstractTitle": "④ 余事象・和事象",
        "realTitle": "2章 確率の基本"
      },
      {
        "id": "mp_5",
        "problemCount": 2,
        "abstractTitle": "⑤ 反復試行・優勝決定の確率",
        "realTitle": "3章 独立試行・反復試行"
      },
      {
        "id": "mp_6",
        "problemCount": 2,
        "abstractTitle": "⑥ 条件付き確率・原因の確率",
        "realTitle": "4章 条件付き確率・期待値"
      },
      {
        "id": "mp_7",
        "problemCount": 2,
        "abstractTitle": "⑦ 期待値",
        "realTitle": "4章 条件付き確率・期待値"
      },
      {
        "id": "mp_8",
        "problemCount": 2,
        "abstractTitle": "⑧ 総合問題（パターンの融合）",
        "realTitle": "4章 条件付き確率・期待値"
      },
      {
        "id": "mi_1",
        "problemCount": 2,
        "abstractTitle": "① 約数の個数・総和・最大公約数と最小公倍数",
        "realTitle": "1章 約数・倍数と素因数分解"
      },
      {
        "id": "mi_2",
        "problemCount": 2,
        "abstractTitle": "② ユークリッドの互除法・ax+by=c の整数解",
        "realTitle": "2章 互除法と1次不定方程式"
      },
      {
        "id": "mi_3",
        "problemCount": 2,
        "abstractTitle": "③ 積の形×約数の組合せ・素数条件",
        "realTitle": "3章 因数分解の利用"
      },
      {
        "id": "mi_4",
        "problemCount": 2,
        "abstractTitle": "④ 余りの計算・余りで分類する証明",
        "realTitle": "4章 余りによる分類と絞り込み"
      },
      {
        "id": "mi_5",
        "problemCount": 2,
        "abstractTitle": "⑤ 範囲の絞り込み・n進法",
        "realTitle": "4章 余りによる分類と絞り込み"
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
        "abstractTitle": "① 生物の共通性・細胞・代謝・酵素・顕微鏡",
        "realTitle": "1章 生物の特徴"
      },
      {
        "id": "bio2_1",
        "problemCount": 5,
        "abstractTitle": "② DNA・複製・転写翻訳・ゲノム",
        "realTitle": "2章 遺伝子とその働き"
      },
      {
        "id": "bio3_1",
        "problemCount": 6,
        "abstractTitle": "③ 体液・肝腎・自律神経・ホルモン・免疫",
        "realTitle": "3章 体内環境の維持"
      },
      {
        "id": "bio4_1",
        "problemCount": 4,
        "abstractTitle": "④ 植生・遷移・バイオーム",
        "realTitle": "4章 植生と遷移・バイオーム"
      },
      {
        "id": "bio5_1",
        "problemCount": 4,
        "abstractTitle": "⑤ 生態系・物質循環・環境保全",
        "realTitle": "5章 生態系とその保全"
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
        "abstractTitle": "① 基本5文型と自動詞・他動詞",
        "realTitle": "1章 文型と動詞"
      },
      {
        "id": "eg1_2",
        "problemCount": 1,
        "abstractTitle": "② 基本時制と時制の一致",
        "realTitle": "2章 時制"
      },
      {
        "id": "eg1_3",
        "problemCount": 1,
        "abstractTitle": "③ 完了形（現在・過去・未来）",
        "realTitle": "2章 時制"
      },
      {
        "id": "eg1_4",
        "problemCount": 1,
        "abstractTitle": "④ 助動詞と助動詞＋have p.p.",
        "realTitle": "3章 助動詞"
      },
      {
        "id": "eg1_5",
        "problemCount": 1,
        "abstractTitle": "⑤ 受動態・知覚動詞・使役動詞",
        "realTitle": "4章 態"
      },
      {
        "id": "eg2_1",
        "problemCount": 1,
        "abstractTitle": "⑥ 不定詞（3用法と重要構文）",
        "realTitle": "5章 準動詞"
      },
      {
        "id": "eg2_2",
        "problemCount": 1,
        "abstractTitle": "⑦ 動名詞と to do / doing の使い分け",
        "realTitle": "5章 準動詞"
      },
      {
        "id": "eg2_3",
        "problemCount": 1,
        "abstractTitle": "⑧ 分詞と分詞構文",
        "realTitle": "5章 準動詞"
      },
      {
        "id": "eg2_4",
        "problemCount": 1,
        "abstractTitle": "⑨ 関係代名詞（格と what・that）",
        "realTitle": "6章 関係詞"
      },
      {
        "id": "eg2_5",
        "problemCount": 1,
        "abstractTitle": "⑩ 関係副詞と複合関係詞",
        "realTitle": "6章 関係詞"
      },
      {
        "id": "eg3_1",
        "problemCount": 1,
        "abstractTitle": "⑪ 仮定法過去・過去完了・未来",
        "realTitle": "7章 仮定法"
      },
      {
        "id": "eg3_2",
        "problemCount": 1,
        "abstractTitle": "⑫ if を使わない仮定表現",
        "realTitle": "7章 仮定法"
      },
      {
        "id": "eg3_3",
        "problemCount": 1,
        "abstractTitle": "⑬ 原級・比較級・最上級と重要表現",
        "realTitle": "8章 比較"
      },
      {
        "id": "eg3_4",
        "problemCount": 1,
        "abstractTitle": "⑭ 強調・倒置・省略・同格・無生物主語",
        "realTitle": "9章 特殊構文"
      },
      {
        "id": "eg4_1",
        "problemCount": 1,
        "abstractTitle": "⑮ 動詞の語法（自他・語形・型）",
        "realTitle": "10章 語法"
      },
      {
        "id": "eg4_2",
        "problemCount": 1,
        "abstractTitle": "⑯ 名詞・代名詞・冠詞の語法",
        "realTitle": "10章 語法"
      },
      {
        "id": "eg4_3",
        "problemCount": 1,
        "abstractTitle": "⑰ 形容詞・副詞の語法",
        "realTitle": "10章 語法"
      },
      {
        "id": "eg4_4",
        "problemCount": 1,
        "abstractTitle": "⑱ 前置詞の語法",
        "realTitle": "10章 語法"
      },
      {
        "id": "eg5_1",
        "problemCount": 1,
        "abstractTitle": "⑲ 動詞を含む熟語・群動詞",
        "realTitle": "11章 イディオム"
      },
      {
        "id": "eg5_2",
        "problemCount": 1,
        "abstractTitle": "⑳ 会話表現と多義語・語い",
        "realTitle": "12章 会話・語い"
      }
    ]
  },
  {
    "id": "geography",
    "label": "地理総合・地理探究",
    "chapters": [
      {
        "id": "geo_q1_r1",
        "problemCount": 1,
        "abstractTitle": "第1回 モンスーンアジアの気候と稲作（単元演習）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_q1_r2",
        "problemCount": 1,
        "abstractTitle": "第2回 世界の人口構造と人口移動（単元演習）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_q1_r3",
        "problemCount": 1,
        "abstractTitle": "第3回 地図と位置情報・地域調査（単元演習）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_q1_r4",
        "problemCount": 1,
        "abstractTitle": "第4回 資源・エネルギーと国際関係（単元演習）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_q1_r5",
        "problemCount": 1,
        "abstractTitle": "第5回 環境問題と食料生産の国際比較（単元演習）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_exam_r1_1",
        "problemCount": 1,
        "abstractTitle": "第1回 気候・河川流出と自然災害の地域性（模試）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_exam_r1_2",
        "problemCount": 1,
        "abstractTitle": "第1回 エネルギー資源と工業立地の変化（模試）",
        "realTitle": "第2問"
      },
      {
        "id": "geo_exam_r1_3",
        "problemCount": 1,
        "abstractTitle": "第1回 地方都市の地域調査（模試）",
        "realTitle": "第3問"
      },
      {
        "id": "geo_exam_r2_1",
        "problemCount": 1,
        "abstractTitle": "第2回 世界の農業地域と食料需給（模試）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_exam_r2_2",
        "problemCount": 1,
        "abstractTitle": "第2回 人口転換・人口移動と都市問題（模試）",
        "realTitle": "第2問"
      },
      {
        "id": "geo_exam_r2_3",
        "problemCount": 1,
        "abstractTitle": "第2回 沿岸都市の地域調査（模試）",
        "realTitle": "第3問"
      },
      {
        "id": "geo_exam_r3_1",
        "problemCount": 1,
        "abstractTitle": "第3回 地図投影法・地理情報（GIS）と空間データ分析（模試）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_exam_r3_2",
        "problemCount": 1,
        "abstractTitle": "第3回 交通・通信・国際貿易とサプライチェーン（模試）",
        "realTitle": "第2問"
      },
      {
        "id": "geo_exam_r3_3",
        "problemCount": 1,
        "abstractTitle": "第3回 サブサハラアフリカの開発課題と都市化（模試）",
        "realTitle": "第3問"
      },
      {
        "id": "geo_exam_r4_1",
        "problemCount": 1,
        "abstractTitle": "第4回 世界の地形環境と水資源の利用・管理（模試）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_exam_r4_2",
        "problemCount": 1,
        "abstractTitle": "第4回 産業構造の転換とグローバル経済（模試）",
        "realTitle": "第2問"
      },
      {
        "id": "geo_exam_r4_3",
        "problemCount": 1,
        "abstractTitle": "第4回 中山間地域の地域調査（模試）",
        "realTitle": "第3問"
      },
      {
        "id": "geo_exam_r5_1",
        "problemCount": 1,
        "abstractTitle": "第5回 気候変動・植生帯と生態系サービス（模試）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_exam_r5_2",
        "problemCount": 1,
        "abstractTitle": "第5回 民族・宗教・国家間の結合と地域紛争（模試）",
        "realTitle": "第2問"
      },
      {
        "id": "geo_exam_r5_3",
        "problemCount": 1,
        "abstractTitle": "第5回 日本の工業都市の変容（模試）",
        "realTitle": "第3問"
      },
      {
        "id": "geo_exam_r6_1",
        "problemCount": 1,
        "abstractTitle": "第6回 大気大循環・海洋と気候の年々変動（模試）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_exam_r6_2",
        "problemCount": 1,
        "abstractTitle": "第6回 乾燥地域の水・資源・人口——西アジアと中央アジア（模試）",
        "realTitle": "第2問"
      },
      {
        "id": "geo_exam_r6_3",
        "problemCount": 1,
        "abstractTitle": "第6回 離島Ａ町の地域調査（模試）",
        "realTitle": "第3問"
      },
      {
        "id": "geo_exam_yo_1",
        "problemCount": 1,
        "abstractTitle": "予想問題 エネルギー転換と資源の地理（模試）",
        "realTitle": "第1問"
      },
      {
        "id": "geo_exam_yo_2",
        "problemCount": 1,
        "abstractTitle": "予想問題 島嶼・海洋地域の自然と持続可能性（模試）",
        "realTitle": "第2問"
      },
      {
        "id": "geo_exam_yo_3",
        "problemCount": 1,
        "abstractTitle": "予想問題 温泉観光都市Ｂ市の地域調査（模試）",
        "realTitle": "第3問"
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
    "questions": 56
  },
  "english_listening": {
    "sections": 6,
    "units": 9,
    "points": 100,
    "marks": 37,
    "questions": 60
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
  },
  "geography": {
    "chapters": 26,
    "questions": 26,
    "marks": 137
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
