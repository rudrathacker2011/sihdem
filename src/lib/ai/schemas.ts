import { z } from "zod";

// ─── Career Path Schema ───────────────────────────────────────────────────────

export const CareerPathSchema = z.object({
  title: z.string(),
  description: z.string(),
  steps: z.array(
    z.object({
      order: z.number(),
      title: z.string(),
      description: z.string(),
    })
  ),
  recommendedExams: z.array(z.string()),
  alternateExams: z.array(z.string()),
  universities: z.array(
    z.object({
      name: z.string(),
      courses: z.array(z.string()),
    })
  ),
  competitionLevel: z.enum(["Low", "Moderate", "High", "Very High"]),
  futureDemand: z.enum(["Declining", "Stable", "Growing", "High Growth"]),
  companies: z.array(z.string()),
});

// ─── Assessment Recommendation Schema ────────────────────────────────────────

export const AssessmentRecommendationSchema = z.object({
  summary: z.string(),
  careerPaths: z.array(CareerPathSchema).min(2).max(4),
});

// ─── Assessment Input Schema (for form validation) ────────────────────────────

export const AssessmentInputSchema = z.object({
  education: z.string().min(1, "Education level is required"),
  stream: z.string().min(1, "Stream is required"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  personality: z.string().min(1, "Personality type is required"),
  goals: z.string().min(10, "Please describe your goals in at least 10 characters"),
});

export type AssessmentInput = z.infer<typeof AssessmentInputSchema>;
export type AssessmentRecommendation = z.infer<typeof AssessmentRecommendationSchema>;
export type CareerPath = z.infer<typeof CareerPathSchema>;
