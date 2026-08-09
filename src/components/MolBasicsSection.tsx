/**
 * MolBasicsSection — 「物質量がわからない人へ」セクション
 *
 * 配布プリント（重要事項②〜物質量〜／例題1〜6／演習1・2）の内容を
 * 途中式・式の書き方・表し方を一切変えずにそのまま再現する。
 *
 * ★ 一貫性のための厳守事項 ★
 *  - 「1を掛けている（単位も約分されて「◯→◯」になる）」という表現を必ず使う
 *  - 分数は囲み枠つきの縦分数で、分子＝変換先、分母＝変換元
 *  - 数字の表記（6.0×10²³、22.4L、1.013×10⁵Pa など）はプリントどおり
 *  - 「スタートは「◯」、ゴールは「◯」」の書き出しも必ず入れる
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { MolUnitMap, Frac } from './MolUnitMap';

interface MolBasicsSectionProps {
  /** 単体ページとして使うときの戻るボタン */
  onBack?: () => void;
  /** 見出しを出すか（プリント内に埋め込むときは false） */
  showHeader?: boolean;
}

/* ---------- 小さな表示部品（プリントの体裁をそろえるため） ---------- */

/** プリントの「囲み見出し」（例題1 / 解答 など） */
function Tag({ children }: { children: React.ReactNode }) {
  return <span className="mbs-tag">{children}</span>;
}

/** プリントの網かけ強調（スタートは「g」、ゴールは「L」など） */
function Mark({ children }: { children: React.ReactNode }) {
  return <span className="mbs-mark">{children}</span>;
}

/** 太下線（最重要） */
function U({ children }: { children: React.ReactNode }) {
  return <strong className="mbs-u">{children}</strong>;
}

/** 「1を掛けている（単位も約分されて「◯→◯」になる）」の囲み */
function OneTimes({ children }: { children: React.ReactNode }) {
  return <p className="mbs-onetimes">{children}</p>;
}

/** 中央寄せの式行 */
function Formula({ children }: { children: React.ReactNode }) {
  return <div className="mbs-formula">{children}</div>;
}

/** 例題ブロック */
function Example({ no, question, children }: { no: string; question: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mbs-ex">
      <p className="mbs-ex-q"><Tag>{no}</Tag>　{question}</p>
      <div className="mbs-ex-a">{children}</div>
    </section>
  );
}

/* ---------- 解答の折りたたみ（まとめプリント本文と操作感をそろえる） ---------- */

/**
 * 「解答をすべて表示／隠す」を各パネルへ伝えるための入れもの。
 *
 * generation は「一括操作が押された回数」。これが変わったときだけ
 * 各パネルの開閉を openAll にそろえ直す。こうしておくと、
 *  - 一括で開く → その後 個別に閉じる … 閉じたままにできる
 *  - もう一度一括で開く … generation が進むので全部開く
 * という自然な挙動になる（openAll だけを見ていると、個別操作が
 * 効かなかったり、再レンダリングのたびに勝手に開き直したりする）。
 */
const AnswerReveal = React.createContext<{ generation: number; openAll: boolean }>({
  generation: 0,
  openAll: false,
});

/**
 * 解答パネル。まとめプリント本文の `.lc-ans`（utils/learningAccordion.ts が
 * 生成する構造）と同じ見た目・同じタップ領域・同じヒント文言にそろえてある。
 *
 * `cursor-pointer` を付けているのは意図的で、useGlobalClickSound が
 * `.cursor-pointer` を対象にしているため、これだけで解答を開いたときにも
 * クリック音が鳴る（本文側と挙動がそろう）。
 */
function AnswerPanel({
  label,
  icon = '💡',
  /** 'tool' は解答ではない補助パネル。「解答をすべて表示」の対象外にする */
  kind = 'answer',
  children,
}: {
  label: React.ReactNode;
  icon?: string;
  kind?: 'answer' | 'tool';
  children: React.ReactNode;
}) {
  const { generation, openAll } = React.useContext(AnswerReveal);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (kind !== 'answer') return;
    setOpen(openAll);
    // generation を依存に入れることで「もう一度すべて表示」を押せる
  }, [generation, openAll, kind]);

  return (
    <details
      className="mbs-details"
      open={open}
      // ネイティブの開閉を state に取り込む（React 側と DOM をずらさないため）
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="mbs-details-sum cursor-pointer">
        <span className="mbs-details-ico" aria-hidden="true">{icon}</span>
        <span className="mbs-details-txt">{label}</span>
        <span className="mbs-details-hint" aria-hidden="true" />
      </summary>
      <div className="mbs-details-body">{children}</div>
    </details>
  );
}

/**
 * このセクションにある「解答」パネルの数（演習1・演習2）。
 * 一括ボタンの表示に使う。kind="tool" のパネル（単位変換の図）は数えない。
 * パネルを増やしたときはここも直す必要があるため、
 * tests/molBasicsAnswerPanel.test.ts で実際の個数と一致するか検査している。
 */
export const MBS_ANSWER_COUNT = 2;

/* ============================================================
 * 本体
 * ============================================================ */

export function MolBasicsSection({ onBack, showHeader = true }: MolBasicsSectionProps) {
  // 演習の解答をまとめて開閉する（まとめプリント本文と同じ操作を用意する）。
  // generation は「一括操作を押した回数」。詳しくは AnswerReveal のコメント参照。
  const [reveal, setReveal] = React.useState({ generation: 0, openAll: false });
  const toggleAllAnswers = () =>
    setReveal((r) => ({ generation: r.generation + 1, openAll: !r.openAll }));

  return (
    <AnswerReveal.Provider value={reveal}>
    <div className="mbs-root">
      <style>{SECTION_CSS}</style>

      {showHeader && (
        <div className="mbs-header">
          {onBack && (
            <button type="button" className="mbs-back" onClick={onBack}>
              <ArrowLeft size={16} /> 戻る
            </button>
          )}
          <div>
            <p className="mbs-header-kicker">物質量と化学反応式　補講</p>
            <h2 className="mbs-header-title">物質量（mol）がわからない人へ</h2>
            <p className="mbs-header-note">
              配布プリントと<b>まったく同じ途中式・同じ書き方</b>で説明しています。
              ここで覚えた式の形を、そのまま演習・テストで使ってください。
            </p>
          </div>
        </div>
      )}

      {/* 演習の解答を一括で開閉する。
          「まず自力で解く」→「答え合わせで一気に開く」を1タップにする。
          押したあとに個別で閉じてもよい（次に押すまで勝手に開き直さない）。 */}
      <div className="mbs-toolbar">
        <button
          type="button"
          className={`mbs-revealall cursor-pointer${reveal.openAll ? ' is-on' : ''}`}
          onClick={toggleAllAnswers}
          aria-pressed={reveal.openAll}
        >
          {reveal.openAll
            ? `解答をすべて隠す（${MBS_ANSWER_COUNT}）`
            : `解答をすべて表示（${MBS_ANSWER_COUNT}）`}
        </button>
      </div>

      {/* ==================== 重要事項② ==================== */}
      <h3 className="mbs-h3"><Tag>重要事項②</Tag>　〜物質量〜</h3>

      <p className="mbs-p">
        <U>物質量（mol）</U>…物質がどれだけの数あるかを表した単位
      </p>

      {/* 図：アボガドロ定数 */}
      <div className="mbs-fig">
        <div className="mbs-fig-row">
          <div className="mbs-box mbs-box-solid">
            <p><U>アボガドロ定数</U></p>
            <p className="mbs-strong">1mol＝6.0×10<sup>23</sup>個</p>
          </div>
          <span className="mbs-fat-arrow mbs-fat-arrow-left">◀</span>
          <div className="mbs-box mbs-box-solid">
            <p>物質が<strong>6.0×10<sup>23</sup>個</strong>ある！</p>
            <p>＝物質が<strong>1mol</strong>あることにしよ！</p>
          </div>
          <div className="mbs-dots" aria-hidden="true"><Dots /></div>
        </div>
      </div>

      <p className="mbs-p">
        →物質量（mol）はとても大きい数を示しているだけなので、<U>「個」と考えていくのが良い。</U>
      </p>

      <div className="mbs-note-inline">
        g÷mol＝<Frac up="g" down="mol" />と同じ意味
      </div>

      <p className="mbs-p">
        <U>モル質量（g/mol）</U>…ある物質が<U>1mol（6.0×10<sup>23</sup>個）あるときの質量</U>　≒<U>原子量・分子量・式量</U>
      </p>
      <p className="mbs-p mbs-right">→意味は異なるが<span className="mbs-boxed">値は同じ</span>と考える</p>

      {/* 図：銅・酸素分子 */}
      <div className="mbs-fig">
        <div className="mbs-fig-row">
          <div className="mbs-dots" aria-hidden="true"><Dots /></div>
          <div className="mbs-fig-col">
            <div className="mbs-fig-row">
              <div className="mbs-box mbs-box-solid">
                <p>銅が<strong>6.0×10<sup>23</sup>個（1mol）</strong>ある！</p>
                <p>＝銅は<strong>64g</strong>だった！</p>
              </div>
              <span className="mbs-fat-arrow">▶</span>
              <div className="mbs-box mbs-box-solid">
                <p>銅の<U>モル質量</U>は<strong>64g</strong></p>
                <p className="mbs-strong">1mol＝64g</p>
              </div>
            </div>
            <div className="mbs-fig-row">
              <div className="mbs-box mbs-box-solid">
                <p>酸素分子が<strong>1mol</strong>ある！</p>
                <p>＝酸素分子は<strong>32g</strong>だった！</p>
              </div>
              <span className="mbs-fat-arrow">▶</span>
              <div className="mbs-box mbs-box-solid">
                <p>酸素分子の<U>モル質量</U>は<strong>32g</strong></p>
                <p className="mbs-strong">1mol＝32g</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ★ 混合気体のモル質量 */}
      <div className="mbs-outline-box">
        <p className="mbs-star">★　混合気体のモル質量</p>
        <p className="mbs-p">気体Aと気体Bが<span className="mbs-boxed">4：1</span>で混ざっている混合気体を考えたとき、</p>
        <Formula>
          <U>平均モル質量</U>＝Aのモル質量×<Frac up="4" down="5" />＋Bのモル質量×<Frac up="1" down="5" />
        </Formula>
      </div>

      <Example
        no="例題"
        question={<>空気の平均モル質量を求めよ。（空気を窒素分子と酸素分子が4：1で存在）（N＝14、O＝16）</>}
      >
        <p className="mbs-p"><Tag>解答</Tag>　N<sub>2</sub>は14×2＝28g/molとなりO<sub>2</sub>は16×2＝32g/molとなる。</p>
        <Formula>
          よって、28g/mol×<Frac up="4" down="5" />＋32g/mol×<Frac up="1" down="5" />＝<U>28.8g/mol</U>
        </Formula>
      </Example>

      <p className="mbs-p">
        <U>アボガドロの法則</U>…<U>温度と圧力が同じならば種類に関係なく同じ体積に同じ数の粒子が含まれる</U>法則
      </p>

      {/* 図：標準状態 */}
      <div className="mbs-fig">
        <div className="mbs-fig-row">
          <div className="mbs-dots" aria-hidden="true"><Dots /></div>
          <div className="mbs-box mbs-box-solid">
            <p><U>0℃、1.013×10<sup>5</sup>Pa</U>で</p>
            <p>物質が1mol（6.0×10<sup>23</sup>個）ある</p>
            <p>＝物質が<U>22.4L</U>ある</p>
          </div>
          <span className="mbs-fat-arrow">▶</span>
          <div className="mbs-box mbs-box-solid">
            <p><U>標準状態</U></p>
          </div>
        </div>
      </div>

      <p className="mbs-p">
        例）　<U>標準状態</U>…<U>0℃、1.013×10<sup>5</sup>Pa</U>のとき、1molで物質の体積は<U>22.4L</U>になる
      </p>

      <hr className="mbs-hr" />

      {/* ==================== 例題1 ==================== */}
      <Example
        no="例題1"
        question={<><span className="mbs-small">（これは内容を理解するための問題なため入試や定期テストには出題されない）</span>　2日は何秒か。</>}
      >
        <p className="mbs-p">
          <Tag>解答</Tag>　日・時間・分・秒は以下の関係性で成り立っている　<Mark>スタートは「日」、ゴールは「秒」</Mark>
        </p>

        {/* 図：日→時→分→秒 */}
        <div className="mbs-chain">
          <div className="mbs-chain-node">日</div>
          <div className="mbs-chain-link"><span className="mbs-chain-arrow">◀▶</span><span className="mbs-chain-label">1日＝24時間</span></div>
          <div className="mbs-chain-node">時</div>
          <div className="mbs-chain-link"><span className="mbs-chain-arrow">◀▶</span><span className="mbs-chain-label">1時間＝60分</span></div>
          <div className="mbs-chain-node">分</div>
          <div className="mbs-chain-link"><span className="mbs-chain-arrow">◀▶</span><span className="mbs-chain-label">1分＝60秒</span></div>
          <div className="mbs-chain-node">秒</div>
        </div>

        <Formula>
          2日 ×<Frac up="24時間" down="1日" />×<Frac up="60分" down="1時間" />×<Frac up="60秒" down="1分" />＝<strong>152800秒</strong>
        </Formula>
        <OneTimes><U>3回1を掛けている</U>（単位も約分されて「<U>日→秒</U>」になる）</OneTimes>

        <p className="mbs-p">
          →例題1では、単位を含めたうえでの1をかけることで、単位を含め約分を行うことができて、「<strong>日→秒</strong>」へ
          単位変換ができる。これを今回の物質量の範囲でも考えていけばよい。
        </p>
      </Example>

      {/* ==================== 単位変換の図（操作できる） ==================== */}
      <MolUnitMap />

      <p className="mbs-p mbs-goal">
        →<U>スタート・ゴールがどこで、どのルート（経路）を通るのかに注目し、時間と同じように式を立てよう！</U>
      </p>

      <hr className="mbs-hr" />

      {/* ==================== 例題2 ==================== */}
      <Example
        no="例題2"
        question={<>水分子が1.2×10<sup>24</sup>個存在するとき、水分子と水素原子は何molずつ存在するか答えよ。ただし、アボガドロ定数は6.0×10<sup>23</sup>個/molであるとする。</>}
      >
        <p className="mbs-p"><Tag>解答</Tag>　<Mark>スタートは「個」、ゴールは「物質量（mol）」</Mark></p>
        <Formula>
          1.2×10<sup>24</sup>個 ×<Frac up="1mol" down={<>6.0×10<sup>23</sup>個</>} />＝<strong>2mol</strong>
        </Formula>
        <OneTimes><U>1を掛けている</U>（単位も約分されて「<U>個→mol</U>」になる）</OneTimes>

        <p className="mbs-p">また、水分子は2molなので、水素原子は<strong>4mol</strong></p>

        <div className="mbs-fig-row mbs-fig-row-top">
          <div className="mbs-flow-text">
            <p className="mbs-p">
              →<U>mol</U>は「<U>個</U>」なわけなので<U>水分子が2個あるなら、水素原子は2倍の4個と考える</U>ように、
              <U>水が2molあるなら、水素原子は4molっていう感じで考えていく。</U>
            </p>
          </div>
          <figure className="mbs-h2o">
            <div className="mbs-h2o-mols">
              <H2OMolecule />
              <H2OMolecule />
            </div>
            <figcaption>水分子が<span className="mbs-boxed">2個</span>あるとき水素原子は<span className="mbs-boxed">4個</span></figcaption>
          </figure>
        </div>
      </Example>

      {/* ==================== 例題3 ==================== */}
      <Example
        no="例題3"
        question={<>水分子が2molあるとき、何gか。ただし、モル質量はH＝1.0、O＝16とする。</>}
      >
        <p className="mbs-p"><Tag>解答</Tag>　<Mark>スタートは「mol」、ゴールは「g」</Mark></p>
        <p className="mbs-p">
          水のモル質量はH<sub>2</sub>Oなので、1×2＋16＝<U>18g</U>となり、<span className="mbs-boxed">1mol＝18g</span>が使える。
        </p>
        <Formula>
          2mol×<Frac up="18g" down="1mol" />＝<strong>36g</strong>
        </Formula>
        <OneTimes><U>1を掛けている</U>（単位も約分されて「<U>mol→g</U>」になる）</OneTimes>
      </Example>

      {/* ==================== 例題4 ==================== */}
      <Example
        no="例題4"
        question={<>二酸化炭素が88gあった時、二酸化炭素は標準状態で何Lか。（モル質量はC＝12、O＝16）</>}
      >
        <p className="mbs-p"><Tag>解答</Tag>　<Mark>スタートは「g」、ゴールは「L」</Mark></p>
        <p className="mbs-p">
          二酸化炭素のモル質量はCO<sub>2</sub>なので、12＋16×2＝<U>44g</U>となり、<span className="mbs-boxed">1mol＝44g</span>が使える。
        </p>
        <Formula>
          88g×<Frac up="1mol" down="44g" />×<Frac up="22.4L" down="1mol" />＝<strong>44.8L</strong>
        </Formula>
        <OneTimes><U>1を2回掛けている</U>（単位も約分されて「<U>g→mol→L</U>」になる）</OneTimes>
      </Example>

      {/* ==================== 例題5 ==================== */}
      <Example
        no="例題5"
        question={<>8.96Lの窒素N<sub>2</sub>と5.60Lの酸素O<sub>2</sub>を混合すると、質量は何gになるか。</>}
      >
        <p className="mbs-p">
          <Tag>解答</Tag>　<Mark>スタートは「L」→ゴールは「g」</Mark><span className="mbs-small">（窒素と酸素それぞれをgに変えればよい）</span>
        </p>
        <p className="mbs-p">
          窒素のモル質量はO<sub>2</sub>なので、14×2＝<U>28g</U>となり、<span className="mbs-boxed">1mol＝28g</span>が使える。
        </p>
        <Formula>
          8.96L×<Frac up="1mol" down="22.4L" />×<Frac up="28g" down="1mol" />＝<strong>11.2g</strong>
        </Formula>
        <p className="mbs-p">
          酸素のモル質量はO<sub>2</sub>なので、16×2＝<U>32g</U>となり、<span className="mbs-boxed">1mol＝32g</span>が使える。
        </p>
        <Formula>
          5.60L×<Frac up="1mol" down="22.4L" />×<Frac up="32g" down="1mol" />＝<strong>8.0g</strong>
        </Formula>
        <p className="mbs-p">
          よって、酸素と窒素の質量を合わせると、11.2g＋8.0g＝<U>19.2g</U>
        </p>
      </Example>

      {/* ==================== 例題6 ==================== */}
      <Example
        no="例題6"
        question={<>密度が1.34g/Lである気体の分子量を求めよ。（気体は0℃で1.013×10<sup>5</sup>Paとする）</>}
      >
        <p className="mbs-p">
          <Tag>解答</Tag>　<Mark><U>スタートは「mol」、ゴールも「mol」</U></Mark><span className="mbs-small">（スタートやゴールが分からない時はmolにする）</span>
        </p>

        <div className="mbs-ex6">
          <div className="mbs-ex6-text">
            <p className="mbs-p">
              気体の分子量を求めるので、<U>質量と物質量の単位を変換するルート（経路）を通る必要がある。</U>
            </p>
            <p className="mbs-p">
              ここで、問題文で与えられた単位変換の情報から、<U>密度と標準状態での体積が分かる</U>ことを踏まえると、
              上の図（単位変換の図）を考えることができる。
            </p>
            <p className="mbs-p">
              よって、「<U>mol→L→g→mol</U>」と図を1周していけば、<U>モル質量（≒分子量）を求めることができる。</U>
            </p>
            <p className="mbs-p">
              ※　　<U>モル質量≒原子量・分子量・式量</U><br />
              　　　→<U>意味は異なるが値は同じになると考える</U>
            </p>
          </div>
        </div>

        <p className="mbs-p">
          このことを踏まえて、<U>1molの物質量から、1molの物質量に単位変換を考えると、</U>
        </p>
        <Formula>
          1mol×<Frac up="22.4L" down="1mol" />×<Frac up="1.34g" down="1L" />×<Frac up="1mol" down="Mg" />＝1mol
        </Formula>
        <Formula>
          M＝30.016≒<U>30</U>
        </Formula>

        {/* これは解答ではなく操作用の道具なので、
            「解答をすべて表示」では開かない（kind="tool"） */}
        <AnswerPanel
          icon="🛠"
          kind="tool"
          label={<>この式を「単位変換の図」で作ってみる（操作用）</>}
        >
          <p className="mbs-p mbs-small">
            スタートを「1mol」にして、<b>1mol＝22.4L</b> →　<b>1L＝1.34g</b>（密度）→　<b>1mol＝Mg</b>（モル質量）の
            矢印を順にタップすると、上と同じ式ができます。
          </p>
          {/* initialScale は渡さない＝表示幅に自動で収める（スマホで右端が切れるのを防ぐ） */}
          <MolUnitMap title="★ 例題6用　単位変換の図" />
        </AnswerPanel>
      </Example>

      <hr className="mbs-hr" />

      {/* ==================== 演習1 ==================== */}
      <section className="mbs-drill">
        <p className="mbs-p">
          <Tag>演習1</Tag>　アボガドロ定数をN<sub>A</sub>（/mol）、0℃、1.013×10<sup>5</sup>Paにおける気体のモル体積をV<sub>m</sub>（L/mol）と
          して、密度<i>d</i>（g/cm<sup>3</sup>）の、ある金属 <i>a</i>（cm<sup>3</sup>）中には<i>n</i>個の原子が含まれていたとき、この金属のモル質量
          を求めよ。
        </p>

        <AnswerPanel label={<Tag>演習1　解答</Tag>}>
            <p className="mbs-p">問題でわかるルート（経路）を<br />　　　下の図で丸をすると右図のようになる。</p>
            <ul className="mbs-list">
              <li>アボガドロ定数をN<sub>A</sub>（/mol）</li>
              <li>気体のモル体積をV<sub>m</sub>（L/mol）（標準状態）</li>
              <li>密度<i>d</i>（g/cm<sup>3</sup>）</li>
              <li>金属 <i>a</i>（cm<sup>3</sup>）</li>
              <li><i>n</i>個の原子</li>
              <li>1L＝1000cm<sup>3</sup></li>
              <li>モル質量M（g/mol）　←　求めたいもの</li>
            </ul>

            <p className="mbs-p">
              「金属 <i>a</i>（cm<sup>3</sup>）中に<i>n</i>個の原子が含まれていた時のモル質量を求めよ」と書かれているので、
            </p>
            <p className="mbs-p">
              <Mark>スタートは「cm<sup>3</sup>」、ゴールは「個」</Mark>となるが、そのルート（経路）内にモル質量の変換が入ってなければなら
              ないので、「cm<sup>3</sup>→<span className="mbs-boxed">g→mol</span>→個」というルート（経路）を通ればよい。
            </p>
            <Formula>
              a cm<sup>3</sup> ×<Frac up="dg" down={<>1cm<sup>3</sup></>} />×<Frac up="1mol" down="Mg" />×<Frac up={<>N<sub>A</sub>個</>} down="1mol" />＝n個
            </Formula>
            <Formula>
              M＝<Frac up={<strong>adN<sub>A</sub></strong>} down={<strong>n</strong>} />
            </Formula>

            <p className="mbs-p mbs-small">
              ※ 上の「単位変換の図」で、密度の矢印を <b>d</b>、モル質量の矢印を <b>M</b>、アボガドロ定数の矢印を <b>N<sub>A</sub></b> と
              入力すれば、この式をそのまま作れます（数字を入れなくても文字式で立式できます）。
            </p>
        </AnswerPanel>
      </section>

      {/* ==================== 演習2 ==================== */}
      <section className="mbs-drill">
        <p className="mbs-p">
          <Tag>演習2</Tag>　原子量Mの金属Aがある。この金属5.4gを空気中の酸素と反応させたところ、化合物A<sub>2</sub>O<sub>3</sub>が、
          10.2g得られた。このとき、金属Aの原子量Mを求めなさい。
        </p>

        <AnswerPanel label={<Tag>演習2　解答</Tag>}>
            <p className="mbs-p">化学式は個、特に<U>物質量の比</U>であることを利用する。</p>
            <p className="mbs-p">
              原子量Mの金属A：5.4g　→　<span className="mbs-boxed"><strong>酸素が4.8g化合する</strong></span>　→　化合物A<sub>2</sub>O<sub>3</sub>：10.2g
            </p>
            <p className="mbs-p">
              Aの原子量（モル質量）を求めたい⇒Aのmol（物質量）を求めたい⇒酸素のmol（物質量）を求めたい
            </p>
            <p className="mbs-p">
              酸素について式を立てると、<Mark>スタートを「g」→ゴールを「mol」</Mark>として
            </p>
            <Formula>
              4.8g ×<Frac up="1mol" down="32g" />＝0.15mol
            </Formula>
            <p className="mbs-p">
              よって、化合物A<sub>2</sub>O<sub>3</sub>の物質量の比からAは0.10molとなるため、<Mark>スタートを「mol」→ゴールを「g」</Mark>として
            </p>
            <Formula>
              0.10mol×<Frac up="Mg" down="1mol" />＝5.4g　　　　M＝<strong>54</strong>
            </Formula>
        </AnswerPanel>
      </section>

      <div className="mbs-closing">
        <p>
          <U>この図とこの式の書き方だけで、化学基礎のmol計算はすべて解けます。</U><br />
          ほかの問題を解くときも、必ず「スタートは？ゴールは？どのルートを通る？」→「1を掛ける」の順で書いてください。
        </p>
      </div>
    </div>
    </AnswerReveal.Provider>
  );
}

/* ---------- 図の中の粒子（点の集まり） ---------- */
function Dots() {
  // 円の中にランダムに見える点を並べる（プリントの図と同じ雰囲気）
  const pts = React.useMemo(() => {
    const arr: { x: number; y: number }[] = [];
    let seed = 20240607;
    const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    for (let i = 0; i < 46; i++) {
      const r = Math.sqrt(rnd()) * 44;
      const t = rnd() * Math.PI * 2;
      arr.push({ x: 50 + r * Math.cos(t), y: 50 + r * Math.sin(t) });
    }
    return arr;
  }, []);
  return (
    <svg viewBox="0 0 100 100" className="mbs-dots-svg">
      <circle cx="50" cy="50" r="47" fill="#fff" stroke="#2f2740" strokeWidth="1.2" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="1.7" fill="#111" />)}
    </svg>
  );
}

/** 例題2 の H2O 分子（黒丸H・白丸O） */
function H2OMolecule() {
  return (
    <svg viewBox="0 0 140 90" className="mbs-h2o-svg">
      <circle cx="34" cy="60" r="26" fill="#111" />
      <circle cx="106" cy="60" r="26" fill="#111" />
      <circle cx="70" cy="34" r="24" fill="#fff" stroke="#111" strokeWidth="1.6" />
      <text x="34" y="66" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="700">H</text>
      <text x="106" y="66" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="700">H</text>
      <text x="70" y="40" textAnchor="middle" fill="#111" fontSize="16" fontWeight="700">O</text>
    </svg>
  );
}

/* ============================================================
 * CSS（.mbs- 接頭辞でスコープ／セクション全体を少し違う色にする）
 * ============================================================ */

const SECTION_CSS = `
.mbs-root{
  --mbs-accent:#7c3aed;
  --mbs-accent-d:#5b21b6;
  --mbs-accent-l:#f3ecff;
  --mbs-line:#c9bce6;
  --mbs-ink:#3f3352;
  font-family:'Hiragino Sans','Yu Gothic','Meiryo','Noto Sans JP',sans-serif;
  color:var(--mbs-ink);
  background:linear-gradient(180deg,#fbf8ff 0%,#f7f2ff 100%);
  border:2px solid var(--mbs-line);
  border-left:8px solid var(--mbs-accent);
  border-radius:12px;
  padding:18px 18px 22px;
  margin:20px 0;
  line-height:1.9;
}

.mbs-header{display:flex;gap:12px;align-items:flex-start;border-bottom:2px dotted var(--mbs-line);padding-bottom:14px;margin-bottom:14px;}
.mbs-back{display:inline-flex;align-items:center;gap:4px;border:1.5px solid var(--mbs-line);background:#fff;color:var(--mbs-accent-d);border-radius:8px;padding:5px 10px;font-size:.8em;font-weight:800;cursor:pointer;flex-shrink:0;font-family:inherit;}
.mbs-back:hover{background:var(--mbs-accent-l);}
.mbs-header-kicker{margin:0;font-size:.72em;font-weight:800;letter-spacing:.12em;color:var(--mbs-accent);}
.mbs-header-title{margin:2px 0 6px;font-size:1.32em;font-weight:900;color:var(--mbs-accent-d);}
.mbs-header-note{margin:0;font-size:.8em;color:#6b6280;line-height:1.7;}
.mbs-header-note b{color:var(--mbs-accent-d);}

.mbs-h3{
  font-size:1.08em;font-weight:900;color:var(--mbs-accent-d);
  margin:22px 0 12px;padding:0;border:0;background:none;
}
.mbs-p{margin:8px 0;font-size:.94em;}
.mbs-right{text-align:right;}
.mbs-small{font-size:.78em;}
.mbs-strong{font-weight:800;}
.mbs-goal{background:#fff6cc;border:1px solid #e8d27a;border-radius:6px;padding:8px 10px;}

/* 囲み見出し（例題1・解答・演習1 …） */
.mbs-tag{
  display:inline-block;border:1.6px solid var(--mbs-ink);
  padding:0 6px;font-weight:800;font-size:.92em;background:#fff;
  white-space:nowrap;
}
/* 網かけ強調 */
.mbs-mark{background:#ded6ef;padding:1px 4px;font-weight:800;}
/* 太下線 */
.mbs-u{font-weight:800;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px;}
/* 小さな囲み */
.mbs-boxed{display:inline-block;border:1.4px solid var(--mbs-ink);padding:0 4px;font-weight:700;}

/* 「1を掛けている（…）」 */
.mbs-onetimes{
  display:inline-block;border:1.6px solid var(--mbs-ink);
  padding:2px 8px;margin:6px 0 10px;font-size:.9em;background:#fff;
}

/* 式行 */
.mbs-formula{
  text-align:center;margin:14px 0;font-size:1.06em;font-weight:700;
  line-height:2.6;background:#fff;border:1px solid var(--mbs-line);
  border-radius:6px;padding:10px 8px;overflow-x:auto;
}

/* 例題ブロック */
.mbs-ex{
  background:#fff;border:1.6px solid var(--mbs-line);border-left:5px solid var(--mbs-accent);
  border-radius:8px;padding:12px 14px;margin:16px 0;
}
.mbs-ex-q{margin:0 0 8px;font-size:.95em;font-weight:700;}
.mbs-ex-a{font-size:.95em;}

/* 演習 */
.mbs-drill{
  background:#fff;border:1.6px dashed var(--mbs-accent);
  border-radius:8px;padding:12px 14px;margin:16px 0;
}
.mbs-list{list-style:none;padding-left:1.1em;margin:8px 0;font-size:.92em;}
.mbs-list>li{margin:2px 0;}
.mbs-list>li::before{content:'・';margin-right:2px;}

/* 折りたたみ（解答など）。まとめプリント本文（.lc-ans）と同じ挙動・同じ
   タップ領域にそろえている。閉じているときは「押せるボタン」に見せる。 */
.mbs-details{border:2px solid var(--mbs-line);border-radius:12px;padding:0;margin:14px 0;background:#fff;overflow:hidden;transition:border-color .18s ease,box-shadow .18s ease;}
.mbs-details[open]{border-color:var(--mbs-accent);box-shadow:0 2px 10px rgba(124,58,237,.1);}
.mbs-details>summary{display:flex;align-items:center;gap:8px;min-height:46px;padding:10px 14px;font-weight:800;color:var(--mbs-accent-d);background:var(--mbs-accent-l);cursor:pointer;font-size:.9em;list-style:none;user-select:none;-webkit-tap-highlight-color:transparent;transition:background .18s ease;}
.mbs-details>summary::-webkit-details-marker{display:none;}
.mbs-details>summary::marker{content:'';}
.mbs-details>summary:hover{background:#e9dcff;}
.mbs-details>summary:focus-visible{outline:3px solid var(--mbs-accent);outline-offset:-3px;}
.mbs-details-ico{font-size:1.05em;line-height:1;flex:0 0 auto;}
.mbs-details-txt{flex:1 1 auto;min-width:0;}
/* 開閉状態を右端に文字で出す（三角だけだと気づかれにくいため）。
   本文側（.lc-ans-hint）と同じ文言・同じ位置にそろえている。 */
.mbs-details-hint{flex:0 0 auto;font-size:.82em;font-weight:800;letter-spacing:.02em;color:var(--mbs-accent);white-space:nowrap;}
.mbs-details>summary>.mbs-details-hint::after{content:'タップして表示 ▼';}
.mbs-details[open]>summary>.mbs-details-hint::after{content:'閉じる ▲';}
.mbs-details-body{padding:12px 14px 14px;margin-top:0;border-top:1px dotted var(--mbs-line);}
@media (prefers-reduced-motion: no-preference){
  .mbs-details[open]>.mbs-details-body{animation:mbsAnsReveal .22s ease-out both;}
}
@keyframes mbsAnsReveal{from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:translateY(0);}}
@media (max-width:640px){
  .mbs-details>summary{min-height:52px;font-size:.95em;padding:12px;}
  /* スマホでは文言を短くして折り返しを防ぐ（本文側と同じ扱い） */
  .mbs-details>summary>.mbs-details-hint::after{content:'▼';}
  .mbs-details[open]>summary>.mbs-details-hint::after{content:'▲';}
}

/* 解答の一括開閉ボタン */
.mbs-toolbar{display:flex;justify-content:flex-end;margin:0 0 4px;}
.mbs-revealall{
  display:inline-flex;align-items:center;gap:6px;min-height:40px;
  border:2px solid var(--mbs-line);border-radius:12px;background:#fff;
  color:var(--mbs-accent-d);padding:8px 12px;font-size:.78em;font-weight:800;
  font-family:inherit;cursor:pointer;transition:background .18s ease,border-color .18s ease;
  -webkit-tap-highlight-color:transparent;
}
.mbs-revealall::before{content:'👁';font-weight:400;}
.mbs-revealall:hover{background:var(--mbs-accent-l);}
.mbs-revealall.is-on{background:var(--mbs-accent);border-color:var(--mbs-accent);color:#fff;}
.mbs-revealall.is-on::before{content:'🙈';}
.mbs-revealall.is-on:hover{background:#6d28d9;}
.mbs-revealall:focus-visible{outline:3px solid var(--mbs-accent);outline-offset:2px;}
@media (max-width:640px){
  .mbs-revealall{min-height:44px;font-size:.82em;}
}

.mbs-hr{border:0;border-top:2px dotted var(--mbs-line);margin:26px 0;}

/* プリントの図（四角＋太矢印＋粒子の円） */
.mbs-fig{margin:14px 0;overflow-x:auto;}
.mbs-fig-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.mbs-fig-row-top{align-items:flex-start;}
.mbs-fig-col{display:flex;flex-direction:column;gap:10px;}
.mbs-box{background:#fff;padding:6px 10px;font-size:.88em;line-height:1.7;text-align:center;}
.mbs-box p{margin:0;}
.mbs-box-solid{border:1.6px solid var(--mbs-ink);}
.mbs-fat-arrow{font-size:1.5em;color:#2f2740;line-height:1;}
.mbs-fat-arrow-left{transform:scaleX(1);}
.mbs-dots{width:92px;height:92px;flex-shrink:0;}
.mbs-dots-svg{width:100%;height:100%;display:block;}
.mbs-note-inline{
  display:inline-block;border:1.4px solid var(--mbs-ink);background:#fff;
  padding:4px 8px;margin:10px 0;font-size:.9em;
}
.mbs-outline-box{border:1.6px solid var(--mbs-ink);background:#fff;border-radius:4px;padding:10px 14px;margin:16px 0;}
.mbs-star{margin:0 0 6px;font-weight:800;font-size:.95em;}

/* 例題1 の 日→時→分→秒 の図 */
.mbs-chain{display:flex;align-items:flex-start;gap:2px;flex-wrap:nowrap;overflow-x:auto;padding:10px 2px 4px;}
.mbs-chain-node{
  border:1.6px solid var(--mbs-ink);background:#fff;
  padding:6px 14px;font-weight:700;font-size:.95em;flex-shrink:0;
}
.mbs-chain-link{display:flex;flex-direction:column;align-items:center;flex-shrink:0;padding:0 2px;}
.mbs-chain-arrow{font-size:.85em;letter-spacing:-2px;color:#2f2740;line-height:1.6;}
.mbs-chain-label{font-size:.75em;white-space:nowrap;}

/* 例題2 の水分子の図 */
.mbs-flow-text{flex:1 1 320px;min-width:250px;}
.mbs-h2o{border:1.6px dashed var(--mbs-ink);background:#fff;padding:10px;margin:0;text-align:center;flex:0 0 300px;}
.mbs-h2o-mols{display:flex;justify-content:center;gap:6px;}
.mbs-h2o-svg{width:132px;height:auto;}
.mbs-h2o figcaption{font-size:.82em;margin-top:6px;}

.mbs-ex6{margin:12px 0;}
.mbs-ex6-text{font-size:.95em;}

.mbs-closing{
  margin-top:22px;padding:12px 14px;background:#fff;
  border:2px solid var(--mbs-accent);border-radius:8px;font-size:.92em;line-height:1.9;
}
.mbs-closing p{margin:0;}

/* 分数（MolUnitMap と共通の見た目） */
.mbs-root .mb-frac{display:inline-flex;flex-direction:column;vertical-align:middle;border:1.5px solid currentColor;margin:0 2px;text-align:center;}
.mbs-root .mb-frac-up{padding:0 6px;border-bottom:1.5px solid currentColor;font-size:.9em;line-height:1.45;}
.mbs-root .mb-frac-down{padding:0 6px;font-size:.9em;line-height:1.45;}

@media (max-width:640px){
  .mbs-root{padding:12px 12px 16px;border-left-width:6px;}
  .mbs-header-title{font-size:1.12em;}
  .mbs-formula{font-size:.94em;padding:8px 4px;}
  .mbs-h2o{flex:1 1 100%;}
  .mbs-h2o-svg{width:112px;}
}
`;

export default MolBasicsSection;
