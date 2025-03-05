'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useToolWindows } from '@/hooks/useToolWindows';
import { CALCULATOR_URL, FORMULA_SHEET_URL } from '@/lib/constants';
import type { TimerState } from '@/types/question';

interface QuestionContextType {
  time: TimerState;
  isTimerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  openCalculator: () => void;
  openFormulaSheet: () => void;
  windows: ReturnType<typeof useToolWindows>['windows'];
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  closeWindow: (id: string) => void;
}

const QuestionContext = createContext<QuestionContextType | null>(null);

export function QuestionProvider({ children }: { children: React.ReactNode }) {
  const { time, isRunning, start, pause, reset } = useTimer();
  const { windows, openWindow, closeWindow, updatePosition } = useToolWindows();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Pause timer when page is hidden
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
      if (document.visibilityState === 'visible') {
        start();
      } else {
        pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [start, pause]);

  const openCalculator = () => {
    openWindow('calculator', 'Calculator', CALCULATOR_URL);
  };

  const openFormulaSheet = () => {
    openWindow('formula', 'Formula Sheet', FORMULA_SHEET_URL);
  };

  return (
    <QuestionContext.Provider value={{
      time,
      isTimerRunning: isRunning && isVisible,
      startTimer: start,
      pauseTimer: pause,
      resetTimer: reset,
      openCalculator,
      openFormulaSheet,
      windows,
      updateWindowPosition: updatePosition,
      closeWindow
    }}>
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestion() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestion must be used within a QuestionProvider');
  }
  return context;
}