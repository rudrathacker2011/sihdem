"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceCommandBarProps {
  onRobotStateChange?: (state: "idle" | "listening") => void;
}

export default function VoiceCommandBar({ onRobotStateChange }: VoiceCommandBarProps) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
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

  const handleResult = useCallback(
    (text: string) => {
      setTranscript(text);
      const lower = text.toLowerCase();

      if (lower.includes("assessment") || lower.includes("start test")) {
        router.push("/assessment");
      } else if (lower.includes("roadmap") || lower.includes("career path")) {
        router.push("/roadmap");
      } else if (lower.includes("chat") || lower.includes("talk to assistant")) {
        router.push("/chat");
      } else if (lower.includes("account") || lower.includes("profile")) {
        router.push("/account");
      } else if (lower.includes("dashboard") || lower.includes("home")) {
        router.push("/dashboard");
      }

      setTimeout(() => setTranscript(""), 3000);
    },
    [router]
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
    <div className="flex items-center gap-3">
      <AnimatePresence>
        {transcript && (
          <motion.div
            className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            &quot;{transcript}&quot;
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        id="voice-command-btn"
        onClick={isListening ? stopListening : startListening}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-colors hover:bg-muted"
        whileTap={{ scale: 0.92 }}
        title={isListening ? "Stop listening" : "Voice command"}
      >
        {isListening && (
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke={isListening ? "var(--primary)" : "currentColor"}
          strokeWidth="2"
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
