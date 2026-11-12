import { projects } from "@/data/projects";
import { LAYOUT } from "@/lib/utils";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Projects() {
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];
  const secondaryProjects = projects.filter(
    (project) => project.slug !== featuredProject?.slug
  );

  return (
    <section id="work" className={LAYOUT.section}>
      <div className={LAYOUT.container}>
        <Reveal>
          <SectionHeading
            index="01 / WORK"
            title="Selected Projects"
            subtitle="Engineering builds across autonomous robotics, local generative AI tooling, and software systems."
            bordered
            aside={
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                0{projects.length} CASE STUDIES
              </span>
            }
          />
        </Reveal>

        <div className="space-y-8">
          {featuredProject ? (
            <Reveal>
              <ProjectCard project={featuredProject} variant="featured" />
            </Reveal>
          ) : null}

          {secondaryProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {secondaryProjects.map((project, index) => (
                <Reveal key={project.slug} delay={0.05 * (index + 1)}>
                  <ProjectCard project={project} variant="default" />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
