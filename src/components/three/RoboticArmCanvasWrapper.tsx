"use client";

import { Component, useState, useSyncExternalStore } from "react";
import type { ErrorInfo, ReactNode } from "react";
import dynamic from "next/dynamic";
import { Bot } from "lucide-react";
import { RoboticArmFallback } from "./RoboticArmFallback";
import { useSimulationMode } from "./SimulationModeContext";

const RoboticArmScene = dynamic(() => import("./RoboticArmScene"), {
  ssr: false,
  loading: () => <RoboticArmFallback reason="loading" />,
});

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("3D Robotic Arm scene failed to render:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const emptySubscribe = () => () => {};

function subscribeMediaQuery(query: string, callback: () => void): () => void {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

let cachedWebGLSupport: boolean | null = null;
function getWebGLSupport(): boolean {
  if (cachedWebGLSupport !== null) return cachedWebGLSupport;
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    cachedWebGLSupport = Boolean(gl);
  } catch {
    cachedWebGLSupport = false;
  }
  return cachedWebGLSupport;
}

function DroneLaunchpadStage({ onSwitchToArm }: { onSwitchToArm: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center lg:justify-end lg:pr-24">
      <div className="flex flex-col items-center text-center">
        {/* Clean Minimalist Helipad Graphic */}
        <svg viewBox="0 0 220 140" aria-hidden="true" className="h-32 w-52">
          <ellipse
            cx="110"
            cy="78"
            rx="86"
            ry="34"
            fill="none"
            stroke="#CCCCCC"
            strokeWidth="1.2"
          />
          <ellipse
            cx="110"
            cy="78"
            rx="56"
            ry="22"
            fill="none"
            stroke="#84CC16"
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />
          <path
            d="M96 68 V88 M124 68 V88 M96 78 H124"
            stroke="#111111"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>

        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-primary)]">
          DRONE FLIGHT ACTIVE
        </p>
        <p className="mt-1 max-w-xs text-xs text-[#666666]">
          Fly anywhere across the portfolio with WASD / Arrows. Press Space to scan for 4 hidden
          secrets.
        </p>

        <button
          type="button"
          onClick={onSwitchToArm}
          className="mt-4 inline-flex items-center gap-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-primary)] transition-colors hover:border-[#111111]"
        >
          <Bot className="h-3.5 w-3.5" aria-hidden="true" />
          Switch to Arm
        </button>
      </div>
    </div>
  );
}

export function RoboticArmCanvasWrapper() {
  const { mode, setMode } = useSimulationMode();
  const [forceMobile3D, setForceMobile3D] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const webglAvailable = useSyncExternalStore(
    emptySubscribe,
    getWebGLSupport,
    () => false
  );

  const isMobile = useSyncExternalStore(
    (cb) => subscribeMediaQuery("(max-width: 767px)", cb),
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false
  );

  const reducedMotion = useSyncExternalStore(
    (cb) => subscribeMediaQuery("(prefers-reduced-motion: reduce)", cb),
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  if (!mounted) {
    return <RoboticArmFallback reason="loading" />;
  }

  if (!webglAvailable || contextLost) {
    return <RoboticArmFallback reason="webgl-unavailable" />;
  }

  if (mode === "drone") {
    return <DroneLaunchpadStage onSwitchToArm={() => setMode("arm")} />;
  }

  if (isMobile && !forceMobile3D) {
    return (
      <RoboticArmFallback
        reason="mobile"
        canEnable3D={webglAvailable}
        onEnable3D={() => setForceMobile3D(true)}
        onEnableDrone={() => setMode("drone")}
      />
    );
  }

  return (
    <SceneErrorBoundary fallback={<RoboticArmFallback reason="webgl-unavailable" />}>
      <RoboticArmScene
        reducedMotion={reducedMotion}
        onContextLost={() => setContextLost(true)}
      />
    </SceneErrorBoundary>
  );
}
