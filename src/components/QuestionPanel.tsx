'use client';

import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { Question } from '@/types/quiz';
import { highlightText, clearHighlights } from '@/lib/textHighlight';
import { useSelection } from '@/contexts/SelectionContext';
import { Card, CardContent } from '@/components/ui/card';
import { TextMarkupToolbar } from './TextMarkupToolbar';
import { WordDefinitionBar } from './WordDefinitionBar';

interface QuestionPanelProps {
  question: Question;
  onShowWordBookmarks?: () => void;
}

interface ToolbarPosition {
  top: number;
  left: number;
}

export const QuestionPanel = forwardRef<HTMLDivElement, QuestionPanelProps>(
  ({ question, onShowWordBookmarks }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { selectedText, doubleClickedWord, doubleClickPosition, setDoubleClickedWord, setDoubleClickPosition } = useSelection();
    const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition | null>(null);
    
    // Debug: Log when doubleClickedWord or doubleClickPosition changes
    useEffect(() => {
      console.log('QuestionPanel - doubleClickedWord:', doubleClickedWord);
      console.log('QuestionPanel - doubleClickPosition:', doubleClickPosition);
    }, [doubleClickedWord, doubleClickPosition]);
    
    useEffect(() => {
      if (selectedText) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // Position the toolbar 60px above the selection
          setToolbarPosition({
            top: rect.top + window.scrollY - 60, // 60px above the selection
            left: rect.left + rect.width / 2 + window.scrollX // Centered
          });
        }
      } else {
        setToolbarPosition(null);
      }
    }, [selectedText]);

    const handleHighlight = (color: string) => {
      if (contentRef.current && selectedText) {
        highlightText(contentRef.current, color);
      }
    };

    const handleClearHighlights = () => {
      if (contentRef.current) {
        clearHighlights(contentRef.current);
      }
    };

    const handleCloseDefinition = () => {
      // Always clear the word since we removed the pin functionality
      setDoubleClickedWord(null);
      setDoubleClickPosition(null);
    };

    // Add a document-level double-click handler
    useEffect(() => {
      const handleDocumentDoubleClick = (e: MouseEvent) => {
        console.log('Document double-click event triggered!');
        console.log('Target:', e.target);
        console.log('Current selection:', window.getSelection()?.toString());
        
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
              
              setDoubleClickedWord(selectedWord);
              setDoubleClickPosition(position);
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
            
            setDoubleClickedWord(word);
            setDoubleClickPosition(position);
          }
        }
      };
      
      // Add the event listener
      document.addEventListener('dblclick', handleDocumentDoubleClick);
      
      // Clean up
      return () => {
        document.removeEventListener('dblclick', handleDocumentDoubleClick);
      };
    }, [setDoubleClickedWord, setDoubleClickPosition]);

    return (
      <div 
        ref={ref} 
        className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r"
        style={{ transition: 'min-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <h2 className="text-lg font-medium mb-4">
          Question
        </h2>
        
        <Card>
          <CardContent className="p-6">
            <div 
              ref={contentRef}
              className="prose prose-sm max-w-none"
            >
              <p>{question.text}</p>
            </div>
          </CardContent>
        </Card>
        
        {selectedText && toolbarPosition && (
          <TextMarkupToolbar
            onHighlight={handleHighlight}
            onClear={handleClearHighlights}
            position={toolbarPosition}
          />
        )}

        {doubleClickedWord && doubleClickPosition && (
          <WordDefinitionBar
            word={doubleClickedWord}
            position={doubleClickPosition}
            onClose={handleCloseDefinition}
            onShowWordBookmarks={onShowWordBookmarks}
          />
        )}
      </div>
    );
  }
);

// Add display name for debugging
QuestionPanel.displayName = 'QuestionPanel';
