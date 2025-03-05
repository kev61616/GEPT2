# Hydration Error Fixes

## Overview

This document outlines the solutions implemented to fix hydration errors in the Next.js application. Hydration errors occur when the server-rendered HTML doesn't match what the client tries to render during hydration. These mismatches can lead to unexpected behavior and UI issues.

## Common Causes of Hydration Errors

1. **Server/Client Branching**: Using `if (typeof window !== 'undefined')` in component rendering logic
2. **Non-deterministic Values**: Using functions like `Date.now()` or `Math.random()` during rendering
3. **Browser-only APIs**: Accessing browser-only APIs like `localStorage` during initial render
4. **Date Formatting**: Using locale-specific date formatting that differs between server and client
5. **External Data**: Using external data that changes between server and client renders
6. **Invalid HTML Nesting**: Improper nesting of HTML tags

## Implemented Solutions

### 1. Consistent Initial State

We modified hooks to use a consistent initial state for both server and client rendering:

```typescript
// Before
const [state, setState] = useState(() => {
  const defaultState = { /* ... */ };
  if (typeof window === 'undefined') return defaultState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  } catch {
    return defaultState;
  }
});

// After
const defaultState = { /* ... */ };
const [state, setState] = useState(defaultState);
const [isInitialized, setIsInitialized] = useState(false);

// Load from localStorage only after initial render
useEffect(() => {
  if (typeof window !== 'undefined' && !isInitialized) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }
}, [isInitialized]);
```

### 2. Fixed Timestamps for Default Data

We replaced dynamic timestamps with fixed values for default data:

```typescript
// Before
const defaultBookmarks = [
  {
    // ...
    createdAt: Date.now() - 86400000 // 1 day ago
  }
];

// After
const defaultBookmarks = [
  {
    // ...
    createdAt: 1709654400000 // Fixed timestamp
  }
];
```

### 3. Client-side Only Operations

We moved browser-specific operations to client-side effects:

```typescript
// Before
const getFromCache = (word: string) => {
  try {
    const cachedData = localStorage.getItem(`word_definition_${word}`);
    // ...
  } catch (error) {
    // ...
  }
};

// After
const getFromCache = (word: string) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cachedData = localStorage.getItem(`word_definition_${word}`);
    // ...
  } catch (error) {
    // ...
  }
};
```

### 4. Conditional Client-side Effects

We added guards to ensure effects only run on the client:

```typescript
useEffect(() => {
  // Only run this effect on the client side
  if (typeof window === 'undefined') return;
  
  // Effect logic that uses browser APIs
  // ...
}, []);
```

## Best Practices for Preventing Hydration Errors

1. **Use Consistent Initial State**: Always use the same initial state for both server and client rendering.
2. **Defer Client-side Operations**: Move localStorage, sessionStorage, and other browser-only API calls to useEffect hooks.
3. **Avoid Non-deterministic Values**: Don't use `Date.now()`, `Math.random()`, or other non-deterministic values during initial render.
4. **Use Fixed Timestamps**: For default data that includes timestamps, use fixed values instead of dynamic ones.
5. **Add Client-side Guards**: Use `typeof window !== 'undefined'` checks in effects and functions, not in render logic.
6. **Use Next.js Patterns**: Leverage Next.js patterns like `useEffect` for client-side initialization.

## Affected Files

The following files were modified to fix hydration errors:

1. `src/hooks/useQuizState.ts`
2. `src/hooks/useWordBookmarks.ts`
3. `src/hooks/useWordDefinition.ts`
4. `src/app/page.tsx`

These changes ensure consistent rendering between server and client, eliminating hydration errors while maintaining the application's functionality.
