import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Pencil, Trash2, ArrowLeft, X } from "lucide-react";
import { Problem, Difficulty } from "../types";
import {
  getProblems,
  addProblem,
  updateProblem,
  deleteProblem,
  getUserRole,
} from "../utils/storage";
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

interface ProblemFormData {
  title: string;
  difficulty: Difficulty;
  algorithm: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: string;
  testCases: { input: string; expectedOutput: string }[];
}

const emptyForm: ProblemFormData = {
  title: "",
  difficulty: "Easy",
  algorithm: "",
  description: "",
  examples: [{ input: "", output: "" }],
  constraints: [""],
  starterCode: "",
  testCases: [{ input: "", expectedOutput: "" }],
};

export function AdminProblemManager() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [problems, setProblems] = useState<Problem[]>(getProblems());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [deletingProblemId, setDeletingProblemId] = useState<string | null>(
    null,
  );
  const [form, setForm] = useState<ProblemFormData>(emptyForm);

  if (userRole !== "administrator") {
    navigate("/admin");
    return null;
  }

  const refreshProblems = () => setProblems(getProblems());

  const openAddDialog = () => {
    setEditingProblem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (problem: Problem) => {
    setEditingProblem(problem);
    setForm({
      title: problem.title,
      difficulty: problem.difficulty,
      algorithm: problem.algorithm as unknown as string,
      description: problem.description,
      examples: problem.examples.length > 0 ? problem.examples : [{ input: "", output: "" }],
      constraints: problem.constraints.length > 0 ? problem.constraints : [""],
      starterCode: problem.starterCode,
      testCases: problem.testCases.length > 0 ? problem.testCases : [{ input: "", expectedOutput: "" }],
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (problemId: string) => {
    setDeletingProblemId(problemId);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.algorithm.trim()) {
      toast.error("Title and algorithm are required");
      return;
    }

    const problemData = {
      title: form.title.trim(),
      difficulty: form.difficulty,
      algorithm: form.algorithm.trim() as unknown as string[],
      description: form.description.trim(),
      examples: form.examples.filter((e) => e.input.trim() || e.output.trim()),
      constraints: form.constraints.filter((c) => c.trim()),
      starterCode: form.starterCode,
      testCases: form.testCases.filter(
        (t) => t.input.trim() || t.expectedOutput.trim(),
      ),
    };

    if (editingProblem) {
      updateProblem({ ...problemData, id: editingProblem.id });
      toast.success("Problem updated");
    } else {
      addProblem(problemData);
      toast.success("Problem added");
    }

    setDialogOpen(false);
    refreshProblems();
  };

  const handleDelete = () => {
    if (deletingProblemId) {
      deleteProblem(deletingProblemId);
      toast.success("Problem deleted");
      setDeleteDialogOpen(false);
      setDeletingProblemId(null);
      refreshProblems();
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
                <TableCell>
                  <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                    {problem.algorithm}
                  </span>
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
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                  <Label htmlFor="algorithm">Algorithm</Label>
                  <Input
                    id="algorithm"
                    value={form.algorithm}
                    onChange={(e) =>
                      setForm({ ...form, algorithm: e.target.value })
                    }
                    placeholder="e.g. Array"
                  />
                </div>
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

            {/* Test Cases */}
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
