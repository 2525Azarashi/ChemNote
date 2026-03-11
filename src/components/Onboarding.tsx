import React, { useState, useEffect } from 'react';
import { signInWithPopup, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, provider, db } from '../firebase';
import { motion } from 'motion/react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<'login' | 'profile'>('login');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [stream, setStream] = useState('science');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // リダイレクト結果の確認
    getRedirectResult(auth).then(async (result) => {
      if (result) {
        await checkProfile(result.user);
      }
    }).catch((error) => {
      console.error("リダイレクトログインエラー:", error);
    });
  }, []);

  const checkProfile = async (user: any) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        onComplete();
      } else {
        setName(user.displayName || '');
        setStep('profile');
      }
    } catch (error: any) {
      console.error("checkProfile error:", error);
      if (error.code === 'permission-denied' || error.message?.includes('permission') || error.message?.includes('offline')) {
        alert("Firestoreデータベースへのアクセスが拒否されました。\nFirebaseコンソールで「Firestore Database」が作成されているか、また「ルール」タブで読み書きが許可されているか確認してください。\n\n詳細: " + error.message);
      } else {
        alert("プロフィールの確認中にエラーが発生しました。\n詳細: " + error.message);
      }
      // エラーでも一応プロフィール入力画面に進ませる（保存時に再度エラーになるが、原因切り分けのため）
      setName(user.displayName || '');
      setStep('profile');
    }
  };

  const handleLogin = async () => {
    console.log("Onboarding handleLogin called");
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("signInWithPopup success");
      await checkProfile(result.user);
    } catch (error: any) {
      console.error('ログインエラー:', error);
      console.log("error code:", error.code);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        alert("ポップアップがブロックされました。ブラウザの設定でポップアップを許可するか、右上のボタンからアプリを新しいタブで開いてください。");
      } else if (error.code !== 'permission-denied' && !error.message?.includes('permission')) {
        // FirestoreのエラーはcheckProfile内で処理されるため、ここではAuthのエラーのみアラートを出す
        alert("ログインに失敗しました。\nLINEやTwitterなどのアプリ内ブラウザではGoogleログインが制限されています。SafariやChromeなどの標準ブラウザで開き直してください。\n詳細: " + error.message);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        name,
        grade,
        stream,
        iconUrl: auth.currentUser.photoURL || ''
      });
      onComplete();
    } catch (error: any) {
      console.error('保存エラー:', error);
      alert("プロフィールの保存に失敗しました。\nFirestoreデータベースが作成されていないか、セキュリティルールで書き込みが拒否されています。\n\n詳細: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#FDFBF7] font-handwriting">
      {/* Notebook Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(transparent 95%, #A9CCE3 95%)', 
             backgroundSize: '100% 2rem' 
           }}>
      </div>
      
      <div className="bg-[#FDFBF7] p-8 rounded-3xl shadow-2xl border-4 border-white w-full max-w-md text-center relative z-10">
        {/* Notebook Rings */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-evenly py-8 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full border-4 border-[#BDC3C7] bg-[#ECF0F1] shadow-md"></div>
          ))}
        </div>

        {step === 'login' ? (
          <>
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">ようこそ！</h2>
            <p className="text-gray-600 mb-8">まずは Google アカウントでログインしてください。</p>
            <button
              onClick={handleLogin}
              className="w-full p-4 bg-[#2C3E50] text-white rounded-xl font-bold hover:bg-[#1B2631] transition-colors"
            >
              Google でログイン
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">プロフィール設定</h2>
            <div className="space-y-4 mb-8">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" className="w-full p-3 rounded-xl border-2 border-[#A9CCE3] bg-white" />
              <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="学年" className="w-full p-3 rounded-xl border-2 border-[#A9CCE3] bg-white" />
              <select value={stream} onChange={(e) => setStream(e.target.value)} className="w-full p-3 rounded-xl border-2 border-[#A9CCE3] bg-white">
                <option value="science">理系</option>
                <option value="humanities">文系</option>
                <option value="other">その他</option>
              </select>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="w-full p-4 bg-[#2C3E50] text-white rounded-xl font-bold hover:bg-[#1B2631] transition-colors"
            >
              {loading ? '保存中...' : '開始する'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
