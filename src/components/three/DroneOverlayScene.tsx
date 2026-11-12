"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bot,
  Compass,
  Keyboard,
  Radar,
  RotateCw,
  Sparkles,
  X,
} from "lucide-react";
import * as THREE from "three";
import { DroneModel, type DroneFlightState } from "./DroneModel";
import {
  SECRET_EGGS,
  useSimulationMode,
  type SecretEggId,
  type SecretEggMeta,
} from "./SimulationModeContext";

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

interface FlightPhysicsLoopProps {
  flightRef: React.MutableRefObject<DroneFlightState>;
  keysRef: React.MutableRefObject<Set<string>>;
  onNearbyChange: (egg: SecretEggMeta | null) => void;
}

function findSecretUnderDrone(nx: number, ny: number): SecretEggMeta | null {
  if (typeof window === "undefined") return null;
  const px = ((nx + 1) / 2) * window.innerWidth;
  const py = ((1 - ny) / 2) * window.innerHeight;
  const padding = 52;

  for (const egg of SECRET_EGGS) {
    const el = document.querySelector(egg.sectionSelector);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (
      px >= rect.left - padding &&
      px <= rect.right + padding &&
      py >= rect.top - padding &&
      py <= rect.bottom + padding
    ) {
      return egg;
    }
  }
  return null;
}

function FlightPhysicsLoop({
  flightRef,
  keysRef,
  onNearbyChange,
}: FlightPhysicsLoopProps) {
  const lastCheckRef = useRef(0);
  const lastNearbyIdRef = useRef<SecretEggId | null>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const flight = flightRef.current;
    const keys = keysRef.current;

    const boost = keys.has("shift") ? 1.75 : 1;
    const accel = 3.2 * boost;
    const damping = 5.4;

    const inputX =
      (keys.has("d") || keys.has("arrowright") ? 1 : 0) -
      (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
    const inputY =
      (keys.has("w") || keys.has("arrowup") ? 1 : 0) -
      (keys.has("s") || keys.has("arrowdown") ? 1 : 0);

    flight.vx += inputX * accel * dt;
    flight.vy += inputY * accel * dt;

    flight.vx = THREE.MathUtils.damp(flight.vx, 0, damping, dt);
    flight.vy = THREE.MathUtils.damp(flight.vy, 0, damping, dt);

    flight.nx = THREE.MathUtils.clamp(flight.nx + flight.vx * dt, -0.88, 0.88);
    flight.ny = THREE.MathUtils.clamp(flight.ny + flight.vy * dt, -0.82, 0.82);

    // Gently steer yaw toward horizontal flight direction
    if (Math.abs(flight.vx) > 0.05) {
      flight.yaw = THREE.MathUtils.clamp(flight.vx * 0.45, -0.65, 0.65);
    } else {
      flight.yaw = THREE.MathUtils.damp(flight.yaw, 0, 4, dt);
    }

    // Smoothly auto-scroll webpage when flying against top/bottom viewport edges
    if (inputY < 0 && flight.ny <= -0.74) {
      window.scrollBy({ top: 560 * boost * dt, behavior: "auto" });
    } else if (inputY > 0 && flight.ny >= 0.74) {
      window.scrollBy({ top: -560 * boost * dt, behavior: "auto" });
    }

    // Throttled secret target radar check (~8Hz)
    const now = state.clock.elapsedTime;
    if (now - lastCheckRef.current > 0.12) {
      lastCheckRef.current = now;
      const nearby = findSecretUnderDrone(flight.nx, flight.ny);
      const nextId = nearby?.id ?? null;
      if (nextId !== lastNearbyIdRef.current) {
        lastNearbyIdRef.current = nextId;
        onNearbyChange(nearby);
      }
    }
  });

  return null;
}

interface DroneOverlaySceneProps {
  reducedMotion: boolean;
}

export default function DroneOverlayScene({ reducedMotion }: DroneOverlaySceneProps) {
  const {
    setMode,
    discoveredEggs,
    latestUnlocked,
    unlockEgg,
    dismissLatest,
  } = useSimulationMode();

  const flightRef = useRef<DroneFlightState>({
    nx: 0.34,
    ny: 0.06,
    vx: 0,
    vy: 0,
    yaw: 0,
    scanPulse: 0,
    barrelRollProgress: 0,
  });
  const keysRef = useRef<Set<string>>(new Set());

  const [nearbySecret, setNearbySecret] = useState<SecretEggMeta | null>(null);
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);

  const overdriveUnlocked = discoveredEggs.includes("about-neural-loop");
  const barrelRollUnlocked = discoveredEggs.includes("skills-barrel-roll");

  const triggerScan = useCallback(() => {
    const flight = flightRef.current;
    flight.scanPulse = 1;
    const hit = findSecretUnderDrone(flight.nx, flight.ny);
    if (hit) {
      unlockEgg(hit.id);
    }
  }, [unlockEgg]);

  const triggerBarrelRoll = useCallback(() => {
    if (!barrelRollUnlocked) return;
    if (flightRef.current.barrelRollProgress === 0) {
      flightRef.current.barrelRollProgress = 0.001;
    }
  }, [barrelRollUnlocked]);

  const jumpToMission = useCallback((egg: SecretEggMeta) => {
    const el = document.querySelector(egg.sectionSelector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  useEffect(() => {
    if (!latestUnlocked) return;
    const timer = window.setTimeout(() => dismissLatest(), 5000);
    return () => window.clearTimeout(timer);
  }, [dismissLatest, latestUnlocked]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isEditableElement(event.target)) return;

      const key = event.key.toLowerCase();
      if (
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright" ||
        key === " "
      ) {
        event.preventDefault();
      }

      keysRef.current.add(key);

      if (event.repeat) return;

      if (key === " " || key === "f") {
        triggerScan();
      } else if (key === "b") {
        triggerBarrelRoll();
      } else if (key === "r") {
        flightRef.current.nx = 0.34;
        flightRef.current.ny = 0.06;
        flightRef.current.vx = 0;
        flightRef.current.vy = 0;
      } else if (key === "escape") {
        setMode("arm");
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    const handleBlur = () => {
      keysRef.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [setMode, triggerBarrelRoll, triggerScan]);

  const setVirtualKey = (key: string, active: boolean) => {
    if (active) {
      keysRef.current.add(key);
    } else {
      keysRef.current.delete(key);
    }
  };

  return (
    <>
      {/* Full-Website Transparent Drone Canvas Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30"
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 38, near: 0.1, far: 40 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 5]} intensity={2.2} color="#FFFFFF" />
          <directionalLight position={[-4, -2, 3]} intensity={1.1} color="#CBD5E1" />

          <Suspense fallback={null}>
            <Environment resolution={128} frames={1}>
              <Lightformer
                form="rect"
                intensity={2.0}
                color="#FFFFFF"
                position={[0, 5, 3]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[6, 4, 1]}
              />
              <Lightformer
                form="rect"
                intensity={1.3}
                color="#CBD5E1"
                position={[-4, 2, 2]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[4, 4, 1]}
              />
            </Environment>

            <DroneModel
              flightRef={flightRef}
              overdrive={overdriveUnlocked}
              reducedMotion={reducedMotion}
            />
            <FlightPhysicsLoop
              flightRef={flightRef}
              keysRef={keysRef}
              onNearbyChange={setNearbySecret}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Easter Egg Discovery Toast */}
      {latestUnlocked ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-5 z-40 w-80 border border-[#111111] bg-[#111111] p-4 text-[#F5F5F3]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#A3E635]" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A3E635]">
                {latestUnlocked.code} · SECRET UNLOCKED
              </span>
            </div>
            <button
              type="button"
              onClick={dismissLatest}
              aria-label="Dismiss notification"
              className="text-[#999999] hover:text-[#FFFFFF]"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 font-heading text-base font-medium">
            {latestUnlocked.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#D4D4D8]">
            {latestUnlocked.reward}
          </p>
        </div>
      ) : null}

      {/* Floating Drone Flight HUD */}
      <div className="fixed right-5 bottom-5 z-40 flex flex-col items-end gap-2.5">
        {/* Target Lock Prompt */}
        {nearbySecret ? (
          <div className="flex items-center gap-2 border border-[#111111] bg-[#FFFFFF] px-3 py-1.5 font-mono text-[11px] text-[#111111]">
            <span className="h-2 w-2 rounded-full bg-[#84CC16]" aria-hidden="true" />
            <span>
              LOCKED: {nearbySecret.code} — PRESS SPACE / SCAN
            </span>
          </div>
        ) : null}

        {/* Secret Missions Radar Panel */}
        {missionsOpen ? (
          <div className="w-80 border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-4 text-[var(--color-text-primary)]">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--color-border)] pb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                SECRET DRONE MISSIONS ({discoveredEggs.length}/{SECRET_EGGS.length})
              </span>
              <button
                type="button"
                onClick={() => setMissionsOpen(false)}
                aria-label="Close missions panel"
                className="text-[#666666] hover:text-[var(--color-text-primary)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <ul className="space-y-2.5">
              {SECRET_EGGS.map((egg) => {
                const found = discoveredEggs.includes(egg.id);
                return (
                  <li
                    key={egg.id}
                    className="border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#666666]">
                        {egg.code} · {found ? "UNLOCKED" : "HIDDEN"}
                      </span>
                      <button
                        type="button"
                        onClick={() => jumpToMission(egg)}
                        className="font-mono text-[10px] uppercase tracking-[0.12em] underline hover:opacity-70"
                      >
                        Locate
                      </button>
                    </div>
                    <p className="mt-1 font-heading text-xs font-medium text-[var(--color-text-primary)]">
                      {found ? egg.title : egg.hint}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {/* Flight Keys Panel */}
        {keysOpen ? (
          <div className="w-72 border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-4 text-[var(--color-text-primary)]">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--color-border)] pb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                DRONE FLIGHT KEYS
              </span>
              <button
                type="button"
                onClick={() => setKeysOpen(false)}
                aria-label="Close flight keys"
                className="text-[#666666] hover:text-[var(--color-text-primary)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <dl className="space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-primary)]">WASD / Arrows</dt>
                <dd className="text-[#666666]">Fly &amp; Auto-Scroll</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-primary)]">Shift</dt>
                <dd className="text-[#666666]">Turbo Boost</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-primary)]">Space / F</dt>
                <dd className="text-[#666666]">Scan Secret Target</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-primary)]">B</dt>
                <dd className="text-[#666666]">
                  {barrelRollUnlocked ? "Barrel Roll" : "Locked (SEC-03)"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-primary)]">R / Esc</dt>
                <dd className="text-[#666666]">Center / Exit Drone</dd>
              </div>
            </dl>
          </div>
        ) : null}

        {/* Compact Touch / Pointer Flight D-Pad (helpful on mobile/trackpad) */}
        <div className="flex items-center gap-1 border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-1 md:hidden">
          <button
            type="button"
            aria-label="Fly left"
            onPointerDown={() => setVirtualKey("a", true)}
            onPointerUp={() => setVirtualKey("a", false)}
            onPointerLeave={() => setVirtualKey("a", false)}
            className="border border-[var(--color-border)] p-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Fly up"
            onPointerDown={() => setVirtualKey("w", true)}
            onPointerUp={() => setVirtualKey("w", false)}
            onPointerLeave={() => setVirtualKey("w", false)}
            className="border border-[var(--color-border)] p-1.5"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Fly down"
            onPointerDown={() => setVirtualKey("s", true)}
            onPointerUp={() => setVirtualKey("s", false)}
            onPointerLeave={() => setVirtualKey("s", false)}
            className="border border-[var(--color-border)] p-1.5"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Fly right"
            onPointerDown={() => setVirtualKey("d", true)}
            onPointerUp={() => setVirtualKey("d", false)}
            onPointerLeave={() => setVirtualKey("d", false)}
            className="border border-[var(--color-border)] p-1.5"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Main Floating Flight Control Bar */}
        <div className="flex flex-wrap items-center gap-1.5 border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-1.5">
          <button
            type="button"
            onClick={triggerScan}
            className="inline-flex items-center gap-1.5 border border-[#111111] bg-[#111111] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#FFFFFF] transition-colors hover:bg-[#2A2A2A]"
          >
            <Radar className="h-3 w-3 text-[#A3E635]" aria-hidden="true" />
            Scan
          </button>

          {barrelRollUnlocked ? (
            <button
              type="button"
              onClick={triggerBarrelRoll}
              className="inline-flex items-center gap-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-primary)] hover:border-[#111111]"
            >
              <RotateCw className="h-3 w-3" aria-hidden="true" />
              Roll
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setMissionsOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-primary)] hover:border-[#111111]"
          >
            <Compass className="h-3 w-3" aria-hidden="true" />
            Secrets {discoveredEggs.length}/{SECRET_EGGS.length}
          </button>

          <button
            type="button"
            onClick={() => setKeysOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-secondary)] hover:border-[#111111] hover:text-[#111111]"
          >
            <Keyboard className="h-3 w-3" aria-hidden="true" />
            Keys
          </button>

          <button
            type="button"
            onClick={() => setMode("arm")}
            className="inline-flex items-center gap-1.5 border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-primary)] hover:border-[#111111]"
          >
            <Bot className="h-3 w-3" aria-hidden="true" />
            Arm Mode
          </button>
        </div>
      </div>
    </>
  );
}
