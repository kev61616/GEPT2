# GEPT - Responsive Testing Screen

## Commands
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Code Style Guidelines
- **Imports**: Group imports by type and sort alphabetically:
  1. React imports
  2. Third-party packages
  3. Local components/utilities
- **Types**: Always use TypeScript with strict mode; prefer interfaces for object shapes
- **Naming**: 
  - React components: PascalCase (e.g., `QuestionPanel`)
  - Hooks: camelCase with 'use' prefix (e.g., `useQuizState`)
  - Functions/variables: camelCase
  - Context providers: PascalCase with 'Provider' suffix
- **Error Handling**: Use try/catch blocks with specific error logging to console
- **Component Structure**: 
  - Use functional components with hooks
  - Place related components in dedicated directories
  - Create custom hooks for complex logic
- **State Management**: 
  - Use Context API for shared state
  - Keep local state with useState
  - Extract complex state into custom hooks
- **Styling**: Use Tailwind CSS with consistent class ordering (layout → typography → colors)
- **React Best Practices**: 
  - Utilize React hooks properly (follow ESLint plugin rules)
  - Memoize with React.memo, useCallback, and useMemo when appropriate
  - Keep components focused on single responsibility
  - Organize larger components into smaller sub-components