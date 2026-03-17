import React, { useState, useEffect } from 'react';
import { signInWithPopup, getRedirectResult, signOut, onAuthStateChanged, User } from 'firebase/auth';
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
    
    // リダイレクト結果の確認
    getRedirectResult(auth).catch((error) => {
      console.error("リダイレクトログインエラー:", error);
    });

    return () => unsubscribe();
  }, []);

  // LINE内ブラウザやWebViewの検知
  const isLineBrowser = /Line\//i.test(navigator.userAgent) || /wv/i.test(navigator.userAgent) || /WebView/i.test(navigator.userAgent);

  // Googleログイン処理
  const handleLogin = async () => {
    if (isLineBrowser) {
      alert("LINE内ブラウザではGoogleログインが正しく動作しません。\n右上のメニューボタンから「ブラウザで開く」を選択して、SafariやChromeで開き直してください。");
      return;
    }
    
    console.log("handleLogin called");
    try {
      await signInWithPopup(auth, provider);
      console.log("signInWithPopup success");
    } catch (error: any) {
      console.error("ログインエラー:", error);
      console.log("error code:", error.code);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        alert("ポップアップがブロックされました。ブラウザの設定でポップアップを許可するか、右上のボタンからアプリを新しいタブで開いてください。");
      } else {
        alert("ログインに失敗しました。\nLINEやTwitterなどのアプリ内ブラウザではGoogleログインが制限されています。SafariやChromeなどの標準ブラウザで開き直してください。\n詳細: " + error.message);
      }
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
    return null;
  }

  return (
    <button 
      onClick={handleLogin} 
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border font-handwriting font-bold shadow-sm ${
        isLineBrowser 
          ? "bg-[#D9A0A0]/20 text-[#2C3E50] border-[#D9A0A0] hover:bg-[#D9A0A0]/40" 
          : "bg-[#A9CCE3]/20 text-[#2C3E50] border-[#A9CCE3] hover:bg-[#A9CCE3]/40"
      }`}
    >
      <LogIn size={18} />
      {isLineBrowser ? "標準ブラウザでログイン" : "Googleでログイン"}
    </button>
  );
}
