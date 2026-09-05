import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

import {
  FEATURES,
  isFeatureEnabled,
  isSubjectEnabled,
  filterEnabledSubjects,
  fallbackSubjectId,
} from '../src/config/features';

/**
 * ===================================================================
 * 公開/非公開フラグが「4箇所すべて」を通っていることの機械検査
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ このテストが存在する理由
 * -------------------------------------------------------------------
 * 「未完成の機能を隠す」は、隠し忘れが1箇所あると意味が消える。
 * 今回いただいた指摘はまさにそれで、
 *   ・ナビからは消えている
 *   ・でも別の入口からは入れてしまう
 * という状態だった。
 *
 * 人間の記憶で「4箇所ぜんぶ直した」を担保するのは無理である。
 * 4箇所のうち3箇所を直した状態は、直していない状態と
 * ★利用者から見て何も変わらない★（入れてしまうので）。
 * だから機械に数えさせる。
 *
 * -------------------------------------------------------------------
 * ■ 4箇所とは
 * -------------------------------------------------------------------
 *   1. ナビ         … src/App.tsx のメインナビゲーション
 *   2. トップのカード … src/components/SubjectSelection.tsx
 *   3. ルーティング   … src/App.tsx の画面遷移の受け口
 *   4. 一覧・検索結果 … src/components/Home.tsx の科目別進捗
 *
 * このうち ★3 が一番忘れられる★。
 * 1・2・4 は「目に見えるので気づく」が、3 は
 * 「保存された状態から戻ってきた場合」にしか通らないため、
 * 手で触っている限り気づけない。
 *
 * -------------------------------------------------------------------
 * ■ 検査の方法について（なぜソースを文字列で読むのか）
 * -------------------------------------------------------------------
 * 本来は画面を動かして確かめたいが、
 * この4箇所は「画面の描画」と「状態の復元」が混ざっており、
 * 画面テストだと 3 を通ったかどうかを外から観測できない。
 * そこで
 *   「そのファイルがフラグを参照しているか」
 * という、書き忘れたら必ず落ちる条件で検査する。
 *
 * ★弱点は自覚している★
 * import しているだけで実際には使っていない、という抜け方はできる。
 * それを塞ぐため、単なる import ではなく
 * ★具体的な使用箇所（フィルタ／ゲート）まで文字列で確認する。★
 */

const ROOT = join(__dirname, '..');

function readSource(relativePath: string): string {
  const full = join(ROOT, relativePath);
  expect(existsSync(full), `${relativePath} が見つからない`).toBe(true);
  return readFileSync(full, 'utf-8');
}

/**
 * コメントを取り除く。
 *
 * ★これをやらないとテストが嘘をつく★
 * コメントに「isSubjectEnabled」と書いてあるだけで
 * 「参照している」と判定されてしまい、
 * 実装を消してもテストが通る状態になる。
 * （このプロジェクトでは過去に「一部だけ見て安全と判定した」
 *   計測ミスをやっているので、同じ形の失敗を避ける。）
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

describe('公開フラグ（src/config/features.ts）', () => {
  it('指摘で挙げられたキーがすべて存在する', () => {
    // ここに並べたキーは、いただいた指摘に書かれていたものそのまま。
    // 名前を変えたければテストも一緒に直すことになる（＝意図的な変更になる）。
    const required = [
      'chemistry_basic',
      'chemistry',
      'listening',
      'math',
      'physics',
      'my_words',
      'bgm',
      'ranking',
    ];
    for (const key of required) {
      expect(Object.prototype.hasOwnProperty.call(FEATURES, key), `${key} が無い`).toBe(true);
    }
  });

  it('すべての値が真偽値である（"true" のような文字列が混ざらない）', () => {
    // 文字列の 'false' は if で true になるため、
    // ★非公開にしたつもりで公開される★ という最悪の事故になる。
    for (const [key, value] of Object.entries(FEATURES)) {
      expect(typeof value, `${key} が真偽値でない`).toBe('boolean');
    }
  });

  it('問題データが無い物理だけが非公開である', () => {
    // 物理は問題データそのものが無いので、公開しても白い画面になる。
    expect(FEATURES.physics).toBe(false);
  });

  it('★数学は公開されている（採点を直したので隠さない）★', () => {
    // いったん「採点が甘いから隠す」と判断したが、それは間違いだった。
    // 隠すと誤判定は起きない代わりに、正しく採点できる問題まで使えなくなる。
    // 採点そのものを直したので公開する。
    //   直したもの: src/utils/mathExpression.ts
    //   固定するもの: tests/mathExpression.test.ts（実測6件の誤判定 → 0件）
    // ★このテストを false 側に戻すときは、
    //   「採点が直っていない」ことを実測で示してからにする。★
    expect(FEATURES.math).toBe(true);
  });

  it('未実装の機能は非公開である', () => {
    expect(FEATURES.my_words).toBe(false);
  });

  it('BGM の既定値は OFF である', () => {
    // ★「機能を消す」ではなく「最初は鳴らさない」という意味★
    // 図書館・電車で勝手に音が出るのを止めるのが目的。
    expect(FEATURES.bgm).toBe(false);
  });

  it('公開中の科目は公開のままである（うっかり全部消していないこと）', () => {
    expect(FEATURES.chemistry_basic).toBe(true);
    expect(FEATURES.chemistry).toBe(true);
    expect(FEATURES.listening).toBe(true);
  });
});

describe('判定関数の安全側（分からないものは隠す）', () => {
  it('知らないキーは false になる', () => {
    // ★「公開」に倒すと、フラグを足し忘れた新機能が黙って公開される。★
    // 「うっかり隠れた」は問い合わせで気づけるが、
    // 「うっかり公開した」は未完成のものを利用者に見せてしまう。
    expect(isFeatureEnabled('does_not_exist')).toBe(false);
    expect(isSubjectEnabled('does_not_exist')).toBe(false);
  });

  it('空・null・undefined でも落ちずに false になる', () => {
    expect(isFeatureEnabled('')).toBe(false);
    expect(isFeatureEnabled(null)).toBe(false);
    expect(isFeatureEnabled(undefined)).toBe(false);
    expect(isSubjectEnabled('')).toBe(false);
    expect(isSubjectEnabled(null)).toBe(false);
    expect(isSubjectEnabled(undefined)).toBe(false);
  });

  it('科目IDとフラグ名がずれていても対応が取れている（english_listening ↔ listening）', () => {
    // 科目IDを変えると保存済みの進捗・復習リストのキーが全部変わるので
    // ★IDは変えない★。代わりに対応表で吸収する。
    expect(isSubjectEnabled('english_listening')).toBe(FEATURES.listening);
  });

  it('非公開の科目は一覧から取り除かれる', () => {
    const list = [
      { id: 'chemistry_basic' },
      { id: 'math' },
      { id: 'physics' },
      { id: 'english_listening' },
    ];
    const visible = filterEnabledSubjects(list, (x) => x.id).map((x) => x.id);
    expect(visible).toContain('chemistry_basic');
    expect(visible).toContain('english_listening');
    // 数学は公開中なので残る
    expect(visible).toContain('math');
    // 物理は問題データが無いので取り除かれる
    expect(visible).not.toContain('physics');
  });

  it('空配列・null を渡しても落ちない', () => {
    expect(filterEnabledSubjects([], (x: any) => x)).toEqual([]);
    expect(filterEnabledSubjects(null as any, (x: any) => x)).toEqual([]);
  });

  it('代わりの科目は「公開中のものの中から」選ばれる', () => {
    // 非公開の科目へ倒してしまうと、隠したはずの画面に着地する。
    // 物理（非公開）は飛ばし、公開中の化学基礎に着地すること。
    expect(fallbackSubjectId(['physics', 'chemistry_basic'])).toBe('chemistry_basic');
    // 先頭が公開中ならそれを選ぶ
    expect(fallbackSubjectId(['math', 'chemistry_basic'])).toBe('math');
  });

  it('公開中の科目が候補に無ければ null を返す（勝手に決めない）', () => {
    // 「必ず化学基礎に倒す」と書くと、化学基礎を非公開にした日に
    // 非公開の科目へ倒す関数になってしまう。
    expect(fallbackSubjectId(['physics'])).toBeNull();
    expect(fallbackSubjectId(['physics', 'unknown_subject'])).toBeNull();
    expect(fallbackSubjectId([])).toBeNull();
  });
});

describe('★4箇所すべてを通っていることの検査★', () => {
  /*
    ここが今回の指摘に対する本体。
    「ナビだけ隠して別の入口から入れてしまう」を、
    人の記憶ではなく機械で防ぐ。
  */

  it('1) ナビ … ランキングのボタンがフラグの内側にある', () => {
    const src = stripComments(readSource('src/App.tsx'));
    expect(src).toContain('FEATURES.ranking');
  });

  it('2) トップのカード … 非公開の科目を除いた一覧を描画している', () => {
    const src = stripComments(readSource('src/components/SubjectSelection.tsx'));
    expect(src).toContain('isSubjectEnabled');
    // ★フィルタした配列を実際に描画しているか★まで見る。
    // import だけして元の配列を描画していたら意味がない。
    expect(src).toContain('visibleSubjects.map');
  });

  it('3) ルーティング … 保存された科目から復元するときにフラグを通す', () => {
    const src = stripComments(readSource('src/App.tsx'));
    expect(src).toContain('isSubjectEnabled');
    // 復元の失敗時に「公開中のものから選ぶ」処理まで通っていること。
    expect(src).toContain('fallbackSubjectId');
  });

  it('3-b) ルーティング … 科目を切り替える受け口でもフラグを通す', () => {
    const src = stripComments(readSource('src/App.tsx'));
    /*
      ★入口ではなく受け口で守る★
      「非公開の科目を選ぶボタン」を消すだけでは、
      別の経路（保存状態・他画面のリンク）から同じ関数が呼ばれる。
      関数の先頭で弾いておけば、経路が何本あっても漏れない。
    */
    const m = src.match(/const handleSelectSubject[\s\S]{0,400}/);
    expect(m, 'handleSelectSubject が見つからない').not.toBeNull();
    expect(m![0]).toContain('isSubjectEnabled');
  });

  it('3-c) ルーティング … 画面そのものの描画にもフラグがかかっている', () => {
    const src = stripComments(readSource('src/App.tsx'));
    /*
      ナビのボタンだけを隠すと、ホーム画面の中にある
      「ランキングを見る」から入れてしまう。
      ★描画する場所そのものに条件を付ける★のが正しい塞ぎ方。
    */
    const m = src.match(/appState === 'leaderboard'[\s\S]{0,200}/);
    expect(m, 'ランキング画面の描画箇所が見つからない').not.toBeNull();
    expect(m![0]).toContain('FEATURES.ranking');
  });

  it('4) 一覧・検索結果 … 科目別の一覧が非公開の科目を含まない', () => {
    const src = stripComments(readSource('src/components/Home.tsx'));
    expect(src).toContain('isSubjectEnabled');
    // 索引をそのまま並べていないこと（フィルタを通していること）。
    expect(src).toMatch(/SUBJECT_INDEX\s*\.\s*filter/);
  });
});

describe('★高校入試 理科（本体に教科データを持たない教科）の入口も4箇所を通っている★', () => {
  /*
    理科は科目選択のカードに並べていない（本体の章→大問→小問の形を持たないため）。
    そのぶん入口が普通の科目と違う場所にあるので、
    ★「隠したつもりで入れてしまう」経路も普通の科目と違う★。

    経路は次の3本。どれか1本でもフラグを見ていないと漏れる。
      1. ホームの入口カード
      2. 画面そのものの描画（＝localStorage から 'rika' が復元される経路）
      3. 対戦の結果から「この単元を演習する」で飛んでくる経路

    3 が特に見落としやすい。カードを消してもナビを消しても、
    対戦の結果画面からは飛べてしまう。
    （対戦の出題そのものは battleRules.ts の rika.enabled で別に切れる。
      対戦だけ出す／演習だけ出す、を別々に切れるようにしてある）
  */

  it('フラグが存在する', () => {
    expect(Object.prototype.hasOwnProperty.call(FEATURES, 'rika')).toBe(true);
    expect(typeof (FEATURES as Record<string, unknown>).rika).toBe('boolean');
  });

  it('科目一覧用の対応表には入れていない（カードに並べない）', () => {
    /*
      SUBJECT_FEATURE_KEY に載せると科目選択のカードに並ぼうとする。
      理科は押した先で本体の演習画面が1問も出せないので、
      ★見えるのに使えないカード★になってしまう。
      isSubjectEnabled('rika') が false であることで、
      本体の科目としては扱われないことが保証される。
    */
    expect(isSubjectEnabled('rika')).toBe(false);
  });

  it('1) ホームの入口カードがフラグの内側にある', () => {
    const src = stripComments(readSource('src/App.tsx'));
    const m = src.match(/onRika=\{[^}]*\}/);
    expect(m, 'App.tsx が Home へ onRika を渡していない').not.toBeNull();
    expect(m![0]).toContain('FEATURES.rika');
  });

  it('1-b) Home 側は渡されなければカードを描かない', () => {
    const src = stripComments(readSource('src/components/Home.tsx'));
    /*
      ★props を受け取っているだけでは足りない★
      受け取った上で「無ければ描かない」条件が必要。
      条件を書かずに描くと、渡していないのにカードが出る。
    */
    expect(src).toContain('onRika');
    expect(src).toMatch(/\{onRika\s*&&/);
  });

  it('2) 画面そのものの描画にもフラグがかかっている（保存状態の復元経路）', () => {
    const src = stripComments(readSource('src/App.tsx'));
    const m = src.match(/appState === 'rika'[\s\S]{0,120}/);
    expect(m, '理科画面の描画箇所が見つからない').not.toBeNull();
    expect(m![0]).toContain('FEATURES.rika');
  });

  it('3) 対戦の結果から飛んでくる経路にもフラグがかかっている', () => {
    const src = stripComments(readSource('src/App.tsx'));
    const m = src.match(/const handlePracticeFromBattle[\s\S]{0,600}/);
    expect(m, 'handlePracticeFromBattle が見つからない').not.toBeNull();
    /*
      ★外部教科を先に振り分けていること★
      これが無いと isSubjectId('rika') が false になるので教科が変わらず、
      理科で間違えたのに★化学基礎の第1章★が開く（実際に起きた不具合）。
    */
    expect(m![0]).toContain('isExternalSubject');
    expect(m![0]).toContain('FEATURES.rika');
  });
});

describe('フラグ置き場そのものの健全性', () => {
  it('★何も import しない★（どこからでも読めるようにするため）', () => {
    /*
      ここが他のファイルを読み始めると、
      「非公開かどうかを知るために非公開の中身を読み込む」
      という逆立ちが起きる。
      ・起動時の読み込み量が増える
      ・循環参照でビルドが不安定になる
      どちらも実際に起きる問題なので、依存ゼロを条件として固定する。
    */
    const raw = readSource('src/config/features.ts');
    const src = stripComments(raw);
    expect(src).not.toMatch(/^\s*import\s/m);
    expect(src).not.toMatch(/\brequire\s*\(/);
  });

  it('フラグの一覧が空でない（誤って中身を消していない）', () => {
    expect(Object.keys(FEATURES).length).toBeGreaterThan(0);
  });
});
