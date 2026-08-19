"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import RobotAssistant, { type RobotState } from "@/components/robot/RobotAssistant";
import ChatPanel from "@/components/chat/ChatPanel";
import VoiceCommandBar from "@/components/voice/VoiceCommandBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [chatOpen, setChatOpen] = useState(false);

  const handleVoiceState = (state: "idle" | "listening") => {
    setRobotState(state);
  };

  const handleChatRobotState = (state: "idle" | "thinking" | "speaking") => {
    setRobotState(state);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Top bar */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Your AI career journey starts here</p>
            </div>
            <div className="flex items-center gap-3">
              <VoiceCommandBar onRobotStateChange={handleVoiceState} />
              <Button
                id="open-chat-btn"
                variant="outline"
                onClick={() => setChatOpen(true)}
                className="gap-2"
              >
                💬 Ask AI
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Status cards */}
            <div className="space-y-4 lg:col-span-2">
              {/* Quick stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "Assessment",
                    value: "Pending",
                    icon: "📋",
                    color: "text-orange-500",
                    href: "/assessment",
                    action: "Take Now",
                  },
                  {
                    title: "Roadmap",
                    value: "Not Generated",
                    icon: "🗺️",
                    color: "text-blue-500",
                    href: "/roadmap",
                    action: "View",
                  },
                  {
                    title: "Mentor",
                    value: "Not Assigned",
                    icon: "👨‍🏫",
                    color: "text-purple-500",
                    href: "/account",
                    action: "Request",
                  },
                ].map((card) => (
                  <motion.div
                    key={card.title}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border border-border">
                      <CardContent className="p-5">
                        <div className="mb-3 text-2xl">{card.icon}</div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {card.title}
                        </p>
                        <p className={`mt-1 text-sm font-semibold ${card.color}`}>{card.value}</p>
                        <Link href={card.href}>
                          <Button variant="ghost" size="sm" className="mt-3 h-7 px-0 text-xs text-primary">
                            {card.action} →
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Quick navigation cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Start AI Assessment",
                    description: "Answer a few questions and get your personalized career roadmap",
                    icon: "🧠",
                    href: "/assessment",
                    primary: true,
                  },
                  {
                    title: "View Career Roadmap",
                    description: "See your AI-recommended career paths, exams, and colleges",
                    icon: "🗺️",
                    href: "/roadmap",
                    primary: false,
                  },
                  {
                    title: "Chat with AI",
                    description: "Get personalized career guidance anytime",
                    icon: "💬",
                    onClick: () => setChatOpen(true),
                    primary: false,
                  },
                  {
                    title: "Your Account",
                    description: "View your profile, subscription, and assigned mentor",
                    icon: "👤",
                    href: "/account",
                    primary: false,
                  },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={`cursor-pointer border transition-colors hover:border-primary/40 ${
                        item.primary ? "border-primary/30 bg-primary/5" : "border-border"
                      }`}
                      onClick={item.onClick}
                    >
                      <CardContent className="p-5">
                        <div className="mb-2 text-3xl">{item.icon}</div>
                        <p className="font-heading text-base font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                        {item.href && (
                          <Link href={item.href} className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
                            Go →
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Voice commands hint */}
              <Card className="border-dashed border-border bg-muted/40">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-muted-foreground">🎤 Voice Commands</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try saying: <span className="font-medium text-foreground">"Start assessment"</span>,{" "}
                    <span className="font-medium text-foreground">"Career roadmap"</span>,{" "}
                    <span className="font-medium text-foreground">"Talk to assistant"</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right: Robot */}
            <div className="flex flex-col items-center justify-start gap-6 rounded-2xl border border-border bg-card p-6">
              <div className="text-center">
                <p className="font-heading text-sm font-semibold text-muted-foreground">Your AI Assistant</p>
              </div>
              <RobotAssistant state={robotState} size={160} />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {robotState === "idle" && "Ready to help! 👋"}
                  {robotState === "listening" && "I'm listening..."}
                  {robotState === "thinking" && "Thinking..."}
                  {robotState === "speaking" && "Here's what I found!"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click the mic to use voice commands
                </p>
              </div>
              <Button
                onClick={() => setChatOpen(true)}
                className="w-full gap-2"
                id="dashboard-chat-btn"
              >
                💬 Start Chatting
              </Button>
            </div>
          </div>
        </div>
      </main>

      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onRobotStateChange={handleChatRobotState}
      />
    </div>
  );
}
