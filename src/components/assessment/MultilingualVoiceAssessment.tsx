"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  VolumeX,
  Languages,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  Square,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { getTranslatedQuestion, TestLang } from "@/services/testTranslations";
import { speechService } from "@/services/speechService";
import { DimensionScores, AssessmentResult } from "@/services/types";
import { careerEngine } from "@/services/careerEngine";
import { storageService } from "@/services/storageService";

interface OptionScoreMap {
  [optId: string]: {
    interest?: Record<string, number>;
    aptitude?: Record<string, number>;
    academics?: Record<string, number>;
    workPref?: Record<string, number>;
  };
}

const OPTION_SCORES: Record<number, OptionScoreMap> = {
  1: {
    "q1-a": { interest: { Technology: 10, Coding: 10 }, workPref: { "Working with computers": 10 } },
    "q1-b": { interest: { Design: 10, Creativity: 9 }, workPref: { "Creating things": 10 } },
    "q1-c": { aptitude: { "Logical Reasoning": 10, "Problem Solving": 10 } },
    "q1-d": { interest: { Business: 10 }, workPref: { Entrepreneurship: 10 } },
    "q1-e": { interest: { Media: 10, Creativity: 10 }, workPref: { "Independent work": 8 } },
    "q1-f": { interest: { Science: 10 }, aptitude: { "Research / Analysis": 9 } },
  },
  2: {
    "q2-a": { academics: { Mathematics: 10 }, aptitude: { "Numerical Ability": 9 } },
    "q2-b": { academics: { Creativity: 10 }, aptitude: { "Spatial Thinking": 10 } },
    "q2-c": { academics: { "Computer / Technology": 10 }, workPref: { "Working with computers": 10 } },
    "q2-d": { academics: { Communication: 10 }, aptitude: { "Verbal Ability": 9 } },
    "q2-e": { academics: { "Business Understanding": 10 }, workPref: { "Leading teams": 9 } },
  },
  3: {
    "q3-a": { aptitude: { "Logical Reasoning": 10, "Problem Solving": 10 } },
    "q3-b": { interest: { Design: 10 }, aptitude: { "Spatial Thinking": 8 } },
    "q3-c": { interest: { Business: 10 }, aptitude: { "Numerical Ability": 8 } },
    "q3-d": { academics: { Communication: 10 }, workPref: { "Helping people": 10 } },
    "q3-e": { aptitude: { "Mechanical Aptitude": 10 }, workPref: { "Hands-on work": 9 } },
  },
  4: {
    "q4-a": { interest: { Technology: 10 }, workPref: { "Independent work": 9 } },
    "q4-b": { interest: { Design: 10 }, workPref: { "Creating things": 10 } },
    "q4-c": { interest: { Business: 10 }, workPref: { "Leading teams": 10 } },
    "q4-d": { interest: { Science: 10 }, workPref: { "Helping people": 9 } },
    "q4-e": { aptitude: { "Mechanical Aptitude": 10 }, workPref: { "Hands-on work": 10 } },
  },
  5: {
    "q5-a": { aptitude: { "Logical Reasoning": 10, "Problem Solving": 10 } },
    "q5-b": { interest: { Design: 10, Media: 10 } },
    "q5-c": { interest: { Business: 10 }, aptitude: { "Numerical Ability": 9 } },
    "q5-d": { interest: { Science: 10 }, aptitude: { "Critical Thinking": 10 } },
    "q5-e": { aptitude: { "Spatial Thinking": 10, "Mechanical Aptitude": 9 } },
  },
  6: {
    "q6-a": { academics: { "Computer / Technology": 10 }, aptitude: { "Logical Reasoning": 8 } },
    "q6-b": { academics: { Creativity: 10 }, interest: { Design: 9 } },
    "q6-c": { academics: { "Business Understanding": 10, Communication: 9 } },
    "q6-d": { academics: { Communication: 10 }, workPref: { "Helping people": 10 } },
    "q6-e": { aptitude: { "Mechanical Aptitude": 10, "Spatial Thinking": 8 } },
  },
  7: {
    "q7-a": { interest: { Technology: 10, Coding: 10 } },
    "q7-b": { interest: { Design: 10, Creativity: 10 } },
    "q7-c": { interest: { Business: 10 }, workPref: { Entrepreneurship: 10 } },
    "q7-d": { interest: { Science: 10 }, workPref: { "Helping people": 10 } },
    "q7-e": { aptitude: { "Mechanical Aptitude": 10 }, interest: { Technology: 8 } },
  },
};

export function MultilingualVoiceAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [lang, setLang] = useState<TestLang>("en");
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({});
  const [isNarrating, setIsNarrating] = useState(false);

  const question = getTranslatedQuestion(currentStep, lang);
  const currentSelected = selectedOptions[currentStep] || [];

  const handleToggleOption = (optId: string) => {
    setSelectedOptions((prev) => {
      const existing = prev[currentStep] || [];
      const updated = existing.includes(optId)
        ? existing.filter((id) => id !== optId)
        : [...existing, optId];
      return { ...prev, [currentStep]: updated };
    });
  };

  const handleToggleNarration = () => {
    if (isNarrating) {
      speechService.stop();
      setIsNarrating(false);
    } else {
      const textToRead = `${question.title}. ${Object.values(question.options).join(". ")}`;
      setIsNarrating(true);
      speechService.speak(textToRead, lang, () => setIsNarrating(false));
    }
  };

  const handleLanguageChange = (newLang: TestLang) => {
    speechService.stop();
    setIsNarrating(false);
    setLang(newLang);
  };

  const handleNext = () => {
    speechService.stop();
    setIsNarrating(false);

    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate final dimension scores
      const finalScores: DimensionScores = {
        interest: {},
        aptitude: {},
        academics: {},
        workPref: {},
      };

      const allSelectedIds: string[] = [];

      Object.entries(selectedOptions).forEach(([stepStr, optIds]) => {
        const stepNum = parseInt(stepStr, 10);
        const scoreTable = OPTION_SCORES[stepNum] || {};

        optIds.forEach((optId) => {
          allSelectedIds.push(optId);
          const scoreDelta = scoreTable[optId];
          if (!scoreDelta) return;

          (["interest", "aptitude", "academics", "workPref"] as const).forEach((dim) => {
            const bucket = scoreDelta[dim];
            if (bucket) {
              Object.entries(bucket).forEach(([trait, val]) => {
                finalScores[dim][trait] = (finalScores[dim][trait] || 0) + val;
              });
            }
          });
        });
      });

      const assessmentResult: AssessmentResult = {
        id: `assessment_${Date.now()}`,
        date: new Date().toISOString(),
        dimensionScores: finalScores,
        confidence: allSelectedIds.length >= 7 ? "HIGH" : "MODERATE",
        selectedOptionIds: allSelectedIds,
      };

      const matches = careerEngine.computeMatches(assessmentResult, null);
      const output = {
        assessment: assessmentResult,
        matches,
        mismatch: careerEngine.detectMismatch(matches),
      };

      storageService.saveAssessmentResult(assessmentResult);
      storageService.saveAnalysisOutput(output);
      storageService.addXP(200);

      router.push("/careers");
    }
  };

  const handleBack = () => {
    speechService.stop();
    setIsNarrating(false);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
      {/* Top Header: Progress & Language Selector & Voice Narration */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-sm">
            {currentStep}/7
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Situational Scenario Discovery
            </div>
            <div className="text-xs text-muted-foreground">Scenario {currentStep} of 7</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* TTS Narration Button */}
          <button
            onClick={handleToggleNarration}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              isNarrating
                ? "border-primary bg-primary text-primary-foreground animate-pulse shadow-md"
                : "border-border bg-background text-foreground hover:bg-accent"
            }`}
            title="Read Question Out Loud (TTS)"
          >
            {isNarrating ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-primary" />}
            <span>{isNarrating ? "Stop Audio" : "Listen"}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center rounded-xl border border-border bg-background p-1 text-xs">
            <Languages className="h-3.5 w-3.5 text-muted-foreground ml-1.5 mr-1" />
            <button
              onClick={() => handleLanguageChange("en")}
              className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
                lang === "en" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange("gu")}
              className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
                lang === "gu" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => handleLanguageChange("hi")}
              className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
                lang === "hi" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500"
          style={{ width: `${(currentStep / 7) * 100}%` }}
        />
      </div>

      {/* Question Title & Subtitle */}
      <div className="mt-6 space-y-1.5">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground leading-snug">
          {question.title}
        </h3>
        <p className="text-xs text-muted-foreground">{question.subtitle}</p>
      </div>

      {/* Options List */}
      <div className="mt-6 space-y-3">
        {Object.entries(question.options).map(([optId, label]) => {
          const isSelected = currentSelected.includes(optId);

          return (
            <button
              key={optId}
              onClick={() => handleToggleOption(optId)}
              className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card/60 hover:border-primary/40 hover:bg-accent/40"
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-background"
                }`}
              >
                {isSelected ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5 text-transparent" />}
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${
            currentStep > 1
              ? "border-border bg-background text-foreground hover:bg-accent"
              : "border-transparent text-muted-foreground/40 cursor-not-allowed"
          }`}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentSelected.length === 0}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold transition-all ${
            currentSelected.length > 0
              ? "bg-primary text-primary-foreground shadow-md hover:scale-[1.02]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          <span>{currentStep === 7 ? "Analyze & Generate Matches" : "Next Scenario"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
