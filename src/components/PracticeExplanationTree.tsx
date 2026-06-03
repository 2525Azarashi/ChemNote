import React from 'react';
import { InteractiveTree, NodeData } from './InteractiveTree';
import { substanceTreeData } from '../data/chemistryData';

interface PracticeExplanationTreeProps {
  deepThoughtData: any;
  chapter: any;
  questions: any[];
  handleQuestionClick: (id: string) => void;
  expandedStep: string | null;
  setExpandedStep: (step: string | null) => void;
  expandedNodeId: string | null;
  scrollTrigger: number;
  isMobile: boolean;
  renderSubQuestionCheck: (sq: any, parentQuestion: any) => React.ReactElement;
}

const filterTree = (node: NodeData, relatedNodeIds: string[]): NodeData | null => {
  const isRelated = relatedNodeIds.includes(node.id);
  const filteredChildren = node.children
    ? node.children.map(child => filterTree(child, relatedNodeIds)).filter(child => child !== null) as NodeData[]
    : [];
  
  if (isRelated || filteredChildren.length > 0) {
    return {
      ...node,
      children: filteredChildren
    };
  }
  return null;
};

export const PracticeExplanationTree: React.FC<PracticeExplanationTreeProps> = ({
  deepThoughtData,
  chapter,
  questions,
  handleQuestionClick,
  expandedStep,
  setExpandedStep,
  expandedNodeId,
  scrollTrigger,
  isMobile,
  renderSubQuestionCheck
}) => {
  const renderContent = (nodeId: string) => {
    const matchedSqs: { sq: any, parentQuestion: any }[] = [];
    
    // Check if deepThoughtData has explanations for this step/node
    if (deepThoughtData?.phase2?.explanations) {
      const stepExplanation = deepThoughtData.phase2.explanations.find((ex: any) => {
        const normalize = (s: string) => s.replace(/[\s【】]/g, '').toLowerCase();
        return normalize(ex.step).includes(normalize(nodeId)) || 
               normalize(nodeId).includes(normalize(ex.step));
      });
      
      for (const question of questions) {
        for (const sq of question.subQuestions) {
          if (stepExplanation?.subQuestionIds?.includes(sq.id)) {
            if (!matchedSqs.some(item => item.sq.id === sq.id)) {
              matchedSqs.push({ sq, parentQuestion: question });
            }
          }
        }
      }
    }
    
    // Also check node's direct relatedQuestions configuration
    const findNodeInTree = (node: any, id: string): any => {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const res = findNodeInTree(child, id);
          if (res) return res;
        }
      }
      return null;
    };
    
    const nodeInTree = findNodeInTree(substanceTreeData, nodeId);
    if (nodeInTree?.relatedQuestions) {
      const relatedIds = nodeInTree.relatedQuestions.map((rq: any) => rq.id);
      for (const question of questions) {
        for (const sq of question.subQuestions) {
          if (relatedIds.includes(sq.id)) {
            if (!matchedSqs.some(item => item.sq.id === sq.id)) {
              matchedSqs.push({ sq, parentQuestion: question });
            }
          }
        }
      }
    }

    if (matchedSqs.length === 0) return null;

    return (
      <div className="mt-4 space-y-3">
        <div className="text-xs font-bold text-slate-500 mb-2">このステップの確認問題:</div>
        {matchedSqs.map(({ sq, parentQuestion }) => (
          <div key={sq.id} className="w-full">
            {renderSubQuestionCheck(sq, parentQuestion)}
          </div>
        ))}
      </div>
    );
  };

  // Find all related node IDs for the active chapter's questions
  const getChapterRelatedNodeIds = () => {
    const ids: string[] = [];
    const sqIds = questions.flatMap(q => q.subQuestions.map((sq: any) => sq.id));
    
    const traverse = (node: any) => {
      // Check if this node is related to any of our sub-questions
      const isRelated = node.relatedQuestions?.some((rq: any) => sqIds.includes(rq.id));
      
      // Check if deepThoughtData has this step
      const isStepInDeepThought = deepThoughtData?.phase2?.explanations?.some((ex: any) => {
        const normalize = (s: string) => s.replace(/[\s【】]/g, '').toLowerCase();
        return normalize(ex.step).includes(normalize(node.id)) || 
               normalize(node.id).includes(normalize(ex.step));
      });

      if (isRelated || isStepInDeepThought) {
        ids.push(node.id);
      }
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(substanceTreeData);
    return ids;
  };

  const relatedNodeIds = getChapterRelatedNodeIds();
  const filteredTreeData = relatedNodeIds.length > 0 
    ? filterTree(substanceTreeData, relatedNodeIds) || substanceTreeData
    : substanceTreeData;

  return (
    <div id="logical-tree-section" className="p-4 sm:p-6 md:p-8 border-b border-gray-200 w-full bg-white">
      <div className="flex flex-col w-full gap-4">
        <h3 className="text-lg font-bold text-[#2C3E50] mb-2 font-handwriting">学習フローチャート</h3>
        <div className="w-full bg-slate-100 rounded-2xl border border-gray-200 p-2 sm:p-4 overflow-x-auto overflow-y-hidden">
          <InteractiveTree 
            data={filteredTreeData}
            onQuestionClick={handleQuestionClick}
            expandedStep={expandedStep}
            expandedNodeId={expandedNodeId}
            scrollTrigger={scrollTrigger}
            renderContent={renderContent}
            mobileTightCrop={isMobile}
          />
        </div>
      </div>
    </div>
  );
};
