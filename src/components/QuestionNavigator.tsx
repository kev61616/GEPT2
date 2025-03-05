import React from 'react';
import { CheckCircle2, Circle, Lock, ChevronRight } from 'lucide-react';
import { DraggableWidget } from './DraggableWidget';
import { Card } from './ui/card';

interface Question {
  id: number;
  title: string;
  status: 'completed' | 'current' | 'locked';
  type: 'reading' | 'math' | 'writing';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionNavigatorProps {
  onClose: () => void;
}

const questions: Question[] = [
  { id: 1, title: "Understanding React's Virtual DOM", status: 'current', type: 'reading', difficulty: 'medium' },
  { id: 2, title: "Component Lifecycle Methods", status: 'locked', type: 'reading', difficulty: 'hard' },
  { id: 3, title: "State Management Patterns", status: 'locked', type: 'reading', difficulty: 'medium' },
  { id: 4, title: "Performance Optimization", status: 'locked', type: 'reading', difficulty: 'hard' },
  { id: 5, title: "React Hooks Deep Dive", status: 'locked', type: 'reading', difficulty: 'medium' },
  { id: 6, title: "Context API vs Redux", status: 'locked', type: 'reading', difficulty: 'easy' },
  { id: 7, title: "Server-Side Rendering", status: 'locked', type: 'reading', difficulty: 'hard' },
  { id: 8, title: "Testing Best Practices", status: 'locked', type: 'reading', difficulty: 'medium' },
  { id: 9, title: "Error Boundaries", status: 'locked', type: 'reading', difficulty: 'easy' },
  { id: 10, title: "Advanced Patterns", status: 'locked', type: 'reading', difficulty: 'hard' },
];

const difficultyColors = {
  easy: 'text-emerald-600 bg-emerald-50',
  medium: 'text-amber-600 bg-amber-50',
  hard: 'text-rose-600 bg-rose-50',
};

export function QuestionNavigator({ onClose }: QuestionNavigatorProps) {
  return (
    <DraggableWidget
      id="question-navigator"
      className="top-20 left-20"
      title="Question Navigator"
      onClose={onClose}
    >
      <Card className="w-[800px] max-w-[90vw] bg-white rounded-b-xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <Circle className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Current</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Locked</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">10 questions total</div>
          </div>

          <div className="flex items-start space-x-3 overflow-x-auto pb-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="relative flex-none w-64 group"
              >
                <div
                  className={`
                    relative z-10 h-full rounded-lg border transition-all duration-200
                    ${question.status === 'current'
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm'
                      : question.status === 'completed'
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                      : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
                    }
                  `}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full
                          bg-white border shadow-sm transition-transform duration-300
                          ${question.status === 'current' ? 'scale-110' : ''}
                        `}>
                          {question.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : question.status === 'current' ? (
                            <Circle className="w-5 h-5 text-blue-500" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">Q{question.id}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[question.difficulty]}`}>
                        {question.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {question.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{question.type}</span>
                      <span className="text-blue-600 font-medium">View →</span>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {index < questions.length - 1 && (
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <div className="w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Hover effect */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </DraggableWidget>
  );
}