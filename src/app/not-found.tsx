import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — AI Career Counsellor",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 font-heading text-8xl font-bold text-primary/20">404</div>
      <div className="mb-4 text-5xl">🤖</div>
      <h1 className="font-heading text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        This page doesn't exist. Let's get you back on track!
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/">
          <Button id="404-home-btn">← Go Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" id="404-dashboard-btn">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
