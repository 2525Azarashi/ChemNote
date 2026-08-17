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
//   ・裸の下線タグは使わない（必ず strong の直下に置く）
//   ・インライン SVG の style は必ず .lcfig-adv-thermo-N 配下に書く
//     （SVG 内の style は文書全体に漏れるため。スコープしないと他の図を壊す）
//
// ■ 「重要事項ごとに見る」ための構造（2026-08 改訂）
//   もとは 1 本の長い HTML だったが、
//     ・まとめプリントの内容が省略されている（もっと詳しく）
//     ・同じ熱化学でも重要事項ごとに切り替えて見たい
//   という要望を受けて、重要事項①〜⑦を ADV_THERMO_PARTS に分割した。
//   配布プリント（化学の道しるべ 理論化学～化学反応と熱・光エネルギー編～）の
//   実物に合わせた構成は次の通り。
//     ① 粒子の熱運動と物質の三態
//     ② 温度と熱 ／ ②(2) 反応エンタルピーの測定（熱量の計算）
//     ③ 反応熱とエンタルピー
//     ④(1) 熱化学反応式の書き方 ／ ④(2) 反応エンタルピーの種類
//     ⑤ エネルギー図とヘスの法則
//     　＋ 定期テスト・入試に出やすいこと① エンタルピーの決定方法
//     　＋（補講）生成エンタルピーからの公式 ／（補講）結合エネルギーからの公式
//     ⑥ エンタルピーとエントロピーの調整
//     ⑦ 化学反応と光
//   演習は 1〜20 まで、コラムは ❶〜❺ と深堀りコラムまで省略せず収録している。
//   ADV_THERMO_HTML は従来どおり「全部つなげた 1 本」を返すので、
//   既存の表示・印刷・テストはそのまま動く。
//   LearningViewer 側はこの配列からボタン（チップ）を並べ、
//   選ばれた重要事項だけを描画する。
//
// eslint-disable-next-line

/** まとめプリント内の「重要事項」1 つ分 */
export type LearningPart = {
  /** タブ内で一意なID（URLやDOM idには使っていないが将来の目印用） */
  id: string;
  /** 見出しに出す丸数字 */
  no: string;
  /** 正式な見出し（印刷タイトルにも使う） */
  title: string;
  /** ボタン（チップ）に出す短い名前 */
  short: string;
  /** その重要事項だけの本文HTML */
  html: string;
};

// ===================================================================
// 導入（この単元のゴール）
// ===================================================================
const HEAD_HTML = `        <h3 id="sec-adv-thermo">3. 化学反応とエネルギー</h3>

        <div class="box box-note">
          <p><strong>この単元のゴール</strong></p>
          <ul>
            <li>エンタルピー H と エンタルピー変化 ΔH の意味を、符号込みで説明できる</li>
            <li>実験で測った温度変化から、反応エンタルピーを kJ/mol で計算できる</li>
            <li>熱化学反応式を、状態と ΔH をつけて正しく書ける</li>
            <li>反応エンタルピーの名称（燃焼・生成・中和・溶解・状態変化）を区別できる</li>
            <li>ヘスの法則を使って、測れない反応エンタルピーを計算で出せる</li>
            <li>生成エンタルピー・結合エネルギーからの2つの公式を使い分けられる</li>
            <li>光と化学反応の関係（光化学反応・光合成・化学発光・光触媒）を説明できる</li>
          </ul>
          <p><strong><u class="wavy">この単元は「符号」と「1 mol あたり」の2つを外すと全問まちがう。</u></strong>逆に、そこだけ徹底すれば得点源になる。</p>
        </div>

        <div class="box box-review">
          <p><strong>先に思い出しておくこと（化学基礎の復習）</strong></p>
          <ul>
            <li>物質量 n［mol］＝ 質量 w［g］ ÷ モル質量 M［g/mol］</li>
            <li>気体 1 mol の体積は 0 ℃・1013 hPa で 22.4 L</li>
            <li>中和の本質は H<sup>+</sup> ＋ OH<sup>−</sup> → H<sub>2</sub>O</li>
            <li>単体・化合物・同素体（C の黒鉛とダイヤモンド、O<sub>2</sub> とO<sub>3</sub> など）の区別</li>
          </ul>
        </div>
`;

// ===================================================================
// 重要事項① 粒子の熱運動と物質の三態
//   まとめプリント p.2。化学基礎の教科書にも載っている内容だが、
//   ここを飛ばすと重要事項②の「状態変化に使う熱」が理解できない。
// ===================================================================
const PART_MOTION_HTML = `        <h4>重要事項① ～粒子の熱運動と物質の三態～</h4>

        <p class="lc-src-note">（化学基礎の教科書にも記載されている内容。ここが重要事項②の土台になる）</p>

        <div class="box box-point">
          <p><strong><u>熱運動と拡散</u></strong></p>
          <ul>
            <li><strong><u>気体の拡散</u></strong>…物質の構成粒子が自然に散らばっていく現象<br>
                例）別々の入れ物に入れておいた窒素と臭素の入れ物をくっつけると、やがて<strong>均一な混合気体</strong>になる</li>
            <li><strong><u>熱運動</u></strong>…物質を構成する粒子が行っている<strong>不規則な運動</strong></li>
          </ul>
          <p><strong><u class="wavy">すべての粒子が同じ速さで運動しているわけではなく、高温になるほど速さの平均値は大きくなる。</u></strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>セルシウス温度と絶対温度</u></strong></p>
          <ul>
            <li><strong><u>セルシウス温度</u></strong>…℃ で表す温度</li>
            <li><strong><u>絶対温度</u></strong>…K（ケルビン）で表す温度</li>
          </ul>
          <div class="formula">T（絶対温度）［K］ ＝ 273 ＋ t（セルシウス温度）［℃］</div>
          <p><strong><u>絶対零度</u></strong>…すべての粒子が熱運動をしなくなる温度。<strong>セルシウス温度 −273 ℃ ＝ 絶対温度 0 K</strong></p>
          <p>温度の<strong>差</strong>をとるときは、℃ でも K でも同じ値になる（<strong>1 ℃ の変化 ＝ 1 K の変化</strong>）。重要事項②の Δt がこれにあたる。</p>
        </div>

        <div class="box box-point">
          <p><strong><u>物質の三態と状態変化</u></strong></p>
          <ul>
            <li><strong><u>物質の三態</u></strong>…同じ物質で、温度などの条件を変化させた<strong>固体・液体・気体</strong>の異なった状態</li>
            <li><strong><u>状態変化</u></strong>…物質が固体、液体、気体と状態を変えること</li>
          </ul>
          <p><strong><u class="wavy">物質を構成する粒子間の引力と熱運動の大小関係で、状態は決まる。</u></strong></p>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-thermo-5" viewBox="0 0 720 330" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-thermo-5 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-5 .st {font:bold 13px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-5 .nm {font:bold 12px sans-serif;fill:#c0392b;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-5 .nm2 {font:bold 12px sans-serif;fill:#1e7d46;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-5 .bx {fill:#f4f9fc;stroke:#16538a;stroke-width:2;rx:8}
    .learning-content .lcfig-adv-thermo-5 .pt {fill:#4a90c2}
    .learning-content .lcfig-adv-thermo-5 .ar {stroke:#c0392b;stroke-width:2.4;fill:none}
    .learning-content .lcfig-adv-thermo-5 .ar2 {stroke:#1e7d46;stroke-width:2.4;fill:none}
    .learning-content .lcfig-adv-thermo-5 .nt {font:11px sans-serif;fill:#555;text-anchor:middle}
  </style>
  <defs>
    <marker id="advth5r" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#c0392b"/>
    </marker>
    <marker id="advth5g" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#1e7d46"/>
    </marker>
  </defs>

  <text class="ttl" x="360" y="22">状態変化の名前（吸熱＝赤／発熱＝緑）</text>

  <rect class="bx" x="40" y="150" width="150" height="110"/>
  <text class="st" x="115" y="278">固体</text>
  <g class="pt">
    <circle cx="70" cy="180" r="7"/><circle cx="95" cy="180" r="7"/><circle cx="120" cy="180" r="7"/><circle cx="145" cy="180" r="7"/><circle cx="170" cy="180" r="7"/>
    <circle cx="70" cy="205" r="7"/><circle cx="95" cy="205" r="7"/><circle cx="120" cy="205" r="7"/><circle cx="145" cy="205" r="7"/><circle cx="170" cy="205" r="7"/>
    <circle cx="70" cy="230" r="7"/><circle cx="95" cy="230" r="7"/><circle cx="120" cy="230" r="7"/><circle cx="145" cy="230" r="7"/><circle cx="170" cy="230" r="7"/>
  </g>

  <rect class="bx" x="285" y="150" width="150" height="110"/>
  <text class="st" x="360" y="278">液体</text>
  <g class="pt">
    <circle cx="310" cy="185" r="7"/><circle cx="335" cy="200" r="7"/><circle cx="362" cy="182" r="7"/><circle cx="390" cy="198" r="7"/><circle cx="415" cy="186" r="7"/>
    <circle cx="318" cy="222" r="7"/><circle cx="348" cy="235" r="7"/><circle cx="378" cy="222" r="7"/><circle cx="408" cy="232" r="7"/>
  </g>

  <rect class="bx" x="530" y="150" width="150" height="110"/>
  <text class="st" x="605" y="278">気体</text>
  <g class="pt">
    <circle cx="556" cy="172" r="7"/><circle cx="640" cy="180" r="7"/><circle cx="590" cy="210" r="7"/><circle cx="662" cy="230" r="7"/><circle cx="548" cy="240" r="7"/>
  </g>

  <path class="ar" d="M195,180 L280,180" marker-end="url(#advth5r)"/>
  <text class="nm" x="238" y="172">融解</text>
  <path class="ar2" d="M280,232 L195,232" marker-end="url(#advth5g)"/>
  <text class="nm2" x="238" y="252">凝固</text>

  <path class="ar" d="M440,180 L525,180" marker-end="url(#advth5r)"/>
  <text class="nm" x="482" y="172">蒸発</text>
  <path class="ar2" d="M525,232 L440,232" marker-end="url(#advth5g)"/>
  <text class="nm2" x="482" y="252">凝縮</text>

  <path class="ar" d="M110,145 C200,60 480,60 570,145" marker-end="url(#advth5r)"/>
  <text class="nm" x="340" y="72">昇華（固体 → 気体）</text>
  <path class="ar2" d="M628,145 C660,100 660,300 640,300 L200,300 C140,300 130,285 128,268" marker-end="url(#advth5g)"/>
  <text class="nm2" x="420" y="318">凝華（気体 → 固体）</text>

  <text class="nt" x="360" y="132">← 粒子間の引力にうちかつ向き（吸熱）　　引力でまとまる向き（発熱） →</text>
</svg>
          <figcaption>状態変化の 6 つの名前。<strong>ばらばらにする向き（融解・蒸発・昇華）は必ず吸熱</strong>、<strong>集まる向き（凝固・凝縮・凝華）は必ず発熱</strong>。この向きと符号の対応が、重要事項④の「状態変化のエンタルピー」に直結する。</figcaption>
        </figure>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>　</th><th>固体</th><th>液体</th><th>気体</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>粒子間の引力</td>
                <td>粒子間の距離が小さく、引力が働く</td>
                <td>粒子間の距離が小さく、引力が働く</td>
                <td>粒子間の距離が大きく、引力はほとんど働かない</td>
              </tr>
              <tr>
                <td>粒子の熱運動</td>
                <td>熱運動が小さく、ほぼ一定の位置にとどまってその場でわずかに振動する</td>
                <td>熱運動が大きく、自由に動き回る</td>
                <td>激しく熱運動するため、自由に飛び回る</td>
              </tr>
              <tr>
                <td>形</td>
                <td>ほぼ一定</td>
                <td>自由に変わる</td>
                <td>自由に変わる</td>
              </tr>
              <tr>
                <td>体積</td>
                <td>ほぼ一定</td>
                <td>ほぼ一定</td>
                <td>非常に大きく、温度や圧力によって変化する</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="box box-point">
          <p><strong><u>融点と沸点</u></strong></p>
          <ul>
            <li><strong><u>融点</u></strong>…固体が融解するときの温度</li>
            <li><strong><u>沸点</u></strong>…液体が<strong>沸騰</strong>（液体の内部からの蒸発）するときの温度</li>
          </ul>
          <p><strong><u class="wavy">すべての物質での状態変化が終わるまで、温度は一定に保たれる。</u></strong>この「温度が上がらない区間」があることが、重要事項②でパターンを 2 つに分ける理由になる。</p>
        </div>

        <div class="box box-memory">
          <p>加えた熱の使われ方は<strong>2 通りしかない</strong>。<br>
             ・<strong>温度を上げる</strong>ために使われる（＝重要事項② パターン①）<br>
             ・<strong>状態を変える</strong>ために使われる（＝重要事項② パターン②。このときは温度が上がらない）<br>
             <strong><u class="wavy">「温度が動いているのか、状態が動いているのか」を先に見分けるのが熱量計算の第一歩。</u></strong></p>
        </div>

        <div class="box box-example">
          <p><strong>確認問題①</strong>　次の問いに答えよ。</p>
          <p>（1） 27 ℃ を絶対温度で表せ。<br>
             （2） 氷に熱を加えているのに、0 ℃ のまま温度が上がらない時間帯があるのはなぜか。<br>
             （3） 高温になると、粒子の熱運動はどうなるか。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1） T ＝ 273 ＋ 27 ＝ <strong>300 K</strong></p>
            <p>（2） 加えた熱が<strong>融解（状態変化）</strong>に使われているから。粒子の配列をくずすために熱が消費され、温度上昇には回らない。</p>
            <p>（3） <strong>速さの平均値が大きくなる</strong>（激しくなる）。ただし、すべての粒子が同じ速さになるわけではない。</p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項② 温度と熱（熱量の公式・状態変化の熱）
//   まとめプリント p.3。ここが演習1・演習6・演習7・演習14 の土台。
// ===================================================================
const PART_TEMP_HTML = `        <h4>重要事項② ～温度と熱～</h4>

        <p>
          状態変化の詳しい内容は「物質の三態と状態変化」で学習する。ここでは<strong><u class="wavy">状態変化の熱量のみに注目する。</u></strong><br>
          <strong><u class="wavy">状態や温度は、物質に加わる熱量（移動した熱の量）により変化する。</u></strong>
        </p>

        <div class="box box-note">
          <p><strong>圧力を一定にして考える理由</strong></p>
          <p>融点や沸点は<strong>圧力によって変わる</strong>ため、状態変化を起こすときは圧力を一定にして考える。</p>
          <p>例）氷は 1 気圧（1.013 × 10<sup>5</sup> Pa）のときにのみ、<strong>0 ℃ で融解して水になる</strong>。</p>
        </div>

        <div class="box box-point">
          <p><strong><u>パターン① 温度変化がおこるとき</u></strong></p>
          <p>→ <strong><u class="wavy">温度を変化させるための熱量の変化を考える（温度は変化する）。</u></strong></p>
          <div class="formula">熱量 Q ［J］ ＝ 質量 m ［g］ × 比熱 c ［J/(g・K)］ × 温度変化 Δt ［K］</div>
          <ul>
            <li>① <strong><u>熱量</u></strong>…移動した熱の量</li>
            <li>② <strong><u>熱容量</u></strong>…物質の温度を <strong>1 K 上げるのに必要な熱量</strong>（C ＝ m × c より <strong>Q ＝ C × Δt</strong>）</li>
            <li>③ <strong><u>比熱</u></strong>…物質 <strong>1 g 当たりの熱容量</strong>。<strong>物質により異なる</strong>。例）水 4.18 J/(g・K)（問題では 4.2 とすることが多い）</li>
          </ul>
          <p>Δt は摂氏でもケルビンでも同じ値になる（差だから）。<strong>1 ℃ の変化 ＝ 1 K の変化</strong>。</p>
        </div>

        <div class="box box-test">
          <p><strong><u>熱の移動とエネルギー保存の法則</u></strong></p>
          <p>温度が異なる 2 つの物質が接すると、<strong>高温の物質から低温の物質へ熱が移動する</strong>。</p>
          <p><strong><u class="wavy">高温の物質が失った熱の量と、低温の物質が得た熱の量は等しい（＝エネルギー保存の法則）。</u></strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>パターン② 状態変化がおこるとき</u></strong></p>
          <p>例）大気圧での水の沸点は 100 ℃、融点は 0 ℃</p>
          <p>→ <strong><u class="wavy">温度変化ではなく、粒子間の配列や引力を断ち切るのに必要な熱量を考える（温度は変化しない）。</u></strong></p>
          <ul>
            <li><strong><u>融解熱</u></strong>…物質 1 mol が融解をするときに吸収する熱量　<strong>性質</strong> 粒子間の<strong>配列をくずす</strong></li>
            <li><strong><u>蒸発熱</u></strong>…物質 1 mol が蒸発をするときに吸収する熱量　<strong>性質</strong> 粒子間の<strong>引力を断ち切る</strong></li>
          </ul>
          <p><strong><u class="wavy">加えられた熱量は状態変化に使われ、引力を断ち切る蒸発熱の方が、融解熱より大きい。</u></strong>（水では融解熱 6.0 kJ/mol に対し、蒸発熱 41 kJ/mol）</p>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-thermo-6" viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-thermo-6 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-6 .ax {stroke:#555;stroke-width:1.6}
    .learning-content .lcfig-adv-thermo-6 .axl {font:bold 12px sans-serif;fill:#333;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-6 .crv {stroke:#c0392b;stroke-width:3;fill:none}
    .learning-content .lcfig-adv-thermo-6 .flat {stroke:#7c3aed;stroke-width:3;fill:none}
    .learning-content .lcfig-adv-thermo-6 .gd {stroke:#bbb;stroke-width:1;stroke-dasharray:4 4}
    .learning-content .lcfig-adv-thermo-6 .lb {font:bold 12px sans-serif;fill:#333;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-6 .lb2 {font:bold 11px sans-serif;fill:#7c3aed;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-6 .lb3 {font:bold 11px sans-serif;fill:#c0392b;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-6 .tk {font:11px sans-serif;fill:#333;text-anchor:end}
  </style>

  <text class="ttl" x="360" y="22">水 180 g（10 mol）を 0 ℃ の氷から 100 ℃ の水蒸気にする（演習1）</text>

  <line class="ax" x1="80" y1="270" x2="670" y2="270"/>
  <line class="ax" x1="80" y1="270" x2="80" y2="50"/>
  <text class="axl" x="375" y="298">加えた熱量（合計 545.6 kJ）</text>
  <text class="axl" x="30" y="160" transform="rotate(-90 30 160)">温度 ［℃］</text>

  <line class="gd" x1="80" y1="230" x2="670" y2="230"/>
  <line class="gd" x1="80" y1="110" x2="670" y2="110"/>
  <text class="tk" x="74" y="234">0</text>
  <text class="tk" x="74" y="114">100</text>

  <path class="flat" d="M110,230 L215,230"/>
  <text class="lb2" x="162" y="252">融解 60 kJ</text>
  <text class="lb2" x="162" y="268">（温度一定）</text>

  <path class="crv" d="M215,230 L345,110"/>
  <text class="lb3" x="268" y="168">加熱 75.6 kJ</text>

  <path class="flat" d="M345,110 L640,110"/>
  <text class="lb2" x="492" y="94">蒸発 410 kJ（温度一定・いちばん大きい）</text>

  <text class="lb" x="150" y="212">氷 → 水</text>
  <text class="lb" x="300" y="212">水の加熱</text>
  <text class="lb" x="492" y="132">水 → 水蒸気</text>

  <text class="lb2" x="560" y="252">※ 平らな区間＝パターン②（状態変化）</text>
  <text class="lb3" x="560" y="268">※ 斜めの区間＝パターン①（温度変化）</text>
</svg>
          <figcaption>加熱曲線。<strong>平らな区間では温度が上がらず、熱はすべて状態変化に使われている</strong>。区間ごとにパターン①と②を切り替えて計算し、最後に足すのが定石。</figcaption>
        </figure>

        <div class="box box-example">
          <p><strong>演習1 ★</strong>　0 ℃ の氷（水）180 g をすべて 100 ℃ の水蒸気にするのに必要な熱量は何 kJ か。ただし、この操作は 1.013 × 10<sup>5</sup> Pa のもとで行い、水の比熱を 4.2 J/(g・℃)、融解熱を 6.0 kJ/mol、蒸発熱を 41 kJ/mol とする。原子量は H ＝ 1、O ＝ 16 とする。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>まず物質量に直す。180 g × (1 mol / 18 g) ＝ <strong>10 mol</strong></p>
            <p>① 0 ℃ の氷 → 0 ℃ の水（<strong>パターン②</strong>）　融解熱がかかる</p>
            <p class="formula">6.0 kJ/mol × 10 mol ＝ 60 kJ</p>
            <p>② 0 ℃ の水 → 100 ℃ の水（<strong>パターン①</strong>）　熱量がかかる</p>
            <p class="formula">4.2 J/(g・℃) × 180 g × (100 − 0) ＝ 75600 J ＝ 75.6 kJ　（単位注意）</p>
            <p>③ 100 ℃ の水 → 100 ℃ の水蒸気（<strong>パターン②</strong>）　蒸発熱がかかる</p>
            <p class="formula">41 kJ/mol × 10 mol ＝ 410 kJ</p>
            <p>よって、①〜③の過程にかかる熱量を足すと</p>
            <p class="formula">60 kJ ＋ 75.6 kJ ＋ 410 kJ ＝ <strong>545.6 kJ</strong></p>
            <p><strong><u class="wavy">パターン①は g（質量）で、パターン②は mol（物質量）で計算する。</u></strong>ここを混ぜるのが最大のミス。</p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項③ 反応熱とエンタルピー
//   まとめプリント p.4〜5（コラム❶・深堀りコラムを含む）
// ===================================================================
const PART_1_HTML = `        <h4>重要事項③ ～反応熱とエンタルピー～</h4>

        <div class="box box-point">
          <p><strong><u>この節の 3 つの用語</u></strong></p>
          <ul>
            <li><strong><u>反応熱</u></strong>…熱の放出や吸収を伴う化学変化で出入りする熱量</li>
            <li><strong><u>エンタルピー H</u></strong>…物質がもつエネルギー（単位 kJ）</li>
            <li><strong><u>エンタルピー変化 ΔH</u></strong>…反応が起こった際のエネルギーの変化</li>
          </ul>
        </div>

        <div class="box box-review">
          <p><strong>コラム❶　バーベキューをしよう！</strong></p>
          <p><strong>ひろき</strong>：入試も終わったし、バーベキューしようよ！</p>
          <p>（それから 1 週間して）</p>
          <p><strong>はると</strong>：やろか！バーベキューセットしたし、火つけるで！木炭と木入れたし、しばらくは燃えるやろ！</p>
          <p><strong>ひろき</strong>：そやな！もし燃えやんくなってきたら、木炭とか木とか足せばええやろ！</p>
          <p><strong>はると</strong>：てか、なんで燃えたら熱くなるんやっけ？</p>
          <p><strong>ひろき</strong>：それはな。木炭とか木っていう物質はさ。最初に<strong>エンタルピー</strong>っていうエネルギーをもっとるからなんよ。燃えたらこのエネルギーが使われて（<strong>エンタルピーが小さくなって</strong>）、反応熱として熱が外に出るじゃん？だから、熱くなる<strong>発熱反応</strong>がおこるわけやな。</p>
          <p><strong>はると</strong>：あーじゃあ、逆に氷とか食べた時に口の中が冷たくなるけど、これを熱を外から吸収する、つまり<strong>吸熱反応</strong>がおこってるって考えたら、エネルギーがたまった（<strong>エンタルピーが大きくなった</strong>）ってことになるけどその認識で良い？</p>
          <p><strong>ひろき</strong>：うんうんそういうこと！この考え方でエンタルピーが反応の前後で正になるとか負になるとかを考えればいいわけ！わかる？わかるよね！</p>
        </div>

        <p>
          物質はそれぞれ固有のエネルギーをもっている。圧力が一定のもとでの、その物質のもつエネルギーを<strong><u>エンタルピー</u></strong>（記号 H、単位 kJ）という。<br>
          化学反応が起こると、反応物のエンタルピーと生成物のエンタルピーの差の分だけ、熱が外に出たり中に入ったりする。この出入りする熱を<strong><u>反応エンタルピー</u></strong>という。<br>
          <strong><u class="wavy">反応エンタルピーの値は、注目する物質 1 mol あたりで表される。</u></strong>
        </p>

        <div class="box box-point">
          <p><strong><u>エンタルピー変化 ΔH の定義</u></strong></p>
          <div class="formula">ΔH ＝ H（生成物の総和） − H（反応物の総和）</div>
          <p><strong><u class="wavy">必ず「生成物 − 反応物」の順で引く。</u></strong>逆にすると符号が丸ごと反転してしまう。</p>
          <p>ΔH の単位は kJ。ただし「注目する物質 1 mol あたり」で表すときは <strong>kJ/mol</strong> と書く。</p>
        </div>

        <div class="box box-test">
          <p><strong><u>符号の意味</u></strong></p>
          <ul>
            <li><strong><u>発熱反応</u></strong>…熱を外へ放出する。生成物の方がエネルギーが低い → <strong>ΔH &lt; 0</strong>（負）。まわりの温度は<strong>上がる</strong></li>
            <li><strong><u>吸熱反応</u></strong>…熱を外から吸収する。生成物の方がエネルギーが高い → <strong>ΔH &gt; 0</strong>（正）。まわりの温度は<strong>下がる</strong></li>
          </ul>
          <p><strong><u class="wavy">温度が上がった＝発熱＝ΔHは負、という3点セットで覚える。</u></strong></p>
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

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>　</th><th>発熱反応（ΔH &lt; 0）</th><th>吸熱反応（ΔH &gt; 0）</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>エンタルピーの高低</td>
                <td>反応物 &gt; 生成物</td>
                <td>反応物 &lt; 生成物</td>
              </tr>
              <tr>
                <td>まわりの温度</td>
                <td>上がる</td>
                <td>下がる</td>
              </tr>
              <tr>
                <td>身のまわりの例</td>
                <td>燃焼、中和、金属と酸の反応、酸化カルシウムに水（発熱剤）、鉄の酸化（使い捨てカイロ）</td>
                <td>硝酸アンモニウムの溶解（冷却パック）、炭酸水素ナトリウムの熱分解、塩化アンモニウムと水酸化バリウムの反応、光合成</td>
              </tr>
              <tr>
                <td>起こりやすさ</td>
                <td>常温でも自然に進みやすい</td>
                <td>加熱や光などのエネルギーを与え続けないと進みにくい</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="box box-note">
          <p><strong>反応熱と ΔH のねじれに注意</strong></p>
          <p>
            昔の教科書の「反応熱 Q」は<strong>発熱を正</strong>で書いていた。いまの「ΔH」は<strong>発熱を負</strong>で書く。
            つまり <strong><u>反応熱 ＝ −ΔH</u></strong>。<strong><u class="wavy">「発熱なのにマイナス」という違和感が、この単元最大のつまずきポイント。</u></strong>
          </p>
          <p>問題文が「発熱量は 891 kJ である」と言っていたら、答案には <strong>ΔH ＝ −891 kJ</strong> と書く。ここを写し取るだけで符号ミスが消える。</p>
        </div>

        <div class="box box-memory">
          <p>放<strong>出</strong>するとエンタルピーは<strong>減</strong>る → マイナス。<br>
             吸<strong>収</strong>するとエンタルピーは<strong>増</strong>える → プラス。<br>
             「<strong>出てマイナス、入ってプラス</strong>」は、物質側から見た財布の増減だと思えばよい。</p>
        </div>

        <div class="box box-example">
          <p><strong>例題1</strong>　次の変化は発熱・吸熱のどちらか。また ΔH の符号を答えよ。</p>
          <p>（1） 硝酸アンモニウムを水に溶かすと、容器が冷たくなった<br>
             （2） 水酸化ナトリウム水溶液に塩酸を加えると、液温が上がった<br>
             （3） 水が水蒸気になる<br>
             （4） 炭酸カルシウムを強く熱すると、酸化カルシウムと二酸化炭素に分解した</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）<strong>吸熱・ΔH &gt; 0</strong>…まわりの熱を奪ったから冷たくなる。</p>
            <p>（2）<strong>発熱・ΔH &lt; 0</strong>…中和は必ず発熱。</p>
            <p>（3）<strong>吸熱・ΔH &gt; 0</strong>…蒸発は分子をばらばらにするので、エネルギーを与える必要がある。</p>
            <p>（4）<strong>吸熱・ΔH &gt; 0</strong>…熱分解は「熱を与え続けないと進まない」ので吸熱。</p>
            <p>迷ったら<strong><u class="wavy">「まわりの温度がどうなるか」を先に決めて、そこから符号を出す。</u></strong></p>
          </details>
        </div>

        <div class="box box-note">
          <p><strong><u>系と外界</u></strong></p>
          <ul>
            <li><strong><u>系</u></strong>…今から注目する<strong>主役</strong>（反応している物質そのもの）</li>
            <li><strong><u>外界</u></strong>…それ以外の<strong>モブ</strong>（全宇宙。容器・溶媒・空気など）</li>
          </ul>
          <p>
            例）　熱を逃がす　＝「<strong>系 → 外界</strong>」に熱を送る（発熱、ΔH &lt; 0）<br>
            　　　熱を加える　＝「<strong>外界 → 系</strong>」に熱を送る（吸熱、ΔH &gt; 0）
          </p>
          <p><strong><u class="wavy">ΔHの符号は必ず「系」から見て決める。温度計が測っているのは外界なので、符号が逆になる。</u></strong></p>
        </div>

        <div class="box box-example">
          <p><strong>演習2 ★</strong>　次の文中の（　）に適当な語句を記入せよ。</p>
          <p>
            化学変化によって出入りする熱量を（　ア　）といい、その値は注目する物質（　イ　）mol あたりで表される。
            生成物の持つエンタルピーの総和から反応物の持つエンタルピーの総和を引いた値は（　ウ　）とよばれる。
            反応において、反応物の持つエンタルピーの総和が生成物の持つエンタルピーの総和よりも大きい場合、（　エ　）反応がおこり、
            反応物の持つエンタルピーの総和が、生成物の持つエンタルピーの総和よりも小さい場合、（　オ　）反応がおこる。
          </p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（ア）<strong>反応熱</strong>　（イ）<strong>1</strong>　（ウ）<strong>エンタルピー変化</strong>　（エ）<strong>発熱</strong>　（オ）<strong>吸熱</strong></p>
            <p>（エ）（オ）は ΔH ＝ H(生成物) − H(反応物) にそのまま入れて考える。反応物の方が大きければ引き算の結果は負 → 発熱。反応物の方が小さければ正 → 吸熱。</p>
          </details>
        </div>

        <div class="box box-advanced">
          <p><strong>深堀りコラム　エンタルピーの真の正体</strong>（気体を学習した後の方が頭に入りやすいかもしれない）</p>
          <p>19 世紀のある日、偉い科学者がフタのないビーカーで化学反応の実験をしていました。</p>
          <p><strong>偉い科学者</strong>：よし！物質が元々持っているエネルギー（<strong>内部エネルギー変化 ΔU</strong>）が、すべて「熱」として外に出てくるはずだ！……あれ？計算より実際に出た熱が少し足りないぞ？</p>
          <p>科学者はハッと気づきました。</p>
          <p><strong>偉い科学者</strong>：そうか！反応して気体がモクモク膨らむとき、目に見えない「重たい空気（<strong>大気圧 P</strong>）」を押し退けるために、エネルギー（<strong>仕事 PΔV</strong>）を無駄遣いしているんだ！</p>
          <p><strong>偉い科学者</strong>：でも、実験のたびに「空気を押し退けたエネルギー」をわざわざ計算するの、超めんどくさいな……。よし！最初からその「空気押し退け代（PΔV）」を込み込みにした新しいパラメーターを作ろう！それを<strong>エンタルピー（ΔH）</strong>と名付ける！</p>
          <div class="formula">ΔH ＝ ΔU ＋ PΔV</div>
          <p>便利なルールを作った後、科学者はふと「空気押し退け代」を真面目に計算してみました。</p>
          <p><strong>偉い科学者</strong>：……あれ？ プロパンが燃える時の総エネルギーが約 <strong>2000 kJ</strong> もあるのに、空気押し退け代（PΔV）ってたったの <strong>2.5 kJ</strong> しかないの？ほぼ誤差じゃん！しかも、固体や液体しか出てこない反応なら、膨らまないからこの値はほぼゼロだし！</p>
          <p>結局、ΔH ＝ ΔU ＋ PΔV の PΔV が ΔU に比べて小さすぎるので、<strong><u class="wavy">ΔH ≒ ΔU にできるということがわかりました。</u></strong></p>
          <p><strong>偉い科学者</strong>：じゃあやっぱり結局、エンタルピー（ΔH）は物質が元々持っているエネルギー（内部エネルギー ΔU）と考えてよかったんだな！変なことに人生浪費したよ、、</p>
        </div>
`;

// ===================================================================
// 重要事項② 反応エンタルピーの測定（熱量計算）
// ===================================================================
const PART_2_HTML = `        <h4>重要事項② ～温度と熱（2）反応エンタルピーの測定（熱量の計算）～</h4>

        <p>
          ΔH は「計算で出す」前に「<strong><u class="wavy">実験で測る</u></strong>」ものである。測るのは熱ではなく<strong>温度変化</strong>で、そこから熱量を計算する。
          入試でもっともよく出る計算の型がここにある。
        </p>

        <div class="box box-point">
          <p><strong><u>熱量の基本式</u></strong></p>
          <div class="formula">Q ［J］ ＝ m ［g］ × c ［J/(g・K)］ × Δt ［K］</div>
          <ul>
            <li>Q…出入りした熱量　m…温まった液体の質量　c…<strong><u>比熱</u></strong>　Δt…温度変化</li>
            <li><strong><u>比熱</u></strong>…物質 1 g の温度を 1 K 上げるのに必要な熱量。水は <strong>4.2 J/(g・K)</strong></li>
            <li><strong><u>熱容量</u></strong> C ＝ m × c（その容器・液体全体を 1 K 上げるのに必要な熱量）→ <strong>Q ＝ C × Δt</strong></li>
          </ul>
          <p>Δt は摂氏でもケルビンでも同じ値になる（差だから）。<strong>1 ℃ の変化 ＝ 1 K の変化</strong>。</p>
        </div>

        <div class="box box-point">
          <p><strong><u>測定値から ΔH を出す3ステップ</u></strong></p>
          <ol>
            <li><strong><u>Q ＝ mcΔt で熱量を出す</u></strong>（単位は J。最後に 1000 で割って kJ にする）</li>
            <li><strong><u>注目する物質の物質量 n［mol］を出す</u></strong></li>
            <li><strong>ΔH ＝ −Q ÷ n</strong> として 1 mol あたりに直し、発熱なら負、吸熱なら正の符号をつける</li>
          </ol>
          <p><strong><u class="wavy">「熱量 Q は正の値、ΔH は符号つき」と割り切ると混乱しない。</u></strong></p>
        </div>

        <div class="box box-test">
          <p><strong><u>この計算での定番のひっかけ</u></strong></p>
          <ul>
            <li><strong><u class="wavy">m は「溶液全体の質量」。</u></strong>溶質を溶かしたときは（水の質量 ＋ 溶質の質量）で計算する</li>
            <li>中和の実験では、酸の水溶液と塩基の水溶液を<strong>足した質量</strong>が m になる</li>
            <li>「水溶液の密度は 1.0 g/cm<sup>3</sup>」と与えられたら、<strong>体積［mL］＝ 質量［g］</strong>として使う</li>
            <li>「比熱は水と同じ 4.2 J/(g・K) とする」という但し書きは、<strong>使えという指示</strong></li>
            <li>Q は J、ΔH は kJ。<strong><u>1000 で割る操作を忘れない</u></strong></li>
            <li>容器の熱容量が与えられたら、Q ＝（溶液の mcΔt）＋（容器の CΔt）で足す</li>
          </ul>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-thermo-2" viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-thermo-2 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-2 .ax {stroke:#555;stroke-width:1.6}
    .learning-content .lcfig-adv-thermo-2 .axl {font:bold 12px sans-serif;fill:#333;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-2 .crv {stroke:#c0392b;stroke-width:2.6;fill:none}
    .learning-content .lcfig-adv-thermo-2 .ext {stroke:#7c3aed;stroke-width:2;fill:none;stroke-dasharray:6 5}
    .learning-content .lcfig-adv-thermo-2 .gd {stroke:#bbb;stroke-width:1;stroke-dasharray:4 4}
    .learning-content .lcfig-adv-thermo-2 .lb {font:bold 12px sans-serif;fill:#333;text-anchor:start}
    .learning-content .lcfig-adv-thermo-2 .lb2 {font:12px sans-serif;fill:#555;text-anchor:start}
    .learning-content .lcfig-adv-thermo-2 .vess {fill:#eef5fa;stroke:#16538a;stroke-width:2}
    .learning-content .lcfig-adv-thermo-2 .liq {fill:#cfe6f5;stroke:none}
    .learning-content .lcfig-adv-thermo-2 .st {font:bold 11px sans-serif;fill:#16538a;text-anchor:middle}
  </style>
  <defs>
    <marker id="advth2ar" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#7c3aed"/>
    </marker>
  </defs>

  <text class="ttl" x="250" y="24">温度－時間グラフは「外挿」して最高温度を読む</text>

  <line class="ax" x1="70" y1="250" x2="470" y2="250"/>
  <line class="ax" x1="70" y1="250" x2="70" y2="60"/>
  <text class="axl" x="270" y="278">時間</text>
  <text class="axl" x="34" y="155" transform="rotate(-90 34 155)">温度</text>

  <line class="gd" x1="70" y1="210" x2="470" y2="210"/>
  <line class="gd" x1="70" y1="105" x2="470" y2="105"/>

  <path class="crv" d="M90,212 L170,210 C200,208 215,120 240,112 C280,100 330,132 400,168 L455,192"/>
  <path class="ext" d="M240,112 L200,96" marker-end="url(#advth2ar)"/>
  <path class="ext" d="M400,168 C330,140 300,110 215,86"/>

  <text class="lb" x="86" y="230">混合前</text>
  <text class="lb" x="246" y="140">混合直後</text>
  <text class="lb2" x="330" y="196">熱が外へ逃げて下がる</text>
  <text class="lb" x="150" y="88" fill="#7c3aed">外挿して読む最高温度</text>
  <text class="lb2" x="76" y="202">はじめの温度</text>

  <rect class="vess" x="530" y="70" width="150" height="150" rx="10"/>
  <rect class="liq" x="542" y="140" width="126" height="72" rx="6"/>
  <line class="ax" x1="605" y1="50" x2="605" y2="180"/>
  <circle cx="605" cy="180" r="9" fill="#c0392b"/>
  <text class="st" x="605" y="242">発泡ポリスチレン製の容器</text>
  <text class="st" x="605" y="260">（熱を逃がしにくい ＝ 断熱）</text>
  <text class="st" x="655" y="60">温度計</text>
</svg>
          <figcaption>簡易熱量計。熱は必ず少しずつ外へ逃げるので、上がり続けた直線をのばして（外挿して）「逃げなかったとしたらの最高温度」を読む。</figcaption>
        </figure>

        <div class="box box-example">
          <p><strong>例題2</strong>　1.0 mol/L 塩酸 100 mL と 1.0 mol/L 水酸化ナトリウム水溶液 100 mL（ともに 20.0 ℃）を混ぜたところ、液温は 26.7 ℃ になった。中和エンタルピーを求めよ。水溶液の密度を 1.0 g/cm<sup>3</sup>、比熱を 4.2 J/(g・K) とする。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>① 熱量　m ＝ 100 ＋ 100 ＝ 200 g、Δt ＝ 26.7 − 20.0 ＝ 6.7 K</p>
            <p class="formula">Q ＝ 200 × 4.2 × 6.7 ＝ 5628 J ≒ 5.6 kJ</p>
            <p>② 物質量　できた水は H<sup>+</sup> と OH<sup>−</sup> のうち少ない方で決まる。<br>
               HCl：1.0 × 100/1000 ＝ 0.10 mol、NaOH：0.10 mol → <strong>水 0.10 mol</strong></p>
            <p>③ 1 mol あたりに直す</p>
            <p class="formula">ΔH ＝ −5.6 ÷ 0.10 ＝ <strong>−56 kJ/mol</strong></p>
            <p>強酸と強塩基の中和エンタルピーの実測値 <strong>−56.5 kJ/mol</strong> とほぼ一致する。<strong><u class="wavy">m を 100 g にすると答えが半分になるので、必ず混合後の全質量を使う。</u></strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>例題3</strong>　水 200 g に水酸化ナトリウム（固）4.0 g を溶かすと、温度が 5.3 K 上がった。NaOH の溶解エンタルピーを求めよ。水溶液の比熱を 4.2 J/(g・K)、NaOH ＝ 40 とする。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>① m は<strong>水＋溶質</strong>なので 200 ＋ 4.0 ＝ 204 g</p>
            <p class="formula">Q ＝ 204 × 4.2 × 5.3 ＝ 4541 J ≒ 4.5 kJ</p>
            <p>② n ＝ 4.0 ÷ 40 ＝ <strong>0.10 mol</strong></p>
            <p class="formula">ΔH ＝ −4.5 ÷ 0.10 ＝ <strong>−45 kJ/mol</strong></p>
            <p>温度が上がった＝発熱なので負。表の値（−44.5 kJ/mol）と合う。</p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項③ 熱化学反応式の書き方
// ===================================================================
const PART_3_HTML = `        <h4>重要事項④ ～様々なエンタルピー変化（1）熱化学反応式の書き方～</h4>

        <p>
          反応と、そのときの ΔH をセットで表した式を<strong><u>熱化学反応式</u></strong>という。
          <strong><u class="wavy">化学反応式の右に ΔH を書き添えた形で、式そのものは通常の化学反応式のまま（矢印は →）。</u></strong>
        </p>

        <div class="box box-point">
          <p><strong><u>熱化学反応式の3つの約束</u></strong></p>
          <ol>
            <li><strong><u>注目する物質の係数を 1 にする</u></strong>（反応エンタルピーは「1 mol あたり」で表すため。<strong>分数の係数を使ってよい</strong>）</li>
            <li><strong><u>すべての物質に状態を書く</u></strong>（固）（液）（気）。同素体は「（黒鉛）」のように種類まで書く。水溶液は aq を付ける</li>
            <li>式のうしろに <strong>ΔH ＝ ○○ kJ</strong> を書く（式は → で結ぶ。昔の「熱化学方程式」は ＝ で結んで熱を項として足していたが、書き方が変わった）</li>
          </ol>
        </div>

        <div class="box box-note">
          <p><strong><u>書き方の手順（水素と酸素から水ができるとき）</u></strong></p>
          <p><strong>① 表したい化学反応式を書き、注目する物質の係数を 1 にする</strong>（注目する物質が 1 mol あると考える）</p>
          <p class="reaction">H<sub>2</sub> + 1/2 O<sub>2</sub> → H<sub>2</sub>O</p>
          <p>水に注目し、その係数を 1 としているため、酸素は分数になっている。</p>
          <p><strong>② 化学式に固体・液体などの状態を明記する</strong>（<strong><u class="wavy">物質の状態によってエンタルピーは異なるため。</u></strong>）</p>
          <p class="reaction">H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(液)</p>
          <p><strong>③ 反応エンタルピー［kJ/mol］の値を書く</strong></p>
          <p class="reaction">H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(液)　ΔH ＝ −286 kJ</p>
          <p>今回は水に注目していたので、「液体の水 H<sub>2</sub>O ができるとき」のエンタルピーを考えている。</p>
          <p>
            ※ 反応エンタルピーは 1 mol あたりのエンタルピー変化量で単位は kJ/mol だが、
            <strong><u class="wavy">化学反応式に記す際は、もともとの化学反応式の係数が 1 であるため kJ/mol は書かず、ΔH に kJ と単位をつける。</u></strong>
          </p>
        </div>

        <div class="box box-test">
          <p><strong><u>補足 ～出題されやすい物質と状態～</u></strong>（基本を覚えておく。紛らわしいものは出ない。周期表も確認する）</p>
          <p><strong>❶ 同素体</strong>　同素体の名前を（　）に書く（物質によってエンタルピーが違うため）</p>
          <p class="reaction">C(黒鉛)　C(ダイヤモンド)</p>
          <p>← 頭文字だけを <strong>C(黒)</strong>　<strong>C(ダ)</strong> と書くこともある</p>
          <p><strong>❷ 単体分子</strong>　基本的には<strong>気体</strong></p>
          <p class="reaction">H<sub>2</sub>(気)　O<sub>2</sub>(気)　N<sub>2</sub>(気)　Cl<sub>2</sub>(気)　F<sub>2</sub>(気)　など</p>
          <p>※ 水銀 Hg・臭素 Br<sub>2</sub> は<strong>液体</strong> → Hg(液)　Br<sub>2</sub>(液)　　※ ヨウ素 I<sub>2</sub> は<strong>固体</strong> → I<sub>2</sub>(固)</p>
          <p><strong>❸ 金属</strong>　基本的には<strong>固体</strong></p>
          <p class="reaction">Na(固)　Mg(固)　Al(固)　Fe(固)　Cu(固)　Ag(固)　など</p>
          <p><strong>❹ よく出る化合物</strong></p>
          <ul>
            <li>（1） 水 H<sub>2</sub>O … 普通は<strong>液体</strong>で考えて、蒸発が絡むときは気体、融解が絡むときは固体と考える</li>
            <li>（2） 二酸化〇〇系 … 普通は<strong>気体</strong>（二酸化炭素 CO<sub>2</sub>・二酸化硫黄 SO<sub>2</sub>・二酸化窒素 NO<sub>2</sub>）</li>
            <li>（3） 一酸化〇〇系 … 普通は<strong>気体</strong>（一酸化炭素 CO・一酸化窒素 NO）</li>
            <li>（4） アンモニア NH<sub>3</sub>・塩化水素 HCl … すべて<strong>気体</strong></li>
            <li>（5） 炭素数 1〜4 の炭化水素 … すべて<strong>気体</strong>（メタン CH<sub>4</sub>／エタン C<sub>2</sub>H<sub>6</sub>／エチレン C<sub>2</sub>H<sub>4</sub>／アセチレン C<sub>2</sub>H<sub>2</sub>／プロパン C<sub>3</sub>H<sub>8</sub>／ブタン C<sub>4</sub>H<sub>10</sub>）</li>
            <li>（6） 酸素を含むもの・炭素数 5〜16 の炭化水素 … すべて<strong>液体</strong>（メタノール CH<sub>3</sub>OH／エタノール C<sub>2</sub>H<sub>5</sub>OH／酢酸 CH<sub>3</sub>COOH／ベンゼン C<sub>6</sub>H<sub>6</sub> など）</li>
          </ul>
          <p><strong>❺ 大量の水</strong>　<strong>aq</strong> をつける</p>
          <p>例）塩を水に入れ、塩化ナトリウム水溶液をつくる</p>
          <p class="reaction">NaCl + aq → NaClaq</p>
        </div>

        <div class="box box-test">
          <p><strong><u>状態の書き方でよく減点されるところ</u></strong></p>
          <ul>
            <li>水は常温では<strong>（液）</strong>。（気）にすると蒸発エンタルピー（約 +44 kJ/mol）の分だけ値がずれる</li>
            <li>炭素は<strong>（黒鉛）</strong>と書く。ダイヤモンドとは値が違う（同素体はエンタルピーが違う）</li>
            <li>「大量の水に溶かした」状態は <strong>NaOHaq</strong> のように aq を付ける。溶かす操作そのものは「＋ aq」と書く</li>
            <li><strong><u class="wavy">状態の書き忘れは、値が合っていても不正解になる。</u></strong>書き終わったら状態だけを指で追って確認する</li>
          </ul>
        </div>

        <div class="box box-example">
          <p><strong>例題4</strong>　メタン CH<sub>4</sub> の燃焼エンタルピーは −891 kJ/mol である。熱化学反応式で表せ。</p>
          <details>
            <summary>💡 解答を表示</summary>
            <p>注目する物質は CH<sub>4</sub> なので、<strong>CH<sub>4</sub> の係数を 1</strong> にそろえる。</p>
            <p class="reaction">CH<sub>4</sub>(気) + 2O<sub>2</sub>(気) → CO<sub>2</sub>(気) + 2H<sub>2</sub>O(液)　ΔH ＝ −891 kJ</p>
            <p>水は「液」で書くのが基本（25 ℃, 1013 hPa では液体のため）。ここを（気）にすると、蒸発エンタルピーの分だけ値がずれる。</p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>例題5</strong>　水素の燃焼エンタルピーを表す式で、O<sub>2</sub> の係数が 1/2 になるのはなぜか。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>注目しているのは<strong>水素 1 mol</strong> だから。H<sub>2</sub> の係数を 1 に固定した結果、O<sub>2</sub> は 1/2 になる。</p>
            <p class="reaction">H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(液)　ΔH ＝ −286 kJ</p>
            <p><strong>2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O　ΔH ＝ −572 kJ</strong> と書いてしまうと、これは「水素 2 mol あたり」の値になり、燃焼エンタルピーの定義から外れる。</p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>例題6</strong>　次の内容を熱化学反応式で表せ。</p>
          <p>（1） 黒鉛の燃焼エンタルピーは −394 kJ/mol<br>
             （2） 水の蒸発エンタルピーは +44 kJ/mol<br>
             （3） 塩化アンモニウム（固）の水への溶解エンタルピーは +15 kJ/mol</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p class="reaction">（1） C(黒鉛) + O<sub>2</sub>(気) → CO<sub>2</sub>(気)　ΔH ＝ −394 kJ</p>
            <p class="reaction">（2） H<sub>2</sub>O(液) → H<sub>2</sub>O(気)　ΔH ＝ +44 kJ</p>
            <p class="reaction">（3） NH<sub>4</sub>Cl(固) + aq → NH<sub>4</sub>Claq　ΔH ＝ +15 kJ</p>
            <p>（2）は状態変化なので<strong>左右が同じ物質</strong>。（3）は「＋ aq」で「大量の水に溶かす」を表す。</p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項④ 反応エンタルピーの種類
// ===================================================================
const PART_4_HTML = `        <h4>重要事項④ ～様々なエンタルピー変化（2）反応エンタルピーの種類～</h4>

        <div class="box box-review">
          <p><strong>コラム❷　めんどくさいごめん</strong></p>
          <p><strong>昔の偉い人</strong>：反応反応いわれてもめんどいから、反応エンタルピーを<strong>いくつかの種類に分ける</strong>よ！都合が良いように分けるだけ！だって、燃やす反応で「酸素と反応させて」っていうより、「<strong>酸素で燃焼させて</strong>」っていう方が燃やすんやなってなってわかりやすいもん！</p>
          <p><strong>昔の偉い人</strong>：あとさ、気体の方が分子の動き激しいやん？てことは<strong>固体→液体→気体の順でエネルギーも高くなる</strong>わけやから、エンタルピーを状態変化でも作るわ！だから例えば、液体から気体に蒸発するときは<strong>蒸発エンタルピー</strong>って名前にして、エネルギーは上がるから <strong>ΔH ＞ 0</strong> ってことにするわ。</p>
        </div>

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
                <td><strong><u>分解エンタルピー</u></strong></td>
                <td>分解される化合物</td>
                <td>単体に分解するとき（生成エンタルピーの符号を反転した値）</td>
                <td>H<sub>2</sub>O(液) → H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気)　ΔH ＝ +286 kJ</td>
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
                <td>大量の水（aq）に溶けるとき（発熱・吸熱どちらもある）</td>
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

        <div class="box box-note">
          <p><strong>状態変化のエンタルピーの名前</strong></p>
          <ul>
            <li><strong><u>融解エンタルピー</u></strong>…固体 → 液体（氷 → 水は +6.0 kJ/mol）</li>
            <li><strong><u>蒸発エンタルピー</u></strong>…液体 → 気体（水 → 水蒸気は +44 kJ/mol）</li>
            <li><strong><u>昇華エンタルピー</u></strong>…固体 → 気体（ドライアイスなど）</li>
          </ul>
          <p><strong><u class="wavy">粒子をばらばらにする向きは必ず吸熱（正）、集める向きは必ず発熱（負）。</u></strong>だから逆向きの凝縮・凝固・凝華は負になる。</p>
        </div>

        <div class="box box-test">
          <p><strong><u>よく問われる約束</u></strong></p>
          <ul>
            <li><strong><u class="wavy">単体の生成エンタルピーは 0 と決められている。</u></strong>（O<sub>2</sub>(気)、C(黒鉛) などは基準そのもの。ただし同素体では基準の方だけが 0）</li>
            <li>強酸と強塩基の中和エンタルピーは、酸・塩基の種類によらずほぼ <strong>−56.5 kJ/mol</strong>。中和の正体が H<sup>+</sup> + OH<sup>−</sup> → H<sub>2</sub>O だけだから</li>
            <li>弱酸・弱塩基の中和では、電離にエネルギーを使う分だけ<strong>発熱量が小さくなる</strong>（絶対値が 56.5 より小さい）</li>
            <li>燃焼エンタルピーは<strong>必ず負</strong>。正の答えが出たら符号ミス</li>
            <li>燃焼で C は CO<sub>2</sub>、H は H<sub>2</sub>O（液）、S は SO<sub>2</sub>、N は問題の指定に従う。<strong>CO で止めたら完全燃焼ではない</strong></li>
            <li>溶解エンタルピーは<strong>正負どちらもある</strong>（NaOH は発熱、NH<sub>4</sub>NO<sub>3</sub> は吸熱）</li>
          </ul>
        </div>

        <div class="box box-memory">
          <p>見分け方は<strong>右辺</strong>を見るのが速い。<br>
             ・右辺に CO<sub>2</sub> と H<sub>2</sub>O が並ぶ → <strong>燃焼</strong><br>
             ・右辺に化合物 1 mol、左辺が単体だけ → <strong>生成</strong><br>
             ・右辺に H<sub>2</sub>O が 1 mol だけ、左辺が H<sup>+</sup> と OH<sup>−</sup> → <strong>中和</strong><br>
             ・左辺に「＋ aq」がある → <strong>溶解</strong><br>
             ・左辺と右辺が同じ物質で状態だけ違う → <strong>状態変化</strong></p>
        </div>

        <div class="box box-example">
          <p><strong>例題7</strong>　次の式が表す反応エンタルピーの名称を答えよ。</p>
          <p>（1） 2C(黒鉛) + 2H<sub>2</sub>(気) → C<sub>2</sub>H<sub>4</sub>(気)　ΔH ＝ +52 kJ<br>
             （2） H<sub>2</sub>SO<sub>4</sub>(液) + aq → H<sub>2</sub>SO<sub>4</sub>aq　ΔH ＝ −95 kJ<br>
             （3） CO<sub>2</sub>(固) → CO<sub>2</sub>(気)　ΔH ＝ +25 kJ<br>
             （4） C<sub>2</sub>H<sub>5</sub>OH(液) + 3O<sub>2</sub>(気) → 2CO<sub>2</sub>(気) + 3H<sub>2</sub>O(液)　ΔH ＝ −1368 kJ</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）<strong>エチレン C<sub>2</sub>H<sub>4</sub> の生成エンタルピー</strong>…右辺に化合物 1 mol、左辺がすべて単体（黒鉛と水素）なので生成エンタルピー。</p>
            <p>（2）<strong>硫酸の溶解エンタルピー</strong>…aq（大量の水）に溶かしているので溶解エンタルピー。</p>
            <p>（3）<strong>二酸化炭素の昇華エンタルピー</strong>…固体から直接気体へ。状態変化なので吸熱で正。</p>
            <p>（4）<strong>エタノールの燃焼エンタルピー</strong>…右辺が CO<sub>2</sub> と H<sub>2</sub>O、左辺の C<sub>2</sub>H<sub>5</sub>OH の係数が 1。</p>
            <p>判定のコツは<strong><u class="wavy">「右辺に何が 1 mol できているか」を先に見ること。</u></strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>例題8</strong>　同じ 1 mol/L でも、酢酸と水酸化ナトリウムの中和では、塩酸のときより発熱量が小さい。理由を説明せよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>酢酸は<strong>弱酸</strong>で、水溶液中ではほとんど分子のまま存在している。中和が進むには、まず <strong>CH<sub>3</sub>COOH → CH<sub>3</sub>COO<sup>−</sup> + H<sup>+</sup></strong> の電離が必要で、この電離は<strong>吸熱</strong>である。</p>
            <p>したがって、H<sup>+</sup> ＋ OH<sup>−</sup> → H<sub>2</sub>O の発熱から電離の吸熱が差し引かれ、<strong><u class="wavy">全体としての発熱量は 56.5 kJ/mol より小さくなる。</u></strong></p>
          </details>
        </div>

        <div class="box box-point">
          <p><strong><u>状態変化におけるエンタルピーの種類（6つすべて）</u></strong></p>
          <p>エネルギー大　<strong>気体</strong>　→　<strong>液体</strong>　→　<strong>固体</strong>　エネルギー小<br>
             （分子の動きが激しい　←→　分子の動きが穏やか）</p>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>名称</th><th>意味（1 mol の物質が…）</th><th>ΔH の符号</th></tr>
            </thead>
            <tbody>
              <tr><td><strong><u>融解エンタルピー</u></strong></td><td>融解するとき（固 → 液）</td><td rowspan="3"><strong>ΔH ＞ 0</strong><br>（吸熱反応）</td></tr>
              <tr><td><strong><u>蒸発エンタルピー</u></strong></td><td>蒸発するとき（液 → 気）</td></tr>
              <tr><td><strong><u>昇華エンタルピー</u></strong></td><td>昇華するとき（固 → 気）</td></tr>
              <tr><td><strong><u>凝縮エンタルピー</u></strong></td><td>凝縮するとき（気 → 液）</td><td rowspan="3"><strong>ΔH ＜ 0</strong><br>（発熱反応）</td></tr>
              <tr><td><strong><u>凝固エンタルピー</u></strong></td><td>凝固するとき（液 → 固）</td></tr>
              <tr><td><strong><u>凝華エンタルピー</u></strong></td><td>凝華するとき（気 → 固）</td></tr>
            </tbody>
          </table>
        </div>

        <div class="box box-note">
          <p><strong><u>水和エンタルピー</u></strong></p>
          <p>イオンが水に溶けたとき、<strong>水分子にイオンが包み込まれるためのエネルギー</strong>。</p>
          <p>例）ナトリウムイオンの水和エンタルピー</p>
          <p class="reaction">Na<sup>+</sup>(気) + aq → Na<sup>+</sup>(aq)　ΔH ＜ 0（発熱反応）</p>
          <p><strong><u class="wavy">溶解エンタルピーは「格子エネルギー（吸熱）＋水和エンタルピー（発熱）」の差し引きで決まる。</u></strong>だから溶解は発熱にも吸熱にもなる。</p>
        </div>

        <div class="box box-example">
          <p><strong>演習3 ★</strong>　次の文中の（　）に適切な語句を入れよ。</p>
          <p>
            物質は化学エネルギーと呼ばれる固有のエネルギーを持っている。通常出入りするエネルギーは熱や（　ア　）であり、
            系の熱を外界に放出する反応を（　イ　）といい、外界の熱を系に吸収する反応を（　ウ　）という。
            一定圧力下で化学反応にともなって放出、吸収する熱エネルギーを（　エ　）という。（　エ　）は生成物が持つエンタルピーの総和と反応物が持つエンタルピーの総和との差である。<br>
            （　エ　）には燃焼エンタルピー、生成エンタルピー、中和エンタルピー、溶解エンタルピーなどがあり、
            燃焼エンタルピーとは 1 mol の物質が（　オ　）するときの反応エンタルピー、
            生成エンタルピーとは 1 mol の化合物がその成分元素の（　カ　）から生成するときの反応エンタルピー、
            中和エンタルピーとは酸と塩基の中和反応によって 1 mol の（　キ　）が生成するときの反応エンタルピー、
            溶解エンタルピーとは 1 mol の物質が大量の（　ク　）に溶解するときの反応エンタルピーである。
          </p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（ア）<strong>光</strong>　（イ）<strong>発熱反応</strong>　（ウ）<strong>吸熱反応</strong>　（エ）<strong>反応エンタルピー</strong></p>
            <p>（オ）<strong>完全燃焼</strong>　（カ）<strong>単体</strong>　（キ）<strong>水（H<sub>2</sub>O）</strong>　（ク）<strong>水（または溶媒）</strong></p>
            <p>（カ）は「化合物」ではなく<strong>単体</strong>。生成エンタルピーの定義で最も問われるところ。</p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習4 ★</strong>　次の式が表す反応エンタルピーを求めよ（名称を答えよ）。</p>
          <p class="reaction">（1） 2C(黒鉛) + 2H<sub>2</sub>(気) → C<sub>2</sub>H<sub>4</sub>(気)　ΔH ＝ +52 kJ</p>
          <p class="reaction">（2） CH<sub>4</sub>O(液) + 3/2 O<sub>2</sub>(気) → CO<sub>2</sub>(気) + 2H<sub>2</sub>O　ΔH ＝ −726 kJ</p>
          <p class="reaction">（3） 1/2 H<sub>2</sub>SO<sub>4</sub>aq + NaOHaq → 1/2 Na<sub>2</sub>SO<sub>4</sub>aq + H<sub>2</sub>O(液)　ΔH ＝ −57 kJ</p>
          <p class="reaction">（4） H<sub>2</sub>SO<sub>4</sub>(液) + aq → H<sub>2</sub>SO<sub>4</sub>aq　ΔH ＝ −95 kJ</p>
          <p class="reaction">（5） CO<sub>2</sub>(固) → CO<sub>2</sub>(気)　ΔH ＝ +25 kJ</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）<strong>（エチレン C<sub>2</sub>H<sub>4</sub> の）生成エンタルピー</strong></p>
            <p>（2）<strong>（メタノール CH<sub>4</sub>O の）燃焼エンタルピー</strong></p>
            <p>（3）<strong>中和エンタルピー</strong>　H<sup>+</sup>aq + OH<sup>−</sup>aq → H<sub>2</sub>O(液)　ΔH ＝ −56.5 kJ</p>
            <p>（4）<strong>（硫酸 H<sub>2</sub>SO<sub>4</sub> の）溶解エンタルピー</strong></p>
            <p>（5）<strong>（二酸化炭素（ドライアイス）CO<sub>2</sub> の）昇華エンタルピー</strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習5 ★★</strong>　希薄な強酸と希薄な強塩基を混合したときの中和エンタルピーは酸、塩基の種類にかかわらず、ほぼ一定の値を示す。その理由を約 60 字で記述せよ。〔20 香川大 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>中和エンタルピーの定義</strong>：1 mol の水が中和反応で生じるときのエンタルピー</p>
            <p><strong>❶ 強酸・強塩基は電離度が 1 と考える</strong><br>→ 水溶液ではほとんどが「H<sup>+</sup> と陰イオン」「OH<sup>−</sup> と陽イオン」に分かれる。</p>
            <p><strong>❷ 中和エンタルピーでは水 1 mol が生じるときの H<sup>+</sup> と OH<sup>−</sup> の中和反応にかかるエネルギーを考える</strong><br>→ どの強酸・強塩基を使っても　H<sup>+</sup>aq + OH<sup>−</sup>aq → H<sub>2</sub>O(液)　ΔH ＝ −56.5 kJ</p>
            <p>※ <strong>弱酸・弱塩基</strong>だと、電離がほとんどおこっていないため、電離をおこして水を 1 mol つくるために余分にエネルギーがかかり、中和エンタルピーの値が異なる。</p>
            <p><strong>解答例</strong>：強酸・強塩基は水中で完全に電離しており、どの組み合わせでも中和エンタルピーは水素イオンと水酸化物イオンが反応して水 1 mol が生じるときのエンタルピー変化に等しくなるため。</p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習6 ★</strong>　メタン CH<sub>4</sub> の燃焼を表す以下の反応式について答えよ。水の比熱は 4.2 J/(g・K) とする。</p>
          <p class="reaction">CH<sub>4</sub> + 2O<sub>2</sub> → CO<sub>2</sub> + 2H<sub>2</sub>O(液)　ΔH ＝ −891 kJ</p>
          <p>（1） 0 ℃、1.013×10<sup>5</sup> Pa で 112 L の体積を占める CH<sub>4</sub> を完全燃焼させると、放出される熱量は何 kJ か。有効数字 2 桁で答えよ。<br>
             （2） 25 ℃ の水 5.0 kg を 100 ℃ にするには、CH<sub>4</sub> を何 mol 燃焼させればよいか。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1） 0 ℃、1.013×10<sup>5</sup> Pa で 112 L のメタンは　112 L × (1 mol / 22.4 L) ＝ <strong>5 mol</strong></p>
            <p>エンタルピーが減少する分、発熱するので　891 × 5 ＝ 4455 kJ ≒ <strong>4.5×10<sup>3</sup> kJ</strong></p>
            <p>（2） <strong><u class="wavy">水の温度上昇（状態変化）に必要な熱量（❶）＝化学反応式で発生する熱量（❷）</u></strong>の式を立てる。</p>
            <p>❶より（沸点に達していないので重要事項②のパターン①）</p>
            <div class="formula">q ＝ mcΔt ＝ 5.0×10<sup>3</sup> g × 4.2 J/(g・K) × (100 − 25) K ＝ 1575×10<sup>3</sup> J ＝ 1575 kJ</div>
            <p>❷より、x mol の燃焼で放出される熱量は　891 kJ/mol × x mol ＝ 891x kJ</p>
            <p>❶＝❷より　891x ＝ 1575　よって <strong>x ≒ 1.8 mol</strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習7 ★★★</strong>　次の文章を読み、（1）〜（2）に有効数字 2 桁で答えよ。原子量は H＝1.0、N＝14.0、O＝16.0、Na＝23.0 とする。</p>
          <p>
            反応熱を簡便に測定する実験装置の一つに<strong>氷熱量計</strong>がある。氷熱量計では、反応容器内で熱の出入りを伴う変化が起こると、氷の融解または水の凝固が起こり、
            それに伴う体積変化がガラス細管内の水のメニスカスの読みとして測定される。融解・凝固に伴う熱量変化は一対一に対応するため、
            <strong>測定しにくい熱量を、測定しやすい「長さ」に変換して測定できる</strong>のが特長である。また、氷と水が共存している限り、常に一定温度（0 ℃）で測定できる利点がある。
          </p>
          <p>
            氷の融解熱は 6.00 kJ/mol、0 ℃ における水と氷の密度はそれぞれ 1.00 g/cm<sup>3</sup> と 0.917 g/cm<sup>3</sup>。
            氷熱量計のデュワー瓶（熱の出入りを遮断する容器）の中には水 90.0 g と氷 10.0 g が入っており、ガラス細管の穴の断面積は高さによらず一定で 0.0100 cm<sup>2</sup>。反応前の反応物の温度はすべて 0 ℃ と仮定する。
          </p>
          <p>（1） 反応容器内で 1.00 mol/L の塩酸と 1.00 mol/L の水酸化カリウム水溶液を 6.00 mL ずつ混合すると、メニスカスが 9.05 cm 下降した。この反応の中和エンタルピーを求めよ。<br>
             （2） 反応容器内で 6.00 mol/L の塩酸と水酸化カリウム水溶液をそれぞれ 15.0 mL ずつ混合すると、氷がすべて融解した。反応後の水の温度を求めよ。水および水溶液の比熱はすべて 4.20 J/(g・K)。デュワー瓶と反応容器の熱容量は無視してよい。反応前後の溶液の密度は 1.00 g/cm<sup>3</sup>。〔東京大 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>まず条件を整理する</strong></p>
            <ul>
              <li>❶ 密度：水 1.00 g/cm<sup>3</sup>、氷 0.917 g/cm<sup>3</sup></li>
              <li>❷ 質量：水 90.0 g ＋ 氷 10.0 g ＝ 計 100 g</li>
              <li>❸ 体積：容器の断面積は 0.0100 cm<sup>2</sup></li>
              <li>❹ 熱量：氷の融解熱は 6.00 kJ/mol</li>
              <li>❺ 氷は固体だが、水になると<strong>隙間構造が大きい</strong>ため体積が大きくなる</li>
            </ul>
            <p><strong>（1）</strong> 中和反応で発生した熱量が、メニスカスの下降（氷→水への状態変化）に影響を及ぼしている。</p>
            <p><strong>❶ 状態変化に必要な熱量</strong></p>
            <p>① メニスカス体積変化量　0.0100 cm<sup>2</sup> × 9.05 cm ＝ 0.0905 cm<sup>3</sup></p>
            <p>② 状態変化の体積変化量（状態変化した質量を x g とおく）</p>
            <div class="formula">x / 0.917 − x / 1.00 ＝ 0.083x / 0.917　(cm<sup>3</sup>)</div>
            <p>①＝②より　<strong>x ＝ 0.999 ≒ 1.00 g</strong></p>
            <p>水 1 g が状態変化（氷→水）をしたので、物質量を求めて融解熱をかけると</p>
            <div class="formula">1.00 g × (1 mol / 18 g) × (6.0 kJ / 1 mol) ＝ 1/3 kJ</div>
            <p><strong>❷ 化学反応式で発生する熱量</strong></p>
            <p>中和エンタルピーは中和反応で 1 mol の水をつくるためのエネルギーなので、中和反応でできる水の物質量は　1 mol/L × (6/1000) L ＝ 6.0×10<sup>−3</sup> mol</p>
            <p>❶＝❷より　1/3 kJ ＝ Q(−ΔH) kJ/mol × 6.0×10<sup>−3</sup> mol</p>
            <p><strong>Q ＝ 55.5 ≒ 56 kJ/mol　⇔　ΔH ＝ −55.5 ≒ −56 kJ/mol</strong></p>
            <p><strong>（2）</strong> 6.00 mol/L 塩酸と 6.0 mol/L 水酸化カリウムを各 15 mL 混ぜているので、中和反応でできる水の物質量は　6 mol/L × (15/1000) L ＝ 9.0×10<sup>−2</sup> mol</p>
            <p>（1）で求めた中和エンタルピーを用いると　9.0×10<sup>−2</sup> × 55.5 ＝ 4.995 kJ ＝ 4995 J</p>
            <p><strong>❶ 水の温度上昇（状態変化）に必要な熱量</strong></p>
            <p>〈1〉 融点や沸点に達していないとき［重要事項②パターン①］…温度上昇を x K とおくと</p>
            <div class="formula">4.2 J/(g・K) × (100 g + 15 g × 2) × x K ＝ 546x J</div>
            <p>〈2〉 融点や沸点に達しているとき［重要事項②パターン②］…氷がすべて融解したので</p>
            <div class="formula">10 g × (1 mol / 18 g) × (6000 J / 1 mol) ＝ 60000/18 J</div>
            <p><strong>❷＝❶</strong> より　546x J ＋ 60000/18 J ＝ 4995 J　→　<strong>x ＝ 3.04 ≒ 3.0 K</strong></p>
            <p>最初 0 ℃ なので、0 ℃ から 3 K 上昇して <strong>3 ℃</strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習8 ★★</strong>　標準状態で 33.6 L を占めるメタンとエタンの混合気体を完全燃焼させると、1672 kJ の熱が発生した。この燃焼に使われた酸素は何 mol か。ただし、メタンとエタンの燃焼エンタルピーはそれぞれ −891 kJ/mol、−1562 kJ/mol とする。〔17 明治薬大 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong><u class="wavy">混合気体のどちらもが反応するエンタルピーの問題は、次の3ステップで考える。</u></strong></p>
            <ul>
              <li>❶ 問題で注目されている物質を基準にして、すべての反応エンタルピーの化学反応式を立てる</li>
              <li>❷ 注目されている物質の物質量をそれぞれ求め（別の文字でおき）、変化量を考える</li>
              <li>❸ 問題で与えられた数値をもとに計算（連立方程式など）をする</li>
            </ul>
            <p class="reaction">CH<sub>4</sub>(気) + 2O<sub>2</sub>(気) → CO<sub>2</sub>(気) + 2H<sub>2</sub>O(液)　ΔH ＝ −891 kJ</p>
            <p>（変化量）　x　　2x　　x　　2x　（単位は物質量）</p>
            <p class="reaction">C<sub>2</sub>H<sub>6</sub>(気) + 7/2 O<sub>2</sub>(気) → 2CO<sub>2</sub>(気) + 3H<sub>2</sub>O(液)　ΔH ＝ −1562 kJ</p>
            <p>（変化量）　y　　(7/2)y　　2y　　3y　（単位は物質量）</p>
            <p><strong>式①</strong>　x + y ＝ 33.6 L × (1 mol / 22.4 L) ＝ 1.5 mol</p>
            <p><strong>式②</strong>　−891x − 1562y ＝ −1672　（<strong>反応エンタルピーの変化量 ＝ −反応熱</strong>）</p>
            <p>式①・式②より　<strong>x ＝ 1.0 mol、y ＝ 0.50 mol</strong></p>
            <p>よって酸素は　2 mol ＋ 1.75 mol ＝ <strong>3.75 mol</strong></p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項⑤ ヘスの法則
// ===================================================================
const PART_5_HTML = `        <h4>重要事項⑤ ～エネルギー図とヘスの法則～</h4>

        <div class="box box-review">
          <p><strong>コラム❸　エネルギーって高い低いどう決まるの</strong></p>
          <p><strong>はると</strong>：さっき上の例でさ、反応エンタルピーを考えたけど、結局どういうのがエネルギー高いんやろ。状態変化のときも分子の動き激しいとエネルギー高いとか言ってたけどよくわからんしさ。</p>
          <p><strong>ひろき</strong>：まずさ、世の中っていうのは、<strong>エネルギーが高い状態から低い状態にいく</strong>ようにつくられてるってことはわかる？例えば、スマホのバッテリーとかって使ってなくてもやがてなくなってくやん？</p>
          <p><strong>はると</strong>：たしかに！てことはさ、エネルギーが高い状態はエネルギーが低い状態に変わろうとするから、変わろうとしやへんエネルギーが低い状態より<strong>不安定</strong>だよね。変化するもんね。</p>
          <p><strong>ひろき</strong>：だから、分子を作りたい原子のような<strong>バラバラな状態</strong>の方が、エネルギーってのは基本的に高いのよ。教科書では<strong>結合エネルギー</strong>（共有結合を切断するために必要なエネルギー）っていうのが出てくるんだけど、そりゃ切った後の方が、バラバラになるわけだからエネルギーは高くなるよね！</p>
          <p><strong>はると</strong>：H<sub>2</sub> → 2H　ΔH ＝ +436 kJ になって確かにエネルギー（エンタルピー）は高くなってるわ！</p>
        </div>

        <div class="box box-point">
          <p><strong><u>結合エネルギー</u></strong>…共有結合を切断するために必要なエネルギー</p>
          <p>← <strong><u class="wavy">切断するとエネルギーは高くなる（吸熱・ΔH ＞ 0）。</u></strong></p>
          <p class="reaction">H<sub>2</sub>(気) → 2H(気)　ΔH ＝ +436 kJ　　⇔　　2H(気) → H<sub>2</sub>(気)　ΔH ＝ −436 kJ</p>
          <p class="reaction">CH<sub>4</sub>(気) → C(気) + 4H(気)　ΔH ＝ 416 × 4 ＝ +1664 kJ</p>
          <p>← <strong>結合の数だけエネルギーを掛ける</strong>。結合エネルギーは切断のみを考えるので<strong><u class="wavy">状態は変わらない（C(気) であって C(黒) ではない）。</u></strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>格子エネルギー</u></strong>…イオン結晶を、構成する<strong>気体状のイオン</strong>にばらばらにするのに必要なエネルギー</p>
          <p class="reaction">NaCl(固) → Na<sup>+</sup>(気) + Cl<sup>−</sup>(気)　ΔH ＝ +787 kJ</p>
          <p>↑ こちらも切断するとエネルギーは高くなる。</p>
        </div>

        <div class="box box-point">
          <p><strong><u>エネルギー図</u></strong>…物質の持つエンタルピーの大きさを相対的に表した図</p>
          <p><strong><u class="wavy">エンタルピーが大きい物質を図の上側、小さい物質を図の下側に書く。</u></strong></p>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>状態</th><th>粒子の動き</th><th>エネルギー</th><th>安定性</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>気体</strong></td><td>分子の動きは激しい</td><td>高い</td><td>不安定</td></tr>
              <tr><td><strong>液体</strong></td><td>分子は移動できる</td><td>中間</td><td>—</td></tr>
              <tr><td><strong>固体</strong></td><td>分子は振動している</td><td>低い</td><td>安定</td></tr>
            </tbody>
          </table>
        </div>
        <p><strong><u class="wavy">状態変化におけるエンタルピーは、エネルギーは高い方から低い方へ移動する。</u></strong></p>

        <div class="box box-example">
          <p><strong>演習9 ★</strong>　次の（1）〜（6）を、エンタルピーを含む化学反応式で表せ。</p>
          <p>（1） メタン CH<sub>4</sub> の生成エンタルピーは ΔH ＝ −75 kJ/mol である。<br>
             （2） プロパン C<sub>3</sub>H<sub>8</sub> の燃焼エンタルピーは ΔH ＝ −2219 kJ/mol である。<br>
             （3） 氷の融解エンタルピーは ΔH ＝ +6.0 kJ/mol である。<br>
             （4） 0.20 mol の硝酸カリウム KNO<sub>3</sub> を水に溶かすと、7.0 kJ の熱が吸収される。<br>
             （5） グルコース C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> の生成エンタルピーは ΔH ＝ −1274 kJ/mol である。<br>
             （6） 水素分子の結合エネルギーは ΔH ＝ +436 kJ/mol である。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong><u class="wavy">基準の物質（注目する物質）の係数が必ず 1 になる。</u></strong></p>
            <p class="reaction">（1） C(黒) + 2H<sub>2</sub>(気) → CH<sub>4</sub>(気)　ΔH ＝ −75 kJ</p>
            <p class="reaction">（2） C<sub>3</sub>H<sub>8</sub>(気) + 5O<sub>2</sub>(気) → 3CO<sub>2</sub>(気) + 4H<sub>2</sub>O(液)　ΔH ＝ −2219 kJ</p>
            <p>→ 炭化水素の燃焼エンタルピーの化学反応式を作るときは、<strong>酸素の係数を最後に考える</strong>。</p>
            <p class="reaction">（3） H<sub>2</sub>O(固) → H<sub>2</sub>O(液)　ΔH ＝ +6.0 kJ</p>
            <p class="reaction">（4） KNO<sub>3</sub>(固) + aq → KNO<sub>3</sub>aq　ΔH ＝ +35 kJ</p>
            <p>→ 大量の水に溶かすので aq を用いる。0.20 mol で 7.0 kJ なので、1 mol では 35 kJ 吸収される（吸熱反応）ので、エンタルピーは増加する。</p>
            <p class="reaction">（5） 6C(黒) + 6H<sub>2</sub>(気) + 3O<sub>2</sub>(気) → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>(固)　ΔH ＝ −1274 kJ</p>
            <p class="reaction">（6） H<sub>2</sub>(気) → 2H(気)　ΔH ＝ +436 kJ</p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習10 ★★</strong>　次の（ア）〜（エ）に当てはまる符号を＋、−で答え、（オ）〜（ク）に当てはまる語句を答えよ。</p>
          <p class="reaction">Na(固) → Na(気)　ΔH ＝（ ア ）kJ …①　Na の（ オ ）</p>
          <p class="reaction">Cl<sub>2</sub>(気) → 2Cl(気)　ΔH ＝（ イ ）kJ …②　Cl−Cl の（ カ ）</p>
          <p class="reaction">Na(気) → Na<sup>+</sup> + e<sup>−</sup>　ΔH ＝（ ウ ）kJ …③　Na の（ キ ）</p>
          <p class="reaction">Cl(気) + e<sup>−</sup> → Cl<sup>−</sup>(気)　ΔH ＝（ エ ）kJ …④　Cl の（ ク ）</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（ア）<strong>＋</strong>　（オ）<strong>昇華エンタルピー</strong></p>
            <p>（イ）<strong>＋</strong>　（カ）<strong>結合エネルギー</strong></p>
            <p>（ウ）<strong>＋</strong>　（キ）<strong>イオン化エネルギー</strong></p>
            <p>（エ）<strong>−</strong>　（ク）<strong>電子親和力</strong></p>
            <p><strong><u class="wavy">「ばらばらにする（切る・引き離す）」向きは正、「くっつく・受け取る」向きは負。</u></strong>電子親和力だけが負になるのは、電子を受け取って安定化するから。</p>
          </details>
        </div>

        <div class="box box-review">
          <p><strong>コラム❹　仲良く山登りのはずが</strong></p>
          <p><strong>ひろき</strong>：ちょっと最近部活も引退したし、御在所（標高 1212 m）でも登ろかな思ってふもと（標高 400 m）まできたのはいいけど、、なんで体調悪いんお前！</p>
          <p><strong>はると</strong>：ちょもうごめんて！悪いからお前もう一人で登ってくれ。俺ロープーウェイで上まで行くわ。</p>
          <p><strong>ひろき</strong>：わかったよ。でも、途中の山小屋（標高 800 m）で休憩してくから上で結構待っといてもらうでな！</p>
          <p><strong>はると</strong>：おっけい！じゃあ、待ってるわよろしく！</p>
          <p><strong>解説者</strong>：はるともひろきも<strong>同じ標高を登っているけどルートが違う</strong>ね。</p>
          <ul>
            <li>❶（ひろきの経路）　(800 − 400) ＋ (1212 − 800) ＝ 400 ＋ 412 ＝ <strong>812 m</strong></li>
            <li>❷（はるとの経路）　1212 − 400 ＝ <strong>812 m</strong></li>
          </ul>
          <p><strong>偉い人（ヘス）</strong>：これってさ、化学の反応でも同じじゃない？どんなに反応が複雑に起こっても、<strong>反応の最初と最後だけ同じだったらエンタルピー（エネルギー）って同じ</strong>じゃね？</p>
          <p><strong>偉い人（ヘス）</strong>：え、もしそうなら、<strong>片方の反応経路から、もう片方の反応経路のエネルギーを求めることもできそう！</strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>ヘスの法則（総熱量保存の法則）</u></strong></p>
          <p><strong><u class="wavy">反応エンタルピーは、反応の最初と最後の状態だけで決まり、途中の経路にはよらない。</u></strong></p>
          <p>だから、実際には測れない反応でも、測れる反応を組み合わせれば計算で求められる。</p>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-thermo-3" viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-thermo-3 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-3 .st {font:bold 13px sans-serif;fill:#222;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-3 .cap {font:12px sans-serif;fill:#444;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-3 .bx {fill:#eef5fa;stroke:#16538a;stroke-width:2}
    .learning-content .lcfig-adv-thermo-3 .ar {stroke:#c0392b;stroke-width:2.5;fill:none}
    .learning-content .lcfig-adv-thermo-3 .ar2 {stroke:#1e7d46;stroke-width:2.5;fill:none;stroke-dasharray:7 5}
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

  <text class="ttl" x="360" y="26">同じ「はじめ」と「おわり」なら、どの道を通っても ΔH の合計は同じ</text>

  <rect class="bx" x="40" y="60" width="170" height="52" rx="8"/>
  <text class="st" x="125" y="92">C(黒鉛) + O₂(気)</text>

  <rect class="bx" x="510" y="60" width="170" height="52" rx="8"/>
  <text class="st" x="595" y="92">CO₂(気)</text>

  <rect class="bx" x="275" y="190" width="170" height="52" rx="8"/>
  <text class="st" x="360" y="222">CO(気) + 1/2 O₂(気)</text>

  <path class="ar" d="M215,86 L505,86" marker-end="url(#advth3red)"/>
  <text class="lb" x="360" y="72" fill="#c0392b">直接の道　ΔH = -394 kJ</text>

  <path class="ar2" d="M150,118 L300,186" marker-end="url(#advth3grn)"/>
  <text class="lb" x="185" y="168" fill="#1e7d46">ΔH₁ = -111 kJ</text>

  <path class="ar2" d="M425,186 L575,118" marker-end="url(#advth3grn)"/>
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

        <div class="box box-note">
          <p><strong><u>プリントの例　C(黒鉛) と H<sub>2</sub> から CO<sub>2</sub> と H<sub>2</sub>O をつくる</u></strong></p>
          <p><strong>経路1</strong>　❶ C(黒鉛) と H<sub>2</sub> から一度エタン C<sub>2</sub>H<sub>6</sub> をつくる　❷ エタン C<sub>2</sub>H<sub>6</sub> を燃焼させる</p>
          <p class="reaction">❶ 2C(黒) + 3H<sub>2</sub>(気) → C<sub>2</sub>H<sub>6</sub>(気)　ΔH ＝ x kJ</p>
          <p class="reaction">❷ C<sub>2</sub>H<sub>6</sub>(気) + 7/2 O<sub>2</sub>(気) → 2CO<sub>2</sub>(気) + 3H<sub>2</sub>O(液)　ΔH ＝ −1561 kJ</p>
          <p><strong>経路2</strong>　❸ C(黒鉛) を燃焼させる　❹ 水素 H<sub>2</sub> を燃焼させる</p>
          <p class="reaction">❸ 2C(黒) + 2O<sub>2</sub>(気) → 2CO<sub>2</sub>(気)　ΔH ＝ −788 kJ</p>
          <p class="reaction">❹ 3H<sub>2</sub>(気) + 3/2 O<sub>2</sub>(気) → 3H<sub>2</sub>O(液)　ΔH ＝ −858 kJ</p>
          <p>ヘスの法則より「<strong>経路1 ＝ 経路2</strong>」、つまり「<strong>❶＋❷＝❸＋❹</strong>」が成立するので</p>
          <div class="formula">x − 1561 ＝ −788 − 858　→　x ＝ −85 kJ/mol</div>
          <p>どちらの経路も、出発点（2C ＋ 3H<sub>2</sub> ＋ 7/2 O<sub>2</sub>）と到着点（2CO<sub>2</sub> ＋ 3H<sub>2</sub>O）は同じ。だから合計のエンタルピー変化も同じになる。</p>
        </div>

        <div class="box box-test">
          <p><strong><u>組み立てのコツ</u></strong></p>
          <ul>
            <li><strong><u>求めたい式に出てこない物質を消す</u></strong>ように足し引きを決める（消したい物質が左右で同じ数になるよう倍率を選ぶ）</li>
            <li>エンタルピー図（縦にエネルギーを取った図）を描くと、足し引きを間違えにくい</li>
            <li>「単体の生成エンタルピー ＝ 0」を使えば、生成エンタルピーの表から一気に求められる（→ 重要事項⑥）</li>
            <li>答えの符号が表の常識（燃焼は負など）と合っているか、最後に必ず見直す</li>
          </ul>
        </div>

        <div class="box box-example">
          <p><strong>例題9</strong>　次の①②から、一酸化炭素の生成エンタルピーを求めよ。<br>
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

        <div class="box box-example">
          <p><strong>例題10</strong>　次の値から、黒鉛からダイヤモンドへの変化の ΔH を求めよ。<br>
            ① C(黒鉛) + O<sub>2</sub>(気) → CO<sub>2</sub>(気)　ΔH ＝ −394 kJ<br>
            ② C(ダイヤモンド) + O<sub>2</sub>(気) → CO<sub>2</sub>(気)　ΔH ＝ −396 kJ</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>求めたい式は　C(黒鉛) → C(ダイヤモンド)　ΔH ＝ x kJ</p>
            <p>① − ② を計算する（②を逆にして足す）。CO<sub>2</sub> と O<sub>2</sub> が消えて求めたい式になる。</p>
            <p class="formula">x ＝ (−394) − (−396) ＝ <strong>+2 kJ</strong></p>
            <p>正なので<strong>ダイヤモンドの方がエンタルピーが高い</strong>（＝不安定側）。同素体の間でもエンタルピーが違うことがこれで確認できる。</p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>例題11</strong>　水酸化ナトリウムの溶解エンタルピーは −44.5 kJ/mol、NaOHaq と HClaq の中和エンタルピーは −56.5 kJ/mol である。NaOH(固) を塩酸に直接加えたときの ΔH を求めよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>「固体を溶かす」→「中和する」の2段階に分けられる（＝まわり道の道順）。</p>
            <p>① NaOH(固) + aq → NaOHaq　ΔH ＝ −44.5 kJ<br>
               ② NaOHaq + HClaq → NaClaq + H<sub>2</sub>O(液)　ΔH ＝ −56.5 kJ</p>
            <p>① ＋ ② で、求めたい「NaOH(固) + HClaq → NaClaq + H<sub>2</sub>O(液)」になる。</p>
            <p class="formula">ΔH ＝ (−44.5) + (−56.5) ＝ <strong>−101 kJ</strong></p>
            <p><strong><u class="wavy">経路がちがっても、はじめと終わりが同じなら合計は同じ。</u></strong>これがヘスの法則そのままの使い方。</p>
          </details>
        </div>
`;

// ===================================================================
// 定期テスト・入試に出やすいこと① エンタルピーの決定方法（演習11〜18）
// ===================================================================
const PART_DECIDE_HTML = `        <h4>定期テスト・入試に出やすいこと① ～エンタルピーの決定方法～</h4>

        <p>エンタルピーを求める問題は、<strong><u class="wavy">基本的に以下の4ステップで必ず解ける。</u></strong>入試問題はこの型の繰り返しなので、手順を体に入れてしまうのが最短ルート。</p>

        <div class="box box-point">
          <p><strong><u>エンタルピーの決定方法</u></strong></p>
          <p><strong>❶ 問題で与えられた上で、必要となるすべての反応エンタルピーの化学反応式を立てる</strong></p>
          <p><strong>❷ 求めるべきエンタルピーを含む式を、エンタルピーが分かる他式を組み合わせ相殺して立式する</strong></p>
          <ul>
            <li>〈1〉 <strong><u>式を反対にする</u></strong>　⇒　反応エンタルピーの符号が逆（−1 倍）になる</li>
            <li>〈2〉 <strong><u>両辺を〇倍する</u></strong>　⇒　反応エンタルピーの値が〇倍になる</li>
            <li>〈3〉 <strong><u>aq は柔軟に考える</u></strong>　⇒　aq は物質のように相殺せず、両辺に aq が含まれるように調節する<br>
              例）Na<sup>+</sup>(気) + aq → Na<sup>+</sup>aq + aq　← この aq は Na<sup>+</sup>aq があるので出てきても消してよい</li>
          </ul>
          <p><strong>❸ 組み合わせて立式した手順で計算し、反応エンタルピーの値を出す</strong></p>
          <p><strong>❹ エネルギー図を書く</strong>（「書け」という指示がある場合）</p>
          <ul>
            <li>① ❸の数値の式を移項して<strong>＋だけの式</strong>にする</li>
            <li>② <strong>左辺（経路1の値）＝右辺（経路2の値）</strong>を利用する</li>
            <li>③ 符号とエネルギーの関係性を考慮して図を書く</li>
          </ul>
          <p>※ <strong><u class="wavy">反応に利用していない物質は、矢印の前後のどちらにも書く。</u></strong></p>
        </div>

        <div class="box box-test">
          <p><strong><u>エネルギー図での上下関係（暗記）</u></strong></p>
          <p>上（エンタルピー大・不安定）から順に</p>
          <ol>
            <li><strong>原子</strong>（ばらばら）</li>
            <li><strong>単体</strong></li>
            <li><strong>化合物</strong></li>
            <li><strong>完全燃焼物</strong>（水や二酸化炭素）</li>
          </ol>
          <p>下（エンタルピー小・安定）。<strong><u class="wavy">「ばらばらほど上、燃え切った物ほど下」と覚える。</u></strong></p>
        </div>

        <div class="box box-example">
          <p><strong>演習11 ★</strong>　次の反応エンタルピーを含む化学反応式の ? に適した値を求めよ。また、? の値を求めたうえで、エネルギー図を完成させよ。</p>
          <p class="reaction">CH<sub>4</sub>(気) + H<sub>2</sub>O(気) → CO(気) + 3H<sub>2</sub>(気)　ΔH ＝ ? kJ</p>
          <p class="reaction">2H<sub>2</sub>(気) + O<sub>2</sub>(気) → 2H<sub>2</sub>O(気)　ΔH ＝ −484 kJ …①</p>
          <p class="reaction">2CO(気) + O<sub>2</sub>(気) → 2CO<sub>2</sub>(気)　ΔH ＝ −566 kJ …②</p>
          <p class="reaction">CH<sub>4</sub>(気) + 2O<sub>2</sub>(気) → CO<sub>2</sub>(気) + 2H<sub>2</sub>O(気)　ΔH ＝ −803 kJ …③</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>❶</strong> 問題文で式はすでに立てられているため、❷から考える。</p>
            <p><strong>❷</strong> <strong><u class="wavy">1つの反応式にしか含まれない物質から優先的に、反応式を重複させずに組み合わせる。</u></strong></p>
            <p>※ 今回の場合、CH<sub>4</sub>(気) は1つの反応式（③）にしか含まれていないが、H<sub>2</sub>O(気) は値が分かるいくつもの反応式（①・③）に含まれているので、<strong>CH<sub>4</sub>(気) を優先して使う</strong>。</p>
            <p>つくりたい式に含まれる CH<sub>4</sub>(気)、CO(気)、3H<sub>2</sub>(気) をつくる。</p>
            <p>CH<sub>4</sub>(気)（③を利用）を左辺へ</p>
            <p class="reaction">CH<sub>4</sub>(気) + 2O<sub>2</sub>(気) → CO<sub>2</sub>(気) + 2H<sub>2</sub>O(気)　ΔH ＝ −803 kJ …㋐</p>
            <p>3H<sub>2</sub>(気)（①を利用）を右辺へ</p>
            <p class="reaction">3H<sub>2</sub>O(気) → 3H<sub>2</sub>(気) + 3/2 O<sub>2</sub>(気)　ΔH ＝ (−484) × (−3/2) ＝ +726 kJ …㋑</p>
            <p>CO(気)（②を利用）を右辺へ</p>
            <p class="reaction">CO<sub>2</sub>(気) → CO(気) + 1/2 O<sub>2</sub>(気)　ΔH ＝ (−566) × (−1/2) ＝ +283 kJ …㋒</p>
            <p><strong>❸</strong> ㋐＋㋑＋㋒ より</p>
            <div class="formula">ΔH ＝ −803 + 726 + 283 ＝ <strong>+206 kJ/mol</strong></div>
            <p class="reaction">CH<sub>4</sub>(気) + H<sub>2</sub>O(気) → CO(気) + 3H<sub>2</sub>(気)　ΔH ＝ +206 kJ …㋓</p>
            <p><strong>❹ エネルギー図</strong></p>
            <p>① 移項して＋だけの式にする　−803(㋐) + 726(㋑) + 283(㋒) ＝ +206(㋓)</p>
            <p>② 左辺＝右辺を利用　+726 + 283（㋑と㋒）＝ +206 + 803（㋒と㋓）</p>
            <p>③ 一番上が CO(気) + 2O<sub>2</sub>(気) + 3H<sub>2</sub>(気)、一番下が CO<sub>2</sub>(気) + 3H<sub>2</sub>O(気) になる（＋の値が大きいほど上へ登る）。</p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習12 ★</strong>　次の(1)〜(3)にそれぞれ有効数字3桁で答えよ。ただし、エタン(気)、水(液)、二酸化炭素(気)の生成エンタルピーは、それぞれ −84.0 kJ/mol、−286 kJ/mol、−394 kJ/mol とし、エチレン(気)の燃焼エンタルピーは −1412 kJ/mol とする。また、燃焼の際に生成する水は液体とする。</p>
          <p>(1) エチレン(気)の生成エンタルピー［kJ/mol］を求めよ。<br>
             (2) エチレン(気)と水素(気)からエタン(気)1 mol が生成する反応の反応エンタルピー［kJ/mol］を求めよ。<br>
             (3) エタン(気)の燃焼エンタルピー［kJ/mol］を求めよ。〔20 星薬大 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>❶ 必要な化学反応式をすべて立てる</strong></p>
            <p class="reaction">2C(黒) + 3H<sub>2</sub>(気) → C<sub>2</sub>H<sub>6</sub>(気)　ΔH ＝ −84.0 kJ …①</p>
            <p class="reaction">H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(液)　ΔH ＝ −286 kJ …②</p>
            <p class="reaction">C(黒) + O<sub>2</sub>(気) → CO<sub>2</sub>(気)　ΔH ＝ −394 kJ …③</p>
            <p class="reaction">C<sub>2</sub>H<sub>4</sub>(気) + 3O<sub>2</sub>(気) → 2CO<sub>2</sub>(気) + 2H<sub>2</sub>O(液)　ΔH ＝ −1412 kJ …④</p>
            <p><strong>（1）</strong> つくりたい式は　2C(黒) + 2H<sub>2</sub>(気) → C<sub>2</sub>H<sub>4</sub>(気)　ΔH ＝ x kJ</p>
            <p class="reaction">2CO<sub>2</sub>(気) + 2H<sub>2</sub>O(液) → C<sub>2</sub>H<sub>4</sub>(気) + 3O<sub>2</sub>(気)　ΔH ＝ −1412(④) × (−1) ＝ +1412 kJ …㋐</p>
            <p class="reaction">2C(黒) + 2O<sub>2</sub>(気) → 2CO<sub>2</sub>(気)　ΔH ＝ −394(③) × 2 ＝ −788 kJ …㋑</p>
            <p class="reaction">2H<sub>2</sub>(気) + O<sub>2</sub>(気) → 2H<sub>2</sub>O(液)　ΔH ＝ −286(②) × 2 ＝ −572 kJ …㋒</p>
            <p>㋐＋㋑＋㋒ より　ΔH ＝ +1412 − 788 − 572 ＝ <strong>+52 kJ</strong> …⑤</p>
            <p>よってエチレン(気)の生成エンタルピーは <strong>+52.0 kJ/mol</strong></p>
            <p><strong>（2）</strong> つくりたい式は　C<sub>2</sub>H<sub>4</sub>(気) + H<sub>2</sub>(気) → C<sub>2</sub>H<sub>6</sub>(気)　ΔH ＝ x kJ<br>
               ※ 前の問題で求めた数値も利用してよい。</p>
            <p class="reaction">C<sub>2</sub>H<sub>4</sub>(気) → 2C(黒) + 2H<sub>2</sub>(気)　ΔH ＝ +52(⑤) × (−1) ＝ −52 kJ …㋓</p>
            <p class="reaction">2C(黒) + 3H<sub>2</sub>(気) → C<sub>2</sub>H<sub>6</sub>(気)　ΔH ＝ −84.0(①) kJ …㋔</p>
            <p>㋓＋㋔ より　ΔH ＝ −52 − 84 ＝ <strong>−136 kJ</strong> …⑥</p>
            <p>よって <strong>−136 kJ/mol</strong></p>
            <p><strong>（3）</strong> つくりたい式は　C<sub>2</sub>H<sub>6</sub>(気) + 7/2 O<sub>2</sub>(気) → 2CO<sub>2</sub>(気) + 3H<sub>2</sub>O(液)　ΔH ＝ x kJ</p>
            <p class="reaction">C<sub>2</sub>H<sub>6</sub>(気) → C<sub>2</sub>H<sub>4</sub>(気) + H<sub>2</sub>(気)　ΔH ＝ −136(⑥) × (−1) ＝ +136 kJ …㋕</p>
            <p class="reaction">C<sub>2</sub>H<sub>4</sub>(気) + 3O<sub>2</sub>(気) → 2CO<sub>2</sub>(気) + 2H<sub>2</sub>O(液)　ΔH ＝ −1412(④) kJ …㋖</p>
            <p class="reaction">H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(液)　ΔH ＝ −286(②) kJ …㋗</p>
            <p>㋕＋㋖＋㋗ より　ΔH ＝ +136 − 1412 − 286 ＝ <strong>−1562 kJ</strong></p>
            <p>よってエタン(気)の燃焼エンタルピーは <strong>−1562 kJ/mol</strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習13 ★★</strong></p>
          <p>（1） 1.0 mol/L の塩酸 100 mL を、1.0 mol/L の水酸化ナトリウム NaOH 水溶液 100 mL で中和するのと、水酸化ナトリウムの固体 4.0 g で中和するのとでは、どちらのほうが発熱量は多いか。その理由も説明せよ。</p>
          <p>（2） 次の A〜C の反応が一定圧力下で起こったときの発熱量を用いて、水酸化カリウムの水への溶解の際に放出される熱量 Q［kJ/mol］（溶解エンタルピー ΔH ＝ −Q）を求めよ。</p>
          <div class="table-wrap">
            <table>
              <tbody>
                <tr><td><strong>A</strong></td><td>塩化水素 1 mol を含む希塩酸に、水酸化カリウム 1 mol を含む希薄水溶液を加えて反応させたときの発熱量</td><td>56 kJ/mol</td></tr>
                <tr><td><strong>B</strong></td><td>硫酸 1 mol を水に加えて希硫酸とし、それに固体の水酸化カリウムを加えてちょうど中和させたときの合計の発熱量</td><td>323 kJ/mol</td></tr>
                <tr><td><strong>C</strong></td><td>硫酸の水への溶解の際に放出される熱量</td><td>95 kJ/mol</td></tr>
              </tbody>
            </table>
          </div>
          <p>〔センター試験 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>（1）</strong> <strong>固体の方が発熱量は大きくなる。</strong></p>
            <p><strong>理由</strong>：固体から反応させると、中和反応によりエンタルピーが放出されることに加えて、<strong>固体が水溶液になる際に溶解エンタルピーも放出される</strong>ため、エンタルピーの減少量が水溶液中からの反応よりも固体からの反応の方が大きくなり、その分発熱量は高くなるから。</p>
            <p>エネルギー図で見ると、上から　NaOH(固) ＋ HClaq　→（溶解エンタルピー）→　NaOHaq ＋ HClaq　→（中和エンタルピー）→　H<sub>2</sub>O(液) ＋ NaClaq　と<strong>2段階分下がる</strong>。</p>
            <p><strong>（2）</strong> 強酸・強塩基での中和反応は酸と塩基の種類によらず ΔH が一定であることを利用する。</p>
            <p><strong>A</strong>：HClaq + KOHaq → H<sub>2</sub>O(液) + KClaq　ΔH ＝ −56 kJ　（<strong>ΔH ＝ −Q に注意</strong>）</p>
            <p><strong>B と C</strong>：求める KOH の溶解エンタルピーを x kJ/mol とおく</p>
            <p class="reaction">① H<sub>2</sub>SO<sub>4</sub>(液) + aq → H<sub>2</sub>SO<sub>4</sub>aq　ΔH ＝ −95 kJ</p>
            <p class="reaction">② 2KOH(固) + aq → 2KOHaq　ΔH ＝ 2x kJ</p>
            <p class="reaction">③ H<sub>2</sub>SO<sub>4</sub>aq + 2KOHaq → K<sub>2</sub>SO<sub>4</sub>aq + 2H<sub>2</sub>O(液)　ΔH ＝ −112 kJ</p>
            <p>（③は水が 2 mol できるので −56 × 2 ＝ −112 kJ）</p>
            <p>①＋②＋③ が B の合計（ΔH ＝ −323 kJ）に等しいので</p>
            <div class="formula">−95 + 2x − 112 ＝ −323　→　x ＝ −58 kJ/mol</div>
            <p>よって放出される熱量 <strong>Q ＝ +58 kJ/mol</strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習14 ★★</strong>　実験1、2に関する文を読み、（1）〜（5）に答えよ。ただし、実験は一定圧力下の断熱容器内で行われ、すべての水溶液の比熱は 4.2 J/(g・K)、密度は 1.0 g/cm<sup>3</sup> とする。なお、（2）〜（5）は解答を有効数字2桁で記せ。H＝1.0、O＝16.0、Na＝23.0</p>
          <p><strong>実験1</strong>　固体の水酸化ナトリウム 2.0 g を水 48 g に加え、すばやくかき混ぜて、完全に溶解させた。このときの液温の変化を測定したところ、加熱曲線のような結果が得られた。</p>
          <p><strong>実験2</strong>　実験1で調製した水酸化ナトリウム水溶液の温度が一定になった時点で、同じ温度の 2.0 mol/L 塩酸 50 mL を混合し、すばやくかき混ぜた。このとき、混合水溶液の温度は、塩酸を加える前より 6.7 ℃ 上昇した。</p>
          <p>（1） 実験1において、水酸化ナトリウムの溶解が瞬間的に終了し、周囲への熱の放冷がなかったとみなせるときの水溶液の最高温度は A〜C のどれか。<br>
             （2） （1）の温度が 30 ℃ であったとして、実験1で発生した熱量は何 kJ か。<br>
             （3） 実験1において、固体の水酸化ナトリウムが水に溶解するときの溶解エンタルピーは何 kJ/mol か。<br>
             （4） 実験2において、塩酸と水酸化ナトリウム水溶液の中和反応における中和エンタルピーは何 kJ/mol か。<br>
             （5） 実験1と2の結果を用いて、固体の水酸化ナトリウム 4.0 g を 2.0 mol/L の塩酸 50 mL に溶解したとき発生する熱量［kJ］を求めよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>（1）</strong> 温度が下がり始めた後の直線部分を左側に延長し（<strong><u>外挿</u></strong>）、反応開始の瞬間（時間 0）の温度を読み取る。</p>
            <p>→ もし一瞬で反応が終わり、かつ熱が1ミリも逃げなかった場合に到達したはずの最高温度だから。よって答えは <strong>A</strong>。</p>
            <p><strong>（2）</strong> 融点や沸点に達していないので、温度を変化させるための熱量の変化を考える。</p>
            <div class="formula">Q ＝ mcΔt ＝ (48 + 2.0) × 4.2 × (30 − 20) ＝ 2100 J ＝ <strong>2.1 kJ</strong></div>
            <p><strong>（3）</strong> 実験1で「発生した熱量」を「1 mol あたりの熱量」に換算する。</p>
            <p>NaOH の物質量は　2.0 g × (1 mol / 40 g) ＝ 0.050 mol</p>
            <div class="formula">溶解エンタルピー ＝ −2.1 kJ ÷ 0.050 mol ＝ <strong>−42 kJ/mol</strong></div>
            <p><strong>（4）</strong> 実験2の「中和反応で発生した熱量」から「水 1 mol あたりの熱量」に換算する。</p>
            <p>❶ 溶液の温度上昇に必要な熱量　4.2 J/(g・K) × (50 g + 50 g) × 6.7 K ＝ 2814 J</p>
            <p>❷ 加えた塩酸の物質量は　2.0 mol/L × (50/1000) L ＝ 0.10 mol　だが、NaOH は 0.050 mol なので<strong>少ない方の NaOH がすべて反応</strong>し、生成する水は 0.050 mol。</p>
            <div class="formula">中和エンタルピー ＝ −2.814 kJ ÷ 0.050 mol ＝ −56.28 ≒ <strong>−56 kJ/mol</strong></div>
            <p><strong>（5）</strong> 固体の NaOH を直接塩酸に溶かすと、「<strong>溶解</strong>」と「<strong>中和</strong>」が同時に起こる。</p>
            <p>NaOH の物質量は　4.0 g × (1 mol / 40 g) ＝ 0.10 mol。塩酸も 2.0 mol/L × (50/1000) L ＝ 0.10 mol なので、過不足なく 0.10 mol の反応が起こる。</p>
            <p>❶ 溶解で発生する熱量　42 kJ/mol × 0.10 mol ＝ 4.2 kJ</p>
            <p>❷ 中和で発生する熱量　56.28 kJ/mol × 0.10 mol ＝ 5.628 kJ</p>
            <div class="formula">❶＋❷ ＝ 4.2 + 5.628 ＝ 9.828 ≒ <strong>9.8 kJ</strong></div>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習15 ★★</strong>　25 ℃、1 気圧において、水素 H<sub>2</sub>(気) と酸素 O<sub>2</sub>(気) それぞれ 4.00 g からなる混合気体に点火し、生成した H<sub>2</sub>O すべてが水になったとき、放出された熱量が 71.5 kJ であった。このとき、水の凝縮エンタルピーは　　　kJ/mol である。ただし、H<sub>2</sub>O(気) の生成エンタルピーは −242 kJ/mol である。答えは有効数字2桁で記せ。H＝1.0、O＝16.0〔18 愛知工大 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>混合気体のどちらもが反応する問題なので、変化量を追う。</p>
            <p class="reaction">H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(液)　ΔH ＝ x kJ</p>
            <p>（反応前）　H<sub>2</sub>：2 mol　O<sub>2</sub>：0.25 mol　H<sub>2</sub>O：0 mol<br>
               （反応後）　H<sub>2</sub>：1.5 mol　O<sub>2</sub>：0 mol　H<sub>2</sub>O：0.5 mol</p>
            <p>H<sub>2</sub>O(液) が 0.5 mol 生成したときに 71.5 kJ 発生しているので、1 mol なら 143 kJ。よって <strong>ΔH ＝ −143 kJ/mol</strong>。</p>
            <p><strong>❶ 必要な式を立てる</strong></p>
            <p class="reaction">H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(液)　ΔH ＝ −143 kJ …①</p>
            <p class="reaction">H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(気)　ΔH ＝ −242 kJ …②</p>
            <p><strong>❷❸</strong> つくりたい式は　H<sub>2</sub>O(液) → H<sub>2</sub>O(気)　ΔH ＝ x kJ</p>
            <p class="reaction">H<sub>2</sub>O(液) → H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気)　ΔH ＝ −143(①) × (−1) ＝ +143 kJ …㋐</p>
            <p class="reaction">H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(気)　ΔH ＝ −242(②) kJ …㋑</p>
            <p>㋐＋㋑ より　ΔH ＝ +143 − 242 ＝ −99 kJ（これは<strong>蒸発</strong>の値）</p>
            <p>問われているのは<strong>凝縮</strong>（逆向き）だが、プリントの解答では大きさで答えて <strong>99 kJ/mol</strong>。符号を付けるなら凝縮は発熱なので ΔH ＝ −99 kJ/mol とする。</p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習16 ★★</strong>　次の記述を読み、空欄（ア）、（イ）に当てはまる整数値、（ウ）に適語を入れよ。</p>
          <p>※ 結合エネルギー：H−H 436 kJ/mol、N≡N 945 kJ/mol、O＝O 498 kJ/mol、N−H 391 kJ/mol、O−H 463 kJ/mol</p>
          <p>化学反応において、反応物と生成物がすべて気体分子のとき、反応エンタルピーを結合エネルギーから求めることができる。したがって、アンモニア（気体）の生成エンタルピーは（ ア ）kJ/mol であり、水分子（気体）の生成エンタルピーは（ イ ）kJ/mol となる。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>（ア） アンモニアの生成エンタルピー</strong></p>
            <p>つくりたい式は　1/2 N<sub>2</sub>(気) + 3/2 H<sub>2</sub>(気) → NH<sub>3</sub>(気)　ΔH ＝ x kJ</p>
            <p class="reaction">N≡N より　N<sub>2</sub>(気) → 2N(気)　ΔH ＝ +945 kJ …①</p>
            <p class="reaction">H−H より　H<sub>2</sub>(気) → 2H(気)　ΔH ＝ +436 kJ …②</p>
            <p class="reaction">(N−H)×3 より　NH<sub>3</sub>(気) → N(気) + 3H(気)　ΔH ＝ +391 × 3 kJ …③</p>
            <p>(1/2)×① ＋ (3/2)×② − ③ を考えると</p>
            <div class="formula">ΔH ＝ +472.5 + 654 − 1173 ＝ <strong>−46.5 kJ/mol</strong></div>
            <p><strong>（イ） 水分子（気体）の生成エンタルピー</strong></p>
            <p>つくりたい式は　H<sub>2</sub>(気) + 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(気)</p>
            <p class="reaction">H<sub>2</sub>(気) → 2H(気)　ΔH ＝ +436 kJ …①</p>
            <p class="reaction">O<sub>2</sub>(気) → 2O(気)　ΔH ＝ +498 kJ …②</p>
            <p class="reaction">(O−H)×2 より　H<sub>2</sub>O(気) → 2H(気) + O(気)　ΔH ＝ +463 × 2 kJ …③</p>
            <p>① ＋ (1/2)×② − ③ を考えると</p>
            <div class="formula">ΔH ＝ +436 + 249 − 926 ＝ <strong>−241 kJ/mol</strong></div>
            <p>（ウ）<strong>結合</strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習17 ★★★</strong>　1 mol の NaCl の結晶を、気体状態の Na<sup>+</sup> と Cl<sup>−</sup> にばらばらにするのに必要なエネルギーを<strong>格子エンタルピー</strong>という。格子エンタルピーを直接測定するのは困難であるが、この値は次にあげる❶〜❺の各値を使うと、ヘスの法則を用いて計算で求めることができる。〔三重大改・慶応義塾大改・東京理科大改〕</p>
          <ul>
            <li>❶ Na の昇華エンタルピーは 109 kJ/mol である。</li>
            <li>❷ Cl<sub>2</sub> の Cl−Cl 結合の結合エンタルピーは 244 kJ/mol である。</li>
            <li>❸ Na の第1イオン化エネルギーは 498 kJ/mol である。</li>
            <li>❹ Cl の電子親和力は 356 kJ/mol である。</li>
            <li>❺ NaCl 結晶の生成エンタルピーは −410 kJ/mol である。</li>
          </ul>
          <p>（1） ❶〜❺の内容を熱化学反応式で表せ。<br>
             （2） NaCl 結晶の格子エンタルピーは何 kJ/mol か。<br>
             （3） 1 mol の気体状態の Na<sup>+</sup>、Cl<sup>−</sup> が多量の水に溶解すると、それぞれ 406 kJ、373 kJ の発熱がある（＝ Na<sup>+</sup>(気)、Cl<sup>−</sup>(気) の水和エンタルピーは −406 kJ/mol、−373 kJ/mol）。以上のことから、NaCl 結晶の水への溶解エンタルピー［kJ/mol］を求めよ。<br>
             （4） エネルギー図を書き、エネルギー的に最も安定な状態と不安定な状態を次の選択肢から選べ。<br>
             （ア） Na<sup>+</sup>(aq) + Cl<sup>−</sup>(aq)　（イ） Na(気) + Cl(気)　（ウ） Na<sup>+</sup>(気) + Cl<sup>−</sup>(気)　（エ） NaCl(固) + aq　（オ） NaCl(気)<br>
             （5） エネルギー図をもとにして、水和エンタルピーと格子エネルギーの関係から、固体のイオン結晶が水へ溶解する際にいえることとして、正しいものを以下の中から選べ。<br>
             （あ） NaCl(固) の格子エネルギーと水和エンタルピーの値を足すと、溶解エンタルピーとなる<br>
             （い） NaCl(固) の格子エネルギーと水和エンタルピーの値を足すと、生成エンタルピーとなる<br>
             （う） NaCl(固) の水和エンタルピーから生成エンタルピーの値を引くと、格子エネルギーになる<br>
             （え） NaCl(固) の水和エンタルピーが格子エネルギーよりも小さいとき、水への溶解は吸熱となる</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>（1）</strong></p>
            <p class="reaction">❶ Na(固) → Na(気)　ΔH ＝ +109 kJ</p>
            <p class="reaction">❷ Cl<sub>2</sub>(気) → 2Cl(気)　ΔH ＝ +244 kJ</p>
            <p class="reaction">❸ Na(気) → Na<sup>+</sup>(気) + e<sup>−</sup>　ΔH ＝ +498 kJ</p>
            <p class="reaction">❹ Cl(気) + e<sup>−</sup> → Cl<sup>−</sup>(気)　ΔH ＝ −356 kJ</p>
            <p class="reaction">❺ Na(固) + 1/2 Cl<sub>2</sub>(気) → NaCl(固)　ΔH ＝ −410 kJ</p>
            <p><strong>（2）</strong> つくりたい式は　NaCl(固) → Na<sup>+</sup>(気) + Cl<sup>−</sup>(気)　ΔH ＝ x kJ</p>
            <p class="reaction">Na(気) → Na<sup>+</sup>(気) + e<sup>−</sup>　ΔH ＝ +498 kJ …㋐</p>
            <p class="reaction">Cl(気) + e<sup>−</sup> → Cl<sup>−</sup>(気)　ΔH ＝ −356 kJ …㋑</p>
            <p class="reaction">1/2 Cl<sub>2</sub>(気) → Cl(気)　ΔH ＝ +244 × 1/2 ＝ +122 kJ …㋒</p>
            <p class="reaction">Na(固) → Na(気)　ΔH ＝ +109 kJ …㋓</p>
            <p class="reaction">NaCl(固) → Na(固) + 1/2 Cl<sub>2</sub>(気)　ΔH ＝ −410 × (−1) ＝ +410 kJ …㋔</p>
            <p>㋐＋㋑＋㋒＋㋓＋㋔ より</p>
            <div class="formula">ΔH ＝ +498 − 356 + 122 + 109 + 410 ＝ <strong>+783 kJ</strong> …⑥</div>
            <p>よって NaCl 結晶の格子エンタルピーは <strong>+783 kJ/mol</strong></p>
            <p><strong>（3）</strong> 式を追加する。</p>
            <p class="reaction">Na<sup>+</sup>(気) + aq → Na<sup>+</sup>(aq)　ΔH ＝ −406 kJ …⑦</p>
            <p class="reaction">Cl<sup>−</sup>(気) + aq → Cl<sup>−</sup>(aq)　ΔH ＝ −373 kJ …⑧</p>
            <p>つくりたい式は　NaCl(固) + aq → Na<sup>+</sup>(aq) + Cl<sup>−</sup>(aq)　ΔH ＝ x kJ</p>
            <p>⑥＋⑦＋⑧ より</p>
            <div class="formula">ΔH ＝ +783 − 406 − 373 ＝ <strong>+4 kJ</strong> …⑨</div>
            <p>よって NaCl 結晶の水への溶解エンタルピーは <strong>+4 kJ/mol</strong></p>
            <p><strong>（4）</strong> エンタルピーが大きいほど不安定・小さいほど安定。図で判断すると</p>
            <p>最も安定な状態 <strong>（ウ）</strong>　最も不安定な状態 <strong>（エ）</strong></p>
            <p>※ ⑥のところは説明しやすいように矢印を2つにしているが、解答では1つの矢印で表すこと。</p>
            <p><strong>（5）</strong> 今回の図のように、<strong><u class="wavy">水和エンタルピーが格子エネルギーよりも小さいときは、溶解エンタルピーは正になり吸熱反応が起こる。</u></strong>よって答えは <strong>（え）</strong></p>
          </details>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-thermo-7" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg" style="max-width:740px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-thermo-7 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-7 .st {font:bold 12px sans-serif;fill:#222;text-anchor:start}
    .learning-content .lcfig-adv-thermo-7 .lb {font:11px sans-serif;fill:#c0392b;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-7 .lb2 {font:11px sans-serif;fill:#1e7d46;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-7 .nm {font:10px sans-serif;fill:#666;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-7 .ax {stroke:#888;stroke-width:1.5}
    .learning-content .lcfig-adv-thermo-7 .lvl {stroke:#16538a;stroke-width:2.5}
    .learning-content .lcfig-adv-thermo-7 .up {stroke:#c0392b;stroke-width:2;fill:none}
    .learning-content .lcfig-adv-thermo-7 .dn {stroke:#1e7d46;stroke-width:2;fill:none}
  </style>
  <defs>
    <marker id="advth7r" markerWidth="8" markerHeight="8" refX="4.5" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#c0392b"/></marker>
    <marker id="advth7g" markerWidth="8" markerHeight="8" refX="4.5" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#1e7d46"/></marker>
  </defs>

  <text class="ttl" x="380" y="20">演習17 NaCl のエネルギー図（ボルン・ハーバーサイクル）</text>
  <line class="ax" x1="40" y1="40" x2="40" y2="390"/>
  <text class="nm" x="18" y="215" transform="rotate(-90 18 215)">エンタルピー</text>

  <line class="lvl" x1="60" y1="60" x2="230" y2="60"/>
  <text class="st" x="62" y="54">Na⁺(気) + Cl(気) + e⁻</text>

  <line class="lvl" x1="60" y1="150" x2="230" y2="150"/>
  <text class="st" x="62" y="144">Na(気) + Cl(気)</text>

  <line class="lvl" x1="60" y1="230" x2="230" y2="230"/>
  <text class="st" x="62" y="224">Na(気) + 1/2 Cl₂(気)</text>

  <line class="lvl" x1="60" y1="300" x2="230" y2="300"/>
  <text class="st" x="62" y="294">Na(固) + 1/2 Cl₂(気)</text>

  <line class="lvl" x1="60" y1="370" x2="300" y2="370"/>
  <text class="st" x="62" y="386">NaCl(固) (+ aq)</text>

  <path class="up" d="M150,148 L150,64" marker-end="url(#advth7r)"/>
  <text class="lb" x="150" y="108">㋐ +498</text>
  <text class="nm" x="150" y="122">イオン化E</text>

  <path class="up" d="M150,228 L150,154" marker-end="url(#advth7r)"/>
  <text class="lb" x="150" y="192">㋒ +122</text>
  <text class="nm" x="150" y="206">結合E</text>

  <path class="up" d="M150,298 L150,234" marker-end="url(#advth7r)"/>
  <text class="lb" x="150" y="266">㋓ +109</text>
  <text class="nm" x="150" y="280">昇華</text>

  <path class="up" d="M150,368 L150,304" marker-end="url(#advth7r)"/>
  <text class="lb" x="150" y="336">㋔ +410</text>
  <text class="nm" x="150" y="350">生成の逆</text>

  <line class="lvl" x1="420" y1="120" x2="620" y2="120"/>
  <text class="st" x="422" y="114">Na⁺(気) + Cl⁻(気)</text>

  <line class="lvl" x1="420" y1="360" x2="620" y2="360"/>
  <text class="st" x="422" y="378">Na⁺(aq) + Cl⁻(aq)</text>

  <path class="dn" d="M300,64 L410,116" marker-end="url(#advth7g)"/>
  <text class="lb2" x="330" y="80">㋑ −356</text>
  <text class="nm" x="345" y="94">電子親和力</text>

  <path class="up" d="M280,366 L415,126" marker-end="url(#advth7r)"/>
  <text class="lb" x="330" y="250">⑥ +783</text>
  <text class="nm" x="332" y="264">格子E</text>

  <path class="dn" d="M520,126 L520,354" marker-end="url(#advth7g)"/>
  <text class="lb2" x="565" y="230">⑦+⑧ = −779</text>
  <text class="nm" x="565" y="244">水和エンタルピー</text>

  <path class="up" d="M310,368 L415,362" marker-end="url(#advth7r)"/>
  <text class="lb" x="362" y="356">⑨ +4</text>
  <text class="nm" x="362" y="400">溶解エンタルピー（吸熱）</text>
</svg>
          <figcaption>演習17 のエネルギー図。左の階段（㋐㋒㋓㋔）を登り、㋑で下がって Na⁺(気)+Cl⁻(気) に到達する経路と、格子エネルギー⑥で一気に登る経路が等しい。さらに水和（−779）と溶解（+4）が右側でつながる。</figcaption>
        </figure>

        <div class="box box-example">
          <p><strong>演習18 ★★★</strong>　ダイヤモンドのすべての結合を切断して炭素原子を生成するのに必要なエネルギーをその結合の数で割ると、ダイヤモンドの C、C 間の<strong>平均結合エンタルピー</strong>を求めることができる。以下の構造に関する補足情報を参考に、次の問いに答えよ。〔龍谷大学 改〕</p>
          <ul>
            <li><strong>ダイヤモンド</strong>：1つの炭素原子は隣接する<strong>4個</strong>の炭素原子と結合している（正四面体構造）。</li>
            <li><strong>黒鉛</strong>：1つの炭素原子は同一平面上の<strong>3個</strong>の炭素原子と結合している（層状の網目構造）。</li>
            <li><strong>フラーレン C<sub>60</sub></strong>：1つの炭素原子は隣接する<strong>3個</strong>の炭素原子と結合している（サッカーボール状の分子構造）。</li>
          </ul>
          <p>※ いずれの構造においても、1本の結合は2つの原子によって共有されている。</p>
          <p>（1） ダイヤモンドの燃焼エンタルピーを −396 kJ/mol、黒鉛の燃焼エンタルピーを −394 kJ/mol、炭素（黒鉛）の昇華エンタルピーを 718 kJ/mol とする。<br>
             ① 黒鉛の C、C 間の平均結合エンタルピー［kJ/mol］を求めよ。<br>
             ② ダイヤモンドの C、C 間の平均結合エンタルピー［kJ/mol］を求めよ。</p>
          <p>（2） 炭素の同素体として新たに発見されたフラーレンは、炭素原子からなる五角形の面 12 個と、六角形の面 20 個が組み合わさったサッカーボール状の分子 C<sub>60</sub> である。フラーレンの燃焼エンタルピーを表す次の熱化学反応式と、（1）のデータを用いて、フラーレンの C、C 間の平均結合エンタルピー［kJ/mol］を求めよ。</p>
          <p class="reaction">C<sub>60</sub>(固) + 60O<sub>2</sub>(気) → 60CO<sub>2</sub>(気)　ΔH ＝ −26110 kJ</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong><u class="wavy">全体をバラバラにするのに使った総エネルギー（昇華エンタルピー）を、目的の物質1個あたりの結合の数で割る。</u></strong></p>
            <div class="formula">平均結合エンタルピー ＝ 全体をバラバラにするための昇華エンタルピー ÷ 目的の物質1個あたりの結合の総数</div>
            <p>※ <strong>昇華</strong>（固体を気体のバラバラの原子にする）とは、「繋がっているすべての結合をぶち壊す」こと。</p>
            <p>※ 結合1本は「2つの炭素原子」が手を繋いで共有しているため、自分の腕の数をそのまま数えると「相手側からも数えた<strong>2重カウント</strong>」になってしまうことから、必ず「<strong>自分の腕の数 ÷ 2</strong>」をする。</p>
            <p><strong>（1）①　黒鉛</strong></p>
            <p>❶ 昇華エンタルピー ＝ 718 kJ/mol</p>
            <p>❷ 黒鉛は3個の炭素原子と結合しているので　3 ÷ 2 ＝ 1.5 本</p>
            <div class="formula">718 ÷ 1.5 ＝ 478.66… ≒ <strong>479 kJ/mol</strong></div>
            <p><strong>（1）②　ダイヤモンド</strong></p>
            <p>❶ ダイヤモンド（−396 kJ/mol）の方が黒鉛（−394 kJ/mol）より <strong>2 kJ だけエネルギーが低い場所にいる</strong>。よって昇華をするためのエネルギーは黒鉛より 2 kJ 少なくて済むため　718 − 2 ＝ 716 kJ/mol</p>
            <p>❷ ダイヤモンドは4個の炭素原子と結合しているので　4 ÷ 2 ＝ 2 本</p>
            <div class="formula">716 ÷ 2 ＝ <strong>358 kJ/mol</strong></div>
            <p><strong>（2）　フラーレン</strong></p>
            <p>❶ 黒鉛 60 mol 分の燃焼エンタルピー（−394 × 60 ＝ −23640 kJ）と、フラーレン 1 mol の燃焼エンタルピー（−26110 kJ）を比べると、<strong>フラーレンの方が 2470 kJ エンタルピーは小さくなる</strong>。これは燃焼エンタルピーだけでなく、昇華エンタルピーでも同じように考えられる。</p>
            <p>よって、黒鉛 60 mol を気体にするエネルギー（+718 × 60 ＝ +43080 kJ）から、この標高差 2470 kJ を引く。</p>
            <div class="formula">+43080 − 2470 ＝ +40610 kJ/mol</div>
            <p>❷ フラーレンも1つの炭素は3個と結合するので 3 ÷ 2 ＝ 1.5 本。ただし C<sub>60</sub> は炭素 60 個で分子をつくるので、1分子の中には 1.5 × 60 ＝ <strong>90 本</strong></p>
            <div class="formula">+40610 ÷ 90 ＝ 451.22… ≒ <strong>451 kJ/mol</strong></div>
          </details>
        </div>
`;

// ===================================================================
// 重要事項⑥ 生成エンタルピーからの公式
// ===================================================================
const PART_6_HTML = `        <h4>重要事項⑤ ～（補講）生成エンタルピーからの公式～</h4>

        <div class="box box-point">
          <p><strong><u>生成エンタルピーによる反応エンタルピーの計算</u></strong></p>
          <div class="formula">ΔH ＝ Σ（生成物の生成エンタルピー） − Σ（反応物の生成エンタルピー）</div>
          <p>ΔH の定義とまったく同じ「生成物 − 反応物」の形。<strong>係数をかけ忘れない</strong>こと。</p>
          <p>なぜこう書けるかというと、「単体 → 反応物 → 生成物」と「単体 → 生成物」の2つの道をヘスの法則で結んだ結果だから。<strong><u class="wavy">生成エンタルピーは「単体を基準（0）にした高さ」なので、その差が反応エンタルピーになる。</u></strong></p>
        </div>

        <div class="box box-test">
          <p><strong><u>使うときの注意</u></strong></p>
          <ul>
            <li><strong><u>単体の生成エンタルピーは 0</u></strong>（O<sub>2</sub>、H<sub>2</sub>、N<sub>2</sub>、C(黒鉛)、Fe など）</li>
            <li>係数が付いている物質は<strong>係数をかけてから足す</strong></li>
            <li>状態が違えば値も違う。H<sub>2</sub>O(液) と H<sub>2</sub>O(気) を混同しない</li>
            <li>表に「生成エンタルピー」と書いてあるか「燃焼エンタルピー」と書いてあるかを最初に確認する（公式の向きが変わる）</li>
          </ul>
        </div>

        <div class="box box-example">
          <p><strong>例題12</strong>　生成エンタルピーが CO<sub>2</sub>(気) −394 kJ/mol、H<sub>2</sub>O(液) −286 kJ/mol、CH<sub>4</sub>(気) −75 kJ/mol のとき、メタンの燃焼エンタルピーを求めよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p class="reaction">CH<sub>4</sub>(気) + 2O<sub>2</sub>(気) → CO<sub>2</sub>(気) + 2H<sub>2</sub>O(液)　ΔH ＝ x kJ</p>
            <p>生成物側：(−394) + 2 × (−286) ＝ −966 kJ<br>
               反応物側：(−75) + 2 × 0 ＝ −75 kJ　（O<sub>2</sub> は<strong>単体なので 0</strong>）</p>
            <p class="formula">x ＝ (−966) − (−75) ＝ <strong>−891 kJ</strong></p>
            <p>よって燃焼エンタルピーは <strong><u>−891 kJ/mol</u></strong>。</p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>例題13</strong>　エタン C<sub>2</sub>H<sub>6</sub>(気) の燃焼エンタルピーは −1560 kJ/mol、CO<sub>2</sub>(気) の生成エンタルピーは −394 kJ/mol、H<sub>2</sub>O(液) の生成エンタルピーは −286 kJ/mol である。エタンの生成エンタルピーを求めよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p class="reaction">C<sub>2</sub>H<sub>6</sub>(気) + 7/2 O<sub>2</sub>(気) → 2CO<sub>2</sub>(気) + 3H<sub>2</sub>O(液)　ΔH ＝ −1560 kJ</p>
            <p>公式に当てはめ、求めたいエタンの生成エンタルピーを x とおく。</p>
            <p class="formula">−1560 ＝ { 2 × (−394) + 3 × (−286) } − { x + 0 }</p>
            <p>−1560 ＝ (−788 − 858) − x ＝ −1646 − x　より　x ＝ −1646 + 1560</p>
            <p class="formula">x ＝ <strong>−86 kJ/mol</strong></p>
            <p><strong><u class="wavy">未知の生成エンタルピーを x とおいて公式に入れる</u></strong>のが、この型の定石。</p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項⑤（補講） 結合エネルギーからの公式
// ===================================================================
const PART_7_HTML = `        <h4>重要事項⑤ ～（補講）結合エネルギーからの公式～</h4>

        <p>
          <strong><u>結合エネルギー</u></strong>…気体分子の共有結合 1 mol を切って、ばらばらの原子にするのに必要なエネルギー（kJ/mol）。<strong><u>結合エンタルピー</u></strong>とも呼ぶ。<br>
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
<svg class="lcfig lcfig-adv-thermo-4" viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-thermo-4 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-4 .st {font:bold 13px sans-serif;fill:#222;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-4 .cap {font:12px sans-serif;fill:#444;text-anchor:middle}
    .learning-content .lcfig-adv-thermo-4 .bx {fill:#fdf6e3;stroke:#b7791f;stroke-width:2}
    .learning-content .lcfig-adv-thermo-4 .bx2 {fill:#eef5fa;stroke:#16538a;stroke-width:2}
    .learning-content .lcfig-adv-thermo-4 .up {stroke:#c0392b;stroke-width:2.5;fill:none}
    .learning-content .lcfig-adv-thermo-4 .dn {stroke:#1e7d46;stroke-width:2.5;fill:none}
    .learning-content .lcfig-adv-thermo-4 .lb {font:bold 12px sans-serif;text-anchor:middle}
  </style>
  <defs>
    <marker id="advth4red" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#c0392b"/>
    </marker>
    <marker id="advth4grn" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
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

  <path class="up" d="M150,161 L290,102" marker-end="url(#advth4red)"/>
  <text class="lb" x="150" y="130" fill="#c0392b">結合を切る（吸熱・正）</text>

  <path class="dn" d="M430,102 L570,161" marker-end="url(#advth4grn)"/>
  <text class="lb" x="575" y="130" fill="#1e7d46">結合ができる（発熱・負）</text>

  <text class="cap" x="360" y="238">ΔH = （反応物の結合エネルギーの和） - （生成物の結合エネルギーの和）</text>
</svg>
          <figcaption>結合エネルギーの考え方。反応物をいったん原子までバラす道を通っても、ヘスの法則により ΔH は同じになる。</figcaption>
        </figure>

        <div class="box box-example">
          <p><strong>例題14</strong>　結合エネルギーが H−H 436 kJ/mol、Cl−Cl 243 kJ/mol、H−Cl 432 kJ/mol のとき、H<sub>2</sub>(気) + Cl<sub>2</sub>(気) → 2HCl(気) の ΔH を求めよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>反応物側：436 + 243 ＝ 679 kJ　（H−H が1本、Cl−Cl が1本）<br>
               生成物側：432 × 2 ＝ 864 kJ　（H−Cl が<strong>2本</strong>。係数のかけ忘れに注意）</p>
            <p class="formula">ΔH ＝ 679 − 864 ＝ <strong>−185 kJ</strong></p>
            <p>負なので発熱反応。<strong><u class="wavy">切るのに必要な分より、できるときに出る分の方が大きいと発熱になる。</u></strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>例題15</strong>　N<sub>2</sub>(気) + 3H<sub>2</sub>(気) → 2NH<sub>3</sub>(気)　ΔH ＝ −92 kJ である。N≡N 946 kJ/mol、H−H 436 kJ/mol のとき、N−H の結合エネルギーを求めよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>NH<sub>3</sub> 1 分子に N−H は<strong>3本</strong>あるので、2NH<sub>3</sub> では <strong>6本</strong>。求める値を x とおく。</p>
            <p class="formula">−92 ＝ ( 946 + 3 × 436 ) − 6x</p>
            <p>−92 ＝ (946 + 1308) − 6x ＝ 2254 − 6x　より　6x ＝ 2254 + 92 ＝ 2346</p>
            <p class="formula">x ＝ <strong>391 kJ/mol</strong></p>
            <p><strong><u class="wavy">分子内の結合の本数を数え間違えるのが最大の失点原因。</u></strong>構造式を必ず書いてから数える。</p>
          </details>
        </div>

        <div class="box box-test">
          <p><strong><u>結合エネルギーを使うときの注意</u></strong></p>
          <ul>
            <li>結合エネルギーの式が使えるのは、<strong><u>原則すべてが気体</u></strong>のとき。液体や固体が混ざるときは、蒸発エンタルピーや昇華エンタルピーを別に足す</li>
            <li>二重結合・三重結合は、単結合の何倍かではなく<strong>独立した値</strong>が与えられる（C＝C は C−C の2倍ではない）</li>
            <li>結合の<strong>本数</strong>は構造式から数える（H<sub>2</sub>O は O−H が2本、CH<sub>4</sub> は C−H が4本、C<sub>2</sub>H<sub>6</sub> は C−C 1本と C−H 6本）</li>
            <li>結合エネルギーが<strong>大きい</strong>ほど、その結合は<strong>強く・切れにくい</strong></li>
          </ul>
        </div>

        <div class="box box-memory">
          <p>2つの公式の向きは、こう覚えると混ざらない。<br>
             ・<strong>生成</strong>エンタルピー … 生成物 − 反応物（＝ΔH の定義そのまま）<br>
             ・<strong>結合</strong>エネルギー … 反応物 − 生成物（＝切る分 − できる分）<br>
             <strong><u class="wavy">「セイセイはそのまま、ケツゴウは逆」</u></strong>と口で言って覚える。</p>
        </div>
`;

// ===================================================================
// 重要事項⑥ エンタルピーとエントロピーの調整
// ===================================================================
const PART_ENTROPY_HTML = `        <h4>重要事項⑥ ～エンタルピーとエントロピーの調整～</h4>

        <div class="box box-review">
          <p><strong>コラム❺ ～氷の気分～</strong></p>
          <p><strong>はると</strong>：あーあ、暑くてジュースの氷が勝手に全部溶けてもうたわ…。</p>
          <p><strong>ひろき</strong>：それ、ギブスエネルギーが「溶けなさい！」って判決を下したからやな！</p>
          <p><strong>はると</strong>：え？だれ？ギブス？</p>
          <p><strong>ひろき</strong>：自然界にはな、反応が勝手に進むかどうかを決める「2つのモチベ」があるんよ。1つ目がこの前言ってた「<strong><u>エンタルピー（H）</u></strong>」な。物質は基本的に「熱を外にポイって捨てて、エネルギーが高い方から低い状態になりたい」ねん。</p>
          <p><strong>はると</strong>：あっつい熱湯よりも、冷たくて動かない「氷」になって落ち着きたい！（エンタルピーの理想状態）ってことか。</p>
          <p><strong>ひろき</strong>：そうそう！でも、2つ目の「<strong><u>エントロピー（S）</u></strong>」が黙ってないんよ。エントロピーってのは「<strong><u>乱雑さ（散らかりやすさ）</u></strong>」のこと。はるとの部屋って、放っておいたら勝手に散らかるやろ？</p>
          <p><strong>ひろき</strong>：それ、まさにエントロピーのせいなんよ！「綺麗に片付いた状態」って、本は本棚、服はクローゼットって決まった1パターンしかないやろ？でも「散らかった状態」は、ものがぐちゃぐちゃで無限のパターンがある。<strong><u class="wavy">自然界は「パターンが多い方」へ勝手に進んでしまうねん。</u></strong></p>
          <p><strong>はると</strong>：なるほど！カチカチに整列した氷（1パターン）より、自由に動き回れる水（無限パターン）の方が圧倒的に散らかってるから、水になって自由になりたい！ってなる（エントロピーの理想状態）んか！</p>
          <p><strong>ひろき</strong>：その通り！つまり「カチカチに落ち着いてラクしたい（エンタルピー）」と「バラバラに散らかって自由になりたい（エントロピー）」がケンカしてるんよ。この勝敗をジャッジするのが「<strong><u>ギブスエネルギー（G）</u></strong>」や。</p>
          <p><strong>ひろき</strong>：ギブス裁判官の判決は、「ΔG ＝ ΔH − TΔS」っていう数式で決まるんよ。</p>
          <p><strong>ひろき</strong>：ビビらんでええよ。ここで一番大事なのは「T（温度）」や！温度が高い（暑い）と、T の数字がデカくなるやろ？そうすると掛け算されてる後ろの「エントロピー（S）チーム」のパワーが爆増するねん！</p>
          <p><strong>はると</strong>：おっ！ってことは、夏の暑い日は T がデカいからエントロピーが勝って、整列したエネルギーの低い冷たい氷じゃなくて、散らかった「水」になるんか！このときギブスエネルギーは ΔG ＜ 0 やな！</p>
          <p><strong>ひろき</strong>：大正解！逆に冬の寒い日は T が小さいから、エントロピーのパワー（−TΔS）が弱まる。そうするとエンタルピーが勝って、お行儀のいい「氷」になるんよ。このとき（水→氷の逆向きに見れば、氷が溶ける反応の）ギブスエネルギーは ΔG ＞ 0 やな！</p>
          <p><strong>はると</strong>：すげー！「ΔG ＝ ΔH − TΔS」って、ただの暗記する式じゃなくて、「温度（T）が高いと、エントロピー（散らかりパワー）が掛け算で強くなる」って意味やったんやな！納得やわ！</p>
          <p><strong>ひろき</strong>：ちな ΔG ＝ 0 のときは ΔH と TΔS が同じぐらいやから平衡状態になって状態は変わらんよ！</p>
        </div>

        <div class="box box-point">
          <p><strong><u>エンタルピーとエントロピーの調整</u></strong></p>
          <p><strong>❶ エンタルピー ≒ 物質が持つエネルギー</strong></p>
          <p>
            <strong>性質</strong>　<strong><u class="wavy">「エネルギーが高い不安定な状態 ⇒ エネルギーが低い安定な状態」へ移動する</u></strong><br>
            例）時間を置くと熱い味噌汁じゃなくて、熱くない冷めた味噌汁になる
          </p>
          <p><strong>❷ エントロピー ≒ 物質の乱雑さ（散らかりやすさ）</strong>　… <strong><u>エントロピー増大の法則</u></strong></p>
          <p>
            <strong>性質</strong>　<strong><u class="wavy">「整列したきれいにととのっている状態 ⇒ 乱雑で散らかっている汚い状態」へ移動する</u></strong><br>
            例）部屋がきれいな状態から気づいたら部屋が汚い状態になる
          </p>
          <div class="formula">ΔG ＝ ΔH − TΔS　（ΔG ＜ 0 なら自発的に進む）</div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>エンタルピー（エネルギー）</th>
                <th>エントロピー（乱雑さ）</th>
                <th>反応の自発性（ギブスエネルギー）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>減少する（発熱）（ΔH ＜ 0）</td>
                <td>増加する（ΔS ＞ 0）</td>
                <td><strong>自発的に進む　ΔG ＜ 0</strong><br>例）紙が燃える ⇒「エネルギーを減らせる」と「燃えて気体へと散らかる」〇</td>
              </tr>
              <tr>
                <td>増加する（吸熱）（ΔH ＞ 0）</td>
                <td>減少する（ΔS ＜ 0）</td>
                <td><strong>自発的に進まない　ΔG ＞ 0</strong><br>例）灰と煙が勝手に元の紙に戻る ⇒「エネルギーが増える」と「不自由になる（まとまる）」×</td>
              </tr>
              <tr>
                <td>減少する（発熱）（ΔH ＜ 0）</td>
                <td>減少する（ΔS ＜ 0）</td>
                <td rowspan="2"><strong>温度で自発的に進む方向が決まる</strong><br>ΔG ＝ ΔH − TΔS<br>例）温度によって氷が溶けるか水が凍るかが変わる</td>
              </tr>
              <tr>
                <td>増加する（吸熱）（ΔH ＞ 0）</td>
                <td>増加する（ΔS ＞ 0）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="box box-memory">
          <p>
            <strong><u class="wavy">「発熱」＋「散らかる」なら温度に関係なく必ず進む。「吸熱」＋「まとまる」なら絶対に進まない。</u></strong><br>
            残りの2パターンは<strong>温度が決める</strong>ので、TΔS と ΔH のどちらが大きいかを比べる。
          </p>
        </div>

        <div class="box box-example">
          <p><strong>演習19 ★★</strong>　以下の2つの反応について、下の文章を読み、各問いに答えよ。［同志社大 改］</p>
          <p>
            反応(a)：銅を加熱して酸化銅(II) CuO が生成する反応（発熱反応）<br>
            反応(b)：CuO を約 1000 ℃以上の高温で強熱して酸化銅(I) Cu<sub>2</sub>O になる反応（吸熱反応）
          </p>
          <p><strong>問1</strong>　次の文章の空欄（ あ ）〜（ お ）に入る語句を、「高」または「低」のいずれかで答えよ。</p>
          <p>
            反応(a)は発熱反応であり、よりエネルギーが（ あ ）くなる方向に反応が進むと考えられる。一方、反応(b)は吸熱反応であるにも関わらず、なぜ反応が進むのだろうか。自然界には物質の構成粒子の乱雑さの度合いが（ い ）い状態から（ う ）い状態へ変化しようとする傾向があり、この傾向は高温で著しくなる。化学反応の進む方向は、このような「乱雑さの効果」と「エネルギーの効果」の兼ね合いで決まる。このことを考えれば、反応(b)では、乱雑さの度合いは（ え ）くなると考えられる。したがって、高温で乱雑さの効果がエネルギーの効果よりも大きくなり、反応が進む。一方、反応(a)は、乱雑さの度合いが（ お ）くなる反応であるが、エネルギーの効果の方が大きい反応であることがわかる。
          </p>
          <p><strong>問2</strong>　次の文章の空欄（ ① ）〜（ ⑩ ）に最も適する語句を、下の語群から選べ。同じ語句を繰り返し用いてよい。</p>
          <p>
            発熱反応は反応エンタルピー ΔH が（ ① ）、吸熱反応は ΔH が（ ② ）である。また、乱雑さの目安とする物理量にはエントロピー S があり、乱雑な状態ほど S は大きい。化学反応の進む方向は、ΔH と TΔS の兼ね合いで決まる。温度によって自発的に反応が進むかどうかが変わる反応とは、ΔH が正で ΔS が（ ③ ）、または、ΔH が負で ΔS が（ ④ ）のような反応といえる。
          </p>
          <div class="reaction">N<sub>2</sub>O<sub>4</sub>(気) → 2NO<sub>2</sub>(気)　（ΔH ＝ 57.2 kJ）</div>
          <p>
            この反応は ΔH が正、ΔS が（ ⑤ ）の反応である。ΔH の視点だけでは反応は進み（ ⑥ ）が、温度を高くするほど TΔS の効果が大きくなり、自発的に（ ⑦ ）へ反応が進むようになる。このとき、この反応は（ ⑧ ）熱反応である。温度に関わらず自発的に反応が常に進みやすい反応は、ΔH が（ ⑨ ）、ΔS が（ ⑩ ）である。
          </p>
          <p>【語群】　正、負、やすい、にくい、右、左、発、吸、結合</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>問1</strong>　（あ）低　（い）低　（う）高　（え）高　（お）低</p>
            <p>（あ）発熱反応は、熱を外に捨ててエネルギーが「<strong>低</strong>」い安定な状態になる。</p>
            <p>（い）（う）自然界は「部屋が勝手に散らかる」のと同じで、乱雑さが「<strong>低</strong>」い状態から「<strong>高</strong>」い状態へ向かおうとする（＝<strong><u>エントロピー増大の法則</u></strong>）。</p>
            <p>（え）反応(b)は吸熱反応、つまりエネルギーが上がるのに進むということは、「エネルギーが上がってもいいから自由（乱雑）になりたい」というエントロピーのパワーが大きい。よって乱雑さは「<strong>高</strong>」くなる。</p>
            <p>（お）反応(a)はその逆。発熱（ラクしたい）のパワーが強すぎて、「不自由になって乱雑さが「<strong>低</strong>」くなってもエネルギーを下げようとする」エンタルピー優勢の反応となる。</p>
            <p><strong>問2</strong>　① 負　② 正　③ 正　④ 負　⑤ 正　⑥ にくい　⑦ 右　⑧ 吸　⑨ 負　⑩ 正</p>
            <p>N<sub>2</sub>O<sub>4</sub> 1 分子から NO<sub>2</sub> が 2 分子できるので<strong>気体の分子数が増える</strong>＝乱雑さが増える（ΔS ＞ 0）。ΔH ＞ 0 なので低温では進みにくいが、高温になると TΔS が勝って右へ進む。</p>
            <p><strong><u class="wavy">「ΔH が負」かつ「ΔS が正」の反応が、温度に関係なくいつでも進む最強の組み合わせ。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項⑦ 化学反応と光
// ===================================================================
const PART_8_HTML = `        <h4>重要事項⑦ ～化学反応と光～</h4>

        <p>
          エネルギーは熱の形だけでなく、<strong><u>光</u></strong>の形でも出入りする。
          <strong><u class="wavy">光を吸収して反応が進む場合と、反応のエネルギーが光として出る場合の2方向がある。</u></strong>
        </p>

        <div class="box box-point">
          <p><strong><u>光合成</u></strong>…二酸化炭素 CO<sub>2</sub> と水 H<sub>2</sub>O から<strong>光エネルギーを用いて</strong>糖類を合成し、酸素 O<sub>2</sub> を発生させる反応</p>
          <div class="reaction">6CO<sub>2</sub>(気) ＋ 6H<sub>2</sub>O(液) → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>(固) ＋ 6O<sub>2</sub>(気)　ΔH ＝ +2807 kJ</div>
          <p style="text-align:center;font-size:0.9em;color:#555;">二酸化炭素　　水　　　糖類（グルコース）　　酸素</p>
          <p>
            <strong>性質</strong>　<strong><u class="wavy">エンタルピーは大きくなり、吸熱反応がおこる</u></strong>
            ←光エネルギーで糖類という栄養を作るため
          </p>
          <p>
            ※ 水が酸化されてできた酸素や電子の働きでグルコース C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> やデンプン、セルロースなどができる
          </p>
          <div class="reaction">2H<sub>2</sub>O(液) → O<sub>2</sub>(気) ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup></div>
          <p>
            ※ <strong><u>光電極</u></strong>…光エネルギーを吸収する電極<br>
            　 <strong><u>光触媒</u></strong>…光エネルギーを吸収して、ほかの物質の反応を引き起こす触媒　例）酸化チタン TiO<sub>2</sub>
          </p>
        </div>

        <div class="box box-point">
          <p><strong><u>化学発光</u></strong>…エンタルピーの一部が熱としてではなく<strong>光として放出</strong>され、発光する反応</p>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>化学発光の例</th><th>仕組み・用途</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong><u>ケミカルライト</u></strong></td>
                <td>
                  棒を折ると、2種類の液体が混ざり合って熱を出さずに光として、エンタルピー（エネルギー）を減少させる。<br>
                  <strong>用途</strong>　ライブなどのライトとして使われる
                </td>
              </tr>
              <tr>
                <td><strong><u>ルミノール反応</u></strong></td>
                <td>
                  血液中のヘモグロビンなどの力を借りて、過酸化水素を反応させることによって、熱を出さずに光として、エンタルピー（エネルギー）を減少させる。<br>
                  <strong>用途</strong>　科学捜査で血痕を調べるために使われる
                </td>
              </tr>
              <tr>
                <td><strong><u>生物発光</u></strong></td>
                <td>
                  生物体内で行われ、熱を出さずに光として、エンタルピー（エネルギー）を減少させる。<br>
                  <strong>用途</strong>　ホタルやウミホタルの発光<br>
                  ※ ホタルやウミホタルでは<strong><u>ルシフェリン</u></strong>という物質が、酵素である<strong><u>ルシフェラーゼ</u></strong>の作用で酸化され、<strong><u>オキシルシフェリン</u></strong>が生成する
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="box box-point">
          <p><strong><u>光化学反応</u></strong>…光の吸収によって反応が引き起こされたり、促進されたりする化学反応</p>
          <p>
            例）モノクロ写真用フィルム　感光性（光で変化をする性質）をもつ <strong>AgBr</strong>（臭化銀）が <strong>Ag</strong>（銀）に変化する
          </p>
          <p>
            ※ 他にも水素と塩素の混合気体のように、暗所ではほとんど反応しないが、<strong><u class="wavy">強い光を当てると塩化水素 HCl を爆発的に発生させる</u></strong>ような反応もある
          </p>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>名称</th><th>エネルギーの向き</th><th>内容と例</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong><u>光化学反応</u></strong></td>
                <td>光を吸収（光 → 化学）</td>
                <td>光のエネルギーを吸収して進む反応。例）ハロゲン化銀の分解（写真フィルム）、H<sub>2</sub> と Cl<sub>2</sub> の爆発的反応、オゾンの生成と分解</td>
              </tr>
              <tr>
                <td><strong><u>光合成</u></strong></td>
                <td>光を吸収（大きな吸熱）</td>
                <td>光のエネルギーを使って、エネルギーの低い CO<sub>2</sub> と H<sub>2</sub>O から、エネルギーの高いグルコースをつくる。6CO<sub>2</sub> + 6H<sub>2</sub>O → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub>　ΔH ＝ +2810 kJ</td>
              </tr>
              <tr>
                <td><strong><u>化学発光</u></strong></td>
                <td>光を放出（化学 → 光）</td>
                <td>反応で生じたエネルギーが光として放出される現象。例）ルミノール反応（血液の検出）、ケミカルライト、ホタルの生物発光</td>
              </tr>
              <tr>
                <td><strong><u>光触媒</u></strong></td>
                <td>光を吸収して働く</td>
                <td>光が当たると強い酸化力を示し、有機物を分解する物質。代表は<strong>酸化チタン(IV) TiO<sub>2</sub></strong>（セルフクリーニング建材、抗菌タイル、防汚ガラス）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="box box-note">
          <p><strong>光合成と燃焼・呼吸は逆向きの関係</strong></p>
          <p>
            光合成（ΔH ＝ +2810 kJ）は大きな吸熱で、その分のエネルギーを<strong>グルコースの中に貯める</strong>。
            逆に、グルコースの燃焼や呼吸（C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> → 6CO<sub>2</sub> + 6H<sub>2</sub>O）は
            <strong>ΔH ＝ −2810 kJ</strong> の発熱で、貯めたエネルギーを取り出している。
          </p>
          <p><strong><u class="wavy">逆向きの反応の ΔH は、符号を反転させただけの値になる。</u></strong>（ヘスの法則の当然の結果）</p>
        </div>

        <div class="box box-advanced">
          <p><strong>光のエネルギーと波長</strong></p>
          <p>光1個（光子）のもつエネルギーは<strong>波長が短いほど大きい</strong>。だから、紫外線は可視光より強く結合を切ることができ、光化学反応やオゾンの分解を引き起こす。</p>
          <p>酸化チタン(IV) が<strong>紫外線</strong>で働くのも同じ理由。可視光でも働く光触媒の開発が進められている。</p>
        </div>

        <div class="box box-example">
          <p><strong>例題16</strong>　次の現象は、光化学反応・化学発光・光触媒のどれにあたるか。</p>
          <p>（1） 外壁のタイルに当たった日光で、付着した汚れが分解された<br>
             （2） 事件現場に薬品を吹きかけると、血液のあった部分が青白く光った<br>
             （3） 臭化銀を塗った紙に光を当てると、銀が析出して黒くなった</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）<strong>光触媒</strong>…酸化チタン(IV) TiO<sub>2</sub> が紫外線を受けて強い酸化力を示し、有機物（汚れ）を分解した。</p>
            <p>（2）<strong>化学発光</strong>…ルミノール反応。反応のエネルギーが光として出ている。</p>
            <p>（3）<strong>光化学反応</strong>…光を吸収してハロゲン化銀が分解した（写真の原理）。</p>
            <p>見分け方は<strong><u class="wavy">「光が入ったのか、光が出たのか」を先に決めること。</u></strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習20 ★</strong>　次の文章を読んで後の問いに答えよ。</p>
          <p>
            化学発光では、反応物と生成物の化学エネルギーの差の一部が光として放出される。科学捜査における血痕の鑑識法である <u class="q">(ア)</u> 反応は化学発光の例である。<u class="q">(ア)</u> は、血液中の成分などを触媒として、塩基性溶液中で過酸化水素などによって酸化されると青く発光する。
          </p>
          <p>
            光のエネルギーを吸収した物質が光化学反応を起こすこともある。その応用例としては、モノクロ写真用フィルムや光触媒などがある。写真フィルム上の <u class="q">(イ)</u> は光を吸収して反応し、<u class="q">(ウ)</u> が析出して黒くなる。光触媒の <u class="q">(エ)</u> に光が当たると、その表面に付着した有機物などから電子を奪い、これらを酸化分解するので、その表面はいつも清潔に保たれる。また、水素と <u class="q">(オ)</u> の混合気体は、暗所ではほとんど反応しないが、強い光を当てると、爆発的に反応して <u class="q">(カ)</u> を発生する。
          </p>
          <p>
            （1）（ア）に当てはまる最も適当な語句を書け。(イ) 〜 (カ) に当てはまる最も適当な物質の化学式を、下の選択肢の中から選べ。
          </p>
          <p>
            選択肢：Ag、Ag<sub>2</sub>O、Ag<sub>2</sub>S、AgF、AgBr、TiO<sub>2</sub>、V<sub>2</sub>O<sub>5</sub>、MnO<sub>2</sub>、Fe<sub>3</sub>O<sub>4</sub>、O<sub>2</sub>、Cl<sub>2</sub>、I<sub>2</sub>、H<sub>2</sub>O、HCl、HI
          </p>
          <p>
            （2）光合成によってつくられる糖類としては、グルコース C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> がある。水と二酸化炭素から 1 mol のグルコースを生成するときのエンタルピー変化を付した反応式を答えよ。ただし、水、二酸化炭素、グルコースの生成エンタルピーはそれぞれ −286 kJ/mol、−394 kJ/mol、−1270 kJ/mol とする。
          </p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>（1）</strong>　(ア) <strong>ルミノール</strong>　(イ) <strong>AgBr</strong>　(ウ) <strong>Ag</strong>　(エ) <strong>TiO<sub>2</sub></strong>　(オ) <strong>Cl<sub>2</sub></strong>　(カ) <strong>HCl</strong></p>
            <p><strong>（2）</strong>　水と二酸化炭素からグルコースを生成するときのエンタルピー変化を考える。</p>
            <p><strong>❶ 問題で与えられた、必要となる全ての反応エンタルピーの化学反応式を立てる</strong></p>
            <div class="reaction">H<sub>2</sub>(気) ＋ 1/2 O<sub>2</sub>(気) → H<sub>2</sub>O(液)　ΔH ＝ −286 kJ/mol　…①</div>
            <div class="reaction">C(黒鉛) ＋ O<sub>2</sub>(気) → CO<sub>2</sub>(気)　ΔH ＝ −394 kJ/mol　…②</div>
            <div class="reaction">6C(黒鉛) ＋ 3O<sub>2</sub>(気) ＋ 6H<sub>2</sub>(気) → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>(固)　ΔH ＝ −1270 kJ/mol　…③</div>
            <p><strong>❷ 求めるべきエンタルピーを含む式を、エンタルピーが分かる他の式を組み合わせ相殺して立式する</strong><br>
               <strong>❸ 組み合わせて立式した手順で計算し、反応エンタルピーの値を出す</strong></p>
            <div class="reaction">6CO<sub>2</sub>(気) ＋ 6H<sub>2</sub>O(液) → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>(固) ＋ 6O<sub>2</sub>(気)　ΔH ＝ x (kJ)</div>
            <p>
              6CO<sub>2</sub>(気) → 6C(黒鉛) ＋ 6O<sub>2</sub>(気)　ΔH ＝ −394（②）×（−6）＝ +2364 kJ　…㋐<br>
              6H<sub>2</sub>O(液) → 6H<sub>2</sub>(気) ＋ 3O<sub>2</sub>(気)　ΔH ＝ −286（①）×（−6）＝ +1716 kJ　…㋑<br>
              6C(黒鉛) ＋ 3O<sub>2</sub>(気) ＋ 6H<sub>2</sub>(気) → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>(固)　ΔH ＝ −1270（③）＝ −1270 kJ　…㋒
            </p>
            <p>よって ㋐＋㋑＋㋒ より</p>
            <p class="formula">ΔH ＝ +2364 ＋ 1716 − 1270 ＝ <strong>+2810 kJ</strong></p>
            <div class="reaction">6CO<sub>2</sub>(気) ＋ 6H<sub>2</sub>O(液) → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>(固) ＋ 6O<sub>2</sub>(気)　<strong>ΔH ＝ +2810 kJ</strong></div>
            <p><strong><u class="wavy">生成エンタルピーの値から反応エンタルピーを出すときは、式をひっくり返したら符号も逆になることを忘れない。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 総まとめ
// ===================================================================
const SUMMARY_HTML = `        <h4>この単元の総まとめ</h4>

        <div class="box box-note">
          <p><strong>試験前に確認する7点</strong></p>
          <ol>
            <li>ΔH は必ず<strong>「生成物 − 反応物」</strong>。発熱が負、吸熱が正</li>
            <li>実験値からは <strong>Q ＝ mcΔt</strong> → 1 mol あたりに割る → 符号を付ける</li>
            <li>熱化学反応式は<strong>注目する物質の係数を 1</strong>、<strong>状態を明記</strong></li>
            <li>反応エンタルピーの名前は「<strong>1 mol の何が・どうなるとき</strong>」で判別</li>
            <li>ヘスの法則 → <strong>逆にしたら符号反転、n 倍したら ΔH も n 倍</strong></li>
            <li>生成エンタルピーの式は「<strong>生成物 − 反応物</strong>」、結合エネルギーの式は「<strong>反応物 − 生成物</strong>」で<strong>向きが逆</strong></li>
            <li>単体の生成エンタルピーは <strong>0</strong>。光は「入る（光化学・光合成・光触媒）／出る（化学発光）」で整理</li>
          </ol>
          <p><strong><u class="wavy">この7点を押さえたら、演習問題（演習1〜20）へ進んで手を動かそう。</u></strong></p>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>覚えておくと速い値</th><th>値</th></tr>
            </thead>
            <tbody>
              <tr><td>水の比熱</td><td>4.2 J/(g・K)</td></tr>
              <tr><td>強酸＋強塩基の中和エンタルピー</td><td>−56.5 kJ/mol</td></tr>
              <tr><td>H<sub>2</sub>O(液) の生成エンタルピー</td><td>−286 kJ/mol</td></tr>
              <tr><td>CO<sub>2</sub>(気) の生成エンタルピー（＝黒鉛の燃焼エンタルピー）</td><td>−394 kJ/mol</td></tr>
              <tr><td>CH<sub>4</sub>(気) の燃焼エンタルピー</td><td>−891 kJ/mol</td></tr>
              <tr><td>水の蒸発エンタルピー</td><td>+44 kJ/mol</td></tr>
              <tr><td>単体の生成エンタルピー</td><td>0 kJ/mol</td></tr>
            </tbody>
          </table>
        </div>
`;

/**
 * 熱化学の「重要事項」一覧。
 * LearningViewer がこの配列からボタン（チップ）を並べ、
 * 選ばれた重要事項だけを描画する。順番はプリントの並びそのまま。
 */
export const ADV_THERMO_PARTS: LearningPart[] = [
  { id: 'intro', no: '', title: 'この単元のゴール', short: 'ゴール・復習', html: HEAD_HTML },
  { id: 'p1', no: '①', title: '粒子の熱運動と物質の三態', short: '① 熱運動・三態', html: PART_MOTION_HTML },
  { id: 'p2', no: '②', title: '温度と熱', short: '② 温度と熱', html: PART_TEMP_HTML },
  { id: 'p2b', no: '②', title: '温度と熱（2）反応エンタルピーの測定（熱量の計算）', short: '②-2 熱量の計算', html: PART_2_HTML },
  { id: 'p3', no: '③', title: '反応熱とエンタルピー', short: '③ 反応熱とΔH', html: PART_1_HTML },
  { id: 'p4', no: '④', title: '様々なエンタルピー変化（1）熱化学反応式の書き方', short: '④-1 熱化学反応式', html: PART_3_HTML },
  { id: 'p4b', no: '④', title: '様々なエンタルピー変化（2）反応エンタルピーの種類', short: '④-2 種類・名称', html: PART_4_HTML },
  { id: 'p5', no: '⑤', title: 'エネルギー図とヘスの法則', short: '⑤ ヘスの法則', html: PART_5_HTML },
  { id: 'p5t', no: '', title: '定期テスト・入試に出やすいこと① エンタルピーの決定方法', short: '★ 出やすい① 決定方法', html: PART_DECIDE_HTML },
  { id: 'p5a', no: '⑤', title: '（補講）生成エンタルピーからの公式', short: '⑤補 生成エンタルピー', html: PART_6_HTML },
  { id: 'p5b', no: '⑤', title: '（補講）結合エネルギーからの公式', short: '⑤補 結合エネルギー', html: PART_7_HTML },
  { id: 'p6', no: '⑥', title: 'エンタルピーとエントロピーの調整', short: '⑥ エントロピー', html: PART_ENTROPY_HTML },
  { id: 'p7', no: '⑦', title: '化学反応と光', short: '⑦ 化学反応と光', html: PART_8_HTML },
  { id: 'summary', no: '', title: 'この単元の総まとめ', short: '★ 総まとめ', html: SUMMARY_HTML },
];

/**
 * 従来どおりの「全部つなげた 1 本」の本文。
 * 「すべて表示」を選んだときと、印刷（章まるごとの配布プリント）で使う。
 */
export const ADV_THERMO_HTML = ADV_THERMO_PARTS.map(p => p.html).join('\n');
