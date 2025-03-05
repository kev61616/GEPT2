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
