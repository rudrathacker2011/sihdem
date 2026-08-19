import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// POST /api/reports/generate
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { assessmentId } = body;

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { careerPaths: true, user: true },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    if (assessment.user.supabaseId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Return assessment data — the PDF is rendered client-side with @react-pdf/renderer
    return NextResponse.json({
      assessment: {
        id: assessment.id,
        createdAt: assessment.createdAt,
        education: assessment.education,
        stream: assessment.stream,
        skills: assessment.skills,
        interests: assessment.interests,
        goals: assessment.goals,
        recommendation: assessment.recommendation,
      },
      careerPaths: assessment.careerPaths,
      user: {
        name: assessment.user.name,
        email: assessment.user.email,
      },
    });
  } catch (error: any) {
    console.error("[reports/generate]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
