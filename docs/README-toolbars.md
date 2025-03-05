# Toolbar Components Documentation

This directory contains documentation for the toolbar components used in the GEPT2 application.

## Documentation Files

1. **[toolbar-components.md](./toolbar-components.md)**
   - Main documentation file with integration guide
   - Dependencies and styling information
   - Links to individual component documentation

2. **[toolbar-components-summary.md](./toolbar-components-summary.md)**
   - Concise summary of all toolbar components
   - Key features and implementation details
   - Integration guide for using components in other projects
   - Styling and animation techniques

3. **Component-specific documentation:**
   - **[text-markup-toolbar.md](./text-markup-toolbar.md)** - Text highlighting functionality
   - **[word-definition-system.md](./word-definition-system.md)** - Double-click word definition popup
   - **[widget-toolbar.md](./widget-toolbar.md)** - Tool toggles with responsive design
   - **[draggable-widget-system.md](./draggable-widget-system.md)** - Drag and drop widget functionality

## Components Covered

The documentation covers the following components:

1. **Text Markup Toolbar**
   - Highlighting text in different colors
   - Strikethrough formatting
   - Clearing formatting

2. **Word Definition System**
   - Double-click word detection
   - Definition popup with animations
   - Word bookmarking functionality

3. **Widget Toolbar**
   - Tool toggles with responsive design
   - Mobile/desktop layouts
   - Timer display

4. **Draggable Widget System**
   - Drag and drop functionality
   - Position persistence
   - Reset position option

## How to Use This Documentation

- Start with **toolbar-components.md** for an overview and integration guide
- For a quick summary of all components, refer to **toolbar-components-summary.md**
- For detailed implementation of specific components, refer to the individual component documentation files
- To implement these components in another project, follow the integration guide in the main documentation

## Dependencies

These components rely on:

- React 18+
- TypeScript
- TailwindCSS
- Lucide React (for icons)
- @dnd-kit/core and @dnd-kit/utilities (for drag and drop)
- localStorage (for persistence)

## File Structure

The components are organized in the following structure:

```
src/
├── components/
│   ├── TextMarkupToolbar.tsx
│   ├── WordDefinitionBar.tsx
│   ├── Header/
│   │   └── WidgetToolbar.tsx
│   └── WordBookmarkManager.tsx
├── contexts/
│   ├── SelectionContext.tsx
│   └── DragContext.tsx
├── hooks/
│   ├── useWordDefinition.ts
│   ├── useWordBookmarks.ts
│   └── useWidgetState.ts
└── lib/
    └── textHighlight.ts
```

## Recreating These Components

To recreate these components in another project:

1. Copy the necessary files to your project
2. Install the required dependencies
3. Set up the context providers in your application
4. Integrate the components as described in the integration guide

For any questions or issues, refer to the detailed implementation in the source code.
