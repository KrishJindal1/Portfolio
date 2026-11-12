"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createArmMaterials, disposeArmMaterials } from "./materials";
import {
  BALL_RADIUS,
  FLOOR_Y,
  JOINT_LIMITS,
  POSE_PRESETS,
  solveArmIK,
  type JointAngles,
} from "./types";

interface BoltRingProps {
  radius: number;
  count: number;
  y?: number;
  boltRadius?: number;
  boltHeight?: number;
  material: THREE.Material;
}

function BoltRing({
  radius,
  count,
  y = 0,
  boltRadius = 0.015,
  boltHeight = 0.02,
  material,
}: BoltRingProps) {
  const positions = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2;
      return [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as const;
    });
  }, [count, radius, y]);

  return (
    <group>
      {positions.map(([px, py, pz], idx) => (
        <mesh key={idx} position={[px, py, pz]} material={material} castShadow>
          <cylinderGeometry args={[boltRadius, boltRadius, boltHeight, 6]} />
        </mesh>
      ))}
    </group>
  );
}

interface ServoJointDrumProps {
  radius: number;
  width: number;
  materials: ReturnType<typeof createArmMaterials>;
  boltCount?: number;
  accentOffset?: number;
}

function ServoJointDrum({
  radius,
  width,
  materials,
  boltCount = 8,
  accentOffset = 0.04,
}: ServoJointDrumProps) {
  const half = width / 2;

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={materials.darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, width, 32]} />
      </mesh>

      <mesh position={[0, half - 0.025, 0]} material={materials.steel} castShadow>
        <cylinderGeometry args={[radius * 0.86, radius * 0.92, 0.05, 28]} />
      </mesh>
      <mesh position={[0, -half + 0.025, 0]} material={materials.steel} castShadow>
        <cylinderGeometry args={[radius * 0.92, radius * 0.86, 0.05, 28]} />
      </mesh>

      <mesh position={[0, half - accentOffset, 0]} material={materials.limeAccent}>
        <cylinderGeometry args={[radius * 1.01, radius * 1.01, 0.016, 32]} />
      </mesh>

      <BoltRing
        radius={radius * 0.68}
        count={boltCount}
        y={half + 0.008}
        boltRadius={radius * 0.065}
        boltHeight={0.016}
        material={materials.steel}
      />
      <BoltRing
        radius={radius * 0.68}
        count={boltCount}
        y={-half - 0.008}
        boltRadius={radius * 0.065}
        boltHeight={0.016}
        material={materials.steel}
      />
    </group>
  );
}

export interface PointerOffset {
  x: number;
  y: number;
}

export type BallPhase =
  | "free"
  | "picking_approach"
  | "picking_descend"
  | "picking_grasp"
  | "holding";

export type BallUiStatus = "floor" | "in-range" | "picking" | "holding";

export interface BallSimulationState {
  phase: BallPhase;
  timer: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
}

interface RoboticArmModelProps {
  targetAnglesRef: MutableRefObject<JointAngles>;
  pointerRef: MutableRefObject<PointerOffset>;
  ballSimRef: MutableRefObject<BallSimulationState>;
  pressedKeysRef: MutableRefObject<Set<string>>;
  manualControlRef: MutableRefObject<boolean>;
  reducedMotion: boolean;
  onStatusChange: (status: BallUiStatus) => void;
  onBallTriggerPick: () => void;
  onFloorClickDrop: (x: number, z: number) => void;
}

const MANUAL_GRAB_RADIUS = 0.42;

export function RoboticArmModel({
  targetAnglesRef,
  pointerRef,
  ballSimRef,
  pressedKeysRef,
  manualControlRef,
  reducedMotion,
  onStatusChange,
  onBallTriggerPick,
  onFloorClickDrop,
}: RoboticArmModelProps) {
  const materials = useMemo(() => createArmMaterials(), []);
  const [ballHovered, setBallHovered] = useState(false);

  useEffect(() => {
    return () => {
      disposeArmMaterials(materials);
    };
  }, [materials]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.cursor = ballHovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [ballHovered]);

  const rootRef = useRef<THREE.Group>(null);
  const j1Ref = useRef<THREE.Group>(null);
  const j2Ref = useRef<THREE.Group>(null);
  const j3Ref = useRef<THREE.Group>(null);
  const j4Ref = useRef<THREE.Group>(null);
  const j5Ref = useRef<THREE.Group>(null);
  const j6Ref = useRef<THREE.Group>(null);
  const pinchRef = useRef<THREE.Group>(null);
  const leftFingerRef = useRef<THREE.Group>(null);
  const rightFingerRef = useRef<THREE.Group>(null);

  const ballGroupRef = useRef<THREE.Group>(null);
  const ballShadowRef = useRef<THREE.Mesh>(null);
  const gripperReticleRef = useRef<THREE.Mesh>(null);
  const reticleMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const lastUiStatusRef = useRef<BallUiStatus>("floor");
  const pinchWorldVec = useMemo(() => new THREE.Vector3(), []);
  const palmWorldVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const sim = ballSimRef.current;

    const emitStatus = (next: BallUiStatus) => {
      if (lastUiStatusRef.current !== next) {
        lastUiStatusRef.current = next;
        onStatusChange(next);
      }
    };

    // 0. Continuous keyboard joint driving (zero per-frame React state)
    const keys = pressedKeysRef.current;
    const speed = 1.35 * dt;
    let manualKeyboardInput = false;

    const j1Delta =
      (keys.has("a") || keys.has("arrowleft") ? 1 : 0) -
      (keys.has("d") || keys.has("arrowright") ? 1 : 0);
    const j2Delta =
      (keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0);
    const j3Delta =
      (keys.has("i") || keys.has("arrowup") ? 1 : 0) -
      (keys.has("k") || keys.has("arrowdown") ? 1 : 0);
    const j5Delta =
      (keys.has("q") ? 1 : 0) - (keys.has("e") ? 1 : 0);

    if (j1Delta !== 0 || j2Delta !== 0 || j3Delta !== 0 || j5Delta !== 0) {
      manualKeyboardInput = true;
      manualControlRef.current = true;
      if (
        sim.phase === "picking_approach" ||
        sim.phase === "picking_descend" ||
        sim.phase === "picking_grasp"
      ) {
        sim.phase = "free";
        emitStatus("floor");
      }

      const cur = targetAnglesRef.current;
      targetAnglesRef.current = {
        ...cur,
        j1: THREE.MathUtils.clamp(
          cur.j1 + j1Delta * speed,
          JOINT_LIMITS.j1.min,
          JOINT_LIMITS.j1.max
        ),
        j2: THREE.MathUtils.clamp(
          cur.j2 + j2Delta * speed,
          JOINT_LIMITS.j2.min,
          JOINT_LIMITS.j2.max
        ),
        j3: THREE.MathUtils.clamp(
          cur.j3 + j3Delta * speed,
          JOINT_LIMITS.j3.min,
          JOINT_LIMITS.j3.max
        ),
        j5: THREE.MathUtils.clamp(
          cur.j5 + j5Delta * speed,
          JOINT_LIMITS.j5.min,
          JOINT_LIMITS.j5.max
        ),
      };
    }

    // 1. Update IK pick sequence if active
    const isPicking =
      !manualKeyboardInput &&
      (sim.phase === "picking_approach" ||
        sim.phase === "picking_descend" ||
        sim.phase === "picking_grasp");

    if (sim.phase === "picking_approach") {
      sim.timer += dt;
      const approachTarget = solveArmIK(sim.pos.x, sim.pos.y + 0.36, sim.pos.z, 1.0);
      targetAnglesRef.current = approachTarget;

      if (pinchRef.current) {
        pinchRef.current.getWorldPosition(pinchWorldVec);
        const dist = Math.hypot(
          pinchWorldVec.x - sim.pos.x,
          pinchWorldVec.y - (sim.pos.y + 0.36),
          pinchWorldVec.z - sim.pos.z
        );
        if (dist < 0.09 || sim.timer > 0.9) {
          sim.phase = "picking_descend";
          sim.timer = 0;
        }
      }
      emitStatus("picking");
    } else if (sim.phase === "picking_descend") {
      sim.timer += dt;
      const descendTarget = solveArmIK(sim.pos.x, sim.pos.y, sim.pos.z, 1.0);
      targetAnglesRef.current = descendTarget;

      if (pinchRef.current) {
        pinchRef.current.getWorldPosition(pinchWorldVec);
        const dist = pinchWorldVec.distanceTo(sim.pos);
        if (dist < 0.065 || sim.timer > 0.75) {
          sim.phase = "picking_grasp";
          sim.timer = 0;
        }
      }
      emitStatus("picking");
    } else if (sim.phase === "picking_grasp") {
      sim.timer += dt;
      targetAnglesRef.current = solveArmIK(sim.pos.x, sim.pos.y, sim.pos.z, 0.24);
      if (sim.timer >= 0.32) {
        sim.phase = "holding";
        sim.timer = 0;
        // Lift to poised hold pose while keeping gripper closed
        targetAnglesRef.current = {
          ...POSE_PRESETS[0].angles,
          grip: 0.24,
        };
        emitStatus("holding");
      }
    }

    // 2. Drive joint rotations smoothly toward targetAnglesRef
    const target = targetAnglesRef.current;
    const pointer = pointerRef.current;
    const allowIdle = !reducedMotion && !isPicking && !manualControlRef.current;

    const idleJ1 = allowIdle ? Math.sin(t * 0.45) * 0.035 : 0;
    const idleJ2 = allowIdle ? Math.sin(t * 0.6 + 0.6) * 0.02 : 0;
    const idleJ3 = allowIdle ? Math.cos(t * 0.55) * 0.025 : 0;
    const idleJ5 = allowIdle ? Math.sin(t * 0.7) * 0.025 : 0;

    const pointerYaw = allowIdle ? pointer.x * 0.14 : 0;
    const pointerPitch = allowIdle ? pointer.y * 0.07 : 0;
    const pointerWrist = allowIdle ? -pointer.y * 0.08 : 0;

    const dampFactor = isPicking || manualKeyboardInput ? 9.5 : reducedMotion ? 16 : 4.8;

    if (j1Ref.current) {
      j1Ref.current.rotation.y = THREE.MathUtils.damp(
        j1Ref.current.rotation.y,
        target.j1 + idleJ1 + pointerYaw,
        dampFactor,
        dt
      );
    }

    if (j2Ref.current) {
      j2Ref.current.rotation.z = THREE.MathUtils.damp(
        j2Ref.current.rotation.z,
        target.j2 + idleJ2 + pointerPitch,
        dampFactor,
        dt
      );
    }

    if (j3Ref.current) {
      j3Ref.current.rotation.z = THREE.MathUtils.damp(
        j3Ref.current.rotation.z,
        target.j3 + idleJ3 - pointerPitch * 0.6,
        dampFactor,
        dt
      );
    }

    if (j4Ref.current) {
      j4Ref.current.rotation.y = THREE.MathUtils.damp(
        j4Ref.current.rotation.y,
        target.j4 + (allowIdle ? pointerYaw * 0.35 : 0),
        dampFactor,
        dt
      );
    }

    if (j5Ref.current) {
      j5Ref.current.rotation.z = THREE.MathUtils.damp(
        j5Ref.current.rotation.z,
        target.j5 + idleJ5 + pointerWrist,
        dampFactor,
        dt
      );
    }

    if (j6Ref.current) {
      j6Ref.current.rotation.y = THREE.MathUtils.damp(
        j6Ref.current.rotation.y,
        target.j6,
        dampFactor,
        dt
      );
    }

    const clampedGrip = THREE.MathUtils.clamp(target.grip, 0, 1);
    const jawOffset = 0.03 + clampedGrip * 0.058;

    if (leftFingerRef.current) {
      leftFingerRef.current.position.z = THREE.MathUtils.damp(
        leftFingerRef.current.position.z,
        jawOffset,
        10,
        dt
      );
    }

    if (rightFingerRef.current) {
      rightFingerRef.current.position.z = THREE.MathUtils.damp(
        rightFingerRef.current.position.z,
        -jawOffset,
        10,
        dt
      );
    }

    // Ensure world matrices reflect this frame's joint updates before reading pinch position
    if (rootRef.current) {
      rootRef.current.updateMatrixWorld(true);
    }

    // 3. Ball physics & manual/automatic grasp attachment
    if (sim.phase === "holding") {
      if (target.grip >= 0.62) {
        // Released manually via gripper slider
        sim.phase = "free";
        sim.vel.set(0, -0.25, 0);
        emitStatus("floor");
      } else if (pinchRef.current) {
        pinchRef.current.getWorldPosition(sim.pos);
        sim.vel.set(0, 0, 0);
        emitStatus("holding");
      }
    } else if (sim.phase === "free") {
      sim.vel.y -= 13.5 * dt;
      sim.pos.addScaledVector(sim.vel, dt);

      const minY = FLOOR_Y + BALL_RADIUS;
      if (sim.pos.y <= minY) {
        sim.pos.y = minY;
        if (sim.vel.y < -0.35) {
          sim.vel.y = -sim.vel.y * 0.42;
          sim.vel.x *= 0.75;
          sim.vel.z *= 0.75;
        } else {
          sim.vel.set(0, 0, 0);
        }
      }

      // Clamp ball inside reachable floor workspace
      const radial = Math.hypot(sim.pos.x, sim.pos.z);
      if (radial < 0.82 && radial > 0.001) {
        const s = 0.82 / radial;
        sim.pos.x *= s;
        sim.pos.z *= s;
      } else if (radial > 1.95) {
        const s = 1.95 / radial;
        sim.pos.x *= s;
        sim.pos.z *= s;
      }

      // Allow manual pickup when gripper is within grab range and fingers close
      let inRange = false;
      if (pinchRef.current && j6Ref.current && Math.abs(sim.vel.y) < 1.5) {
        pinchRef.current.getWorldPosition(pinchWorldVec);
        j6Ref.current.getWorldPosition(palmWorldVec);
        const grabDist = Math.min(
          pinchWorldVec.distanceTo(sim.pos),
          palmWorldVec.distanceTo(sim.pos)
        );
        inRange = grabDist <= MANUAL_GRAB_RADIUS;

        if (inRange && target.grip < 0.48) {
          sim.phase = "holding";
          sim.vel.set(0, 0, 0);
          emitStatus("holding");
        } else {
          emitStatus(inRange ? "in-range" : "floor");
        }
      } else {
        emitStatus("floor");
      }

      if (gripperReticleRef.current) {
        pinchRef.current?.getWorldPosition(pinchWorldVec);
        gripperReticleRef.current.position.set(
          pinchWorldVec.x,
          FLOOR_Y + 0.004,
          pinchWorldVec.z
        );
        gripperReticleRef.current.visible = true;
      }
      if (reticleMatRef.current) {
        reticleMatRef.current.color.set(inRange ? "#84CC16" : "#888888");
        reticleMatRef.current.opacity = inRange ? 0.95 : 0.45;
      }
    }

    if (sim.phase !== "free" && gripperReticleRef.current) {
      gripperReticleRef.current.visible = false;
    }

    // 4. Sync Ball Mesh & Soft Floor Contact Ring
    if (ballGroupRef.current) {
      ballGroupRef.current.position.copy(sim.pos);
      if (sim.phase === "holding" && j1Ref.current) {
        ballGroupRef.current.rotation.y = j1Ref.current.rotation.y;
      }
    }

    if (ballShadowRef.current) {
      const heightAboveFloor = Math.max(0, sim.pos.y - (FLOOR_Y + BALL_RADIUS));
      const shadowScale = Math.max(0.45, 1 - heightAboveFloor * 0.35);
      ballShadowRef.current.position.set(sim.pos.x, FLOOR_Y + 0.003, sim.pos.z);
      ballShadowRef.current.scale.set(shadowScale, shadowScale, 1);
    }
  });

  return (
    <>
      {/* Clickable Floor Plane to Drop Ball at Target Coordinates */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, FLOOR_Y, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onFloorClickDrop(event.point.x, event.point.z);
        }}
      >
        <circleGeometry args={[6, 64]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Interactive Calibration Ball */}
      <group ref={ballGroupRef} position={[1.05, 0.75, 0.72]}>
        <mesh
          castShadow
          receiveShadow
          material={materials.graphite}
          onPointerOver={(event) => {
            event.stopPropagation();
            setBallHovered(true);
          }}
          onPointerOut={() => setBallHovered(false)}
          onClick={(event) => {
            event.stopPropagation();
            onBallTriggerPick();
          }}
        >
          <sphereGeometry args={[BALL_RADIUS, 32, 24]} />
        </mesh>

        {/* Electric Lime Equatorial Calibration Band */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.limeAccent}>
          <torusGeometry args={[BALL_RADIUS * 0.99, 0.012, 12, 36]} />
        </mesh>

        {/* Machined Steel Polar Cap */}
        <mesh position={[0, BALL_RADIUS * 0.86, 0]} material={materials.steel}>
          <cylinderGeometry args={[0.045, 0.06, 0.025, 20]} />
        </mesh>
      </group>

      {/* Subtle Ball Shadow & Drop Zone Indicator on Floor */}
      <mesh ref={ballShadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[1.05, FLOOR_Y + 0.003, 0.72]}>
        <circleGeometry args={[BALL_RADIUS * 1.15, 28]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.18} depthWrite={false} />
      </mesh>

      {/* Live Gripper Floor Alignment Reticle */}
      <mesh ref={gripperReticleRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.004, 0]}>
        <ringGeometry args={[0.16, 0.19, 32]} />
        <meshBasicMaterial ref={reticleMatRef} color="#888888" transparent opacity={0.45} depthWrite={false} />
      </mesh>

      {/* =========================================================
          6-AXIS INDUSTRIAL ROBOTIC ARM
         ========================================================= */}
      <group ref={rootRef} position={[0, FLOOR_Y, 0]}>
        {/* 0. BASE PLATFORM */}
        <group name="base-platform">
          <mesh position={[0, 0.035, 0]} material={materials.darkMetal} castShadow receiveShadow>
            <cylinderGeometry args={[0.56, 0.6, 0.07, 36]} />
          </mesh>

          <BoltRing
            radius={0.5}
            count={8}
            y={0.075}
            boltRadius={0.022}
            boltHeight={0.024}
            material={materials.steel}
          />

          <mesh position={[0, 0.125, 0]} material={materials.graphite} castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.46, 0.11, 32]} />
          </mesh>

          <mesh position={[0, 0.185, 0]} material={materials.limeAccent}>
            <cylinderGeometry args={[0.425, 0.425, 0.014, 32]} />
          </mesh>

          <mesh position={[0, 0.215, 0]} material={materials.steel} castShadow>
            <cylinderGeometry args={[0.37, 0.39, 0.05, 32]} />
          </mesh>
        </group>

        {/* 1. AXIS J1 — BASE TURRET */}
        <group ref={j1Ref} position={[0, 0.24, 0]} name="axis-j1-turret">
          <mesh position={[0, 0.12, 0]} material={materials.graphite} castShadow receiveShadow>
            <cylinderGeometry args={[0.34, 0.37, 0.24, 32]} />
          </mesh>

          <mesh position={[-0.25, 0.17, 0]} material={materials.darkMetal} castShadow receiveShadow>
            <boxGeometry args={[0.26, 0.24, 0.34]} />
          </mesh>
          {[-0.09, 0, 0.09].map((zPos) => (
            <mesh key={zPos} position={[-0.39, 0.17, zPos]} material={materials.steel} castShadow>
              <boxGeometry args={[0.03, 0.18, 0.025]} />
            </mesh>
          ))}

          {[-0.175, 0.175].map((zPos) => (
            <group key={zPos} position={[0, 0.28, zPos]}>
              <mesh material={materials.casing} castShadow receiveShadow>
                <boxGeometry args={[0.36, 0.28, 0.09]} />
              </mesh>
              <mesh
                position={[0, 0.14, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                material={materials.casing}
                castShadow
              >
                <cylinderGeometry args={[0.18, 0.18, 0.09, 24]} />
              </mesh>
            </group>
          ))}

          <mesh
            position={[0, 0.38, -0.31]}
            rotation={[Math.PI / 2, 0, 0]}
            material={materials.darkMetal}
            castShadow
          >
            <cylinderGeometry args={[0.125, 0.125, 0.18, 24]} />
          </mesh>
          <mesh
            position={[0, 0.38, -0.405]}
            rotation={[Math.PI / 2, 0, 0]}
            material={materials.limeAccent}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.015, 16]} />
          </mesh>

          {/* 2. AXIS J2 — SHOULDER & UPPER ARM */}
          <group ref={j2Ref} position={[0, 0.38, 0]} name="axis-j2-shoulder">
            <ServoJointDrum radius={0.21} width={0.46} materials={materials} boltCount={8} />

            <group name="upper-arm-link">
              {[-0.095, 0.095].map((zPos) => (
                <mesh
                  key={zPos}
                  position={[0, 0.66, zPos]}
                  material={materials.graphite}
                  castShadow
                  receiveShadow
                >
                  <boxGeometry args={[0.21, 1.24, 0.065]} />
                </mesh>
              ))}

              <mesh position={[0, 0.66, 0]} material={materials.darkMetal} castShadow>
                <boxGeometry args={[0.14, 1.18, 0.13]} />
              </mesh>

              <mesh position={[0, 0.66, 0]} material={materials.casing} castShadow>
                <boxGeometry args={[0.24, 0.24, 0.27]} />
              </mesh>

              {[-0.138, 0.138].map((zPos) => (
                <mesh key={zPos} position={[0.04, 0.66, zPos]} material={materials.limeAccent}>
                  <boxGeometry args={[0.018, 0.42, 0.008]} />
                </mesh>
              ))}

              <mesh position={[-0.145, 0.62, 0]} material={materials.steel} castShadow>
                <cylinderGeometry args={[0.028, 0.034, 1.02, 16]} />
              </mesh>
            </group>

            {/* 3. AXIS J3 — ELBOW & FOREARM */}
            <group ref={j3Ref} position={[0, 1.32, 0]} name="axis-j3-elbow">
              <ServoJointDrum radius={0.175} width={0.38} materials={materials} boltCount={8} />

              <mesh position={[-0.2, 0.02, 0]} material={materials.darkMetal} castShadow receiveShadow>
                <boxGeometry args={[0.26, 0.22, 0.26]} />
              </mesh>
              <mesh
                position={[-0.36, 0.02, 0]}
                rotation={[0, 0, Math.PI / 2]}
                material={materials.casing}
                castShadow
              >
                <cylinderGeometry args={[0.095, 0.11, 0.12, 24]} />
              </mesh>

              <group name="forearm-link">
                <mesh position={[0, 0.18, 0]} material={materials.casing} castShadow receiveShadow>
                  <boxGeometry args={[0.22, 0.28, 0.24]} />
                </mesh>

                <mesh position={[0, 0.62, 0]} material={materials.graphite} castShadow receiveShadow>
                  <cylinderGeometry args={[0.095, 0.135, 0.66, 20]} />
                </mesh>

                <mesh position={[0.09, 0.6, 0]} material={materials.darkMetal} castShadow>
                  <boxGeometry args={[0.045, 0.52, 0.08]} />
                </mesh>

                <mesh position={[0.115, 0.6, 0]} material={materials.limeAccent}>
                  <boxGeometry args={[0.008, 0.22, 0.02]} />
                </mesh>
              </group>

              {/* 4. AXIS J4 — FOREARM ROLL */}
              <group ref={j4Ref} position={[0, 0.98, 0]} name="axis-j4-roll">
                <mesh position={[0, 0.03, 0]} material={materials.steel} castShadow>
                  <cylinderGeometry args={[0.105, 0.105, 0.06, 24]} />
                </mesh>

                {[-0.075, 0.075].map((zPos) => (
                  <group key={zPos} position={[0, 0.12, zPos]}>
                    <mesh material={materials.casing} castShadow>
                      <boxGeometry args={[0.14, 0.16, 0.045]} />
                    </mesh>
                    <mesh
                      position={[0, 0.07, 0]}
                      rotation={[Math.PI / 2, 0, 0]}
                      material={materials.casing}
                      castShadow
                    >
                      <cylinderGeometry args={[0.07, 0.07, 0.045, 20]} />
                    </mesh>
                  </group>
                ))}

                {/* 5. AXIS J5 — WRIST PITCH */}
                <group ref={j5Ref} position={[0, 0.19, 0]} name="axis-j5-wrist">
                  <ServoJointDrum
                    radius={0.095}
                    width={0.22}
                    materials={materials}
                    boltCount={6}
                    accentOffset={0.025}
                  />

                  <mesh position={[0, 0.1, 0]} material={materials.darkMetal} castShadow>
                    <cylinderGeometry args={[0.072, 0.082, 0.14, 24]} />
                  </mesh>

                  {/* 6. AXIS J6 — TOOL FLANGE & PARALLEL GRIPPER */}
                  <group ref={j6Ref} position={[0, 0.18, 0]} name="axis-j6-tool">
                    {/* Exact Gripper Pinch Target Reference */}
                    <group ref={pinchRef} position={[0, 0.275, 0]} name="gripper-pinch-center" />

                    <mesh position={[0, 0.02, 0]} material={materials.steel} castShadow>
                      <cylinderGeometry args={[0.09, 0.09, 0.04, 24]} />
                    </mesh>
                    <BoltRing
                      radius={0.065}
                      count={6}
                      y={0.042}
                      boltRadius={0.008}
                      boltHeight={0.01}
                      material={materials.darkMetal}
                    />

                    <group position={[0.085, 0.06, 0]}>
                      <mesh material={materials.darkMetal} castShadow>
                        <boxGeometry args={[0.05, 0.06, 0.08]} />
                      </mesh>
                      <mesh position={[0.028, 0, 0]} material={materials.limeAccent}>
                        <boxGeometry args={[0.008, 0.016, 0.016]} />
                      </mesh>
                    </group>

                    <mesh position={[0, 0.075, 0]} material={materials.graphite} castShadow>
                      <boxGeometry args={[0.11, 0.07, 0.24]} />
                    </mesh>
                    <mesh position={[0, 0.115, 0]} material={materials.steel} castShadow>
                      <boxGeometry args={[0.06, 0.016, 0.22]} />
                    </mesh>

                    <group ref={leftFingerRef} position={[0, 0.125, 0.065]} name="gripper-finger-left">
                      <mesh position={[0, 0.055, 0]} material={materials.casing} castShadow>
                        <boxGeometry args={[0.048, 0.11, 0.028]} />
                      </mesh>
                      <mesh position={[0, 0.14, -0.012]} material={materials.steel} castShadow>
                        <boxGeometry args={[0.04, 0.09, 0.022]} />
                      </mesh>
                      <mesh position={[0, 0.15, -0.025]} material={materials.gripPad}>
                        <boxGeometry args={[0.038, 0.065, 0.008]} />
                      </mesh>
                    </group>

                    <group
                      ref={rightFingerRef}
                      position={[0, 0.125, -0.065]}
                      name="gripper-finger-right"
                    >
                      <mesh position={[0, 0.055, 0]} material={materials.casing} castShadow>
                        <boxGeometry args={[0.048, 0.11, 0.028]} />
                      </mesh>
                      <mesh position={[0, 0.14, 0.012]} material={materials.steel} castShadow>
                        <boxGeometry args={[0.04, 0.09, 0.022]} />
                      </mesh>
                      <mesh position={[0, 0.15, 0.025]} material={materials.gripPad}>
                        <boxGeometry args={[0.038, 0.065, 0.008]} />
                      </mesh>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </>
  );
}
