import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { getActiveSocialLinks, profile } from "@/data/profile";
import { LAYOUT } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { HeroBackdropDoodles } from "@/components/illustrations/HeroBackdropDoodles";
import { RoboticArmCanvasWrapper } from "@/components/three/RoboticArmCanvasWrapper";

export function Hero() {
  const socialLinks = getActiveSocialLinks();

  return (
    <section
      id="hero"
      className="relative flex flex-col overflow-hidden pt-12 pb-12 lg:min-h-[calc(100vh-4rem)] lg:flex-row lg:items-center lg:py-0"
    >
      {/* Subtle Drafting Doodles & Engineering Graphics Backdrop */}
      <HeroBackdropDoodles />

      {/* Full-Hero Borderless Interactive Simulation Window */}
      <div className="order-2 mt-8 h-[440px] w-full sm:h-[520px] lg:absolute lg:inset-0 lg:mt-0 lg:h-full">
        <RoboticArmCanvasWrapper />
      </div>

      {/* Left-Aligned Minimal Portfolio Identity */}
      <div className="pointer-events-none relative z-10 order-1 w-full lg:py-24">
        <div className={LAYOUT.container}>
          <div className="max-w-md lg:max-w-[440px]">
            <h1 className="font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-6xl lg:text-[4.5rem]">
              {profile.name}
            </h1>

            <p className="mt-6 text-base leading-[1.65] text-[var(--color-text-secondary)] sm:text-lg">
              Computer Science engineering student building across robotics, computer vision,
              artificial intelligence, and software engineering.
            </p>

            <div className="pointer-events-auto mt-9 flex w-fit flex-wrap items-center gap-3">
              <Button href="/#work" variant="primary" size="lg">
                Selected Work
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </Button>

              <Button
                href={profile.resumePath}
                download="Krish_Jindal_Resume.pdf"
                variant="secondary"
                size="lg"
              >
                Resume
                <Download className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {socialLinks.length > 0 ? (
              <div className="pointer-events-auto mt-7 flex w-fit items-center gap-5">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
