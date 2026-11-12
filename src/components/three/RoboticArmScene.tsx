"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { ArrowDownToLine, Bot, Hand, Keyboard, Plane, RotateCcw, X } from "lucide-react";
import * as THREE from "three";
import { useSimulationMode } from "./SimulationModeContext";
import {
  RoboticArmModel,
  type BallSimulationState,
  type BallUiStatus,
  type PointerOffset,
} from "./RoboticArmModel";
import {
  BALL_RADIUS,
  DEFAULT_JOINT_ANGLES,
  FLOOR_Y,
  POSE_PRESETS,
  type JointAngles,
  type PosePresetId,
} from "./types";

const KEY_BINDINGS = [
  { keys: "A / D · ← / →", action: "Base Yaw (J1)" },
  { keys: "W / S", action: "Shoulder (J2)" },
  { keys: "I / K · ↑ / ↓", action: "Elbow (J3)" },
  { keys: "Q / E", action: "Wrist Pitch (J5)" },
  { keys: "G / Space", action: "Gripper Open / Close" },
  { keys: "P / X", action: "Pick / Drop Ball" },
  { keys: "R", action: "Reset Home Pose" },
] as const;

function CameraRig() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const isWideDesktop = size.width >= 1024;
    if (isWideDesktop) {
      // Frame robot & pickup workspace further back on the right, keeping left portfolio text clear
      camera.position.set(3.6, 1.72, 6.15);
      camera.lookAt(-1.12, -0.18, 0.68);
    } else {
      camera.position.set(4.15, 1.62, 5.15);
      camera.lookAt(0.12, -0.15, 0.08);
    }
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

function StudioFloor() {
  return (
    <group position={[0, FLOOR_Y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[0.74, 0.755, 64]} />
        <meshBasicMaterial color="#CCCCCC" transparent opacity={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[1.45, 1.465, 64]} />
        <meshBasicMaterial color="#D4D4D4" transparent opacity={0.75} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[1.95, 1.962, 64]} />
        <meshBasicMaterial color="#DCDCDC" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

function clampDropCoords(x: number, z: number): { x: number; z: number } {
  const r = Math.hypot(x, z);
  if (r < 0.001) return { x: 1.05, z: 0.72 };
  const clampedR = THREE.MathUtils.clamp(r, 0.88, 1.85);
  return {
    x: (x / r) * clampedR,
    z: (z / r) * clampedR,
  };
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

interface RoboticArmSceneProps {
  reducedMotion: boolean;
  onContextLost: () => void;
}

export default function RoboticArmScene({
  reducedMotion,
  onContextLost,
}: RoboticArmSceneProps) {
  const { setMode } = useSimulationMode();
  const stageRef = useRef<HTMLDivElement>(null);
  const targetAnglesRef = useRef<JointAngles>({ ...DEFAULT_JOINT_ANGLES });
  const pointerRef = useRef<PointerOffset>({ x: 0, y: 0 });
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const manualControlRef = useRef(false);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const isUnmountingRef = useRef(false);
  const dropCycleRef = useRef(0);

  const ballSimRef = useRef<BallSimulationState>({
    phase: "free",
    timer: 0,
    pos: new THREE.Vector3(0.58, 0.75, 1.18),
    vel: new THREE.Vector3(0, 0, 0),
  });

  const [activePreset, setActivePreset] = useState<PosePresetId | "custom">("home");
  const [keysOpen, setKeysOpen] = useState(false);
  const [ballStatus, setBallStatus] = useState<BallUiStatus>("floor");

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current.x = THREE.MathUtils.clamp(nx, -1, 1);
    pointerRef.current.y = THREE.MathUtils.clamp(ny, -1, 1);
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  }, []);

  const applyPreset = useCallback((presetId: PosePresetId) => {
    const preset = POSE_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    const sim = ballSimRef.current;
    manualControlRef.current = false;
    const nextAngles =
      sim.phase === "holding" ? { ...preset.angles, grip: 0.24 } : { ...preset.angles };
    targetAnglesRef.current = nextAngles;
    setActivePreset(presetId);
  }, []);

  const handleTriggerPick = useCallback(() => {
    const sim = ballSimRef.current;
    if (sim.phase !== "free") return;
    sim.vel.set(0, 0, 0);
    sim.pos.y = Math.max(sim.pos.y, FLOOR_Y + BALL_RADIUS);
    sim.phase = "picking_approach";
    sim.timer = 0;
    setActivePreset("custom");
    setBallStatus("picking");
  }, []);

  const handleDropAt = useCallback((rawX?: number, rawZ?: number) => {
    const sim = ballSimRef.current;

    if (sim.phase === "holding") {
      sim.phase = "free";
      sim.vel.set(0, -0.35, 0);
      targetAnglesRef.current = {
        ...targetAnglesRef.current,
        grip: 0.9,
      };
      setBallStatus("floor");
      return;
    }

    let targetX = rawX;
    let targetZ = rawZ;

    if (targetX === undefined || targetZ === undefined) {
      const presets = [
        { x: 1.05, z: 0.72 },
        { x: 0.72, z: 1.08 },
        { x: 1.28, z: 0.25 },
        { x: 0.92, z: -0.62 },
      ];
      dropCycleRef.current = (dropCycleRef.current + 1) % presets.length;
      targetX = presets[dropCycleRef.current].x;
      targetZ = presets[dropCycleRef.current].z;
    }

    const clamped = clampDropCoords(targetX, targetZ);
    sim.phase = "free";
    sim.timer = 0;
    sim.pos.set(clamped.x, 0.95, clamped.z);
    sim.vel.set(0, -0.4, 0);
    setBallStatus("floor");
  }, []);

  const toggleGripper = useCallback(() => {
    manualControlRef.current = true;
    const sim = ballSimRef.current;

    if (sim.phase === "holding") {
      sim.phase = "free";
      sim.vel.set(0, -0.35, 0);
      targetAnglesRef.current = {
        ...targetAnglesRef.current,
        grip: 0.95,
      };
      setBallStatus("floor");
      setActivePreset("custom");
      return;
    }

    const currentGrip = targetAnglesRef.current.grip;
    const nextGrip = ballStatus === "in-range" ? 0.24 : currentGrip < 0.5 ? 0.95 : 0.24;
    targetAnglesRef.current = {
      ...targetAnglesRef.current,
      grip: nextGrip,
    };
    setActivePreset("custom");
  }, [ballStatus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isEditableElement(event.target)) return;

      const key = event.key.toLowerCase();
      const stageFocused =
        stageRef.current !== null && stageRef.current.contains(document.activeElement);
      const captureNavigationKeys = stageFocused || keysOpen;

      if (
        captureNavigationKeys &&
        (key === "arrowup" ||
          key === "arrowdown" ||
          key === "arrowleft" ||
          key === "arrowright" ||
          key === " ")
      ) {
        event.preventDefault();
      }

      const isMoveKey =
        key === "w" ||
        key === "s" ||
        key === "a" ||
        key === "d" ||
        key === "i" ||
        key === "k" ||
        key === "q" ||
        key === "e" ||
        (captureNavigationKeys &&
          (key === "arrowup" ||
            key === "arrowdown" ||
            key === "arrowleft" ||
            key === "arrowright"));

      if (isMoveKey) {
        pressedKeysRef.current.add(key);
        setActivePreset("custom");
      }

      if (event.repeat) return;

      if (key === "g" || (captureNavigationKeys && key === " ")) {
        toggleGripper();
      } else if (key === "p") {
        handleTriggerPick();
      } else if (key === "x") {
        handleDropAt();
      } else if (key === "r") {
        applyPreset("home");
      } else if (key === "escape" && keysOpen) {
        setKeysOpen(false);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeysRef.current.delete(event.key.toLowerCase());
    };

    const handleWindowBlur = () => {
      pressedKeysRef.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [applyPreset, handleDropAt, handleTriggerPick, keysOpen, toggleGripper]);

  const handleContextLostEvent = useCallback(
    (event: Event) => {
      event.preventDefault();
      // Defer so parent unmount cleanup (which sets isUnmountingRef) runs before reporting real context loss
      window.setTimeout(() => {
        if (!isUnmountingRef.current) {
          onContextLost();
        }
      }, 0);
    },
    [onContextLost]
  );

  useEffect(() => {
    isUnmountingRef.current = false;
    return () => {
      isUnmountingRef.current = true;
      const canvas = canvasElRef.current;
      if (canvas) {
        canvas.removeEventListener("webglcontextlost", handleContextLostEvent);
      }
    };
  }, [handleContextLostEvent]);

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      aria-label="Interactive 6-axis robotic arm simulation. Focus and use WASD, I/K, Q/E, or arrow keys to move joints, G or Space to toggle gripper, P to pick ball, X to drop ball."
      onPointerDown={() => stageRef.current?.focus({ preventScroll: true })}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative h-full w-full overflow-hidden bg-transparent outline-none"
    >
      {/* Top-Right Mode Switcher & Live Simulation Status */}
      <div className="pointer-events-none absolute top-5 right-6 z-20 flex flex-col items-end gap-2 sm:right-8 lg:right-12">
        <div
          role="group"
          aria-label="Simulation vehicle mode"
          className="pointer-events-auto inline-flex border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5"
        >
          <button
            type="button"
            onClick={() => setMode("arm")}
            aria-pressed="true"
            className="inline-flex items-center gap-1.5 bg-[#111111] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#FFFFFF]"
          >
            <Bot className="h-3 w-3 text-[#A3E635]" aria-hidden="true" />
            Arm
          </button>
          <button
            type="button"
            onClick={() => setMode("drone")}
            aria-pressed="false"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#666666] transition-colors hover:text-[#111111]"
          >
            <Plane className="h-3 w-3" aria-hidden="true" />
            Drone
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-[#84CC16]" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#666666]">
            {ballStatus === "holding"
              ? "PAYLOAD GRASPED · G TO DROP"
              : ballStatus === "in-range"
                ? "IN RANGE · PRESS G / SPACE"
                : ballStatus === "picking"
                  ? "IK TRACKING"
                  : "6-DOF ARM · WASD OR CLICK BALL"}
          </span>
        </div>
      </div>

      {/* Full-Hero Borderless Transparent 3D Viewport */}
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [3.6, 1.72, 6.15], fov: 38, near: 0.1, far: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          if (canvasElRef.current && canvasElRef.current !== gl.domElement) {
            canvasElRef.current.removeEventListener("webglcontextlost", handleContextLostEvent);
          }
          canvasElRef.current = gl.domElement;
          gl.domElement.addEventListener("webglcontextlost", handleContextLostEvent);
        }}
      >
        <CameraRig />

        <ambientLight intensity={0.48} />

        <directionalLight
          position={[4.2, 5.8, 3.8]}
          intensity={2.4}
          color="#FFFFFF"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={16}
          shadow-camera-left={-3.5}
          shadow-camera-right={3.5}
          shadow-camera-top={3.5}
          shadow-camera-bottom={-3.5}
          shadow-bias={-0.0005}
        />

        <directionalLight position={[-4.0, 3.2, -3.6]} intensity={1.55} color="#E2E8F0" />

        <pointLight
          position={[1.5, -0.35, 1.8]}
          intensity={0.55}
          distance={5.5}
          decay={2}
          color="#A3E635"
        />

        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer
              form="rect"
              intensity={2.2}
              color="#FFFFFF"
              position={[0, 5, 2]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[7, 4, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.5}
              color="#F1F5F9"
              position={[5, 2, 3]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[5, 4, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.2}
              color="#CBD5E1"
              position={[-5, 2, -2]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[5, 4, 1]}
            />
          </Environment>

          <RoboticArmModel
            targetAnglesRef={targetAnglesRef}
            pointerRef={pointerRef}
            ballSimRef={ballSimRef}
            pressedKeysRef={pressedKeysRef}
            manualControlRef={manualControlRef}
            reducedMotion={reducedMotion}
            onStatusChange={setBallStatus}
            onBallTriggerPick={handleTriggerPick}
            onFloorClickDrop={(x, z) => handleDropAt(x, z)}
          />

          <StudioFloor />

          <ContactShadows
            position={[0, FLOOR_Y + 0.002, 0]}
            opacity={0.28}
            scale={5.5}
            blur={2.0}
            far={3.5}
            frames={1}
            color="#111111"
          />
        </Suspense>
      </Canvas>

      {/* Keyboard Controls Reference Card */}
      {keysOpen ? (
        <div
          aria-label="Keyboard controls reference"
          className="absolute right-6 bottom-16 z-20 w-72 border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-4 text-[var(--color-text-primary)] sm:right-8 lg:right-12"
        >
          <div className="mb-3 flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-primary)]">
              KEYBOARD CONTROLS
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => applyPreset("home")}
                title="Reset to Home Pose (R)"
                aria-label="Reset joints to home pose"
                className="text-[#666666] transition-colors hover:text-[var(--color-text-primary)]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setKeysOpen(false)}
                aria-label="Close keyboard controls"
                className="text-[#666666] transition-colors hover:text-[var(--color-text-primary)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <dl className="space-y-2">
            {KEY_BINDINGS.map((binding) => (
              <div
                key={binding.keys}
                className="flex items-center justify-between gap-3 font-mono text-[10px]"
              >
                <dt className="border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-1.5 py-0.5 text-[var(--color-text-primary)]">
                  {binding.keys}
                </dt>
                <dd className="text-right text-[var(--color-text-secondary)]">
                  {binding.action}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {/* Floating Borderless Simulation Controls Toolbar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-2">
          <div
            className="pointer-events-auto flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label="Robotic arm poses"
          >
            {POSE_PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  aria-pressed={isActive}
                  className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                    isActive
                      ? "border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--color-surface)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5">
            {ballStatus !== "holding" ? (
              <button
                type="button"
                onClick={handleTriggerPick}
                disabled={ballStatus === "picking"}
                className="inline-flex items-center gap-1.5 border border-[var(--color-text-primary)] bg-[var(--color-text-primary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-surface)] transition-colors hover:bg-[#2A2A2A] disabled:opacity-50"
              >
                <Hand className="h-3 w-3" aria-hidden="true" />
                {ballStatus === "picking" ? "Picking..." : "Pick Ball"}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => handleDropAt()}
              className="inline-flex items-center gap-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
            >
              <ArrowDownToLine className="h-3 w-3" aria-hidden="true" />
              Drop Ball
            </button>

            <button
              type="button"
              onClick={() => setKeysOpen((prev) => !prev)}
              aria-expanded={keysOpen}
              className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                keysOpen
                  ? "border-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <Keyboard className="h-3 w-3" aria-hidden="true" />
              Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
