"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Swords,
  Sliders,
  Target,
  Check,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { CAREER_DATASET, ALL_CAREER_FAMILIES, CareerFamily } from "@/services/careerDataset";
import { CareerInfo } from "@/services/types";
import { storageService } from "@/services/storageService";
import { careerEngine } from "@/services/careerEngine";
import { CareerMatch, AssessmentConfidence } from "@/services/types";

export default function CareersPage() {
  const [selectedFamily, setSelectedFamily] = useState<CareerFamily>("ALL");
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [mismatch, setMismatch] = useState<{ hasMismatch: boolean; reason?: string } | null>(null);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);

  const refreshTarget = () => {
    const target = storageService.getTargetCareer();
    if (target) setActiveTargetId(target.careerId);
  };

  useEffect(() => {
    refreshTarget();
    const output = storageService.getAnalysisOutput();
    if (output) {
      setMatches(output.matches);
      setMismatch(output.mismatch);
    } else {
      const assessment = storageService.getAssessmentResult();
      if (assessment) {
        const computed = careerEngine.computeMatches(assessment, null);
        setMatches(computed);
        setMismatch(careerEngine.detectMismatch(computed));
      } else {
        const defaultMatches: CareerMatch[] = CAREER_DATASET.map((c, i) => ({
          careerId: c.id,
          score: Math.max(55, 94 - i * 4),
          interestFit: 88 - i * 3,
          aptitudeFit: 90 - i * 3,
          academicFit: 86 - i * 3,
          workPreferenceFit: 82 - i * 2,
          skillFit: 85 - i * 3,
          reasons: c.reasons,
          strengths: c.strengths,
          challenges: c.challenges,
          skillGaps: c.potentialGaps.slice(0, 2),
          confidence: "HIGH",
        }));
        setMatches(defaultMatches);
      }
    }
  }, []);

  const handleSetTarget = (career: CareerInfo, score: number) => {
    storageService.setTargetCareer({
      careerId: career.id,
      title: career.title,
      category: career.category,
      stream: career.category,
      fitScore: score,
      selectedAt: new Date().toISOString(),
    });
    storageService.addXP(50);
    setActiveTargetId(career.id);
  };

  const filteredCareers = useMemo(() => {
    return CAREER_DATASET.filter((c) => selectedFamily === "ALL" || c.family === selectedFamily).map((career) => {
      const match = matches.find((m) => m.careerId === career.id) || {
        score: 75,
        interestFit: 78,
        aptitudeFit: 74,
        academicFit: 72,
        workPreferenceFit: 75,
        skillFit: 76,
        reasons: career.reasons,
        strengths: career.strengths,
        challenges: career.challenges,
        skillGaps: career.potentialGaps.slice(0, 2),
        confidence: "HIGH" as AssessmentConfidence,
      };

      return {
        ...career,
        match,
      };
    });
  }, [selectedFamily, matches]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 space-y-6 min-w-0 pb-40 lg:pb-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Personalized Compatibility Matrix</span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Career Alignment Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Select any target track to set your active dashboard goal and personalized preparation roadmap.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/career-battle"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-accent transition"
            >
              <Swords className="h-3.5 w-3.5 text-primary" />
              <span>Compare 1v1</span>
            </Link>
            <Link
              href="/what-if"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>What-If Studio</span>
            </Link>
          </div>
        </div>

        {/* Mismatch Alert if detected */}
        {mismatch?.hasMismatch && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-foreground">Career Alignment Notification</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{mismatch.reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Family Filters */}
        <div className="flex flex-wrap gap-2">
          {ALL_CAREER_FAMILIES.map((family) => (
            <button
              key={family.id}
              onClick={() => setSelectedFamily(family.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold transition ${
                selectedFamily === family.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span>{family.icon}</span>
              <span>{family.label}</span>
            </button>
          ))}
        </div>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCareers.map((career) => {
            const isTarget = activeTargetId === career.id;

            return (
              <div
                key={career.id}
                className={`group flex flex-col justify-between rounded-2xl border bg-card p-4 sm:p-5 shadow-xs transition ${
                  isTarget
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "border-border/80 hover:border-primary/50"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{career.emoji}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {career.category}
                          </span>
                          {isTarget && (
                            <span className="rounded-full bg-primary/15 px-2 py-0.2 text-[9px] font-bold text-primary">
                              Active Goal
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition">
                          {career.title}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-heading text-lg font-black text-primary">
                        {career.match.score}%
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground">Alignment</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {career.shortDescription}
                  </p>

                  {/* Fit Bars */}
                  <div className="mt-4 space-y-2.5 rounded-xl border border-border/50 bg-background/40 p-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Interest</span>
                        <span className="font-heading text-xs font-black text-foreground">{career.match.interestFit}%</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60">
                        <div
                          className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-primary to-indigo-500"
                          style={{ width: `${career.match.interestFit}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Aptitude</span>
                        <span className="font-heading text-xs font-black text-foreground">{career.match.aptitudeFit}%</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60">
                        <div
                          className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          style={{ width: `${career.match.aptitudeFit}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Avg. Salary:</span>
                    <span className="text-foreground">{career.averageSalary}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3">
                  <button
                    onClick={() => handleSetTarget(career, career.match.score)}
                    className={`flex-1 flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition ${
                      isTarget
                        ? "bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                    }`}
                  >
                    {isTarget ? <Check className="h-3.5 w-3.5" /> : <Target className="h-3.5 w-3.5" />}
                    <span>{isTarget ? "Active Target Goal" : "Set as Target"}</span>
                  </button>

                  <Link
                    href={`/careers/${career.id}`}
                    className="rounded-xl border border-border bg-accent/40 px-3 py-2 text-xs font-bold text-foreground hover:bg-accent transition"
                    title="View Full Roadmap"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
