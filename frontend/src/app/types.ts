export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  algorithm: string;
  estimateTime?: number;
  isPublished?: boolean;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: string;
}

export interface CompletedProblem {
  problemId: string;
  completedAt: Date;
  code: string;
  notes?: string;
  isCorrect?: boolean;
  title?: string;
  difficulty?: Difficulty;
}

export interface TodoItem {
  problemId: string;
  addedAt: Date;
  todoId?: number;
  source?: 'manual' | 'study_plan';
}


export interface UserRole {
  role: "user" | "administrator";
}

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  registerDate: string;
  isAdmin: boolean;
  isStudent?: boolean;
}

