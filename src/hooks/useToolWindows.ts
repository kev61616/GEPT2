'use client';

import { useState, useCallback } from 'react';
import { CALCULATOR_URL } from '@/lib/constants';

interface ToolWindow {
  id: string;
  title: string;
  url: string;
  position: { x: number; y: number };
  isOpen: boolean;
}

export function useToolWindows() {
  const [windows, setWindows] = useState<ToolWindow[]>([]);

  const openWindow = useCallback((id: string, title: string, url: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, isOpen: true } : w);
      }
      return [...prev, {
        id,
        title,
        url,
        position: { x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 300 },
        isOpen: true
      }];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  }, []);

  const updatePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position } : w));
  }, []);

  return { windows, openWindow, closeWindow, updatePosition };
}
