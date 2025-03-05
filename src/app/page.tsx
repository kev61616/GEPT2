'use client';

import { DndContext } from '@dnd-kit/core';
import { DragProvider } from '@/components/DragContext';
import { SelectionProvider } from '@/contexts/SelectionContext';
import { Header } from '@/components/Header';
import { QuestionPanel } from '@/components/QuestionPanel';
import { ChoicesPanel } from '@/components/ChoicesPanel';
import { ImageModal } from '@/components/ImageModal';
import { QuestionImage } from '@/components/QuestionImage';
import { PomodoroTimer, DesmosCalculator, FormulaBooklet } from '@/components/Widgets';
import { WordBookmarkManager } from '@/components/WordBookmarkManager';
import { sampleQuestion } from '@/data/sampleQuestion';
import { useQuizState } from '@/hooks/useQuizState';
import { useState, useEffect } from 'react';

export default function Home() {
  const { state, handleSelectChoice, handleSubmit } = useQuizState();
  const [showModal, setShowModal] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const [showWordBookmarks, setShowWordBookmarks] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState({
    timer: true,
    calculator: true,
    formulas: true
  });

  // Listen for widget visibility changes from the widget manager
  useEffect(() => {
    const handleWidgetStateChange = () => {
      try {
        const widgetState = localStorage.getItem('widgetState');
        if (widgetState) {
          const parsedState = JSON.parse(widgetState);
          setActiveWidgets(parsedState);
          
          // Close any widgets that are now inactive
          if (!parsedState.timer) setShowTimer(false);
          if (!parsedState.calculator) setShowCalculator(false);
          if (!parsedState.formulas) setShowFormulas(false);
        }
      } catch (error) {
        console.error('Failed to parse widget state:', error);
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleWidgetStateChange);
    
    // Listen for custom events
    window.addEventListener('widgetStateChange', handleWidgetStateChange);
    
    // Initial load
    handleWidgetStateChange();
    
    return () => {
      window.removeEventListener('storage', handleWidgetStateChange);
      window.removeEventListener('widgetStateChange', handleWidgetStateChange);
    };
  }, []);

  const handleModalClose = (e: React.MouseEvent | KeyboardEvent) => {
    if (e.type === 'keydown' || e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  const handleShowWidget = (widgetType: 'timer' | 'calculator' | 'formulas') => {
    if (!activeWidgets[widgetType]) return;
    
    switch (widgetType) {
      case 'timer':
        setShowTimer(prev => !prev);
        break;
      case 'calculator':
        setShowCalculator(prev => !prev);
        break;
      case 'formulas':
        setShowFormulas(prev => !prev);
        break;
    }
  };

  const toggleWordBookmarks = () => {
    setShowWordBookmarks(prev => !prev);
  };

  return (
    <DndContext>
      <DragProvider>
        <SelectionProvider>
          <div className="min-h-screen bg-gray-50">
            {showModal && <ImageModal onClose={handleModalClose} />}

            {/* Widgets */}
            {showTimer && (
              <PomodoroTimer 
                onClose={() => setShowTimer(false)} 
                onTimeExpired={() => {}} 
              />
            )}
            {showCalculator && (
              <DesmosCalculator 
                onClose={() => setShowCalculator(false)} 
              />
            )}
            {showFormulas && (
              <FormulaBooklet 
                onClose={() => setShowFormulas(false)} 
              />
            )}
            {showWordBookmarks && (
              <WordBookmarkManager 
                onClose={() => setShowWordBookmarks(false)} 
              />
            )}

            <Header
              timeRemaining={state.timeRemaining}
              onShowTimer={() => handleShowWidget('timer')}
              onShowCalculator={() => handleShowWidget('calculator')}
              onShowFormulas={() => handleShowWidget('formulas')}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-white rounded-xl border shadow-sm">
                <QuestionImage onImageClick={() => setShowModal(true)} />

                <div className="flex flex-col lg:flex-row">
                  <QuestionPanel
                    question={sampleQuestion}
                    onShowWordBookmarks={toggleWordBookmarks}
                  />
                  <ChoicesPanel
                    choices={sampleQuestion.choices}
                    selectedChoice={state.selectedChoice}
                    onSelectChoice={handleSelectChoice}
                    onSubmit={handleSubmit}
                  />
                </div>
              </div>
            </main>
          </div>
        </SelectionProvider>
      </DragProvider>
    </DndContext>
  );
}
