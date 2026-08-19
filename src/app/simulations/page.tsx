"use client";

import React from "react";
import Link from "next/link";
import { Gamepad2, Trophy } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SimulationRunner } from "@/components/simulation/SimulationRunner";

export default function SimulationsPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 space-y-6 min-w-0 pb-36 lg:pb-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <Gamepad2 className="h-3.5 w-3.5" />
              <span>Career Simulations</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Day-in-the-Life Mini-Simulations
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Experience real-world workplace scenarios before choosing your career path and entrance exams.
            </p>
          </div>

          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 self-start md:self-auto rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>View Leaderboard</span>
          </Link>
        </div>

        {/* Simulation Runner */}
        <SimulationRunner />
      </main>
    </div>
  );
}
