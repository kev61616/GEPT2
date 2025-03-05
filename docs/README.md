# Tech Assessment Quiz Application

A modern, interactive quiz application built with React and TypeScript, featuring an elegant UI and smooth interactions.

## Features

### 1. Question Display
- Clean, card-based layout with clear separation between question and answer sections
- Rich text formatting support for questions with bullet points and multiple paragraphs
- Visual hierarchy using typography and spacing to improve readability

### 2. Interactive Data Visualization
The application includes an interactive graph component with the following features:

#### Thumbnail View
- Responsive image display with rounded corners and subtle shadow
- Hover effects:
  - Smooth scale animation (2% increase in size)
  - Gradient overlay fading from bottom to top
  - Magnifying glass icon with "Click to enlarge" text
  - Drop shadow on hover text for better contrast
- Accessible cursor indicators showing interactive elements

#### Modal View
- Full-screen modal with semi-transparent backdrop (60% black)
- Backdrop blur effect (8px) for depth and focus
- Smooth animations:
  - Fade-in animation for backdrop (0.2s ease-out)
  - Scale-in animation for modal content (0.3s ease-out)
- Multiple ways to close:
  - Click on backdrop
  - Click on close button (top-right)
  - Click on the image itself
- Informative caption with title and description
- Responsive design that works on all screen sizes

### 3. Answer Selection
- Clear visual feedback for selected answers
- Choice indicators:
  - Circular badges with letter identifiers (A, B, C, D)
  - Color changes on selection (indigo for selected)
  - Background and border changes for selected state
- Hover states for better interactivity
- Full-width clickable areas for better accessibility

### 4. Word Definition Feature
- Double-click on any word to view its definition
- Enhanced word selection algorithm that accurately identifies words even in complex text layouts
- Definitions are fetched only once and cached in local storage
- Cached definitions persist between sessions with 24-hour expiration
- Optimized useEffect dependency arrays to prevent infinite re-render loops
- Multiple ways to close the definition popup:
  - Click the X button
  - Press ESC key
  - Click outside the popup
- Positioned with bottom edge 60px above the double-clicked word for better readability
- Draggable popup with position memory:
  - Horizontal drag handle bar at the top for easy repositioning
  - Position is saved to localStorage and persists between sessions
  - Automatically restores last position when reopened
- Enhanced with subtle animations and hover effects:
  - Smooth fade-in and zoom animations
  - Hover effects on sections and tags
  - Shadow transitions for depth
- Comprehensive definition display:
  - Word pronunciation and phonetics
  - Multiple meanings with part of speech
  - Etymology information
  - Examples, synonyms, and antonyms
  - Bookmark functionality to save words for later reference

### 5. Navigation and Progress
- Clean header with application title and progress indicator
- Progress tracking ("Question 1 of 10" on desktop, "Q1" on mobile)
- Difficulty indicator showing dots (1-5) based on difficulty level
- Submit button with clear call-to-action styling
- Responsive design with optimized mobile view:
  - Smaller logo and text on mobile
  - Simplified breadcrumb showing only "Reading" on mobile
  - Compact difficulty indicator showing only dots on mobile
  - Collapsible gadget list with cogwheel dropdown on mobile

## Technical Implementation

### Modal Component
```typescript
// Key className combinations for modal effects
"fixed inset-0 bg-black/60 backdrop-blur-[8px]" // Backdrop styling
"animate-[fadeIn_0.2s_ease-out]" // Fade-in animation
"animate-[scaleIn_0.3s_ease-out]" // Scale-in animation
```

### Custom Animations
```css
/* Fade-in animation for modal backdrop */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Scale-in animation for modal content */
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

### Interactive Elements
```typescript
// Thumbnail hover effect classes
"transform transition-transform duration-300 hover:scale-[1.02]"
"bg-gradient-to-t from-black/60 via-black/30 to-transparent"
```

### State Management
```typescript
// Core state interfaces
interface Choice {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  choices: Choice[];
}

// Word definition interfaces
interface WordDefinition {
  word: string;
  phonetic?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }>;
  }>;
  etymology?: string;
}

interface CachedDefinition {
  definition: WordDefinition;
  timestamp: number;
}

// State hooks
const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
const [showModal, setShowModal] = useState(false);
const [doubleClickedWord, setDoubleClickedWord] = useState<string | null>(null);
```

### Local Storage Caching
```typescript
// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Check if a cached definition is still valid
const isCacheValid = (cachedData: CachedDefinition): boolean => {
  const now = Date.now();
  return now - cachedData.timestamp < CACHE_EXPIRATION;
};

// Get definition from cache if available
const getFromCache = (word: string): WordDefinition | null => {
  try {
    const cachedData = localStorage.getItem(`word_definition_${word.toLowerCase()}`);
    if (cachedData) {
      const parsedData: CachedDefinition = JSON.parse(cachedData);
      if (isCacheValid(parsedData)) {
        return parsedData.definition;
      } else {
        // Remove expired cache
        localStorage.removeItem(`word_definition_${word.toLowerCase()}`);
      }
    }
  } catch (error) {
    console.error('Error reading from cache:', error);
  }
  return null;
};

// Save definition to cache
const saveToCache = (word: string, def: WordDefinition) => {
  try {
    const cacheData: CachedDefinition = {
      definition: def,
      timestamp: Date.now()
    };
    localStorage.setItem(`word_definition_${word.toLowerCase()}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};
```

### Preventing Infinite Loops
```typescript
// Fetch definition when word changes - with optimized dependency array
useEffect(() => {
  if (word) {
    console.log('Fetching definition for word:', word);
    fetchDefinition(word);
    // Check if the word is bookmarked
    const bookmarked = isWordBookmarked(word);
    setIsBookmarked(bookmarked);
  }
}, [word]); // Only depend on word, not on functions that don't change
```

## Accessibility Features

1. **Keyboard Navigation**
   - All interactive elements are focusable
   - Logical tab order through the interface
   - Clear focus indicators

2. **Visual Hierarchy**
   - High contrast text colors
   - Clear visual feedback for interactive states
   - Adequate spacing between elements

3. **Screen Reader Support**
   - Semantic HTML structure
   - Descriptive alt text for images
   - ARIA labels where appropriate

## Best Practices

1. **Performance**
   - Efficient state management
   - Optimized animations using GPU acceleration
   - Lazy loading for modal content
   - Dependency array optimization to prevent infinite re-renders

2. **Maintainability**
   - TypeScript interfaces for type safety
   - Modular component structure
   - Consistent naming conventions

3. **User Experience**
   - Smooth transitions and animations
   - Multiple ways to interact with components
   - Clear feedback for user actions

4. **Responsive Design**
   - Mobile-first approach with progressive enhancement
   - Tailored UI for different screen sizes:
     - Mobile (< 640px): Simplified UI with compact elements
     - Tablet (640px - 1024px): Balanced UI with essential elements
     - Desktop (> 1024px): Full-featured UI with all elements
   - Breakpoints defined in tailwind.config.js:
     ```js
     screens: {
       'xs': '480px',    // Extra small devices (phones)
       'sm': '640px',    // Small devices (large phones, small tablets)
       'md': '768px',    // Medium devices (tablets)
       'lg': '1024px',   // Large devices (laptops/desktops)
       'xl': '1280px',   // Extra large devices (large desktops)
       '2xl': '1536px',  // 2X large devices
     }
     ```

## Future Enhancements

1. **Question Navigation**
   - Previous/Next question buttons
   - Question overview/summary
   - Progress bar visualization

2. **Accessibility**
   - Enhanced keyboard shortcuts
   - Screen reader announcements
   - High contrast mode

3. **Analytics**
   - Time spent per question
   - Answer change tracking
   - Performance metrics

## SAT Layout Components

The application now includes SAT layout components migrated from the SAT Screens project. These components provide a comprehensive UI for SAT test-taking experiences.

See [SAT Layout Documentation](./sat-layout.md) for details on:

- Enhanced breadcrumb navigation with interactive elements
- Collapsible sidebar for navigation
- Question layout that integrates these components

To see the SAT layout in action, visit the `/sat-layout` route.
