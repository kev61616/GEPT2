## 📁 Project Structure

```
src/
  ├── app/                    # Next.js app directory
  │   ├── (auth)/            # Authentication routes
  │   │   ├── login/
  │   │   └── register/
  │   ├── (dashboard)/       # Protected dashboard routes
  │   │   ├── subjects/      # Subject listing and management
  │   │   ├── practice/      # Practice questions and exercises
  │   │   └── progress/      # Progress tracking and analytics
  │   ├── layout.tsx         # Root layout with providers
  │   └── page.tsx           # Home page component
  ├── components/            # React components
  │   ├── ui/               # shadcn/ui components
  │   │   ├── button.tsx    # Reusable UI components
  │   │   └── ...
  │   ├── layout/           # Layout components
  │   │   ├── sidebar.tsx   # Navigation sidebar
  │   │   └── ...
  │   └── features/         # Feature-specific components
  │       ├── question-content.tsx
  │       └── ...
  ├── hooks/                # Custom React hooks
  │   ├── useTimer.ts       # Timer functionality
  │   └── ...
  ├── lib/                  # Utility functions and constants
  │   ├── utils.ts          # Helper functions
  │   └── constants.ts      # App-wide constants
  ├── types/                # TypeScript type definitions
  │   ├── question.ts       # Question-related types
  │   └── ...
  └── styles/              # Global styles
      └── globals.css      # Global CSS
```

## 🔧 Core Features

### Question Management
- Dynamic question loading and rendering
- Multiple choice and free response support
- Real-time answer validation
- Progress tracking

### Timer System
- Accurate time tracking
- Pause/resume functionality
- Session persistence

### Progress Tracking
- Question completion status
- Performance analytics
- Learning path recommendations

### UI Components
- Responsive design
- Accessible components
- Dark mode support
- Loading states

# Math Learning Platform

A modern, interactive mathematics learning platform built with Next.js 15.1 and React 18.2.

## 🚀 Tech Stack

- **Framework:** Next.js 15.1 (App Router)
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Typography:** STIX Two Math (for mathematical expressions)

- **Color Palette:**
  - Primary: Indigo (600)
  - Secondary: Purple (100)
  - Accent: Yellow (100)
  - Success: Green (100, 700)
  - Error: Red (100, 700)
  - Neutral: Gray (50, 100, 400, 500)

- **Typography:**
  - Headers: Inter (system font)
  - Math Expressions: STIX Two Math
  - Base: 16px (1rem)
  - Scale: 1.25 (Major Third)

- **Spacing:**
  - Base: 4px (0.25rem)
  - Scale: 4, 8, 16, 24, 32, 48, 64

- **Components:**
  - Cards with subtle shadows
  - Rounded corners (lg: 0.5rem)
  - Interactive hover states
  - Consistent padding and margins

## 🎨 Design System

### Responsive Design

- **Breakpoints:**
  - `lg` (1024px): Primary breakpoint for layout transitions
    - Breadcrumb switches from stacked to horizontal layout
    - Navigation tools move from below to beside breadcrumb
  - Ensures optimal readability and usability across devices

- **Navigation:**
  - Breadcrumb maintains clarity at all viewport sizes
  - Tools (calculator, timer, etc.) remain accessible
  - Smooth transitions between layouts

## 🔥 Features

- **Interactive Learning:**
  - Responsive navigation system
    - Adaptive breadcrumb navigation
    - Context-aware tool positioning
    - Optimized for both desktop and mobile
  - Step-by-step problem solving
  - Real-time feedback
  - Progress tracking
  - Calculator integration

- **User Experience:**
  - Responsive design
  - Keyboard navigation
  - Progress saving
  - Time tracking
  - Question bookmarking

- **Accessibility:**
  - ARIA labels
  - Keyboard navigation
  - High contrast modes
  - Screen reader support

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck
```

## 🔄 State Management

The application uses React's built-in hooks for state management:
- `useState` for local component state
- `useReducer` for complex state logic
- `useContext` for global state sharing
- Custom hooks for reusable logic

## 🎯 Future Enhancements

1. **Authentication & Authorization:**
   - User profiles
   - Progress tracking
   - Customized learning paths

2. **Content Management:**
   - Dynamic question loading
   - Different difficulty levels
   - Various math subjects

3. **Interactive Features:**
   - Step-by-step solutions
   - Hints system
   - Practice mode

4. **Analytics:**
   - Performance tracking
   - Learning patterns
   - Progress reports

5. **Social Features:**
   - Study groups
   - Leaderboards
   - Peer help