/**
 * ===================================================================
 * とびら君の「ミニ豆知識」データ
 * ===================================================================
 *
 * ■ なぜコンポーネントから切り出したのか
 * 以前は DoorMascot.tsx の中に文字列配列が直接書かれていて、
 *   ・毎回ランダムに1つ出すだけ（同じものが何度も続く／一生出ないものがある）
 *   ・分野が分からないので「今の自分に関係あるか」が判断できない
 *   ・何種類あるのか、どれを見たのかが分からない
 * という状態だった。
 *
 * 豆知識は「タイトル画面で受け取る、いちばん軽い復習教材」である。
 * そこで単なる文字列ではなく **分野（category）を持つデータ** にして、
 *   ① カテゴリを表示して「何の話か」を一目で分かるようにする
 *   ② 一度見たものを覚えておき、**未読を優先**して出す（＝全部に必ず出会える）
 *   ③ 「何個中いくつ見たか」を出して、集めていく手応えを作る
 * という3つの付加価値を成立させる。
 *
 * ■ 口調のルール（既存のセリフと揃えること）
 *   ・基本は「です・ます」。行動をうながす時だけ「〜しよう」。
 *   ・1文が長くなりすぎないよう、句点で区切って2文までにする。
 *   ・化学式の添字は Unicode（H₂O, 6.02×10²³）で書く。
 *     （textFormatter を通さない素の <p> に出すため、ここで完成させておく）
 *
 * ■ 科目（subject）を持たせた理由
 * 科目が化学基礎だけだった頃は分野（category）だけで足りていた。
 * 化学（発展）と英語リスニングが加わった今、化学基礎の豆知識を
 * リスニング画面で出しても学習の役に立たない。
 * そこで各豆知識に **どの科目の画面で出してよいか** を持たせ、
 * 画面側が subject を渡してその科目のものだけを出すようにした。
 *   ・'common' … どの科目でも役に立つ（学習法・試験の作法）
 *   ・'chemistry_basic' / 'chemistry' / 'english_listening' … その科目専用
 */

/** 豆知識の分野。表示用のラベルと絵文字をここで一元管理する。 */
export type TipCategory =
  | 'basic'
  | 'mol'
  | 'reaction'
  | 'concentration'
  | 'acidBase'
  | 'redox'
  | 'structure'
  | 'bond'
  | 'technique'
  | 'exam'
  // ── 化学（発展）で扱う分野 ──
  | 'state'
  | 'solution'
  | 'thermo'
  | 'equilibrium'
  | 'inorganic'
  | 'organic'
  | 'polymer'
  // ── 英語リスニングで扱う分野 ──
  | 'listeningBasic'
  | 'listeningSound'
  | 'listeningNumber'
  | 'listeningStrategy'
  | 'listeningTraining';

/** 画面側が渡してくる「いま開いている科目」。 */
export type TipSubject = 'chemistry_basic' | 'chemistry' | 'english_listening';

/**
 * 豆知識を出してよい範囲。
 *   'common'        … どの科目でも出す（マークの読み方など科目に依らない作法）
 *   'chemistry_all' … 化学基礎と化学の両方（mol 計算の作法など）
 *   他              … その科目専用
 *
 * ◆なぜ 'chemistry_all' を分けたか
 *   「炎色反応・沈殿の色は暗記が得点に直結」のような試験テクニックは
 *   化学基礎でも化学でも役に立つが、リスニングでは意味がない。
 *   すべてを 'common' にしてしまうと、リスニング画面で化学の話が出て
 *   「自分に関係ない話」になるので、中間の範囲を一つ用意している。
 */
export type TipSubjectScope = 'common' | 'chemistry_all' | TipSubject;

export interface TipCategoryMeta {
  /** 吹き出しに出す短いラベル */
  label: string;
  /** ラベルの先頭につける絵文字 */
  emoji: string;
}

export const TIP_CATEGORIES: Record<TipCategory, TipCategoryMeta> = {
  basic: { label: '基本知識', emoji: '🧾' },
  mol: { label: 'mol・物質量', emoji: '📐' },
  reaction: { label: '化学反応式・量的関係', emoji: '⚗️' },
  concentration: { label: '濃度計算', emoji: '🧪' },
  acidBase: { label: '酸と塩基', emoji: '🧫' },
  redox: { label: '酸化還元', emoji: '⚡' },
  structure: { label: '物質の構成・周期表', emoji: '🔬' },
  bond: { label: '化学結合', emoji: '🔗' },
  technique: { label: '計算・解答テクニック', emoji: '📝' },
  exam: { label: '共通テスト対策', emoji: '🎯' },
  // ── 化学（発展） ──
  state: { label: '物質の状態と平衡', emoji: '🌡️' },
  solution: { label: '溶液', emoji: '💧' },
  thermo: { label: '反応とエネルギー', emoji: '🔥' },
  equilibrium: { label: '反応の速さと平衡', emoji: '⚖️' },
  inorganic: { label: '無機物質', emoji: '🪨' },
  organic: { label: '有機化合物', emoji: '🧬' },
  polymer: { label: '高分子化合物', emoji: '🧶' },
  // ── 英語リスニング ──
  listeningBasic: { label: 'リスニングの基本', emoji: '🎧' },
  listeningSound: { label: '音の変化', emoji: '🔊' },
  listeningNumber: { label: '数字・図表', emoji: '🔢' },
  listeningStrategy: { label: '解き方の作戦', emoji: '🧭' },
  listeningTraining: { label: '毎日のトレーニング', emoji: '🏃' },
};

/**
 * 分野がどの科目に属するかの対応。
 * 豆知識1件ごとに subject を書き忘れても、分野から自動で決まるようにしておく
 * （＝データ追加時の事故を構造的に防ぐ）。
 */
export const CATEGORY_SUBJECT: Record<TipCategory, TipSubjectScope> = {
  basic: 'chemistry_basic',
  mol: 'chemistry_basic',
  reaction: 'chemistry_basic',
  concentration: 'chemistry_basic',
  acidBase: 'chemistry_basic',
  redox: 'chemistry_basic',
  structure: 'chemistry_basic',
  bond: 'chemistry_basic',
  // 計算・試験の作法は基本的に化学二科目共通。
  // 科目を問わないものは各豆知識側で subject: 'common' と明示する。
  technique: 'chemistry_all',
  exam: 'chemistry_all',
  state: 'chemistry',
  solution: 'chemistry',
  thermo: 'chemistry',
  equilibrium: 'chemistry',
  inorganic: 'chemistry',
  organic: 'chemistry',
  polymer: 'chemistry',
  listeningBasic: 'english_listening',
  listeningSound: 'english_listening',
  listeningNumber: 'english_listening',
  listeningStrategy: 'english_listening',
  listeningTraining: 'english_listening',
};

export interface MascotTip {
  /**
   * 既読管理に使う安定した ID。
   * ★並べ替えても既読が壊れないよう、配列の添字ではなく固定の文字列にする★
   * 文言を直しても既読を保ちたいので、ID は内容とは独立に振る。
   */
  id: string;
  category: TipCategory;
  text: string;
  /**
   * どの科目の画面で出すか。
   * 省略時は CATEGORY_SUBJECT から分野に応じて決まる（書き忘れ防止）。
   */
  subject?: TipSubjectScope;
}

export const mascotTips: MascotTip[] = [
  // ── 基本知識（従来から掲載しているもの） ──
  { id: 'b01', category: 'basic', text: '水は約4℃で密度が最大。氷が浮くのは固体になるとすき間の多い構造になるからです。' },
  { id: 'b02', category: 'basic', text: '同素体は「同じ元素の単体で性質が違うもの」。炭素なら黒鉛・ダイヤモンド・フラーレンが代表例です。' },
  { id: 'b03', category: 'structure', text: '陽イオンは電子を失ってできる粒子。原子核の正電荷が相対的に強くなるので半径は小さくなりやすいです。' },
  { id: 'b04', category: 'acidBase', text: '中和では H⁺ と OH⁻ が結びついて水ができます。量的関係は「価数×物質量」でそろえるのがコツ。' },
  { id: 'b05', category: 'redox', text: '酸化は「電子を失う」、還元は「電子を受け取る」。酸素や水素だけでなく電子で考えると安定します。' },
  { id: 'b06', category: 'mol', text: '物質量 mol は粒子数を数えるための単位。1 mol は 6.02×10²³ 個です。' },
  { id: 'b07', category: 'bond', text: '共有結合は非金属元素どうしが電子対を共有する結合。分子の形は電子対の反発で決まります。' },
  { id: 'b08', category: 'basic', text: '炎色反応は金属元素の確認に便利。Na は黄色、K は赤紫色、Cu は青緑色が代表です。' },
  { id: 'b09', category: 'basic', text: 'ろ過は「液体に溶けない固体」を分ける操作。溶けている物質はろ紙を通過します。' },
  { id: 'b10', category: 'structure', text: '同位体は陽子数が同じで中性子数が違う原子。化学的性質はほぼ同じです。' },
  { id: 'b11', category: 'structure', text: '電子配置は内側の殻から K(2)→L(8)→M(8)…の順に入ります。最外殻電子＝価電子が反応のカギ。' },
  { id: 'b12', category: 'structure', text: '希ガス（貴ガス）は最外殻が満たされて安定。だから単原子分子で存在し反応しにくいのです。' },
  { id: 'b13', category: 'bond', text: 'イオン結合は金属＋非金属、共有結合は非金属どうし、金属結合は金属どうし、と覚えると整理しやすい。' },
  { id: 'b14', category: 'mol', text: 'モル質量[g/mol]は原子量・分子量に g をつけた値。質量÷モル質量＝物質量です。' },
  { id: 'b15', category: 'mol', text: 'アボガドロの法則：同温・同圧で同体積の気体は同数の分子を含む。標準状態で1 mol＝22.4 L。' },
  { id: 'b16', category: 'acidBase', text: '強酸（HCl, H₂SO₄, HNO₃）と強塩基（NaOH, KOH）はしっかり覚えておくと中和計算が速くなります。' },
  { id: 'b17', category: 'acidBase', text: 'pH が1小さくなると水素イオン濃度は10倍。pH 3 は pH 5 の100倍の酸性です。' },
  { id: 'b18', category: 'redox', text: '酸化数のルール：単体は0、化合物中のHは+1、Oは−2が基本（例外もあり）。' },
  { id: 'b19', category: 'redox', text: 'ダニエル電池は負極(亜鉛)が溶け、正極(銅)に析出。「イオン化傾向の大きい金属が溶ける」と覚えよう。' },
  { id: 'b20', category: 'redox', text: '金属のイオン化傾向：リッチに貸そうかな…（K Ca Na Mg Al Zn Fe Ni Sn Pb H Cu Hg Ag Pt Au）。' },

  // ── 試験で使えるテクニック（従来から掲載しているもの） ──
  { id: 't01', category: 'technique', text: '単位を必ず書いて計算しよう。単位がそろえば計算式の形は自然と決まります（次元解析）。' },
  { id: 't02', category: 'technique', text: '有効数字は「与えられた数値の最小桁数」に合わせる。最後にまとめて四捨五入するとミスが減ります。' },
  { id: 't03', category: 'acidBase', text: '中和滴定は「酸の価数×モル＝塩基の価数×モル」。この1本の式に当てはめれば多くの問題が解けます。' },
  { id: 't04', category: 'mol', text: '気体の問題は PV=nRT を軸に。R=8.31×10³ [Pa·L/(K·mol)]、温度は必ずK（℃+273）で。' },
  { id: 't05', category: 'concentration', text: '「水溶液の希釈」では溶質の物質量は不変。C₁V₁=C₂V₂ ですばやく処理できます。' },
  { id: 't06', category: 'reaction', text: '化学反応式の係数は質量保存（原子の数）で合わせる。係数比＝物質量比＝（気体なら）体積比。' },
  { id: 't07', category: 'technique', text: 'グラフ問題は「軸・傾き・切片・変化点」に着目。傾きが何を表すか先に考えると速い。' },
  // 選択肢の消去法はリスニングでもそのまま使えるので全科目共通にする
  { id: 't08', category: 'exam', subject: 'common', text: '選択肢問題は「明らかに違う選択肢」から消去。極端な値や単位ミスの選択肢は外しやすい。' },
  { id: 't09', category: 'acidBase', text: '中和点の前後でpHが急変（中和滴定曲線）。指示薬は変色域がpHジャンプに重なるものを選ぶ。' },
  { id: 't10', category: 'redox', text: '酸化還元の量的関係は「やり取りした電子の物質量が等しい」。半反応式を書くと立式が安定します。' },
  { id: 't11', category: 'mol', text: 'mol計算は「与えられた量→mol→求めたい量」の3ステップ。途中をmolに統一すると迷いません。' },
  { id: 't12', category: 'concentration', text: '溶解度や濃度の問題は「溶質・溶媒・溶液」のどれを指すか必ず確認。質量パーセント濃度との混同に注意。' },
  { id: 't13', category: 'exam', text: '共通テストは時間勝負。計算が重い問題は後回しにして、知識問題で確実に得点しよう。' },
  { id: 't14', category: 'exam', subject: 'common', text: '「正しいものを選べ」か「誤っているものを選べ」か、設問の指示に必ず印をつけてから解こう。' },
  { id: 't15', category: 'exam', text: '炎色反応・気体の性質・沈殿の色は暗記が得点に直結。スキマ時間に語呂で覚えるのが効率的。' },

  // ── 📐 mol・物質量（追加） ──
  { id: 'm01', category: 'mol', text: '1 mol＝22.4 L が使えるのは「標準状態の気体」だけ。液体や固体には使えないので注意しよう。' },
  { id: 'm02', category: 'mol', text: 'モル質量の数値は原子量・分子量・式量とそのまま一致します。イオンからなる物質では式量で考えます。' },
  { id: 'm03', category: 'mol', text: '粒子が原子でも分子でもイオンでも、1 mol あたりの個数は常に 6.02×10²³ 個。種類は関係ありません。' },

  // ── ⚗️ 化学反応式・量的関係（追加） ──
  { id: 'r01', category: 'reaction', text: '過不足のある反応は、両方の物質の mol を出して「どちらが先になくなるか」を確かめよう。' },

  // ── 🧪 濃度計算（追加） ──
  { id: 'c01', category: 'concentration', text: '質量パーセント濃度＝溶質の質量÷溶液の質量×100。分母は「溶媒」ではなく「溶液」です。' },
  { id: 'c02', category: 'concentration', text: 'モル濃度[mol/L]＝溶質の物質量[mol]÷溶液の体積[L]。体積は mL ではなく L に直してから計算しよう。' },
  { id: 'c03', category: 'concentration', text: '密度が絡む濃度計算は、まず溶液 1 L あたりの質量を出すのがコツ。そこから溶質の質量へ進みます。' },

  // ── 🧫 酸と塩基（追加） ──
  { id: 'a01', category: 'acidBase', text: '酸は H⁺ を出す物質、塩基は OH⁻ を出す物質（アレニウスの定義）。まずこの形で押さえます。' },
  { id: 'a02', category: 'acidBase', text: '価数は「出せる H⁺・OH⁻ の数」、強弱は「電離度の大小」。別の話なので混同しないようにしよう。' },
  { id: 'a03', category: 'acidBase', text: '中和滴定のグラフでは、pH が急に跳ね上がる部分の中間点が中和点。読み取りの目印にしよう。' },

  // ── ⚡ 酸化還元（追加） ──
  { id: 'x01', category: 'redox', text: '酸化数が増えたら酸化された、減ったら還元された。増減の向きで判断すると迷いません。' },
  { id: 'x02', category: 'redox', text: 'イオン化傾向が大きい金属ほど電子を渡しやすく、酸化されやすいです。反応の向きを予想する武器になります。' },
  { id: 'x03', category: 'redox', text: '電池は自然に進む酸化還元反応、電気分解は外部電源で無理に起こす反応。向きが逆だと整理しよう。' },
  { id: 'x04', category: 'redox', text: '電気分解では陽極で酸化、陰極で還元が起こります。「陽極＝酸化」とセットで覚えるのが安全です。' },

  // ── 🔬 物質の構成・周期表（追加） ──
  { id: 's01', category: 'structure', text: '原子番号＝陽子の数＝電子の数（中性の原子のとき）。イオンでは電子の数だけがずれます。' },
  { id: 's02', category: 'structure', text: '同族元素は最外殻電子の数が同じなので化学的性質が似ます。縦の並びで覚えると効率的です。' },
  { id: 's03', category: 'structure', text: 'イオン化エネルギーが小さい原子ほど電子を放しやすく、陽イオンになりやすいです。' },
  { id: 's04', category: 'structure', text: '電気陰性度は周期表の右上ほど大きくなります（貴ガスは除く）。極性を考えるときの土台です。' },

  // ── 🔗 化学結合（追加） ──
  { id: 'n01', category: 'bond', text: '電気陰性度の差が大きい原子どうしの結合ほど、イオン結合の性質が強くなります。' },
  { id: 'n02', category: 'bond', text: '分子結晶を結びつけているのは弱い分子間力、共有結合結晶は強い共有結合。かたさや融点の差はここから来ます。' },
  { id: 'n03', category: 'bond', text: '極性分子か無極性分子かは、結合の極性だけでなく分子の形も見て判断しよう。CO₂ が無極性なのはその例です。' },

  // ── 📝 計算・解答テクニック（追加） ──
  { id: 'k01', category: 'technique', text: '見直しの基本は「単位が正しく消えているか」。mol 計算は単位を追うだけでミスが見つかります。' },

  // ── 🎯 共通テスト対策（追加） ──
  { id: 'e01', category: 'exam', text: '共通テストは会話文や実験考察の形式が多いです。設問より先に会話文全体へざっと目を通そう。' },
  { id: 'e02', category: 'exam', text: '実験の目的と手順を読み違えると、計算が合っていても失点します。何を測っているのか先に確認しよう。' },
  { id: 'e03', category: 'exam', text: 'グラフや表の読み取りでは「何が変化して何が一定か」をまず確認。そこが問いの中心になります。' },
  { id: 'e04', category: 'exam', text: '日常生活と結びついた出題が多いです。身のまわりの化学現象にも興味を持っておくと効きます。' },

  // ===================================================================
  // 化学（発展）
  // ===================================================================

  // ── 🌡️ 物質の状態と平衡 ──
  { id: 'ad_st01', category: 'state', text: '状態図の三重点は固体・液体・気体が共存する1点。臨界点より上では気体と液体の区別がなくなります。' },
  { id: 'ad_st02', category: 'state', text: '沸点は「蒸気圧が外圧と等しくなる温度」。山の上で沸点が下がるのは外圧が小さいからです。' },
  { id: 'ad_st03', category: 'state', text: '理想気体の式が崩れるのは低温・高圧のとき。分子自身の体積と分子間力が無視できなくなります。' },
  { id: 'ad_st04', category: 'state', text: '混合気体では各成分の分圧の和が全圧になります（ドルトンの法則）。分圧＝全圧×モル分率です。' },
  { id: 'ad_st05', category: 'state', text: '面心立方格子の単位格子には原子4個、体心立方格子には2個が含まれます。まず個数を数えるのが定石。' },
  { id: 'ad_st06', category: 'state', text: '結晶の密度は「単位格子中の質量÷単位格子の体積」。原子半径と格子定数の関係を先に立てよう。' },

  // ── 💧 溶液 ──
  { id: 'ad_so01', category: 'solution', text: '固体の溶解度は多くの物質で高温ほど大きく、気体は高温ほど小さくなります。向きが逆だと押さえよう。' },
  { id: 'ad_so02', category: 'solution', text: 'ヘンリーの法則は「溶ける気体の量は分圧に比例する」。圧力を2倍にすれば溶解量も2倍です。' },
  { id: 'ad_so03', category: 'solution', text: '沸点上昇と凝固点降下の大きさは溶質の種類ではなく粒子の数で決まります。質量モル濃度に比例します。' },
  { id: 'ad_so04', category: 'solution', text: '電解質の希薄溶液では電離後の粒子数で考えます。塩化ナトリウムは1 mol で2 mol 分の効果になります。' },
  { id: 'ad_so05', category: 'solution', text: '浸透圧はファントホッフの式 Π＝cRT で求められます。気体の式と同じ形なので覚えやすいです。' },
  { id: 'ad_so06', category: 'solution', text: 'コロイド溶液の目印はチンダル現象と透析。ブラウン運動もコロイド粒子の特徴です。' },

  // ── 🔥 化学反応とエネルギー ──
  { id: 'ad_th01', category: 'thermo', text: 'エンタルピー変化は発熱反応で負、吸熱反応で正になります。符号の向きを最初に確認しよう。' },
  { id: 'ad_th02', category: 'thermo', text: 'ヘスの法則は「反応熱は経路によらず始めと終わりの状態だけで決まる」。図で経路をつないで解こう。' },
  { id: 'ad_th03', category: 'thermo', text: '結合エネルギーから反応熱を出すときは「切る結合の和−できる結合の和」。向きを間違えやすい所です。' },
  { id: 'ad_th04', category: 'thermo', text: '生成エンタルピーは単体からその物質1 mol ができるときの値。単体の値は0と決められています。' },

  // ── ⚖️ 反応の速さと平衡 ──
  { id: 'ad_eq01', category: 'equilibrium', text: '触媒は活性化エネルギーを下げて反応を速くしますが、平衡の位置は動かしません。頻出のひっかけです。' },
  { id: 'ad_eq02', category: 'equilibrium', text: '温度を上げると反応が速くなるのは、活性化エネルギー以上をもつ分子の割合が増えるからです。' },
  { id: 'ad_eq03', category: 'equilibrium', text: 'ルシャトリエの原理は「加えた変化を打ち消す向きに動く」。圧力・温度・濃度の3つで確認しよう。' },
  { id: 'ad_eq04', category: 'equilibrium', text: '平衡定数は温度だけで決まります。濃度や圧力を変えても値そのものは変わりません。' },
  { id: 'ad_eq05', category: 'equilibrium', text: '弱酸の pH は電離定数から求めます。近似式が使えるのは電離度が十分に小さいときです。' },
  { id: 'ad_eq06', category: 'equilibrium', text: '緩衝液は弱酸とその塩の混合。少量の酸や塩基を加えても pH がほとんど変わりません。' },
  { id: 'ad_eq07', category: 'equilibrium', text: '溶解度積を超えると沈殿が生じます。イオン濃度の積と溶解度積を比べて判断しよう。' },

  // ── 🪨 無機物質 ──
  { id: 'ad_in01', category: 'inorganic', text: '気体の捕集法は上方置換・下方置換・水上置換の3択。水への溶けやすさと空気との重さで決めます。' },
  { id: 'ad_in02', category: 'inorganic', text: '濃硫酸は乾燥剤に使えますが、塩基性のアンモニアには使えません。乾燥剤と気体の相性は必ず確認しよう。' },
  { id: 'ad_in03', category: 'inorganic', text: 'ハロゲン単体の酸化力はフッ素がいちばん強く、ヨウ素がいちばん弱いです。原子番号の順で並びます。' },
  { id: 'ad_in04', category: 'inorganic', text: 'アルミニウムは酸にも強塩基にも溶ける両性金属。Al・Zn・Sn・Pb の4つで覚えておこう。' },
  { id: 'ad_in05', category: 'inorganic', text: '錯イオンの配位数は Ag⁺ が2、Cu²⁺ と Zn²⁺ が4、Fe³⁺ が6が代表。形とセットで押さえます。' },
  { id: 'ad_in06', category: 'inorganic', text: '硫化物の沈殿は液性で変わります。酸性でも沈むのは Cu²⁺ や Pb²⁺ などイオン化傾向の小さい金属です。' },
  { id: 'ad_in07', category: 'inorganic', text: '鉄イオンの区別はヘキサシアニド鉄酸イオンとの反応が定番。Fe²⁺ と Fe³⁺ で沈殿の色が変わります。' },
  { id: 'ad_in08', category: 'inorganic', text: '両性水酸化物は過剰の水酸化ナトリウム水溶液に溶けて再び透明になります。2段階の変化に注目しよう。' },

  // ── 🧬 有機化合物 ──
  { id: 'ad_or01', category: 'organic', text: '構造異性体を数えるときは炭素骨格を先に決め、あとから置換基を動かすと数え漏れが減ります。' },
  { id: 'ad_or02', category: 'organic', text: 'アルケンは付加反応、アルカンは置換反応が中心。二重結合の有無で反応の型が変わります。' },
  { id: 'ad_or03', category: 'organic', text: 'マルコフニコフ則は「水素は水素の多い炭素につく」。付加の向きを問う問題で効きます。' },
  { id: 'ad_or04', category: 'organic', text: '第一級アルコールはアルデヒドを経てカルボン酸へ、第二級はケトンへ酸化されます。第三級は酸化されにくいです。' },
  { id: 'ad_or05', category: 'organic', text: 'ヨードホルム反応が陽性なのはアセチル基などの構造をもつもの。構造決定の決め手になります。' },
  { id: 'ad_or06', category: 'organic', text: 'フェノールは炭酸より弱い酸ですが、水酸化ナトリウムには中和して溶けます。分離操作の基準になります。' },
  { id: 'ad_or07', category: 'organic', text: '芳香族の分離はエーテル層と水層の行き来で考えます。酸と塩基のどちらで塩になるかが決め手です。' },
  { id: 'ad_or08', category: 'organic', text: 'ジアゾ化とカップリングでアゾ染料ができます。低温で行うのはジアゾニウム塩が不安定だからです。' },
  { id: 'ad_or09', category: 'organic', text: '元素分析では二酸化炭素と水の質量から炭素と水素を出し、残りを酸素とします。組成式から分子式へ進もう。' },

  // ── 🧶 高分子化合物 ──
  { id: 'ad_po01', category: 'polymer', text: '重合度は「高分子の分子量÷繰り返し単位の分子量」。単位の分子量を先に出すのが手順です。' },
  { id: 'ad_po02', category: 'polymer', text: '付加重合は二重結合が開いてつながる反応、縮合重合は水などが取れてつながる反応です。' },
  { id: 'ad_po03', category: 'polymer', text: 'デンプンはらせん構造でヨウ素デンプン反応を示し、セルロースは直線状で示しません。構造の差が反応の差です。' },
  { id: 'ad_po04', category: 'polymer', text: 'タンパク質の検出はビウレット反応とキサントプロテイン反応が定番。何を確かめる反応かを区別しよう。' },
  { id: 'ad_po05', category: 'polymer', text: 'アミノ酸は水溶液中で双性イオンになります。等電点では全体として電気を帯びない状態になります。' },
  { id: 'ad_po06', category: 'polymer', text: '熱可塑性樹脂は鎖状、熱硬化性樹脂は立体網目状。加熱でやわらかくなるかは構造で決まります。' },

  // ── 化学（発展）向けの解答テクニックと試験対策 ──
  { id: 'ad_tk01', category: 'technique', subject: 'chemistry', text: '発展の計算は文字式のまま進めて最後に数値を入れると、途中の丸め誤差が入りません。' },
  { id: 'ad_tk02', category: 'technique', subject: 'chemistry', text: '平衡の計算は反応前・変化量・反応後の3段の表を書くのが定石。変化量を x に置いて整理しよう。' },
  { id: 'ad_ex01', category: 'exam', subject: 'chemistry', text: '化学の第1問は小問集合で全分野から出ます。苦手分野を1つ残すだけで失点が読めなくなります。' },
  { id: 'ad_ex02', category: 'exam', subject: 'chemistry', text: '追試験は本試で出なかったテーマが出やすいです。予想問題として解くと穴が見つかります。' },
  { id: 'ad_ex03', category: 'exam', subject: 'chemistry', text: '有機の構造決定は、条件を1つずつ図にメモしながら候補を絞ると迷いません。' },

  // ===================================================================
  // 英語リスニング
  // ===================================================================

  // ── 🎧 リスニングの基本 ──
  { id: 'ls_ba01', category: 'listeningBasic', text: '共通テストのリスニングは第1問と第2問が2回読み、第3問以降は1回読みです。まずこの差を把握しよう。' },
  { id: 'ls_ba02', category: 'listeningBasic', text: '音声が始まる前の時間で選択肢とイラストに目を通します。問われることが予想できると聞くのが楽になります。' },
  { id: 'ls_ba03', category: 'listeningBasic', text: '英語は文の後半に大事な情報が来ることが多いです。最後まで気を抜かずに聞き切ろう。' },
  { id: 'ls_ba04', category: 'listeningBasic', text: '知らない単語が出ても止まらないことが大切。全体の流れをつかめば答えられる問題が多くあります。' },
  { id: 'ls_ba05', category: 'listeningBasic', text: '内容語である名詞・動詞・形容詞は強く長く読まれます。ここを拾うだけで意味の骨組みが見えます。' },

  // ── 🔊 音の変化 ──
  { id: 'ls_so01', category: 'listeningSound', text: '語の終わりと次の語の始まりはつながって聞こえます。an apple が「アナポゥ」に近くなるのが連結の例です。' },
  { id: 'ls_so02', category: 'listeningSound', text: '似た子音が続くと前の音が落ちます。good time が「グッタイム」に近くなるのが脱落の例です。' },
  { id: 'ls_so03', category: 'listeningSound', text: 't が母音にはさまれると d のように濁ります。water が「ワラー」に近く聞こえるのはこの変化です。' },
  { id: 'ls_so04', category: 'listeningSound', text: '前置詞や代名詞は弱形になって短く読まれます。for や can が消えたように聞こえても慌てないようにしよう。' },
  { id: 'ls_so05', category: 'listeningSound', text: 'アメリカ発音以外も出題されます。イギリス発音では否定の短縮形が「カーント」に近く響きます。' },
  { id: 'ls_so06', category: 'listeningSound', text: 'want to が「ウォナ」、going to が「ゴナ」のように縮めて読まれます。形で覚えておくと拾えます。' },

  // ── 🔢 数字・図表 ──
  { id: 'ls_nu01', category: 'listeningNumber', text: 'thirteen と thirty は強く読まれる位置が違います。後ろが強ければ13、前が強ければ30です。' },
  { id: 'ls_nu02', category: 'listeningNumber', text: '料金や個数の問題は、聞こえた数字をそのまま選ばず、割引や個数をかけた計算まで終わらせよう。' },
  { id: 'ls_nu03', category: 'listeningNumber', text: '時刻の問題では quarter・half・to・past の4語が決め手になります。15分と30分の言い方を押さえよう。' },
  { id: 'ls_nu04', category: 'listeningNumber', text: 'グラフや表の問題では、増えたか減ったか、いちばん大きいのはどれかを先にメモしておこう。' },
  { id: 'ls_nu05', category: 'listeningNumber', text: '数字は聞いた瞬間に問題冊子へ書き取ります。覚えておこうとすると次の音を聞き逃します。' },
  { id: 'ls_nu06', category: 'listeningNumber', text: '単位にも注意しよう。ドルとセント、マイルとキロの違いで選択肢が分かれることがあります。' },

  // ── 🧭 解き方の作戦 ──
  { id: 'ls_st01', category: 'listeningStrategy', text: '選択肢どうしを比べて違う部分に印をつけておくと、その1点だけを聞き分ければよくなります。' },
  { id: 'ls_st02', category: 'listeningStrategy', text: '言い換えに注意しよう。音声の語がそのまま使われている選択肢は、かえって誤りのことがあります。' },
  { id: 'ls_st03', category: 'listeningStrategy', text: 'but や however の後ろに答えが来やすいです。話の向きが変わる合図として聞き取ろう。' },
  { id: 'ls_st04', category: 'listeningStrategy', text: '長い講義形式では、話し手の主張と具体例を分けてメモすると設問に対応しやすくなります。' },
  { id: 'ls_st05', category: 'listeningStrategy', text: '分からない問題は思い切って印をつけて次へ進みます。1問に引きずられると後続もまとめて失います。' },
  { id: 'ls_st06', category: 'listeningStrategy', text: '複数人の会話では、だれの意見かを名前の頭文字でメモすると混ざらずに済みます。' },
  { id: 'ls_st07', category: 'listeningStrategy', text: 'イラスト選択の問題は、絵の違いを先に言葉にしておくのがコツです。位置・数・向きに注目しよう。' },

  // ── 🏃 毎日のトレーニング ──
  { id: 'ls_tr01', category: 'listeningTraining', text: '同じ音声を聞く、原稿で確認する、もう一度聞くの順で使うと、聞き取れない原因がはっきりします。' },
  { id: 'ls_tr02', category: 'listeningTraining', text: 'シャドーイングは音声から少し遅れて声に出す練習。音の変化を体で覚えるのに向いています。' },
  { id: 'ls_tr03', category: 'listeningTraining', text: 'ディクテーションは聞いた英語を書き取る練習。聞き落としている語が目に見えるので弱点探しに効きます。' },
  { id: 'ls_tr04', category: 'listeningTraining', text: 'リスニングは毎日15分の積み上げが効きます。週末にまとめてやるより耳が慣れます。' },
  { id: 'ls_tr05', category: 'listeningTraining', text: '知っている単語でも音を知らなければ聞き取れません。新しい語は必ず音でも覚えよう。' },
  { id: 'ls_tr06', category: 'listeningTraining', text: '倍速で聞いてから等倍に戻すと、本番の速さがゆっくり感じられます。仕上げの練習に向いています。' },
];

/** 総数（吹き出しの「◯／◯個」表示に使う） */
export const TIP_TOTAL = mascotTips.length;

/**
 * 豆知識が実際にどの範囲に属するかを返す。
 * subject が書かれていなければ分野から補う（データ追加時の書き忘れを吸収する）。
 */
export function tipScopeOf(tip: MascotTip): TipSubjectScope {
  return tip.subject ?? CATEGORY_SUBJECT[tip.category];
}

/**
 * 指定した科目の画面で出してよい豆知識だけを返す。
 *
 *   ・'common'       … 常に含める
 *   ・'chemistry_all' … 化学基礎・化学のときだけ含める
 *   ・科目専用        … 一致したときだけ含める
 *
 * 科目を渡さない場合は全件返す（既存の呼び出しを壊さないため）。
 */
export function tipsForSubject(subject?: TipSubject): MascotTip[] {
  if (!subject) return mascotTips;
  const isChemistry = subject === 'chemistry_basic' || subject === 'chemistry';
  return mascotTips.filter((tip) => {
    const scope = tipScopeOf(tip);
    if (scope === 'common') return true;
    if (scope === 'chemistry_all') return isChemistry;
    return scope === subject;
  });
}

/** 科目ごとの件数（吹き出しの「◯／◯個」表示に使う） */
export function tipTotalForSubject(subject?: TipSubject): number {
  return tipsForSubject(subject).length;
}
