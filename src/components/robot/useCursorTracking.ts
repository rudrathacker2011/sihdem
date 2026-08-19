"use client";

import { useEffect, useRef, useState } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

interface EyeRef {
  left: React.RefObject<HTMLDivElement | null>;
  right: React.RefObject<HTMLDivElement | null>;
}

export function useCursorTracking(): {
  leftPupilStyle: React.CSSProperties;
  rightPupilStyle: React.CSSProperties;
} {
  const [cursor, setCursor] = useState<CursorPosition>({ x: 0, y: 0 });
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const [leftStyle, setLeftStyle] = useState<React.CSSProperties>({});
  const [rightStyle, setRightStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    function computeStyle(eyeEl: HTMLDivElement | null): React.CSSProperties {
      if (!eyeEl) return {};
      const rect = eyeEl.getBoundingClientRect();
      const eyeCx = rect.left + rect.width / 2;
      const eyeCy = rect.top + rect.height / 2;
      const angle = Math.atan2(cursor.y - eyeCy, cursor.x - eyeCx);
      const maxDist = 4; // max pixels pupil moves
      const tx = Math.cos(angle) * maxDist;
      const ty = Math.sin(angle) * maxDist;
      return { transform: `translate(${tx}px, ${ty}px)` };
    }

    setLeftStyle(computeStyle(leftEyeRef.current));
    setRightStyle(computeStyle(rightEyeRef.current));
  }, [cursor]);

  return {
    leftPupilStyle: leftStyle,
    rightPupilStyle: rightStyle,
  };
}

// ─── Export refs for external use ────────────────────────────────────────────

export function useEyeRefs() {
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  return { leftEyeRef, rightEyeRef };
}
