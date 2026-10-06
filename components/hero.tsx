"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, ArrowRight, BookOpen } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { MagneticButton } from "./magnetic-button";

const RoseScene = dynamic(
  () => import("./rose-scene").then((m) => m.RoseScene),
  { ssr: false, loading: () => <div className="h-full w-full" aria-hidden /> }
);

function PhotoCard() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${-py * 7}deg) rotateY(${px * 9}deg)`;
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[420px]"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => {
          if (ref.current) ref.current.style.transform = "";
        }}
        className="relative overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-border shadow-[0_50px_100px_-40px_rgba(166,38,57,0.5)] transition-transform duration-300 will-change-transform"
      >
        <Image
          src="/roses/hero-red.jpg"
          alt="Close-up photograph of a dew-covered red rose in full bloom"
          width={840}
          height={1120}
          priority
          sizes="(max-width: 1024px) 80vw, 420px"
          className="aspect-[3/4] w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent dark:from-black/65"
        />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-white/80 uppercase">
              N° 04 — Live specimen
            </p>
            <p className="font-display text-2xl text-white">
              Damask, morning dew
            </p>
          </div>
          <span className="glass rounded-full border border-white/30 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-white uppercase">
            Real bloom
          </span>
        </div>
      </div>

      <div className="glass absolute -top-4 -right-3 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-lg backdrop-blur sm:-right-8">
        <p className="font-display text-2xl leading-none text-foreground">100%</p>
        <p className="mt-1 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Real petals
        </p>
      </div>
      <div className="glass absolute -bottom-5 -left-3 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-lg backdrop-blur sm:-left-8">
        <p className="font-display text-2xl leading-none text-foreground">4K</p>
        <p className="mt-1 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Garden macro
        </p>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section
      id="home"
      aria-label="Where Beauty Blooms"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 70% 30%, color-mix(in srgb, var(--primary) 10%, transparent), transparent 60%), radial-gradient(70% 60% at 20% 80%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%)",
        }}
      />

      {/* cinematic falling petals over everything */}
      <RoseScene
        showRose={false}
        petalCount={30}
        className="pointer-events-none absolute inset-0 h-full w-full"
        label="Falling rose petals drifting through the hero"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pt-24 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Luxury Botanical · Real Photography
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="font-display text-balance text-6xl leading-[0.95] font-medium tracking-tight text-foreground sm:text-7xl lg:text-8xl"
          >
            Where Beauty
            <span className="block italic text-primary">Blooms.</span>
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg"
          >
            A digital experience inspired by the timeless elegance, emotion
            and mystery of a rose.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <a
                href="#experience"
                className="inline-flex h-13 cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground shadow-[0_18px_40px_-16px_var(--primary)] transition hover:brightness-110"
              >
                Explore the Bloom
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="#story"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card/70 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:border-primary/50 hover:bg-card"
              >
                <BookOpen className="h-4 w-4" aria-hidden />
                Discover the Story
              </a>
            </MagneticButton>
          </motion.div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border/80 pt-6">
            {[
              ["6", "Real specimens"],
              ["5", "Cultivars"],
              ["4.9", "Editorial rating"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl text-foreground">{v}</dd>
                <dd className="mt-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <PhotoCard />
      </div>

      <a
        href="#story"
        className="absolute bottom-6 left-1/2 z-10 inline-flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase backdrop-blur transition hover:text-foreground"
        aria-label="Scroll to story section"
      >
        Scroll to bloom
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
