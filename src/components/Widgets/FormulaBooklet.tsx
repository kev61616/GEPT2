'use client';

import React, { useState, useRef } from 'react';
import { DraggableWidget } from '@/components/DraggableWidget';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface FormulaBookletProps {
  onClose: () => void;
}

export function FormulaBooklet({ onClose }: FormulaBookletProps) {
  // Use static initial values to avoid hydration mismatch
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <DraggableWidget 
      id="formula-booklet" 
      onClose={onClose} 
      title="Math Formula Sheet" 
      anchorTo="formulas"
    >
      <div className={`p-2 ${isFullscreen ? 'w-[90vw] h-[80vh]' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={zoomOut}
              title="Zoom out"
            >
              -
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetZoom}
              title="Reset zoom"
            >
              {Math.round(scale * 100)}%
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={zoomIn}
              title="Zoom in"
            >
              +
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? "Exit" : "Fullscreen"}
          </Button>
        </div>
        
        <ScrollArea className={isFullscreen ? "h-[calc(80vh-60px)]" : "h-[400px]"}>
          <div className="relative" style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.2s ease' }}>
            <Image
              ref={imageRef}
              src="/images/math_formula_sheet.png"
              alt="Math Formula Sheet"
              width={isFullscreen ? 1200 : 600}
              height={isFullscreen ? 1600 : 800}
              className="rounded-md"
              style={{ width: isFullscreen ? 'auto' : '100%', height: 'auto' }}
              priority
            />
          </div>
        </ScrollArea>
      </div>
    </DraggableWidget>
  );
}
