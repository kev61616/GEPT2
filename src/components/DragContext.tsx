'use client';

import React from 'react';

interface DragContextType {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  draggedItem: string | null;
  setDraggedItem: (item: string | null) => void;
}

// Initialize with default values
const DragContext = React.createContext<DragContextType>({
  isDragging: false,
  setIsDragging: () => {},
  draggedItem: null,
  setDraggedItem: () => {}
});

export function DragProvider({ children }: { children: React.ReactNode }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [draggedItem, setDraggedItem] = React.useState<string | null>(null);

  const contextValue = React.useMemo(() => ({
    isDragging,
    setIsDragging,
    draggedItem,
    setDraggedItem
  }), [isDragging, draggedItem]);

  return (
    <DragContext.Provider value={contextValue}>
      {children}
    </DragContext.Provider>
  );
}

export function useDrag() {
  const context = React.useContext(DragContext);
  if (!context) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context;
}
