/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 問題解答後の「+○○」スコア加算アニメーション
 * - 浮き上がる数字アニメーション
 * - タイミングスケジュール: 基礎点 → 時間ボーナス → コンボ → 特殊ボーナス
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingScoreItem {
  id: string;
  label: string;
  value: number;
  color: string;
  delay: number;
}

interface FloatingScoreAnimationProps {
  breakdown: {
    basePoints: number;
    timeBonus: number;
    comboBonus: number;
    perfectBonus: number;
    descriptiveBonus: number;
    overtimePenalty: number;
  };
  totalScore: number;
  isVisible: boolean;
}

export function FloatingScoreAnimation({
  breakdown,
  totalScore,
  isVisible,
}: FloatingScoreAnimationProps) {
  const [items, setItems] = useState<FloatingScoreItem[]>([]);

  useEffect(() => {
    if (!isVisible) {
      setItems([]);
      return;
    }

    // スコア内訳をアニメーション対象のアイテムに変換
    const newItems: FloatingScoreItem[] = [];
    let delayOffset = 0;

    // 1. 基礎点 (赤色)
    if (breakdown.basePoints > 0) {
      newItems.push({
        id: 'base',
        label: '基礎点',
        value: breakdown.basePoints,
        color: 'from-red-500 to-red-400',
        delay: delayOffset,
      });
      delayOffset += 0.3;
    }

    // 2. 時間ボーナス (青色)
    if (breakdown.timeBonus > 0) {
      newItems.push({
        id: 'time',
        label: '時間ボーナス',
        value: breakdown.timeBonus,
        color: 'from-blue-500 to-blue-400',
        delay: delayOffset,
      });
      delayOffset += 0.3;
    }

    // 3. コンボボーナス (オレンジ色)
    if (breakdown.comboBonus > 0) {
      newItems.push({
        id: 'combo',
        label: 'コンボボーナス',
        value: breakdown.comboBonus,
        color: 'from-orange-500 to-orange-400',
        delay: delayOffset,
      });
      delayOffset += 0.3;
    }

    // 4. パーフェクトボーナス (金色)
    if (breakdown.perfectBonus > 0) {
      newItems.push({
        id: 'perfect',
        label: 'パーフェクト',
        value: breakdown.perfectBonus,
        color: 'from-yellow-500 to-yellow-400',
        delay: delayOffset,
      });
      delayOffset += 0.3;
    }

    // 5. 記述式ボーナス (紫色)
    if (breakdown.descriptiveBonus > 0) {
      newItems.push({
        id: 'descriptive',
        label: '記述式ボーナス',
        value: breakdown.descriptiveBonus,
        color: 'from-purple-500 to-purple-400',
        delay: delayOffset,
      });
      delayOffset += 0.3;
    }

    // 6. 延長ペナルティ (灰色)
    if (breakdown.overtimePenalty < 0) {
      newItems.push({
        id: 'penalty',
        label: '延長ペナルティ',
        value: breakdown.overtimePenalty,
        color: 'from-gray-500 to-gray-400',
        delay: delayOffset,
      });
      delayOffset += 0.3;
    }

    // 7. 合計スコア (緑色、最後に表示)
    newItems.push({
      id: 'total',
      label: '合計',
      value: totalScore,
      color: 'from-green-500 to-green-400',
      delay: delayOffset + 0.2,
    });

    setItems(newItems);
  }, [isVisible, breakdown, totalScore]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -80, scale: 1 }}
              exit={{ opacity: 0, y: -120 }}
              transition={{
                duration: 1,
                delay: item.delay,
                ease: 'easeOut',
              }}
              className="text-center mb-2"
            >
              <motion.div
                className={`
                  bg-gradient-to-r ${item.color}
                  text-white font-bold px-4 py-2 rounded-full
                  shadow-lg whitespace-nowrap
                  text-sm md:text-base
                `}
              >
                <div className="flex items-center gap-2">
                  {item.id === 'total' ? (
                    <>
                      <span className="text-lg">✨</span>
                      <span>
                        合計: <span className="text-xl">+{item.value}</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{item.label}:</span>
                      <span className="font-extrabold text-lg">+{item.value}</span>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
