"use client";

import { useEffect, useMemo, useRef } from "react";

export type RoseMode = "real" | "sketch";

/* Deterministic pseudo-random for stable hand-drawn jitter */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Layer = {
  count: number;
  rBase: number; // base distance from center (× R)
  rOut: number; // open distance from center (× R)
  size: number; // petal length (× R)
  width: number; // petal width (× R)
  start: number; // bloom window start
  end: number; // bloom window end
  offset: number; // angular offset
};

const LAYERS: Layer[] = [
  { count: 9, rBase: 0.1, rOut: 0.62, size: 0.78, width: 0.5, start: 0.0, end: 0.55, offset: 0.0 },
  { count: 8, rBase: 0.08, rOut: 0.5, size: 0.7, width: 0.46, start: 0.1, end: 0.68, offset: 0.4 },
  { count: 7, rBase: 0.06, rOut: 0.38, size: 0.6, width: 0.42, start: 0.25, end: 0.82, offset: 0.75 },
  { count: 5, rBase: 0.04, rOut: 0.24, size: 0.48, width: 0.36, start: 0.42, end: 0.94, offset: 1.1 },
  { count: 4, rBase: 0.02, rOut: 0.12, size: 0.36, width: 0.3, start: 0.58, end: 1.0, offset: 1.5 },
];

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

function petalPath(
  ctx: CanvasRenderingContext2D,
  len: number,
  wid: number,
  curl: number
) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(
    -wid, -len * 0.25,
    -wid * (0.9 + curl * 0.35), -len * 0.72,
    -wid * 0.14 - curl * wid * 0.3, -len
  );
  ctx.quadraticCurveTo(0, -len - curl * len * 0.2, wid * 0.14 + curl * wid * 0.3, -len);
  ctx.bezierCurveTo(
    wid * (0.9 + curl * 0.35), -len * 0.72,
    wid, -len * 0.25,
    0, 0
  );
  ctx.closePath();
}

type Seed = { j1: number; j2: number; dew: { x: number; y: number } | null };

export function RoseCanvas({
  bloom,
  mode,
  isDark,
  tilt,
  className,
  label,
}: {
  bloom: number; // target 0..1 (ref-driven by parent via prop each render)
  mode: RoseMode;
  isDark: boolean;
  tilt: { x: number; y: number };
  className?: string;
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    current: 0.55,
    tiltX: 0,
    tiltY: 0,
    spin: 0,
    t: 0,
  });
  const props = useRef({ bloom, mode, isDark, tilt });
  useEffect(() => {
    props.current = { bloom, mode, isDark, tilt };
  });

  const seeds = useMemo<Seed[][]>(
    () =>
      LAYERS.map((l, li) => {
        const rnd = mulberry32(1234 + li * 777);
        return Array.from({ length: l.count }).map(() => ({
          j1: (rnd() - 0.5) * 0.16,
          j2: (rnd() - 0.5) * 0.1,
          dew: rnd() > 0.55 ? { x: (rnd() - 0.5) * 1.4, y: -0.5 - rnd() * 0.4 } : null,
        }));
      }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reduce) {
      state.current.current = props.current.bloom;
    }

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state.current;
      const p = props.current;

      // ease current toward target in real time
      const k = reduce ? 1 : 1 - Math.exp(-dt * 3.2);
      s.current += (p.bloom - s.current) * k;
      if (Math.abs(p.bloom - s.current) < 0.0005) s.current = p.bloom;
      s.t += dt;
      if (!reduce) s.spin += dt * 0.05;
      s.tiltX += (p.tilt.x - s.tiltX) * (1 - Math.exp(-dt * 5));
      s.tiltY += (p.tilt.y - s.tiltY) * (1 - Math.exp(-dt * 5));

      const b = s.current;
      const W = canvas.width;
      const H = canvas.height;
      const R = Math.min(W, H) * 0.3;
      const cx = W / 2 + (s.tiltY / 8) * R * 0.4;
      const cy = H * 0.42 + (s.tiltX / 8) * R * 0.3 + Math.sin(s.t * 0.9) * R * 0.012;
      const breathe = 1 + Math.sin(s.t * 1.1) * 0.008;

      ctx.clearRect(0, 0, W, H);

      const sketch = p.mode === "sketch";

      // paper wash for sketch mode
      if (sketch) {
        ctx.fillStyle = p.isDark ? "#191411" : "#f6f1e6";
        ctx.fillRect(0, 0, W, H);
      }

      // stem + leaves
      const stemTopY = cy + R * 0.5;
      const stemBotY = H * 0.98;
      ctx.save();
      ctx.strokeStyle = sketch
        ? p.isDark
          ? "rgba(207,196,184,0.85)"
          : "rgba(74,63,58,0.85)"
        : p.isDark
          ? "#33402c"
          : "#47663c";
      ctx.lineWidth = Math.max(2, R * 0.035);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, stemTopY);
      ctx.quadraticCurveTo(cx + R * 0.12, (stemTopY + stemBotY) / 2, cx - R * 0.06, stemBotY);
      ctx.stroke();
      // leaves
      const leaf = (side: 1 | -1, yy: number, sc: number) => {
        ctx.save();
        ctx.translate(cx + side * R * 0.05, yy);
        ctx.rotate(side * 1.05);
        ctx.scale(sc * side, sc);
        if (sketch) {
          ctx.strokeStyle = p.isDark ? "rgba(207,196,184,0.8)" : "rgba(74,63,58,0.8)";
          ctx.lineWidth = Math.max(1.2, R * 0.008);
          petalPath(ctx, R * 0.75, R * 0.3, 0.15);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -R * 0.75);
          ctx.stroke();
        } else {
          const g = ctx.createLinearGradient(0, 0, 0, -R * 0.75);
          if (p.isDark) {
            g.addColorStop(0, "#2c3826");
            g.addColorStop(1, "#5a6e4c");
          } else {
            g.addColorStop(0, "#3d5c33");
            g.addColorStop(1, "#7fa06a");
          }
          ctx.fillStyle = g;
          petalPath(ctx, R * 0.75, R * 0.3, 0.15);
          ctx.fill();
        }
        ctx.restore();
      };
      leaf(1, stemTopY + (stemBotY - stemTopY) * 0.35, 1);
      leaf(-1, stemTopY + (stemBotY - stemTopY) * 0.6, 0.8);
      ctx.restore();

      // soft glow bed (real mode)
      if (!sketch) {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.4);
        glow.addColorStop(0, p.isDark ? "rgba(150,35,58,0.4)" : "rgba(220,80,110,0.28)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(cx - R * 2.4, cy - R * 2.4, R * 4.8, R * 4.8);
      } else {
        // faint construction circle
        ctx.save();
        ctx.strokeStyle = p.isDark ? "rgba(207,196,184,0.16)" : "rgba(74,63,58,0.16)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - R * 1.3, cy);
        ctx.lineTo(cx + R * 1.3, cy);
        ctx.moveTo(cx, cy - R * 1.3);
        ctx.lineTo(cx, cy + R * 1.3);
        ctx.stroke();
        ctx.restore();
      }

      // petals outer → inner
      LAYERS.forEach((layer, li) => {
        const o = smooth((b - layer.start) / (layer.end - layer.start));
        if (o <= 0.001) return;
        const layerSeeds = seeds[li];
        for (let i = 0; i < layer.count; i++) {
          const sd = layerSeeds[i];
          const a =
            layer.offset + (i / layer.count) * Math.PI * 2 + s.spin * (li % 2 === 0 ? 1 : -1) * 0.4 + sd.j1;
          const dist = (layer.rBase + (layer.rOut - layer.rBase) * o) * R * breathe;
          const len = layer.size * R * (0.25 + 0.75 * o) * breathe;
          const wid = layer.width * R * (0.3 + 0.7 * o);
          const curl = o;
          const px = cx + Math.cos(a + Math.PI / 2 + s.tiltY * 0.01) * dist;
          const py = cy + Math.sin(a + Math.PI / 2 + s.tiltY * 0.01) * dist * 0.92;

          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(a + s.tiltY * 0.012 + sd.j2);

          if (sketch) {
            const ink = p.isDark ? "207,196,184" : "74,63,58";
            // pencil: layered jittered strokes
            for (let pass = 0; pass < 3; pass++) {
              ctx.strokeStyle = `rgba(${ink},${pass === 0 ? 0.75 : 0.28})`;
              ctx.lineWidth = pass === 0 ? Math.max(1.2, R * 0.009) : 1;
              ctx.save();
              ctx.translate((sd.j1 * 40 * (pass + 1)) % 3, (sd.j2 * 40 * (pass + 1)) % 3);
              petalPath(ctx, len, wid, curl);
              ctx.stroke();
              ctx.restore();
            }
            // hatch shading near base
            ctx.strokeStyle = `rgba(${ink},0.22)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            const hn = 4;
            for (let h = 0; h < hn; h++) {
              const hy = -len * (0.08 + h * 0.07);
              const hw = wid * (0.5 - h * 0.06);
              ctx.moveTo(-hw, hy);
              ctx.lineTo(hw * 0.4, hy - len * 0.05);
            }
            ctx.stroke();
            // inner blush line on open petals
            if (o > 0.6) {
              ctx.strokeStyle = `rgba(${ink},0.4)`;
              ctx.beginPath();
              ctx.moveTo(0, -len * 0.35);
              ctx.quadraticCurveTo(wid * 0.3, -len * 0.7, 0, -len * 0.92);
              ctx.stroke();
            }
          } else {
            petalPath(ctx, len, wid, curl);
            const g = ctx.createLinearGradient(0, 0, 0, -len);
            if (p.isDark) {
              g.addColorStop(0, "#5e1425");
              g.addColorStop(0.55, "#96233a");
              g.addColorStop(1, "#d06074");
            } else {
              g.addColorStop(0, "#8e1f33");
              g.addColorStop(0.55, "#c92b4a");
              g.addColorStop(1, "#f08395");
            }
            ctx.fillStyle = g;
            ctx.shadowColor = "rgba(90,10,25,0.35)";
            ctx.shadowBlur = R * 0.08;
            ctx.shadowOffsetY = R * 0.02;
            ctx.fill();
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
            ctx.strokeStyle = p.isDark ? "rgba(40,8,16,0.6)" : "rgba(120,20,40,0.45)";
            ctx.lineWidth = Math.max(1, R * 0.006);
            ctx.stroke();
            // rim light on curled edge
            if (o > 0.35) {
              ctx.strokeStyle = "rgba(255,255,255,0.55)";
              ctx.lineWidth = Math.max(1, R * 0.008);
              ctx.beginPath();
              ctx.moveTo(-wid * 0.14 - curl * wid * 0.3, -len);
              ctx.quadraticCurveTo(0, -len - curl * len * 0.2, wid * 0.14 + curl * wid * 0.3, -len);
              ctx.stroke();
            }
            // dew drop
            if (sd.dew && o > 0.5) {
              const dx = sd.dew.x * wid * 0.5;
              const dy = sd.dew.y * len;
              const dg = ctx.createRadialGradient(dx - 1, dy - 1, 0, dx, dy, R * 0.03);
              dg.addColorStop(0, "rgba(255,255,255,0.95)");
              dg.addColorStop(1, "rgba(255,255,255,0.15)");
              ctx.fillStyle = dg;
              ctx.beginPath();
              ctx.arc(dx, dy, R * 0.03, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();
        }
      });

      // bud heart — spiral that unwinds with bloom
      const ob = smooth((b - 0.58) / 0.42);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(s.spin * 0.8);
      if (sketch) {
        const ink = p.isDark ? "207,196,184" : "74,63,58";
        ctx.strokeStyle = `rgba(${ink},0.85)`;
        ctx.lineWidth = Math.max(1.3, R * 0.01);
        for (let s2 = 0; s2 < 3; s2++) {
          ctx.beginPath();
          const r0 = R * (0.05 + s2 * 0.055) * (0.6 + ob * 0.7);
          for (let a2 = 0; a2 < Math.PI * 2.6; a2 += 0.12) {
            const rr = r0 * (1 + a2 * 0.16 * (0.5 + ob));
            const x = Math.cos(a2 + s2) * rr;
            const y = Math.sin(a2 + s2) * rr;
            if (a2 === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else {
        const bg = ctx.createRadialGradient(-R * 0.03, -R * 0.04, 0, 0, 0, R * 0.24 * (0.6 + ob * 0.7));
        if (p.isDark) {
          bg.addColorStop(0, "#e08a97");
          bg.addColorStop(0.6, "#a52840");
          bg.addColorStop(1, "#5e1425");
        } else {
          bg.addColorStop(0, "#f4909f");
          bg.addColorStop(0.6, "#cf3353");
          bg.addColorStop(1, "#7e1c30");
        }
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(0, 0, R * 0.2 * (0.55 + ob * 0.75), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = Math.max(1, R * 0.007);
        ctx.beginPath();
        for (let a2 = 0; a2 < Math.PI * 2.4; a2 += 0.15) {
          const rr = R * 0.03 * (1 + a2 * 0.22 * (0.5 + ob));
          const x = Math.cos(a2) * rr;
          const y = Math.sin(a2) * rr;
          if (a2 === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [seeds]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label ?? "Real-time blooming rose, drawn live"}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
