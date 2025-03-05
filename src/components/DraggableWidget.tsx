'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDrag } from './DragContext';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableWidgetProps {
  id: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  anchorTo?: 'timer' | 'calculator' | 'formulas';
}

export function DraggableWidget({ 
  id, 
  title, 
  onClose, 
  children, 
  anchorTo 
}: DraggableWidgetProps) {
  // Default position is centered at the top
  const [position, setPosition] = useState({ x: 20, y: 70 });
  const [hasMoved, setHasMoved] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { setIsDragging } = useDrag();
  const headerRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  // Calculate initial position - center in the page
  const calculateInitialPosition = () => {
    if (!isMounted) return { x: 20, y: 70 };
    
    const headerHeight = 64; // Height of the header
    const widgetWidth = 320; // Width of the widget
    const widgetHeight = 400; // Approximate height of the widget
    
    // Center the widget in the page
    const xPosition = Math.max(10, (window.innerWidth - widgetWidth) / 2);
    const yPosition = Math.max(headerHeight + 10, (window.innerHeight - widgetHeight) / 2);
    
    return { x: xPosition, y: yPosition };
  };

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load saved position or set initial position
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const savedPosition = localStorage.getItem(`widget-position-${id}`);
      if (savedPosition) {
        const parsedPosition = JSON.parse(savedPosition);
        setPosition(parsedPosition);
        setHasMoved(true);
      } else if (anchorTo) {
        // Only set initial position if no saved position exists
        setPosition(calculateInitialPosition());
      }
    } catch (error) {
      console.error('Failed to load widget position:', error);
      if (anchorTo) {
        setPosition(calculateInitialPosition());
      }
    }
  }, [id, anchorTo, isMounted]);

  // Update position when dragging ends
  useEffect(() => {
    if (!transform || !isMounted) return;
    
    const newX = position.x + (transform.x || 0);
    const newY = position.y + (transform.y || 0);
    
    // Only update when dragging ends
    if (transform.x === 0 && transform.y === 0) {
      setPosition({ x: newX, y: newY });
      setHasMoved(true);
      
      try {
        localStorage.setItem(`widget-position-${id}`, JSON.stringify({ x: newX, y: newY }));
      } catch (error) {
        console.error('Failed to save widget position:', error);
      }
    }
  }, [transform, id, position, isMounted]);

  // Reset position when double-clicking the header
  const handleDoubleClick = () => {
    if (!anchorTo || !isMounted) return;
    
    const newPosition = calculateInitialPosition();
    setPosition(newPosition);
    setHasMoved(false);
    
    try {
      localStorage.removeItem(`widget-position-${id}`);
    } catch (error) {
      console.error('Failed to remove widget position:', error);
    }
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    left: `${position.x}px`,
    top: `${position.y}px`,
    transition: transform ? undefined : 'box-shadow 0.2s ease',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`absolute bg-white rounded-lg shadow-lg border border-gray-200 w-80 z-50 ${
        transform ? 'shadow-xl' : ''
      }`}
    >
      <div
        ref={headerRef}
        className={`flex items-center justify-between p-3 ${
          hasMoved ? 'bg-gray-100' : 'bg-blue-50'
        } rounded-t-lg`}
        onDoubleClick={handleDoubleClick}
      >
        <div className="flex items-center">
          {/* Drag handle */}
          <div 
            className="mr-2 text-gray-400 hover:text-gray-600 cursor-move flex items-center"
            {...attributes}
            {...listeners}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            title="Drag to move"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="5" r="1" />
              <circle cx="9" cy="12" r="1" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="15" cy="5" r="1" />
              <circle cx="15" cy="12" r="1" />
              <circle cx="15" cy="19" r="1" />
            </svg>
          </div>
          
          {anchorTo && hasMoved && (
            <span 
              className="text-xs text-blue-500 mr-2 cursor-pointer" 
              onClick={handleDoubleClick}
              title="Reset position"
            >
              ↺
            </span>
          )}
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ✕
        </button>
      </div>
      <div className="overflow-hidden p-2">{children}</div>
    </div>
  );
}
