"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SimulationMode = "arm" | "drone";

export type SecretEggId =
  | "niti-vahan-telemetry"
  | "about-neural-loop"
  | "skills-barrel-roll"
  | "contact-transmission";

export interface SecretEggMeta {
  id: SecretEggId;
  code: string;
  title: string;
  reward: string;
  hint: string;
  sectionSelector: string;
}

export const SECRET_EGGS: SecretEggMeta[] = [
  {
    id: "niti-vahan-telemetry",
    code: "SEC-01",
    title: "Niti-Vahan Telemetry Lock",
    reward: "Unlocked simulated Stanley + PID telemetry on Niti-Vahan.",
    hint: "Fly down to Selected Projects (#work) and scan the Niti-Vahan card.",
    sectionSelector: '[data-drone-secret="niti-vahan-telemetry"]',
  },
  {
    id: "about-neural-loop",
    code: "SEC-02",
    title: "System Loop Overdrive",
    reward: "Perception loop verified — drone navigation LEDs boosted.",
    hint: "Fly to About Me (#about) and scan the Sense → Think → Act diagram.",
    sectionSelector: '[data-drone-secret="about-neural-loop"]',
  },
  {
    id: "skills-barrel-roll",
    code: "SEC-03",
    title: "Aerobatic Calibration",
    reward: "Barrel roll unlocked — press B anytime in flight to roll 360°.",
    hint: "Fly to Technical Skills (#skills) and scan the capabilities matrix.",
    sectionSelector: '[data-drone-secret="skills-barrel-roll"]',
  },
  {
    id: "contact-transmission",
    code: "SEC-04",
    title: "Signal Intercepted",
    reward: "Transmission decrypted at Contact — link ready.",
    hint: "Fly down to Contact (#contact) and scan the signal packet doodle.",
    sectionSelector: '[data-drone-secret="contact-transmission"]',
  },
];

interface SimulationModeContextValue {
  mode: SimulationMode;
  setMode: (mode: SimulationMode) => void;
  discoveredEggs: SecretEggId[];
  latestUnlocked: SecretEggMeta | null;
  unlockEgg: (id: SecretEggId) => boolean;
  dismissLatest: () => void;
}

const SimulationModeContext = createContext<SimulationModeContextValue | null>(null);

export function SimulationModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SimulationMode>("arm");
  const [discoveredEggs, setDiscoveredEggs] = useState<SecretEggId[]>([]);
  const [latestUnlocked, setLatestUnlocked] = useState<SecretEggMeta | null>(null);

  const unlockEgg = useCallback((id: SecretEggId) => {
    let newlyUnlocked = false;
    setDiscoveredEggs((prev) => {
      if (prev.includes(id)) return prev;
      newlyUnlocked = true;
      return [...prev, id];
    });
    const meta = SECRET_EGGS.find((egg) => egg.id === id) ?? null;
    if (meta) {
      setLatestUnlocked(meta);
    }
    return newlyUnlocked;
  }, []);

  const dismissLatest = useCallback(() => {
    setLatestUnlocked(null);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      discoveredEggs,
      latestUnlocked,
      unlockEgg,
      dismissLatest,
    }),
    [mode, discoveredEggs, latestUnlocked, unlockEgg, dismissLatest]
  );

  return (
    <SimulationModeContext.Provider value={value}>
      {children}
    </SimulationModeContext.Provider>
  );
}

export function useSimulationMode(): SimulationModeContextValue {
  const ctx = useContext(SimulationModeContext);
  if (!ctx) {
    throw new Error("useSimulationMode must be used within SimulationModeProvider");
  }
  return ctx;
}

