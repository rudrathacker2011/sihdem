"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MultilingualVoiceAssessment } from "@/components/assessment/MultilingualVoiceAssessment";
import AssessmentStepper from "@/components/assessment/AssessmentStepper";
import { Compass, Languages, Bot } from "lucide-react";

export default function AssessmentPage() {
  const [assessmentMode, setAssessmentMode] = useState<"scenario" | "stepper">("scenario");

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 space-y-6 min-w-0 pb-40 lg:pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <Compass className="h-3.5 w-3.5" />
              <span>Discovery Assessment</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Career Alignment Assessment
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Parent and student-friendly scenarios exploring natural interests, aptitude, and practical study paths.
            </p>
          </div>

          {/* Assessment Mode Switcher */}
          <div className="flex items-center rounded-xl border border-border bg-background p-1 self-start sm:self-auto">
            <button
              onClick={() => setAssessmentMode("scenario")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                assessmentMode === "scenario"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Languages className="h-3.5 w-3.5" />
              <span>Situational (EN/GU/HI)</span>
            </button>

            <button
              onClick={() => setAssessmentMode("stepper")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                assessmentMode === "stepper"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>AI Stepper</span>
            </button>
          </div>
        </div>

        {/* Assessment Body */}
        <div className="max-w-3xl mx-auto">
          {assessmentMode === "scenario" ? (
            <MultilingualVoiceAssessment />
          ) : (
            <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-xs">
              <AssessmentStepper />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
