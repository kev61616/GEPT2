'use client';

import React from 'react';
import { HeaderLogo } from './HeaderLogo';
import { Breadcrumb } from './Breadcrumb';
import { QuestionProgress } from './QuestionProgress';
import { DifficultyIndicator } from './DifficultyIndicator';
import { BookmarkButton } from './BookmarkButton';
import { WidgetToolbar } from './WidgetToolbar';

interface HeaderProps {
  timeRemaining: number;
  onShowTimer: () => void;
  onShowCalculator: () => void;
  onShowFormulas: () => void;
}

export function Header({
  timeRemaining,
  onShowTimer,
  onShowCalculator,
  onShowFormulas
}: HeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 font-bold text-xs">GEPT</span>
            </div>
            <div className="ml-3">
              <a href="#" className="text-xs text-gray-500">Reading</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <QuestionProgress 
              current={1} 
              total={10} 
              answeredQuestions={[2, 3]} 
              skippedQuestions={[4]} 
            />
            <DifficultyIndicator level="Medium" />
            <BookmarkButton 
              isBookmarked={false} 
              onClick={() => {
                // Toggle bookmark
              }} 
            />
            <WidgetToolbar
              timeRemaining={timeRemaining}
              onShowTimer={onShowTimer}
              onShowCalculator={onShowCalculator}
              onShowFormulas={onShowFormulas}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
