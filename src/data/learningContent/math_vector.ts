/**
 * ===================================================================
 * まとめプリント：数学 ベクトル（全パターン演習）
 *   原典：PASSLABO「ベクトル 入試頻出解法を6時間で全パターン解説」
 * ===================================================================
 *
 * ■ 位置づけ
 *   math_integral.ts と完全に同じ構造・同じ記法で書く。
 *   LearningPart[] を並べて MATH_VECTOR_PARTS とし、その html を連結した
 *   ものが MATH_VECTOR_HTML（「すべて」タブ＋印刷用）になる。
 *
 * ■ 記法のルール（化学側と完全に共通）
 *   語句   … <strong><u>…</u></strong>             太字＋太い直線（黒）
 *   文章   … <strong><u class="wavy">…</u></strong> 太字＋太い波線（黒）
 *   ・裸の下線タグは使わない（必ず strong の直下に置く）
 *   ・数式は HTML の <sup>/<sub> と √ · などの文字で直接書く
 *
 * ■ 収録した数値例はすべて原典から数字を変えてある。
 */

import type { LearningPart } from './adv_thermo';

// ===================================================================
// 導入：この単元のゴール
// ===================================================================
const HEAD_HTML = `        <h3 id="sec-math-vector">ベクトル（全パターン演習）</h3>

        <div class="box box-note">
          <p><strong>この単元のゴール</strong></p>
          <ul>
            <li>ベクトルの図形問題を<strong><u>「計算」に翻訳する言い換え</u></strong>を全部言える</li>
            <li>交点問題を<strong><u>係数比較</u></strong>で機械的に解ける</li>
            <li>「垂直⇔内積0」「一直線上⇔係数の和が1」を即座に使える</li>
            <li>空間ベクトルを「平面＋z成分」として恐れず扱える</li>
          </ul>
          <p><strong><u class="wavy">ベクトルは「図形の言い換え辞典」。図形の言葉を計算の言葉に訳す対応表を頭に入れれば、あとは連立方程式を解くだけになる。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>最重要の言い換え対応表（これがベクトルの全て）</strong></p>
          <ul>
            <li>垂直 ⇔ <strong><u>内積が 0</u></strong></li>
            <li>平行 ⇔ <strong><u>実数倍</u></strong>（成分なら x<sub>1</sub>y<sub>2</sub> − x<sub>2</sub>y<sub>1</sub> = 0）</li>
            <li>P が直線 AB 上 ⇔ OP = sOA + tOB で <strong><u>s + t = 1</u></strong></li>
            <li>P が平面 ABC 上 ⇔ 係数の和が 1（<strong><u>共面条件</u></strong>）</li>
            <li>長さ・距離 ⇔ <strong><u>大きさの2乗</u></strong>（|a|² = a·a）で処理</li>
          </ul>
        </div>
`;

// ===================================================================
// ① 基本演算と内積
// ===================================================================
const PART_BASIC_HTML = `        <h4>① 成分計算・大きさ・単位ベクトル</h4>

        <p>ベクトルの計算は<strong><u>x成分・y成分を別々に</u></strong>扱うだけ。大きさは三平方の定理で |a| = √(x² + y²)。</p>

        <div class="box box-note">
          <p><strong>頻出の道具</strong></p>
          <ul>
            <li><strong><u>単位ベクトル</u></strong>：a と同じ向きで大きさ1 → a/|a|（自分の大きさで割る）</li>
            <li>大きさ k で a に平行なベクトル → ±k·a/|a|（<strong><u>向きが2つ</u></strong>あるのを忘れない）</li>
            <li>平行条件（成分）：a = (x<sub>1</sub>, y<sub>1</sub>)、b = (x<sub>2</sub>, y<sub>2</sub>) が平行 ⇔ x<sub>1</sub>y<sub>2</sub> − x<sub>2</sub>y<sub>1</sub> = 0</li>
          </ul>
        </div>

        <h4>② 内積の2つの顔</h4>

        <div class="box box-note">
          <p><strong>内積の定義と成分表示</strong></p>
          <ul>
            <li>a·b = |a||b|cosθ（<strong><u>大きさとなす角の式</u></strong>）</li>
            <li>a·b = x<sub>1</sub>x<sub>2</sub> + y<sub>1</sub>y<sub>2</sub>（<strong><u>成分の式</u></strong>）</li>
            <li>2つを等号でつなぐと cosθ = a·b / (|a||b|)（なす角の公式）</li>
          </ul>
          <p><strong><u class="wavy">なす角は「①成分で内積 → ②大きさ → ③公式に代入」の3ステップで機械的に求まる。</u></strong></p>
        </div>

        <div class="box box-important">
          <p><strong>内積がらみの最重要パターン</strong></p>
          <ul>
            <li>垂直 ⇔ <strong><u>a·b = 0</u></strong>（ベクトル最頻出の言い換え）</li>
            <li>|a + b|² = |a|² + 2a·b + |b|²（<strong><u>大きさは2乗して展開</u></strong>。内積は普通の文字式のように展開できる）</li>
            <li>|a + tb| の最小値 → <strong><u>2乗して t の2次関数</u></strong>とみて平方完成。最小のとき (a + tb) ⊥ b になっている（図形的検算）</li>
          </ul>
        </div>
`;

// ===================================================================
// ③ 位置ベクトル
// ===================================================================
const PART_POSITION_HTML = `        <h4>③ 位置ベクトル（内分・外分・重心）</h4>

        <p>点の位置を始点 O からのベクトルで表すのが位置ベクトル。図形の点はすべて a、b、c の式になる。</p>

        <div class="box box-note">
          <p><strong>3つの公式（これで図形の点は全部書ける）</strong></p>
          <ul>
            <li>AB を m:n に内分する点：<strong><u>(na + mb)/(m + n)</u></strong>（比の後ろの数字が前の点に付く「たすきがけ」）</li>
            <li>AB を m:n に外分する点：m:(−n) の内分として処理 → (−na + mb)/(m − n)</li>
            <li>三角形 ABC の重心：<strong><u>(a + b + c)/3</u></strong>（3点の平均）</li>
          </ul>
          <p><strong><u class="wavy">外分は「マイナス付きの内分」と覚えれば公式は1つで済む。答えが出たら内分点は線分の内側・外分点は外側にあるかを一目検算する。</u></strong></p>
        </div>

        <h4>④ 交点問題（ベクトル図形の主役）</h4>

        <div class="box box-important">
          <p><strong>2直線の交点の解法テンプレート</strong></p>
          <ol>
            <li>交点 P を<strong><u>一方の線分の内分点</u></strong>として表す（AP:PN = t:(1−t) とおく）</li>
            <li>P を<strong><u>もう一方の線分の内分点</u></strong>としても表す（s を使う）</li>
            <li>a、b は<strong><u>1次独立</u></strong>（平行でなく零ベクトルでもない）だから、<strong><u>係数を比較</u></strong>して s、t の連立方程式を解く</li>
          </ol>
          <p><strong><u class="wavy">「1次独立だから係数比較できる」の一言を答案に必ず書く。この型だけで入試のベクトル図形問題の半分は解ける。</u></strong></p>
        </div>

        <div class="box box-note">
          <p><strong>共線条件（一直線上の言い換え）</strong></p>
          <ul>
            <li>P が直線 AB 上 ⇔ OP = sOA + tOB かつ <strong><u>s + t = 1</u></strong></li>
            <li>さらに s ≥ 0、t ≥ 0 なら<strong><u>線分 AB 上</u></strong></li>
            <li>由来：内分点の公式 (na + mb)/(m+n) の係数を足すと必ず 1 になることの一般化</li>
          </ul>
        </div>
`;

// ===================================================================
// ⑤ 面積・正射影・ベクトル方程式
// ===================================================================
const PART_AREA_HTML = `        <h4>⑤ 三角形の面積と正射影</h4>

        <div class="box box-note">
          <p><strong>面積公式は2つの形で</strong></p>
          <ul>
            <li>S = (1/2)√(|a|²|b|² − (a·b)²)（<strong><u>内積の形</u></strong>）</li>
            <li>S = (1/2)|x<sub>1</sub>y<sub>2</sub> − x<sub>2</sub>y<sub>1</sub>|（<strong><u>成分の形</u></strong>。実戦ではこちらが速い）</li>
          </ul>
          <p><strong><u class="wavy">頂点が原点でない三角形は、まず1つの頂点を始点にしたベクトル（AB と AC）に直してから公式に入れる。座標をそのまま入れるのが典型ミス。</u></strong></p>
        </div>

        <div class="box box-note">
          <p><strong>正射影ベクトル（垂線の足の最短ルート）</strong></p>
          <ul>
            <li>b の a への正射影：<strong><u>(a·b/|a|²)·a</u></strong>（内積を大きさの2乗で割って a 方向に伸ばす）</li>
            <li>垂線の長さは |b − 正射影| で求まる</li>
            <li>別解：足 H を H = tOA とおき、BH·OA = 0 から t を決める（空間でも同じ手が使える）</li>
          </ul>
        </div>

        <h4>⑥ ベクトル方程式（直線と円）</h4>

        <div class="box box-important">
          <p><strong>図形とベクトル方程式の翻訳表</strong></p>
          <ul>
            <li>直線：p = a + td（<strong><u>通る点＋方向ベクトルの実数倍</u></strong>）</li>
            <li>直線 ax + by = c の<strong><u>法線ベクトルは係数そのまま (a, b)</u></strong>、方向ベクトルは (b, −a)</li>
            <li>円：<strong><u>|p − c| = r</u></strong>（中心 c から距離 r）</li>
            <li>円：<strong><u>(p − a)·(p − b) = 0</u></strong>（AB を直径とする円。円周角の定理の逆）</li>
          </ul>
          <p><strong><u class="wavy">「絶対値の形＝中心と半径」「内積0の形＝直径の両端」。この翻訳は空間の球面でもそのまま使う。</u></strong></p>
        </div>
`;

// ===================================================================
// ⑦ 空間ベクトル
// ===================================================================
const PART_SPACE_HTML = `        <h4>⑦ 空間ベクトル（平面＋z成分）</h4>

        <p>空間ベクトルの公式は<strong><u>平面の公式に z 成分を1つ足すだけ</u></strong>。内積・大きさ・垂直条件・内分点、すべて形は同じ。</p>

        <div class="box box-note">
          <p><strong>平面との違い（ここだけ注意）</strong></p>
          <ul>
            <li>空間の2直線は交わるとは限らない（<strong><u>ねじれの位置</u></strong>がある）→ 交点問題では連立が解をもつかの確認が必要</li>
            <li>1次独立の条件が「3つのベクトルが同一平面上にない」に変わる</li>
            <li>ベクトルの分解は a、b、c の3本で行う（係数比較も3本立て）</li>
          </ul>
        </div>

        <h4>⑧ 共面条件と球面</h4>

        <div class="box box-important">
          <p><strong>共面条件（s + t = 1 の空間版）</strong></p>
          <ul>
            <li>P が平面 ABC 上 ⇔ OP = sOA + tOB + uOC かつ <strong><u>s + t + u = 1</u></strong></li>
            <li>由来：AP = m·AB + n·AC を O 始点に書き直すと係数の和が 1 になる</li>
            <li>直線と平面の交点：直線上の点を t で表し、共面条件に代入して t を決める</li>
          </ul>
        </div>

        <div class="box box-note">
          <p><strong>球面の方程式</strong></p>
          <ul>
            <li>中心 (a, b, c)、半径 r：<strong><u>(x−a)² + (y−b)² + (z−c)² = r²</u></strong></li>
            <li>平面で切った切り口は円。半径は<strong><u>直角三角形</u></strong>（球の半径・中心から平面までの距離・切り口の半径）で三平方</li>
            <li>球と平面が接する ⇔ 中心から平面までの距離＝半径</li>
          </ul>
          <p><strong><u class="wavy">球の問題は「中心と半径の直角三角形」の図を描いた瞬間に終わる。式より先に図を描く。</u></strong></p>
        </div>
`;

// ===================================================================
// 総まとめ
// ===================================================================
const SUMMARY_HTML = `        <h4>総まとめ — ベクトル問題の型 早見表</h4>

        <div class="box box-summary">
          <p><strong>問題文 → 使う型の対応表</strong></p>
          <ul>
            <li>「なす角を求めよ」→ 内積を成分で計算 → cosθ = a·b/(|a||b|)</li>
            <li>「垂直となる t」→ <strong><u>内積 = 0</u></strong></li>
            <li>「|a + tb| の最小値」→ <strong><u>2乗して2次関数</u></strong></li>
            <li>「交点 P を a、b で表せ」→ 2通りに表して<strong><u>係数比較</u></strong>（1次独立を明記）</li>
            <li>「一直線上にある」→ 実数倍、または<strong><u>係数の和が1</u></strong></li>
            <li>「面積」→ (1/2)|x<sub>1</sub>y<sub>2</sub> − x<sub>2</sub>y<sub>1</sub>|（始点を揃えてから）</li>
            <li>「垂線の足」→ <strong><u>正射影ベクトル</u></strong>、または H = tOA とおいて内積0</li>
            <li>「平面 ABC 上にある」→ <strong><u>係数の和が1</u></strong>（共面条件）</li>
            <li>「球面」→ 中心・半径を読み取り、切り口・接する条件は<strong><u>直角三角形</u></strong></li>
          </ul>
          <p><strong><u class="wavy">迷ったら「図形の言葉を計算の言葉に訳せているか」を確認する。訳し終わっていれば、残りはただの計算である。</u></strong></p>
        </div>
`;

// ===================================================================
// パーツ一覧と連結HTML
// ===================================================================
export const MATH_VECTOR_PARTS: LearningPart[] = [
  { id: 'head', no: '', title: '導入 この単元のゴール', short: '★ はじめに', html: HEAD_HTML },
  { id: 'p1', no: '①', title: '基本演算と内積', short: '① 演算・内積', html: PART_BASIC_HTML },
  { id: 'p2', no: '③', title: '位置ベクトルと交点問題', short: '③ 位置・交点', html: PART_POSITION_HTML },
  { id: 'p3', no: '⑤', title: '面積・正射影・ベクトル方程式', short: '⑤ 面積・方程式', html: PART_AREA_HTML },
  { id: 'p4', no: '⑦', title: '空間ベクトル・共面条件・球面', short: '⑦ 空間', html: PART_SPACE_HTML },
  { id: 'summary', no: '', title: '総まとめ 型の早見表', short: '★ 総まとめ', html: SUMMARY_HTML },
];

/** 全部つなげた1本（「すべて表示」と印刷用） */
export const MATH_VECTOR_HTML = MATH_VECTOR_PARTS.map(p => p.html).join('\n');
