import React, { useState } from 'react';
import { Timer, Calculator, BookText, ChevronDown, Settings } from 'lucide-react';
import { QuestionNavigator } from './QuestionNavigator';
import { WidgetManager } from './WidgetManager';
import { useWidgetState } from '../hooks/useWidgetState';

interface HeaderProps {
  timeRemaining: number;
  onShowTimer: () => void;
  onShowCalculator: () => void;
  onShowFormulas: () => void;
}

export function Header({ timeRemaining, onShowTimer, onShowCalculator, onShowFormulas }: HeaderProps) {
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [showWidgetManager, setShowWidgetManager] = useState(false);
  const { state: widgetState } = useWidgetState();

  const handleQuestionNavClick = () => {
    setShowQuestionNav(prev => !prev);
  };

  const handleWidgetManagerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowWidgetManager(!showWidgetManager);
  };

  const handleWidgetClick = (handler: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handler();
  };

  return (
    <header className="bg-white border-b relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="relative flex items-center">
                <BookText className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Reading
                </span>
                <div className="absolute -bottom-1 left-7 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleQuestionNavClick}
                className="group flex items-center space-x-1 hover:bg-gray-50 rounded-lg px-3 py-1.5 transition-colors"
                aria-expanded={showQuestionNav}
                aria-haspopup="true"
                type="button"
              >
                <span className="text-sm font-medium text-gray-700">Question 1 of 10</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
              
              <div className="h-4 w-px bg-gray-200" />
              
              <div className="flex items-center space-x-1.5">
                <div className="text-sm font-medium text-emerald-600">Medium</div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((dot, index) => (
                    <div
                      key={dot}
                      className={`w-2 h-2 rounded-full ${
                        index < 3
                          ? 'bg-emerald-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gray-100 rounded-full -z-10 group-hover:bg-gray-200 transition-colors"></div>
              <div className="flex items-center space-x-2 px-3 py-1.5">
                <button
                  onClick={handleWidgetClick(onShowTimer)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 ${
                    widgetState.timer 
                      ? 'bg-white hover:bg-orange-50 text-gray-600 group-hover:text-indigo-600 border border-gray-300' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  title={widgetState.timer ? "Timer" : "Timer (disabled)"}
                  disabled={!widgetState.timer}
                  aria-label="Timer"
                  type="button"
                >
                  <Timer className="h-4 w-4" />
                </button>
                <button
                  onClick={handleWidgetClick(onShowCalculator)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 ${
                    widgetState.calculator 
                      ? 'bg-white hover:bg-orange-50 text-gray-600 group-hover:text-indigo-600 border border-gray-300' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  title={widgetState.calculator ? "Calculator" : "Calculator (disabled)"}
                  disabled={!widgetState.calculator}
                  aria-label="Calculator"
                  type="button"
                >
                  <Calculator className="h-4 w-4" />
                </button>
                <button
                  onClick={handleWidgetClick(onShowFormulas)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 ${
                    widgetState.formulas 
                      ? 'bg-white hover:bg-orange-50 text-gray-600 group-hover:text-indigo-600 border border-gray-300' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  title={widgetState.formulas ? "Formula Booklet" : "Formula Booklet (disabled)"}
                  disabled={!widgetState.formulas}
                  aria-label="Formula Booklet"
                  type="button"
                >
                  <BookText className="h-4 w-4" />
                </button>
                <button
                  onClick={handleWidgetManagerClick}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-orange-50 transition-all duration-200 hover:scale-105 text-gray-600 group-hover:text-indigo-600 border border-gray-300"
                  title="Manage Widgets"
                  aria-label="Manage Widgets"
                  aria-expanded={showWidgetManager}
                  aria-haspopup="true"
                  type="button"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQuestionNav && <QuestionNavigator onClose={() => setShowQuestionNav(false)} />}
      {showWidgetManager && <WidgetManager onClose={() => setShowWidgetManager(false)} />}
    </header>
  );
}