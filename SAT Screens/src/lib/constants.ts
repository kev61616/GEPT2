export const CALCULATOR_URL = 'https://www.desmos.com/scientific';
export const FORMULA_SHEET_URL = 'https://satsuite.collegeboard.org/media/pdf/digital-sat-math-reference.pdf';

export const ROUTES = {
  DASHBOARD: '/dashboard',
  SUBJECTS: '/subjects',
  PRACTICE: '/practice',
  PROGRESS: '/progress',
} as const;

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  FREE_RESPONSE: 'free_response',
  MATCHING: 'matching',
} as const;