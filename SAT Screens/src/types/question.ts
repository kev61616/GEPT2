export interface Question {
  id: number;
  text: string;
  equation?: string;
  options: QuestionOption[];
  correctAnswer: string;
}

export interface QuestionOption {
  id: string;
  value: string;
  correct?: boolean;
  incorrect?: boolean;
}

export interface QuestionStats {
  correct: number;
  incorrect: number;
  remaining: number;
  totalQuestions: number;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  formatted: string;
}