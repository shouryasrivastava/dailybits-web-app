import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { TodoList } from "./TodoList";
import * as api from "../utils/api";
import { mockApiTodoItem, mockApiTodoItem2 } from "../../test/fixtures";

// ── Module mocks ─────────────────────────────────────────────────────────────

vi.mock("../utils/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/api")>();
  return {
    ...actual,
    fetchTodoItemsApi: vi.fn(),
    removeTodoApi: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Stub out the StudyPlanChat panel so it doesn't drag in its own API calls
vi.mock("./StudyPlanChat", () => ({
  StudyPlanChat: ({ onPlanAccepted }: any) => (
    <div data-testid="study-plan-chat">
      <button onClick={onPlanAccepted}>Accept Plan</button>
    </div>
  ),
}));

// Monaco editor is not renderable in jsdom
vi.mock("@monaco-editor/react", () => ({
  default: ({ value }: any) => (
    <textarea data-testid="monaco-editor" value={value ?? ""} readOnly onChange={() => {}} />
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderComponent() {
  return render(
    <MemoryRouter>
      <TodoList />
    </MemoryRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("TodoList", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Seed a logged-in user so auth-gated data loading works.
    localStorage.setItem(
      "pythonpractice_current_user",
      JSON.stringify({ id: "1", accountNumber: 1, email: "test@example.com", firstName: "Test", lastName: "User", registerDate: "2025-01-01", isAdmin: false })
    );
    localStorage.setItem("access_token", "test-token");

    vi.mocked(api.fetchTodoItemsApi).mockResolvedValue({
      results: [mockApiTodoItem, mockApiTodoItem2],
    });
    vi.mocked(api.removeTodoApi).mockResolvedValue({ success: true });
  });

  // ── Loading & rendering ───────────────────────────────────────────────────

  it("shows a loading indicator before data arrives", () => {
    vi.mocked(api.fetchTodoItemsApi).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders todo item titles after loading", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Two Sum")).toBeInTheDocument()
    );
    expect(screen.getByText("Valid Parentheses")).toBeInTheDocument();
  });

  it("renders difficulty badges for each item", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("renders algorithm tags for each item", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Array")).toBeInTheDocument());
    expect(screen.getByText("Stack")).toBeInTheDocument();
  });

  it("renders problem links pointing to the correct route", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());
    const link = screen.getByText("Two Sum").closest("a");
    expect(link).toHaveAttribute("href", "/problem/1");
  });

  it("shows empty state message when todo list is empty", async () => {
    vi.mocked(api.fetchTodoItemsApi).mockResolvedValue({ results: [] });
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Your todo list is empty")).toBeInTheDocument()
    );
  });

  it("shows a Browse Problems link in the empty state", async () => {
    vi.mocked(api.fetchTodoItemsApi).mockResolvedValue({ results: [] });
    renderComponent();
    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: /browse problems/i })
      ).toBeInTheDocument()
    );
  });

  it("renders the StudyPlanChat panel", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByTestId("study-plan-chat")).toBeInTheDocument()
    );
  });

  it("shows error toast when fetchTodoItemsApi fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.fetchTodoItemsApi).mockRejectedValue(new Error("Network"));
    renderComponent();
    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        "Failed to load todo list"
      )
    );
  });

  // ── Remove item ───────────────────────────────────────────────────────────

  it("calls removeTodoApi when the remove button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    // Each item has one ghost button (remove); click the first one
    const removeButtons = screen.getAllByRole("button", { name: "" }); // ghost icon buttons
    // Find the trash button scoped to the Two Sum card
    const twoSumCard = screen.getByText("Two Sum").closest(".border");
    const trashButton = within(twoSumCard!).getByRole("button", { name: "" });
    await user.click(trashButton);

    await waitFor(() =>
      expect(vi.mocked(api.removeTodoApi)).toHaveBeenCalledWith(1, 1)
    );
  });

  it("removes the item from the list after deletion", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    const twoSumCard = screen.getByText("Two Sum").closest(".border");
    const trashButton = within(twoSumCard!).getByRole("button", { name: "" });
    await user.click(trashButton);

    await waitFor(() =>
      expect(screen.queryByText("Two Sum")).not.toBeInTheDocument()
    );
    // Other item should still be visible
    expect(screen.getByText("Valid Parentheses")).toBeInTheDocument();
  });

  it("shows success toast after removing", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    const twoSumCard = screen.getByText("Two Sum").closest(".border");
    const trashButton = within(twoSumCard!).getByRole("button", { name: "" });
    await user.click(trashButton);

    await waitFor(() =>
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
        "Removed from todo list"
      )
    );
  });

  it("shows error toast when removeTodoApi fails", async () => {
    const { toast } = await import("sonner");
    vi.mocked(api.removeTodoApi).mockRejectedValue(new Error("Server error"));
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    const twoSumCard = screen.getByText("Two Sum").closest(".border");
    const trashButton = within(twoSumCard!).getByRole("button", { name: "" });
    await user.click(trashButton);

    await waitFor(() =>
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        "Failed to remove from todo list"
      )
    );
  });

  // ── StudyPlanChat refresh ─────────────────────────────────────────────────

  it("refreshes the todo list when a study plan is accepted", async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitFor(() => expect(screen.getByText("Two Sum")).toBeInTheDocument());

    // Simulate a new plan being accepted by the chat panel
    vi.mocked(api.fetchTodoItemsApi).mockResolvedValue({
      results: [mockApiTodoItem2], // only item 2 after refresh
    });
    await user.click(screen.getByRole("button", { name: /accept plan/i }));

    await waitFor(() =>
      expect(vi.mocked(api.fetchTodoItemsApi)).toHaveBeenCalledTimes(2)
    );
  });
});
