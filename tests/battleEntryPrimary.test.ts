import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Home } from '../src/components/Home';

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
  it('独立した対戦ステージに主CTAがあり、学習ノートより先に描画される', () => {
    const frame = HOME.indexOf('data-home-arena');
    const battle = HOME.indexOf('data-home-battle');
    const study = HOME.indexOf('data-home-study');
    expect(frame).toBeGreaterThan(0);
    expect(battle).toBeGreaterThan(frame);
    expect(battle).toBeLessThan(study);
    const stage = HOME.slice(frame, study);
    expect(stage).toContain('onClick={onBattle}');
    expect(stage).toContain('オンライン対戦を開く');
    expect(stage).toContain('home-shortcuts');
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

// Source contracts above are complemented by actual React rendering:
// a missing callback must remove the button, not leave a dead affordance.
describe('ホームの実レンダー', () => {
  const props = {
    onStart: () => {}, onIntro: () => {}, onNoteList: () => {},
    onLogicalTree: () => {}, isGuest: false,
  };
  it('対戦・補助3機能・学習・進捗が同時に存在する', () => {
    const html = renderToStaticMarkup(React.createElement(Home, { ...props, onBattle: () => {} }));
    for (const label of ['オンライン対戦を開く', '学習ノートを開く', 'アプリ紹介を開く', 'ご意見を送る', '学習を始める', '全科目の進捗を見る']) {
      expect(html).toContain(label);
    }
    expect(html.match(/data-home-battle=/g)).toHaveLength(1);
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('<details class="home-all-progress">');
  });
  it('対戦非公開時も学習は使え、対戦を約束する表示を残さない', () => {
    const html = renderToStaticMarkup(React.createElement(Home, props));
    expect(html).not.toContain('data-home-battle');
    expect(html).not.toContain('ONLINE QUIZ BATTLE');
    expect(html).not.toContain('全国レート戦');
    expect(html).toContain('学習を始める');
    expect(html).toContain('MY STUDY ROOM');
  });
});
