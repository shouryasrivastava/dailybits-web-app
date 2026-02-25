import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  FileText,
  Settings,
  BarChart,
  AlertTriangle,
} from "lucide-react";
import { problems } from "../data/problems";
import {
  getCompletedProblems,
  getTodoItems,
  getStudyPlans,
  getUserRole,
  setUserRole,
} from "../utils/storage";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { toast } from "sonner";

export function Admin() {
  const [userRole, setUserRoleState] = useState(getUserRole());
  const [completedProblems, setCompletedProblems] = useState(
    getCompletedProblems(),
  );
  const [todoItems, setTodoItems] = useState(getTodoItems());
  const [studyPlans, setStudyPlans] = useState(getStudyPlans());

  useEffect(() => {
    setCompletedProblems(getCompletedProblems());
    setTodoItems(getTodoItems());
    setStudyPlans(getStudyPlans());
  }, []);

  // Check if user is admin
  if (userRole !== "administrator") {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-50">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Access Denied
            </h2>
            <p className="text-neutral-600 mb-6">
              You need administrator privileges to access this page.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900 mb-3">
                For demo purposes, you can enable admin mode here:
              </p>
              <div className="flex items-center justify-center gap-3">
                <Label htmlFor="admin-toggle" className="text-sm font-medium">
                  Enable Admin Mode
                </Label>
                <Switch
                  id="admin-toggle"
                  checked={userRole === "administrator"}
                  onCheckedChange={(checked) => {
                    const newRole = checked ? "administrator" : "user";
                    setUserRole(newRole);
                    setUserRoleState(newRole);
                    toast.success(
                      checked ? "Admin mode enabled" : "Admin mode disabled",
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = 1; // Demo: single user
  const totalProblems = problems.length;
  const completedCount = completedProblems.length;
  const todoPending = todoItems.length;

  const problemsByCategory = new Map<string, number>();
  problems.forEach((p) => {
    problemsByCategory.set(
      p.category,
      (problemsByCategory.get(p.category) || 0) + 1,
    );
  });

  const problemsByDifficulty = {
    Easy: problems.filter((p) => p.difficulty === "Easy").length,
    Medium: problems.filter((p) => p.difficulty === "Medium").length,
    Hard: problems.filter((p) => p.difficulty === "Hard").length,
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 border-b border-violet-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-semibold text-white">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-violet-100">System overview and management</p>
          </div>
          <Badge className="bg-white text-violet-700 px-3 py-1">
            Administrator
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Admin Mode Toggle */}
          <Alert>
            <Settings className="w-4 h-4" />
            <AlertTitle>Admin Mode Active</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>You are currently in administrator mode.</span>
              <div className="flex items-center gap-2 ml-4">
                <Label htmlFor="admin-mode" className="text-xs">
                  Admin Mode
                </Label>
                <Switch
                  id="admin-mode"
                  checked={userRole === "administrator"}
                  onCheckedChange={(checked) => {
                    const newRole = checked ? "administrator" : "user";
                    setUserRole(newRole);
                    setUserRoleState(newRole);
                    toast.success(
                      checked ? "Admin mode enabled" : "Admin mode disabled",
                    );
                  }}
                />
              </div>
            </AlertDescription>
          </Alert>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {totalUsers}
              </h3>
              <p className="text-neutral-600">Active Users</p>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {totalProblems}
              </h3>
              <p className="text-neutral-600">Total Problems</p>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <BarChart className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {completedCount}
              </h3>
              <p className="text-neutral-600">Completions</p>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <Settings className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {studyPlans.length}
              </h3>
              <p className="text-neutral-600">Study Plans</p>
            </Card>
          </div>

          {/* Problem Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-violet-600" />
                Problems by Difficulty
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div>
                    <p className="font-semibold text-emerald-900">Easy</p>
                    <p className="text-sm text-emerald-700">
                      Beginner friendly
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">
                    {problemsByDifficulty.Easy}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <p className="font-semibold text-amber-900">Medium</p>
                    <p className="text-sm text-amber-700">Intermediate level</p>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">
                    {problemsByDifficulty.Medium}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-rose-50 rounded-lg border border-rose-200">
                  <div>
                    <p className="font-semibold text-rose-900">Hard</p>
                    <p className="text-sm text-rose-700">Advanced challenges</p>
                  </div>
                  <span className="text-2xl font-bold text-rose-600">
                    {problemsByDifficulty.Hard}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Problems by Category
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Array.from(problemsByCategory.entries())
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
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6 bg-white border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Recent Completions
            </h2>
            {completedProblems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-500">No completions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {completedProblems
                  .sort(
                    (a, b) =>
                      new Date(b.completedAt).getTime() -
                      new Date(a.completedAt).getTime(),
                  )
                  .slice(0, 10)
                  .map((completed) => {
                    const problem = problems.find(
                      (p) => p.id === completed.problemId,
                    );
                    if (!problem) return null;

                    return (
                      <div
                        key={completed.problemId}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-neutral-900">
                            {problem.title}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {new Date(completed.completedAt).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
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
