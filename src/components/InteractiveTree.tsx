import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Info, Network } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatText } from '../utils/textFormatter';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StepType = 1 | 2 | 3 | 4 | 'both' | null;

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
  zoom?: 'far' | 'normal';
  depth?: number;
  isMobile?: boolean;
}

const TreeNode = ({ node, onSelect, expandedNodeIds, renderContent, onQuestionClick, zoom = 'normal', depth = 0, isMobile = false }: TreeNodeProps) => {
  const isSelected = expandedNodeIds.includes(node.id);
  const hasContent = !!node.explanation || !!renderContent || (node.relatedQuestions && node.relatedQuestions.length > 0);

  const getStepStyles = (step: StepType, isSelected: boolean) => {
    if (step === 1) return isSelected ? 'bg-orange-100 border-orange-400 text-orange-900 shadow-md scale-[1.02]' : 'bg-white border-orange-200 text-orange-800 hover:bg-orange-50';
    if (step === 2) return isSelected ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-md scale-[1.02]' : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50';
    if (step === 3) return isSelected ? 'bg-blue-100 border-blue-400 text-blue-900 shadow-md scale-[1.02]' : 'bg-white border-blue-200 text-blue-800 hover:bg-blue-50';
    if (step === 4) return isSelected ? 'bg-purple-100 border-purple-400 text-purple-900 shadow-md scale-[1.02]' : 'bg-white border-purple-200 text-purple-800 hover:bg-purple-50';
    if (step === 'both') return isSelected ? 'bg-gradient-to-r from-orange-100 to-emerald-100 border-orange-400 text-slate-900 shadow-md scale-[1.02]' : 'bg-white border-orange-200 text-slate-800 hover:bg-slate-50';
    return isSelected ? 'bg-slate-100 border-slate-400 text-slate-900 shadow-md scale-[1.02]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
  };

  const isFar = zoom === 'far';
  const buttonWidth = isFar ? 'w-48 sm:w-56' : 'w-56 sm:w-64';
  const buttonTextSize = isFar ? 'text-xs sm:text-sm' : 'text-base';
  const subLabelSize = isFar ? 'text-xs' : 'text-sm';
  const indentClass = isFar ? 'ml-4 sm:ml-6 pl-4 sm:pl-6' : 'ml-6 sm:ml-8 pl-6 sm:pl-8';
  const lineTranslate = isFar ? 'top-[22px]' : 'top-[26px]';
  const horizontalLineClass = isFar ? '-left-4 sm:-left-6 w-4 sm:w-6' : '-left-6 sm:-left-8 w-6 sm:w-8';

  const indentPerLevel = isFar ? 48 : 64; // px on desktop
  const mobileIndentPerLevel = isFar ? 32 : 48; // px on mobile
  
  const totalIndentDesktop = depth * indentPerLevel;
  const totalIndentMobile = depth * mobileIndentPerLevel;

  const dynamicMaxWidth = isMobile
    ? `calc(100vw - ${totalIndentMobile}px - 2.5rem)`
    : `calc(58vw - ${totalIndentDesktop}px - 6.5rem)`;

  if (node.isGroup) {
    const groupBg = node.step === 1 ? 'bg-orange-50/50 border-orange-200' : node.step === 2 ? 'bg-emerald-50/50 border-emerald-200' : node.step === 3 ? 'bg-blue-50/50 border-blue-200' : 'bg-purple-50/50 border-purple-200';
    const groupText = node.step === 1 ? 'text-orange-800' : node.step === 2 ? 'text-emerald-800' : node.step === 3 ? 'text-blue-800' : 'text-purple-800';
    return (
      <div className={cn("relative p-2 sm:p-3 rounded-xl border-2 mb-2 mt-1 font-handwriting", groupBg)}>
        <div className={cn("absolute -top-3 left-4 px-2 py-0.5 bg-white rounded-full border-2 text-xs font-bold font-handwriting shadow-sm", groupBg, groupText)}>
          {node.label}
        </div>
        <div className="mt-2 flex flex-col gap-2 font-handwriting">
          {node.children?.map(child => (
            <TreeNode key={child.id} node={child} onSelect={onSelect} expandedNodeIds={expandedNodeIds} renderContent={renderContent} onQuestionClick={onQuestionClick} zoom={zoom} depth={depth + 1} isMobile={isMobile} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-w-0 font-handwriting">
      <div className="relative z-10 w-full min-w-0 font-handwriting">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => hasContent && onSelect(node)}
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-all duration-200 font-handwriting",
              buttonWidth,
              getStepStyles(node.step, isSelected),
              !hasContent && "cursor-default opacity-90"
            )}
          >
            <div className="flex flex-col items-start text-left font-handwriting">
              <span className={cn("font-bold tracking-wide font-handwriting", buttonTextSize)}>{node.label}</span>
            </div>
            {hasContent && (
              <ChevronRight className={cn("w-4 h-4 opacity-50 transition-transform shrink-0 ml-1.5", isSelected && "rotate-90 opacity-100")} />
            )}
          </motion.button>
          {node.subLabel && (
            <span className={cn("text-slate-600 font-medium font-handwriting whitespace-nowrap", subLabelSize)}>{node.subLabel}</span>
          )}
        </div>

        <AnimatePresence>
          {isSelected && hasContent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-2 font-handwriting"
            >
              <div 
                className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200 shadow-inner ml-3 sm:ml-4 mr-3 sm:mr-4 w-full sm:w-[440px] md:w-[520px] lg:w-[620px] xl:w-[760px] 2xl:w-[900px] font-handwriting whitespace-normal break-words box-border"
                style={{ maxWidth: dynamicMaxWidth }}
              >
                {node.explanation && (
                  <div className="flex items-start gap-2 mb-4 font-handwriting">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="text-slate-700 text-sm leading-relaxed font-handwriting whitespace-normal break-words">
                      {formatText(node.explanation)}
                    </div>
                  </div>
                )}
                {node.relatedQuestions && node.relatedQuestions.length > 0 && (
                  <div className="flex items-start gap-2 mb-4 font-handwriting">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 bg-blue-100 text-blue-600 rounded-full font-bold text-[10px] font-handwriting">
                      Q
                    </div>
                    <div className="flex flex-wrap gap-2 font-handwriting">
                      {node.relatedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          className="text-xs bg-white text-blue-600 border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors font-bold font-handwriting shadow-sm cursor-pointer"
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
        <div className={cn("relative mt-3 flex flex-col gap-4 border-l-2 border-slate-300", indentClass)}>
          {node.children.map((child) => (
            <div key={child.id} className="relative">
              <div className={cn("absolute border-t-2 border-slate-300 -translate-y-1/2", horizontalLineClass, lineTranslate)} />
              <TreeNode key={child.id} node={child} onSelect={onSelect} expandedNodeIds={expandedNodeIds} renderContent={renderContent} onQuestionClick={onQuestionClick} zoom={zoom} depth={depth + 1} isMobile={isMobile} />
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
      "w-full bg-slate-50 rounded-2xl border border-slate-200 shadow-inner relative transition-transform duration-300 font-handwriting min-w-0 overflow-x-auto",
      zoom === 'far' ? "origin-top scale-[0.98]" : "",
      mobileTightCrop ? "p-1 sm:p-2 md:p-3" : "p-2 sm:p-4 md:p-5"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 font-handwriting">
        <h4 className="text-slate-800 font-bold flex items-center gap-2 text-sm sm:text-base md:text-lg font-handwriting">
          <Network className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          学習フローチャート
        </h4>
        <div className="flex flex-wrap gap-1 md:gap-3 text-[9px] sm:text-xs font-bold justify-end font-handwriting">
          <div className="flex items-center gap-1 text-orange-700 bg-orange-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-orange-200 font-handwriting">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Step 1
          </div>
          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-emerald-200 font-handwriting">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Step 2
          </div>
          <div className="flex items-center gap-1 text-blue-700 bg-blue-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-blue-200 font-handwriting">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Step 3
          </div>
        </div>
      </div>

      {/* Tree Container */}
      <div className="overflow-x-auto pb-4 touch-auto">
        <div className="min-w-max pr-8">
          <TreeNode node={data} onSelect={handleSelect} expandedNodeIds={expandedNodeIds} renderContent={renderContent} onQuestionClick={onQuestionClick} zoom={zoom} depth={0} isMobile={mobileTightCrop} />
        </div>
      </div>
    </div>
  );
}
