"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getLocalAiResponseData } from "@/lib/ai/localAiEngine";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestedQuestions?: string[];
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRobotStateChange?: (state: "idle" | "thinking" | "speaking") => void;
}

export default function ChatPanel({ isOpen, onClose, onRobotStateChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! 👋 I'm your AI career counsellor. Ask me anything about careers, entrance exams, colleges, or skill development in India!",
      suggestedQuestions: [
        "What are the best careers after 12th PCM?",
        "Which stream should I choose after 10th?",
        "Top high-paying careers in Commerce & Finance",
        "How to prepare for JEE & NEET exams?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<"general" | "personalized">("general");
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
    onRobotStateChange?.("thinking");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sessionId,
        }),
      });

      if (!res.ok) {
        // Fallback to local AI engine with recommendations
        const localData = getLocalAiResponseData(textToSend, { mode });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: localData.content,
            suggestedQuestions: localData.suggestedQuestions,
          },
        ]);
        onRobotStateChange?.("speaking");
        return;
      }

      onRobotStateChange?.("speaking");

      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("text/plain") || contentType.includes("text/event-stream")) {
        // Streaming response
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const text = JSON.parse(line.slice(2));
                assistantText += text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantText,
                    suggestedQuestions: getLocalAiResponseData(textToSend).suggestedQuestions,
                  };
                  return updated;
                });
              } catch {}
            }
          }
        }
      } else {
        // Non-streaming / direct answer
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
      // Offline / network fallback
      const localData = getLocalAiResponseData(textToSend, { mode });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: localData.content,
          suggestedQuestions: localData.suggestedQuestions,
        },
      ]);
      onRobotStateChange?.("speaking");
    } finally {
      setIsLoading(false);
      setTimeout(() => onRobotStateChange?.("idle"), 2500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg">🤖</div>
                <div>
                  <p className="text-sm font-semibold">AI Career Counsellor</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${mode === "personalized" ? "bg-green-500" : "bg-blue-500"}`} />
                    <span className="text-xs text-muted-foreground capitalize">{mode} mode</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground font-medium"
                        : "bg-muted/80 border border-border/60 text-foreground shadow-xs"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Clickable Recommended Questions */}
                  {msg.role === "assistant" && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="mt-2.5 max-w-[95%] flex flex-wrap gap-1.5 pl-1">
                      <div className="w-full text-[11px] font-semibold text-primary/80 mb-0.5 flex items-center gap-1">
                        <span>✨ Recommended Follow-ups:</span>
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
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -4, 0] }}
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
              <div className="flex gap-2">
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask about careers, exams, colleges..."
                  className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="rounded-xl px-4 font-bold"
                  id="chat-send-btn"
                >
                  →
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
