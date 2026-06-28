import React, { useEffect, useState } from 'react';
import { Check, Copy, RefreshCw, Send, UserPlus, X } from 'lucide-react';
import {
  acceptFriendRequest,
  ensureFriendProfile,
  fetchFriendRequests,
  fetchFriends,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
  type FriendProfile,
  type FriendRequest,
} from '../utils/friends';
import { auth } from '../firebase';

export function FriendPanel() {
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Array<{ uid: string; nickname: string; photoURL?: string }>>([]);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const p = await ensureFriendProfile();
      setProfile(p);
      const [reqs, list] = await Promise.all([fetchFriendRequests(), fetchFriends()]);
      setRequests(reqs);
      setFriends(list);
    } catch (e: any) {
      setMessage(e?.message || 'フレンド情報の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!auth.currentUser) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <UserPlus size={15} />
          <span>フレンド</span>
        </h3>
        <button
          onClick={load}
          disabled={loading}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-150 transition-colors"
          aria-label="フレンド情報を更新"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-[#FDFBF7] border border-[#F0C7D2]/70 rounded-2xl p-4">
        <p className="text-[11px] text-gray-500 font-bold mb-2">あなたのフレンドコード</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-white border border-gray-150 rounded-xl px-3 py-2 text-sm font-black tracking-wider text-[#1B2631]">
            {profile ? profile.friendCode : (loading ? '発行中…' : '—')}
          </code>
          <button
            onClick={() => {
              if (!profile?.friendCode) return;
              navigator.clipboard?.writeText(profile.friendCode);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
            disabled={!profile?.friendCode}
            className="p-2.5 rounded-xl bg-[#A9CCE3]/20 text-[#2C3E50] hover:bg-[#A9CCE3]/35 border border-[#A9CCE3]/40 disabled:opacity-40"
            aria-label="フレンドコードをコピー"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 leading-snug">
          このコードを友だちに伝えると、相手があなたを追加できます。
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="MNTB-XXXX-XXXX"
          className="flex-1 px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#A9CCE3] outline-none text-sm font-bold"
        />
        <button
          onClick={async () => {
            setMessage('');
            setLoading(true);
            try {
              setMessage(await sendFriendRequest(code));
              setCode('');
            } catch (e: any) {
              setMessage(e?.message || '申請に失敗しました。');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="px-4 py-3 rounded-xl bg-[#2C3E50] text-white font-bold hover:bg-[#1B2631] disabled:opacity-50 flex items-center gap-2"
        >
          <Send size={14} />
          申請
        </button>
      </div>

      {message && <p className="text-xs font-bold text-[#2C3E50] bg-blue-50 border border-blue-100 rounded-xl p-3">{message}</p>}

      {requests.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] text-gray-400 font-bold">届いている申請</p>
          {requests.map((req) => (
            <div key={req.id} className="flex items-center gap-3 bg-[#F9E79F]/15 border border-[#F9E79F]/50 rounded-2xl p-3">
              <Avatar name={req.fromNickname} url={req.fromPhotoURL} />
              <span className="flex-1 text-sm font-bold text-[#1B2631] truncate">{req.fromNickname}</span>
              <button onClick={async () => { await acceptFriendRequest(req); await load(); }} className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100"><Check size={15} /></button>
              <button onClick={async () => { await rejectFriendRequest(req); await load(); }} className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100"><X size={15} /></button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[11px] text-gray-400 font-bold">フレンド一覧</p>
        {friends.length === 0 ? (
          <p className="text-xs text-gray-400 bg-gray-50 rounded-2xl p-4 text-center">まだフレンドはいません。コードで追加してみましょう。</p>
        ) : (
          friends.map((f) => (
            <div key={f.uid} className="flex items-center gap-3 bg-gray-50 border border-gray-150 rounded-2xl p-3">
              <Avatar name={f.nickname} url={f.photoURL} />
              <span className="flex-1 text-sm font-bold text-[#1B2631] truncate">{f.nickname}</span>
              <button onClick={async () => { await removeFriend(f.uid); await load(); }} className="text-xs font-bold text-red-500 hover:underline">解除</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Avatar({ name, url }: { name: string; url?: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-white border border-gray-150 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
      {url ? <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : name.slice(0, 1)}
    </div>
  );
}
