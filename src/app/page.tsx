"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import RobotAssistant from "@/components/robot/RobotAssistant";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
  accent: string;
}

interface StoryItem {
  icon: string;
  title: string;
  text: string;
}

interface PlanItem {
  name: string;
  price: string;
  sub: string;
  features: string[];
  primary?: boolean;
  cta: string;
  href: string;
}

// ─── Feature Card — 3D Glassmorphism ──────────────────────────────────────────

function FeatureCard({ icon, title, desc, accent, index }: FeatureItem & { index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="card-3d glass rounded-2xl p-6 cursor-default"
      style={{ borderTop: `2px solid ${accent}22` }}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
      >
        {icon}
      </div>
      <h4
        className="font-display text-base font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display, var(--font-heading))" }}
      >
        {title}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

// ─── Story Timeline Spine ─────────────────────────────────────────────────────

function StoryTimeline({ items }: { items: StoryItem[] }) {
  return (
    <div className="relative mx-auto max-w-2xl">
      {/* Vertical spine line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-border/50 md:left-1/2 md:-translate-x-px" />

      <div className="space-y-0">
        {items.map((item, i) => (
          <StoryNode key={i} item={item} index={i} total={items.length} />
        ))}
      </div>
    </div>
  );
}

function StoryNode({ item, index, total }: { item: StoryItem; index: number; total: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLast = index === total - 1;
  const isRight = index % 2 === 0; // alternating left-right on desktop

  return (
    <div ref={ref} className={`relative flex gap-6 pb-10 md:gap-0 ${isLast ? "pb-0" : ""}`}>
      {/* Spine fill segment */}
      {!isLast && (
        <motion.div
          className="absolute left-6 top-8 w-px bg-primary/60 md:left-1/2 md:-translate-x-px"
          style={{ originY: 0 }}
          initial={{ scaleY: 0, height: "100%" }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        />
      )}

      {/* Mobile: dot on left, content right */}
      {/* Desktop: alternating sides */}

      {/* Glowing dot */}
      <div className={`relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2`}>
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-full text-xl"
          style={{
            background: "var(--card)",
            border: "2px solid transparent",
          }}
          animate={
            inView
              ? {
                  boxShadow: [
                    "0 0 0 0 oklch(0.58 0.22 264 / 0.0)",
                    "0 0 0 8px oklch(0.58 0.22 264 / 0.15)",
                    "0 0 0 0 oklch(0.58 0.22 264 / 0.0)",
                  ],
                  borderColor: ["transparent", "oklch(0.58 0.22 264)", "oklch(0.58 0.22 264)"],
                }
              : {}
          }
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-xl">{item.icon}</span>
        </motion.div>
      </div>

      {/* Content card */}
      <motion.div
        className={`flex-1 glass rounded-2xl p-5 md:w-[calc(50%-2.5rem)] md:flex-none ${
          isRight
            ? "md:ml-[calc(50%+1.5rem)]"
            : "md:mr-[calc(50%+1.5rem)] md:ml-0 md:text-right"
        }`}
        initial={{ opacity: 0, x: isRight ? 30 : -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <h3
          className="font-heading text-base font-bold leading-snug"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {item.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
      </motion.div>
    </div>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({ name, price, sub, features, primary, cta, href }: PlanItem) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22 }}
      className={`flex flex-1 flex-col rounded-2xl p-px ${primary ? "gradient-border gradient-border-animated" : "glass"}`}
    >
      <div
        className={`flex h-full flex-col rounded-2xl p-6 ${
          primary ? "bg-card" : "bg-transparent"
        }`}
      >
        {primary && (
          <span className="mb-3 self-start rounded-full bg-primary/15 px-3 py-0.5 text-xs font-bold text-primary border border-primary/20">
            ✦ Most Popular
          </span>
        )}
        <div className="font-display text-xl font-bold" style={{ fontFamily: "var(--font-display, var(--font-heading))" }}>
          {name}
        </div>
        <div className="mt-2 flex items-end gap-1">
          <span className="font-display text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display, var(--font-heading))" }}>
            {price}
          </span>
          {price !== "Free" && (
            <span className="mb-1 text-sm text-muted-foreground">/month</span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>

        <ul className="mt-5 flex-1 space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] text-primary">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Link href={href} className="mt-6 block">
          <button
            id={`plan-${name.toLowerCase()}-btn`}
            className={`w-full rounded-xl py-2.5 text-sm font-bold transition-all ${
              primary
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                : "glass hover:border-primary/40"
            }`}
          >
            {cta}
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Floating Stat Pill ───────────────────────────────────────────────────────

function StatPill({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      className="glass rounded-full px-4 py-2 text-center"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="font-display text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display, var(--font-heading))" }}>
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES: FeatureItem[] = [
  { icon: "🧠", title: "AI Assessment Engine", desc: "6 psychometric scenarios scored by Gemini 2.0 Flash — maps your aptitude, interests, and personality.", accent: "#6366f1" },
  { icon: "🗺️", title: "GPS Career Roadmap", desc: "2–4 tailored paths with entrance exam guidance, IIT/NIT alignment, and milestone checkpoints.", accent: "#8b5cf6" },
  { icon: "💬", title: "AI Counsellor Chat", desc: "Stateful conversations — the AI remembers your profile and adapts advice as you grow.", accent: "#06b6d4" },
  { icon: "🧬", title: "Career DNA Vector", desc: "8-dimensional cognitive profile: logic, creativity, empathy, leadership, and more.", accent: "#10b981" },
  { icon: "⚔️", title: "1v1 Career Battle", desc: "Compare two career paths side-by-side on salary, difficulty, demand, and work-life balance.", accent: "#f59e0b" },
  { icon: "👨‍🏫", title: "Human Mentor Match", desc: "Automatic matching with industry professionals who walked your exact career path.", accent: "#ef4444" },
];

const STORY: StoryItem[] = [
  {
    icon: "😕",
    title: "Arjun didn't know what to do after 12th",
    text: "Like millions of Indian students, Arjun finished PCM but had no idea which path to take — Engineering? Medicine? MBA? Overwhelmed by conflicting advice.",
  },
  {
    icon: "🧠",
    title: "He took the 3-minute AI Assessment",
    text: "6 situational scenarios mapped his aptitude, interests, and goals. Gemini 2.0 Flash analyzed his profile against 60+ Indian career tracks.",
  },
  {
    icon: "🗺️",
    title: "He received a personalized Career Roadmap",
    text: "In seconds: Software Engineering, Data Science, and Product Management — each with JEE/BITSAT guidance, IIT/NIT matches, and top hiring companies.",
  },
  {
    icon: "👨‍🏫",
    title: "He got matched with a mentor from IIT Bombay",
    text: "Our system suggested someone who'd taken the exact same path — real, been-there advice instead of generic school guidance.",
  },
  {
    icon: "🎓",
    title: "Arjun cracked JEE Advanced and joined IIT Delhi CS",
    text: "With a clear roadmap, a dedicated mentor, and AI-powered guidance — clarity replaced confusion. Your story starts here.",
  },
];

const PLANS: PlanItem[] = [
  {
    name: "Free",
    price: "Free",
    sub: "Perfect to get started",
    cta: "Get Started Free",
    href: "/auth",
    features: [
      "1 AI Assessment",
      "50 AI chat messages",
      "Career roadmap",
      "Basic exam guidance",
      "Core course catalog",
    ],
  },
  {
    name: "Premium",
    price: "₹999",
    sub: "Everything you need to crack it",
    cta: "Upgrade to Premium",
    href: "/auth",
    primary: true,
    features: [
      "Unlimited AI assessments",
      "Unlimited AI chat",
      "Full syllabus & college access",
      "India college alignment",
      "Priority mentor matching",
      "PDF report downloads",
      "Career DNA deep analysis",
      "What-If simulator access",
    ],
  },
];

// ─── Main Landing Page ────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="mesh-bg relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center"
      >
        {/* Extra floating orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, oklch(0.7 0.2 295), transparent 70%)", filter: "blur(40px)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 h-56 w-56 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, oklch(0.6 0.22 240), transparent 70%)", filter: "blur(40px)" }}
            animate={{ scale: [1, 0.85, 1], x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center gap-6 max-w-2xl"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-primary">
              🇮🇳 Built for Indian Students · SIH2
            </span>
          </motion.div>

          {/* Robot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, type: "spring", stiffness: 120 }}
          >
            <RobotAssistant state="idle" size={130} />
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="leading-[1.1] tracking-tight"
            style={{ fontFamily: "var(--font-display, var(--font-heading))" }}
          >
            <span className="block text-4xl font-bold text-foreground md:text-6xl">
              Find Your Perfect
            </span>
            <span className="block text-4xl font-bold md:text-6xl">
              <span className="text-gradient">Career Path</span>
              <span className="text-foreground"> with AI</span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            AI-powered career counselling tailored to the Indian education system.
            Get personalized roadmaps, exam guidance, and a dedicated mentor.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <Link href="/auth">
              <button
                id="hero-cta-btn"
                className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90 hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                🧠 Start Free Assessment
              </button>
            </Link>
            <Link href="/chat">
              <button
                id="hero-chat-btn"
                className="glass flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-bold transition hover:-translate-y-0.5"
              >
                💬 Talk to AI First
              </button>
            </Link>
          </motion.div>

          {/* Social proof pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
          >
            <StatPill value="10k+" label="Students Guided" delay={0.8} />
            <StatPill value="95%" label="Clarity Rate" delay={0.85} />
            <StatPill value="3 min" label="Assessment Time" delay={0.9} />
            <StatPill value="Free" label="To Start" delay={0.95} />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <div className="glass flex h-8 w-5 items-start justify-center rounded-full pt-1.5">
            <motion.div
              className="h-1.5 w-0.5 rounded-full bg-primary/60"
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Platform Features</p>
              <h2
                className="text-3xl font-bold tracking-tight md:text-4xl"
                style={{ fontFamily: "var(--font-display, var(--font-heading))" }}
              >
                Everything you need to plan your career
              </h2>
              <p className="mt-3 text-muted-foreground">Powered by Gemini AI · Designed for India</p>
            </motion.div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Story Timeline ── */}
      <section className="mesh-bg px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Student Story</p>
              <h2
                className="text-3xl font-bold tracking-tight md:text-4xl"
                style={{ fontFamily: "var(--font-display, var(--font-heading))" }}
              >
                From confusion to career clarity
              </h2>
              <p className="mt-3 text-muted-foreground">One student's journey with Aptivate</p>
            </motion.div>
          </div>

          <StoryTimeline items={STORY} />
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Pricing</p>
              <h2
                className="text-3xl font-bold tracking-tight md:text-4xl"
                style={{ fontFamily: "var(--font-display, var(--font-heading))" }}
              >
                Choose your plan
              </h2>
              <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready.</p>
            </motion.div>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row">
            {PLANS.map((p) => (
              <PlanCard key={p.name} {...p} />
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            No credit card required to start · Cancel anytime · Secure payments via Razorpay
          </p>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="mesh-bg px-4 py-28 text-center">
        <motion.div
          className="mx-auto max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Glow halo */}
          <div className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl" />
            <RobotAssistant state="idle" size={110} className="relative z-10" />
          </div>

          <h2
            className="text-3xl font-bold tracking-tight md:text-4xl"
            style={{ fontFamily: "var(--font-display, var(--font-heading))" }}
          >
            Ready to find your path?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of Indian students getting AI-powered career guidance — tailored to your stream, goals, and city.
          </p>

          <Link href="/auth" className="mt-8 inline-block">
            <button
              id="footer-cta-btn"
              className="group relative overflow-hidden rounded-xl bg-primary px-10 py-3.5 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30 transition hover:shadow-primary/50 hover:-translate-y-1"
            >
              <span className="relative z-10">🚀 Start Your Journey — It&apos;s Free</span>
              <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 px-4 py-8 text-center text-xs text-muted-foreground">
        <p className="font-semibold text-foreground/70">Aptivate — AI Career Counsellor</p>
        <p className="mt-1.5">Smart India Hackathon 2 (SIH2) · Next.js · Supabase · Gemini AI · Razorpay</p>
      </footer>
    </div>
  );
}