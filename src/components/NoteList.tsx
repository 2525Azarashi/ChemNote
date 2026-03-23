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
      try {
        const localNotes = JSON.parse(localStorage.getItem(`notes_${auth.currentUser!.uid}`) || '[]');
        localNotes.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotes(localNotes);
      } catch (error) {
        console.error("ノート取得エラー:", error);
      }
    };
    fetchNotes();
  }, []);

  // Simple function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-8 bg-[#FDFBF7] min-h-screen font-handwriting" style={{ backgroundImage: 'linear-gradient(#A9CCE3 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }}>
      <button onClick={onBack} className="flex items-center gap-2 text-[#2C3E50] font-bold">
        <ArrowLeft size={20} /> 戻る
      </button>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-6">個人ノート一覧</h2>
      <div className="space-y-4">
        {notes.map(note => (
          <div key={note.id} className="bg-white p-4 rounded-sm shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow transform hover:-rotate-1" onClick={() => onSelectNote(note)}>
            {(note.chapterTitle || note.questionIndex) && (
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {note.chapterTitle && (
                  <span className="bg-[#A9CCE3]/20 text-[#2C3E50] px-2 py-0.5 rounded text-[10px] font-bold border border-[#A9CCE3]/50">
                    {note.chapterTitle}
                  </span>
                )}
                {note.questionIndex && (
                  <span className="bg-[#F9E79F]/30 text-[#D35400] px-2 py-0.5 rounded text-[10px] font-bold border border-[#F5B041]/50">
                    第{note.questionIndex}問
                  </span>
                )}
              </div>
            )}
            <h3 className="font-bold text-[#2C3E50] truncate font-modern">{stripHtml(note.question)}</h3>
            <p className="text-sm text-gray-500 truncate mt-1">{note.memo || 'メモなし'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
