import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Info, Network } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatText } from '../utils/textFormatter';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StepType = 1 | 2 | 3 | 'both' | null;

export interface NodeData {
  id: string;
  label: string;
  step: StepType;
  subLabel?: string;
  isGroup?: boolean;
  explanation?: string;
  relatedQuestions?: { id: string; label: string }[];
  children?: NodeData[];
}

interface TreeNodeProps {
  key?: string | number;
  node: NodeData;
  onSelect: (n: NodeData) => void;
  expandedNodeIds: string[];
  renderContent?: (nodeId: string) => React.ReactNode;
  onQuestionClick?: (questionId: string) => void;
}

const TreeNode = ({ node, onSelect, expandedNodeIds, renderContent, onQuestionClick }: TreeNodeProps) => {
  const isSelected = expandedNodeIds.includes(node.id);
  const hasContent = !!node.explanation || !!renderContent || (node.relatedQuestions && node.relatedQuestions.length > 0);

  const getStepStyles = (step: StepType, isSelected: boolean) => {
    if (step === 1) return isSelected ? 'bg-orange-100 border-orange-400 text-orange-900 shadow-md scale-[1.02]' : 'bg-white border-orange-200 text-orange-800 hover:bg-orange-50';
    if (step === 2) return isSelected ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-md scale-[1.02]' : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50';
    if (step === 3) return isSelected ? 'bg-blue-100 border-blue-400 text-blue-900 shadow-md scale-[1.02]' : 'bg-white border-blue-200 text-blue-800 hover:bg-blue-50';
    if (step === 'both') return isSelected ? 'bg-gradient-to-r from-orange-100 to-emerald-100 border-orange-400 text-slate-900 shadow-md scale-[1.02]' : 'bg-white border-orange-200 text-slate-800 hover:bg-slate-50';
    return isSelected ? 'bg-slate-100 border-slate-400 text-slate-900 shadow-md scale-[1.02]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
  };

  if (node.isGroup) {
    const groupBg = node.step === 1 ? 'bg-orange-50/50 border-orange-200' : node.step === 2 ? 'bg-emerald-50/50 border-emerald-200' : 'bg-blue-50/50 border-blue-200';
    const groupText = node.step === 1 ? 'text-orange-800' : node.step === 2 ? 'text-emerald-800' : 'text-blue-800';
    return (
      <div className={cn("relative p-2 sm:p-3 rounded-xl border-2 mb-2 mt-1", groupBg)}>
        <div className={cn("absolute -top-3 left-4 px-2 py-0.5 bg-white rounded-full border-2 text-xs font-bold shadow-sm", groupBg, groupText)}>
          {node.label}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {node.children?.map(child => (
            <TreeNode key={child.id} node={child} onSelect={onSelect} expandedNodeIds={expandedNodeIds} renderContent={renderContent} onQuestionClick={onQuestionClick} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="relative z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => hasContent && onSelect(node)}
            className={cn(
              "flex items-center justify-between w-64 px-3 py-2 rounded-lg border-2 transition-all duration-200",
              getStepStyles(node.step, isSelected),
              !hasContent && "cursor-default opacity-90"
            )}
          >
            <div className="flex flex-col items-start text-left">
              <span className="font-bold tracking-wide text-base">{node.label}</span>
            </div>
            {hasContent && (
              <ChevronRight className={cn("w-5 h-5 opacity-50 transition-transform shrink-0 ml-2", isSelected && "rotate-90 opacity-100")} />
            )}
          </motion.button>
          {node.subLabel && (
            <span className="text-sm text-slate-600 font-medium whitespace-nowrap">{node.subLabel}</span>
          )}
        </div>

        <AnimatePresence>
          {isSelected && hasContent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-2"
            >
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-inner ml-4 sm:ml-8 max-w-2xl">
                {node.explanation && (
                  <div className="flex items-start gap-2 mb-4">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="text-slate-700 text-sm leading-relaxed">
                      {formatText(node.explanation)}
                    </div>
                  </div>
                )}
                {node.relatedQuestions && node.relatedQuestions.length > 0 && (
                  <div className="flex items-start gap-2 mb-4">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 bg-blue-100 text-blue-600 rounded-full font-bold text-[10px]">
                      Q
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {node.relatedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          className="text-xs bg-white text-blue-600 border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors font-bold shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onQuestionClick) onQuestionClick(q.id);
                          }}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {renderContent && renderContent(node.id)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="relative mt-3 ml-6 sm:ml-8 pl-6 sm:pl-8 flex flex-col gap-4 border-l-2 border-slate-300">
          {node.children.map((child) => (
            <div key={child.id} className="relative">
              <div className="absolute -left-6 sm:-left-8 top-[26px] w-6 sm:w-8 border-t-2 border-slate-300 -translate-y-1/2" />
              <TreeNode key={child.id} node={child} onSelect={onSelect} expandedNodeIds={expandedNodeIds} renderContent={renderContent} onQuestionClick={onQuestionClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export interface InteractiveTreeProps {
  data: NodeData;
  renderContent?: (nodeId: string) => React.ReactNode;
  onQuestionClick?: (questionId: string) => void;
  expandedStep?: string | null;
  expandedNodeId?: string | null;
  scrollTrigger?: number;
  step?: string;
  focusNode?: string;
  zoom?: 'far' | 'normal';
  mobileTightCrop?: boolean;
}

export function InteractiveTree({ 
  data, 
  renderContent, 
  onQuestionClick, 
  expandedStep, 
  expandedNodeId, 
  scrollTrigger,
  step,
  focusNode,
  zoom = 'normal',
  mobileTightCrop = false
}: InteractiveTreeProps) {
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>([]);

  useEffect(() => {
    const effectiveExpandedStep = expandedStep || step || null;
    const effectiveExpandedNodeId = expandedNodeId || focusNode || null;
    if (!effectiveExpandedNodeId && !effectiveExpandedStep && !scrollTrigger) return;

    let targetNodeId: string | null = null;

    const normalize = (s: string) => s.replace(/[\s【】]/g, '');

    const findById = (node: NodeData, id: string, path: string[]): { node: NodeData, ancestors: string[] } | null => {
      if (node.id === id) return { node, ancestors: path };
      if (node.children) {
        for (const child of node.children) {
          const found = findById(child, id, [...path, node.id]);
          if (found) return found;
        }
      }
      return null;
    };

    const findByLabel = (node: NodeData, label: string, path: string[]): { node: NodeData, ancestors: string[] } | null => {
      const nLabel = normalize(node.label);
      const nTarget = normalize(label);
      if (nLabel === nTarget || nLabel.includes(nTarget) || nTarget.includes(nLabel)) {
        return { node, ancestors: path };
      }
      if (node.children) {
        for (const child of node.children) {
          const found = findByLabel(child, label, [...path, node.id]);
          if (found) return found;
        }
      }
      return null;
    };

    let result = expandedNodeId ? findById(data, expandedNodeId, []) : null;
    if (!result && expandedStep) {
      result = findByLabel(data, expandedStep, []);
    }

    if (result) {
      const { node, ancestors } = result;
      targetNodeId = node.id;
      
      // Expand all ancestors and the node itself to ensure it's visible
      setExpandedNodeIds(prev => {
        const next = new Set([...prev, ...ancestors, node.id]);
        return Array.from(next);
      });
    }

    if (targetNodeId) {
      // Scroll to the node after a short delay to allow for expansion animation
      setTimeout(() => {
        const element = document.getElementById(`node-${targetNodeId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add a temporary highlight
          element.classList.add('ring-2', 'ring-[#5BC0BE]', 'ring-offset-2', 'transition-all', 'duration-500');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-[#5BC0BE]', 'ring-offset-2');
          }, 2000);
        }
      }, 300);
    }
  }, [expandedStep, expandedNodeId, scrollTrigger, data]);

  const handleSelect = (node: NodeData) => {
    setExpandedNodeIds(prev => 
      prev.includes(node.id) 
        ? prev.filter(id => id !== node.id) 
        : [...prev, node.id]
    );
  };

  return (
    <div className={cn(
      "w-full bg-slate-50 rounded-2xl border border-slate-200 shadow-inner relative transition-transform duration-300",
      zoom === 'far' ? "scale-[0.75] origin-top" : "",
      mobileTightCrop ? "p-1 sm:p-2 md:p-4" : "p-2 sm:p-6 md:p-8"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h4 className="text-slate-800 font-bold flex items-center gap-2 text-base md:text-lg">
          <Network className="w-5 h-5 text-blue-500" />
          ロジックツリー
        </h4>
        <div className="flex gap-3 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-orange-700 bg-orange-100 px-2 py-1 rounded-md border border-orange-200">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            Step 1
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Step 2
          </div>
          <div className="flex items-center gap-1.5 text-blue-700 bg-blue-100 px-2 py-1 rounded-md border border-blue-200">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Step 3
          </div>
        </div>
      </div>

      {/* Tree Container */}
      <div className="overflow-x-auto pb-8 touch-pan-x">
        <div className="min-w-max pr-8">
          <TreeNode node={data} onSelect={handleSelect} expandedNodeIds={expandedNodeIds} renderContent={renderContent} onQuestionClick={onQuestionClick} />
        </div>
      </div>
    </div>
  );
}
