"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useSimulationMode } from "./SimulationModeContext";

const DroneOverlayScene = dynamic(() => import("./DroneOverlayScene"), {
  ssr: false,
  loading: () => null,
});

const emptySubscribe = () => () => {};

function subscribeMotion(callback: () => void): () => void {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
        canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false })
    );
  } catch {
    return false;
  }
}

export function DroneOverlayWrapper() {
  const { mode } = useSimulationMode();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const webglAvailable = useSyncExternalStore(
    emptySubscribe,
    detectWebGL,
    () => false
  );

  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  if (!mounted || mode !== "drone" || !webglAvailable) {
    return null;
  }

  return <DroneOverlayScene reducedMotion={reducedMotion} />;
}
