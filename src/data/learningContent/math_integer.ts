/**
 * ===================================================================
 * まとめプリント：数学 整数（全パターン演習）
 *   原典：PASSLABO「整数問題 入試頻出解法を4時間で全パターン解説（38章）」
 * ===================================================================
 *
 * ■ 位置づけ・記法は math_integral.ts / math_vector.ts と完全に共通。
 *   収録した数値例はすべて原典から数字を変えてある。
 */

import type { LearningPart } from './adv_thermo';

// ===================================================================
// 導入
// ===================================================================
const HEAD_HTML = `        <h3 id="sec-math-integer">整数（全パターン演習）</h3>

        <div class="box box-note">
          <p><strong>この単元のゴール</strong></p>
          <ul>
            <li>整数問題の<strong><u>三大方針</u></strong>を言える：①積の形（因数分解） ②余りで分類 ③範囲の絞り込み</li>
            <li>どの方針を使うかを、問題の形から<strong><u>10秒で判断</u></strong>できる</li>
            <li>1次不定方程式を「特殊解 → 一般解」の型で確実に解ける</li>
            <li>「互いに素だから倍数」の論法を答案に書ける</li>
          </ul>
          <p><strong><u class="wavy">整数問題は自由度が高く見えるが、実際に使う道具は3つしかない。「どの道具か」の判断訓練がそのまま得点になる。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>三大方針の判断フロー</strong></p>
          <ol>
            <li>方程式が<strong><u>積の形にできるか？</u></strong>（xy の項・平方の差がある）→ ①因数分解して約数の組合せ</li>
            <li>「すべての整数で」「余り」「割り切れる」→ ②<strong><u>余りで分類</u></strong>（3で割った余りなど）</li>
            <li>解が有限個に見える・逆数や対称式 → ③<strong><u>不等式で範囲を絞って虱潰し</u></strong></li>
          </ol>
        </div>
`;

// ===================================================================
// ① 約数・倍数
// ===================================================================
const PART_DIVISOR_HTML = `        <h4>① 約数の個数・総和と最大公約数</h4>

        <div class="box box-note">
          <p><strong>素因数分解から機械的に計算できるもの</strong></p>
          <ul>
            <li>N = p<sup>a</sup>q<sup>b</sup>r<sup>c</sup> の約数の個数：<strong><u>(a+1)(b+1)(c+1)</u></strong>（各素因数を何個使うかの積の法則）</li>
            <li>約数の総和：<strong><u>(1+p+…+p<sup>a</sup>)(1+q+…+q<sup>b</sup>)…</u></strong>（等比数列の和の積）</li>
            <li>最大公約数＝共通の素因数を<strong><u>小さい指数</u></strong>で、最小公倍数＝すべての素因数を<strong><u>大きい指数</u></strong>で</li>
            <li>2数なら G × L = a × b（検算に使える）</li>
          </ul>
        </div>

        <div class="box box-important">
          <p><strong>gcd がらみの第一手</strong></p>
          <p>最大公約数が G と与えられたら、<strong><u>a = Gm、b = Gn（m と n は互いに素）とおく</u></strong>。このとき最小公倍数は Gmn。
          「互いに素」の条件を落とすと解が増えて誤答になるので、<strong><u class="wavy">m と n が互いに素であることのチェックを必ず入れる。</u></strong></p>
        </div>

        <h4>② ユークリッドの互除法と1次不定方程式</h4>

        <div class="box box-note">
          <p><strong>互除法：大きい数の gcd を機械的に</strong></p>
          <ul>
            <li>原理：a = bq + r のとき <strong><u>gcd(a, b) = gcd(b, r)</u></strong></li>
            <li>余りが 0 になったときの<strong><u>割る数</u></strong>が最大公約数</li>
            <li>途中式は消さない（不定方程式の特殊解探しの「逆算」で再利用する）</li>
          </ul>
        </div>

        <div class="box box-important">
          <p><strong>1次不定方程式 ax + by = c の型</strong></p>
          <ol>
            <li><strong><u>特殊解を1つ</u></strong>見つける（小さい数なら目視、大きい数なら互除法の逆算）</li>
            <li>元の式と辺々引いて a(x − x₀) = −b(y − y₀)</li>
            <li>a と b は<strong><u>互いに素だから</u></strong> x − x₀ は b の倍数 → x = bk + x₀ の一般解</li>
            <li>「自然数解」なら一般解を不等式に入れて <strong><u>k の範囲を絞る</u></strong></li>
          </ol>
          <p><strong><u class="wavy">「互いに素だから倍数と言い切れる」の一言が記述の生命線。これを飛ばすと大幅減点になる。</u></strong></p>
        </div>
`;

// ===================================================================
// ③ 因数分解の利用
// ===================================================================
const PART_FACTOR_HTML = `        <h4>③ 積の形に持ち込む（方針①）</h4>

        <div class="box box-important">
          <p><strong>整数問題で最強の変形2つ</strong></p>
          <ul>
            <li><strong><u>xy + ax + by = c は (x + b)(y + a) = c + ab</u></strong> に直せる（定数を補って無理やり因数分解）</li>
            <li>平方の差 x² − y² は必ず <strong><u>(x + y)(x − y)</u></strong> に分解</li>
          </ul>
          <p>積の形にできたら「<strong><u>整数 × 整数 ＝ 定数</u></strong>」なので、約数の組合せを並べるだけになる。</p>
        </div>

        <div class="box box-note">
          <p><strong>約数の組合せを並べる前のチェックリスト</strong></p>
          <ul>
            <li>各因数の<strong><u>取り得る範囲</u></strong>を先に確認（x が自然数なら x + 3 ≥ 4 など）→ 候補が激減する</li>
            <li>x + y と x − y のように<strong><u>偶奇が連動する</u></strong>因数は、偶奇の一致で候補を消せる</li>
            <li>負の約数も忘れない（「整数解」のときは ± 両方）</li>
          </ul>
        </div>

        <div class="box box-note">
          <p><strong>素数条件の問題</strong></p>
          <p>「n² + 6n + 5 が素数になるか」→ まず因数分解 (n+1)(n+5)。
          <strong><u>素数 ⇔ 積に分解したら片方が1</u></strong>。因数の範囲から片方が1になれるかを調べれば結論が出る。
          <strong><u class="wavy">素数条件は「分解してから、1になれるか」の一本道。</u></strong></p>
        </div>
`;

// ===================================================================
// ④ 余りによる分類
// ===================================================================
const PART_MOD_HTML = `        <h4>④ 余りで分類する（方針②）</h4>

        <div class="box box-important">
          <p><strong>べき乗の余りは循環する</strong></p>
          <ol>
            <li>小さい指数から余りを並べて<strong><u>周期を見つける</u></strong>（例：4のべき乗 mod 7 は 4, 2, 1 の周期3）</li>
            <li><strong><u>指数を周期で割った余り</u></strong>で答えが決まる</li>
            <li>特別な形：割る数より1大きい数は常に余り1（7¹⁰⁰ mod 6 = 1）</li>
          </ol>
          <p>記述では合同式の代わりに「7 = 6 + 1 とおいて<strong><u>二項定理</u></strong>」で書く方法も使える。</p>
        </div>

        <div class="box box-note">
          <p><strong>「すべての整数で成り立つ」証明の骨格</strong></p>
          <ul>
            <li>n を割った余りで<strong><u>有限個の場合に分けて全部つぶす</u></strong>（n = 3k, 3k+1, 3k+2 など）</li>
            <li>頻出の結論：<strong><u>平方数を3で割った余りは0か1</u></strong>（2にはならない）。4で割った余りも0か1</li>
            <li><strong><u>連続2整数の積は2の倍数、連続3整数の積は6の倍数</u></strong></li>
          </ul>
          <p><strong><u class="wavy">「平方数の余りは偏る」という事実は、不定方程式の解なし証明の最終兵器になる。</u></strong></p>
        </div>
`;

// ===================================================================
// ⑤ 範囲の絞り込み・記数法
// ===================================================================
const PART_BOUND_HTML = `        <h4>⑤ 範囲の絞り込み（方針③）</h4>

        <div class="box box-important">
          <p><strong>対称式・逆数型のテンプレート</strong></p>
          <ol>
            <li>対称な式は <strong><u>x ≤ y ≤ z と大小を仮定してよい</u></strong>（最後に並べ替えを戻す）</li>
            <li>一番小さい文字を<strong><u>平均で評価</u></strong>：x + y + z = 6 なら 6 ≥ 3x より x ≤ 2</li>
            <li>逆数型 1/x + 1/y = 1/2 なら、1/2 ≤ 2/x より x ≤ 4 と<strong><u>上から抑える</u></strong></li>
            <li>絞れたら残りは<strong><u>代入して虱潰し</u></strong></li>
          </ol>
          <p><strong><u class="wavy">「無限にありそうな解を、不等式で有限個に落とす」のがこの方針の本質。絞る→試すの2段階を型にする。</u></strong></p>
        </div>

        <h4>⑥ n進法</h4>

        <div class="box box-note">
          <p><strong>相互変換の2つの手順</strong></p>
          <ul>
            <li>n進 → 10進：<strong><u>位の重み（nのべき乗）を掛けて足す</u></strong></li>
            <li>10進 → n進：<strong><u>n で割った余りを下から読む</u></strong></li>
            <li>変換したら必ず逆向きに戻して検算する</li>
            <li>小数は位の重みが 1/n, 1/n², … になるだけ（0.101(2) = 1/2 + 1/8）</li>
          </ul>
        </div>
`;

// ===================================================================
// 総まとめ
// ===================================================================
const SUMMARY_HTML = `        <h4>総まとめ — 整数問題の型 早見表</h4>

        <div class="box box-summary">
          <p><strong>問題の形 → 使う方針の対応表</strong></p>
          <ul>
            <li>「xy + ax + by = c」→ <strong><u>(x+b)(y+a) = c+ab</u></strong> に直して約数の組合せ</li>
            <li>「x² − y² = 定数」→ (x+y)(x−y) に分解、<strong><u>偶奇の一致</u></strong>で絞る</li>
            <li>「〜が素数となる」→ 分解して<strong><u>片方が1</u></strong>になれるか</li>
            <li>「ax + by = c の整数解」→ <strong><u>特殊解 → 一般解</u></strong>（互いに素の一言）</li>
            <li>「大きい数の gcd」→ <strong><u>互除法</u></strong></li>
            <li>「7¹⁰⁰ の余り」→ <strong><u>周期を見つける</u></strong></li>
            <li>「すべての整数で示せ」→ <strong><u>余りで分類</u></strong>＋連続整数の積</li>
            <li>「1/x + 1/y = …」「x ≤ y ≤ z」→ <strong><u>大小仮定＋不等式で絞る</u></strong></li>
            <li>「n進法」→ 重みを掛けて足す／余りを下から読む</li>
          </ul>
          <p><strong><u class="wavy">整数問題を見たら最初に唱える：「積にできるか？ 余りで割れるか？ 範囲で絞れるか？」——三大方針の点呼が解答の設計図になる。</u></strong></p>
        </div>
`;

// ===================================================================
// パーツ一覧と連結HTML
// ===================================================================
export const MATH_INTEGER_PARTS: LearningPart[] = [
  { id: 'head', no: '', title: '導入 三大方針', short: '★ はじめに', html: HEAD_HTML },
  { id: 'p1', no: '①', title: '約数・倍数・互除法・不定方程式', short: '① 約数・互除法', html: PART_DIVISOR_HTML },
  { id: 'p2', no: '③', title: '因数分解の利用（積の形）', short: '③ 積の形', html: PART_FACTOR_HTML },
  { id: 'p3', no: '④', title: '余りによる分類', short: '④ 余りで分類', html: PART_MOD_HTML },
  { id: 'p4', no: '⑤', title: '範囲の絞り込み・n進法', short: '⑤ 絞り込み', html: PART_BOUND_HTML },
  { id: 'summary', no: '', title: '総まとめ 型の早見表', short: '★ 総まとめ', html: SUMMARY_HTML },
];

/** 全部つなげた1本（「すべて表示」と印刷用） */
export const MATH_INTEGER_HTML = MATH_INTEGER_PARTS.map(p => p.html).join('\n');
