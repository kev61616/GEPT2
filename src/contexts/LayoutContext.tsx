'use client';

import React from 'react';

interface LayoutContextType {
  isSATLayout: boolean;
  setIsSATLayout: (value: boolean) => void;
}

const LayoutContext = React.createContext<LayoutContextType>({
  isSATLayout: false,
  setIsSATLayout: () => {},
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isSATLayout, setIsSATLayout] = React.useState(false);

  const contextValue = React.useMemo(() => ({
    isSATLayout,
    setIsSATLayout,
  }), [isSATLayout]);

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
