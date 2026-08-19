"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AssessmentInputSchema, type AssessmentInput } from "@/lib/ai/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

const EDUCATION_OPTIONS = [
  "10th (SSC/ICSE/CBSE)",
  "12th - Science (PCM)",
  "12th - Science (PCB)",
  "12th - Commerce",
  "12th - Arts/Humanities",
  "Diploma",
  "Undergraduate (B.Tech/B.E.)",
  "Undergraduate (B.Sc/BCA)",
  "Undergraduate (B.Com/BBA)",
  "Undergraduate (BA)",
  "Graduate (M.Tech/M.E.)",
  "Other",
];

const STREAM_OPTIONS = [
  "Science - Physics, Chemistry, Maths (PCM)",
  "Science - Physics, Chemistry, Biology (PCB)",
  "Commerce with Maths",
  "Commerce without Maths",
  "Arts/Humanities",
  "Vocational/Technical",
];

const SKILLS_OPTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "Programming/Coding", "Web Development", "Data Analysis",
  "Drawing/Design", "Writing/Communication", "Public Speaking",
  "Problem Solving", "Research", "Leadership", "Teamwork",
  "Music", "Photography", "Business/Entrepreneurship",
];

const INTERESTS_OPTIONS = [
  "Technology & Computers", "Medicine & Healthcare", "Engineering",
  "Science & Research", "Business & Finance", "Law & Justice",
  "Arts & Design", "Teaching & Education", "Government & Civil Services",
  "Defence & Armed Forces", "Sports & Fitness", "Media & Entertainment",
  "Social Work & NGOs", "Environment & Nature", "Architecture",
];

const PERSONALITY_OPTIONS = [
  "Analytical - I love solving complex problems",
  "Creative - I enjoy art, design, and imagination",
  "Social - I love working with and helping people",
  "Practical - I prefer hands-on, real-world work",
  "Enterprising - I love leading and business",
  "Conventional - I prefer structure and organization",
];

const STEPS = [
  { title: "Education", description: "Tell us about your current education level" },
  { title: "Stream", description: "What stream are you studying?" },
  { title: "Skills", description: "What are your strengths?" },
  { title: "Interests", description: "What do you enjoy?" },
  { title: "Personality", description: "How would you describe yourself?" },
  { title: "Goals", description: "What are your career aspirations?" },
];

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}

function MultiSelect({ options, selected, onChange }: MultiSelectProps) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-all duration-150 ${
              active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function AssessmentStepper() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<AssessmentInput>({
    resolver: zodResolver(AssessmentInputSchema),
    defaultValues: {
      education: "",
      stream: "",
      skills: [],
      interests: [],
      personality: "",
      goals: "",
    },
    mode: "onChange",
  });

  const { watch, setValue, getValues, formState: { errors } } = form;
  const values = watch();

  const canProceed = () => {
    if (step === 0) return !!values.education;
    if (step === 1) return !!values.stream;
    if (step === 2) return values.skills.length > 0;
    if (step === 3) return values.interests.length > 0;
    if (step === 4) return !!values.personality;
    if (step === 5) return (values.goals?.length ?? 0) >= 10;
    return false;
  };

  const onSubmit = async (data: AssessmentInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.add({ title: "Error", description: result.error, type: "error" });
        return;
      }

      toast.add({
        title: "Assessment Complete!",
        description: result.mock
          ? "Running in demo mode — add your Gemini API key for real AI results."
          : "Your AI career roadmap is ready!",
        type: "success",
      });

      router.push("/roadmap");
    } catch (err: any) {
      toast.add({ title: "Error", description: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (!canProceed()) return;
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step].title}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        {/* Step dots */}
        <div className="mt-3 flex justify-between">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 ${i <= step ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                  i < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === step
                    ? "border-primary bg-background text-primary"
                    : "border-border bg-background"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className="hidden text-xs sm:block">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <h2 className="mb-1 font-heading text-xl font-bold">{STEPS[step].title}</h2>
            <p className="mb-5 text-sm text-muted-foreground">{STEPS[step].description}</p>

            {/* Step 0: Education */}
            {step === 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {EDUCATION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue("education", opt)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      values.education === opt
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: Stream */}
            {step === 1 && (
              <div className="flex flex-col gap-2">
                {STREAM_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue("stream", opt)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      values.stream === opt
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <MultiSelect
                options={SKILLS_OPTIONS}
                selected={values.skills}
                onChange={(v) => setValue("skills", v)}
              />
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
              <MultiSelect
                options={INTERESTS_OPTIONS}
                selected={values.interests}
                onChange={(v) => setValue("interests", v)}
              />
            )}

            {/* Step 4: Personality */}
            {step === 4 && (
              <div className="flex flex-col gap-2">
                {PERSONALITY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue("personality", opt)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      values.personality === opt
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Step 5: Goals */}
            {step === 5 && (
              <div className="space-y-3">
                <textarea
                  id="goals-input"
                  value={values.goals}
                  onChange={(e) => setValue("goals", e.target.value)}
                  placeholder="E.g., I want to become a software engineer at a top tech company and eventually start my own startup. I'm interested in AI and machine learning..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground">
                  {values.goals?.length ?? 0} characters{" "}
                  {(values.goals?.length ?? 0) < 10 && "— minimum 10 characters"}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={step === 0 || isSubmitting}
        >
          ← Back
        </Button>

        <Button
          type="button"
          onClick={goNext}
          disabled={!canProceed() || isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Generating...
            </span>
          ) : step === STEPS.length - 1 ? (
            "🚀 Get My Roadmap"
          ) : (
            "Next →"
          )}
        </Button>
      </div>
    </div>
  );
}
