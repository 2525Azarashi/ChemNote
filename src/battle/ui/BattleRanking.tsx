/**
 * ===================================================================
 * BattleRanking — 対戦ランキング（全国 / フレンド）
 * ===================================================================
 *
 * ★既存の学習ランキング（leaderboard_*）とは別のコレクションを見る★
 * 既存ランキングは「学習量」を競うもので、対戦の強さとは別の指標。
 * 同じ表に混ぜると、対戦をやらない人の順位が対戦で動いてしまう。
 * 対戦は battle_ranking という独立したコレクションを持ち、
 * 既存ランキングのコード（utils/leaderboard.ts）には一切触らない。
 *
 * ★フレンドタブを先に出す理由★
 * 全国のレート上位は、始めたばかりの人には遠すぎて目標にならない。
 * 知っている相手の中での順位なら、次に誰を追えばよいか分かる。
 *
 * ★全国タブで名前を隠す理由★
 * 既存の全国ランキングと同じ規則（nicknamePrivacy）に合わせる。
 * 片方だけ本名が出ると、利用者から見て一貫していない。
 */

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Crown, Users, Wifi } from 'lucide-react';
import { auth } from '../../firebase';
import { maskNickname } from '../../utils/nicknamePrivacy';
import { fetchFriendUids } from '../../utils/friends';
import {
  fetchBattleRanking,
  fetchFriendBattleRanking,
  ratingTitle,
} from '../data/battleRanking';
import type { BattleRankingRow } from '../data/battleRanking';
import {
  BattleButton,
  BattleLoading,
  BattleShell,
  BattleTitle,
  GOLD,
  NAVY,
} from './BattleParts';

type Tab = 'friend' | 'national';

/** 上位3位の色（金・銀・銅） */
const MEDALS = ['#F4D03F', '#BDC3C7', '#CD7F32'];

export function BattleRanking({ onBack }: { onBack: () => void }) {
  const uid = auth.currentUser?.uid || '';
  const [tab, setTab] = useState<Tab>('friend');
  const [rows, setRows] = useState<BattleRankingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (which: Tab) => {
    setLoading(true);
    try {
      if (which === 'national') {
        setRows(await fetchBattleRanking(50));
      } else {
        // 既存のフレンド機能をそのまま使う（自分も含む）
        const friendUids = await fetchFriendUids(true);
        setRows(await fetchFriendBattleRanking(friendUids));
      }
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(tab);
  }, [tab, load]);

  return (
    <BattleShell
      footer={
        <BattleButton variant="ghost" onClick={onBack} icon={<ArrowLeft size={18} />}>
          もどる
        </BattleButton>
      }
    >
      <BattleTitle subtitle="対戦ランキング" />

      {/* タブ */}
      <div
        id="battle-ranking-tabs"
        className="mb-3 flex gap-1 rounded-2xl p-1"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      >
        {(
          [
            { key: 'friend' as Tab, label: 'フレンド', icon: <Users size={13} /> },
            { key: 'national' as Tab, label: '全国', icon: <Wifi size={13} /> },
          ]
        ).map((t) => {
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition"
              style={
                on
                  ? { background: GOLD, color: NAVY }
                  : { background: 'transparent', color: 'rgba(255,255,255,0.6)' }
              }
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <BattleLoading message="ランキングを読みこんでいます…" />
      ) : rows.length === 0 ? (
        <p className="py-12 text-center text-xs font-bold leading-relaxed text-white/50">
          {tab === 'friend'
            ? 'フレンドの中に、まだ対戦した人がいません。\n合言葉で1戦すればここに並びます。'
            : 'まだ対戦記録がありません。'}
        </p>
      ) : (
        <ol className="grid gap-1.5">
          {rows.map((row, i) => {
            const isMe = row.uid === uid;
            const title = ratingTitle(row.rating || 1500);
            const medal = MEDALS[i];
            const shown =
              tab === 'national' && !isMe ? maskNickname(row.nickname || '') : row.nickname || '名前なし';

            return (
              <li
                key={row.uid}
                className="flex items-center gap-2.5 rounded-2xl border px-3 py-2.5"
                style={{
                  borderColor: isMe ? `${GOLD}77` : 'rgba(255,255,255,0.10)',
                  background: isMe ? `${GOLD}14` : 'rgba(255,255,255,0.04)',
                }}
              >
                {/* 順位 */}
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black tabular-nums"
                  style={{
                    background: medal ? medal : 'rgba(255,255,255,0.10)',
                    color: medal ? NAVY : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {i < 3 ? <Crown size={13} /> : i + 1}
                </span>

                {/* アイコン */}
                {row.photoURL ? (
                  <img
                    src={row.photoURL}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black"
                    style={{ background: `${title.color}33`, color: title.color }}
                  >
                    {(shown[0] || '?').toUpperCase()}
                  </span>
                )}

                {/* 名前と戦績 */}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-black text-white">{shown}</span>
                    {isMe && (
                      <span
                        className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black"
                        style={{ background: GOLD, color: NAVY }}
                      >
                        あなた
                      </span>
                    )}
                  </span>
                  <span className="block text-[10px] font-bold text-white/45">
                    {row.wins || 0}勝 {row.losses || 0}敗 {row.draws || 0}分
                  </span>
                </span>

                {/* レート */}
                <span className="shrink-0 text-right">
                  <span
                    className="block text-base font-black tabular-nums"
                    style={{ color: title.color }}
                  >
                    {row.rating || 1500}
                  </span>
                  <span className="block text-[9px] font-black" style={{ color: title.color }}>
                    {title.label}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-auto pt-6 text-center text-[10px] font-bold leading-relaxed text-white/30">
        このランキングは対戦専用です。
        <br />
        学習量のランキングとは別に集計しています。
      </p>
    </BattleShell>
  );
}
