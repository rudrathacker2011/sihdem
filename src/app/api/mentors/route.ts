import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// GET /api/mentors — list all mentors (Admin only)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const mentors = await prisma.mentor.findMany({
      include: { assignments: { include: { student: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(mentors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/mentors — create a mentor (Admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, fieldSpecialization, bio, organization } = body;

    const mentor = await prisma.mentor.create({
      data: { name, fieldSpecialization, bio, organization },
    });

    return NextResponse.json(mentor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
