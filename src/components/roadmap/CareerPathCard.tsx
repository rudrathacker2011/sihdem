"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  order: number;
  title: string;
  description: string;
}

interface University {
  name: string;
  courses: string[];
}

interface CareerPathCardProps {
  title: string;
  description: string;
  steps: Step[];
  recommendedExams: string[];
  alternateExams: string[];
  universities: University[];
  competitionLevel: string;
  futureDemand: string;
  companies: string[];
  index: number;
}

const competitionColors: Record<string, string> = {
  Low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Moderate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Very High": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const demandColors: Record<string, string> = {
  Declining: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Stable: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Growing: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "High Growth": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const demandEmoji: Record<string, string> = {
  Declining: "📉",
  Stable: "📊",
  Growing: "📈",
  "High Growth": "🚀",
};

export default function CareerPathCard({
  title,
  description,
  steps,
  recommendedExams,
  alternateExams,
  universities,
  competitionLevel,
  futureDemand,
  companies,
  index,
}: CareerPathCardProps) {
  const [expanded, setExpanded] = useState(index === 0);
  const [activeTab, setActiveTab] = useState<"steps" | "exams" | "universities" | "companies">("steps");

  return (
    <motion.div
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Header */}
      <button
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-muted/50"
        onClick={() => setExpanded(!expanded)}
        id={`career-path-${index}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 font-heading text-lg font-bold text-primary">
            {index + 1}
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold leading-tight">{title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
        </div>

        <div className="ml-4 flex flex-shrink-0 flex-col items-end gap-2">
          <div className="flex gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${competitionColors[competitionLevel] ?? ""}`}>
              ⚔️ {competitionLevel}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${demandColors[futureDemand] ?? ""}`}>
              {demandEmoji[futureDemand]} {futureDemand}
            </span>
          </div>
          <motion.span
            className="text-muted-foreground"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▾
          </motion.span>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="border-t border-border px-6 pb-6">
              {/* Tabs */}
              <div className="mt-4 flex gap-1 rounded-xl bg-muted p-1">
                {(["steps", "exams", "universities", "companies"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-medium capitalize transition-all ${
                      activeTab === tab
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {/* Steps tab */}
                {activeTab === "steps" && (
                  <div className="space-y-3">
                    {steps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {step.order}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{step.title}</p>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Exams tab */}
                {activeTab === "exams" && (
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Primary Exams
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recommendedExams.map((exam) => (
                          <span key={exam} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            📝 {exam}
                          </span>
                        ))}
                      </div>
                    </div>
                    {alternateExams.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Alternate Exams
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {alternateExams.map((exam) => (
                            <span key={exam} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                              {exam}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Universities tab */}
                {activeTab === "universities" && (
                  <div className="space-y-3">
                    {universities.map((uni, i) => (
                      <div key={i} className="rounded-xl border border-border p-3">
                        <p className="text-sm font-semibold">🏛️ {uni.name}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {uni.courses.map((course) => (
                            <span key={course} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Companies tab */}
                {activeTab === "companies" && (
                  <div className="flex flex-wrap gap-2">
                    {companies.map((company) => (
                      <span
                        key={company}
                        className="rounded-xl border border-border bg-muted px-3 py-1.5 text-sm font-medium"
                      >
                        🏢 {company}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
