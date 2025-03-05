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
  strikes?: string[]; // Array of wrong answer IDs
  onAddStrike?: (choiceId: string) => void; // Function to add a wrong answer
}

// For demo purposes, let's assume the correct answer is the second choice (B)
const CORRECT_ANSWER_ID = 'b';

export const ChoicesPanel = forwardRef<HTMLDivElement, ChoicesPanelProps>(
  ({ choices, selectedChoice, onSelectChoice, onSubmit, strikes = [], onAddStrike }, ref) => {
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
        // Add the selected choice to strikes if it's wrong
        if (selectedChoice && onAddStrike) {
          onAddStrike(selectedChoice);
        }
      }
    };

    // We'll use the document-level double-click handler from QuestionPanel

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
                  : strikes.includes(choice.id)
                    ? 'border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100/50 hover:shadow-sm'
                    : 'hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-sm border-gray-200'
              }`}
              onClick={() => onSelectChoice(choice.id)}
            >
              <CardContent className="p-4 flex items-center">
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
                >
                  {choice.text}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Question Navigation */}
        <div className="flex items-start mt-6">
          {/* Navigation buttons aligned left */}
          <div className="flex space-x-4">
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
              disabled={(answerStatus === 'correct' && countdown !== null)}
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
          
          {/* Feedback area - to the right of buttons */}
          <div className="flex-1 ml-6 flex items-center h-10">
            {answerStatus === 'correct' && (
              <div className="bg-green-100 text-green-800 p-2 rounded-md text-sm w-full">
                Correct! Moving to next question in {countdown}...
              </div>
            )}
            
            {answerStatus === 'incorrect' && (
              <div className="bg-red-100 text-red-800 p-2 rounded-md text-sm w-full">
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
