"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Camera, Flower2, Pause, Pencil, Play, Rotate3d, Sparkles } from "lucide-react";
import { Reveal } from "./reveal";
import { MagneticButton } from "./magnetic-button";
import { RoseCanvas, type RoseMode } from "./rose-canvas";
import { cn } from "@/lib/utils";

/* Stable petal field — fixed seeds so animations never restart while blooming */
const PETALS = Array.from({ length: 18 }).map((_, i) => ({
  left: `${4 + ((i * 53) % 92)}%`,
  delay: `${((i * 0.7) % 5).toFixed(2)}s`,
  dur: `${(6 + ((i * 13) % 5)).toFixed(1)}s`,
  size: 8 + ((i * 7) % 9),
  op: 0.3 + ((i * 3) % 5) / 10,
}));

function stageOf(b: number) {
  if (b < 0.2) return { name: "Resting", hint: "The bud gathers its strength." };
  if (b < 0.5) return { name: "Stirring", hint: "Petals loosen, color deepens." };
  if (b < 0.85) return { name: "Opening", hint: "The bloom unfurls outward." };
  return { name: "Full bloom", hint: "Radiant, open, unforgettable." };
}

function subscribe() {
  return () => {};
}

export function BloomSection() {
  const [bloom, setBloom] = useState(0.55);
  const [mode, setMode] = useState<RoseMode>("real");
  const bloomRef = useRef(0.55);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const frame = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";
  const pct = Math.round(bloom * 100);
  const stage = stageOf(bloom);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setB(v: number) {
    const c = Math.min(1, Math.max(0, v));
    bloomRef.current = c;
    setBloom(c);
  }

  function stop() {
    cancelAnimationFrame(raf.current);
    setPlaying(false);
  }

  function play() {
    if (playing) {
      stop();
      return;
    }
    if (reduce) {
      setB(1);
      return;
    }
    setPlaying(true);
    setB(0);
    const t0 = performance.now();
    const dur = 6000;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setB(eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function onMove(e: React.MouseEvent) {
    const el = frame.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 8, y: px * 10 });
  }

  return (
    <section
      id="experience"
      aria-label="Make it bloom — interactive"
      className="relative overflow-hidden py-12 md:py-20"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 50%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 65%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
            04 — Real-time Bloom
          </p>
          <h2 className="font-display mt-4 text-5xl font-medium tracking-tight sm:text-6xl">
            Make It <span className="italic text-primary">Bloom.</span>
          </h2>
          <p className="mt-5 max-w-md leading-8 text-muted-foreground">
            A living rose, drawn petal-by-petal in real time on canvas — no
            video, no model files. Press play and watch it open, or scrub the
            slider yourself. Flip to Sketch to see the artist&apos;s pencil
            underneath.
          </p>

          <div className="mt-8 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur">
            {/* Real / Sketch toggle */}
            <div
              role="group"
              aria-label="Rendering style"
              className="grid grid-cols-2 gap-1 rounded-full border border-border bg-muted p-1"
            >
              {(
                [
                  { id: "real", label: "Real", icon: Camera },
                  { id: "sketch", label: "Sketch", icon: Pencil },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  aria-pressed={mode === m.id}
                  className={cn(
                    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold tracking-widest uppercase transition",
                    mode === m.id
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <m.icon className="h-4 w-4" aria-hidden />
                  {m.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <label
                htmlFor="bloom-range"
                className="text-xs font-semibold tracking-[0.2em] uppercase"
              >
                Bloom amount
              </label>
              <output
                htmlFor="bloom-range"
                className="font-display text-2xl text-primary tabular-nums"
                aria-live="polite"
              >
                {pct}%
              </output>
            </div>
            <input
              id="bloom-range"
              type="range"
              min={0}
              max={100}
              value={pct}
              onPointerDown={stop}
              onChange={(e) => {
                stop();
                setB(Number(e.target.value) / 100);
              }}
              className="mt-4 w-full cursor-pointer accent-[var(--primary)]"
              aria-describedby="bloom-hint"
            />
            <div className="mt-2 flex items-center justify-between" aria-hidden>
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                Bud
              </span>
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                Full bloom
              </span>
            </div>
            <p
              id="bloom-hint"
              className="mt-3 text-sm text-foreground"
              aria-live="polite"
            >
              <strong className="font-display text-lg italic">
                {stage.name}
              </strong>
              <span className="text-muted-foreground"> — {stage.hint}</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <MagneticButton>
                <button
                  type="button"
                  onClick={play}
                  aria-pressed={playing}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition hover:brightness-110"
                >
                  {playing ? (
                    <Pause className="h-4 w-4" aria-hidden />
                  ) : (
                    <Play className="h-4 w-4" aria-hidden />
                  )}
                  {playing ? "Pause" : "Watch it bloom"}
                </button>
              </MagneticButton>
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => {
                    stop();
                    setB(0.05);
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition hover:border-primary/50"
                >
                  <Flower2 className="h-4 w-4" aria-hidden /> Bud
                </button>
              </MagneticButton>
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => {
                    stop();
                    setB(1);
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition hover:border-primary/50"
                >
                  <Sparkles className="h-4 w-4" aria-hidden /> Full
                </button>
              </MagneticButton>
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => {
                    stop();
                    setB(0.55);
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition hover:border-primary/50"
                >
                  <Rotate3d className="h-4 w-4" aria-hidden /> Reset
                </button>
              </MagneticButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="relative">
          <div
            ref={frame}
            onMouseMove={onMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_40px_90px_-40px_rgba(0,0,0,0.5)]"
            style={{ perspective: 1000 }}
          >
            <div
              className="relative h-[480px] overflow-hidden sm:h-[560px]"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 0.25s ease-out",
                background: mode === "sketch"
                  ? isDark
                    ? "#191411"
                    : "#f6f1e6"
                  : isDark
                    ? "radial-gradient(70% 60% at 50% 38%, #3a1a22 0%, #191214 60%, #100c0d 100%)"
                    : "radial-gradient(70% 60% at 50% 38%, #ffe9e4 0%, #fff6ef 60%, #fbf1e6 100%)",
              }}
            >
              <RoseCanvas
                bloom={bloom}
                mode={mode}
                isDark={isDark}
                tilt={tilt}
                className="absolute inset-0"
                label={`Real-time ${mode} rose at ${pct} percent bloom`}
              />

              {/* petal drift */}
              <div aria-hidden className="absolute inset-0 overflow-hidden">
                {PETALS.map((p, i) =>
                  i / PETALS.length > bloom ? null : (
                    <span
                      key={i}
                      className="absolute rounded-[60%_40%_60%_40%] bg-[#f2a7b5]"
                      style={{
                        left: p.left,
                        top: "-14px",
                        width: p.size,
                        height: p.size * 1.35,
                        opacity: p.op,
                        animation: `bloomfall ${p.dur} ease-in ${p.delay} infinite`,
                      }}
                    />
                  )
                )}
              </div>

              <div className="absolute inset-x-6 bottom-5 flex items-center justify-between">
                <p className="rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-white uppercase backdrop-blur">
                  {mode === "real" ? "Live render" : "Pencil sketch"}
                </p>
                <p
                  className="font-display text-3xl text-white tabular-nums drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  aria-live="polite"
                >
                  {pct}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border px-6 py-4 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              <span>60 fps canvas</span>
              <span>Play · Drag · Sketch</span>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`@keyframes bloomfall{0%{transform:translateY(-16px) rotate(0)}100%{transform:translateY(600px) translateX(24px) rotate(300deg)}}@media (prefers-reduced-motion: reduce){span{animation:none!important}}`}</style>
    </section>
  );
}
