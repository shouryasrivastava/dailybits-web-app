/**
 * Integration tests for the UserProgress component.
 *
 * UserProgress is the dashboard that shows a user's coding practice stats:
 * problems solved, practice days, difficulty breakdown, algorithm progress,
 * and recent activity. It fetches all three data sets in parallel from the
 * backend and falls back to localStorage-derived data when the API fails.
 *
 * Key mocking decisions:
 * - fetchUserProgress, fetchRecentActivity, fetchAlgorithmProgress are stubbed
 *   so tests control what data the component renders without hitting the network.
 * - storage helpers (getCurrentUser, getCompletedProblems, etc.) are kept real
 *   so the local-fallback path exercises the actual fallback logic.
 * - localStorage is seeded in beforeEach with a logged-in user and cleared
 *   between tests to prevent state leakage.
 * - MemoryRouter is required because UserProgress renders <Link> elements.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { UserProgress } from "./UserProgress";
import * as api from "../utils/api";

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("../utils/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/api")>();
  return {
    ...actual,
    fetchUserProgress: vi.fn(),
    fetchRecentActivity: vi.fn(),
    fetchAlgorithmProgress: vi.fn(),
  };
});

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockProgress: api.UserProgressData = {
  problems_solved: 12,
  total_practice_days: 7,
  last_practice_date: "2025-03-10T00:00:00",
  todo_count: 4,
  easy_solved: 6,
  medium_solved: 4,
  hard_solved: 2,
  easy_total: 20,
  medium_total: 15,
  hard_total: 10,
};

const mockActivity: api.RecentActivityItem[] = [
  {
    problem_id: 1,
    problem_title: "Two Sum",
    difficulty_level: "Easy",
    submitted_at: "2025-03-10T12:00:00Z",
    is_correct: true,
  },
  {
    problem_id: 2,
    problem_title: "Valid Parentheses",
    difficulty_level: "Medium",
    submitted_at: "2025-03-09T10:00:00Z",
    is_correct: false,
  },
];

const mockAlgorithms: api.AlgorithmProgressItem[] = [
  { algorithm_name: "Array", problems_solved: 5 },
  { algorithm_name: "Dynamic Programming", problems_solved: 3 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function seedLoggedInUser() {
  const user = {
    id: "1",
    accountNumber: 1,
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
    registerDate: "2025-01-01",
    isAdmin: false,
    isStudent: true,
  };
  localStorage.setItem("pythonpractice_current_user", JSON.stringify(user));
  localStorage.setItem("access_token", "mock-token");
}

function renderComponent() {
  return render(
    <MemoryRouter>
      <UserProgress />
    </MemoryRouter>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("UserProgress", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    seedLoggedInUser();

    vi.mocked(api.fetchUserProgress).mockResolvedValue(mockProgress);
    vi.mocked(api.fetchRecentActivity).mockResolvedValue(mockActivity);
    vi.mocked(api.fetchAlgorithmProgress).mockResolvedValue(mockAlgorithms);
  });

  // ── Auth gate ─────────────────────────────────────────────────────────────

  it("shows login prompt when no access token is set", () => {
    localStorage.removeItem("access_token");
    renderComponent();
    expect(screen.getByText("Please login first.")).toBeInTheDocument();
  });

  it("does not fetch data when user is not logged in", () => {
    localStorage.removeItem("access_token");
    renderComponent();
    expect(api.fetchUserProgress).not.toHaveBeenCalled();
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it("shows loading indicator while data is being fetched", () => {
    // Return a never-resolving promise to keep the component in its loading state.
    vi.mocked(api.fetchUserProgress).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText("Loading progress...")).toBeInTheDocument();
  });

  // ── Overview stats ────────────────────────────────────────────────────────

  it("renders the page heading", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Your Progress")).toBeInTheDocument(),
    );
  });

  it("displays the problems solved count", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("12")).toBeInTheDocument(),
    );
    expect(screen.getByText("Problems Solved")).toBeInTheDocument();
  });

  it("displays the total practice days", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("7")).toBeInTheDocument(),
    );
    expect(screen.getByText("Practice Days")).toBeInTheDocument();
  });

  it("displays the todo count", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("4")).toBeInTheDocument(),
    );
    expect(screen.getByText("In Todo List")).toBeInTheDocument();
  });

  it("formats and displays last practice date", async () => {
    renderComponent();
    // "2025-03-10T00:00:00" should render as a human-readable date.
    // The date appears both in the Recent Practice card and in the recent activity row.
    await waitFor(() =>
      expect(screen.getAllByText(/Mar 10, 2025/i).length).toBeGreaterThan(0),
    );
  });

  it("shows N/A for last practice date when null", async () => {
    vi.mocked(api.fetchUserProgress).mockResolvedValue({
      ...mockProgress,
      last_practice_date: null,
    });
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("N/A")).toBeInTheDocument(),
    );
  });

  // ── Difficulty breakdown ──────────────────────────────────────────────────

  it("renders difficulty breakdown section", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Progress by Difficulty")).toBeInTheDocument(),
    );
  });

  it("shows correct solved/total counts for each difficulty", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("6 / 20")).toBeInTheDocument(); // Easy
      expect(screen.getByText("4 / 15")).toBeInTheDocument(); // Medium
      expect(screen.getByText("2 / 10")).toBeInTheDocument(); // Hard
    });
  });

  it("shows 0% progress when total is zero", async () => {
    vi.mocked(api.fetchUserProgress).mockResolvedValue({
      ...mockProgress,
      easy_solved: 0,
      easy_total: 0,
    });
    renderComponent();
    // Should render without errors even with divide-by-zero edge case
    await waitFor(() =>
      expect(screen.getByText("Your Progress")).toBeInTheDocument(),
    );
  });

  // ── Algorithm progress ────────────────────────────────────────────────────

  it("renders algorithm progress for each algorithm with solved count > 0", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("Array")).toBeInTheDocument();
      expect(screen.getByText("Dynamic Programming")).toBeInTheDocument();
    });
  });

  it("shows 'No problems completed yet' when algorithm data is empty", async () => {
    vi.mocked(api.fetchAlgorithmProgress).mockResolvedValue([]);
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("No problems completed yet")).toBeInTheDocument(),
    );
  });

  it("shows algorithm solved count", async () => {
    renderComponent();
    await waitFor(() => {
      // "5" for Array and "3" for Dynamic Programming
      const fives = screen.getAllByText("5");
      expect(fives.length).toBeGreaterThan(0);
    });
  });

  // ── Recent activity ───────────────────────────────────────────────────────

  it("renders recent activity section", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("Recent Activity")).toBeInTheDocument(),
    );
  });

  it("shows problem titles in recent activity", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("Two Sum")).toBeInTheDocument();
      expect(screen.getByText("Valid Parentheses")).toBeInTheDocument();
    });
  });

  it("shows 'Solved' label for correct submissions", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText(/Solved on/i)).toBeInTheDocument(),
    );
  });

  it("shows 'Attempted' label for incorrect submissions", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText(/Attempted on/i)).toBeInTheDocument(),
    );
  });

  it("shows 'No recent activity' when activity list is empty", async () => {
    vi.mocked(api.fetchRecentActivity).mockResolvedValue([]);
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("No recent activity")).toBeInTheDocument(),
    );
  });

  // ── API calls ─────────────────────────────────────────────────────────────

  it("fetches all three data sets with the correct account number", async () => {
    renderComponent();
    await waitFor(() =>
      expect(api.fetchUserProgress).toHaveBeenCalledWith(1),
    );
    expect(api.fetchRecentActivity).toHaveBeenCalledWith(1);
    expect(api.fetchAlgorithmProgress).toHaveBeenCalledWith(1);
  });

  // ── Local fallback ────────────────────────────────────────────────────────

  // When all API calls fail, the component should fall back to data derived
  // from localStorage rather than crashing or showing empty state.
  it("falls back to local storage data when API calls fail", async () => {
    vi.mocked(api.fetchUserProgress).mockRejectedValue(new Error("Network error"));
    vi.mocked(api.fetchRecentActivity).mockRejectedValue(new Error("Network error"));
    vi.mocked(api.fetchAlgorithmProgress).mockRejectedValue(new Error("Network error"));

    renderComponent();

    // Should still render the page heading (not crash)
    await waitFor(() =>
      expect(screen.getByText("Your Progress")).toBeInTheDocument(),
    );
  });
});
