'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DraggableWidget } from '@/components/DraggableWidget';

interface PomodoroTimerProps {
  onClose: () => void;
  onTimeExpired: () => void;
}

export function PomodoroTimer({ onClose, onTimeExpired }: PomodoroTimerProps) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [showSettings, setShowSettings] = useState(false);

  // Load saved settings
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedSettings = localStorage.getItem('pomodoro-settings');
      if (savedSettings) {
        const { focusMinutes } = JSON.parse(savedSettings);
        setCustomMinutes(focusMinutes);
        if (mode === 'focus' && !isActive) {
          setMinutes(focusMinutes);
        }
      }
    } catch (error) {
      console.error('Failed to load timer settings:', error);
    }
  }, [mode, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            if (interval) clearInterval(interval);
            setIsActive(false);
            onTimeExpired();
            
            // Switch modes
            if (mode === 'focus') {
              setMode('break');
              
              // Get break time from settings
              setMinutes(5);
            } else {
              setMode('focus');
              setMinutes(customMinutes);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode, onTimeExpired]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    
    if (mode === 'focus') {
      setMinutes(customMinutes);
    } else {
      setMinutes(5); // Default break time
    }
  };

  const saveSettings = () => {
    if (typeof window === 'undefined') return;
    
    const settings = {
      focusMinutes: customMinutes,
      breakMinutes: 5
    };
    
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
    
    if (mode === 'focus' && !isActive) {
      setMinutes(customMinutes);
    }
    
    setShowSettings(false);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSeconds = mode === 'focus' 
      ? customMinutes * 60 
      : 5 * 60;
    const remainingSeconds = minutes * 60 + seconds;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  return (
    <DraggableWidget id="pomodoro-timer" onClose={onClose} title="Pomodoro Timer" anchorTo="timer">
      <div className="flex flex-col items-center">
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-200">
          <div 
            className={`h-full ${mode === 'focus' ? 'bg-blue-500' : 'bg-green-500'}`}
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        
        {showSettings ? (
          <div className="p-4 w-full">
            <h4 className="text-sm font-medium mb-2">Timer Settings</h4>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">Focus Duration (minutes)</label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 25)))}
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                onClick={() => setShowSettings(false)} 
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={saveSettings} 
                variant="primary"
                size="sm"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 flex flex-col items-center w-full">
              <div className="text-4xl font-bold mb-2 text-gray-800">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              
              <div className="mb-4 w-full flex justify-center">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    onClick={() => setMode('focus')}
                    className={`px-4 py-1 text-sm font-medium rounded-l-lg ${
                      mode === 'focus'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Focus
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('break')}
                    className={`px-4 py-1 text-sm font-medium rounded-r-lg ${
                      mode === 'break'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Break
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-2 w-full justify-center">
                <Button 
                  onClick={toggleTimer} 
                  variant={isActive ? 'outline' : 'primary'}
                  size="sm"
                  className="w-24"
                >
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button 
                  onClick={resetTimer} 
                  variant="outline"
                  size="sm"
                >
                  Reset
                </Button>
                <Button 
                  onClick={() => setShowSettings(true)} 
                  variant="ghost"
                  size="sm"
                >
                  ⚙️
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </DraggableWidget>
  );
}
