"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Dna, ArrowRight, CheckCircle2, Compass } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { CareerDNACard } from "@/components/career/CareerDNACard";
import { storageService } from "@/services/storageService";
import { careerEngine } from "@/services/careerEngine";

export default function CareerDNAPage() {
  const [dna, setDna] = useState<Record<string, number>>({
    "Algorithmic Logic": 88,
    "Technical Mastery": 91,
    "Spatial Reasoning": 76,
    "Creativity & Design": 72,
    "Product Empathy": 80,
    "Business Orientation": 70,
    "Stress Resilience": 84,
    "Communication": 75,
  });
  const [archetype, setArchetype] = useState<string>("The Analytical Architect");

  useEffect(() => {
    const output = storageService.getAnalysisOutput();
    if (output?.assessment) {
      const computedDna = careerEngine.buildDnaFromAssessment(output.assessment);
      setDna(computedDna);
      setArchetype(careerEngine.getPersonalityArchetype(computedDna));
    } else {
      const stored = storageService.getAssessmentResult();
      if (stored) {
        const computedDna = careerEngine.buildDnaFromAssessment(stored);
        setDna(computedDna);
        setArchetype(careerEngine.getPersonalityArchetype(computedDna));
      }
    }
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 min-w-0">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <Dna className="h-3.5 w-3.5" />
              <span>Cognitive Psychometric Vector</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Your Career DNA Profile
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Deep cognitive mapping synthesized from your discovery assessment choices.
            </p>
          </div>

          <Link
            href="/what-if"
            className="flex items-center gap-1.5 self-start md:self-auto rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
          >
            <span>Simulate in What-If</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* DNA Card */}
        <CareerDNACard dna={dna} archetype={archetype} />

        {/* Strengths & Growth Vectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-3">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="font-heading text-base font-bold">Natural Cognitive Strengths</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your profile demonstrates high natural aptitude in systematic logic, procedural decomposition, and technical curiosity. You excel when given complex, structured challenges with clear feedback loops.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 text-primary mb-3">
              <Compass className="h-5 w-5" />
              <h3 className="font-heading text-base font-bold">High-Growth Development Areas</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Expanding your cross-functional communication and public presentation skills will turn your technical fundamentals into leadership capability. Explore our interactive simulations to practice workplace communications.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
