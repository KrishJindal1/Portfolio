import { SecretRewardBadge } from "@/components/three/SecretRewardBadge";

export function SkillDomainIllustration({ domainId }: { domainId: string }) {
  if (domainId === "robotics-autonomous") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10 shrink-0" fill="none">
        <rect x="8" y="38" width="20" height="4" fill="#111111" />
        <path d="M18 38 L13 24 L27 13 L37 17" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="18" cy="38" r="2.5" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
        <circle cx="13" cy="24" r="3" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
        <circle cx="27" cy="13" r="2.5" fill="#84CC16" stroke="#111111" strokeWidth="1.2" />
        <path d="M36 14 L41 12 M36 20 L41 21" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (domainId === "cv-ai") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10 shrink-0" fill="none">
        <path
          d="M10 16 V10 H16 M32 10 H38 V16 M10 32 V38 H16 M32 38 H38 V32"
          stroke="#111111"
          strokeWidth="1.6"
        />
        <circle cx="24" cy="24" r="9" stroke="#111111" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="3.5" fill="#84CC16" />
        <line x1="6" y1="24" x2="12" y2="24" stroke="#999999" strokeWidth="1.2" />
        <line x1="36" y1="24" x2="42" y2="24" stroke="#999999" strokeWidth="1.2" />
      </svg>
    );
  }

  if (domainId === "software-engineering") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10 shrink-0" fill="none">
        <rect x="7" y="9" width="34" height="30" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
        <line x1="7" y1="17" x2="41" y2="17" stroke="#111111" strokeWidth="1.2" />
        <circle cx="12" cy="13" r="1.5" fill="#84CC16" />
        <path d="M15 24 L20 28 L15 32" stroke="#111111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="23" y1="32" x2="33" y2="32" stroke="#111111" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10 shrink-0" fill="none">
      <polygon
        points="24,7 39,15.5 39,32.5 24,41 9,32.5 9,15.5"
        stroke="#111111"
        strokeWidth="1.5"
      />
      <path d="M9 15.5 L24 24 L39 15.5 M24 24 V41" stroke="#111111" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="2.8" fill="#84CC16" />
    </svg>
  );
}

export function AboutSketchDoodle() {
  return (
    <div
      data-drone-secret="about-neural-loop"
      className="mt-6 border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-[#666666]">
        <span>SYSTEM LOOP SKETCH</span>
        <span>SENSE → THINK → ACT</span>
      </div>
      <svg aria-hidden="true" viewBox="0 0 340 96" className="h-auto w-full" fill="none">
        {/* Sense Node */}
        <rect x="8" y="24" width="76" height="44" fill="#F5F5F3" stroke="#111111" strokeWidth="1.3" />
        <circle cx="26" cy="46" r="7" stroke="#111111" strokeWidth="1.3" />
        <circle cx="26" cy="46" r="2.5" fill="#84CC16" />
        <text x="40" y="49" fill="#111111" fontSize="9" fontFamily="monospace">
          VISION
        </text>

        {/* Connector 1 */}
        <path d="M84 46 H124" stroke="#111111" strokeWidth="1.3" strokeDasharray="3 3" />
        <path d="M118 42 L125 46 L118 50" stroke="#111111" strokeWidth="1.3" />

        {/* Compute / AI Node */}
        <rect x="128" y="24" width="84" height="44" fill="#111111" />
        <circle cx="148" cy="46" r="3" fill="#A3E635" />
        <text x="158" y="49" fill="#FFFFFF" fontSize="9" fontFamily="monospace">
          MODEL
        </text>

        {/* Connector 2 */}
        <path d="M212 46 H252" stroke="#111111" strokeWidth="1.3" strokeDasharray="3 3" />
        <path d="M246 42 L253 46 L246 50" stroke="#111111" strokeWidth="1.3" />

        {/* Actuate Node */}
        <rect x="256" y="24" width="76" height="44" fill="#F5F5F3" stroke="#111111" strokeWidth="1.3" />
        <path d="M270 54 L277 41 L287 38" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="287" cy="38" r="2.2" fill="#84CC16" />
        <text x="294" y="49" fill="#111111" fontSize="9" fontFamily="monospace">
          ARM
        </text>

        {/* Feedback Arc */}
        <path
          d="M294 68 C 294 88, 46 88, 46 68"
          stroke="#999999"
          strokeWidth="1.1"
          strokeDasharray="4 4"
        />
        <path d="M42 74 L46 67 L50 74" stroke="#999999" strokeWidth="1.1" />
      </svg>
      <SecretRewardBadge eggId="about-neural-loop" />
    </div>
  );
}

export function ContactSignalDoodle() {
  return (
    <svg
      viewBox="0 0 280 76"
      aria-hidden="true"
      className="mt-10 hidden h-16 w-64 lg:block"
      fill="none"
    >
      <circle cx="22" cy="38" r="6" fill="#111111" />
      <circle cx="22" cy="38" r="2.2" fill="#A3E635" />
      <path d="M36 28 A16 16 0 0 1 36 48" stroke="#999999" strokeWidth="1.2" />
      <path d="M43 21 A25 25 0 0 1 43 55" stroke="#CCCCCC" strokeWidth="1.2" />
      <path
        d="M58 38 C 110 38, 130 18, 192 22"
        stroke="#BBBBBB"
        strokeWidth="1.2"
        strokeDasharray="4 4"
      />
      {/* Minimal Paper Plane / Packet Doodle */}
      <polygon
        points="204,22 232,14 218,34 214,25"
        fill="#FFFFFF"
        stroke="#111111"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <line x1="214" y1="25" x2="232" y2="14" stroke="#84CC16" strokeWidth="1.2" />
    </svg>
  );
}

