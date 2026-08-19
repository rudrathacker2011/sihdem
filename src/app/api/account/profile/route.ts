import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getOrCreateDbUser } from "@/lib/auth-sync";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getOrCreateDbUser(user);

    const fullUser = await prisma.user.findUnique({
      where: { id: dbUser.id },
      include: {
        mentorAssignment: { include: { mentor: true } },
        assessments: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!fullUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      name: fullUser.name,
      email: fullUser.email,
      role: fullUser.role,
      subscriptionTier: fullUser.subscriptionTier,
      aiTokensUsed: fullUser.aiTokensUsed,
      aiTokensLimit: fullUser.aiTokensLimit,
      mentorAssignment: fullUser.mentorAssignment,
      assessments: fullUser.assessments,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
