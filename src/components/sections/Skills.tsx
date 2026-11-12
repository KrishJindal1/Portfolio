import { skillGroups } from "@/data/skills";
import { LAYOUT } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechBadge } from "@/components/ui/TechBadge";
import { SkillDomainIllustration } from "@/components/illustrations/SectionDoodles";
import { SecretRewardBadge } from "@/components/three/SecretRewardBadge";

export function Skills() {
  const totalSkills = skillGroups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <section id="skills" className={LAYOUT.section}>
      <div className={LAYOUT.container}>
        <Reveal>
          <SectionHeading
            index="03 / CAPABILITIES"
            title="Technical Skills"
            subtitle="Core languages, robotics tooling, computer vision, software frameworks, and 3D environments used across hands-on builds."
            bordered
            aside={
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                0{skillGroups.length} DOMAINS · {totalSkills} TOOLS
              </span>
            }
          />
        </Reveal>

        <div
          data-drone-secret="skills-barrel-roll"
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {skillGroups.map((group, index) => (
            <Reveal key={group.id} delay={0.05 * index}>
              <div className="flex h-full flex-col justify-between border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-200 hover:border-[var(--color-text-primary)]">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-6 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                    DOMAIN / {group.code}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                    0{group.items.length}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-xl font-medium tracking-tight text-[var(--color-text-primary)]">
                      {group.label}
                    </h3>
                    <SkillDomainIllustration domainId={group.id} />
                  </div>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item}>
                        <TechBadge label={item} className="px-3 py-1.5" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <SecretRewardBadge eggId="skills-barrel-roll" />
      </div>
    </section>
  );
}
