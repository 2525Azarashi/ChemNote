import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const db = getFirestore(app);
