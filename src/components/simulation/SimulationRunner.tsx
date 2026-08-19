"use client";

import React, { useState } from "react";
import { Gamepad2, CheckCircle2, ArrowRight, Award, Sparkles, RefreshCw, Zap } from "lucide-react";
import { SimulationScenario } from "@/services/types";
import { SIMULATION_SCENARIOS } from "@/services/simulationService";
import { storageService } from "@/services/storageService";

export function SimulationRunner() {
  const [activeSimIndex, setActiveSimIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const scenario = SIMULATION_SCENARIOS[activeSimIndex];
  const step = scenario.steps[currentStepIndex];
  const selectedOption = step?.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newScore = score + selectedOption.points;
    setScore(newScore);

    if (currentStepIndex + 1 < scenario.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      setIsCompleted(true);
      const earned = scenario.xpReward + Math.round(newScore / 2);
      setXpEarned(earned);
      storageService.addXP(earned);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setSelectedOptionId(null);
    setScore(0);
    setIsCompleted(false);
    setXpEarned(0);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-xl">
            {scenario.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                {scenario.role}
              </span>
              <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                {scenario.difficulty}
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">{scenario.title}</h3>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex gap-2">
          {SIMULATION_SCENARIOS.map((sim, idx) => (
            <button
              key={sim.id}
              onClick={() => {
                setActiveSimIndex(idx);
                handleReset();
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeSimIndex === idx
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {sim.emoji} Sim {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {!isCompleted ? (
        <div className="mt-5 space-y-5">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Decision {currentStepIndex + 1} of {scenario.steps.length}
            </span>
            <span className="font-bold text-primary">Score: {score} pts</span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / scenario.steps.length) * 100}%` }}
            />
          </div>

          {/* Scenario Situation */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary">The Situation:</div>
            <p className="mt-1 text-sm font-medium text-foreground leading-relaxed">{step.situation}</p>
          </div>

          {/* Question & Options */}
          <div>
            <h4 className="text-sm font-bold text-foreground">{step.question}</h4>
            <div className="mt-3 space-y-2.5">
              {step.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-xs transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-card/60 hover:border-primary/40 hover:bg-accent/40"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-foreground leading-relaxed">{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Option Feedback preview if selected */}
          {selectedOption && (
            <div className="rounded-xl border border-border bg-accent/30 p-3 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">Immediate Tactical Outcome: </span>
              {selectedOption.feedback}
            </div>
          )}

          {/* Continue Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              disabled={!selectedOptionId}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                selectedOptionId
                  ? "bg-primary text-primary-foreground shadow-md hover:scale-[1.02]"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <span>{currentStepIndex + 1 === scenario.steps.length ? "Complete Simulation" : "Next Decision"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Completion State */
        <div className="mt-6 text-center space-y-4 py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500">
            <Award className="h-8 w-8" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Simulation Completed
            </span>
            <h4 className="mt-1 font-heading text-xl font-bold text-foreground">
              Outstanding Critical Triage!
            </h4>
            <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              You navigated real workplace trade-offs as a {scenario.role} with a total score of{" "}
              <strong className="text-foreground">{score} points</strong>.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-black text-primary">
            <Zap className="h-4 w-4 fill-primary" />
            <span>+{xpEarned} XP Credited to your Profile!</span>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-accent transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Simulation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
