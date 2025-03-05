'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'widgetState';

interface WidgetState {
  timer: boolean;
  calculator: boolean;
  formulas: boolean;
}

export function useWidgetState() {
  const [state, setState] = useState<WidgetState>(() => {
    const defaultState = {
      timer: true,
      calculator: true,
      formulas: true
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
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    // Dispatch custom event to notify other components
    try {
      // Create a custom event that works in all browsers
      const event = document.createEvent('Event');
      event.initEvent('widgetStateChange', true, true);
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to dispatch widget state change event:', error);
    }
  }, [state]);

  const toggleWidget = (id: 'timer' | 'calculator' | 'formulas') => {
    setState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return {
    state,
    toggleWidget
  };
}
