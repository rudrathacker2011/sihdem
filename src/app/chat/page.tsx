"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RobotAssistant, { type RobotState } from "@/components/robot/RobotAssistant";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { getLocalAiResponseData } from "@/lib/ai/localAiEngine";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestedQuestions?: string[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! 👋 I'm your AI career counsellor. Ask me anything about careers, exams, colleges, or skill development in India!",
      suggestedQuestions: [
        "What are the best career options after 12th PCM?",
        "Which stream should I choose after 10th?",
        "Top high-paying careers in Commerce & Finance",
        "How to prepare for competitive entrance exams?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"general" | "personalized">("general");
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (overrideText?: string) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setRobotState("thinking");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage], sessionId }),
      });

      if (!res.ok) {
        const localData = getLocalAiResponseData(textToSend, { mode });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: localData.content,
            suggestedQuestions: localData.suggestedQuestions,
          },
        ]);
        setRobotState("speaking");
        return;
      }

      setRobotState("speaking");
      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("text/plain") || contentType.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            assistantText += decoder.decode(value, { stream: true });
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  {
                    role: "assistant",
                    content: assistantText,
                    suggestedQuestions: getLocalAiResponseData(textToSend).suggestedQuestions,
                  },
                ];
              }
              return [
                ...prev,
                {
                  role: "assistant",
                  content: assistantText,
                  suggestedQuestions: getLocalAiResponseData(textToSend).suggestedQuestions,
                },
              ];
            });
          }
        }
      } else {
        const data = await res.json();
        if (data.sessionId) setSessionId(data.sessionId);
        if (data.mode) setMode(data.mode);
        const fallbackData = getLocalAiResponseData(textToSend, { mode });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.content || fallbackData.content,
            suggestedQuestions: data.suggestedQuestions || fallbackData.suggestedQuestions,
          },
        ]);
      }
    } catch {
      const localData = getLocalAiResponseData(textToSend, { mode });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: localData.content,
          suggestedQuestions: localData.suggestedQuestions,
        },
      ]);
      setRobotState("speaking");
    } finally {
      setIsLoading(false);
      setTimeout(() => setRobotState("idle"), 2500);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background text-foreground overflow-hidden">
      <AppSidebar />

      {/* Chat sidebar on md+ */}
      <div className="hidden w-64 flex-col border-r border-border/80 p-4 xl:flex shrink-0 bg-card/40">
        <div className="flex flex-col items-center gap-4 py-4">
          <RobotAssistant state={robotState} size={100} />
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">AI Counsellor</p>
            <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
              mode === "personalized"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-primary/15 text-primary"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${mode === "personalized" ? "bg-emerald-500" : "bg-primary"}`} />
              {mode === "personalized" ? "Personalized" : "General"} Mode
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <p className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Popular Topics</p>
          {[
            "What are the best careers after 12th PCM?",
            "How to choose a stream after 10th?",
            "Compare Engineering vs Medicine",
            "High-paying careers in Commerce & Finance",
            "Top engineering colleges without JEE",
          ].map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="block w-full rounded-xl p-2.5 text-left text-xs font-medium border border-border/60 bg-card/60 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col min-w-0 pb-20 lg:pb-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg">🤖</div>
            <div>
              <p className="text-sm font-semibold">AI Career Counsellor</p>
              <p className="text-xs text-muted-foreground capitalize">{mode} mode • Instant Response</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([messages[0]])}
            className="text-xs"
            id="clear-chat-btn"
          >
            Clear chat
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "bg-card border border-border/80 text-foreground shadow-xs"
                }`}
              >
                {msg.content}
              </div>

              {/* Clickable Recommended Questions */}
              {msg.role === "assistant" && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="mt-2.5 max-w-[90%] flex flex-wrap gap-1.5 pl-1">
                  <div className="w-full text-[11px] font-semibold text-primary/80 mb-0.5 flex items-center gap-1">
                    <span>✨ Recommended Questions:</span>
                  </div>
                  {msg.suggestedQuestions.map((question, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => sendMessage(question)}
                      disabled={isLoading}
                      className="rounded-full border border-primary/25 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary hover:text-primary-foreground transition text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-card border border-border/80 px-4 py-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-2 w-2 rounded-full bg-primary"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4 bg-background/80 backdrop-blur-md">
          <div className="flex gap-2">
            <input
              id="chat-page-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask anything about careers, entrance exams, top colleges, or packages..."
              className="flex-1 rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="rounded-xl px-5 font-bold"
              id="chat-page-send-btn"
            >
              Send →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
