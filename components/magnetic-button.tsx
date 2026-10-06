"use client";

import { motion } from "motion/react";
import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  strength = 0.25,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function onMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setOffset({ x: x * strength, y: y * strength });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
