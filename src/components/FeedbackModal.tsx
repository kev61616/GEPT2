import React, { useState, useEffect, useRef } from 'react';
import { X, ThumbsUp, ThumbsDown, Send } from 'lucide-react';

interface FeedbackModalProps {
  type: 'positive' | 'negative';
  onClose: () => void;
}

interface FeedbackStep {
  id: number;
  title: string;
  component: React.ReactNode;
}

export function FeedbackModal({ type, onClose }: FeedbackModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [quality, setQuality] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDifficultySelect = (value: number) => {
    setDifficulty(value);
    setCurrentStep(2);
  };

  const handleQualitySelect = (value: number) => {
    setQuality(value);
    setCurrentStep(3);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Feedback submitted:', {
        type,
        difficulty,
        quality,
        comment
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const steps: FeedbackStep[] = [
    {
      id: 1,
      title: "How difficult was the question?*",
      component: (
        <div className="py-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Very Easy</span>
            <span className="text-sm text-gray-600">Very Difficult</span>
          </div>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                onClick={() => handleDifficultySelect(value)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 ${
                  difficulty === value
                    ? 'bg-purple-600 text-white transform scale-110 shadow-md'
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Question Quality*",
      component: (
        <div className="py-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Poor</span>
            <span className="text-sm text-gray-600">Excellent</span>
          </div>
          <div className="flex justify-between">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                onClick={() => handleQualitySelect(value)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 ${
                  quality === value
                    ? 'bg-purple-600 text-white transform scale-110 shadow-md'
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Anything you would like to tell us about this question?",
      component: (
        <div className="py-6">
          <p className="text-sm text-gray-500 mb-4">
            Feel free to comment on the question, markscheme, and/or video solution for this question.
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>Submit</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[10000] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out] modal">
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl animate-[scaleIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {type === 'positive' ? (
                <ThumbsUp className="h-8 w-8 text-purple-600" />
              ) : (
                <ThumbsDown className="h-8 w-8 text-purple-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thanks so much for providing us feedback!
            </h2>
            <p className="text-gray-600 mb-6">
              Your feedback helps us improve our questions and provide better learning experiences.
            </p>
            <button
              onClick={onClose}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                {type === 'positive' ? (
                  <ThumbsUp className="h-5 w-5 text-purple-600" />
                ) : (
                  <ThumbsDown className="h-5 w-5 text-purple-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {type === 'positive' ? 'Question Feedback' : 'Report an Issue'}
                </h2>
                <p className="text-sm text-gray-500">
                  {type === 'positive' 
                    ? 'Help us understand what makes this question effective'
                    : 'Let us know what issues you found with this question'
                  }
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {currentStepData?.title}
              </h3>
              {currentStepData?.component}
            </div>
            
            {currentStep < 3 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                  className={`text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors ${
                    currentStep === 1 ? 'invisible' : ''
                  }`}
                >
                  Back
                </button>
                <div className="flex space-x-1">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`w-2 h-2 rounded-full ${
                        step.id === currentStep ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => currentStep < steps.length && setCurrentStep(currentStep + 1)}
                  className={`text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors ${
                    (currentStep === 1 && !difficulty) || (currentStep === 2 && !quality)
                      ? 'invisible'
                      : ''
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}