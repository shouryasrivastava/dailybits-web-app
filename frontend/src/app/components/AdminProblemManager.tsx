import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Plus, Pencil, Trash2, ArrowLeft, X, Loader2, Eye, EyeOff, FileText } from "lucide-react";
import { Problem, Difficulty } from "../types";
import { getUserRole } from "../utils/storage";
import {
  fetchAdminProblems,
  fetchAdminProblem,
  createProblem,
  updateProblemApi,
  deleteProblemApi,
  setProblemPublishedApi,
  fetchAlgorithms,
  fetchSolution,
  saveSolution,
  apiProblemListToFrontend,
  apiProblemDetailToFrontend,
  ProblemPayload,
} from "../utils/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

/** Shape of the add/edit problem form fields */
interface ProblemFormData {
  title: string;
  difficulty: Difficulty;
  algorithm: string;
  estimateTime: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: string;
  solutionCode: string;
}

/** Default blank form used when adding a new problem or resetting the dialog */
const emptyForm: ProblemFormData = {
  title: "",
  difficulty: "Easy",
  algorithm: "",
  estimateTime: "",
  description: "",
  examples: [{ input: "", output: "" }],
  constraints: [""],
  starterCode: "",
  solutionCode: "",
};

/** Hardcoded fallback used if the backend algorithm list fails to load */
const FALLBACK_ALGORITHMS = [
  "Array", "Backtracking", "Binary Search", "Bit Manipulation",
  "Dynamic Programming", "Graph", "Greedy", "Hash Table", "Heap",
  "Linked List", "Math", "Recursion", "Sliding Window", "Sorting",
  "Stack", "String", "Tree", "Trie", "Two Pointers",
];

/**
 * AdminProblemManager — full CRUD interface for coding problems.
 * Admins can add, edit, and delete problems via a table view.
 * All data is read/written through the Django backend API.
 */
export function AdminProblemManager() {
  const navigate = useNavigate();
  const userRole = getUserRole();

  // Problem list loaded from the backend
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [form, setForm] = useState<ProblemFormData>(emptyForm);
  const [editFocusSection, setEditFocusSection] = useState<"problem" | "solution">("problem");

  // Preview dialog state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewProblem, setPreviewProblem] = useState<Problem | null>(null);
  const [previewSolutionCode, setPreviewSolutionCode] = useState("");

  // Algorithm dropdown: DB-loaded list + session-added custom names
  const [dbAlgorithms, setDbAlgorithms] = useState<string[]>([]);
  const [customAlgorithms, setCustomAlgorithms] = useState<string[]>([]);
  const [addingCustomAlgo, setAddingCustomAlgo] = useState(false);
  const [customAlgoInput, setCustomAlgoInput] = useState("");

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProblemId, setDeletingProblemId] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const solutionTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Redirect non-admin users back to the admin landing page
  if (userRole !== "administrator") {
    navigate("/admin");
    return null;
  }

  /** Fetch the problem list from the backend */
  const refreshProblems = async () => {
    try {
      const data = await fetchAdminProblems();
      setProblems(data.map(apiProblemListToFrontend));
    } catch (err: any) {
      toast.error(`Failed to load problems: ${err.message}`);
    }
  };

  // Load problems and algorithms on mount
  useEffect(() => {
    refreshProblems().finally(() => setLoading(false));

    // Load algorithm names from the DB for the dropdown
    fetchAlgorithms()
      .then((algos) => setDbAlgorithms(algos.map((a) => a.name)))
      .catch(() => setDbAlgorithms(FALLBACK_ALGORITHMS));
  }, []);

  /** Open the dialog in "add" mode with a blank form */
  const openAddDialog = () => {
    setEditingProblem(null);
    setForm(emptyForm);
    setEditFocusSection("problem");
    setDialogOpen(true);
  };

  const loadProblemEditorData = async (problemId: number) => {
    const detail = await fetchAdminProblem(problemId);
    const fullProblem = apiProblemDetailToFrontend(detail);

    let solutionCode = "";
    try {
      const solution = await fetchSolution(problemId);
      solutionCode = solution.sDescription || "";
    } catch (err: any) {
      if (!String(err.message).toLowerCase().includes("solution not found")) {
        throw err;
      }
    }

    return { fullProblem, solutionCode };
  };

  const buildFormFromProblem = (
    fullProblem: Problem,
    solutionCode: string,
  ): ProblemFormData => ({
    title: fullProblem.title,
    difficulty: fullProblem.difficulty,
    algorithm: fullProblem.algorithm[0] || "",
    estimateTime: fullProblem.estimateTime?.toString() || "",
    description: fullProblem.description,
    examples: fullProblem.examples.length > 0
      ? fullProblem.examples
      : [{ input: "", output: "" }],
    constraints: fullProblem.constraints.length > 0
      ? fullProblem.constraints
      : [""],
    starterCode: fullProblem.starterCode,
    solutionCode,
  });

  /** Open the preview dialog for a problem */
  const openPreviewDialog = async (problem: Problem) => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewProblem(null);
    setPreviewSolutionCode("");
    try {
      const { fullProblem, solutionCode } = await loadProblemEditorData(Number(problem.id));
      setPreviewProblem(fullProblem);
      setPreviewSolutionCode(solutionCode);
    } catch (err: any) {
      toast.error(`Failed to load problem: ${err.message}`);
      setPreviewOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  /** Open the dialog in "edit" mode after loading full problem + solution data */
  const openEditDialog = async (
    problem: Problem,
    focusSection: "problem" | "solution" = "problem",
  ) => {
    try {
      const { fullProblem, solutionCode } = await loadProblemEditorData(Number(problem.id));
      setEditingProblem(fullProblem);
      setForm(buildFormFromProblem(fullProblem, solutionCode));
      setEditFocusSection(focusSection);
      setPreviewOpen(false);
      setDialogOpen(true);
    } catch (err: any) {
      toast.error(`Failed to load problem: ${err.message}`);
    }
  };

  /** Show the delete confirmation dialog for a specific problem */
  const openDeleteDialog = (problemId: string) => {
    setDeletingProblemId(problemId);
    setDeleteDialogOpen(true);
  };

  /** Validate the form and send a create/update request to the backend */
  const handleSave = async () => {
    const isSolutionOnlyEdit = Boolean(editingProblem) && editFocusSection === "solution";

    if (!isSolutionOnlyEdit && (!form.title.trim() || !form.algorithm.trim())) {
      toast.error("Title and algorithm are required");
      return;
    }

    try {
      let problemId = editingProblem ? Number(editingProblem.id) : null;
      let payload: ProblemPayload | null = null;

      if (!isSolutionOnlyEdit) {
        payload = {
          title: form.title.trim(),
          difficulty: form.difficulty,
          description: form.description.trim(),
          estimateTimeBaseline: form.estimateTime.trim() ? Number(form.estimateTime) : null,
          starterCode: form.starterCode,
          algorithms: [form.algorithm.trim()],
          examples: form.examples.filter((e) => e.input.trim() || e.output.trim()),
          constraints: form.constraints.filter((c) => c.trim()),
        };
      }

      if (editingProblem && payload) {
        await updateProblemApi(Number(editingProblem.id), payload);
      } else {
        if (payload) {
          const created = await createProblem(payload);
          problemId = created.problemId;
        }
      }

      if (problemId) {
        await saveSolution(problemId, form.solutionCode);
      }

      toast.success(
        isSolutionOnlyEdit
          ? "Solution updated"
          : editingProblem
            ? "Problem updated"
            : "Problem added",
      );
      if (previewProblem && editingProblem && previewProblem.id === editingProblem.id) {
        if (payload) {
          setPreviewProblem({
            ...editingProblem,
            title: payload.title,
            difficulty: form.difficulty,
            description: payload.description,
            estimateTime: payload.estimateTimeBaseline ?? undefined,
            starterCode: payload.starterCode,
            algorithm: payload.algorithms,
            examples: payload.examples,
            constraints: payload.constraints,
          });
        }
        setPreviewSolutionCode(form.solutionCode.trim());
      }
      setDialogOpen(false);
      await refreshProblems();
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`);
    }
  };

  useEffect(() => {
    if (!dialogOpen) return;

      const focusTarget =
      editFocusSection === "solution"
        ? solutionTextareaRef.current
        : titleInputRef.current;
    focusTarget?.focus();
    if (editFocusSection === "solution") {
      solutionTextareaRef.current?.scrollIntoView({ block: "center" });
    }
  }, [dialogOpen, editFocusSection]);

  /** Send a delete request to the backend and refresh the list */
  const handleDelete = async () => {
    if (!deletingProblemId) return;
    try {
      await deleteProblemApi(Number(deletingProblemId));
      toast.success("Problem deleted");
      setDeleteDialogOpen(false);
      setDeletingProblemId(null);
      await refreshProblems();
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const handleTogglePublished = async (problem: Problem) => {
    const nextPublishedState = !problem.isPublished;
    try {
      await setProblemPublishedApi(Number(problem.id), nextPublishedState);
      setProblems((prev) =>
        prev.map((p) =>
          p.id === problem.id ? { ...p, isPublished: nextPublishedState } : p,
        ),
      );
      toast.success(nextPublishedState ? "Problem published" : "Problem unpublished");
    } catch (err: any) {
      toast.error(`Publish update failed: ${err.message}`);
    }
  };

  /** Return Tailwind color classes for a difficulty badge */
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

  /** De-duplicated sorted algorithm list for the dropdown */
  const algorithmOptions = Array.from(
    new Set([
      ...dbAlgorithms,
      ...problems.flatMap((p) =>
        Array.isArray(p.algorithm) ? p.algorithm : [String(p.algorithm)]
      ),
      ...customAlgorithms,
    ])
  ).sort();

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Manage Problems
            </h1>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-1" />
            Add Problem
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Loading spinner while fetching from backend */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
        <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Algorithm</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell className="font-mono text-neutral-500">
                  {problem.id}
                </TableCell>
                <TableCell className="font-medium">{problem.title}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(problem.difficulty)}
                  >
                    {problem.difficulty}
                  </Badge>
                </TableCell>
                {/* Show algorithm tags — API returns an array */}
                <TableCell>
                  {(Array.isArray(problem.algorithm) ? problem.algorithm : [problem.algorithm])
                    .map((algo) => (
                      <span key={algo} className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md mr-1">
                        {algo}
                      </span>
                    ))}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublished(problem)}
                      className={
                        problem.isPublished
                          ? "text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                          : "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                      }
                      title={problem.isPublished ? "Unpublish problem" : "Publish problem"}
                    >
                      {problem.isPublished ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPreviewDialog(problem)}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(problem.id)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {problems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">No problems yet</p>
          </div>
        )}
        </>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {previewProblem ? previewProblem.title : "Problem Preview"}
            </DialogTitle>
          </DialogHeader>

          {previewLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : previewProblem ? (
            <div className="space-y-6 py-4">
              <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Problem
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Description, examples, constraints, and starter code
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(previewProblem, "problem")}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-neutral-700">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      Algorithm
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {previewProblem.algorithm.map((algo) => (
                        <span
                          key={algo}
                          className="rounded-md bg-white px-2 py-1 text-xs text-neutral-600 border border-neutral-200"
                        >
                          {algo}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Difficulty
                      </p>
                      <p className="mt-2">{previewProblem.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        Estimate Time
                      </p>
                      <p className="mt-2">
                        {previewProblem.estimateTime
                          ? `${previewProblem.estimateTime} min`
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-wide text-neutral-500">
                      Description
                    </p>
                    <div className="whitespace-pre-wrap rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
                      {previewProblem.description || "No description added."}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs uppercase tracking-wide text-neutral-500">
                      Examples
                    </p>
                    <div className="space-y-3">
                      {previewProblem.examples.length > 0 ? (
                        previewProblem.examples.map((example, idx) => (
                          <div
                            key={`${example.input}-${idx}`}
                            className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700"
                          >
                            <p><span className="font-medium text-neutral-900">Input:</span> {example.input || "—"}</p>
                            <p className="mt-1"><span className="font-medium text-neutral-900">Output:</span> {example.output || "—"}</p>
                            {example.explanation && (
                              <p className="mt-1"><span className="font-medium text-neutral-900">Explanation:</span> {example.explanation}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-lg border border-dashed border-neutral-200 bg-white p-4 text-sm text-neutral-500">
                          No examples added.
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs uppercase tracking-wide text-neutral-500">
                      Constraints
                    </p>
                    {previewProblem.constraints.length > 0 ? (
                      <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        {previewProblem.constraints.map((constraint) => (
                          <li key={constraint}>{constraint}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="rounded-lg border border-dashed border-neutral-200 bg-white p-4 text-sm text-neutral-500">
                        No constraints added.
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-xs uppercase tracking-wide text-neutral-500">
                      Starter Code
                    </p>
                    <pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
                      <code>{previewProblem.starterCode || "No starter code added."}</code>
                    </pre>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Solution
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Sample solution shown to users in the workspace
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(previewProblem, "solution")}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>

                <pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
                  <code>
                    {previewSolutionCode || "No solution added yet."}
                  </code>
                </pre>
              </section>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProblem
                ? editFocusSection === "solution"
                  ? "Edit Solution"
                  : "Edit Problem"
                : "Add Problem"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {(!editingProblem || editFocusSection === "problem") && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      ref={titleInputRef}
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="e.g. Two Sum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="algorithm">Algorithm</Label>
                    {addingCustomAlgo ? (
                      <div className="flex gap-1">
                        <Input
                          value={customAlgoInput}
                          onChange={(e) => setCustomAlgoInput(e.target.value)}
                          placeholder="New algorithm..."
                          className="h-9"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && customAlgoInput.trim()) {
                              const newAlgo = customAlgoInput.trim();
                              setCustomAlgorithms((prev) => [...prev, newAlgo]);
                              setForm({ ...form, algorithm: newAlgo });
                              setAddingCustomAlgo(false);
                              setCustomAlgoInput("");
                            } else if (e.key === "Escape") {
                              setAddingCustomAlgo(false);
                              setCustomAlgoInput("");
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-2"
                          onClick={() => {
                            if (customAlgoInput.trim()) {
                              const newAlgo = customAlgoInput.trim();
                              setCustomAlgorithms((prev) => [...prev, newAlgo]);
                              setForm({ ...form, algorithm: newAlgo });
                            }
                            setAddingCustomAlgo(false);
                            setCustomAlgoInput("");
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 px-2"
                          onClick={() => {
                            setAddingCustomAlgo(false);
                            setCustomAlgoInput("");
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Select
                        value={form.algorithm}
                        onValueChange={(value) => {
                          if (value === "__add_new__") {
                            setAddingCustomAlgo(true);
                          } else {
                            setForm({ ...form, algorithm: value });
                          }
                        }}
                      >
                        <SelectTrigger id="algorithm">
                          <SelectValue placeholder="Select algorithm..." />
                        </SelectTrigger>
                        <SelectContent>
                          {algorithmOptions.map((algo) => (
                            <SelectItem key={algo} value={algo}>
                              {algo}
                            </SelectItem>
                          ))}
                          <SelectItem value="__add_new__" className="text-blue-600">
                            + Add new algorithm...
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={form.difficulty}
                      onValueChange={(value) =>
                        setForm({ ...form, difficulty: value as Difficulty })
                      }
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estimateTime">Estimated Time (minutes)</Label>
                    <Input
                      id="estimateTime"
                      type="number"
                      min="1"
                      value={form.estimateTime}
                      onChange={(e) =>
                        setForm({ ...form, estimateTime: e.target.value })
                      }
                      placeholder="e.g. 30"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Problem description..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Examples</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setForm({
                          ...form,
                          examples: [...form.examples, { input: "", output: "" }],
                        })
                      }
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Example
                    </Button>
                  </div>
                  {form.examples.map((example, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 mb-2 items-start"
                    >
                      <div className="flex-1 space-y-2">
                        <Input
                          value={example.input}
                          onChange={(e) => {
                            const examples = [...form.examples];
                            examples[idx] = { ...examples[idx], input: e.target.value };
                            setForm({ ...form, examples });
                          }}
                          placeholder="Input"
                        />
                        <Input
                          value={example.output}
                          onChange={(e) => {
                            const examples = [...form.examples];
                            examples[idx] = { ...examples[idx], output: e.target.value };
                            setForm({ ...form, examples });
                          }}
                          placeholder="Output"
                        />
                        <Input
                          value={example.explanation || ""}
                          onChange={(e) => {
                            const examples = [...form.examples];
                            examples[idx] = {
                              ...examples[idx],
                              explanation: e.target.value || undefined,
                            };
                            setForm({ ...form, examples });
                          }}
                          placeholder="Explanation (optional)"
                        />
                      </div>
                      {form.examples.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const examples = form.examples.filter(
                              (_, i) => i !== idx,
                            );
                            setForm({ ...form, examples });
                          }}
                          className="text-neutral-400 hover:text-rose-600 mt-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Constraints</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setForm({
                          ...form,
                          constraints: [...form.constraints, ""],
                        })
                      }
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Constraint
                    </Button>
                  </div>
                  {form.constraints.map((constraint, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Input
                        value={constraint}
                        onChange={(e) => {
                          const constraints = [...form.constraints];
                          constraints[idx] = e.target.value;
                          setForm({ ...form, constraints });
                        }}
                        placeholder="e.g. 2 <= nums.length <= 10^4"
                      />
                      {form.constraints.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const constraints = form.constraints.filter(
                              (_, i) => i !== idx,
                            );
                            setForm({ ...form, constraints });
                          }}
                          className="text-neutral-400 hover:text-rose-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="starterCode">Starter Code</Label>
                  <Textarea
                    id="starterCode"
                    value={form.starterCode}
                    onChange={(e) =>
                      setForm({ ...form, starterCode: e.target.value })
                    }
                    placeholder="def solution():\n    pass"
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>
              </>
            )}

            {(!editingProblem || editFocusSection === "solution") && (
              <div>
                <div className="mb-2">
                  <Label htmlFor="solutionCode">Solution</Label>
                  <p className="text-sm text-neutral-500">
                    This is the sample solution shown from the problem workspace.
                  </p>
                </div>
                <Textarea
                  id="solutionCode"
                  ref={solutionTextareaRef}
                  value={form.solutionCode}
                  onChange={(e) =>
                    setForm({ ...form, solutionCode: e.target.value })
                  }
                  placeholder="def solution(...):\n    ..."
                  className="min-h-[180px] font-mono text-sm"
                />
              </div>
            )}

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingProblem ? "Save Changes" : "Add Problem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Problem</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this problem? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
