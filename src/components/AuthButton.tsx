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
        alert("ログインに失敗しました。\nLINEやTwitterなどのアプリ内ブラウザではGoogleログインが制限されている場合があります。SafariやChromeなどの標準ブラウザで開き直してください。\n詳細: " + error.message);
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

  if (isLineBrowser) {
    return (
      <div className="bg-rose-100 text-rose-800 p-4 rounded-xl border border-rose-200 text-sm font-bold shadow-sm">
        LINEやアプリ内ブラウザではGoogleログインが制限されています。<br/>
        右上のメニューから「ブラウザで開く」を選択して、SafariやChromeで開き直してください。
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin} 
      className="flex items-center gap-2 px-4 py-2 rounded-full transition-all border font-handwriting font-bold shadow-sm bg-[#A9CCE3]/20 text-[#2C3E50] border-[#A9CCE3] hover:bg-[#A9CCE3]/40"
    >
      <LogIn size={18} />
      Googleでログイン
    </button>
  );
}
