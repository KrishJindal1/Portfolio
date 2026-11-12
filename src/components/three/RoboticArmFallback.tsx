"use client";

interface RoboticArmFallbackProps {
  reason: "mobile" | "webgl-unavailable" | "loading";
  canEnable3D?: boolean;
  onEnable3D?: () => void;
  onEnableDrone?: () => void;
}

export function RoboticArmFallback({
  reason,
  canEnable3D = false,
  onEnable3D,
  onEnableDrone,
}: RoboticArmFallbackProps) {
  const statusNote =
    reason === "loading"
      ? "INITIALIZING KINEMATIC STAGE"
      : reason === "webgl-unavailable"
        ? "WEBGL UNAVAILABLE — SCHEMATIC VIEW"
        : "6-AXIS KINEMATIC SCHEMATIC";

  return (
    <div className="relative flex h-full min-h-[380px] w-full flex-col justify-between overflow-hidden bg-transparent px-6 py-4 text-[var(--color-text-primary)] lg:items-end lg:px-12 lg:py-8">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#84CC16]" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-primary)]">
            SYSTEM / 001
          </span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#666666]">
          {statusNote}
        </span>
      </div>

      {/* Crisp Technical Kinematic SVG Schematic */}
      <div className="my-4 flex flex-1 items-center justify-center">
        <svg
          viewBox="0 0 360 280"
          role="img"
          aria-label="Six-axis industrial robotic arm kinematic diagram"
          className="h-auto w-full max-w-[320px]"
        >
          {/* Subtle studio grid */}
          <g stroke="#DDDDDD" strokeWidth="1">
            <line x1="20" y1="240" x2="340" y2="240" />
            <line x1="60" y1="40" x2="60" y2="240" strokeDasharray="3 4" />
            <line x1="180" y1="40" x2="180" y2="240" strokeDasharray="3 4" />
            <line x1="300" y1="40" x2="300" y2="240" strokeDasharray="3 4" />
          </g>

          {/* Base Pedestal */}
          <rect x="82" y="218" width="96" height="22" rx="2" fill="#EBEBEB" stroke="#666666" />
          <rect x="96" y="192" width="68" height="26" rx="2" fill="#FFFFFF" stroke="#111111" />
          <line x1="98" y1="214" x2="162" y2="214" stroke="#84CC16" strokeWidth="1.5" />

          {/* Upper Arm (J2 -> J3) */}
          <g transform="translate(130, 192) rotate(-18)">
            <rect x="-13" y="-96" width="26" height="96" rx="4" fill="#2C313A" stroke="#111111" />
            <line x1="0" y1="-84" x2="0" y2="-12" stroke="#111111" strokeWidth="4" />
          </g>

          {/* Shoulder Joint J2 */}
          <circle cx="130" cy="192" r="18" fill="#1A1D23" stroke="#111111" strokeWidth="1.5" />
          <circle cx="130" cy="192" r="10" fill="none" stroke="#A3E635" strokeWidth="1.5" />
          <circle cx="130" cy="192" r="4" fill="#FFFFFF" />

          {/* Forearm (J3 -> J5) */}
          <g transform="translate(100, 100) rotate(56)">
            <rect x="-10" y="-94" width="20" height="94" rx="4" fill="#383E48" stroke="#111111" />
            <line x1="0" y1="-78" x2="0" y2="-16" stroke="#A3E635" strokeWidth="1.2" opacity="0.9" />
          </g>

          {/* Elbow Joint J3 */}
          <circle cx="100" cy="100" r="14" fill="#1A1D23" stroke="#111111" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="7" fill="none" stroke="#A3E635" strokeWidth="1.4" />

          {/* Wrist & Parallel Gripper */}
          <g transform="translate(178, 48) rotate(84)">
            <rect x="-8" y="-28" width="16" height="28" rx="2" fill="#2C313A" stroke="#111111" />
            <rect x="-13" y="-42" width="26" height="10" rx="1" fill="#6C7482" stroke="#111111" />
            <path d="M-9 -42 L-9 -60 L-4 -60 L-4 -42 Z" fill="#2C313A" />
            <path d="M4 -42 L4 -60 L9 -60 L9 -42 Z" fill="#2C313A" />
            <circle cx="0" cy="-35" r="2.2" fill="#A3E635" />
          </g>

          {/* Wrist Joint J5 */}
          <circle cx="178" cy="48" r="9" fill="#1A1D23" stroke="#111111" strokeWidth="1.5" />
          <circle cx="178" cy="48" r="3.5" fill="#A3E635" />

          {/* Target Payload Ball */}
          <circle cx="255" cy="224" r="15" fill="#2C313A" stroke="#111111" strokeWidth="1.2" />
          <ellipse cx="255" cy="224" rx="15" ry="4" fill="none" stroke="#A3E635" strokeWidth="1.4" />

          {/* Axis callout labels */}
          <text x="155" y="196" fill="#666666" fontSize="9" fontFamily="monospace">
            J1 / J2
          </text>
          <text x="64" y="98" fill="#666666" fontSize="9" fontFamily="monospace">
            J3
          </text>
          <text x="193" y="46" fill="#666666" fontSize="9" fontFamily="monospace">
            J5 / J6
          </text>
        </svg>
      </div>

      {/* Footer Info & Optional Mobile 3D Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#666666]">
          ROBOTICS SIMULATION · 6-DOF
        </span>

        {reason === "mobile" && canEnable3D && onEnable3D ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEnable3D}
              className="border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
            >
              Load Arm 3D
            </button>
            {onEnableDrone ? (
              <button
                type="button"
                onClick={onEnableDrone}
                className="border border-[#111111] bg-[#111111] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#FFFFFF] transition-colors hover:bg-[#2A2A2A]"
              >
                Fly Drone
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
