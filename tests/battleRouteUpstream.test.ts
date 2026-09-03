import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * ===================================================================
 * 対戦画面へ「着くまで」の道に、対戦が書かれていることの機械検査
 * ===================================================================
 *
 * ★このテストが生まれた経緯（利用者の指示を逐語で残す）★
 *
 *   「あのさ、オンラインをメインにするUIにしていかんとだめよね？
 *     取り組めるところから頼む　でも問題をなくすとかはダメだよ
 *     ボタンの配置変えるぐらい」
 *
 *   「対戦画面は他のところでしているのでそこまでのところはすべて変えて」
 *
 * つまり
 *   ・src/battle/ 配下（対戦画面そのもの）は別で作業中なので触らない
 *   ・★そこへ行くまでの道は全部変えていい★
 *   ・ただし ★問題（入口・機能）を1つも減らしてはいけない★
 *
 * ★調べて分かった状態（変更前）★
 *   対戦は FEATURES.battle === true で公開済みなのに、
 *   道の途中にある画面が対戦を一言も説明していなかった。
 *
 *     Onboarding.tsx（アプリの入口）  … 対戦 0 回
 *     googleAuth.ts の利点リスト     … 対戦 0 回（★対戦は連携必須なのに★）
 *     Intro.tsx（アプリ紹介）        … 対戦 0 回
 *     ModeSelection.tsx（学習の入口）… 対戦 0 回
 *     SubjectSelection.tsx（科目選択）… 対戦 0 回
 *     Leaderboard.tsx（ランキング）  … 対戦 0 回
 *
 *   とくに悪かったのが 2 点。
 *
 *   ① 対戦は Firestore のルール上、uid を持たないゲストでは
 *      ★どうやっても部屋に入れない★（src/battle/ui/BattleHome.tsx）。
 *      ＝「連携すると便利」ではなく「連携しないと存在しない機能」。
 *      なのに連携をすすめる理由に対戦が挙がっておらず、
 *      ゲスト確認文にも「対戦が使えない」と書いていなかった。
 *      → ゲストで始めた人はホーム最上部の対戦を押して初めて弾かれる。
 *
 *   ② このアプリにはランキングが2つある。
 *        Leaderboard    … ★学習量★ のランキング（leaderboard_*）
 *        BattleRanking  … ★対戦の強さ（レート）★
 *      これは意図的に別コレクションにしてある。
 *      ところが下部ナビの「ランキング」は前者へ行くので、
 *      対戦の順位を探している人が行き止まりになっていた。
 *
 * ★このテストが守らないもの（意図的）★
 *   言い回し・色・角丸・影・並びの細かい調整は検査しない。
 *   固定するのは
 *     ① 道の各画面が対戦に触れていること
 *     ② 対戦へ行けること（onBattle が配線されていること）
 *     ③ ★学習側の入口・文言が消えていないこと★
 *   の3点だけ。文章の推敲でテストが落ちるのは無駄なので。
 *
 * ★境界★
 *   src/battle/ 配下は「他のところで作業中」なので、
 *   このテストは src/battle/ の中身を一切検査しない。
 */

const read = (rel: string) => readFileSync(resolve(__dirname, '..', rel), 'utf-8');

const APP = read('src/App.tsx');
const ONBOARDING = read('src/components/Onboarding.tsx');
const GOOGLE_AUTH = read('src/utils/googleAuth.ts');
const INTRO = read('src/components/Intro.tsx');
const MODE = read('src/components/ModeSelection.tsx');
const SUBJECT = read('src/components/SubjectSelection.tsx');
const LEADER = read('src/components/Leaderboard.tsx');

describe('① アプリの入口（オンボーディング）が対戦を説明している', () => {
  it('連携の利点に対戦が入っている', () => {
    // 対戦は連携しないと存在しない機能なので、利点の一覧に無いのはおかしい。
    expect(GOOGLE_LINK_BENEFITS_BLOCK()).toMatch(/対戦/u);
  });

  /** GOOGLE_LINK_BENEFITS の配列リテラルだけを切り出す */
  function GOOGLE_LINK_BENEFITS_BLOCK(): string {
    const m = GOOGLE_AUTH.match(/GOOGLE_LINK_BENEFITS[^=]*=\s*\[([\s\S]*?)\];/u);
    expect(m, 'GOOGLE_LINK_BENEFITS の配列が見つからない').toBeTruthy();
    return m![1];
  }

  it('利点の1行目が対戦（読み飛ばされない位置に置く）', () => {
    const block = GOOGLE_LINK_BENEFITS_BLOCK();
    const items = block
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith("'"));
    expect(items.length).toBeGreaterThanOrEqual(3);
    expect(items[0]).toMatch(/対戦/u);
  });

  it('★学習記録の引き継ぎという利点は消していない★', () => {
    // 対戦を足すことと、学習の利点を削ることは別。
    const block = GOOGLE_LINK_BENEFITS_BLOCK();
    expect(block).toMatch(/学習記録/u);
    expect(block).toMatch(/ランキング|フレンド/u);
    expect(block).toMatch(/復習/u);
  });

  it('ログイン画面の説明文が対戦に触れている', () => {
    // 「ようこそ！」の直後の説明文に対戦が出ていること。
    expect(ONBOARDING).toMatch(/対戦/u);
  });

  it('ゲストで始める前に「対戦が使えない」と伝えている', () => {
    // 押してから弾かれるのではなく、押す前に分かるようにする。
    const m = ONBOARDING.match(/ゲスト利用では([\s\S]{0,200})/u);
    expect(m, 'ゲスト利用の説明文が見つからない').toBeTruthy();
    expect(m![1]).toMatch(/対戦/u);
  });

  it('★ゲストでも学習はできることを隠していない★', () => {
    // 対戦を前に出すことと、学習の逃げ道を隠すことは別。
    // 隠すとただの連携の強制になる。
    expect(ONBOARDING).toMatch(/ゲストのまま/u);
  });
});

describe('② 道の途中の画面から対戦へ行ける', () => {
  /**
   * App.tsx の「描画の行」を切り出す。
   *
   * ★注意：単に appState === 'x' を含む行を探してはいけない★
   *   App.tsx には画面の先読み（useEffect の中の
   *   `if (appState === 'mode_selection' || …) import(…)`）が別にあり、
   *   そちらが先に現れる。描画行は必ず
   *   `{appState === 'x' &&` の形なので、そこまで含めて探す。
   */
  const lineOf = (state: string): string => {
    const needle = `{appState === '${state}' &&`;
    const line = APP.split('\n').find((l) => l.includes(needle));
    expect(line, `App.tsx に ${state} の描画行が見つからない`).toBeTruthy();
    return line!;
  };

  it('アプリ紹介（Intro）に対戦の案内と入口がある', () => {
    expect(INTRO).toMatch(/オンライン対戦/u);
    expect(INTRO).toContain('aria-label="オンライン対戦を開く"');
    expect(INTRO).toMatch(/onBattle\?:\s*\(\)\s*=>\s*void/u);
    // 渡されなかったときは描かない（見えるのに入れないを作らない）
    expect(INTRO).toMatch(/\{onBattle && \(/u);
  });

  it('学習モード選択（ModeSelection）に対戦の席がある', () => {
    expect(MODE).toMatch(/オンライン対戦/u);
    expect(MODE).toContain('aria-label="オンライン対戦を開く"');
    expect(MODE).toMatch(/onBattle\?:\s*\(\)\s*=>\s*void/u);
    expect(MODE).toMatch(/\{onBattle && \(/u);
  });

  it('科目選択（SubjectSelection）が対戦にも使われる科目だと書いている', () => {
    expect(SUBJECT).toMatch(/対戦/u);
  });

  it('学習量のランキングから対戦ランキングへ橋が架かっている', () => {
    // このアプリのランキングは2つある。探し物がどこにあるか書く。
    expect(LEADER).toMatch(/onBattle\?:\s*\(\)\s*=>\s*void/u);
    expect(LEADER).toMatch(/\{onBattle && \(/u);
    expect(LEADER).toMatch(/レート/u);
  });

  it('App 側で3画面に onBattle が渡されている', () => {
    expect(lineOf('intro')).toContain('onBattle=');
    expect(lineOf('mode_selection')).toContain('onBattle=');
    expect(lineOf('leaderboard')).toContain('onBattle=');
  });

  it('★FEATURES.battle が false のときは渡さない★', () => {
    // ホームのボタン・ナビの席と同じ条件にする。
    // 片方だけ残ると「見えるのに入れない」になる。
    for (const state of ['intro', 'mode_selection', 'leaderboard']) {
      expect(lineOf(state)).toMatch(/onBattle=\{FEATURES\.battle \? \(\) => setAppState\('battle'\) : undefined\}/u);
    }
  });
});

describe('③ ★学習側を1つも減らしていない★', () => {
  it('アプリ紹介の元の内容（化学基礎ノートについて・SNS）が残っている', () => {
    expect(INTRO).toMatch(/化学基礎ノートについて/u);
    expect(INTRO).toMatch(/記述問題の自己採点機能/u);
    expect(INTRO).toMatch(/Instagramへ/u);
    expect(INTRO).toMatch(/公式サイトへ/u);
  });

  it('学習モード選択のカードが残っている', () => {
    expect(MODE).toMatch(/学習\(インプット\)/u);
    expect(MODE).toMatch(/演習問題/u);
    expect(MODE).toMatch(/共通テスト出題傾向/u);
    expect(MODE).toMatch(/予想問題/u);
    // モードを選ぶ本来の配線
    expect(MODE).toContain("onSelectMode('learning')");
    expect(MODE).toContain("onSelectMode('practice')");
  });

  it('科目選択が科目を選ぶ画面のままである', () => {
    expect(SUBJECT).toMatch(/科目を選んでください/u);
    expect(SUBJECT).toContain('onSelectSubject');
  });

  it('学習量のランキングの中身が残っている', () => {
    expect(LEADER).toMatch(/全章合計/u);
    expect(LEADER).toMatch(/章別ベスト/u);
    expect(LEADER).toMatch(/期間別/u);
    expect(LEADER).toMatch(/フレンド競争/u);
  });

  it('オンボーディングの最後のボタンが学習にも触れている', () => {
    // 「対戦と学習をはじめる」。行き先のホームには両方あるので両方書く。
    const m = ONBOARDING.match(/(?:対戦[^<]*学習|学習[^<]*対戦)をはじめる/u);
    expect(m, '最後のボタンが対戦・学習の両方に触れていない').toBeTruthy();
  });
});

describe('④ 境界：対戦画面そのものは触っていない', () => {
  it('この検査は src/battle/ の中身を読んでいない', () => {
    // 利用者の指示「対戦画面は他のところでしているので」。
    // 別作業とぶつからないよう、ここでは src/battle/ を検査対象にしない。
    const self = read('tests/battleRouteUpstream.test.ts');
    const reads = self.match(/read\('([^']+)'\)/gu) ?? [];
    for (const r of reads) {
      expect(r).not.toMatch(/src\/battle\//u);
    }
  });
});
