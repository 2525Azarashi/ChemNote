import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, provider } from '../firebase';

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
      <div className="flex items-center gap-4 p-2 bg-white rounded-lg shadow-sm border">
        <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full" />
        <div>
          <p className="text-sm font-bold">{user.displayName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <button onClick={handleLogout} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      Googleでログイン
    </button>
  );
}
