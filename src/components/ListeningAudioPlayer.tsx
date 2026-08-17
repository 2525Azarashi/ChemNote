import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Headphones, Play, Pause, RotateCcw, Repeat2, FileText, ChevronDown } from 'lucide-react';
import type { ListeningAudioTrack } from '../data/englishListeningQ1AProblems';

/**
 * ListeningAudioPlayer
 * ------------------------------------------------------------------
 * 英語リスニングの音源を「わかりやすい場所で・すぐ押せる形で」再生するための
 * 共通コンポーネント。QuestionFigure と同じ設計方針（tone で明色／暗色を切替、
 * Quiz と Explanation の両方から同じ見た目で使える）で作っている。
 *
 * ■ なぜ専用コンポーネントにするのか
 *   リスニングは「音を聞く」ことが問題そのもの。図版（QuestionFigure）と違って
 *   ・問題を解く前（Quiz）  … スクリプトを見せずに音だけ流す
 *   ・解答したあと（Explanation）… スクリプト＋和訳＋語句を見ながら聞き直す
 *   という2つのモードが必要で、置き場所も2か所ある。
 *   ボタンの位置・色・サイズがぶれると「音源どこ？」となるため一元化する。
 *
 * ■ 表示の要点（ご要望：音源のボタンはわかりやすい場所に）
 *   ・問題文ペインの**最上部**に置き、ヘッドホンアイコン＋「音源を聞く」で明示する
 *   ・問1〜問4 のボタンを常に見える形（アコーディオンで隠さない）で横並びにする
 *   ・タップ領域は 48px 以上（スマホでの取りこぼしを防ぐ）
 *   ・再生中のボタンは色が反転し、どれが鳴っているか一目でわかる
 *
 * ■ mode
 *   'practice' … 解答前。スクリプトは伏せ、音と「2回続けて再生」だけを提供する。
 *   'review'   … 解答後（復習用）。スクリプト・和訳・語句を開いて確認できる。
 *
 * ■ BGM との関係
 *   App.tsx の BGM は quiz / explanation では停止するため、通常は競合しない。
 *   それでも保険として、再生開始時に他の音声要素を pause する
 *   （同一ページ内に複数プレーヤーがある場合の重なりも防ぐ）。
 */

export interface ListeningAudioPlayerProps {
  /** 再生対象のトラック一覧（問1〜問4） */
  tracks: ListeningAudioTrack[];
  /** 解答前（音のみ）／復習（スクリプトつき） */
  mode?: 'practice' | 'review';
  /** 配色モード。Quiz の明るいペイン／Explanation の暗いペインに合わせる */
  tone?: 'light' | 'dark';
  /** パネル見出し。省略時は mode に応じた既定値 */
  title?: string;
  /** 本番の読み上げ回数（2回読みなら「2回続けて再生」を出す） */
  readCount?: 1 | 2;
  /**
   * 特定の問だけを対象にする場合の subId。
   * Explanation で「この問の音源だけ」を出したいときに使う。
   */
  focusSubId?: string;
  /** 追加クラス（余白調整） */
  className?: string;
}

/** 同一ページ上の他の音声を止める（BGM・他プレーヤーとの二重再生防止）。 */
function pauseOtherAudio(current: HTMLAudioElement | null) {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('audio').forEach((el) => {
    if (el !== current && !el.paused) el.pause();
  });
}

export function ListeningAudioPlayer({
  tracks,
  mode = 'practice',
  tone = 'light',
  title,
  readCount = 2,
  focusSubId,
  className = '',
}: ListeningAudioPlayerProps) {
  const isDark = tone === 'dark';
  const isReview = mode === 'review';

  // focusSubId が指定されていればその問だけに絞る
  const list = useMemo(
    () => (focusSubId ? tracks.filter((t) => t.subId === focusSubId) : tracks),
    [tracks, focusSubId],
  );

  /** いま再生中のトラック（null なら停止中） */
  const [playingId, setPlayingId] = useState<string | null>(null);
  /** スクリプトを開いているトラック（復習モードのみ） */
  const [openScriptId, setOpenScriptId] = useState<string | null>(null);
  /** 「2回続けて再生」の残り回数。1 なら再生終了後にもう一度鳴らす */
  const repeatLeft = useRef(0);
  /** 再生速度（0.75 はゆっくり確認用） */
  const [rate, setRate] = useState(1);

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // アンマウント時は必ず止める（画面遷移後に音だけ残るのを防ぐ）
  useEffect(() => {
    const refs = audioRefs;
    return () => {
      (Object.values(refs.current) as (HTMLAudioElement | null)[]).forEach((el) => {
        if (el && !el.paused) el.pause();
      });
    };
  }, []);

  // 再生速度の変更は再生中の要素にも即時反映する
  useEffect(() => {
    (Object.values(audioRefs.current) as (HTMLAudioElement | null)[]).forEach((el) => {
      if (el) el.playbackRate = rate;
    });
  }, [rate]);

  /** 指定トラックを先頭から再生する。repeat=true なら本番同様に2回続けて流す。 */
  const play = useCallback(
    (subId: string, repeat = false) => {
      const el = audioRefs.current[subId];
      if (!el) return;
      pauseOtherAudio(el);
      repeatLeft.current = repeat ? 1 : 0;
      el.currentTime = 0;
      el.playbackRate = rate;
      const p = el.play();
      if (p !== undefined) {
        p.then(() => setPlayingId(subId)).catch(() => setPlayingId(null));
      } else {
        setPlayingId(subId);
      }
    },
    [rate],
  );

  /** 再生／一時停止のトグル（同じボタンを2回押したら止まる）。 */
  const toggle = useCallback(
    (subId: string) => {
      const el = audioRefs.current[subId];
      if (!el) return;
      if (playingId === subId && !el.paused) {
        el.pause();
        repeatLeft.current = 0;
        setPlayingId(null);
        return;
      }
      play(subId, false);
    },
    [playingId, play],
  );

  /** 再生終了時。2回読みの残りがあればもう一度鳴らす。 */
  const handleEnded = useCallback((subId: string) => {
    if (repeatLeft.current > 0) {
      repeatLeft.current -= 1;
      const el = audioRefs.current[subId];
      if (el) {
        el.currentTime = 0;
        const p = el.play();
        if (p !== undefined) p.catch(() => setPlayingId(null));
        return;
      }
    }
    setPlayingId(null);
  }, []);

  if (list.length === 0) return null;

  const heading = title || (isReview ? '復習用の音源を聞く' : '音源を聞く');

  // ---- 配色（Tailwind の JIT が拾えるよう完成クラスを分岐で持つ） ----
  const panelClass = isDark
    ? 'border-[#5BC0BE]/45 bg-[#0B132B]/70'
    : 'border-[#5BC0BE]/55 bg-[#F2FBF9]';
  const headingClass = isDark ? 'text-[#A9E0D8]' : 'text-[#2F7C74]';
  const subTextClass = isDark ? 'text-[#E0E1DD]/70' : 'text-slate-500';
  const badgeClass = isDark
    ? 'border-[#5BC0BE]/40 bg-[#5BC0BE]/15 text-[#A9E0D8]'
    : 'border-[#5BC0BE]/40 bg-white text-[#2F7C74]';
  const idleBtnClass = isDark
    ? 'border-[#5BC0BE]/45 bg-[#1C2541] text-[#E0E1DD] hover:bg-[#243056]'
    : 'border-[#5BC0BE]/50 bg-white text-[#2C3E50] hover:bg-[#E6F7F4]';
  const activeBtnClass = 'border-[#3E9C93] bg-[#3E9C93] text-white ring-2 ring-[#3E9C93]/30';
  const scriptBoxClass = isDark
    ? 'border-[#3A506B]/70 bg-[#0B132B]/60 text-[#E0E1DD]'
    : 'border-[#5BC0BE]/30 bg-white text-slate-700';

  return (
    <section
      className={`rounded-2xl border-2 p-3 sm:p-4 shadow-sm ${panelClass} ${className}`}
      aria-label={heading}
    >
      {/* ── 見出し（ヘッドホンアイコンで「ここが音源」と即座に分かるようにする） ── */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3E9C93] text-white shadow-sm">
            <Headphones size={18} />
          </span>
          <div className="min-w-0">
            <h3 className={`text-sm sm:text-base font-bold leading-tight ${headingClass}`}>
              {heading}
            </h3>
            <p className={`text-[10px] sm:text-[11px] font-bold leading-snug ${subTextClass}`}>
              {isReview
                ? 'スクリプト・和訳を見ながら聞き直せます'
                : `ボタンを押すと音声が流れます（本番は${readCount}回読み）`}
            </p>
          </div>
        </div>

        {/* 再生速度。ゆっくり確認 → 本番速度、の順に練習できるようにする。 */}
        <div className="flex items-center gap-1" role="group" aria-label="再生速度">
          {[0.75, 1].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRate(r)}
              aria-pressed={rate === r}
              className={`min-h-[2rem] rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                rate === r ? activeBtnClass : idleBtnClass
              }`}
            >
              {r === 1 ? '標準' : '0.75倍'}
            </button>
          ))}
        </div>
      </div>

      {/* ── 音源ボタン（常時表示。隠さないことが「わかりやすい場所」の条件） ── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {list.map((track) => {
          const isPlaying = playingId === track.subId;
          return (
            <div key={track.subId} className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => toggle(track.subId)}
                aria-label={`${track.label}（${track.hint}）の音源を${isPlaying ? '停止' : '再生'}`}
                className={`flex min-h-[3rem] w-full items-center gap-2 rounded-xl border-2 px-2.5 py-2 text-left font-bold shadow-sm transition-all cursor-pointer ${
                  isPlaying ? activeBtnClass : idleBtnClass
                }`}
              >
                <span className="shrink-0">
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] leading-tight">{track.label}</span>
                  <span
                    className={`block truncate text-[10px] font-bold leading-tight ${
                      isPlaying ? 'text-white/80' : subTextClass
                    }`}
                  >
                    {track.hint}
                  </span>
                </span>
              </button>

              {/* もう1回だけ流す（聞き取れなかったときの即リトライ） */}
              <button
                type="button"
                onClick={() => play(track.subId, false)}
                aria-label={`${track.label} をもう一度再生`}
                className={`flex min-h-[2rem] items-center justify-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold transition-colors cursor-pointer ${idleBtnClass}`}
              >
                <RotateCcw size={11} />
                もう1回
              </button>

              {/* 復習モードのみ：スクリプト・和訳・語句を開く */}
              {isReview && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenScriptId(openScriptId === track.subId ? null : track.subId)
                    }
                    aria-expanded={openScriptId === track.subId}
                    className={`flex min-h-[2rem] items-center justify-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold transition-colors cursor-pointer ${idleBtnClass}`}
                  >
                    <FileText size={11} />
                    スクリプト
                    <ChevronDown
                      size={11}
                      className={`transition-transform ${
                        openScriptId === track.subId ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </>
              )}

              {/* 音声本体。controls は出さず、上のボタンに操作を集約する。 */}
              <audio
                ref={(el) => {
                  audioRefs.current[track.subId] = el;
                }}
                src={track.audioUrl}
                preload="none"
                onEnded={() => handleEnded(track.subId)}
                onPause={() => {
                  if (playingId === track.subId) setPlayingId(null);
                }}
                // @ts-ignore - iOS のインライン再生を許可する
                playsInline
              />
            </div>
          );
        })}
      </div>

      {/* ── 本番と同じ「2回続けて再生」（第1問・第2問は2回読み） ── */}
      {readCount === 2 && list.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {list.map((track) => (
            <button
              key={`repeat-${track.subId}`}
              type="button"
              onClick={() => play(track.subId, true)}
              aria-label={`${track.label} を本番と同じように2回続けて再生`}
              className={`flex min-h-[2.25rem] items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${idleBtnClass}`}
            >
              <Repeat2 size={13} />
              {track.label} を2回続けて
            </button>
          ))}
        </div>
      )}

      {/* ── スクリプト表示（復習モード） ── */}
      <AnimatePresence initial={false}>
        {isReview &&
          openScriptId &&
          (() => {
            const track = list.find((t) => t.subId === openScriptId);
            if (!track) return null;
            return (
              <motion.div
                key={openScriptId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={`mt-3 rounded-xl border p-3 ${scriptBoxClass}`}>
                  <p className={`mb-1 text-[10px] font-bold ${headingClass}`}>
                    {track.label} スクリプト
                  </p>
                  <p className="text-[13px] sm:text-sm font-bold leading-relaxed">
                    {track.script}
                  </p>
                  <p className={`mt-2 text-[12px] leading-relaxed ${subTextClass}`}>
                    {track.translation}
                  </p>

                  {track.keyPhrases.length > 0 && (
                    <div className="mt-2.5 border-t border-dashed border-current/20 pt-2">
                      <p className={`mb-1.5 text-[10px] font-bold ${headingClass}`}>
                        押さえたい表現
                      </p>
                      <ul className="space-y-1">
                        {track.keyPhrases.map((kp) => (
                          <li key={kp.phrase} className="flex flex-wrap items-baseline gap-1.5">
                            <span
                              className={`rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${badgeClass}`}
                            >
                              {kp.phrase}
                            </span>
                            <span className={`text-[11px] leading-relaxed ${subTextClass}`}>
                              {kp.meaning}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </section>
  );
}
