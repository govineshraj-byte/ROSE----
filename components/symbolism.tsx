"use client";

import { Eye, Flame, Gem, Heart } from "lucide-react";
import { useRef } from "react";
import { Reveal } from "./reveal";

const CARDS = [
  {
    icon: Heart,
    title: "LOVE",
    text: "The timeless language of affection.",
    detail: "Given without explanation. Kept without reason.",
  },
  {
    icon: Flame,
    title: "PASSION",
    text: "Intensity captured in every petal.",
    detail: "A color that raises the temperature of a room.",
  },
  {
    icon: Gem,
    title: "ELEGANCE",
    text: "Beauty expressed through simplicity.",
    detail: "Nothing extra. Nothing missing.",
  },
  {
    icon: Eye,
    title: "MYSTERY",
    text: "A flower that always leaves something unsaid.",
    detail: "What you don't see is the point.",
  },
];

function TiltCard({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLElement>(null);
  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateY(-4px)`;
  }
  return (
    <article
      ref={ref as unknown as React.Ref<HTMLElement>}
      aria-label={label}
      onMouseMove={onMove}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
      className="group rounded-3xl border border-border bg-card p-7 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.45)] transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:border-primary/40 hover:shadow-[0_30px_70px_-28px_var(--primary)]"
      tabIndex={0}
    >
      {children}
    </article>
  );
}

export function Symbolism() {
  return (
    <section
      id="symbolism"
      aria-label="Symbolism"
      className="relative py-12 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
            02 — Symbolism
          </p>
          <h2 className="font-display mt-4 text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Four meanings, <span className="italic">one flower.</span>
          </h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            Hover to feel depth. Tap to focus. Every card keeps quiet
            typography and one soft petal glow.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <TiltCard label={`${c.title}: ${c.text}`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-6 text-sm font-bold tracking-[0.3em]">
                  {c.title}
                </h3>
                <p className="font-display mt-3 text-xl leading-snug">
                  {c.text}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {c.detail}
                </p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
