import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { StudyPlanChat } from "./StudyPlanChat";
import { fetchTodoItemsApi, removeTodoApi, ApiTodoItem } from "../utils/api";
import { getCurrentUser } from "../utils/storage";

export function TodoList() {
  const [todoItems, setTodoItems] = useState<ApiTodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();
  const token = localStorage.getItem("access_token");
  const accountNumber = currentUser?.accountNumber;

  // const ACCOUNT_NUMBER = 1;

  useEffect(() => {
    if (!token || !accountNumber) {
      setTodoItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchTodoItemsApi(accountNumber)
      .then((res) => {
        if (!cancelled) {
          setTodoItems(res.results);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load todo list");
          setTodoItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, accountNumber]);

  const handleRemove = async (item: ApiTodoItem) => {
    if (!accountNumber) {
      toast.error("Please login first");
      return;
    }

    try {
      await removeTodoApi(accountNumber, item.problem_id);
      setTodoItems((prev) => prev.filter((t) => t.todo_id !== item.todo_id));
      toast.success("Removed from todo list");
    } catch {
      toast.error("Failed to remove from todo list");
    }
  };

  const refreshTodoList = async () => {
    if (!accountNumber) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await fetchTodoItemsApi(accountNumber);
      setTodoItems(res.results);
    } catch {
      toast.error("Failed to refresh todo list");
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
          {!token || !accountNumber ? (
            <div className="text-center py-12">
              <p className="text-neutral-500 mb-4">Please login first</p>
            </div>
          ) : loading ? (
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
                return (
                  <div
                    key={item.todo_id}
                    className="border border-neutral-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-4">
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
                            className={getDifficultyColor(
                              item.difficulty_level,
                            )}
                          >
                            {item.difficulty_level}
                          </Badge>

                          {item.source === "study_plan" && (
                            <Badge
                              variant="outline"
                              className="bg-sky-50 text-sky-700 border-sky-200"
                            >
                              Study Plan
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                          {item.problem_description}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          {item.algorithms.map((alg) => (
                            <span
                              key={alg}
                              className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md"
                            >
                              {alg}
                            </span>
                          ))}
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
        <StudyPlanChat onPlanAccepted={refreshTodoList} />
      </div>
    </div>
  );
}
