/**
 * Integration tests for the ProblemList component.
 *
 * ProblemList fetches all problem pages from the API, renders them with search
 * and filter controls, and lets users add problems to their todo list. These
 * tests drive the component through a jsdom environment using
 * @testing-library/react and mock only the network boundary (api.ts) and the
 * Radix Select UI so filter interactions can use native <select> queries.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";
import { ProblemList } from "./ProblemList";
import * as api from "../utils/api";
import {
  mockApiProblemListItem,
  mockApiProblemListItem2,
  mockApiProblemListItem3,
} from "../../test/fixtures";

// ── Module mocks ─────────────────────────────────────────────────────────────

// Partially mock api.ts: keep pure data-mapper functions real so the component
// can convert API responses normally, but replace async network calls with
// controllable vi.fn() stubs.
vi.mock("../utils/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/api")>();
  return {
    ...actual,
    fetchProblems: vi.fn(),
    fetchTodoItemsApi: vi.fn(),
    addTodoApi: vi.fn(),
  };
});

// getUserRole reads from localStorage and determines whether the admin
// "Manage Problems" link is shown. Default to 'user'; override per-test for
// the admin visibility test.
vi.mock("../utils/storage", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/storage")>();
  return { ...actual, getUserRole: vi.fn().mockReturnValue("user") };
});

// Prevent Sonner from rendering toast DOM nodes; just capture calls.
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Replace Radix Select with a native <select> element so filter tests can use
// userEvent.selectOptions() instead of fighting Radix pointer-event internals.
// SelectItem renders as <option> so the change handler fires correctly.
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

/**
 * Build a single-page API response whose item count is less than page_size so
 * the component's pagination loop exits after the first request.
 */
function makeProblemsResponse(items: api.ApiProblemListItem[]) {
  return {
    page: 1,
    page_size: 10,
    results: items, // length < page_size → loop exits after one fetch
  };
}

function renderComponent() {
  return render(
    <MemoryRouter>
      <ProblemList />
    </MemoryRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ProblemList", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Seed a logged-in user so auth-gated features (todo list, add-to-todo) work.
    localStorage.setItem(
      "pythonpractice_current_user",
      JSON.stringify({ id: "1", accountNumber: 1, email: "test@example.com", firstName: "Test", lastName: "User", registerDate: "2025-01-01", isAdmin: false })
    );
    localStorage.setItem("access_token", "test-token");

    // Default happy-path: one page containing two problems, no existing todos.
    vi.mocked(api.fetchProblems).mockResolvedValue(
      makeProblemsResponse([mockApiProblemListItem, mockApiProblemListItem2])
    );
    vi.mocked(api.fetchTodoItemsApi).mockResolvedValue({ results: [] });
    vi.mocked(api.addTodoApi).mockResolvedValue({ success: true });
  });

  // ── Loading & rendering ───────────────────────────────────────────────────

  // The component sets loading=true on mount and only clears it after the
  // first fetchProblems call resolves. A never-resolving promise keeps us in
  // the loading state for the duration of this test.
  it("shows a loading indicator before data arrives", () => {
    vi.mocked(api.fetchProblems).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText("Loading problems...")).toBeInTheDocument();
  });

  it("renders problem titles after the API resolves", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );
    expect(screen.getByText("Valid Parentheses")).toBeInTheDocument();
  });

  // Difficulty badges share text with the difficulty <option> elements inside
  // the mocked Select, so we scope the query to each problem's <a> card to
  // avoid "found multiple elements" errors.
  it("renders difficulty badges for each problem", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());
    const twoSumCard = screen.getByText("Two Sum").closest("a")!;
    const validParenCard = screen.getByText("Valid Parentheses").closest("a")!;
    expect(within(twoSumCard).getByText("Easy")).toBeInTheDocument();
    expect(within(validParenCard).getByText("Medium")).toBeInTheDocument();
  });

  // Algorithm tag text also appears as Select options, so scope within each
  // problem card for the same reason.
  it("renders algorithm tags for each problem", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());
    const twoSumCard = screen.getByText("Two Sum").closest("a")!;
    const validParenCard = screen.getByText("Valid Parentheses").closest("a")!;
    expect(within(twoSumCard).getByText("Array")).toBeInTheDocument();
    expect(within(validParenCard).getByText("Stack")).toBeInTheDocument();
  });

  // Each problem card is wrapped in a React Router <Link> — verify the href
  // uses the problem's numeric ID.
  it("renders problem links pointing to the correct route", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());
    const twoSumLink = screen.getByText("Two Sum").closest("a");
    expect(twoSumLink).toHaveAttribute("href", "/problem/1");
  });

  // When the API returns an empty page the component shows a fallback message
  // instead of an empty list with no explanation.
  it("shows 'No problems found' when no problems are returned", async () => {
    vi.mocked(api.fetchProblems).mockResolvedValue(
      makeProblemsResponse([])
    );
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("No problems found")).toBeInTheDocument()
    );
  });

  // Network failures should not crash the component; they surface as a toast.
  it("shows an error toast when the problems API fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.fetchProblems).mockRejectedValue(new Error("Network error"));
    renderComponent();
    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith("Failed to load problems")
    );
  });

  // ── Search filter ─────────────────────────────────────────────────────────

  // The search is computed client-side via useMemo so results update
  // synchronously after each keystroke.
  it("filters problems by title as the user types", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    await user.type(screen.getByPlaceholderText("Search problems..."), "valid");

    expect(screen.queryByText("Two Sum")).not.toBeInTheDocument();
    expect(screen.getByText("Valid Parentheses")).toBeInTheDocument();
  });

  // The search also matches against each problem's algorithm tags — useful for
  // finding problems by technique (e.g. typing "stack" to find Stack problems).
  it("filters problems by algorithm name", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    await user.type(screen.getByPlaceholderText("Search problems..."), "stack");

    expect(screen.queryByText("Two Sum")).not.toBeInTheDocument();
    expect(screen.getByText("Valid Parentheses")).toBeInTheDocument();
  });

  // Clearing the input should restore the full list.
  it("clears filter results when search is cleared", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText("Search problems...");
    await user.type(searchInput, "valid");
    await user.clear(searchInput);

    expect(screen.getByText("Two Sum")).toBeInTheDocument();
    expect(screen.getByText("Valid Parentheses")).toBeInTheDocument();
  });

  it("shows 'No problems found' when search matches nothing", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    await user.type(
      screen.getByPlaceholderText("Search problems..."),
      "zzznomatch"
    );
    expect(screen.getByText("No problems found")).toBeInTheDocument();
  });

  // ── Difficulty filter ─────────────────────────────────────────────────────

  // The two <select> elements in the component are difficulty (first) and
  // algorithm (second), which is why we destructure getAllByRole("combobox").
  it("filters problems by difficulty", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    const [difficultySelect] = screen.getAllByRole("combobox");
    await userEvent.selectOptions(difficultySelect, "Easy");

    expect(screen.getByText("Two Sum")).toBeInTheDocument();
    expect(screen.queryByText("Valid Parentheses")).not.toBeInTheDocument();
  });

  // Selecting the "all" option resets the filter and shows every problem again.
  it("restores all problems when 'All Difficulties' is selected", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    const [difficultySelect] = screen.getAllByRole("combobox");
    await userEvent.selectOptions(difficultySelect, "Easy");
    await userEvent.selectOptions(difficultySelect, "all");

    expect(screen.getByText("Two Sum")).toBeInTheDocument();
    expect(screen.getByText("Valid Parentheses")).toBeInTheDocument();
  });

  // ── Algorithm filter ──────────────────────────────────────────────────────

  it("filters problems by algorithm category", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    // Algorithm select is the second combobox rendered on screen.
    const [, algorithmSelect] = screen.getAllByRole("combobox");
    await userEvent.selectOptions(algorithmSelect, "Stack");

    expect(screen.queryByText("Two Sum")).not.toBeInTheDocument();
    expect(screen.getByText("Valid Parentheses")).toBeInTheDocument();
  });

  // ── Todo actions ──────────────────────────────────────────────────────────

  // Clicking "Add to Todo" calls addTodoApi with (accountNumber=1, problemId).
  it("calls addTodoApi when 'Add to Todo' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    const addButtons = screen.getAllByRole("button", { name: /add to todo/i });
    await user.click(addButtons[0]);

    expect(vi.mocked(api.addTodoApi)).toHaveBeenCalledWith(1, 1);
  });

  it("shows success toast after adding to todo", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    await user.click(screen.getAllByRole("button", { name: /add to todo/i })[0]);

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith("Added to todo list!")
    );
  });

  // After a successful add, the button switches to "In Todo" and is disabled
  // to prevent duplicate additions without a page reload.
  it("button changes to 'In Todo' and becomes disabled after adding", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    const addButton = screen.getAllByRole("button", { name: /add to todo/i })[0];
    await user.click(addButton);

    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /in todo/i })[0]).toBeDisabled()
    );
  });

  // When fetchTodoItemsApi reports a problem is already in the user's todo list,
  // that problem's button should be pre-disabled ("In Todo") on initial render.
  it("shows 'In Todo' as disabled for problems already in the todo list", async () => {
    vi.mocked(api.fetchTodoItemsApi).mockResolvedValue({
      results: [mockApiProblemListItem].map((p) => ({
        todo_id: 10,
        account_number: 1,
        problem_id: p.problem_id,
        problem_title: p.problem_title,
        problem_description: p.problem_description,
        difficulty_level: p.difficulty_level,
        added_at: "2025-03-01T00:00:00Z",
        algorithms: p.algorithms,
        is_completed: false,
      })),
    });

    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    // fetchTodoItemsApi is called independently from fetchProblems, so we wait
    // for the todo state to propagate before asserting.
    await waitFor(() => {
      const inTodoButton = screen.getByRole("button", { name: /in todo/i });
      expect(inTodoButton).toBeDisabled();
    });
    // The second problem was not in the todo list, so its button stays enabled.
    expect(screen.getByRole("button", { name: /add to todo/i })).not.toBeDisabled();
  });

  // A failed addTodoApi should show an error toast; the button should NOT
  // optimistically switch to "In Todo".
  it("shows error toast when addTodoApi fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.addTodoApi).mockRejectedValue(new Error("Server error"));
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    await user.click(screen.getAllByRole("button", { name: /add to todo/i })[0]);

    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith("Failed to add to todo list")
    );
  });

  // ── Pagination ────────────────────────────────────────────────────────────

  // The component fetches pages in a while(true) loop, stopping only when a
  // page is smaller than page_size. This test verifies both pages are fetched
  // and that their results are merged into a single list.
  it("fetches all pages when results fill the page size", async () => {
    // Page 1: exactly page_size items — the loop continues to page 2.
    // Start IDs at 100 to avoid colliding with mockApiProblemListItem2 (problem_id: 2).
    const page1Items = Array.from({ length: 10 }, (_, i) => ({
      ...mockApiProblemListItem,
      problem_id: i + 100,
      problem_title: `Problem ${i + 1}`,
    }));
    // Page 2: fewer items than page_size — the loop exits.
    const page2Items = [mockApiProblemListItem2];

    vi.mocked(api.fetchProblems)
      .mockResolvedValueOnce({ page: 1, page_size: 10, results: page1Items })
      .mockResolvedValueOnce({ page: 2, page_size: 10, results: page2Items });

    renderComponent();

    await waitFor(() =>
      expect(screen.getByText("Valid Parentheses")).toBeInTheDocument()
    );
    expect(vi.mocked(api.fetchProblems)).toHaveBeenCalledTimes(2);
    expect(vi.mocked(api.fetchProblems)).toHaveBeenNthCalledWith(1, 1);
    expect(vi.mocked(api.fetchProblems)).toHaveBeenNthCalledWith(2, 2);
  });

  // ── Admin view ────────────────────────────────────────────────────────────

  // The "Manage Problems" link is conditionally rendered based on the user's
  // role stored in localStorage via getUserRole().
  it("does not show Manage Problems button for regular users", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());
    expect(screen.queryByText("Manage Problems")).not.toBeInTheDocument();
  });

  it("shows Manage Problems button for administrator role", async () => {
    const storage = await import("../utils/storage");
    vi.mocked(storage.getUserRole).mockReturnValue("administrator");
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Manage Problems")).toBeInTheDocument()
    );
  });
});
