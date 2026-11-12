import { education, experiences } from "@/data/experience";
import { LAYOUT } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  return (
    <section id="experience" className={LAYOUT.section}>
      <div className={LAYOUT.container}>
        <Reveal>
          <SectionHeading
            index="04 / BACKGROUND"
            title="Experience & Education"
            subtitle="Academic foundation, industry internship, and autonomous robotics engineering experience."
            bordered
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Experience Timeline */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Experience
                </h3>
                <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                  0{experiences.length}
                </span>
              </div>

              <ol className="relative mt-8 space-y-8 border-l border-[var(--color-border)] pl-6">
                {experiences.map((exp, index) => (
                  <li key={exp.id} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[29px] top-2 h-2.5 w-2.5 border border-[var(--color-text-primary)] bg-[var(--color-surface)]"
                    />

                    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-200 hover:border-[var(--color-text-primary)]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                          0{index + 1} · {exp.kind}
                        </span>
                        {exp.period ? (
                          <span className="border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--color-text-secondary)]">
                            {exp.period}
                          </span>
                        ) : null}
                      </div>

                      <h4 className="mt-3 font-heading text-xl font-medium text-[var(--color-text-primary)]">
                        {exp.organization}
                      </h4>
                      <p className="mt-1 font-mono text-xs text-[var(--color-text-secondary)]">
                        {exp.role}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {exp.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* Education Column */}
          <div className="lg:col-span-5">
            <Reveal delay={0.08}>
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Education
                </h3>
                <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                  0{education.length}
                </span>
              </div>

              <div className="mt-8 space-y-6">
                {education.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-200 hover:border-[var(--color-text-primary)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        {item.kind}
                      </span>
                      {item.period ? (
                        <span className="font-mono text-[11px] text-[var(--color-text-secondary)]">
                          {item.period}
                        </span>
                      ) : null}
                    </div>

                    <h4 className="mt-3 font-heading text-xl font-medium text-[var(--color-text-primary)]">
                      {item.institution}
                    </h4>
                    <p className="mt-1 font-mono text-xs text-[var(--color-text-secondary)]">
                      {item.degree}
                    </p>
                    {item.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
