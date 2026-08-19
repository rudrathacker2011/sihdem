"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

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
        toast.add({ title: "Payment not configured", description: err.error, type: "error" });
        return;
      }

      const { orderId, amount } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "AI Career Counsellor",
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Razorpay script */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-8 font-heading text-3xl font-bold">Your Account</h1>

          <div className="space-y-5">
            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {profile?.name?.[0] ?? profile?.email?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="font-semibold">{profile?.name ?? "No name set"}</p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {profile?.role}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card className={profile?.subscriptionTier === "PREMIUM" ? "border-primary/40 bg-primary/5" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Subscription</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    profile?.subscriptionTier === "PREMIUM"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {profile?.subscriptionTier ?? "FREE"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.subscriptionTier === "FREE" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">AI tokens used</span>
                      <span className="font-medium">{profile.aiTokensUsed} / {profile.aiTokensLimit}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min((profile.aiTokensUsed / profile.aiTokensLimit) * 100, 100)}%` }}
                      />
                    </div>
                    <Button
                      className="w-full gap-2"
                      onClick={handleUpgrade}
                      disabled={upgrading}
                      id="upgrade-btn"
                    >
                      {upgrading ? "Processing..." : "⚡ Upgrade to Premium — ₹999/mo"}
                    </Button>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>✅ Unlimited AI assessments</div>
                      <div>✅ Unlimited chat messages</div>
                      <div>✅ Full syllabus access</div>
                      <div>✅ Personal mentorship</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="text-green-600 font-medium">🎉 Premium — All features unlocked</p>
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                      <div>✅ Unlimited assessments</div>
                      <div>✅ Unlimited chat</div>
                      <div>✅ Full syllabus access</div>
                      <div>✅ Priority mentor matching</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mentor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assigned Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.mentorAssignment ? (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">👨‍🏫</div>
                    <div>
                      <p className="font-semibold">{profile.mentorAssignment.mentor.name}</p>
                      {profile.mentorAssignment.mentor.organization && (
                        <p className="text-sm text-muted-foreground">{profile.mentorAssignment.mentor.organization}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {profile.mentorAssignment.mentor.fieldSpecialization.map((f) => (
                          <span key={f} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{f}</span>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Matched {profile.mentorAssignment.matchType.toLowerCase()} · {new Date(profile.mentorAssignment.assignedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm">No mentor assigned yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Complete your assessment and an admin will match you with the right mentor.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assessment history */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assessment History</CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.assessments?.length ? (
                  <div className="space-y-2">
                    {profile.assessments.map((a, i) => (
                      <div key={a.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">Assessment #{profile.assessments.length - i}</p>
                          <p className="text-xs text-muted-foreground">{a.stream ?? "General"} · {new Date(a.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Link href="/roadmap">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">View →</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No assessments yet.</p>
                    <Link href="/assessment" className="mt-2 inline-block">
                      <Button variant="outline" size="sm">Take Assessment</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
