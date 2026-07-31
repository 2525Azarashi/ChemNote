/**
 * ===================================================================
 * まなとび（ChemNote）フィードバック受け取り用 Google Apps Script
 * ===================================================================
 *
 * このファイルは「Google スプレッドシート」または「メール（mntobira@gmail.com）」
 * にフィードバックを届けたいときに使うサーバー側スクリプトです。
 * アプリ本体（src/utils/feedback.ts）は、環境変数
 *
 *     VITE_FEEDBACK_WEBHOOK_URL=https://script.google.com/macros/s/xxxxx/exec
 *
 * が設定されている場合に、このスクリプトへ JSON を POST します。
 *
 * -------------------------------------------------------------------
 * ■ 導入手順（5分程度）
 * -------------------------------------------------------------------
 *  1. 受け取り用の Google スプレッドシートを新規作成する
 *     （シート名は自動で「feedback」が作られるので何でもOK）
 *  2. そのスプレッドシートで［拡張機能］→［Apps Script］を開く
 *  3. エディタの中身を全部消して、このファイルの内容を貼り付ける
 *  4. 下の CONFIG を必要に応じて書き換える
 *       - NOTIFY_EMAIL      : 通知を受け取るメールアドレス
 *       - SEND_EMAIL        : メール通知するか（true / false）
 *       - APPEND_SHEET      : スプレッドシートに記録するか（true / false）
 *     ★「メールだけ欲しい」なら APPEND_SHEET = false
 *     ★「シートだけ欲しい」なら SEND_EMAIL   = false
 *     ★ 迷っているうちは両方 true にしておけば、後から片方を切るだけで済みます
 *  5. ［デプロイ］→［新しいデプロイ］→ 種類「ウェブアプリ」を選択
 *       - 次のユーザーとして実行 : 自分
 *       - アクセスできるユーザー : 全員（★ここが「全員」でないと受信できません）
 *  6. 表示された「ウェブアプリのURL」をコピーし、アプリの .env に
 *       VITE_FEEDBACK_WEBHOOK_URL="コピーしたURL"
 *     として設定 → 再ビルド／再デプロイ
 *  7. アプリのタイトル画面から「ご意見・ご要望」でテスト送信し、
 *     シートに1行増える／メールが届くことを確認する
 *
 * -------------------------------------------------------------------
 * ■ 補足
 * -------------------------------------------------------------------
 *  - このスクリプトを設定しなくても、フィードバックは Firestore の
 *    `feedback` コレクションに必ず保存されます（消えません）。
 *    このスクリプトは「見やすい場所へ流す」ためのオプションです。
 *  - コード変更後は必ず［デプロイ］→［デプロイを管理］→ 鉛筆アイコン →
 *    バージョン「新バージョン」で再デプロイしてください（URLは変わりません）。
 */

/* eslint-disable no-undef */

var CONFIG = {
  /** 通知メールの宛先 */
  NOTIFY_EMAIL: 'mntobira@gmail.com',
  /** メール通知を行うか */
  SEND_EMAIL: true,
  /** スプレッドシートへの追記を行うか */
  APPEND_SHEET: true,
  /** 記録先シート名（存在しなければ自動作成） */
  SHEET_NAME: 'feedback',
  /**
   * 任意の共有シークレット。空文字なら検証しない。
   * 設定する場合はアプリ側の payload に含める仕組みが別途必要なため、
   * 通常は空のままで構いません（URL自体が事実上の秘密鍵になります）。
   */
  SHARED_SECRET: '',
};

var HEADERS = [
  '受信日時',
  '管理ID',
  '送信画面',
  '種類',
  '評価',
  '内容',
  '返信用メール',
  'ユーザー名',
  'uid',
  'ログインメール',
  '付帯情報',
  'アプリ版',
  '画面サイズ',
  'UserAgent',
  '端末送信日時',
];

var SCREEN_LABELS = {
  title: 'タイトル画面',
  chapter_result: '単元の結果画面',
  mock_exam_result: '模擬試験の結果画面',
  other: 'その他の画面',
};

var CATEGORY_LABELS = {
  praise: 'よかった点',
  problem: '問題・解説の内容',
  bug: '不具合・表示崩れ',
  request: '要望・改善案',
  other: 'その他',
};

/**
 * 動作確認用。デプロイURLをブラウザで開くとこの文字列が出れば公開設定は正しい。
 */
function doGet() {
  return ContentService
    .createTextOutput('ChemNote feedback endpoint is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * アプリからの POST を受け取る本体。
 */
function doPost(e) {
  try {
    var payload = parsePayload(e);

    if (CONFIG.SHARED_SECRET && payload.secret !== CONFIG.SHARED_SECRET) {
      return jsonResponse({ ok: false, error: 'forbidden' });
    }
    if (!payload.message) {
      return jsonResponse({ ok: false, error: 'message is required' });
    }

    if (CONFIG.APPEND_SHEET) appendToSheet(payload);
    if (CONFIG.SEND_EMAIL) sendNotificationMail(payload);

    return jsonResponse({ ok: true, id: payload.id || '' });
  } catch (error) {
    // 失敗しても 200 を返す（アプリ側は本文の ok を見ない設計だが、
    // 500 だと再送キューに積まれて何度も届くため、原因はログで追う）
    console.error(error);
    return jsonResponse({ ok: false, error: String(error) });
  }
}

/** リクエストボディを JSON として読む */
function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents) || {};
  } catch (error) {
    // フォーム形式で送られた場合の保険
    return (e.parameter || {});
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** シートを取得（無ければ作成し、見出し行を用意する） */
function getSheet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(CONFIG.SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#FBE0E9');
    sheet.setFrozenRows(1);
    // 「内容」列を広めにして読みやすくする
    sheet.setColumnWidth(6, 420);
  }
  return sheet;
}

function label(map, key, fallback) {
  return map[key] || key || fallback;
}

function appendToSheet(p) {
  var sheet = getSheet();
  sheet.appendRow([
    new Date(),
    p.id || '',
    label(SCREEN_LABELS, p.screen, '不明'),
    label(CATEGORY_LABELS, p.category, '不明'),
    p.rating ? p.rating + ' / 5' : '未選択',
    p.message || '',
    p.contactEmail || '',
    p.displayName || 'ゲスト',
    p.uid || '',
    p.authEmail || '',
    p.context ? JSON.stringify(p.context) : '',
    p.appVersion || '',
    p.viewport || '',
    p.userAgent || '',
    p.createdAtIso || '',
  ]);
  // 折り返し表示にして長文でも読める状態を保つ
  sheet.getRange(sheet.getLastRow(), 6).setWrap(true);
}

function sendNotificationMail(p) {
  var screenLabel = label(SCREEN_LABELS, p.screen, '不明');
  var categoryLabel = label(CATEGORY_LABELS, p.category, '不明');
  var subject = '【まなとび】フィードバック（' + screenLabel + '／' + categoryLabel + '）';

  var lines = [
    '■ 内容',
    p.message || '',
    '',
    '■ 基本情報',
    '送信画面: ' + screenLabel,
    '種類: ' + categoryLabel,
    '評価: ' + (p.rating ? p.rating + ' / 5' : '未選択'),
    '返信希望先: ' + (p.contactEmail || '（なし）'),
    'ユーザー: ' + (p.displayName || 'ゲスト') + (p.uid ? '（uid: ' + p.uid + '）' : '（ゲスト）'),
    'ログインメール: ' + (p.authEmail || '（なし）'),
    '端末送信日時: ' + (p.createdAtIso || ''),
    'アプリ版: ' + (p.appVersion || ''),
    '画面サイズ: ' + (p.viewport || ''),
    'UserAgent: ' + (p.userAgent || ''),
    '管理ID: ' + (p.id || ''),
  ];

  if (p.context) {
    lines.push('', '■ 付帯情報');
    var context = p.context;
    Object.keys(context).forEach(function (key) {
      lines.push('  - ' + key + ': ' + context[key]);
    });
  }

  if (CONFIG.APPEND_SHEET) {
    lines.push('', '■ 記録先シート', SpreadsheetApp.getActiveSpreadsheet().getUrl());
  }

  var options = {};
  // 返信用メールが書かれていれば、そのままメーラーの「返信」で返せるようにする
  if (p.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.contactEmail)) {
    options.replyTo = p.contactEmail;
  }

  MailApp.sendEmail(CONFIG.NOTIFY_EMAIL, subject, lines.join('\n'), options);
}
