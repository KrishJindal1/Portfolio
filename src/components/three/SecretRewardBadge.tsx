"use client";

import { Sparkles } from "lucide-react";
import { useSimulationMode, type SecretEggId } from "./SimulationModeContext";

const REWARD_COPY: Record<SecretEggId, { label: string; value: string }> = {
  "niti-vahan-telemetry": {
    label: "TELEMETRY UNLOCKED",
    value: "PID + Stanley Control · ArUco Lock Ready",
  },
  "about-neural-loop": {
    label: "NEURAL LOOP VERIFIED",
    value: "Curiosity compiles into reality.",
  },
  "skills-barrel-roll": {
    label: "AEROBATICS ACTIVE",
    value: "Press B in Drone Mode for 360° Barrel Roll",
  },
  "contact-transmission": {
    label: "SIGNAL INTERCEPTED",
    value: "Direct transmission link primed.",
  },
};

export function SecretRewardBadge({ eggId }: { eggId: SecretEggId }) {
  const { discoveredEggs } = useSimulationMode();

  if (!discoveredEggs.includes(eggId)) {
    return null;
  }

  const info = REWARD_COPY[eggId];

  return (
    <div className="mt-3 flex items-center gap-2 border border-[#111111] bg-[#111111] px-3 py-1.5 font-mono text-[10px] text-[#F5F5F3]">
      <Sparkles className="h-3 w-3 shrink-0 text-[#A3E635]" aria-hidden="true" />
      <span className="uppercase tracking-[0.12em] text-[#A3E635]">{info.label}:</span>
      <span className="truncate text-[#E4E4E7]">{info.value}</span>
    </div>
  );
}
