  'use client';

import { DndContext } from '@dnd-kit/core';
import { DragProvider } from '@/components/DragContext';
import { SelectionProvider } from '@/contexts/SelectionContext';
import { LayoutSettingsProvider, useLayoutSettings } from '@/contexts/LayoutSettingsContext';
import { QuestionLayout } from '@/components/layout/QuestionLayout';
import { QuestionPanel } from '@/components/QuestionPanel';
import { ChoicesPanel } from '@/components/ChoicesPanel';
import { ImageModal } from '@/components/ImageModal';
import { QuestionImage } from '@/components/QuestionImage';
import { PomodoroTimer, DesmosCalculator, FormulaBooklet } from '@/components/Widgets';
import { WordBookmarkManager } from '@/components/WordBookmarkManager';
import { sampleQuestion } from '@/data/sampleQuestion';
import { useQuizState } from '@/hooks/useQuizState';
import { useState, useRef, useEffect } from 'react';

function QuestionContent() {
  const { state, handleSelectChoice, handleSubmit } = useQuizState();
  const [showModal, setShowModal] = useState(false);
  const [showWordBookmarks, setShowWordBookmarks] = useState(false);
  const { balancePanels } = useLayoutSettings();
  
  // Refs for the panels
  const questionPanelRef = useRef<HTMLDivElement>(null);
  const choicesPanelRef = useRef<HTMLDivElement>(null);
  
  // Handle modal close
  const handleModalClose = (e: React.MouseEvent | KeyboardEvent) => {
    if (e.type === 'keydown' || e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  // Toggle word bookmarks
  const toggleWordBookmarks = () => {
    setShowWordBookmarks(prev => !prev);
  };
  
  // Debounce function to limit how often the resize handler is called
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Dynamic height adjustment effect
  useEffect(() => {
    // Reset any previously applied height adjustments
    if (questionPanelRef.current) questionPanelRef.current.style.minHeight = '';
    if (choicesPanelRef.current) choicesPanelRef.current.style.minHeight = '';
    
    if (!balancePanels) return;
    
    // Debounced resize handler
    const handleResize = debounce(() => {
      if (!questionPanelRef.current || !choicesPanelRef.current) return;
      
      // Check if we're in desktop view (lg breakpoint in Tailwind is 1024px)
      // Only apply height balancing in desktop view where panels are side by side
      const isDesktopView = window.innerWidth >= 1024;
      if (!isDesktopView) return;
      
      // Use clientHeight for visible height
      const questionHeight = questionPanelRef.current.clientHeight;
      const choicesHeight = choicesPanelRef.current.clientHeight;
      
      // Only adjust if the difference is significant (more than 50px)
      if (Math.abs(questionHeight - choicesHeight) > 50) {
        // Apply min-height to the shorter panel
        if (questionHeight > choicesHeight) {
          choicesPanelRef.current.style.minHeight = `${questionHeight}px`;
        } else {
          questionPanelRef.current.style.minHeight = `${choicesHeight}px`;
        }
      }
    }, 100); // 100ms debounce
    
    // Initial balance
    handleResize();
    
    // Set up ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    
    // Also listen for window resize events to handle responsive layout changes
    window.addEventListener('resize', handleResize);
    
    if (questionPanelRef.current) resizeObserver.observe(questionPanelRef.current);
    if (choicesPanelRef.current) resizeObserver.observe(choicesPanelRef.current);
    
    // Clean up
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      // Reset heights on unmount
      if (questionPanelRef.current) questionPanelRef.current.style.minHeight = '';
      if (choicesPanelRef.current) choicesPanelRef.current.style.minHeight = '';
    };
  }, [balancePanels]);

  return (
    <QuestionLayout>
      {showModal && <ImageModal onClose={handleModalClose} />}

      {/* Word Bookmarks */}
      {showWordBookmarks && (
        <WordBookmarkManager 
          onClose={() => setShowWordBookmarks(false)} 
        />
      )}

      <div className="bg-white rounded-xl border shadow-sm">
        <QuestionImage onImageClick={() => setShowModal(true)} />

        <div className="flex flex-col lg:flex-row">
          <QuestionPanel
            ref={questionPanelRef}
            question={sampleQuestion}
            onShowWordBookmarks={toggleWordBookmarks}
          />
          <ChoicesPanel
            ref={choicesPanelRef}
            choices={sampleQuestion.choices}
            selectedChoice={state.selectedChoice}
            onSelectChoice={handleSelectChoice}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </QuestionLayout>
  );
}

export default function SATLayout() {
  return (
    <DndContext>
      <DragProvider>
        <SelectionProvider>
          <LayoutSettingsProvider>
            <QuestionContent />
          </LayoutSettingsProvider>
        </SelectionProvider>
      </DragProvider>
    </DndContext>
  );
}
