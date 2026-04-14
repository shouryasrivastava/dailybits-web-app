/**
 * Integration tests for the StudyPlanChat component.
 *
 * StudyPlanChat is the AI-powered chat interface for generating coding study
 * plans. The user types a message, the component calls generateStudyPlan (which
 * hits the Gemini-backed backend), and the returned plan is rendered as a list
 * of problem cards. The user can then accept the plan, which either calls
 * acceptStudyPlan (for backend plans) or falls back to addTodoItem (for local
 * plans with plan_id = -1).
 *
 * Key mocking decisions:
 * - generateStudyPlan and acceptStudyPlan are stubbed — they are the network
 *   boundary. The component logic around them (fallback, rendering, accepting)
 *   is what we are testing.
 * - storage.getProblems is stubbed for the local fallback path so we can control
 *   the problem list without seeding localStorage with full problem data.
 * - sonner toast is stubbed to capture success/error notifications.
 * - The ScrollArea from Radix UI renders its children normally in jsdom, so no
 *   special mocking is needed for it.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudyPlanChat } from "./StudyPlanChat";
import * as api from "../utils/api";
import * as storage from "../utils/storage";

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("../utils/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/api")>();
  return {
    ...actual,
    generateStudyPlan: vi.fn(),
    acceptStudyPlan: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockPlan: api.GeneratedPlan = {
  plan_id: 42,
  plan_name: "Easy Array Focus",
  total_time: 45,
  ai_message: "Here is a study plan tailored to your goals.",
  problems: [
    {
      problem_id: 1,
      problem_title: "Two Sum",
      difficulty_level: "Easy",
      algorithms: ["Array"],
      estimate_time: 15,
    },
    {
      problem_id: 2,
      problem_title: "Best Time to Buy Stock",
      difficulty_level: "Easy",
      algorithms: ["Array"],
      estimate_time: 30,
    },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderComponent(onPlanAccepted = vi.fn()) {
  return render(<StudyPlanChat onPlanAccepted={onPlanAccepted} />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("StudyPlanChat", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Seed a logged-in user so the component can read accountNumber.
    localStorage.setItem(
      "pythonpractice_current_user",
      JSON.stringify({ id: "1", accountNumber: 1, email: "test@example.com", firstName: "Test", lastName: "User", registerDate: "2025-01-01", isAdmin: false })
    );
    localStorage.setItem("access_token", "test-token");

    vi.mocked(api.generateStudyPlan).mockResolvedValue(mockPlan);
    vi.mocked(api.acceptStudyPlan).mockResolvedValue({ success: true, plan_id: 42 });
  });

  // ── Initial render ────────────────────────────────────────────────────────

  it("renders the Study Plan Assistant heading", () => {
    renderComponent();
    expect(screen.getByText("Study Plan Assistant")).toBeInTheDocument();
  });

  it("shows the initial greeting message from the assistant", () => {
    renderComponent();
    expect(
      screen.getByText(/create a personalized study plan/i),
    ).toBeInTheDocument();
  });

  it("renders the message input textarea", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText("Describe your goals..."),
    ).toBeInTheDocument();
  });

  it("disables the send button when input is empty", () => {
    renderComponent();
    const sendButton = screen.getByRole("button", { name: "" }); // icon-only button
    expect(sendButton).toBeDisabled();
  });

  // ── Sending a message ─────────────────────────────────────────────────────

  it("adds the user's message to the chat after sending", async () => {
    const user = userEvent.setup();
    renderComponent();

    const textarea = screen.getByPlaceholderText("Describe your goals...");
    await user.type(textarea, "I want easy array problems");
    await user.click(screen.getByRole("button", { name: "" }));

    expect(
      screen.getByText("I want easy array problems"),
    ).toBeInTheDocument();
  });

  it("clears the input after sending", async () => {
    const user = userEvent.setup();
    renderComponent();

    const textarea = screen.getByPlaceholderText("Describe your goals...");
    await user.type(textarea, "easy problems");
    await user.click(screen.getByRole("button", { name: "" }));

    expect(textarea).toHaveValue("");
  });

  it("calls generateStudyPlan with the correct account number and message", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy array problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      expect(api.generateStudyPlan).toHaveBeenCalledWith(
        1,
        "easy array problems",
      ),
    );
  });

  it("sends the message when Enter is pressed without Shift", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems{Enter}",
    );

    await waitFor(() =>
      expect(api.generateStudyPlan).toHaveBeenCalledTimes(1),
    );
  });

  it("does not send when Shift+Enter is pressed", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems{Shift>}{Enter}{/Shift}",
    );

    expect(api.generateStudyPlan).not.toHaveBeenCalled();
  });

  // ── Generating state ──────────────────────────────────────────────────────

  it("disables send button while a plan is being generated", async () => {
    // Keep the promise pending so the component stays in generating state.
    vi.mocked(api.generateStudyPlan).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    expect(screen.getByRole("button", { name: "" })).toBeDisabled();
  });

  // ── Plan rendering ────────────────────────────────────────────────────────

  it("renders the AI message after a plan is generated", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      expect(
        screen.getByText("Here is a study plan tailored to your goals."),
      ).toBeInTheDocument(),
    );
  });

  it("renders all problem cards returned in the plan", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() => {
      expect(screen.getByText("Two Sum")).toBeInTheDocument();
      expect(screen.getByText("Best Time to Buy Stock")).toBeInTheDocument();
    });
  });

  it("shows the total estimated time for the plan", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      expect(screen.getByText(/Total estimated time: 45 min/i)).toBeInTheDocument(),
    );
  });

  it("shows the Accept Study Plan button after a plan is generated", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /accept study plan/i }),
      ).toBeInTheDocument(),
    );
  });

  // ── Accepting a plan ──────────────────────────────────────────────────────

  it("calls acceptStudyPlan with correct args when accepting a backend plan", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      screen.getByRole("button", { name: /accept study plan/i }),
    );
    await user.click(screen.getByRole("button", { name: /accept study plan/i }));

    await waitFor(() =>
      expect(api.acceptStudyPlan).toHaveBeenCalledWith(1, 42),
    );
  });

  it("shows success toast after accepting the plan", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      screen.getByRole("button", { name: /accept study plan/i }),
    );
    await user.click(screen.getByRole("button", { name: /accept study plan/i }));

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
        "Study plan added to your todo list!",
      ),
    );
  });

  it("calls onPlanAccepted callback after accepting", async () => {
    const onPlanAccepted = vi.fn();
    const user = userEvent.setup();
    render(<StudyPlanChat onPlanAccepted={onPlanAccepted} />);

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      screen.getByRole("button", { name: /accept study plan/i }),
    );
    await user.click(screen.getByRole("button", { name: /accept study plan/i }));

    await waitFor(() => expect(onPlanAccepted).toHaveBeenCalledTimes(1));
  });

  it("shows confirmation message in chat after accepting", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      screen.getByRole("button", { name: /accept study plan/i }),
    );
    await user.click(screen.getByRole("button", { name: /accept study plan/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/added all the problems to your todo list/i),
      ).toBeInTheDocument(),
    );
  });

  it("hides the Accept button after the plan is accepted", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      screen.getByRole("button", { name: /accept study plan/i }),
    );
    await user.click(screen.getByRole("button", { name: /accept study plan/i }));

    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: /accept study plan/i }),
      ).not.toBeInTheDocument(),
    );
  });

  // ── Local fallback (Gemini unavailable) ───────────────────────────────────

  // When the API call fails (e.g. Gemini is down or backend is offline),
  // the component should generate a local plan from localStorage problems
  // instead of crashing or showing an error.
  it("falls back to a local plan when generateStudyPlan throws", async () => {
    vi.mocked(api.generateStudyPlan).mockRejectedValue(
      new Error("Backend unavailable"),
    );

    // Seed storage with local problems for the fallback to use.
    vi.spyOn(storage, "getProblems").mockReturnValue([
      {
        id: "1",
        title: "Two Sum",
        difficulty: "Easy",
        algorithm: "Array",
        estimateTime: 15,
        isPublished: true,
        description: "Find two numbers that add to target.",
        examples: [],
        constraints: [],
        starterCode: "",
      },
    ]);

    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    // The local fallback message references "generated locally".
    await waitFor(() =>
      expect(
        screen.getByText(/generated locally/i),
      ).toBeInTheDocument(),
    );
  });

  // Local plans have plan_id = -1; accepting them should NOT call acceptStudyPlan
  // but instead write directly to localStorage via addTodoItem.
  it("does not call acceptStudyPlan for a local fallback plan", async () => {
    vi.mocked(api.generateStudyPlan).mockRejectedValue(new Error("offline"));
    vi.spyOn(storage, "getProblems").mockReturnValue([
      {
        id: "10",
        title: "Climbing Stairs",
        difficulty: "Easy",
        algorithm: "Dynamic Programming",
        estimateTime: 10,
        isPublished: true,
        description: "Climb n stairs.",
        examples: [],
        constraints: [],
        starterCode: "",
      },
    ]);

    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      screen.getByRole("button", { name: /accept study plan/i }),
    );
    await user.click(screen.getByRole("button", { name: /accept study plan/i }));

    expect(api.acceptStudyPlan).not.toHaveBeenCalled();
  });

  // ── Accepting disabled state ──────────────────────────────────────────────

  it("disables the Accept button while the accept request is in flight", async () => {
    vi.mocked(api.acceptStudyPlan).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    renderComponent();

    await user.type(
      screen.getByPlaceholderText("Describe your goals..."),
      "easy problems",
    );
    await user.click(screen.getByRole("button", { name: "" }));

    await waitFor(() =>
      screen.getByRole("button", { name: /accept study plan/i }),
    );
    await user.click(screen.getByRole("button", { name: /accept study plan/i }));

    expect(
      screen.getByRole("button", { name: /adding to todo/i }),
    ).toBeDisabled();
  });
});
