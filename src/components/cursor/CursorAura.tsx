'use client';

import { useEffect, useRef } from 'react';

/**
 * CursorAura — a pure ambient brightness/light aura around the pointer.
 * No solid circle/dot — just a smooth luminous radial glow.
 */
export default function CursorAura() {
  const outerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -400, y: -400 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      if (outerRef.current) {
        outerRef.current.style.left = `${pos.current.x}px`;
        outerRef.current.style.top = `${pos.current.y}px`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      aria-hidden
      className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2"
      style={{ willChange: 'left, top' }}
    >
      {/* Pure ambient light aura around pointer — no solid dot or ring */}
      <div
        className="h-72 w-72 rounded-full"
        style={{
          background:
            'radial-gradient(circle, oklch(0.65 0.22 264 / 0.22) 0%, oklch(0.6 0.2 280 / 0.1) 40%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
    </div>
  );
}
