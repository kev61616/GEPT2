import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function StatusSidebar() {
  const questions = Array.from({ length: 78 }, (_, i) => i + 1);
  const currentQuestion = 16;

  const getQuestionStatus = (q: number) => {
    if (q === 3 || q === 7 || q === 8 || q === 12) return 'incorrect';
    if (q <= 6) return 'correct';
    if (q === currentQuestion) return 'current';
    return 'pending';
  };

  return (
    <div className="w-80 bg-white border-l p-6">
      <div className="space-y-6">
        <div>
          <div className="text-indigo-600 font-semibold mb-2">MATH</div>
          <div className="text-xl font-semibold">Multiply binomials</div>
        </div>
        <div>
          <div className="text-indigo-600 font-semibold mb-2">TIME</div>
          <div className="text-xl">00:01:13</div>
        </div>
        <div>
          <div className="text-indigo-600 font-semibold mb-2">QUESTION</div>
          <div className="grid grid-cols-6 gap-2">
            {questions.map((q) => {
              const status = getQuestionStatus(q);
              return (
                <div
                  key={q}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm",
                    status === 'correct' && "bg-green-100 text-green-700",
                    status === 'incorrect' && "bg-red-100 text-red-700",
                    status === 'current' && "bg-indigo-100 text-indigo-700",
                    status === 'pending' && "bg-gray-100 text-gray-500"
                  )}
                >
                  {q}
                </div>
              );
            })}
          </div>
        </div>
        <Button className="w-full gap-2" variant="outline">
          Save and Exit
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path
              fill="currentColor"
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}