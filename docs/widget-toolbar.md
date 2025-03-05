# Widget Toolbar

The Widget Toolbar provides access to various tools and widgets with a responsive design that adapts to different screen sizes.

## Component Implementation

```tsx
// WidgetToolbar.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useWidgetState } from '@/hooks/useWidgetState';
import '@/styles/breakpoints.css'; // Import the breakpoints CSS

interface WidgetToolbarProps {
  timeRemaining: number;
  onShowTimer: () => void;
  onShowCalculator: () => void;
  onShowFormulas: () => void;
}

export function WidgetToolbar({
  timeRemaining,
  onShowTimer,
  onShowCalculator,
  onShowFormulas
}: WidgetToolbarProps) {
  const { state, toggleWidget } = useWidgetState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {/* Timer display - hidden on mobile */}
      <div className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">
        {formatTime(timeRemaining)}
      </div>
      
      {/* Desktop view - show all gadget buttons */}
      <div className="desktop-widgets space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            toggleWidget('timer');
            onShowTimer();
          }}
          className={`${state.timer ? 'text-blue-600' : 'text-gray-300'}`}
          title={state.timer ? "Timer (Enabled)" : "Timer (Disabled)"}
          disabled={!state.timer}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            toggleWidget('calculator');
            onShowCalculator();
          }}
          className={`${state.calculator ? 'text-blue-600' : 'text-gray-300'}`}
          title={state.calculator ? "Calculator (Enabled)" : "Calculator (Disabled)"}
          disabled={!state.calculator}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="10" y2="10" />
            <line x1="12" y1="10" x2="14" y2="10" />
            <line x1="16" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="10" y2="14" />
            <line x1="12" y1="14" x2="14" y2="14" />
            <line x1="16" y1="14" x2="16" y2="14" />
            <line x1="8" y1="18" x2="10" y2="18" />
            <line x1="12" y1="18" x2="14" y2="18" />
            <line x1="16" y1="18" x2="16" y2="18" />
          </svg>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            toggleWidget('formulas');
            onShowFormulas();
          }}
          className={`${state.formulas ? 'text-blue-600' : 'text-gray-300'}`}
          title={state.formulas ? "Formula Booklet (Enabled)" : "Formula Booklet (Disabled)"}
          disabled={!state.formulas}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </Button>
      </div>
      
      {/* Mobile view - cogwheel dropdown */}
      <div className="mobile-widgets relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-gray-500"
          title="Tools"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Button>
        
        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">
              {formatTime(timeRemaining)}
            </div>
            
            <button
              onClick={() => {
                toggleWidget('timer');
                if (state.timer) onShowTimer();
                setDropdownOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                state.timer ? 'text-blue-600' : 'text-gray-400'
              } hover:bg-gray-100`}
              disabled={!state.timer}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Timer
            </button>
            
            <button
              onClick={() => {
                toggleWidget('calculator');
                if (state.calculator) onShowCalculator();
                setDropdownOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                state.calculator ? 'text-blue-600' : 'text-gray-400'
              } hover:bg-gray-100`}
              disabled={!state.calculator}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="10" y2="10" />
                <line x1="12" y1="10" x2="14" y2="10" />
                <line x1="16" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="10" y2="14" />
                <line x1="12" y1="14" x2="14" y2="14" />
                <line x1="16" y1="14" x2="16" y2="14" />
                <line x1="8" y1="18" x2="10" y2="18" />
                <line x1="12" y1="18" x2="14" y2="18" />
                <line x1="16" y1="18" x2="16" y2="18" />
              </svg>
              Calculator
            </button>
            
            <button
              onClick={() => {
                toggleWidget('formulas');
                if (state.formulas) onShowFormulas();
                setDropdownOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                state.formulas ? 'text-blue-600' : 'text-gray-400'
              } hover:bg-gray-100`}
              disabled={!state.formulas}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Formula Booklet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Widget State Hook

The widget state is managed by a custom hook:

```tsx
// useWidgetState.ts
'use client';

import { useState, useEffect } from 'react';

interface WidgetState {
  timer: boolean;
  calculator: boolean;
  formulas: boolean;
}

const STORAGE_KEY = 'widgetState';

export function useWidgetState() {
  const [state, setState] = useState<WidgetState>(() => {
    // Default state - all widgets enabled
    const defaultState: WidgetState = {
      timer: true,
      calculator: true,
      formulas: true
    };
    
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultState;
      } catch (error) {
        console.error('Failed to load widget state:', error);
      }
    }
    
    return defaultState;
  });
  
  // Save state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save widget state:', error);
      }
    }
  }, [state]);
  
  // Toggle a widget's enabled state
  const toggleWidget = (widget: keyof WidgetState) => {
    setState(prev => ({
      ...prev,
      [widget]: !prev[widget]
    }));
  };
  
  return { state, toggleWidget };
}
```

## Responsive Design

The Widget Toolbar uses responsive design to adapt to different screen sizes:

```css
/* breakpoints.css */
@media (min-width: 640px) {
  .mobile-widgets {
    display: none;
  }
}

@media (max-width: 639px) {
  .desktop-widgets {
    display: none;
  }
}
```

## Usage

To use the Widget Toolbar:

```tsx
function Header() {
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  
  const handleShowTimer = () => {
    // Show timer widget
  };
  
  const handleShowCalculator = () => {
    // Show calculator widget
  };
  
  const handleShowFormulas = () => {
    // Show formula booklet widget
  };
  
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div>
        {/* Other header content */}
      </div>
      
      <WidgetToolbar
        timeRemaining={timeRemaining}
        onShowTimer={handleShowTimer}
        onShowCalculator={handleShowCalculator}
        onShowFormulas={handleShowFormulas}
      />
    </header>
  );
}
