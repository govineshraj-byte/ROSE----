"use client";

import { Suspense, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { RoseModel } from "./rose-model";
import { FallingPetals } from "./falling-petals";

function Pollen({ isDark, count = 110 }: { isDark: boolean; count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.sin(i * 12.9898) * 43758.5453;
      const b = Math.sin(i * 78.233 + 1.3) * 24634.6345;
      const c = Math.sin(i * 37.719 + 2.1) * 56445.2345;
      const r1 = a - Math.floor(a);
      const r2 = b - Math.floor(b);
      const r3 = c - Math.floor(c);
      arr[i * 3] = (r1 - 0.5) * 10;
      arr[i * 3 + 1] = (r2 - 0.5) * 8 + 1;
      arr[i * 3 + 2] = (r3 - 0.5) * 6 - 1;
    }
    return arr;
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={isDark ? "#d4af6a" : "#d9a05a"}
        transparent
        opacity={isDark ? 0.75 : 0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig({ isDark }: { isDark: boolean }) {
  const { camera, pointer } = useThree();
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const reduce = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!reduce) {
        camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.03;
        camera.position.y +=
          ((isDark ? 0.9 : 1.1) + pointer.y * 0.4 - camera.position.y) * 0.03;
        camera.lookAt(0, 0.4, 0);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [camera, pointer, isDark]);
  return null;
}

export function RoseScene({
  bloom = 0.55,
  petals = true,
  showRose = true,
  petalCount,
  className,
  label = "Interactive 3D rose",
}: {
  bloom?: number;
  petals?: boolean;
  showRose?: boolean;
  petalCount?: number;
  className?: string;
  label?: string;
}) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [webglOk] = useState(() => {
    if (typeof document === "undefined") return true;
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") ?? c.getContext("webgl");
      return !!gl;
    } catch {
      return false;
    }
  });
  const [mobile, setMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  if (!webglOk) {
    return (
      <div
        role="img"
        aria-label={label + " (static fallback)"}
        className={className}
        style={{
          background: isDark
            ? "radial-gradient(60% 60% at 50% 40%, #6d1a2d 0%, #241318 55%, #141010 100%)"
            : "radial-gradient(60% 60% at 50% 40%, #ffd9de 0%, #fff1e6 55%, #fffbf5 100%)",
          minHeight: 420,
        }}
      />
    );
  }

  const count =
    petalCount ?? (mobile ? 16 : 38);

  return (
    <div className={className} role="img" aria-label={label}>
      <Canvas
        dpr={[1, mobile ? 1.4 : 1.8]}
        camera={{ position: [0, 1.1, 5.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        shadows
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isDark ? 0.55 : 0.75} color={isDark ? "#8a7a80" : "#fff4e6"} />
          <directionalLight
            position={[3.5, 5, 3]}
            intensity={isDark ? 1.5 : 2.1}
            color={isDark ? "#ffd9a8" : "#fff1dd"}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-4, 2.5, -2]}
            intensity={isDark ? 0.9 : 0.55}
            color={isDark ? "#8e2440" : "#ffc9d4"}
          />
          <pointLight
            position={[0, 0.8, 2.4]}
            intensity={isDark ? 12 : 6}
            distance={9}
            color={isDark ? "#c65d70" : "#ff9eb0"}
          />
          <spotLight
            position={[0, 6, 1]}
            angle={0.5}
            penumbra={0.9}
            intensity={isDark ? 60 : 40}
            color={isDark ? "#e8b06a" : "#ffffff"}
          />
          {showRose && <RoseModel bloom={bloom} isDark={isDark} />}
          {petals && <FallingPetals count={count} isDark={isDark} />}
          <Pollen isDark={isDark} count={mobile ? 50 : 110} />
          <Rig isDark={isDark} />
          <fog attach="fog" args={[isDark ? "#141010" : "#fffbf5", 9, 16]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
