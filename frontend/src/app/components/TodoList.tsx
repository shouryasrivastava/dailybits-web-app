import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Trash2, GripVertical, CheckCircle, StickyNote } from "lucide-react";
import {
  getCompletedProblems,
  saveCompletedProblem,
  getCodeCache,
  getTodoNote,
  saveTodoNote,
} from "../utils/storage";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { StudyPlanChat } from "./StudyPlanChat";
import {
  fetchTodoItemsApi,
  removeTodoApi,
  submitProblemApi,
  ApiTodoItem,
} from "../utils/api";

const ACCOUNT_NUMBER = 1;

export function TodoList() {
  const [todoItems, setTodoItems] = useState<ApiTodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedProblems, setCompletedProblems] = useState(
    getCompletedProblems(),
  );
  const [selectedForNotes, setSelectedForNotes] = useState<number | null>(null);
  const [currentNotes, setCurrentNotes] = useState("");

  useEffect(() => {
    fetchTodoItemsApi(ACCOUNT_NUMBER)
      .then((res) => setTodoItems(res.results))
      .catch(() => toast.error("Failed to load todo list"))
      .finally(() => setLoading(false));
  }, []);

  const refreshCompleted = () => {
    setCompletedProblems(getCompletedProblems());
  };

  const handleRemove = async (item: ApiTodoItem) => {
    try {
      await removeTodoApi(ACCOUNT_NUMBER, item.problem_id);
      setTodoItems((prev) => prev.filter((t) => t.todo_id !== item.todo_id));
      toast.success("Removed from todo list");
    } catch {
      toast.error("Failed to remove from todo list");
    }
  };

  const handleMarkComplete = async (item: ApiTodoItem) => {
    const codeCache = getCodeCache();
    const cachedCode = codeCache[String(item.problem_id)] || "";
    const note = getTodoNote(String(item.problem_id));

    try {
      await submitProblemApi(ACCOUNT_NUMBER, item.problem_id, cachedCode, true);
      await removeTodoApi(ACCOUNT_NUMBER, item.problem_id);
    } catch {
      toast.error("Failed to mark problem as complete");
      return;
    }

    saveCompletedProblem({
      problemId: String(item.problem_id),
      completedAt: new Date(),
      code: cachedCode,
      notes: note,
    });
    setTodoItems((prev) => prev.filter((t) => t.todo_id !== item.todo_id));
    refreshCompleted();
    toast.success("Problem marked as completed!");
  };

  const handleOpenNotes = (item: ApiTodoItem) => {
    setCurrentNotes(getTodoNote(String(item.problem_id)));
    setSelectedForNotes(item.problem_id);
  };

  const handleSaveNotes = () => {
    if (selectedForNotes !== null) {
      saveTodoNote(String(selectedForNotes), currentNotes);
      setSelectedForNotes(null);
      toast.success("Study notes saved!");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Hard":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="h-full flex">
      {/* Todo List */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="border-b border-neutral-200 p-6 min-h-[140px] flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Todo List
          </h1>
          <p className="text-neutral-600">
            Manage your practice problems and priorities
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-neutral-500">Loading...</p>
            </div>
          ) : todoItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-500 mb-4">Your todo list is empty</p>
              <Link to="/problems">
                <Button>Browse Problems</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todoItems.map((item) => {
                const note = getTodoNote(String(item.problem_id));
                return (
                  <div
                    key={item.todo_id}
                    className="border border-neutral-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <GripVertical className="w-5 h-5 text-neutral-400 mt-1 cursor-move" />

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link
                            to={`/problem/${item.problem_id}`}
                            className="font-medium text-neutral-900 hover:text-slate-600 transition-colors"
                          >
                            {item.problem_title}
                          </Link>
                          <Badge
                            variant="outline"
                            className={getDifficultyColor(item.difficulty_level)}
                          >
                            {item.difficulty_level}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                          {item.problem_description}
                        </p>
                        {note && (
                          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                            <span className="font-medium">Notes: </span>
                            {note}
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.algorithms.map((alg) => (
                            <span
                              key={alg}
                              className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md"
                            >
                              {alg}
                            </span>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenNotes(item)}
                            className="h-7 text-xs gap-1"
                          >
                            <StickyNote className="w-3 h-3" />
                            {note ? "Edit Notes" : "Add Notes"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkComplete(item)}
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
                        onClick={() => handleRemove(item)}
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
      <div className="w-[34rem] min-w-[34rem] border-l border-neutral-200 xl:w-[38rem] xl:min-w-[38rem]">
        <StudyPlanChat
          onPlanAccepted={() => {
            fetchTodoItemsApi(ACCOUNT_NUMBER)
              .then((res) => setTodoItems(res.results))
              .catch(() => toast.error("Failed to refresh todo list"));
          }}
        />
      </div>

      {/* Notes Dialog */}
      <Dialog
        open={selectedForNotes !== null}
        onOpenChange={(open) => !open && setSelectedForNotes(null)}
      >
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
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
