import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import Editor from "@monaco-editor/react";
import {
  ChevronLeft,
  Eye,
  CheckCircle,
  BookmarkPlus,
  GripHorizontal,
  X,
  Loader2,
  StickyNote,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import {
  getCompletedProblems,
  saveCompletedProblem,
  saveCodeCache,
  getCodeCache,
  clearCodeCache,
  getCurrentUser,
} from "../utils/storage";
import {
  fetchAdminProblem,
  apiProblemDetailToFrontend,
  fetchSolution,
  addTodoApi,
  submitProblemApi,
  checkCodeWithGemini,
  fetchNoteApi,
  saveNoteApi,
} from "../utils/api";
import { Problem } from "../types";
import { cn } from "./ui/utils";

export function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const token = localStorage.getItem("access_token");
  const accountNumber = currentUser?.accountNumber;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [notes, setNotes] = useState("");
  const [draftNotes, setDraftNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [solutionMeta, setSolutionMeta] = useState({
    explanation: "",
    time: "",
    space: "",
  });
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [rightTab, setRightTab] = useState<"code" | "notes">("code");
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [solutionPanelPosition, setSolutionPanelPosition] = useState({
    x: 48,
    y: 88,
  });
  const [notesPanelPosition, setNotesPanelPosition] = useState({
    x: 100,
    y: 88,
  });

  const solutionDragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const notesDragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    fetchAdminProblem(Number(id))
      .then((detail) => {
        if (cancelled) return;

        const p = apiProblemDetailToFrontend(detail);
        setProblem(p);

        const completedProblems = getCompletedProblems();
        const completed = completedProblems.find((c) => c.problemId === p.id);

        if (completed) {
          setCode(completed.code);
          setNotes(completed.notes || "");
          setDraftNotes(completed.notes || "");
          setIsCompleted(true);
        } else {
          const cache = getCodeCache();
          setCode(cache[p.id] || p.starterCode);
          setIsCompleted(false);

          // only fetch note if logged in
          if (token && accountNumber) {
            fetchNoteApi(accountNumber, Number(p.id))
              .then((res) => {
                if (cancelled) return;
                if (res.note_content) {
                  setNotes(res.note_content);
                  setDraftNotes(res.note_content);
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load problem");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, token, accountNumber]);

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
      const workspaceRect = workspaceRef.current?.getBoundingClientRect();

      if (solutionDragRef.current) {
        const dragState = solutionDragRef.current;
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
      }

      if (notesDragRef.current) {
        const dragState = notesDragRef.current;
        const panelWidth = Math.min(480, (workspaceRect?.width ?? 0) - 48);
        const maxX = workspaceRect
          ? Math.max(16, workspaceRect.width - panelWidth - 16)
          : Number.POSITIVE_INFINITY;
        const maxY = workspaceRect
          ? Math.max(72, workspaceRect.height - 360 - 16)
          : Number.POSITIVE_INFINITY;

        setNotesPanelPosition({
          x: Math.min(
            maxX,
            Math.max(16, dragState.originX + event.clientX - dragState.startX),
          ),
          y: Math.min(
            maxY,
            Math.max(72, dragState.originY + event.clientY - dragState.startY),
          ),
        });
      }
    };

    const handlePointerUp = () => {
      solutionDragRef.current = null;
      notesDragRef.current = null;
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
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
          <Button onClick={() => navigate("/problems")}>
            Back to Problems
          </Button>
        </div>
      </div>
    );
  }

  if (!token || !accountNumber) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-neutral-500">Please login first.</p>
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
      setSolutionMeta({
        explanation: result.solutionExplanation || "",
        time: result.timeComplexity || "",
        space: result.spaceComplexity || "",
      });
    } catch {
      setSolution(null);
    } finally {
      setSolutionLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || isChecking || submitCooldown > 0) return;

    setIsChecking(true);
    try {
      const result = await checkCodeWithGemini(
        accountNumber,
        Number(problem.id),
        code,
        problem.title,
        problem.description,
      );

      try {
        await submitProblemApi(
          accountNumber,
          Number(problem.id),
          code,
          result.is_correct,
        );
      } catch {
        toast.error("Failed to submit problem");
        return;
      }

      if (result.is_correct) {
        saveCompletedProblem({
          problemId: problem.id,
          completedAt: new Date(),
          code,
          notes,
          title: problem.title,
          difficulty: problem.difficulty,
        });
        clearCodeCache(problem.id);
        setIsCompleted(true);
        toast.success("Correct! Problem marked as completed.");
      } else {
        toast.error(result.feedback || "Keep trying!");
      }
    } catch {
      toast.error("Failed to check code. Please try again.");
    } finally {
      setIsChecking(false);
      let remaining = 15;
      setSubmitCooldown(remaining);

      cooldownRef.current = setInterval(() => {
        remaining -= 1;
        setSubmitCooldown(remaining);

        if (remaining <= 0) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
        }
      }, 1000);
    }
  };

  const handleOpenNotes = () => {
    setDraftNotes(notes);
    setShowNotesPanel(true);
    setRightTab("notes");
  };

  const handleCancelNotes = () => {
    setShowNotesPanel(false);
    setRightTab("code");
  };

  const handleSaveNotes = async () => {
    if (!problem) return;

    setNotes(draftNotes);

    const comp = getCompletedProblems().find((c) => c.problemId === problem.id);
    if (comp) {
      saveCompletedProblem({ ...comp, notes: draftNotes });
    }

    saveNoteApi(accountNumber, Number(problem.id), draftNotes).catch(() => {});
    toast.success("Notes saved");
    setShowNotesPanel(false);
    setRightTab("code");
  };

  const handleAddToTodo = async () => {
    try {
      const res = await addTodoApi(accountNumber, Number(problem.id));
      if (res.already_exists) {
        toast.info("Already in your todo list");
      } else {
        toast.success("Added to todo list!");
      }
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
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <h1 className="text-2xl font-semibold text-neutral-900">
              {problem.title}
            </h1>

            <Badge
              variant="outline"
              className={getDifficultyColor(problem.difficulty)}
            >
              {problem.difficulty}
            </Badge>

            {isCompleted && (
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Completed
              </Badge>
            )}
          </div>

          <div className="mb-4 flex gap-2 flex-wrap">
            {problem.algorithm && (
              <span className="text-sm px-3 py-1 text-neutral-700 rounded-full border-1">
                {problem.algorithm}
              </span>
            )}
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
          {/* Tab buttons */}
          <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => {
                setShowNotesPanel(false);
                setRightTab("code");
              }}
              className={cn(
                "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                rightTab === "code"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              Code
            </button>

            <button
              onClick={handleOpenNotes}
              className={cn(
                "px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center gap-1",
                rightTab === "notes"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              <StickyNote className="w-3 h-3" />
              Notes
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShowAnswer}>
              <Eye className="w-4 h-4 mr-1" />
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </Button>

            <Button
              size="sm"
              onClick={handleSubmit}
              className="bg-slate-600 hover:bg-slate-700"
              disabled={isChecking || submitCooldown > 0}
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Checking...
                </>
              ) : submitCooldown > 0 ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1" />
                  Wait {submitCooldown}s
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
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
        </div>

        {/* Solution floating panel */}
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
                solutionDragRef.current = {
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

            <div className="min-h-0 flex-1 flex flex-col">
              {solutionLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                  Loading solution...
                </div>
              ) : solution ? (
                <>
                  <div className="flex-1 min-h-0">
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
                  </div>

                  {(solutionMeta.explanation ||
                    solutionMeta.time ||
                    solutionMeta.space) && (
                    <div className="shrink-0 border-t border-neutral-200 bg-neutral-50 px-4 py-2 text-xs text-neutral-600 space-y-1">
                      {solutionMeta.explanation && (
                        <p>
                          <span className="font-medium text-neutral-700">
                            Explanation:
                          </span>{" "}
                          {solutionMeta.explanation}
                        </p>
                      )}

                      {(solutionMeta.time || solutionMeta.space) && (
                        <p className="flex gap-3">
                          {solutionMeta.time && (
                            <span>
                              <span className="font-medium text-neutral-700">
                                Time:
                              </span>{" "}
                              {solutionMeta.time}
                            </span>
                          )}
                          {solutionMeta.space && (
                            <span>
                              <span className="font-medium text-neutral-700">
                                Space:
                              </span>{" "}
                              {solutionMeta.space}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                  No solution available yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes floating panel */}
        {showNotesPanel && (
          <div
            className="absolute z-20 flex h-[360px] w-[min(480px,calc(100%-3rem))] flex-col overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-2xl"
            style={{
              left: `${notesPanelPosition.x}px`,
              top: `${notesPanelPosition.y}px`,
            }}
          >
            <div
              className="flex cursor-move items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3"
              onMouseDown={(e) => {
                notesDragRef.current = {
                  startX: e.clientX,
                  startY: e.clientY,
                  originX: notesPanelPosition.x,
                  originY: notesPanelPosition.y,
                };
              }}
            >
              <div className="flex items-center gap-2">
                <GripHorizontal className="h-4 w-4 text-neutral-400" />
                <h3 className="font-semibold text-neutral-900">Notes</h3>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleCancelNotes}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 p-3 overflow-hidden">
              <Textarea
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder="Add notes about your approach, edge cases, or anything helpful..."
                className="resize-none text-sm h-full"
              />
            </div>

            <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelNotes}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveNotes}
                className="bg-slate-600 hover:bg-slate-700"
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
