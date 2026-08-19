import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// GET /api/admin/stats — admin dashboard stats
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [totalStudents, totalMentors, unassignedCount, payments] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.mentor.count(),
      prisma.user.count({
        where: {
          role: "STUDENT",
          mentorAssignment: null,
          assessments: { some: {} },
        },
      }),
      prisma.payment.findMany({
        where: { status: "paid" },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Build monthly revenue data for chart
    const monthlyRevenue: Record<string, number> = {};
    for (const p of payments) {
      const key = p.createdAt.toISOString().slice(0, 7); // "YYYY-MM"
      monthlyRevenue[key] = (monthlyRevenue[key] ?? 0) + p.amount / 100; // paise to INR
    }

    const revenueChart = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0) / 100;

    return NextResponse.json({
      totalStudents,
      totalMentors,
      unassignedStudents: unassignedCount,
      totalRevenue,
      revenueChart,
    });
  } catch (error: any) {
    console.error("[admin/stats]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
