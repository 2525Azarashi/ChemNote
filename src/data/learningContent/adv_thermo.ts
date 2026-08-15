// 化学（発展）・理論化学 3章「化学反応とエネルギー」まとめプリント（インプット）
//
// ■ 位置づけ
//   化学基礎の section_1_1〜2_3 と同じ「まとめプリント（インプット）」の
//   化学（発展）版 第1弾。advancedThermoProblems.ts に収録済みの
//   演習1〜20（a3_1〜a3_4）を解く前に読む、知識のインプット面を担当する。
//
// ■ 記法のルール（化学基礎側と完全に共通。tests/learningPrint.test.ts が検査する）
//   語句   … <strong><u>…</u></strong>             太字＋太い直線（黒）
//   文章   … <strong><u class="wavy">…</u></strong> 太字＋太い波線（黒）
//   下線部 … <u class="q">…</u>                     問題文の指示対象（強調ではない）
//   ・裸の <u> は使わない（必ず <strong> の直下に置く）
//   ・インライン SVG の <style> は必ず .lcfig-adv-thermo-N 配下に書く
//     （SVG 内の <style> は文書全体に漏れるため。スコープしないと他の図を壊す）
//
// eslint-disable-next-line
export const ADV_THERMO_HTML = `        <h3 id="sec-adv-thermo">3. 化学反応とエネルギー</h3>

        <div class="box box-note">
          <p><strong>この単元のゴール</strong></p>
          <ul>
            <li>エンタルピー H と エンタルピー変化 ΔH の意味を、符号込みで説明できる</li>
            <li>熱化学反応式を、状態と ΔH をつけて正しく書ける</li>
            <li>ヘスの法則を使って、測れない反応エンタルピーを計算で出せる</li>
            <li>生成エンタルピー・結合エネルギーからの2つの公式を使い分けられる</li>
          </ul>
        </div>

        <h4>重要事項① ～発熱反応と吸熱反応～</h4>

        <p>
          物質はそれぞれ固有のエネルギーをもっている。これを<strong><u>エンタルピー</u></strong>（記号 H、単位 kJ）という。<br>
          化学反応が起こると、反応物のエンタルピーと生成物のエンタルピーの差の分だけ、熱が外に出たり中に入ったりする。
        </p>

        <div class="box box-point">
          <p><strong><u>エンタルピー変化 ΔH の定義</u></strong></p>
          <div class="formula">ΔH ＝ H（生成物の総和） − H（反応物の総和）</div>
          <p><strong><u class="wavy">必ず「生成物 − 反応物」の順で引く。</u></strong>逆にすると符号が丸ごと反転してしまう。</p>
        </div>

        <div class="box box-test">
          <p><strong><u>符号の意味</u></strong></p>
          <ul>
            <li><strong><u>発熱反応</u></strong>…熱を外へ放出する。生成物の方がエネルギーが低い → <strong>ΔH &lt; 0</strong>（負）。まわりの温度は<strong>上がる</strong></li>
            <li><strong><u>吸熱反応</u></strong>…熱を外から吸収する。生成物の方がエネルギーが高い → <strong>ΔH &gt; 0</strong>（正）。まわりの温度は<strong>下がる</strong></li>
          </ul>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-thermo-1" viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-thermo-1 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-1 .lv {font:bold 13px sans-serif;fill:#222;text-anchor:start}
    .learning-content .lcfig-adv-thermo-1 .nt {font:12px sans-serif;fill:#444;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-1 .ax {stroke:#888;stroke-width:1.5}
    .learning-content .lcfig-adv-thermo-1 .lvl {stroke:#16538a;stroke-width:3}
    .learning-content .lcfig-adv-thermo-1 .arw {stroke:#c0392b;stroke-width:2.5;fill:none}
    .learning-content .lcfig-adv-thermo-1 .arw2 {stroke:#1e7d46;stroke-width:2.5;fill:none}
    .learning-content .lcfig-adv-thermo-1 .dh {font:bold 13px sans-serif;text-anchor:start}
  </style>
  <defs>
    <marker id="advth1red" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#c0392b"/>
    </marker>
    <marker id="advth1grn" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#1e7d46"/>
    </marker>
  </defs>

  <text class="ttl" x="180" y="26">発熱反応　ΔH &lt; 0</text>
  <line class="ax" x1="60" y1="50" x2="60" y2="260"/>
  <text class="nt" x="30" y="150" transform="rotate(-90 30 150)">エンタルピー H</text>
  <line class="lvl" x1="80" y1="90" x2="200" y2="90"/>
  <text class="lv" x="205" y="94">反応物（高い）</text>
  <line class="lvl" x1="80" y1="220" x2="200" y2="220"/>
  <text class="lv" x="205" y="224">生成物（低い）</text>
  <path class="arw" d="M140,92 L140,214" marker-end="url(#advth1red)"/>
  <text class="dh" x="150" y="160" fill="#c0392b">ΔH &lt; 0</text>
  <text class="nt" x="180" y="280">下がった分だけ熱を放出 → まわりは温かくなる</text>

  <text class="ttl" x="540" y="26">吸熱反応　ΔH &gt; 0</text>
  <line class="ax" x1="420" y1="50" x2="420" y2="260"/>
  <line class="lvl" x1="440" y1="220" x2="560" y2="220"/>
  <text class="lv" x="565" y="224">反応物（低い）</text>
  <line class="lvl" x1="440" y1="90" x2="560" y2="90"/>
  <text class="lv" x="565" y="94">生成物（高い）</text>
  <path class="arw2" d="M500,218 L500,96" marker-end="url(#advth1grn)"/>
  <text class="dh" x="510" y="160" fill="#1e7d46">ΔH &gt; 0</text>
  <text class="nt" x="540" y="280">上がった分の熱を吸収 → まわりは冷たくなる</text>
</svg>
          <figcaption>エンタルピー図。矢印は「反応物から生成物へ」の向きに引き、その向きと長さが ΔH そのものになる。</figcaption>
        </figure>

        <div class="box box-note">
          <p><strong>反応熱と ΔH のねじれに注意</strong></p>
          <p>
            昔の教科書の「反応熱 Q」は<strong>発熱を正</strong>で書いていた。いまの「ΔH」は<strong>発熱を負</strong>で書く。
            つまり <strong><u>反応熱 ＝ −ΔH</u></strong>。<strong><u class="wavy">「発熱なのにマイナス」という違和感が、この単元最大のつまずきポイント。</u></strong>
          </p>
        </div>

        <h4>重要事項② ～熱化学反応式の書き方～</h4>

        <div class="box box-point">
          <p><strong><u>熱化学反応式の3つの約束</u></strong></p>
          <ol>
            <li><strong><u>注目する物質の係数を 1 にする</u></strong>（反応エンタルピーは「1 mol あたり」で表すため。分数の係数を使ってよい）</li>
            <li><strong><u>すべての物質に状態を書く</u></strong>（固）（液）（気）。同素体は「（黒鉛）」のように種類まで書く</li>
            <li>式のうしろに <strong>ΔH ＝ ○○ kJ</strong> を書く（＝ ではなく → で結ぶ。以前の熱化学方程式とは書き方が違う）</li>
          </ol>
        </div>

        <div class="box box-example">
          <p><strong>例題1</strong>　メタン CH<sub>4</sub> の燃焼エンタルピーは −891 kJ/mol である。熱化学反応式で表せ。</p>
          <details>
            <summary>💡 解答を表示</summary>
            <p>注目する物質は CH<sub>4</sub> なので、<strong>CH<sub>4</sub> の係数を 1</strong> にそろえる。</p>
            <p class="reaction">CH<sub>4</sub>(気) + 2O<sub>2</sub>(気) → CO<sub>2</sub>(気) + 2H<sub>2</sub>O(液)　ΔH ＝ −891 kJ</p>
            <p>水は「液」で書くのが基本（25 ℃, 1013 hPa の標準状態では液体のため）。ここを（気）にすると、蒸発エンタルピーの分だけ値がずれる。</p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>例題2</strong>　水素の燃焼エンタルピーを表す式で、O<sub>2</sub> の係数が 1/2 になるのはなぜか。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>注目しているのは<strong>水素 1 mol</strong> だから。H<sub>2</sub> の係数を 1 に固定した結果、O<sub>2</sub> は 1/2 になる。</p>
            <p class="reaction">H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(液)　ΔH ＝ −286 kJ</p>
            <p><strong>2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O　ΔH ＝ −572 kJ</strong> と書いてしまうと、これは「水素 2 mol あたり」の値になり、燃焼エンタルピーの定義から外れる。</p>
          </details>
        </div>

        <h4>重要事項③ ～反応エンタルピーの種類～</h4>

        <p>名前がたくさん出てくるが、どれも <strong><u class="wavy">「1 mol の何が」「どうなるとき」の2点をセットで覚えれば区別できる。</u></strong></p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>名称</th><th>1 mol にするもの</th><th>どうなるとき</th><th>例</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong><u>燃焼エンタルピー</u></strong></td>
                <td>燃える物質</td>
                <td>完全燃焼するとき（必ず発熱＝負）</td>
                <td>CH<sub>4</sub>(気) + 2O<sub>2</sub>(気) → CO<sub>2</sub>(気) + 2H<sub>2</sub>O(液)　ΔH ＝ −891 kJ</td>
              </tr>
              <tr>
                <td><strong><u>生成エンタルピー</u></strong></td>
                <td>できる化合物</td>
                <td>成分元素の<strong>単体</strong>から生成するとき</td>
                <td>C(黒鉛) + O<sub>2</sub>(気) → CO<sub>2</sub>(気)　ΔH ＝ −394 kJ</td>
              </tr>
              <tr>
                <td><strong><u>中和エンタルピー</u></strong></td>
                <td>できる水 H<sub>2</sub>O</td>
                <td>酸と塩基が中和するとき</td>
                <td>H<sup>+</sup>aq + OH<sup>−</sup>aq → H<sub>2</sub>O(液)　ΔH ＝ −56.5 kJ</td>
              </tr>
              <tr>
                <td><strong><u>溶解エンタルピー</u></strong></td>
                <td>溶ける物質</td>
                <td>大量の水（aq）に溶けるとき</td>
                <td>NaOH(固) + aq → NaOHaq　ΔH ＝ −44.5 kJ</td>
              </tr>
              <tr>
                <td><strong><u>状態変化のエンタルピー</u></strong></td>
                <td>変化する物質</td>
                <td>融解・蒸発・昇華するとき（すべて吸熱＝正）</td>
                <td>H<sub>2</sub>O(液) → H<sub>2</sub>O(気)　ΔH ＝ +44 kJ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="box box-test">
          <p><strong><u>よく問われる約束</u></strong></p>
          <ul>
            <li><strong><u class="wavy">単体の生成エンタルピーは 0 と決められている。</u></strong>（O<sub>2</sub>(気)、C(黒鉛) などは基準そのもの。ただし同素体では基準の方だけが 0）</li>
            <li>強酸と強塩基の中和エンタルピーは、酸・塩基の種類によらずほぼ <strong>−56.5 kJ/mol</strong>。中和の正体が H<sup>+</sup> + OH<sup>−</sup> → H<sub>2</sub>O だけだから</li>
            <li>燃焼エンタルピーは<strong>必ず負</strong>。正の答えが出たら符号ミス</li>
          </ul>
        </div>

        <div class="box box-example">
          <p><strong>例題3</strong>　次の式が表す反応エンタルピーの名称を答えよ。</p>
          <p>（1） 2C(黒鉛) + 2H<sub>2</sub>(気) → C<sub>2</sub>H<sub>4</sub>(気)　ΔH ＝ +52 kJ<br>
             （2） H<sub>2</sub>SO<sub>4</sub>(液) + aq → H<sub>2</sub>SO<sub>4</sub>aq　ΔH ＝ −95 kJ<br>
             （3） CO<sub>2</sub>(固) → CO<sub>2</sub>(気)　ΔH ＝ +25 kJ</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）<strong>エチレン C<sub>2</sub>H<sub>4</sub> の生成エンタルピー</strong>…右辺に化合物 1 mol、左辺がすべて単体（黒鉛と水素）なので生成エンタルピー。</p>
            <p>（2）<strong>硫酸の溶解エンタルピー</strong>…aq（大量の水）に溶かしているので溶解エンタルピー。</p>
            <p>（3）<strong>二酸化炭素の昇華エンタルピー</strong>…固体から直接気体へ。状態変化なので吸熱で正。</p>
            <p>判定のコツは<strong><u class="wavy">「右辺に何が 1 mol できているか」を先に見ること。</u></strong></p>
          </details>
        </div>

        <h4>重要事項④ ～ヘスの法則～</h4>

        <div class="box box-point">
          <p><strong><u>ヘスの法則（総熱量保存の法則）</u></strong></p>
          <p><strong><u class="wavy">反応エンタルピーは、反応の最初と最後の状態だけで決まり、途中の経路にはよらない。</u></strong></p>
          <p>だから、実際には測れない反応でも、測れる反応を組み合わせれば計算で求められる。</p>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-thermo-2" viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-thermo-2 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-2 .st {font:bold 13px sans-serif;fill:#222;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-2 .cap {font:12px sans-serif;fill:#444;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-2 .bx {fill:#eef5fa;stroke:#16538a;stroke-width:2}
    .learning-content .lcfig-adv-thermo-2 .ar {stroke:#c0392b;stroke-width:2.5;fill:none}
    .learning-content .lcfig-adv-thermo-2 .ar2 {stroke:#1e7d46;stroke-width:2.5;fill:none;stroke-dasharray:7 5}
    .learning-content .lcfig-adv-thermo-2 .lb {font:bold 12px sans-serif;text-anchor:middle}
  </style>
  <defs>
    <marker id="advth2red" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#c0392b"/>
    </marker>
    <marker id="advth2grn" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#1e7d46"/>
    </marker>
  </defs>

  <text class="ttl" x="360" y="26">同じ「はじめ」と「おわり」なら、どの道を通っても ΔH の合計は同じ</text>

  <rect class="bx" x="40" y="60" width="170" height="52" rx="8"/>
  <text class="st" x="125" y="92">C(黒鉛) + O₂(気)</text>

  <rect class="bx" x="510" y="60" width="170" height="52" rx="8"/>
  <text class="st" x="595" y="92">CO₂(気)</text>

  <rect class="bx" x="275" y="190" width="170" height="52" rx="8"/>
  <text class="st" x="360" y="222">CO(気) + 1/2 O₂(気)</text>

  <path class="ar" d="M215,86 L505,86" marker-end="url(#advth2red)"/>
  <text class="lb" x="360" y="72" fill="#c0392b">直接の道　ΔH = -394 kJ</text>

  <path class="ar2" d="M150,118 L300,186" marker-end="url(#advth2grn)"/>
  <text class="lb" x="185" y="168" fill="#1e7d46">ΔH₁ = -111 kJ</text>

  <path class="ar2" d="M425,186 L575,118" marker-end="url(#advth2grn)"/>
  <text class="lb" x="545" y="168" fill="#1e7d46">ΔH₂ = -283 kJ</text>

  <text class="cap" x="360" y="266">まわり道の合計　(-111) + (-283) = -394 kJ　→　直接の道と一致する</text>
</svg>
          <figcaption>ヘスの法則。炭素の不完全燃焼（CO 経由）を通っても、直接 CO₂ にしても、合計の ΔH は変わらない。</figcaption>
        </figure>

        <div class="box box-point">
          <p><strong><u>ヘスの法則を使う3ステップ</u></strong></p>
          <ol>
            <li><strong><u>与えられた値をすべて熱化学反応式に直す</u></strong>（①②③…と番号を振る）</li>
            <li><strong><u>求めたい式を書く</u></strong>（ΔH ＝ x kJ とおく）</li>
            <li>①②③を<strong>足す・引く・逆にする・何倍かする</strong>で求めたい式を組み立て、ΔH にも同じ操作をする</li>
          </ol>
          <p><strong><u class="wavy">式を逆向きにしたら ΔH の符号も反転し、式を n 倍したら ΔH も n 倍する。</u></strong>ここが計算ミスの最頻出ポイント。</p>
        </div>

        <div class="box box-example">
          <p><strong>例題4</strong>　次の①②から、一酸化炭素の生成エンタルピーを求めよ。<br>
            ① C(黒鉛) + O<sub>2</sub>(気) → CO<sub>2</sub>(気)　ΔH ＝ −394 kJ<br>
            ② CO(気) + 1/2 O<sub>2</sub>(気) → CO<sub>2</sub>(気)　ΔH ＝ −283 kJ</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>求めたい式は「CO が単体から 1 mol できる式」。</p>
            <p class="reaction">C(黒鉛) + 1/2 O<sub>2</sub>(気) → CO(気)　ΔH ＝ x kJ</p>
            <p>① から ② を引けばよい（②を逆向きにして足す）。</p>
            <p class="formula">x ＝ (−394) − (−283) ＝ <strong>−111 kJ</strong></p>
            <p>よって一酸化炭素の生成エンタルピーは <strong><u>−111 kJ/mol</u></strong>。</p>
            <p>この値は<strong>直接は測れない</strong>。炭素を燃やすと必ず CO<sub>2</sub> まで進んでしまうため。<strong><u class="wavy">測れない値を計算で出せることが、ヘスの法則の最大の意義。</u></strong></p>
          </details>
        </div>

        <h4>重要事項⑤ ～生成エンタルピーからの公式～</h4>

        <div class="box box-point">
          <p><strong><u>生成エンタルピーによる反応エンタルピーの計算</u></strong></p>
          <div class="formula">ΔH ＝ Σ（生成物の生成エンタルピー） − Σ（反応物の生成エンタルピー）</div>
          <p>ΔH の定義とまったく同じ「生成物 − 反応物」の形。<strong>係数をかけ忘れない</strong>こと。</p>
        </div>

        <div class="box box-example">
          <p><strong>例題5</strong>　生成エンタルピーが CO<sub>2</sub>(気) −394 kJ/mol、H<sub>2</sub>O(液) −286 kJ/mol、CH<sub>4</sub>(気) −75 kJ/mol のとき、メタンの燃焼エンタルピーを求めよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p class="reaction">CH<sub>4</sub>(気) + 2O<sub>2</sub>(気) → CO<sub>2</sub>(気) + 2H<sub>2</sub>O(液)　ΔH ＝ x kJ</p>
            <p>生成物側：(−394) + 2 × (−286) ＝ −966 kJ<br>
               反応物側：(−75) + 2 × 0 ＝ −75 kJ　（O<sub>2</sub> は<strong>単体なので 0</strong>）</p>
            <p class="formula">x ＝ (−966) − (−75) ＝ <strong>−891 kJ</strong></p>
            <p>よって燃焼エンタルピーは <strong><u>−891 kJ/mol</u></strong>。</p>
          </details>
        </div>

        <h4>重要事項⑥ ～結合エネルギーからの公式～</h4>

        <p>
          <strong><u>結合エネルギー</u></strong>…気体分子の共有結合 1 mol を切って、ばらばらの原子にするのに必要なエネルギー（kJ/mol）。<br>
          <strong><u class="wavy">結合を切るときは吸熱（正）、結合ができるときは発熱（負）。</u></strong>
        </p>

        <div class="box box-point">
          <p><strong><u>結合エネルギーによる反応エンタルピーの計算</u></strong></p>
          <div class="formula">ΔH ＝ Σ（反応物の結合エネルギー） − Σ（生成物の結合エネルギー）</div>
          <p>
            <strong><u class="wavy">生成エンタルピーの公式とは引く向きが逆になる。</u></strong>
            「切るのにいる分」−「できてもらえる分」と考えれば、向きを暗記しなくてよい。
          </p>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-thermo-3" viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-thermo-3 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-3 .st {font:bold 13px sans-serif;fill:#222;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-3 .cap {font:12px sans-serif;fill:#444;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-3 .bx {fill:#fdf6e3;stroke:#b7791f;stroke-width:2}
    .learning-content .lcfig-adv-thermo-3 .bx2 {fill:#eef5fa;stroke:#16538a;stroke-width:2}
    .learning-content .lcfig-adv-thermo-3 .up {stroke:#c0392b;stroke-width:2.5;fill:none}
    .learning-content .lcfig-adv-thermo-3 .dn {stroke:#1e7d46;stroke-width:2.5;fill:none}
    .learning-content .lcfig-adv-thermo-3 .lb {font:bold 12px sans-serif;text-anchor:middle}
  </style>
  <defs>
    <marker id="advth3red" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#c0392b"/>
    </marker>
    <marker id="advth3grn" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#1e7d46"/>
    </marker>
  </defs>

  <text class="ttl" x="360" y="26">いったん原子まで バラして、組み立て直す と考える</text>

  <rect class="bx" x="250" y="52" width="220" height="46" rx="8"/>
  <text class="st" x="360" y="81">ばらばらの原子（いちばん高い）</text>

  <rect class="bx2" x="40" y="165" width="200" height="46" rx="8"/>
  <text class="st" x="140" y="194">反応物</text>

  <rect class="bx2" x="480" y="165" width="200" height="46" rx="8"/>
  <text class="st" x="580" y="194">生成物</text>

  <path class="up" d="M150,161 L290,102" marker-end="url(#advth3red)"/>
  <text class="lb" x="150" y="130" fill="#c0392b">結合を切る（吸熱・正）</text>

  <path class="dn" d="M430,102 L570,161" marker-end="url(#advth3grn)"/>
  <text class="lb" x="575" y="130" fill="#1e7d46">結合ができる（発熱・負）</text>

  <text class="cap" x="360" y="238">ΔH = （反応物の結合エネルギーの和） - （生成物の結合エネルギーの和）</text>
</svg>
          <figcaption>結合エネルギーの考え方。反応物をいったん原子までバラす道を通っても、ヘスの法則により ΔH は同じになる。</figcaption>
        </figure>

        <div class="box box-example">
          <p><strong>例題6</strong>　結合エネルギーが H−H 436 kJ/mol、Cl−Cl 243 kJ/mol、H−Cl 432 kJ/mol のとき、H<sub>2</sub>(気) + Cl<sub>2</sub>(気) → 2HCl(気) の ΔH を求めよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>反応物側：436 + 243 ＝ 679 kJ　（H−H が1本、Cl−Cl が1本）<br>
               生成物側：432 × 2 ＝ 864 kJ　（H−Cl が<strong>2本</strong>。係数のかけ忘れに注意）</p>
            <p class="formula">ΔH ＝ 679 − 864 ＝ <strong>−185 kJ</strong></p>
            <p>負なので発熱反応。<strong><u class="wavy">切るのに必要な分より、できるときに出る分の方が大きいと発熱になる。</u></strong></p>
          </details>
        </div>

        <div class="box box-test">
          <p><strong><u>結合エネルギーを使うときの注意</u></strong></p>
          <ul>
            <li>結合エネルギーの式が使えるのは、<strong><u>原則すべてが気体</u></strong>のとき。液体や固体が混ざるときは、蒸発エンタルピーや昇華エンタルピーを別に足す</li>
            <li>二重結合・三重結合は、単結合の何倍かではなく<strong>独立した値</strong>が与えられる（C＝C は C−C の2倍ではない）</li>
          </ul>
        </div>

        <h4>重要事項⑦ ～光とエネルギー～</h4>

        <ul>
          <li><strong><u>光化学反応</u></strong>…光のエネルギーを吸収して進む反応。例）ハロゲン化銀の分解（写真フィルム）、H<sub>2</sub> と Cl<sub>2</sub> の爆発的反応</li>
          <li><strong><u>光合成</u></strong>…光のエネルギーを使って、エネルギーの低い CO<sub>2</sub> と H<sub>2</sub>O から、エネルギーの高いグルコースをつくる大きな<strong>吸熱</strong>反応（ΔH ＝ +2810 kJ）</li>
          <li><strong><u>化学発光</u></strong>…反応で生じたエネルギーが光として放出される現象。例）ルミノール反応、ケミカルライト</li>
          <li><strong><u>光触媒</u></strong>…光が当たると強い酸化力を示す物質。代表は<strong>酸化チタン(IV) TiO<sub>2</sub></strong>（セルフクリーニング建材）</li>
        </ul>

        <div class="box box-note">
          <p><strong>この単元の総まとめ</strong></p>
          <ol>
            <li>ΔH は必ず<strong>「生成物 − 反応物」</strong>。発熱が負</li>
            <li>熱化学反応式は<strong>注目する物質の係数を 1</strong>、<strong>状態を明記</strong></li>
            <li>ヘスの法則 → <strong>逆にしたら符号反転、n 倍したら ΔH も n 倍</strong></li>
            <li>生成エンタルピーの式は「<strong>生成物 − 反応物</strong>」、結合エネルギーの式は「<strong>反応物 − 生成物</strong>」で<strong>向きが逆</strong></li>
            <li>単体の生成エンタルピーは <strong>0</strong></li>
          </ol>
          <p><strong><u class="wavy">この5点を押さえたら、演習問題（演習1〜20）へ進んで手を動かそう。</u></strong></p>
        </div>
`;
