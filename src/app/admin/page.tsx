"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  TrendingUp,
  IndianRupee,
  Clock,
  RefreshCw,
  ChevronRight,
  BarChart3,
} from "lucide-react";

interface AdminStats {
  totalStudents: number;
  totalMentors: number;
  unassignedStudents: number;
  totalRevenue: number;
  revenueChart: Array<{ month: string; revenue: number }>;
}

// ─── Mock extended stats ──────────────────────────────────────────────────────

const MOCK_MENTOR_LOAD = [
  { name: "Dr. Priya Sharma", org: "IIT Bombay", students: 8, max: 10, field: "Software Engineering" },
  { name: "Rahul Mehra", org: "Google India", students: 5, max: 8, field: "Product Management" },
  { name: "Ananya Krishnan", org: "AIIMS Delhi", students: 10, max: 10, field: "Medicine & Research" },
  { name: "Vikram Nair", org: "McKinsey & Co", students: 3, max: 6, field: "Business Strategy" },
  { name: "Deepa Iyer", org: "NID Ahmedabad", students: 7, max: 8, field: "Design" },
];

const STREAM_DISTRIBUTION = [
  { label: "PCM (Engineering)", pct: 42, color: "#6366f1" },
  { label: "PCB (Medical)", pct: 28, color: "#10b981" },
  { label: "Commerce", pct: 19, color: "#f59e0b" },
  { label: "Humanities", pct: 11, color: "#8b5cf6" },
];

// ─── KPI Tile ──────────────────────────────────────────────────────────────────

function KpiTile({
  icon: Icon,
  label,
  value,
  change,
  sub,
  color,
  delay,
  sparkline,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  sub?: string;
  color: string;
  delay: number;
  sparkline?: number[];
}) {
  const max = sparkline ? Math.max(...sparkline) : 1;

  return (
    <motion.div
      className="glass rounded-2xl p-5 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        {change && (
          <span
            className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold border"
            style={{
              background: `${color}15`,
              color,
              borderColor: `${color}30`,
            }}
          >
            <TrendingUp className="h-2.5 w-2.5" />
            {change}
          </span>
        )}
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-heading text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p>}

      {/* Sparkline */}
      {sparkline && (
        <div className="mt-3 flex items-end gap-0.5 h-8">
          {sparkline.map((v, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{ background: `${color}50` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: delay + i * 0.04, duration: 0.4, ease: "easeOut" }}
              whileHover={{ background: color }}
              title={`${v}`}
              css-style={{ height: `${(v / max) * 100}%`, transformOrigin: "bottom" }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Revenue Bar Chart ────────────────────────────────────────────────────────

function RevenueChart({ data }: { data: Array<{ month: string; revenue: number }> }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="font-heading text-sm font-bold text-foreground">Monthly Revenue</h3>
        </div>
        <span className="text-[10px] text-muted-foreground">Last {data.length} months</span>
      </div>

      <div className="relative">
        {/* Y-axis grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          {gridLines.reverse().map((pct) => (
            <div key={pct} className="flex items-center gap-2">
              <span className="w-10 flex-shrink-0 text-right text-[9px] text-muted-foreground">
                {pct > 0 ? `₹${Math.round((pct / 100) * max / 1000)}k` : "₹0"}
              </span>
              <div className="flex-1 border-t border-border/30" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="ml-12 flex items-end gap-2 h-40 pb-6">
          {data.map((item, i) => {
            const height = max > 0 ? (item.revenue / max) * 100 : 0;
            return (
              <div key={item.month} className="group flex flex-1 flex-col items-center gap-1">
                <div className="relative w-full" style={{ height: "100%" }}>
                  <motion.div
                    className="absolute bottom-0 w-full rounded-t-lg overflow-hidden"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                    css-style={{ transformOrigin: "bottom" }}
                  >
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(to top, oklch(0.488 0.243 264), oklch(0.65 0.22 264 / 0.5))`,
                      }}
                    />
                    {/* Shine */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  </motion.div>
                  {/* Tooltip */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap rounded-md bg-foreground px-1.5 py-0.5 text-[9px] font-bold text-background z-10">
                    ₹{item.revenue.toLocaleString("en-IN")}
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground">{item.month.slice(5)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Student Funnel ───────────────────────────────────────────────────────────

function StudentFunnel({ total, assessed, mentored, upgraded }: { total: number; assessed: number; mentored: number; upgraded: number }) {
  const steps = [
    { label: "Registered", value: total, color: "#6366f1", pct: 100 },
    { label: "Assessed", value: assessed, color: "#8b5cf6", pct: total > 0 ? (assessed / total) * 100 : 0 },
    { label: "Mentor Assigned", value: mentored, color: "#10b981", pct: total > 0 ? (mentored / total) * 100 : 0 },
    { label: "Upgraded", value: upgraded, color: "#f59e0b", pct: total > 0 ? (upgraded / total) * 100 : 0 },
  ];

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 border-b border-border/50 pb-3">
        <h3 className="font-heading text-sm font-bold text-foreground">Student Conversion Funnel</h3>
        <p className="text-[10px] text-muted-foreground">Registration → Assessment → Mentor → Premium</p>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.45 }}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-foreground">{step.label}</span>
              <span className="font-bold" style={{ color: step.color }}>
                {step.value} <span className="font-normal text-muted-foreground">({Math.round(step.pct)}%)</span>
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${step.color}, ${step.color}70)` }}
                initial={{ width: 0 }}
                animate={{ width: `${step.pct}%` }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Stream Distribution ──────────────────────────────────────────────────────

function StreamChart() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 border-b border-border/50 pb-3">
        <h3 className="font-heading text-sm font-bold text-foreground">Student Stream Distribution</h3>
      </div>
      <div className="space-y-3">
        {STREAM_DISTRIBUTION.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.label}</span>
              </div>
              <span className="font-bold text-foreground">{s.pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ background: s.color }}
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.7 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Mentor Load Table ────────────────────────────────────────────────────────

function MentorLoadTable() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
        <h3 className="font-heading text-sm font-bold text-foreground">Mentor Capacity Overview</h3>
        <Link href="/admin/mentors">
          <button className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
            Manage <ChevronRight className="h-3 w-3" />
          </button>
        </Link>
      </div>

      <div className="space-y-2.5">
        {MOCK_MENTOR_LOAD.map((m, i) => {
          const pct = (m.students / m.max) * 100;
          const color = pct >= 100 ? "#ef4444" : pct >= 75 ? "#f59e0b" : "#10b981";
          return (
            <motion.div
              key={m.name}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/30 p-3 hover:border-primary/30 transition"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg">
                👨‍🏫
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-foreground truncate">{m.name}</p>
                  <span className="text-[10px] font-bold flex-shrink-0" style={{ color }}>
                    {m.students}/{m.max}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{m.org} · {m.field}</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await fetch("/api/admin/stats");
      const data = await r.json();
      setStats(data);
      setLastRefresh(new Date());
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 60s
    const interval = setInterval(fetchStats, 60_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  // Mock derived data
  const assessed = Math.round((stats?.totalStudents ?? 0) * 0.68);
  const mentored = Math.round((stats?.totalStudents ?? 0) * 0.41);
  const upgraded = Math.round((stats?.totalStudents ?? 0) * 0.22);
  const avgScore = 74;

  const sparklineRevenue = stats?.revenueChart?.map((d) => d.revenue) ?? [2000, 5000, 8000, 12000, 9000, 15000];
  const sparklineStudents = [12, 19, 28, 35, 42, 58, 67];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background px-4 py-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ─ Header ─ */}
        <motion.div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold md:text-3xl">Admin Dashboard</h1>
              <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Last updated {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              disabled={refreshing}
              className="glass flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-foreground transition hover:border-primary/40 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link href="/admin/mentors">
              <button className="glass flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-primary transition hover:border-primary/40">
                👨‍🏫 Mentors
              </button>
            </Link>
            <Link href="/admin/revenue">
              <button className="glass flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-primary transition hover:border-primary/40">
                💰 Revenue
              </button>
            </Link>
          </div>
        </motion.div>

        {/* ─ KPI Row ─ */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KpiTile
            icon={Users}
            label="Total Students"
            value={String(stats?.totalStudents ?? 0)}
            change="+12%"
            sub="vs last month"
            color="#6366f1"
            delay={0.05}
            sparkline={sparklineStudents}
          />
          <KpiTile
            icon={GraduationCap}
            label="Total Mentors"
            value={String(stats?.totalMentors ?? 0)}
            sub="Across all fields"
            color="#8b5cf6"
            delay={0.1}
            sparkline={[3, 4, 5, 5, 7, 8, 8]}
          />
          <KpiTile
            icon={Clock}
            label="Unassigned"
            value={String(stats?.unassignedStudents ?? 0)}
            sub="Need mentor matching"
            color="#f59e0b"
            delay={0.15}
          />
          <KpiTile
            icon={IndianRupee}
            label="Total Revenue"
            value={`₹${((stats?.totalRevenue ?? 0) / 1000).toFixed(1)}k`}
            change="+8%"
            sub="Lifetime earnings"
            color="#10b981"
            delay={0.2}
            sparkline={sparklineRevenue.slice(-7)}
          />
          <KpiTile
            icon={TrendingUp}
            label="Avg. Test Score"
            value={`${avgScore}%`}
            change="+3%"
            sub="Platform average"
            color="#ef4444"
            delay={0.25}
          />
        </div>

        {/* ─ Charts Row ─ */}
        <div className="grid gap-4 lg:grid-cols-2">
          {stats?.revenueChart?.length ? (
            <RevenueChart data={stats.revenueChart} />
          ) : (
            <RevenueChart data={[
              { month: "2025-02", revenue: 2000 },
              { month: "2025-03", revenue: 5500 },
              { month: "2025-04", revenue: 8200 },
              { month: "2025-05", revenue: 12000 },
              { month: "2025-06", revenue: 9800 },
              { month: "2025-07", revenue: 15500 },
              { month: "2025-08", revenue: 18900 },
            ]} />
          )}
          <StudentFunnel
            total={stats?.totalStudents ?? 0}
            assessed={assessed}
            mentored={mentored}
            upgraded={upgraded}
          />
        </div>

        {/* ─ Bottom Row ─ */}
        <div className="grid gap-4 lg:grid-cols-2">
          <MentorLoadTable />
          <StreamChart />
        </div>

      </div>
    </div>
  );
}
