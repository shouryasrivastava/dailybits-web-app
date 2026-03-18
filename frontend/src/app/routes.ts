import { createBrowserRouter, Navigate } from "react-router";
import { createElement } from "react";
import { Layout } from "./components/Layout";
import { ProblemList } from "./components/ProblemList";
import { ProblemDetail } from "./components/ProblemDetail";
import { TodoList } from "./components/TodoList";
import { CompletedProblems } from "./components/CompletedProblems";
import { UserProgress } from "./components/UserProgress";
import { Admin } from "./components/Admin";
import { AdminProblemManager } from "./components/AdminProblemManager";
import { AdminUserManager } from "./components/AdminUserManager";
import { UserProfilePage } from "./components/UserProfilePage";
import Login from "./components/Login";
import Signup from "./components/Signup";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: createElement(Navigate, { to: "/todo", replace: true }) },
      { path: "problems", Component: ProblemList },
      { path: "problem/:id", Component: ProblemDetail },
      { path: "todo", Component: TodoList },
      { path: "completed", Component: CompletedProblems },
      { path: "status", Component: UserProgress },
      { path: "admin", Component: Admin },
      { path: "admin/problems", Component: AdminProblemManager },
      { path: "admin/users", Component: AdminUserManager },
      { path: "profile", Component: UserProfilePage },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
    ],
  },
]);
