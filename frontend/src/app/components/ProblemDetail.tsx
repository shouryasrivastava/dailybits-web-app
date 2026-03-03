import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Editor from "@monaco-editor/react";
import { ChevronLeft, Play, CheckCircle, BookmarkPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import {
  getProblems,
  getCompletedProblems,
  saveCompletedProblem,
  saveCodeCache,
  getCodeCache,
  clearCodeCache,
  addTodoItem,
  getTodoItems,
} from "../utils/storage";

export function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const problems = getProblems();
  const problem = problems.find((p) => p.id === id);

  const [code, setCode] = useState("");
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!problem) return;

    const completedProblems = getCompletedProblems();
    const completed = completedProblems.find((c) => c.problemId === problem.id);

    if (completed) {
      setCode(completed.code);
      setNotes(completed.notes);
      setIsCompleted(true);
    } else {
      const cache = getCodeCache();
      setCode(cache[problem.id] || problem.starterCode);
      setNotes("");
      setIsCompleted(false);
    }
  }, [problem]);

  useEffect(() => {
    if (problem && code && code !== problem.starterCode) {
      const timer = setTimeout(() => {
        saveCodeCache(problem.id, code);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [code, problem]);

  if (!problem) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Problem not found
          </h2>
          <Button onClick={() => navigate("/")}>Back to Problems</Button>
        </div>
      </div>
    );
  }

  const handleRunCode = () => {
    setOutput(
      "Running code...\n\nNote: This is a demo. In production, code would be executed in a sandboxed environment.\n\nYour code:\n\n" +
        code,
    );
    toast.success("Code executed!");
  };

  const handleMarkComplete = () => {
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

  const handleAddToTodo = () => {
    const todoItems = getTodoItems();
    if (todoItems.some((item) => item.problemId === problem.id)) {
      toast.info("Already in todo list");
      return;
    }
    addTodoItem({
      problemId: problem.id,
      addedAt: new Date(),
      priority: "medium",
    });
    toast.success("Added to todo list!");
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
    <div className="h-full flex">
      {/* Left Panel - Problem Description */}
      <div className="w-1/2 border-r border-neutral-200 flex flex-col bg-white">
        <div className="border-b border-neutral-200 p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
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

          <div className="mb-4">
            <span className="text-sm px-3 py-1 text-neutral-700 rounded-full border-1">
              {problem.algorithm}
            </span>
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
            <Button variant="outline" size="sm" onClick={handleRunCode}>
              <Play className="w-4 h-4 mr-1" />
              Run Code
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
            <TabsTrigger value="output">Output</TabsTrigger>
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

          <TabsContent value="output" className="flex-1 m-0 p-4">
            <div className="h-full bg-neutral-900 text-neutral-100 p-4 rounded-lg font-mono text-sm overflow-y-auto">
              {output || "Run your code to see output here..."}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
