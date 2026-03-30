/**
 * Integration tests for the UserProfilePage component.
 *
 * UserProfilePage displays the current user's account information and provides
 * a form to update their first and last name. It reads the initial user state
 * from localStorage via storage.getCurrentUser() and writes back via
 * storage.setCurrentUser() / storage.updateUser() on successful save.
 *
 * Key mocking decisions:
 * - api.updateUserProfile is replaced with a vi.fn() stub; the component is
 *   the network boundary, so we only need to control success/failure.
 * - storage functions (getCurrentUser, setCurrentUser, updateUser) are kept
 *   real — they read/write localStorage, which is seeded in beforeEach and
 *   cleared between tests. This exercises the full persistence path.
 * - No router wrapper is needed because UserProfilePage does not use any
 *   React Router hooks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfilePage } from "./UserProfilePage";
import * as api from "../utils/api";

// ── Module mocks ─────────────────────────────────────────────────────────────

// Only stub the async network call; keep storage helpers real.
vi.mock("../utils/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/api")>();
  return { ...actual, updateUserProfile: vi.fn() };
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Seed localStorage with a user so getCurrentUser() returns deterministic data. */
function seedUser(overrides: Record<string, unknown> = {}) {
  const user = {
    id: "1",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
    registerDate: "2025-01-15",
    isAdmin: false,
    isStudent: true,
    ...overrides,
  };
  localStorage.setItem("pythonpractice_current_user", JSON.stringify(user));
  // Also seed the users list so updateUser() can find the record
  localStorage.setItem("pythonpractice_users", JSON.stringify([user]));
  return user;
}

function renderComponent() {
  return render(<UserProfilePage />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("UserProfilePage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    seedUser();

    vi.mocked(api.updateUserProfile).mockResolvedValue({
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Doe",
      registerDate: "2025-01-15",
      isStudent: true,
      isAdmin: false,
    });
  });

  // ── Display ───────────────────────────────────────────────────────────────

  it("renders the page heading", () => {
    renderComponent();
    expect(screen.getByText("My Profile")).toBeInTheDocument();
  });

  it("displays the current user's full name", () => {
    renderComponent();
    // The name appears both in the avatar card and the page header area
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("displays the user's email address", () => {
    renderComponent();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("displays the user's registration date", () => {
    renderComponent();
    expect(screen.getByText("2025-01-15")).toBeInTheDocument();
  });

  it("shows 'Student' role for a non-admin user", () => {
    renderComponent();
    // Role appears twice — in the avatar card description and the Role field
    expect(screen.getAllByText("Student").length).toBeGreaterThan(0);
  });

  it("shows 'Admin' role for an admin user", () => {
    seedUser({ isAdmin: true });
    renderComponent();
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
  });

  // Avatar initials are derived from the first letter of first and last name.
  it("renders avatar with correct initials", () => {
    renderComponent();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  // ── Form pre-population ───────────────────────────────────────────────────

  // The edit form should be pre-filled with the current user's name so the
  // user can see what they're changing before editing.
  it("pre-fills the first name input with the current user's first name", () => {
    renderComponent();
    expect(screen.getByLabelText("First Name")).toHaveValue("Jane");
  });

  it("pre-fills the last name input with the current user's last name", () => {
    renderComponent();
    expect(screen.getByLabelText("Last Name")).toHaveValue("Doe");
  });

  // ── Save ──────────────────────────────────────────────────────────────────

  it("calls updateUserProfile with the updated name on submit", async () => {
    const user = userEvent.setup();
    renderComponent();

    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "John");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(vi.mocked(api.updateUserProfile)).toHaveBeenCalledWith(
        1,
        "John",
        "Doe"
      )
    );
  });

  it("shows success message after profile is updated", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(
        screen.getByText("Profile updated successfully.")
      ).toBeInTheDocument()
    );
  });

  // After a successful save the avatar and name display should reflect the
  // new name immediately without requiring a page reload.
  it("updates the displayed name after a successful save", async () => {
    vi.mocked(api.updateUserProfile).mockResolvedValue({
      email: "jane@example.com",
      firstName: "John",
      lastName: "Doe",
      registerDate: "2025-01-15",
      isStudent: true,
      isAdmin: false,
    });

    const user = userEvent.setup();
    renderComponent();

    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "John");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );
  });

  it("disables the Save button while the request is in flight", async () => {
    // Return a never-resolving promise so the button stays in the loading state.
    vi.mocked(api.updateUserProfile).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });

  it("shows an error message when updateUserProfile fails", async () => {
    vi.mocked(api.updateUserProfile).mockRejectedValue(
      new Error("Server error")
    );
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(screen.getByText("Server error")).toBeInTheDocument()
    );
  });

  // After an error the button should re-enable so the user can try again.
  it("re-enables the Save button after a failed request", async () => {
    vi.mocked(api.updateUserProfile).mockRejectedValue(new Error("oops"));
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /save changes/i })
      ).not.toBeDisabled()
    );
  });

  // ── localStorage persistence ──────────────────────────────────────────────

  // After a successful save, the updated user should be written to localStorage
  // so that other pages (e.g. navbar) reflect the new name on the next read.
  it("persists the updated user to localStorage after save", async () => {
    vi.mocked(api.updateUserProfile).mockResolvedValue({
      email: "jane@example.com",
      firstName: "John",
      lastName: "Doe",
      registerDate: "2025-01-15",
      isStudent: true,
      isAdmin: false,
    });

    const user = userEvent.setup();
    renderComponent();

    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "John");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(screen.getByText("Profile updated successfully.")).toBeInTheDocument()
    );

    const stored = JSON.parse(
      localStorage.getItem("pythonpractice_current_user")!
    );
    expect(stored.firstName).toBe("John");
  });
});
