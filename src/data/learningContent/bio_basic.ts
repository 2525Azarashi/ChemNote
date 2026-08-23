/**
 * ===================================================================
 * まとめプリント：生物基礎（共通テスト完全対応）
 * ===================================================================
 *
 * ■ 位置づけ
 *   adv_thermo.ts / math_integral.ts と完全に同じ構造・同じ記法で書く。
 *   LearningPart[] を並べて BIO_BASIC_PARTS とし、その html を連結した
 *   ものが BIO_BASIC_HTML（「すべて」タブ＋印刷用）になる。
 *
 * ■ 記法のルール（化学側と完全に共通）
 *   語句   … <strong><u>…</u></strong>             太字＋太い直線（黒）
 *   文章   … <strong><u class="wavy">…</u></strong> 太字＋太い波線（黒）
 *   ・裸の下線タグは使わない（必ず strong の直下に置く）
 *   ・化学式・数値は HTML の <sup>/<sub> で直接書く
 *
 * ■ 内容の設計
 *   共通テスト「生物基礎」の全範囲（生物の特徴／遺伝子とその働き／
 *   体内環境の維持／植生と遷移・バイオーム／生態系とその保全）を
 *   5 つのパートで網羅する。定番のセンター・共通テスト対策講義が
 *   扱う頻出テーマを「範囲として」すべてカバーするが、文章・構成は
 *   すべて本アプリのオリジナルであり、既存教材・動画の転載は含まない。
 */

/** まとめプリント内の「重要事項」1 つ分 */
import type { LearningPart } from './adv_thermo';

// ===================================================================
// 導入：この科目のゴールと全体観
// ===================================================================
const HEAD_HTML = `        <h3 id="sec-bio-basic">生物基礎（共通テスト完全対応）</h3>

        <div class="box box-note">
          <p><strong>この科目のゴール</strong></p>
          <ul>
            <li>共通テスト生物基礎の<strong><u>5 つの大テーマ</u></strong>（生物の特徴／遺伝子／体内環境／植生・バイオーム／生態系）を1枚の地図として持つ</li>
            <li>用語を「丸暗記」ではなく<strong><u class="wavy">しくみ（因果関係）とセットで説明できる</u></strong>状態にする</li>
            <li>ミクロメーター・DNA量・濃縮率など<strong><u>定番の計算</u></strong>を手順化する</li>
          </ul>
        </div>

        <p>生物基礎は「知識 6 割・考察 4 割」の科目。知識問題は本プリントの<strong><u>太字下線の用語</u></strong>を完璧にすれば取り切れる。考察問題も、実は<strong><u class="wavy">教科書のしくみを知っていれば初見のグラフや実験でも必ず解ける</u></strong>ように作られている。まず全体像をつかもう。</p>

        <ul>
          <li><strong>第1章 生物の特徴</strong> … すべての生物に共通する性質。細胞・代謝・酵素・ATP</li>
          <li><strong>第2章 遺伝子とその働き</strong> … DNA の構造から転写・翻訳、ゲノムまで</li>
          <li><strong>第3章 体内環境の維持</strong> … 体液・肝腎・自律神経・ホルモン・免疫。<strong><u class="wavy">最も出題が多い章</u></strong></li>
          <li><strong>第4章 植生と遷移・バイオーム</strong> … 植物の集団の時間変化と地理分布</li>
          <li><strong>第5章 生態系とその保全</strong> … 生態系のしくみと環境問題</li>
        </ul>
`;

// ===================================================================
// ① 生物の特徴
// ===================================================================
const PART1_HTML = `        <h4>① 生物の特徴 ― 共通性・細胞・代謝・酵素</h4>

        <p><strong>【1】生物の共通性と多様性</strong></p>
        <p>地球上の生物は多様だが、共通の祖先に由来するため次の性質をすべて共有する。<strong><u class="wavy">「共通性の理由は共通の祖先から進化したこと」</u></strong>は正誤問題の定番。</p>
        <ul>
          <li>からだが<strong><u>細胞</u></strong>からできている</li>
          <li>遺伝物質として<strong><u>DNA</u></strong>をもつ</li>
          <li>エネルギーの受け渡しに<strong><u>ATP</u></strong>を使う</li>
          <li>体内の状態を一定に保つ<strong><u>恒常性（ホメオスタシス）</u></strong>をもつ</li>
          <li>代謝を行い、生殖により子をつくり、進化する</li>
        </ul>

        <p><strong>【2】原核細胞と真核細胞</strong></p>
        <p>核をもたない細胞が<strong><u>原核細胞</u></strong>（細菌・シアノバクテリア）、核をもつ細胞が<strong><u>真核細胞</u></strong>（動物・植物・菌類など）。<strong><u class="wavy">原核細胞にも DNA・細胞膜・リボソームはある</u></strong>（膜に包まれた細胞小器官がないだけ）という点がひっかけの定番。</p>
        <ul>
          <li><strong><u>核</u></strong> … DNA を含み、細胞の働きを調節する</li>
          <li><strong><u>ミトコンドリア</u></strong> … <strong><u>呼吸</u></strong>の場。有機物から ATP を合成する</li>
          <li><strong><u>葉緑体</u></strong> … <strong><u>光合成</u></strong>の場。植物細胞にのみ存在</li>
          <li><strong><u>液胞</u></strong> … 成長した植物細胞で発達。物質の貯蔵</li>
          <li><strong><u>細胞質基質</u></strong> … 細胞小器官の間を満たす液状部分。解糖系の場</li>
        </ul>
        <div class="box box-note">
          <p><strong>細胞の大きさの感覚</strong>：ウイルス（0.1 µm・生物ではない）＜ 細菌（1〜数 µm）＜ 動植物の細胞（10〜100 µm）＜ ヒトの卵（約 140 µm・肉眼の限界）。<strong><u class="wavy">ウイルスは細胞構造をもたず代謝も行わないため生物とはみなされない</u></strong>。</p>
        </div>

        <p><strong>【3】代謝と ATP</strong></p>
        <p>生体内の化学反応全体を<strong><u>代謝</u></strong>という。単純な物質から複雑な物質を合成しエネルギーを蓄える反応が<strong><u>同化</u></strong>（例：光合成）、複雑な物質を分解しエネルギーを取り出す反応が<strong><u>異化</u></strong>（例：呼吸）。</p>
        <p>ATP（アデノシン三リン酸）は<strong><u>アデニン＋リボース＋リン酸3つ</u></strong>からなり、リン酸どうしの<strong><u>高エネルギーリン酸結合</u></strong>が切れて ADP とリン酸に分解されるときにエネルギーが放出される。<strong><u class="wavy">ATP は「エネルギーの通貨」と呼ばれ、すべての生物が共通に使う</u></strong>。</p>
        <ul>
          <li><strong><u>呼吸</u></strong> … 有機物＋酸素 → 二酸化炭素＋水（＋ATP 合成）。主にミトコンドリア</li>
          <li><strong><u>光合成</u></strong> … 二酸化炭素＋水＋光エネルギー → 有機物＋酸素。葉緑体</li>
          <li>呼吸は燃焼と違い、<strong><u class="wavy">酵素によって段階的に進むため熱や光を一度に出さない</u></strong></li>
        </ul>

        <p><strong>【4】酵素</strong></p>
        <p>酵素は主成分が<strong><u>タンパク質</u></strong>の生体触媒で、化学反応を促進するが自身は変化しないため<strong><u class="wavy">繰り返し使うことができる</u></strong>。</p>
        <ul>
          <li><strong><u>基質特異性</u></strong> … 活性部位の立体構造に合う特定の基質にしか働かない（鍵と鍵穴）</li>
          <li><strong><u>最適温度</u></strong> … 多くは 35〜40 ℃。高温ではタンパク質が<strong><u>変性</u></strong>して失活する</li>
          <li><strong><u>最適pH</u></strong> … ペプシンは pH 2（胃）、トリプシンは pH 8（小腸）など酵素ごとに異なる</li>
          <li>例：<strong><u>カタラーゼ</u></strong>は過酸化水素を水と酸素に分解する（肝臓片の実験が定番）</li>
        </ul>

        <p><strong>【5】顕微鏡とミクロメーター</strong></p>
        <p>接眼レンズに入れる<strong><u>接眼ミクロメーター</u></strong>の1目盛りの長さは倍率で変わるため、ステージに置く<strong><u>対物ミクロメーター</u></strong>（1目盛り＝10 µm）と重ねて較正する。</p>
        <div class="box box-review">
          <p><strong>計算手順（これだけ）</strong></p>
          <p>接眼1目盛り ＝ <strong><u>（対物の目盛り数 × 10 µm）÷ 接眼の目盛り数</u></strong></p>
          <p>例：対物 3 目盛りと接眼 12 目盛りが一致 → 接眼1目盛り ＝ 30 ÷ 12 ＝ 2.5 µm。<strong><u class="wavy">倍率を上げると視野は狭く暗くなり、接眼ミクロメーター1目盛りが表す長さは小さくなる</u></strong>。</p>
        </div>
`;

// ===================================================================
// ② 遺伝子とその働き
// ===================================================================
const PART2_HTML = `        <h4>② 遺伝子とその働き ― DNA・複製・転写翻訳・ゲノム</h4>

        <p><strong>【1】DNA の構造</strong></p>
        <p>DNA の構成単位は<strong><u>ヌクレオチド</u></strong>（リン酸＋糖＋塩基）。糖は<strong><u>デオキシリボース</u></strong>、塩基は <strong><u>A・T・G・C</u></strong> の4種類。2本のヌクレオチド鎖が<strong><u>A と T、G と C</u></strong>で対になって結合し（<strong><u>相補性</u></strong>）、<strong><u>二重らせん構造</u></strong>をつくる（ワトソンとクリック、1953年）。</p>
        <div class="box box-review">
          <p><strong>シャルガフの規則の計算</strong>：相補性より、どの生物でも <strong><u>A＝T、G＝C</u></strong>。例えば A が 30 % なら T＝30 %、G＝C＝(100−60)÷2＝<strong><u>20 %</u></strong>。2本鎖全体でも片方の鎖の相手側でも、この足し算で必ず解ける。</p>
        </div>

        <p><strong>【2】遺伝子の本体を突き止めた研究史</strong></p>
        <ul>
          <li><strong><u>グリフィス</u></strong> … 肺炎球菌で<strong><u>形質転換</u></strong>を発見（死んだS型菌の「何か」がR型菌をS型に変える）</li>
          <li><strong><u>アベリー</u></strong> … 形質転換を起こす物質が<strong><u>DNA</u></strong>であることを示した</li>
          <li><strong><u>ハーシーとチェイス</u></strong> … T2ファージの実験で、菌内に入るのは<strong><u class="wavy">タンパク質ではなく DNA である</u></strong>ことを証明した</li>
        </ul>

        <p><strong>【3】DNA の複製と細胞周期</strong></p>
        <p>DNA は 2 本鎖がほどけ、それぞれが鋳型となって新しい鎖が合成される。新しい DNA は「元の鎖1本＋新しい鎖1本」なので<strong><u>半保存的複製</u></strong>と呼ばれる（メセルソンとスタールが証明）。</p>
        <p>体細胞分裂を繰り返す細胞は<strong><u>細胞周期</u></strong>（G<sub>1</sub>期 → S期 → G<sub>2</sub>期 → M期）を回る。DNA の複製は<strong><u>S期（合成期）</u></strong>に起こる。</p>
        <div class="box box-note">
          <p><strong>DNA量の変化グラフ（超頻出）</strong>：細胞1個あたりの DNA 量を 1 とすると、<strong><u class="wavy">S期に 1→2 へ増加し、G<sub>2</sub>期・分裂前期〜中期は 2 のまま、分裂終期に 2→1 に戻る</u></strong>。「いつ倍加し、いつ半減するか」をグラフで言えるようにする。</p>
        </div>

        <p><strong>【4】転写・翻訳とセントラルドグマ</strong></p>
        <p>遺伝情報は <strong><u>DNA → RNA → タンパク質</u></strong> へ一方向に流れる。これを<strong><u>セントラルドグマ</u></strong>という。</p>
        <ul>
          <li><strong><u>転写</u></strong> … DNA の塩基配列を写し取って mRNA を合成する。RNA の糖は<strong><u>リボース</u></strong>、塩基は T のかわりに<strong><u>U（ウラシル）</u></strong></li>
          <li><strong><u>翻訳</u></strong> … mRNA の連続する<strong><u>塩基3つ（コドン）</u></strong>が1つのアミノ酸を指定し、タンパク質が合成される</li>
          <li>例：塩基 120 個の mRNA からは最大 120÷3＝<strong><u>40 個</u></strong>のアミノ酸が指定される</li>
        </ul>

        <p><strong>【5】ゲノムと遺伝子発現</strong></p>
        <p><strong><u>ゲノム</u></strong>とは、その生物のもつ<strong><u class="wavy">遺伝情報の1セット（生殖細胞1つ分の DNA すべて）</u></strong>のこと。ヒトゲノムは約 30 億塩基対で、遺伝子は約 2 万個。<strong><u class="wavy">遺伝子としてはたらく部分はゲノム全体のわずか 1〜2 %</u></strong> しかない。</p>
        <ul>
          <li>体のどの細胞も同じゲノムをもつが、細胞ごとに<strong><u class="wavy">発現する遺伝子が異なる</u></strong>ため、筋肉や神経など異なる細胞に<strong><u>分化</u></strong>する</li>
          <li>ユスリカなどのだ腺染色体にみられる<strong><u>パフ</u></strong>は、転写が盛んに行われている場所</li>
        </ul>
`;

// ===================================================================
// ③ 体内環境の維持
// ===================================================================
const PART3_HTML = `        <h4>③ 体内環境の維持 ― 体液・肝腎・自律神経・ホルモン・免疫</h4>

        <p><strong>【1】体液と恒常性</strong></p>
        <p>体内の細胞を浸す液体を<strong><u>体液</u></strong>といい、<strong><u>血液・組織液・リンパ液</u></strong>の3つからなる。体液の状態を一定に保つ性質が<strong><u>恒常性（ホメオスタシス）</u></strong>。</p>
        <ul>
          <li><strong><u>赤血球</u></strong> … ヘモグロビンで酸素を運搬。<strong><u class="wavy">ヘモグロビンは酸素濃度が高い肺で酸素と結合し、低い組織で解離する</u></strong>（酸素解離曲線）</li>
          <li><strong><u>白血球</u></strong> … 免疫を担当</li>
          <li><strong><u>血小板</u></strong> … 血液凝固。フィブリンが血球を絡めて<strong><u>血ぺい</u></strong>をつくる</li>
        </ul>

        <p><strong>【2】肝臓と腎臓</strong></p>
        <ul>
          <li><strong><u>肝臓</u></strong> … <strong><u>グリコーゲン</u></strong>の貯蔵（血糖調節）、有害な<strong><u>アンモニアを尿素に変える</u></strong>、解毒、胆汁の生成、発熱</li>
          <li><strong><u>腎臓</u></strong> … <strong><u>ネフロン</u></strong>（腎小体＋細尿管）で尿をつくる。糸球体からボーマンのうへの<strong><u>ろ過</u></strong>（タンパク質・血球は出ない）→ 細尿管・集合管での<strong><u>再吸収</u></strong>（グルコースは健康なら100 %）</li>
        </ul>
        <div class="box box-review">
          <p><strong>濃縮率の計算</strong>：濃縮率 ＝ <strong><u>尿中濃度 ÷ 血しょう中濃度</u></strong>。イヌリンのように再吸収されない物質の濃縮率から、尿量 × イヌリン濃縮率 ＝ <strong><u>原尿量</u></strong>が求められる。</p>
        </div>

        <p><strong>【3】自律神経系</strong></p>
        <p>意思と無関係に内臓の働きを調節するのが<strong><u>自律神経系</u></strong>。中枢は<strong><u>間脳の視床下部</u></strong>。</p>
        <ul>
          <li><strong><u>交感神経</u></strong> … <strong><u class="wavy">活動・緊張・闘争</u></strong>のとき。心拍促進・血圧上昇・瞳孔拡大・消化抑制</li>
          <li><strong><u>副交感神経</u></strong> … <strong><u class="wavy">休息・リラックス</u></strong>のとき。心拍抑制・消化促進</li>
          <li>心臓の拍動：ペースメーカー（<strong><u>洞房結節</u></strong>）に交感神経と副交感神経（迷走神経）が接続し拍動数を調節</li>
        </ul>

        <p><strong>【4】ホルモンと血糖濃度の調節</strong></p>
        <p><strong><u>ホルモン</u></strong>は内分泌腺から<strong><u class="wavy">血液中に直接分泌され、特定の受容体をもつ標的細胞にだけ働く</u></strong>。上位の中枢は視床下部と脳下垂体。分泌量は<strong><u>フィードバック</u></strong>（結果が原因にさかのぼって作用する調節）で一定に保たれる。</p>
        <p>血糖濃度（正常値：<strong><u>約 0.1 %（100 mg/100 mL）</u></strong>）の調節が最頻出。</p>
        <ul>
          <li>血糖を下げる：すい臓ランゲルハンス島<strong><u>B細胞</u></strong>から<strong><u>インスリン</u></strong>（グリコーゲン合成・糖の消費促進）。<strong><u class="wavy">下げるホルモンはインスリンただ1つ</u></strong></li>
          <li>血糖を上げる：<strong><u>グルカゴン</u></strong>（A細胞）、<strong><u>アドレナリン</u></strong>（副腎髄質）、<strong><u>糖質コルチコイド</u></strong>（副腎皮質・タンパク質から糖を合成）</li>
          <li><strong><u>糖尿病</u></strong> … Ⅰ型はB細胞の破壊でインスリンが出ない。Ⅱ型は標的細胞が反応しにくくなる（生活習慣と関連）</li>
        </ul>

        <p><strong>【5】免疫</strong></p>
        <p>異物から体を守るしくみ。3段階で考える。</p>
        <ul>
          <li>物理的・化学的防御 … 皮膚の角質層、粘膜、涙のリゾチームなど</li>
          <li><strong><u>自然免疫</u></strong> … 好中球・マクロファージ・樹状細胞による<strong><u>食作用</u></strong>。生まれつき備わり、特異性が低く応答が速い</li>
          <li><strong><u>獲得免疫（適応免疫）</u></strong> … リンパ球（T細胞・B細胞）が特定の<strong><u>抗原</u></strong>を認識。特異性が高く、<strong><u>免疫記憶</u></strong>が残る</li>
        </ul>
        <p>獲得免疫は2本立て。<strong><u class="wavy">どちらもヘルパーT細胞が司令塔</u></strong>である。</p>
        <ul>
          <li><strong><u>体液性免疫</u></strong> … B細胞が<strong><u>抗体（免疫グロブリン）</u></strong>を産生し、抗原抗体反応で異物を無力化</li>
          <li><strong><u>細胞性免疫</u></strong> … <strong><u>キラーT細胞</u></strong>が感染細胞やがん細胞を直接攻撃。臓器移植の拒絶反応もこれ</li>
        </ul>
        <div class="box box-note">
          <p><strong>予防接種と血清療法の違い（超頻出）</strong>：<strong><u>予防接種</u></strong>は弱毒化した抗原（ワクチン）を接種して<strong><u class="wavy">自分の免疫記憶をつくらせる予防法</u></strong>。<strong><u>血清療法</u></strong>は他の動物がつくった<strong><u class="wavy">抗体そのものを注射する治療法</u></strong>（ヘビ毒など、即効性はあるが記憶は残らない）。</p>
          <p>関連語：<strong><u>アレルギー</u></strong>（免疫の過剰反応。重症例が<strong><u>アナフィラキシーショック</u></strong>）、<strong><u>エイズ</u></strong>（HIV が<strong><u class="wavy">ヘルパーT細胞に感染して破壊する</u></strong>ため獲得免疫全体が働かなくなる）。</p>
        </div>
`;

// ===================================================================
// ④ 植生と遷移・バイオーム
// ===================================================================
const PART4_HTML = `        <h4>④ 植生と遷移・バイオーム</h4>

        <p><strong>【1】植生と光</strong></p>
        <p>ある場所の植物の集まりが<strong><u>植生</u></strong>、外から見た様子が<strong><u>相観</u></strong>、相観を決める最も優勢な種が<strong><u>優占種</u></strong>。発達した森林には高木層〜草本層の<strong><u>階層構造</u></strong>があり、下層ほど光が弱い。</p>
        <ul>
          <li><strong><u>光補償点</u></strong> … 光合成速度＝呼吸速度となる光の強さ（見かけの光合成速度が 0）</li>
          <li><strong><u>光飽和点</u></strong> … それ以上光を強くしても光合成速度が増えない光の強さ</li>
          <li><strong><u>陽生植物</u></strong>は両方高く日なたで有利、<strong><u>陰生植物</u></strong>は両方低く<strong><u class="wavy">暗い林床でも生育できる</u></strong></li>
        </ul>

        <p><strong>【2】遷移</strong></p>
        <p>植生が一定方向に変化していく現象が<strong><u>遷移</u></strong>。土壌のない裸地から始まるのが<strong><u>一次遷移</u></strong>、土壌が残る場所から始まり進行が速いのが<strong><u>二次遷移</u></strong>。</p>
        <p>典型の流れ：裸地 →（<strong><u>先駆種</u></strong>：地衣類・コケ）→ 草原（ススキ）→ 低木林 → <strong><u>陽樹林</u></strong>（アカマツ・コナラ）→ 混交林 → <strong><u>陰樹林</u></strong>（シイ・カシ・ブナ）＝<strong><u>極相</u></strong>。</p>
        <div class="box box-note">
          <p><strong>なぜ陽樹林→陰樹林に変わるのか（考察の核心）</strong>：陽樹林の暗い林床では、<strong><u class="wavy">光補償点の高い陽樹の幼木は育たず、光補償点の低い陰樹の幼木だけが生育できる</u></strong>から。世代交代とともに陰樹に置き換わる。極相林でも倒木でできる<strong><u>ギャップ</u></strong>で部分的な更新が起こり、多様性が保たれる。</p>
        </div>

        <p><strong>【3】世界のバイオーム</strong></p>
        <p>植生と動物を含む生物のまとまりが<strong><u>バイオーム（生物群系）</u></strong>。分布は<strong><u>年平均気温と年降水量</u></strong>で決まる。</p>
        <ul>
          <li>森林（降水量が十分）：高温側から<strong><u>熱帯多雨林</u></strong> → <strong><u>亜熱帯多雨林</u></strong>（ガジュマル・ヘゴ）→ <strong><u>照葉樹林</u></strong>（シイ・カシ・クスノキ）→ <strong><u>夏緑樹林</u></strong>（ブナ・ミズナラ）→ <strong><u>針葉樹林</u></strong>（モミ類・トウヒ類）</li>
          <li>乾季に落葉する<strong><u>雨緑樹林</u></strong>（チーク）、夏に乾燥する地中海沿岸の<strong><u>硬葉樹林</u></strong>（オリーブ・コルクガシ）</li>
          <li>草原：熱帯の<strong><u>サバンナ</u></strong>／温帯の<strong><u>ステップ</u></strong></li>
          <li>荒原：降水量が極端に少ない<strong><u>砂漠</u></strong>／寒帯の<strong><u>ツンドラ</u></strong>（地衣類・コケ）</li>
        </ul>

        <p><strong>【4】日本のバイオーム</strong></p>
        <p>日本は降水量が十分なので分布は<strong><u class="wavy">気温だけでほぼ決まり、極相はどこでも森林</u></strong>になる。</p>
        <ul>
          <li><strong><u>水平分布</u></strong>（緯度方向）：亜熱帯多雨林（沖縄）→ 照葉樹林（西南日本低地）→ 夏緑樹林（東北日本）→ 針葉樹林（北海道東北部）</li>
          <li><strong><u>垂直分布</u></strong>（標高方向・本州中部）：丘陵帯（照葉樹林）→ 山地帯（夏緑樹林）→ 亜高山帯（シラビソ・コメツガ）→ 高山帯（ハイマツ・お花畑）</li>
          <li>亜高山帯の上限が<strong><u>森林限界</u></strong>（本州中部で約 2500 m）。標高 100 m につき気温は約 0.5〜0.6 ℃ 低下する</li>
        </ul>
`;

// ===================================================================
// ⑤ 生態系とその保全
// ===================================================================
const PART5_HTML = `        <h4>⑤ 生態系とその保全</h4>

        <p><strong>【1】生態系の成り立ち</strong></p>
        <p>生物のまとまりと<strong><u>非生物的環境</u></strong>を1つのまとまりとして捉えたものが<strong><u>生態系</u></strong>。非生物的環境→生物の影響が<strong><u>作用</u></strong>、生物→非生物的環境の影響が<strong><u>環境形成作用</u></strong>。</p>
        <ul>
          <li><strong><u>生産者</u></strong> … 光合成で無機物から有機物を合成（植物・藻類）</li>
          <li><strong><u>消費者</u></strong> … 有機物を取り込んで利用（一次消費者＝植物食性、二次消費者＝動物食性）</li>
          <li><strong><u>分解者</u></strong> … 遺体・排出物の有機物を無機物に分解（菌類・細菌）</li>
          <li>「食う−食われる」のつながりが<strong><u>食物連鎖</u></strong>、網目状の全体像が<strong><u>食物網</u></strong>、各段階が<strong><u>栄養段階</u></strong></li>
        </ul>

        <p><strong>【2】物質循環とエネルギーの流れ</strong></p>
        <div class="box box-note">
          <p><strong>最重要の対比</strong>：炭素などの<strong><u class="wavy">物質は生態系内を循環する</u></strong>が、<strong><u class="wavy">エネルギーは光→化学→熱と一方向に流れ、循環しない</u></strong>。</p>
        </div>
        <p>炭素循環：大気中の<strong><u>二酸化炭素</u></strong>が生産者の<strong><u>光合成</u></strong>で有機物に固定され、食物連鎖を通って移動し、各栄養段階の<strong><u>呼吸</u></strong>で大気に戻る。化石燃料の燃焼は大気中 CO<sub>2</sub> を増加させる。CO<sub>2</sub> やメタンなどの<strong><u>温室効果ガス</u></strong>の増加が<strong><u>地球温暖化</u></strong>を進め、サンゴの白化や分布域の変化などの影響が出ている。</p>

        <p><strong>【3】生態系のバランス</strong></p>
        <p>生態系は台風などの<strong><u>かく乱</u></strong>を受けても、程度が小さければ<strong><u>復元力</u></strong>で元に戻る。しかし復元力を超えると別の状態に移行する。</p>
        <ul>
          <li><strong><u>自然浄化</u></strong> … 少量の汚濁物質は希釈・分解で自然に除去される</li>
          <li><strong><u>富栄養化</u></strong> … 栄養塩類（窒素・リン）の過剰蓄積。湖沼で<strong><u>アオコ</u></strong>、内湾で<strong><u>赤潮</u></strong>が発生し酸素欠乏を招く</li>
          <li><strong><u>生物濃縮</u></strong> … 分解されにくい物質（DDT・有機水銀）が<strong><u class="wavy">食物連鎖の上位ほど高濃度に蓄積する</u></strong></li>
          <li><strong><u>外来生物</u></strong> … 人間が持ち込み定着した生物。影響の大きい種は<strong><u>特定外来生物</u></strong>に指定（オオクチバス・マングースなど）</li>
        </ul>

        <p><strong>【4】生物多様性と保全</strong></p>
        <ul>
          <li><strong><u>生物多様性</u></strong> … 生態系・種・遺伝子の3つのレベルで捉える</li>
          <li><strong><u>生態系サービス</u></strong> … 人間が生態系から受ける恵み（供給・調整・文化的・基盤）</li>
          <li><strong><u>里山</u></strong> … 雑木林・田畑・ため池のまとまり。<strong><u class="wavy">人の適度な管理（かく乱）がむしろ多様性を維持してきた</u></strong>。管理放棄は多様性を低下させる</li>
          <li><strong><u>絶滅危惧種</u></strong>は<strong><u>レッドリスト</u></strong>にまとめられる。大規模開発の前には<strong><u>環境アセスメント</u></strong>（環境影響評価）を行う</li>
        </ul>
`;

// ===================================================================
// 総まとめ
// ===================================================================
const SUMMARY_HTML = `        <h4>総まとめ ― 直前チェック 20 項目</h4>

        <div class="box box-review">
          <p><strong>1分で全範囲を思い出すチェックリスト</strong></p>
          <ul>
            <li>生物の共通性 5 つ（細胞・DNA・ATP・恒常性・代謝）を言える</li>
            <li>原核細胞に「ない」もの＝核と膜構造の細胞小器官（DNA・リボソームはある）</li>
            <li>ATP の分解で切れるのは高エネルギーリン酸結合</li>
            <li>接眼1目盛り ＝ 対物目盛り数 × 10 ÷ 接眼目盛り数 [µm]</li>
            <li>A＝T、G＝C（シャルガフ）→ 1つ分かれば全部出る</li>
            <li>DNA 複製は S 期、DNA 量は S 期に倍加・分裂終期に半減</li>
            <li>転写＝DNA→mRNA（T→U）、翻訳＝コドン3塩基で1アミノ酸</li>
            <li>ゲノム＝生殖細胞1つ分の全 DNA。遺伝子部分は 1〜2 %</li>
            <li>交感神経＝闘争（心拍↑・消化↓）、副交感神経＝休息（逆）</li>
            <li>血糖を下げるのはインスリンのみ、上げるのは3つ以上ある</li>
            <li>肝臓＝アンモニア→尿素、腎臓＝ろ過→再吸収、濃縮率＝尿中÷血しょう中</li>
            <li>自然免疫＝食作用（速い・非特異的）、獲得免疫＝リンパ球（遅い・特異的・記憶あり）</li>
            <li>体液性＝B細胞と抗体、細胞性＝キラーT細胞、司令塔はヘルパーT細胞</li>
            <li>予防接種＝抗原を打つ予防、血清療法＝抗体を打つ治療</li>
            <li>陽樹林→陰樹林の理由＝林床が暗く陰樹の幼木しか育たない（光補償点）</li>
            <li>一次遷移＝土壌なし・遅い、二次遷移＝土壌あり・速い</li>
            <li>バイオームは年平均気温×年降水量。日本は気温のみで決まり極相は森林</li>
            <li>水平分布：亜熱帯多雨林→照葉→夏緑→針葉（南→北）</li>
            <li>物質は循環する、エネルギーは循環しない（熱として出ていく）</li>
            <li>富栄養化→アオコ（湖沼）・赤潮（内湾）、生物濃縮は上位ほど高濃度</li>
          </ul>
        </div>

        <p>ここまでの用語を「なぜそうなるか」つきで説明できれば、共通テスト生物基礎の知識問題は満点が狙える。考察問題は<strong><u class="wavy">グラフ・実験の設定を焦らず読み、既知のしくみに翻訳する</u></strong>ことを心がけよう。</p>
`;

// ===================================================================
// まとめプリントの部品一覧と連結HTML
// ===================================================================
export const BIO_BASIC_PARTS: LearningPart[] = [
  { id: 'head', no: '', title: '導入 この科目のゴール', short: '★ はじめに', html: HEAD_HTML },
  { id: 'p1', no: '①', title: '生物の特徴（細胞・代謝・酵素）', short: '① 生物の特徴', html: PART1_HTML },
  { id: 'p2', no: '②', title: '遺伝子とその働き（DNA・転写翻訳）', short: '② 遺伝子', html: PART2_HTML },
  { id: 'p3', no: '③', title: '体内環境の維持（肝腎・ホルモン・免疫）', short: '③ 体内環境', html: PART3_HTML },
  { id: 'p4', no: '④', title: '植生と遷移・バイオーム', short: '④ 植生・バイオーム', html: PART4_HTML },
  { id: 'p5', no: '⑤', title: '生態系とその保全', short: '⑤ 生態系', html: PART5_HTML },
  { id: 'summary', no: '', title: '総まとめ 直前チェック20項目', short: '★ 総まとめ', html: SUMMARY_HTML },
];

/**
 * 従来どおりの「全部つなげた 1 本」の本文。
 * 「すべて表示」を選んだときと、印刷（章まるごとの配布プリント）で使う。
 */
export const BIO_BASIC_HTML = BIO_BASIC_PARTS.map(p => p.html).join('\n');
