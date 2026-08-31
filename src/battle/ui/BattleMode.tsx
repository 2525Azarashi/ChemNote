/**
 * ===================================================================
 * BattleMode — 対戦モードの入口（★App.tsx が読むのはこの1ファイルだけ★)
 * ===================================================================
 *
 * ★1ファイルだけを公開する理由★
 * 既存の App.tsx への変更を最小にするため。
 * 画面の数は10個あるが、App.tsx から見れば
 *   <BattleMode onExit={...} onRequireLogin={...} />
 * の1行で済む。対戦モードの内部の画面遷移は全部この中で完結させる。
 * 既存の AppState（画面の列挙）に追加するのも 'battle' の1つだけになる。
 *
 * ★ここで onSnapshot を張らない理由★
 * 部屋の購読は BattleRoomScreen（の useBattleRoom）が1本だけ持つ。
 * 上位でも購読すると同じドキュメントを2回読むことになり、
 * 無料枠の読み取り回数が倍になる。
 *
 * ★ルールの上書きを最初に1回だけ読む理由★
 * battle_rules は運用調整用（数学だけ6問にする等）で、普段は空。
 * 教科選択のたびに読むと、対戦していない人でも読み取りが増える。
 * 対戦モードに入ったときに1回だけ読み、以後はメモリのキャッシュを使う。
 */

import { useCallback, useEffect, useState } from 'react';
import {
  createFriendRoom,
  loadBattleRuleOverrides,
} from '../data/battle';
import { ensureBattleRankingEntry } from '../data/battleRanking';
import { auth } from '../../firebase';
import { BattleFriendJoin } from './BattleFriendJoin';
import { BattleHistory } from './BattleHistory';
import { BattleHome } from './BattleHome';
import type { BattleHomeChoice } from './BattleHome';
import { BattleLoading, BattleNotice, BattleShell, BattleTitle } from './BattleParts';
import { BattleMatching } from './BattleMatching';
import { BattleRanking } from './BattleRanking';
import { BattleRoomScreen } from './BattleRoomScreen';
import { BattleSubjectSelect } from './BattleSubjectSelect';

/**
 * 対戦モードの中の画面。
 *
 *  home            … 入口（フレンド/全国/ランキング/履歴）
 *  subject-friend  … 教科選択（部屋を作る）
 *  subject-national… 教科選択（全国対戦）
 *  creating        … 部屋を作っている最中
 *  join            … 合言葉を入れる
 *  matching        … 全国の相手さがし
 *  room            … 部屋の中（待機・対戦・結果）
 *  ranking / history
 */
type Screen =
  | 'home'
  | 'subject-friend'
  | 'subject-national'
  | 'creating'
  | 'join'
  | 'matching'
  | 'room'
  | 'ranking'
  | 'history';

export function BattleMode({
  onExit,
  onRequireLogin,
}: {
  /** 対戦モードを抜けてアプリのホームに戻る */
  onExit: () => void;
  /** ログインしていないときにログイン画面へ送る */
  onRequireLogin?: () => void;
}) {
  const [screen, setScreen] = useState<Screen>('home');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------------------
  // 初回の準備（ルール上書きの読み込み・ランキング行の作成）
  // ------------------------------------------------------------
  useEffect(() => {
    if (!auth.currentUser) return;
    // どちらも失敗しても対戦は成立する（既定値で動く）ので待たない
    void loadBattleRuleOverrides();
    void ensureBattleRankingEntry();
  }, []);

  // ------------------------------------------------------------
  // 入口の選択
  // ------------------------------------------------------------
  const handleHomeChoice = useCallback((choice: BattleHomeChoice) => {
    setNotice(null);
    setError(null);
    switch (choice) {
      case 'friend-create':
        setScreen('subject-friend');
        break;
      case 'friend-join':
        setScreen('join');
        break;
      case 'national':
        setScreen('subject-national');
        break;
      case 'ranking':
        setScreen('ranking');
        break;
      case 'history':
        setScreen('history');
        break;
    }
  }, []);

  // ------------------------------------------------------------
  // 部屋を作る
  // ------------------------------------------------------------
  const createRoom = useCallback(async (pick: string) => {
    setSubject(pick);
    setScreen('creating');
    setError(null);
    try {
      const { roomId: created } = await createFriendRoom(pick);
      setRoomId(created);
      setScreen('room');
    } catch (e) {
      setError(e instanceof Error ? e.message : '部屋を作れませんでした。');
      setScreen('subject-friend');
    }
  }, []);

  // ------------------------------------------------------------
  // 部屋から戻る
  // ------------------------------------------------------------
  const leaveRoom = useCallback((message?: string) => {
    setRoomId(null);
    setNotice(message || null);
    setScreen('home');
  }, []);

  /** 同じ教科でもう1回（結果画面から） */
  const rematch = useCallback(
    (pick: string) => {
      setRoomId(null);
      void createRoom(pick);
    },
    [createRoom],
  );

  // ------------------------------------------------------------
  // 画面
  // ------------------------------------------------------------
  switch (screen) {
    case 'subject-friend':
      return (
        <>
          {error && (
            <div className="fixed inset-x-0 top-2 z-50 mx-auto max-w-xl px-4">
              <BattleNotice message={error} />
            </div>
          )}
          <BattleSubjectSelect
            title="部屋をつくる ／ 教科をえらぶ"
            onPick={(pick) => void createRoom(pick)}
            onBack={() => setScreen('home')}
          />
        </>
      );

    case 'subject-national':
      return (
        <BattleSubjectSelect
          title="全国対戦 ／ 教科をえらぶ"
          onPick={(pick) => {
            setSubject(pick);
            setScreen('matching');
          }}
          onBack={() => setScreen('home')}
        />
      );

    case 'creating':
      return (
        <BattleShell>
          <BattleTitle subtitle="部屋をつくっています" />
          <BattleLoading message="あいことばを用意しています…" />
        </BattleShell>
      );

    case 'join':
      return (
        <BattleFriendJoin
          onJoined={(id) => {
            setRoomId(id);
            setScreen('room');
          }}
          onBack={() => setScreen('home')}
        />
      );

    case 'matching':
      return (
        <BattleMatching
          subject={subject}
          onMatched={(id) => {
            setRoomId(id);
            setScreen('room');
          }}
          onCancel={() => setScreen('home')}
          onSwitchToFriend={() => void createRoom(subject)}
        />
      );

    case 'room':
      if (!roomId) {
        // 想定外の状態（部屋IDが無いのに部屋画面）。
        // ★描画中に setScreen を呼ばない★
        //   React は描画の途中の状態更新を警告する（無限ループの原因にもなる）。
        //   代わりに入口の画面をそのまま描く。次の操作で正しい状態に戻る。
        return (
          <BattleHome
            onChoose={handleHomeChoice}
            onExit={onExit}
            onRequireLogin={onRequireLogin}
            notice="対戦を開始できませんでした。もう一度お試しください。"
          />
        );
      }
      return (
        <BattleRoomScreen roomId={roomId} onExit={leaveRoom} onRematch={rematch} />
      );

    case 'ranking':
      return <BattleRanking onBack={() => setScreen('home')} />;

    case 'history':
      return <BattleHistory onBack={() => setScreen('home')} />;

    case 'home':
    default:
      return (
        <BattleHome
          onChoose={handleHomeChoice}
          onExit={onExit}
          onRequireLogin={onRequireLogin}
          notice={notice}
        />
      );
  }
}

export default BattleMode;
