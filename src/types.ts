
export type FeatureType = 'answer' | 'liven-up' | 'hit-back' | 'destroy';

export interface MessageRecord {
  id: string;
  type: FeatureType;
  scene: string;
  input: string;
  output: string[];
  timestamp: number;
}

export interface PracticeQuestion {
  id: string;
  category: string;
  difficulty: 'entry' | 'intermediate' | 'advanced';
  question: string;
  reference: string[];
}

export interface PracticeResult {
  id: string;
  questionId: string;
  userAnswer: string;
  score: number;
  comment: string;
  reference: string[];
  dimensions: EQDimensions;
  timestamp: number;
}

export interface EQDimensions {
  selfAwareness: number;
  selfRegulation: number;
  socialAwareness: number;
  socialRegulation: number;
  sceneAdaptation: number;
  expression: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  usageCount: number;
  practiceCount: number;
  eqDimensions: EQDimensions;
}
