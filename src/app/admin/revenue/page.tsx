"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueData {
  totalRevenue: number;
  revenueChart: Array<{ month: string; revenue: number }>;
}

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setData)
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
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Revenue</h1>
          <p className="text-sm text-muted-foreground">Payment analytics and subscription revenue</p>
        </div>

        {/* Total revenue card */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Revenue (Test Mode)</p>
            <p className="mt-1 font-heading text-4xl font-bold text-primary">
              ₹{(data?.totalRevenue ?? 0).toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ⚠️ This is Razorpay test mode data only
            </p>
          </CardContent>
        </Card>

        {/* Revenue chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.revenueChart?.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, "Revenue"]}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-48 items-center justify-center text-muted-foreground">
                No revenue data yet — payments will appear here once Razorpay test keys are configured
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
