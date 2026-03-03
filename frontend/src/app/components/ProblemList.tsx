import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Search, Plus, Settings } from "lucide-react";
import { getProblems, getTodoItems, addTodoItem, getUserRole } from "../utils/storage";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function ProblemList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [algorithmFilter, setAlgorithmFilter] = useState<string>("all");
  const [todoItems, setTodoItems] = useState(getTodoItems());
  const problems = getProblems();
  const userRole = getUserRole();

  const categories = useMemo(() => {
    const cats = new Set(problems.map((p) => p.algorithm));
    return Array.from(cats).sort();
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.algorithm.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      const matchesalgorithm =
        algorithmFilter === "all" || problem.algorithm === algorithmFilter;
      return matchesSearch && matchesDifficulty && matchesalgorithm;
    });
  }, [searchQuery, difficultyFilter, algorithmFilter]);

  const handleAddToTodo = (problemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addTodoItem({
      problemId,
      addedAt: new Date(),
      priority: "medium",
    });
    setTodoItems(getTodoItems());
    toast.success("Added to todo list!");
  };

  const isInTodo = (problemId: string) => {
    return todoItems.some((item) => item.problemId === problemId);
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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 p-6 min-h-[140px]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Problem List
          </h1>
          {userRole === "administrator" && (
            <Link to="/admin/problems">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Manage Problems
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={algorithmFilter} onValueChange={setAlgorithmFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Algorithms</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Problem List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {filteredProblems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="block group"
            >
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-neutral-900 group-hover:text-slate-600 transition-colors">
                        {problem.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(problem.difficulty)}
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
                      {problem.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                        {problem.algorithm}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleAddToTodo(problem.id, e)}
                    disabled={isInTodo(problem.id)}
                    className="ml-4"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {isInTodo(problem.id) ? "In Todo" : "Add to Todo"}
                  </Button>
                </div>
              </div>
            </Link>
          ))}

          {filteredProblems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No problems found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
