import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Eye } from "lucide-react";
import { getProblems, getCompletedProblems } from "../utils/storage";
import { fetchProblems } from "../utils/api";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import Editor from "@monaco-editor/react";

export function CompletedProblems() {
  const localProblems = getProblems();
  const [completedProblems, setCompletedProblems] = useState(
    getCompletedProblems(),
  );
  const [publishedIds, setPublishedIds] = useState<Set<string> | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  useEffect(() => {
    fetchProblems(1)
      .then((res) => {
        const ids = new Set(res.results.map((p) => String(p.problem_id)));
        setPublishedIds(ids);
      })
      .catch(() => {});
  }, []);

  const visibleCompleted = publishedIds
    ? completedProblems.filter((c) => publishedIds.has(c.problemId))
    : completedProblems;

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

  const selectedCompleted = completedProblems.find(
    (c) => c.problemId === selectedProblem,
  );
  const selectedProblemData = localProblems.find((p) => p.id === selectedProblem);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        {visibleCompleted.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">No completed problems yet</p>
            <Link to="/problems">
              <Button>Start Practicing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {visibleCompleted.map((completed) => {
              // Use title/difficulty stored at completion time; fall back to
              // the local problem store for records saved before this field existed.
              const localProblem = localProblems.find(
                (p) => p.id === completed.problemId,
              );
              const title = completed.title || localProblem?.title || `Problem #${completed.problemId}`;
              const difficulty = completed.difficulty || localProblem?.difficulty;

              return (
                <div
                  key={completed.problemId}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="mb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        to={`/problem/${completed.problemId}`}
                        className="font-medium text-neutral-900 hover:text-slate-600 transition-colors"
                      >
                        {title}
                      </Link>
                      {difficulty && (
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(difficulty)}
                        >
                          {difficulty}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(completed.completedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </div>
                  </div>

                  {localProblem?.description && (
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                      {localProblem.description}
                    </p>
                  )}

                  {localProblem?.algorithm && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                        {localProblem.algorithm}
                      </span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProblem(completed.problemId)}
                    className="w-full"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Submission
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Solution Dialog */}
      <Dialog
        open={selectedProblem !== null}
        onOpenChange={(open) => !open && setSelectedProblem(null)}
      >
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
            {selectedCompleted?.title || selectedProblemData?.title || `Problem #${selectedProblem}`} - Submission
          </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Code */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <h3 className="font-medium text-sm text-neutral-700 mb-2">
                Your Code
              </h3>
              <div className="flex-1 border border-neutral-200 rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={selectedCompleted?.code || ""}
                  theme="vs-light"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>

            {/* Notes */}
            {selectedCompleted?.notes && (
              <div className="shrink-0">
                <h3 className="font-medium text-sm text-neutral-700 mb-2">
                  Notes
                </h3>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-neutral-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedCompleted.notes}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
