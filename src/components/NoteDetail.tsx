import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { formatText } from '../utils/textFormatter';

interface NoteDetailProps {
  note: any;
  onBack: () => void;
}

export function NoteDetail({ note, onBack }: NoteDetailProps) {
  const [memo, setMemo] = useState(note.memo || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'notes', note.id), { memo });
      alert('メモを保存しました！');
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      await deleteDoc(doc(db, 'notes', note.id));
      onBack();
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました。');
    }
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-8 bg-[#FDFBF7] min-h-screen font-handwriting">
      <button onClick={onBack} className="flex items-center gap-2 text-[#2C3E50] font-bold">
        <ArrowLeft size={20} /> 戻る
      </button>
      
      {/* Original Note UI */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#A9CCE3] space-y-4">
        {(note.chapterTitle || note.questionIndex) && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {note.chapterTitle && (
              <span className="bg-[#A9CCE3]/20 text-[#2C3E50] px-3 py-1 rounded-full text-xs font-bold border border-[#A9CCE3]/50">
                {note.chapterTitle}
              </span>
            )}
            {note.questionIndex && (
              <span className="bg-[#F9E79F]/30 text-[#D35400] px-3 py-1 rounded-full text-xs font-bold border border-[#F5B041]/50">
                第{note.questionIndex}問
              </span>
            )}
          </div>
        )}
        <div className="text-sm md:text-base text-gray-800 font-modern leading-relaxed">
          {formatText(note.question)}
        </div>
        <div className="text-sm text-gray-800 space-y-3 font-modern mt-6 pt-6 border-t border-gray-100">
          <div>
            <strong className="text-[#2C3E50] mb-1 block">解答:</strong>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              {formatText(note.answer)}
            </div>
          </div>
          <div>
            <strong className="text-[#2C3E50] mb-1 block">解説:</strong>
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 whitespace-pre-wrap">
              {formatText(note.explanation)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#A9CCE3] space-y-4">
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="メモを入力..."
          className="w-full p-4 rounded-xl border-2 border-[#A9CCE3] bg-white h-32 font-handwriting"
        />
        <div className="flex gap-4">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[#2C3E50] text-white rounded-xl font-bold hover:bg-[#1B2631]">
            <Save size={20} /> {saving ? '保存中...' : 'メモを保存'}
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200">
            <Trash2 size={20} /> 削除
          </button>
        </div>
      </div>
    </div>
  );
}
