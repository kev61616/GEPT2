'use client';

import React, { useState } from 'react';
import '@/styles/breakpoints.css'; // Import the breakpoints CSS
import { QuestionProgressPopup } from '@/components/QuestionProgressPopup';

interface QuestionProgressProps {
  current: number;
  total: number;
  answeredQuestions?: number[];
  skippedQuestions?: number[];
}

export function QuestionProgress({ 
  current, 
  total,
  answeredQuestions = [],
  skippedQuestions = []
}: QuestionProgressProps) {
  const [showPopup, setShowPopup] = useState(false);
  
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  
  return (
    <>
      <div 
        className="items-center cursor-pointer group"
        onClick={togglePopup}
      >
        <div className="text-sm text-gray-600 font-medium flex items-center space-x-1 group-hover:text-blue-600 transition-colors">
          <span>Question {current} of {total}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transform group-hover:rotate-180 transition-transform duration-200"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      {showPopup && (
        <QuestionProgressPopup
          currentQuestion={current}
          totalQuestions={total}
          answeredQuestions={answeredQuestions}
          skippedQuestions={skippedQuestions}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
