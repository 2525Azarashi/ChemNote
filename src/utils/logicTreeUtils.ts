import { NodeData } from '../components/InteractiveTree';
import { substanceTreeData } from '../data/chemistryData';

export const getRelatedSteps = (sqId: string, currentQuestion: any) => {
  const steps: { step: number | string | null, label: string, id: string }[] = [];
  
  const findInTree = (node: NodeData) => {
    if (node.relatedQuestions?.some(q => q.id === sqId)) {
      steps.push({ step: node.step, label: node.label, id: node.id });
    }
    if (node.children) {
      node.children.forEach(findInTree);
    }
  };
  
  if (substanceTreeData) {
    findInTree(substanceTreeData);
  }
  
  return steps;
};

export const filterTree = (node: NodeData, relatedNodeIds: string[]): NodeData | null => {
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
