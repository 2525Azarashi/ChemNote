import React, { useState } from 'react';
import { ArrowLeft, Save, Trash2, Star, RotateCw, Tag } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
import { auth } from '../firebase';

interface NoteDetailProps {
  note: any;
  onBack: () => void;
}

export function NoteDetail({ note, onBack }: NoteDetailProps) {
  const [memo, setMemo] = useState(note.memo || '');
  const [saving, setSaving] = useState(false);
  const [isImportant, setIsImportant] = useState(note.isImportant || false);
  const [reviewCount, setReviewCount] = useState(note.reviewCount || 0);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const localNotes = JSON.parse(localStorage.getItem(`notes_${auth.currentUser.uid}`) || '[]');
      const updatedNotes = localNotes.map((n: any) => 
        n.id === note.id 
          ? { ...n, memo, isImportant, reviewCount, tags, lastReviewedAt: new Date().toISOString() } 
          : n
      );
      localStorage.setItem(`notes_${auth.currentUser.uid}`, JSON.stringify(updatedNotes));
      alert('メモを保存しました！');
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!auth.currentUser) return;
    if (!confirm('本当に削除しますか？')) return;
    try {
      const localNotes = JSON.parse(localStorage.getItem(`notes_${auth.currentUser.uid}`) || '[]');
      const updatedNotes = localNotes.filter((n: any) => n.id !== note.id);
      localStorage.setItem(`notes_${auth.currentUser.uid}`, JSON.stringify(updatedNotes));
      onBack();
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました。');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleIncreaseReviewCount = () => {
    setReviewCount(reviewCount + 1);
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

      {/* Learning Support Features */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#A9CCE3] space-y-4">
        <h3 className="font-bold text-[#2C3E50] text-lg">学習サポート</h3>
        
        {/* Important Flag */}
        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <button
            onClick={() => setIsImportant(!isImportant)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              isImportant 
                ? 'bg-yellow-400 text-white shadow-md' 
                : 'bg-white text-yellow-600 border border-yellow-300'
            }`}
          >
            <Star size={18} fill={isImportant ? 'currentColor' : 'none'} />
            {isImportant ? '重要な問題' : '重要度設定'}
          </button>
          <span className="text-sm text-gray-600">重要な問題として復習リストに登録します</span>
        </div>

        {/* Review Counter */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <button
            onClick={handleIncreaseReviewCount}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <RotateCw size={18} />
            復習回数: {reviewCount}
          </button>
          <span className="text-sm text-gray-600">この問題を復習した回数</span>
        </div>

        {/* Tags */}
        <div className="space-y-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-purple-600" />
            <span className="font-bold text-[#2C3E50]">タグ</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-bold"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-purple-600 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleAddTag}
              placeholder="タグを入力してEnter（例：弱点、計算、頻出）"
              className="w-full p-2 rounded-lg border border-purple-300 text-sm font-modern"
            />
          </div>
        </div>
      </div>

      {/* Memo Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#A9CCE3] space-y-4">
        <h3 className="font-bold text-[#2C3E50] text-lg">個人ノート</h3>
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
