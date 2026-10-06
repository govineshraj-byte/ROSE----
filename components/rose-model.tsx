"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function petalGeometry(width = 1, height = 1.4, cup = 0.35, curl = 0.28) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(width * 0.55, height * 0.1, width * 0.62, height * 0.62, 0, height);
  s.bezierCurveTo(-width * 0.62, height * 0.62, -width * 0.55, height * 0.1, 0, 0);
  const geo = new THREE.ShapeGeometry(s, 14);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const ny = y / height; // 0..1
    const nx = x / width; // -~0.6..0.6
    // cup across width + curl back at tip + belly
    const z = cup * nx * nx * width + curl * ny * ny * height * 0.55 + Math.sin(ny * Math.PI) * 0.08;
    pos.setZ(i, z);
    // narrow base slightly
    pos.setX(i, x * (0.82 + ny * 0.28));
  }
  geo.computeVertexNormals();
  return geo;
}

type Layer = {
  count: number;
  radius: number;
  tilt: number; // radians from vertical
  y: number;
  size: number;
  color: string;
  roughness: number;
};

export function RoseModel({
  bloom = 0.55,
  isDark = false,
  autoRotate = true,
}: {
  bloom?: number;
  isDark?: boolean;
  autoRotate?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const layers: Layer[] = useMemo(() => {
    if (!isDark) {
      return [
        { count: 9, radius: 0.95, tilt: 1.18, y: -0.15, size: 1.05, color: "#b3273e", roughness: 0.42 },
        { count: 7, radius: 0.68, tilt: 0.82, y: 0.12, size: 0.92, color: "#c92847", roughness: 0.38 },
        { count: 5, radius: 0.42, tilt: 0.5, y: 0.38, size: 0.78, color: "#d63a56", roughness: 0.34 },
        { count: 4, radius: 0.2, tilt: 0.24, y: 0.62, size: 0.62, color: "#e0576b", roughness: 0.3 },
      ];
    }
    return [
      { count: 9, radius: 0.95, tilt: 1.18, y: -0.15, size: 1.05, color: "#7e1c30", roughness: 0.46 },
      { count: 7, radius: 0.68, tilt: 0.82, y: 0.12, size: 0.92, color: "#96233a", roughness: 0.4 },
      { count: 5, radius: 0.42, tilt: 0.5, y: 0.38, size: 0.78, color: "#b0344c", roughness: 0.36 },
      { count: 4, radius: 0.2, tilt: 0.24, y: 0.62, size: 0.62, color: "#c65d70", roughness: 0.32 },
    ];
  }, [isDark]);

  const geos = useMemo(
    () => layers.map((l) => petalGeometry(l.size, l.size * 1.35, 0.32, 0.3)),
    [layers]
  );
  const leafGeo = useMemo(() => petalGeometry(0.55, 1.15, 0.18, 0.12), []);
  const budGeo = useMemo(() => new THREE.SphereGeometry(0.24, 24, 24), []);

  const materials = useMemo(
    () =>
      layers.map(
        (l) =>
          new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(l.color),
            roughness: l.roughness,
            metalness: 0.02,
            clearcoat: 0.55,
            clearcoatRoughness: 0.5,
            sheen: 0.6,
            sheenColor: new THREE.Color(isDark ? "#e0788a" : "#ffb3c0"),
            side: THREE.DoubleSide,
          })
      ),
    [layers, isDark]
  );

  const leafMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(isDark ? "#3d4a35" : "#4a6b43"),
        roughness: 0.6,
        side: THREE.DoubleSide,
      }),
    [isDark]
  );
  const stemMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(isDark ? "#2e3a28" : "#3f5a36"),
        roughness: 0.7,
      }),
    [isDark]
  );

  useFrame(({ clock, pointer }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    if (reduceMotion) return;
    const spin = autoRotate ? t * 0.22 : t * 0.05;
    g.rotation.y += (spin * 0.016 + pointer.x * 0.35 - g.rotation.y) * 0.04 + 0.0022;
    g.rotation.x += (0.08 + pointer.y * -0.18 - g.rotation.x) * 0.05;
    g.position.y = Math.sin(t * 0.8) * 0.09;
  });

  // scroll influence
  useFrame(() => {
    const g = group.current;
    if (!g || reduceMotion || typeof window === "undefined") return;
    const sy = Math.min(window.scrollY, 2000);
    g.position.x = Math.sin(sy * 0.0009) * 0.35;
  });

  const open = THREE.MathUtils.lerp(0, 0.5, bloom);

  return (
    <group ref={group} position={[0, -0.35, 0]}>
      {/* bloom head */}
      <group position={[0, 0.55, 0]}>
        {/* center bud */}
        <mesh geometry={budGeo} position={[0, 0.42, 0]} scale={[1, 1.5, 1]}>
          <meshPhysicalMaterial
            color={isDark ? "#a52840" : "#c22545"}
            roughness={0.35}
            clearcoat={0.6}
          />
        </mesh>
        {layers.map((layer, li) => (
          <group key={li}>
            {Array.from({ length: layer.count }).map((_, i) => {
              const angle = (i / layer.count) * Math.PI * 2 + li * 0.45;
              const tilt = layer.tilt - open;
              return (
                <group
                  key={i}
                  rotation={[0, angle, 0]}
                  position={[
                    Math.cos(angle) * layer.radius * (0.9 + bloom * 0.25),
                    layer.y,
                    Math.sin(angle) * layer.radius * (0.9 + bloom * 0.25),
                  ]}
                >
                  <group rotation={[-tilt, 0, 0]}>
                    <mesh
                      geometry={geos[li]}
                      material={materials[li]}
                      castShadow
                      receiveShadow
                    />
                  </group>
                </group>
              );
            })}
          </group>
        ))}
      </group>

      {/* stem */}
      <mesh position={[0, -0.9, 0]} material={stemMat} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 2.4, 12]} />
      </mesh>
      {/* leaves */}
      <group position={[0.05, -0.7, 0]} rotation={[0.4, 0.5, -0.9]}>
        <mesh geometry={leafGeo} material={leafMat} castShadow />
      </group>
      <group position={[-0.05, -1.25, 0]} rotation={[0.5, -0.6, 0.9]}>
        <mesh geometry={leafGeo} material={leafMat} scale={0.85} castShadow />
      </group>
    </group>
  );
}
