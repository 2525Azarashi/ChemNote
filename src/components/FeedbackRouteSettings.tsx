/**
 * ===================================================================
 * お問い合わせ（ご意見）の送信状態の確認
 * ===================================================================
 *
 * ■ この画面の役割
 *   - 「ご意見が本当に届いているか」を実際に送って可視化する（疎通診断）
 *   - 端末に溜まった未送信ぶんを手動で再送する
 *   - Firestore のルール未反映など、運営側で直すべき点を明示する
 *
 * ■ 送信先URL（Google Apps Script）について
 *   以前はこの画面に「受け取りURL」の入力欄を置いていたが、
 *   URL は utils/feedback.ts に既定値として同梱されており、
 *   利用者が入力・変更する必要はない（誤って書き換えると
 *   ご意見がどこにも届かなくなる事故につながる）。
 *   そのため入力欄は撤去し、確認と復旧の機能だけを残している。
 *   URL を差し替えたい場合は環境変数 VITE_FEEDBACK_WEBHOOK_URL を使う。
 */

import React, { useCallback, useEffect, useState } from 'react';
import { PlayCircle, CheckCircle2, XCircle, MinusCircle, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import {
  diagnoseFeedbackRoutes,
  pendingFeedbackCount,
  flushFeedbackQueue,
  type SinkDiagnosis,
} from '../utils/feedback';

export function FeedbackRouteSettings() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<SinkDiagnosis[] | null>(null);
  const [queued, setQueued] = useState(0);
  const [flushing, setFlushing] = useState(false);

  useEffect(() => {
    setQueued(pendingFeedbackCount());
  }, []);

  const handleDiagnose = useCallback(async () => {
    setRunning(true);
    setResults(null);
    try {
      setResults(await diagnoseFeedbackRoutes());
    } catch (error: any) {
      setResults([{
        sink: 'firestore',
        label: '診断の実行',
        status: 'ng',
        detail: String(error?.message || error),
      }]);
    } finally {
      setRunning(false);
      setQueued(pendingFeedbackCount());
    }
  }, []);

  const handleFlush = useCallback(async () => {
    setFlushing(true);
    try {
      await flushFeedbackQueue();
    } finally {
      setQueued(pendingFeedbackCount());
      setFlushing(false);
    }
  }, []);

  return (
    <section className="bg-white border border-gray-150 p-3 rounded-2xl shadow-sm space-y-2.5">
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">お問い合わせの送信状態</h3>

      {/* ---- 疎通診断 ---- */}
      <div className="space-y-2">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          ご意見が正しく届く状態かを、実際にテスト送信して確認できます。
        </p>
        <button
          onClick={handleDiagnose}
          disabled={running}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FBE0E9] text-[#D9466E] text-[11px] font-bold hover:bg-[#F8D0DE] transition-colors disabled:opacity-50"
        >
          {running ? <Loader2 size={13} className="animate-spin" aria-hidden="true" /> : <PlayCircle size={13} aria-hidden="true" />}
          {running ? '診断中…' : '送信できるかテストする'}
        </button>

        {results && (
          <ul className="space-y-1.5">
            {results.map((item) => (
              <li
                key={item.sink}
                className={`flex items-start gap-2 rounded-xl px-2.5 py-2 border text-[10px] leading-relaxed ${
                  item.status === 'ok'
                    ? 'bg-[#E8F8EE] border-[#27AE60]/30 text-[#1E7E45]'
                    : item.status === 'off'
                      ? 'bg-gray-50 border-gray-200 text-gray-500'
                      : 'bg-[#FDEDEC] border-[#E74C3C]/30 text-[#A93226]'
                }`}
              >
                {item.status === 'ok' && <CheckCircle2 size={13} className="shrink-0 mt-0.5" aria-hidden="true" />}
                {item.status === 'ng' && <XCircle size={13} className="shrink-0 mt-0.5" aria-hidden="true" />}
                {item.status === 'off' && <MinusCircle size={13} className="shrink-0 mt-0.5" aria-hidden="true" />}
                <span className="min-w-0 break-words">
                  <b>{item.label}</b>：{item.detail}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Firestore が拒否されている場合の対処手順を明示する */}
        {results?.some((item) => item.sink === 'firestore' && item.status === 'ng') && (
          <div className="flex items-start gap-2 bg-[#FFF4E5] border border-[#FF9F43]/50 rounded-xl px-2.5 py-2">
            <AlertTriangle size={13} className="text-[#E67E22] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-[10px] text-[#7E5109] leading-relaxed min-w-0">
              <b className="text-[#B9770E]">対処：Firestore ルールを本番へ公開してください</b><br />
              リポジトリの <code className="font-mono">firestore.rules</code> の全文を、Firebase Console のルール画面に貼り付けて［公開］するだけで解消します（アプリの再デプロイは不要）。
              <a
                href="https://console.firebase.google.com/project/mntb-4ef06/firestore/rules"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 mt-1 font-bold text-[#B9770E] underline underline-offset-2"
              >
                ルール画面を開く<ExternalLink size={10} aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ---- 未送信キュー ---- */}
      {queued > 0 && (
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
          <span className="text-[10px] text-gray-500 flex-1">
            端末に未送信のご意見が <b className="text-[#D9466E]">{queued}件</b> 保存されています。
          </span>
          <button
            onClick={handleFlush}
            disabled={flushing}
            className="px-2.5 py-1 rounded-lg border border-gray-200 bg-white text-[10px] font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {flushing ? '再送中…' : '今すぐ再送'}
          </button>
        </div>
      )}
    </section>
  );
}
