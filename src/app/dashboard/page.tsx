"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RobotAssistant, { type RobotState } from "@/components/robot/RobotAssistant";
import ChatPanel from "@/components/chat/ChatPanel";
import VoiceCommandBar from "@/components/voice/VoiceCommandBar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  Sliders,
  Gamepad2,
  Trophy,
  ArrowRight,
  MessageSquare,
  RotateCw,
  Map,
  Dna,
  TrendingUp,
  Zap,
  Target,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  X,
} from "lucide-react";
import { storageService, TargetCareerData } from "@/services/storageService";
import { CAREER_DATASET } from "@/services/careerDataset";
import { CareerInfo } from "@/services/types";
import { Button } from "@/components/ui/button";

// ─── Stat Tile ────────────────────────────────────────────────────────────────

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className="bg-card text-card-foreground rounded-2xl p-4 cursor-pointer border border-border hover:border-primary/50 transition-all shadow-xs hover:shadow-md"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl shadow-xs"
          style={{ background: `${color}18`, border: `1px solid ${color}35` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="h-2.5 w-2.5" />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-heading text-xl sm:text-2xl font-black text-foreground tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-muted-foreground truncate">{sub}</p>}
    </motion.div>
  );
}

// ─── Action Card ──────────────────────────────────────────────────────────────

function ActionCard({
  title,
  desc,
  icon: Icon,
  href,
  accent,
  delay,
}: {
  title: string;
  desc: string;
  icon: React.ElementType;
  href: string;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
    >
      <Link href={href}>
        <div
          className="group bg-card text-card-foreground card-3d rounded-2xl p-5 cursor-pointer transition-all border border-border hover:border-primary/50 shadow-xs hover:shadow-md h-full flex flex-col justify-between"
          style={{ borderLeft: `3.5px solid ${accent}` }}
        >
          <div>
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 shadow-xs"
              style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
            >
              <Icon className="h-5 w-5" style={{ color: accent }} />
            </div>
            <h4 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">{title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-normal">{desc}</p>
          </div>
          <span
            className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold"
            style={{ color: accent }}
          >
            Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [chatOpen, setChatOpen] = useState(false);
  const [targetCareer, setTargetCareer] = useState<CareerInfo | null>(null);
  const [fitScore, setFitScore] = useState(92);
  const [hasTakenTest, setHasTakenTest] = useState(false);
  const [xp, setXp] = useState(450);
  const [isCoursePickerOpen, setIsCoursePickerOpen] = useState(false);

  const syncTargetCareer = () => {
    setXp(storageService.getXP());
    const savedTarget = storageService.getTargetCareer();
    const output = storageService.getAnalysisOutput();

    if (output?.matches?.length) {
      setHasTakenTest(true);
    }

    if (savedTarget) {
      const found = CAREER_DATASET.find((c) => c.id === savedTarget.careerId);
      if (found) {
        setTargetCareer(found);
        setFitScore(savedTarget.fitScore || 92);
        return;
      }
    }

    if (output?.matches?.length) {
      const top = output.matches[0];
      const found = CAREER_DATASET.find((c) => c.id === top.careerId);
      if (found) {
        setTargetCareer(found);
        setFitScore(top.score);
        return;
      }
    }

    // Default target career
    setTargetCareer(CAREER_DATASET[0]);
  };

  useEffect(() => {
    syncTargetCareer();

    const handleUpdate = (e: any) => {
      syncTargetCareer();
    };

    window.addEventListener("target-career-updated", handleUpdate);
    return () => window.removeEventListener("target-career-updated", handleUpdate);
  }, []);

  const handleSelectGoal = (career: CareerInfo) => {
    storageService.setTargetCareer({
      careerId: career.id,
      title: career.title,
      category: career.category,
      stream: career.category,
      fitScore: 94,
      selectedAt: new Date().toISOString(),
    });
    setTargetCareer(career);
    setIsCoursePickerOpen(false);
  };

  const handleVoiceState = (state: "idle" | "listening" | "thinking" | "speaking") => setRobotState(state);
  const handleChatRobotState = (state: "idle" | "thinking" | "speaking") => setRobotState(state);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto min-w-0 pb-36 lg:pb-12">

        {/* ═══════════════════════════════════════════════════════
            TOP HERO ROW — AI Companion + Welcome (full width)
        ═══════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden border-b border-border/50 bg-card/60 backdrop-blur-xl px-4 md:px-6 py-5">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 bottom-0 h-32 w-32 rounded-full bg-violet-500/8 blur-2xl" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center">

            {/* ─ AI Robot + Status ─ */}
            <motion.div
              className="flex flex-row items-center gap-4 md:flex-col md:items-center md:gap-2 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 130 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="h-24 w-24 rounded-full bg-primary/15 blur-xl"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <RobotAssistant state={robotState} size={96} className="relative z-10" />
              </div>

              <div className="flex flex-col gap-1 md:text-center">
                <span className="inline-flex items-center gap-1 self-start md:self-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary shadow-xs">
                  <Sparkles className="h-3 w-3" />
                  AI Counsellor
                </span>
                <p className="text-xs font-semibold text-foreground/80">
                  {robotState === "idle" && "Ready to guide your career 👋"}
                  {robotState === "listening" && "Listening to voice..."}
                  {robotState === "thinking" && "Analyzing trajectories..."}
                  {robotState === "speaking" && "Speaking..."}
                </p>
              </div>
            </motion.div>

            <div className="hidden md:block w-px self-stretch bg-border/50" />

            {/* ─ Welcome Text ─ */}
            <motion.div
              className="flex-1 min-w-0"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <h1 className="font-heading text-2xl font-extrabold md:text-3xl text-foreground tracking-tight">
                Welcome to Aptivate
              </h1>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm font-medium">
                {hasTakenTest ? (
                  <>
                    Target Pathway: <strong className="text-foreground font-bold">{targetCareer?.title}</strong> — <span className="font-bold text-primary">{fitScore}% match fit</span>
                  </>
                ) : (
                  "Take your 3-minute assessment or choose a career path to unlock your personalized GPS roadmap."
                )}
              </p>

              {/* Action buttons inline with welcome */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                <Link href="/assessment">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="rounded-xl bg-primary px-4.5 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition"
                  >
                    {hasTakenTest ? "Retake Assessment" : "🧠 Take Assessment"}
                  </motion.button>
                </Link>

                <Button
                  onClick={() => setIsCoursePickerOpen(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-bold gap-1.5 border-border/80"
                >
                  <Target className="h-3.5 w-3.5 text-primary" />
                  <span>Change Target Goal</span>
                </Button>

                {/* Voice + Ask AI */}
                <VoiceCommandBar
                  onRobotStateChange={handleVoiceState}
                  onVoiceQuery={() => setChatOpen(true)}
                />
                <motion.button
                  onClick={() => setChatOpen(true)}
                  whileTap={{ scale: 0.96 }}
                  className="glass flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-foreground transition hover:border-primary/40 border border-border/70"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  Ask AI
                </motion.button>
              </div>
            </motion.div>

            {/* ─ XP / Leaderboard Teaser ─ */}
            <motion.div
              className="hidden xl:flex flex-col items-end gap-2 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/leaderboard">
                <motion.div
                  whileTap={{ scale: 0.95, transition: { duration: 0.15 } }}
                  className="glass flex items-center gap-3 rounded-xl px-4 py-2.5 cursor-pointer hover:border-primary/40 transition border border-border/70 shadow-sm"
                >
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="text-xs font-black text-foreground">{xp} XP</p>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Leaderboard</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            CONTENT AREA
        ═══════════════════════════════════════════════════════ */}
        <div className="p-3 sm:p-4 md:p-6 space-y-5">

          {/* ─ Active Target Career / Course Feature Banner ─ */}
          {targetCareer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card p-4 sm:p-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-2xl shadow-inner">
                    {targetCareer.emoji}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <Target className="h-3 w-3" />
                        Active Target Goal
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {targetCareer.category}
                      </span>
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                        {fitScore}% Compatibility Fit
                      </span>
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mt-0.5">
                      {targetCareer.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {targetCareer.fullDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/careers/${targetCareer.id}`}>
                    <Button size="sm" className="text-xs font-bold gap-1 bg-primary text-primary-foreground shadow-sm">
                      <span>View Roadmap & Exams</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setIsCoursePickerOpen(true)}
                    size="sm"
                    variant="outline"
                    className="text-xs font-bold border-border/80"
                  >
                    Switch Path
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─ Stat Tiles Row ─ */}
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
            <StatTile icon={Target} label="Assessment" value={hasTakenTest ? "Done ✓" : "Pending"} sub="3 min psychometric test" color="#6366f1" delay={0.05} />
            <StatTile icon={Sparkles} label="Career Tracks" value="6 Mapped" sub="Evaluated matrix" color="#8b5cf6" delay={0.1} trend="+2" />
            <StatTile icon={Zap} label="Your XP" value={`${xp} pts`} sub="Complete simulation quests" color="#f59e0b" delay={0.15} />
            <StatTile icon={Trophy} label="Simulations" value="5 Labs" sub="Day-in-the-life roles" color="#10b981" delay={0.2} />
          </div>

          {/* ─ Quick Nav Pills ─ */}
          <div className="grid grid-cols-3 gap-3.5">
            {[
              { label: "Discovery Test", icon: Compass, href: "/assessment", accent: "#6366f1", value: hasTakenTest ? "Completed" : "Start Now" },
              { label: "Career Matrix", icon: Sparkles, href: "/careers", accent: "#8b5cf6", value: "6 Tracks" },
              { label: "What-If Studio", icon: Sliders, href: "/what-if", accent: "#06b6d4", value: "Live Sim" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Link href={item.href}>
                    <div className="group bg-card text-card-foreground rounded-2xl p-4 cursor-pointer hover:border-primary/50 transition-all border border-border shadow-xs hover:shadow-md">
                      <div
                        className="mb-2.5 flex h-8.5 w-8.5 items-center justify-center rounded-xl shadow-xs"
                        style={{ background: `${item.accent}18`, border: `1px solid ${item.accent}35` }}
                      >
                        <Icon className="h-4.5 w-4.5" style={{ color: item.accent }} />
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">{item.label}</p>
                      <p className="mt-0.5 text-xs sm:text-sm font-extrabold text-foreground">{item.value}</p>
                      <span className="mt-2 inline-block text-[10px] sm:text-[11px] font-bold" style={{ color: item.accent }}>
                        Open →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ─ Core Action Grid ─ */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ActionCard title="Career DNA Vector" desc="8-dimensional psychometric breakdown of your cognitive strengths and natural styles." icon={Dna} href="/career-dna" accent="#6366f1" delay={0.25} />
            <ActionCard title="1v1 Career Battle" desc="Compare two careers side-by-side on salary, difficulty, demand, and work-life balance." icon={Sparkles} href="/career-battle" accent="#8b5cf6" delay={0.3} />
            <ActionCard title="Career Simulations" desc="Experience day-in-the-life workplace scenarios to feel real job roles." icon={Gamepad2} href="/simulations" accent="#10b981" delay={0.35} />
            <ActionCard title="GPS Roadmap" desc="Milestone-by-milestone preparation roadmap for entrance exams and college." icon={Map} href="/roadmap" accent="#f59e0b" delay={0.4} />
          </div>
        </div>
      </main>

      {/* ── Goal / Course Picker Modal ── */}
      <AnimatePresence>
        {isCoursePickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-heading text-base font-bold text-foreground">Select Target Career / Course</h3>
                </div>
                <button
                  onClick={() => setIsCoursePickerOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Pick a target career track. Your dashboard stats, exam milestones, and simulations will adapt to this goal:
              </p>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {CAREER_DATASET.map((c) => {
                  const isSelected = targetCareer?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectGoal(c)}
                      className={`flex w-full items-center justify-between p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border bg-accent/20 hover:border-primary/40 hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-foreground">{c.title}</div>
                          <div className="text-[10px] text-muted-foreground">{c.category} • Avg: {c.averageSalary}</div>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                          ✓ Active
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-primary">
                          Select →
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onRobotStateChange={handleChatRobotState}
      />
    </div>
  );
}
