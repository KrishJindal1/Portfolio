export type ClassValue = string | number | boolean | null | undefined;

/**
 * Joins conditional class names cleanly without extra dependencies.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter((value) => typeof value === "string" && value.trim().length > 0).join(" ");
}

/**
 * Shared editorial layout and spacing tokens used across sections and layout chrome.
 */
export const LAYOUT = {
  container: "mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12",
  section: "py-20 md:py-28 border-t border-[var(--color-border)]",
  sectionTight: "py-14 md:py-20 border-t border-[var(--color-border)]",
} as const;
