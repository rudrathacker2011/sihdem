"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RobotAssistant from "@/components/robot/RobotAssistant";

// ─── Scroll Narrative Panel ───────────────────────────────────────────────────

function StoryPanel({
  icon,
  title,
  text,
  index,
}: {
  icon: string;
  title: string;
  text: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-6 md:flex-row md:items-start"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className={`flex-shrink-0 ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-4xl shadow-sm">
          {icon}
        </div>
      </div>
      <div className={`text-center md:text-left ${index % 2 === 0 ? "md:order-2" : "md:order-1"}`}>
        <h3 className="font-heading text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </motion.div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="h-full border-border transition-colors hover:border-primary/40">
        <CardContent className="p-6">
          <div className="mb-3 text-3xl">{icon}</div>
          <h4 className="font-heading text-lg font-semibold">{title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({
  name,
  price,
  features,
  primary,
  cta,
  href,
}: {
  name: string;
  price: string;
  features: string[];
  primary?: boolean;
  cta: string;
  href: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="flex-1">
      <Card
        className={`h-full border-2 ${
          primary
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
            : "border-border"
        }`}
      >
        <CardContent className="p-6">
          {primary && (
            <span className="mb-3 inline-block rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
              Most Popular
            </span>
          )}
          <h4 className="font-heading text-xl font-bold">{name}</h4>
          <div className="mt-2">
            <span className="font-heading text-3xl font-bold">{price}</span>
            {price !== "Free" && <span className="text-sm text-muted-foreground">/month</span>}
          </div>
          <ul className="mt-4 space-y-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-primary">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link href={href} className="mt-6 block">
            <Button
              className="w-full"
              variant={primary ? "default" : "outline"}
              id={`plan-${name.toLowerCase()}-btn`}
            >
              {cta}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────

export default function LandingPage() {
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true });

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
        {/* Background gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Robot mascot */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <RobotAssistant state="idle" size={140} />
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                🇮🇳 Built for Indian Students · SIH2
              </span>
            </motion.div>

            <motion.h1
              className="font-heading text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Find Your Perfect
              <br />
              <span className="text-primary">Career Path</span> with AI
            </motion.h1>

            <motion.p
              className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              AI-powered career counselling tailored to the Indian education system.
              Get personalized roadmaps, exam guidance, college matches, and a dedicated mentor.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link href="/auth">
                <Button size="lg" className="gap-2 px-8 text-base" id="hero-cta-btn">
                  🧠 Start Free Assessment
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="lg" className="gap-2 px-8 text-base" id="hero-chat-btn">
                  💬 Talk to AI First
                </Button>
              </Link>
            </motion.div>

            <motion.p
              className="mt-4 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Free to start · No credit card required · Results in 3 minutes
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-muted-foreground/40 pt-1">
            <motion.div
              className="h-2 w-1 rounded-full bg-muted-foreground/60"
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Everything you need to plan your career
            </h2>
            <p className="mt-3 text-muted-foreground">Powered by Gemini AI, designed for India</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon="🧠" title="AI Assessment" desc="Take a 6-step assessment and get a personalized career roadmap generated by Gemini 2.0 Flash." />
            <FeatureCard icon="🗺️" title="Career Roadmap" desc="Get 2-4 detailed career paths with entrance exams, top colleges, and future demand forecasts." />
            <FeatureCard icon="💬" title="AI Chatbot" desc="Chat with an AI counsellor that becomes personalized once you complete your assessment." />
            <FeatureCard icon="👨‍🏫" title="Mentor Matching" desc="Get matched with an industry professional who's been down your exact career path." />
            <FeatureCard icon="📄" title="PDF Report" desc="Download a detailed PDF report of your assessment, career paths, and exam guidance." />
            <FeatureCard icon="🎤" title="Voice Commands" desc="Navigate the platform hands-free with voice commands using your browser's speech recognition." />
          </div>
        </div>
      </section>

      {/* ── Story scroll narrative ── */}
      <section ref={storyRef} className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              From confusion to career clarity
            </h2>
            <p className="mt-3 text-muted-foreground">
              One student's journey with AI Career Counsellor
            </p>
          </div>

          <div className="space-y-14">
            <StoryPanel
              icon="😕"
              index={0}
              title="Arjun didn't know what to do after 12th"
              text="Like millions of Indian students, Arjun finished his PCM stream but had no idea which path to take. Engineering? Medicine? MBA? He was overwhelmed by choices and conflicting advice."
            />
            <StoryPanel
              icon="🧠"
              index={1}
              title="He took the 3-minute AI Assessment"
              text="Arjun answered 6 simple questions about his skills, interests, and goals. Our Gemini-powered AI analyzed his profile in the context of the Indian education system and job market."
            />
            <StoryPanel
              icon="🗺️"
              index={2}
              title="He received a personalized Career Roadmap"
              text="In seconds, Arjun had 3 tailored career paths: Software Engineering, Data Science, and Product Management — each with specific JEE/BITSAT guidance, IIT/NIT matches, and hiring companies."
            />
            <StoryPanel
              icon="👨‍🏫"
              index={3}
              title="He got matched with a mentor"
              text="Our system automatically suggested a mentor from IIT Bombay who'd taken the exact same path. Arjun connected with someone who could give him real, specific, been-there advice."
            />
            <StoryPanel
              icon="🎓"
              index={4}
              title="Arjun got into his dream college"
              text="With a clear roadmap, a dedicated mentor, and AI-powered guidance, Arjun cracked JEE Advanced and joined IIT Delhi's CS program. Your story starts here."
            />
          </div>
        </div>
      </section>

      {/* ── Premium pitch ── */}
      <section className="bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Choose your plan
            </h2>
            <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row">
            <PlanCard
              name="Free"
              price="Free"
              cta="Get Started Free"
              href="/auth"
              features={[
                "1 AI Assessment",
                "50 AI chat messages",
                "Career roadmap",
                "Basic exam guidance",
                "Core course catalog",
              ]}
            />
            <PlanCard
              name="Premium"
              price="₹999"
              cta="Upgrade to Premium"
              href="/auth"
              primary
              features={[
                "Unlimited AI assessments",
                "Unlimited AI chat",
                "Full syllabus access",
                "India college alignment",
                "Personal mentorship",
                "Extended course catalog",
                "PDF report downloads",
                "Priority mentor matching",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="px-4 py-20 text-center">
        <motion.div
          className="mx-auto max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <RobotAssistant state="idle" size={100} className="mx-auto" />
          <h2 className="mt-6 font-heading text-3xl font-bold md:text-4xl">
            Ready to find your path?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of Indian students getting AI-powered career guidance
          </p>
          <Link href="/auth" className="mt-8 inline-block">
            <Button size="lg" className="gap-2 px-10 text-base" id="footer-cta-btn">
              🚀 Start Your Journey — It's Free
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-4 py-8 text-center text-xs text-muted-foreground">
        <p>AI Career Counsellor · Smart India Hackathon 2 (SIH2)</p>
        <p className="mt-1">Built with Next.js · Supabase · Gemini AI · Razorpay</p>
      </footer>
    </div>
  );
}