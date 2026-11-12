import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  bordered?: boolean;
  className?: string;
}

export function SectionHeading({
  index,
  title,
  subtitle,
  aside,
  bordered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col justify-between gap-4 md:mb-14 md:flex-row md:items-end",
        bordered && "border-b border-[var(--color-border)] pb-6",
        className
      )}
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          {index}
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>

      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
