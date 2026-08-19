"use client";

import React, { useState } from "react";
import { Swords, ArrowRight, Zap, CheckCircle2, AlertTriangle, TrendingUp, DollarSign, Shield } from "lucide-react";
import { CareerInfo } from "@/services/types";
import { CAREER_DATASET } from "@/services/careerDataset";

export function CareerBattleCard() {
  const [careerAId, setCareerAId] = useState<string>("software-engineer");
  const [careerBId, setCareerBId] = useState<string>("data-scientist");

  const careerA = CAREER_DATASET.find((c) => c.id === careerAId) || CAREER_DATASET[0];
  const careerB = CAREER_DATASET.find((c) => c.id === careerBId) || CAREER_DATASET[1];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-lg font-bold text-foreground">1v1 Compare & Battle</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluate two career destinations side-by-side on metrics, compensations, and trade-offs.
          </p>
        </div>

        {/* Career Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={careerAId}
            onChange={(e) => setCareerAId(e.target.value)}
            aria-label="Select Candidate Career A"
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
          >
            {CAREER_DATASET.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.title}
              </option>
            ))}
          </select>

          <span className="text-xs font-black text-primary px-1">VS</span>

          <select
            value={careerBId}
            onChange={(e) => setCareerBId(e.target.value)}
            aria-label="Select Candidate Career B"
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
          >
            {CAREER_DATASET.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Career A Column */}
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{careerA.emoji}</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Candidate A</span>
                <h4 className="font-heading text-base font-bold text-foreground">{careerA.title}</h4>
              </div>
            </div>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-1 text-xs font-black text-cyan-700 dark:text-cyan-300">
              {careerA.futureDemand} Growth
            </span>
          </div>

          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{careerA.shortDescription}</p>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl bg-background/60 p-2.5 text-xs">
              <span className="text-muted-foreground">Salary Benchmark:</span>
              <span className="font-bold text-foreground">{careerA.averageSalary}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-background/60 p-2.5 text-xs">
              <span className="text-muted-foreground">Stress & Pressure:</span>
              <span className="font-bold text-foreground">{careerA.stressLevel}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-background/60 p-2.5 text-xs">
              <span className="text-muted-foreground">Work-Life Balance:</span>
              <span className="font-bold text-foreground">{careerA.workLifeBalance}</span>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-[11px] font-bold text-foreground">Top Required Exams:</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {careerA.recommendedExams.map((exam) => (
                <span key={exam} className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-foreground">
                  {exam}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Career B Column */}
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{careerB.emoji}</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">Candidate B</span>
                <h4 className="font-heading text-base font-bold text-foreground">{careerB.title}</h4>
              </div>
            </div>
            <span className="rounded-full bg-purple-500/20 px-2.5 py-1 text-xs font-black text-purple-700 dark:text-purple-300">
              {careerB.futureDemand} Growth
            </span>
          </div>

          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{careerB.shortDescription}</p>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl bg-background/60 p-2.5 text-xs">
              <span className="text-muted-foreground">Salary Benchmark:</span>
              <span className="font-bold text-foreground">{careerB.averageSalary}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-background/60 p-2.5 text-xs">
              <span className="text-muted-foreground">Stress & Pressure:</span>
              <span className="font-bold text-foreground">{careerB.stressLevel}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-background/60 p-2.5 text-xs">
              <span className="text-muted-foreground">Work-Life Balance:</span>
              <span className="font-bold text-foreground">{careerB.workLifeBalance}</span>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-[11px] font-bold text-foreground">Top Required Exams:</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {careerB.recommendedExams.map((exam) => (
                <span key={exam} className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-foreground">
                  {exam}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hybrid Recommendation Bridge */}
      <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary shrink-0">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-foreground">AI Hybrid Role Insight</h5>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
              Torn between both paths? In today's tech ecosystem, skills are complementary. Combining engineering logic with analytical modeling unlocks hybrid roles like <strong className="text-primary">MLOps Architect</strong> or <strong className="text-primary">Technical Product Lead</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
