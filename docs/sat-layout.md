# SAT Layout Components

This document describes the SAT layout components that have been migrated from the SAT Screens project to the current project.

## Overview

The SAT layout components provide a comprehensive UI for SAT test-taking experiences, featuring:

1. An enhanced breadcrumb navigation with interactive elements
2. A collapsible sidebar for navigation
3. A question layout that integrates these components

## Components

### 1. Enhanced Breadcrumb

The enhanced breadcrumb component (`EnhancedBreadcrumb`) provides a rich navigation experience with:

- Interactive breadcrumb items with popover menus
- Subject and topic selection
- Question navigation with attempt tracking
- Timer display
- Quick access to tools (calculator, formula sheet)
- Smooth animations using Framer Motion

```tsx
<EnhancedBreadcrumb />
```

### 2. Sidebar

The sidebar component (`Sidebar`) provides a collapsible navigation panel with:

- Hover-based expansion/collapse
- Icon-based navigation
- Tooltips for navigation items
- User progress indicators
- Smooth transitions and animations

```tsx
<Sidebar />
```

### 3. Question Layout

The question layout component (`QuestionLayout`) integrates the above components into a cohesive layout:

- Provides the `QuestionProvider` context for shared state
- Arranges the sidebar and breadcrumb in the correct positions
- Contains the main content area for the question display

```tsx
<QuestionLayout>
  {/* Question content goes here */}
</QuestionLayout>
```

## Technical Implementation

### Context Providers

The layout components rely on several context providers:

1. `QuestionProvider`: Provides question-related state and functions
   - Timer state and controls
   - Tool window management (calculator, formula sheet)
   - Visibility state management

### Hooks

Several custom hooks support the layout components:

1. `useTimer`: Manages the timer state and controls
2. `useToolWindows`: Manages the tool windows (calculator, formula sheet)

### UI Components

The layout components use several UI components:

1. `Tooltip`: Provides tooltips for UI elements
2. `Popover`: Provides popover menus for breadcrumb items
3. `Button`: Provides buttons for various actions

## Usage

To use the SAT layout in your application:

1. Ensure the required dependencies are installed:
   - framer-motion
   - @radix-ui/react-tooltip
   - @radix-ui/react-popover

2. Import the QuestionLayout component:
   ```tsx
   import { QuestionLayout } from '@/components/layout/QuestionLayout';
   ```

3. Wrap your content with the QuestionLayout:
   ```tsx
   <QuestionLayout>
     {/* Your content here */}
   </QuestionLayout>
   ```

4. Visit the `/sat-layout` route to see the SAT layout in action.

## Customization

The layout components can be customized in several ways:

1. Modify the sidebar items in the `Sidebar` component
2. Adjust the breadcrumb items in the `EnhancedBreadcrumb` component
3. Adjust the layout spacing and dimensions in the `QuestionLayout` component
