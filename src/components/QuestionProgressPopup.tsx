'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface QuestionProgressPopupProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number[];
  skippedQuestions: number[];
  onClose: () => void;
}

export function QuestionProgressPopup({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  skippedQuestions,
  onClose
}: QuestionProgressPopupProps) {
  // Create an array of question numbers from 1 to totalQuestions
  const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  
  // Determine the status of each question
  const getQuestionStatus = (questionNumber: number) => {
    if (questionNumber === currentQuestion) return 'current';
    if (answeredQuestions.includes(questionNumber)) return 'answered';
    if (skippedQuestions.includes(questionNumber)) return 'skipped';
    return 'unattempted';
  };
  
  // Get the appropriate class for each question based on its status
  const getQuestionClass = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-blue-500 text-white border-blue-600';
      case 'answered':
        return 'bg-green-500 text-white border-green-600';
      case 'skipped':
        return 'bg-yellow-500 text-white border-yellow-600';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };
  
  // Handle click outside to close the popup
  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center"
      onClick={handleClickOutside}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      <Card className="mt-20 w-80 p-4 z-10 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Question Progress</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-5 gap-2 mb-4">
          {questionNumbers.map((num) => {
            const status = getQuestionStatus(num);
            return (
              <div
                key={num}
                className={`w-12 h-12 rounded-md border flex items-center justify-center font-medium text-sm cursor-pointer transition-all hover:scale-105 ${getQuestionClass(status)}`}
                onClick={() => console.log(`Navigate to question ${num}`)}
              >
                {num}
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Answered: {answeredQuestions.length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span>Skipped: {skippedQuestions.length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
            <span>Remaining: {totalQuestions - answeredQuestions.length - skippedQuestions.length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
