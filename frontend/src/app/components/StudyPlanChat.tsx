import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { addTodoItem, getProblems } from "../utils/storage";
import {
  generateStudyPlan as apiGenerateStudyPlan,
  acceptStudyPlan as apiAcceptStudyPlan,
  type GeneratedPlan,
  type StudyPlanProblem,
} from "../utils/api";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  plan?: GeneratedPlan;
}

interface StudyPlanChatProps {
  onPlanAccepted: () => void;
}

const ACCOUNT_NUMBER = 1;

function getDifficultyColor(level: string) {
  switch (level) {
    case "Easy":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Hard":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
}

function localFallbackPlan(userMessage: string): GeneratedPlan {
  const problems = getProblems();
  const lower = userMessage.toLowerCase();
  let selected = problems.slice(0, 5);

  if (lower.includes("easy") || lower.includes("beginner")) {
    selected = problems.filter((p) => p.difficulty === "Easy").slice(0, 5);
  } else if (lower.includes("hard") || lower.includes("advanced")) {
    selected = problems.filter((p) => p.difficulty === "Hard").slice(0, 3);
  } else if (lower.includes("medium")) {
    selected = problems.filter((p) => p.difficulty === "Medium").slice(0, 5);
  }

  if (selected.length === 0) selected = problems.slice(0, 5);

  return {
    plan_id: -1,
    plan_name: "Study Plan",
    total_time: selected.length * 20,
    ai_message:
      "Here's a study plan based on your request (generated locally — backend unavailable).",
    problems: selected.map((p) => ({
      problem_id: Number(p.id),
      problem_title: p.title,
      difficulty_level: p.difficulty,
      algorithms: Array.isArray(p.algorithm) ? p.algorithm : [p.algorithm],
      estimate_time: 20,
    })),
  };
}

export function StudyPlanChat({ onPlanAccepted }: StudyPlanChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help you create a personalized study plan. Tell me about your goals, preferred difficulty level, or topics you want to focus on!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsGenerating(true);

    let plan: GeneratedPlan;
    try {
      plan = await apiGenerateStudyPlan(ACCOUNT_NUMBER, userMessage);
    } catch {
      plan = localFallbackPlan(userMessage);
    }

    setCurrentPlan(plan);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: plan.ai_message, plan },
    ]);
    setIsGenerating(false);
  };

  const handleAcceptPlan = async () => {
    if (!currentPlan) return;
    setIsAccepting(true);

    try {
      if (currentPlan.plan_id > 0) {
        await apiAcceptStudyPlan(ACCOUNT_NUMBER, currentPlan.plan_id);
      } else {
        currentPlan.problems.forEach((p) =>
          addTodoItem({
            problemId: String(p.problem_id),
            addedAt: new Date(),
            priority: "medium",
          }),
        );
      }
      toast.success("Study plan added to your todo list!");
    } catch {
      currentPlan.problems.forEach((p) =>
        addTodoItem({
          problemId: String(p.problem_id),
          addedAt: new Date(),
          priority: "medium",
        }),
      );
      toast.success("Study plan saved locally to your todo list!");
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Great! I've added all the problems to your todo list. Good luck with your practice!",
      },
    ]);
    setCurrentPlan(null);
    setIsAccepting(false);
    onPlanAccepted();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-neutral-200 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-700" />
          <h2 className="font-semibold text-neutral-900">
            Study Plan Assistant
          </h2>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Get personalized problem recommendations powered by AI
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-slate-600 text-white"
                    : "bg-neutral-100 text-neutral-900"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>

                {message.plan && (
                  <div className="mt-3 space-y-2">
                    {message.plan.problems.map((p, i) => (
                      <PlanProblemCard key={p.problem_id} problem={p} index={i} />
                    ))}
                    <p className="text-xs text-neutral-500 mt-2">
                      Total estimated time: {message.plan.total_time} min
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {currentPlan && (
        <div className="border-t border-neutral-200 p-4 bg-slate-50">
          <Button
            onClick={handleAcceptPlan}
            disabled={isAccepting}
            className="w-full bg-slate-400 hover:bg-slate-600"
            size="sm"
          >
            {isAccepting ? "Adding to Todo..." : "Accept Study Plan"}
          </Button>
        </div>
      )}

      <div className="border-t border-neutral-200 p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe your goals..."
            className="resize-none"
            rows={3}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            size="sm"
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          Try: "I want to practice easy array problems" or "Help me with
          dynamic programming for 2 hours"
        </p>
      </div>
    </div>
  );
}

function PlanProblemCard({
  problem,
  index,
}: {
  problem: StudyPlanProblem;
  index: number;
}) {
  return (
    <div className="flex items-center gap-3 p-2 bg-white rounded-md border border-neutral-200">
      <span className="text-xs font-medium text-neutral-400 w-5">
        {index + 1}.
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">
          {problem.problem_title}
        </p>
        <p className="text-xs text-neutral-500">
          ~{problem.estimate_time} min
        </p>
      </div>
      <Badge variant="outline" className={getDifficultyColor(problem.difficulty_level)}>
        {problem.difficulty_level}
      </Badge>
    </div>
  );
}
