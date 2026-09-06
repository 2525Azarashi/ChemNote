import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * ===================================================================
 * オンライン対戦が「主動線」に居ることの機械検査
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ このテストが存在する理由
 * -------------------------------------------------------------------
 * 利用者からの指示：
 *   「あのさ、オンラインをメインにするUIにしていかんとだめよね？
 *     取り組めるところから頼む　でも問題をなくすとかはダメだよ
 *     ボタンの配置変えるぐらい」
 *
 * それまでのアプリは、機能としては対戦が公開されている
 * （FEATURES.battle === true）のに、そこへ行く道が
 *   ★ホーム画面を下までスクロールした先の小カード1つだけ★
 * だった。ナビには席が無く、ホームの主CTA は「学習を始める」だった。
 *
 * つまり「対戦がメイン」という設計意図と、画面上の扱いが
 * 食い違っていた。対戦は
 *   ・相手が要る（思い立ったときにすぐ押せないと成立しない）
 *   ・1試合が短い（入口が遠いと往復のほうが長くなる）
 * 性質の機能なので、主動線から2段下がっているのは構造の誤りである。
 *
 * -------------------------------------------------------------------
 * ■ なぜ「見た目」をテストするのか
 * -------------------------------------------------------------------
 * 配置は、後から別の変更をするときに★いちばん静かに壊れる★。
 * ボタンを1つ足す、順番を入れ替える、といった作業のついでに
 * 対戦が下へ落ちても、型チェックもテストも通ってしまう。
 * 落ちたことに気づくのは利用者だけ、という状態を作らないために、
 * 「対戦が主動線に居る」ことを機械が数える。
 *
 * -------------------------------------------------------------------
 * ■ ★このテストが守らないもの（意図的）★
 * -------------------------------------------------------------------
 * 色・角丸・影・文言の細かい言い回しは検査しない。
 * それらは調整されるべきもので、固定すると改善の邪魔になる。
 * ここで固定するのは
 *   ① 対戦がナビに席を持っている
 *   ② 対戦がホームの主CTA の枠にある
 *   ③ 学習の入口が消えていない（★これが一番大事★）
 * の3点だけ。
 */

const read = (rel: string) => readFileSync(resolve(__dirname, '..', rel), 'utf-8');
const APP = read('src/App.tsx');
const HOME = read('src/components/Home.tsx');

describe('① 対戦が下部ナビに席を持っている', () => {
  it('ナビに対戦のボタンがある', () => {
    /*
      ナビは「どの画面からでも1タップで届く」唯一の場所。
      主機能がここに無いと、学習中に思い立っても
      ホームへ戻る→スクロール→押す の2手が必要になる。
    */
    expect(
      APP,
      '★下部ナビから対戦の席が消えています★ src/App.tsx のメインナビゲーションを確認してください',
    ).toContain('オンライン対戦へ移動');
  });

  it('押すと対戦画面へ行く', () => {
    // 席があっても行き先が違えば意味がない。
    expect(APP).toMatch(/aria-label="オンライン対戦へ移動"[\s\S]{0,400}?setAppState\('battle'\)|setAppState\('battle'\)[\s\S]{0,400}?aria-label="オンライン対戦へ移動"/u);
  });

  it('FEATURES.battle が false のときは席ごと消える（見えるのに入れないを作らない）', () => {
    /*
      ホームのカードだけ隠してナビが残る、という片側だけの
      隠し忘れが過去に実際に起きている（tests/featureFlags.test.ts 参照）。
      ここでは対戦のナビがフラグの内側にあることを確かめる。
    */
    const i = APP.indexOf('オンライン対戦へ移動');
    expect(i).toBeGreaterThan(0);
    // ボタンの手前 800 文字以内に FEATURES.battle の門があること
    const before = APP.slice(Math.max(0, i - 800), i);
    expect(
      before,
      '★対戦のナビが FEATURES.battle の外に出ています★ フラグを false にしても席が残ってしまいます',
    ).toContain('FEATURES.battle');
  });

  it('ランキングより前に並んでいる（結果を見る画面が本体より先に来ない）', () => {
    const battle = APP.indexOf('オンライン対戦へ移動');
    const ranking = APP.indexOf('ランキング画面へ移動');
    expect(battle).toBeGreaterThan(0);
    expect(ranking).toBeGreaterThan(0);
    expect(
      battle,
      '★ランキングが対戦より前に並んでいます★ ランキングは対戦の結果を見る画面なので順序が逆です',
    ).toBeLessThan(ranking);
  });
});

describe('② 対戦がホームの主CTA になっている', () => {
  it('主CTA の枠（order-2 lg:order-4）に対戦がある', () => {
    /*
      order-2 はスマホで「あいさつの直後」＝必ず1画面目に入る位置。
      （なぜ order で位置を決めているかは tests/mobileOneScreenLayout.test.ts）
      対戦のボタンがこの枠の中にあることを、枠の開始位置からの
      距離で確かめる。
    */
    const frame = HOME.indexOf('order-2 lg:order-4');
    const battle = HOME.indexOf('オンライン対戦を開く');
    expect(frame, '★主CTA の枠（order-2 lg:order-4）が見つかりません★').toBeGreaterThan(0);
    expect(battle, '★ホームから対戦の主CTA が消えています★').toBeGreaterThan(0);
    expect(
      battle - frame,
      '★対戦のボタンが主CTA の枠から離れています★ 枠の外に出ると1画面目に入りません',
    ).toBeLessThan(3000);
    expect(battle).toBeGreaterThan(frame);
  });

  it('対戦が学習より前に置かれている', () => {
    const battle = HOME.indexOf('オンライン対戦を開く');
    const study = HOME.search(/'学習を始める'/u);
    expect(battle).toBeGreaterThan(0);
    expect(study).toBeGreaterThan(0);
    expect(
      battle,
      '★学習が対戦より前に来ています★「オンラインをメインに」の指示と逆です',
    ).toBeLessThan(study);
  });

  it('onBattle が渡されないときは対戦の枠を描かない', () => {
    // フラグ off／テストからの描画で「押せない対戦ボタン」を出さない。
    const i = HOME.indexOf('オンライン対戦を開く');
    const before = HOME.slice(Math.max(0, i - 600), i);
    expect(before).toContain('{onBattle && (');
  });
});

describe('③ ★問題（学習）の入口を消していない★', () => {
  /*
    利用者の指示にある「でも問題をなくすとかはダメだよ」を
    機械で守る。配置を変える作業のついでに学習の入口が
    消えることが一番あってはならない。
  */
  it('学習の主ボタンが残っている', () => {
    expect(
      HOME,
      '★学習の入口が消えています★ 配置を変えても入れる場所は減らしてはいけません',
    ).toMatch(/'学習を始める'/u);
    expect(HOME).toMatch(/'続きから開く'/u);
    expect(HOME).toContain('onClick={onStart}');
  });

  it('学習ノート・アプリ紹介・理科の入口も残っている', () => {
    // セカンダリから対戦カードを外したときに、隣を巻き込んでいないか。
    expect(HOME).toContain('学習ノートを開く');
    expect(HOME).toContain('アプリ紹介を開く');
    expect(HOME).toContain('高校入試 理科を開く');
  });

  it('ナビの学習・ホーム・設定の席も残っている', () => {
    expect(APP).toContain('ホーム画面へ移動');
    expect(APP).toContain('学習画面へ移動');
    expect(APP).toContain('設定画面へ移動');
  });

  it('対戦カードを主CTA とセカンダリの両方に置いていない（重複させない）', () => {
    /*
      同じ行き先の扉が2つあると「押した先が違うのでは」と
      考えさせてしまう。上へ移したので下からは外してある。
    */
    const hits = HOME.match(/aria-label="(オンライン対戦を開く|対戦モードを開く)"/gu) || [];
    expect(
      hits.length,
      `★対戦の入口がホーム内に ${hits.length} 個あります★ 主CTA の1つだけにしてください`,
    ).toBe(1);
  });
});
