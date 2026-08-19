"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RobotAssistant, { type RobotState } from "@/components/robot/RobotAssistant";

import { AppSidebar } from "@/components/layout/AppSidebar";

import { getLocalAiResponse } from "@/lib/ai/localAiEngine";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! 👋 I'm your AI career counsellor. Ask me anything about careers, exams, colleges, or skill development in India!",
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const currentInput = input.trim();
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
        const localAnswer = getLocalAiResponse(currentInput, { mode });
        setMessages((prev) => [...prev, { role: "assistant", content: localAnswer }]);
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
                return [...prev.slice(0, -1), { role: "assistant", content: assistantText }];
              }
              return [...prev, { role: "assistant", content: assistantText }];
            });
          }
        }
      } else {
        const data = await res.json();
        if (data.sessionId) setSessionId(data.sessionId);
        if (data.mode) setMode(data.mode);
        const reply = data.content || getLocalAiResponse(currentInput, { mode });
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      }
    } catch {
      const localAnswer = getLocalAiResponse(currentInput, { mode });
      setMessages((prev) => [...prev, { role: "assistant", content: localAnswer }]);
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
          <p className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Quick Prompts</p>
          {[
            "What careers suit a PCM student?",
            "How to prepare for JEE Main & Adv?",
            "What is CAT and IIM eligibility?",
            "Best colleges for Computer Science in India?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="block w-full rounded-xl p-2.5 text-left text-xs font-medium border border-border/60 bg-card/60 hover:bg-accent hover:text-foreground transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col min-w-0 pb-16 lg:pb-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg">🤖</div>
            <div>
              <p className="text-sm font-semibold">AI Career Counsellor</p>
              <p className="text-xs text-muted-foreground capitalize">{mode} mode</p>
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
            <motion.div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[70%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-2 w-2 rounded-full bg-muted-foreground"
                      animate={{ y: [0, -5, 0] }}
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
        <div className="border-t border-border p-4">
          <div className="flex gap-3">
            <input
              id="chat-page-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask about careers, exams, colleges in India..."
              className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="rounded-xl px-5"
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
