import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Code2,
  ListTodo,
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Shield,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "./ui/utils";
import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getCurrentUser, getUserRole, logout } from "../utils/storage";
import { supabase } from "../utils/supabase";

/** Sidebar navigation items */
const navigation = [
  { name: "Problems", href: "/problems", icon: BookOpen },
  { name: "Todo List", href: "/todo", icon: ListTodo },
  { name: "Submissions", href: "/submissions", icon: CheckCircle2 },
  { name: "Progress", href: "/status", icon: BarChart3 },
  { name: "My Profile", href: "/profile", icon: User },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userRole = getUserRole();
  const currentUser = getCurrentUser();
  const token = localStorage.getItem("access_token");

  /** Handle user logout */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout(); // clear local storage
    navigate("/login"); // redirect to login page
  };

  /** Add admin page if user is admin */
  const fullNavigation =
    userRole === "administrator"
      ? [...navigation, { name: "Admin", href: "/admin", icon: Shield }]
      : navigation;

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-neutral-200 flex flex-col transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-neutral-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>

            {!isCollapsed && (
              <div>
                <h1 className="font-semibold text-neutral-900">DailyBits</h1>
                <p className="text-xs text-neutral-500">
                  Master Your Python Skills
                </p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {fullNavigation.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg",
                  isActive
                    ? "bg-slate-50 text-slate-800"
                    : "text-neutral-600 hover:bg-neutral-100",
                  isCollapsed && "justify-center",
                )}
              >
                <item.icon className="w-5 h-5" />

                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div
          className={cn(
            "px-6 py-2 border-t border-b border-neutral-200",
            isCollapsed && "px-2",
          )}
        >
          {token && currentUser ? (
            /* Logged-in user */
            <div
              className={cn(
                "flex items-center gap-3",
                isCollapsed && "justify-center",
              )}
            >
              <Link to="/profile">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-slate-600 text-white text-xs">
                    {(currentUser.firstName || "?")[0]}
                    {(currentUser.lastName || "")[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>

              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {currentUser.isAdmin ? "Admin" : "Student"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Guest view */
            <div
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2",
                isCollapsed && "justify-center px-0",
              )}
            >
              <Avatar className="size-10">
                <AvatarFallback className="bg-neutral-300 text-white">
                  ?
                </AvatarFallback>
              </Avatar>

              {!isCollapsed && (
                <p className="font-medium text-slate-800">Guest</p>
              )}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="px-4 py-2 border-t border-neutral-200">
          <div className={cn("px-4 py-2", isCollapsed && "px-2")}>
            {token ? (
              /* Logout button */
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100",
                  isCollapsed && "justify-center",
                )}
              >
                <LogOut className="w-5 h-5 text-rose-800" />
                {!isCollapsed && (
                  <span className="font-medium text-rose-800">Logout</span>
                )}
              </button>
            ) : (
              /* Login button */
              <button
                onClick={() => navigate("/login")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100",
                  isCollapsed && "justify-center",
                )}
              >
                <User className="w-5 h-5 text-slate-800" />
                {!isCollapsed && (
                  <span className="font-medium text-slate-800">Login</span>
                )}
              </button>
            )}
          </div>

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-full flex items-center gap-2",
              isCollapsed && "justify-center",
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
