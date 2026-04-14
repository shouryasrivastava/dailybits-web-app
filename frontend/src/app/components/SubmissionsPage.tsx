import { useState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import Editor from "@monaco-editor/react";
import { fetchSubmissionsApi, ApiSubmission } from "../utils/api";
import { CompletedProblems } from "./CompletedProblems";
import { cn } from "./ui/utils";
import { getCurrentUser } from "../utils/storage";

type Tab = "submissions" | "completed";

export function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("submissions");
  const [submissions, setSubmissions] = useState<ApiSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ApiSubmission | null>(null);

  const currentUser = getCurrentUser();
  const token = localStorage.getItem("access_token");
  const accountNumber = currentUser?.accountNumber;

  useEffect(() => {
    if (activeTab !== "submissions") return;

    if (!token || !accountNumber) {
      setSubmissions([]);
      setLoadingSubmissions(false);
      return;
    }

    let cancelled = false;
    setLoadingSubmissions(true);

    fetchSubmissionsApi(accountNumber)
      .then((data) => {
        if (!cancelled) {
          setSubmissions(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSubmissions([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingSubmissions(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, token, accountNumber]);

  const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-neutral-200 p-6 min-h-[100px] flex flex-col justify-center">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-3">
          Submissions
        </h1>

        <div className="flex gap-1 bg-neutral-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("submissions")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === "submissions"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900",
            )}
          >
            All Submissions
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === "completed"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900",
            )}
          >
            Completed
          </button>
        </div>
      </div>

      {activeTab === "submissions" ? (
        <div className="flex-1 overflow-y-auto p-6">
          {!token || !accountNumber ? (
            <div className="text-center py-12 text-neutral-500">
              Please login first.
            </div>
          ) : loadingSubmissions ? (
            <div className="text-center py-12 text-neutral-500">
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              No submissions yet.
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.map((sub) => (
                <div
                  key={sub.submission_id}
                  className="flex items-center justify-between border border-neutral-200 rounded-lg px-4 py-3 bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {sub.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    )}

                    <div className="min-w-0">
                      <p className="font-medium text-neutral-900 truncate">
                        {sub.problem_title || `Problem #${sub.problem_id}`}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(sub.submitted_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <Badge
                      variant="outline"
                      className={
                        sub.is_correct
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }
                    >
                      {sub.is_correct ? "Passed" : "Failed"}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      View Code
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <CompletedProblems />
        </div>
      )}

      <Dialog
        open={selectedSubmission !== null}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedSubmission?.problem_title ||
                `Problem #${selectedSubmission?.problem_id}`}{" "}
              — Submission
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 border border-neutral-200 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={selectedSubmission?.submitted_code || ""}
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
