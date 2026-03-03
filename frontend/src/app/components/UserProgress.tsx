import { useState, useEffect } from "react";
import { Link } from "react-router";
import { TrendingUp, Award, Target, Calendar, BarChart3 } from "lucide-react";
import { getProblems, getCompletedProblems, getTodoItems } from "../utils/storage";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

export function UserProgress() {
  const problems = getProblems();
  const [completedProblems, setCompletedProblems] = useState(
    getCompletedProblems(),
  );
  const [todoItems, setTodoItems] = useState(getTodoItems());

  useEffect(() => {
    setCompletedProblems(getCompletedProblems());
    setTodoItems(getTodoItems());
  }, []);

  // Calculate statistics
  const totalProblems = problems.length;
  const completedCount = completedProblems.length;
  const practiceDays = 0;

  const completedByDifficulty = {
    Easy: completedProblems.filter((c) => {
      const problem = problems.find((p) => p.id === c.problemId);
      return problem?.difficulty === "Easy";
    }).length,
    Medium: completedProblems.filter((c) => {
      const problem = problems.find((p) => p.id === c.problemId);
      return problem?.difficulty === "Medium";
    }).length,
    Hard: completedProblems.filter((c) => {
      const problem = problems.find((p) => p.id === c.problemId);
      return problem?.difficulty === "Hard";
    }).length,
  };

  const totalByDifficulty = {
    Easy: problems.filter((p) => p.difficulty === "Easy").length,
    Medium: problems.filter((p) => p.difficulty === "Medium").length,
    Hard: problems.filter((p) => p.difficulty === "Hard").length,
  };

  const categoriesCompleted = new Map<string, number>();
  completedProblems.forEach((c) => {
    const problem = problems.find((p) => p.id === c.problemId);
    if (problem) {
      categoriesCompleted.set(
        problem.algorithm,
        (categoriesCompleted.get(problem.algorithm) || 0) + 1,
      );
    }
  });

  // Calculate study streak (simplified - just days with completions in last 30 days)
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const recentCompletions = completedProblems.filter(
    (c) => new Date(c.completedAt) >= last30Days,
  );
  const recentPracticeDate = "Feb. 20, 2026";

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 p-6 min-h-[140px] flex flex-col justify-center">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          Your Progress
        </h1>
        <p className="text-neutral-600">Track your coding practice journey</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-slate-500 to-slate-600 text-white">
              <div className="flex items-center justify-between mb-3">
                <Award className="w-8 h-8 opacity-80 text-yellow-400" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{completedCount}</h3>
              <p className="text-violet-100">Problems Solved</p>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {practiceDays}
              </h3>
              <p className="text-neutral-600">Practice Days</p>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {recentPracticeDate}
              </h3>
              <p className="text-neutral-600">Recent Practice</p>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {todoItems.length}
              </h3>
              <p className="text-neutral-600">In Todo List</p>
            </Card>
          </div>

          {/* Difficulty Breakdown */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Progress by Difficulty
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      Easy
                    </Badge>
                    <span className="text-sm text-neutral-600">
                      {completedByDifficulty.Easy} / {totalByDifficulty.Easy}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {Math.round(
                      (completedByDifficulty.Easy / totalByDifficulty.Easy) *
                        100,
                    ) || 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (completedByDifficulty.Easy / totalByDifficulty.Easy) * 100
                  }
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                      Medium
                    </Badge>
                    <span className="text-sm text-neutral-600">
                      {completedByDifficulty.Medium} /{" "}
                      {totalByDifficulty.Medium}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {Math.round(
                      (completedByDifficulty.Medium /
                        totalByDifficulty.Medium) *
                        100,
                    ) || 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (completedByDifficulty.Medium / totalByDifficulty.Medium) *
                    100
                  }
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-rose-100 text-rose-700 border-rose-200">
                      Hard
                    </Badge>
                    <span className="text-sm text-neutral-600">
                      {completedByDifficulty.Hard} / {totalByDifficulty.Hard}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {Math.round(
                      (completedByDifficulty.Hard / totalByDifficulty.Hard) *
                        100,
                    ) || 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (completedByDifficulty.Hard / totalByDifficulty.Hard) * 100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </Card>

          {/* Category Breakdown */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Problems Practiced by Algorithm
            </h2>
            {categoriesCompleted.size === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-500 mb-4">
                  No problems completed yet
                </p>
                <Link to="/">
                  <Button>Start Practicing</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from(categoriesCompleted.entries())
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <div
                      key={category}
                      className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      <p className="text-2xl font-bold text-violet-600 mb-1">
                        {count}
                      </p>
                      <p className="text-sm text-neutral-600">{category}</p>
                    </div>
                  ))}
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Recent Activity
            </h2>
            {completedProblems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-500 mb-4">No recent activity</p>
                <Link to="/">
                  <Button>Browse Problems</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {completedProblems
                  .sort(
                    (a, b) =>
                      new Date(b.completedAt).getTime() -
                      new Date(a.completedAt).getTime(),
                  )
                  .slice(0, 5)
                  .map((completed) => {
                    const problem = problems.find(
                      (p) => p.id === completed.problemId,
                    );
                    if (!problem) return null;

                    return (
                      <div
                        key={completed.problemId}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                      >
                        <div className="flex-1">
                          <Link
                            to={`/problem/${problem.id}`}
                            className="font-medium text-neutral-900 hover:text-violet-600 transition-colors"
                          >
                            {problem.title}
                          </Link>
                          <p className="text-xs text-neutral-500 mt-1">
                            Completed on{" "}
                            {new Date(completed.completedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            problem.difficulty === "Easy"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : problem.difficulty === "Medium"
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-rose-100 text-rose-700 border-rose-200"
                          }
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
