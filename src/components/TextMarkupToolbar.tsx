'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface TextMarkupToolbarProps {
  onHighlight: (color: string) => void;
  onClear: () => void;
  position?: {
    top: number;
    left: number;
  };
}

export function TextMarkupToolbar({ 
  onHighlight, 
  onClear,
  position 
}: TextMarkupToolbarProps) {
  const colors = [
    { name: 'Yellow', value: '#FEFCBF' },
    { name: 'Green', value: '#C6F6D5' },
    { name: 'Blue', value: '#BEE3F8' },
    { name: 'Pink', value: '#FED7E2' },
  ];

  const handleHighlightClick = React.useCallback((color: string) => {
    onHighlight(color);
  }, [onHighlight]);

  const handleStrikethroughClick = React.useCallback(() => {
    // Use a special color value to indicate strikethrough
    onHighlight('strikethrough');
  }, [onHighlight]);

  const handleClearClick = React.useCallback(() => {
    onClear();
  }, [onClear]);

  return (
    <div 
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center space-x-2 z-50"
      style={{
        top: position ? `${position.top}px` : 'auto',
        left: position ? `${position.left}px` : '50%',
        transform: position ? 'translateX(-50%)' : 'translate(-50%, 0)',
        bottom: position ? 'auto' : '1rem'
      }}
    >
      <div className="text-sm font-medium text-gray-700 mr-2">Highlight:</div>
      
      <div className="flex space-x-1">
        {colors.map(color => (
          <button
            key={color.name}
            onClick={() => handleHighlightClick(color.value)}
            className="w-6 h-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{ backgroundColor: color.value }}
            title={`Highlight ${color.name}`}
          />
        ))}
        
        {/* Strikethrough button */}
        <button
          onClick={handleStrikethroughClick}
          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          title="Strikethrough"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <path d="M16 6c-.5-2-2.5-3-4.5-3S7.5 4 7 6" />
            <path d="M8 18c.5 2 2.5 3 4.5 3s4-1 4.5-3" />
          </svg>
        </button>
        
        {/* Eraser (Clear) button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearClick}
          className="text-gray-500 flex items-center justify-center w-6 h-6 p-0"
          title="Clear formatting"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 20H7L3 16c-1.5-1.5-1.5-3.5 0-5l7-7c1.5-1.5 3.5-1.5 5 0l5 5c1.5 1.5 1.5 3.5 0 5l-4 4" />
            <path d="M11 11l4 4" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
