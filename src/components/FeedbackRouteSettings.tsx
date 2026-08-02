/**
 * ===================================================================
 * お問い合わせ（ご意見）の送信先設定 ＆ 疎通診断
 * ===================================================================
 *
 * ■ 背景（なぜこの画面が必要になったか）
 * 「お問い合わせフォームがそもそも送信できない」という不具合の実測調査で、
 * 次の2点が原因であることが判明した。
 *
 *   ① 本番 Firestore（mntb-4ef06）が `feedback` への書き込みを
 *      PERMISSION_DENIED で拒否している
 *      → リポジトリの firestore.rules が本番へ未反映。
 *        アプリ側のコードでは絶対に解消できない（Console での公開が必要）。
 *
 *   ② Google スプレッドシート側（GAS）は連携済みでも、アプリが
 *      そのURLを知らなければ 1 行も追記されない
 *      → `VITE_FEEDBACK_WEBHOOK_URL` は Vite の仕様で「ビルド時」に
 *        埋め込まれる値のため、環境変数を入れて再ビルドするまで反映されない。
 *
 * ①②が同時に成立すると送信口がゼロになり、フォームは必ず失敗する。
 *
 * ■ この画面の役割
 *   - ②を「再ビルド無し」で今すぐ解消する（URLを貼って保存 → localStorage）
 *   - どこが詰まっているかを実際に送って可視化する（疎通診断）
 *   - ①については、対処手順を画面上で明示する
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Link2, PlayCircle, CheckCircle2, XCircle, MinusCircle, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import {
  getFeedbackWebhookUrl,
  setFeedbackWebhookUrl,
  diagnoseFeedbackRoutes,
  pendingFeedbackCount,
  flushFeedbackQueue,
  type SinkDiagnosis,
} from '../utils/feedback';

export function FeedbackRouteSettings() {
  const [url, setUrl] = useState('');
  const [saved, setSaved] = useState<'idle' | 'ok' | 'invalid'>('idle');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<SinkDiagnosis[] | null>(null);
  const [queued, setQueued] = useState(0);
  const [flushing, setFlushing] = useState(false);

  useEffect(() => {
    setUrl(getFeedbackWebhookUrl());
    setQueued(pendingFeedbackCount());
  }, []);

  const handleSave = useCallback(() => {
    const ok = setFeedbackWebhookUrl(url);
    setSaved(ok ? 'ok' : 'invalid');
    setResults(null);
    window.setTimeout(() => setSaved('idle'), 2600);
  }, [url]);

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
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">お問い合わせの送信先</h3>

      {/* ---- Google スプレッドシート（GAS）のURL ---- */}
      <div className="space-y-1.5">
        <label htmlFor="feedback-webhook-url" className="flex items-center gap-1.5 text-[11px] font-bold text-[#1B2631]">
          <Link2 size={13} className="text-[#E8688E]" aria-hidden="true" />
          Google スプレッドシートの受け取りURL
        </label>
        <input
          id="feedback-webhook-url"
          type="url"
          inputMode="url"
          spellCheck={false}
          value={url}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUrl(event.target.value)}
          placeholder="https://script.google.com/macros/s/.../exec"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-[#1B2631] font-mono placeholder:text-gray-300 focus:outline-none focus:border-[#E8688E] focus:bg-white"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-[#2C3E50] text-white text-[11px] font-bold hover:bg-[#1B2631] transition-colors"
          >
            保存して有効化
          </button>
          {saved === 'ok' && (
            <span className="text-[10px] font-bold text-[#27AE60] flex items-center gap-1">
              <CheckCircle2 size={12} aria-hidden="true" />保存しました（再ビルド不要）
            </span>
          )}
          {saved === 'invalid' && (
            <span className="text-[10px] font-bold text-[#C0392B] flex items-center gap-1">
              <XCircle size={12} aria-hidden="true" />URLの形式が正しくありません
            </span>
          )}
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          GAS の［デプロイ］→［ウェブアプリ］で発行された、末尾が <code className="font-mono">/exec</code> のURLを貼り付けてください。
          「アクセスできるユーザー」は必ず<b>「全員」</b>にする必要があります。
        </p>
      </div>

      {/* ---- 疎通診断 ---- */}
      <div className="pt-2 border-t border-gray-100 space-y-2">
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
