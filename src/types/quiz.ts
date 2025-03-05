export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  choices: Choice[];
}

export interface QuizState {
  selectedChoice: string | null;
  timeRemaining: number;
  highlights: Record<string, string[]>;
  strikes: string[];
}
