import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Pencil, Trash2, ArrowLeft, X, Loader2 } from "lucide-react";
import { Problem, Difficulty } from "../types";
import { getUserRole } from "../utils/storage";
import {
  fetchAdminProblems,
  fetchAdminProblem,
  createProblem,
  updateProblemApi,
  deleteProblemApi,
  fetchAlgorithms,
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
  testCases: { input: string; expectedOutput: string }[];
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
  testCases: [{ input: "", expectedOutput: "" }],
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

  // Algorithm dropdown: DB-loaded list + session-added custom names
  const [dbAlgorithms, setDbAlgorithms] = useState<string[]>([]);
  const [customAlgorithms, setCustomAlgorithms] = useState<string[]>([]);
  const [addingCustomAlgo, setAddingCustomAlgo] = useState(false);
  const [customAlgoInput, setCustomAlgoInput] = useState("");

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProblemId, setDeletingProblemId] = useState<string | null>(null);

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
    setDialogOpen(true);
  };

  /** Open the dialog in "edit" mode — fetches full problem detail from the backend */
  const openEditDialog = async (problem: Problem) => {
    try {
      const detail = await fetchAdminProblem(Number(problem.id));
      const fullProblem = apiProblemDetailToFrontend(detail);
      setEditingProblem(fullProblem);
      setForm({
        title: fullProblem.title,
        difficulty: fullProblem.difficulty,
        // Use the first algorithm for the single-select form field
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
        testCases: [{ input: "", expectedOutput: "" }],
      });
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
    if (!form.title.trim() || !form.algorithm.trim()) {
      toast.error("Title and algorithm are required");
      return;
    }

    // Build the payload, stripping empty rows from dynamic lists
    const payload: ProblemPayload = {
      title: form.title.trim(),
      difficulty: form.difficulty,
      description: form.description.trim(),
      estimateTimeBaseline: form.estimateTime.trim() ? Number(form.estimateTime) : null,
      starterCode: form.starterCode,
      algorithms: [form.algorithm.trim()],
      examples: form.examples.filter((e) => e.input.trim() || e.output.trim()),
      constraints: form.constraints.filter((c) => c.trim()),
    };

    try {
      if (editingProblem) {
        await updateProblemApi(Number(editingProblem.id), payload);
        toast.success("Problem updated");
      } else {
        await createProblem(payload);
        toast.success("Problem added");
      }
      setDialogOpen(false);
      await refreshProblems();
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`);
    }
  };

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
                      onClick={() => openEditDialog(problem)}
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProblem ? "Edit Problem" : "Add Problem"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Two Sum"
                />
              </div>
              <div>
                {/* Algorithm selector: dropdown by default, text input when "Add new" is chosen */}
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

            {/* Examples */}
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

            {/* Constraints */}
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

            {/* Test Cases (frontend-only — not persisted to the database) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Test Cases</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm({
                      ...form,
                      testCases: [
                        ...form.testCases,
                        { input: "", expectedOutput: "" },
                      ],
                    })
                  }
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Test Case
                </Button>
              </div>
              {form.testCases.map((testCase, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    value={testCase.input}
                    onChange={(e) => {
                      const testCases = [...form.testCases];
                      testCases[idx] = {
                        ...testCases[idx],
                        input: e.target.value,
                      };
                      setForm({ ...form, testCases });
                    }}
                    placeholder="Input"
                    className="flex-1"
                  />
                  <Input
                    value={testCase.expectedOutput}
                    onChange={(e) => {
                      const testCases = [...form.testCases];
                      testCases[idx] = {
                        ...testCases[idx],
                        expectedOutput: e.target.value,
                      };
                      setForm({ ...form, testCases });
                    }}
                    placeholder="Expected Output"
                    className="flex-1"
                  />
                  {form.testCases.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const testCases = form.testCases.filter(
                          (_, i) => i !== idx,
                        );
                        setForm({ ...form, testCases });
                      }}
                      className="text-neutral-400 hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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
