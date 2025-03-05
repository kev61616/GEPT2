'use client';

import React, { useState, useEffect } from 'react';
import { DraggableWidget } from '@/components/DraggableWidget';
import { Button } from '@/components/ui/button';

interface DesmosCalculatorProps {
  onClose: () => void;
}

export function DesmosCalculator({ onClose }: DesmosCalculatorProps) {
  // Use static initial values to avoid hydration mismatch
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [calculatorType, setCalculatorType] = useState<'scientific' | 'graphing'>('scientific');
  const [isMounted, setIsMounted] = useState(false);

  // Only render iframe after component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleCalculatorType = () => {
    setCalculatorType(prev => prev === 'scientific' ? 'graphing' : 'scientific');
  };

  // Determine the calculator URL based on the type
  const calculatorUrl = calculatorType === 'scientific' 
    ? 'https://www.desmos.com/scientific' 
    : 'https://www.desmos.com/calculator';

  return (
    <DraggableWidget 
      id="desmos-calculator" 
      onClose={onClose} 
      title={`Desmos ${calculatorType === 'scientific' ? 'Scientific' : 'Graphing'} Calculator`} 
      anchorTo="calculator"
    >
      <div className={`p-2 ${isFullscreen ? 'w-[90vw] h-[80vh]' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleCalculatorType}
            title={`Switch to ${calculatorType === 'scientific' ? 'graphing' : 'scientific'} calculator`}
          >
            {calculatorType === 'scientific' ? 'Switch to Graphing' : 'Switch to Scientific'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? "Exit" : "Fullscreen"}
          </Button>
        </div>
        
        <div className={isFullscreen ? "h-[calc(80vh-60px)]" : "h-[400px]"}>
          {isMounted && (
            <iframe
              src={calculatorUrl}
              title={`Desmos ${calculatorType} Calculator`}
              width="100%"
              height="100%"
              style={{ border: 'none', borderRadius: '4px' }}
              allow="clipboard-write"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </DraggableWidget>
  );
}
