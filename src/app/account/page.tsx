"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import Link from "next/link";
import {
  User,
  Zap,
  Crown,
  BookOpen,
  ChevronRight,
  Star,
  Award,
  Calendar,
} from "lucide-react";

interface UserProfile {
  name: string | null;
  email: string;
  role: string;
  subscriptionTier: string;
  aiTokensUsed: number;
  aiTokensLimit: number;
  mentorAssignment?: {
    matchType: string;
    assignedAt: string;
    mentor: { name: string; bio: string | null; organization: string | null; fieldSpecialization: string[] };
  } | null;
  assessments: Array<{ id: string; createdAt: string; stream: string | null }>;
}

declare global {
  interface Window { Razorpay: any }
}

// ─── Usage Bar ────────────────────────────────────────────────────────────────
function UsageBar({ used, total }: { used: number; total: number }) {
  const pct = Math.min((used / total) * 100, 100);
  const color = pct > 80 ? "#ef4444" : pct > 50 ? "#f59e0b" : "#6366f1";

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground">AI Tokens Used</span>
        <span className="font-bold text-foreground">{used} / {total}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        />
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">{Math.round(100 - pct)}% remaining</p>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  icon: Icon,
  title,
  accent = "#6366f1",
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-5 py-4 border-b border-border/50"
        style={{ borderLeft: `3px solid ${accent}` }}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ background: `${accent}18` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
        </div>
        <h3 className="font-heading text-sm font-bold text-foreground">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Main Account Page ────────────────────────────────────────────────────────
export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/account/profile");
        if (res.ok) setProfile(await res.json());
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/payments/create-order", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        toast.add({ title: "Payment error", description: err.error, type: "error" });
        return;
      }
      const data = await res.json();
      const { orderId, amount, isDemo } = data;

      if (isDemo || !window.Razorpay) {
        // Seamless 1-Click Demo Mode simulation
        toast.add({ title: "⚡ Processing Demo Payment...", description: "Simulating test transaction", type: "info" });
        await new Promise((r) => setTimeout(r, 1200));

        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: orderId,
            razorpayPaymentId: `demo_pay_${Date.now()}`,
            razorpaySignature: "demo_sig",
            isDemo: true,
          }),
        });

        if (verifyRes.ok) {
          toast.add({ title: "🎉 Premium Activated (Demo)!", description: "All features and unlimited AI tokens unlocked.", type: "success" });
          setProfile((prev) => prev ? { ...prev, subscriptionTier: "PREMIUM" } : prev);
        } else {
          toast.add({ title: "Upgrade failed", description: "Please try again.", type: "error" });
        }
        return;
      }

      // Live / Real Razorpay Checkout flow
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount, currency: "INR",
        name: "Aptivate — AI Career Counsellor",
        description: "Premium Subscription",
        order_id: orderId,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            toast.add({ title: "🎉 Premium Activated!", description: "You now have unlimited access.", type: "success" });
            setProfile((prev) => prev ? { ...prev, subscriptionTier: "PREMIUM" } : prev);
          } else {
            toast.add({ title: "Verification failed", description: "Please contact support.", type: "error" });
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } finally {
      setUpgrading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your profile…</p>
        </div>
      </div>
    );
  }

  const isPremium = profile?.subscriptionTier === "PREMIUM";
  const initials = (profile?.name?.[0] ?? profile?.email?.[0] ?? "?").toUpperCase();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* ─ Hero Profile Banner ─ */}
      <div className="relative overflow-hidden border-b border-border/50 bg-card px-4 py-10 md:py-14">
        {/* Bg orbs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <motion.div
            className="flex flex-col items-start gap-5 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Avatar ring */}
            <div className="relative">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold ${
                  isPremium
                    ? "bg-gradient-to-br from-primary to-violet-500 text-white shadow-lg shadow-primary/30"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {initials}
              </div>
              {isPremium && (
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs text-white shadow">
                  <Crown className="h-3 w-3" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  {profile?.name ?? profile?.email ?? "Your Account"}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    isPremium
                      ? "bg-amber-400/15 text-amber-400 border border-amber-400/30"
                      : "bg-primary/10 text-primary border border-primary/20"
                  }`}
                >
                  {isPremium ? "✦ PREMIUM" : "FREE"}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {profile?.role}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{profile?.email}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {profile?.assessments?.length ?? 0} assessments taken ·{" "}
                {isPremium ? "Unlimited AI access" : `${profile?.aiTokensUsed ?? 0} / ${profile?.aiTokensLimit ?? 50} tokens used`}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─ Content ─ */}
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionCard icon={isPremium ? Crown : Zap} title="Subscription" accent={isPremium ? "#f59e0b" : "#6366f1"}>
            {isPremium ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-emerald-400">🎉 Premium — All features unlocked</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Unlimited assessments", "Unlimited AI chat",
                    "Full syllabus access", "Priority mentor matching",
                    "PDF report downloads", "Career DNA analysis",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="text-emerald-400">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <UsageBar used={profile?.aiTokensUsed ?? 0} total={profile?.aiTokensLimit ?? 50} />

                {/* Free vs Premium comparison */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-3 opacity-60">
                    <p className="text-[11px] font-bold text-muted-foreground mb-2">Free</p>
                    {["1 Assessment", "50 AI messages", "Basic roadmap"].map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <span className="text-muted-foreground">·</span> {f}
                      </div>
                    ))}
                  </div>
                  <div className="gradient-border gradient-border-animated rounded-xl p-3 bg-card">
                    <p className="text-[11px] font-bold text-primary mb-2">✦ Premium</p>
                    {["Unlimited everything", "Mentor matching", "PDF reports", "Career DNA"].map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-xs text-foreground mb-1">
                        <span className="text-primary">✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full gap-2 shadow-lg shadow-primary/20"
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  id="upgrade-btn"
                >
                  {upgrading ? "Processing…" : "⚡ Upgrade to Premium — ₹999/mo"}
                </Button>
              </div>
            )}
          </SectionCard>
        </motion.div>

        {/* Mentor */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <SectionCard icon={Star} title="Assigned Mentor" accent="#8b5cf6">
            {profile?.mentorAssignment ? (
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-2xl border border-violet-500/20">
                  👨‍🏫
                </div>
                <div className="flex-1">
                  <p className="font-heading text-sm font-bold text-foreground">{profile.mentorAssignment.mentor.name}</p>
                  {profile.mentorAssignment.mentor.organization && (
                    <p className="text-xs text-muted-foreground">{profile.mentorAssignment.mentor.organization}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {profile.mentorAssignment.mentor.fieldSpecialization.map((f) => (
                      <span key={f} className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-400 border border-violet-500/20">
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Matched {profile.mentorAssignment.matchType.toLowerCase()} · {new Date(profile.mentorAssignment.assignedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">No mentor assigned yet.</p>
                <p className="mt-1 text-xs text-muted-foreground">Complete your assessment — an admin will match you with the right mentor.</p>
                <Link href="/assessment" className="mt-3 inline-block">
                  <Button variant="outline" size="sm" className="text-xs">Take Assessment →</Button>
                </Link>
              </div>
            )}
          </SectionCard>
        </motion.div>

        {/* Assessment History */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <SectionCard icon={BookOpen} title="Assessment History" accent="#10b981">
            {profile?.assessments?.length ? (
              <div className="space-y-2">
                {profile.assessments.map((a, i) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-4 py-3 hover:border-primary/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                        #{profile.assessments.length - i}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {a.stream ?? "General Assessment"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <Link href="/roadmap">
                      <button className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
                        View <ChevronRight className="h-3 w-3" />
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">No assessments yet.</p>
                <Link href="/assessment" className="mt-3 inline-block">
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <Award className="h-3.5 w-3.5" /> Take Your First Assessment
                  </Button>
                </Link>
              </div>
            )}
          </SectionCard>
        </motion.div>

      </div>
    </div>
  );
}
