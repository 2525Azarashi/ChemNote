/**
 * ===================================================================
 * BattleFriendJoin — 合言葉を入れて部屋に入る
 * ===================================================================
 *
 * ★4つのマスに1文字ずつ表示する理由★
 * 合言葉は口で伝える前提なので「今どこまで入れたか」が見えないと、
 * 聞き取った文字を数え直すことになる。
 * 入力欄そのものは画面の外（見えない input）に置き、
 * 見た目は4つのマスにする。
 *
 * ★ソフトキーボードは英数字に固定する★
 * inputMode="text" のままだと日本語IMEが立ち上がる端末があり、
 * 「ABCD」を入れるのに変換が必要になる。
 * autoCapitalize と inputMode を指定して、大文字英数字だけを出す。
 *
 * ★教科をここで選ばせない理由★
 * 教科は部屋を作った側が決めている。
 * 入る側にも選ばせると、選んだ教科と実際の教科が違って混乱する。
 * 入室後のロビー画面で「どの教科か」を表示する。
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';
import { joinRoomByCode } from '../data/battle';
import {
  AMBER,
  BattleButton,
  BattleNotice,
  BattleShell,
  BattleTitle,
  GOLD,
  INK,
  INK_SUB,
  LINE,
} from './BattleParts';

const CODE_LENGTH = 4;

export function BattleFriendJoin({
  onJoined,
  onBack,
}: {
  onJoined: (roomId: string) => void;
  onBack: () => void;
}) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 画面に来たら自動でキーボードを出す（1手はぶく）
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = useCallback(
    async (value: string) => {
      if (busy) return;
      setBusy(true);
      setError(null);
      try {
        const roomId = await joinRoomByCode(value);
        onJoined(roomId);
      } catch (e) {
        setError(e instanceof Error ? e.message : '部屋に入れませんでした。');
        setBusy(false);
      }
    },
    [busy, onJoined],
  );

  const handleChange = (raw: string) => {
    const next = raw
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, CODE_LENGTH);
    setCode(next);
    setError(null);
    // ★4文字そろったら自動で送る★
    //   「決定」を押させると、合言葉を読み上げてもらっている最中に
    //   もう1手増える。数がそろった時点で意思は確定している。
    if (next.length === CODE_LENGTH) void submit(next);
  };

  const cells = Array.from({ length: CODE_LENGTH }, (_, i) => code[i] || '');

  return (
    <BattleShell
      footer={
        <div className="grid gap-2.5">
          <BattleButton
            onClick={() => void submit(code)}
            disabled={code.length !== CODE_LENGTH || busy}
            icon={<LogIn size={18} />}
          >
            {busy ? '入っています…' : '部屋に入る'}
          </BattleButton>
          <BattleButton variant="ghost" onClick={onBack} icon={<ArrowLeft size={18} />}>
            もどる
          </BattleButton>
        </div>
      }
    >
      <BattleTitle subtitle="合言葉で参加する" />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6">
        <p
          className="text-center text-xs font-bold leading-relaxed"
          style={{ color: INK_SUB }}
        >
          相手に画面を見せてもらって、
          <br />
          4文字の合言葉を入れてください。
        </p>

        {/* 見た目のマス（タップすると隠れた input にフォーカスする） */}
        <button
          type="button"
          id="battle-code-cells"
          onClick={() => inputRef.current?.focus()}
          className="flex gap-2.5"
          aria-label="合言葉を入力する"
        >
          {cells.map((ch, i) => (
            <span
              key={i}
              // ★入力済みのマスを一瞬跳ねさせる★
              //   合言葉は口で伝えてもらいながら入れるので、
              //   画面を見ずに打っても 1文字入ったことが周辺視で分かる。
              className={`flex h-16 w-14 items-center justify-center rounded-2xl border-2 text-3xl font-black tabular-nums ${
                ch ? 'battle-pop' : ''
              }`}
              style={{
                borderColor: ch ? '#E5B93C' : LINE,
                background: ch ? `${GOLD}3D` : '#FFFFFF',
                color: ch ? INK : `${INK_SUB}66`,
              }}
            >
              {ch || '・'}
            </span>
          ))}
        </button>

        {/* 実際の入力欄（画面には出さないが、読み上げには残す） */}
        <input
          ref={inputRef}
          id="battle-code-input"
          value={code}
          onChange={(e) => handleChange(e.target.value)}
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={CODE_LENGTH}
          aria-label="合言葉"
          className="absolute h-0 w-0 opacity-0"
        />

        {error && <BattleNotice message={error} />}

        <p
          className="rounded-xl px-3 py-2 text-center text-[10px] font-bold leading-relaxed"
          style={{ background: '#F1EDE4', border: `1px solid ${LINE}`, color: INK_SUB }}
        >
          合言葉には
          <span style={{ color: AMBER }}> 0 / O / 1 / I / L </span>
          を使いません。
          <br />
          読み間違いを起こさない文字だけで作っています。
        </p>
      </div>
    </BattleShell>
  );
}
