import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectIllustration } from "@/components/illustrations/ProjectIllustrations";
import { SecretRewardBadge } from "@/components/three/SecretRewardBadge";
import { TechBadge } from "@/components/ui/TechBadge";

interface ProjectPreviewFrameProps {
  project: Project;
  featured: boolean;
}

function ProjectPreviewFrame({ project, featured }: ProjectPreviewFrameProps) {
  if (project.coverImage) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[var(--color-bg-secondary)]",
          featured
            ? "aspect-[16/10] lg:h-full lg:min-h-[360px] lg:aspect-auto"
            : "aspect-[16/10]"
        )}
      >
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            width={project.coverImage.width}
            height={project.coverImage.height}
            sizes={featured ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 768px) 100vw, 50vw"}
            className="h-full w-full object-cover grayscale transition-[transform,filter] duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
          />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex w-full flex-col justify-between overflow-hidden bg-[var(--color-bg-secondary)] p-6",
        featured
          ? "aspect-[16/10] lg:h-full lg:min-h-[360px] lg:aspect-auto"
          : "aspect-[16/10]"
      )}
    >
      {/* Subtle architectural crosshair grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(to right, #DDDDDD 1px, transparent 1px), linear-gradient(to bottom, #DDDDDD 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <span className="border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
          PROJECT / {project.number}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#666666]">
          {project.status}
        </span>
      </div>

      <div className="relative z-10 my-auto flex flex-1 items-center justify-center py-4 transition-transform duration-300 group-hover:scale-[1.02]">
        <ProjectIllustration slug={project.slug} />
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-[var(--color-border)] pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#666666]">
        <span>{project.category}</span>
        <span>/{project.slug}</span>
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  variant?: "featured" | "default";
}

export function ProjectCard({ project, variant = "default" }: ProjectCardProps) {
  const isFeatured = variant === "featured";

  return (
    <article
      data-drone-secret={project.slug === "niti-vahan" ? "niti-vahan-telemetry" : undefined}
      className={cn(
        "group relative border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-200 hover:border-[var(--color-text-primary)]",
        isFeatured ? "grid grid-cols-1 lg:grid-cols-12" : "flex flex-col"
      )}
    >
      {/* Large Visual Preview */}
      <div
        className={cn(
          "border-b border-[var(--color-border)]",
          isFeatured && "lg:col-span-7 lg:border-r lg:border-b-0"
        )}
      >
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`Open ${project.title} case study`}
          className="block h-full"
        >
          <ProjectPreviewFrame project={project} featured={isFeatured} />
        </Link>
      </div>

      {/* Editorial Metadata & Copy */}
      <div
        className={cn(
          "flex flex-1 flex-col justify-between p-6 sm:p-8",
          isFeatured && "lg:col-span-5"
        )}
      >
        <div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              {project.number} · {project.category}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
              {project.status}
            </span>
          </div>

          <h3
            className={cn(
              "mt-4 font-heading font-semibold tracking-tight text-[var(--color-text-primary)]",
              isFeatured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            )}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-[var(--color-text-secondary)]"
            >
              <span>{project.title}</span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
            {project.summary}
          </p>

          {project.slug === "niti-vahan" ? (
            <SecretRewardBadge eggId="niti-vahan-telemetry" />
          ) : null}

          {isFeatured && project.features.length > 0 ? (
            <div className="mt-6 border-t border-[var(--color-border)] pt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Documented Capabilities
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)] sm:text-sm"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-[var(--color-text-primary)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-[var(--color-border)] pt-5">
          {project.stack.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <TechBadge key={tech} label={tech} />
              ))}
            </div>
          ) : (
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Stack documentation pending verification
            </p>
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-primary)] transition-opacity hover:opacity-70"
          >
            <span>View Project</span>
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
