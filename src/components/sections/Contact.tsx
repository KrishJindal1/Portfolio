import { ArrowUpRight, Download, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { LAYOUT } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { Reveal } from "@/components/ui/Reveal";
import { ContactSignalDoodle } from "@/components/illustrations/SectionDoodles";
import { SecretRewardBadge } from "@/components/three/SecretRewardBadge";

export function Contact() {
  const email = profile.email?.trim() || null;
  const githubUrl = profile.githubUrl?.trim() || null;
  const linkedinUrl = profile.linkedinUrl?.trim() || null;

  return (
    <section id="contact" className={LAYOUT.section}>
      <div className={LAYOUT.container}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Editorial CTA Headline */}
          <div className="lg:col-span-6">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#666666]">
                {profile.contact.index}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold leading-[1.12] tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-[2.75rem]">
                {profile.contact.headline}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                {profile.contact.supportingText}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                {email ? (
                  <Button href={`mailto:${email}`} variant="primary" size="lg">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Send Email
                  </Button>
                ) : null}

                <Button
                  href={profile.resumePath}
                  download="Krish_Jindal_Resume.pdf"
                  variant={email ? "secondary" : "primary"}
                  size="lg"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Resume
                </Button>
              </div>

              <ContactSignalDoodle />
              <SecretRewardBadge eggId="contact-transmission" />
            </Reveal>
          </div>

          {/* Right Column: Structured Monochrome Contact Directory */}
          <div data-drone-secret="contact-transmission" className="lg:col-span-6">
            <Reveal delay={0.08}>
              <div className="border border-[var(--color-border)] bg-[var(--color-surface)]">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-6 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                    CHANNELS &amp; DOCUMENTS
                  </span>
                  <span className="font-mono text-[11px] text-[#666666]">04</span>
                </div>

                <dl className="divide-y divide-[var(--color-border)]">
                  {/* Email */}
                  <div className="flex flex-col justify-between gap-3 px-6 py-5 sm:flex-row sm:items-center">
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#666666]">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                        {email ? (
                          <a href={`mailto:${email}`} className="hover:underline">
                            {email}
                          </a>
                        ) : (
                          <span className="font-mono text-xs font-normal text-[#666666]">
                            Email address not yet published
                          </span>
                        )}
                      </dd>
                    </div>
                    {email ? <CopyEmailButton email={email} /> : null}
                  </div>

                  {/* GitHub */}
                  <div className="flex flex-col justify-between gap-3 px-6 py-5 sm:flex-row sm:items-center">
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#666666]">
                        GitHub
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                        {githubUrl ? (
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:underline"
                          >
                            <span>View GitHub Profile</span>
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="font-mono text-xs font-normal text-[#666666]">
                            GitHub URL pending configuration
                          </span>
                        )}
                      </dd>
                    </div>
                    {githubUrl ? (
                      <Button href={githubUrl} external variant="secondary" size="sm">
                        Open
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    ) : null}
                  </div>

                  {/* LinkedIn */}
                  <div className="flex flex-col justify-between gap-3 px-6 py-5 sm:flex-row sm:items-center">
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#666666]">
                        LinkedIn
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                        {linkedinUrl ? (
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:underline"
                          >
                            <span>View LinkedIn Profile</span>
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="font-mono text-xs font-normal text-[#666666]">
                            LinkedIn URL pending configuration
                          </span>
                        )}
                      </dd>
                    </div>
                    {linkedinUrl ? (
                      <Button href={linkedinUrl} external variant="secondary" size="sm">
                        Open
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    ) : null}
                  </div>

                  {/* Resume */}
                  <div className="flex flex-col justify-between gap-3 px-6 py-5 sm:flex-row sm:items-center">
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#666666]">
                        Resume
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                        PDF Document
                      </dd>
                    </div>
                    <Button
                      href={profile.resumePath}
                      download="Krish_Jindal_Resume.pdf"
                      variant="secondary"
                      size="sm"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      Download
                    </Button>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
