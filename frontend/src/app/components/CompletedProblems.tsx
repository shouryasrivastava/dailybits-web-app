import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Calendar, Trash2, Edit3 } from 'lucide-react';
import { getProblems, getCompletedProblems, removeCompletedProblem } from '../utils/storage';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';

export function CompletedProblems() {
  const problems = getProblems();
  const [completedProblems, setCompletedProblems] = useState(
    getCompletedProblems()
  );
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  const refreshCompleted = () => {
    setCompletedProblems(getCompletedProblems());
  };

  const handleRemove = (problemId: string) => {
    removeCompletedProblem(problemId);
    refreshCompleted();
    toast.success('Removed from completed problems');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Hard':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const selectedCompleted = completedProblems.find(
    (c) => c.problemId === selectedProblem
  );
  const selectedProblemData = problems.find((p) => p.id === selectedProblem);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-neutral-200 p-6 min-h-[140px] flex flex-col justify-center">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          Completed Problems
        </h1>
        <p className="text-neutral-600">
          Review your solutions and study notes
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {completedProblems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">
              No completed problems yet
            </p>
            <Link to="/">
              <Button>Start Practicing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedProblems.map((completed) => {
              const problem = problems.find((p) => p.id === completed.problemId);
              if (!problem) return null;

              return (
                <div
                  key={completed.problemId}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/problem/${problem.id}`}
                          className="font-medium text-neutral-900 hover:text-violet-600 transition-colors"
                        >
                          {problem.title}
                        </Link>
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(problem.difficulty)}
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(completed.completedAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(problem.id)}
                      className="text-neutral-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {problem.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                      {problem.algorithm}
                    </span>
                  </div>

                  {completed.notes && (
                    <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs font-medium text-amber-900 mb-1">
                        Study Notes:
                      </p>
                      <p className="text-xs text-amber-800 line-clamp-3">
                        {completed.notes}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProblem(problem.id)}
                    className="w-full"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    View Solution
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Solution Dialog */}
      <Dialog
        open={selectedProblem !== null}
        onOpenChange={(open) => !open && setSelectedProblem(null)}
      >
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedProblemData?.title} - Solution
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Code */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <h3 className="font-medium text-sm text-neutral-700 mb-2">
                Your Code
              </h3>
              <div className="flex-1 border border-neutral-200 rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={selectedCompleted?.code || ''}
                  theme="vs-light"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>

            {/* Notes */}
            {selectedCompleted?.notes && (
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 max-h-48 overflow-y-auto">
                <h3 className="font-medium text-sm text-neutral-700 mb-2">
                  Study Notes
                </h3>
                <p className="text-sm text-neutral-600 whitespace-pre-wrap">
                  {selectedCompleted.notes}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
