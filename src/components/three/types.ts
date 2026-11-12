export interface JointAngles {
  /** Base turret rotation around Y axis (radians) */
  j1: number;
  /** Shoulder pitch around Z axis (radians) */
  j2: number;
  /** Elbow pitch around Z axis (radians) */
  j3: number;
  /** Forearm roll around Y axis (radians) */
  j4: number;
  /** Wrist pitch around Z axis (radians) */
  j5: number;
  /** Tool flange roll around Y axis (radians) */
  j6: number;
  /** Parallel gripper opening (0 = closed, 1 = open) */
  grip: number;
}

export type PosePresetId = "home";

export interface PosePreset {
  id: PosePresetId;
  label: string;
  angles: JointAngles;
}

export const POSE_PRESETS: PosePreset[] = [
  {
    id: "home",
    label: "HOME",
    angles: {
      j1: -0.52,
      j2: 0.28,
      j3: -1.12,
      j4: 0.0,
      j5: -0.42,
      j6: 0.0,
      grip: 0.55,
    },
  },
];

export const DEFAULT_JOINT_ANGLES: JointAngles = POSE_PRESETS[0].angles;

export const JOINT_LIMITS = {
  j1: { min: -Math.PI, max: Math.PI },
  j2: { min: -1.15, max: 0.85 },
  j3: { min: -2.35, max: -0.2 },
  j5: { min: -1.65, max: 0.65 },
} as const;

export const FLOOR_Y = -1.32;
export const BALL_RADIUS = 0.14;

/**
 * Analytic 3D inverse kinematics solver for the 6-axis arm pointing downward
 * to grasp a target at world coordinates (tx, ty, tz).
 */
export function solveArmIK(
  tx: number,
  ty: number,
  tz: number,
  grip: number
): JointAngles {
  const shoulderWorldY = FLOOR_Y + 0.24 + 0.38; // -0.70
  const l1 = 1.32; // upper arm length (J2 -> J3)
  const l2 = 1.17; // forearm + wrist offset (J3 -> J5)
  const lTool = 0.455; // J5 -> gripper pinch center

  const r = Math.max(0.45, Math.hypot(tx, tz));
  const j1 = Math.atan2(-tz, tx);

  // Place J5 directly above target pinch point for vertical top-down grasp
  const wristY = ty + lTool - shoulderWorldY;
  const maxReach = l1 + l2 - 0.04;
  const minReach = Math.abs(l1 - l2) + 0.04;

  let d = Math.hypot(r, wristY);
  let dx = r;
  let dy = wristY;

  if (d > maxReach) {
    const scale = maxReach / d;
    dx *= scale;
    dy *= scale;
    d = maxReach;
  } else if (d < minReach) {
    const scale = minReach / Math.max(d, 0.001);
    dx *= scale;
    dy *= scale;
    d = minReach;
  }

  const gamma = Math.atan2(dx, dy);
  const cosA = Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
  const angleA = Math.acos(cosA);

  // Elbow-up configuration
  const alpha1 = gamma - angleA;
  const j2 = -alpha1;

  const cosB = Math.min(1, Math.max(-1, (l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2)));
  const angleB = Math.acos(cosB);
  const j3 = -(Math.PI - angleB);

  // Keep tool flange pointing straight downward (alpha_total = PI)
  const j5 = -Math.PI - j2 - j3;

  return {
    j1,
    j2,
    j3,
    j4: 0,
    j5,
    j6: 0,
    grip,
  };
}
