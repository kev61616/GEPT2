'use client';

import { useState, useEffect } from 'react';
import { QuizState } from '@/types/quiz';

const STORAGE_KEY = 'quizState';

export function useQuizState() {
  const [state, setState] = useState<QuizState>(() => {
    const defaultState = {
      selectedChoice: null,
      timeRemaining: 300,
      highlights: {},
      strikes: []
    };

    if (typeof window === 'undefined') return defaultState;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    if (state.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setState(prev => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.timeRemaining]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleSelectChoice = (id: string) => {
    setState(prev => ({
      ...prev,
      selectedChoice: id
    }));
  };

  const handleSubmit = () => {
    // Handle answer submission
    console.log('Submitted answer:', state.selectedChoice);
  };

  return {
    state,
    handleSelectChoice,
    handleSubmit
  };
}
