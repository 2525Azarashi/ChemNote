import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { LogIn, LogOut } from 'lucide-react';

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 認証状態の監視
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // UID保存処理
        localStorage.setItem("user_uid", currentUser.uid);
      } else {
        localStorage.removeItem("user_uid");
      }
    });
    return () => unsubscribe();
  }, []);

  // Googleログイン処理
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("ログインエラー:", error);
      alert("ログインに失敗しました。");
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-[#A9CCE3] font-handwriting">
        <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full border border-[#A9CCE3]" />
        <div className="hidden md:block">
          <p className="text-sm font-bold text-[#2C3E50]">{user.displayName}</p>
        </div>
        <button onClick={handleLogout} className="p-2 text-[#2C3E50] hover:bg-[#A9CCE3]/20 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin} 
      className="flex items-center gap-2 px-4 py-2 bg-[#A9CCE3]/20 text-[#2C3E50] rounded-full hover:bg-[#A9CCE3]/40 transition-all border border-[#A9CCE3] font-handwriting font-bold shadow-sm"
    >
      <LogIn size={18} />
      Googleでログイン
    </button>
  );
}
