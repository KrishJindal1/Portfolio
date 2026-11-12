export interface ExperienceItem {
  id: string;
  kind: "INTERNSHIP" | "PROJECT EXPERIENCE";
  role: string;
  organization: string;
  period?: string;
  description: string;
}

export interface EducationItem {
  id: string;
  kind: "EDUCATION";
  degree: string;
  institution: string;
  period?: string;
  description?: string;
}

export interface JourneyMilestone {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  detail: string;
}

export const experiences: ExperienceItem[] = [
  {
    id: "ericsson-genai-2026",
    kind: "INTERNSHIP",
    role: "Generative AI Summer Internship",
    organization: "Ericsson",
    period: "2026",
    description: "Summer internship focused on generative artificial intelligence.",
  },
  {
    id: "eyrc-autonomous-robotics",
    kind: "PROJECT EXPERIENCE",
    role: "Autonomous Robotics Project Experience",
    organization: "eYRC",
    description: "Hands-on autonomous robotics project development experience.",
  },
];

export const education: EducationItem[] = [
  {
    id: "dce-btech-cse",
    kind: "EDUCATION",
    degree: "B.Tech CSE",
    institution: "Dronacharya College of Engineering",
    description: "Bachelor of Technology in Computer Science and Engineering.",
  },
];

export const journeyMilestones: JourneyMilestone[] = [
  {
    id: "journey-education",
    tag: "FOUNDATION",
    title: "B.Tech Computer Science and Engineering",
    subtitle: "Dronacharya College of Engineering",
    detail: "Undergraduate computer science and software engineering studies.",
  },
  {
    id: "journey-eyrc",
    tag: "ROBOTICS",
    title: "Autonomous Robotics Project Experience",
    subtitle: "eYRC",
    detail: "Applied autonomous robotics and embedded/vision experimentation.",
  },
  {
    id: "journey-ericsson",
    tag: "INTERNSHIP · 2026",
    title: "Generative AI Summer Internship",
    subtitle: "Ericsson",
    detail: "Industry summer internship focused on generative artificial intelligence.",
  },
];
