import { useEffect, useMemo, useState } from 'react';
import { subscribeBlocked, withoutBlocked } from './userSafety';

/** ブロック中の人を一覧から除く（ブロック・解除するとその場で反映される） */
export function useWithoutBlocked<T extends { uid?: string | null }>(rows: readonly T[]): T[] {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeBlocked(() => setTick((t) => t + 1)), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo<T[]>(() => withoutBlocked<T>(rows), [rows, tick]);
}

/** ブロック一覧が変わるたびに増える数（useMemo の依存に使う） */
export function useBlockedTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeBlocked(() => setTick((t) => t + 1)), []);
  return tick;
}
