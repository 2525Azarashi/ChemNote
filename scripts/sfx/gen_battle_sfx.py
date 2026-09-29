"""
マナトビ 対戦用 効果音ジェネレーター（v2：勉強ゲーム向けに調整）
=============================================================
・アプリの見た目（淡いパステル）と BGM（tanjou.mp3：温かいエレピのローファイ／J-POP、ト長調）に合わせた
  木・マリンバ・カリンバ・ベル・エレピの音だけで作る（ゲーセン風の矩形波はやめた）。
・音程は BGM と同じト長調のペンタトニックにそろえる。
・何度も鳴る音（選択・相手の回答・刻み）はごく小さく、1試合1回の音（勝ち・段位）だけ華やかにする。
・不正解や負けで学習者を責めない（低くやわらかい音で、すぐ次の問題へ気持ちを切り替えられる）。
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


# ------------------------------------------------------------------
# 音色（v2：勉強アプリ向け）
#   アプリ画面は淡いパステル、BGM（tanjou.mp3）は温かいローファイ／J-POP（ト長調）。
#   → 矩形波・ノコギリ波のゲーセン音はやめ、マリンバ・カリンバ・木・ベル・柔らかい
#     エレピだけで作る。高域はローパスで丸め、耳に刺さらないようにする。
#   → 音程は BGM と同じ ト長調（G A B D E）のペンタトニックにそろえ、BGM と重なっても濁らない。
#   → 間違い・負けは「責める音」にしない（学習者がやめたくならないよう、やわらかく短く）。
# ------------------------------------------------------------------
G4, A4, B4, D5, E5 = -2, 0, 2, 5, 7
G5, A5, B5, D6, E6, G6, A6, B6, D7 = 10, 12, 14, 17, 19, 22, 24, 26, 29


def marimba(semi, dur=0.5, gain=1.0):
    f = hz(semi)
    n = int(dur * SR)
    x = osc(f, dur) * expdecay(n, dur * 0.35)
    x += 0.35 * osc(f * 4, dur) * expdecay(n, dur * 0.06)      # 木のアタック
    x += 0.12 * osc(f * 10, dur) * expdecay(n, 0.008)
    return lowpass(x * env(n, a=0.002, r=0.03) * gain, 6000)


def kalimba(semi, dur=0.6, gain=1.0):
    f = hz(semi)
    n = int(dur * SR)
    x = osc(f, dur) * expdecay(n, dur * 0.4)
    x += 0.25 * osc(f * 5.4, dur) * expdecay(n, 0.03)
    x += 0.1 * osc(f * 2, dur) * expdecay(n, dur * 0.2)
    return lowpass(x * env(n, a=0.002, r=0.05) * gain, 5000)


def epiano(semi, dur=0.8, gain=1.0):
    """Rhodes 風：正弦波＋2倍音、ゆっくり減衰（BGM のエレピに寄せる）"""
    f = hz(semi)
    n = int(dur * SR)
    mod = osc(f * 1.0, dur) * 1.2 * expdecay(n, 0.12)
    ph = 2 * np.pi * f * np.arange(n) / SR + mod
    x = np.sin(ph) * expdecay(n, dur * 0.45) + 0.15 * np.sin(2 * ph) * expdecay(n, dur * 0.2)
    return lowpass(x * env(n, a=0.004, r=0.1) * gain, 4500)


def chime(semi, dur=0.8, gain=1.0):
    return lowpass(bell(hz(semi), dur, gain, tau=dur * 0.35), 7000)


def wood(freq=900, dur=0.06, gain=1.0):
    """ウッドブロック（カウント・刻み用）"""
    n = int(dur * SR)
    x = osc(freq, dur) * expdecay(n, 0.012) + 0.4 * osc(freq * 2.7, dur) * expdecay(n, 0.005)
    x += 0.3 * bandpass(noise(dur), 800, 3000) * expdecay(n, 0.003)
    return x * env(n, a=0.0008, r=0.01) * gain


def arp(fn, notes, step, dur, gain=1.0, start=0.0):
    return [(start + i * step, fn(s, dur, gain)) for i, s in enumerate(notes)]


def soft_reverb(x, amount=0.18, length=0.6):
    return reverb(x, amount, length, damp=3500)


# ------------------------------------------------------------------
# 回答まわり（1試合に何十回も鳴る → 小さく・短く・疲れない）
# ------------------------------------------------------------------
@sfx('tap', '選択', '選択肢・ボタンを押した瞬間', -11)
def _tap():
    # 木の「コッ」＋ごく短い高域クリック（BGM の上でも指先に返る手応え）
    click = highpass(noise(0.006), 3500) * expdecay(int(0.006 * SR), 0.0012) * 0.5
    return mix(0.05, (0, wood(1200, 0.05)), (0, click))


@sfx('tick', 'カウント刻み', '数字のカウントアップ（XP・コイン）', -18)
def _tick():
    return wood(1800, 0.03)


@sfx('correct', '正解', '自分が正解した（ピンポン）', -4)
def _correct():
    # 「ピン↑ポン」：マリンバ D6→G6（BGM と同じ調）＋小さなきらめき
    ev = [(0, marimba(D6, 0.3, 0.9)), (0.09, marimba(G6, 0.42)), (0.09, chime(D7, 0.4, 0.16))]
    return highpass(soft_reverb(mix(0.55, *ev), 0.12, 0.35), 300)


@sfx('wrong', '不正解', '自分が不正解だった（責めない低い2音）', -9)
def _wrong():
    # ブッブーではなく、木琴の低い「ポコ…ポン」。次の問題へ気持ちを切り替えやすい音
    ev = [(0, marimba(B4, 0.25, 0.9)), (0.14, marimba(G4 - 1, 0.45, 0.8))]
    return lowpass(mix(0.65, *ev), 2500)


@sfx('timeup', '時間切れ', '答える前に制限時間が来た', -10)
def _timeup():
    ev = [(0, wood(700, 0.08)), (0.12, epiano(D5 - 12, 0.55, 0.8))]
    return lowpass(mix(0.7, *ev), 3000)


@sfx('combo', 'コンボ', '連続正解', -4)
def _combo():
    ev = arp(marimba, [G5, B5, D6, G6], 0.06, 0.35, 0.8)
    ev.append((0.2, chime(B6, 0.6, 0.18)))
    return soft_reverb(mix(0.9, *ev), 0.18, 0.6)


@sfx('opponent-answered', '相手が回答', '相手が答えた（ごく小さな合図）', -17)
def _opp_answered():
    return lowpass(kalimba(A5, 0.12, 0.8), 3000)


@sfx('opponent-correct', '相手が正解', '相手が正解した（自分の正解とは別の音色・控えめ）', -11)
def _opp_correct():
    # 自分の「ピンポン」（マリンバ・上行）と取り違えないよう、カリンバで 4度下・こもった音
    ev = [(0, kalimba(A4, 0.2, 0.8)), (0.08, kalimba(D5, 0.3, 0.8))]
    return lowpass(mix(0.4, *ev), 2200)


# ------------------------------------------------------------------
# 順位の変化
# ------------------------------------------------------------------
@sfx('overtake', '逆転！', '自分が相手を逆転した', -4)
def _overtake():
    ev = arp(marimba, [D5, G5, B5, D6], 0.045, 0.3, 0.7)
    ev += [(0.2, epiano(s, 0.7, 0.5)) for s in (G5, B5, D6)]
    ev.append((0.2, chime(G6, 0.7, 0.2)))
    return soft_reverb(mix(1.0, *ev), 0.2, 0.7)


@sfx('overtaken', '逆転された', '相手に逆転された（あせらせすぎない）', -11)
def _overtaken():
    ev = [(0, kalimba(D6, 0.25, 0.7)), (0.1, kalimba(B5, 0.25, 0.7)), (0.2, kalimba(E5, 0.45, 0.7))]
    return lowpass(mix(0.7, *ev), 3000)


@sfx('caught-up', '追いついた', '同点に追いついた', -8)
def _caught_up():
    return soft_reverb(mix(0.5, (0, marimba(B5, 0.25, 0.8)), (0.08, marimba(D6, 0.4, 0.8))), 0.12, 0.4)


# ------------------------------------------------------------------
# 試合の進行
# ------------------------------------------------------------------
@sfx('matched', 'マッチング成立', '相手が見つかった／部屋に入った', -5)
def _matched():
    ev = arp(chime, [G5, B5, D6, G6], 0.09, 0.9, 0.6)
    ev += [(0.3, epiano(s, 1.0, 0.4)) for s in (G4, D5, B5)]
    return soft_reverb(mix(1.4, *ev), 0.25, 0.8)


@sfx('countdown', 'カウントダウン', '試合開始前の 3・2・1', -9)
def _countdown():
    return mix(0.3, (0, wood(880, 0.07)), (0, 0.5 * marimba(D6, 0.25, 0.6)))


@sfx('start', 'START!', '試合開始', -3)
def _start():
    ev = [(0, marimba(G6, 0.6)), (0, epiano(G5, 0.8, 0.6)), (0, epiano(D6, 0.8, 0.5)), (0.02, chime(D7, 0.7, 0.25))]
    return soft_reverb(mix(0.9, *ev), 0.22, 0.6)


@sfx('hurry', '残り3秒', '残り3秒の刻み（1秒ごと）', -15)
def _hurry():
    return wood(620, 0.05)


@sfx('final', '最終問題', '最終問題の合図', -4)
def _final():
    ev = [(0, marimba(D5, 0.2)), (0.16, marimba(D5, 0.2)), (0.32, marimba(G5, 0.3))]
    ev += [(0.32, epiano(s, 0.7, 0.5)) for s in (D5, G5, B5, D6)]
    ev.append((0.34, chime(G6, 0.6, 0.2)))
    return soft_reverb(mix(1.1, *ev), 0.14, 0.45)


# ------------------------------------------------------------------
# 試合結果（1試合1回 → 少し華やかに。ただし 2 秒以内）
# ------------------------------------------------------------------
@sfx('win', '勝利', '試合に勝った', -2)
def _win():
    ev = arp(marimba, [G5, B5, D6, G6], 0.1, 0.4, 0.8)
    ev += [(0.42, epiano(s, 1.3, 0.55)) for s in (G4, D5, G5, B5, D6)]
    ev += arp(chime, [D7 - 12 + 12, G6 + 12 - 12, B6], 0.07, 0.9, 0.2, start=0.45)
    return soft_reverb(mix(2.0, *ev), 0.25, 0.9)


@sfx('lose', '敗北', '試合に負けた（おしい！ つぎいこう）', -8)
def _lose():
    # 悲しい短調の下降にはしない。「おしい！ つぎ いこう」— 軽く2音おりて、sus 和音で前向きに止める
    ev = [(0, kalimba(D6, 0.22, 0.8)), (0.13, kalimba(A5, 0.3, 0.8))]
    C5_ = 3  # C5（Gsus4 の4度）
    ev += [(0.3, epiano(s, 0.9, 0.4)) for s in (G4 - 12, G4, C5_, D5)]  # Gsus4
    return lowpass(soft_reverb(mix(1.3, *ev), 0.16, 0.6), 3500)


@sfx('draw', '引き分け', '同点で終わった', -6)
def _draw():
    ev = [(0, marimba(D6, 0.3, 0.8)), (0.2, marimba(D6, 0.3, 0.8)), (0.4, marimba(E6, 0.5, 0.8))]
    ev += [(0.4, epiano(s, 0.9, 0.45)) for s in (A4, D5, E5)]
    return soft_reverb(mix(1.4, *ev), 0.2, 0.7)


# ------------------------------------------------------------------
# 報酬・成長（ごほうび感はチャイム＝ベルで統一）
# ------------------------------------------------------------------
@sfx('coin', 'コイン', '報酬（XP・コイン）を受け取った', -7)
def _coin():
    return soft_reverb(mix(0.5, (0, chime(B6, 0.2, 0.7)), (0.06, chime(E6 + 12, 0.45, 0.8))), 0.1, 0.3)


@sfx('badge', '称号ゲット', '新しい称号・バッジを手に入れた', -4)
def _badge():
    ev = arp(chime, [G6, B6, D7], 0.08, 0.9, 0.6)
    ev += [(0.1, epiano(s, 1.0, 0.4)) for s in (G5, D6)]
    return soft_reverb(mix(1.3, *ev), 0.25, 0.8)


@sfx('levelup', 'レベルアップ', 'レベルが上がった', -3)
def _levelup():
    ev = arp(marimba, [G5, A5, B5, D6, E6, G6], 0.06, 0.35, 0.7)
    ev += [(0.38, epiano(s, 1.2, 0.5)) for s in (G4, D5, G5, B5)]
    ev += arp(chime, [G6, B6, D7], 0.06, 0.8, 0.2, start=0.4)
    return soft_reverb(mix(1.8, *ev), 0.25, 0.9)


@sfx('rankup', '段位アップ', '段位（ランク）が上がった', -2)
def _rankup():
    ev = arp(marimba, [D5, G5, B5, D6, G6], 0.07, 0.4, 0.7)
    ev += [(0.4, epiano(s, 1.5, 0.5)) for s in (G4 - 12, D5 - 12, G4, B4, D5, G5)]
    ev += arp(chime, [D6, G6, B6, D7], 0.08, 1.0, 0.25, start=0.42)
    return soft_reverb(mix(2.2, *ev), 0.3, 1.0)


@sfx('chest', '宝箱オープン', 'デイリー宝箱を開けた', -4)
def _chest():
    d = 0.3
    rise = lowpass(noise(d), np.geomspace(400, 6000, int(d * SR))) * np.linspace(0, 1, int(d * SR)) ** 2 * 0.25
    ev = [(0, rise)] + arp(chime, [G5, B5, D6, G6, B6], 0.05, 0.7, 0.4, start=0.28)
    return soft_reverb(mix(1.4, *ev), 0.22, 0.7)


@sfx('jackpot', '大当たり', '宝箱の大当たり（7日連続）', -2)
def _jackpot():
    d = 0.3
    rise = lowpass(noise(d), np.geomspace(400, 7000, int(d * SR))) * np.linspace(0, 1, int(d * SR)) ** 2 * 0.3
    ev = [(0, rise)] + arp(chime, [G5, B5, D6, G6, B6, D7, G6 + 12], 0.05, 0.8, 0.4, start=0.28)
    ev += [(0.55, epiano(s, 1.4, 0.45)) for s in (G4, D5, G5, B5, D6)]
    return soft_reverb(mix(2.2, *ev), 0.3, 1.0)


@sfx('gacha', 'ガチャ演出', 'ガチャの結果が出る', -4)
def _gacha():
    ev = []
    t = 0.0
    for k, gap in enumerate(np.geomspace(0.05, 0.12, 8)):
        ev.append((t, wood(1000 + (k % 2) * 250, 0.04, 0.7)))
        t += gap
    ev += [(t, chime(G6, 0.7, 0.7)), (t, epiano(G5, 0.7, 0.5)), (t, epiano(D6, 0.7, 0.4))]
    return soft_reverb(mix(t + 0.8, *ev), 0.18, 0.5)


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
