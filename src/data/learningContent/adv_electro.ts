/**
 * ===================================================================
 * まとめプリント：化学（発展）4章 電池と電気分解
 *   原典『化学の道しるべ 理論化学 ～化学反応と電気エネルギー編～』
 * ===================================================================
 *
 * ■ 位置づけ
 *   adv_thermo.ts（3章 化学反応とエネルギー）と完全に同じ構造・同じ記法で書く。
 *   LearningPart[] を並べて ADV_ELECTRO_PARTS とし、その html を連結したものが
 *   ADV_ELECTRO_HTML（「すべて」タブ＋印刷用）になる。
 *
 * ■ 記法のルール（化学基礎側・熱化学側と完全に共通。tests/learningPrint.test.ts が検査する）
 *   語句   … <strong><u>…</u></strong>             太字＋太い直線（黒）
 *   文章   … <strong><u class="wavy">…</u></strong> 太字＋太い波線（黒）
 *   下線部 … <u class="q">…</u>                     問題文の指示対象（強調ではない）
 *   ・裸の下線タグは使わない（必ず strong の直下に置く）
 *   ・インライン SVG の style は必ず .lcfig-adv-electro-N 配下に書く
 *     （SVG の style は文書全体に漏れるため、スコープ名は全ファイルで一意）
 *
 * ■ 原典の誤植は、化学的に正しい形に直して収録した
 *   ・燃料電池 全体式「2H2 + O2 → H2O」→ 2H2 + O2 → 2H2O
 *   ・鉛蓄電池 電池式「Pb | H2PO4 | PbO2」→ Pb | H2SO4 | PbO2
 *   ・ダニエル電池 負極電解液「硫酸亜鉛水溶液（CuSO4）」→ ZnSO4
 *   ・演習15(ⅱ) 解答「1.20 g」→ 1.20 kg
 *   ・演習9(3)(4) 「陰極／陰極」→ 陰極／陽極
 */

/** まとめプリント内の「重要事項」1 つ分 */
export type LearningPart = {
  id: string;      // タブ内で一意なID
  no: string;      // 見出しに出す丸数字
  title: string;   // 正式な見出し（印刷タイトルにも使う）
  short: string;   // ボタン（チップ）に出す短い名前
  html: string;    // その重要事項だけの本文HTML
};

// ===================================================================
// 導入：この単元のゴールと、先に思い出しておくこと
// ===================================================================
const HEAD_HTML = `        <h3 id="sec-adv-electro">4. 電池と電気分解</h3>

        <div class="box box-note">
          <p><strong>この単元のゴール</strong></p>
          <ul>
            <li>負極・正極（電池）と陰極・陽極（電気分解）を、混同せずに言い分けられる</li>
            <li>イオン化傾向から「どちらが溶けるか」「どちらに析出するか」を自分で決められる</li>
            <li>電池式（－）A | 電解液 | B（＋）を読み書きできる</li>
            <li>ボルタ・ダニエル・燃料電池・鉛蓄電池の3本セット（負極・正極・全体）を書ける</li>
            <li>ファラデーの法則で、電気量 Q・電子の物質量・質量・体積を相互に変換できる</li>
            <li>電気分解で「どのイオンが犠牲になるか」を電極と水溶液から判断できる</li>
            <li>イオン交換膜法・銅の電解精錬・アルミニウムの溶融塩電解を説明できる</li>
          </ul>
          <p><strong><u class="wavy">この単元は「電子がどちらへ動くか」の一点だけで、ほぼ全部の問題が決まる。</u></strong>暗記量は多く見えるが、電子の行き先を追う習慣がつけば一気に軽くなる。</p>
        </div>

        <div class="box box-review">
          <p><strong>先に思い出しておくこと（化学基礎の復習）</strong></p>
          <ul>
            <li>酸化＝電子を失う、還元＝電子を受け取る</li>
            <li>還元剤＝相手を還元する（自分は酸化される）＝電子を与える物質</li>
            <li>酸化剤＝相手を酸化する（自分は還元される）＝電子を受け取る物質</li>
            <li>物質量 n［mol］＝ 質量 w［g］ ÷ モル質量 M［g/mol］</li>
            <li>気体 1 mol の体積は 0 ℃・1013 hPa（標準状態）で 22.4 L</li>
            <li>pH ＝ −log<sub>10</sub>［H<sup>+</sup>］、水のイオン積 K<sub>w</sub> ＝ 1.0 × 10<sup>−14</sup>（mol/L）<sup>2</sup></li>
          </ul>
        </div>

        <div class="box box-note">
          <p><strong>難易度の目安（各演習についている★の意味）</strong></p>
          <ul>
            <li><strong>★</strong>　… 定期テストレベル。ここが完成すれば学校の試験は取れる</li>
            <li><strong>★★</strong>　… 重要問題集レベル。入試の標準問題がこの層</li>
            <li><strong>★★★</strong>　… 旧帝大レベル。差がつく問題</li>
          </ul>
          <p class="lc-src-note">出典：『化学の道しるべ 理論化学 ～化学反応と電気エネルギー編～』（Presented by Isowa Hiroki／学びの扉）</p>
        </div>

        <div class="box box-review">
          <p><strong>コラム❶　～電池とか電気分解とかビビらんでええで～</strong></p>
          <p><strong>はると</strong>：電池と電気分解って、名前からしてもう無理な気がするんやけど。</p>
          <p><strong>ひろき</strong>：そう思うやろ？でもな、どっちも中身は<strong>酸化還元反応</strong>だけなんよ。たとえば Zn ＋ 2HCl → ZnCl<sub>2</sub> ＋ H<sub>2</sub> って、ただの酸化還元反応やんな。亜鉛が電子を出して、水素イオンが電子を受け取る。</p>
          <p><strong>はると</strong>：うん、それは分かる。</p>
          <p><strong>ひろき</strong>：電池はな、この反応の<strong>「電子を出す場所」と「電子を受け取る場所」をわざと引き離して、その間に導線をつないだだけ</strong>なんよ。そしたら電子が導線を通らなあかんくなるやろ？導線を電子が流れる、それがつまり電流や。</p>
          <p><strong>はると</strong>：えっ、それだけ？わざと離すだけ？</p>
          <p><strong>ひろき</strong>：それだけ。だから電池の問題は「どっちが電子を出す側か」を決めるだけでほぼ終わる。で、電気分解はその真逆で、<strong>自然には起きない反応をコンセントの力で無理やり起こす</strong>やつな。</p>
          <p><strong><u class="wavy">電池＝自然に起きる酸化還元反応から電気を取り出す。電気分解＝電気を注ぎ込んで、起きない反応を無理に起こす。</u></strong></p>
        </div>
`;

// ===================================================================
// 重要事項① 酸化還元反応の復習
// ===================================================================
const PART_REDOX_HTML = `        <h4>重要事項① ～酸化還元反応の復習～</h4>

        <p>
          電池も電気分解も、中身はすべて酸化還元反応である。だから<strong><u class="wavy">酸化還元があいまいなまま電池に進むと、必ず途中で詰まる。</u></strong>ここで一度だけ、完全に整理しておく。
        </p>

        <div class="box box-point">
          <p><strong><u>酸化・還元の定義（3通りの言い方）</u></strong></p>
          <table>
            <thead>
              <tr><th>着目するもの</th><th>酸化された</th><th>還元された</th></tr>
            </thead>
            <tbody>
              <tr><td>酸素 O</td><td>受け取った</td><td>失った</td></tr>
              <tr><td>水素 H</td><td>失った</td><td>受け取った</td></tr>
              <tr><td>電子 e<sup>−</sup></td><td>失った</td><td>受け取った</td></tr>
            </tbody>
          </table>
          <p><strong><u class="wavy">酸素だけが逆で、水素と電子は同じ向き。</u></strong>「酸素の酸化・還元の逆が、水素と電子」と覚えるとよい。</p>
          <p>高校化学で最終的に使うのは<strong>電子の定義</strong>だけである。酸素・水素の定義は中学の名残と考えてよい。</p>
        </div>

        <div class="box box-point">
          <p><strong><u>酸化数</u></strong>…その原子が電子をどれだけ持ち出したか・持ち込んだかを表す数</p>
          <p><strong>Point❶　単体</strong></p>
          <ul>
            <li>単体の原子の酸化数は <strong>0</strong>（例：H<sub>2</sub> の H は 0、Cu の Cu は 0）</li>
            <li>単原子イオンの酸化数は<strong>その価数</strong>（例：Cu<sup>2+</sup> は ＋2、Cl<sup>−</sup> は −1）</li>
          </ul>
          <p><strong>Point❷　化合物</strong></p>
          <ul>
            <li>化合物中の酸化数の総和は <strong>0</strong></li>
            <li>多原子イオン中の酸化数の総和は<strong>そのイオンの価数</strong>（例：SO<sub>4</sub><sup>2−</sup> の総和は −2）</li>
            <li>水素 H は ＋1（例外：NaH などの金属水素化物では −1）</li>
            <li>酸素 O は −2（例外：H<sub>2</sub>O<sub>2</sub> では −1）</li>
            <li>フッ素 F は −1、アルカリ金属は ＋1、アルカリ土類金属は ＋2</li>
          </ul>
          <p><strong><u class="wavy">酸化数が増えた＝酸化された、減った＝還元された。</u></strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>酸化剤</u></strong>…相手を酸化する物質。自分は還元される（＝電子を受け取る）</p>
          <p><strong><u>還元剤</u></strong>…相手を還元する物質。自分は酸化される（＝電子を与える）</p>
          <p><strong><u class="wavy">「剤」がついたら自分は逆になる。</u></strong>ここを取り違えると全部ずれるので、必ず声に出して確認する。</p>
        </div>

        <h4>手順1　主な酸化剤・還元剤を覚える</h4>

        <div class="box box-test">
          <p><strong><u>主な酸化剤（自分が還元される＝電子を受け取る）</u></strong></p>
          <table>
            <thead>
              <tr><th>物質</th><th>変化後</th><th>特徴・色</th></tr>
            </thead>
            <tbody>
              <tr><td>O<sub>3</sub>（オゾン）</td><td>O<sub>2</sub></td><td>—</td></tr>
              <tr><td>Cl<sub>2</sub>（塩素）</td><td>Cl<sup>−</sup></td><td>—</td></tr>
              <tr><td>MnO<sub>4</sub><sup>−</sup>（酸性条件）</td><td>Mn<sup>2+</sup></td><td>淡桃色（ほぼ無色）になる</td></tr>
              <tr><td>MnO<sub>4</sub><sup>−</sup>（中性・塩基性）</td><td>MnO<sub>2</sub></td><td>黒褐色の沈殿</td></tr>
              <tr><td>Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup></td><td>Cr<sup>3+</sup></td><td>緑色になる</td></tr>
              <tr><td>希硝酸 HNO<sub>3</sub></td><td>NO</td><td>無色の気体</td></tr>
              <tr><td>濃硝酸 HNO<sub>3</sub></td><td>NO<sub>2</sub></td><td>赤褐色の気体</td></tr>
              <tr><td>熱濃硫酸 H<sub>2</sub>SO<sub>4</sub></td><td>SO<sub>2</sub></td><td>刺激臭の気体</td></tr>
            </tbody>
          </table>
        </div>

        <div class="box box-test">
          <p><strong><u>主な還元剤（自分が酸化される＝電子を与える）</u></strong></p>
          <table>
            <thead>
              <tr><th>物質</th><th>変化後</th><th>特徴・色</th></tr>
            </thead>
            <tbody>
              <tr><td>Na・Mg・Al などの金属</td><td>それぞれのイオン</td><td>イオン化傾向が大きい金属</td></tr>
              <tr><td>Fe<sup>2+</sup></td><td>Fe<sup>3+</sup></td><td>—</td></tr>
              <tr><td>Sn<sup>2+</sup></td><td>Sn<sup>4+</sup></td><td>—</td></tr>
              <tr><td>I<sup>−</sup></td><td>I<sub>2</sub></td><td>褐色になる</td></tr>
              <tr><td>（COOH）<sub>2</sub>（シュウ酸）</td><td>CO<sub>2</sub></td><td>—</td></tr>
              <tr><td>H<sub>2</sub>S</td><td>S</td><td>淡黄色の沈殿</td></tr>
            </tbody>
          </table>
        </div>

        <div class="box box-test">
          <p><strong><u>酸化剤にも還元剤にもなる 2 つ</u></strong></p>
          <ul>
            <li><strong>SO<sub>2</sub></strong>…基本は<strong>還元剤</strong>（→ SO<sub>4</sub><sup>2−</sup>）。<strong>相手が H<sub>2</sub>S のときだけ酸化剤</strong>（→ S）</li>
            <li><strong>H<sub>2</sub>O<sub>2</sub></strong>…基本は<strong>酸化剤</strong>（→ H<sub>2</sub>O）。<strong>相手が MnO<sub>4</sub><sup>−</sup> や Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup> のときだけ還元剤</strong>（→ O<sub>2</sub>）</li>
          </ul>
          <p>どちらが酸化剤になるかは<strong>「酸化剤としての強さの順」</strong>で決まる。強いほうが酸化剤、弱いほうが還元剤になる。</p>
          <div class="formula">MnO<sub>4</sub><sup>−</sup> ＞ Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup> ＞ H<sub>2</sub>O<sub>2</sub> ＞ SO<sub>2</sub> ＞ H<sub>2</sub>S</div>
          <p><strong><u class="wavy">語呂「マンションの2階から兄さん流される」（マンガン → 2クロム酸 → 過酸化水素 → 二酸化硫黄 → 硫化水素）。</u></strong></p>
        </div>

        <h4>手順2　半反応式の作り方</h4>

        <div class="box box-point">
          <p><strong><u>半反応式をつくる 6 ステップ</u></strong></p>
          <ol>
            <li>反応前と反応後の主役の物質を書く</li>
            <li>主役の原子の数を、係数で左右そろえる</li>
            <li>酸素 O の数を <strong>H<sub>2</sub>O</strong> で合わせる</li>
            <li>水素 H の数を <strong>H<sup>+</sup></strong> で合わせる</li>
            <li>電荷の合計を <strong>e<sup>−</sup></strong> で合わせる</li>
            <li>最後に左右の電荷が一致しているか検算する</li>
          </ol>
        </div>

        <div class="box box-example">
          <p><strong>例題</strong>　硫酸酸性の条件で、H<sub>2</sub>O<sub>2</sub> と KMnO<sub>4</sub> が反応するときのイオン反応式をつくる。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>相手が MnO<sub>4</sub><sup>−</sup> なので、H<sub>2</sub>O<sub>2</sub> は<strong>還元剤</strong>側にまわる。</p>
            <p>酸化剤側（MnO<sub>4</sub><sup>−</sup> は酸性条件なので Mn<sup>2+</sup> へ）</p>
            <p class="formula">MnO<sub>4</sub><sup>−</sup> ＋ 8H<sup>+</sup> ＋ 5e<sup>−</sup> → Mn<sup>2+</sup> ＋ 4H<sub>2</sub>O</p>
            <p>還元剤側（H<sub>2</sub>O<sub>2</sub> は O<sub>2</sub> へ）</p>
            <p class="formula">H<sub>2</sub>O<sub>2</sub> → O<sub>2</sub> ＋ 2H<sup>+</sup> ＋ 2e<sup>−</sup></p>
            <p>電子の数をそろえる（前者を 2 倍、後者を 5 倍）と、e<sup>−</sup> は 10 個で消える。</p>
            <p class="formula">6H<sup>+</sup> ＋ 2MnO<sub>4</sub><sup>−</sup> ＋ 5H<sub>2</sub>O<sub>2</sub> → 5O<sub>2</sub> ＋ 2Mn<sup>2+</sup> ＋ 8H<sub>2</sub>O</p>
            <p><strong><u class="wavy">電子の数をそろえて足し合わせる、が全パターン共通の最後の作業。</u></strong></p>
          </details>
        </div>

        <h4>手順3　化学反応式（分子の式）に直す</h4>

        <div class="box box-point">
          <p><strong><u>イオン反応式から化学反応式へ</u></strong></p>
          <ol>
            <li>省略していた<strong>対イオン</strong>（K<sup>+</sup>、SO<sub>4</sub><sup>2−</sup> など）を両辺に加える</li>
            <li>加えた対イオンを、実在する塩の形にまとめる</li>
          </ol>
          <p>先の例題では、K<sup>+</sup> と SO<sub>4</sub><sup>2−</sup> を補って次のようになる。</p>
          <div class="formula">3H<sub>2</sub>SO<sub>4</sub> ＋ 2KMnO<sub>4</sub> ＋ 5H<sub>2</sub>O<sub>2</sub> → 5O<sub>2</sub> ＋ 2MnSO<sub>4</sub> ＋ 8H<sub>2</sub>O ＋ K<sub>2</sub>SO<sub>4</sub></div>
        </div>

        <div class="box box-point">
          <p><strong><u>イオン化傾向</u></strong>…金属の単体が水溶液中で陽イオンになろうとする性質の強さ</p>
          <div class="formula">Li ＞ K ＞ Ca ＞ Na ＞ Mg ＞ Al ＞ Zn ＞ Fe ＞ Ni ＞ Sn ＞ Pb ＞（H<sub>2</sub>）＞ Cu ＞ Hg ＞ Ag ＞ Pt ＞ Au</div>
          <p><strong><u class="wavy">語呂「リッチに貸そかな！まああてにすな！ひどすぎ借金！」</u></strong></p>
          <p>リ（Li）ッチ に（K）／貸そ（Ca）か（Na）な（Mg）／ま（Al）あ（Zn）あ（Fe）て（Ni）に（Sn）す（Pb）な（H<sub>2</sub>）／ひ（Cu）ど（Hg）す（Ag）ぎ／借（Pt）金（Au）</p>
          <p><strong><u class="wavy">イオン化傾向が大きい金属ほど、電子を手放してイオンになりたがる＝還元剤として強い。</u></strong>この一文が、以降の電池・電気分解のすべての判断基準になる。</p>
        </div>
`;

// ===================================================================
// 重要事項② 電池（しくみ・電池式）
// ===================================================================
const PART_CELL_HTML = `        <h4>重要事項② ～電池～</h4>

        <div class="box box-review">
          <p><strong>コラム❷　～電池と電気分解、それぞれの世界観～</strong></p>
          <p><strong>ひろき</strong>：ここからは擬人化して覚えていくで。まず<strong>電池の世界</strong>な。これはな、<strong>お互いのエゴが噛み合った、生々しい恋愛劇</strong>や。</p>
          <p><strong>はると</strong>：恋愛劇？</p>
          <p><strong>ひろき</strong>：電子を「彼女」と思ってな。イオン化傾向が大きい金属は<strong>「独身が大好き」</strong>で、彼女（電子）を手放したくてしゃあない。逆にイオン化傾向が小さい金属イオンは<strong>「彼女が大好き」</strong>で、彼女（電子）を受け取りたくてしゃあない。</p>
          <p><strong>はると</strong>：あー、需要と供給が一致してるってことか。</p>
          <p><strong>ひろき</strong>：そう。<strong>だから電池は自然に反応が進む。</strong>誰も無理してない。一方で<strong>電気分解の世界</strong>はまったく違う。あれは<strong>「コンセント社長」</strong>が乱入してきて、彼女を無理やり押し付けたり奪い取ったりする<strong>理不尽なバトル</strong>や。</p>
          <p><strong>はると</strong>：社長こわいな…。</p>
          <p><strong>ひろき</strong>：せやから電気分解では「誰が一番の犠牲になるか」を決めるゲームになる。この違いだけ、頭に入れといて。</p>
        </div>

        <div class="box box-point">
          <p><strong><u>電池</u></strong>…酸化還元反応で放出されるエネルギーを、電気エネルギーとして取り出す装置</p>
          <p>電池をつくるには、<strong>イオン化傾向の異なる 2 種類の金属</strong>を<strong>電解質水溶液</strong>に浸して導線でつなぐ。</p>
        </div>

        <div class="box box-test">
          <p><strong><u>負極と正極の決め方（これだけで全電池が書ける）</u></strong></p>
          <p><strong>❶ 負極</strong>　イオン化傾向が<strong>大きい</strong>金属の<strong>単体</strong>（＝独身が大好き側）</p>
          <ul>
            <li>電子を放出する → <strong>酸化</strong>される → <strong>還元剤</strong>としてはたらく</li>
            <li>この物質を<strong><u>負極活物質</u></strong>という</li>
          </ul>
          <p><strong>❷ 正極</strong>　イオン化傾向が<strong>小さい</strong>金属の<strong>イオン</strong>（＝彼女が大好き側）</p>
          <ul>
            <li>電子を受け取る → <strong>還元</strong>される → <strong>酸化剤</strong>としてはたらく</li>
            <li>この物質を<strong><u>正極活物質</u></strong>という</li>
          </ul>
          <p><strong><u class="wavy">電子は負極から正極へ導線を流れ、電流は逆に正極から負極へ流れる。</u></strong>電流の向きだけ逆になることに注意する。</p>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-electro-1" viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-electro-1 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-electro-1 .bx {stroke:#555;stroke-width:1.8;fill:none}
    .learning-content .lcfig-adv-electro-1 .liq {fill:#dceefb;stroke:#7ba7c9;stroke-width:1.2}
    .learning-content .lcfig-adv-electro-1 .plM {fill:#9aa5b1;stroke:#4b5563;stroke-width:1.4}
    .learning-content .lcfig-adv-electro-1 .plP {fill:#d99058;stroke:#8a4b1f;stroke-width:1.4}
    .learning-content .lcfig-adv-electro-1 .wire {stroke:#333;stroke-width:2.2;fill:none}
    .learning-content .lcfig-adv-electro-1 .eArw {stroke:#c0392b;stroke-width:2.6;fill:none}
    .learning-content .lcfig-adv-electro-1 .iArw {stroke:#1d6fa5;stroke-width:2.2;fill:none;stroke-dasharray:6 4}
    .learning-content .lcfig-adv-electro-1 .lb {font:bold 12px sans-serif;fill:#222;text-anchor:middle}
    .learning-content .lcfig-adv-electro-1 .lbe {font:bold 12px sans-serif;fill:#c0392b;text-anchor:middle}
    .learning-content .lcfig-adv-electro-1 .lbi {font:bold 12px sans-serif;fill:#1d6fa5;text-anchor:middle}
    .learning-content .lcfig-adv-electro-1 .sm {font:11px sans-serif;fill:#444;text-anchor:middle}
  </style>

  <text class="ttl" x="360" y="24">電池の基本構造（電子は負極 → 正極、電流は正極 → 負極）</text>

  <rect class="liq" x="150" y="120" width="420" height="140" rx="6"/>
  <rect class="bx" x="150" y="120" width="420" height="140" rx="6"/>
  <text class="sm" x="360" y="250">電解質水溶液</text>

  <rect class="plM" x="215" y="90" width="26" height="140" rx="3"/>
  <rect class="plP" x="479" y="90" width="26" height="140" rx="3"/>

  <text class="lb" x="228" y="82">負極（−）</text>
  <text class="sm" x="228" y="278">イオン化傾向 大</text>
  <text class="lb" x="492" y="82">正極（＋）</text>
  <text class="sm" x="492" y="278">イオン化傾向 小</text>

  <path class="wire" d="M228,90 L228,56 L492,56 L492,90"/>
  <circle cx="360" cy="56" r="16" fill="#fff" stroke="#333" stroke-width="2"/>
  <text class="sm" x="360" y="60">A</text>

  <path class="eArw" d="M250,44 L340,44"/>
  <path class="eArw" d="M340,44 L332,40 M340,44 L332,48"/>
  <text class="lbe" x="290" y="34">電子 e⁻</text>

  <path class="iArw" d="M470,70 L392,70"/>
  <path class="iArw" d="M392,70 L400,66 M392,70 L400,74"/>
  <text class="lbi" x="432" y="88">電流</text>

  <text class="lbe" x="228" y="160">酸化される</text>
  <text class="lbe" x="228" y="178">＝還元剤</text>
  <text class="lbi" x="492" y="160">還元される</text>
  <text class="lbi" x="492" y="178">＝酸化剤</text>
</svg>
          <figcaption>電池の基本形。<strong>電子は必ず負極から正極へ流れ、電流はその逆向き</strong>。負極では酸化、正極では還元が起こる。</figcaption>
        </figure>

        <div class="box box-point">
          <p><strong><u>電池式（電池の構成を 1 行で表す書き方）</u></strong></p>
          <p><strong>パターン❶　両極に別々の電解液があるとき</strong></p>
          <div class="formula">（−）負極活物質 | 負極側の電解液 | 正極側の電解液 | 正極活物質（＋）</div>
          <p><strong>パターン❷　電解液が共通のとき</strong></p>
          <div class="formula">（−）負極活物質 | 電解液 | 正極活物質（＋）</div>
          <p><strong><u class="wavy">左が必ず負極（−）、右が必ず正極（＋）。</u></strong>この向きは絶対に入れ替えない。</p>
        </div>

        <div class="box box-example">
          <p><strong>演習1 ★</strong>　次の文中の（　）に適当な語句を記入せよ。</p>
          <p>2 種類の金属を（ ア ）の水溶液に浸して導線で結ぶと電池ができる。このとき、（ イ ）が大きい方の金属が（ ウ ）となり、電子を放出して（ エ ）される。電池の負極で（ オ ）される物質を負極（ カ ）、正極で（ キ ）される物質を正極（ カ ）という。電池では導線を通って負極から正極に（ ク ）が流れる。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（ア）<strong>電解質</strong>　… 水などの液体に溶かしたとき、イオンに分かれて電気を通すようになる物質。<br>
            対になる語は<strong>非電解質</strong>（水に溶けてもイオンに分かれず、電気を通さない物質）。</p>
            <p>（イ）<strong>イオン化傾向</strong>　（ウ）<strong>負極</strong>　（エ）<strong>酸化</strong></p>
            <p>（オ）<strong>酸化</strong>　（カ）<strong>活物質</strong>　（キ）<strong>還元</strong>　（ク）<strong>電子</strong></p>
            <p><strong><u class="wavy">負極では酸化、正極では還元。そしてその主役の物質を活物質と呼ぶ。</u></strong>（オ）と（キ）を逆にする間違いがいちばん多い。</p>
          </details>
        </div>
`;

// ===================================================================
// 定期テスト・入試に出やすいこと① ファラデーの法則
// ===================================================================
const PART_FARADAY_HTML = `        <h4>定期テスト・入試に出やすいこと① ～ファラデーの法則～</h4>

        <div class="box box-review">
          <p><strong>コラム❸　～ファラデーの考え～</strong></p>
          <p><strong>はると</strong>：なあ、教科書にファラデーの法則とか載ってるけど、これって何？</p>
          <p><strong>ひろき</strong>：それはね、<strong>電子が 1 mol 流れたときに、電気量 Q が 9.65 × 10<sup>4</sup> C（クーロン）流れる</strong>よって意味なんだ。これを<strong>ファラデー定数 F</strong> というよ。じゃあ電子が 2 mol 流れたら、電気量 Q はどうなる？</p>
          <p><strong>はると</strong>：1 mol で 9.65 × 10<sup>4</sup> C だから、2 mol では 1.93 × 10<sup>5</sup> C かな？</p>
          <p><strong>ひろき</strong>：正解！このように物質量を 2 倍にすると電気量も 2 倍になるから、<strong>電気量 Q は電子の物質量に比例する</strong>。これがファラデーの法則の定義なんだね。</p>
          <p><strong>はると</strong>：でもさ、電気量と電子の両方の値が分からんかったら、この法則って使えやんよね？</p>
          <p><strong>ひろき</strong>：その通り。だから問題では次の 2 パターンで攻めてくる。①化学反応式とファラデー定数から電子の物質量と Q を求める。②「電流 A × 時間 s ＝ 電気量 Q」とファラデー定数から求める。</p>
          <p><strong>はると</strong>：新しい公式が出てきたけど？</p>
          <p><strong>ひろき</strong>：これは公式というより当たり前のことでね。電流を長い時間流したら、そりゃ電気の量も増えるやろ？ってだけ。逆に電気量が分かってて、電流や時間を求める問題も出るよ。</p>
        </div>

        <div class="box box-point">
          <p><strong><u>電気量 Q</u></strong>…電流が一定の時間に流れたときの電気の量。単位はクーロン（C）</p>
          <p>電子 1 mol の電気量は <strong>−9.65 × 10<sup>4</sup> C/mol</strong>（電子の電荷は負）。<br>
          その絶対値を<strong><u>ファラデー定数 F</u></strong>といい、<strong>F ＝ 9.65 × 10<sup>4</sup> C/mol</strong> である。</p>
          <p><strong><u>ファラデーの法則</u></strong>…電気量 Q は流れた電子の物質量に比例する</p>
        </div>

        <div class="box box-test">
          <p><strong><u>公式（この 2 本だけ）</u></strong></p>
          <p><strong>❶ 電気量と電流・時間</strong></p>
          <div class="formula">電気量 Q［C］ ＝ 電流 I［A］ × 時間 t［s］</div>
          <p>時間が「分」なら × 60、「時」なら × 3600 して<strong>必ず秒に直す</strong>。</p>
          <p><strong>❷ 電気量と電子の物質量</strong></p>
          <div class="formula">電気量 Q［C］ ＝ 電子の物質量［mol］ × 9.65 × 10<sup>4</sup>［C/mol］</div>
          <p><strong><u class="wavy">この 2 本を「電子の物質量」で連結すれば、電流・時間・質量・体積のどれからでも行き来できる。</u></strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>問題を解く 2 つのパターン</u></strong></p>
          <ol>
            <li><strong>化学反応式とファラデー定数</strong>を使って、電子の物質量と電気量 Q を求める<br>
            （質量 g・体積 L が与えられたとき）</li>
            <li><strong>「電流 A × 時間 s ＝ 電気量 Q」とファラデー定数</strong>を使って、電子の物質量と電気量 Q を求める<br>
            （電流・時間・電気量が与えられたとき）</li>
          </ol>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-electro-2" viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-electro-2 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-electro-2 .nd {fill:#eaf4fc;stroke:#4a90c2;stroke-width:1.6}
    .learning-content .lcfig-adv-electro-2 .ndc {fill:#fff3e0;stroke:#d98324;stroke-width:1.8}
    .learning-content .lcfig-adv-electro-2 .tx {font:bold 12px sans-serif;fill:#1b3a4b;text-anchor:middle}
    .learning-content .lcfig-adv-electro-2 .tx2 {font:11px sans-serif;fill:#444;text-anchor:middle}
    .learning-content .lcfig-adv-electro-2 .ar {stroke:#c0392b;stroke-width:2.2;fill:none}
    .learning-content .lcfig-adv-electro-2 .arl {font:bold 11px sans-serif;fill:#c0392b;text-anchor:middle}
  </style>

  <text class="ttl" x="360" y="24">電子の物質量がすべての中継点になる</text>

  <rect class="nd" x="30" y="60" width="140" height="56" rx="8"/>
  <text class="tx" x="100" y="84">質量 w［g］</text>
  <text class="tx2" x="100" y="102">体積 V［L］</text>

  <rect class="nd" x="30" y="160" width="140" height="56" rx="8"/>
  <text class="tx" x="100" y="184">電流 I［A］</text>
  <text class="tx2" x="100" y="202">時間 t［s］</text>

  <rect class="nd" x="240" y="110" width="150" height="56" rx="8"/>
  <text class="tx" x="315" y="134">物質の物質量</text>
  <text class="tx2" x="315" y="152">［mol］</text>

  <rect class="ndc" x="450" y="110" width="150" height="56" rx="8"/>
  <text class="tx" x="525" y="134">電子の物質量</text>
  <text class="tx2" x="525" y="152">［mol］</text>

  <rect class="nd" x="240" y="196" width="150" height="46" rx="8"/>
  <text class="tx" x="315" y="224">電気量 Q［C］</text>

  <path class="ar" d="M170,88 L232,120"/>
  <path class="ar" d="M232,120 L224,114 M232,120 L226,122"/>
  <text class="arl" x="196" y="98">÷ M、÷ 22.4</text>

  <path class="ar" d="M390,138 L444,138"/>
  <path class="ar" d="M444,138 L436,134 M444,138 L436,142"/>
  <text class="arl" x="417" y="128">係数比</text>

  <path class="ar" d="M170,190 L234,212"/>
  <path class="ar" d="M234,212 L226,206 M234,212 L226,214"/>
  <text class="arl" x="198" y="212">Q ＝ I × t</text>

  <path class="ar" d="M390,214 L520,172"/>
  <path class="ar" d="M520,172 L512,174 M520,172 L514,180"/>
  <text class="arl" x="466" y="206">÷ 9.65 × 10⁴</text>
</svg>
          <figcaption><strong>電子の物質量（オレンジの箱）を必ず経由する</strong>のが、この単元の計算のすべて。どの条件から出発しても、いったんここへ集める。</figcaption>
        </figure>

        <div class="box box-example">
          <p><strong>演習2 ★</strong>　次の 2 つの反応式をもとに、有効数字 3 桁で以下の問いに答えよ。アボガドロ定数は 6.0 × 10<sup>23</sup> /mol、ファラデー定数は 9.65 × 10<sup>4</sup> C/mol とする。</p>
          <p class="formula">反応式❶　2H<sub>2</sub>O → O<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup>　／　反応式❷　Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu</p>
          <p>（1）1.00 A の電流を 32 分 10 秒間流した。このときの電気量は何 C か。<br>
          （2）電子が 2 mol あったとき、何 C の電気量が発生するか。<br>
          （3）電気量が 1.93 × 10<sup>5</sup> C 発生したとき、何 mol の電子が流れたか。<br>
          （4）反応式❶で、酸素が 0.112 L（標準状態）のとき、何 C の電気量が発生するか。<br>
          （5）反応式❷で、電気量が 1.93 × 10<sup>4</sup> C 発生したとき、銅は何 g 生成するか。Cu ＝ 63.5<br>
          （6）反応式❶で、電流 2.00 A を流したとき、水が 0.36 g 反応した。電流を流した時間は何分何秒か。<br>
          （7）反応式❷で、電流 1.00 A を 32 分 10 秒間流したとき、銅の質量は 0.64 g であった。この反応でのファラデー定数と、電子 1 個あたりの電気量を求めよ。Cu ＝ 64</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）まず秒に直す。32 分 10 秒 ＝ 60 × 32 ＋ 10 ＝ 1930 s。よって</p>
            <p class="formula">Q ＝ 1.00 A × 1930 s ＝ <strong>1.93 × 10<sup>3</sup> C</strong></p>
            <p>（2）ファラデー定数は「電子 1 mol あたり 9.65 × 10<sup>4</sup> C」の意味なので</p>
            <p class="formula">2 mol × 9.65 × 10<sup>4</sup> C/mol ＝ <strong>1.93 × 10<sup>5</sup> C</strong></p>
            <p>（3）逆算する。</p>
            <p class="formula">1.93 × 10<sup>5</sup> C ÷ 9.65 × 10<sup>4</sup> C/mol ＝ <strong>2.00 mol</strong></p>
            <p>（4）標準状態の気体は 1 mol で 22.4 L なので、O<sub>2</sub> は</p>
            <p class="formula">0.112 L ÷ 22.4 L/mol ＝ 5.0 × 10<sup>−3</sup> mol</p>
            <p>反応式❶の係数より、電子は O<sub>2</sub> の 4 倍。</p>
            <p class="formula">5.0 × 10<sup>−3</sup> mol × 4 ＝ 2.0 × 10<sup>−2</sup> mol<br>
            2.0 × 10<sup>−2</sup> mol × 9.65 × 10<sup>4</sup> C/mol ＝ <strong>1.93 × 10<sup>3</sup> C</strong></p>
            <p>（5）電気量から電子の物質量へ。</p>
            <p class="formula">1.93 × 10<sup>4</sup> C ÷ 9.65 × 10<sup>4</sup> C/mol ＝ 0.200 mol</p>
            <p>反応式❷より Cu は電子の 1/2。</p>
            <p class="formula">0.200 mol ÷ 2 ＝ 0.100 mol<br>
            0.100 mol × 63.5 g/mol ＝ <strong>6.35 g</strong></p>
            <p>（6）水 0.36 g は 0.36 ÷ 18 ＝ 0.020 mol。反応式❶より電子は水の 2 倍。</p>
            <p class="formula">0.020 mol × 2 ＝ 0.040 mol<br>
            0.040 mol × 9.65 × 10<sup>4</sup> C/mol ＝ 3.86 × 10<sup>3</sup> C<br>
            3860 C ÷ 2.00 A ＝ 1930 s ＝ <strong>32 分 10 秒</strong></p>
            <p>（7）Cu 0.64 g は 0.010 mol。反応式❷より電子は 0.020 mol。時間は 1930 s なので</p>
            <p class="formula">0.020 mol × F ＝ 1.00 A × 1930 s<br>
            F ＝ <strong>9.65 × 10<sup>4</sup> C/mol</strong></p>
            <p>電子 1 個あたりの電気量は、アボガドロ定数で割る。</p>
            <p class="formula">9.65 × 10<sup>4</sup> ÷ 6.0 × 10<sup>23</sup> ≒ 1.61 × 10<sup>−19</sup> C</p>
            <p>電子の電荷は負なので <strong>−1.61 × 10<sup>−19</sup> C</strong>。</p>
            <p><strong><u class="wavy">時間の単位変換と、係数比のかけ算・割り算の向きだけで差がつく。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項②-2 ボルタ電池とダニエル電池（実在の電池を 1 つずつ）
// ===================================================================
const PART_VOLTA_HTML = `        <h4>重要事項②-2 ～ボルタ電池とダニエル電池～</h4>

        <div class="box box-note">
          <p>ここから実在の電池を 1 つずつ見ていく。どの電池も見るところは<strong>いつも同じ 4 つ</strong>。</p>
          <ol>
            <li><strong>負極活物質</strong>は何か（＝どの物質が電子を放出するか）</li>
            <li><strong>正極活物質</strong>は何か（＝どの物質が電子を受け取るか）</li>
            <li><strong>電解液</strong>は何か</li>
            <li><strong>負極・正極・全体</strong>の 3 本の反応式</li>
          </ol>
          <p><strong><u class="wavy">この 4 点セットを電池ごとに埋めていけば、暗記ではなく作業になる。</u></strong></p>
        </div>

        <div class="box box-memory">
          <p><strong>イオン化傾向（この語呂は絶対に手放さない）</strong></p>
          <p class="formula">リッチに Li　貸そ K　か Ca　な Na　ま Mg　あ Al　あ Zn　て Fe　に Ni　す Sn　な Pb　（H<sub>2</sub>）　ど Cu　す Hg　ぎ Ag　借 Pt　金 Au</p>
          <p><strong>左が「独身が大好き（イオンでいたい）」、右が「彼女が大好き（電子を受け取りたい）」。</strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>① ボルタ電池</u></strong></p>
          <p>負極活物質 <strong>Zn</strong>（亜鉛板）　／　正極活物質 <strong>Cu</strong>（銅板）　／　電解液 <strong>希硫酸 H<sub>2</sub>SO<sub>4</sub></strong></p>
          <div class="formula">（−）　Zn　|　H<sub>2</sub>SO<sub>4</sub>　|　Cu　（＋）</div>
          <p><strong>負極（−）</strong>　イオン化傾向が大きい金属の単体 → 酸化 ＝ 還元剤</p>
          <div class="formula">Zn → Zn<sup>2+</sup> ＋ 2e<sup>−</sup></div>
          <p><strong>正極（＋）</strong>　イオン化傾向が小さいイオン → 還元 ＝ 酸化剤</p>
          <div class="formula">2H<sup>+</sup> ＋ 2e<sup>−</sup> → H<sub>2</sub></div>
          <p><strong>全体</strong>（電子が消えるように足し合わせる）</p>
          <div class="formula">Zn ＋ 2H<sup>+</sup> → Zn<sup>2+</sup> ＋ H<sub>2</sub></div>
        </div>

        <div class="box box-review">
          <p><strong>Q1　なぜ正極で「銅」ではなく「水素イオン」が電子を受け取るの？</strong></p>
          <p>正極には<strong>銅板（Cu の単体）はあるが、Cu<sup>2+</sup> がいない</strong>。電子（彼女）を受け取れるのは<strong>イオン</strong>だけなので、Cu<sup>2+</sup> が無ければ次にイオン化傾向が小さい<strong>電解液中の H<sup>+</sup></strong>が受け取って H<sub>2</sub> になる。</p>
          <p><strong>Q2　なぜボルタ電池は電圧がすぐ下がるの？</strong></p>
          <p>正極で発生した <strong>H<sub>2</sub> が銅板の表面をおおって電子の流れを妨げる</strong>ため。これを<strong><u>分極</u></strong>という。<strong><u>消極剤</u></strong>（MnO<sub>2</sub> など）を加えて H<sub>2</sub> をもう一度酸化すれば分極を防げる。</p>
          <p><strong>Q3　亜鉛板をもっとイオン化傾向の大きい金属に変えたら？</strong></p>
          <p>2 つの物質のイオン化傾向の差が大きくなり、「手放したい」「受け取りたい」の思いがどちらも強くなるので<strong>起電力が大きくなる</strong>。差が小さくなれば起電力は小さくなる。</p>
        </div>

        <div class="box box-point">
          <p><strong><u>起電力</u></strong>…電池の両極間の電圧（電位差）の最大値。≒ 電池のパワー</p>
          <p><strong><u class="wavy">2 つの極板の金属のイオン化傾向の差が大きいほど、起電力は大きくなる。</u></strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>② ダニエル電池</u></strong></p>
          <p>負極活物質 <strong>Zn</strong>（亜鉛板）／負極側の電解液 <strong>硫酸亜鉛水溶液 ZnSO<sub>4</sub></strong></p>
          <p>正極活物質 <strong>Cu</strong>（銅板）／正極側の電解液 <strong>硫酸銅(Ⅱ)水溶液 CuSO<sub>4</sub></strong></p>
          <div class="formula">（−）　Zn　|　ZnSO<sub>4</sub>　|　CuSO<sub>4</sub>　|　Cu　（＋）</div>
          <p><strong>負極（−）</strong></p>
          <div class="formula">Zn → Zn<sup>2+</sup> ＋ 2e<sup>−</sup></div>
          <p><strong>正極（＋）</strong></p>
          <div class="formula">Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu</div>
          <p><strong>全体</strong></p>
          <div class="formula">Zn ＋ Cu<sup>2+</sup> → Zn<sup>2+</sup> ＋ Cu</div>
        </div>

        <div class="box box-test">
          <p><strong><u>ボルタ電池とダニエル電池のちがい（記述で頻出）</u></strong></p>
          <table>
            <thead>
              <tr><th>　</th><th>ボルタ電池</th><th>ダニエル電池</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>正極側の電解液</td>
                <td>H<sub>2</sub>SO<sub>4</sub>（Cu<sup>2+</sup> がいない）</td>
                <td>CuSO<sub>4</sub>（Cu<sup>2+</sup> がいる）</td>
              </tr>
              <tr>
                <td>正極で電子を受け取るもの</td>
                <td>H<sup>+</sup> → H<sub>2</sub> が発生</td>
                <td>Cu<sup>2+</sup> → Cu が析出</td>
              </tr>
              <tr>
                <td>起こる問題</td>
                <td>H<sub>2</sub> が銅板をおおい電子の流れを妨げる（分極）</td>
                <td>析出した Cu は銅板の一部になるので邪魔をしない</td>
              </tr>
              <tr>
                <td>起電力</td>
                <td>約 0.76 V（すぐ低下する）</td>
                <td>約 1.10 V（安定して長持ちする）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="box box-test">
          <p><strong><u>ダニエル電池の起電力を高める 2 つの方法</u></strong></p>
          <p><strong>❶ 極板の金属の種類を変える</strong>（イオン化傾向の差を大きくする）</p>
          <p><strong>❷ 水溶液の濃度を変える</strong></p>
          <ul>
            <li>負極では Zn → Zn<sup>2+</sup> ＋ 2e<sup>−</sup> で <strong>Zn<sup>2+</sup> が増えていく</strong>。最初から濃いと Zn<sup>2+</sup> が過剰になって反応が止まる。<br>
            → <strong><u>硫酸亜鉛水溶液の濃度は小さい（うすい）方がよい</u></strong></li>
            <li>正極では Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu で <strong>Cu<sup>2+</sup> が減っていく</strong>。無くなると反応が止まる。<br>
            → <strong><u>硫酸銅(Ⅱ)水溶液の濃度は大きい（濃い）方がよい</u></strong></li>
          </ul>
          <p><strong><u class="wavy">「減る側は濃く、増える側はうすく」。反応で消える物質を切らさないのが長持ちのコツ。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>コラム❹　～素焼き板って結局何のため？～</strong></p>
          <p><strong>はると</strong>：素焼き板の役割が毎回テストでわからなくなるんよな。</p>
          <p><strong>ひろき</strong>：コツは<strong>「2 つの仕事」をセットで覚える</strong>ことや。①2 液を混ぜない、②イオンは通す。この二つが揃わんと電池は成立せえへん。</p>
          <p><strong>はると</strong>：もし素焼き板がなかったらどうなるんですか？</p>
          <p><strong>ひろき</strong>：Zn と Cu<sup>2+</sup> が直接出会って、<strong>導線を通らずにいきなり反応してまう</strong>。それやと熱は出るけど電気は取り出せへん。「電子に長距離を歩かせる」のが電池の命やから、これは死活問題なんや。</p>
          <p><strong>はると</strong>：なるほど！「電子を遠回りさせる仕掛け」が電池の本質なんですね。</p>
          <p><strong>ひろき</strong>：ええこと言うやん。それで完璧や。</p>
        </div>

        <div class="box box-test">
          <p><strong><u>素焼き板（塩橋・セパレーター）のはたらき</u></strong></p>
          <p>❶ 2 種類の水溶液が<strong>完全に混ざり合わないようにする</strong></p>
          <p>❷ <strong>イオンは通す</strong>ことで、水溶液の<strong>電気的中性を保つ</strong></p>
          <ul>
            <li>負極側は Zn<sup>2+</sup> が増えて<strong>陽イオンが過剰</strong>、正極側は Cu<sup>2+</sup> が減って<strong>陰イオンが過剰</strong>になる</li>
            <li>そのままでは電気的中性が崩れて反応が止まる</li>
            <li>素焼き板を通って <strong>SO<sub>4</sub><sup>2−</sup> が負極側へ、Zn<sup>2+</sup> が正極側へ</strong>移動し、中性が保たれる</li>
          </ul>
        </div>

        <div class="box box-point">
          <p><strong><u>濃淡電池</u></strong>…<strong>同じ種類の電極・同じ物質</strong>を使い、<strong>イオン濃度の差</strong>によって起電力を発生させる電池</p>
          <p>濃い側では「析出しやすい」＝正極、うすい側では「溶けやすい」＝負極になる。</p>
        </div>

        <div class="box box-example">
          <p><strong>演習3 ★</strong>　素焼き板で仕切った容器に硫酸亜鉛水溶液と硫酸銅(Ⅱ)水溶液を入れ、亜鉛板と銅板をそれぞれの水溶液に浸して電池とした。〔20 大分大 改〕</p>
          <p>（1）電流は導線中をどのように流れるか。「亜鉛板」「銅板」を用いて説明せよ。<br>
          （2）負極と正極で起こる反応を、電子 e<sup>−</sup> を用いた反応式で示せ。<br>
          （3）この電池（ダニエル電池）の起電力は 1.10 V であった。銅電極と銀電極で電池をつくると起電力は 0.46 V であった。亜鉛電極と銀電極で電池をつくった場合の負極はどちらか。また、起電力を求めよ。<br>
          （4）ボルタ電池はダニエル電池と同じ電極の組合せでつくられる電池である。ボルタ電池の負極と正極で起こる反応を、電子 e<sup>−</sup> を用いた反応式で示せ。<br>
          （5）次の文章の［ ア ］〜［ ク ］に最も適する語句・記号を記せ。</p>
          <p>　イオン化傾向の異なる 2 種の金属を、それぞれの金属イオンを含む電解質水溶液に浸すと電池ができる。金属 A の電極が負極になるのは、金属 A が B よりもイオン化傾向が［ ア ］ためである。また、電池の起電力は金属の種類だけでなく、生成したイオンの濃度によっても変わる。金属 A は A<sup>2+</sup> の濃度が［ イ ］ほど溶けやすく、金属 B は B<sup>2+</sup> の濃度が［ ウ ］ほど析出しやすく、このような条件では起電力がやや［ エ ］なる。一般に、電極金属のイオン化傾向の差が大きいほど、電池の起電力は［ オ ］なる。同じ金属電極からなる電池の場合も上述の考えから、途中に電圧計を入れると、電流は外部導線を［ カ ］の電極から［ キ ］の電極へと流れる。このような電池を［ ク ］という。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）イオン化傾向は <strong>Zn ＞ Cu</strong> なので、亜鉛板が溶けて<strong>負極</strong>になり電子を放出する。電子は導線を通って<strong>亜鉛板から銅板へ</strong>移動する。</p>
            <p class="formula">負極：Zn → Zn<sup>2+</sup> ＋ 2e<sup>−</sup>　⇒（電子が移動）⇒　正極：Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu</p>
            <p>電流の向きは電子の移動と逆なので、<strong>銅板から導線を通って亜鉛板へ流れる</strong>。</p>
            <p>（2）負極：Zn → Zn<sup>2+</sup> ＋ 2e<sup>−</sup>　　正極：Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu</p>
            <p>（3）3 つの金属のイオン化傾向は <strong>Zn ＞ Cu ＞ Ag</strong>。したがって Zn と Ag の電池では<strong>負極は亜鉛電極</strong>。起電力は電位差の足し算で求められる。</p>
            <p class="formula">1.10 V ＋ 0.46 V ＝ <strong>1.56 V</strong></p>
            <p>（4）負極：Zn → Zn<sup>2+</sup> ＋ 2e<sup>−</sup>　　正極：2H<sup>+</sup> ＋ 2e<sup>−</sup> → H<sub>2</sub></p>
            <p>（5）ア <strong>大きい</strong>　イ <strong>小さい（低い）</strong>　ウ <strong>大きい（高い）</strong>　エ <strong>大きく（高く）</strong>　オ <strong>大きく（高く）</strong>　カ <strong>正</strong>　キ <strong>負</strong>　ク <strong>濃淡電池</strong></p>
            <p><strong><u class="wavy">（3）のように「起電力は足し算できる」のは、どの電池の電圧も同じ基準（標準水素電極）からの差で決まっているから。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項②-3 燃料電池（演習4・演習5）
// ===================================================================
const PART_FUELCELL_HTML = `        <h4>重要事項②-3 ～燃料電池～</h4>

        <div class="box box-point">
          <p><strong><u>燃料電池</u></strong>…水素などの<strong>燃料を外部から供給し続け</strong>、その燃焼反応（酸化還元反応）から直接電気エネルギーを取り出す電池</p>
          <p>負極活物質は <strong>H<sub>2</sub></strong>（水素）、正極活物質は <strong>O<sub>2</sub></strong>（酸素）。電解液の種類で 2 タイプに分かれる。</p>
          <table>
            <thead>
              <tr><th>種類</th><th>電解液</th><th>電池式</th></tr>
            </thead>
            <tbody>
              <tr><td>❶ リン酸形</td><td>リン酸 H<sub>3</sub>PO<sub>4</sub>（酸性）</td><td>（−）H<sub>2</sub> | H<sub>3</sub>PO<sub>4</sub> | O<sub>2</sub>（＋）</td></tr>
              <tr><td>❷ 固体高分子形（アルカリ形）</td><td>水酸化カリウム KOH（塩基性）</td><td>（−）H<sub>2</sub> | KOH | O<sub>2</sub>（＋）</td></tr>
            </tbody>
          </table>
        </div>

        <div class="box box-test">
          <p><strong><u>燃料電池の反応式（酸性形をまず書き、そこから塩基性形をつくる）</u></strong></p>
          <p><strong>❶ リン酸形（酸性）</strong></p>
          <p class="formula">負極：H<sub>2</sub> → 2H<sup>+</sup> ＋ 2e<sup>−</sup><br>
          正極：O<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup> → 2H<sub>2</sub>O</p>
          <p><strong>❷ 固体高分子形（塩基性）</strong>…酸性形の<strong>両辺に OH<sup>−</sup> を足して H<sup>+</sup> を消す</strong></p>
          <p class="formula">負極：H<sub>2</sub> ＋ 2OH<sup>−</sup> → 2H<sub>2</sub>O ＋ 2e<sup>−</sup><br>
          正極：O<sub>2</sub> ＋ 2H<sub>2</sub>O ＋ 4e<sup>−</sup> → 4OH<sup>−</sup></p>
          <p><strong>全体（どちらの形でも同じ）</strong></p>
          <p class="formula">2H<sub>2</sub> ＋ O<sub>2</sub> → 2H<sub>2</sub>O</p>
          <p><strong><u class="wavy">塩基性の式は暗記しない。酸性の式を書いてから、両辺に OH<sup>−</sup> を足して H<sup>+</sup> ＋ OH<sup>−</sup> → H<sub>2</sub>O にするだけでつくれる。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>Q　なぜ負極が水素で、正極が酸素なの？</strong></p>
          <p>燃料電池は<strong>水ができる電池</strong>である。水 H<sub>2</sub>O の中では、<strong>電気陰性度が大きい酸素側に共有電子対が引き寄せられる</strong>（F ＞ O ＞ N ≒ Cl ＞ C ＞ S ＞ H ＞ 金属）。つまり酸素は電子をほしがる側＝<strong>還元される正極</strong>、水素は電子を手放す側＝<strong>酸化される負極</strong>になる。</p>
          <p><strong><u class="wavy">「電気陰性度が大きい方が電子をもらう（正極）」と考えれば、金属が出てこない電池でも極を決められる。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>Q　なぜ燃料電池は、活物質を供給し続けるといくらでも電気を取り出せるの？</strong></p>
          <p>ふつうの電池は<strong>内部に閉じ込めた活物質を使い切ると反応が終わる</strong>。燃料電池は外部のタンクから H<sub>2</sub> を、空気から O<sub>2</sub> を連続して送り込むので、<strong>供給が続く限り反応が止まらない</strong>。さらに生成物の H<sub>2</sub>O は気体や液体として系外へ排出されるので、<strong>内部に溜まって反応を妨げることもない</strong>。</p>
          <p><strong><u>コージェネレーションシステム</u></strong>…発電時の排熱も給湯・暖房に利用して、エネルギーを無駄なく使う仕組み</p>
        </div>

        <div class="box box-example">
          <p><strong>演習4 ★</strong>　白金触媒を含む多孔質の炭素電極と、電解液にリン酸水溶液を用いた水素-酸素燃料電池がある。A 極には水素 H<sub>2</sub>、B 極には酸素 O<sub>2</sub> を一定の割合で供給する。電極 A と B を外部導線でつなぐと、A 極では水素が酸化されて水素イオンになる（式2）。A 極で生じた水素イオンは電解液中を移動し、B 極では酸素が水素イオンと反応して水になる（式3）。<u class="q">式2 と式3 をまとめると、燃料電池全体の化学反応式が得られる。</u></p>
          <p>（1）式2 と式3 を、電子 e<sup>−</sup> を含むイオン反応式でそれぞれ記せ。<br>
          （2）この燃料電池において、負極は A 極と B 極のどちらか。<br>
          （3）下線部に関して、この燃料電池全体の化学反応式を記せ。<br>
          （4）化学的にみると、燃料電池は一次電池や二次電池とは異なる特色をもつ。そのうち、電池の活物質の供給方法についての相違点を説明せよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）電解液がリン酸（酸性）なので、H<sup>+</sup> を使う酸性形の式を書く。</p>
            <p class="formula">式2（A 極）：H<sub>2</sub> → 2H<sup>+</sup> ＋ 2e<sup>−</sup><br>
            式3（B 極）：O<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup> → 2H<sub>2</sub>O</p>
            <p>（2）電子を放出して<strong>酸化される側が負極</strong>。式2 で酸化されているのは A 極なので <strong>A 極</strong>。</p>
            <p>（3）式2 を 2 倍して式3 と足し、電子を消す。</p>
            <p class="formula">2H<sub>2</sub> ＋ O<sub>2</sub> → 2H<sub>2</sub>O</p>
            <p>（4）<strong>燃料（還元剤）と酸素（酸化剤）などの活物質を外部から供給し続ける限り、いくらでも電気エネルギーが得られる</strong>。一次電池・二次電池は内部に活物質を封入しているため、使い切れば放電が終わる（二次電池は充電で戻す）。</p>
            <p><strong><u class="wavy">電解液が酸性なら H<sup>+</sup>、塩基性なら OH<sup>−</sup> を使う。この対応だけで式は決まる。</u></strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習5 ★★★</strong>　水素を完全燃焼したときの熱化学反応式は次の (A) 式で表される。</p>
          <p class="formula">H<sub>2</sub>（気）＋ 1/2 O<sub>2</sub>（気） → H<sub>2</sub>O（液）　ΔH ＝ −286 kJ　……(A)</p>
          <p>この反応エンタルピーを熱ではなく電気エネルギーとして効率よく取り出すよう工夫された電池が燃料電池である。白金触媒を含む 2 枚の多孔質電極で仕切られた容器に 30 % 水酸化カリウム水溶液を入れ、70 ℃ で A 極には水素、B 極には酸素を一定の割合で供給する。電極 A・B を導線でつなぐと、<u class="q">①A 極では H<sub>2</sub> が電解液中の H<sub>2</sub>O と反応する。②B 極では O<sub>2</sub> が①で生成した電子 e<sup>−</sup> と電解液中の H<sub>2</sub>O と反応する。</u>結局、電池全体としては水素と酸素から水が生成する反応が起こる。</p>
          <p>（1）文中の下線部①②を、電子 e<sup>−</sup> を含むイオン反応式で表せ。<br>
          （2）この電池を 1 時間運転したところ 90 g の水が生じた。この水素を燃焼して得られる熱エネルギーは何 J か。有効数字 3 桁で答えよ。（H ＝ 1.0、O ＝ 16）<br>
          （3）この電池の運転時の平均電圧は 0.80 V であった。1 時間あたりに取り出せる電気エネルギーは何 J か。また、燃焼で得られる熱エネルギーのうち電気エネルギーに変換された割合（エネルギー変換効率、%）を求めよ。ただし 1 J ＝ 1 C・V、F ＝ 9.65 × 10<sup>4</sup> C/mol。有効数字 3 桁。<br>
          （4）リン酸を電解液とした水素燃料電池では酸素の代わりに空気を用いることもできるが、水酸化カリウムを用いた場合は酸素しか用いることができない。これは空気を用いるとある副反応が起こり、電解液の電気抵抗が増大することが主な原因と考えられる。この副反応を化学反応式で記し、その理由を示せ。<br>
          （5）白金触媒を含む多孔質電極の負極にメタノール水溶液、正極に空気を供給し、その間を H<sup>+</sup> だけを通す電解質膜で仕切った構造をもつ燃料電池は、放電時、負極では CO<sub>2</sub> と H<sup>+</sup> が生成し、正極では H<sub>2</sub>O が生成する。この電池のエネルギー変換効率は 50 % であった。メタノールの燃焼エンタルピーを −726 kJ/mol として、運転時の平均電圧を求めよ。有効数字 2 桁。〔名古屋大 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）電解液が KOH（塩基性）なので OH<sup>−</sup> を使う形で書く。</p>
            <p class="formula">①（A 極／負極）：H<sub>2</sub> ＋ 2OH<sup>−</sup> → 2H<sub>2</sub>O ＋ 2e<sup>−</sup><br>
            ②（B 極／正極）：O<sub>2</sub> ＋ 2H<sub>2</sub>O ＋ 4e<sup>−</sup> → 4OH<sup>−</sup></p>
            <p>（2）生成した水（分子量 18.0）の物質量は</p>
            <p class="formula">90 g ÷ 18 g/mol ＝ 5.0 mol</p>
            <p>全体式 H<sub>2</sub> ＋ 1/2 O<sub>2</sub> → H<sub>2</sub>O より、消費された H<sub>2</sub> も 5.0 mol。(A) より水素の燃焼エンタルピーは −286 kJ/mol、つまり発生する熱量は 286 kJ/mol なので</p>
            <p class="formula">Q ＝ 286 kJ/mol × 5.0 mol ＝ 1430 kJ ＝ <strong>1.43 × 10<sup>6</sup> J</strong></p>
            <p>（3）①②を、電子を消さずに合わせると 4e<sup>−</sup> ＋ 2H<sub>2</sub> ＋ O<sub>2</sub> → 2H<sub>2</sub>O ＋ 4e<sup>−</sup>。<strong>水 2 mol あたり電子 4 mol</strong> だから、水 5.0 mol では電子は 10.0 mol。</p>
            <p class="formula">Q<sub>e</sub> ＝ 10.0 mol × 9.65 × 10<sup>4</sup> C/mol ＝ 9.65 × 10<sup>5</sup> C<br>
            W ＝ Q<sub>e</sub> × V ＝ 9.65 × 10<sup>5</sup> C × 0.80 V ＝ <strong>7.72 × 10<sup>5</sup> J</strong></p>
            <p>変換効率は（2）の熱エネルギーとの比。</p>
            <p class="formula">(7.72 × 10<sup>5</sup>) ÷ (1.43 × 10<sup>6</sup>) × 100 ≒ 53.98 ≒ <strong>54.0 %</strong></p>
            <p>（4）副反応</p>
            <p class="formula">CO<sub>2</sub> ＋ 2KOH → K<sub>2</sub>CO<sub>3</sub> ＋ H<sub>2</sub>O</p>
            <p>理由：空気中には約 0.04 % の CO<sub>2</sub> が含まれる。強塩基である KOH 水溶液に CO<sub>2</sub> が通ると反応して炭酸カリウム K<sub>2</sub>CO<sub>3</sub> が生成し、<strong>電解液の OH<sup>−</sup> が消費されて電気伝導性が下がり、抵抗が増大する</strong>から。</p>
            <p>（5）メタノール 1 mol あたり 726 kJ ＝ 7.26 × 10<sup>5</sup> J の熱量が出る。変換効率 50 % なので取り出せる電気エネルギーは</p>
            <p class="formula">W ＝ 7.26 × 10<sup>5</sup> J × 0.50 ＝ 3.63 × 10<sup>5</sup> J</p>
            <p>負極の半反応式は「CH<sub>3</sub>OH から CO<sub>2</sub> と H<sup>+</sup> が生じる」ことから</p>
            <p class="formula">CH<sub>3</sub>OH ＋ H<sub>2</sub>O → CO<sub>2</sub> ＋ 6H<sup>+</sup> ＋ 6e<sup>−</sup></p>
            <p>メタノール 1 mol で電子 6 mol なので</p>
            <p class="formula">Q ＝ 6 mol × 9.65 × 10<sup>4</sup> C/mol ＝ 5.79 × 10<sup>5</sup> C<br>
            V ＝ W ÷ Q ＝ (3.63 × 10<sup>5</sup> J) ÷ (5.79 × 10<sup>5</sup> C) ≒ <strong>0.63 V</strong></p>
            <p><strong><u class="wavy">1 J ＝ 1 C・V。だから「電気エネルギー ＝ 電気量 × 電圧」で、電圧と熱量がつながる。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項②-4 鉛蓄電池と「放電・充電」（演習6）
// ===================================================================
const PART_LEAD_HTML = `        <h4>重要事項②-4 ～鉛蓄電池と放電・充電～</h4>

        <div class="box box-point">
          <p><strong><u>鉛蓄電池</u></strong>…自動車のバッテリーに使われる代表的な<strong>二次電池</strong>（充電できる電池）</p>
          <ul>
            <li>負極活物質　<strong>Pb</strong>（鉛）</li>
            <li>正極活物質　<strong>PbO<sub>2</sub></strong>（酸化鉛(Ⅳ)）</li>
            <li>電解液　　　<strong>希硫酸 H<sub>2</sub>SO<sub>4</sub></strong></li>
          </ul>
          <div class="formula">（−）Pb | H<sub>2</sub>SO<sub>4</sub> | PbO<sub>2</sub>（＋）　起電力 約 2.0 V</div>
        </div>

        <div class="box box-test">
          <p><strong><u>鉛蓄電池の放電時の反応（3 本セット）</u></strong></p>
          <p class="formula">負極：Pb ＋ SO<sub>4</sub><sup>2−</sup> → PbSO<sub>4</sub> ＋ 2e<sup>−</sup><br>
          正極：PbO<sub>2</sub> ＋ 4H<sup>+</sup> ＋ SO<sub>4</sub><sup>2−</sup> ＋ 2e<sup>−</sup> → PbSO<sub>4</sub> ＋ 2H<sub>2</sub>O<br>
          全体：Pb ＋ PbO<sub>2</sub> ＋ 2H<sub>2</sub>SO<sub>4</sub> → 2PbSO<sub>4</sub> ＋ 2H<sub>2</sub>O</p>
          <p><strong><u class="wavy">放電すると両極とも白色の PbSO<sub>4</sub> で覆われ、電解液の硫酸はうすくなる（水ができるから）。</u></strong>この「硫酸が減って水が増える」ことが濃度計算の問題で必ず問われる。</p>
        </div>

        <div class="box box-review">
          <p><strong>Q1　負極を Pb にするのは分かるけど、正極を PbO<sub>2</sub> にする理由は？</strong></p>
          <p>反応後の物質を見ると、<strong>負極も正極も PbSO<sub>4</sub></strong> になっている。両極から同じ物質ができると、充電で元に戻すのが素直で、後処理も楽になる。だからあえて PbO<sub>2</sub> という複雑な物質を使っている。</p>
          <p><strong>Q2　正極の反応式がどうしても書けないときは？</strong></p>
          <ol>
            <li>反応前 → 反応後の主役を書く　PbO<sub>2</sub> → Pb<sup>2+</sup>（MnO<sub>2</sub> → Mn<sup>2+</sup> と同じ形）</li>
            <li>酸素を水にし、H<sup>+</sup> と e<sup>−</sup> でつじつまを合わせる　PbO<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 2e<sup>−</sup> → Pb<sup>2+</sup> ＋ 2H<sub>2</sub>O</li>
            <li>両辺に SO<sub>4</sub><sup>2−</sup> を足して Pb<sup>2+</sup> を PbSO<sub>4</sub> にする　PbO<sub>2</sub> ＋ 4H<sup>+</sup> ＋ SO<sub>4</sub><sup>2−</sup> ＋ 2e<sup>−</sup> → PbSO<sub>4</sub> ＋ 2H<sub>2</sub>O</li>
          </ol>
          <p><strong><u class="wavy">酸化還元の半反応式のつくり方（酸素→水、H<sup>+</sup> と e<sup>−</sup> で調整）がそのまま使える。</u></strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>放電</u></strong>…電池から電流を取り出すこと（＝電池としての働き）</p>
          <p><strong><u>充電</u></strong>…放電と逆向きの電流を外部から強制的に流すこと（＝<strong>電気分解</strong>）</p>
          <p>鉛蓄電池のような二次電池は、外部電源をつないで充電できる。<strong><u class="wavy">高校化学では「充電の反応式は放電の反応式を逆に書く」だけでよい。</u></strong></p>
          <p class="formula">〔放電〕負極：Pb ＋ SO<sub>4</sub><sup>2−</sup> → PbSO<sub>4</sub> ＋ 2e<sup>−</sup><br>
          〔充電〕陰極：PbSO<sub>4</sub> ＋ 2e<sup>−</sup> → Pb ＋ SO<sub>4</sub><sup>2−</sup></p>
          <p class="formula">〔放電〕正極：PbO<sub>2</sub> ＋ 4H<sup>+</sup> ＋ SO<sub>4</sub><sup>2−</sup> ＋ 2e<sup>−</sup> → PbSO<sub>4</sub> ＋ 2H<sub>2</sub>O<br>
          〔充電〕陽極：PbSO<sub>4</sub> ＋ 2H<sub>2</sub>O → PbO<sub>2</sub> ＋ 4H<sup>+</sup> ＋ SO<sub>4</sub><sup>2−</sup> ＋ 2e<sup>−</sup></p>
          <p>外部電源のつなぎ方や陰極・陽極の呼び方は、重要事項③（電気分解）でくわしく扱う。</p>
        </div>

        <div class="box box-review">
          <p><strong>Q　充電できる電池・できない電池の違いは？</strong></p>
          <p>乾電池は使い切ったら捨てるが、スマホは何度でも充電できる。この違いが<strong>一次電池と二次電池</strong>の区別である。</p>
          <ul>
            <li><strong><u>一次電池</u></strong>…充電できない電池（放電したら終わり）</li>
            <li><strong><u>二次電池（蓄電池）</u></strong>…充電によって繰り返し使える電池</li>
          </ul>
        </div>

        <div class="box box-example">
          <p><strong>演習6 ★</strong>　代表的な二次電池である鉛蓄電池は、正極に PbO<sub>2</sub>、負極に Pb、電解液に質量パーセント濃度 38.0 % の希硫酸（密度 1.28 g/cm<sup>3</sup>）を用いており、放電すると両電極の表面に水に不溶な PbSO<sub>4</sub> が形成される。H ＝ 1.00、O ＝ 16.0、S ＝ 32.0、Pb ＝ 207、F ＝ 9.65 × 10<sup>4</sup> C/mol として、計算結果は有効数字 3 桁で示せ。〔岐阜大〕〔京都薬大〕</p>
          <p>（1）正極および負極における放電時の反応を、電子 e<sup>−</sup> を含むイオン反応式でそれぞれ示せ。<br>
          （2）電流 5.00 A で 5 時間 21 分 40 秒の放電を行ったとき、正極および負極の質量はそれぞれどれだけ増減するかを求めよ。<br>
          （3）放電前の希硫酸が 1 kg であった場合、上記の放電後の質量パーセント濃度を求めよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）</p>
            <p class="formula">負極：Pb ＋ SO<sub>4</sub><sup>2−</sup> → PbSO<sub>4</sub> ＋ 2e<sup>−</sup><br>
            正極：PbO<sub>2</sub> ＋ 4H<sup>+</sup> ＋ SO<sub>4</sub><sup>2−</sup> ＋ 2e<sup>−</sup> → PbSO<sub>4</sub> ＋ 2H<sub>2</sub>O</p>
            <p>（2）まず流れた電気量と電子の物質量を出す。</p>
            <p class="formula">Q ＝ 5.00 A × (5 × 3600 ＋ 21 × 60 ＋ 40) s ＝ 5.00 × 19300 ＝ 96500 C<br>
            電子 ＝ 96500 ÷ 9.65 × 10<sup>4</sup> ＝ 1.00 mol</p>
            <p><strong>負極</strong>　Pb（207）→ PbSO<sub>4</sub>（303）で、電子 2 mol につき SO<sub>4</sub>（96）分の 96 g 増える。<br>
            電子 1.00 mol では <strong>＋48.0 g</strong>（増加）。</p>
            <p><strong>正極</strong>　PbO<sub>2</sub>（239）→ PbSO<sub>4</sub>（303）で、電子 2 mol につき 64 g 増える。<br>
            電子 1.00 mol では <strong>＋32.0 g</strong>（増加）。</p>
            <p>（3）全体式を、あえて電子を残した形で見る。</p>
            <p class="formula">Pb ＋ PbO<sub>2</sub> ＋ 2H<sub>2</sub>SO<sub>4</sub> ＋ 2e<sup>−</sup> → 2PbSO<sub>4</sub> ＋ 2H<sub>2</sub>O ＋ 2e<sup>−</sup></p>
            <p>電子 2 mol で H<sub>2</sub>SO<sub>4</sub> が 2 mol 減り、H<sub>2</sub>O が 2 mol 増える。電子 1.00 mol なら H<sub>2</sub>SO<sub>4</sub> が 1.00 mol（98.0 g）減り、H<sub>2</sub>O が 1.00 mol（18.0 g）増える。</p>
            <p><strong>❶ 溶液全体の質量</strong>　硫酸が抜けて水が入るので、差し引き 98.0 − 18.0 ＝ 80.0 g 減る。</p>
            <p class="formula">1000 g − 80.0 g ＝ 920 g</p>
            <p><strong>❷ 溶質（H<sub>2</sub>SO<sub>4</sub>）の質量</strong>　はじめは 1000 × 0.380 ＝ 380 g。</p>
            <p class="formula">380 g − 98.0 g ＝ 282 g</p>
            <p>よって放電後の質量パーセント濃度は</p>
            <p class="formula">282 ÷ 920 × 100 ＝ 30.65 ≒ <strong>30.7 %</strong></p>
            <p><strong><u class="wavy">鉛蓄電池は「電子 2 mol で硫酸 2 mol が水 2 mol に変わる」。溶液全体と溶質の増減を別々に数えるのがコツ。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項②-5 実用電池（一次電池・二次電池のカタログ）／演習7・演習8
// ===================================================================
const PART_PRACTICAL_HTML = `        <h4>重要事項②-5 ～実用電池（一次電池と二次電池）～</h4>

        <div class="box box-note">
          <p>ここは<strong>覚える量がいちばん多く見える</strong>ところである。しかし見るところは今までと同じ 4 点セット（負極活物質・正極活物質・電解液・3 本の反応式）しかない。<strong><u class="wavy">「充電できるか（一次か二次か）」と「電解液が酸性か塩基性か」の 2 つで整理すると、表がそのまま頭に入る。</u></strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>一次電池</u></strong>…充電できない電池。放電したら使い切りで終わり</p>
          <p><strong><u>二次電池（蓄電池）</u></strong>…充電して繰り返し使える電池</p>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>電池</th><th>負極活物質</th><th>正極活物質</th><th>電解液</th><th>起電力</th></tr>
              </thead>
              <tbody>
                <tr><td>ボルタ電池（一次）</td><td>Zn</td><td>H<sub>2</sub>SO<sub>4</sub> 中の H<sup>+</sup></td><td>希硫酸</td><td>約 1.1 V</td></tr>
                <tr><td>ダニエル電池（一次）</td><td>Zn</td><td>Cu<sup>2+</sup></td><td>ZnSO<sub>4</sub> / CuSO<sub>4</sub></td><td>約 1.1 V</td></tr>
                <tr><td>マンガン乾電池（一次）</td><td>Zn</td><td>MnO<sub>2</sub></td><td>ZnCl<sub>2</sub>・NH<sub>4</sub>Cl 水溶液</td><td>約 1.5 V</td></tr>
                <tr><td>アルカリマンガン乾電池（一次）</td><td>Zn</td><td>MnO<sub>2</sub></td><td>KOH 水溶液</td><td>約 1.5 V</td></tr>
                <tr><td>リチウム電池（一次）</td><td>Li</td><td>MnO<sub>2</sub> など</td><td>有機溶媒＋Li 塩</td><td>約 3 V</td></tr>
                <tr><td>鉛蓄電池（二次）</td><td>Pb</td><td>PbO<sub>2</sub></td><td>希硫酸</td><td>約 2.0 V</td></tr>
                <tr><td>ニッケル・カドミウム電池（二次）</td><td>Cd</td><td>NiO(OH)</td><td>KOH 水溶液</td><td>約 1.3 V</td></tr>
                <tr><td>ニッケル・水素電池（二次）</td><td>水素吸蔵合金中の H</td><td>NiO(OH)</td><td>KOH 水溶液</td><td>約 1.2 V</td></tr>
                <tr><td>リチウムイオン電池（二次）</td><td>黒鉛 C<sub>6</sub> に入った Li</td><td>LiCoO<sub>2</sub></td><td>有機溶媒＋Li 塩</td><td>約 4 V</td></tr>
                <tr><td>燃料電池</td><td>H<sub>2</sub>（外から供給）</td><td>O<sub>2</sub>（外から供給）</td><td>H<sub>3</sub>PO<sub>4</sub> または KOH</td><td>約 1.2 V</td></tr>
              </tbody>
            </table>
          </div>
          <p><strong><u class="wavy">負極活物質は「単体（または単体に近い形）」、正極活物質は「酸化数の高い酸化物やイオン」。この形だけ見れば、知らない電池でも極を当てられる。</u></strong></p>
        </div>

        <div class="box box-test">
          <p><strong><u>塩基性の電解液（KOH）を使う電池に共通する形</u></strong></p>
          <p>ニッカド電池・ニッケル水素電池・アルカリ形燃料電池は、いずれも電解液が KOH（塩基性）である。塩基性の中では H<sup>+</sup> は使えないので、反応式には必ず <strong>OH<sup>−</sup> と H<sub>2</sub>O</strong> が出てくる。</p>
          <p class="formula">〔ニッカド電池・放電〕負極：Cd ＋ 2OH<sup>−</sup> → Cd(OH)<sub>2</sub> ＋ 2e<sup>−</sup><br>
          　　　　　　　　　　正極：NiO(OH) ＋ H<sub>2</sub>O ＋ e<sup>−</sup> → Ni(OH)<sub>2</sub> ＋ OH<sup>−</sup></p>
          <p class="formula">〔ニッケル水素電池・放電〕負極：MH ＋ OH<sup>−</sup> → M ＋ H<sub>2</sub>O ＋ e<sup>−</sup><br>
          　　　　　　　　　　　　正極：NiO(OH) ＋ H<sub>2</sub>O ＋ e<sup>−</sup> → Ni(OH)<sub>2</sub> ＋ OH<sup>−</sup></p>
          <p><strong><u class="wavy">正極（NiO(OH) → Ni(OH)<sub>2</sub>）は 2 つの電池で完全に共通。負極だけ差し替えれば書ける。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>Q　過充電（かじゅうでん）って何が危ないの？</strong></p>
          <p>二次電池は充電すると元の物質に戻る。しかし<strong>戻り切ったあとも電流を流し続ける</strong>と、行き先を失った電子が<strong>水の電気分解</strong>を始めてしまう。これが<strong><u>過充電</u></strong>で、電池の中で気体（H<sub>2</sub> や O<sub>2</sub>）が発生し、内圧が上がって破裂する危険がある。</p>
          <p>そこで実際の密閉型電池では、<strong>負極の活物質を正極より多めに詰めておき、発生した気体を負極側で吸収させる</strong>という対策が取られている。</p>
          <p class="formula">〔ニッカド電池〕2Cd ＋ O<sub>2</sub> ＋ 2H<sub>2</sub>O → 2Cd(OH)<sub>2</sub><br>
          〔ニッケル水素電池〕4MH ＋ O<sub>2</sub> → 4M ＋ 2H<sub>2</sub>O</p>
          <p><strong><u class="wavy">過充電の問題は「余った電子が水を電気分解する」→「出た気体を吸収させる」の 2 段構えで読む。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>Q　リチウム系の電池だけ、なぜ電解液が水ではないの？</strong></p>
          <p>Li はイオン化傾向が<strong>すべての金属の中で最大</strong>である。だから水と激しく反応して H<sub>2</sub> を発生し、発火の危険がある（リチウム電池側の理由）。また電気分解の目でも、Li<sup>+</sup> が還元されて Li になる前に、<strong>より還元されやすい H<sub>2</sub>O が先に還元されて H<sub>2</sub> が出てしまう</strong>ので、充電ができない（リチウムイオン電池側の理由）。</p>
          <p>そのため電解液には<strong>有機溶媒に LiPF<sub>6</sub> などの塩を溶かしたもの</strong>を使う。</p>
        </div>

        <div class="box box-example">
          <p><strong>演習7 ★★</strong>　次の（1）〜（2）に答えよ。原子量は H ＝ 1.0、C ＝ 12、N ＝ 14、O ＝ 16、Na ＝ 23、Mn ＝ 55、Ni ＝ 59、Cu ＝ 64、Zn ＝ 65、Ag ＝ 108、F ＝ 9.65 × 10<sup>4</sup> C/mol とする。</p>
          <p>（1）〔マンガン乾電池〕次の文章の空欄［ ア ］〜［ キ ］に適当な化学式または語句を記入せよ。</p>
          <p>マンガン乾電池は、亜鉛を負極活物質、黒鉛を集電体、［ ア ］を正極活物質とし、電解液として主に塩化亜鉛や塩化アンモニウム水溶液を用い、さらに合成糊を加えて内容物がこぼれないように工夫された代表的な一次電池である。放電すると、負極では Zn → ［ イ ］ ＋ 2e<sup>−</sup> なる反応が起こる。溶け出した亜鉛イオンはアンモニウムイオンと反応して ［ ウ ］ という錯イオンを形成するので、電解液中の亜鉛イオンの濃度は常に低く保たれる。電池内部で負極から正極へ向かって電荷を運ぶのは主に ［ エ ］ である。［ エ ］ は正極で電子を受け取るが、直ちに ［ ア ］ と反応するので気体の発生が避けられる。現在では、マンガン乾電池の正極では MnO<sub>2</sub> ＋ e<sup>−</sup> ＋ H<sup>+</sup> → ［ オ ］ なる反応が主に起こると考えられている。電解液に水酸化カリウム水溶液を用いたアルカリマンガン乾電池では、負極から溶け出した Zn<sup>2+</sup> は溶液中の OH<sup>−</sup> と反応して ［ カ ］ という錯イオンとなる。一方、正極では MnO<sub>2</sub> ＋ e<sup>−</sup> ＋ H<sub>2</sub>O → ［ オ ］ ＋ ［ キ ］ なる反応が主に起こると考えられている。〔東京大 改〕</p>
          <p>（2）〔ニッケル・カドミウム電池〕ニッカド電池は、負極にカドミウム、正極に酸化水酸化ニッケル(Ⅲ) を用い、20〜30 % 水酸化カリウム水溶液中に浸した構造で、起電力は約 1.3 V である。放電するにつれて Cd 極は Cd(OH)<sub>2</sub> に、NiO(OH) 極も Ni(OH)<sub>2</sub> になるが、充電すると逆反応が起こってもとに戻る。充電時、正極の Ni(OH)<sub>2</sub> がすべて NiO(OH) に酸化されてもなお充電（過充電）しようとすると、次の反応によって酸素が発生する。</p>
          <p class="formula">［ ア ］</p>
          <p>当然、電池内部の圧力が上がり破裂する可能性がある。そこで密閉型のニッカド電池では、理論量より多めのカドミウムを充填し、過充電で発生する酸素を次の反応で吸収している。</p>
          <p class="formula">［ イ ］ → 2Cd(OH)<sub>2</sub></p>
          <p>（ⅰ）［ ア ］［ イ ］に適当な反応式を記入せよ。<br>
          （ⅱ）ニッカド電池を放電したとき、負極・正極での反応を e<sup>−</sup> を含むイオン反応式で示せ。また、両極で起こる反応を 1 つの化学反応式で書け。<br>
          （ⅲ）NiO(OH) が 1.84 g 充填されているニッカド電池からは、理論上 0.20 A の電流が何時間にわたって取り出せるか。〔関西学院大 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>（1）〔マンガン乾電池〕</strong></p>
            <p>ア <strong>MnO<sub>2</sub></strong>　イ <strong>Zn<sup>2+</sup></strong>　ウ <strong>[Zn(NH<sub>3</sub>)<sub>4</sub>]<sup>2+</sup></strong>　エ <strong>NH<sub>4</sub><sup>+</sup>（アンモニウムイオン）</strong><br>
            オ <strong>MnO(OH)</strong>　カ <strong>[Zn(OH)<sub>4</sub>]<sup>2−</sup></strong>　キ <strong>OH<sup>−</sup></strong></p>
            <p>オは「両辺の原子と電荷を合わせる」だけで出る。MnO<sub>2</sub> ＋ e<sup>−</sup> ＋ H<sup>+</sup> の左辺は Mn 1・O 2・H 1・電荷 0 なので、右辺も MnO(OH) で決まる。</p>
            <p>キも同じ考え方で、MnO<sub>2</sub> ＋ e<sup>−</sup> ＋ H<sub>2</sub>O の左辺は電荷 −1、H が 2 個。MnO(OH) を取り出すと H が 1 個・電荷 0 余るので、残りは OH<sup>−</sup> である。</p>
            <p><strong>（2）〔ニッケル・カドミウム電池〕</strong></p>
            <p>（ⅰ）過充電で酸素が発生する反応（＝塩基性での水の酸化）と、その酸素を吸収する反応。</p>
            <p class="formula">［ ア ］4OH<sup>−</sup> → O<sub>2</sub> ＋ 2H<sub>2</sub>O ＋ 4e<sup>−</sup><br>
            ［ イ ］2Cd ＋ O<sub>2</sub> ＋ 2H<sub>2</sub>O</p>
            <p>（ⅱ）電解液が KOH（塩基性）なので、OH<sup>−</sup> と H<sub>2</sub>O で書く。</p>
            <p class="formula">負極：Cd ＋ 2OH<sup>−</sup> → Cd(OH)<sub>2</sub> ＋ 2e<sup>−</sup><br>
            正極：NiO(OH) ＋ H<sub>2</sub>O ＋ e<sup>−</sup> → Ni(OH)<sub>2</sub> ＋ OH<sup>−</sup><br>
            全体：Cd ＋ 2NiO(OH) ＋ 2H<sub>2</sub>O → Cd(OH)<sub>2</sub> ＋ 2Ni(OH)<sub>2</sub></p>
            <p>全体式は、正極を 2 倍して負極と足し、電子と OH<sup>−</sup> を消すだけでつくれる。</p>
            <p>（ⅲ）NiO(OH) ＝ 59 ＋ 16 ＋ 17 ＝ 92 より</p>
            <p class="formula">NiO(OH) ＝ 1.84 g ÷ 92 g/mol ＝ 0.020 mol</p>
            <p>正極の反応式は NiO(OH) 1 mol に電子 1 mol なので、取り出せる電子も 0.020 mol。</p>
            <p class="formula">Q ＝ 0.020 mol × 9.65 × 10<sup>4</sup> C/mol ＝ 1.93 × 10<sup>3</sup> C<br>
            t ＝ Q ÷ I ＝ 1.93 × 10<sup>3</sup> ÷ 0.20 ＝ 9650 s<br>
            9650 s ÷ 3600 ＝ 2.68 ≒ <strong>2.7 時間</strong></p>
            <p><strong><u class="wavy">「質量 → 物質量 → 電子の物質量 → 電気量 → 時間」の一本道。ファラデーの法則の使い方は電池でも電気分解でも同じ。</u></strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習8 ★★</strong>　次の（1）〜（2）に答えよ。原子量は H ＝ 1.0、O ＝ 16、Ni ＝ 59、F ＝ 9.65 × 10<sup>4</sup> C/mol とする。</p>
          <p>（1）〔ニッケル・水素電池〕正極に酸化水酸化ニッケル(Ⅲ) NiO(OH)、負極に水素吸蔵合金（本問では M と表し、平均原子量を 72 とする）に貯蔵した水素、電解液に水酸化カリウム水溶液を用いた二次電池で、起電力は約 1.2 V である。放電しても水素吸蔵合金中の金属は変化せず、反応式は次の通りである。</p>
          <p class="formula">負極：MH ＋ OH<sup>−</sup> → ［ ① ］<br>
          正極：NiO(OH) ＋ e<sup>−</sup> ＋ H<sub>2</sub>O → ［ ② ］</p>
          <p>したがって放電の際には、電池全体で次の反応が起こる。</p>
          <p class="formula">［ ③ ］</p>
          <p>以上の反応式より、この電池は放電・充電により電解液の濃度は ④（　　）。充電の終了後も電流を流し続けることを過充電という。過充電すると水の電気分解が起こり気体が発生する。そこで負極の金属の量を正極より多く充填することで、負極での ⑤（　　）の発生を防ぎ、かつ正極で発生した ⑥（　　）を負極物質と次のように反応させて、破裂の危険を防止している。</p>
          <p class="formula">［ ⑦ ］ → 4M ＋ 2H<sub>2</sub>O</p>
          <p>（ⅰ）文中の（　　）に適語を、［　］には適切な反応式を記せ。<br>
          （ⅱ）この電池を放電し、電子 0.10 mol に相当する電気量を取り出した。このとき負極・正極の質量は何 g ずつ増減するか。</p>
          <p>（2）〔リチウムイオン電池〕リチウム電池は ［ ア ］ 極に酸化マンガン(Ⅳ) など、［ イ ］ 極に金属リチウムを、<u class="q">(a) 電解液には有機溶媒に LiBF<sub>4</sub> などの塩を溶解したもの</u>が使用され、3 V 以上の高い起電力をもつ。しかしリチウム電池を二次電池として使用することはできない。リチウムイオン電池では、電極に金属リチウムを使用せず、［ ウ ］ 極にコバルト酸リチウム LiCoO<sub>2</sub>、［ エ ］ 極に黒鉛を使用する。黒鉛は巨大な平面層状構造をもち、層と層の間は ［ オ ］ で結合しているため、層間に多くの原子やイオンを挿入・脱離できる。<u class="q">(c) 充電時には ［ ウ ］ 極の LiCoO<sub>2</sub> から Li<sup>+</sup> が脱離するとともに、Co<sup>3+</sup> が Co<sup>4+</sup> に ［ カ ］ される。</u>一方 ［ エ ］ 極では層間に Li<sup>+</sup> が挿入される。<u class="q">(d) 電解液には有機溶媒に LiPF<sub>6</sub> などの塩を溶解したものが使用される。</u></p>
          <p>（ⅰ）文中の［　］に適切な語句を入れよ。<br>
          （ⅱ）下線部 (a)(d) で、リチウム電池・リチウムイオン電池では電解液の溶媒として水を使用できない。それぞれの理由を述べよ。<br>
          （ⅲ）下線部 (c) で、放電時の各電極における反応を、電子 e<sup>−</sup> を用いた反応式で表せ。ただし黒鉛の組成式は C<sub>6</sub>、Li<sup>+</sup> が挿入された黒鉛の組成式は LiC<sub>6</sub> とする。<br>
          （ⅳ）リチウムイオン電池の負極の質量が 2.3 g 減少したとき、取り出される電子の物質量を有効数字 2 桁で求めよ。（Li ＝ 6.9）〔東北大 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>（1）〔ニッケル・水素電池〕</strong></p>
            <p>（ⅰ）原子と電荷のつじつまを合わせるだけで埋まる。</p>
            <p class="formula">① M ＋ H<sub>2</sub>O ＋ e<sup>−</sup>　② Ni(OH)<sub>2</sub> ＋ OH<sup>−</sup><br>
            ③ MH ＋ NiO(OH) → M ＋ Ni(OH)<sub>2</sub></p>
            <p>④ <strong>変化しない</strong>　⑤ <strong>水素（H<sub>2</sub>）</strong>　⑥ <strong>酸素（O<sub>2</sub>）</strong>　⑦ <strong>4MH ＋ O<sub>2</sub></strong></p>
            <p>④は全体式 ③ を見ると分かる。<strong>H<sub>2</sub>O も OH<sup>−</sup> も式に残っていない</strong>ので、電解液の濃度は放電・充電で変化しない。鉛蓄電池（硫酸が減る）との大きな違いである。</p>
            <p>（ⅱ）電子 0.10 mol で、両極とも 0.10 mol ずつ反応が進む。</p>
            <p><strong>負極</strong>　MH → M（H が 1 個抜ける）なので、H ＝ 1.0 が 0.10 mol 分抜ける。<br>
            → <strong>0.10 g 減少</strong></p>
            <p><strong>正極</strong>　NiO(OH)（92）→ Ni(OH)<sub>2</sub>（93）で H が 1 個増えるので<br>
            → <strong>0.10 g 増加</strong></p>
            <p>合金 M の原子量 72 は<strong>使わない</strong>。M そのものは変化しないので、増減に効くのは H だけである（ここが引っかけ）。</p>
            <p><strong>（2）〔リチウムイオン電池〕</strong></p>
            <p>（ⅰ）ア <strong>正</strong>　イ <strong>負</strong>　ウ <strong>正</strong>　エ <strong>負</strong>　オ <strong>ファンデルワールス力</strong>　カ <strong>酸化</strong></p>
            <p>（ⅱ）（a）金属 Li はイオン化傾向がきわめて大きく、<strong>水と激しく反応して H<sub>2</sub> を発生し発火の危険がある</strong>ため。<br>
            （d）充電（＝電気分解）のとき、<strong>Li<sup>+</sup> が還元される前に、より還元されやすい H<sub>2</sub>O が先に還元されて H<sub>2</sub> が発生してしまう</strong>ため、二次電池として機能しないから。</p>
            <p>（ⅲ）放電時は充電時の逆向き。負極から Li<sup>+</sup> が抜け、正極に Li<sup>+</sup> が入る。</p>
            <p class="formula">負極：LiC<sub>6</sub> → C<sub>6</sub> ＋ Li<sup>+</sup> ＋ e<sup>−</sup><br>
            正極：CoO<sub>2</sub> ＋ Li<sup>+</sup> ＋ e<sup>−</sup> → LiCoO<sub>2</sub></p>
            <p>（ⅳ）負極の質量減少は、LiC<sub>6</sub> から Li が抜けた分（黒鉛 C<sub>6</sub> は残る）。</p>
            <p class="formula">2.3 g ÷ 6.9 g/mol ＝ 0.333… mol</p>
            <p>負極の反応式より、Li<sup>+</sup> 1 mol に電子 1 mol なので <strong>0.33 mol</strong>。</p>
            <p><strong><u class="wavy">リチウムイオン電池は Li<sup>+</sup> が両極を行き来するだけ（ロッキングチェア型）。だから質量変化は Li の分でしか起こらない。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項③ 電気分解（外部電源をつないだときの陰極・陽極）
// ===================================================================
const PART_ELECTROLYSIS_HTML = `        <h4>重要事項③ ～電気分解～</h4>

        <div class="box box-point">
          <p><strong><u>電気分解</u></strong>…電池とは逆に、<strong>外部から電気エネルギーを与えて、自発的には起こらない酸化還元反応を無理に起こすこと</strong></p>
          <p>電池は「起こりたい反応が勝手に起こる」現象だった。電気分解はその逆で、<strong><u class="wavy">外部電源（コンセント）が強制的に電子を押し込み、強制的に電子を奪い取る。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>イメージ　～コンセント社長の無茶振り～</strong></p>
          <p>電気分解では、絶対権力者「<strong>コンセント社長（外部電源）</strong>」が乱入してくる。社長は陰極に向かって「<strong>俺が連れてきた彼女（電子）を受け取れ！</strong>」、陽極に向かって「<strong>お前の彼女（電子）をよこせ！</strong>」と無茶振りする。</p>
          <p>だから電気分解の問題は、<strong><u class="wavy">複数の極板やイオンの中で「誰が一番先に犠牲になるか」を決めるゲーム</u></strong>になる。この順番を決めるのが、電池でも使ったイオン化傾向である。</p>
        </div>

        <div class="box box-test">
          <p><strong><u>陰極・陽極の定義（電池の負極・正極と混同しないこと）</u></strong></p>
          <ul>
            <li><strong><u>陰極</u></strong>…外部電源の<strong>負極</strong>につないだ電極。電子を受け取るので<strong>還元</strong>が起こる</li>
            <li><strong><u>陽極</u></strong>…外部電源の<strong>正極</strong>につないだ電極。電子を奪われるので<strong>酸化</strong>が起こる</li>
          </ul>
          <p><strong><u class="wavy">「陰極＝還元」「陽極＝酸化」は例外なし。電池の「負極＝酸化」「正極＝還元」とセットで覚える。</u></strong></p>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>　</th><th>電池（放電）</th><th>電気分解（充電）</th></tr>
              </thead>
              <tbody>
                <tr><td>電子を<strong>出す</strong>側（酸化）</td><td><strong>負極</strong>（−）</td><td><strong>陽極</strong></td></tr>
                <tr><td>電子を<strong>受け取る</strong>側（還元）</td><td><strong>正極</strong>（＋）</td><td><strong>陰極</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-electro-3" viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-electro-3 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-electro-3 .bx {stroke:#555;stroke-width:1.8;fill:none}
    .learning-content .lcfig-adv-electro-3 .liq {fill:#dceefb;stroke:#7ba7c9;stroke-width:1.2}
    .learning-content .lcfig-adv-electro-3 .pl {fill:#9aa5b1;stroke:#4b5563;stroke-width:1.4}
    .learning-content .lcfig-adv-electro-3 .wire {stroke:#333;stroke-width:2.2;fill:none}
    .learning-content .lcfig-adv-electro-3 .eArw {stroke:#c0392b;stroke-width:2.6;fill:none}
    .learning-content .lcfig-adv-electro-3 .src {fill:#fff3e0;stroke:#d98324;stroke-width:2}
    .learning-content .lcfig-adv-electro-3 .lb {font:bold 12px sans-serif;fill:#222;text-anchor:middle}
    .learning-content .lcfig-adv-electro-3 .lbe {font:bold 12px sans-serif;fill:#c0392b;text-anchor:middle}
    .learning-content .lcfig-adv-electro-3 .sm {font:11px sans-serif;fill:#444;text-anchor:middle}
  </style>

  <text class="ttl" x="360" y="24">外部電源（コンセント社長）のつなぎ方で極の名前が決まる</text>

  <rect class="src" x="290" y="48" width="140" height="46" rx="8"/>
  <text class="lb" x="360" y="70">外部電源（電池）</text>
  <text class="sm" x="316" y="88">（−）</text>
  <text class="sm" x="404" y="88">（＋）</text>

  <path class="wire" d="M300,94 L300,130 L170,130 L170,150"/>
  <path class="wire" d="M420,94 L420,130 L550,130 L550,150"/>

  <path class="liq" d="M110,190 H610 V270 H110 Z"/>
  <rect class="pl" x="160" y="150" width="20" height="100"/>
  <rect class="pl" x="540" y="150" width="20" height="100"/>

  <text class="lb" x="170" y="288">陰極（還元）</text>
  <text class="lb" x="550" y="288">陽極（酸化）</text>
  <text class="sm" x="170" y="144">外部電源の（−）へ</text>
  <text class="sm" x="550" y="144">外部電源の（＋）へ</text>

  <path class="eArw" d="M292,120 L182,120"/>
  <path class="eArw" d="M182,120 L192,115 M182,120 L192,125"/>
  <text class="lbe" x="237" y="112">e⁻ が押し込まれる</text>

  <path class="eArw" d="M540,120 L430,120"/>
  <path class="eArw" d="M430,120 L440,115 M430,120 L440,125"/>
  <text class="lbe" x="485" y="112">e⁻ を奪われる</text>

  <text class="lb" x="230" y="232">電子を受け取る物質</text>
  <text class="sm" x="230" y="250">（陽イオン・H₂O）</text>
  <text class="lb" x="480" y="232">電子を渡す物質</text>
  <text class="sm" x="480" y="250">（陰イオン・H₂O・極板）</text>
</svg>
          <figcaption><strong>電子は必ず外部電源の（−）から陰極へ流れ込む。</strong>陰極で還元、陽極で酸化。この向きだけ押さえれば、どんな電解槽でも書き出せる。</figcaption>
        </figure>

        <div class="box box-memory">
          <p><strong><u>イオン化傾向（電気分解バージョン）</u></strong></p>
          <div class="formula">リッチに Li　貸そ K　か Ca　な Na　ま Mg　あ Al　あ Zn　て Fe　に Ni　す Sn　な Pb　（H<sub>2</sub>）　ど Cu　す Hg　ぎ Ag　借 Pt　金 Au</div>
          <p>電池のときと同じ並びだが、電気分解では<strong>金属の単体の「性格」をもう少し細かく分けて</strong>見る。</p>
          <ul>
            <li><strong>Cu・Hg・Ag</strong>…見た目は良いが<strong>すぐ浮気する男</strong>。極板でも簡単に電子を渡して溶ける</li>
            <li><strong>Pt・Au（と C）</strong>…<strong>彼女一途な最高の男</strong>。電子を絶対に渡さない＝極板が溶けない</li>
            <li><strong>H<sub>2</sub> より左の金属</strong>…<strong>独身が大好き</strong>。社長が来てもイオンのままで居続ける＝水溶液中では還元されない</li>
          </ul>
          <p><strong><u class="wavy">陽極が Pt・Au・C なら極板は溶けない。それ以外（Cu など）なら極板自身が溶ける。ここが陽極の最初の分岐点。</u></strong></p>
        </div>

        <div class="box box-test">
          <p><strong><u>陰極（還元）で起こる反応の決め方</u></strong></p>
          <ol>
            <li>溶液中に <strong>Cu<sup>2+</sup> 以下（Cu、Hg、Ag など）のイオン</strong>があれば、それが電子を受け取る<br>
            例）Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu　／　Ag<sup>+</sup> ＋ e<sup>−</sup> → Ag</li>
            <li>なければ <strong>H<sup>+</sup> や H<sub>2</sub>O が仕方なく</strong>電子を受け取る<br>
            〔酸性〕2H<sup>+</sup> ＋ 2e<sup>−</sup> → H<sub>2</sub><br>
            〔中性・塩基性〕2H<sub>2</sub>O ＋ 2e<sup>−</sup> → H<sub>2</sub> ＋ 2OH<sup>−</sup></li>
          </ol>
          <p><strong><u class="wavy">Na<sup>+</sup>、K<sup>+</sup>、Al<sup>3+</sup> などは水溶液中では決して還元されない（水が先に還元されてしまう）。</u></strong></p>
        </div>

        <div class="box box-test">
          <p><strong><u>陽極（酸化）で起こる反応の決め方</u></strong></p>
          <ol>
            <li><strong>極板が Cu・Hg・Ag</strong> なら、まず<strong>極板自身が溶ける</strong><br>
            例）Cu → Cu<sup>2+</sup> ＋ 2e<sup>−</sup></li>
            <li><strong>極板が Pt・Au・C</strong> なら極板は溶けない。次に<strong>ハロゲン化物イオン</strong>が電子を渡す<br>
            例）2Cl<sup>−</sup> → Cl<sub>2</sub> ＋ 2e<sup>−</sup>　／　2I<sup>−</sup> → I<sub>2</sub> ＋ 2e<sup>−</sup></li>
            <li>ハロゲンもなければ <strong>OH<sup>−</sup> や H<sub>2</sub>O が仕方なく</strong>電子を渡す<br>
            〔酸性・中性〕2H<sub>2</sub>O → O<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup><br>
            〔塩基性〕4OH<sup>−</sup> → O<sub>2</sub> ＋ 2H<sub>2</sub>O ＋ 4e<sup>−</sup></li>
          </ol>
          <p><strong><u class="wavy">SO<sub>4</sub><sup>2−</sup> と NO<sub>3</sub><sup>−</sup> は酸化されない（すでに酸化数が高い）。F<sup>−</sup> も反応しにくい。だから硫酸・硝酸塩の水溶液では必ず O<sub>2</sub> が出る。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>Q2（再掲）　「鉛蓄電池を充電するとき」ってどういうこと？</strong></p>
          <p>鉛蓄電池に何もつながなければ、Pb と PbO<sub>2</sub> の酸化還元反応が自発的に進む（＝放電）。ところが<strong>外部電源をつなぐと、負極・正極の役割が入れ替わる</strong>。</p>
          <ol>
            <li>外部電源の<strong>負極</strong>を、電池の<strong>負極</strong>（放電時に酸化した極）につなぐ　⇒　<strong>陰極</strong>に変わり<strong>還元</strong>が起こる</li>
            <li>外部電源の<strong>正極</strong>を、電池の<strong>正極</strong>（放電時に還元した極）につなぐ　⇒　<strong>陽極</strong>に変わり<strong>酸化</strong>が起こる</li>
          </ol>
          <p>結果として電子の向きが逆になり、二次電池では充電（＝電気分解）ができる。</p>
          <p class="formula">〔放電〕負極：Pb ＋ SO<sub>4</sub><sup>2−</sup> → PbSO<sub>4</sub> ＋ 2e<sup>−</sup><br>
          〔充電〕陰極：PbSO<sub>4</sub> ＋ 2e<sup>−</sup> → Pb ＋ SO<sub>4</sub><sup>2−</sup></p>
          <p class="formula">〔放電〕正極：PbO<sub>2</sub> ＋ 4H<sup>+</sup> ＋ SO<sub>4</sub><sup>2−</sup> ＋ 2e<sup>−</sup> → PbSO<sub>4</sub> ＋ 2H<sub>2</sub>O<br>
          〔充電〕陽極：PbSO<sub>4</sub> ＋ 2H<sub>2</sub>O → PbO<sub>2</sub> ＋ 4H<sup>+</sup> ＋ SO<sub>4</sub><sup>2−</sup> ＋ 2e<sup>−</sup></p>
          <p>一次電池では充電（電気分解）は考えない。<strong><u class="wavy">高校化学では「充電の反応式は放電の反応式を逆に書く」だけで解ける。</u></strong></p>
        </div>

        <div class="box box-note">
          <p><strong><u>過電圧</u></strong>…電気分解を続けるために理論上必要な電圧より、<strong>実際に余分にかかる電圧</strong></p>
          <p>理屈のうえでは小さい電圧で分解できるはずなのに、実際にはもっと大きな電圧をかけないと反応が進まない。この差が過電圧である。<strong><u class="wavy">気体（H<sub>2</sub>・O<sub>2</sub>）が発生する反応では過電圧が大きく、そのせいで「理屈より起こりにくい」ことがある。</u></strong></p>
        </div>
`;

// ===================================================================
// 定期テスト・入試に出やすいこと② 電気分解問題の思考方法（演習9〜11）
// ===================================================================
const PART_HOWTO_HTML = `        <h4>定期テスト・入試に出やすいこと② ～電気分解問題の思考方法～</h4>

        <div class="box box-note">
          <p>電気分解の問題は、見た目が毎回違うので難しく感じる。しかし<strong><u class="wavy">やることは「❶ 全部の電極の反応式を書く」→「❷ 電子の物質量で物質どうしをつなぐ」の 2 手だけ</u></strong>である。まずこの型を体に入れてしまおう。</p>
        </div>

        <div class="box box-test">
          <p><strong><u>❶ イオン化傾向を考えて、すべての電極の反応をイオン反応式で表す</u></strong></p>
          <p>電解槽が 3 つあるなら、極は 6 つある。<strong>面倒でも全部書く</strong>。書き終えた時点で問題の 8 割は終わっている。</p>
          <p><strong><u>❷ ❶の反応式を使って、電子と各物質の物質量の関係を考える</u></strong></p>
          <p><strong>〈1〉各物質の質量・体積が与えられている場合</strong></p>
          <div class="formula">① 質量［g］・体積［L］　⇒　② 各物質の mol　⇒　③ 電子の mol　⇒　④ 電気量 Q［C］</div>
          <p>道具は <strong>F ＝ 9.65 × 10<sup>4</sup> C/mol</strong>。②→③のところで<strong>反応式の係数比</strong>を使う。<strong>2 つ以上の物質から電子を考えるときは、それぞれの mol から出した電子の mol を足す。</strong></p>
          <p><strong>〈2〉電流・時間・電気量が与えられている場合</strong></p>
          <div class="formula">① 電気量 Q［C］　⇒　② 電子の mol　⇒　③ 各物質の mol　⇒　④ 質量［g］・体積［L］</div>
          <p>道具は <strong>Q ＝ I × t</strong>（分は × 60、時は × 3600 で秒に直す）。</p>
          <ul>
            <li><strong><u>直列回路</u></strong>…<strong>すべての電解槽で電気量 Q が等しい</strong></li>
            <li><strong><u>並列回路</u></strong>…<strong>枝分かれ前の Q ＝ 枝分かれ後の Q の和</strong></li>
          </ul>
          <p><strong><u class="wavy">途中を聞かれる問題は、①⇒④の流れをそこで止めるだけ。流れが 1 本しかないので迷わない。</u></strong></p>
        </div>

        <div class="box box-point">
          <p><strong><u>❸ 各問題に合わせて応用を利かす</u></strong></p>
          <p><strong>〈1〉電解槽の pH を求める（酸性・塩基性・中性を判断する）</strong></p>
          <ol>
            <li>陽極・陰極の 2 つのイオン反応式から、<strong>［H<sup>+</sup>］と［OH<sup>−</sup>］がどう増減するか</strong>を見る</li>
            <li>［H<sup>+</sup>］［OH<sup>−</sup>］＝ 1.0 × 10<sup>−14</sup>（mol/L）<sup>2</sup>、pH ＝ −log<sub>10</sub>［H<sup>+</sup>］、pOH ＝ −log<sub>10</sub>［OH<sup>−</sup>］を使う</li>
          </ol>
          <p><strong>〈2〉水溶液の濃淡・イオンの動きを考える</strong></p>
          <ol>
            <li>イオン反応式から<strong>存在するイオン</strong>を書き出す</li>
            <li><strong>「陽性が強い場所には陰イオンが集まる／陰性が強い場所には陽イオンが集まる」</strong>を使う</li>
          </ol>
        </div>

        <div class="box box-example">
          <p><strong>演習9 ★</strong>　次の電解質水溶液を電気分解したときの、各極で起こる反応式を書け。</p>
          <p>（1）硫酸（両極とも Pt 電極）<br>
          （2）水酸化ナトリウム水溶液（両極とも Pt 電極）<br>
          （3）硫酸銅(Ⅱ)水溶液（両極とも Pt 電極）<br>
          （4）硫酸銅(Ⅱ)水溶液（両極とも Cu 電極）<br>
          （5）ヨウ化カリウム水溶液</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）硫酸は<strong>酸性</strong>で H<sup>+</sup> が多い。極板は Pt なので溶けない。SO<sub>4</sub><sup>2−</sup> は酸化されないので水が酸化される。</p>
            <p class="formula">陰極：2H<sup>+</sup> ＋ 2e<sup>−</sup> → H<sub>2</sub><br>
            陽極：2H<sub>2</sub>O → O<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup></p>
            <p>（2）NaOH 水溶液は<strong>塩基性</strong>。Na<sup>+</sup> は還元されないので水が還元される。陽極には OH<sup>−</sup> がたくさんある。</p>
            <p class="formula">陰極：2H<sub>2</sub>O ＋ 2e<sup>−</sup> → H<sub>2</sub> ＋ 2OH<sup>−</sup><br>
            陽極：4OH<sup>−</sup> → O<sub>2</sub> ＋ 2H<sub>2</sub>O ＋ 4e<sup>−</sup></p>
            <p>（3）Cu<sup>2+</sup> があるので陰極では Cu が析出する。極板は Pt で溶けず、SO<sub>4</sub><sup>2−</sup> も酸化されないので陽極は水。</p>
            <p class="formula">陰極：Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu<br>
            陽極：2H<sub>2</sub>O → O<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup></p>
            <p>（4）陽極が <strong>Cu</strong> に変わった。Cu は「すぐ浮気する男」なので<strong>極板自身が溶ける</strong>。ここが（3）との唯一の違いで、これが<strong>電解精錬</strong>の原理になる。</p>
            <p class="formula">陰極：Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu<br>
            陽極：Cu → Cu<sup>2+</sup> ＋ 2e<sup>−</sup></p>
            <p>（5）KI 水溶液は中性。K<sup>+</sup> は還元されないので水が還元される。陽極には<strong>ハロゲン化物イオン I<sup>−</sup></strong> があるので、水より先に I<sup>−</sup> が酸化される。</p>
            <p class="formula">陰極：2H<sub>2</sub>O ＋ 2e<sup>−</sup> → H<sub>2</sub> ＋ 2OH<sup>−</sup><br>
            陽極：2I<sup>−</sup> → I<sub>2</sub> ＋ 2e<sup>−</sup></p>
            <p><strong><u class="wavy">見るのは 3 点だけ。「陽極の極板は Pt・Au・C か？」「ハロゲン化物イオンはあるか？」「液性は酸性・中性・塩基性か？」</u></strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習10 ★</strong>　白金電極を用いた 2 つの電解槽を<strong>直列</strong>に接続し、槽 A で水酸化ナトリウム水溶液、槽 B で硝酸銀水溶液の電気分解を 5.0 A の電流で行ったところ、ある電極の質量が 10.8 g 増加した。H ＝ 1.0、O ＝ 16、S ＝ 32、Ag ＝ 108、F ＝ 9.65 × 10<sup>4</sup> C/mol〔17 佐賀大 改〕</p>
          <p>（1）電解槽 A と B の両極で起きている反応を、電子 e<sup>−</sup> を含むイオン反応式で示せ。<br>
          （2）通電時間は何秒か。有効数字 2 桁で答えよ。<br>
          （3）A の陽極から発生する気体の体積は、標準状態で何 L か。有効数字 2 桁で答えよ。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>❶ すべての電極の反応をイオン反応式で表す</strong></p>
            <p>（1）A は NaOH（塩基性）、B は AgNO<sub>3</sub>（中性、Ag<sup>+</sup> あり）。極板はどちらも Pt なので溶けない。</p>
            <p class="formula">〔電解槽 A〕陰極：2H<sub>2</sub>O ＋ 2e<sup>−</sup> → H<sub>2</sub> ＋ 2OH<sup>−</sup><br>
            　　　　　　陽極：4OH<sup>−</sup> → O<sub>2</sub> ＋ 2H<sub>2</sub>O ＋ 4e<sup>−</sup></p>
            <p class="formula">〔電解槽 B〕陰極：Ag<sup>+</sup> ＋ e<sup>−</sup> → Ag<br>
            　　　　　　陽極：2H<sub>2</sub>O → O<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup></p>
            <p><strong>❷ 電子の物質量でつなぐ</strong></p>
            <p>（2）「質量が増加した電極」は、金属が析出する <strong>B の陰極</strong>しかない。まず〈1〉のルートで電子を出す。</p>
            <p class="formula">Ag ＝ 10.8 g ÷ 108 g/mol ＝ 0.100 mol</p>
            <p>B の陰極は Ag<sup>+</sup> ＋ e<sup>−</sup> → Ag なので、<strong>Ag と電子は 1 : 1</strong>。よって電子も 0.100 mol。</p>
            <p class="formula">5.0 A × t ＝ 0.100 mol × 9.65 × 10<sup>4</sup> C/mol ＝ 9650 C<br>
            t ＝ 1930 s ≒ <strong>1.9 × 10<sup>3</sup> s</strong></p>
            <p>（3）<strong>直列なので A にも同じ 0.100 mol の電子が流れる。</strong>A の陽極は 4OH<sup>−</sup> → O<sub>2</sub> ＋ 2H<sub>2</sub>O ＋ 4e<sup>−</sup> で、電子 4 mol につき O<sub>2</sub> 1 mol。</p>
            <p class="formula">O<sub>2</sub> ＝ 0.100 mol ÷ 4 ＝ 0.0250 mol<br>
            0.0250 mol × 22.4 L/mol ＝ <strong>0.56 L</strong></p>
            <p><strong><u class="wavy">直列は「どの槽も電子の物質量が同じ」。片方の槽で出した電子をそのまま他方に持ち込めるのが最大の武器。</u></strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習11 ★★</strong>　電解槽Ⅰ、Ⅱ、Ⅲを図のように接続して電気分解した。電解槽Ⅰには 0.200 mol/L の希硫酸 2.00 L、電解槽Ⅱには硫酸銅(Ⅱ)水溶液（両極 Cu）が入っている。電解槽Ⅲは中央が<strong>陽イオン交換膜</strong>で仕切られ、陰極側（極板 Fe）には 0.200 mol/L の水酸化ナトリウム水溶液 1.00 L、陽極側（極板 C）には 2.00 mol/L の塩化ナトリウム水溶液 1.00 L が入っている。1.80 A の一定電流で 5 時間 21 分 40 秒電気分解したところ、電解槽Ⅰで発生した気体の総体積は標準状態で 1.344 L であった。発生した気体は電解液に溶けない理想気体とし、液量の変化はないものとする。（F ＝ 9.65 × 10<sup>4</sup> C/mol、K<sub>w</sub> ＝ 1.0 × 10<sup>−14</sup>（mol/L）<sup>2</sup>、log<sub>10</sub>2 ＝ 0.30、log<sub>10</sub>3 ＝ 0.48）</p>
          <p>（1）電解槽Ⅱの陽極を白金に変えて同様に電気分解すると、電解槽Ⅱの水溶液の pH はどのように変化するか。理由とともに述べよ。<br>
          （2）電解槽Ⅲの陽極と陰極で発生した気体を反応させて生じた物質を水に溶かして得られる水溶液は、酸性・中性・アルカリ性のいずれを示すか。<br>
          （3）電気分解後の電解槽Ⅰの水溶液と電解槽Ⅲの陰極室の水溶液を、体積で等量ずつ混合した。この混合水溶液の pH を求めよ（小数第 1 位まで）。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>❶ すべての電極の反応をイオン反応式で表す</strong></p>
            <p class="formula">〔Ⅰ〕陽極（Pt）：2H<sub>2</sub>O → O<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup>　／　陰極（Pt）：2H<sup>+</sup> ＋ 2e<sup>−</sup> → H<sub>2</sub><br>
            〔Ⅱ〕陽極（Cu）：Cu → Cu<sup>2+</sup> ＋ 2e<sup>−</sup>　／　陰極（Cu）：Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu<br>
            〔Ⅲ〕陽極（C）：2Cl<sup>−</sup> → Cl<sub>2</sub> ＋ 2e<sup>−</sup>　／　陰極（Fe）：2H<sub>2</sub>O ＋ 2e<sup>−</sup> → H<sub>2</sub> ＋ 2OH<sup>−</sup></p>
            <p>（1）<strong>pH は小さくなる（低下する）。</strong></p>
            <p>陽極を Cu から Pt に変えると、極板が溶けなくなるので、代わりに<strong>水の酸化</strong>が起こる。</p>
            <p class="formula">陽極（Pt）：2H<sub>2</sub>O → O<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup></p>
            <p>理由：もとは「Cu が溶けて Cu<sup>2+</sup> が出る」だけで H<sup>+</sup> は増えなかったが、Pt にすると<strong>陽極で H<sup>+</sup> が生成して溶液にたまっていく</strong>ため、酸性が強まって pH が下がる。</p>
            <p>（2）<strong>酸性</strong></p>
            <p>Ⅲの陽極では Cl<sup>−</sup> が酸化されて Cl<sub>2</sub>、陰極では H<sub>2</sub>O が還元されて H<sub>2</sub> が出る。この 2 つを反応させると</p>
            <p class="formula">H<sub>2</sub> ＋ Cl<sub>2</sub> → 2HCl</p>
            <p>塩化水素は水に溶けて塩酸（強酸）になるので、水溶液は酸性を示す。</p>
            <p>（3）<strong>pH ＝ 12.6</strong></p>
            <p><strong>〈2〉のルートで回路全体の電子を出す。</strong>5 時間 21 分 40 秒 ＝ 19300 s。</p>
            <p class="formula">Q ＝ 1.80 A × 19300 s ＝ 34740 C<br>
            全体の電子 ＝ 34740 ÷ 9.65 × 10<sup>4</sup> ＝ 0.360 mol</p>
            <p><strong>〈1〉のルートで、電解槽Ⅰに流れた電子を気体の体積から出す。</strong>Ⅰの 2 式を<strong>電子を消さずに</strong>足すと</p>
            <p class="formula">4H<sup>+</sup> ＋ 4e<sup>−</sup> ＋ 2H<sub>2</sub>O → 2H<sub>2</sub> ＋ O<sub>2</sub> ＋ 4H<sup>+</sup> ＋ 4e<sup>−</sup></p>
            <p>発生気体（H<sub>2</sub> ＋ O<sub>2</sub>）の総量は</p>
            <p class="formula">1.344 L ÷ 22.4 L/mol ＝ 0.0600 mol</p>
            <p>上式で気体の係数の和は 2 ＋ 1 ＝ <strong>3</strong>、電子の係数は <strong>4</strong> なので</p>
            <p class="formula">Ⅰの電子 ＝ 4/3 × 0.0600 mol ＝ 0.0800 mol</p>
            <p>回路は<strong>Ⅰと（Ⅱ・Ⅲ）が並列</strong>になっているので、残りが電解槽Ⅲに流れる。</p>
            <p class="formula">Ⅲの電子 ＝ 0.360 − 0.0800 ＝ 0.280 mol</p>
            <p><strong>❸ pH を求める応用に入る。</strong></p>
            <p><strong>電解槽Ⅰ</strong>　上の全体式を見ると、左辺と右辺で <strong>H<sup>+</sup> の数が同じ</strong>（4H<sup>+</sup> が消えて 4H<sup>+</sup> ができる）。つまり<strong>H<sup>+</sup> の総量は変化しない</strong>。</p>
            <p class="formula">H<sup>+</sup> ＝ 0.200 mol/L × 2.00 L × 2 ＝ 0.800 mol<br>
            ［H<sup>+</sup>］＝ 0.800 mol ÷ 2.00 L ＝ 0.400 mol/L</p>
            <p>（希硫酸は 2 価なので H<sup>+</sup> は 2 倍になる。）</p>
            <p><strong>電解槽Ⅲの陰極室</strong>　2H<sub>2</sub>O ＋ 2e<sup>−</sup> → H<sub>2</sub> ＋ 2OH<sup>−</sup> より、<strong>流れた電子と同じ物質量の OH<sup>−</sup> が新しく生まれる</strong>。</p>
            <p class="formula">OH<sup>−</sup> ＝ 0.200 mol（もとから）＋ 0.280 mol（発生）＝ 0.480 mol<br>
            ［OH<sup>−</sup>］＝ 0.480 mol ÷ 1.00 L ＝ 0.480 mol/L</p>
            <p><strong>等量ずつ混ぜて中和させる。</strong>体積 V［L］ずつ混ぜると</p>
            <p class="formula">OH<sup>−</sup> ＝ 0.480V mol　＞　H<sup>+</sup> ＝ 0.400V mol</p>
            <p>OH<sup>−</sup> のほうが多いので、中和後はアルカリ性である。</p>
            <p class="formula">残る OH<sup>−</sup> ＝ (0.480 − 0.400) × V ＝ 0.080V mol<br>
            混合後の体積 ＝ 2V L<br>
            ［OH<sup>−</sup>］＝ 0.080V ÷ 2V ＝ 0.040 ＝ 4.0 × 10<sup>−2</sup> mol/L</p>
            <p class="formula">pOH ＝ −log<sub>10</sub>(4.0 × 10<sup>−2</sup>) ＝ 2 − 2log<sub>10</sub>2 ＝ 2 − 0.60 ＝ 1.40<br>
            pH ＝ 14.00 − 1.40 ＝ <strong>12.6</strong></p>
            <p><strong><u class="wavy">「電子の mol を槽ごとに割り振る」→「反応式から H<sup>+</sup>・OH<sup>−</sup> の増減を数える」→「中和させて残った側で pH」。この 3 段が電気分解 pH 問題の王道。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項④-1 工業的製法① イオン交換膜法（演習12・演習13）
// ===================================================================
const PART_MEMBRANE_HTML = `        <h4>重要事項④-1 ～工業的製法① イオン交換膜法～</h4>

        <div class="box box-note">
          <p>電気分解は、工場で大量の原料をつくるときにも使われる。高校化学の工業的製法は、<strong><u class="wavy">①イオン交換膜法（水酸化ナトリウム）②銅の電解精錬 ③アルミニウムの溶融塩電解 の 3 つ</u></strong>だけ。どれも「重要事項③で決めた極の反応」を書くだけなので、新しいことは何も増えない。</p>
        </div>

        <div class="box box-point">
          <p><strong><u>イオン交換膜法</u></strong>…塩化ナトリウム水溶液を電気分解して<strong>水酸化ナトリウム NaOH</strong> をつくる工業的製法</p>
          <p><strong>陽極室（極板は炭素 C）</strong>　NaCl 水溶液の陽極</p>
          <p>外部電源が「電子を奪い取れ」と命令する。極板の C は一途な男なので電子を渡さない。次に<strong>NaCl 中の Cl<sup>−</sup> が仕方なく</strong>電子を渡す。</p>
          <p class="formula">陽極：2Cl<sup>−</sup> → Cl<sub>2</sub> ＋ 2e<sup>−</sup></p>
          <p><strong>陰極室（極板は鉄 Fe）</strong>　NaOH 水溶液の陰極</p>
          <p>溶液中に Cu<sup>2+</sup> 以下のイオンはない。Na<sup>+</sup> は還元されないので、<strong>H<sub>2</sub>O が仕方なく</strong>電子を受け取る。液は塩基性なので OH<sup>−</sup> をつけた形で書く。</p>
          <p class="formula">陰極：2H<sup>+</sup> ＋ 2e<sup>−</sup> → H<sub>2</sub>　⇒　両辺に 2OH<sup>−</sup> を足す　⇒　2H<sub>2</sub>O ＋ 2e<sup>−</sup> → H<sub>2</sub> ＋ 2OH<sup>−</sup></p>
          <p><strong>全体</strong></p>
          <p class="formula">2H<sub>2</sub>O ＋ 2Cl<sup>−</sup> → H<sub>2</sub> ＋ Cl<sub>2</sub> ＋ 2OH<sup>−</sup><br>
          ⇒ 両辺に 2Na<sup>+</sup> を足す ⇒　2H<sub>2</sub>O ＋ 2NaCl → H<sub>2</sub> ＋ Cl<sub>2</sub> ＋ 2NaOH</p>
          <p><strong><u class="wavy">陽極に Cl<sub>2</sub>、陰極に H<sub>2</sub> と NaOH。これがイオン交換膜法の全部である。</u></strong></p>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
<svg class="lcfig lcfig-adv-electro-4" viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;width:100%;height:auto;background:#fff;border:1px solid #ddd;border-radius:4px;">
  <style>
    .learning-content .lcfig-adv-electro-4 .ttl {font:bold 14px sans-serif;fill:#16538a;text-anchor:middle}
    .learning-content .lcfig-adv-electro-4 .liq {fill:#dceefb;stroke:#7ba7c9;stroke-width:1.2}
    .learning-content .lcfig-adv-electro-4 .liq2 {fill:#e8f6ec;stroke:#7fb08c;stroke-width:1.2}
    .learning-content .lcfig-adv-electro-4 .pl {fill:#5b6470;stroke:#333;stroke-width:1.4}
    .learning-content .lcfig-adv-electro-4 .mem {stroke:#d98324;stroke-width:4;stroke-dasharray:8 5}
    .learning-content .lcfig-adv-electro-4 .wire {stroke:#333;stroke-width:2.2;fill:none}
    .learning-content .lcfig-adv-electro-4 .src {fill:#fff3e0;stroke:#d98324;stroke-width:2}
    .learning-content .lcfig-adv-electro-4 .lb {font:bold 12px sans-serif;fill:#222;text-anchor:middle}
    .learning-content .lcfig-adv-electro-4 .sm {font:11px sans-serif;fill:#444;text-anchor:middle}
    .learning-content .lcfig-adv-electro-4 .ion {font:bold 12px sans-serif;fill:#1d6fa5;text-anchor:middle}
    .learning-content .lcfig-adv-electro-4 .gas {font:bold 12px sans-serif;fill:#2e7d32;text-anchor:middle}
    .learning-content .lcfig-adv-electro-4 .iArw {stroke:#1d6fa5;stroke-width:2.4;fill:none}
  </style>

  <text class="ttl" x="360" y="24">イオン交換膜法（Na⁺ だけが膜を通る）</text>

  <rect class="src" x="290" y="42" width="140" height="40" rx="8"/>
  <text class="lb" x="360" y="67">外部電源</text>

  <path class="wire" d="M310,82 L310,100 L540,100 L540,130"/>
  <path class="wire" d="M410,82 L410,100 L180,100 L180,130"/>
  <text class="sm" x="298" y="96">（−）</text>
  <text class="sm" x="424" y="96">（＋）</text>

  <path class="liq" d="M100,170 H355 V285 H100 Z"/>
  <path class="liq2" d="M365,170 H620 V285 H365 Z"/>
  <path class="mem" d="M360,160 L360,295"/>
  <text class="lb" x="360" y="312">陽イオン交換膜</text>

  <rect class="pl" x="172" y="130" width="16" height="120"/>
  <rect class="pl" x="532" y="130" width="16" height="120"/>

  <text class="lb" x="180" y="152">陽極（C）</text>
  <text class="lb" x="540" y="152">陰極（Fe）</text>
  <text class="sm" x="180" y="286">NaCl 水溶液</text>
  <text class="sm" x="540" y="286">NaOH 水溶液</text>

  <text class="gas" x="230" y="196">Cl₂ ↑</text>
  <text class="gas" x="492" y="196">H₂ ↑</text>
  <text class="sm" x="230" y="214">2Cl⁻→Cl₂+2e⁻</text>
  <text class="sm" x="492" y="214">2H₂O+2e⁻→H₂+2OH⁻</text>

  <path class="iArw" d="M300,244 L420,244"/>
  <path class="iArw" d="M420,244 L410,239 M420,244 L410,249"/>
  <text class="ion" x="360" y="238">Na⁺</text>
  <text class="sm" x="250" y="262">Cl⁻ は通れない</text>
  <text class="sm" x="470" y="262">OH⁻ は通れない</text>
</svg>
          <figcaption><strong>陽イオン交換膜は Na<sup>+</sup> だけを通す。</strong>だから陰極室では Na<sup>+</sup> と OH<sup>−</sup> だけが集まり、純粋な NaOH 水溶液が取り出せる。</figcaption>
        </figure>

        <div class="box box-review">
          <p><strong>Q1　陽イオン交換膜って何？</strong></p>
          <p><strong>陽イオン（Na<sup>+</sup>）だけを通し、陰イオン（OH<sup>−</sup>、Cl<sup>−</sup>）は通さない膜</strong>である。この「陽イオンだけを通す」のが役割のすべて。</p>
          <p><strong>Q2　なぜ陽イオン交換膜が必要なの？</strong></p>
          <p>これは<strong>NaOH をつくる</strong>ための製法なので、いま一番恐れるのは「せっかくの NaOH が別の物質に変わること」である。<strong>Na<sup>+</sup>、OH<sup>−</sup>、Cl<sub>2</sub> の 3 つが 1 か所に集まる</strong>と、次の反応が起きてしまう。</p>
          <p class="formula">2NaOH ＋ Cl<sub>2</sub> → NaCl ＋ NaClO ＋ H<sub>2</sub>O</p>
          <p>つまり <strong>Na<sup>+</sup> と OH<sup>−</sup> だけなら NaOH ができるのに、Cl<sub>2</sub> が混ざると台無し</strong>になる。<strong><u class="wavy">だから陽極で発生した Cl<sub>2</sub> が陰極室へ行かないよう、膜で仕切っている。</u></strong></p>
        </div>

        <div class="box box-example">
          <p><strong>演習12 ★★</strong>　実験1 に関する問いに、有効数字 3 桁で答えよ。F ＝ 9.65 × 10<sup>4</sup> C/mol とする。</p>
          <p>〔実験1〕陽イオンだけを選択的に透過させる陽イオン交換膜で仕切られた電気分解装置の A 室に塩化ナトリウム飽和水溶液を、B 室に濃度 1.00 × 10<sup>−2</sup> mol/L の水酸化ナトリウム水溶液を入れ、電気分解を行った。</p>
          <p>（1）両極で起きている反応を、電子 e<sup>−</sup> を含むイオン反応式で書け。<br>
          （2）ある時間 2.00 A の電流を流して電気分解したところ、0 ℃、1.013 × 10<sup>5</sup> Pa で 0.224 L の気体が B 室から発生した。通電時間は何秒間か。発生した気体は水溶液に溶けないものとする。<br>
          （3）電気分解をしながら毎分一定体積の水を B 室に供給し、同時に同体積の溶液を取り出すと、連続的に水酸化ナトリウム水溶液が得られる。毎分 100 mL の水を B 室に供給し、濃度 1.00 × 10<sup>−2</sup> mol/L の水酸化ナトリウム水溶液を毎分 100 mL ずつ得るために必要な電流は何 A か。電気分解で反応・生成する水の量は無視できるものとする。</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>❶ すべての電極の反応をイオン反応式で表す</strong></p>
            <p>（1）A 室は NaCl 水溶液なので Cl<sup>−</sup> が酸化される（陽極）。B 室は NaOH 水溶液なので H<sub>2</sub>O が還元される（陰極）。</p>
            <p class="formula">陽極（A 室）：2Cl<sup>−</sup> → Cl<sub>2</sub> ＋ 2e<sup>−</sup><br>
            陰極（B 室）：2H<sub>2</sub>O ＋ 2e<sup>−</sup> → H<sub>2</sub> ＋ 2OH<sup>−</sup></p>
            <p><strong>❷ 電子の物質量でつなぐ（〈1〉のルート）</strong></p>
            <p>（2）B 室から出た気体は<strong>水素 H<sub>2</sub></strong>（標準状態 0.224 L）。</p>
            <p class="formula">H<sub>2</sub> ＝ 0.224 L ÷ 22.4 L/mol ＝ 0.0100 mol</p>
            <p>陰極の式より H<sub>2</sub> 1 mol に電子 2 mol。</p>
            <p class="formula">電子 ＝ 0.0100 mol × 2 ＝ 0.0200 mol<br>
            Q ＝ 0.0200 mol × 9.65 × 10<sup>4</sup> C/mol ＝ 1930 C<br>
            t ＝ 1930 C ÷ 2.00 A ＝ <strong>965 秒（9.65 × 10<sup>2</sup> 秒）</strong></p>
            <p>（3）1 分間に生成すべき OH<sup>−</sup> を先に出す。</p>
            <p class="formula">1.00 × 10<sup>−2</sup> mol/L × 0.100 L ＝ 1.00 × 10<sup>−3</sup> mol</p>
            <p>陰極の式は 2H<sub>2</sub>O ＋ 2e<sup>−</sup> → H<sub>2</sub> ＋ 2OH<sup>−</sup> なので、<strong>OH<sup>−</sup> と電子は 1 : 1</strong>（2e<sup>−</sup> で 2OH<sup>−</sup>）。よって 1 分間に必要な電子も 1.00 × 10<sup>−3</sup> mol。</p>
            <p class="formula">Q ＝ 1.00 × 10<sup>−3</sup> mol × 9.65 × 10<sup>4</sup> C/mol ＝ 96.5 C<br>
            I ＝ 96.5 C ÷ 60 s ＝ 1.608… ≒ <strong>1.61 A</strong></p>
            <p><strong><u class="wavy">「OH<sup>−</sup> と電子は 1 : 1」を見抜けるかどうかだけの問題。係数 2 と 2 に惑わされて 2 倍しないこと。</u></strong></p>
          </details>
        </div>

        <div class="box box-example">
          <p><strong>演習13 ★★★</strong>　電解槽を陽イオン交換膜と陰イオン交換膜で交互に仕切り、電極として A 室に黒鉛（陽極）、E 室に鉄（陰極）を浸して電気分解を行った。A〜E の各室には、はじめ 0.50 mol/L の塩化ナトリウム水溶液を 1.0 L ずつ入れ、0.20 mol の電子が流れるまで電気分解を行った。電解後、各室における塩化ナトリウムのモル濃度の比（A : B : C : D : E）を、最も簡単な整数比で示せ。電解液の体積変化および発生した気体の溶解は無視できるものとする。（京大 改）</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>答え　5 : 3 : 7 : 3 : 5</strong></p>
            <p><strong>❶ 両端の電極の反応を書く</strong></p>
            <p class="formula">陽極（A 室・黒鉛）：2Cl<sup>−</sup> → Cl<sub>2</sub> ＋ 2e<sup>−</sup><br>
            陰極（E 室・鉄）：2H<sub>2</sub>O ＋ 2e<sup>−</sup> → H<sub>2</sub> ＋ 2OH<sup>−</sup></p>
            <p><strong>❸ 応用〈2〉イオンの動きを考える</strong></p>
            <p>電子 0.20 mol が流れたので、A 室では Cl<sup>−</sup> が 0.20 mol 消費される。そして<strong>「陽極側（陽性が強い）には陰イオンが集まる」「陰極側（陰性が強い）には陽イオンが集まる」</strong>。膜が交互なので、Cl<sup>−</sup> は陽極方向へ、Na<sup>+</sup> は陰極方向へ、それぞれ通れる膜を越えて 0.20 mol ずつ移動する。</p>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr><th>室</th><th>出入り</th><th>NaCl として存在する量</th></tr>
                </thead>
                <tbody>
                  <tr><td>A</td><td>Cl<sup>−</sup> が 0.20 mol 反応で消費、B から Cl<sup>−</sup> が 0.20 mol 流入</td><td>0.50 mol（変化なし）</td></tr>
                  <tr><td>B</td><td>A へ Cl<sup>−</sup> が 0.20 mol、C へ Na<sup>+</sup> が 0.20 mol 脱出</td><td>0.30 mol（減少）</td></tr>
                  <tr><td>C</td><td>B から Na<sup>+</sup>、D から Cl<sup>−</sup> がそれぞれ 0.20 mol 流入</td><td>0.70 mol（増加）</td></tr>
                  <tr><td>D</td><td>C へ Cl<sup>−</sup>、E へ Na<sup>+</sup> がそれぞれ 0.20 mol 脱出</td><td>0.30 mol（減少）</td></tr>
                  <tr><td>E</td><td>D から Na<sup>+</sup> が 0.20 mol 流入するが、NaCl として存在できる量は<strong>もとの Cl<sup>−</sup> の量に縛られる</strong></td><td>0.50 mol（変化なし）</td></tr>
                </tbody>
              </table>
            </div>
            <p>体積はどれも 1.0 L なので、モル濃度の比はそのまま物質量の比。</p>
            <p class="formula">A : B : C : D : E ＝ 0.50 : 0.30 : 0.70 : 0.30 : 0.50 ＝ <strong>5 : 3 : 7 : 3 : 5</strong></p>
            <p>E 室に流れ込んだ Na<sup>+</sup> は、相手の Cl<sup>−</sup> がいないので <strong>NaOH として存在する</strong>（陰極で OH<sup>−</sup> ができているため）。<strong><u class="wavy">「NaCl の量を聞かれたら、Na<sup>+</sup> と Cl<sup>−</sup> の少ないほうで決まる」という視点が決め手。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項④-2 工業的製法② 銅の電解精錬（演習14）
// ===================================================================
const PART_REFINING_HTML = `        <h4>重要事項④-2 ～工業的製法② 銅の電解精錬～</h4>

        <div class="box box-point">
          <p><strong><u>電解精錬</u></strong>…電気分解によって金属の純度を高めること</p>
          <p>銅の電解精錬は、演習9(4)の「両極とも Cu 電極の硫酸銅(Ⅱ)水溶液」とまったく同じに見える。<strong><u class="wavy">違いは、陽極の銅（粗銅）に銅以外の不純物が混ざっていることだけ。</u></strong></p>
          <ul>
            <li>原料　主に<strong>黄銅鉱 CuFeS<sub>2</sub></strong></li>
            <li><strong><u>粗銅</u></strong>…不純物を含む銅（純度約 99 %）＝<strong>陽極</strong>にする</li>
            <li><strong><u>純銅</u></strong>…ほとんど不純物を含まない銅＝<strong>陰極</strong>にする</li>
            <li>電解液　硫酸を加えた<strong>硫酸銅(Ⅱ)水溶液</strong></li>
          </ul>
        </div>

        <div class="box box-test">
          <p><strong><u>陽極（粗銅）で起こること</u></strong></p>
          <p>極板の Cu は「すぐ浮気する男」なので、極板自身が溶ける。</p>
          <p class="formula">Cu → Cu<sup>2+</sup> ＋ 2e<sup>−</sup></p>
          <p>不純物は<strong>イオン化傾向で 2 つに分かれる</strong>。</p>
          <ul>
            <li><strong>不純物❶　Cu よりイオン化傾向が大きい金属（Zn、Fe、Ni、Pb など）</strong><br>
            Cu と一緒に溶けてイオンになる。例）Ni → Ni<sup>2+</sup> ＋ 2e<sup>−</sup></li>
            <li><strong>不純物❷　Cu よりイオン化傾向が小さい金属（Ag、Au、Pt）</strong><br>
            溶けずに<strong><u>陽極泥</u></strong>として陽極の下に沈殿する</li>
          </ul>
          <p><strong>Pb だけは例外的な動き</strong>をする。いったん Pb<sup>2+</sup> になるが、電解液の SO<sub>4</sub><sup>2−</sup> とすぐ結びついて <strong>PbSO<sub>4</sub>（水に不溶）</strong>となり沈殿する。</p>
          <p><strong><u>陰極（純銅）で起こること</u></strong></p>
          <p>溶液中のイオンのうち、電子を受け取れるのは <strong>Cu<sup>2+</sup> 以下</strong>のものだけ。</p>
          <p class="formula">Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu</p>
          <p><strong><u class="wavy">Zn<sup>2+</sup>、Fe<sup>2+</sup>、Ni<sup>2+</sup> は溶けたまま溶液中に残り、陰極には析出しない。だから陰極には純度の高い銅だけがつく。</u></strong></p>
        </div>

        <div class="box box-review">
          <p><strong>Q　なぜ 0.3 V という低電圧で行うの？</strong></p>
          <p>電圧を上げると、<strong>Cu より先には析出しないはずの Zn<sup>2+</sup>、Ni<sup>2+</sup>、Fe<sup>2+</sup> まで無理に還元されてしまう</strong>。すると陰極に不純物が混ざって純度が落ちる。<strong><u class="wavy">「Cu だけが析出する、ぎりぎり低い電圧」で回すのが電解精錬のコツ。</u></strong></p>
        </div>

        <div class="box box-example">
          <p><strong>演習14 ★★</strong>　次の文を読んで、あとの問いに答えよ。（原子量：Ni ＝ 59、Cu ＝ 64、Ag ＝ 108）</p>
          <p>黄銅鉱（主成分 CuFeS<sub>2</sub>）は、コークス、石灰石、ケイ砂とともに溶鉱炉に入れて強熱すると、還元されて硫化銅(Ⅰ)が分離される。<u class="q">(a) これを転炉に移し、高温の空気を吹き込むと粗銅が得られる。</u>この粗銅は銅の純度が約 99 % で、不純物として Zn、Au、Ag、Fe、Ni、Pb を含むとする。高純度の銅を得るために、電解液として硫酸を加えた ［ ア ］ 水溶液を用い、粗銅板を ［ イ ］ 極、純銅板を ［ ウ ］ 極として、<u class="q">(b) 0.3 V 程度の低電圧で電気分解を行う。</u>すると、陽極では主に ［ (ⅰ) ］ の反応が、陰極では主に ［ (ⅱ) ］ の反応が起こる。このとき、粗銅中の不純物のうち ［ エ ］ はイオン化しないで陽極の下へ沈殿するが、［ オ ］ はイオン化するが陰極には析出せず溶液中にそのまま残る。ただし ［ カ ］ はいったんイオン化するが、直ちに不溶性の塩を形成して沈殿する。このように、電気分解により金属の純度を高める方法を一般に ［ キ ］ という。</p>
          <p>（1）文中の［　］に適当な語句・元素名を、［ (ⅰ) ］［ (ⅱ) ］に e<sup>−</sup> を含む反応式を書け。<br>
          （2）下線部 (a) を化学反応式で書け。<br>
          （3）下線部 (b) で、0.3 V 程度の低電圧で電気分解を行う理由を説明せよ。<br>
          （4）硫酸銅(Ⅱ)水溶液 1.0 L と、不純物として Ni と Ag を含んだ粗銅を陽極に、純銅を陰極に用いて上記の方法で電気分解を行ったところ、粗銅は 2.00 g 減少し、純銅は 1.92 g 増加し、さらに水溶液中の銅(Ⅱ)イオンは 0.010 mol だけ減少した。このことから、陽極泥として沈殿した金属の質量を求めよ。〔横浜国大 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p>（1）ア <strong>硫酸銅(Ⅱ)</strong>　イ <strong>陽</strong>　ウ <strong>陰</strong><br>
            エ <strong>Ag、Au</strong>（銅よりイオン化傾向が小さい）<br>
            オ <strong>Ni、Zn、Fe</strong>（銅よりイオン化傾向が大きい）<br>
            カ <strong>Pb</strong>（Pb<sup>2+</sup> が SO<sub>4</sub><sup>2−</sup> と結合して PbSO<sub>4</sub> として沈殿）<br>
            キ <strong>電解精錬</strong></p>
            <p class="formula">（ⅰ）陽極：Cu → Cu<sup>2+</sup> ＋ 2e<sup>−</sup><br>
            （ⅱ）陰極：Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu</p>
            <p>（2）硫化銅(Ⅰ) Cu<sub>2</sub>S に空気（O<sub>2</sub>）を吹き込む反応。</p>
            <p class="formula">Cu<sub>2</sub>S ＋ O<sub>2</sub> → 2Cu ＋ SO<sub>2</sub></p>
            <p>（3）電圧を高くすると、粗銅中の<strong>銅よりイオン化傾向の大きい不純物金属（Zn、Ni、Fe など）が陰極で還元されて析出してしまう</strong>ため、純度の高い銅が得られなくなる。よって低電圧で電気分解する必要がある。</p>
            <p>（4）<strong>0.13 g</strong></p>
            <p><strong>❶ 流れた電子の物質量を、陰極（純銅）から出す。</strong></p>
            <p class="formula">析出した Cu ＝ 1.92 g ÷ 64 g/mol ＝ 0.030 mol<br>
            Cu<sup>2+</sup> ＋ 2e<sup>−</sup> → Cu より　電子 ＝ 0.030 × 2 ＝ 0.060 mol</p>
            <p><strong>❷ 陽極で溶けた Cu の物質量を、Cu<sup>2+</sup> の収支から出す。</strong>溶液中の Cu<sup>2+</sup> は 0.010 mol 減っている。つまり「陰極で消えた分」より「陽極から出た分」が 0.010 mol 少ない。</p>
            <p class="formula">陽極で溶けた Cu ＝ 0.030 − 0.010 ＝ 0.020 mol<br>
            質量 ＝ 0.020 mol × 64 g/mol ＝ 1.28 g</p>
            <p><strong>❸ 残りの電子は Ni が出したと考える。</strong></p>
            <p class="formula">Cu 由来の電子 ＝ 0.020 × 2 ＝ 0.040 mol<br>
            Ni 由来の電子 ＝ 0.060 − 0.040 ＝ 0.020 mol</p>
            <p>Ni → Ni<sup>2+</sup> ＋ 2e<sup>−</sup> なので、溶けた Ni は電子の半分。</p>
            <p class="formula">Ni ＝ 0.020 ÷ 2 ＝ 0.010 mol<br>
            質量 ＝ 0.010 mol × 59 g/mol ＝ 0.59 g</p>
            <p><strong>❹ 陽極の減少量から引き算する。</strong>Ag は溶けずに落ちるので、それが陽極泥である。</p>
            <p class="formula">陽極泥 ＝ 2.00 − 1.28 − 0.59 ＝ <strong>0.13 g</strong></p>
            <p><strong><u class="wavy">「陰極から電子の総量」→「Cu<sup>2+</sup> の収支から陽極の Cu」→「余った電子は Ni」→「引き算で陽極泥」。この 4 手順が電解精錬の計算の定型。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 重要事項④-3 工業的製法③ アルミニウムの溶融塩電解（演習15）
// ===================================================================
const PART_ALUMINUM_HTML = `        <h4>重要事項④-3 ～工業的製法③ アルミニウムの溶融塩電解～</h4>

        <div class="box box-point">
          <p><strong><u>溶融塩電解</u></strong>（＝<strong><u>融解塩電解</u></strong>）とは、<strong><u>固体を融解させてから行う電気分解</u></strong>のこと。目的は<strong><u class="wavy">イオン化傾向の大きい金属イオンを還元して、金属の単体を取り出すこと</u></strong>である。</p>
        </div>

        <div class="box box-memory">
          <p><strong>「独身が大好き」の金属は、水溶液では単体にならない</strong></p>
          <p>イオン化傾向が大きい（＝<strong>「独身が大好き」＝イオンのままでいたい</strong>）金属は、外部電源（社長）がいくら「電子を受け取れ」と命令しても、素直には従わない。水溶液中では、</p>
          <p><strong><u class="wavy">Al<sup>3+</sup> が還元される前に、より還元されやすい H<sub>2</sub>O が先に還元されて H<sub>2</sub> が発生してしまう。</u></strong></p>
          <p>だから水溶液の電気分解ではアルミニウムの単体は絶対に得られない。<strong>水を追い出すために、いったん強熱して融解させてから電気分解する</strong>——これが溶融塩電解の発想である。</p>
        </div>

        <div class="box box-point">
          <p><strong>アルミニウムの工業的製法（2 ステップ）</strong></p>
          <p><strong>❶</strong> <strong><u>ボーキサイト</u></strong>（Al<sub>2</sub>O<sub>3</sub>・nH<sub>2</sub>O など）を精製して、<strong><u>酸化アルミニウム Al<sub>2</sub>O<sub>3</sub>（アルミナ）</u></strong>を得る。</p>
          <p><strong>❷</strong> <strong><u>氷晶石 Na<sub>3</sub>AlF<sub>6</sub></u></strong>を融解して溶媒とし、そこに Al<sub>2</sub>O<sub>3</sub> を溶かして<strong><u>溶融塩電解</u></strong>し、アルミニウムを得る。</p>
        </div>

        <div class="box box-memory">
          <p><strong>氷晶石 Na<sub>3</sub>AlF<sub>6</sub> の覚え方</strong></p>
          <p>「氷晶石<strong>波（Na<sub>3</sub>）</strong>、<strong>ある風呂（AlF<sub>6</sub>）</strong>」＝ <strong>Na<sub>3</sub>AlF<sub>6</sub></strong></p>
        </div>

        <div class="box box-test">
          <p><strong>Q　なぜ氷晶石なんてものを使うの？</strong></p>
          <p>さきほどの「一度強熱して融解させてから電気分解する」というところに注目してほしい。<strong>Al<sub>2</sub>O<sub>3</sub> はそのままだと融点が約 2050 ℃</strong>もあり、工業的に融かすのは現実的でない。そこで氷晶石を加えると、</p>
          <p class="formula">Al<sub>2</sub>O<sub>3</sub> 単独：融点 約 2050 ℃　→　氷晶石に溶かす：約 960 ℃ で融解</p>
          <p><strong><u class="wavy">氷晶石は「融点を下げて融かしやすくする溶媒」である。</u></strong>これが記述問題の答えになる。</p>
        </div>

        <figure style="text-align:center;margin:20px 0;padding:16px;background:#fafcfe;border:1px solid #d6e4ec;border-radius:8px;">
          <svg viewBox="0 0 720 300" width="100%" style="max-width:640px;height:auto;" class="lcfig-adv-electro-5" role="img" aria-label="アルミニウムの溶融塩電解の模式図">
            <style>
              .learning-content .lcfig-adv-electro-5 .bath { fill:#fdf0e3; stroke:#c98b3a; stroke-width:2.5; }
              .learning-content .lcfig-adv-electro-5 .elec { fill:#4a4a4a; stroke:#222; stroke-width:2; }
              .learning-content .lcfig-adv-electro-5 .metal { fill:#c0c8d0; stroke:#7b8794; stroke-width:2; }
              .learning-content .lcfig-adv-electro-5 .wire { fill:none; stroke:#2b6cb0; stroke-width:2.5; }
              .learning-content .lcfig-adv-electro-5 .lbl { font-size:14px; fill:#1a3550; font-weight:700; }
              .learning-content .lcfig-adv-electro-5 .sub { font-size:12px; fill:#40566d; }
              .learning-content .lcfig-adv-electro-5 .pos { font-size:15px; fill:#c0392b; font-weight:700; }
              .learning-content .lcfig-adv-electro-5 .neg { font-size:15px; fill:#1f6fb2; font-weight:700; }
            </style>
            <!-- 外部電源 -->
            <circle cx="360" cy="34" r="20" fill="#fff" stroke="#2b6cb0" stroke-width="2.5"/>
            <text x="360" y="40" text-anchor="middle" class="lbl">電源</text>
            <path class="wire" d="M340 34 H150 V96"/>
            <path class="wire" d="M380 34 H570 V96"/>
            <text x="150" y="26" text-anchor="middle" class="pos">＋（陽極）</text>
            <text x="570" y="26" text-anchor="middle" class="neg">−（陰極）</text>
            <!-- 電解槽 -->
            <path class="bath" d="M90 100 H630 V250 H90 Z"/>
            <text x="360" y="128" text-anchor="middle" class="lbl">融解した Al<tspan dy="4" font-size="9">2</tspan><tspan dy="-4">O</tspan><tspan dy="4" font-size="9">3</tspan><tspan dy="-4"> ＋ 氷晶石 Na</tspan><tspan dy="4" font-size="9">3</tspan><tspan dy="-4">AlF</tspan><tspan dy="4" font-size="9">6</tspan><tspan dy="-4">（約 960 ℃）</tspan></text>
            <!-- 陽極（炭素） -->
            <rect class="elec" x="136" y="96" width="28" height="90"/>
            <text x="150" y="204" text-anchor="middle" class="lbl">炭素 C</text>
            <text x="150" y="222" text-anchor="middle" class="sub">CO・CO₂ になって消耗</text>
            <!-- 陰極（槽の底の炭素）＋ 融解Al -->
            <rect class="elec" x="556" y="96" width="28" height="90"/>
            <text x="570" y="204" text-anchor="middle" class="lbl">炭素 C</text>
            <path class="metal" d="M110 226 H610 V244 H110 Z"/>
            <text x="360" y="240" text-anchor="middle" class="sub">融解した Al（比重が大きく底にたまる）</text>
            <!-- 反応式 -->
            <text x="200" y="160" class="pos">C ＋ O²⁻ → CO ＋ 2e⁻</text>
            <text x="200" y="180" class="pos">C ＋ 2O²⁻ → CO₂ ＋ 4e⁻</text>
            <text x="430" y="170" class="neg">Al³⁺ ＋ 3e⁻ → Al</text>
          </svg>
          <figcaption style="font-size:0.86rem;color:#40566d;margin-top:8px;">アルミニウムの溶融塩電解。陽極の炭素は自分が酸化されて CO・CO<sub>2</sub> となり消耗する。</figcaption>
        </figure>

        <div class="box box-point">
          <p><strong>陽極室（極板は炭素 C）</strong>　溶融塩電解の高温によって、<strong><u>極板の炭素そのものが酸化される</u></strong>。</p>
          <p class="formula">① C ＋ O<sup>2−</sup> → CO ＋ 2e<sup>−</sup><br>
          ② C ＋ 2O<sup>2−</sup> → CO<sub>2</sub> ＋ 4e<sup>−</sup></p>
          <p><strong><u class="wavy">陽極の炭素電極は CO や CO₂ になって消耗するため、定期的に交換が必要である。</u></strong></p>
          <p><strong>陰極室（極板は炭素 C）</strong>　融解した Al<sup>3+</sup> が電子を受け取り、<strong><u>アルミニウムの単体</u></strong>が得られる。</p>
          <p class="formula">Al<sup>3+</sup> ＋ 3e<sup>−</sup> → Al</p>
        </div>

        <div class="box box-note">
          <p><strong>電子の本数だけは絶対に間違えない</strong></p>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>反応</th><th>1 mol あたりに動く電子</th></tr>
              </thead>
              <tbody>
                <tr><td>C ＋ O<sup>2−</sup> → CO ＋ 2e<sup>−</sup></td><td>CO 1 mol につき <strong>2 mol</strong></td></tr>
                <tr><td>C ＋ 2O<sup>2−</sup> → CO<sub>2</sub> ＋ 4e<sup>−</sup></td><td>CO<sub>2</sub> 1 mol につき <strong>4 mol</strong></td></tr>
                <tr><td>Al<sup>3+</sup> ＋ 3e<sup>−</sup> → Al</td><td>Al 1 mol につき <strong>3 mol</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p><strong><u class="wavy">「陽極の気体から電子を数え、その電子を 3 で割れば Al」——これが溶融塩電解の計算の骨格。</u></strong></p>
        </div>

        <div class="box box-example">
          <p><strong>演習15 ★★★</strong>　〈アルミニウムの溶融塩電解〉　アルミニウムの製錬は次の 4 工程よりなる。あとの各問いに答えよ。ただし、原子量は C ＝ 12、O ＝ 16、Al ＝ 27、ファラデー定数 F ＝ 96500 C/mol とする。</p>
          <p>① <u class="q">ボーキサイト（主成分は Al<sub>2</sub>O<sub>3</sub>・nH<sub>2</sub>O）を焼いて水分と有機物を除き、粉砕後、濃い水酸化ナトリウム水溶液に入れ、主成分の酸化アルミニウムをテトラヒドロキシドアルミン酸ナトリウムとして溶かす。</u>このとき、不純物の Fe<sub>2</sub>O<sub>3</sub> や SiO<sub>2</sub> は溶けずに沈殿する。<br>
          ② 不純物を除いたろ液に<u class="q">水を加えると、加水分解が起こり水酸化アルミニウムが沈殿する。</u><br>
          ③ <u class="q">この沈殿を取り出し、約 1200 ℃ で強熱すると、白色粉末状の純粋な酸化アルミニウム（アルミナともいう）が得られる。</u><br>
          ④ 酸化アルミニウムを氷晶石（Na<sub>3</sub>AlF<sub>6</sub>）とともに、黒鉛張りの電解槽の中で黒鉛を電極として融解状態で電気分解する。このような電解を溶融塩電解という。陰極には融解状態のアルミニウムが得られるが、陽極では電極の黒鉛と酸素が反応して、いったん二酸化炭素が生成するが、その一部は高温の黒鉛によって還元されて一酸化炭素に変化し、次式の平衡が成立する。</p>
          <p class="formula">CO<sub>2</sub> ＋ C（黒鉛） ⇄ 2CO　……（a）</p>
          <p>したがって、陽極では一酸化炭素と二酸化炭素の混合気体が発生し、陽極の黒鉛は次第に消耗する。</p>
          <p>（1）①〜③の下線部の変化を、化学反応式で表せ。<br>
          （2）この電気分解における氷晶石の役割を簡単に説明せよ。<br>
          （3）アルミニウム塩の水溶液の電気分解では、アルミニウムの単体は得られない。この理由を説明せよ。<br>
          （4）この電解では、陽極から標準状態に換算して 2240 L の気体が発生し、ガス分析の結果、一酸化炭素と二酸化炭素の物質量の比が 2 : 3 であることがわかった。<br>
          　（ⅰ）陰極で生成したアルミニウムは何 kg か。<br>
          　（ⅱ）消費された陽極の黒鉛は何 kg か。<br>
          （5）この電気分解で、50 A の電流を 200 時間流したとすると、流した電気量のうち実際に電気分解に使われた電気量の割合（これを電流効率という）は何 % か。〔帯広畜産大 改〕</p>
          <details>
            <summary>💡 解答・解説を表示</summary>
            <p><strong>（1）</strong></p>
            <p class="formula">① Al<sub>2</sub>O<sub>3</sub> ＋ 2NaOH ＋ 3H<sub>2</sub>O → 2Na[Al(OH)<sub>4</sub>]<br>
            ② Na[Al(OH)<sub>4</sub>] → Al(OH)<sub>3</sub> ＋ NaOH<br>
            ③ 2Al(OH)<sub>3</sub> → Al<sub>2</sub>O<sub>3</sub> ＋ 3H<sub>2</sub>O</p>
            <p>①は<strong>両性酸化物 Al<sub>2</sub>O<sub>3</sub> が強塩基に溶ける</strong>反応。錯イオンの名前「テトラヒドロキシドアルミン酸ナトリウム」がそのまま Na[Al(OH)<sub>4</sub>] を意味している。②は加水分解で OH<sup>−</sup> が 1 個外れて Al(OH)<sub>3</sub> が沈殿。③は<strong>水酸化物 → 酸化物の脱水</strong>（強熱すると水が抜ける）。</p>
            <p><strong>（2）</strong>Al<sub>2</sub>O<sub>3</sub>（酸化アルミニウム）は融点が約 2050 ℃ と非常に高いため、そのままでは融解しにくい。<strong>氷晶石を加えると融点を約 960 ℃ まで下げることができ、電気分解を行いやすくする役割がある。</strong></p>
            <p><strong>（3）</strong>Al<sup>3+</sup> は<strong>イオン化傾向が非常に大きい</strong>（Na より少し小さい程度）ため、水溶液中で Al<sup>3+</sup> が還元される前に、<strong>より還元されやすい水（H<sub>2</sub>O）が先に還元されて水素が発生してしまう</strong>。そのため、アルミニウム塩の水溶液を電気分解しても、陰極では H<sub>2</sub> が発生するだけで、アルミニウムの単体は得られない。</p>
            <p><strong>（4）（ⅰ）2.88 kg</strong></p>
            <p><strong>❶ 陽極で発生した気体の総物質量を出す。</strong></p>
            <p class="formula">2240 L ÷ 22.4 L/mol ＝ 100 mol</p>
            <p><strong>❷ CO : CO<sub>2</sub> ＝ 2 : 3 で内訳を出す。</strong></p>
            <p class="formula">CO ＝ 100 × 2/5 ＝ 40 mol　　CO<sub>2</sub> ＝ 100 × 3/5 ＝ 60 mol</p>
            <p><strong>❸ 気体から電子の総量を数える。</strong>陽極の反応式は C ＋ O<sup>2−</sup> → CO ＋ 2e<sup>−</sup>、C ＋ 2O<sup>2−</sup> → CO<sub>2</sub> ＋ 4e<sup>−</sup>。</p>
            <p class="formula">CO 由来の電子 ＝ 40 × 2 ＝ 80 mol<br>
            CO<sub>2</sub> 由来の電子 ＝ 60 × 4 ＝ 240 mol<br>
            <strong>電子の総量 ＝ 80 ＋ 240 ＝ 320 mol</strong></p>
            <p><strong>❹ 陰極の反応 Al<sup>3+</sup> ＋ 3e<sup>−</sup> → Al で Al に換える。</strong></p>
            <p class="formula">Al ＝ 320 ÷ 3 ≒ 106.7 mol<br>
            質量 ＝ 106.7 × 27 ≒ 2880 g ＝ <strong>2.88 kg</strong></p>
            <p><strong>（ⅱ）1.20 kg</strong></p>
            <p>消費された炭素は、CO と CO<sub>2</sub> のそれぞれの生成に使われた炭素の合計。<strong>どちらの式も C は 1 個ずつ</strong>なので、気体の総物質量がそのまま炭素の物質量になる。</p>
            <p class="formula">C ＝ 40（CO 由来）＋ 60（CO<sub>2</sub> 由来）＝ 100 mol<br>
            質量 ＝ 100 × 12 ＝ 1200 g ＝ <strong>1.20 kg</strong></p>
            <p><strong>（5）85.8 %</strong></p>
            <p><strong>❶ 流した全電気量（分母）</strong></p>
            <p class="formula">Q ＝ 50 A × (200 × 3600 s) ＝ 3.6 × 10<sup>7</sup> C</p>
            <p><strong>❷ 実際に電気分解に使われた電気量（分子）</strong>——(4) で求めた電子 320 mol が「本当に働いた分」。</p>
            <p class="formula">320 mol × 96500 C/mol ＝ 3.088 × 10<sup>7</sup> C</p>
            <p><strong>❸ 割り算</strong></p>
            <p class="formula">電流効率 ＝ (3.088 × 10<sup>7</sup>) ÷ (3.6 × 10<sup>7</sup>) × 100 ≒ <strong>85.8 %</strong></p>
            <p><strong><u class="wavy">電流効率＝「生成物から逆算した電気量」÷「流した電気量」。分子は必ず“できたもの”から求める。</u></strong></p>
          </details>
        </div>
`;

// ===================================================================
// 総まとめ
// ===================================================================
const SUMMARY_HTML = `        <h4>この単元の総まとめ</h4>

        <div class="box box-note">
          <p><strong>試験前に確認する8点</strong></p>
          <ol>
            <li><strong>電池は「負極・正極」、電気分解は「陰極・陽極」</strong>。言葉を混ぜたら即失点</li>
            <li>電池の<strong>負極＝酸化される＝電子を出す</strong>、正極＝還元される＝電子を受け取る</li>
            <li>電気分解の<strong>陰極＝外部電源から電子をもらう＝還元</strong>、陽極＝電子を取られる＝酸化</li>
            <li>どちらが溶けるかは<strong>イオン化傾向</strong>で決める（「貸そか な まあ あて に すな ひど す ぎ 借金」）</li>
            <li>電池式は <strong>（−）負極 | 電解液 | 正極（＋）</strong>。3 本セット（負極・正極・全体）で書く</li>
            <li>ファラデーの法則は <strong>Q ＝ I × t</strong>、<strong>電子 ＝ Q ÷ 96500</strong>、そこから<strong>係数比</strong>で質量・体積へ</li>
            <li>陽極が <strong>Cu・Ag なら極板が溶ける</strong>、<strong>Pt・C なら溶液のイオン（Cl<sup>−</sup> → 次に H<sub>2</sub>O）</strong>が犠牲になる</li>
            <li>工業的製法 3 種は<strong>「イオン交換膜法（NaOH）／電解精錬（Cu）／溶融塩電解（Al）」</strong>をセットで</li>
          </ol>
          <p><strong><u class="wavy">迷ったら「電子はどこから出て、どこへ入るか」だけを紙に矢印で描く。それで 9 割の問題は解ける。</u></strong></p>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>比べる項目</th><th>電池（放電）</th><th>電気分解</th></tr>
            </thead>
            <tbody>
              <tr><td>電源</td><td>自分が電源になる</td><td>外部電源につながれる</td></tr>
              <tr><td>電極の呼び名</td><td>負極・正極</td><td>陰極・陽極</td></tr>
              <tr><td>酸化が起こる極</td><td><strong>負極</strong></td><td><strong>陽極</strong></td></tr>
              <tr><td>還元が起こる極</td><td><strong>正極</strong></td><td><strong>陰極</strong></td></tr>
              <tr><td>電子が導線に出ていく極</td><td>負極</td><td>陽極（電源に吸われる）</td></tr>
              <tr><td>反応の向き</td><td>自発的（ΔG &lt; 0）</td><td>無理やり（電気エネルギーを投入）</td></tr>
            </tbody>
          </table>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>覚えておくと速い値・式</th><th>内容</th></tr>
            </thead>
            <tbody>
              <tr><td>ファラデー定数 F</td><td>9.65 × 10<sup>4</sup> C/mol</td></tr>
              <tr><td>電気量</td><td>Q [C] ＝ I [A] × t [s]</td></tr>
              <tr><td>電子の物質量</td><td>Q ÷ 96500 [mol]</td></tr>
              <tr><td>気体 1 mol の体積（標準状態）</td><td>22.4 L</td></tr>
              <tr><td>ボルタ電池の起電力</td><td>約 1.1 V</td></tr>
              <tr><td>ダニエル電池の起電力</td><td>約 1.1 V</td></tr>
              <tr><td>鉛蓄電池の起電力</td><td>約 2.0 V</td></tr>
              <tr><td>Al<sub>2</sub>O<sub>3</sub> の融点 → 氷晶石を加えると</td><td>約 2050 ℃ → 約 960 ℃</td></tr>
            </tbody>
          </table>
        </div>
`;

/**
 * 電池と電気分解の「重要事項」一覧。
 * LearningViewer がこの配列からボタン（チップ）を並べ、
 * 選ばれた重要事項だけを描画する。順番はプリントの並びそのまま。
 */
export const ADV_ELECTRO_PARTS: LearningPart[] = [
  { id: 'intro', no: '', title: 'この単元のゴール', short: 'ゴール・復習', html: HEAD_HTML },
  { id: 'p1', no: '①', title: '酸化還元反応と電子の移動（電池のしくみの土台）', short: '① 酸化還元の復習', html: PART_REDOX_HTML },
  { id: 'p2', no: '②', title: '電池（しくみ・電池式）', short: '② 電池のしくみ', html: PART_CELL_HTML },
  { id: 'p2t', no: '', title: '定期テスト・入試に出やすいこと① ファラデーの法則', short: '★ 出やすい① ファラデー', html: PART_FARADAY_HTML },
  { id: 'p2b', no: '②', title: '電池（2）ボルタ電池とダニエル電池', short: '②-2 ボルタ・ダニエル', html: PART_VOLTA_HTML },
  { id: 'p2c', no: '②', title: '電池（3）燃料電池', short: '②-3 燃料電池', html: PART_FUELCELL_HTML },
  { id: 'p2d', no: '②', title: '電池（4）鉛蓄電池と放電・充電', short: '②-4 鉛蓄電池', html: PART_LEAD_HTML },
  { id: 'p2e', no: '②', title: '電池（5）実用電池（一次電池と二次電池）', short: '②-5 実用電池', html: PART_PRACTICAL_HTML },
  { id: 'p3', no: '③', title: '電気分解', short: '③ 電気分解', html: PART_ELECTROLYSIS_HTML },
  { id: 'p3t', no: '', title: '定期テスト・入試に出やすいこと② 電気分解問題の思考方法', short: '★ 出やすい② 思考方法', html: PART_HOWTO_HTML },
  { id: 'p4a', no: '④', title: '工業的製法（1）イオン交換膜法', short: '④-1 イオン交換膜法', html: PART_MEMBRANE_HTML },
  { id: 'p4b', no: '④', title: '工業的製法（2）銅の電解精錬', short: '④-2 銅の電解精錬', html: PART_REFINING_HTML },
  { id: 'p4c', no: '④', title: '工業的製法（3）アルミニウムの溶融塩電解', short: '④-3 溶融塩電解', html: PART_ALUMINUM_HTML },
  { id: 'summary', no: '', title: 'この単元の総まとめ', short: '★ 総まとめ', html: SUMMARY_HTML },
];

/**
 * 従来どおりの「全部つなげた 1 本」の本文。
 * 「すべて表示」を選んだときと、印刷（章まるごとの配布プリント）で使う。
 */
export const ADV_ELECTRO_HTML = ADV_ELECTRO_PARTS.map(p => p.html).join('\n');
