export interface ProjectMediaItem {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ProjectArchitectureLayer {
  layer: string;
  detail: string;
}

export interface Project {
  number: string;
  slug: string;
  title: string;
  category: string;
  status: "Completed" | "Experimental" | "In Development";
  featured?: boolean;
  summary: string;
  overview: string;
  problemStatement: string | null;
  systemArchitecture: ProjectArchitectureLayer[];
  stack: string[];
  features: string[];
  implementation: string[];
  challenges: string[];
  results: string[] | null;
  coverImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  media: ProjectMediaItem[];
  repositoryUrl: string | null;
}

export const projects: Project[] = [
  {
    number: "001",
    slug: "niti-vahan",
    title: "Niti-Vahan",
    category: "Robotics / Autonomous Systems",
    status: "Experimental",
    featured: true,
    summary:
      "An autonomous robotic vehicle developed with computer vision and control systems.",
    overview:
      "Niti-Vahan is an autonomous robotic vehicle project focused on integrating real-time computer vision perception with lateral and longitudinal vehicle control loops inside a simulated robotics environment.",
    problemStatement:
      "Autonomous ground vehicles must reliably interpret road geometry, traffic signage, and dynamic obstacles from visual sensors while translating perception outputs into smooth, stable steering and velocity commands.",
    systemArchitecture: [
      {
        layer: "01 / Simulation Environment",
        detail:
          "CoppeliaSim vehicle scene providing physics, wheel actuation, and onboard vision sensor streams.",
      },
      {
        layer: "02 / Perception Pipeline",
        detail:
          "Python and OpenCV modules handling lane extraction, traffic sign recognition, obstacle detection, and ArUco fiducial marker pose estimation.",
      },
      {
        layer: "03 / Control & Maneuvering",
        detail:
          "PID and Stanley steering controllers paired with state logic for autonomous lane changing, obstacle avoidance, and ArUco-guided parking.",
      },
    ],
    stack: ["Python", "OpenCV", "CoppeliaSim"],
    features: [
      "Lane detection",
      "PID and Stanley controller experimentation",
      "Traffic sign recognition",
      "Obstacle detection and avoidance",
      "Autonomous lane changing",
      "ArUco-based parking",
    ],
    implementation: [
      "Built vision processing pipelines in Python using OpenCV to detect lane boundaries, recognize traffic signs, and identify ArUco markers.",
      "Experimented with both PID and Stanley lateral control algorithms to evaluate path-tracking behavior across turns and lane transitions.",
      "Connected perception triggers to obstacle avoidance, autonomous lane-changing behavior, and marker-guided parking sequences in CoppeliaSim.",
    ],
    challenges: [
      "Coordinating perception latency with closed-loop steering stability during lane changes and tight maneuvers.",
      "Tuning PID and Stanley controller parameters against CoppeliaSim vehicle dynamics and visual noise.",
    ],
    results: null,
    media: [],
    repositoryUrl: null,
  },
  {
    number: "002",
    slug: "genai-text-summarizer",
    title: "GenAI Text Summarizer",
    category: "Artificial Intelligence",
    status: "Experimental",
    featured: false,
    summary:
      "A text summarization application experimenting with locally running language models.",
    overview:
      "GenAI Text Summarizer is an experimental application built to run text summarization workflows using local large language models without relying on external cloud inference APIs.",
    problemStatement:
      "Evaluating how locally hosted language models can summarize long-form text through a lightweight, interactive interface while preserving local execution.",
    systemArchitecture: [
      {
        layer: "01 / User Interface",
        detail:
          "Streamlit web interface for submitting source text and viewing generated summaries.",
      },
      {
        layer: "02 / Application Layer",
        detail:
          "Python backend logic handling prompt formatting and communication with the local model runtime.",
      },
      {
        layer: "03 / Local Inference",
        detail: "Llama language model served locally through Ollama.",
      },
    ],
    stack: ["Python", "Llama", "Ollama", "Streamlit"],
    features: [
      "Local LLM text summarization",
      "Ollama-managed Llama model execution",
      "Interactive Streamlit interface",
    ],
    implementation: [
      "Configured Ollama to run Llama models locally on the development machine.",
      "Built a Python and Streamlit interface to pass user-provided text to the local model and display structured summaries.",
    ],
    challenges: [
      "Managing local hardware compute constraints and response latency when running Llama inference locally.",
    ],
    results: null,
    media: [],
    repositoryUrl: null,
  },
  {
    number: "003",
    slug: "homedesk",
    title: "HomeDesk",
    category: "Software / Product Development",
    status: "In Development",
    featured: false,
    summary: "A software platform under development.",
    overview:
      "HomeDesk is an active software platform currently under development. Technical architecture details, verified stack components, and platform modules will be documented as implementation progresses.",
    problemStatement: null,
    systemArchitecture: [],
    stack: [],
    features: [],
    implementation: [],
    challenges: [],
    results: null,
    media: [],
    repositoryUrl: null,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  previous: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}
