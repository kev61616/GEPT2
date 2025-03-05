'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { Choice } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSelection } from '@/contexts/SelectionContext';

interface ChoicesPanelProps {
  choices: Choice[];
  selectedChoice: string | null;
  onSelectChoice: (id: string) => void;
  onSubmit: () => void;
}

// For demo purposes, let's assume the correct answer is the second choice (B)
const CORRECT_ANSWER_ID = 'b';

export const ChoicesPanel = forwardRef<HTMLDivElement, ChoicesPanelProps>(
  ({ choices, selectedChoice, onSelectChoice, onSubmit }, ref) => {
    // State for answer checking
    const [answerStatus, setAnswerStatus] = useState<'unchecked' | 'correct' | 'incorrect'>('unchecked');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);
    const { setDoubleClickedWord, setDoubleClickPosition } = useSelection();

    // Map choice IDs to letters A, B, C, D
    const getChoiceLetter = (index: number): string => {
      return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
    };

    // Handle countdown timer
    useEffect(() => {
      if (countdown !== null) {
        if (countdown > 0) {
          const interval = setTimeout(() => {
            setCountdown(countdown - 1);
          }, 1000);
          setCountdownInterval(interval);
          return () => clearTimeout(interval);
        } else {
          // Move to next question when countdown reaches 0
          console.log('Moving to next question');
          setAnswerStatus('unchecked');
          setCountdown(null);
        }
      }
    }, [countdown]);

    // Clean up interval on unmount
    useEffect(() => {
      return () => {
        if (countdownInterval) {
          clearTimeout(countdownInterval);
        }
      };
    }, [countdownInterval]);

    // Handle check answer button click
    const handleCheckAnswer = () => {
      if (answerStatus === 'correct') {
        // If already correct, do nothing (waiting for countdown)
        return;
      }
      
      if (selectedChoice === CORRECT_ANSWER_ID) {
        setAnswerStatus('correct');
        setCountdown(5); // Start 5 second countdown
      } else {
        setAnswerStatus('incorrect');
      }
    };

    // Handle double-click for word definition
    const handleDoubleClick = (e: React.MouseEvent) => {
      console.log('ChoicesPanel - handleDoubleClick triggered!');
      console.log('Target:', e.target);
      console.log('Current selection:', window.getSelection()?.toString());
      
      // Only process double-clicks on text elements
      if (e.target instanceof HTMLElement) {
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

    return (
      <div 
        ref={ref} 
        className="w-full lg:w-1/2 p-6"
        style={{ transition: 'min-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <h2 className="text-lg font-medium mb-4">Select an Answer</h2>
        
        <div className="space-y-3 mb-6">
          {choices.map((choice, index) => (
            <Card
              key={choice.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedChoice === choice.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-sm border-gray-200'
              }`}
              onClick={() => onSelectChoice(choice.id)}
            >
              <CardContent className="p-4 flex items-start">
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${
                    selectedChoice === choice.id
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {getChoiceLetter(index)}
                </div>
                <div 
                  className="text-sm"
                  onDoubleClick={handleDoubleClick}
                >
                  {choice.text}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button
          onClick={onSubmit}
          disabled={!selectedChoice}
          className="w-full mb-6"
        >
          Submit Answer
        </Button>
        
        {/* Question Navigation */}
        <div className="flex flex-col space-y-4">
          {/* Navigation buttons centered */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="flex items-center space-x-1 w-36 justify-center"
              onClick={() => console.log('Previous question')}
              disabled={answerStatus === 'correct' && countdown !== null}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>Previous</span>
            </Button>
            
            <Button
              variant={answerStatus === 'correct' ? 'default' : 'outline'}
              className={`flex items-center space-x-1 w-36 justify-center ${
                answerStatus === 'correct' ? 'bg-green-200 hover:bg-green-300 text-green-800 border-green-300' : ''
              }`}
              onClick={handleCheckAnswer}
              disabled={!selectedChoice || (answerStatus === 'correct' && countdown !== null)}
            >
              <span>
                {answerStatus === 'correct' 
                  ? `Next (${countdown})` 
                  : answerStatus === 'incorrect' 
                    ? 'Check Again' 
                    : 'Check Answer'}
              </span>
            </Button>
          </div>
          
          {/* Feedback area */}
          <div className="text-center">
            {answerStatus === 'correct' && (
              <div className="bg-green-100 text-green-800 p-3 rounded-md">
                Correct! Moving to next question in {countdown}...
              </div>
            )}
            
            {answerStatus === 'incorrect' && (
              <div className="bg-red-100 text-red-800 p-3 rounded-md">
                That's not quite right. Please check your answer again.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// Add display name for debugging
ChoicesPanel.displayName = 'ChoicesPanel';
