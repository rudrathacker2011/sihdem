import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { geminiFlash, hasValidGeminiKey } from "@/lib/ai/client";
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

    const fallbackRecommendation = {
      summary: `Based on your profile in ${stream ?? "High School"} with interests in ${(interests || []).join(", ") || "technology and innovation"}, we've identified 2 promising career paths tailored to the Indian job market.`,
      careerPaths: [
        {
          title: "Software Engineering & AI",
          description: "Build cutting-edge technology products, machine learning models, and cloud systems.",
          steps: [
            { order: 1, title: "Complete 12th with PCM / STEM", description: "Focus on Mathematics and Physics foundations." },
            { order: 2, title: "Clear Entrance Exams (JEE / BITSAT / CET)", description: "Aim for top engineering colleges in India." },
            { order: 3, title: "B.Tech in CS / AI / Data Science", description: "4-year undergraduate degree with internships." },
          ],
          recommendedExams: ["JEE Main", "JEE Advanced"],
          alternateExams: ["BITSAT", "VITEEE", "COMEDK"],
          universities: [
            { name: "IIT Bombay", courses: ["B.Tech Computer Science"] },
            { name: "NIT Trichy", courses: ["B.Tech Information Technology"] },
            { name: "BITS Pilani", courses: ["B.E. Computer Science"] },
          ],
          competitionLevel: "Very High",
          futureDemand: "High Growth",
          companies: ["Google", "Microsoft", "Infosys", "TCS", "Flipkart", "Zomato"],
        },
        {
          title: "Data Analytics & Strategic Tech",
          description: "Transform complex data into business intelligence and scalable strategies.",
          steps: [
            { order: 1, title: "Build Python & Math foundations", description: "Statistics, Linear Algebra, and SQL." },
            { order: 2, title: "Pursue B.Sc/B.Tech with Analytics focus", description: "Look for AI/ML and Data specializations." },
            { order: 3, title: "Build portfolio projects", description: "Participate in Kaggle competitions and open-source." },
          ],
          recommendedExams: ["JEE Main", "CUET-UG"],
          alternateExams: ["BITSAT", "IPU CET"],
          universities: [
            { name: "IIT Delhi", courses: ["B.Tech with AI specialization"] },
            { name: "BITS Pilani", courses: ["B.E. Data Science"] },
          ],
          competitionLevel: "High",
          futureDemand: "High Growth",
          companies: ["Amazon", "Swiggy", "Paytm", "Razorpay", "Jio"],
        },
      ],
    };

    let finalRecommendation = fallbackRecommendation;

    // Attempt Gemini AI if valid key exists
    if (hasValidGeminiKey) {
      try {
        const result = await generateObject({
          model: geminiFlash,
          schema: AssessmentRecommendationSchema,
          system: ASSESSMENT_SYSTEM_PROMPT,
          prompt: buildAssessmentPrompt({ education, stream, skills, interests, personality, goals }),
        });
        if (result?.object) {
          finalRecommendation = result.object;
        }
      } catch (geminiErr: any) {
        console.warn("[assessment:gemini_fallback]", geminiErr?.message);
      }
    }

    // Save recommendation
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: { recommendation: finalRecommendation },
    });

    // Create individual CareerPath rows
    for (const cp of finalRecommendation.careerPaths) {
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

