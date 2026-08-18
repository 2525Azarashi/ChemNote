/**
 * ===================================================================
 * 英語リスニング：問題文（選択肢）と解答欄を「同じ場所」に出すための整形
 * ===================================================================
 *
 * ■ なぜ必要か（ご要望：問題文と解答欄を分離しないで）
 *   第1問A のデータは
 *     ・problem.text        … リード文＋「問1（話者：…）＋①〜④の英文」
 *     ・subQuestions[].options … ['①','②','③','④'] のマークだけ
 *   という持ち方をしている。マークシートの再現としては正しいが、
 *   画面上は「左ペインに英文／右ペインに①〜④のチップ」と分かれてしまい、
 *   ①がどの英文なのかを目で往復して探す必要があった。
 *
 *   そこで、problem.text から「問Nの①〜④の本文」を機械的に取り出し、
 *   解答欄の選択肢ボタンにそのまま載せる。こうすると
 *   「読む場所」と「押す場所」が一致し、視線移動がゼロになる。
 *
 * ■ データは書き換えない
 *   解説（Explanation）では従来どおり問題文全文（①〜④つき）を見せたい。
 *   そのため元データには手を入れず、Quiz の表示時にだけ
 *   ・選択肢本文を取り出す（buildListeningOptionTexts）
 *   ・左ペインからは重複する問N ブロックを落とす（stripListeningQuestionBlocks）
 *   という2つの整形を行う。
 *
 * ■ 第1問B（イラスト選択）について
 *   判断材料はイラスト（subQuestion.imageUrl）なので選択肢本文は無い。
 *   その場合は空の Map が返り、呼び出し側はマークのみのボタンを描く。
 */

/** 選択肢マーク（第1問A/B はすべて ①〜④ の4択） */
const MARKS = ['①', '②', '③', '④'];

/** 行頭のマークを見て「何番の選択肢か」を返す（該当しなければ -1）。 */
function markIndexOf(line: string): number {
  const head = line.trim().charAt(0);
  return MARKS.indexOf(head);
}

/** 「問1」「問 1」「問1（話者：…）」などから設問番号を取り出す（なければ null）。 */
function questionNumberOf(line: string): number | null {
  const m = line.match(/^\s*問\s*(\d+)/u);
  return m ? Number(m[1]) : null;
}

/**
 * problem.text から「設問番号 → ①〜④の本文」を取り出す。
 *
 * 想定する形（第1問A の生成データ）:
 *   ────────────────────
 *   問1（話者：女性（高校生））
 *   ① She went to bed early last night.
 *   ② She plans to go to bed early tonight.
 *   ...
 *
 * 取り出せなかった設問はキーを作らない（＝マークのみで描画される）。
 */
export function parseListeningOptionBlocks(text: string): Map<number, string[]> {
  const result = new Map<number, string[]>();
  let currentNo: number | null = null;

  for (const rawLine of String(text || '').split('\n')) {
    const qno = questionNumberOf(rawLine);
    if (qno !== null) {
      currentNo = qno;
      continue;
    }
    if (currentNo === null) continue;

    const idx = markIndexOf(rawLine);
    if (idx < 0) continue;

    // 「① 本文」のマークを外して本文だけにする（先頭の記号・空白も除去）。
    const body = rawLine.trim().slice(1).replace(/^[\s.．、,:：)）]*/u, '').trim();
    if (!body) continue;

    const list = result.get(currentNo) || [];
    list[idx] = body;
    result.set(currentNo, list);
  }

  // ①〜④が欠けている（＝抽出が不完全な）設問は使わない。
  // 途中まで表示すると「②だけ本文が無い」といった不整合になり、かえって危険。
  for (const [no, list] of Array.from(result.entries())) {
    if (list.length !== 4 || list.some((s) => !s)) result.delete(no);
  }
  return result;
}

/**
 * subQuestion のラベル（"問2 話者（…）の発話に最も近い英文"）から設問番号を推定する。
 * 取れない場合は並び順（index+1）を使う。
 */
export function subQuestionNumber(sq: any, index: number): number {
  const m = String(sq?.label || '').match(/問\s*(\d+)/u);
  return m ? Number(m[1]) : index + 1;
}

/**
 * 「subQuestion.id → 選択肢本文の配列（options と同じ並び）」を作る。
 * 選択肢本文が取れない設問（第1問B など）はキーを持たない。
 */
export function buildListeningOptionTexts(problem: any): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const blocks = parseListeningOptionBlocks(problem?.text || '');
  if (blocks.size === 0) return map;

  const subs: any[] = problem?.subQuestions || [];
  subs.forEach((sq, i) => {
    const bodies = blocks.get(subQuestionNumber(sq, i));
    if (!bodies) return;
    const options: string[] = Array.isArray(sq?.options) ? sq.options : [];
    // options が ①〜④ のマークであることを確認してから対応づける
    // （将来「本文そのものを options に入れる」形になっても壊れないようにする）。
    if (options.length !== 4 || !options.every((o, idx) => String(o).trim() === MARKS[idx])) return;
    map.set(sq.id, bodies);
  });
  return map;
}

/**
 * 左ペイン用に「問N 以降のブロック」を落とし、リード文（指示文・コツ）だけを残す。
 *
 * 選択肢本文と設問文は解答カード側に出すので、左ペインに残すと
 * 同じ文が2か所に並び「どちらを見ればよいか」が分からなくなる。
 * 分離をやめる（＝解答欄と同期させる）ための整形。
 */
export function stripListeningQuestionBlocks(text: string): string {
  const lines = String(text || '').split('\n');
  let cut = lines.length;

  for (let i = 0; i < lines.length; i += 1) {
    if (questionNumberOf(lines[i]) !== null) {
      cut = i;
      // 直前が区切り線（──── など）や空行なら、それも一緒に落とす。
      while (cut > 0 && /^[\s─―—-]*$/u.test(lines[cut - 1])) cut -= 1;
      break;
    }
  }

  return lines.slice(0, cut).join('\n').replace(/\n{3,}/gu, '\n\n').trim();
}

/**
 * 解答中の画面から「操作の説明」の見出しブロックを落とす。
 *
 * ■ なぜ落とすのか（ご要望）
 *     > いまこの音源の聞き方とかはもういらないので、
 *     > 問題をつけた今のこの上場面に4つの英文がしっかりと映る
 *     > もしくは、図がしっかりと映るようにしてほしい。
 *     > スクロールしてわざわざ答えるのめんどい。
 *
 *   問題データのリード文には【音源の聞き方】【解き方のコツ】という
 *   長い説明が入っている。初回は役に立つが、2回目以降は毎回同じ文章で、
 *   しかも「選択肢の英文・イラスト」よりも上にあるため
 *   スマホでは本題が画面の外に押し出されてしまっていた。
 *   アプリの操作方法は画面を見れば分かる（再生ボタンは問の横にある）ので、
 *   解答中の画面からは落とし、限られた1画面を選択肢と図に使う。
 *
 * ■ データは書き換えない
 *   解説画面では問題文を全文見せたいので、元データには手を入れず
 *   Quiz の表示時にだけこの整形を通す。
 *
 * ■ 落とす対象
 *   「【…】で始まる行」から次の空行までを1ブロックとして扱う。
 *   問題そのものの指示文（「①〜④のうちから1つずつ選びなさい」）は
 *   【】で囲まれていないので残る。
 */
const DROPPED_LEAD_HEADINGS = ['音源の聞き方', '解き方のコツ'];

export function stripListeningHowToBlocks(text: string): string {
  const lines = String(text || '').split('\n');
  const kept: string[] = [];
  let dropping = false;

  for (const line of lines) {
    const heading = line.match(/^\s*【\s*([^】]+?)\s*】/u);
    if (heading) {
      // 落とす見出しに入ったらブロック終わり（空行）まで捨てる。
      dropping = DROPPED_LEAD_HEADINGS.includes(heading[1].trim());
      if (dropping) continue;
    }
    if (dropping) {
      // 空行まで来たらブロックの終わり。空行自体は捨てて詰める。
      if (line.trim() === '') dropping = false;
      continue;
    }
    kept.push(line);
  }

  return kept.join('\n').replace(/\n{3,}/gu, '\n\n').trim();
}

/**
 * 問題文ペイン（左側）に出す「リード文だけ」を作る。
 *
 * ■ なぜ専用の関数にしたのか（不具合の修正）
 *   これまで呼び出し側は
 *     stripListeningQuestionBlocks(cleanQuestionText(text))
 *   の順で通していた。ところが `cleanQuestionText` は
 *   「行頭の 問N を消す」処理なので、先に通すと問N の行が消えてしまい、
 *   `stripListeningQuestionBlocks` が切り落とす目印を見つけられなかった。
 *   結果として左ペインに問1〜問4の全ブロックがそのまま残り、
 *
 *     > 問題のところさ、全部の問いがまとまってて
 *     > どの問いを解いているかが分からない
 *
 *   というご指摘のとおりの状態になっていた。
 *   順序を間違えないよう、正しい順番をこの関数に閉じ込める。
 *
 * ■ やること（順番が大事）
 *   ① 問N 以降のブロックを落とす（この時点では問N がまだ残っている）
 *   ② 【音源の聞き方】【解き方のコツ】の定型ブロックを落とす
 *   結果は「第2回　第1問 A（…）」＋「①〜④のうちから1つずつ選びなさい」だけになる。
 *   いま解いている問の見出し・音源・図は、呼び出し側がこの下に描く。
 */
export function buildListeningLeadText(text: string): string {
  return stripListeningHowToBlocks(stripListeningQuestionBlocks(text));
}
