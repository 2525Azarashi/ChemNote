import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { X, User } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [stream, setStream] = useState('science');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && auth.currentUser) {
      const fetchProfile = async () => {
        try {
          const localProfile = localStorage.getItem(`profile_${auth.currentUser!.uid}`);
          if (localProfile) {
            const data = JSON.parse(localProfile);
            setName(data.name || '');
            setGrade(data.grade || '');
            setStream(data.stream || 'science');
          }
        } catch (error) {
          console.error("プロフィール取得エラー:", error);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const profileData = {
        name,
        grade,
        stream,
        iconUrl: auth.currentUser.photoURL || ''
      };
      localStorage.setItem(`profile_${auth.currentUser.uid}`, JSON.stringify(profileData));
      onClose();
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#FDFBF7] p-6 rounded-3xl shadow-2xl border-4 border-white w-full max-w-md font-handwriting">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#2C3E50]">プロフィール編集</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#A9CCE3]/20 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前"
            className="w-full p-3 rounded-xl border-2 border-[#A9CCE3] bg-white"
          />
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="学年"
            className="w-full p-3 rounded-xl border-2 border-[#A9CCE3] bg-white"
          />
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-[#A9CCE3] bg-white"
          >
            <option value="science">理系</option>
            <option value="humanities">文系</option>
            <option value="other">その他</option>
          </select>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full p-3 bg-[#2C3E50] text-white rounded-xl font-bold hover:bg-[#1B2631] transition-colors"
          >
            {loading ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>
    </div>
  );
}
