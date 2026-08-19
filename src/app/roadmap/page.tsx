"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CareerPathCard from "@/components/roadmap/CareerPathCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Link from "next/link";
import { Map, Swords, Sliders } from "lucide-react";

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
      <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-muted-foreground text-sm font-medium">Loading your career roadmap...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment || !assessment.careerPaths?.length) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md text-center">
              <div className="mb-4 text-5xl">🗺️</div>
              <h1 className="font-heading text-2xl font-bold">No Generated Roadmap Yet</h1>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                Complete your situational scenario or AI assessment to generate your personalized GPS execution roadmap.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/assessment">
                  <Button className="gap-2 font-bold text-xs">🧠 Take Assessment</Button>
                </Link>
                <Link href="/careers">
                  <Button variant="outline" className="gap-2 font-bold text-xs">✨ Explore Careers</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const summary = (assessment.recommendation as any)?.summary;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 space-y-6 min-w-0 pb-36 lg:pb-12">
        {/* Header */}
        <motion.div
          className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
                <Map className="h-3.5 w-3.5" />
                <span>Personalized Action Map</span>
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                Your Career GPS Roadmap
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/career-battle">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                  <Swords className="h-3.5 w-3.5 text-primary" />
                  <span>Battle Roles</span>
                </Button>
              </Link>
              <Link href="/what-if">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                  <Sliders className="h-3.5 w-3.5 text-primary" />
                  <span>What-If</span>
                </Button>
              </Link>
            </div>
          </div>

          {summary && (
            <Card className="mt-4 border-primary/20 bg-primary/5">
              <CardContent className="p-4.5">
                <p className="text-xs sm:text-sm leading-relaxed text-foreground">{summary}</p>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 flex flex-wrap gap-2.5">
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
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `career-roadmap-${assessment.id}.json`;
                  a.click();
                }
              }}
            >
              📄 Download Summary Report
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

        {/* Mentor CTA */}
        <motion.div
          className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-heading text-base font-bold">Ready for 1-on-1 human guidance?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Connect with an industry mentor who has walked this exact career path
          </p>
          <Link href="/account">
            <Button className="mt-3.5 gap-2 text-xs font-bold" id="request-mentor-btn">
              👨‍🏫 Request a Mentor
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
