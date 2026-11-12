export interface SkillGroup {
  id: string;
  code: string;
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "robotics-autonomous",
    code: "01",
    label: "Robotics and Autonomous Systems",
    items: ["C++", "Python", "CoppeliaSim", "Arduino", "ESP32"],
  },
  {
    id: "cv-ai",
    code: "02",
    label: "Computer Vision and AI",
    items: ["OpenCV", "NumPy", "Llama", "Ollama", "Streamlit"],
  },
  {
    id: "software-engineering",
    code: "03",
    label: "Software Engineering",
    items: ["JavaScript", "React", "Next.js", "Node.js", "Supabase"],
  },
  {
    id: "3d-interactive",
    code: "04",
    label: "3D and Interactive Development",
    items: ["Blender", "Unity", "Three.js"],
  },
];
