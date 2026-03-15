import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Brain, Network, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface DeepThoughtData {
  type: 'deep_thought';
  phase1: {
    title: string;
    overview: {
      theme: string;
      type: string;
      concepts: string;
    };
    tree: string;
    steps: Array<{
      step: string;
      tag: string;
      target: string;
      content: string;
      knowledge: string;
      purpose: string;
    }>;
  };
  phase2: {
    title: string;
    answers: string;
    explanations: Array<{
      step: string;
      tag: string;
      content: string;
    }>;
    stumblingPoints: Array<{
      step: string;
      type: string;
      content: string;
    }>;
  };
}

export const DeepThoughtExplanation: React.FC<{ data: DeepThoughtData }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const toggleStep = (step: string) => {
    setExpandedStep(expandedStep === step ? null : step);
  };

  return (
    <div className="w-full text-[#E0E1DD] font-handwriting relative mt-4">
      {/* Header */}
      <div className="p-4 md:p-6 border-b-2 border-[#1C2541] relative z-10 flex items-center gap-3 bg-[#1C2541]/30 rounded-t-xl">
        <Brain className="text-[#5BC0BE] w-6 h-6 md:w-8 md:h-8" />
        <h3 className="text-lg md:text-xl font-bold text-[#5BC0BE] tracking-wider">
          Deep Thought Analysis
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b-2 border-[#1C2541] bg-[#1C2541]/20 backdrop-blur-sm z-10 relative scrollbar-hide px-4 pt-2 gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 rounded-t-lg border-t border-x ${activeTab === 'overview' ? 'text-[#5BC0BE] border-[#5BC0BE] bg-[#1C2541]/50' : 'text-[#7A8B99] border-[#1C2541] hover:text-[#E0E1DD] bg-transparent'}`}
        >
          <Network className="w-4 h-4" />
          <span className="font-handwriting">思考構造の分析</span>
        </button>
        <button
          onClick={() => setActiveTab('explanation')}
          className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 rounded-t-lg border-t border-x ${activeTab === 'explanation' ? 'text-[#5BC0BE] border-[#5BC0BE] bg-[#1C2541]/50' : 'text-[#7A8B99] border-[#1C2541] hover:text-[#E0E1DD] bg-transparent'}`}
        >
          <Lightbulb className="w-4 h-4" />
          <span className="font-handwriting">ステップ解説</span>
        </button>
        <button
          onClick={() => setActiveTab('stumbling')}
          className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 rounded-t-lg border-t border-x ${activeTab === 'stumbling' ? 'text-[#5BC0BE] border-[#5BC0BE] bg-[#1C2541]/50' : 'text-[#7A8B99] border-[#1C2541] hover:text-[#E0E1DD] bg-transparent'}`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="font-handwriting">つまずきポイント</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 md:p-6 relative z-10 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-[#1C2541]/50 p-4 rounded-lg border border-[#3A506B]/50">
                <h4 className="text-[#5BC0BE] font-bold mb-3 flex items-center gap-2 text-sm font-handwriting">
                  <CheckCircle2 className="w-4 h-4" />
                  問題俯瞰
                </h4>
                <ul className="space-y-3 text-sm text-[#E0E1DD]/90 font-handwriting tracking-wide leading-relaxed">
                  <li><span className="text-[#7A8B99] mr-2">【テーマ】</span>{data.phase1.overview.theme}</li>
                  <li><span className="text-[#7A8B99] mr-2">【タイプ】</span>{data.phase1.overview.type}</li>
                  <li><span className="text-[#7A8B99] mr-2">【主要概念】</span>{data.phase1.overview.concepts}</li>
                </ul>
              </div>

              <div className="bg-[#1C2541]/50 p-4 rounded-lg border border-[#3A506B]/50 overflow-x-auto">
                <h4 className="text-[#5BC0BE] font-bold mb-3 flex items-center gap-2 text-sm font-handwriting">
                  <Network className="w-4 h-4" />
                  思考グラフ (ロジカルツリー)
                </h4>
                <pre className="text-xs md:text-sm text-[#E0E1DD]/80 font-mono whitespace-pre leading-relaxed">
                  {data.phase1.tree}
                </pre>
              </div>
            </motion.div>
          )}

          {activeTab === 'explanation' && (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-[#1C2541]/50 p-4 rounded-lg border border-[#3A506B]/50 mb-6">
                <h4 className="text-[#5BC0BE] font-bold mb-3 text-sm font-handwriting">模範解答</h4>
                <pre className="text-sm text-[#E0E1DD]/90 font-mono whitespace-pre-wrap leading-relaxed">
                  {data.phase2.answers}
                </pre>
              </div>

              <h4 className="text-[#5BC0BE] font-bold mb-3 text-sm font-handwriting">思考ステップ解説</h4>
              <div className="space-y-3">
                {data.phase2.explanations.map((exp, idx) => {
                  const phase1Step = data.phase1.steps.find(s => s.step === exp.step);
                  const isExpanded = expandedStep === exp.step;
                  
                  return (
                    <div key={idx} className="border border-[#3A506B]/50 rounded-lg overflow-hidden bg-[#1C2541]/30">
                      <button
                        onClick={() => toggleStep(exp.step)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-[#1C2541]/50 hover:bg-[#1C2541] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#5BC0BE] font-handwriting">{exp.step}</span>
                          <span className="text-xs px-2 py-1 rounded bg-[#3A506B]/50 text-[#E0E1DD] border border-[#3A506B] font-handwriting">
                            {exp.tag}
                          </span>
                          <span className="text-sm text-[#E0E1DD]/80 hidden md:inline-block truncate max-w-[300px] font-handwriting">
                            {phase1Step?.target}
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#5BC0BE]" /> : <ChevronDown className="w-4 h-4 text-[#7A8B99]" />}
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 border-t border-[#3A506B]/30 space-y-4">
                              {phase1Step && (
                                <div className="bg-[#0B132B]/50 p-3 rounded border border-[#3A506B]/30 text-xs text-[#E0E1DD]/70 space-y-2 font-handwriting tracking-wide">
                                  <p><strong className="text-[#7A8B99]">思考内容:</strong> {phase1Step.content}</p>
                                  <p><strong className="text-[#7A8B99]">使用知識:</strong> {phase1Step.knowledge}</p>
                                  <p><strong className="text-[#7A8B99]">目的:</strong> {phase1Step.purpose}</p>
                                </div>
                              )}
                              <div className="text-sm text-[#E0E1DD]/90 leading-relaxed whitespace-pre-wrap font-handwriting tracking-wide">
                                {exp.content}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'stumbling' && (
            <motion.div
              key="stumbling"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {data.phase2.stumblingPoints.map((point, idx) => (
                <div key={idx} className="bg-[#1C2541]/50 p-4 rounded-lg border border-[#D9A0A0]/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#D9A0A0]/50"></div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-[#D9A0A0]" />
                    <h4 className="text-[#D9A0A0] font-bold text-sm font-handwriting">{point.step} でのつまずき</h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#D9A0A0]/10 text-[#D9A0A0] border border-[#D9A0A0]/20 ml-2 font-handwriting">
                      {point.type}
                    </span>
                  </div>
                  <div className="text-sm text-[#E0E1DD]/90 leading-relaxed whitespace-pre-wrap font-handwriting tracking-wide">
                    {point.content}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
