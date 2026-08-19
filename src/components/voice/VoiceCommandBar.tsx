"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalAiResponse } from "@/lib/ai/localAiEngine";

interface VoiceCommandBarProps {
  onRobotStateChange?: (state: "idle" | "listening" | "thinking" | "speaking") => void;
  onVoiceQuery?: (query: string) => void;
}

export default function VoiceCommandBar({
  onRobotStateChange,
  onVoiceQuery,
}: VoiceCommandBarProps) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiSpeechText, setAiSpeechText] = useState("");
  const [supported, setSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Feature detect
  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    );
  }, []);

  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    // Clean markdown hashes/stars for natural speech
    const clean = text.replace(/[#*`_]/g, "").slice(0, 280);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = "en-IN";
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => onRobotStateChange?.("speaking");
    utterance.onend = () => {
      onRobotStateChange?.("idle");
      setAiSpeechText("");
    };
    utterance.onerror = () => {
      onRobotStateChange?.("idle");
      setAiSpeechText("");
    };

    window.speechSynthesis.speak(utterance);
  }, [onRobotStateChange]);

  const handleResult = useCallback(
    (text: string) => {
      setTranscript(text);
      const lower = text.toLowerCase().trim();

      // Navigation Command Matching
      if (lower.includes("assessment") || lower.includes("start test") || lower.includes("test")) {
        speakText("Opening Discovery Assessment for you.");
        router.push("/assessment");
      } else if (lower.includes("roadmap") || lower.includes("career path") || lower.includes("gps")) {
        speakText("Opening your GPS Career Roadmap.");
        router.push("/roadmap");
      } else if (lower.includes("matrix") || lower.includes("careers") || lower.includes("explorer")) {
        speakText("Navigating to Career Compatibility Matrix.");
        router.push("/careers");
      } else if (lower.includes("battle") || lower.includes("compare")) {
        speakText("Opening 1v1 Career Battle.");
        router.push("/career-battle");
      } else if (lower.includes("what if") || lower.includes("simulator")) {
        speakText("Opening What-If Studio.");
        router.push("/what-if");
      } else if (lower.includes("simulation") || lower.includes("lab") || lower.includes("game")) {
        speakText("Opening Career Simulations.");
        router.push("/simulations");
      } else if (lower.includes("leaderboard") || lower.includes("points") || lower.includes("xp")) {
        speakText("Opening Leaderboard and Achievements.");
        router.push("/leaderboard");
      } else if (lower.includes("account") || lower.includes("profile")) {
        speakText("Opening your account settings.");
        router.push("/account");
      } else if (lower.includes("dashboard") || lower.includes("home")) {
        speakText("Returning to Dashboard.");
        router.push("/dashboard");
      } else {
        // Spoken AI Question
        if (onVoiceQuery) {
          onVoiceQuery(text);
        } else {
          const answer = getLocalAiResponse(text);
          setAiSpeechText(answer);
          speakText(answer);
        }
      }

      setTimeout(() => setTranscript(""), 4500);
    },
    [router, speakText, onVoiceQuery]
  );

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new SpeechRecognitionCtor();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      onRobotStateChange?.("listening");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      handleResult(text);
    };

    recognition.onend = () => {
      setIsListening(false);
      onRobotStateChange?.("idle");
    };

    recognition.onerror = () => {
      setIsListening(false);
      onRobotStateChange?.("idle");
    };

    recognition.start();
  }, [handleResult, onRobotStateChange]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    onRobotStateChange?.("idle");
  }, [onRobotStateChange]);

  if (!supported) return null;

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        {transcript && (
          <motion.div
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm"
            initial={{ opacity: 0, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -10 }}
          >
            <span>🎤</span>
            <span className="max-w-[180px] truncate">&quot;{transcript}&quot;</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        id="voice-command-btn"
        onClick={isListening ? stopListening : startListening}
        className={`relative flex h-8.5 w-8.5 items-center justify-center rounded-xl border transition-all ${
          isListening
            ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30"
            : "border-border/60 bg-card/80 text-foreground hover:border-primary/40 hover:bg-accent"
        }`}
        whileTap={{ scale: 0.94 }}
        title={isListening ? "Listening... click to stop" : "Voice command (Ask anything or navigate)"}
      >
        {isListening && (
          <motion.span
            className="absolute inset-0 rounded-xl bg-primary/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </motion.button>
    </div>
  );
}
