interface ProjectIllustrationProps {
  slug: string;
}

function NitiVahanIllustration() {
  return (
    <svg
      viewBox="0 0 480 260"
      aria-hidden="true"
      className="h-full w-full max-h-[240px]"
      fill="none"
    >
      {/* Curved Autonomous Road / Lane Geometry */}
      <path
        d="M40 245 C 120 170, 210 120, 420 45"
        stroke="#111111"
        strokeWidth="1.6"
      />
      <path
        d="M150 250 C 225 185, 300 138, 465 82"
        stroke="#111111"
        strokeWidth="1.6"
      />
      {/* Dashed Lane Centerline */}
      <path
        d="M95 248 C 172 178, 255 129, 442 64"
        stroke="#666666"
        strokeWidth="1.2"
        strokeDasharray="8 7"
      />

      {/* Stanley Steering Lookahead Trajectory */}
      <path
        d="M168 186 Q 230 132 308 104"
        stroke="#84CC16"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <circle cx="308" cy="104" r="4.5" fill="#84CC16" />

      {/* Perception FOV Cone */}
      <path
        d="M168 186 L285 78 L345 138 Z"
        fill="#84CC16"
        fillOpacity="0.09"
        stroke="#84CC16"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Autonomous Vehicle Chassis */}
      <g transform="translate(152, 188) rotate(-32)">
        <rect
          x="-24"
          y="-14"
          width="48"
          height="28"
          rx="4"
          fill="#FFFFFF"
          stroke="#111111"
          strokeWidth="1.8"
        />
        <rect x="-18" y="-17" width="12" height="4" rx="1" fill="#111111" />
        <rect x="6" y="-17" width="12" height="4" rx="1" fill="#111111" />
        <rect x="-18" y="13" width="12" height="4" rx="1" fill="#111111" />
        <rect x="6" y="13" width="12" height="4" rx="1" fill="#111111" />
        <circle cx="14" cy="0" r="3" fill="#84CC16" />
      </g>

      {/* Obstacle Bounding Box */}
      <g transform="translate(274, 146)">
        <rect
          x="0"
          y="0"
          width="34"
          height="26"
          fill="#FFFFFF"
          stroke="#111111"
          strokeWidth="1.4"
        />
        <path
          d="M-5 5 V-5 H5 M29 -5 H39 V5 M-5 21 V31 H5 M29 31 H39 V21"
          stroke="#84CC16"
          strokeWidth="1.5"
        />
        <text x="4" y="16" fill="#111111" fontSize="8" fontFamily="monospace">
          OBS
        </text>
      </g>

      {/* ArUco Marker Target */}
      <g transform="translate(382, 168)">
        <rect width="46" height="46" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
        <rect x="6" y="6" width="34" height="34" fill="#111111" />
        <rect x="11" y="11" width="8" height="8" fill="#FFFFFF" />
        <rect x="27" y="11" width="8" height="8" fill="#FFFFFF" />
        <rect x="19" y="19" width="8" height="8" fill="#FFFFFF" />
        <rect x="11" y="27" width="8" height="8" fill="#FFFFFF" />
        <text x="0" y="59" fill="#666666" fontSize="8" fontFamily="monospace">
          ARUCO_PARK
        </text>
      </g>

      {/* Traffic Sign Recognition Node */}
      <g transform="translate(52, 54)">
        <polygon
          points="22,0 44,38 0,38"
          fill="#FFFFFF"
          stroke="#111111"
          strokeWidth="1.5"
        />
        <line x1="22" y1="14" x2="22" y2="25" stroke="#111111" strokeWidth="1.8" />
        <circle cx="22" cy="30" r="1.5" fill="#84CC16" />
        <text x="-4" y="52" fill="#666666" fontSize="8" fontFamily="monospace">
          SIGN_ROI
        </text>
      </g>
    </svg>
  );
}

function GenAiIllustration() {
  return (
    <svg
      viewBox="0 0 420 220"
      aria-hidden="true"
      className="h-full w-full max-h-[200px]"
      fill="none"
    >
      {/* Input Document Card */}
      <g transform="translate(26, 44)">
        <rect width="102" height="128" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
        <line x1="14" y1="22" x2="84" y2="22" stroke="#111111" strokeWidth="2" />
        {[38, 52, 66, 80, 94, 108].map((y, idx) => (
          <line
            key={y}
            x1="14"
            y1={y}
            x2={idx % 2 === 0 ? 86 : 70}
            y2={y}
            stroke="#999999"
            strokeWidth="1.5"
          />
        ))}
        <text x="0" y="144" fill="#666666" fontSize="8" fontFamily="monospace">
          SOURCE_TEXT
        </text>
      </g>

      {/* Token Flow Connectors */}
      <path d="M134 90 H168" stroke="#111111" strokeWidth="1.3" strokeDasharray="3 3" />
      <path d="M134 114 H168" stroke="#84CC16" strokeWidth="1.5" />
      <path d="M254 108 H288" stroke="#111111" strokeWidth="1.3" strokeDasharray="3 3" />

      {/* Local Ollama / Llama Inference Node */}
      <g transform="translate(170, 64)">
        <circle cx="42" cy="44" r="40" fill="#FFFFFF" stroke="#111111" strokeWidth="1.6" />
        <circle
          cx="42"
          cy="44"
          r="29"
          stroke="#84CC16"
          strokeWidth="1.4"
          strokeDasharray="5 4"
        />
        <circle cx="42" cy="44" r="12" fill="#111111" />
        <circle cx="42" cy="44" r="4" fill="#A3E635" />
        <text x="8" y="102" fill="#666666" fontSize="8" fontFamily="monospace">
          LOCAL_LLAMA
        </text>
      </g>

      {/* Compressed Summary Output */}
      <g transform="translate(292, 64)">
        <rect width="102" height="88" fill="#FFFFFF" stroke="#111111" strokeWidth="1.6" />
        <rect x="0" y="0" width="102" height="18" fill="#111111" />
        <circle cx="12" cy="9" r="3" fill="#A3E635" />
        <line x1="14" y1="36" x2="86" y2="36" stroke="#111111" strokeWidth="1.8" />
        <line x1="14" y1="52" x2="78" y2="52" stroke="#666666" strokeWidth="1.6" />
        <line x1="14" y1="68" x2="64" y2="68" stroke="#84CC16" strokeWidth="1.8" />
        <text x="0" y="105" fill="#666666" fontSize="8" fontFamily="monospace">
          STREAMLIT_OUT
        </text>
      </g>
    </svg>
  );
}

function HomeDeskIllustration() {
  return (
    <svg
      viewBox="0 0 420 220"
      aria-hidden="true"
      className="h-full w-full max-h-[200px]"
      fill="none"
    >
      {/* Modular Workspace Application Blueprint */}
      <g transform="translate(46, 28)">
        <rect width="328" height="162" fill="#FFFFFF" stroke="#111111" strokeWidth="1.6" />
        {/* Window Top Chrome */}
        <line x1="0" y1="26" x2="328" y2="26" stroke="#111111" strokeWidth="1.2" />
        <circle cx="14" cy="13" r="3" fill="#111111" />
        <circle cx="25" cy="13" r="3" stroke="#111111" strokeWidth="1.2" />
        <circle cx="36" cy="13" r="3" fill="#84CC16" />

        {/* Sidebar Navigation Module */}
        <line x1="86" y1="26" x2="86" y2="162" stroke="#DDDDDD" strokeWidth="1.2" />
        <rect x="14" y="42" width="56" height="8" fill="#111111" />
        <rect x="14" y="60" width="44" height="6" fill="#DDDDDD" />
        <rect x="14" y="74" width="50" height="6" fill="#DDDDDD" />
        <rect x="14" y="88" width="38" height="6" fill="#DDDDDD" />

        {/* Main Modular Canvas Blocks */}
        <rect x="104" y="42" width="96" height="54" fill="#F5F5F3" stroke="#111111" strokeWidth="1.2" />
        <path d="M116 74 L138 56 L158 68 L186 48" stroke="#84CC16" strokeWidth="1.8" />
        <circle cx="186" cy="48" r="3" fill="#84CC16" />

        <rect x="212" y="42" width="98" height="54" fill="#F5F5F3" stroke="#DDDDDD" strokeWidth="1.2" />
        <line x1="224" y1="58" x2="294" y2="58" stroke="#111111" strokeWidth="1.6" />
        <line x1="224" y1="72" x2="278" y2="72" stroke="#999999" strokeWidth="1.4" />

        <rect
          x="104"
          y="108"
          width="206"
          height="38"
          fill="#FFFFFF"
          stroke="#DDDDDD"
          strokeDasharray="4 3"
          strokeWidth="1.2"
        />
        <text x="116" y="131" fill="#666666" fontSize="9" fontFamily="monospace">
          MODULAR PLATFORM · IN DEVELOPMENT
        </text>
      </g>
    </svg>
  );
}

export function ProjectIllustration({ slug }: ProjectIllustrationProps) {
  if (slug === "niti-vahan") {
    return <NitiVahanIllustration />;
  }
  if (slug === "genai-text-summarizer") {
    return <GenAiIllustration />;
  }
  return <HomeDeskIllustration />;
}

