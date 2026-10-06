"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Seed = {
  x: number;
  y: number;
  z: number;
  speed: number;
  sway: number;
  phase: number;
  rot: number;
  rotSpeed: number;
  scale: number;
};

function petalGeo() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.28, 0.08, 0.34, 0.42, 0, 0.55);
  s.bezierCurveTo(-0.34, 0.42, -0.28, 0.08, 0, 0);
  const g = new THREE.ShapeGeometry(s, 8);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    p.setZ(i, Math.abs(p.getX(i)) * 0.45 + p.getY(i) * 0.18);
  }
  g.computeVertexNormals();
  return g;
}

export function FallingPetals({
  count = 36,
  isDark = false,
}: {
  count?: number;
  isDark?: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => petalGeo(), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(isDark ? "#b45063" : "#e58a9b"),
        roughness: 0.55,
        transparent: true,
        opacity: isDark ? 0.85 : 0.92,
        side: THREE.DoubleSide,
      }),
    [isDark]
  );

  const seeds: Seed[] = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        x: (Math.sin(i * 12.9898) * 0.5 + 0.5) * 12 - 6,
        y: ((i * 1.37) % 10) - 3,
        z: (Math.cos(i * 78.233) * 0.5 + 0.5) * 6 - 4,
        speed: 0.28 + ((i * 7) % 10) / 10 * 0.55,
        sway: 0.4 + ((i * 3) % 10) / 10 * 0.9,
        phase: (i * 1.7) % (Math.PI * 2),
        rot: (i * 2.3) % (Math.PI * 2),
        rotSpeed: 0.4 + ((i * 5) % 10) / 10 * 1.2,
        scale: 0.35 + ((i * 11) % 10) / 10 * 0.75,
      })),
    [count]
  );

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.getElapsedTime();
    seeds.forEach((s, i) => {
      let y = s.y - (reduce ? 0 : t * s.speed * 0.45) % 10;
      if (y < -3.2) y += 10;
      const x = s.x + Math.sin(t * 0.5 * s.sway + s.phase) * 0.7;
      const z = s.z + Math.cos(t * 0.3 + s.phase) * 0.25;
      dummy.position.set(x, y, z);
      dummy.rotation.set(
        s.rot + (reduce ? 0 : t * s.rotSpeed * 0.4),
        s.phase + t * 0.25,
        Math.sin(t * 0.6 + s.phase) * 0.6
      );
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[geo, mat, count]}
      frustumCulled={false}
    />
  );
}
