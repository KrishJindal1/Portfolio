import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, FolderGit2 } from "lucide-react";
import type { Project } from "@/data/projects";
import { LAYOUT } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TechBadge } from "@/components/ui/TechBadge";

interface DetailSectionProps {
  index: string;
  title: string;
  children: ReactNode;
}

function DetailSection({ index, title, children }: DetailSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-4 border-t border-[var(--color-border)] py-10 md:grid-cols-12 md:gap-10 md:py-12">
      <div className="md:col-span-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          {index}
        </p>
        <h2 className="mt-1.5 font-heading text-xl font-medium text-[var(--color-text-primary)]">
          {title}
        </h2>
      </div>
      <div className="md:col-span-8">{children}</div>
    </section>
  );
}

interface PendingNoticeProps {
  label: string;
  detail: string;
}

function PendingNotice({ label, detail }: PendingNoticeProps) {
  return (
    <div className="border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">{detail}</p>
    </div>
  );
}

interface ProjectDetailViewProps {
  project: Project;
  previous: Project | null;
  next: Project | null;
}

export function ProjectDetailView({
  project,
  previous,
  next,
}: ProjectDetailViewProps) {
  return (
    <article className="py-12 sm:py-16 lg:py-20">
      <div className={LAYOUT.container}>
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button href="/#work" variant="ghost" size="sm" className="-ml-3">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Projects
          </Button>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            PROJECT / {project.number}
          </span>
        </div>

        {/* Hero Header */}
        <Reveal>
          <header className="mt-8 pb-10 md:pb-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                {project.category}
              </span>
              <span className="text-[var(--color-border)]" aria-hidden="true">
                /
              </span>
              <span className="border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                {project.status}
              </span>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
              {project.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
              {project.summary}
            </p>
          </header>
        </Reveal>

        {/* 1. Overview */}
        <DetailSection index="01 / OVERVIEW" title="Overview">
          <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            {project.overview}
          </p>
          {project.features.length > 0 ? (
            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Documented Scope &amp; Features
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--color-text-primary)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </DetailSection>

        {/* 2. Problem Statement */}
        <DetailSection index="02 / PROBLEM" title="Problem Statement">
          {project.problemStatement ? (
            <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
              {project.problemStatement}
            </p>
          ) : (
            <PendingNotice
              label="DOCUMENTATION PENDING"
              detail="Problem statement details will be added as the project specification is finalized."
            />
          )}
        </DetailSection>

        {/* 3. System Architecture */}
        <DetailSection index="03 / ARCHITECTURE" title="System Architecture">
          {project.systemArchitecture.length > 0 ? (
            <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              {project.systemArchitecture.map((item) => (
                <div key={item.layer} className="p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    {item.layer}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <PendingNotice
              label="ARCHITECTURE PENDING"
              detail="System architecture modules will be documented once verified against the active codebase."
            />
          )}
        </DetailSection>

        {/* 4. Technologies Used */}
        <DetailSection index="04 / STACK" title="Technologies Used">
          {project.stack.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {project.stack.map((tech) => (
                <TechBadge key={tech} label={tech} className="px-3.5 py-1.5 text-sm" />
              ))}
            </div>
          ) : (
            <PendingNotice
              label="STACK VERIFICATION PENDING"
              detail="Technologies will be listed only after verification against the project implementation."
            />
          )}
        </DetailSection>

        {/* 5. Implementation */}
        <DetailSection index="05 / IMPLEMENTATION" title="Implementation">
          {project.implementation.length > 0 ? (
            <ul className="space-y-4">
              {project.implementation.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
                  <span className="mt-1 font-mono text-xs text-[var(--color-text-muted)]">
                    0{index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <PendingNotice
              label="IMPLEMENTATION IN PROGRESS"
              detail="Implementation notes will be published as core engineering milestones are completed."
            />
          )}
        </DetailSection>

        {/* 6. Challenges */}
        <DetailSection index="06 / CHALLENGES" title="Challenges">
          {project.challenges.length > 0 ? (
            <ul className="space-y-3">
              {project.challenges.map((challenge, index) => (
                <li
                  key={index}
                  className="border-l-2 border-[var(--color-border)] pl-4 text-base leading-relaxed text-[var(--color-text-secondary)]"
                >
                  {challenge}
                </li>
              ))}
            </ul>
          ) : (
            <PendingNotice
              label="CHALLENGES PENDING"
              detail="Engineering trade-offs and technical challenges will be documented after testing."
            />
          )}
        </DetailSection>

        {/* 7. Results */}
        <DetailSection index="07 / RESULTS" title="Results">
          {project.results && project.results.length > 0 ? (
            <ul className="space-y-3">
              {project.results.map((result, index) => (
                <li
                  key={index}
                  className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-primary)] sm:text-base"
                >
                  {result}
                </li>
              ))}
            </ul>
          ) : (
            <PendingNotice
              label="RESULTS NOT YET PUBLISHED"
              detail="Verified evaluation outcomes and observations will be added once documented."
            />
          )}
        </DetailSection>

        {/* 8. Screenshots or Demonstration Video */}
        <DetailSection index="08 / MEDIA" title="Screenshots &amp; Demonstration">
          {project.media.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {project.media.map((item, index) => (
                <figure
                  key={index}
                  className="border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                >
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      controls
                      preload="metadata"
                      className="w-full bg-[var(--color-bg-secondary)]"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width ?? 1280}
                      height={item.height ?? 720}
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="h-auto w-full object-cover"
                    />
                  )}
                  {item.caption ? (
                    <figcaption className="mt-3 border-t border-[var(--color-border)] pt-2.5 font-mono text-xs text-[var(--color-text-muted)]">
                      {item.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : (
            <PendingNotice
              label="MEDIA PENDING"
              detail={`Screenshots or demonstration video clips for ${project.title} have not been uploaded yet.`}
            />
          )}
        </DetailSection>

        {/* 9. GitHub Repository Link */}
        <DetailSection index="09 / SOURCE" title="GitHub Repository">
          {project.repositoryUrl ? (
            <Button href={project.repositoryUrl} external variant="primary" size="lg">
              <FolderGit2 className="h-4 w-4" aria-hidden="true" />
              View GitHub Repository
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <PendingNotice
              label="REPOSITORY LINK PENDING"
              detail="A verified GitHub repository URL has not been published for this project yet."
            />
          )}
        </DetailSection>

        {/* Previous / Next Project Navigation */}
        <nav
          aria-label="Project navigation"
          className="mt-4 grid grid-cols-1 gap-4 border-t border-[var(--color-border)] pt-10 sm:grid-cols-2"
        >
          <div>
            {previous ? (
              <Link
                href={`/projects/${previous.slug}`}
                className="group flex flex-col border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-text-primary)]"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Previous Project · {previous.number}
                </span>
                <span className="mt-2 font-heading text-lg font-medium text-[var(--color-text-primary)]">
                  {previous.title}
                </span>
              </Link>
            ) : null}
          </div>

          <div>
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group flex flex-col items-start border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-text-primary)] sm:items-end sm:text-right"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Next Project · {next.number}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="mt-2 font-heading text-lg font-medium text-[var(--color-text-primary)]">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </article>
  );
}

