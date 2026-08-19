"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type RobotState = "idle" | "listening" | "thinking" | "speaking";

interface RobotAssistantProps {
  state?: RobotState;
  size?: number;
  className?: string;
}

export default function RobotAssistant({
  state = "idle",
  size = 120,
  className = "",
}: RobotAssistantProps) {
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  const [blinkState, setBlinkState] = useState(false);

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      function computeOffset(el: SVGCircleElement | null) {
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
        return { x: Math.cos(angle) * 3, y: Math.sin(angle) * 3 };
      }
      setLeftPupil(computeOffset(leftEyeRef.current));
      setRightPupil(computeOffset(rightEyeRef.current));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blink loop (idle only)
  useEffect(() => {
    if (state !== "idle") return;
    const interval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3500);
    return () => clearInterval(interval);
  }, [state]);

  // Antenna indicator color by state
  const antennaColor = {
    idle: "oklch(0.488 0.243 264.376)",
    listening: "oklch(0.7 0.2 150)",  // green
    thinking: "oklch(0.75 0.2 80)",   // amber
    speaking: "oklch(0.65 0.25 30)",  // orange
  }[state];

  // Body animation — inline per state to avoid Variants strict typing issue
  const bodyAnimate = state === "idle"
    ? { y: [0, -3, 0] as number[] }
    : state === "listening"
    ? { scale: [1, 1.02, 1] as number[] }
    : state === "thinking"
    ? { rotate: [-1, 1, -1] as number[] }
    : { y: [0, -2, 0] as number[] };

  const bodyTransition = state === "idle"
    ? { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
    : state === "listening"
    ? { duration: 0.8, repeat: Infinity }
    : state === "thinking"
    ? { duration: 0.5, repeat: Infinity }
    : { duration: 0.4, repeat: Infinity };

  const eyeScaleY = blinkState || state === "thinking" ? 0.1 : 1;

  return (
    <motion.div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
      animate={bodyAnimate}
      transition={bodyTransition}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antenna */}
        <line x1="50" y1="8" x2="50" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        <motion.circle
          cx="50"
          cy="6"
          r="4"
          fill={antennaColor}
          animate={{
            opacity: state === "thinking" ? [1, 0.3, 1] : 1,
            scale: state === "listening" ? [1, 1.4, 1] : 1,
          }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />

        {/* Head */}
        <rect
          x="18"
          y="18"
          width="64"
          height="52"
          rx="16"
          fill="var(--card)"
          stroke="var(--primary)"
          strokeWidth="2.5"
        />

        {/* Left Eye socket */}
        <circle cx="36" cy="42" r="10" fill="var(--muted)" />
        {/* Left Pupil */}
        <motion.circle
          ref={leftEyeRef}
          cx={36 + leftPupil.x}
          cy={42 + leftPupil.y}
          r="5"
          fill="var(--primary)"
          animate={{ scaleY: eyeScaleY }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: `${36}px ${42}px` }}
        />
        {/* Left Eye shine */}
        <circle cx={34 + leftPupil.x} cy={40 + leftPupil.y} r="1.5" fill="white" opacity="0.8" />

        {/* Right Eye socket */}
        <circle cx="64" cy="42" r="10" fill="var(--muted)" />
        {/* Right Pupil */}
        <motion.circle
          ref={rightEyeRef}
          cx={64 + rightPupil.x}
          cy={42 + rightPupil.y}
          r="5"
          fill="var(--primary)"
          animate={{ scaleY: eyeScaleY }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: `${64}px ${42}px` }}
        />
        {/* Right Eye shine */}
        <circle cx={62 + rightPupil.x} cy={40 + rightPupil.y} r="1.5" fill="white" opacity="0.8" />

        {/* Mouth */}
        {state === "speaking" ? (
          <motion.rect
            x="38"
            y="56"
            width="24"
            height="8"
            rx="4"
            fill="var(--primary)"
            animate={{ height: [8, 12, 8, 6, 8] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        ) : state === "thinking" ? (
          <motion.path
            d="M 38 60 Q 50 56 62 60"
            stroke="var(--primary)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={{ d: ["M 38 60 Q 50 56 62 60", "M 38 60 Q 50 60 62 60"] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          />
        ) : (
          <path
            d="M 38 58 Q 50 66 62 58"
            stroke="var(--primary)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Ears */}
        <rect x="10" y="30" width="8" height="20" rx="4" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
        <rect x="82" y="30" width="8" height="20" rx="4" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />

        {/* Body */}
        <rect
          x="28"
          y="72"
          width="44"
          height="22"
          rx="10"
          fill="var(--card)"
          stroke="var(--primary)"
          strokeWidth="2.5"
        />
        {/* Chest button */}
        <circle cx="50" cy="83" r="3" fill="var(--primary)" opacity="0.6" />
        <circle cx="40" cy="83" r="2" fill="var(--muted-foreground)" opacity="0.4" />
        <circle cx="60" cy="83" r="2" fill="var(--muted-foreground)" opacity="0.4" />
      </svg>

      {/* State label bubble */}
      <AnimatePresence>
        {state !== "idle" && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground shadow"
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
          >
            {state === "listening" && "🎤 Listening..."}
            {state === "thinking" && "🧠 Thinking..."}
            {state === "speaking" && "💬 Speaking..."}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
