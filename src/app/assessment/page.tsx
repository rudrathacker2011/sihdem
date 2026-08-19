import AssessmentStepper from "@/components/assessment/AssessmentStepper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assessment — AI Career Counsellor",
  description: "Complete your personalized AI career assessment tailored for Indian students.",
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
            🧠
          </div>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">AI Career Assessment</h1>
          <p className="mt-3 text-muted-foreground">
            Answer a few questions and our AI will generate a personalized career roadmap
            tailored to the Indian education and job market.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
            <span>✅ Takes ~3 minutes</span>
            <span>✅ Powered by Gemini AI</span>
            <span>✅ India-specific guidance</span>
          </div>
        </div>

        {/* Stepper */}
        <AssessmentStepper />
      </div>
    </div>
  );
}
