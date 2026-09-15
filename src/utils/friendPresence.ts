import { onAuthStateChanged } from 'firebase/auth';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
/** Visible-tab heartbeat; stale sessions expire after 90 seconds. No public user listing. */
export function installFriendPresence() {
  const pulse = () => {
    const uid=auth.currentUser?.uid;
    // Let timestamps expire: a hidden tab must not mark another visible tab offline.
    if(!uid || !navigator.onLine || document.visibilityState !== 'visible')return;
    void updateDoc(doc(db,'friend_profiles',uid),{presenceActive:true,presenceAt:serverTimestamp()}).catch(()=>{});
  };
  const off=onAuthStateChanged(auth,()=>{pulse();});
  const timer=setInterval(()=>{if(document.visibilityState==='visible')pulse();},30000);
  document.addEventListener('visibilitychange',pulse);window.addEventListener('online',pulse);
  return()=>{off();clearInterval(timer);document.removeEventListener('visibilitychange',pulse);window.removeEventListener('online',pulse);};
}
