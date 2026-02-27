export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  algorithm: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

export interface CompletedProblem {
  problemId: string;
  completedAt: Date;
  code: string;
  notes: string;
}

export interface TodoItem {
  problemId: string;
  addedAt: Date;
  priority?: "low" | "medium" | "high";
  notes?: string;
}

export interface StudyPlan {
  id: string;
  name: string;
  problems: string[];
  createdAt: Date;
}

export interface UserRole {
  role: "user" | "administrator";
}
