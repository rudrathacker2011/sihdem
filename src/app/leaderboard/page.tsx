"use client";

import React, { useState } from "react";
import { Trophy, Flame, Zap, Award, Star } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MOCK_LEADERBOARD, INITIAL_BADGES } from "@/services/simulationService";
import { storageService } from "@/services/storageService";

export default function LeaderboardPage() {
  const [xp] = useState<number>(() => storageService.getXP());

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 min-w-0">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <Trophy className="h-3.5 w-3.5" />
              <span>Milestones & XP</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Leaderboard & Achievements
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Earn XP by completing discovery tests, exploring simulations, and marking roadmap milestones.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 self-start md:self-auto">
            <Flame className="h-4.5 w-4.5 text-primary fill-primary/30" />
            <div>
              <div className="text-[10px] font-semibold text-muted-foreground">Your Balance</div>
              <div className="font-heading text-sm font-bold text-primary">{xp} XP</div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-primary" />
              <h3 className="font-heading text-sm font-bold text-foreground">Unlocked Achievements</h3>
            </div>
            <span className="text-xs text-muted-foreground">3 / 5 Unlocked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {INITIAL_BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                  badge.unlocked
                    ? "border-primary/30 bg-primary/5 shadow-xs"
                    : "border-border/60 bg-accent/20 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="text-xs font-bold text-foreground">{badge.title}</h4>
                <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed">
                  {badge.description}
                </p>
                {badge.unlocked && (
                  <span className="mt-2 rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-black text-primary">
                    Unlocked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Student Ranks */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-4.5 w-4.5 text-primary" />
              <h3 className="font-heading text-sm font-bold text-foreground">Top Explorer Cohort</h3>
            </div>
            <span className="text-xs text-muted-foreground">Updated hourly</span>
          </div>

          <div className="space-y-2.5">
            {MOCK_LEADERBOARD.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                  entry.isCurrentUser
                    ? "border-primary bg-primary/10 shadow-xs"
                    : "border-border/80 bg-card hover:bg-accent/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg font-heading text-xs font-bold ${
                      entry.rank === 1
                        ? "bg-amber-500 text-white"
                        : entry.rank === 2
                        ? "bg-slate-300 text-slate-900"
                        : entry.rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-accent text-muted-foreground"
                    }`}
                  >
                    #{entry.rank}
                  </div>

                  <div className="text-2xl">{entry.avatar}</div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-foreground">{entry.name}</span>
                      {entry.isCurrentUser && (
                        <span className="rounded-full bg-primary px-1.5 py-0.2 text-[9px] font-bold text-primary-foreground">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {entry.grade} • Target: <strong className="text-foreground">{entry.topCareer}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-heading text-xs sm:text-sm font-bold text-primary">
                  <Zap className="h-3.5 w-3.5 fill-primary" />
                  <span>{entry.isCurrentUser ? xp : entry.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
