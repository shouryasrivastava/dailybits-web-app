/**
 * Integration tests for the AdminProblemManager component.
 *
 * AdminProblemManager is the admin CRUD interface for coding problems. It renders
 * a table of all problems and provides dialogs for adding, editing, previewing,
 * and deleting problems. All mutations are sent to the Django backend via api.ts.
 *
 * Key mocking decisions:
 * - api.ts async functions are replaced with vi.fn() stubs; pure data-mapper
 *   functions are kept real so the full data pipeline runs normally.
 * - storage.getUserRole is stubbed to return "administrator" by default so the
 *   component renders instead of redirecting. Override per-test for the redirect test.
 * - The Radix Select is replaced with a native <select>/<option> so userEvent can
 *   interact with the algorithm and difficulty dropdowns.
 * - sonner toast calls are captured without rendering DOM nodes.
 * - The component is wrapped in MemoryRouter so that useNavigate works (the
 *   component calls navigate() on redirect and Back button clicks).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { AdminProblemManager } from "./AdminProblemManager";
import * as api from "../utils/api";
import * as storage from "../utils/storage";
import {
  mockApiProblemListItem,
  mockApiProblemListItem2,
  mockApiProblemDetail,
} from "../../test/fixtures";

// ── Module mocks ─────────────────────────────────────────────────────────────

// Keep data-mapper functions real; replace all network calls with stubs.
vi.mock("../utils/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/api")>();
  return {
    ...actual,
    fetchAdminProblems: vi.fn(),
    fetchAdminProblem: vi.fn(),
    createProblem: vi.fn(),
    updateProblemApi: vi.fn(),
    deleteProblemApi: vi.fn(),
    setProblemPublishedApi: vi.fn(),
    fetchAlgorithms: vi.fn(),
    fetchSolution: vi.fn(),
    saveSolution: vi.fn(),
  };
});

// getUserRole controls whether the component renders or redirects to /admin.
// Default to "administrator" so most tests see the full component.
vi.mock("../utils/storage", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/storage")>();
  return { ...actual, getUserRole: vi.fn().mockReturnValue("administrator") };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Replace Radix Select with a native <select> so userEvent.selectOptions() works.
vi.mock("./ui/select", () => ({
  Select: ({ value, onValueChange, children }: any) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ value, children }: any) => (
    <option value={value}>{children}</option>
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderComponent() {
  return render(
    <MemoryRouter>
      <AdminProblemManager />
    </MemoryRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AdminProblemManager", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Re-assert the "administrator" default after every test. clearAllMocks() does
    // NOT reset mock implementations, so a per-test override (e.g. the redirect
    // test calling .mockReturnValue("user")) would leak into all later tests
    // unless we explicitly restore the default here.
    vi.mocked(storage.getUserRole).mockReturnValue("administrator");

    // Default happy-path: two problems in the table, algorithms load successfully.
    vi.mocked(api.fetchAdminProblems).mockResolvedValue([
      mockApiProblemListItem,
      mockApiProblemListItem2,
    ]);
    vi.mocked(api.fetchAlgorithms).mockResolvedValue([
      { id: 1, name: "Array" },
      { id: 2, name: "Hash Table" },
      { id: 3, name: "Stack" },
    ]);
    vi.mocked(api.fetchAdminProblem).mockResolvedValue(mockApiProblemDetail);
    vi.mocked(api.fetchSolution).mockResolvedValue({
      sId: 1,
      pId: 1,
      sDescription: "def solution(): return [0,1]",
      success: true,
    });
    vi.mocked(api.createProblem).mockResolvedValue({
      success: true,
      problemId: 99,
    });
    vi.mocked(api.updateProblemApi).mockResolvedValue({ success: true });
    vi.mocked(api.deleteProblemApi).mockResolvedValue({ success: true });
    vi.mocked(api.setProblemPublishedApi).mockResolvedValue({
      success: true,
      problemId: 1,
      isPublished: false,
    });
    vi.mocked(api.saveSolution).mockResolvedValue({ success: true });
  });

  // ── Loading & rendering ───────────────────────────────────────────────────

  // Both fetches must stay pending; if fetchAlgorithms resolves it triggers a
  // setDbAlgorithms state update outside act() and produces an act() warning.
  it("shows a loading spinner before data arrives", () => {
    vi.mocked(api.fetchAdminProblems).mockReturnValue(new Promise(() => {}));
    vi.mocked(api.fetchAlgorithms).mockReturnValue(new Promise(() => {}));
    renderComponent();
    // The spinner uses an SVG with the animate-spin class; query by its container role
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders problem titles in the table after loading", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );
    expect(screen.getByText("Valid Parentheses")).toBeInTheDocument();
  });

  it("renders difficulty badges for each problem", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("renders algorithm tags for each problem", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );
    // Two Sum shows first algorithm (Array), Valid Parentheses shows Stack
    expect(screen.getByText("Array")).toBeInTheDocument();
    expect(screen.getByText("Stack")).toBeInTheDocument();
  });

  it("shows 'No problems yet' when no problems are returned", async () => {
    vi.mocked(api.fetchAdminProblems).mockResolvedValue([]);
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("No problems yet")).toBeInTheDocument()
    );
  });

  it("shows an error toast when fetchAdminProblems fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.fetchAdminProblems).mockRejectedValue(
      new Error("Network error")
    );
    renderComponent();
    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        expect.stringContaining("Failed to load problems")
      )
    );
  });

  // ── Access control ────────────────────────────────────────────────────────

  // When the user is not an admin the component renders null immediately and
  // calls navigate("/admin") to redirect. We verify nothing is rendered.
  it("renders nothing when the user is not an administrator", () => {
    vi.mocked(storage.getUserRole).mockReturnValue("user");
    renderComponent();
    expect(screen.queryByText("Manage Problems")).not.toBeInTheDocument();
  });

  // ── Add Problem ───────────────────────────────────────────────────────────

  it("opens the Add Problem dialog when 'Add Problem' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: /add problem/i }));

    // The dialog heading distinguishes add vs edit mode. We query by heading role
    // to avoid the ambiguity of "Add Problem" appearing in both the page header
    // button and the dialog footer button once the dialog is open.
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("heading", { name: "Add Problem" })).toBeInTheDocument();
  });

  it("shows a validation error toast when title is missing on add", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: /add problem/i }));
    // Submit without filling title or algorithm
    const dialogFooter = screen.getByRole("dialog");
    await user.click(
      within(dialogFooter).getByRole("button", { name: /add problem/i })
    );

    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
      "Title and algorithm are required"
    );
  });

  it("calls createProblem with the correct payload", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: /add problem/i }));

    // Fill in required fields
    await user.type(screen.getByPlaceholderText("e.g. Two Sum"), "New Problem");
    // Select an algorithm from the native <select> mock
    const [algorithmSelect] = screen.getAllByRole("combobox");
    await userEvent.selectOptions(algorithmSelect, "Array");
    await user.type(screen.getByPlaceholderText("Problem description..."), "A test problem");
    await user.type(screen.getByPlaceholderText("Input"), "test input");
    await user.type(screen.getByPlaceholderText("Output"), "test output");
    await user.type(screen.getByPlaceholderText(/def solution\(\)/), "def f(): pass");

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: /add problem/i,
      })
    );

    await waitFor(() =>
      expect(vi.mocked(api.createProblem)).toHaveBeenCalledWith(
        expect.objectContaining({ title: "New Problem", algorithms: ["Array"] })
      )
    );
  });

  it("calls saveSolution after successfully creating a problem", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: /add problem/i }));
    await user.type(screen.getByPlaceholderText("e.g. Two Sum"), "New Problem");
    const [algorithmSelect] = screen.getAllByRole("combobox");
    await userEvent.selectOptions(algorithmSelect, "Array");
    await user.type(screen.getByPlaceholderText("Problem description..."), "A test problem");
    await user.type(screen.getByPlaceholderText("Input"), "test input");
    await user.type(screen.getByPlaceholderText("Output"), "test output");
    await user.type(screen.getByPlaceholderText(/def solution\(\)/), "def f(): pass");

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: /add problem/i,
      })
    );

    // saveSolution is called with the new problem's ID (99 from createProblem mock)
    await waitFor(() =>
      expect(vi.mocked(api.saveSolution)).toHaveBeenCalledWith(99, "", "", "", "")
    );
  });

  it("shows success toast after adding a problem", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: /add problem/i }));
    await user.type(screen.getByPlaceholderText("e.g. Two Sum"), "New Problem");
    const [algorithmSelect] = screen.getAllByRole("combobox");
    await userEvent.selectOptions(algorithmSelect, "Array");
    await user.type(screen.getByPlaceholderText("Problem description..."), "A test problem");
    await user.type(screen.getByPlaceholderText("Input"), "test input");
    await user.type(screen.getByPlaceholderText("Output"), "test output");
    await user.type(screen.getByPlaceholderText(/def solution\(\)/), "def f(): pass");

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: /add problem/i,
      })
    );

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith("Problem added")
    );
  });

  it("shows error toast when createProblem fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.createProblem).mockRejectedValue(new Error("Server error"));
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: /add problem/i }));
    await user.type(screen.getByPlaceholderText("e.g. Two Sum"), "New Problem");
    const [algorithmSelect] = screen.getAllByRole("combobox");
    await userEvent.selectOptions(algorithmSelect, "Array");
    await user.type(screen.getByPlaceholderText("Problem description..."), "A test problem");
    await user.type(screen.getByPlaceholderText("Input"), "test input");
    await user.type(screen.getByPlaceholderText("Output"), "test output");
    await user.type(screen.getByPlaceholderText(/def solution\(\)/), "def f(): pass");

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: /add problem/i,
      })
    );

    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        expect.stringContaining("Save failed")
      )
    );
  });

  // ── Preview ───────────────────────────────────────────────────────────────

  // Clicking "View" opens the preview dialog and fetches the full problem detail.
  it("opens the preview dialog when 'View' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    const twoSumRow = screen.getByText("Two Sum").closest("tr")!;
    await user.click(within(twoSumRow).getByRole("button", { name: /view/i }));

    await waitFor(() =>
      expect(vi.mocked(api.fetchAdminProblem)).toHaveBeenCalledWith(1)
    );
    // The dialog should show "Problem Preview" while loading or the title after load
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows the problem title in the preview dialog after loading", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    const twoSumRow = screen.getByText("Two Sum").closest("tr")!;
    await user.click(within(twoSumRow).getByRole("button", { name: /view/i }));

    // Dialog title updates from "Problem Preview" to the actual title after data loads
    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByText("Two Sum")).toBeInTheDocument();
    });
  });

  it("shows the solution code in the preview dialog", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    const twoSumRow = screen.getByText("Two Sum").closest("tr")!;
    await user.click(within(twoSumRow).getByRole("button", { name: /view/i }));

    await waitFor(() =>
      expect(
        screen.getByText("def solution(): return [0,1]")
      ).toBeInTheDocument()
    );
  });

  // ── Delete ────────────────────────────────────────────────────────────────

  // Clicking "Delete" in the table row opens an AlertDialog confirmation.
  it("opens a confirmation dialog when 'Delete' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    const twoSumRow = screen.getByText("Two Sum").closest("tr")!;
    await user.click(
      within(twoSumRow).getByRole("button", { name: /delete/i })
    );

    // getByText requires a full string match; use a regex since the element also
    // contains "This action cannot be undone." after the question.
    expect(
      screen.getByText(/are you sure you want to delete this problem/i)
    ).toBeInTheDocument();
  });

  // Confirming deletion calls the API and shows a success toast.
  it("calls deleteProblemApi when deletion is confirmed", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    const twoSumRow = screen.getByText("Two Sum").closest("tr")!;
    await user.click(
      within(twoSumRow).getByRole("button", { name: /delete/i })
    );
    // Click the "Delete" confirm button inside the AlertDialog
    await user.click(
      screen.getByRole("button", { name: /^delete$/i })
    );

    await waitFor(() =>
      expect(vi.mocked(api.deleteProblemApi)).toHaveBeenCalledWith(1)
    );
  });

  it("shows success toast after deleting a problem", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    const twoSumRow = screen.getByText("Two Sum").closest("tr")!;
    await user.click(
      within(twoSumRow).getByRole("button", { name: /delete/i })
    );
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith("Problem deleted")
    );
  });

  // Cancelling should close the dialog without calling the API.
  it("does not call deleteProblemApi when deletion is cancelled", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    const twoSumRow = screen.getByText("Two Sum").closest("tr")!;
    await user.click(
      within(twoSumRow).getByRole("button", { name: /delete/i })
    );
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(vi.mocked(api.deleteProblemApi)).not.toHaveBeenCalled();
  });

  it("shows error toast when deleteProblemApi fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.deleteProblemApi).mockRejectedValue(new Error("Server error"));
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    const twoSumRow = screen.getByText("Two Sum").closest("tr")!;
    await user.click(
      within(twoSumRow).getByRole("button", { name: /delete/i })
    );
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        expect.stringContaining("Delete failed")
      )
    );
  });

  // ── Publish toggle ────────────────────────────────────────────────────────

  // Each row has a publish/unpublish toggle button (Eye/EyeOff icon). Clicking
  // it calls setProblemPublishedApi with the problem's ID and the new state.
  it("calls setProblemPublishedApi when the publish toggle is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    // mockApiProblemListItem has is_published: true, so the button title is "Unpublish problem"
    const twoSumRow = screen.getByText("Two Sum").closest("tr")!;
    const toggleButton = within(twoSumRow).getByTitle("Unpublish problem");
    await user.click(toggleButton);

    await waitFor(() =>
      expect(vi.mocked(api.setProblemPublishedApi)).toHaveBeenCalledWith(1, false)
    );
  });

  it("shows success toast after toggling publish state", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );

    const twoSumRow = screen.getByText("Two Sum").closest("tr")!;
    const toggleButton = within(twoSumRow).getByTitle("Unpublish problem");
    await user.click(toggleButton);

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith("Problem unpublished")
    );
  });
});
