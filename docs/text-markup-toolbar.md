# Text Markup Toolbar

The Text Markup Toolbar provides highlighting and text formatting functionality for selected text.

## Component Implementation

```tsx
// TextMarkupToolbar.tsx
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
```

## Text Highlighting Implementation

The text highlighting functionality is implemented in a separate utility file:

```tsx
// textHighlight.ts
'use client';

// Function to highlight text in a given element
export function highlightText(element: HTMLElement, color: string): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  
  // Check if the selection is within the target element
  if (!element.contains(range.commonAncestorContainer)) return;
  
  try {
    // Clone the range to avoid modifying the original selection
    const safeRange = range.cloneRange();
    
    // Create a document fragment containing the contents of the range
    const contents = safeRange.extractContents();
    
    // Create a span for the formatting
    const span = document.createElement('span');
    
    // Apply the appropriate formatting based on the color value
    if (color === 'strikethrough') {
      span.style.textDecoration = 'line-through';
      span.style.textDecorationThickness = '2px'; // Make it more visible
      span.style.textDecorationColor = '#ef4444'; // Red color for better visibility
      span.className = 'highlight strikethrough';
    } else {
      span.style.backgroundColor = color;
      span.className = 'highlight';
    }
    
    // Append the contents to the span
    span.appendChild(contents);
    
    // Insert the span at the position of the range
    safeRange.insertNode(span);
    
    // Collapse the range to avoid multiple selections
    safeRange.collapse(true);
  } catch (e) {
    console.error('Failed to highlight text:', e);
  }
  
  // Clear the selection
  selection.removeAllRanges();
}

// Function to remove all highlights from an element
export function clearHighlights(element: HTMLElement): void {
  const highlights = element.querySelectorAll('.highlight');
  
  highlights.forEach(highlight => {
    const parent = highlight.parentNode;
    if (parent) {
      // Move all children out of the highlight span
      while (highlight.firstChild) {
        parent.insertBefore(highlight.firstChild, highlight);
      }
      // Remove the empty highlight span
      parent.removeChild(highlight);
    }
  });
}

// Function to get all highlighted text from an element
export function getHighlightedText(element: HTMLElement): string[] {
  const highlights = element.querySelectorAll('.highlight');
  return Array.from(highlights).map(h => h.textContent || '');
}
```

## Usage

To use the Text Markup Toolbar:

1. Wrap your content in a component that tracks text selection
2. Show the toolbar when text is selected
3. Position the toolbar above or below the selected text
4. Apply highlighting or formatting when toolbar buttons are clicked

Example usage in a parent component:

```tsx
function TextContent() {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);

  // Listen for text selection
  React.useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        setSelectedText(selection.toString());
        
        // Position the toolbar above the selection
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setToolbarPosition({
            top: rect.top + window.scrollY - 60,
            left: rect.left + rect.width / 2 + window.scrollX
          });
        }
      } else {
        setSelectedText('');
        setToolbarPosition(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const handleHighlight = (color: string) => {
    if (contentRef.current && selectedText) {
      highlightText(contentRef.current, color);
    }
  };

  const handleClearHighlights = () => {
    if (contentRef.current) {
      clearHighlights(contentRef.current);
    }
  };

  return (
    <div>
      <div ref={contentRef} className="prose">
        {/* Your content here */}
        <p>This is some text that can be highlighted.</p>
      </div>
      
      {selectedText && toolbarPosition && (
        <TextMarkupToolbar
          onHighlight={handleHighlight}
          onClear={handleClearHighlights}
          position={toolbarPosition}
        />
      )}
    </div>
  );
}
