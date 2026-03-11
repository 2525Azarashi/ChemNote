import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

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
        <h2 className="text-lg font-bold text-[#2C3E50] font-sans">{note.question}</h2>
        <div className="text-sm text-gray-800 space-y-2 font-sans">
          <p><strong>解答:</strong> {note.answer}</p>
          <p><strong>解説:</strong> {note.explanation}</p>
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
