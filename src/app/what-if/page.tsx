"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sliders,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { whatIfEngine, WhatIfLevers } from "@/services/whatIfEngine";
import { CAREER_DATASET } from "@/services/careerDataset";
import { CareerMatch } from "@/services/types";
import { storageService } from "@/services/storageService";

export default function WhatIfPage() {
  const [levers, setLevers] = useState<WhatIfLevers>({
    academicEffort: 10,
    programmingSkill: 75,
    mathematicsSkill: 70,
    communicationSkill: 65,
    designSkill: 60,
    dailyStudyHours: 5,
  });

  const baseMatches: CareerMatch[] = useMemo(() => {
    const output = storageService.getAnalysisOutput();
    if (output?.matches?.length) return output.matches;

    return CAREER_DATASET.map((c, i) => ({
      careerId: c.id,
      score: Math.max(50, 92 - i * 4),
      interestFit: 85 - i * 2,
      aptitudeFit: 88 - i * 2,
      academicFit: 82 - i * 2,
      workPreferenceFit: 80 - i * 2,
      skillFit: 78 - i * 2,
      reasons: c.reasons,
      strengths: c.strengths,
      challenges: c.challenges,
      skillGaps: c.potentialGaps.slice(0, 2),
      confidence: "HIGH",
    }));
  }, []);

  const results = useMemo(() => {
    return whatIfEngine.simulate(baseMatches, levers);
  }, [baseMatches, levers]);

  const handleReset = () => {
    setLevers({
      academicEffort: 0,
      programmingSkill: 50,
      mathematicsSkill: 50,
      communicationSkill: 50,
      designSkill: 50,
      dailyStudyHours: 4,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 min-w-0">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <Sliders className="h-3.5 w-3.5" />
              <span>Simulation Studio</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              What-If Career Simulator
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Adjust effort and skill sliders to see how projected career compatibility updates in real time.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 self-start md:self-auto rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:bg-accent transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Levers</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sliders Studio */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-5">
              <div className="border-b border-border/60 pb-3">
                <h3 className="font-heading text-sm font-bold text-foreground">Effort & Subject Levers</h3>
                <p className="text-[11px] text-muted-foreground">Simulate targeted effort investment</p>
              </div>

              {/* Academic Effort */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Academic Focus Intensity</span>
                  <span className="text-primary">{levers.academicEffort > 0 ? `+${levers.academicEffort}%` : `${levers.academicEffort}%`}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={levers.academicEffort}
                  onChange={(e) => setLevers((prev) => ({ ...prev, academicEffort: Number(e.target.value) }))}
                  aria-label="Academic Focus Intensity"
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Programming */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Computer & Coding Aptitude</span>
                  <span className="text-primary">{levers.programmingSkill}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={levers.programmingSkill}
                  onChange={(e) => setLevers((prev) => ({ ...prev, programmingSkill: Number(e.target.value) }))}
                  aria-label="Computer & Coding Aptitude"
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Math */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Mathematics & Analytical Logic</span>
                  <span className="text-primary">{levers.mathematicsSkill}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={levers.mathematicsSkill}
                  onChange={(e) => setLevers((prev) => ({ ...prev, mathematicsSkill: Number(e.target.value) }))}
                  aria-label="Mathematics & Analytical Logic"
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Design */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Design & Visual Thinking</span>
                  <span className="text-primary">{levers.designSkill}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={levers.designSkill}
                  onChange={(e) => setLevers((prev) => ({ ...prev, designSkill: Number(e.target.value) }))}
                  aria-label="Design & Visual Thinking"
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Communication */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Communication & Leadership</span>
                  <span className="text-primary">{levers.communicationSkill}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={levers.communicationSkill}
                  onChange={(e) => setLevers((prev) => ({ ...prev, communicationSkill: Number(e.target.value) }))}
                  aria-label="Communication & Leadership"
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Daily Study Hours */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Daily Focused Study / Practice Hours</span>
                  <span className="text-primary">{levers.dailyStudyHours} hrs/day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={levers.dailyStudyHours}
                  onChange={(e) => setLevers((prev) => ({ ...prev, dailyStudyHours: Number(e.target.value) }))}
                  aria-label="Daily Focused Study or Practice Hours"
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Projection */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Simulated Career Re-rankings
              </span>
              <span className="text-xs font-bold text-primary">Live Projection</span>
            </div>

            {results.map((item) => {
              const career = CAREER_DATASET.find((c) => c.id === item.careerId) || CAREER_DATASET[0];

              return (
                <div
                  key={item.careerId}
                  className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-lg">
                      {career.emoji}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading text-sm font-bold text-foreground">{career.title}</h4>
                        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                          Rank #{item.simulatedRank}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Base: {item.originalScore}% → <strong className="text-foreground">Simulated: {item.simulatedScore}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.diff !== 0 && (
                      <div
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          item.diff > 0
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {item.diff > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{item.diff > 0 ? `+${item.diff}%` : `${item.diff}%`}</span>
                      </div>
                    )}

                    <Link
                      href={`/careers/${career.id}`}
                      className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20 transition"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
