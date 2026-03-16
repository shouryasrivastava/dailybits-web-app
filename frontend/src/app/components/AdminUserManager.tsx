import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Trash2, ArrowLeft, Shield, ShieldOff, Loader2 } from "lucide-react";
import { AppUser } from "../types";
import {
  getCurrentUser,
  getUserRole,
  setCurrentUser,
  setUserRole,
  updateUser,
} from "../utils/storage";
import {
  fetchUsers,
  deleteUserApi,
  toggleUserAdmin,
  apiUserToFrontend,
} from "../utils/api";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";
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

/**
 * AdminUserManager — user management interface for administrators.
 * Loads user data from the Django backend via REST API.
 * Admins can grant/revoke admin privileges and delete user accounts.
 * User info (name, email, etc.) is read-only in this view.
 */
export function AdminUserManager() {
  const navigate = useNavigate();
  const userRole = getUserRole();

  // User list loaded from the backend
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Redirect non-admin users back to the admin landing page
  if (userRole !== "administrator") {
    navigate("/admin");
    return null;
  }

  // Fetch all users from the backend on mount
  useEffect(() => {
    loadUsers();
  }, []);

  /** Fetch user list from the backend and update local state */
  const loadUsers = async () => {
    try {
      const apiUsers = await fetchUsers();
      setUsers(apiUsers.map(apiUserToFrontend));
    } catch (err: any) {
      toast.error(`Failed to load users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /** Show the delete confirmation dialog for a specific user */
  const openDeleteDialog = (userId: string) => {
    setDeletingUserId(userId);
    setDeleteDialogOpen(true);
  };

  /** Toggle a user's admin status via the backend API */
  const handleToggleAdmin = async (user: AppUser) => {
    const newAdminStatus = !user.isAdmin;
    try {
      await toggleUserAdmin(Number(user.id), newAdminStatus);
      const updatedUser = { ...user, isAdmin: newAdminStatus };
      updateUser(updatedUser);

      const currentUser = getCurrentUser();
      if (currentUser.id === user.id) {
        setCurrentUser({ ...currentUser, isAdmin: newAdminStatus });
        setUserRole(newAdminStatus ? "administrator" : "user");
      }

      toast.success(
        user.isAdmin
          ? `Revoked admin access from ${user.firstName}`
          : `Granted admin access to ${user.firstName}`,
      );
      // Update the local state to reflect the change immediately
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? updatedUser : u,
        ),
      );
    } catch (err: any) {
      toast.error(`Failed to update admin status: ${err.message}`);
    }
  };

  /** Confirm deletion: remove the user via the backend API and close the dialog */
  const handleDelete = async () => {
    if (!deletingUserId) return;
    try {
      await deleteUserApi(Number(deletingUserId));
      toast.success("User deleted");
      // Remove the deleted user from local state
      setUsers((prev) => prev.filter((u) => u.id !== deletingUserId));
    } catch (err: any) {
      toast.error(`Failed to delete user: ${err.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setDeletingUserId(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with back navigation */}
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

      {/* Loading spinner while fetching users from the backend */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        /* User table with role badges and action buttons */
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
                      <Badge
                        variant="outline"
                        className="bg-neutral-50 text-neutral-600 border-neutral-200"
                      >
                        Student
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAdmin(user)}
                        className={
                          user.isAdmin
                            ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            : "text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                        }
                      >
                        {user.isAdmin ? (
                          <>
                            <ShieldOff className="w-3 h-3 mr-1" />
                            Revoke Admin
                          </>
                        ) : (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            Grant Admin
                          </>
                        )}
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
      )}

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
