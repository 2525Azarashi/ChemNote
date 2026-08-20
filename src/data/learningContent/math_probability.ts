/**
 * ===================================================================
 * まとめプリント：数学 場合の数・確率（全パターン演習）
 *   原典：PASSLABO「たった1本で確率 全パターン徹底解説（厳選50題）」
 * ===================================================================
 *
 * ■ 位置づけ・記法は math_integral.ts / math_vector.ts と完全に共通。
 *   収録した数値例はすべて原典から数字を変えてある。
 */

import type { LearningPart } from './adv_thermo';

// ===================================================================
// 導入
// ===================================================================
const HEAD_HTML = `        <h3 id="sec-math-probability">場合の数・確率（全パターン演習）</h3>

        <div class="box box-note">
          <p><strong>この単元のゴール</strong></p>
          <ul>
            <li>P と C の使い分けを<strong><u>「並べるか・選ぶだけか」</u></strong>で即断できる</li>
            <li>「少なくとも」を見た瞬間に<strong><u>余事象</u></strong>が浮かぶ</li>
            <li>反復試行の nCr が<strong><u>「場所の選び方」</u></strong>だと説明できる</li>
            <li>条件付き確率を「<strong><u>縮んだ世界の中の割合</u></strong>」として計算できる</li>
          </ul>
          <p><strong><u class="wavy">確率は「公式当てはめ」ではなく「数え方の選択」。どの数え方を選ぶかの判断基準を言語化することが、この単元の勉強である。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>大前提：同様に確からしく数える</strong></p>
          <ul>
            <li>確率では<strong><u>すべてのものを区別して数える</u></strong>（同じ色の玉も区別する）</li>
            <li>サイコロ2個は「大小を区別して36通り」が全事象</li>
            <li>確率の合計は必ず1 → <strong><u>場合分けの検算</u></strong>に使える</li>
          </ul>
        </div>
`;

// ===================================================================
// ① 場合の数の土台
// ===================================================================
const PART_COUNT_HTML = `        <h4>① P と C の使い分け・頻出の数え方</h4>

        <div class="box box-important">
          <p><strong>使い分けの一言判定</strong></p>
          <ul>
            <li><strong><u>並べる（順序あり）→ P</u></strong>：nPr = n(n−1)…（r個の積）</li>
            <li><strong><u>選ぶだけ（順序なし）→ C</u></strong>：nCr = nPr / r!</li>
            <li>同時に行う独立な選択 → <strong><u>積の法則</u></strong>で掛ける</li>
          </ul>
        </div>

        <div class="box box-note">
          <p><strong>頻出の型（覚える対応）</strong></p>
          <ul>
            <li>隣り合う → <strong><u>かたまりにして1個</u></strong>とみなす（かたまり内の並びを掛ける）</li>
            <li>隣り合わない → <strong><u>先に他を並べて隙間に入れる</u></strong></li>
            <li>同じものを含む順列 → n!/(p!·q!·…)（同じものの並べ替えで割る）</li>
            <li>最短経路 → 「右◯個・上◯個の並べ替え」＝ C で数える。途中点経由は<strong><u>区間ごとに数えて掛ける</u></strong></li>
          </ul>
        </div>

        <h4>② 円順列・重複順列・組分け</h4>

        <div class="box box-note">
          <p><strong>回転・裏返し・区別の有無で割る</strong></p>
          <ul>
            <li>円順列：<strong><u>(n−1)!</u></strong>（1人固定して残りを並べる）</li>
            <li>じゅず順列：円順列 ÷ 2（裏返しも同一視）</li>
            <li>重複順列：各要素に独立な選択肢 → n<sup>r</sup></li>
            <li>組分け：<strong><u>同じ人数の組に区別がないときだけ、組数の階乗で割る</u></strong>（人数が違う組は割らない）</li>
          </ul>
          <p><strong><u class="wavy">「何と何を同一視するか」を問題文から読み取り、同一視の分だけ割る——円順列も組分けも原理はこれ1つ。</u></strong></p>
        </div>
`;

// ===================================================================
// ③ 確率の基本と余事象
// ===================================================================
const PART_BASIC_HTML = `        <h4>③ 確率の基本（サイコロ・玉・くじ）</h4>

        <div class="box box-note">
          <p><strong>頻出の数え方</strong></p>
          <ul>
            <li>「同時に取り出す」→ <strong><u>組合せ C</u></strong> で分子・分母を数える</li>
            <li>最大値が k → <strong><u>「k以下」から「k−1以下」を引く</u></strong>（差で数える型）</li>
            <li>積が奇数 ⇔ 全部奇数、のように<strong><u>言い換えてから</u></strong>数える</li>
          </ul>
        </div>

        <h4>④ 余事象・和事象</h4>

        <div class="box box-important">
          <p><strong>余事象のサインとなる言葉</strong></p>
          <ul>
            <li>「<strong><u>少なくとも1つ</u></strong>」→ 余事象（1つも無い）を数えて 1 から引く</li>
            <li>「〜以上」→ 余事象（〜未満）のほうが少ないことが多い</li>
            <li>「異なる」→ 余事象（すべて同じ・ゾロ目）</li>
          </ul>
          <p><strong><u class="wavy">判断基準は「求める事象と余事象、どちらの場合の数が少ないか」。少ない方を数えるのが常に正解。</u></strong></p>
        </div>

        <div class="box box-note">
          <p><strong>和事象の公式</strong></p>
          <ul>
            <li>P(A∪B) = P(A) + P(B) − <strong><u>P(A∩B)</u></strong>（重なりを引く）</li>
            <li>排反（同時に起こらない）のときだけ、ただ足してよい</li>
            <li>「4の倍数かつ6の倍数」＝<strong><u>最小公倍数12の倍数</u></strong>（24ではない）</li>
          </ul>
        </div>
`;

// ===================================================================
// ⑤ 反復試行
// ===================================================================
const PART_REPEAT_HTML = `        <h4>⑤ 独立試行・反復試行</h4>

        <div class="box box-important">
          <p><strong>反復試行の公式と、その意味</strong></p>
          <ul>
            <li>n 回中ちょうど r 回起こる確率：<strong><u>nCr · p^r · (1−p)^(n−r)</u></strong></li>
            <li>nCr の意味は「<strong><u>どの回に起こるかという場所の選び方</u></strong>」</li>
            <li>だから「1回目と5回目だけ」のように<strong><u>場所が指定されている問題では nCr を掛けない</u></strong>（最頻出ミス）</li>
          </ul>
        </div>

        <div class="box box-note">
          <p><strong>優勝決定（先に3勝）型のテンプレート</strong></p>
          <ol>
            <li>「n 回目に決着」＝「<strong><u>(n−1) 回目までに2勝</u></strong>」かつ「<strong><u>n 回目に勝つ</u></strong>」</li>
            <li>(n−1) 回目までは反復試行で数え、最後の1回の確率を掛ける</li>
          </ol>
          <p><strong><u class="wavy">最後の1回を固定しないと「すでに優勝が決まった後の試合」を含んでしまう。「決着の瞬間」を式に固定するのがこの型の本質。</u></strong></p>
        </div>

        <div class="box box-note">
          <p><strong>点の移動（ランダムウォーク）型</strong></p>
          <ol>
            <li>表が x 回として<strong><u>座標を x の式</u></strong>で表す（例：+2 と −1 なら 3x − n）</li>
            <li>座標の条件を <strong><u>x の方程式・不等式に翻訳</u></strong></li>
            <li>各 x の確率を反復試行で計算して足す</li>
          </ol>
        </div>
`;

// ===================================================================
// ⑥ 条件付き確率・期待値
// ===================================================================
const PART_COND_HTML = `        <h4>⑥ 条件付き確率</h4>

        <div class="box box-important">
          <p><strong>定義と読み方</strong></p>
          <ul>
            <li>P<sub>A</sub>(B) = P(A∩B)/P(A)：<strong><u>分母が全体から A に縮む</u></strong></li>
            <li>サイン：「〜だったことが<strong><u>分かっているとき</u></strong>」「〜のとき」</li>
            <li>実戦では全事象に戻らず、<strong><u>縮んだ世界の場合の数</u></strong>で割ってよい</li>
          </ul>
        </div>

        <div class="box box-note">
          <p><strong>原因の確率（ベイズ型）</strong></p>
          <ol>
            <li><strong><u>樹形図</u></strong>を描き、結果（例：赤玉）に至る経路の確率を全部足す（＝分母）</li>
            <li>そのうち問われている原因を通る経路（＝分子）を選ぶ</li>
          </ol>
          <p><strong><u class="wavy">「時間の順序と条件付けの向きは無関係」。先に起きた原因を、後から分かった結果で条件付けしてよい。樹形図が正確なら機械的に解ける。</u></strong></p>
        </div>

        <h4>⑦ 期待値</h4>

        <div class="box box-note">
          <p><strong>期待値の計算と性質</strong></p>
          <ul>
            <li>期待値 E = Σ（値 × 確率）。表を書いて<strong><u>確率の合計が1</u></strong>になるか必ず検算</li>
            <li><strong><u>和の期待値は期待値の和</u></strong>：E(X+Y) = E(X) + E(Y)（独立でなくても成立。サイコロ2個の和は 3.5 + 3.5 = 7）</li>
            <li>E(X + c) = E(X) + c、E(aX) = aE(X)（線形性）</li>
            <li>意味は「<strong><u>長い目で見た1回あたりの平均</u></strong>」→ 参加費との比較で損得を判断</li>
          </ul>
        </div>
`;

// ===================================================================
// 総まとめ
// ===================================================================
const SUMMARY_HTML = `        <h4>総まとめ — 確率の型 早見表</h4>

        <div class="box box-summary">
          <p><strong>問題文 → 使う型の対応表</strong></p>
          <ul>
            <li>「並べる」→ P ／「選ぶ」→ C ／「各人に選択肢」→ n<sup>r</sup></li>
            <li>「隣り合う」→ かたまり ／「隣り合わない」→ 隙間</li>
            <li>「円卓」→ (n−1)! ／「同じ人数の組分け」→ 組数の階乗で割る</li>
            <li>「少なくとも」「〜以上」「異なる」→ <strong><u>余事象</u></strong></li>
            <li>「最大値・最小値」→ <strong><u>「以下」の差</u></strong></li>
            <li>「n 回投げてちょうど r 回」→ <strong><u>反復試行</u></strong>（場所指定なら nCr なし）</li>
            <li>「先に◯勝で優勝」→ <strong><u>最後の1回を固定</u></strong></li>
            <li>「分かっているとき」→ <strong><u>条件付き確率</u></strong>（分母が縮む）</li>
            <li>「平均」「損得の判断」→ <strong><u>期待値</u></strong>（確率の合計1で検算）</li>
          </ul>
          <p><strong><u class="wavy">融合問題は「どの型とどの型の組合せか」を先に言語化する。型の名前を言えた瞬間に、解答の設計図は完成している。</u></strong></p>
        </div>
`;

// ===================================================================
// パーツ一覧と連結HTML
// ===================================================================
export const MATH_PROBABILITY_PARTS: LearningPart[] = [
  { id: 'head', no: '', title: '導入 この単元のゴール', short: '★ はじめに', html: HEAD_HTML },
  { id: 'p1', no: '①', title: '場合の数の土台（P・C・円順列・組分け）', short: '① 場合の数', html: PART_COUNT_HTML },
  { id: 'p2', no: '③', title: '確率の基本・余事象・和事象', short: '③ 基本・余事象', html: PART_BASIC_HTML },
  { id: 'p3', no: '⑤', title: '独立試行・反復試行', short: '⑤ 反復試行', html: PART_REPEAT_HTML },
  { id: 'p4', no: '⑥', title: '条件付き確率・期待値', short: '⑥ 条件付き・期待値', html: PART_COND_HTML },
  { id: 'summary', no: '', title: '総まとめ 型の早見表', short: '★ 総まとめ', html: SUMMARY_HTML },
];

/** 全部つなげた1本（「すべて表示」と印刷用） */
export const MATH_PROBABILITY_HTML = MATH_PROBABILITY_PARTS.map(p => p.html).join('\n');
