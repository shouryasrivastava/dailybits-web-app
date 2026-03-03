import { useState } from "react";
import { Send, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { getProblems, addTodoItem } from "../utils/storage";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StudyPlanChatProps {
  onPlanAccepted: () => void;
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
  const [currentPlan, setCurrentPlan] = useState<string[] | null>(null);
  const problems = getProblems();

  const generateStudyPlan = (userMessage: string): string[] => {
    // Mock LLM response based on user input
    const lowerMessage = userMessage.toLowerCase();

    let selectedProblems: string[] = [];

    if (lowerMessage.includes("beginner") || lowerMessage.includes("easy")) {
      selectedProblems = problems
        .filter((p) => p.difficulty === "Easy")
        .slice(0, 5)
        .map((p) => p.id);
    } else if (
      lowerMessage.includes("advanced") ||
      lowerMessage.includes("hard")
    ) {
      selectedProblems = problems
        .filter((p) => p.difficulty === "Hard")
        .concat(problems.filter((p) => p.difficulty === "Medium").slice(0, 2))
        .slice(0, 5)
        .map((p) => p.id);
    } else if (lowerMessage.includes("array")) {
      selectedProblems = problems
        .filter((p) => p.algorithm === "Array")
        .slice(0, 5)
        .map((p) => p.id);
    } else if (lowerMessage.includes("linked list")) {
      selectedProblems = problems
        .filter((p) => p.algorithm === "Linked List")
        .slice(0, 5)
        .map((p) => p.id);
    } else if (
      lowerMessage.includes("dynamic programming") ||
      lowerMessage.includes("dp")
    ) {
      selectedProblems = problems
        .filter((p) => p.algorithm === "Dynamic Programming")
        .concat(problems.filter((p) => p.difficulty === "Medium").slice(0, 3))
        .slice(0, 5)
        .map((p) => p.id);
    } else {
      // Default: mixed difficulty
      selectedProblems = [
        ...problems.filter((p) => p.difficulty === "Easy").slice(0, 2),
        ...problems.filter((p) => p.difficulty === "Medium").slice(0, 2),
        ...problems.filter((p) => p.difficulty === "Hard").slice(0, 1),
      ].map((p) => p.id);
    }

    return selectedProblems;
  };

  const formatStudyPlan = (problemIds: string[]): string => {
    const planProblems = problemIds
      .map((id) => problems.find((p) => p.id === id))
      .filter((p) => p !== undefined);

    let response =
      "Based on your request, here's a personalized study plan:\n\n";

    planProblems.forEach((problem, idx) => {
      response += `${idx + 1}. **${problem.title}** (${problem.difficulty}) - ${problem.algorithm}\n`;
    });

    response +=
      "\nThis plan covers a good mix of concepts to strengthen your skills. Would you like to add these to your todo list?";

    return response;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Simulate API delay
    setTimeout(() => {
      const planIds = generateStudyPlan(input);
      const response = formatStudyPlan(planIds);

      setCurrentPlan(planIds);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleAcceptPlan = () => {
    if (!currentPlan) return;

    currentPlan.forEach((problemId) => {
      addTodoItem({
        problemId,
        addedAt: new Date(),
        priority: "medium",
      });
    });

    toast.success("Study plan added to your todo list!");
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Great! I've added all the problems to your todo list. Good luck with your practice!",
      },
    ]);
    setCurrentPlan(null);
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
          Get personalized problem recommendations
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
            className="w-full bg-slate-400 hover:bg-slate-600"
            size="sm"
          >
            Accept Study Plan
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
          Try: "I want to practice easy array problems" or "Create a plan for
          beginners"
        </p>
      </div>
    </div>
  );
}
