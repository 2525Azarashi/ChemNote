/**
 * ===================================================================
 * 地理総合・地理探究：スマホ実機相当での実測スクリプト
 * ===================================================================
 *
 * ■ なぜソースを読むだけで済まさないのか
 *   科目を1つ足すと、
 *     ・科目選択カードが1枚増える（＝1画面に収まるかが変わる）
 *     ・章一覧のタブが「第1問」1枚になるか（buildChapterGroups 任せ）
 *     ・選択肢が縦積みになるか（renderMultipleChoiceControl の
 *       isLongOptionList が実際に効くか）
 *   のどれも「たぶん大丈夫」では確かめられない。
 *   ご指示どおり ★実測してから判断する★ ためのスクリプト。
 *
 * ■ 測るもの（数字を先に決めない）
 *   1. 科目選択画面：スクロールのはみ出し量（scrollHeight - clientHeight）
 *   2. 地理の章一覧：タブの枚数と文字、単元カードの枚数
 *   3. 第1回の問題画面：図が実寸で入っているか、選択肢が縦1列か、
 *      6択（第1回問1）がはみ出さずに並ぶか
 *
 * 使い方: node scripts/measure-geography-mobile.mjs [baseURL]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3001/';

// iPhone 12/13/14 相当（このアプリで基準にしてきた実機サイズ）
const VIEWPORT = { width: 390, height: 664 };

const log = (...a) => console.log(...a);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('requestfailed', (r) => errors.push(`REQ FAILED ${r.url()}`));

// networkidle は使わない：Firebase が常時接続を張るので永遠に idle にならない
// （実測で 30s タイムアウトした）。DOM が出た時点から固定待ちに切り替える。
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);

/** テキストで要素を探して押す（見つからなければ null を返す） */
async function clickText(text, { exact = false } = {}) {
  const loc = page.getByText(text, { exact }).first();
  if ((await loc.count()) === 0) return false;
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  await loc.click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(700);
  return true;
}

// ---- ゲストで入る（ログイン画面が出る場合） -------------------------
//
// ★2段階の確認がある★（実測で判明）
//   1段目「連携せずにゲストとして試す」→ 注意書きが出る
//   2段目「ゲストで始める」→ ここで初めて入れる
// 1段目だけ押して先へ進もうとすると、ログイン画面のままで
// 「地理カードが無い」と誤判定する。
for (const t of ['連携せずにゲストとして試す', 'ゲストで始める']) {
  if (await clickText(t, { exact: true })) {
    log(`[login] 「${t}」を押した`);
    await page.waitForTimeout(1200);
  }
}
await page.waitForTimeout(1500);

// ---- 1. 科目選択画面まで進む ----------------------------------------
for (const t of ['学習を始める', '科目を選ぶ', '科目選択']) {
  if (await clickText(t)) {
    log(`[nav] 「${t}」を押した`);
    break;
  }
}
await page.waitForTimeout(1000);

const hasGeoCard = (await page.getByText('地理総合・地理探究').count()) > 0;
log(`\n===== 1. 科目選択画面 =====`);
log(`地理カードが出ているか: ${hasGeoCard}`);

if (hasGeoCard) {
  // スクロールペインのはみ出しを実測（1画面に収まっているか）
  const overflow = await page.evaluate(() => {
    const panes = [...document.querySelectorAll('*')].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.overflowY === 'auto' || cs.overflowY === 'scroll';
    });
    return panes.map((el) => ({
      cls: (el.className || '').toString().slice(0, 60),
      scrollH: el.scrollHeight,
      clientH: el.clientHeight,
      over: el.scrollHeight - el.clientHeight,
    }));
  });
  for (const p of overflow) {
    log(`  pane over=${p.over}px (scroll ${p.scrollH} / client ${p.clientH}) ${p.cls}`);
  }

  // カードに出ている収録表記（掛け算をやめたので実データの 25 になるはず）
  const vol = await page.evaluate(() => {
    const el = [...document.querySelectorAll('*')].find(
      (e) => e.children.length === 0 && /第1問全\d+回・設問\d+問/u.test(e.textContent || ''),
    );
    return el ? el.textContent.trim() : null;
  });
  log(`  収録表記: ${vol}`);

  // ---- 2. 地理へ入る -----------------------------------------------
  await clickText('地理総合・地理探究');
  await page.waitForTimeout(1200);

  // モード選択が出たら演習問題へ
  for (const t of ['演習問題', '問題を解く', '演習']) {
    if (await clickText(t)) {
      log(`[nav] モード選択で「${t}」を押した`);
      break;
    }
  }
  await page.waitForTimeout(1200);

  log(`\n===== 2. 地理の章一覧 =====`);
  const chapterInfo = await page.evaluate(() => {
    const txt = document.body.innerText;
    return {
      hasQ1Tab: /第1問/u.test(txt),
      hasKicker: /地理総合・地理探究\s*／\s*共通テスト大問別/u.test(txt),
      rounds: (txt.match(/第\d回\s\S+/gu) || []).slice(0, 8),
      bodyLines: txt.split('\n').filter((l) => l.trim()).slice(0, 18),
    };
  });
  log(`  「第1問」タブがある: ${chapterInfo.hasQ1Tab}`);
  log(`  地理のキッカー行がある: ${chapterInfo.hasKicker}`);
  log(`  回の見出し: ${JSON.stringify(chapterInfo.rounds, null, 0)}`);
  log(`  画面テキスト先頭:\n    ${chapterInfo.bodyLines.join('\n    ')}`);

  // ---- 3. 第1回へ入って問題画面を測る ------------------------------
  //
  // ★単元へ入るのは見出しではなく「最初から」ボタン★（実測で判明）
  //   見出しテキストを押しても何も起きず、章一覧のままだった。
  //   単元カードは5枚あるので、1枚目（第1回）の「最初から」を押す。
  const startBtns = page.getByRole('button', { name: '最初から' });
  const startCount = await startBtns.count();
  log(`\n===== 3. 第1回の問題画面 =====`);
  log(`  「最初から」ボタンの数（＝単元カードの枚数）: ${startCount}`);
  if (startCount > 0) {
    await startBtns.first().click();
    await page.waitForTimeout(2500);
  }

  const quiz = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')]
      .filter((i) => /geography\//u.test(i.currentSrc || i.src))
      .map((i) => ({
        src: (i.currentSrc || i.src).split('/').pop(),
        natural: `${i.naturalWidth}x${i.naturalHeight}`,
        rendered: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}`,
        loaded: i.naturalWidth > 0,
      }));

    // 選択肢ボタン：横並びか縦1列か（left が全部同じなら縦1列）
    const btns = [...document.querySelectorAll('button')].filter((b) => {
      const t = (b.textContent || '').trim();
      return t.length > 5 && !/次へ|戻る|解説|ヒント|閉じる|一覧/u.test(t);
    });
    const rects = btns.map((b) => {
      const r = b.getBoundingClientRect();
      return { left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), t: (b.textContent || '').trim().slice(0, 30) };
    }).filter((r) => r.w > 100);
    const lefts = new Set(rects.map((r) => r.left));

    return {
      figures: imgs,
      optionCount: rects.length,
      distinctLefts: lefts.size,
      options: rects,
      hasFigCaption: /図\s*1|資料\s*1/u.test(document.body.innerText),
      docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  log(`  図: ${JSON.stringify(quiz.figures)}`);
  log(`  図番号/資料番号の表示: ${quiz.hasFigCaption}`);
  log(`  選択肢ボタン数: ${quiz.optionCount} / 左端の異なる値: ${quiz.distinctLefts} (1 なら縦1列)`);
  for (const o of quiz.options) log(`    left=${o.left} ${o.w}x${o.h}  「${o.t}」`);
  log(`  横方向のはみ出し: ${quiz.docOverflow}px (0 が正しい)`);

  // ---- 4. 今回のレイアウト改善（7項目）を実測する --------------------
  //
  // ★ここを「見た目の感想」ではなく数値で確認する★
  //   ・冒頭の（配点20点）行が消えているか   → 文字列の有無
  //   ->・資料の四角囲みが付いているか        → borderWidth / borderRadius
  //   ・表に罫線が付いているか              → td の4辺の borderWidth
  //   ・選択肢に丸文字が付いているか          → ボタン先頭文字
  //   ・改行が効いているか                  → whiteSpace の計算値
  //   ・ぶら下げインデントになっているか      → 本文 span の left が
  //     ボタン左端より右にあるか
  const layout = await page.evaluate(() => {
    const bodyText = document.body.innerText;

    // (a) 冒頭のメタ情報行（配点・難易度・設問数）が残っていないか
    const leadMeta = /（配点\d+点）|難易度：|設問数：/u.test(bodyText);

    // (b) 【…】の四角囲み。border が実際に描かれている要素を数える
    const boxes = [...document.querySelectorAll('div')]
      .filter((el) => /^【[^】]+】/u.test((el.textContent || '').trim()))
      .map((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          head: (el.textContent || '').trim().slice(0, 24),
          borderW: cs.borderTopWidth,
          radius: cs.borderTopLeftRadius,
          bg: cs.backgroundColor,
          w: Math.round(r.width),
        };
      })
      .filter((b) => parseFloat(b.borderW) > 0);

    // (c) 表の罫線（4辺すべてに線があるか）
    const cells = [...document.querySelectorAll('table td, table th')].slice(0, 4).map((el) => {
      const cs = getComputedStyle(el);
      return {
        text: (el.textContent || '').trim().slice(0, 12),
        top: cs.borderTopWidth,
        right: cs.borderRightWidth,
        bottom: cs.borderBottomWidth,
        left: cs.borderLeftWidth,
        color: cs.borderTopColor,
      };
    });
    const tableCount = document.querySelectorAll('table').length;

    // (d) 選択肢の丸文字とぶら下げインデント
    const optBtns = [...document.querySelectorAll('button')].filter((b) => {
      const r = b.getBoundingClientRect();
      return r.width > 100 && b.getAttribute('aria-pressed') !== null;
    });
    const opts = optBtns.map((b) => {
      const br = b.getBoundingClientRect();
      const spans = [...b.querySelectorAll('span')];
      // 丸数字だけを持つ span がマーク、その次が本文
      const markSpan = spans.find((s) => /^[①-⑳]$/u.test((s.textContent || '').trim()));
      const bodySpan = markSpan ? spans.find((s) => s !== markSpan && (s.textContent || '').trim().length > 1) : null;
      const bodyR = bodySpan ? bodySpan.getBoundingClientRect() : null;
      return {
        text: (b.textContent || '').trim().slice(0, 28),
        mark: markSpan ? (markSpan.textContent || '').trim() : null,
        align: getComputedStyle(b).alignItems,
        h: Math.round(br.height),
        // 本文の左端がボタン左端より何px右にあるか（＝ぶら下げ幅）
        hangPx: bodyR ? Math.round(bodyR.left - br.left) : null,
        bodyLines: bodyR && bodySpan
          ? Math.round(bodyR.height / parseFloat(getComputedStyle(bodySpan).lineHeight))
          : null,
      };
    });

    // (e) 問題文の改行（whitespace-pre-wrap が効いているか）
    const preWrap = [...document.querySelectorAll('div')]
      .filter((el) => getComputedStyle(el).whiteSpace === 'pre-wrap')
      .length;

    return { leadMeta, boxes, cells, tableCount, opts, preWrap };
  });

  log(`\n===== 4. レイアウト改善の実測 =====`);
  log(`  (3) 冒頭のメタ情報行が残っているか: ${layout.leadMeta}  ← false が正しい`);
  log(`  (1) 【…】の四角囲み: ${layout.boxes.length}個`);
  for (const b of layout.boxes) {
    log(`      border=${b.borderW} radius=${b.radius} bg=${b.bg} w=${b.w}  「${b.head}」`);
  }
  log(`  (5) 表: ${layout.tableCount}個`);
  for (const c of layout.cells) {
    log(`      「${c.text}」 上${c.top}/右${c.right}/下${c.bottom}/左${c.left} 色${c.color}`);
  }
  log(`  (6)(7) 選択肢: ${layout.opts.length}個`);
  for (const o of layout.opts) {
    log(`      丸文字=${o.mark ?? 'なし'} align=${o.align} 高さ=${o.h} ぶら下げ=${o.hangPx ?? '-'}px 行数=${o.bodyLines ?? '-'}  「${o.text}」`);
  }
  log(`  (7) whitespace:pre-wrap の要素数: ${layout.preWrap}  ← 1以上が正しい`);

  await page.screenshot({ path: '/tmp/geo_quiz_mobile.png', fullPage: false });
  log(`  スクショ: /tmp/geo_quiz_mobile.png`);
  await page.screenshot({ path: '/tmp/geo_quiz_mobile_full.png', fullPage: true });
  log(`  スクショ(全体): /tmp/geo_quiz_mobile_full.png`);
}

log(`\n===== コンソールエラー =====`);
log(errors.length === 0 ? '  なし' : errors.slice(0, 15).map((e) => `  ${e}`).join('\n'));

await browser.close();
