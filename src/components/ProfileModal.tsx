import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { X, User, LogOut, Flame, BookOpen, GraduationCap, Compass } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [stream, setStream] = useState('science');
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

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
      alert('保存に失敗しました。');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FDFBF7] p-6 rounded-[28px] shadow-2xl border-2 border-gray-200/50 w-full max-w-md font-modern relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#A9CCE3]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#F9E79F]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2C3E50]/5 text-[#2C3E50] flex items-center justify-center">
              <User size={18} />
            </div>
            <h2 className="text-xl font-bold text-[#1B2631]">プロフィール確認・設定</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Stats Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F9E79F]/30 border border-[#FDFBF7] p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <div className="flex items-center gap-1 text-[#D35400] font-bold text-[11px] uppercase tracking-wider mb-1">
                <Flame size={14} />
                <span>学習継続</span>
              </div>
              <p className="text-2xl font-bold text-[#1B2631] font-handwriting">{streak} <span className="text-xs font-modern">日</span></p>
            </div>

            <div className="bg-[#A4D4AE]/20 border border-[#FDFBF7] p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <div className="flex items-center gap-1 text-[#27AE60] font-bold text-[11px] uppercase tracking-wider mb-1">
                <BookOpen size={14} />
                <span>修了章数</span>
              </div>
              <p className="text-2xl font-bold text-[#1B2631] font-handwriting">{completedCount} <span className="text-xs font-modern">章</span></p>
            </div>
          </div>

          {/* User Info Fields */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={16} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ニックネーム"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all text-sm"
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all text-sm"
              />
            </div>

            <div className="relative border-gray-200 border rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Compass size={16} />
              </div>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white outline-none transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="science">理系（化学・物理など）</option>
                <option value="humanities">文系（社会・国語など）</option>
                <option value="other">その他</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-[#2C3E50] text-white rounded-xl font-bold hover:bg-[#1B2631] transition-all text-sm shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#2C3E50]/30 disabled:opacity-50"
            >
              {loading ? '保存中...' : '変更を保存'}
            </button>
          </div>
          
          {auth.currentUser && (
            <div className="pt-4 border-t border-gray-150 mt-4">
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100/50 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <LogOut size={16} />
                ログアウト
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
