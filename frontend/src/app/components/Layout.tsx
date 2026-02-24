import { Link, Outlet, useLocation } from 'react-router';
import { Code2, ListTodo, CheckCircle2, BookOpen, ChevronLeft, ChevronRight, BarChart3, Shield } from 'lucide-react';
import { cn } from './ui/utils';
import { useState } from 'react';
import { Button } from './ui/button';
import { getUserRole } from '../utils/storage';

const navigation = [
  { name: 'Problems', href: '/', icon: BookOpen },
  { name: 'Todo List', href: '/todo', icon: ListTodo },
  { name: 'Completed', href: '/completed', icon: CheckCircle2 },
  { name: 'Progress', href: '/status', icon: BarChart3 },
];

export function Layout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userRole = getUserRole();

  // Add admin page to navigation if user is admin
  const fullNavigation = userRole === 'administrator' 
    ? [...navigation, { name: 'Admin', href: '/admin', icon: Shield }]
    : navigation;

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-neutral-200 flex flex-col transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 border-b border-neutral-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-semibold text-neutral-900">PyPractice</h1>
                <p className="text-xs text-neutral-500">Master Python</p>
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
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-neutral-600 hover:bg-neutral-100',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-full flex items-center gap-2",
              isCollapsed && "justify-center px-0"
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
              © 2026 PyPractice
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