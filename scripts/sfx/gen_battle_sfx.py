"""
マナトビ 対戦用 効果音ジェネレーター
===================================
すべての音を numpy だけで一から合成する（サンプリング素材・外部音源は一切使わない）。
→ 第三者の権利が入らないので、商用利用・改変・再配布が自由（LICENSE_SFX.md 参照）。

出力:
  public/sfx/battle/<name>.mp3   … アプリが読み込む軽量版（mono 44.1kHz）
  build/sfx_master/<name>.wav    … 16bit WAV マスター（ZIP 同梱用）

実行:  python3 scripts/sfx/gen_battle_sfx.py
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import wave

import numpy as np
from scipy.signal import fftconvolve, lfilter

SR = 44100
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT_MP3 = os.path.join(ROOT, 'public', 'sfx', 'battle')
OUT_WAV = os.path.join(ROOT, 'build', 'sfx_master')
RNG = np.random.default_rng(20260925)  # 毎回同じ音になるよう固定


# ------------------------------------------------------------------
# 基本部品
# ------------------------------------------------------------------
def hz(semi: float) -> float:
    """A4=440 からの半音数 → 周波数"""
    return 440.0 * 2 ** (semi / 12)


def t_axis(dur: float) -> np.ndarray:
    return np.arange(int(dur * SR)) / SR


def osc(freq, dur, kind='sine', phase=0.0):
    """freq は定数か、長さ dur の配列（スイープ）"""
    n = int(dur * SR)
    f = np.full(n, float(freq)) if np.isscalar(freq) else np.asarray(freq, dtype=float)[:n]
    ph = 2 * np.pi * np.cumsum(f) / SR + phase
    if kind == 'sine':
        return np.sin(ph)
    if kind == 'triangle':
        return 2 / np.pi * np.arcsin(np.sin(ph))
    if kind == 'square':
        # 帯域を抑えた柔らかい矩形波（奇数倍音 7 本）
        return sum(np.sin(ph * k) / k for k in (1, 3, 5, 7, 9, 11, 13)) * 4 / np.pi * 0.8
    if kind == 'saw':
        return sum(np.sin(ph * k) / k * (-1) ** (k + 1) for k in range(1, 12)) * 2 / np.pi * 0.8
    raise ValueError(kind)


def env(n, a=0.005, d=0.0, s=1.0, r=0.05, curve=3.0):
    """ADSR（長さ n サンプル）。リリースは指数的に減衰"""
    out = np.ones(n)
    ia, idd, ir = int(a * SR), int(d * SR), int(r * SR)
    ia = max(ia, 1)
    out[:ia] = np.linspace(0, 1, ia) if ia <= n else np.linspace(0, 1, n)[:n]
    if idd and ia + idd < n:
        out[ia:ia + idd] = np.linspace(1, s, idd)
        out[ia + idd:] = s
    if ir and ir < n:
        k = np.linspace(0, 1, ir)
        out[n - ir:] *= (1 - k) ** curve
    return out


def expdecay(n, tau):
    return np.exp(-np.arange(n) / SR / tau)


def noise(dur):
    return RNG.uniform(-1, 1, int(dur * SR))


def lowpass(x, cutoff):
    """1次ローパス（cutoff は定数か配列）"""
    c = np.full(len(x), float(cutoff)) if np.isscalar(cutoff) else np.asarray(cutoff)
    a = 1 - np.exp(-2 * np.pi * c / SR)
    if np.isscalar(cutoff):
        return lfilter([a[0]], [1, a[0] - 1], x)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def bandpass(x, lo, hi):
    return lowpass(highpass(x, lo), hi)


def note(freq, dur, kind='triangle', gain=1.0, a=0.004, r=None, bright=0.0, detune=0.0):
    """1音。bright>0 で倍音(1オクターブ上)を少し重ねる。detune で揺らぎ（コーラス）"""
    r = dur * 0.7 if r is None else r
    x = osc(freq, dur, kind)
    if detune:
        x = 0.5 * x + 0.5 * osc(freq * (1 + detune), dur, kind, phase=1.3)
    if bright:
        x = x + bright * osc(freq * 2, dur, 'sine')
    return x * env(len(x), a=a, r=r) * gain


def bell(freq, dur, gain=1.0, tau=0.35):
    """金属的なベル（非整数倍音）— コイン・きらめき用"""
    n = int(dur * SR)
    parts = [(1.0, 1.0), (2.76, 0.45), (5.4, 0.25), (8.93, 0.12)]
    x = sum(g * osc(freq * m, dur, 'sine') * expdecay(n, tau / (1 + i * 0.8))
            for i, (m, g) in enumerate(parts))
    return x * env(n, a=0.001, r=0.02) * gain


def mix(dur, *events):
    """events: (開始秒, 配列)"""
    out = np.zeros(int(dur * SR) + 1)
    for start, x in events:
        i = int(start * SR)
        j = min(len(out), i + len(x))
        out[i:j] += x[:j - i]
    return out


def reverb(x, amount=0.25, length=0.6, damp=4000):
    """減衰ノイズとの畳み込みで簡易ルーム残響"""
    n = int(length * SR)
    ir = RNG.standard_normal(n) * np.exp(-np.arange(n) / SR / (length / 5))
    ir = lowpass(ir, damp)
    ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    wet = fftconvolve(x, ir)
    dry = np.concatenate([x, np.zeros(len(wet) - len(x))])
    return dry + amount * wet


def finish(x, peak_db=-1.0, tail=0.02):
    """DC除去・頭の無音カット・末尾フェード・ピーク正規化"""
    x = x - np.mean(x)
    nz = np.nonzero(np.abs(x) > 1e-4)[0]
    if len(nz):
        x = x[max(0, nz[0] - 16): nz[-1] + int(tail * SR)]
    f = min(len(x), int(0.01 * SR))
    x[-f:] *= np.linspace(1, 0, f)
    x[:16] *= np.linspace(0, 1, 16)
    peak = np.max(np.abs(x)) + 1e-9
    return x / peak * 10 ** (peak_db / 20)


# ------------------------------------------------------------------
# 各効果音
#   peak_db は音の「役割の大きさ」。頻繫に鳴るもの（tap/tick/hurry/opponent-answered）
#   ほど小さくし、1試合に1回のもの（win/rankup）を大きくする。
# ------------------------------------------------------------------
SOUNDS: dict[str, dict] = {}


def sfx(name, label, when, peak_db):
    def deco(fn):
        SOUNDS[name] = dict(fn=fn, label=label, when=when, peak_db=peak_db)
        return fn
    return deco


C5 = hz(3)  # 523Hz


@sfx('tap', '選択', '選択肢・ボタンを押した瞬間', -12)
def _tap():
    body = note(1400, 0.045, 'sine', a=0.001, r=0.04)
    click = bandpass(noise(0.012), 2000, 6000) * expdecay(int(0.012 * SR), 0.003) * 0.6
    return mix(0.06, (0, body), (0, click))


@sfx('tick', 'カウント刻み', '数字のカウントアップ（XP・コイン）', -16)
def _tick():
    return note(2200, 0.02, 'sine', a=0.0005, r=0.018)


@sfx('correct', '正解', '自分が正解した', -2)
def _correct():
    # ピンポン！（長3度上 → 完全5度）＋きらめき
    a = note(hz(10), 0.13, 'triangle', a=0.002, r=0.1, bright=0.35)
    b = note(hz(17), 0.34, 'triangle', a=0.002, r=0.3, bright=0.35)
    sp = bell(hz(29), 0.3, 0.18, tau=0.12)
    return reverb(mix(0.5, (0, a), (0.1, b), (0.12, sp)), 0.18, 0.5)


@sfx('wrong', '不正解', '自分が不正解だった', -5)
def _wrong():
    # ブッブー（低い2打・うなり付き）
    def buzz(d):
        x = osc(hz(-14), d, 'saw') * 0.6 + osc(hz(-14) * 1.012, d, 'saw') * 0.6
        return lowpass(x, 1400) * env(len(x), a=0.004, r=0.05)
    return mix(0.45, (0, buzz(0.16)), (0.2, buzz(0.24)))


@sfx('timeup', '時間切れ', '答える前に制限時間が来た', -6)
def _timeup():
    d = 0.55
    f = np.linspace(hz(0), hz(-12), int(d * SR))
    x = osc(f, d, 'triangle') * env(int(d * SR), a=0.005, r=0.3)
    y = 0.4 * lowpass(noise(d), 800) * expdecay(int(d * SR), 0.15)
    return reverb(mix(d, (0, x), (0, y)), 0.2, 0.4)


@sfx('opponent-answered', '相手が回答', '相手が答えた（小さな合図）', -15)
def _opp_answered():
    return mix(0.08, (0, note(hz(7), 0.07, 'sine', a=0.002, r=0.06)), (0, 0.3 * note(hz(19), 0.05, 'sine', a=0.002, r=0.04)))


@sfx('opponent-correct', '相手が正解', '相手が正解した', -8)
def _opp_correct():
    a = note(hz(-2), 0.1, 'triangle', a=0.003, r=0.08)
    b = note(hz(5), 0.18, 'triangle', a=0.003, r=0.16)
    return lowpass(mix(0.3, (0, a), (0.09, b)), 3000)


@sfx('combo', 'コンボ', '連続正解', -2)
def _combo():
    notes = [3, 7, 10, 15, 19]
    ev = [(i * 0.055, note(hz(s + 7), 0.16, 'square', 0.5, a=0.002, r=0.12)) for i, s in enumerate(notes)]
    ev.append((0.28, bell(hz(34), 0.4, 0.25, tau=0.15)))
    return reverb(mix(0.75, *ev), 0.22, 0.5)


@sfx('overtake', '逆転！', '自分が相手を逆転した', -2)
def _overtake():
    d = 0.3
    sweep = osc(np.geomspace(300, 1800, int(d * SR)), d, 'saw') * env(int(d * SR), a=0.01, r=0.1)
    sweep = lowpass(sweep, 5000) * 0.35
    hits = [(0.28, note(hz(s), 0.35, 'square', 0.45, r=0.3)) for s in (10, 14, 17, 22)]
    return reverb(mix(0.8, (0, sweep), *hits), 0.25, 0.6)


@sfx('overtaken', '逆転された', '相手に逆転された', -7)
def _overtaken():
    d = 0.5
    f = np.geomspace(900, 250, int(d * SR))
    x = osc(f, d, 'triangle') * env(int(d * SR), a=0.005, r=0.25)
    y = note(hz(-9), 0.3, 'triangle', 0.5, r=0.25)
    return mix(0.8, (0, x), (0.35, y))


@sfx('caught-up', '追いついた', '同点に追いついた', -5)
def _caught_up():
    return mix(0.35, (0, note(hz(5), 0.1, 'triangle', r=0.08)), (0.09, note(hz(12), 0.22, 'triangle', r=0.2, bright=0.3)))


@sfx('matched', 'マッチング成立', '相手が見つかった／部屋に入った', -3)
def _matched():
    ev = [(i * 0.08, note(hz(s), 0.3, 'triangle', 0.8, r=0.26, bright=0.3)) for i, s in enumerate((3, 8, 12, 15))]
    ev.append((0.3, bell(hz(27), 0.6, 0.3, tau=0.25)))
    return reverb(mix(1.0, *ev), 0.3, 0.8)


@sfx('countdown', 'カウントダウン', '試合開始前の 3・2・1', -5)
def _countdown():
    return reverb(note(hz(14), 0.16, 'sine', a=0.002, r=0.14, bright=0.2), 0.15, 0.3)


@sfx('start', 'START!', '試合開始', -1)
def _start():
    a = note(hz(26), 0.55, 'sine', a=0.002, r=0.5, bright=0.25)
    b = note(hz(19), 0.55, 'triangle', 0.5, a=0.002, r=0.5)
    hit = lowpass(noise(0.15), 3000) * expdecay(int(0.15 * SR), 0.03) * 0.5
    return reverb(mix(0.7, (0, a), (0, b), (0, hit)), 0.25, 0.6)


@sfx('hurry', '残り3秒', '残り3秒の刻み（1秒ごと）', -13)
def _hurry():
    x = bandpass(noise(0.04), 600, 2500) * expdecay(int(0.04 * SR), 0.008)
    return mix(0.05, (0, x), (0, 0.5 * note(700, 0.04, 'sine', a=0.0005, r=0.035)))


@sfx('final', '最終問題', '最終問題の合図', -2)
def _final():
    ev = [(0, note(hz(-9), 0.15, 'square', 0.6, r=0.1)), (0.18, note(hz(-9), 0.15, 'square', 0.6, r=0.1))]
    ev += [(0.36, note(hz(s), 0.55, 'square', 0.45, r=0.45, detune=0.004)) for s in (3, 7, 10)]
    drum = lowpass(noise(0.3), 400) * expdecay(int(0.3 * SR), 0.08)
    ev += [(0, drum * 0.6), (0.18, drum * 0.6), (0.36, drum)]
    return reverb(mix(1.0, *ev), 0.25, 0.7)


def _fanfare(melody, chord, step, kind='triangle'):
    ev = [(i * step, note(hz(s), step * 1.3, kind, 0.8, r=step, bright=0.3)) for i, s in enumerate(melody)]
    t0 = len(melody) * step
    ev += [(t0, note(hz(s), 0.9, kind, 0.55, r=0.8, detune=0.003)) for s in chord]
    return ev, t0 + 1.0


@sfx('win', '勝利', '試合に勝った', -1)
def _win():
    ev, end = _fanfare([3, 7, 10, 15, 10, 15], [15, 19, 22, 27], 0.1)
    ev.append((end - 0.95, bell(hz(34), 0.9, 0.3, tau=0.3)))
    ev.append((end - 0.8, bell(hz(39), 0.8, 0.2, tau=0.25)))
    return reverb(mix(end + 0.2, *ev), 0.3, 1.0)


@sfx('lose', '敗北', '試合に負けた', -4)
def _lose():
    ev = [(i * 0.2, note(hz(s), 0.28, 'triangle', 0.8, r=0.25)) for i, s in enumerate((7, 5, 3))]
    ev.append((0.6, note(hz(-2), 0.9, 'triangle', 0.7, r=0.8, detune=0.006)))
    ev.append((0.6, note(hz(-14), 0.9, 'sine', 0.5, r=0.8)))
    return reverb(mix(1.6, *ev), 0.3, 0.9)


@sfx('draw', '引き分け', '同点で終わった', -4)
def _draw():
    ev = [(0, note(hz(3), 0.2, 'triangle', r=0.15)), (0.22, note(hz(3), 0.2, 'triangle', r=0.15)),
          (0.44, note(hz(5), 0.5, 'triangle', r=0.45)), (0.44, note(hz(10), 0.5, 'triangle', 0.5, r=0.45))]
    return reverb(mix(1.0, *ev), 0.25, 0.7)


@sfx('levelup', 'レベルアップ', 'レベルが上がった', -1)
def _levelup():
    ev = [(i * 0.07, note(hz(s), 0.18, 'square', 0.5, r=0.14)) for i, s in enumerate((3, 7, 10, 15, 19, 22))]
    ev += [(0.45, note(hz(s), 0.8, 'triangle', 0.6, r=0.7, detune=0.003)) for s in (15, 22, 27)]
    ev += [(0.45 + i * 0.06, bell(hz(34 + s), 0.5, 0.15, tau=0.18)) for i, s in enumerate((0, 3, 7, 12))]
    return reverb(mix(1.5, *ev), 0.3, 0.9)


@sfx('rankup', '段位アップ', '段位（ランク）が上がった', -1)
def _rankup():
    d = 0.4
    riser = lowpass(noise(d), np.geomspace(500, 8000, int(d * SR))) * np.linspace(0, 1, int(d * SR)) ** 2 * 0.5
    ev = [(0, riser)]
    ev += [(0.4, note(hz(s), 1.2, 'square', 0.45, r=1.1, detune=0.004)) for s in (10, 14, 17, 22)]
    ev += [(0.4, note(hz(-2), 1.2, 'sine', 0.6, r=1.1))]
    ev += [(0.4 + i * 0.05, bell(hz(29 + s), 0.7, 0.18, tau=0.25)) for i, s in enumerate((0, 5, 9, 12, 17))]
    return reverb(mix(1.9, *ev), 0.35, 1.1)


@sfx('badge', '称号ゲット', '新しい称号・バッジを手に入れた', -3)
def _badge():
    ev = [(0, bell(hz(24), 0.6, 0.8, tau=0.3)), (0.08, bell(hz(31), 0.7, 0.7, tau=0.35)),
          (0.16, bell(hz(36), 0.8, 0.5, tau=0.4))]
    return reverb(mix(1.0, *ev), 0.3, 0.8)


@sfx('coin', 'コイン', '報酬（XP・コイン）を受け取った', -4)
def _coin():
    return reverb(mix(0.5, (0, bell(hz(31), 0.1, 0.8, tau=0.05)), (0.07, bell(hz(36), 0.4, 0.9, tau=0.15))), 0.12, 0.3)


@sfx('chest', '宝箱オープン', 'デイリー宝箱を開けた', -2)
def _chest():
    creak = bandpass(noise(0.25), 300, 1200) * env(int(0.25 * SR), a=0.05, r=0.1) * 0.5
    thump = lowpass(noise(0.12), 300) * expdecay(int(0.12 * SR), 0.03)
    ev = [(0, creak), (0.22, thump)]
    ev += [(0.28 + i * 0.045, bell(hz(27 + s), 0.45, 0.35, tau=0.18)) for i, s in enumerate((0, 4, 7, 12, 16, 19))]
    return reverb(mix(1.0, *ev), 0.28, 0.8)


@sfx('jackpot', '大当たり', '宝箱の大当たり（7日連続）', -1)
def _jackpot():
    ev = [(i * 0.06, bell(hz(27 + s), 0.4, 0.5, tau=0.15)) for i, s in enumerate((0, 4, 7, 12, 16, 19, 24, 28))]
    ev += [(0.5, note(hz(s), 1.1, 'square', 0.45, r=1.0, detune=0.004)) for s in (15, 19, 22, 27)]
    ev += [(0.5 + i * 0.09, bell(hz(40 + (i % 3) * 5), 0.3, 0.2, tau=0.1)) for i in range(8)]
    return reverb(mix(1.8, *ev), 0.35, 1.0)


@sfx('gacha', 'ガチャ演出', 'ガチャの結果が出る', -2)
def _gacha():
    d = 0.6
    roll = np.zeros(int(d * SR))
    for k, t in enumerate(np.cumsum(np.geomspace(0.03, 0.1, 9))):
        if t >= d:
            break
        x = note(hz(15 + (k % 4) * 2), 0.04, 'square', 0.4, a=0.001, r=0.035)
        i = int(t * SR)
        roll[i:i + len(x)] += x[: len(roll) - i]
    reveal = [(d, bell(hz(31), 0.8, 0.8, tau=0.35)), (d, note(hz(19), 0.8, 'triangle', 0.5, r=0.7, bright=0.3))]
    return reverb(mix(d + 1.0, (0, roll), *reveal), 0.3, 0.8)


# ------------------------------------------------------------------
def write_wav(path, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    os.makedirs(OUT_MP3, exist_ok=True)
    os.makedirs(OUT_WAV, exist_ok=True)
    manifest = []
    for name, spec in SOUNDS.items():
        x = finish(spec['fn'](), spec['peak_db'])
        wav = os.path.join(OUT_WAV, f'{name}.wav')
        mp3 = os.path.join(OUT_MP3, f'{name}.mp3')
        write_wav(wav, x)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', str(SR),
                        '-codec:a', 'libmp3lame', '-b:a', '96k', '-map_metadata', '-1', mp3], check=True)
        manifest.append(dict(name=name, label=spec['label'], when=spec['when'],
                             durationMs=round(len(x) / SR * 1000), peakDb=spec['peak_db']))
        print(f'{name:18s} {len(x) / SR:5.2f}s  {os.path.getsize(mp3) / 1024:5.1f}KB')
    with open(os.path.join(OUT_WAV, 'manifest.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    return manifest


if __name__ == '__main__':
    sys.exit(0 if main() else 1)
