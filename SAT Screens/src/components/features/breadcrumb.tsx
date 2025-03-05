'use client';

import { ChevronRight, Calculator, LogOut, Clock, FileText } from 'lucide-react';
import { LazyMotion, domAnimation, m, type MotionProps } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuestion } from '@/contexts/QuestionContext';
import { cn } from '@/lib/utils';

const subjects = [
  { id: 'math', name: 'Math', active: true },
  { id: 'reading', name: 'Reading' },
  { id: 'writing', name: 'Writing' }
];

const topics = [
  { id: 'multiply-binomials', name: 'Multiply Binomials', active: true },
  { id: 'item-1', name: 'Item 1' },
  { id: 'item-2', name: 'Item 2' },
  { id: 'item-3', name: 'Item 3' }
];

interface BreadcrumbItemProps {
  text: string;
  isLast?: boolean;
  attempts?: number;
  description?: string;
  items?: Array<{ id: string; name: string; active?: boolean; }>;
  onSelect?: (id: string) => void;
}

const motionConfig: MotionProps = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

function QuestionGrid() {
  const questions = Array.from({ length: 30 }, (_, i) => i + 1);
  
  const getQuestionStatus = (q: number) => {
    if (q === 3 || q === 7 || q === 8 || q === 12) return 'skipped';
    if (q <= 6) return 'completed';
    if (q === 16) return 'current';
    return 'pending';
  };

  const getTimeSpent = (q: number) => {
    const times = {
      3: '2:45',
      7: '1:30',
      8: '3:15',
      12: '2:00',
      16: '1:13'
    };
    return times[q] || null;
  };

  return (
    <div className="w-[280px] p-[10%]">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500/20 rounded-full" />
        <span className="text-sm text-gray-600">Completed</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-orange-100 rounded-full" />
        <span className="text-sm text-gray-600">Skipped</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-blue-100 rounded-full" />
        <span className="text-sm text-gray-600">Current</span>
      </div>
      <div className="grid grid-cols-5 gap-2.5 place-items-center w-full">
        {questions.map((q) => {
          const status = getQuestionStatus(q);
          const timeSpent = getTimeSpent(q);

          return (
            <Tooltip key={q} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  key={q}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-all duration-200",
                    "hover:scale-105 hover:shadow-md",
                    status === 'completed' && "bg-green-500/20 text-green-700 hover:bg-green-500/30",
                    status === 'skipped' && "bg-orange-100 text-orange-700 hover:bg-orange-200",
                    status === 'current' && "bg-blue-100 text-blue-700 hover:bg-blue-200 ring-2 ring-blue-200",
                    status === 'pending' && "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {q}
                </div>
              </TooltipTrigger>
              <TooltipContent 
                className="px-3 py-2 bg-white border shadow-lg rounded-lg text-sm font-medium z-[100]"
                sideOffset={6}
              >
                {status === 'current' && "Current question"}
                {status === 'completed' && timeSpent && `Completed in ${timeSpent}`}
                {status === 'skipped' && timeSpent && `Skipped after ${timeSpent}`}
                {status === 'pending' && "Not attempted yet"}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

function BreadcrumbItem({ text, isLast, attempts, description, items }: BreadcrumbItemProps) {
  return (
    <m.div className="flex items-center" {...motionConfig}>
      <Popover>
        <PopoverTrigger className={cn(
          "relative group",
          "transition-all duration-200",
          isLast ? "text-blue-600" : "text-black hover:text-gray-700"
        )}>
          <span className="flex items-center">
            {text}
            {attempts && (
              <span className="ml-2 text-sm text-gray-500">({attempts}x)</span>
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 relative z-[100] min-w-[12rem] w-fit" 
          align="start"
        >
          {items ? (
            <div className="py-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm whitespace-nowrap transition-all duration-200",
                    "hover:bg-violet-50 hover:text-violet-700",
                    item.active && "bg-blue-50 text-blue-600"
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          ) : (
            <QuestionGrid />
          )}
        </PopoverContent>
      </Popover>
      {!isLast && (
        <ChevronRight className="w-3.5 h-3.5 mx-[2px] text-gray-400" />
      )}
    </m.div>
  );
}

export function Breadcrumb() {
  const { time, openCalculator, openFormulaSheet } = useQuestion();

  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-white relative">
        <div className="w-[95%] mx-auto h-16 flex items-center">
          <div className="flex items-center justify-between w-full">
            <nav aria-label="Question navigation">
              <m.div
                className="flex items-center whitespace-nowrap gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                <BreadcrumbItem text="Math" items={subjects} />
                <BreadcrumbItem text="Multiply Binomials" items={topics} />
                <BreadcrumbItem 
                  text="Question 16"
                  isLast
                  attempts={2}
                  description="This is your second attempt at this question"
                />
              </m.div>
            </nav>
            <div className="flex items-center gap-3">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-mono flex items-center gap-2"
                    role="timer"
                    aria-label="Time spent: 1 minute and 13 seconds"
                  >
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <time className="font-['Inter']">{time.formatted}</time>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className="px-3 py-2 bg-white border shadow-lg rounded-lg text-sm font-medium z-[100]"
                  sideOffset={6}
                >
                  Time elapsed
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9" 
                    onClick={openCalculator}
                    aria-label="Open scientific calculator"
                  >
                    <Calculator className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-[100]">Calculator</TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9" 
                    onClick={openFormulaSheet}
                    aria-label="Open SAT Math reference sheet with formulas and equations"
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-[100]">Formula Sheet</TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9" 
                    onClick={() => {
                      // TODO: Implement save functionality
                      window.location.href = '/dashboard';
                    }}
                    aria-label="Save your progress and return to dashboard"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-[100]">Save & Exit</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}