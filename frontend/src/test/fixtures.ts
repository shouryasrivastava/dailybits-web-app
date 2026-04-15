import type {
  ApiProblemListItem,
  ApiProblemDetail,
  ApiTodoItem,
} from "../app/utils/api";
import type { Problem, CompletedProblem } from "../app/types";

export const mockApiProblemListItem: ApiProblemListItem = {
  problem_id: 1,
  problem_title: "Two Sum",
  problem_description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  difficulty_level: "Easy",
  estimate_time_baseline: 30,
  is_published: true,
  algorithms: ["Array", "Hash Table"],
};

export const mockApiProblemListItem2: ApiProblemListItem = {
  problem_id: 2,
  problem_title: "Valid Parentheses",
  problem_description:
    "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
  difficulty_level: "Medium",
  estimate_time_baseline: 45,
  is_published: true,
  algorithms: ["Stack"],
};

export const mockApiProblemListItem3: ApiProblemListItem = {
  problem_id: 3,
  problem_title: "Merge K Sorted Lists",
  problem_description: "Merge k sorted linked lists into one sorted list.",
  difficulty_level: "Hard",
  estimate_time_baseline: 60,
  is_published: true,
  algorithms: ["Heap", "Divide and Conquer"],
};

export const mockApiProblemDetail: ApiProblemDetail = {
  problem_id: 1,
  problem_title: "Two Sum",
  problem_description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  difficulty_level: "Easy",
  estimate_time_baseline: 30,
  starter_code: "def two_sum(nums, target):\n    pass",
  is_published: true,
  algorithms: ["Array", "Hash Table"],
  problem_constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
  ],
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "nums[0] + nums[1] == 9",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: null,
    },
  ],
};

export const mockFrontendProblem: Problem = {
  id: "1",
  title: "Two Sum",
  difficulty: "Easy",
  algorithm: "Array",
  estimateTime: 30,
  isPublished: true,
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "nums[0] + nums[1] == 9",
    },
  ],
  constraints: ["2 <= nums.length <= 10^4"],
  starterCode: "def two_sum(nums, target):\n    pass",
};

export const mockCompletedProblem: CompletedProblem = {
  problemId: "1",
  completedAt: new Date("2025-03-01T10:00:00Z"),
  code: "def two_sum(nums, target):\n    return [0, 1]",
};

export const mockApiTodoItem: ApiTodoItem = {
  todo_id: 101,
  account_number: 1,
  problem_id: 1,
  problem_title: "Two Sum",
  problem_description:
    "Given an array of integers, return indices of two numbers.",
  difficulty_level: "Easy",
  added_at: "2025-03-01T10:00:00Z",
  source: "manual",
  algorithms: ["Array"],
  is_completed: false,
};

export const mockApiTodoItem2: ApiTodoItem = {
  todo_id: 102,
  account_number: 1,
  problem_id: 2,
  problem_title: "Valid Parentheses",
  problem_description: "Determine if the input string is valid.",
  difficulty_level: "Medium",
  added_at: "2025-03-02T10:00:00Z",
  source: "study_plan",
  algorithms: ["Stack"],
  is_completed: false,
};
