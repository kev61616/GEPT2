# Toolbar Components Summary

This document provides a summary of the key toolbar components and their implementation details.

## 1. Text Markup Toolbar

The Text Markup Toolbar allows users to highlight text in different colors and apply strikethrough formatting.

### Key Features:
- Color highlighting with customizable colors
- Strikethrough formatting
- Clear formatting option
- Positioning relative to selected text

### Implementation:
- `TextMarkupToolbar.tsx`: UI component with color buttons
- `textHighlight.ts`: Utility functions for applying and removing highlights
- Uses DOM manipulation to wrap selected text in styled spans

## 2. Word Definition System

The Word Definition System shows definitions when users double-click on words.

### Key Features:
- Double-click word detection
- Definition fetching and caching
- Animated popup with smart positioning
- Word bookmarking functionality
- Draggable popup

### Implementation:
- `SelectionContext.tsx`: Context provider for tracking text selection and double-clicks
- `useWordDefinition.ts`: Hook for fetching and caching word definitions
- `useWordBookmarks.ts`: Hook for managing bookmarked words
- `WordDefinitionBar.tsx`: Popup component for displaying definitions

## 3. Widget Toolbar

The Widget Toolbar provides access to various tools and widgets.

### Key Features:
- Responsive design (desktop/mobile views)
- Tool toggles with active states
- Dropdown menu for mobile
- Timer display

### Implementation:
- `WidgetToolbar.tsx`: Main toolbar component
- `useWidgetState.ts`: Hook for managing widget visibility
- Responsive design with different layouts for desktop and mobile

## 4. Draggable Widget System

The Draggable Widget System allows widgets to be moved around the screen.

### Key Features:
- Drag and drop functionality
- Position persistence
- Reset position option
- Boundary detection

### Implementation:
- `DragContext.tsx`: Context provider for drag state
- `DraggableWidget.tsx`: Wrapper component for making widgets draggable
- Uses mouse events for dragging
- Stores positions in localStorage

## Integration Guide

To integrate these components in another project:

1. **Setup Context Providers**:
   ```tsx
   <DragProvider>
     <SelectionProvider>
       {/* Your app content */}
     </SelectionProvider>
   </DragProvider>
   ```

2. **Add Text Markup Functionality**:
   ```tsx
   function TextContent() {
     const contentRef = useRef<HTMLDivElement>(null);
     const [selectedText, setSelectedText] = useState('');
     
     // Show toolbar when text is selected
     // Apply highlighting when toolbar buttons are clicked
     
     return (
       <div ref={contentRef}>
         {/* Content */}
         {selectedText && <TextMarkupToolbar />}
       </div>
     );
   }
   ```

3. **Add Word Definition Functionality**:
   ```tsx
   function Content() {
     const { doubleClickedWord, doubleClickPosition } = useSelection();
     
     return (
       <div>
         {/* Content */}
         {doubleClickedWord && doubleClickPosition && (
           <WordDefinitionBar 
             word={doubleClickedWord}
             position={doubleClickPosition}
             onClose={() => {/* Clear word */}}
           />
         )}
       </div>
     );
   }
   ```

4. **Add Widget Toolbar**:
   ```tsx
   function Header() {
     return (
       <header>
         {/* Other header content */}
         <WidgetToolbar 
           timeRemaining={timeRemaining}
           onShowTimer={() => {/* Show timer */}}
           onShowCalculator={() => {/* Show calculator */}}
           onShowFormulas={() => {/* Show formulas */}}
         />
       </header>
     );
   }
   ```

## Dependencies

- React 18+
- TypeScript
- TailwindCSS for styling
- Lucide React for icons
- localStorage for persistence

## Styling

The components use TailwindCSS for styling. Key classes include:

- Fixed positioning: `fixed z-50`
- Backgrounds: `bg-white/90 backdrop-blur-md`
- Shadows: `shadow-lg shadow-xl`
- Borders: `border border-gray-200 rounded-lg rounded-xl`
- Animations: `animate-in fade-in zoom-in-75 duration-500 ease-in-out`
- Transitions: `transition-all duration-300`
- Hover effects: `hover:bg-gray-100 hover:text-gray-600`

## Animation Techniques

- Entry animations using `animate-in` with `fade-in` and `zoom-in-75`
- Transform origin set to the clicked word: `transformOrigin: ${position.left}px ${position.top}px`
- Hover animations using `transition-all duration-300 hover:translate-x-1`
- Loading state animations using `animate-pulse`
