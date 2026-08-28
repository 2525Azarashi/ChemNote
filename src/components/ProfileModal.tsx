import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { ChevronLeft, User, LogOut, Flame, BookOpen, GraduationCap, Compass, Settings, Volume2, VolumeX, LogIn, Users, Save, Check, Loader2, AlertTriangle, School, ClipboardList } from 'lucide-react';
import { FriendPanel } from './FriendPanel';
import { ClassPanel } from './ClassPanel';
import { DoorMascot } from './DoorMascot';
import { GoogleMark } from './GoogleLinkBanner';
import { signInWithGoogle, signOutGoogle, switchGoogleAccount, GOOGLE_LINK_BENEFITS } from '../utils/googleAuth';
import { isFeedbackAdmin } from '../utils/feedbackReply';
import { syncRankingNickname } from '../utils/leaderboard';
import { ensureFriendProfile } from '../utils/friends';
// ユーザーごとの localStorage キー名は utils/userStorageKeys.ts が唯一の定義
import { profileKey, streakKey, completedKey } from '../utils/userStorageKeys';

interface ProfileModalProps {
  onClose: () => void;
  isBgmEnabled: boolean;
  setIsBgmEnabled: (enabled: boolean) => void;
  onToggleBgm?: (enabled: boolean) => void;
  bgmVolume: number;
  setBgmVolume: (volume: number) => void;
  /**
   * 先生ダッシュボードを開く。
   *
   * → なぜホームでなく設定の下に置くのか：
   *   利用者の大半は生徒であり、先生用の入口を目立つ位置に置くと
   *   「自分の成績が見られる画面」と誤解されやすい。
   *   先生は設定を探すことを苦にしないので、ここに置く。
   */
  onOpenTeacherDashboard?: () => void;
  /**
   * フィードバック管理画面（運営専用）を開く。
   * 運営メールでログインしているときだけボタンを出す。
   * （万一開いても Firestore ルールが読み取りを拒否する）
   */
  onOpenFeedbackAdmin?: () => void;
}

type SettingsTab = 'general' | 'friends' | 'class';

export function ProfileModal({ onClose, isBgmEnabled, setIsBgmEnabled, onToggleBgm, bgmVolume, setBgmVolume, onOpenTeacherDashboard, onOpenFeedbackAdmin }: ProfileModalProps) {
  const [tab, setTab] = useState<SettingsTab>('general');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [stream, setStream] = useState('science');
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  /** Google 連携の進行状態（連携／切り替えのどちらでも使う） */
  const [signing, setSigning] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const uid = auth.currentUser?.uid || 'guest';
      const localProfile = localStorage.getItem(profileKey(uid));
      if (localProfile) {
        const data = JSON.parse(localProfile);
        setName(data.name || '');
        setGrade(data.grade || '');
        setStream(data.stream || 'science');
      } else {
        setName(auth.currentUser?.displayName || (auth.currentUser ? 'ユーザー' : 'ゲスト'));
        setGrade('高校生');
      }
      setStreak(parseInt(localStorage.getItem(streakKey(uid)) || '0', 10));
      setCompletedCount(JSON.parse(localStorage.getItem(completedKey(uid)) || '[]').length);
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid || 'guest';
      localStorage.setItem(profileKey(uid), JSON.stringify({
        name: name.trim(), grade: grade.trim(), stream, iconUrl: auth.currentUser?.photoURL || '',
      }));
      // 名前を変えたら、ランキング・フレンド検索の表示名もその場で最新化する。
      // これまでは「次にスコアを出すまで」旧名のままで、
      // 「プロフィールを変えたのにランキングが変わらない」と混乱させていた。
      // 通信失敗しても保存自体は成功として扱う（次回ログイン時に再同期される）。
      if (auth.currentUser) {
        void syncRankingNickname().catch(() => {});
        void ensureFriendProfile().catch(() => {});
      }
      onClose();
    } catch (error) {
      console.error('保存エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBgm = () => {
    const next = !isBgmEnabled;
    if (onToggleBgm) onToggleBgm(next);
    else setIsBgmEnabled(next);
  };

  const logout = async () => {
    await signOutGoogle();
    onClose();
  };

  /** ゲスト → Google 連携（記録はローカルに残るのでそのまま引き継がれる） */
  const linkGoogle = async () => {
    setSigning(true);
    setAuthError(null);
    const outcome = await signInWithGoogle();
    if (outcome.redirecting) return; // ページ遷移するのでそのまま待つ
    setSigning(false);
    if (!outcome.ok) setAuthError(outcome.message || 'ログインに失敗しました。');
  };

  const switchAccount = async () => {
    setSigning(true);
    setAuthError(null);
    const outcome = await switchGoogleAccount();
    if (outcome.redirecting) return;
    setSigning(false);
    if (!outcome.ok) setAuthError(outcome.message || 'ログインに失敗しました。');
  };

  return (
    <div className="w-full h-[100dvh] bg-[#FDFBF7] font-handwriting overflow-hidden pb-20 sm:pb-24">
      <div className="max-w-4xl h-full mx-auto px-3 sm:px-5 py-3 sm:py-5 flex flex-col relative">
        <div className="absolute top-4 right-8 w-40 h-40 bg-[#A9CCE3]/15 rounded-full blur-3xl pointer-events-none" />

        <header className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 relative z-10 shrink-0">
          <button onClick={onClose} className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl shadow-sm" aria-label="設定を閉じる">
            <ChevronLeft size={19} />
          </button>
          <div className="w-8 h-8 rounded-xl bg-[#2C3E50]/5 text-[#2C3E50] flex items-center justify-center"><Settings size={17} /></div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1B2631]">アプリ設定</h2>
          <DoorMascot showSpeech={false} size="mini" className="w-auto ml-auto -my-2" />
        </header>

        <div className="grid grid-cols-3 gap-1.5 bg-white/70 border border-gray-200 rounded-2xl p-1.5 mb-2 sm:mb-3 relative z-10 shrink-0">
          <button onClick={() => setTab('general')} className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${tab === 'general' ? 'bg-[#1B2631] text-white shadow-sm' : 'text-gray-500'}`}>
            <Settings size={14} /> 基本設定
          </button>
          <button onClick={() => setTab('friends')} disabled={!auth.currentUser} className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 ${tab === 'friends' ? 'bg-[#D9466E] text-white shadow-sm' : 'text-gray-500'}`}>
            <Users size={14} /> フレンド
          </button>
          <button onClick={() => setTab('class')} disabled={!auth.currentUser} className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 ${tab === 'class' ? 'bg-[#4A7FA0] text-white shadow-sm' : 'text-gray-500'}`}>
            <School size={14} /> クラス
          </button>
        </div>

        <main className="relative z-10 flex-1 min-h-0">
          {tab === 'friends' && auth.currentUser ? (
            <FriendPanel />
          ) : tab === 'class' && auth.currentUser ? (
            <div className="h-full overflow-y-auto no-scrollbar pb-4">
              <ClassPanel defaultDisplayName={name} />

              {/* 先生用の入口。生徒が誤って開いてもクラス0件の案内が出るだけ。 */}
              {onOpenTeacherDashboard && (
                <button
                  onClick={onOpenTeacherDashboard}
                  className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#4A7FA0]"
                >
                  <ClipboardList size={14} />
                  先生の方はこちら（クラスの管理）
                </button>
              )}
            </div>
          ) : (
            <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 overflow-y-auto md:overflow-hidden no-scrollbar">
              <div className="space-y-2 sm:space-y-3">
                <section className="bg-white border border-gray-150 p-3 rounded-2xl shadow-sm">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">学習状況</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Stat icon={<Flame size={15} />} label="継続" value={`${streak}日`} color="text-[#D35400]" bg="bg-[#F9E79F]/20" />
                    <Stat icon={<BookOpen size={15} />} label="修了" value={`${completedCount}章`} color="text-[#27AE60]" bg="bg-[#A4D4AE]/15" />
                  </div>
                </section>

                <section className="bg-white border border-gray-150 p-3 rounded-2xl shadow-sm space-y-2">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">プロフィール</h3>
                  <CompactField icon={<User size={15} />}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="ニックネーム" className="compact-input" /></CompactField>
                  <CompactField icon={<GraduationCap size={15} />}><input value={grade} onChange={(event) => setGrade(event.target.value)} placeholder="学年（例：高校1年）" className="compact-input" /></CompactField>
                  <CompactField icon={<Compass size={15} />}>
                    <select value={stream} onChange={(event) => setStream(event.target.value)} className="compact-input appearance-none cursor-pointer">
                      <option value="science">理系（化学・物理など）</option>
                      <option value="humanities">文系（社会・国語など）</option>
                      <option value="other">その他</option>
                    </select>
                  </CompactField>
                </section>
              </div>

              <div className="space-y-2 sm:space-y-3 flex flex-col">
                <section className="bg-white border border-gray-150 p-3 rounded-2xl shadow-sm space-y-2">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">サウンド</h3>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isBgmEnabled ? 'bg-[#A9CCE3]/25 text-[#2C3E50]' : 'bg-gray-200 text-gray-400'}`}>
                      {isBgmEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </div>
                    <div className="flex-1"><p className="text-xs font-bold">バックグラウンドBGM</p><p className="text-[10px] text-gray-400">学習中の自動再生</p></div>
                    <button type="button" onClick={toggleBgm} role="switch" aria-checked={isBgmEnabled} className={`relative h-6 w-11 rounded-full transition-colors ${isBgmEnabled ? 'bg-[#A9CCE3]' : 'bg-gray-200'}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isBgmEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  {isBgmEnabled && (
                    <div className="flex items-center gap-2 px-1">
                      <VolumeX size={14} className="text-gray-400" />
                      <input aria-label="BGM音量" type="range" min="0" max="1" step="0.01" value={bgmVolume} onChange={(event) => setBgmVolume(parseFloat(event.target.value))} className="flex-1 accent-[#A9CCE3]" />
                      <span className="w-9 text-right text-[10px] font-bold text-[#5D6D7E]">{Math.round(bgmVolume * 100)}%</span>
                    </div>
                  )}
                </section>

                <section className="bg-white border border-gray-150 p-3 rounded-2xl shadow-sm space-y-2 flex-1">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">アカウント</h3>
                  {!auth.currentUser ? (
                    /* 未連携：連携の「得」を具体的に見せてから押してもらう。
                       ボタンは Google のブランドガイドに近い白地＋Gマークで、
                       「見慣れた形」にして心理的なハードルを下げる。 */
                    <div className="space-y-2">
                      <div className="rounded-xl bg-[#FBE0E9]/40 border border-[#F4A9C4]/50 p-2.5">
                        <p className="text-[11px] font-bold text-[#1B2631] mb-1.5">Google アカウントと連携すると</p>
                        <ul className="space-y-1">
                          {GOOGLE_LINK_BENEFITS.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-1.5 text-[10px] text-[#5D6D7E] leading-snug">
                              <Check size={13} className="shrink-0 mt-[1px] text-[#D9466E]" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={linkGoogle}
                        disabled={signing}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-gray-300 text-[#1B2631] text-xs font-bold shadow-sm disabled:opacity-50"
                      >
                        {signing ? <Loader2 size={15} className="animate-spin" /> : <GoogleMark size={17} />}
                        {signing ? '連携中…' : 'Google アカウントで連携'}
                      </button>
                      <p className="text-[9px] text-gray-400 text-center leading-snug">
                        連携は無料です。いまの学習記録はそのまま引き継がれます。
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-[10px] text-gray-400 truncate px-1">{auth.currentUser.email}</p>
                      {/* 運営専用：フィードバック管理（返信フォーム）への入口。
                          運営メールでログインしているときだけ見える。 */}
                      {onOpenFeedbackAdmin && isFeedbackAdmin(auth.currentUser) && (
                        <button onClick={onOpenFeedbackAdmin} className="compact-action bg-[#FBE0E9]/60 text-[#D9466E] border border-[#F4A9C4]/60">
                          <ClipboardList size={15} />フィードバック管理（返信）
                        </button>
                      )}
                      <button onClick={logout} disabled={signing} className="compact-action bg-red-50 text-red-600 border border-red-100 disabled:opacity-50"><LogOut size={15} />ログアウト</button>
                      <button onClick={switchAccount} disabled={signing} className="compact-action bg-blue-50 text-blue-600 border border-blue-100 disabled:opacity-50">
                        {signing ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
                        {signing ? '切り替え中…' : 'アカウントを切り替え'}
                      </button>
                    </>
                  )}
                  {authError && (
                    <div role="alert" className="flex items-start gap-1.5 rounded-xl bg-[#FDEDEC] border border-[#E74C3C]/40 px-2.5 py-2 text-[10px] leading-snug text-[#C0392B]">
                      <AlertTriangle size={14} className="shrink-0 mt-[1px]" />
                      <span>{authError}</span>
                    </div>
                  )}
                </section>

                {/* ※「お問い合わせの送信状態」の欄は廃止した。
                    送信に失敗した分は localStorage のキューに残り、
                    App.tsx の起動時・オンライン復帰時に自動で再送されるため、
                    利用者が手動で診断・復旧操作をする必要がない。 */}

                <div className="grid grid-cols-[1fr_2fr] gap-2 shrink-0">
                  <button onClick={onClose} className="py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-500">キャンセル</button>
                  <button onClick={handleSave} disabled={loading || !name.trim()} className="py-2.5 rounded-xl bg-[#2C3E50] text-white text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1.5"><Save size={14} />{loading ? '保存中…' : '設定を保存'}</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string; color: string; bg: string }) {
  return <div className={`${bg} rounded-xl p-2 flex items-center gap-2`}><span className={color}>{icon}</span><div><p className="text-[9px] text-gray-500 font-bold">{label}</p><p className="text-base font-bold text-[#1B2631] leading-tight">{value}</p></div></div>;
}

function CompactField({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <div className="relative flex items-center rounded-xl border border-gray-200 bg-gray-50"><span className="absolute left-3 text-gray-400 pointer-events-none">{icon}</span>{children}</div>;
}
