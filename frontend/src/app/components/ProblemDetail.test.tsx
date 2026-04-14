/**
 * Integration tests for the ProblemDetail component.
 *
 * ProblemDetail is the problem-solving workspace: it loads a problem by ID from
 * the URL, shows the description, renders a Monaco code editor, and lets users
 * submit their solution for AI-powered verification. These tests cover the full
 * submission lifecycle (loading → editing → submit → completed), the show/hide
 * answer panel, and the Add-to-Todo action.
 *
 * Notable test-environment decisions:
 *  - createMemoryRouter is used (instead of MemoryRouter) so URL params like
 *    /problem/:id are available to useParams().
 *  - Monaco editor is replaced with a plain <textarea> — it requires a real DOM
 *    with layout APIs that jsdom doesn't provide.
 *  - vi.restoreAllMocks() is called in beforeEach so vi.spyOn() overrides from
 *    one test don't leak into the next (the "completed state" test spies on
 *    getCompletedProblems, which would otherwise keep returning a completed
 *    problem for all subsequent tests).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { ProblemDetail } from "./ProblemDetail";
import * as api from "../utils/api";
import * as storage from "../utils/storage";
import {
  mockApiProblemDetail,
  mockCompletedProblem,
} from "../../test/fixtures";

// ── Module mocks ─────────────────────────────────────────────────────────────

// Partially mock api.ts: keep pure mappers (apiProblemDetailToFrontend, etc.)
// so the component's data pipeline is real, but stub the async network calls.
vi.mock("../utils/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/api")>();
  return {
    ...actual,
    fetchAdminProblem: vi.fn(),
    fetchSolution: vi.fn(),
    addTodoApi: vi.fn(),
    submitProblemApi: vi.fn(),
    checkCodeWithGemini: vi.fn(),
  };
});

// Prevent Sonner from rendering toast DOM nodes; just capture calls.
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Monaco Editor requires a real browser layout environment (getBoundingClientRect,
// ResizeObserver, etc.) which jsdom doesn't fully support. Replace it with a
// simple <textarea> that mirrors the value/onChange/readOnly contract used by
// the tests.
vi.mock("@monaco-editor/react", () => ({
  default: ({ value, onChange, options, "data-testid": testId }: any) => (
    <textarea
      data-testid={testId ?? "monaco-editor"}
      value={value ?? ""}
      readOnly={options?.readOnly ?? false}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Renders ProblemDetail inside a memory router that provides the :id URL param.
 * createMemoryRouter is required because ProblemDetail calls useParams() to
 * read the problem ID from the URL; MemoryRouter alone doesn't inject params.
 */
function renderProblemDetail(id = "1") {
  const router = createMemoryRouter(
    [{ path: "/problem/:id", element: <ProblemDetail /> }],
    { initialEntries: [`/problem/${id}`] },
  );
  return render(<RouterProvider router={router} />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ProblemDetail", () => {
  beforeEach(() => {
    localStorage.clear();
    // Restore any vi.spyOn() overrides from the previous test so they don't
    // bleed into subsequent tests. Without this, the "completed state" spy on
    // getCompletedProblems would keep returning a completed problem and every
    // following test would see the button as "Completed" instead of "Submit".
    vi.restoreAllMocks();

    // Seed a logged-in user so the auth guard doesn't render "Please login first."
    localStorage.setItem(
      "pythonpractice_current_user",
      JSON.stringify({ id: "1", accountNumber: 1, email: "test@example.com", firstName: "Test", lastName: "User", registerDate: "2025-01-01", isAdmin: false })
    );
    localStorage.setItem("access_token", "test-token");

    // Happy-path defaults: problem loads successfully and all actions succeed.
    vi.mocked(api.fetchAdminProblem).mockResolvedValue(mockApiProblemDetail);
    vi.mocked(api.fetchSolution).mockResolvedValue({
      sId: 1,
      pId: 1,
      sDescription:
        "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i",
      success: true,
    });
    vi.mocked(api.addTodoApi).mockResolvedValue({ success: true });
    vi.mocked(api.submitProblemApi).mockResolvedValue({ success: true });
    vi.mocked(api.checkCodeWithGemini).mockResolvedValue({
      is_correct: true,
      feedback: "",
    });
  });

  // ── Loading & rendering ───────────────────────────────────────────────────

  // A never-resolving promise keeps the component in its loading state so we
  // can assert the loading indicator is shown.
  it("shows loading indicator while the problem is being fetched", () => {
    vi.mocked(api.fetchAdminProblem).mockReturnValue(new Promise(() => {}));
    renderProblemDetail();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the problem title after loading", async () => {
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );
  });

  it("renders the difficulty badge", async () => {
    renderProblemDetail();
    await waitFor(() => expect(screen.getByText("Easy")).toBeInTheDocument());
  });

  it("renders algorithm tag", async () => {
    renderProblemDetail();
    await waitFor(() => expect(screen.getByText("Array")).toBeInTheDocument());
  });

  it("renders the problem description", async () => {
    renderProblemDetail();
    await waitFor(() =>
      expect(
        screen.getByText(/return indices of the two numbers/i),
      ).toBeInTheDocument(),
    );
  });

  // Examples are rendered from the detail endpoint (not the list endpoint).
  it("renders examples with input and output", async () => {
    renderProblemDetail();
    await waitFor(() =>
      expect(
        screen.getByText("nums = [2,7,11,15], target = 9"),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText("[0,1]")).toBeInTheDocument();
  });

  it("renders constraints", async () => {
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("2 <= nums.length <= 10^4")).toBeInTheDocument(),
    );
  });

  // The editor (mocked as <textarea>) should be initialised with the problem's
  // starter code when there is no cached or completed code.
  it("shows the starter code in the editor", async () => {
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );
    const editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveValue("def two_sum(nums, target):\n    pass");
  });

  // A rejected fetchAdminProblem should leave problem=null and show the
  // "Problem not found" fallback UI.
  it("shows 'Problem not found' when the API call fails", async () => {
    vi.mocked(api.fetchAdminProblem).mockRejectedValue(new Error("Not found"));
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Problem not found")).toBeInTheDocument(),
    );
  });

  // ── Completed state ───────────────────────────────────────────────────────

  // When a matching entry exists in the completed-problems store, the component
  // should restore the saved submission code and show a "Completed" badge.
  it("restores saved code and shows Completed when problem is already completed", async () => {
    // Spy on getCompletedProblems so we can inject a completed problem without
    // writing to localStorage. vi.restoreAllMocks() in beforeEach cleans this up.
    vi.spyOn(storage, "getCompletedProblems").mockReturnValue([
      mockCompletedProblem,
    ]);

    renderProblemDetail("1");
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    // A "Completed" badge should appear next to the title.
    expect(screen.getByText("Completed")).toBeInTheDocument();

    // Submit button should remain active (re-submittable).
    expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();

    // Editor should show the saved submission code, not the starter code.
    const editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveValue(mockCompletedProblem.code);
  });

  // ── Submission ────────────────────────────────────────────────────────────

  // Submitting calls checkCodeWithGemini with the current code and problem
  // context. The account number is hard-coded to 1 (ACCOUNT_NUMBER constant).
  it("calls checkCodeWithGemini when Submit is clicked", async () => {
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(vi.mocked(api.checkCodeWithGemini)).toHaveBeenCalledWith(
        1,
        1,
        expect.any(String),
        "Two Sum",
        expect.stringContaining("return indices"),
      ),
    );
  });

  // A correct submission should show a "Completed" badge and keep the submit button enabled.
  it("marks problem as completed after a correct submission", async () => {
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(screen.getByText("Completed")).toBeInTheDocument(),
    );
    // Button enters a 15-second cooldown after submission (not permanently locked).
    expect(screen.getByRole("button", { name: /wait \d+s/i })).toBeInTheDocument();
  });

  // submitProblemApi must be called after a correct Gemini check to persist the
  // submission on the backend, before the UI transitions to "Completed".
  it("calls submitProblemApi after a correct Gemini check", async () => {
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(vi.mocked(api.submitProblemApi)).toHaveBeenCalledWith(
        1,
        1,
        expect.any(String),
        true,
      ),
    );
  });

  it("shows success toast after a correct submission", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
        "Correct! Problem marked as completed.",
      ),
    );
  });

  // An incorrect submission shows the AI's feedback message and keeps the
  // button active so the user can keep trying.
  it("shows feedback toast when submission is incorrect", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.checkCodeWithGemini).mockResolvedValue({
      is_correct: false,
      feedback: "Your solution is O(n²), try a hash map.",
    });
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        "Your solution is O(n²), try a hash map.",
      ),
    );
    // Button enters a 15-second cooldown but is not permanently locked.
    expect(screen.getByRole("button", { name: /wait \d+s/i })).toBeInTheDocument();
  });

  // submitProblemApi IS called for incorrect submissions — every attempt is
  // recorded on the backend regardless of correctness.
  it("calls submitProblemApi with is_correct=false when submission is incorrect", async () => {
    vi.mocked(api.checkCodeWithGemini).mockResolvedValue({
      is_correct: false,
      feedback: "Wrong.",
    });
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() =>
      expect(vi.mocked(api.submitProblemApi)).toHaveBeenCalledWith(
        1,
        1,
        expect.any(String),
        false,
      ),
    );
  });

  // A network error from checkCodeWithGemini should surface as a generic error
  // toast, not an unhandled rejection.
  it("shows error toast when checkCodeWithGemini throws", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.checkCodeWithGemini).mockRejectedValue(
      new Error("Network error"),
    );
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        "Failed to check code. Please try again.",
      ),
    );
  });

  // While the Gemini check is in-flight the button must be disabled and show
  // "Checking..." so the user can't trigger a second concurrent submission.
  it("disables Submit button while checking is in progress", async () => {
    // Keep the promise pending so we can observe the intermediate "Checking..." state.
    let resolveCheck!: (v: { is_correct: boolean; feedback: string }) => void;
    vi.mocked(api.checkCodeWithGemini).mockReturnValue(
      new Promise((res) => (resolveCheck = res)),
    );
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByRole("button", { name: /checking/i })).toBeDisabled();

    // Resolve the promise to let React finish any pending state updates.
    await act(async () => resolveCheck({ is_correct: false, feedback: "" }));
  });

  // ── Show / Hide answer ────────────────────────────────────────────────────

  // Clicking "Show Answer" opens a floating panel with the sample solution.
  it("shows the solution panel when 'Show Answer' is clicked", async () => {
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /show answer/i }));

    await waitFor(() =>
      expect(screen.getByText("Sample Solution")).toBeInTheDocument(),
    );
  });

  // fetchSolution is called lazily — only on the first open, not on mount.
  it("calls fetchSolution when showing the answer for the first time", async () => {
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /show answer/i }));

    await waitFor(() =>
      expect(vi.mocked(api.fetchSolution)).toHaveBeenCalledWith(1),
    );
  });

  // The solution is cached in component state after the first fetch. Re-opening
  // the panel must not trigger a second network request.
  it("does not call fetchSolution a second time when re-opening the panel", async () => {
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /show answer/i }));
    await waitFor(() =>
      expect(screen.getByText("Sample Solution")).toBeInTheDocument(),
    );
    await user.click(screen.getByRole("button", { name: /hide answer/i }));
    await user.click(screen.getByRole("button", { name: /show answer/i }));

    // fetchSolution called only once despite two open events.
    expect(vi.mocked(api.fetchSolution)).toHaveBeenCalledTimes(1);
  });

  // The "Hide Answer" button (shown when the panel is open) should unmount the
  // floating solution panel.
  it("hides the solution panel when 'Hide Answer' is clicked", async () => {
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /show answer/i }));
    await waitFor(() =>
      expect(screen.getByText("Sample Solution")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /hide answer/i }));
    expect(screen.queryByText("Sample Solution")).not.toBeInTheDocument();
  });

  // When the backend hasn't added a solution yet (empty sDescription), the
  // panel should show a graceful fallback message instead of an empty editor.
  it("shows 'No solution available' when fetchSolution returns no description", async () => {
    vi.mocked(api.fetchSolution).mockResolvedValue({
      sId: 1,
      pId: 1,
      sDescription: "",
      success: true,
    });
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /show answer/i }));

    await waitFor(() =>
      expect(
        screen.getByText("No solution available yet."),
      ).toBeInTheDocument(),
    );
  });

  // ── Add to Todo ───────────────────────────────────────────────────────────

  it("calls addTodoApi when 'Add to Todo' is clicked", async () => {
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /add to todo/i }));

    await waitFor(() =>
      expect(vi.mocked(api.addTodoApi)).toHaveBeenCalledWith(1, 1),
    );
  });

  it("shows success toast after adding to todo", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /add to todo/i }));

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
        "Added to todo list!",
      ),
    );
  });

  it("shows error toast when addTodoApi fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.addTodoApi).mockRejectedValue(new Error("Server error"));
    const user = userEvent.setup();
    renderProblemDetail();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /add to todo/i }));

    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        "Failed to add to todo list",
      ),
    );
  });
});
