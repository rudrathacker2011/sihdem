"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CareerPathCard from "@/components/roadmap/CareerPathCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface CareerPath {
  id: string;
  title: string;
  description: string;
  steps: any[];
  recommendedExams: string[];
  alternateExams: string[];
  universities: any[];
  competitionLevel: string;
  futureDemand: string;
  companies: string[];
}

interface Assessment {
  id: string;
  recommendation: { summary: string } | null;
  careerPaths: CareerPath[];
  stream: string;
  goals: string;
}

export default function RoadmapPage() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        // Fetch latest assessment from session/API
        const res = await fetch("/api/assessment/latest");
        if (res.ok) {
          const data = await res.json();
          setAssessment(data);
        }
      } catch {
        // Will show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (!assessment || !assessment.careerPaths.length) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mb-4 text-6xl">🗺️</div>
          <h1 className="font-heading text-2xl font-bold">No Roadmap Yet</h1>
          <p className="mt-2 text-muted-foreground">
            Complete your AI assessment first to get your personalized career roadmap.
          </p>
          <Link href="/assessment" className="mt-6 inline-block">
            <Button className="gap-2">🧠 Start Assessment</Button>
          </Link>
        </div>
      </div>
    );
  }

  const summary = (assessment.recommendation as any)?.summary;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
            🗺️
          </div>
          <h1 className="font-heading text-3xl font-bold">Your Career Roadmap</h1>

          {summary && (
            <Card className="mt-4 border-primary/20 bg-primary/5">
              <CardContent className="p-5">
                <p className="text-sm leading-relaxed text-foreground">{summary}</p>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              id="download-pdf-btn"
              onClick={async () => {
                const res = await fetch("/api/reports/generate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ assessmentId: assessment.id }),
                });
                if (res.ok) {
                  const data = await res.json();
                  // PDF download — uses blob or redirects
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `career-roadmap-${assessment.id}.json`;
                  a.click();
                }
              }}
            >
              📄 Download Report
            </Button>
            <Link href="/assessment">
              <Button variant="outline" size="sm" id="retake-assessment-btn">
                🔄 Retake Assessment
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Career path cards */}
        <div className="space-y-4">
          {assessment.careerPaths.map((path, i) => (
            <CareerPathCard key={path.id} {...path} index={i} />
          ))}
        </div>

        {/* Request mentor CTA */}
        <motion.div
          className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-heading text-lg font-semibold">Ready to take the next step?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Get matched with a mentor who's been down this path
          </p>
          <Link href="/account">
            <Button className="mt-4 gap-2" id="request-mentor-btn">
              👨‍🏫 Request a Mentor
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
