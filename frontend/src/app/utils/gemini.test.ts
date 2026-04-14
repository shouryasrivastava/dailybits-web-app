/**
 * Unit tests for the Gemini API integration functions in api.ts.
 *
 * These tests cover the three Gemini-backed API functions:
 *   - checkCodeWithGemini  — submits code to the backend for AI evaluation
 *   - generateStudyPlan    — requests an AI-generated problem study plan
 *   - fetchChatHistory     — retrieves previous chat/plan interactions
 *
 * Testing strategy:
 * - All tests stub global.fetch so no real HTTP requests are made.
 * - Each test covers one behaviour: happy path, error response, missing fields,
 *   network failure, or auth token forwarding.
 * - The localStorage access_token is seeded where the test needs to verify that
 *   the Authorization header is forwarded correctly.
 * - Tests are intentionally narrow — they assert on the exact request shape
 *   and the exact return value, not on component rendering.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  checkCodeWithGemini,
  generateStudyPlan,
  fetchChatHistory,
  acceptStudyPlan,
  type GeneratedPlan,
  type ChatHistoryItem,
} from "./api";

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockFetch(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: async () => body,
    }),
  );
}

function mockFetchNetworkError(message = "Network error") {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error(message)));
}

const API_BASE = "http://localhost:8000";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("checkCodeWithGemini", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  // ── Happy path ────────────────────────────────────────────────────────────

  it("returns is_correct and feedback for a correct solution", async () => {
    mockFetch({ is_correct: true, feedback: "Great solution!" });

    const result = await checkCodeWithGemini(
      1,
      1,
      "def twoSum(nums, target): return []",
      "Two Sum",
      "Find two numbers that add to target.",
    );

    expect(result.is_correct).toBe(true);
    expect(result.feedback).toBe("Great solution!");
  });

  it("returns is_correct=false with feedback for an incorrect solution", async () => {
    mockFetch({
      is_correct: false,
      feedback: "Your solution is O(n²), try using a hash map.",
    });

    const result = await checkCodeWithGemini(
      1,
      1,
      "def twoSum(nums, target): pass",
      "Two Sum",
      "Find two numbers that add to target.",
    );

    expect(result.is_correct).toBe(false);
    expect(result.feedback).toBe(
      "Your solution is O(n²), try using a hash map.",
    );
  });

  // ── Request shape ─────────────────────────────────────────────────────────

  it("sends a POST request to /chat/check-code/", async () => {
    mockFetch({ is_correct: true, feedback: "" });

    await checkCodeWithGemini(1, 2, "code here", "Title", "Desc");

    const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(url).toBe(`${API_BASE}/chat/check-code/`);
    expect(options.method).toBe("POST");
  });

  it("sends all required fields in the request body", async () => {
    mockFetch({ is_correct: false, feedback: "" });

    await checkCodeWithGemini(
      5,
      10,
      "def solution(): pass",
      "My Problem",
      "Problem description here",
    );

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    const body = JSON.parse(options.body);
    expect(body.account_number).toBe(5);
    expect(body.problem_id).toBe(10);
    expect(body.code).toBe("def solution(): pass");
    expect(body.problem_title).toBe("My Problem");
    expect(body.problem_description).toBe("Problem description here");
  });

  it("includes Authorization header when access_token is in localStorage", async () => {
    localStorage.setItem("access_token", "test-jwt-token");
    mockFetch({ is_correct: true, feedback: "" });

    await checkCodeWithGemini(1, 1, "code", "Title", "Desc");

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(options.headers["Authorization"]).toBe("Bearer test-jwt-token");
  });

  it("omits Authorization header when no token is stored", async () => {
    mockFetch({ is_correct: true, feedback: "" });

    await checkCodeWithGemini(1, 1, "code", "Title", "Desc");

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(options.headers["Authorization"]).toBeUndefined();
  });

  // ── Error handling ────────────────────────────────────────────────────────

  it("throws an error when the backend returns a non-2xx response", async () => {
    mockFetch({ error: "Failed to check code with AI" }, false, 500);

    await expect(
      checkCodeWithGemini(1, 1, "code", "Title", "Desc"),
    ).rejects.toThrow("Failed to check code with AI");
  });

  it("throws a generic error when the backend returns no error message", async () => {
    mockFetch({}, false, 500);

    await expect(
      checkCodeWithGemini(1, 1, "code", "Title", "Desc"),
    ).rejects.toThrow("Request failed (500)");
  });

  it("throws when fetch itself fails (network error)", async () => {
    mockFetchNetworkError("Network error");

    await expect(
      checkCodeWithGemini(1, 1, "code", "Title", "Desc"),
    ).rejects.toThrow("Network error");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("generateStudyPlan", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  const mockPlan: GeneratedPlan = {
    plan_id: 7,
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

  // ── Happy path ────────────────────────────────────────────────────────────

  it("returns the generated plan on success", async () => {
    mockFetch(mockPlan);

    const result = await generateStudyPlan(1, "easy array problems");

    expect(result.plan_id).toBe(7);
    expect(result.plan_name).toBe("Easy Array Focus");
    expect(result.problems).toHaveLength(2);
    expect(result.ai_message).toBe(
      "Here is a study plan tailored to your goals.",
    );
    expect(result.total_time).toBe(45);
  });

  it("returns all problem fields correctly", async () => {
    mockFetch(mockPlan);

    const result = await generateStudyPlan(1, "easy array problems");
    const firstProblem = result.problems[0];

    expect(firstProblem.problem_id).toBe(1);
    expect(firstProblem.problem_title).toBe("Two Sum");
    expect(firstProblem.difficulty_level).toBe("Easy");
    expect(firstProblem.estimate_time).toBe(15);
  });

  // ── Request shape ─────────────────────────────────────────────────────────

  it("sends a POST to /chat/generate-plan/", async () => {
    mockFetch(mockPlan);

    await generateStudyPlan(1, "easy problems");

    const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(url).toBe(`${API_BASE}/chat/generate-plan/`);
    expect(options.method).toBe("POST");
  });

  it("sends account_number and message in the request body", async () => {
    mockFetch(mockPlan);

    await generateStudyPlan(3, "dynamic programming for 2 hours");

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    const body = JSON.parse(options.body);
    expect(body.account_number).toBe(3);
    expect(body.message).toBe("dynamic programming for 2 hours");
  });

  it("includes Authorization header when token is present", async () => {
    localStorage.setItem("access_token", "my-token");
    mockFetch(mockPlan);

    await generateStudyPlan(1, "hard problems");

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(options.headers["Authorization"]).toBe("Bearer my-token");
  });

  // ── Error handling ────────────────────────────────────────────────────────

  it("throws when the backend returns 400 with an error message", async () => {
    mockFetch(
      { error: "account_number and message are required" },
      false,
      400,
    );

    await expect(generateStudyPlan(1, "")).rejects.toThrow(
      "account_number and message are required",
    );
  });

  it("throws when the backend returns 404 (no published problems)", async () => {
    mockFetch({ error: "No published problems available" }, false, 404);

    await expect(generateStudyPlan(1, "easy problems")).rejects.toThrow(
      "No published problems available",
    );
  });

  it("throws on network failure", async () => {
    mockFetchNetworkError("Failed to fetch");

    await expect(generateStudyPlan(1, "easy problems")).rejects.toThrow(
      "Failed to fetch",
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("acceptStudyPlan", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  // ── Happy path ────────────────────────────────────────────────────────────

  it("returns success and plan_id on acceptance", async () => {
    mockFetch({ success: true, plan_id: 42 });

    const result = await acceptStudyPlan(1, 42);

    expect(result.success).toBe(true);
    expect(result.plan_id).toBe(42);
  });

  // ── Request shape ─────────────────────────────────────────────────────────

  it("sends a POST to /chat/accept-plan/", async () => {
    mockFetch({ success: true, plan_id: 1 });

    await acceptStudyPlan(1, 1);

    const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(url).toBe(`${API_BASE}/chat/accept-plan/`);
    expect(options.method).toBe("POST");
  });

  it("sends account_number and plan_id in the request body", async () => {
    mockFetch({ success: true, plan_id: 5 });

    await acceptStudyPlan(2, 5);

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    const body = JSON.parse(options.body);
    expect(body.account_number).toBe(2);
    expect(body.plan_id).toBe(5);
  });

  // ── Error handling ────────────────────────────────────────────────────────

  it("throws when plan is not found (404)", async () => {
    mockFetch({ error: "Plan not found" }, false, 404);

    await expect(acceptStudyPlan(1, 999)).rejects.toThrow("Plan not found");
  });

  it("throws when plan is already accepted (400)", async () => {
    mockFetch({ error: "Plan already accepted" }, false, 400);

    await expect(acceptStudyPlan(1, 5)).rejects.toThrow("Plan already accepted");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("fetchChatHistory", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  const mockHistory: ChatHistoryItem[] = [
    {
      query_id: 1,
      user_message: "easy array problems",
      ai_response: "Here is a plan for easy array problems.",
      created_at: "2025-03-10T10:00:00Z",
    },
    {
      query_id: 2,
      user_message: "hard dynamic programming",
      ai_response: "Here is a plan for DP.",
      created_at: "2025-03-09T10:00:00Z",
    },
  ];

  // ── Happy path ────────────────────────────────────────────────────────────

  it("returns the list of chat history items", async () => {
    mockFetch(mockHistory);

    const result = await fetchChatHistory(1);

    expect(result).toHaveLength(2);
    expect(result[0].query_id).toBe(1);
    expect(result[0].user_message).toBe("easy array problems");
    expect(result[0].ai_response).toBe(
      "Here is a plan for easy array problems.",
    );
    expect(result[0].created_at).toBe("2025-03-10T10:00:00Z");
  });

  it("returns an empty array when there is no history", async () => {
    mockFetch([]);

    const result = await fetchChatHistory(999);

    expect(result).toEqual([]);
  });

  // ── Request shape ─────────────────────────────────────────────────────────

  it("sends a GET to /chat/history/{accountNumber}/", async () => {
    mockFetch(mockHistory);

    await fetchChatHistory(7);

    const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(url).toBe(`${API_BASE}/chat/history/7/`);
    expect(options.method).toBeUndefined(); // GET is the default
  });

  it("includes Authorization header when token is present", async () => {
    localStorage.setItem("access_token", "bearer-abc");
    mockFetch(mockHistory);

    await fetchChatHistory(1);

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(options.headers["Authorization"]).toBe("Bearer bearer-abc");
  });

  it("preserves all fields for each history item", async () => {
    mockFetch(mockHistory);

    const result = await fetchChatHistory(1);

    expect(result[1].query_id).toBe(2);
    expect(result[1].user_message).toBe("hard dynamic programming");
    expect(result[1].ai_response).toBe("Here is a plan for DP.");
    expect(result[1].created_at).toBe("2025-03-09T10:00:00Z");
  });

  // ── Error handling ────────────────────────────────────────────────────────

  it("throws on server error", async () => {
    mockFetch({ error: "Internal server error" }, false, 500);

    await expect(fetchChatHistory(1)).rejects.toThrow("Internal server error");
  });

  it("throws on network failure", async () => {
    mockFetchNetworkError("Connection refused");

    await expect(fetchChatHistory(1)).rejects.toThrow("Connection refused");
  });
});
