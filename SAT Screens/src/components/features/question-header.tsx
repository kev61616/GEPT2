'use client';

import { useTimer } from '@/hooks/useTimer';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trophy, Calculator, LogOut, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CALCULATOR_URL, ROUTES } from '@/lib/constants';
import type { QuestionStats as QuestionStatsType } from '@/types/question';

interface QuestionStatsProps {
  stats: QuestionStatsType;
}

function QuestionStats({ stats }: QuestionStatsProps) {
  return (
    <div className="p-4 bg-white">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <div className="text-2xl font-semibold text-green-600 mb-1">{stats.correct}</div>
          <div className="text-sm text-gray-500">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-red-600 mb-1">{stats.incorrect}</div>
          <div className="text-sm text-gray-500">Incorrect</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-blue-600 mb-1">{stats.remaining}</div>
          <div className="text-sm text-gray-500">Remaining</div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-1">
        {Array.from({ length: stats.totalQuestions }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              {
                'bg-green-200': i < stats.correct,
                'bg-red-200': i >= stats.correct && i < (stats.correct + stats.incorrect),
                'bg-gray-200': i >= 8,
              }
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function QuestionHeader() {
  const { time } = useTimer();
  
  const stats: QuestionStatsType = {
    correct: 6,
    incorrect: 2,
    remaining: 78,
    totalQuestions: 86
  };

  return (
    <div className="flex justify-between items-center mb-8 gap-8">
      <div className="flex items-center gap-2">
        <div className="font-semibold tracking-wide text-indigo-600">
          QUESTION
        </div>
        <Popover>
          <PopoverTrigger>
            <div className="text-xl cursor-pointer transition-colors hover:text-indigo-600 flex items-center gap-2">
              16
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <QuestionStats stats={stats} />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 rounded-lg font-mono flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <Clock className="w-4 h-4" />
          <span>{time.formatted}</span>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.open(CALCULATOR_URL, '_blank')}
        >
          <Calculator className="w-4 h-4" />
          Calculator
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            // TODO: Implement save and exit functionality
            window.location.href = ROUTES.DASHBOARD;
          }}
        >
          <LogOut className="w-4 h-4" />
          Save & Exit
        </Button>
      </div>
    </div>
  );
}