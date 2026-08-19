import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getOrCreateDbUser } from "@/lib/auth-sync";

// GET /api/assessment/latest — get the user's most recent assessment
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getOrCreateDbUser(user);

    const assessment = await prisma.assessment.findFirst({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      include: { careerPaths: true },
    });

    return NextResponse.json(assessment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
