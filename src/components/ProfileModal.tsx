import React, { useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import { signOut, signInWithPopup } from 'firebase/auth';
import { ChevronLeft, User, LogOut, Flame, BookOpen, GraduationCap, Compass, Settings, Volume2, VolumeX, LogIn, Users, Save } from 'lucide-react';
import { FriendPanel } from './FriendPanel';
import { DoorMascot } from './DoorMascot';

interface ProfileModalProps {
  onClose: () => void;
  isBgmEnabled: boolean;
  setIsBgmEnabled: (enabled: boolean) => void;
  onToggleBgm?: (enabled: boolean) => void;
  bgmVolume: number;
  setBgmVolume: (volume: number) => void;
}

type SettingsTab = 'general' | 'friends';

export function ProfileModal({ onClose, isBgmEnabled, setIsBgmEnabled, onToggleBgm, bgmVolume, setBgmVolume }: ProfileModalProps) {
  const [tab, setTab] = useState<SettingsTab>('general');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [stream, setStream] = useState('science');
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    try {
      const uid = auth.currentUser?.uid || 'guest';
      const localProfile = localStorage.getItem(`profile_${uid}`);
      if (localProfile) {
        const data = JSON.parse(localProfile);
        setName(data.name || '');
        setGrade(data.grade || '');
        setStream(data.stream || 'science');
      } else {
        setName(auth.currentUser?.displayName || (auth.currentUser ? 'ユーザー' : 'ゲスト'));
        setGrade('高校生');
      }
      setStreak(parseInt(localStorage.getItem(`streak_${uid}`) || '0', 10));
      setCompletedCount(JSON.parse(localStorage.getItem(`completed_${uid}`) || '[]').length);
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid || 'guest';
      localStorage.setItem(`profile_${uid}`, JSON.stringify({
        name: name.trim(), grade: grade.trim(), stream, iconUrl: auth.currentUser?.photoURL || '',
      }));
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
    const uid = auth.currentUser?.uid;
    await signOut(auth);
    if (uid) localStorage.removeItem(`profile_${uid}`);
    onClose();
  };

  const switchAccount = async () => {
    const uid = auth.currentUser?.uid;
    await signOut(auth);
    if (uid) localStorage.removeItem(`profile_${uid}`);
    await signInWithPopup(auth, provider);
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

        <div className="grid grid-cols-2 gap-1.5 bg-white/70 border border-gray-200 rounded-2xl p-1.5 mb-2 sm:mb-3 relative z-10 shrink-0">
          <button onClick={() => setTab('general')} className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${tab === 'general' ? 'bg-[#1B2631] text-white shadow-sm' : 'text-gray-500'}`}>
            <Settings size={14} /> 基本設定
          </button>
          <button onClick={() => setTab('friends')} disabled={!auth.currentUser} className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 ${tab === 'friends' ? 'bg-[#D9466E] text-white shadow-sm' : 'text-gray-500'}`}>
            <Users size={14} /> フレンド
          </button>
        </div>

        <main className="relative z-10 flex-1 min-h-0">
          {tab === 'friends' && auth.currentUser ? (
            <FriendPanel />
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
                    <button onClick={() => signInWithPopup(auth, provider)} className="compact-action bg-[#A9CCE3] text-white"><LogIn size={15} />Googleアカウントでログイン</button>
                  ) : (
                    <>
                      <p className="text-[10px] text-gray-400 truncate px-1">{auth.currentUser.email}</p>
                      <button onClick={logout} className="compact-action bg-red-50 text-red-600 border border-red-100"><LogOut size={15} />ログアウト</button>
                      <button onClick={switchAccount} className="compact-action bg-blue-50 text-blue-600 border border-blue-100"><LogIn size={15} />アカウントを切り替え</button>
                    </>
                  )}
                </section>

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
