import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { rankMentors } from "@/lib/matching/scoreMentor";

// GET /api/mentors/suggest/[studentId] — auto-match suggestions for admin
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { studentId } = await params;

    // Get student's latest assessment career paths
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        assessments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { careerPaths: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const latestAssessment = student.assessments[0];
    if (!latestAssessment) {
      return NextResponse.json({ suggestions: [], message: "No assessment found for this student" });
    }

    // Get all mentors
    const mentors = await prisma.mentor.findMany();

    // Rank them
    const ranked = rankMentors(
      latestAssessment.careerPaths.map((cp) => ({
        title: cp.title,
        description: cp.description,
        steps: cp.steps as any,
        recommendedExams: cp.recommendedExams,
        alternateExams: cp.alternateExams,
        universities: cp.universities as any,
        competitionLevel: cp.competitionLevel as any,
        futureDemand: cp.futureDemand as any,
        companies: cp.companies,
      })),
      mentors
    );

    return NextResponse.json({ suggestions: ranked });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
