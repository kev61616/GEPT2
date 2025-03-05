'use client';

import React from 'react';
import '@/styles/breakpoints.css'; // Import the breakpoints CSS

interface DifficultyIndicatorProps {
  level: 'Easy' | 'Medium' | 'Hard';
}

export function DifficultyIndicator({ level }: DifficultyIndicatorProps) {
  const getColor = () => {
    switch (level) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getDifficultyLevel = () => {
    switch (level) {
      case 'Easy':
        return 1;
      case 'Medium':
        return 3;
      case 'Hard':
        return 5;
      default:
        return 0;
    }
  };

  const renderDots = () => {
    const difficultyLevel = getDifficultyLevel();
    const color = getColor();
    const dots = [];

    for (let i = 0; i < 5; i++) {
      dots.push(
        <div 
          key={i} 
          className={`w-2 h-2 rounded-full ${i < difficultyLevel ? color : 'bg-gray-200'}`}
        />
      );
    }

    return dots;
  };

  return (
    <div className="flex items-center space-x-1 px-2 py-1">
      {renderDots()}
    </div>
  );
}
