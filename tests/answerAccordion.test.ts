import { readFileSync, readdirSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

import {
  toAnswerLabel,
  normalizeAnswerAccordions,
  countAnswerAccordions,
} from '../src/utils/learningAccordion';

/**
 * ===================================================================
 * 「💡 解答を表示」の折りたたみ の回帰テスト
 * ===================================================================
 *
 * まとめプリントの原稿（src/data/learningContent/section_*.ts）は
 * 自動生成物であり、直接書き換えない運用になっている。
 * そのため折りたたみの見出し文字が
 *   「💡 解答を表示」「💡 解答と解説を表示」「💡 解答・解説を表示」
 *   「💡 6ステップの解説を表示」
 * と4種類に散らばっており、これを *描画直前に* 正規化している。
 *
 * ここで守りたいのは次の3点。
 *
 *   1. 原稿の文言がどれであっても、押せるパネル（同じ構造）になること
 *   2. 「解答をすべて表示」が確実に効くこと
 *      … dangerouslySetInnerHTML は再描画で DOM が貼り直されるため、
 *        開閉状態は HTML 文字列側に焼き込む必要がある（退行しやすい）
 *   3. クリック音が鳴ること
 *      … useGlobalClickSound は `.cursor-pointer` を目印にしているので、
 *        このクラスが summary から消えると無音になる
 */

const CONTENT_DIR = 'src/data/learningContent';

/** 原稿ファイル（section_*.ts）の中身をまとめて読む */
function readSectionSources(): { file: string; src: string }[] {
  return readdirSync(CONTENT_DIR)
    .filter((f) => /^section_.*\.ts$/.test(f))
    .map((file) => ({ file, src: readFileSync(`${CONTENT_DIR}/${file}`, 'utf8') }));
}

describe('① 見出し文字の正規化（toAnswerLabel）', () => {
  it('末尾の「を表示」「を見る」を落とす（開閉状態は別に表示するため）', () => {
    expect(toAnswerLabel('💡 解答を表示')).toBe('解答');
    expect(toAnswerLabel('💡 解答を見る')).toBe('解答');
    expect(toAnswerLabel('💡 6ステップの解説を表示')).toBe('6ステップの解説');
  });

  it('「解答と解説」は「解答・解説」に寄せる（同じ意味の表記ゆれを消す）', () => {
    expect(toAnswerLabel('💡 解答と解説を表示')).toBe('解答・解説');
    expect(toAnswerLabel('💡 解答・解説を表示')).toBe('解答・解説');
  });

  it('タグ・実体参照・先頭の絵文字を取り除く', () => {
    expect(toAnswerLabel('<b>💡</b>&nbsp;解答を表示')).toBe('解答');
    expect(toAnswerLabel('▶ <span class="x">解答</span>')).toBe('解答');
  });

  it('空になってしまう場合は「解答」を出す（無題のパネルを作らない）', () => {
    expect(toAnswerLabel('')).toBe('解答');
    expect(toAnswerLabel('💡')).toBe('解答');
    expect(toAnswerLabel('<span></span>')).toBe('解答');
  });
});

describe('② HTMLの正規化（normalizeAnswerAccordions）', () => {
  const HTML = '<details><summary>💡 解答を表示</summary><p>答え</p></details>';

  it('details と summary に共通クラスを付ける', () => {
    const out = normalizeAnswerAccordions(HTML);
    expect(out).toContain('<details class="lc-ans">');
    expect(out).toContain('class="lc-ans-sum cursor-pointer"');
  });

  it('クリック音のための cursor-pointer が summary に付く', () => {
    // useGlobalClickSound は `.cursor-pointer` を目印にしている。
    // これが消えると「解答を開いても無音」という分かりにくい退行になる。
    const out = normalizeAnswerAccordions(HTML);
    const m = out.match(/<summary class="([^"]*)"/);
    expect(m).toBeTruthy();
    expect(m![1].split(/\s+/)).toContain('cursor-pointer');
  });

  it('開閉ヒント用の span を必ず持つ（開いているか一目で分かるようにする）', () => {
    const out = normalizeAnswerAccordions(HTML);
    expect(out).toContain('lc-ans-ico');
    expect(out).toContain('lc-ans-txt');
    expect(out).toContain('lc-ans-hint');
  });

  it('既存の class を消さずに lc-ans を足す', () => {
    const out = normalizeAnswerAccordions('<details class="box"><summary>解答を表示</summary>x</details>');
    expect(out).toContain('class="box lc-ans"');
  });

  it('openAll=true のとき open 属性を HTML に焼き込む', () => {
    // ここが本質。DOM を触る実装（d.open = true）だと、React が
    // innerHTML を貼り直した瞬間に開閉が失われる（ラベルだけ変わって開かない）。
    const out = normalizeAnswerAccordions(HTML, true);
    expect(out).toContain('<details class="lc-ans" open>');
  });

  it('openAll=false のときは原稿側の open を取り除く（状態を一本化する）', () => {
    const out = normalizeAnswerAccordions('<details open><summary>解答を表示</summary>x</details>', false);
    expect(out).not.toContain('open>');
    expect(out).toContain('<details class="lc-ans">');
  });

  it('複数の折りたたみをすべて処理する', () => {
    const out = normalizeAnswerAccordions(HTML + HTML + HTML, true);
    expect((out.match(/lc-ans-sum/g) || []).length).toBe(3);
    expect((out.match(/<details class="lc-ans" open>/g) || []).length).toBe(3);
  });

  it('解答の中身は失わない（本文をそのまま残す）', () => {
    const out = normalizeAnswerAccordions(HTML);
    expect(out).toContain('<p>答え</p>');
  });

  it('空文字はそのまま返す（呼び出し側で分岐しなくてよい）', () => {
    expect(normalizeAnswerAccordions('')).toBe('');
  });

  it('個数を数えられる（「すべて開く」ボタンの出し分けに使う）', () => {
    expect(countAnswerAccordions(HTML + HTML)).toBe(2);
    expect(countAnswerAccordions('折りたたみなし')).toBe(0);
    expect(countAnswerAccordions('')).toBe(0);
  });
});

describe('③ 実際の原稿すべてが正規化できる', () => {
  const sections = readSectionSources();

  it('原稿ファイルが読めている（テストが空振りしていない）', () => {
    expect(sections.length).toBeGreaterThan(0);
  });

  it('原稿の <summary> は正規化後に必ず押せるパネルになる', () => {
    let checked = 0;

    for (const { file, src } of sections) {
      const summaries = src.match(/<summary(?:\s[^>]*)?>[\s\S]*?<\/summary>/g) || [];
      for (const s of summaries) {
        checked++;
        const out = normalizeAnswerAccordions(`<details>${s}<p>x</p></details>`);
        // どの文言でも同じ構造・同じタップ領域になる
        expect(out, `${file}: ${s}`).toContain('class="lc-ans-sum cursor-pointer"');
        // ラベルが空にならない（「💡 」だけのパネルを作らない）
        const label = out.match(/lc-ans-txt">([^<]*)</)?.[1] ?? '';
        expect(label.trim(), `${file}: ${s} のラベルが空`).not.toBe('');
        // 「を表示」が残っていない（開閉ヒストと二重に出てしまう）
        expect(label, `${file}: ${s}`).not.toMatch(/を表示$/);
      }
    }

    // 原稿には数十個の解答がある。0件ならセレクタが壊れている
    expect(checked).toBeGreaterThan(20);
  });

  it('原稿側の <summary> は素の状態では押しにくい（＝正規化が必要な理由の記録）', () => {
    // 原稿に直接 cursor-pointer を足す運用に切り替わった場合、
    // このテストが落ちて「正規化が不要になった」ことに気づける。
    const raw = sections.map((s) => s.src).join('\n');
    expect(raw).toMatch(/<summary>💡/);
  });
});

describe('④ 表示側の結線（LearningViewer）', () => {
  const VIEWER = readFileSync('src/components/LearningViewer.tsx', 'utf8');

  it('描画直前に正規化している', () => {
    expect(VIEWER).toContain("from '../utils/learningAccordion'");
    expect(VIEWER).toMatch(/normalizeAnswerAccordions\(rawSectionHtml, allAnswersOpen\)/);
  });

  it('一括開閉のときだけ本文を作り直す（key に開閉状態を含める）', () => {
    // key を固定にすると「すべて開く」が効かず、
    // 逆に毎回変えると個別に開いた解答が勝手に閉じてしまう。
    expect(VIEWER).toMatch(/key=\{`\$\{activeTab\}:\$\{allAnswersOpen \? 'open' : 'closed'\}`\}/);
  });

  it('解答が無いセクションでは一括ボタンを出さない', () => {
    expect(VIEWER).toMatch(/answerCount > 0 &&/);
  });

  it('タブを切り替えたら「すべて表示」を解除する（前の単元の状態を持ち越さない）', () => {
    const m = VIEWER.match(/useEffect\(\(\) => \{([\s\S]*?)\}, \[activeTab\]\);/);
    expect(m, 'activeTab の useEffect が見つからない').toBeTruthy();
    expect(m![1]).toContain('setAllAnswersOpen(false)');
  });
});

describe('⑤ mol 補講（MolBasicsSection）も同じ操作感にそろえる', () => {
  const MBS = readFileSync('src/components/MolBasicsSection.tsx', 'utf8');

  it('解答パネルは共通部品（AnswerPanel）で作る', () => {
    // 生の <details> が残っていると、文言・タップ領域・クリック音が
    // 本文側とずれてしまう
    expect(MBS).toContain('function AnswerPanel(');
    expect(MBS).not.toMatch(/<details className="mbs-details">/);
  });

  it('summary に cursor-pointer が付く（クリック音が鳴る）', () => {
    expect(MBS).toContain('className="mbs-details-sum cursor-pointer"');
  });

  it('開閉ヒントを CSS の content で出す（本文側と同じ文言）', () => {
    expect(MBS).toContain("content:'タップして表示 ▼'");
    expect(MBS).toContain("content:'閉じる ▲'");
    // スマホでは短縮する
    expect(MBS).toContain("content:'▼'");
    expect(MBS).toContain("content:'▲'");
  });

  it('タップ領域を44px以上とる（スマホで押しにくいのを防ぐ）', () => {
    expect(MBS).toMatch(/\.mbs-details>summary\{[^}]*min-height:46px/);
    expect(MBS).toMatch(/\.mbs-details>summary\{min-height:52px/);
    expect(MBS).toMatch(/\.mbs-revealall\{min-height:44px/);
  });

  it('「解答をすべて表示／隠す」がある', () => {
    expect(MBS).toContain('解答をすべて表示');
    expect(MBS).toContain('解答をすべて隠す');
    expect(MBS).toMatch(/aria-pressed=\{reveal\.openAll\}/);
    // 一括ボタン自身にもクリック音を付ける
    expect(MBS).toMatch(/mbs-revealall[^`"]*cursor-pointer/);
  });

  it('一括操作は generation で伝える（押し直しが効き、個別操作も残る）', () => {
    // openAll だけを見ていると
    //   ・一括で開く→個別に閉じる→再レンダリングで勝手に開き直す
    //   ・一括で開く→個別に閉じる→もう一度「すべて表示」が効かない
    // という不具合になる
    expect(MBS).toMatch(/generation: r\.generation \+ 1/);
    expect(MBS).toMatch(/\}, \[generation, openAll, kind\]\);/);
  });

  it('操作用パネル（単位変換の図）は「解答をすべて表示」で開かない', () => {
    expect(MBS).toContain('kind="tool"');
    expect(MBS).toMatch(/if \(kind !== 'answer'\) return;/);
  });

  it('ボタンに出す解答数が、実際の解答パネル数と一致する', () => {
    // パネルを増やしたのに数字を直し忘れる、という食い違いを防ぐ
    const m = MBS.match(/export const MBS_ANSWER_COUNT = (\d+);/);
    expect(m, 'MBS_ANSWER_COUNT が見つからない').toBeTruthy();
    const declared = Number(m![1]);

    const panels = MBS.match(/<AnswerPanel[\s\S]{0,200}?>/g) || [];
    const answers = panels.filter((p) => !p.includes('kind="tool"'));
    expect(answers.length).toBe(declared);
  });
});
