import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BattleText } from '../src/battle/ui/BattleText';
import { formatText } from '../src/utils/textFormatter';

/**
 * ===================================================================
 * 対戦の問題文は「演習画面と同じ見た目」で出る
 * ===================================================================
 *
 * ご指摘（原文）：
 *   > 後文字をしっかりと反映させろって言ったよね？
 *
 * ■ 添付スクリーンショットで見えていたもの（化学基礎・酸化還元）
 *   ・「そこに<u>二酸化硫黄</u>を通すと」…… <u> </u> がそのまま文字で見える
 *   ・「(オ) FeSO4 水溶液 + H2O2」…… 添字が下付きにならない
 *   ・選択肢「SO2 + 4H+ + 2e− → S + 2H2O」…… 同じく
 *   演習画面では同じ問題が正しく組版されて出ている。
 *   同じデータなのに対戦だけ生の文字列だった。
 *
 * ■ この検査が守ること
 *   ① タグが文字として漏れない（<u> が画面に出ない）
 *   ② 化学式の添字・電荷が組まれる（<sub> / <sup> になる）
 *   ③ ★演習画面（formatText）と出力が完全に一致する★
 *      「似ている」ではなく同一。整形器を2つ持たない。
 *   ④ 英語は化学式扱いしない（単語がセリフ体にならない）
 *   ⑤ 採点に使う元の文字列は書き換えない（表示専用）
 */

const battle = (text: string, subject = 'chemistry_basic') =>
  renderToStaticMarkup(React.createElement(BattleText, { text, subject }));
const practice = (text: string, prose = false) =>
  renderToStaticMarkup(React.createElement('span', { className: 'battle-text' }, formatText(text, [], { prose })));

// スクリーンショットに写っていた実際の文字列
const SHOT_PROMPT =
  '…>に少量の二酸化マンガン（粉末）を加えると、激しく気体が発生した。(エ) 酸化カルシウムの固体を容器に入れ、そこに<u>二酸化硫黄</u>を通すと、亜硫酸カルシウムが生成した。';
const SHOT_LABEL = '(オ) FeSO4 水溶液 + H2O2';
const SHOT_OPTION = 'SO2 + 4H+ + 2e− → S + 2H2O';

describe('★<u> タグが文字として漏れない★', () => {
  it('<u>二酸化硫黄</u> はタグではなく下線マーカーになる', () => {
    const html = battle(SHOT_PROMPT);
    // タグ文字そのもの（エスケープされた &lt;u&gt; も）が本文に残っていないこと
    expect(html).not.toContain('&lt;u&gt;');
    expect(html).not.toContain('&lt;/u&gt;');
    // 下線マーカー（演習画面と同じクラス）で包まれていること
    expect(html).toMatch(/<span class="[^"]*F9E79F[^"]*">二酸化硫黄<\/span>/u);
  });

  it('過酸化水素水 も同じ（問題文の後半にも効く）', () => {
    const html = battle('硫酸鉄(II)水溶液に<u>過酸化水素水</u>を加えると、溶液が黄褐色（鉄(III)イオンの色）');
    expect(html).not.toContain('&lt;u&gt;');
    expect(html).toMatch(/F9E79F[^"]*">過酸化水素水<\/span>/u);
  });
});

describe('★化学式の添字・電荷が組まれる★', () => {
  it('FeSO4 → FeSO₄、H2O2 → H₂O₂', () => {
    const html = battle(SHOT_LABEL);
    // 素の "FeSO4" "H2O2" が残っていないこと（sub で分割されている）
    expect(html).not.toMatch(/>FeSO4</u);
    expect(html).not.toMatch(/>H2O2</u);
    // 少なくとも FeSO の直後に <sub>4</sub> がある
    expect(html).toMatch(/FeSO<sub[^>]*>4<\/sub>/u);
  });

  it('半反応式：SO2 の添字、H+ / e− の電荷、→ が残る', () => {
    const html = battle(SHOT_OPTION);
    expect(html).toMatch(/SO<sub[^>]*>2<\/sub>/u);
    expect(html).toMatch(/H<sup[^>]*>\+<\/sup>/u);
    expect(html).toContain('→');
    expect(html).toMatch(/H<sub[^>]*>2<\/sub>/u);
  });
});

describe('★演習画面と出力が完全に一致する★', () => {
  it.each([SHOT_PROMPT, SHOT_LABEL, SHOT_OPTION, 'Cu2+ + 2e− → Cu', 'NaOH 0.10 mol/L', '35Cl と 37Cl'])(
    '化学基礎: %s',
    (text) => {
      expect(battle(text, 'chemistry_basic')).toBe(practice(text));
    },
  );

  it.each(['biology_basic', 'chemistry', 'geography', 'rika'])(
    '%s も同じ整形器を通る',
    (subject) => {
      const text = 'ミトコンドリアで ATP が作られ、CO2 が出る。<u>ここ</u>が重要。';
      expect(battle(text, subject)).toBe(practice(text));
    },
  );

  it('英語は prose（化学式の体裁付けなし）で演習と一致する', () => {
    const text = 'Where is the <u>umbrella</u>? The ratio is 3/4.';
    for (const subject of ['english_listening', 'english_grammar']) {
      const html = battle(text, subject);
      expect(html).toBe(practice(text, true));
      // 単語がセリフ体（化学式扱い）になっていない
      expect(html).not.toContain('Cambria Math');
      // 下線は効いている
      expect(html).toMatch(/F9E79F[^"]*">umbrella<\/span>/u);
    }
  });
});

describe('表示専用（採点に使う文字列を書き換えない）', () => {
  it('描画しても元の文字列は変わらない', () => {
    const q = { label: SHOT_LABEL, options: [SHOT_OPTION, 'SO2 + 4H+ + 4e− → S + 2H2O'] };
    const before = JSON.stringify(q);
    battle(q.label);
    q.options.forEach((o) => battle(o));
    expect(JSON.stringify(q)).toBe(before);
  });

  it('危険な HTML は通さない（サニタイズは演習と同じ出口）', () => {
    const html = battle('<img src=x onerror=alert(1)> H2O <script>alert(1)</script>');
    expect(html).not.toMatch(/<img|<script|onerror=/u);
    // 演習画面とまったく同じ出口（同じサニタイザ）を通っていること
    expect(html).toBe(practice('<img src=x onerror=alert(1)> H2O <script>alert(1)</script>'));
  });
});
