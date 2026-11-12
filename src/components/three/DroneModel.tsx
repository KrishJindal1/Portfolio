"use client";

import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createArmMaterials, disposeArmMaterials } from "./materials";

export interface DroneFlightState {
  /** Normalized screen coordinates: x in [-0.92, 0.92], y in [-0.88, 0.88] */
  nx: number;
  ny: number;
  vx: number;
  vy: number;
  yaw: number;
  scanPulse: number;
  barrelRollProgress: number;
}

export interface BeamScreenPoint {
  px: number;
  py: number;
}

interface DroneModelProps {
  flightRef: MutableRefObject<DroneFlightState>;
  beamScreenRef: MutableRefObject<BeamScreenPoint>;
  overdrive: boolean;
  reducedMotion: boolean;
}

const ARM_MOUNTS: Array<{ x: number; z: number; spinDir: number; rotY: number }> = [
  { x: 0.46, z: 0.46, spinDir: 1, rotY: Math.PI / 4 },
  { x: -0.46, z: 0.46, spinDir: -1, rotY: -Math.PI / 4 },
  { x: 0.46, z: -0.46, spinDir: -1, rotY: -Math.PI / 4 },
  { x: -0.46, z: -0.46, spinDir: 1, rotY: Math.PI / 4 },
];

export function DroneModel({
  flightRef,
  beamScreenRef,
  overdrive,
  reducedMotion,
}: DroneModelProps) {
  const materials = useMemo(() => createArmMaterials(), []);
  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera);

  const rootRef = useRef<THREE.Group>(null);
  const bodyTiltRef = useRef<THREE.Group>(null);
  const beamTipRef = useRef<THREE.Group>(null);
  const beamWorldVec = useMemo(() => new THREE.Vector3(), []);
  const bankRollRef = useRef(0);
  const rollDirRef = useRef(-1);
  const wasRollingRef = useRef(false);
  const rotorRefs = useRef<Array<THREE.Group | null>>([null, null, null, null]);
  const scanConeRef = useRef<THREE.Mesh>(null);
  const scanMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const beamMarkerRef = useRef<THREE.Group>(null);
  const beamRingMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const beamDotMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    return () => {
      disposeArmMaterials(materials);
    };
  }, [materials]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const flight = flightRef.current;

    // Map normalized screen coordinates directly into camera frustum at z = 0
    const fovRad = (38 * Math.PI) / 180;
    const camDistance = 10;
    const halfH = camDistance * Math.tan(fovRad / 2);
    const aspect = size.width / Math.max(size.height, 1);
    const halfW = halfH * aspect;

    const worldX = flight.nx * halfW;
    const worldY = flight.ny * halfH;
    const hoverBob = reducedMotion ? 0 : Math.sin(t * 2.8) * 0.04;

    // Smoothly eased barrel roll progress + subtle aerial helical arc
    let rollAngle = 0;
    let rollArcX = 0;
    let rollArcY = 0;
    let rollPitchBoost = 0;
    let rollRotorBoost = 0;

    if (flight.barrelRollProgress > 0) {
      if (!wasRollingRef.current) {
        wasRollingRef.current = true;
        rollDirRef.current = flight.vx < -0.08 ? 1 : -1;
      }

      flight.barrelRollProgress = Math.min(1, flight.barrelRollProgress + dt * 1.45);
      const p = flight.barrelRollProgress;
      // Smooth ease-in-out curve (zero snap at start or completion)
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      rollAngle = eased * Math.PI * 2 * rollDirRef.current;
      rollArcY = Math.sin(Math.PI * p) * 0.24;
      rollArcX = Math.sin(Math.PI * 2 * p) * 0.14 * -rollDirRef.current;
      rollPitchBoost = Math.sin(Math.PI * p) * 0.14;
      rollRotorBoost = Math.sin(Math.PI * p) * 24;

      if (p >= 1) {
        flight.barrelRollProgress = 0;
        wasRollingRef.current = false;
      }
    } else {
      wasRollingRef.current = false;
    }

    if (rootRef.current) {
      rootRef.current.position.set(worldX + rollArcX, worldY + hoverBob + rollArcY, 0);
      rootRef.current.rotation.y = THREE.MathUtils.damp(
        rootRef.current.rotation.y,
        flight.yaw,
        8,
        dt
      );
    }

    // Dynamic pitch & roll banking separated cleanly from barrel-roll offset
    if (bodyTiltRef.current) {
      const targetRoll = -THREE.MathUtils.clamp(flight.vx * 0.38, -0.45, 0.45);
      const targetPitch =
        THREE.MathUtils.clamp(flight.vy * 0.25, -0.3, 0.3) + 0.34 + rollPitchBoost;

      bankRollRef.current = THREE.MathUtils.damp(bankRollRef.current, targetRoll, 9, dt);

      bodyTiltRef.current.rotation.z = bankRollRef.current + rollAngle;
      bodyTiltRef.current.rotation.x = THREE.MathUtils.damp(
        bodyTiltRef.current.rotation.x,
        targetPitch,
        9,
        dt
      );
    }

    // Spin counter-rotating quadcopter rotors
    const speedMag = Math.hypot(flight.vx, flight.vy);
    const rotorSpinRate =
      (reducedMotion ? 8 : 26) + speedMag * 12 + (overdrive ? 10 : 0) + rollRotorBoost;
    rotorRefs.current.forEach((rotor, idx) => {
      if (!rotor) return;
      const dir = ARM_MOUNTS[idx]?.spinDir ?? 1;
      rotor.rotation.y += dir * rotorSpinRate * dt;
    });

    // Project exact 3D center point of the scanner beam into viewport pixels
    if (rootRef.current && beamTipRef.current) {
      rootRef.current.updateMatrixWorld(true);
      beamTipRef.current.getWorldPosition(beamWorldVec);
      beamWorldVec.project(camera);
      beamScreenRef.current.px = THREE.MathUtils.clamp(
        ((beamWorldVec.x + 1) / 2) * size.width,
        2,
        Math.max(2, size.width - 2)
      );
      beamScreenRef.current.py = THREE.MathUtils.clamp(
        ((1 - beamWorldVec.y) / 2) * size.height,
        2,
        Math.max(2, size.height - 2)
      );
    }

    // Scanner beam cone & center marker (visible only during active scan pulse)
    if (flight.scanPulse > 0) {
      flight.scanPulse = Math.max(0, flight.scanPulse - dt * 1.8);
    }
    const beamActive = flight.scanPulse > 0.01;
    if (scanConeRef.current && scanMatRef.current) {
      scanConeRef.current.visible = beamActive;
      if (beamActive) {
        const s = 0.85 + (1 - flight.scanPulse) * 0.45;
        scanConeRef.current.scale.set(s, 1, s);
        scanMatRef.current.opacity = flight.scanPulse * 0.3;
      }
    }
    if (beamMarkerRef.current) {
      beamMarkerRef.current.visible = beamActive;
      if (beamActive) {
        if (beamRingMatRef.current) {
          beamRingMatRef.current.opacity = flight.scanPulse * 0.8;
        }
        if (beamDotMatRef.current) {
          beamDotMatRef.current.opacity = flight.scanPulse * 0.95;
        }
      }
    }
  });

  return (
    <group ref={rootRef}>
      <group ref={bodyTiltRef} scale={0.92}>
        {/* Main Carbon-Graphite Fuselage */}
        <mesh material={materials.graphite} castShadow>
          <boxGeometry args={[0.42, 0.12, 0.56]} />
        </mesh>

        {/* Top Avionics Canopy */}
        <mesh position={[0, 0.09, -0.02]} material={materials.casing} castShadow>
          <boxGeometry args={[0.3, 0.08, 0.4]} />
        </mesh>

        {/* Overdrive / Navigation Status Strip */}
        <mesh position={[0, 0.135, -0.02]} material={materials.limeAccent}>
          <boxGeometry args={[overdrive ? 0.22 : 0.14, 0.016, 0.24]} />
        </mesh>

        {/* Front Stereo Vision Gimbal Pod */}
        <group position={[0, -0.04, 0.3]}>
          <mesh material={materials.darkMetal} castShadow>
            <boxGeometry args={[0.24, 0.1, 0.12]} />
          </mesh>
          {[-0.06, 0.06].map((xPos) => (
            <mesh
              key={xPos}
              position={[xPos, 0, 0.062]}
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.limeAccent}
            >
              <cylinderGeometry args={[0.02, 0.02, 0.014, 16]} />
            </mesh>
          ))}
        </group>

        {/* Landing Skids */}
        {[-0.19, 0.19].map((xPos) => (
          <group key={xPos} position={[xPos, -0.14, 0]}>
            <mesh position={[0, 0.05, 0.14]} material={materials.steel}>
              <boxGeometry args={[0.022, 0.1, 0.022]} />
            </mesh>
            <mesh position={[0, 0.05, -0.14]} material={materials.steel}>
              <boxGeometry args={[0.022, 0.1, 0.022]} />
            </mesh>
            <mesh
              position={[0, 0, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.darkMetal}
            >
              <cylinderGeometry args={[0.016, 0.016, 0.54, 12]} />
            </mesh>
          </group>
        ))}

        {/* 4 X-Frame Arms & Brushless Rotors */}
        {ARM_MOUNTS.map((mount, idx) => (
          <group key={idx}>
            {/* Diagonal Structural Boom */}
            <mesh
              position={[mount.x * 0.5, 0.015, mount.z * 0.5]}
              rotation={[0, mount.rotY, 0]}
              material={materials.darkMetal}
              castShadow
            >
              <boxGeometry args={[0.065, 0.04, 0.68]} />
            </mesh>

            {/* Motor Housing & Rotor Hub */}
            <group position={[mount.x, 0.045, mount.z]}>
              <mesh material={materials.casing} castShadow>
                <cylinderGeometry args={[0.075, 0.082, 0.09, 20]} />
              </mesh>
              <mesh position={[0, 0.03, 0]} material={materials.limeAccent}>
                <cylinderGeometry args={[0.078, 0.078, 0.014, 20]} />
              </mesh>
              <mesh position={[0, 0.055, 0]} material={materials.steel}>
                <cylinderGeometry args={[0.03, 0.03, 0.03, 16]} />
              </mesh>

              {/* Spinning Dual-Blade Propeller */}
              <group
                ref={(el) => {
                  rotorRefs.current[idx] = el;
                }}
                position={[0, 0.072, 0]}
              >
                <mesh material={materials.graphite}>
                  <boxGeometry args={[0.56, 0.008, 0.045]} />
                </mesh>
                {/* Electric lime rotor tip accents */}
                <mesh position={[0.26, 0.002, 0]} material={materials.limeAccent}>
                  <boxGeometry args={[0.045, 0.01, 0.046]} />
                </mesh>
                <mesh position={[-0.26, 0.002, 0]} material={materials.limeAccent}>
                  <boxGeometry args={[0.045, 0.01, 0.046]} />
                </mesh>
                {/* Translucent rotor blur disc */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.004, 0]}>
                  <ringGeometry args={[0.18, 0.28, 32]} />
                  <meshBasicMaterial
                    color={overdrive ? "#A3E635" : "#666666"}
                    transparent
                    opacity={overdrive ? 0.25 : 0.12}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                  />
                </mesh>
              </group>
            </group>
          </group>
        ))}

        {/* Downward Scanner Beam & Center Point Marker (shown only while scanning) */}
        <mesh ref={scanConeRef} position={[0, -0.54, 0]} visible={false}>
          <cylinderGeometry args={[0.05, 0.42, 0.88, 24, 1, true]} />
          <meshBasicMaterial
            ref={scanMatRef}
            color="#A3E635"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <group ref={beamTipRef} position={[0, -0.98, 0]}>
          <group ref={beamMarkerRef} visible={false}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.065, 0.095, 24]} />
              <meshBasicMaterial
                ref={beamRingMatRef}
                color="#84CC16"
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.024, 16]} />
              <meshBasicMaterial
                ref={beamDotMatRef}
                color="#84CC16"
                transparent
                opacity={0.95}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

