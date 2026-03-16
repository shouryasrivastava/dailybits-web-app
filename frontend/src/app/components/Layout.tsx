import { Link, Outlet, useLocation } from "react-router";
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
} from "lucide-react";
import { cn } from "./ui/utils";
import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getCurrentUser, getUserRole } from "../utils/storage";

const navigation = [
  { name: "Problems", href: "/", icon: BookOpen },
  { name: "Todo List", href: "/todo", icon: ListTodo },
  { name: "Completed", href: "/completed", icon: CheckCircle2 },
  { name: "Progress", href: "/status", icon: BarChart3 },
  { name: "My Profile", href: "/profile", icon: User },
];

export function Layout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userRole = getUserRole();
  const currentUser = getCurrentUser();

  const fullNavigation = [
    ...navigation,
    { name: "Admin", href: "/admin", icon: Shield },
  ];

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-neutral-200 flex flex-col transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        <div className="p-6 border-b border-neutral-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
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

        <nav className="flex-1 p-4 space-y-1">
          {fullNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-slate-50 text-slate-800"
                    : "text-neutral-600 hover:bg-neutral-100",
                  isCollapsed && "justify-center",
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile widget */}
        <div
          className={cn(
            "px-6 py-4 border-b border-neutral-200 flex items-center gap-3 border-t",
            isCollapsed && "justify-center px-2",
          )}
        >
          <Link to="/profile" key="profile">
            <Avatar className="size-10 flex-shrink-0">
              <AvatarFallback className="bg-slate-600 text-white text-xs font-medium">
                {(currentUser.firstName || "?")[0]}
                {(currentUser.lastName || "")[0]}
              </AvatarFallback>
            </Avatar>
          </Link>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-md font-medium text-neutral-900 truncate">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-xs text-neutral-500">
                {currentUser.isAdmin ? "Admin" : "Student"}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-neutral-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-full flex items-center gap-2",
              isCollapsed && "justify-center px-0",
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
          {!isCollapsed && (
            <div className="text-xs text-neutral-500 text-center mt-2">
              © 2026 DailyBits
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
