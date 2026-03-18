import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import Editor from "@monaco-editor/react";
import { ChevronLeft, Eye, CheckCircle, BookmarkPlus, GripHorizontal, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import {
  getCompletedProblems,
  saveCompletedProblem,
  saveCodeCache,
  getCodeCache,
  clearCodeCache,
} from "../utils/storage";
import {
  fetchAdminProblem,
  apiProblemDetailToFrontend,
  fetchSolution,
  addTodoApi,
  submitProblemApi,
} from "../utils/api";
import { Problem } from "../types";

const ACCOUNT_NUMBER = 1;

export function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [solutionPanelPosition, setSolutionPanelPosition] = useState({
    x: 48,
    y: 88,
  });
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchAdminProblem(Number(id))
      .then((detail) => {
        const p = apiProblemDetailToFrontend(detail);
        setProblem(p);

        const completedProblems = getCompletedProblems();
        const completed = completedProblems.find((c) => c.problemId === p.id);
        if (completed) {
          setCode(completed.code);
          setNotes(completed.notes);
          setIsCompleted(true);
        } else {
          const cache = getCodeCache();
          setCode(cache[p.id] || p.starterCode);
          setNotes("");
          setIsCompleted(false);
        }
      })
      .catch(() => toast.error("Failed to load problem"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (problem && code && code !== problem.starterCode) {
      const timer = setTimeout(() => {
        saveCodeCache(problem.id, code);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [code, problem]);

  useEffect(() => {
    const handlePointerMove = (event: MouseEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState) return;

      const workspaceRect = workspaceRef.current?.getBoundingClientRect();
      const panelWidth = Math.min(640, (workspaceRect?.width ?? 0) - 48);
      const maxX = workspaceRect
        ? Math.max(16, workspaceRect.width - panelWidth - 16)
        : Number.POSITIVE_INFINITY;
      const maxY = workspaceRect
        ? Math.max(72, workspaceRect.height - 420 - 16)
        : Number.POSITIVE_INFINITY;

      setSolutionPanelPosition({
        x: Math.min(
          maxX,
          Math.max(16, dragState.originX + event.clientX - dragState.startX),
        ),
        y: Math.min(
          maxY,
          Math.max(72, dragState.originY + event.clientY - dragState.startY),
        ),
      });
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Problem not found
          </h2>
          <Button onClick={() => navigate("/problems")}>Back to Problems</Button>
        </div>
      </div>
    );
  }

  const handleShowAnswer = async () => {
    if (showAnswer) {
      setShowAnswer(false);
      return;
    }

    setShowAnswer(true);

    if (solution !== null) {
      return;
    }

    setSolutionLoading(true);
    try {
      const result = await fetchSolution(Number(problem.id));
      setSolution(result.sDescription || null);
    } catch {
      setSolution(null);
    } finally {
      setSolutionLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      await submitProblemApi(ACCOUNT_NUMBER, Number(problem.id), code, true);
    } catch {
      toast.error("Failed to submit problem");
      return;
    }
    saveCompletedProblem({
      problemId: problem.id,
      completedAt: new Date(),
      code,
      notes,
    });
    clearCodeCache(problem.id);
    setIsCompleted(true);
    toast.success("Problem marked as completed!");
  };

  const handleAddToTodo = async () => {
    try {
      await addTodoApi(ACCOUNT_NUMBER, Number(problem.id));
      toast.success("Added to todo list!");
    } catch {
      toast.error("Failed to add to todo list");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
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
  };

  return (
    <div ref={workspaceRef} className="relative h-full flex">
      {/* Left Panel - Problem Description */}
      <div className="w-1/2 border-r border-neutral-200 flex flex-col bg-white">
        <div className="border-b border-neutral-200 p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/problems")}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddToTodo}>
              <BookmarkPlus className="w-4 h-4 mr-1" />
              Add to Todo
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-semibold text-neutral-900">
              {problem.title}
            </h1>
            <Badge
              variant="outline"
              className={getDifficultyColor(problem.difficulty)}
            >
              {problem.difficulty}
            </Badge>
          </div>

          <div className="mb-4 flex gap-2 flex-wrap">
            {problem.algorithm.map((alg) => (
              <span
                key={alg}
                className="text-sm px-3 py-1 text-neutral-700 rounded-full border-1"
              >
                {alg}
              </span>
            ))}
          </div>

          <div className="prose prose-sm max-w-none">
            <h3 className="font-semibold text-neutral-900 mb-2">Description</h3>
            <p className="text-neutral-700 mb-4">{problem.description}</p>

            <h3 className="font-semibold text-neutral-900 mb-2">Examples</h3>
            {problem.examples.map((example, idx) => (
              <div key={idx} className="mb-4 p-4 bg-neutral-50 rounded-lg">
                <p className="mb-1">
                  <strong>Input:</strong>{" "}
                  <code className="bg-white px-2 py-0.5 rounded text-sm">
                    {example.input}
                  </code>
                </p>
                <p className="mb-1">
                  <strong>Output:</strong>{" "}
                  <code className="bg-white px-2 py-0.5 rounded text-sm">
                    {example.output}
                  </code>
                </p>
                {example.explanation && (
                  <p className="text-neutral-600 text-sm mt-2">
                    {example.explanation}
                  </p>
                )}
              </div>
            ))}

            <h3 className="font-semibold text-neutral-900 mb-2">Constraints</h3>
            <ul className="list-disc list-inside space-y-1 text-neutral-700">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx}>{constraint}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="w-1/2 flex flex-col bg-neutral-50">
        <div className="border-b border-neutral-200 p-4 bg-white flex items-center justify-between">
          <span className="font-medium text-neutral-700">Python</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShowAnswer}>
              <Eye className="w-4 h-4 mr-1" />
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </Button>
            <Button
              size="sm"
              onClick={handleMarkComplete}
              className="bg-slate-600 hover:bg-slate-700"
              disabled={isCompleted}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              {isCompleted ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="code" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b bg-white px-4">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </TabsContent>

          <TabsContent value="notes" className="flex-1 m-0 p-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              className="h-full resize-none font-mono"
            />
          </TabsContent>
        </Tabs>

      {showAnswer && (
        <div
          className="absolute z-20 flex h-[420px] w-[min(640px,calc(100%-3rem))] flex-col overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-2xl"
          style={{
            left: `${solutionPanelPosition.x}px`,
            top: `${solutionPanelPosition.y}px`,
          }}
        >
            <div
              className="flex cursor-move items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3"
              onMouseDown={(event) => {
                dragStateRef.current = {
                  startX: event.clientX,
                  startY: event.clientY,
                  originX: solutionPanelPosition.x,
                  originY: solutionPanelPosition.y,
                };
              }}
            >
              <div className="flex items-center gap-2">
                <GripHorizontal className="h-4 w-4 text-neutral-400" />
                <h3 className="font-semibold text-neutral-900">
                  Sample Solution
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowAnswer(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="min-h-0 flex-1">
              {solutionLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                  Loading solution...
                </div>
              ) : solution ? (
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={solution}
                  theme="vs-light"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                  No solution available yet.
                </div>
              )}
            </div>
        </div>
      )}
      </div>

    </div>
  );
}
