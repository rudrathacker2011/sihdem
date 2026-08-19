"use client";

import React from "react";
import { Brain, Cpu, Compass, Zap, Shield, Sparkles, TrendingUp, Users } from "lucide-react";

interface CareerDNACardProps {
  dna: Record<string, number>;
  archetype?: string;
}

const TRAIT_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  "Algorithmic Logic": { icon: Brain, color: "text-cyan-500", bg: "bg-cyan-500" },
  "Technical Mastery": { icon: Cpu, color: "text-blue-500", bg: "bg-blue-500" },
  "Spatial Reasoning": { icon: Compass, color: "text-indigo-500", bg: "bg-indigo-500" },
  "Creativity & Design": { icon: Zap, color: "text-purple-500", bg: "bg-purple-500" },
  "Product Empathy": { icon: Users, color: "text-emerald-500", bg: "bg-emerald-500" },
  "Business Orientation": { icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500" },
  "Stress Resilience": { icon: Shield, color: "text-rose-500", bg: "bg-rose-500" },
  "Communication": { icon: Sparkles, color: "text-teal-500", bg: "bg-teal-500" },
};

export function CareerDNACard({ dna, archetype }: CareerDNACardProps) {
  const entries = Object.entries(dna);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-lg font-bold text-foreground">Psychometric Career DNA</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            8-dimensional cognitive and behavioral vectors synthesized from your test responses.
          </p>
        </div>

        {archetype && (
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <span>Archetype:</span>
            <span className="font-black text-foreground">{archetype}</span>
          </div>
        )}
      </div>

      {/* Trait Bars Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map(([trait, score]) => {
          const config = TRAIT_CONFIG[trait] || { icon: Brain, color: "text-primary", bg: "bg-primary" };
          const Icon = config.icon;

          return (
            <div key={trait} className="rounded-xl border border-border/60 bg-accent/30 p-3.5 transition hover:border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-background ${config.color} shadow-xs`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{trait}</span>
                </div>
                <span className="font-mono text-xs font-bold text-foreground">{score}%</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${config.bg}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
