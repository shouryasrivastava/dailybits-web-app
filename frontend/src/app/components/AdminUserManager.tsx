import { useState } from "react";
import { useNavigate } from "react-router";
import { Pencil, Trash2, ArrowLeft, Shield } from "lucide-react";
import { AppUser } from "../types";
import {
  getUsers,
  updateUser,
  deleteUser,
  getUserRole,
} from "../utils/storage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
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
import { toast } from "sonner";

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  registerDate: string;
  isAdmin: boolean;
}

export function AdminUserManager() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [users, setUsers] = useState<AppUser[]>(getUsers());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormData>({
    email: "",
    firstName: "",
    lastName: "",
    registerDate: "",
    isAdmin: false,
  });

  if (userRole !== "administrator") {
    navigate("/admin");
    return null;
  }

  const refreshUsers = () => setUsers(getUsers());

  const openEditDialog = (user: AppUser) => {
    setEditingUser(user);
    setForm({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      registerDate: user.registerDate,
      isAdmin: user.isAdmin,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (userId: string) => {
    setDeletingUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.email.trim() || !form.firstName.trim() || !form.lastName.trim()) {
      toast.error("Email, first name, and last name are required");
      return;
    }

    if (editingUser) {
      updateUser({
        id: editingUser.id,
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        registerDate: form.registerDate,
        isAdmin: form.isAdmin,
      });
      toast.success("User updated");
    }

    setEditDialogOpen(false);
    refreshUsers();
  };

  const handleDelete = () => {
    if (deletingUserId) {
      deleteUser(deletingUserId);
      toast.success("User deleted");
      setDeleteDialogOpen(false);
      setDeletingUserId(null);
      refreshUsers();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-neutral-200 p-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Manage Users
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-neutral-500">
                  {user.id}
                </TableCell>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className="text-neutral-600">
                  {user.email}
                </TableCell>
                <TableCell className="text-neutral-600">
                  {new Date(user.registerDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-neutral-50 text-neutral-600 border-neutral-200">
                      Student
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(user.id)}
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

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">No users found</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="registerDate">Register Date</Label>
              <Input
                id="registerDate"
                type="date"
                value={form.registerDate}
                onChange={(e) =>
                  setForm({ ...form, registerDate: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="isAdmin"
                checked={form.isAdmin}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isAdmin: checked })
                }
              />
              <Label htmlFor="isAdmin">Administrator</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
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
