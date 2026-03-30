/**
 * Unit tests for the pure data-mapper functions in api.ts.
 *
 * These functions convert raw Django backend responses (snake_case, numeric IDs)
 * into the frontend's typed Problem / TodoItem / AppUser shapes. No network
 * calls happen here, so no mocking is needed — each test is a plain input→output
 * assertion.
 */

import { describe, it, expect } from "vitest";
import {
  apiProblemListToFrontend,
  apiProblemDetailToFrontend,
  apiUserToFrontend,
} from "./api";
import {
  mockApiProblemListItem,
  mockApiProblemDetail,
} from "../../test/fixtures";
import type { ApiUser } from "./api";

// ─────────────────────────────────────────────────────────────────────────────
// apiProblemListToFrontend
// Used by ProblemList to convert paginated list responses. Note that the list
// endpoint intentionally omits examples, constraints, and starterCode — only
// the detail endpoint returns those fields.
// ─────────────────────────────────────────────────────────────────────────────
describe("apiProblemListToFrontend", () => {
  it("maps all fields correctly", () => {
    const result = apiProblemListToFrontend(mockApiProblemListItem);
    expect(result.id).toBe("1");
    expect(result.title).toBe("Two Sum");
    expect(result.difficulty).toBe("Easy");
    expect(result.algorithm).toBe("Array");
    expect(result.estimateTime).toBe(30);
    expect(result.isPublished).toBe(true);
    expect(result.description).toBe(mockApiProblemListItem.problem_description);
  });

  // The list endpoint is lightweight — full problem content is deferred until
  // the user opens a specific problem. Verify the placeholders are correct.
  it("returns empty arrays for examples and constraints (list view has none)", () => {
    const result = apiProblemListToFrontend(mockApiProblemListItem);
    expect(result.examples).toEqual([]);
    expect(result.constraints).toEqual([]);
    expect(result.starterCode).toBe("");
  });

  // The backend uses numeric IDs; the frontend uses string IDs throughout.
  it("converts problem_id number to string id", () => {
    const result = apiProblemListToFrontend({ ...mockApiProblemListItem, problem_id: 42 });
    expect(result.id).toBe("42");
  });

  // estimate_time_baseline is nullable on the backend — map null to undefined
  // so optional-chaining works uniformly on the frontend.
  it("handles null estimate_time_baseline as undefined", () => {
    const result = apiProblemListToFrontend({
      ...mockApiProblemListItem,
      estimate_time_baseline: null,
    });
    expect(result.estimateTime).toBeUndefined();
  });

  // Guard against missing algorithms array (defensive fallback).
  it("defaults algorithm to empty string when algorithms array is empty", () => {
    const result = apiProblemListToFrontend({
      ...mockApiProblemListItem,
      algorithms: [],
    });
    expect(result.algorithm).toBe("");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// apiProblemDetailToFrontend
// Used by ProblemDetail when the full problem object (examples, constraints,
// starterCode) is needed.
// ─────────────────────────────────────────────────────────────────────────────
describe("apiProblemDetailToFrontend", () => {
  it("maps all fields correctly", () => {
    const result = apiProblemDetailToFrontend(mockApiProblemDetail);
    expect(result.id).toBe("1");
    expect(result.title).toBe("Two Sum");
    expect(result.difficulty).toBe("Easy");
    expect(result.algorithm).toBe("Array");
    expect(result.starterCode).toBe("def two_sum(nums, target):\n    pass");
    expect(result.isPublished).toBe(true);
  });

  // The explanation field is optional on the backend (nullable). Verify that a
  // present explanation is preserved and that null becomes undefined (not the
  // string "null").
  it("maps examples including optional explanation", () => {
    const result = apiProblemDetailToFrontend(mockApiProblemDetail);
    expect(result.examples).toHaveLength(2);
    expect(result.examples[0].input).toBe("nums = [2,7,11,15], target = 9");
    expect(result.examples[0].output).toBe("[0,1]");
    expect(result.examples[0].explanation).toBe("nums[0] + nums[1] == 9");
    // null explanation should become undefined
    expect(result.examples[1].explanation).toBeUndefined();
  });

  it("maps constraints array", () => {
    const result = apiProblemDetailToFrontend(mockApiProblemDetail);
    expect(result.constraints).toEqual([
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
    ]);
  });

  // starter_code may be empty for newly created problems.
  it("handles missing starter_code as empty string", () => {
    const result = apiProblemDetailToFrontend({
      ...mockApiProblemDetail,
      starter_code: "",
    });
    expect(result.starterCode).toBe("");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// apiUserToFrontend
// Used by AdminUserManager when rendering the user table.
// ─────────────────────────────────────────────────────────────────────────────
describe("apiUserToFrontend", () => {
  const mockApiUser: ApiUser = {
    accountNumber: 5,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    isStudent: true,
    isAdmin: false,
    registerDate: "2025-01-10",
  };

  it("maps all fields correctly", () => {
    const result = apiUserToFrontend(mockApiUser);
    expect(result.id).toBe("5");
    expect(result.firstName).toBe("Jane");
    expect(result.lastName).toBe("Doe");
    expect(result.email).toBe("jane@example.com");
    expect(result.isAdmin).toBe(false);
    expect(result.isStudent).toBe(true);
    expect(result.registerDate).toBe("2025-01-10");
  });

  // accountNumber (number) → id (string) follows the same pattern as problems.
  it("converts accountNumber to string id", () => {
    const result = apiUserToFrontend({ ...mockApiUser, accountNumber: 123 });
    expect(result.id).toBe("123");
  });
});
