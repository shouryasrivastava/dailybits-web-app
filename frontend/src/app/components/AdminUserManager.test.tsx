/**
 * Integration tests for the AdminUserManager component.
 *
 * AdminUserManager is the admin interface for managing user accounts. It renders
 * a table of all registered users and allows admins to grant/revoke admin
 * privileges and delete accounts. There is no "add user" flow — registration
 * happens through the normal sign-up page.
 *
 * Key mocking decisions:
 * - api.ts async functions (fetchUsers, deleteUserApi, toggleUserAdmin) are
 *   replaced with vi.fn() stubs; apiUserToFrontend is kept real so the full
 *   conversion pipeline runs.
 * - storage.getUserRole defaults to "administrator" so the component renders
 *   instead of redirecting. The default is re-set in beforeEach because
 *   vi.clearAllMocks() does not reset mock implementations — a per-test
 *   override would otherwise leak into all subsequent tests.
 * - storage functions (getCurrentUser, setCurrentUser, setUserRole, updateUser)
 *   are kept real; localStorage is seeded in beforeEach to provide a
 *   deterministic current user for the "toggle own admin" path.
 * - sonner toast calls are captured without rendering DOM nodes.
 * - The component is wrapped in MemoryRouter so useNavigate works.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { AdminUserManager } from "./AdminUserManager";
import * as api from "../utils/api";
import * as storage from "../utils/storage";

// ── Module mocks ─────────────────────────────────────────────────────────────

// Keep data-mapper functions real; replace async network calls with stubs.
vi.mock("../utils/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/api")>();
  return {
    ...actual,
    fetchUsers: vi.fn(),
    deleteUserApi: vi.fn(),
    toggleUserAdmin: vi.fn(),
  };
});

// getUserRole controls whether the component renders or redirects.
vi.mock("../utils/storage", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/storage")>();
  return { ...actual, getUserRole: vi.fn().mockReturnValue("administrator") };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

/** A regular (non-admin) student user returned by the backend */
const mockApiUser: api.ApiUser = {
  accountNumber: 2,
  firstName: "Alice",
  lastName: "Smith",
  email: "alice@example.com",
  isStudent: true,
  isAdmin: false,
  registerDate: "2025-02-01",
};

/** An admin user returned by the backend */
const mockApiAdminUser: api.ApiUser = {
  accountNumber: 3,
  firstName: "Bob",
  lastName: "Jones",
  email: "bob@example.com",
  isStudent: false,
  isAdmin: true,
  registerDate: "2025-01-15",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Seed localStorage with a current user (account 1) so getCurrentUser()
 * returns a known value. The handleToggleAdmin function reads the current
 * user to decide whether to also update the session role.
 */
function seedCurrentUser(isAdmin = true) {
  const user = {
    id: "1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    registerDate: "2025-01-01",
    isAdmin,
    isStudent: false,
  };
  localStorage.setItem("pythonpractice_current_user", JSON.stringify(user));
  localStorage.setItem("pythonpractice_users", JSON.stringify([user]));
}

function renderComponent() {
  return render(
    <MemoryRouter>
      <AdminUserManager />
    </MemoryRouter>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AdminUserManager", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Re-assert the administrator default after every test so that a per-test
    // override (e.g. mockReturnValue("user")) doesn't leak forward.
    vi.mocked(storage.getUserRole).mockReturnValue("administrator");

    seedCurrentUser();

    // Default: two users returned by the backend.
    vi.mocked(api.fetchUsers).mockResolvedValue([
      mockApiUser,
      mockApiAdminUser,
    ]);
    vi.mocked(api.deleteUserApi).mockResolvedValue({ success: true });
    vi.mocked(api.toggleUserAdmin).mockResolvedValue({ success: true });
  });

  // ── Loading & rendering ───────────────────────────────────────────────────

  // A never-resolving fetchUsers keeps loading=true for the duration of this test.
  it("shows a loading spinner before data arrives", () => {
    vi.mocked(api.fetchUsers).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders user names in the table after loading", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });

  it("renders email addresses for each user", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("alice@example.com")).toBeInTheDocument(),
    );
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  // Role badges distinguish students from admins at a glance.
  it("renders 'Student' badge for non-admin users", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );
    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    expect(within(aliceRow).getByText("Student")).toBeInTheDocument();
  });

  it("renders 'Admin' badge for admin users", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Bob Jones")).toBeInTheDocument(),
    );
    const bobRow = screen.getByText("Bob Jones").closest("tr")!;
    expect(within(bobRow).getByText("Admin")).toBeInTheDocument();
  });

  it("shows 'No users found' when no users are returned", async () => {
    vi.mocked(api.fetchUsers).mockResolvedValue([]);
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("No users found")).toBeInTheDocument(),
    );
  });

  it("shows an error toast when fetchUsers fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.fetchUsers).mockRejectedValue(new Error("Network error"));
    renderComponent();
    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        expect.stringContaining("Failed to load users"),
      ),
    );
  });

  // ── Access control ────────────────────────────────────────────────────────

  // When the user is not an admin the component renders null and calls navigate.
  it("renders nothing when the user is not an administrator", () => {
    vi.mocked(storage.getUserRole).mockReturnValue("user");
    renderComponent();
    expect(screen.queryByText("Manage Users")).not.toBeInTheDocument();
  });

  // ── Delete user ───────────────────────────────────────────────────────────

  // Clicking "Delete" on a row opens an AlertDialog for confirmation.
  it("opens a confirmation dialog when 'Delete' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(within(aliceRow).getByRole("button", { name: /delete/i }));

    expect(
      screen.getByText(/are you sure you want to delete this user/i),
    ).toBeInTheDocument();
  });

  it("calls deleteUserApi with the correct account number when confirmed", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(within(aliceRow).getByRole("button", { name: /delete/i }));
    // Click the confirm "Delete" button inside the AlertDialog
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() =>
      // mockApiUser has accountNumber: 2
      expect(vi.mocked(api.deleteUserApi)).toHaveBeenCalledWith(2),
    );
  });

  it("removes the user from the table after deletion", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(within(aliceRow).getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() =>
      expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument(),
    );
    // The other user should still be visible
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });

  it("shows success toast after deleting a user", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(within(aliceRow).getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith("User deleted"),
    );
  });

  // Cancelling the dialog should leave the user in the table untouched.
  it("does not delete the user when 'Cancel' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(within(aliceRow).getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(vi.mocked(api.deleteUserApi)).not.toHaveBeenCalled();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });

  it("shows error toast when deleteUserApi fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.deleteUserApi).mockRejectedValue(new Error("Server error"));
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(within(aliceRow).getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        expect.stringContaining("Failed to delete user"),
      ),
    );
  });

  // ── Grant / Revoke admin ──────────────────────────────────────────────────

  // A non-admin user's row shows "Grant Admin"; clicking it promotes them.
  it("calls toggleUserAdmin with isAdmin=true when 'Grant Admin' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(
      within(aliceRow).getByRole("button", { name: /grant admin/i }),
    );

    await waitFor(() =>
      expect(vi.mocked(api.toggleUserAdmin)).toHaveBeenCalledWith(2, true),
    );
  });

  // An admin user's row shows "Revoke Admin"; clicking it demotes them.
  it("calls toggleUserAdmin with isAdmin=false when 'Revoke Admin' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Bob Jones")).toBeInTheDocument(),
    );

    const bobRow = screen.getByText("Bob Jones").closest("tr")!;
    await user.click(
      within(bobRow).getByRole("button", { name: /revoke admin/i }),
    );

    await waitFor(() =>
      expect(vi.mocked(api.toggleUserAdmin)).toHaveBeenCalledWith(3, false),
    );
  });

  // After granting admin the role badge should update without a page reload.
  it("updates role badge to 'Admin' after granting admin", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(
      within(aliceRow).getByRole("button", { name: /grant admin/i }),
    );

    await waitFor(() =>
      expect(within(aliceRow).getByText("Admin")).toBeInTheDocument(),
    );
  });

  // After revoking admin the badge should switch back to "Student".
  it("updates role badge to 'Student' after revoking admin", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Bob Jones")).toBeInTheDocument(),
    );

    const bobRow = screen.getByText("Bob Jones").closest("tr")!;
    await user.click(
      within(bobRow).getByRole("button", { name: /revoke admin/i }),
    );

    await waitFor(() =>
      expect(within(bobRow).getByText("Student")).toBeInTheDocument(),
    );
  });

  it("shows success toast after granting admin", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(
      within(aliceRow).getByRole("button", { name: /grant admin/i }),
    );

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
        expect.stringContaining("Granted admin access to Alice"),
      ),
    );
  });

  it("shows success toast after revoking admin", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Bob Jones")).toBeInTheDocument(),
    );

    const bobRow = screen.getByText("Bob Jones").closest("tr")!;
    await user.click(
      within(bobRow).getByRole("button", { name: /revoke admin/i }),
    );

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
        expect.stringContaining("Revoked admin access from Bob"),
      ),
    );
  });

  it("shows error toast when toggleUserAdmin fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.toggleUserAdmin).mockRejectedValue(new Error("Server error"));
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Alice Smith")).toBeInTheDocument(),
    );

    const aliceRow = screen.getByText("Alice Smith").closest("tr")!;
    await user.click(
      within(aliceRow).getByRole("button", { name: /grant admin/i }),
    );

    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        expect.stringContaining("Failed to update admin status"),
      ),
    );
  });

  // ── Toggle own admin status ───────────────────────────────────────────────

  // When an admin revokes their OWN admin privileges the component must also
  // update the session (setCurrentUser + setUserRole) so the UI reflects the
  // change immediately without requiring a sign-out/sign-in cycle.
  it("updates the session role in localStorage when revoking own admin", async () => {
    // Seed the current session as account 3 (Bob Jones, an admin)
    const selfUser = {
      id: "3",
      firstName: "Bob",
      lastName: "Jones",
      email: "bob@example.com",
      registerDate: "2025-01-15",
      isAdmin: true,
      isStudent: false,
    };
    localStorage.setItem(
      "pythonpractice_current_user",
      JSON.stringify(selfUser),
    );
    localStorage.setItem("pythonpractice_users", JSON.stringify([selfUser]));

    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Bob Jones")).toBeInTheDocument(),
    );

    const bobRow = screen.getByText("Bob Jones").closest("tr")!;
    await user.click(
      within(bobRow).getByRole("button", { name: /revoke admin/i }),
    );

    await waitFor(() =>
      expect(vi.mocked(api.toggleUserAdmin)).toHaveBeenCalled(),
    );

    // The session current_user should now have isAdmin: false
    const stored = JSON.parse(
      localStorage.getItem("pythonpractice_current_user")!,
    );
    expect(stored.isAdmin).toBe(false);

    // And the user role key should be "user"
    expect(localStorage.getItem("pythonpractice_user_role")).toBe("user");
  });
});
