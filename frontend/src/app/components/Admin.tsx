import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Users,
  FileText,
  Settings,
  BookOpen,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { getUserRole } from "../utils/storage";
import { fetchDashboardStats, DashboardStats } from "../utils/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
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
  const userRole = getUserRole();

  // Stats loaded from the backend API
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => toast.error(`Failed to load stats: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  if (userRole !== "administrator") {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-50">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Access Denied
            </h2>
            <p className="text-neutral-600">
              You need administrator privileges to access this page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

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
          {/* Overview Stats — show spinner while loading from the backend */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-4">
              <Card className="p-6 bg-gradient-to-br from-slate-500 to-slate-600 text-white">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="w-8 h-8 opacity-80 text-yellow-400" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats?.totalProblems ?? 0}</h3>
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
                  {stats?.totalUsers ?? 0}
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
                {stats?.totalStudyPlans ?? 0}
              </h3>
              <p className="text-neutral-600">Study Plans</p>
            </Card>

            <Card className="p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold mb-1 text-neutral-900">
                {stats?.publishedProblems ?? 0}
              </h3>
              <p className="text-neutral-600">Published Problems</p>
            </Card>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
