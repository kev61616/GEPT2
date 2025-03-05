'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LayoutSettingsContextType {
  balancePanels: boolean;
  toggleBalancePanels: () => void;
}

const LayoutSettingsContext = createContext<LayoutSettingsContextType | undefined>(undefined);

// Storage key for persisting settings
const STORAGE_KEY = 'layout-settings';

export function LayoutSettingsProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage if available, otherwise default to false
  const [balancePanels, setBalancePanels] = useState<boolean>(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          return parsed.balancePanels || false;
        } catch (e) {
          console.error('Error parsing saved layout settings:', e);
        }
      }
    }
    return false;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ balancePanels }));
    }
  }, [balancePanels]);

  const toggleBalancePanels = () => {
    setBalancePanels(prev => !prev);
  };

  return (
    <LayoutSettingsContext.Provider value={{ balancePanels, toggleBalancePanels }}>
      {children}
    </LayoutSettingsContext.Provider>
  );
}

export function useLayoutSettings() {
  const context = useContext(LayoutSettingsContext);
  if (context === undefined) {
    throw new Error('useLayoutSettings must be used within a LayoutSettingsProvider');
  }
  return context;
}
