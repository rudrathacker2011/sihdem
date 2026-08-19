import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { geminiFlash } from "@/lib/ai/client";
import { AssessmentRecommendationSchema } from "@/lib/ai/schemas";
import { ASSESSMENT_SYSTEM_PROMPT, buildAssessmentPrompt } from "@/lib/ai/prompts";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getOrCreateDbUser } from "@/lib/auth-sync";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { education, stream, skills, interests, personality, goals } = body;

    // Get or create Prisma user (links seeded users by email automatically)
    const dbUser = await getOrCreateDbUser(user);

    // Check token limit for FREE users
    if (dbUser.subscriptionTier === "FREE" && dbUser.aiTokensUsed >= dbUser.aiTokensLimit) {
      return NextResponse.json(
        { error: "AI token limit reached. Upgrade to Premium for unlimited assessments." },
        { status: 403 }
      );
    }

    // Create assessment record
    const assessment = await prisma.assessment.create({
      data: {
        userId: dbUser.id,
        education,
        stream,
        skills,
        interests,
        personality,
        goals,
      },
    });

    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      // Return mock data if no API key yet
      const mockRecommendation = {
        summary: `Based on your profile in ${stream} with interests in ${interests.join(", ")}, we've identified ${2} promising career paths tailored to the Indian job market.`,
        careerPaths: [
          {
            title: "Software Engineering",
            description: "Build technology products for India's booming tech sector.",
            steps: [
              { order: 1, title: "Complete 12th with PCM", description: "Focus on Mathematics and Physics." },
              { order: 2, title: "Clear JEE Main/Advanced", description: "Aim for NIT or IIT admission." },
              { order: 3, title: "B.Tech in CS/IT", description: "4-year undergraduate degree." },
            ],
            recommendedExams: ["JEE Main", "JEE Advanced"],
            alternateExams: ["BITSAT", "VITEEE", "COMEDK"],
            universities: [
              { name: "IIT Bombay", courses: ["B.Tech Computer Science"] },
              { name: "NIT Trichy", courses: ["B.Tech Information Technology"] },
            ],
            competitionLevel: "Very High",
            futureDemand: "High Growth",
            companies: ["Google", "Microsoft", "Infosys", "TCS", "Flipkart"],
          },
          {
            title: "Data Science & AI",
            description: "Work with data to drive decisions in India's digital economy.",
            steps: [
              { order: 1, title: "Build Python & Math foundations", description: "Statistics, Linear Algebra." },
              { order: 2, title: "Pursue B.Sc/B.Tech with AI focus", description: "Look for AI/ML specializations." },
              { order: 3, title: "Build portfolio projects", description: "Kaggle competitions and internships." },
            ],
            recommendedExams: ["JEE Main", "CUET"],
            alternateExams: ["BITSAT", "IPU CET"],
            universities: [
              { name: "IIT Delhi", courses: ["B.Tech with AI specialization"] },
              { name: "BITS Pilani", courses: ["B.E. Computer Science"] },
            ],
            competitionLevel: "High",
            futureDemand: "High Growth",
            companies: ["Amazon", "Zomato", "Swiggy", "Paytm", "Razorpay"],
          },
        ],
      };

      // Save mock data
      await prisma.assessment.update({
        where: { id: assessment.id },
        data: { recommendation: mockRecommendation },
      });

      // Create career path rows
      for (const cp of mockRecommendation.careerPaths) {
        await prisma.careerPath.create({
          data: {
            assessmentId: assessment.id,
            title: cp.title,
            description: cp.description,
            steps: cp.steps,
            recommendedExams: cp.recommendedExams,
            alternateExams: cp.alternateExams,
            universities: cp.universities,
            competitionLevel: cp.competitionLevel,
            futureDemand: cp.futureDemand,
            companies: cp.companies,
          },
        });
      }

      await prisma.user.update({
        where: { id: dbUser.id },
        data: { aiTokensUsed: { increment: 1 } },
      });

      return NextResponse.json({ assessmentId: assessment.id, mock: true });
    }

    // Real AI generation
    const result = await generateObject({
      model: geminiFlash,
      schema: AssessmentRecommendationSchema,
      system: ASSESSMENT_SYSTEM_PROMPT,
      prompt: buildAssessmentPrompt({ education, stream, skills, interests, personality, goals }),
    });

    // Save recommendation
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: { recommendation: result.object },
    });

    // Create individual CareerPath rows
    for (const cp of result.object.careerPaths) {
      await prisma.careerPath.create({
        data: {
          assessmentId: assessment.id,
          title: cp.title,
          description: cp.description,
          steps: cp.steps,
          recommendedExams: cp.recommendedExams,
          alternateExams: cp.alternateExams,
          universities: cp.universities,
          competitionLevel: cp.competitionLevel,
          futureDemand: cp.futureDemand,
          companies: cp.companies,
        },
      });
    }

    // Increment token usage
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { aiTokensUsed: { increment: 1 } },
    });

    return NextResponse.json({ assessmentId: assessment.id });
  } catch (error: any) {
    console.error("[assessment/submit]", error);
    return NextResponse.json({ error: error.message ?? "Internal server error" }, { status: 500 });
  }
}
