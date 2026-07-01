import React, { useState, useEffect } from 'react';
import { auth, provider } from '../firebase';
import { signOut, signInWithPopup } from 'firebase/auth';
import { ChevronLeft, User, LogOut, Flame, BookOpen, GraduationCap, Compass, Settings, Volume2, VolumeX, LogIn } from 'lucide-react';
import { FriendPanel } from './FriendPanel';

interface ProfileModalProps {
  onClose: () => void;
  isBgmEnabled: boolean;
  setIsBgmEnabled: (enabled: boolean) => void;
  // iOS 対策: ユーザー操作と同一スタックで直接再生/停止するためのコールバック
  onToggleBgm?: (enabled: boolean) => void;
  bgmVolume: number;
  setBgmVolume: (volume: number) => void;
}

export function ProfileModal({ onClose, isBgmEnabled, setIsBgmEnabled, onToggleBgm, bgmVolume, setBgmVolume }: ProfileModalProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [stream, setStream] = useState('science');
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchProfile = () => {
      try {
        const uid = auth.currentUser ? auth.currentUser.uid : 'guest';
        
        // Load profile details
        const localProfile = localStorage.getItem(`profile_${uid}`);
        if (localProfile) {
          const data = JSON.parse(localProfile);
          setName(data.name || '');
          setGrade(data.grade || '');
          setStream(data.stream || 'science');
        } else {
          setName(auth.currentUser ? (auth.currentUser.displayName || 'ユーザー') : 'ゲスト');
          setGrade('高校生');
          setStream('science');
        }

        // Load stats
        const storedStreak = parseInt(localStorage.getItem(`streak_${uid}`) || '0', 10);
        setStreak(storedStreak);

        const completed = JSON.parse(localStorage.getItem(`completed_${uid}`) || '[]');
        setCompletedCount(completed.length);
      } catch (error) {
        console.error("プロフィール取得エラー:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser ? auth.currentUser.uid : 'guest';
      const profileData = {
        name,
        grade,
        stream,
        iconUrl: auth.currentUser?.photoURL || ''
      };
      localStorage.setItem(`profile_${uid}`, JSON.stringify(profileData));
      onClose();
    } catch (error) {
      console.error('保存エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] font-modern pb-32">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-8 relative">
        {/* Background Decor */}
        <div className="absolute top-10 right-4 w-40 h-40 bg-[#A9CCE3]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 left-4 w-48 h-48 bg-[#F9E79F]/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <button 
            onClick={onClose} 
            className="p-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl transition-all shadow-sm cursor-pointer"
            title="戻る"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2C3E50]/5 text-[#2C3E50] flex items-center justify-center shadow-xs">
              <Settings size={18} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1B2631]">アプリ設定</h2>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Stats Summary Section */}
          <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">学習状況</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F9E79F]/20 border border-[#FDFBF7] p-4 rounded-2xl flex flex-col items-center text-center shadow-xs">
                <div className="flex items-center gap-1.5 text-[#D35400] font-bold text-xs uppercase tracking-wider mb-2">
                  <Flame size={15} />
                  <span>学習継続日数</span>
                </div>
                <p className="text-3xl font-bold text-[#1B2631] font-handwriting">{streak} <span className="text-xs font-modern">日</span></p>
              </div>

              <div className="bg-[#A4D4AE]/15 border border-[#FDFBF7] p-4 rounded-2xl flex flex-col items-center text-center shadow-xs">
                <div className="flex items-center gap-1.5 text-[#27AE60] font-bold text-xs uppercase tracking-wider mb-2">
                  <BookOpen size={15} />
                  <span>修了ユニット数</span>
                </div>
                <p className="text-3xl font-bold text-[#1B2631] font-handwriting">{completedCount} <span className="text-xs font-modern">章</span></p>
              </div>
            </div>
          </div>

          {/* User Info Fields */}
          <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">プロフィール設定</h3>
            
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={16} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ニックネーム"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white shadow-xs focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all text-sm font-bold"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <GraduationCap size={16} />
              </div>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="学年（例：高校1年 など）"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white shadow-xs focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all text-sm font-bold"
              />
            </div>

            <div className="relative border-gray-200 border rounded-xl overflow-hidden shadow-xs bg-gray-50">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Compass size={16} />
              </div>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
              >
                <option value="science">理系（化学・物理など）</option>
                <option value="humanities">文系（社会・国語など）</option>
                <option value="other">その他</option>
              </select>
            </div>
          </div>

          {auth.currentUser && <FriendPanel />}

          {/* Sound & Music Settings */}
          <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>一般・サウンド設定</span>
            </h3>
            
            <div className="flex items-center justify-between bg-gray-50/50 border border-gray-150 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-xs ${isBgmEnabled ? 'bg-[#A9CCE3]/20 text-[#2C3E50]' : 'bg-gray-100 text-gray-400'}`}>
                  {isBgmEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2C3E50]">バックグラウンドBGM</p>
                  <p className="text-xs text-gray-400">学習中のBGMの自動再生</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  const next = !isBgmEnabled;
                  // onToggleBgm がある場合は、そのハンドラ内で state 更新と再生を
                  // ユーザー操作と同一スタックで実行する（iOS の再生制限対策）。
                  if (onToggleBgm) {
                    onToggleBgm(next);
                  } else {
                    setIsBgmEnabled(next);
                  }
                }}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#A9CCE3]/50 ${isBgmEnabled ? 'bg-[#A9CCE3]' : 'bg-gray-200'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isBgmEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>

            {/* BGM Volume Slider */}
            {isBgmEnabled && (
              <div className="bg-gradient-to-r from-[#A9CCE3]/5 to-[#F9E79F]/5 border border-[#A9CCE3]/20 p-4 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#2C3E50]">
                    音量
                  </label>
                  <span className="text-sm font-bold text-[#A9CCE3]">
                    {Math.round(bgmVolume * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <VolumeX size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={bgmVolume}
                    onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#A9CCE3]"
                    style={{
                      backgroundImage: `linear-gradient(to right, #A9CCE3 0%, #A9CCE3 ${bgmVolume * 100}%, #E5E7EB ${bgmVolume * 100}%, #E5E7EB 100%)`
                    }}
                  />
                  <Volume2 size={16} className="text-[#A9CCE3] flex-shrink-0" />
                </div>
              </div>
            )}
          </div>

          {/* Save/Submit Actions */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 px-4 transform hover:-translate-y-0.5 border border-gray-200 bg-white text-gray-500 rounded-2xl font-bold hover:bg-gray-50 hover:text-gray-700 transition-all text-sm shadow-sm cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-[#2] py-3.5 px-4 transform hover:-translate-y-0.5 bg-[#2C3E50] text-white rounded-2xl font-bold hover:bg-[#1B2631] transition-all text-sm shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#2C3E50]/30 disabled:opacity-50 cursor-pointer"
            >
              {loading ? '保存中...' : '設定を保存'}
            </button>
          </div>
          
          {/* Authentication Section */}
          <div className="pt-4 border-t border-gray-150 mt-6 font-modern space-y-3">
            {!auth.currentUser ? (
              <button
                onClick={async () => {
                  try {
                    await signInWithPopup(auth, provider);
                  } catch (error) {
                    console.error('ログインエラー:', error);
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#A9CCE3] to-[#85B8D8] text-white border border-[#A9CCE3] hover:border-[#85B8D8] rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                <LogIn size={16} />
                Googleアカウントでログイン
              </button>
            ) : (
              <>
                <button
                  onClick={async () => {
                    try {
                      await signOut(auth);
                      // Reset profile on logout
                      localStorage.removeItem(`profile_${auth.currentUser?.uid}`);
                      onClose();
                    } catch (error) {
                      console.error('ログアウトエラー:', error);
                    }
                  }}
                  className="w-full py-3.5 bg-red-50 text-red-600 border border-red-100 hover:border-red-200 rounded-2xl font-bold hover:bg-red-100/50 transition-all flex items-center justify-center gap-2 text-sm shadow-xs cursor-pointer"
                >
                  <LogOut size={16} />
                  ログアウト
                </button>
                <button
                  onClick={async () => {
                    try {
                      await signOut(auth);
                      localStorage.removeItem(`profile_${auth.currentUser?.uid}`);
                      // Sign in with a different account
                      await signInWithPopup(auth, provider);
                    } catch (error) {
                      console.error('アカウント切り替えエラー:', error);
                    }
                  }}
                  className="w-full py-3.5 bg-blue-50 text-blue-600 border border-blue-100 hover:border-blue-200 rounded-2xl font-bold hover:bg-blue-100/50 transition-all flex items-center justify-center gap-2 text-sm shadow-xs cursor-pointer"
                >
                  <LogIn size={16} />
                  アカウントを切り替え
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
