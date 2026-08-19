import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// POST /api/mentors/assign — manually assign a mentor to a student
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { studentId, mentorId } = body;

    // Upsert assignment
    const assignment = await prisma.mentorAssignment.upsert({
      where: { studentId },
      create: { studentId, mentorId, matchType: "MANUAL" },
      update: { mentorId, matchType: "MANUAL" },
    });

    return NextResponse.json(assignment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
