import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getActiveSocialLinks, profile } from "@/data/profile";
import { LAYOUT } from "@/lib/utils";

const FOOTER_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
] as const;

export function Footer() {
  const socialLinks = getActiveSocialLinks();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] py-12">
      <div className={LAYOUT.container}>
        <div className="flex flex-col justify-between gap-8 border-b border-[var(--color-border)] pb-8 md:flex-row md:items-center">
          <div>
            <Link
              href="/"
              className="font-heading text-lg font-bold tracking-[-0.03em] text-[var(--color-text-primary)]"
            >
              {profile.monogram}
            </Link>
            <p className="mt-2 font-mono text-xs text-[var(--color-text-secondary)]">
              {profile.name} — {profile.identityLabel}
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6">
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                {item.label}
              </Link>
            ))}

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
          </nav>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-[#666666]">
            &copy; 2026 {profile.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
