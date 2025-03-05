import React from 'react';
import { DraggableWidget } from './DraggableWidget';
import { Card } from './ui/card';
import { Timer, Calculator, BookText, Eye, EyeOff, Plus } from 'lucide-react';
import { useWidgetState } from '../hooks/useWidgetState';

interface WidgetManagerProps {
  onClose: () => void;
}

interface WidgetInfo {
  id: 'timer' | 'calculator' | 'formulas';
  name: string;
  icon: React.ReactNode;
  description: string;
}

const WIDGETS: WidgetInfo[] = [
  { 
    id: 'timer', 
    name: 'Pomodoro Timer', 
    icon: <Timer className="h-5 w-5" />,
    description: 'Focus timer with customizable duration'
  },
  { 
    id: 'calculator', 
    name: 'Graphing Calculator', 
    icon: <Calculator className="h-5 w-5" />,
    description: 'Interactive calculator with graphing capabilities'
  },
  { 
    id: 'formulas', 
    name: 'Formula Booklet', 
    icon: <BookText className="h-5 w-5" />,
    description: 'Quick reference for common formulas'
  },
];

export function WidgetManager({ onClose }: WidgetManagerProps) {
  const { state, toggleWidget } = useWidgetState();

  const handleToggleWidgetState = (id: 'timer' | 'calculator' | 'formulas', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWidget(id);
  };

  return (
    <DraggableWidget
      id="widget-manager"
      className="top-20 left-80"
      title="Widget Manager"
      onClose={onClose}
    >
      <Card className="w-80 bg-white rounded-b-xl">
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-4">Manage your study tools</p>
          
          <div className="space-y-3">
            {WIDGETS.map(widget => (
              <div 
                key={widget.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      {widget.icon}
                    </div>
                    <span className="font-medium text-gray-700">{widget.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-11">{widget.description}</p>
                </div>
                <button
                  onClick={(e) => handleToggleWidgetState(widget.id, e)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                    state[widget.id] 
                      ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                  aria-label={state[widget.id] ? `Disable ${widget.name}` : `Enable ${widget.name}`}
                >
                  {state[widget.id] ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200">
              <Plus className="h-4 w-4" />
              <span>Add Custom Widget</span>
            </button>
          </div>
        </div>
      </Card>
    </DraggableWidget>
  );
}