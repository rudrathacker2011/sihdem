"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Award,
  Target,
  Check,
  TrendingUp,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { getCareerById } from "@/services/careerDataset";
import { storageService } from "@/services/storageService";
import { Button } from "@/components/ui/button";

export default function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const career = getCareerById(resolvedParams.id);
  const [isTarget, setIsTarget] = useState(false);
  const [justSet, setJustSet] = useState(false);

  useEffect(() => {
    const currentTarget = storageService.getTargetCareer();
    if (currentTarget?.careerId === career.id) {
      setIsTarget(true);
    }
  }, [career.id]);

  const handleSetTargetCareer = () => {
    storageService.setTargetCareer({
      careerId: career.id,
      title: career.title,
      category: career.category,
      stream: career.category,
      fitScore: 94,
      selectedAt: new Date().toISOString(),
    });
    storageService.addXP(50);
    setIsTarget(true);
    setJustSet(true);
    setTimeout(() => setJustSet(false), 3000);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 space-y-6 min-w-0 pb-40 lg:pb-12">
        {/* Top Breadcrumb & Quick Actions */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/careers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Career Matrix</span>
          </Link>

          {isTarget ? (
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="text-xs font-bold gap-1.5 border-emerald-500/30 text-emerald-500">
                <Check className="h-3.5 w-3.5" />
                <span>Active on Dashboard →</span>
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleSetTargetCareer}
              size="sm"
              className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:scale-[1.02] transition"
            >
              <Target className="h-3.5 w-3.5" />
              <span>{justSet ? "✓ Set as Active Goal!" : "Set as Target Goal"}</span>
            </Button>
          )}
        </div>

        {/* Hero Banner */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 md:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl md:text-5xl">{career.emoji}</span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {career.category}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {career.futureDemand} Growth
                  </span>
                  {isTarget && (
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>Active Dashboard Goal</span>
                    </span>
                  )}
                </div>
                <h1 className="mt-1 font-heading text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  {career.title}
                </h1>
                <p className="mt-1.5 text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {career.fullDescription}
                </p>

                {/* Primary CTA Row */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <Button
                    onClick={handleSetTargetCareer}
                    className={`gap-1.5 text-xs font-bold shadow-md transition ${
                      isTarget
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-primary text-primary-foreground hover:scale-[1.02]"
                    }`}
                  >
                    {isTarget ? <Check className="h-3.5 w-3.5" /> : <Target className="h-3.5 w-3.5" />}
                    <span>{isTarget ? "✓ Current Active Goal on Dashboard" : "🎯 Select as My Target Career"}</span>
                  </Button>
                  <Link href="/roadmap">
                    <Button variant="outline" className="text-xs font-bold gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>GPS Roadmap</span>
                    </Button>
                  </Link>
                  <Link href="/career-battle">
                    <Button variant="outline" className="text-xs font-bold gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      <span>Compare in Battle</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Salary Breakdown Widget */}
            <div className="rounded-xl border border-border bg-accent/40 p-4 space-y-3 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Expected Salary Range</span>
                <div className="font-heading text-lg font-bold text-foreground">{career.averageSalary}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-2 text-[10px]">
                <div>
                  <span className="text-muted-foreground">Entry Level:</span>
                  <div className="font-bold text-foreground">{career.salaryRange.entry}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Mid Career:</span>
                  <div className="font-bold text-foreground">{career.salaryRange.mid}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Senior:</span>
                  <div className="font-bold text-foreground">{career.salaryRange.senior}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <h3 className="font-heading text-sm font-bold">Why This Fits You</h3>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {career.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-heading text-sm font-bold">Natural Strengths</h3>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {career.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-primary font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="font-heading text-sm font-bold">Watchouts & Friction</h3>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {career.challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Degrees & Entrance Exams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-heading text-sm font-bold text-foreground">Required Degrees & Qualifications</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {career.requiredDegrees.map((deg) => (
                <span key={deg} className="rounded-lg border border-border bg-accent/40 px-3 py-1.5 text-xs font-semibold text-foreground">
                  {deg}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <h3 className="font-heading text-sm font-bold text-foreground">Key Entrance Examinations</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {career.recommendedExams.map((exam) => (
                <span key={exam} className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                  {exam}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5-Year Roadmap */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-base font-bold text-foreground">5-Year Execution Roadmap</h3>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Class 9 to Career Launch</span>
          </div>

          <div className="space-y-3">
            {career.milestones.map((m, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border/60 bg-accent/20 p-3.5">
                <div className="sm:w-32 shrink-0">
                  <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {m.grade}
                  </span>
                  <div className="text-xs font-bold text-foreground mt-1">{m.focus}</div>
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {m.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
