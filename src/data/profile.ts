export interface SocialLink {
  label: "GitHub" | "LinkedIn";
  href: string;
}

export interface AboutConfig {
  index: string;
  headline: string;
  paragraphs: string[];
  interests: string[];
}

export interface ContactConfig {
  index: string;
  headline: string;
  supportingText: string;
}

export interface ProfileConfig {
  name: string;
  monogram: string;
  eyebrow: string;
  headline: string;
  description: string;
  identityLabel: string;
  educationSummary: string;
  technicalStatus: {
    code: string;
    label: string;
  };
  focusAreas: string[];
  coreStack: string[];
  about: AboutConfig;
  contact: ContactConfig;
  resumePath: string;
  /**
   * Supply actual verified email, GitHub, and LinkedIn URLs when ready.
   * Empty strings or undefined values are never fabricated.
   */
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export const profile: ProfileConfig = {
  name: "Krish Jindal",
  monogram: "KJ.",
  eyebrow: "ENGINEERING PORTFOLIO / 2026",
  headline: "Building intelligent systems that interact with the real world.",
  description:
    "I'm Krish Jindal, a Computer Science engineering student exploring robotics, artificial intelligence, computer vision and software engineering.",
  identityLabel: "B.Tech Computer Science & Engineering",
  educationSummary: "B.Tech CSE — Dronacharya College of Engineering",
  technicalStatus: {
    code: "SYSTEM / 001",
    label: "ROBOTICS SIMULATION",
  },
  focusAreas: [
    "Robotics",
    "Artificial Intelligence",
    "Computer Vision",
    "Software Engineering",
  ],
  coreStack: ["C++", "Python", "TypeScript", "React", "Next.js", "Node.js"],
  about: {
    index: "02 / ABOUT ME",
    headline: "Curiosity drives the build.",
    paragraphs: [
      "I'm a Computer Science engineering student interested in understanding how intelligent systems work and how software can interact with the physical world.",
      "I enjoy experimenting with robotics, computer vision and artificial intelligence, while developing my software engineering skills.",
    ],
    interests: [
      "Robotics",
      "Artificial Intelligence",
      "Computer Vision",
      "Autonomous Systems",
      "Software Engineering",
      "3D Development",
    ],
  },
  contact: {
    index: "05 / CONTACT",
    headline: "Have an interesting problem to solve?",
    supportingText: "Let's build something meaningful.",
  },
  resumePath: "/resume.pdf",
  email: undefined,
  githubUrl: undefined,
  linkedinUrl: undefined,
};

export function getActiveSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [];
  if (profile.githubUrl && profile.githubUrl.trim().length > 0) {
    links.push({ label: "GitHub", href: profile.githubUrl.trim() });
  }
  if (profile.linkedinUrl && profile.linkedinUrl.trim().length > 0) {
    links.push({ label: "LinkedIn", href: profile.linkedinUrl.trim() });
  }
  return links;
}
