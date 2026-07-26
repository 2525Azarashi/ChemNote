/**
 * questionDisplay.ts — 問題文（左側）と解答欄（右側）の表示ルールを支える共有ユーティリティ
 *
 * 【表示ルール】
 * 1. 左側の「問題文」欄には、共通のリード文に加えて、続く全小問の設問文
 *    （問1、問2、…）を順番に表示する。左側だけ読めば全設問が理解できる。
 * 2. 右側の「解答欄」には設問文自体は含めず、設問マーカー（(ア)/(1)/問2 など）と
 *    入力フォーム・選択肢のみを配置する。
 *
 * そのために、設問ラベル（sq.label）を
 *   - marker: 「(ア)」「(1)」「問2」などの識別子
 *   - body  : マーカーに続く設問文本体
 * に分離するヘルパーを提供する。
 */

export interface SplitLabel {
  /** 設問マーカー（例: "(ア)" "(1)" "問2"）。抽出できない場合はフォールバック文字列 */
  marker: string;
  /** マーカーを除いた設問文本体。マーカーのみのラベルなら空文字 */
  body: string;
}

/**
 * 設問ラベルをマーカーと設問文本体に分離する。
 *
 * 対応パターン:
 *  - "(ア)" / "（ア）" / "(1)" / "（10）"       … 括弧つきマーカー
 *  - "問1" / "問 12"                            … 問番号
 *  - "a." / "ア." / "1."                        … ピリオド区切り
 *  - 上記に続く本文（例: "(2) ろ過はどのような…"）
 *
 * マーカーが見つからない場合は、fallbackMarker（例: "問3"）をマーカーとし、
 * ラベル全体を本文として返す。
 */
export function splitQuestionLabel(label: string, fallbackMarker = ''): SplitLabel {
  const raw = String(label || '').trim();
  if (!raw) return { marker: fallbackMarker, body: '' };

  // 括弧つきマーカー: (ア) / （１） / (10) / (a)
  const paren = raw.match(/^[（(]\s*([^（）()]{1,4})\s*[）)]\s*(.*)$/su);
  if (paren) {
    return { marker: `(${paren[1].trim()})`, body: paren[2].trim() };
  }

  // 「問1」「問 12」「第2問」形式
  const toi = raw.match(/^((?:第\s*\d+\s*問)|(?:問\s*\d+))[.．、:：\s]*(.*)$/su);
  if (toi) {
    return { marker: toi[1].replace(/\s+/g, ''), body: toi[2].trim() };
  }

  // 「a.」「ア.」「1.」「①」形式
  const dot = raw.match(/^([0-9a-zA-Zぁ-んァ-ヶ①-⑳]{1,3})[.．、)）:：]\s+(.*)$/su);
  if (dot) {
    return { marker: dot[1], body: dot[2].trim() };
  }

  // マーカーが抽出できない → ラベル全体を設問文とみなす
  return { marker: fallbackMarker, body: raw };
}

/**
 * 右側の解答欄カードに表示する「短いマーカー」を返す。
 * グループ化された設問（化学反応式の係数など）はグループ名の先頭語を冠する。
 */
export function answerCardMarker(sq: any, index: number): string {
  const fallback = `問${index + 1}`;
  const { marker } = splitQuestionLabel(sq?.label || '', fallback);
  if (sq?.group) {
    const groupHead = String(sq.group).split(' ')[0];
    return `${groupHead} : 係数 ${marker || sq.label}`;
  }
  return marker || fallback;
}

/**
 * 左側「問題文」欄に並べる設問文リストを作る。
 * 設問文本体を持たない（マーカーのみ＝リード文中の空欄）設問は除外する。
 * グループ設問（係数入力など）はグループ名を1件として代表表示する。
 */
export function buildSubQuestionList(question: any): { marker: string; body: string }[] {
  const subs: any[] = question?.subQuestions || [];
  const list: { marker: string; body: string }[] = [];
  const seenGroups = new Set<string>();

  subs.forEach((sq, i) => {
    if (sq?.group) {
      // グループはグループ名（例: "①式 C3H8 + O2 → CO2 + H2O"）を1件として表示
      if (!seenGroups.has(sq.group)) {
        seenGroups.add(sq.group);
        list.push({ marker: '', body: String(sq.group) });
      }
      return;
    }
    const { marker, body } = splitQuestionLabel(sq?.label || '', `問${i + 1}`);
    if (body) {
      list.push({ marker, body });
    }
  });

  return list;
}
