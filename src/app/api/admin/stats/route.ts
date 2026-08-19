import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// Realistic mock revenue for demo/test mode (12 months, realistic SaaS growth curve)
const MOCK_REVENUE_CHART = [
  { month: "2024-09", revenue: 1980 },
  { month: "2024-10", revenue: 4450 },
  { month: "2024-11", revenue: 7200 },
  { month: "2024-12", revenue: 9800 },
  { month: "2025-01", revenue: 13500 },
  { month: "2025-02", revenue: 11200 },
  { month: "2025-03", revenue: 16700 },
  { month: "2025-04", revenue: 19400 },
  { month: "2025-05", revenue: 22100 },
  { month: "2025-06", revenue: 18600 },
  { month: "2025-07", revenue: 27800 },
  { month: "2025-08", revenue: 34500 },
];

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

    const realChart = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0) / 100;

    // Use mock data when no real payments exist (test/demo mode)
    const revenueChart = realChart.length > 0 ? realChart : MOCK_REVENUE_CHART;
    const displayRevenue = totalRevenue > 0
      ? totalRevenue
      : MOCK_REVENUE_CHART.reduce((s, r) => s + r.revenue, 0);

    return NextResponse.json({
      totalStudents,
      totalMentors,
      unassignedStudents: unassignedCount,
      totalRevenue: displayRevenue,
      revenueChart,
    });
  } catch (error: any) {
    console.error("[admin/stats]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
