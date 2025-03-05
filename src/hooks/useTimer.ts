'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TimerState } from '@/types/question';

export function useTimer(initialTime = 0) {
  const [time, setTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = useCallback((totalSeconds: number): TimerState => {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      minutes,
      seconds,
      formatted: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    };
  }, []);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => setTime(0), []);

  return {
    time: formatTime(time),
    isRunning,
    start,
    pause,
    reset,
  };
}
