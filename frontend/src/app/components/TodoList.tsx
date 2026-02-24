import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Trash2, GripVertical, CheckCircle, StickyNote } from 'lucide-react';
import { problems } from '../data/problems';
import { getTodoItems, removeTodoItem, updateTodoPriority, updateTodoNotes, getCompletedProblems, saveCompletedProblem, getCodeCache } from '../utils/storage';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { StudyPlanChat } from './StudyPlanChat';

export function TodoList() {
  const [todoItems, setTodoItems] = useState(getTodoItems());
  const [completedProblems, setCompletedProblems] = useState(getCompletedProblems());
  const [selectedForNotes, setSelectedForNotes] = useState<string | null>(null);
  const [currentNotes, setCurrentNotes] = useState('');

  const refreshTodos = () => {
    setTodoItems(getTodoItems());
    setCompletedProblems(getCompletedProblems());
  };

  const handleRemove = (problemId: string) => {
    removeTodoItem(problemId);
    refreshTodos();
    toast.success('Removed from todo list');
  };

  const handlePriorityChange = (problemId: string, priority: string) => {
    updateTodoPriority(problemId, priority as 'low' | 'medium' | 'high');
    refreshTodos();
  };

  const handleMarkComplete = (problemId: string) => {
    const problem = problems.find((p) => p.id === problemId);
    if (!problem) return;

    const codeCache = getCodeCache();
    const todoItem = todoItems.find((item) => item.problemId === problemId);

    saveCompletedProblem({
      problemId,
      completedAt: new Date(),
      code: codeCache[problemId] || problem.starterCode,
      notes: todoItem?.notes || '',
    });

    removeTodoItem(problemId);
    refreshTodos();
    toast.success('Problem marked as completed!');
  };

  const handleOpenNotes = (problemId: string) => {
    const todoItem = todoItems.find((item) => item.problemId === problemId);
    setCurrentNotes(todoItem?.notes || '');
    setSelectedForNotes(problemId);
  };

  const handleSaveNotes = () => {
    if (selectedForNotes) {
      updateTodoNotes(selectedForNotes, currentNotes);
      refreshTodos();
      setSelectedForNotes(null);
      toast.success('Study notes saved!');
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
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

  return (
    <div className="h-full flex">
      {/* Todo List */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Todo List
          </h1>
          <p className="text-neutral-600">
            Manage your practice problems and priorities
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {todoItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-500 mb-4">Your todo list is empty</p>
              <Link to="/">
                <Button>Browse Problems</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todoItems.map((item) => {
                const problem = problems.find((p) => p.id === item.problemId);
                if (!problem) return null;

                return (
                  <div
                    key={item.problemId}
                    className="border border-neutral-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <GripVertical className="w-5 h-5 text-neutral-400 mt-1 cursor-move" />
                      
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
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                          {problem.description}
                        </p>
                        {item.notes && (
                          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                            <span className="font-medium">Notes: </span>{item.notes}
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                            {problem.category}
                          </span>
                          <Select
                            value={item.priority || 'medium'}
                            onValueChange={(value) =>
                              handlePriorityChange(problem.id, value)
                            }
                          >
                            <SelectTrigger className="w-32 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low Priority</SelectItem>
                              <SelectItem value="medium">
                                Medium Priority
                              </SelectItem>
                              <SelectItem value="high">High Priority</SelectItem>
                            </SelectContent>
                          </Select>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(item.priority)}
                          >
                            {item.priority || 'medium'}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenNotes(problem.id)}
                            className="h-7 text-xs gap-1"
                          >
                            <StickyNote className="w-3 h-3" />
                            {item.notes ? 'Edit Notes' : 'Add Notes'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkComplete(problem.id)}
                            className="h-7 text-xs gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Mark Complete
                          </Button>
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Study Plan Chat */}
      <div className="w-96 border-l border-neutral-200">
        <StudyPlanChat onPlanAccepted={refreshTodos} />
      </div>

      {/* Notes Dialog */}
      <Dialog open={selectedForNotes !== null} onOpenChange={(open) => !open && setSelectedForNotes(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Study Notes</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              placeholder="Add your study notes, key insights, or reminders for this problem..."
              className="min-h-[200px] resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedForNotes(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}