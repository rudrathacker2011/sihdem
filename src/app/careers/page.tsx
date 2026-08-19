"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Swords,
  Sliders,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { CAREER_DATASET, ALL_CAREER_FAMILIES, CareerFamily } from "@/services/careerDataset";
import { storageService } from "@/services/storageService";
import { careerEngine } from "@/services/careerEngine";
import { CareerMatch, AssessmentConfidence } from "@/services/types";

export default function CareersPage() {
  const [selectedFamily, setSelectedFamily] = useState<CareerFamily>("ALL");
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [mismatch, setMismatch] = useState<{ hasMismatch: boolean; reason?: string } | null>(null);

  useEffect(() => {
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

  const filteredCareers = useMemo(() => {
    return CAREER_DATASET.filter((c) => selectedFamily === "ALL" || c.family === selectedFamily).map((career) => {
      const match = matches.find((m) => m.careerId === career.id) || {
        score: 75,
        interestFit: 78,
        aptitudeFit: 74,
        academicFit: 72,
        workPreferenceFit: 70,
        skillFit: 73,
      };
      return { ...career, match };
    }).sort((a, b) => b.match.score - a.match.score);
  }, [selectedFamily, matches]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 space-y-6 min-w-0 pb-36 lg:pb-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Career Explorer</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Career Compatibility Matrix
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Explore career tracks across India's top industries, evaluated on interest, aptitude, and academic demand.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/career-battle"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:bg-accent transition"
            >
              <Swords className="h-3.5 w-3.5 text-primary" />
              <span>Compare 1v1</span>
            </Link>
            <Link
              href="/what-if"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
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
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition hover:border-primary/50"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{career.emoji}</span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {career.category}
                      </span>
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

                {/* Fit Bars — modern gradient version */}
                <div className="mt-4 space-y-2.5 rounded-xl border border-border/50 bg-background/40 p-3.5">
                  {/* Interest Fit */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Interest</span>
                      <span className="font-heading text-xs font-black text-foreground">{career.match.interestFit}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${career.match.interestFit}%`,
                          background: 'linear-gradient(90deg, oklch(0.55 0.22 264), oklch(0.68 0.18 280))',
                          boxShadow: '0 0 8px oklch(0.58 0.22 264 / 0.5)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Aptitude Fit */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Aptitude</span>
                      <span className="font-heading text-xs font-black text-foreground">{career.match.aptitudeFit}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${career.match.aptitudeFit}%`,
                          background: 'linear-gradient(90deg, oklch(0.55 0.22 295), oklch(0.68 0.18 320))',
                          boxShadow: '0 0 8px oklch(0.55 0.22 295 / 0.5)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Academic Fit — extra dimension */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Academic</span>
                      <span className="font-heading text-xs font-black text-foreground">{career.match.academicFit ?? Math.round((career.match.interestFit + career.match.aptitudeFit) / 2)}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${career.match.academicFit ?? Math.round((career.match.interestFit + career.match.aptitudeFit) / 2)}%`,
                          background: 'linear-gradient(90deg, oklch(0.55 0.2 160), oklch(0.68 0.18 180))',
                          boxShadow: '0 0 8px oklch(0.55 0.2 160 / 0.5)',
                        }}
                      />
                    </div>
                  </div>
                </div>


                <div className="mt-3.5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Avg. Salary:</span>
                  <span className="text-foreground">{career.averageSalary}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-border/60 pt-3.5">
                <Link
                  href={`/careers/${career.id}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition"
                >
                  <span>View Full Career Plan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
