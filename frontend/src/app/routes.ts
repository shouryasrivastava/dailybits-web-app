import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProblemList } from "./components/ProblemList";
import { ProblemDetail } from "./components/ProblemDetail";
import { TodoList } from "./components/TodoList";
import { CompletedProblems } from "./components/CompletedProblems";
import { UserProgress } from "./components/UserProgress";
import { Admin } from "./components/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: ProblemList },
      { path: "problem/:id", Component: ProblemDetail },
      { path: "todo", Component: TodoList },
      { path: "completed", Component: CompletedProblems },
      { path: "status", Component: UserProgress },
      { path: "admin", Component: Admin },
    ],
  },
]);
