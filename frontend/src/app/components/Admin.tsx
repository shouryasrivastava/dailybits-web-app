import { useState } from "react";
import { Link } from "react-router";
import {
  Shield,
  Users,
  FileText,
  Settings,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import {
  getProblems,
  getUsers,
  getStudyPlans,
  getUserRole,
  setUserRole,
} from "../utils/storage";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { toast } from "sonner";

/**
 * Admin Dashboard — main landing page for administrators.
 * Shows system-wide stats (problems, users, study plans) and links
 * to the Problem Manager and User Manager sub-pages.
 * Non-admin users see an "Access Denied" screen with a demo toggle
 * to enable admin mode for testing purposes.
 */
export function Admin() {
  // Local state mirrors localStorage role so the toggle re-renders immediately
  const [userRole, setUserRoleState] = useState(getUserRole());

  // Non-admin users see an access-denied screen with a demo toggle
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

  // Load data from localStorage to compute overview stats
  const problems = getProblems();
  const users = getUsers();
  const totalProblems = problems.length;
  const totalUsers = users.length;
  const studyPlans = getStudyPlans();

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 p-6 min-h-[140px] flex flex-col justify-center">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-neutral-600">System overview and management</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <Card className="p-6 bg-gradient-to-br from-slate-500 to-slate-600 text-white">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="w-8 h-8 opacity-80 text-yellow-400" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{totalProblems}</h3>
                <p className="text-slate-100">Total Problems</p>
              </Card>
              <Link to="/admin/problems">
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="w-4 h-4 mr-1" />
                  Manage Problems
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              <Card className="p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                  {totalUsers}
                </h3>
                <p className="text-neutral-600">Active Users</p>
              </Card>
              <Link to="/admin/users">
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="w-4 h-4 mr-1" />
                  Manage Users
                </Button>
              </Link>
            </div>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <BookOpen className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {studyPlans.length}
              </h3>
              <p className="text-neutral-600">Study Plans</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
