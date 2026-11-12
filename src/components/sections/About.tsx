import { education, experiences, journeyMilestones } from "@/data/experience";
import { profile } from "@/data/profile";
import { LAYOUT } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechBadge } from "@/components/ui/TechBadge";
import { AboutSketchDoodle } from "@/components/illustrations/SectionDoodles";

export function About() {
  const primaryEducation = education[0];
  const latestExperience = experiences[0];

  return (
    <section id="about" className={LAYOUT.section}>
      <div className={LAYOUT.container}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Asymmetric Column: Editorial Heading + Identity Ledger */}
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                index={profile.about.index}
                title={profile.about.headline}
                className="mb-8 md:mb-10"
              />

              <div className="border border-[var(--color-border)] bg-[var(--color-surface)]">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                    ENGINEERING IDENTITY
                  </span>
                  <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                    ID / 02
                  </span>
                </div>

                <dl className="divide-y divide-[var(--color-border)] px-5">
                  <div className="py-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      Name
                    </dt>
                    <dd className="mt-1 font-heading text-base font-medium text-[var(--color-text-primary)]">
                      {profile.name}
                    </dd>
                  </div>

                  {primaryEducation ? (
                    <div className="py-4">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        Education
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                        {primaryEducation.degree}
                      </dd>
                      <dd className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                        {primaryEducation.institution}
                      </dd>
                    </div>
                  ) : null}

                  {latestExperience ? (
                    <div className="py-4">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        Experience
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                        {latestExperience.role}
                      </dd>
                      <dd className="mt-0.5 font-mono text-xs text-[var(--color-text-secondary)]">
                        {latestExperience.organization}
                        {latestExperience.period ? ` · ${latestExperience.period}` : ""}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <AboutSketchDoodle />
            </Reveal>
          </div>

          {/* Right Asymmetric Column: Narrative, Interests, Journey Timeline */}
          <div className="lg:col-span-7">
            <Reveal delay={0.06}>
              <div className="space-y-5 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                {profile.about.paragraphs.map((paragraph, idx) => (
                  <p key={idx} className="max-w-2xl">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            {/* Technical Interests */}
            <Reveal delay={0.12}>
              <div className="mt-12 border-t border-[var(--color-border)] pt-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Areas of Interest
                  </h3>
                  <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                    0{profile.about.interests.length}
                  </span>
                </div>

                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {profile.about.interests.map((interest) => (
                    <li key={interest}>
                      <TechBadge label={interest} className="px-3 py-1.5" />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Small Engineering Journey Timeline */}
            <Reveal delay={0.16}>
              <div className="mt-12 border-t border-[var(--color-border)] pt-8">
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Engineering Journey
                </h3>

                <ol className="relative mt-6 space-y-6 border-l border-[var(--color-border)] pl-6">
                  {journeyMilestones.map((milestone) => (
                    <li key={milestone.id} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 border border-[var(--color-text-primary)] bg-[var(--color-bg-primary)]"
                      />

                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        {milestone.tag}
                      </p>
                      <h4 className="mt-1 font-heading text-base font-medium text-[var(--color-text-primary)] sm:text-lg">
                        {milestone.title}
                      </h4>
                      <p className="mt-0.5 font-mono text-xs text-[var(--color-text-secondary)]">
                        {milestone.subtitle}
                      </p>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {milestone.detail}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
