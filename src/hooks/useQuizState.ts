'use client';

import { useState, useEffect } from 'react';
import { QuizState } from '@/types/quiz';

const STORAGE_KEY = 'quizState';

// Default state that will be used for both server and client initial render
const defaultState: QuizState = {
  selectedChoice: null,
  timeRemaining: 300,
  highlights: {},
  strikes: []
};

export function useQuizState() {
  const [state, setState] = useState<QuizState>(defaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved state from localStorage only after initial render on client
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setState(JSON.parse(saved));
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading quiz state from localStorage:', error);
      }
    }
  }, [isInitialized]);

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

  // Save state to localStorage only after initialization and when state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isInitialized]);

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

  const addStrike = (choiceId: string) => {
    setState(prev => {
      // Only add to strikes if it's not already there
      if (!prev.strikes.includes(choiceId)) {
        return {
          ...prev,
          strikes: [...prev.strikes, choiceId]
        };
      }
      return prev;
    });
  };

  return {
    state,
    handleSelectChoice,
    handleSubmit,
    addStrike
  };
}
