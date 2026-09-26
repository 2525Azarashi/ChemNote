import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAzgkmwE77KMWt2gY1ca63DmIa-dZA5CY",
  authDomain: "mntb-4ef06.firebaseapp.com",
  projectId: "mntb-4ef06",
  storageBucket: "mntb-4ef06.firebasestorage.app",
  messagingSenderId: "141618374149",
  appId: "1:141618374149:web:88ac37327017a08988de6c",
  measurementId: "G-2Y7TPE713M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

/**
 * ★通信方式の自動切り替え（experimentalAutoDetectLongPolling）★
 *
 * 学校・塾・会社の Wi-Fi やウイルス対策ソフトの中には、Firestore の
 * ストリーム通信（WebChannel）を途中で詰まらせるものがある。
 * その環境では「購読が届かない」「書き込みが返ってこない」ため、
 * 対戦のカウントダウンが始まらない・相手の解答が届かない、が起きていた。
 * 自動判定にしておくと、詰まる環境だけロングポーリングに切り替わる。
 * 普通の回線では従来どおりの方式のまま（遅くならない）。
 */
function createDb(): Firestore {
  try {
    return initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    // 開発時のホットリロードなどで二重に初期化された場合
    return getFirestore(app);
  }
}
export const db = createDb();
