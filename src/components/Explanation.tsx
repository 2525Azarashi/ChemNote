import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, BookOpen, AlertCircle, CheckSquare, TrendingUp, AlertTriangle, ChevronDown, Edit3, Save, Search, Network, Circle } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
import { auth } from '../firebase';

interface ExplanationProps {
  mode: 'mini_test' | 'practice';
  chapter: any;
  answers: Record<string, string>;
  onBack: () => void;
}

import { InteractiveTree, NodeData } from './InteractiveTree';

const substanceTreeData: NodeData = {
  id: 'root',
  label: '物質',
  step: null,
  children: [
    {
      id: 'step1_group',
      label: '【Step1】物質の分類',
      isGroup: true,
      step: 1,
      children: [
        {
          id: 'matter_elements',
          label: '物質',
          subLabel: '元素で構成',
          step: 1,
          children: [
            {
              id: 'pure',
              label: '純物質',
              step: 1,
              explanation: '1種類の物質からなり、固有の化学式で表せるもの。',
              relatedQuestions: ['演習問題⓵－１', '演習問題⓵－２'],
              children: [
                {
                  id: 'simple_1',
                  label: '単体',
                  step: 1,
                  explanation: '1種類の元素からなる純物質。',
                  relatedQuestions: ['演習問題⓵－１', '演習問題⓵－２']
                },
                {
                  id: 'compound',
                  label: '化合物',
                  step: 1,
                  explanation: '2種類以上の元素からなる純物質。（例：水 H₂O、二酸化炭素 CO₂）',
                  relatedQuestions: ['演習問題⓵－１', '演習問題⓵－２']
                }
              ]
            },
            {
              id: 'mixture',
              label: '混合物',
              step: 1,
              explanation: '複数の純物質が混ざったもの。化学式1つで表せない。（例：空気、海水）',
              relatedQuestions: ['演習問題⓵－１', '演習問題⓵－２']
            }
          ]
        }
      ]
    },
    {
      id: 'step2_group',
      label: '【Step2】純物質と混合物の性質',
      isGroup: true,
      step: 2,
      children: [
        {
          id: 'pure_prop',
          label: '純物質',
          subLabel: '融点や沸点・密度などが物質ごとに一定となる',
          step: 2,
          explanation: '融点や沸点・密度などが物質ごとに一定となる',
          relatedQuestions: ['演習問題⓵－４']
        },
        {
          id: 'mixture_prop',
          label: '混合物',
          subLabel: '混じっている物質の種類やその割合により、値が変化する',
          step: 2,
          explanation: '混じっている物質の種類やその割合により、値が変化する',
          relatedQuestions: ['演習問題⓵－４']
        }
      ]
    },
    {
      id: 'step3_group',
      label: '【Step3】単体と元素の区別',
      isGroup: true,
      step: 3,
      children: [
        {
          id: 'simple_2',
          label: '単体',
          subLabel: '実際に存在し、直接触れることができる',
          step: 3,
          explanation: '1種類の元素からなる純物質。実際に存在し、直接触れることができる「実体」。（例：酸素 O₂、水素 H₂）',
          relatedQuestions: ['演習問題⓵－３']
        },
        {
          id: 'element',
          label: '元素',
          subLabel: '物質の構成成分で、直接触れることができない',
          step: 3,
          explanation: '物質の構成成分。直接触れることができない「概念」上のもの。（例：水に含まれる酸素）',
          relatedQuestions: ['演習問題⓵－３']
        }
      ]
    }
  ]
};

export function Explanation({ mode, chapter, answers, onBack }: ExplanationProps) {
  const [selfGrades, setSelfGrades] = useState<Record<string, boolean>>({});
  const [expandedSq, setExpandedSq] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState<Record<string, boolean>>({});

  const stepColors: Record<string, string> = {
    "1": "bg-red-500/20 text-red-200 border-red-500/50 hover:bg-red-500/30",
    "2": "bg-blue-500/20 text-blue-200 border-blue-500/50 hover:bg-blue-500/30",
    "3": "bg-green-500/20 text-green-200 border-green-500/50 hover:bg-green-500/30",
    "4": "bg-yellow-500/20 text-yellow-200 border-yellow-500/50 hover:bg-yellow-500/30",
    "5": "bg-purple-500/20 text-purple-200 border-purple-500/50 hover:bg-purple-500/30",
    "6": "bg-pink-500/20 text-pink-200 border-pink-500/50 hover:bg-pink-500/30",
    "7": "bg-cyan-500/20 text-cyan-200 border-cyan-500/50 hover:bg-cyan-500/30",
  };
  const markerColors: Record<string, string> = {
    "1": "bg-red-500",
    "2": "bg-blue-500",
    "3": "bg-green-500",
    "4": "bg-yellow-500",
    "5": "bg-purple-500",
    "6": "bg-pink-500",
    "7": "bg-cyan-500",
  };
  const borderColors: Record<string, string> = {
    "1": "border-red-500",
    "2": "border-blue-500",
    "3": "border-green-500",
    "4": "border-yellow-500",
    "5": "border-purple-500",
    "6": "border-pink-500",
    "7": "border-cyan-500",
  };

  const questions = mode === 'mini_test' ? chapter.miniTest : (chapter.practiceProblems || []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [questions]);

  const handleSaveNote = async (question: any, index: number) => {
    if (!auth.currentUser) return;
    setSavingNote(prev => ({ ...prev, [question.id]: true }));
    try {
      const newNote = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        uid: auth.currentUser.uid,
        question: question.text,
        answer: question.subQuestions.map((sq: any) => sq.correctAnswer).join(', '),
        explanation: question.explanation,
        chapterTitle: chapter.abstractTitle || chapter.realTitle || '',
        questionIndex: index + 1,
        memo: '',
        createdAt: new Date().toISOString()
      };
      
      const existingNotes = JSON.parse(localStorage.getItem(`notes_${auth.currentUser.uid}`) || '[]');
      existingNotes.push(newNote);
      localStorage.setItem(`notes_${auth.currentUser.uid}`, JSON.stringify(existingNotes));
      
      alert('ノートに保存しました！');
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。');
    } finally {
      setSavingNote(prev => ({ ...prev, [question.id]: false }));
    }
  };

  const toggleGrade = (criteriaId: string) => {
    setSelfGrades(prev => ({ ...prev, [criteriaId]: !prev[criteriaId] }));
  };

  const weakAreas = useMemo(() => {
    const analysis: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q: any) => {
      const category = q.category || 'その他';
      if (!analysis[category]) {
        analysis[category] = { total: 0, correct: 0 };
      }

      q.subQuestions.forEach((sq: any) => {
        analysis[category].total += 1;

        if (sq.type === 'descriptive') {
           if (sq.gradingCriteria) {
             const criteriaCount = sq.gradingCriteria.length;
             let checkedCount = 0;
             sq.gradingCriteria.forEach((_: any, idx: number) => {
               if (selfGrades[`${sq.id}_${idx}`]) checkedCount++;
             });
             analysis[category].correct += (checkedCount / criteriaCount);
           }
        } else {
          if (answers[sq.id] === sq.correctAnswer) {
            analysis[category].correct += 1;
          }
        }
      });
    });

    return Object.entries(analysis)
      .map(([category, stats]) => ({
        category,
        percentage: Math.round((stats.correct / stats.total) * 100)
      }))
      .filter(item => item.percentage < 100)
      .sort((a, b) => a.percentage - b.percentage);
  }, [questions, answers, selfGrades]);

  const deepThoughtData = useMemo(() => {
    for (const q of questions) {
      try {
        const parsed = JSON.parse(q.explanation);
        if (parsed && parsed.type === 'deep_thought') {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  }, [questions]);

  const renderSubQuestionCheck = (sq: any) => {
    const isCorrect = sq.type === 'descriptive' ? false : answers[sq.id] === sq.correctAnswer;
    const isExpanded = expandedSq === sq.id;

    if (!isExpanded) {
      return (
        <button 
          key={sq.id}
          onClick={() => setExpandedSq(sq.id)}
          className={`w-full flex items-center justify-between p-3 md:p-4 rounded-xl border transition-colors ${sq.type === 'descriptive' ? 'bg-[#A9CCE3]/10 border-[#A9CCE3]/30' : (isCorrect ? 'bg-[#5BC0BE]/10 border-[#5BC0BE]/30' : 'bg-[#D9A0A0]/10 border-[#D9A0A0]/30')}`}
        >
          <div className="flex items-center gap-3">
            <div className="font-bold text-[#E0E1DD] text-xs md:text-sm bg-[#0B132B]/50 px-2 py-1 rounded border border-[#3A506B]/50">{sq.label}</div>
            {sq.type !== 'descriptive' && (
              isCorrect ? <CheckCircle2 className="text-[#5BC0BE] w-5 h-5" /> : <XCircle className="text-[#D9A0A0] w-5 h-5" />
            )}
          </div>
          <ChevronDown className="text-[#7A8B99]" size={20} />
        </button>
      );
    }

    return (
      <div key={sq.id} className="w-full bg-[#1C2541] rounded-xl border border-[#3A506B] shadow-lg p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-[#E0E1DD] text-sm bg-[#0B132B] px-3 py-1 rounded border border-[#3A506B]">{sq.label}</div>
          <button onClick={() => setExpandedSq(null)} className="text-[#7A8B99] hover:text-[#E0E1DD]">
            <XCircle size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <div className="text-xs text-[#7A8B99] mb-1">あなたの解答</div>
            <div className={`p-3 rounded-lg border ${sq.type === 'descriptive' ? 'bg-[#0B132B] border-[#3A506B]' : (isCorrect ? 'bg-[#5BC0BE]/10 border-[#5BC0BE]/30 text-[#5BC0BE]' : 'bg-[#D9A0A0]/10 border-[#D9A0A0]/30 text-[#D9A0A0]')}`}>
              {formatText(answers[sq.id] || '未解答')}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#7A8B99] mb-1">正解</div>
            <div className="p-3 rounded-lg border bg-[#5BC0BE]/10 border-[#5BC0BE]/30 text-[#5BC0BE]">
              {formatText(sq.correctAnswer)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (questions.length === 0) {
    return (
      <div className="w-full text-center">
        <button onClick={onBack} className="bg-[#1B2631] text-white px-6 py-3 rounded-xl font-bold w-full sm:w-auto">
          戻る
        </button>
      </div>
    );
  }

  const calculateScore = (question: any) => {
    let totalScore = 0;
    let maxScore = question.subQuestions.length;

    question.subQuestions.forEach((sq: any) => {
      if (sq.type === 'descriptive') {
        if (sq.gradingCriteria) {
          const criteriaCount = sq.gradingCriteria.length;
          let checkedCount = 0;
          sq.gradingCriteria.forEach((_: any, idx: number) => {
            if (selfGrades[`${sq.id}_${idx}`]) checkedCount++;
          });
          totalScore += (checkedCount / criteriaCount);
        }
      } else {
        if (answers[sq.id] === sq.correctAnswer) {
          totalScore += 1;
        }
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  };

  return (
    <div className="w-full bg-[#0B132B] text-[#E0E1DD] rounded-3xl overflow-hidden shadow-2xl border border-[#1C2541] font-handwriting relative my-4 md:my-8">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 50% 0%, #3A506B 0%, transparent 70%)'
      }}></div>
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#1C2541 1px, transparent 1px)',
        backgroundSize: '100% 2rem'
      }}></div>

      {/* Header */}
      <div className="p-4 md:p-6 border-b-2 border-[#1C2541] relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B132B]/90">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-[#5BC0BE] tracking-wider">
              解答・解説
            </h3>
            <div className="text-xs md:text-sm text-[#7A8B99] mt-1">
              {chapter.realTitle}
            </div>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#7A8B99] hover:text-[#5BC0BE] transition-colors font-bold px-4 py-2 rounded-full border border-[#1C2541] hover:border-[#5BC0BE] bg-[#1C2541]/50 w-full sm:w-auto justify-center"
        >
          <ArrowLeft size={18} />
          <span>単元選択に戻る</span>
        </button>
      </div>

      <div className="p-4 md:p-6 relative z-10 space-y-6 md:space-y-8">
        {/* Weak Areas Analysis */}
        {weakAreas.length > 0 && (
          <div className="bg-[#1C2541]/50 rounded-2xl p-5 md:p-6 shadow-lg border border-[#3A506B]/50 relative overflow-hidden">
            <h3 className="text-lg md:text-xl font-bold text-[#D9A0A0] mb-4 md:mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
              <span>分析結果：復習推奨エリア</span>
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {weakAreas.map((area) => (
                <div key={area.category} className="bg-[#0B132B]/80 p-4 md:p-5 rounded-xl border border-[#1C2541] shadow-sm">
                  <div className="flex justify-between items-end mb-2 md:mb-3">
                    <div className="flex items-center gap-1.5 md:gap-2 text-[#E0E1DD] font-bold text-sm md:text-base">
                      <AlertTriangle className="text-[#D9A0A0] w-4 h-4 md:w-[18px] md:h-[18px]" />
                      <span>{area.category}</span>
                    </div>
                    <span className="font-mono font-bold text-xl md:text-2xl text-[#D9A0A0]">
                      {area.percentage}<span className="text-xs md:text-sm ml-0.5">%</span>
                    </span>
                  </div>
                  
                  {/* Gauge/Slider UI */}
                  <div className="relative h-3 md:h-4 bg-[#1C2541] rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D9A0A0] to-[#FFB7B2] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${area.percentage}%` }}
                    />
                    <div className="absolute inset-0 opacity-30" 
                         style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.2) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.2) 50%,rgba(255,255,255,.2) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} 
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] md:text-xs text-[#7A8B99] font-mono">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs md:text-sm text-[#7A8B99] mt-4 text-right">
              ※ 記述問題は自己採点チェックを入れるとスコアに反映されます
            </p>
          </div>
        )}

        {/* Unified Explanation Area */}
        <div className="bg-[#1C2541]/40 rounded-2xl shadow-lg overflow-hidden border border-[#3A506B]/50">
          
          {/* Logical Tree (if exists) */}
          {deepThoughtData && (
            <div className="p-4 sm:p-6 md:p-8 border-b border-[#3A506B]/50">
              {chapter.abstractTitle === "① 純物質と混合物" ? (
                <div className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-sm text-slate-300">
                    <p className="mb-1"><span className="font-bold text-orange-400">「Step 1」</span>…演習問題⓵－１・演習問題⓵－２ で演習可能</p>
                    <p className="mb-1"><span className="font-bold text-emerald-400">「Step 2」</span>…演習問題⓵－４ で演習可能</p>
                    <p><span className="font-bold text-blue-400">「Step 3」</span>…演習問題⓵－３ で演習可能</p>
                  </div>
                  <InteractiveTree data={substanceTreeData} />
                </div>
              ) : (
                <>
                  <h4 className="text-[#5BC0BE] font-bold mb-3 flex items-center gap-2 text-sm md:text-base">
                    <Network className="w-4 h-4 md:w-5 md:h-5" />
                    思考グラフ (ロジカルツリー)
                  </h4>
                  <div className="text-xs md:text-sm text-[#E0E1DD]/80 overflow-x-auto bg-[#0B132B]/50 p-4 rounded-lg border border-[#3A506B]/30">
                    {deepThoughtData.phase1.tree.split('\n').map((line: string, i: number) => {
                      const branchMatch = line.match(/^([ │├─└]+)(.*)$/);
                      const branch = branchMatch ? branchMatch[1] : "";
                      const nodeText = branchMatch ? branchMatch[2].trim() : line.trim();
                      
                      const expData = deepThoughtData.phase2?.explanations?.find((e: any) => e.step === nodeText);
                      const stepSubQuestions = expData?.subQuestionIds 
                        ? questions.flatMap((q: any) => q.subQuestions).filter((sq: any) => expData.subQuestionIds.includes(sq.id))
                        : [];

                      return (
                        <React.Fragment key={i}>
                          <div className="flex items-center my-1.5 whitespace-pre font-mono">
                            <span>{branch}</span>
                            <button 
                              onClick={() => setExpandedStep(expandedStep === nodeText ? null : nodeText)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors shadow-sm ${expData ? "bg-[#3A506B]/20 text-[#E0E1DD] border-[#5BC0BE]/50 hover:bg-[#3A506B]/40" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}
                            >
                              <span className="font-bold">{nodeText}</span>
                            </button>
                          </div>
                          {expandedStep === nodeText && expData && (
                            <div className="ml-8 mt-2 mb-4 p-4 rounded-xl bg-[#0B132B]/80 border border-[#3A506B] shadow-inner">
                              <h6 className="text-sm font-bold text-[#5BC0BE] mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                解説と答え合わせ
                              </h6>
                              <div className="text-sm text-[#E0E1DD] mb-4">
                                {expData.content}
                              </div>
                              {stepSubQuestions.length > 0 && (
                                <div className="space-y-3">
                                  {stepSubQuestions.map((sq: any) => renderSubQuestionCheck(sq))}
                                </div>
                              )}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Answer Checking for ALL questions */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-[#3A506B]/50 bg-[#1C2541]/20">
            <h3 className="text-base md:text-lg font-bold text-[#5BC0BE] mb-4 md:mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
              <span>答え合わせ</span>
            </h3>
            
            <div className="space-y-8 md:space-y-12">
              {questions.map((question: any, qIndex: number) => {
                const scorePercentage = calculateScore(question);
                return (
                  <div key={question.id} className="space-y-4 md:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A506B]/30 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#5BC0BE]/20 text-[#5BC0BE] border border-[#5BC0BE]/30 font-bold px-3 py-1 rounded-full text-xs md:text-sm shadow-sm">
                          Q{qIndex + 1}
                        </div>
                        <div className="text-left font-bold text-[#E0E1DD] text-sm md:text-base">
                          {question.category || '問題'}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSaveNote(question, qIndex); }}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${savingNote[question.id] ? 'bg-[#1C2541] text-[#7A8B99]' : 'bg-[#F9E79F]/20 text-[#F9E79F] border border-[#F9E79F]/30 hover:bg-[#F9E79F]/30'}`}
                          disabled={savingNote[question.id]}
                        >
                          <Save size={14} />
                          {savingNote[question.id] ? '保存中...' : 'ノートに保存'}
                        </button>
                        <div className="flex flex-col items-end">
                          <div className="text-[10px] md:text-xs text-[#7A8B99] font-bold mb-0.5">あなたの正答率</div>
                          <div className={`font-mono font-bold text-base md:text-lg ${scorePercentage >= 80 ? 'text-[#5BC0BE]' : scorePercentage <= 40 ? 'text-[#D9A0A0]' : 'text-[#F9E79F]'}`}>
                            {scorePercentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Problem Restatement */}
                    <div className="bg-[#0B132B]/60 p-4 rounded-lg border border-[#3A506B]/50 text-sm md:text-base text-[#E0E1DD]/90 leading-relaxed">
                      {formatText(question.text)}
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      {question.subQuestions.map((sq: any) => {
                        const isCorrect = sq.type === 'descriptive' ? false : answers[sq.id] === sq.correctAnswer;
                        const isExpanded = expandedSq === sq.id;

                        return (
                          <div key={sq.id} className={`rounded-xl border overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'shadow-sm'} ${sq.type === 'descriptive' ? 'border-[#A9CCE3]/30' : (isCorrect ? 'border-[#5BC0BE]/30' : 'border-[#D9A0A0]/30')}`}>
                            {/* Tab Header */}
                            <button 
                              onClick={() => setExpandedSq(isExpanded ? null : sq.id)}
                              className={`w-full flex items-center justify-between p-3 md:p-4 transition-colors ${sq.type === 'descriptive' ? 'bg-[#A9CCE3]/10 hover:bg-[#A9CCE3]/20' : (isCorrect ? 'bg-[#5BC0BE]/10 hover:bg-[#5BC0BE]/20' : 'bg-[#D9A0A0]/10 hover:bg-[#D9A0A0]/20')}`}
                            >
                              <div className="flex items-center gap-3 md:gap-4">
                                <div className="font-bold text-[#E0E1DD] text-xs md:text-sm bg-[#0B132B]/50 px-2 py-1 rounded border border-[#3A506B]/50 shadow-sm">{sq.label}</div>
                                {sq.type !== 'descriptive' && (
                                  <div>
                                    {isCorrect ? <CheckCircle2 className="text-[#5BC0BE] w-5 h-5 md:w-6 md:h-6" /> : <XCircle className="text-[#D9A0A0] w-5 h-5 md:w-6 md:h-6" />}
                                  </div>
                                )}
                                {sq.type === 'descriptive' && (
                                  <div className="text-xs md:text-sm font-bold text-[#A9CCE3] flex items-center gap-1">
                                    <Edit3 size={16} />
                                    <span>記述問題</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-3 md:gap-4">
                                <div className={`text-[#7A8B99] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                  <ChevronDown size={20} />
                                </div>
                              </div>
                            </button>

                            {/* Tab Content (Dropdown) */}
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100 border-t border-[#3A506B]/30' : 'max-h-0 opacity-0'}`}>
                              <div className="p-4 md:p-6 bg-[#0B132B]/40">
                                {sq.type === 'descriptive' ? (
                                  <div className="flex flex-col gap-3 md:gap-4">
                                    <div className="text-[10px] md:text-xs text-[#7A8B99] mb-1">あなたの解答</div>
                                    <div className="font-bold text-sm md:text-base text-[#E0E1DD] mb-3 md:mb-4 whitespace-pre-wrap bg-[#1C2541]/50 p-3 rounded-lg border border-[#3A506B]/50">
                                      {formatText(answers[sq.id] || '未解答')}
                                    </div>
                                    <div className="text-[10px] md:text-xs text-[#7A8B99] mb-1">模範解答</div>
                                    <div className="font-bold text-sm md:text-base text-[#5BC0BE] mb-3 md:mb-4 bg-[#5BC0BE]/10 p-3 rounded-lg border border-[#5BC0BE]/30">
                                      {formatText(sq.correctAnswer)}
                                    </div>
                                    
                                    <div className="bg-[#1C2541]/50 p-3 md:p-4 rounded-lg border border-[#A9CCE3]/30 shadow-sm mt-2">
                                      <div className="text-xs md:text-sm font-bold text-[#A9CCE3] mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                                        <CheckSquare className="w-4 h-4 md:w-4 md:h-4" />
                                        <span>自己採点チェック（部分点基準）</span>
                                      </div>
                                      <div className="space-y-2 md:space-y-3">
                                        {sq.gradingCriteria?.map((criteria: string, cIdx: number) => {
                                          const criteriaId = `${sq.id}_${cIdx}`;
                                          const isChecked = selfGrades[criteriaId] || false;
                                          return (
                                            <label key={cIdx} className="flex items-start gap-2 md:gap-3 cursor-pointer group py-1 md:py-0" onClick={() => toggleGrade(criteriaId)}>
                                              <div className={`mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${isChecked ? 'bg-[#5BC0BE] border-[#5BC0BE]' : 'border-[#3A506B] group-hover:border-[#5BC0BE] bg-[#0B132B]'}`}>
                                                {isChecked && <CheckCircle2 className="text-[#0B132B] w-3 h-3 md:w-3.5 md:h-3.5" />}
                                              </div>
                                              <span className={`text-xs md:text-sm leading-tight ${isChecked ? 'text-[#E0E1DD] font-medium' : 'text-[#7A8B99]'}`}>
                                                {formatText(criteria)}
                                              </span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-3 md:gap-4">
                                    <div className="text-[10px] md:text-xs text-[#7A8B99] mb-1">あなたの解答</div>
                                    <div className={`font-bold text-sm md:text-base p-3 rounded-lg border ${isCorrect ? 'bg-[#5BC0BE]/10 border-[#5BC0BE]/30 text-[#5BC0BE]' : 'bg-[#D9A0A0]/10 border-[#D9A0A0]/30 text-[#D9A0A0] line-through opacity-80'}`}>
                                      {formatText(answers[sq.id] || '未解答')}
                                    </div>
                                    {!isCorrect && (
                                      <div className="mt-2">
                                        <div className="text-[10px] md:text-xs text-[#7A8B99] mb-1">正解</div>
                                        <div className="font-bold text-sm md:text-base text-[#5BC0BE] bg-[#5BC0BE]/10 p-3 rounded-lg border border-[#5BC0BE]/30">
                                          {formatText(sq.correctAnswer)}
                                        </div>
                                      </div>
                                    )}
                                    {sq.partialCreditCriteria && (
                                      <div className="mt-2 md:mt-3 text-[10px] md:text-xs bg-[#F9E79F]/10 text-[#F9E79F] p-3 rounded-lg border border-[#F9E79F]/30 flex items-start gap-2">
                                        <AlertCircle className="shrink-0 mt-0.5 w-4 h-4" />
                                        <span className="leading-relaxed">{formatText(sq.partialCreditCriteria)}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Normal Explanation (if not deep_thought) */}
                    {(() => {
                      try {
                        const parsed = JSON.parse(question.explanation);
                        if (parsed && parsed.type === 'deep_thought') {
                          return null; // Handled globally
                        }
                      } catch (e) {
                        // Not JSON, render normal explanation
                      }
                      
                      if (!question.explanation) return null;

                      return (
                        <div className="bg-[#0B132B]/80 p-4 sm:p-5 rounded-xl shadow-inner border border-[#3A506B]/50 mt-4">
                          <h4 className="text-sm md:text-base text-[#5BC0BE] mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2 border-b-2 border-[#3A506B]/50 pb-1.5 inline-flex">
                            <Lightbulb className="text-[#F9E79F] w-4 h-4" />
                            <span>解説</span>
                          </h4>
                          <div className="text-xs md:text-sm text-[#E0E1DD]/90 whitespace-pre-wrap leading-relaxed">
                            {formatText(question.explanation)}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stumbling Points (from deep_thought) */}
          {deepThoughtData && deepThoughtData.phase2.stumblingPoints && deepThoughtData.phase2.stumblingPoints.length > 0 && (
            <div className="p-4 sm:p-6 md:p-8 border-b border-[#3A506B]/50 bg-[#1C2541]/20">
              <h4 className="text-[#D9A0A0] font-bold mb-4 text-base md:text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
                つまずきポイント
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deepThoughtData.phase2.stumblingPoints.map((point: any, idx: number) => (
                  <div key={idx} className="bg-[#D9A0A0]/10 p-4 sm:p-5 rounded-xl border border-[#D9A0A0]/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D9A0A0]"></div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-[#D9A0A0]/20 text-[#D9A0A0] text-xs font-bold px-2 py-0.5 rounded border border-[#D9A0A0]/30">
                        {point.step}
                      </div>
                      <h5 className="font-bold text-sm md:text-base text-[#D9A0A0]">{point.type || point.point}</h5>
                    </div>
                    <div className="text-xs md:text-sm text-[#E0E1DD]/90 leading-relaxed whitespace-pre-wrap">
                      {formatText(point.content || point.reason)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Surrounding Knowledge / Deep Dive (from all questions) */}
          <div className="p-4 sm:p-6 md:p-8 space-y-8">
            {questions.map((question: any, qIndex: number) => {
              const hasKnowledge = question.surroundingKnowledge && question.surroundingKnowledge.length > 0;
              const hasDeepDive = question.deepDiveTopics && question.deepDiveTopics.length > 0;
              
              if (!hasKnowledge && !hasDeepDive) return null;

              return (
                <div key={`extra-${question.id}`} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-[#3A506B]/30 pb-2">
                    <div className="bg-[#5BC0BE]/20 text-[#5BC0BE] border border-[#5BC0BE]/30 font-bold px-2 py-0.5 rounded text-xs shadow-sm">
                      Q{qIndex + 1}
                    </div>
                    <h4 className="font-bold text-sm md:text-base text-[#E0E1DD] opacity-80">
                      周辺知識・深掘り
                    </h4>
                  </div>

                  {hasKnowledge && (
                    <div>
                      <h5 className="font-bold text-xs md:text-sm text-[#A9CCE3] mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2">
                        <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                        <span>周辺知識・類似問題</span>
                      </h5>
                      <div className="space-y-3 md:space-y-4">
                        {question.surroundingKnowledge.map((k: string, idx: number) => {
                          const titleMatch = k.match(/^(【.*?】)(.*)/s);
                          if (titleMatch) {
                            return (
                              <div key={idx} className="bg-[#1C2541]/50 p-4 md:p-5 rounded-xl border border-[#A9CCE3]/30 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A9CCE3]"></div>
                                <div className="inline-flex items-center gap-1.5 bg-[#A9CCE3]/10 text-[#A9CCE3] text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md mb-3 border border-[#A9CCE3]/20">
                                  <BookOpen size={14} />
                                  {titleMatch[1].replace(/[【】]/g, '')}
                                </div>
                                <div className="text-xs md:text-sm text-[#E0E1DD]/90 leading-relaxed whitespace-pre-wrap">
                                  {formatText(titleMatch[2].trim())}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className="bg-[#1C2541]/50 p-4 md:p-5 rounded-xl border border-[#3A506B]/50 shadow-sm text-xs md:text-sm text-[#E0E1DD]/90 leading-relaxed whitespace-pre-wrap">
                              {formatText(k)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {hasDeepDive && (
                    <div className="mt-6 md:mt-8">
                      <h5 className="font-bold text-xs md:text-sm text-[#D9A0A0] mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2">
                        <Search className="w-4 h-4 md:w-5 md:h-5" />
                        <span>さらに深掘り</span>
                      </h5>
                      <div className="space-y-3 md:space-y-4">
                        {question.deepDiveTopics.map((topic: string, idx: number) => {
                          const titleMatch = topic.match(/^(【.*?】)(.*)/s);
                          let title = "";
                          let content = topic;
                          
                          if (titleMatch) {
                            title = titleMatch[1].replace(/[【】]/g, '');
                            content = titleMatch[2].trim();
                          } else {
                            const parts = topic.split('\n');
                            title = parts[0];
                            content = parts.slice(1).join('\n');
                          }

                          return (
                            <div key={idx} className="bg-[#D9A0A0]/10 p-4 md:p-5 rounded-xl border border-[#D9A0A0]/30 shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D9A0A0]"></div>
                              <div className="inline-flex items-center gap-1.5 bg-[#D9A0A0]/20 text-[#D9A0A0] text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md mb-3 border border-[#D9A0A0]/30">
                                <Lightbulb size={14} />
                                {title}
                              </div>
                              <div className="text-xs md:text-sm text-[#E0E1DD]/90 leading-relaxed whitespace-pre-wrap">
                                {formatText(content)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
