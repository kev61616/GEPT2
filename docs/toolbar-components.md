# Toolbar Components Documentation

This document provides a comprehensive guide to the toolbar components, their functionality, and implementation details. Use this as a reference to recreate these components in other projects.

## Table of Contents

1. [Text Markup Toolbar](#text-markup-toolbar)
2. [Word Definition System](#word-definition-system)
3. [Widget Toolbar](#widget-toolbar)
4. [Draggable Widget System](#draggable-widget-system)
5. [Context Providers](#context-providers)

## Component Documentation

For detailed documentation on each component, please refer to the following files:

- [Text Markup Toolbar](./text-markup-toolbar.md)
- [Word Definition System](./word-definition-system.md)
- [Widget Toolbar](./widget-toolbar.md)
- [Draggable Widget System](./draggable-widget-system.md)

For a concise summary of all components, see [Toolbar Components Summary](./toolbar-components-summary.md).

## Integration Guide

To integrate these components in your project:

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

5. **Create Draggable Widgets**:
   ```tsx
   function App() {
     const [showCalculator, setShowCalculator] = useState(false);
     
     return (
       <div>
         {/* App content */}
         {showCalculator && (
           <DraggableWidget
             id="calculator"
             title="Calculator"
             onClose={() => setShowCalculator(false)}
           >
             {/* Calculator content */}
           </DraggableWidget>
         )}
       </div>
     );
   }
   ```

## Dependencies

- React 18+
- TypeScript
- TailwindCSS for styling
- Lucide React for icons
- @dnd-kit/core and @dnd-kit/utilities for drag and drop
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
