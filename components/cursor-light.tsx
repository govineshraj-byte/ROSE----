"use client";

import { useEffect, useState } from "react";

export function CursorLight() {
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      !window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let tx = -400;
    let ty = -400;
    let cx = -400;
    let cy = -400;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      setPos({ x: cx, y: cy });
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{
        background: `radial-gradient(520px circle at ${pos.x}px ${pos.y}px, color-mix(in srgb, var(--primary) 9%, transparent), transparent 65%)`,
      }}
    />
  );
}
