"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface AdminStats {
  totalStudents: number;
  totalMentors: number;
  unassignedStudents: number;
  totalRevenue: number;
  revenueChart: Array<{ month: string; revenue: number }>;
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="border border-border">
        <CardContent className="p-5">
          <div className="mb-2 text-2xl">{icon}</div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
          <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Platform overview and controls</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/mentors" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
              👨‍🏫 Mentors
            </Link>
            <Link href="/admin/revenue" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
              💰 Revenue
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Students" value={stats?.totalStudents ?? 0} icon="🎓" color="text-primary" />
          <StatCard title="Total Mentors" value={stats?.totalMentors ?? 0} icon="👨‍🏫" color="text-blue-600" />
          <StatCard title="Unassigned Students" value={stats?.unassignedStudents ?? 0} icon="⏳" color="text-orange-500" />
          <StatCard title="Total Revenue" value={`₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`} icon="💰" color="text-green-600" />
        </div>

        {/* Revenue chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.revenueChart?.length ? (
              <div className="flex h-40 items-end gap-2">
                {stats.revenueChart.map((item) => {
                  const max = Math.max(...stats.revenueChart.map((r) => r.revenue));
                  const height = max > 0 ? (item.revenue / max) * 100 : 0;
                  return (
                    <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                      <p className="text-xs text-muted-foreground">₹{item.revenue}</p>
                      <div
                        className="w-full rounded-t-md bg-primary/60 transition-all"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                      <p className="text-xs text-muted-foreground">{item.month.slice(5)}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No revenue data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/admin/mentors">
            <Card className="cursor-pointer border-border transition-colors hover:border-primary/40 hover:bg-muted/40">
              <CardContent className="p-6">
                <div className="mb-2 text-3xl">👨‍🏫</div>
                <p className="font-heading text-lg font-semibold">Manage Mentors</p>
                <p className="mt-1 text-sm text-muted-foreground">Add, edit mentors and assign them to students</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/revenue">
            <Card className="cursor-pointer border-border transition-colors hover:border-primary/40 hover:bg-muted/40">
              <CardContent className="p-6">
                <div className="mb-2 text-3xl">💰</div>
                <p className="font-heading text-lg font-semibold">Revenue Report</p>
                <p className="mt-1 text-sm text-muted-foreground">View payment transactions and revenue analytics</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
