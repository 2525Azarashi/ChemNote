/**
 * ===================================================================
 * まとめプリント：数学 数III 積分法（全パターン演習）
 *   原典：河野玄斗「積分15パターン」（Stardy）／PASSLABO「積分150問・16クエスト」
 *         ／超わかる！高校数学III 積分法 全34講
 * ===================================================================
 *
 * ■ 位置づけ
 *   adv_thermo.ts / adv_electro.ts と完全に同じ構造・同じ記法で書く。
 *   LearningPart[] を並べて MATH_INTEGRAL_PARTS とし、その html を連結した
 *   ものが MATH_INTEGRAL_HTML（「すべて」タブ＋印刷用）になる。
 *
 * ■ 記法のルール（化学側と完全に共通。tests/learningPrint.test.ts が検査する）
 *   語句   … <strong><u>…</u></strong>             太字＋太い直線（黒）
 *   文章   … <strong><u class="wavy">…</u></strong> 太字＋太い波線（黒）
 *   ・裸の下線タグは使わない（必ず strong の直下に置く）
 *   ・数式は HTML の <sup>/<sub> と ∫ √ π などの文字で直接書く
 *     （まとめプリントは textFormatter を通らない生 HTML なので）
 *
 * ■ 3つの原典の役割分担
 *   ・河野玄斗 … 「積分はたった15パターン」という分類軸と判断フローチャート
 *   ・PASSLABO … 150問を16クエストに割った演習体系と King Property などの技巧
 *   ・超わかる！ … 各パターンの丁寧な計算手順（部分積分の型・置換の選び方）
 *   本まとめはこの3つを統合し、収録した数値例はすべて原典から数字を変えてある。
 */

/** まとめプリント内の「重要事項」1 つ分 */
import type { LearningPart } from './adv_thermo';

// ===================================================================
// 導入：この単元のゴールと全体観
// ===================================================================
const HEAD_HTML = `        <h3 id="sec-math-integral">数III 積分法（全パターン演習）</h3>

        <div class="box box-note">
          <p><strong>この単元のゴール</strong></p>
          <ul>
            <li>どんな積分を見ても「どのパターンか」を<strong><u>10秒以内に判断</u></strong>できる</li>
            <li>不定積分の<strong><u>15パターン</u></strong>を、名前と代表例つきで全部言える</li>
            <li>置換積分は「微分接触」を探すだけ、と言い切れるようになる</li>
            <li>部分積分の2つの型（消去型・同形出現型）を使い分けられる</li>
            <li>定積分の技巧（偶関数・奇関数、King Property、区分求積、漸化式）を使える</li>
          </ul>
          <p><strong><u class="wavy">積分は「ひらめき」ではなく「分類」で解く。見た瞬間にパターン名を言う訓練が、そのまま得点になる。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>先に思い出しておくこと（微分の復習）</strong></p>
          <ul>
            <li>(x<sup>n</sup>)' = nx<sup>n−1</sup>、(sin x)' = cos x、(cos x)' = −sin x、(tan x)' = 1/cos<sup>2</sup>x</li>
            <li>(e<sup>x</sup>)' = e<sup>x</sup>、(log x)' = 1/x</li>
            <li>積の微分 (fg)' = f'g + fg' ← <strong><u>部分積分</u></strong>の正体はこれの逆読み</li>
            <li>合成関数の微分 {f(g(x))}' = f'(g(x))·g'(x) ← <strong><u>置換積分</u></strong>の正体はこれの逆読み</li>
          </ul>
          <p><strong><u class="wavy">積分のテクニックは全部「微分公式の逆読み」である。</u></strong>新しい魔法は1つもない。</p>
        </div>
`;

// ===================================================================
// ① 判断フローチャート
// ===================================================================
const PART_FLOW_HTML = `        <h4>① 最初の10秒 — 積分の判断フローチャート</h4>

        <p>積分問題を見たら、計算を始める前に次の順で「型」を判定する。<strong><u class="wavy">この順番で聞けば、入試の積分はほぼ全部どれかに引っかかる。</u></strong></p>

        <div class="box box-note">
          <p><strong>判断フロー（上から順にチェック）</strong></p>
          <ol>
            <li><strong>Level 0：そのまま公式で積分できるか？</strong><br>
              x<sup>n</sup>・sin・cos・e<sup>x</sup>・1/x … → <strong><u>基本公式</u></strong>で即終了</li>
            <li><strong>Level 1：中身が1次式（ax+b）なだけか？</strong><br>
              sin(3x+1)、e<sup>2x</sup>、(4x−1)<sup>5</sup> … → <strong><u>f(ax+b)型</u></strong>。「1/a を掛けるだけ」</li>
            <li><strong>Level 2：かたまりの微分が横にいるか？（微分接触）</strong><br>
              かたまり g(x) を決めて g'(x) が積の相方にいたら → <strong><u>置換積分（微分接触型）</u></strong><br>
              特に「分子が分母の微分」なら → <strong><u>log型</u></strong>：∫ f'(x)/f(x) dx = log|f(x)| + C</li>
            <li><strong>Level 3：それでもダメなら関数の種類で分岐</strong>
              <ul>
                <li>異種の積（x×e<sup>x</sup>、x×sin x、log x が絡む）→ <strong><u>部分積分</u></strong></li>
                <li>分数関数（分母が因数分解できる）→ <strong><u>部分分数分解</u></strong></li>
                <li>三角関数の累乗・積 → <strong><u>次数下げ／積和公式／1つ残して接触</u></strong></li>
                <li>√(ax+b)、√(a²−x²)、1/(x²+a²)、e<sup>x</sup> まみれ → <strong><u>特殊置換</u></strong></li>
              </ul>
            </li>
          </ol>
        </div>

        <p><strong><u class="wavy">「置換積分しよう」ではなく「微分接触を探そう」と考える。</u></strong>置換がうまくいくのは、かたまりの微分が式の中に隠れているときだけ。闇雲な置換は時間を失うだけである。</p>
`;

// ===================================================================
// ② 基本公式（Level 0）
// ===================================================================
const PART_BASIC_HTML = `        <h4>② パターン1 基本公式 — すべての土台</h4>

        <p>まず<strong><u>絶対に落とせない公式</u></strong>。積分定数 C は毎回書く。</p>

        <div class="box box-note">
          <p><strong>不定積分の基本公式</strong></p>
          <ul>
            <li>∫ x<sup>n</sup> dx = x<sup>n+1</sup>/(n+1) + C（n ≠ −1）</li>
            <li>∫ 1/x dx = log|x| + C ← <strong><u>絶対値を忘れない</u></strong></li>
            <li>∫ e<sup>x</sup> dx = e<sup>x</sup> + C、∫ a<sup>x</sup> dx = a<sup>x</sup>/log a + C</li>
            <li>∫ sin x dx = −cos x + C、∫ cos x dx = sin x + C</li>
            <li>∫ 1/cos<sup>2</sup>x dx = tan x + C、∫ 1/sin<sup>2</sup>x dx = −1/tan x + C</li>
          </ul>
        </div>

        <p>x<sup>n</sup> の n は整数でなくてよい。<strong><u class="wavy">√x や 1/x² は「まず x の累乗の形に直してから」公式を使うのが第一歩。</u></strong></p>
        <ul>
          <li>√x = x<sup>1/2</sup> → ∫ √x dx = (2/3)x√x + C</li>
          <li>1/x<sup>2</sup> = x<sup>−2</sup> → ∫ 1/x² dx = −1/x + C</li>
        </ul>
`;

// ===================================================================
// ③ f(ax+b)型（Level 1）
// ===================================================================
const PART_LINEAR_HTML = `        <h4>③ パターン2 f(ax+b)型 — 「1/a を掛けるだけ」</h4>

        <p>中身が<strong><u>1次式 ax+b</u></strong> のときだけ使える最速ルート。置換 t = ax+b をした結果を公式化したもの。</p>

        <div class="box box-note">
          <p><strong>f(ax+b)型の公式</strong></p>
          <p>F'(x) = f(x) のとき　∫ f(ax+b) dx = (1/a)·F(ax+b) + C</p>
          <ul>
            <li>∫ (3x+2)<sup>4</sup> dx = (1/3)·(3x+2)<sup>5</sup>/5 + C = (3x+2)<sup>5</sup>/15 + C</li>
            <li>∫ e<sup>5x−1</sup> dx = (1/5)e<sup>5x−1</sup> + C</li>
            <li>∫ cos(2x+π/3) dx = (1/2)sin(2x+π/3) + C</li>
            <li>∫ 1/(4x−1) dx = (1/4)log|4x−1| + C</li>
          </ul>
        </div>

        <p><strong><u class="wavy">中身が2次式以上なら、この公式は使えない。</u></strong>∫ sin(x²) dx を (−1/2x)cos(x²) とするのは典型的な誤り（高校範囲では sin(x²) は積分できない）。「1次式のときだけ」を徹底する。</p>
`;

// ===================================================================
// ④ 微分接触型（置換積分の本体）
// ===================================================================
const PART_CONTACT_HTML = `        <h4>④ パターン3〜5 微分接触型 — 置換積分の正体</h4>

        <p>置換積分がうまくいく条件はただ1つ：<strong><u>かたまり g(x) の微分 g'(x) が、積の相方として式の中にいる</u></strong>こと。これを<strong><u>微分接触</u></strong>と呼ぶ。</p>

        <div class="box box-note">
          <p><strong>微分接触の3点セット</strong></p>
          <ol>
            <li><strong>かたまり型</strong>：∫ f(g(x))·g'(x) dx → t = g(x) と置換<br>
              例）∫ 2x(x²+3)<sup>4</sup> dx は t = x²+3 で ∫ t⁴ dt = (x²+3)<sup>5</sup>/5 + C</li>
            <li><strong>log型</strong>：∫ f'(x)/f(x) dx = log|f(x)| + C<br>
              例）∫ (2x+1)/(x²+x−3) dx = log|x²+x−3| + C（分子＝分母の微分）<br>
              例）∫ tan x dx = ∫ sin x/cos x dx = −log|cos x| + C</li>
            <li><strong>定数倍の調整</strong>：g'(x) と定数倍だけずれていたら、定数を掛けて補正<br>
              例）∫ x·e<sup>x²</sup> dx は (x²)' = 2x なので (1/2)e<sup>x²</sup> + C</li>
          </ol>
        </div>

        <p><strong><u class="wavy">慣れてきたら置換の文字 t を書かずに「頭の中で接触を確認して直接答えを書く」練習をする。</u></strong>検算は答えを微分するだけ。この往復が速さを作る。</p>
`;

// ===================================================================
// ⑤ 部分積分（消去型・同形出現型）
// ===================================================================
const PART_BYPARTS_HTML = `        <h4>⑤ パターン6〜7 部分積分 — 2つの型で全部さばく</h4>

        <p>公式：∫ f·g' dx = f·g − ∫ f'·g dx。<strong><u class="wavy">「どちらを微分する側にするか」で迷わないために、目的別に2つの型として覚える。</u></strong></p>

        <div class="box box-note">
          <p><strong>型A：消去型（多項式を削って消す）</strong></p>
          <p>x×（sin / cos / e<sup>x</sup>）の積は、<strong><u>多項式を微分する側</u></strong>に置く。微分のたびに次数が1つ下がり、最後に消える。</p>
          <ul>
            <li>∫ x·cos x dx = x·sin x − ∫ sin x dx = x sin x + cos x + C</li>
            <li>∫ x·e<sup>2x</sup> dx = x·(1/2)e<sup>2x</sup> − ∫ (1/2)e<sup>2x</sup> dx = (2x−1)e<sup>2x</sup>/4 + C</li>
            <li>log x が絡むときは<strong><u>log x を微分する側</u></strong>（積分できないから）：<br>
              ∫ log x dx = ∫ (x)'·log x dx = x log x − x + C</li>
          </ul>
        </div>

        <div class="box box-note">
          <p><strong>型B：同形出現型（同じ積分が再登場 → 方程式で解く）</strong></p>
          <p>e<sup>x</sup>×sin x のように<strong><u>どちらも消えない組</u></strong>は、部分積分を2回すると元の積分 I が右辺に再登場する。<strong><u>I の方程式として解く</u></strong>。</p>
          <p>例）I = ∫ e<sup>x</sup> sin x dx を2回部分積分すると I = e<sup>x</sup>(sin x − cos x) − I が得られ、<br>
          2I = e<sup>x</sup>(sin x − cos x) より I = e<sup>x</sup>(sin x − cos x)/2 + C</p>
        </div>

        <p><strong><u class="wavy">「消す」のか「同形を出して方程式にする」のか、始める前に出口を決める。</u></strong>出口を決めずに部分積分を始めるのが計算迷子の最大原因。</p>
`;

// ===================================================================
// ⑥ 部分分数分解
// ===================================================================
const PART_FRACTION_HTML = `        <h4>⑥ パターン8〜9 分数関数 — 割り算と部分分数分解</h4>

        <div class="box box-note">
          <p><strong>分数関数の2ステップ</strong></p>
          <ol>
            <li><strong>分子の次数 ≧ 分母の次数</strong>なら、まず<strong><u>割り算して帯分数化</u></strong>する<br>
              例）(x²+3x)/(x+1) = x + 2 − 2/(x+1)</li>
            <li>分母が因数分解できるなら<strong><u>部分分数分解</u></strong>：<br>
              1/{(x+a)(x+b)} = 1/(b−a)·{1/(x+a) − 1/(x+b)}<br>
              例）∫ 1/(x²−x−6) dx = ∫ 1/{(x−3)(x+2)} dx = (1/5)log|(x−3)/(x+2)| + C</li>
          </ol>
        </div>

        <p>係数の決定は<strong><u>通分して分子の恒等式</u></strong>から。数値代入（x = −a, −b を入れる）が最速。<strong><u class="wavy">分解した後は全部 log 型（か 1/(x+a)ⁿ 型）に落ちるので、分解さえ済めば勝ち。</u></strong></p>
`;

// ===================================================================
// ⑦ 三角関数の積分
// ===================================================================
const PART_TRIG_HTML = `        <h4>⑦ パターン10〜12 三角関数 — 偶数は次数下げ、奇数は1つ残す</h4>

        <div class="box box-note">
          <p><strong>三角関数の累乗 sin<sup>n</sup>x・cos<sup>n</sup>x</strong></p>
          <ul>
            <li><strong>次数が偶数</strong> → <strong><u>半角公式で次数下げ</u></strong><br>
              sin²x = (1−cos 2x)/2、cos²x = (1+cos 2x)/2<br>
              例）∫ cos²x dx = x/2 + sin 2x/4 + C</li>
            <li><strong>次数が奇数</strong> → <strong><u>1つ残して残りを変換し、微分接触に持ち込む</u></strong><br>
              例）∫ sin³x dx = ∫ (1−cos²x)·sin x dx → t = cos x で −cos x + cos³x/3 + C</li>
          </ul>
        </div>

        <div class="box box-note">
          <p><strong>異なる角の積 sin ax·cos bx など → <u>積和公式</u></strong></p>
          <ul>
            <li>sin A cos B = {sin(A+B) + sin(A−B)}/2</li>
            <li>cos A cos B = {cos(A+B) + cos(A−B)}/2</li>
            <li>sin A sin B = −{cos(A+B) − cos(A−B)}/2</li>
          </ul>
          <p>例）∫ sin 4x cos 2x dx = (1/2)∫ (sin 6x + sin 2x) dx = −cos 6x/12 − cos 2x/4 + C</p>
        </div>

        <p><strong><u class="wavy">「偶数＝次数下げ」「奇数＝1つ残して接触」「角が違う＝積和」。この3行が三角積分のすべて。</u></strong></p>
`;

// ===================================================================
// ⑧ 特殊置換
// ===================================================================
const PART_SPECIAL_HTML = `        <h4>⑧ パターン13〜15 特殊置換 — 形を見たら置き方は決まっている</h4>

        <p>微分接触が見つからない「見た目が悪い」積分は、<strong><u>形と置換が1対1で対応</u></strong>している。暗記でよい。</p>

        <div class="box box-note">
          <p><strong>形 → 置換の対応表</strong></p>
          <ul>
            <li><strong>√(ax+b) を含む</strong> → <strong><u>t = √(ax+b) と丸ごと置換</u></strong>（x も dx も t で書き直す）<br>
              例）∫ x√(x+2) dx は t = √(x+2)、x = t²−2、dx = 2t dt</li>
            <li><strong>√(a²−x²) を含む</strong> → <strong><u>x = a sin θ</u></strong>（√ が a cos θ に化ける）<br>
              例）∫[0→2] √(4−x²) dx = π（半径2の四分円の面積）</li>
            <li><strong>1/(x²+a²) を含む</strong> → <strong><u>x = a tan θ</u></strong>（分母が a²/cos²θ に化ける）<br>
              例）∫[0→3] 1/(x²+9) dx = π/12</li>
            <li><strong>e<sup>x</sup> だらけ</strong> → <strong><u>t = e<sup>x</sup></u></strong>（dt = e<sup>x</sup>dx を式の中から拾う）</li>
          </ul>
        </div>

        <p><strong><u class="wavy">sinθ・tanθ 置換は「定積分専用」と考える。</u></strong>区間の対応（x: 0→2 なら θ: 0→π/2 など）まで書き換えて、θ の世界で完結させるのが安全。不定積分で使うと逆変換で事故が起きやすい。</p>
`;

// ===================================================================
// ⑨ 定積分の技巧
// ===================================================================
const PART_DEFINITE_HTML = `        <h4>⑨ 定積分の技巧 — 計算する前に「サボれないか」を疑う</h4>

        <div class="box box-note">
          <p><strong>技巧1：偶関数・奇関数（区間が −a→a のとき）</strong></p>
          <ul>
            <li>奇関数（x, x³, sin x, x cos x …）→ <strong><u>積分値は 0</u></strong>（計算不要！）</li>
            <li>偶関数（x², cos x, |x| …）→ 2∫[0→a] に半分化</li>
          </ul>
          <p>例）∫[−2→2] (x⁵ + 3x² + sin x) dx = 2∫[0→2] 3x² dx = 16（奇関数部分は全部 0）</p>
        </div>

        <div class="box box-note">
          <p><strong>技巧2：King Property（区間の折り返し）</strong></p>
          <p>∫[a→b] f(x) dx = ∫[a→b] f(a+b−x) dx</p>
          <p>そのままでは解けない積分も、折り返した相方と<strong><u>足すと分子・分母が消える</u></strong>ことがある。</p>
          <p>例）I = ∫[0→π/2] sin x/(sin x + cos x) dx は、x → π/2−x の相方と足すと 2I = ∫[0→π/2] 1 dx = π/2 ∴ I = π/4</p>
        </div>

        <div class="box box-note">
          <p><strong>技巧3：区分求積法（和の極限 → 定積分）</strong></p>
          <p>lim[n→∞] (1/n)Σ[k=1→n] f(k/n) = ∫[0→1] f(x) dx</p>
          <p><strong><u>「1/n をくくり出し、k/n のかたまりを作る」</u></strong>のが変形の合言葉。<br>
          例）lim (1/n)Σ(k/n)² = ∫[0→1] x² dx = 1/3</p>
        </div>

        <div class="box box-note">
          <p><strong>技巧4：積分漸化式（Wallis 型）</strong></p>
          <p>I<sub>n</sub> = ∫[0→π/2] sin<sup>n</sup>x dx は部分積分で <strong><u>I<sub>n</sub> = (n−1)/n · I<sub>n−2</sub></u></strong> が導ける。<br>
          「2つ飛びで下りる」ので、I₀ = π/2、I₁ = 1 から任意の n が求まる。<br>
          例）I₄ = (3/4)(1/2)(π/2) = 3π/16</p>
        </div>

        <div class="box box-note">
          <p><strong>技巧5：定積分で表された関数</strong></p>
          <ul>
            <li>∫[a→b] f(t) dt（区間が定数）→ <strong><u>ただの定数。k とおいて1次方程式</u></strong></li>
            <li>∫[a→x] f(t) dt（区間に x）→ <strong><u>x で微分すると f(x)</u></strong>。両辺微分＋x = a 代入の2点セット</li>
          </ul>
        </div>
`;

// ===================================================================
// ⑩ 総まとめ：15パターン一覧表
// ===================================================================
const SUMMARY_HTML = `        <h4>★ 総まとめ — 15パターン早見表</h4>

        <p><strong><u class="wavy">この表を白紙に再現できたら、この単元は卒業。</u></strong>各行につき「代表例を1問、手が勝手に動くまで」繰り返すこと。</p>

        <div class="box box-note">
          <p><strong>不定積分 15パターン</strong></p>
          <ol>
            <li><strong>基本公式</strong>（x<sup>n</sup>・三角・指数・1/x）</li>
            <li><strong>f(ax+b)型</strong> — 1/a を掛けるだけ（中身が1次式限定）</li>
            <li><strong>微分接触（かたまり型）</strong> — g' が横にいたら t = g</li>
            <li><strong>log型</strong> — 分子が分母の微分 → log|分母|</li>
            <li><strong>tan x・1/tan x</strong> — sin/cos に直して log 型</li>
            <li><strong>部分積分（消去型）</strong> — 多項式×(三角・指数)、log は微分側</li>
            <li><strong>部分積分（同形出現型）</strong> — e<sup>x</sup>×三角は I の方程式</li>
            <li><strong>帯分数化</strong> — 分子の次数が高い分数はまず割る</li>
            <li><strong>部分分数分解</strong> — 分母を因数分解して log 型の和へ</li>
            <li><strong>三角の偶数乗</strong> — 半角公式で次数下げ</li>
            <li><strong>三角の奇数乗</strong> — 1つ残して微分接触</li>
            <li><strong>積和公式</strong> — 角が違う積は和に直す</li>
            <li><strong>√(ax+b)</strong> — 丸ごと t と置換</li>
            <li><strong>√(a²−x²)・1/(x²+a²)</strong> — x = a sinθ／x = a tanθ</li>
            <li><strong>e<sup>x</sup>まみれ</strong> — t = e<sup>x</sup></li>
          </ol>
        </div>

        <div class="box box-note">
          <p><strong>定積分の技巧 5つ</strong></p>
          <ol>
            <li>偶関数・奇関数（−a→a は奇関数を消す）</li>
            <li>King Property（折り返して足す）</li>
            <li>区分求積法（1/n と k/n を作る）</li>
            <li>積分漸化式（Wallis：I<sub>n</sub> = (n−1)/n·I<sub>n−2</sub>）</li>
            <li>定積分で表された関数（定数とおく／x で微分）</li>
          </ol>
        </div>

        <p>順番に迷ったら①判断フローチャートに戻る。<strong><u class="wavy">「分類 → 該当パターンの手筋 → 微分で検算」。この3拍子を守れば、積分は最も安定して満点が狙える分野になる。</u></strong></p>
`;

// ===================================================================
// パーツ一覧と連結HTML
// ===================================================================
export const MATH_INTEGRAL_PARTS: LearningPart[] = [
  { id: 'head', no: '', title: '導入 この単元のゴール', short: '★ はじめに', html: HEAD_HTML },
  { id: 'p1', no: '①', title: '最初の10秒 判断フローチャート', short: '① 判断フロー', html: PART_FLOW_HTML },
  { id: 'p2', no: '②', title: '基本公式', short: '② 基本公式', html: PART_BASIC_HTML },
  { id: 'p3', no: '③', title: 'f(ax+b)型', short: '③ f(ax+b)型', html: PART_LINEAR_HTML },
  { id: 'p4', no: '④', title: '微分接触型（置換積分・log型）', short: '④ 微分接触', html: PART_CONTACT_HTML },
  { id: 'p5', no: '⑤', title: '部分積分（消去型・同形出現型）', short: '⑤ 部分積分', html: PART_BYPARTS_HTML },
  { id: 'p6', no: '⑥', title: '分数関数と部分分数分解', short: '⑥ 部分分数', html: PART_FRACTION_HTML },
  { id: 'p7', no: '⑦', title: '三角関数の積分', short: '⑦ 三角関数', html: PART_TRIG_HTML },
  { id: 'p8', no: '⑧', title: '特殊置換', short: '⑧ 特殊置換', html: PART_SPECIAL_HTML },
  { id: 'p9', no: '⑨', title: '定積分の技巧', short: '⑨ 定積分技巧', html: PART_DEFINITE_HTML },
  { id: 'summary', no: '', title: '総まとめ 15パターン早見表', short: '★ 総まとめ', html: SUMMARY_HTML },
];

/**
 * 従来どおりの「全部つなげた 1 本」の本文。
 * 「すべて表示」を選んだときと、印刷（章まるごとの配布プリント）で使う。
 */
export const MATH_INTEGRAL_HTML = MATH_INTEGRAL_PARTS.map(p => p.html).join('\n');
