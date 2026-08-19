"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RobotAssistant, { type RobotState } from "@/components/robot/RobotAssistant";

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
        const err = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.error}` }]);
        return;
      }

      setRobotState("speaking");
      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("text/plain") || contentType.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("0:")) {
              try {
                assistantText += JSON.parse(line.slice(2));
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantText };
                  return updated;
                });
              } catch {}
            }
          }
        }
      } else {
        const data = await res.json();
        if (data.sessionId) setSessionId(data.sessionId);
        if (data.mode) setMode(data.mode);
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      }
    } finally {
      setIsLoading(false);
      setRobotState("idle");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r border-border p-4 md:flex">
        <div className="flex flex-col items-center gap-4 py-4">
          <RobotAssistant state={robotState} size={100} />
          <div className="text-center">
            <p className="text-sm font-semibold">AI Counsellor</p>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              mode === "personalized"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${mode === "personalized" ? "bg-green-500" : "bg-blue-500"}`} />
              {mode === "personalized" ? "Personalized" : "General"} Mode
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <p className="font-semibold uppercase tracking-wide">Quick questions</p>
          {[
            "What careers suit a PCM student?",
            "How to prepare for JEE?",
            "What is CAT exam?",
            "Best colleges for CS in India?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
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
