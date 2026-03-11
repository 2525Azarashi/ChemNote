import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ArrowLeft, BookOpen, Trash2 } from 'lucide-react';

interface NoteListProps {
  onBack: () => void;
  onSelectNote: (note: any) => void;
}

export function NoteList({ onBack, onSelectNote }: NoteListProps) {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const fetchNotes = async () => {
      const q = query(collection(db, 'notes'), where('uid', '==', auth.currentUser!.uid), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setNotes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNotes();
  }, []);

  return (
    <div className="w-full space-y-6 p-4 md:p-8 bg-[#FDFBF7] min-h-screen font-handwriting" style={{ backgroundImage: 'linear-gradient(#A9CCE3 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }}>
      <button onClick={onBack} className="flex items-center gap-2 text-[#2C3E50] font-bold">
        <ArrowLeft size={20} /> 戻る
      </button>
      <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">個人ノート一覧</h2>
      <div className="space-y-4">
        {notes.map(note => (
          <div key={note.id} className="bg-white p-4 rounded-sm shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow transform hover:-rotate-1" onClick={() => onSelectNote(note)}>
            <h3 className="font-bold text-[#2C3E50] truncate">{note.question}</h3>
            <p className="text-sm text-gray-500 truncate">{note.memo || 'メモなし'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
