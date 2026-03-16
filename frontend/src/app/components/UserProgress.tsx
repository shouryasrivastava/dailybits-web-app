import { useState, useEffect } from "react";
import { Link } from "react-router";
import { TrendingUp, Award, Target, Calendar, BarChart3 } from "lucide-react";
import {
  getProblems,
  getCompletedProblems,
  getTodoItems,
} from "../utils/storage";
import {
  fetchUserProgress,
  fetchRecentActivity,
  fetchAlgorithmProgress,
  type UserProgressData,
  type RecentActivityItem,
  type AlgorithmProgressItem,
} from "../utils/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

const ACCOUNT_NUMBER = 1;

function getDifficultyColor(difficulty: string) {
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
}

function getLocalFallbackProgress() {
  const problems = getProblems();
  const completed = getCompletedProblems();
  const todos = getTodoItems();

  const byDiff = (diff: string) =>
    completed.filter((c) => {
      const p = problems.find((pr) => pr.id === c.problemId);
      return p?.difficulty === diff;
    }).length;

  const totalByDiff = (diff: string) =>
    problems.filter((p) => p.difficulty === diff).length;

  return {
    progress: {
      problems_solved: completed.length,
      total_practice_days: 0,
      last_practice_date: null,
      todo_count: todos.length,
      easy_solved: byDiff("Easy"),
      medium_solved: byDiff("Medium"),
      hard_solved: byDiff("Hard"),
      easy_total: totalByDiff("Easy"),
      medium_total: totalByDiff("Medium"),
      hard_total: totalByDiff("Hard"),
    } as UserProgressData,
    recentActivity: completed
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      )
      .slice(0, 5)
      .map((c) => {
        const p = problems.find((pr) => pr.id === c.problemId);
        return {
          problem_id: Number(c.problemId),
          problem_title: p?.title || "Unknown",
          difficulty_level: p?.difficulty || "Easy",
          submitted_at: new Date(c.completedAt).toISOString(),
          is_correct: true,
        } as RecentActivityItem;
      }),
    algorithmProgress: (() => {
      const map = new Map<string, number>();
      completed.forEach((c) => {
        const p = problems.find((pr) => pr.id === c.problemId);
        if (p) {
          const algs = Array.isArray(p.algorithm) ? p.algorithm : [p.algorithm];
          algs.forEach((a: string) => map.set(a, (map.get(a) || 0) + 1));
        }
      });
      return Array.from(map.entries()).map(([name, count]) => ({
        algorithm_name: name,
        problems_solved: count,
      })) as AlgorithmProgressItem[];
    })(),
  };
}

export function UserProgress() {
  const [progressData, setProgressData] = useState<UserProgressData | null>(
    null,
  );
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(
    [],
  );
  const [algorithmData, setAlgorithmData] = useState<AlgorithmProgressItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [progress, recent, algorithms] = await Promise.all([
          fetchUserProgress(ACCOUNT_NUMBER),
          fetchRecentActivity(ACCOUNT_NUMBER),
          fetchAlgorithmProgress(ACCOUNT_NUMBER),
        ]);
        if (!cancelled) {
          setProgressData(progress);
          setRecentActivity(recent);
          setAlgorithmData(algorithms);
        }
      } catch {
        if (!cancelled) {
          const fallback = getLocalFallbackProgress();
          setProgressData(fallback.progress);
          setRecentActivity(fallback.recentActivity);
          setAlgorithmData(fallback.algorithmProgress);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !progressData) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Loading progress...</p>
      </div>
    );
  }

  const {
    problems_solved,
    total_practice_days,
    last_practice_date,
    todo_count,
    easy_solved,
    medium_solved,
    hard_solved,
    easy_total,
    medium_total,
    hard_total,
  } = progressData;

  const formatDate = (iso: string | null) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pct = (solved: number, total: number) =>
    total > 0 ? Math.round((solved / total) * 100) : 0;

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
              <h3 className="text-3xl font-bold mb-1">{problems_solved}</h3>
              <p className="text-neutral-100">Problems Solved</p>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {total_practice_days}
              </h3>
              <p className="text-neutral-600">Practice Days</p>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {formatDate(last_practice_date)}
              </h3>
              <p className="text-neutral-600">Recent Practice</p>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {todo_count}
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
              {(
                [
                  {
                    label: "Easy",
                    solved: easy_solved,
                    total: easy_total,
                    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
                  },
                  {
                    label: "Medium",
                    solved: medium_solved,
                    total: medium_total,
                    color: "bg-amber-100 text-amber-700 border-amber-200",
                  },
                  {
                    label: "Hard",
                    solved: hard_solved,
                    total: hard_total,
                    color: "bg-rose-100 text-rose-700 border-rose-200",
                  },
                ] as const
              ).map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={d.color}>{d.label}</Badge>
                      <span className="text-sm text-neutral-600">
                        {d.solved} / {d.total}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-900">
                      {pct(d.solved, d.total)}%
                    </span>
                  </div>
                  <Progress
                    value={d.total > 0 ? (d.solved / d.total) * 100 : 0}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Algorithm Breakdown */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Problems Practiced by Algorithm
            </h2>
            {algorithmData.filter((a) => a.problems_solved > 0).length === 0 ? (
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
                {algorithmData
                  .filter((a) => a.problems_solved > 0)
                  .sort((a, b) => b.problems_solved - a.problems_solved)
                  .map((alg) => (
                    <div
                      key={alg.algorithm_name}
                      className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      <p className="text-2xl font-bold text-neutral-600 mb-1">
                        {alg.problems_solved}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {alg.algorithm_name}
                      </p>
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
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-500 mb-4">No recent activity</p>
                <Link to="/">
                  <Button>Browse Problems</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item) => (
                  <div
                    key={`${item.problem_id}-${item.submitted_at}`}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <div className="flex-1">
                      <Link
                        to={`/problem/${item.problem_id}`}
                        className="font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                      >
                        {item.problem_title}
                      </Link>
                      <p className="text-xs text-neutral-500 mt-1">
                        {item.is_correct ? "Solved" : "Attempted"} on{" "}
                        {new Date(item.submitted_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(item.difficulty_level)}
                    >
                      {item.difficulty_level}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
