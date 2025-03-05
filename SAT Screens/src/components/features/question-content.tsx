'use client'

import { ThumbsUp, ThumbsDown, CheckCircle2, XCircle, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils'

const QuestionNumber = ({ number }: { number: number }) => (
  <motion.div
    key={number}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="absolute top-0 left-0 right-0 text-center"
  >
    <div className="bg-blue-50 text-blue-700 w-full py-3 font-semibold border-b">
      Question {number}
    </div>
  </motion.div>
);

export function QuestionContent() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleCheckAnswer = useCallback(() => {
    if (selectedOption) {
      setIsAnswerChecked(true);
      setShowError(false);
      if (selectedOption === 'A') { // A is the correct answer
        setIsCorrect(true);
        void confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setCountdown(5);
      }
    } else {
      setShowError(true);
    }
  }, [selectedOption]);

  useEffect(() => {
    let timer: number;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Handle navigation to next question
      console.log('Navigate to next question');
    }
    return () => timer && window.clearTimeout(timer);
  }, [countdown]);

  const options = [
    { id: 'A', value: 'x = 2', correct: true },
    { id: 'B', value: 'x = -2', incorrect: true },
    { id: 'C', value: 'x = 4' },
    { id: 'D', value: 'x = -4' }
  ];

  return (
    <Card className="pt-12 px-8 pb-8 mb-8 relative overflow-hidden">
      <QuestionNumber number={16} />
      <div className="mt-6">
        <div className="text-lg mb-6">Solve for f.</div>
        <div className="text-3xl font-serif mb-8 text-center tracking-wide">3(6-f)-4=3f-4</div>
        <div className="space-y-3">
          {options.map((option) => (
            <div
              onClick={() => setSelectedOption(option.id)}
              key={option.id}
              className={cn(
                "group relative p-4 rounded-lg border-2 border-gray-700 cursor-pointer transition-all duration-300",
                selectedOption === option.id
                  ? "border-blue-400 bg-blue-50/50"
                  : "hover:border-orange-300 hover:bg-orange-50/60",
                isAnswerChecked && selectedOption === option.id && option.correct && "bg-green-50 border-green-500",
                isAnswerChecked && selectedOption === option.id && option.incorrect && "bg-red-50 border-red-500"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "font-semibold w-8 h-8 flex items-center justify-center rounded transition-colors",
                  selectedOption === option.id && !isAnswerChecked
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700",
                  isAnswerChecked && selectedOption === option.id && option.correct && "bg-green-100 text-green-700",
                  isAnswerChecked && selectedOption === option.id && option.incorrect && "bg-red-100 text-red-700"
                )}>
                  {option.id}
                </div>
                <div className="font-serif flex-1 text-lg">{option.value}</div>
                <AnimatePresence>
                  {isAnswerChecked && selectedOption === option.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="transition-opacity"
                    >
                      {option.correct && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {option.incorrect && <XCircle className="w-5 h-5 text-red-500" />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {isAnswerChecked && selectedOption === option.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center">
          <button
            onClick={() => {
              if (!isAnswerChecked) {
                setSelectedOption(null);
                setShowError(false);
              }
            }}
            className={cn(
              "px-8 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium",
              "hover:bg-gray-50 transition-colors flex items-center gap-2 mr-4",
              isAnswerChecked && "opacity-50 cursor-not-allowed hover:bg-white"
            )}
            disabled={isAnswerChecked}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={handleCheckAnswer}
            className={cn(
              "px-8 py-2 rounded-lg font-medium flex items-center gap-2",
              "bg-indigo-600 text-white hover:bg-indigo-700 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isAnswerChecked && (isCorrect ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700")
            )}
            disabled={!selectedOption}
          >
            {isCorrect ? (
              <>
                Next {countdown !== null && `(${countdown}s)`}
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Check Answer
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          {showError && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-4 text-red-600 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Please select an answer</span>
            </motion.div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Report helpful"
              disabled={!isAnswerChecked}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Report unhelpful"
              disabled={!isAnswerChecked}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}