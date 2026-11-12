export function HeroBackdropDoodles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Subtle architectural drafting dot matrix */}
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage: "radial-gradient(#CCCCCC 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top-Left Registration & Coordinate Sketch */}
      <svg
        viewBox="0 0 260 120"
        className="absolute top-6 left-6 hidden h-24 w-56 text-[#B5B5B0] lg:block"
        fill="none"
      >
        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="1" />
        <path
          d="M28 12H96"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <circle cx="104" cy="12" r="3" stroke="currentColor" strokeWidth="1" />
        <circle cx="104" cy="12" r="1.2" fill="#84CC16" />
        <text
          x="116"
          y="15"
          fill="#999999"
          fontSize="9"
          fontFamily="monospace"
          letterSpacing="1.4"
        >
          ORIGIN (0,0)
        </text>

        {/* Subtle hand-drawn kinematic angle doodle */}
        <path
          d="M14 96 L46 56 L92 64"
          stroke="#CCCCCC"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 79 A20 20 0 0 1 34 96"
          stroke="#84CC16"
          strokeWidth="1.1"
          strokeDasharray="2 2"
        />
        <circle cx="14" cy="96" r="2.5" fill="#EBEBEB" stroke="#999999" strokeWidth="1" />
        <circle cx="46" cy="56" r="2.5" fill="#EBEBEB" stroke="#999999" strokeWidth="1" />
        <circle cx="92" cy="64" r="2" fill="#84CC16" />
        <text x="48" y="49" fill="#999999" fontSize="8" fontFamily="monospace">
          θ2
        </text>
      </svg>

      {/* Bottom-Left Axis Triad & Drafting Ruler Doodle */}
      <svg
        viewBox="0 0 320 110"
        className="absolute bottom-6 left-6 hidden h-24 w-72 lg:block"
        fill="none"
      >
        {/* Isometric 3D Axis Triad */}
        <g transform="translate(26, 62)">
          <path d="M0 0 L0 -30" stroke="#999999" strokeWidth="1.2" />
          <path d="M0 0 L26 14" stroke="#999999" strokeWidth="1.2" />
          <path d="M0 0 L-22 14" stroke="#999999" strokeWidth="1.2" />
          <circle cx="0" cy="-30" r="1.8" fill="#84CC16" />
          <text x="-3" y="-35" fill="#999999" fontSize="8" fontFamily="monospace">
            Y
          </text>
          <text x="30" y="18" fill="#999999" fontSize="8" fontFamily="monospace">
            X
          </text>
          <text x="-31" y="18" fill="#999999" fontSize="8" fontFamily="monospace">
            Z
          </text>
        </g>

        {/* Drafting scale ticks */}
        <g transform="translate(88, 76)">
          <line x1="0" y1="0" x2="180" y2="0" stroke="#CCCCCC" strokeWidth="1" />
          {[0, 30, 60, 90, 120, 150, 180].map((x) => (
            <line
              key={x}
              x1={x}
              y1="0"
              x2={x}
              y2={x % 60 === 0 ? -8 : -4}
              stroke="#BBBBBB"
              strokeWidth="1"
            />
          ))}
          <text x="0" y="14" fill="#999999" fontSize="8" fontFamily="monospace" letterSpacing="1">
            6-DOF KINEMATIC WORKSPACE
          </text>
        </g>
      </svg>

      {/* Subtle Curved Trajectory Sketch Arc */}
      <svg
        viewBox="0 0 400 300"
        className="pointer-events-none absolute top-16 right-[32%] hidden h-64 w-80 opacity-50 xl:block"
        fill="none"
      >
        <path
          d="M20 220 C 110 175, 190 95, 340 72"
          stroke="#CCCCCC"
          strokeWidth="1.1"
          strokeDasharray="4 5"
        />
        <circle cx="20" cy="220" r="3" stroke="#999999" strokeWidth="1" />
        <circle cx="176" cy="134" r="2.5" fill="#84CC16" />
        <path d="M332 68 L342 72 L334 79" stroke="#999999" strokeWidth="1.1" />
      </svg>
    </div>
  );
}

