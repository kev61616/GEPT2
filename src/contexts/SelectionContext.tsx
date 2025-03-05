'use client';

import React, { useEffect } from 'react';
import { useLayout } from './LayoutContext';

interface SelectionContextType {
  selectedText: string;
  setSelectedText: (text: string) => void;
  doubleClickedWord: string | null;
  setDoubleClickedWord: (word: string | null) => void;
  doubleClickPosition: { top: number; left: number } | null;
  setDoubleClickPosition: (position: { top: number; left: number } | null) => void;
}

// Ensure we're initializing with a non-null value
const SelectionContext = React.createContext<SelectionContextType>({
  selectedText: '',
  setSelectedText: () => {},
  doubleClickedWord: null,
  setDoubleClickedWord: () => {},
  doubleClickPosition: null,
  setDoubleClickPosition: () => {}
});

// Local storage keys
const WORD_STORAGE_KEY = 'doubleClickedWord';
const POSITION_STORAGE_KEY = 'doubleClickPosition';

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const { isSATLayout } = useLayout();
  const [selectedText, setSelectedText] = React.useState('');
  const [doubleClickedWord, setDoubleClickedWord] = React.useState<string | null>(null);
  const [doubleClickPosition, setDoubleClickPosition] = React.useState<{ top: number; left: number } | null>(null);

  // Load persisted state from localStorage on initial render
  useEffect(() => {
    try {
      // Load word
      const savedWord = localStorage.getItem(WORD_STORAGE_KEY);
      if (savedWord) {
        setDoubleClickedWord(savedWord);
      }

      // Load position
      const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
      if (savedPosition) {
        setDoubleClickPosition(JSON.parse(savedPosition));
      }
    } catch (error) {
      console.error('Error loading selection state from localStorage:', error);
    }
  }, []);

  // Custom setters that update localStorage
  const handleSetDoubleClickedWord = (word: string | null) => {
    setDoubleClickedWord(word);
    try {
      if (word) {
        localStorage.setItem(WORD_STORAGE_KEY, word);
      } else {
        localStorage.removeItem(WORD_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving word to localStorage:', error);
    }
  };

  const handleSetDoubleClickPosition = (position: { top: number; left: number } | null) => {
    setDoubleClickPosition(position);
    try {
      if (position) {
        localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
      } else {
        localStorage.removeItem(POSITION_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving position to localStorage:', error);
    }
  };

  // Listen for text selection
  React.useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        setSelectedText(selection.toString());
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Handle double-click on words
  React.useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      console.log('Double-click event triggered', e.target);
      
      // We now enable word definition in SAT layout
      console.log('Word definition enabled in all layouts');
      
      // Only process double-clicks on text elements
      if (e.target instanceof HTMLElement) {
        // Get the text content of the target element
        const targetText = e.target.textContent || '';
        
        // Get the selection
        const selection = window.getSelection();
        if (!selection) return;
        
        // If there's a selection, use it
        if (selection.toString().trim()) {
          const selectedWord = selection.toString().trim();
          console.log('Selected word from selection:', selectedWord);
          
          // Only process if it's a single word (no spaces)
          if (selectedWord.indexOf(' ') === -1) {
            // Get the position for the definition bar
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            const position = {
              top: rect.top + window.scrollY - 10, // Position slightly above the word
              left: rect.left + rect.width / 2 + window.scrollX // Center it
            };
            
            handleSetDoubleClickedWord(selectedWord);
            handleSetDoubleClickPosition(position);
            return;
          }
        }
        
        // If no valid selection, try to extract the word at the click position
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        // Create a range at the click position
        const range = document.caretRangeFromPoint(clickX, clickY);
        if (!range) return;
        
        // Get the text node and offset
        const textNode = range.startContainer;
        const offset = range.startOffset;
        
        // Only proceed if we have a text node
        if (textNode.nodeType !== Node.TEXT_NODE) return;
        
        const text = textNode.textContent || '';
        
        // Find the word boundaries
        let startPos = offset;
        let endPos = offset;
        
        // Find the start of the word
        while (startPos > 0 && /\w/.test(text[startPos - 1])) {
          startPos--;
        }
        
        // Find the end of the word
        while (endPos < text.length && /\w/.test(text[endPos])) {
          endPos++;
        }
        
        // Extract the word
        const word = text.substring(startPos, endPos).trim();
        console.log('Word from click position:', word);
        
        // Only process if it's a valid word
        if (word && word.length > 0 && word.indexOf(' ') === -1) {
          // Get the position for the definition bar
          const rect = range.getBoundingClientRect();
          
          const position = {
            top: rect.top + window.scrollY - 10, // Position slightly above the word
            left: rect.left + rect.width / 2 + window.scrollX // Center it
          };
          
          handleSetDoubleClickedWord(word);
          handleSetDoubleClickPosition(position);
        }
      }
    };

    document.addEventListener('dblclick', handleDoubleClick);
    
    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [isSATLayout]); // Add isSATLayout as a dependency

  const contextValue = React.useMemo(() => ({
    selectedText,
    setSelectedText,
    doubleClickedWord,
    setDoubleClickedWord: handleSetDoubleClickedWord,
    doubleClickPosition,
    setDoubleClickPosition: handleSetDoubleClickPosition
  }), [selectedText, doubleClickedWord, doubleClickPosition]);

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = React.useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}
