"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/profile";
import { cn, LAYOUT } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/#about" },
  { id: "experience", label: "Experience", href: "/#experience" },
  { id: "contact", label: "Contact", href: "/#contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        } else if (window.scrollY < 160) {
          setActiveSection("");
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const currentSection =
    pathname !== "/"
      ? pathname.startsWith("/projects")
        ? "work"
        : ""
      : activeSection;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-[var(--color-bg-primary)] transition-colors duration-200",
        scrolled ? "border-[#CCCCCC]" : "border-[var(--color-border)]"
      )}
    >
      <div className={cn(LAYOUT.container, "flex h-16 items-center justify-between")}>
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          aria-label={`${profile.name} — Home`}
          className="font-heading text-lg font-bold tracking-[-0.03em] text-[var(--color-text-primary)] transition-opacity hover:opacity-75"
        >
          {profile.monogram}
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative py-1 font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-200",
                  isActive
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-[1px] h-[1.5px] bg-[var(--color-text-primary)] transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex h-9 w-9 items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-text-primary)] md:hidden"
        >
          {menuOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] md:hidden"
        >
          <div className={cn(LAYOUT.container, "flex flex-col divide-y divide-[var(--color-border)] py-2")}>
            {NAV_ITEMS.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex items-center justify-between py-3.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors",
                    isActive
                      ? "font-medium text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  )}
                >
                  <span>{item.label}</span>
                  <span className="text-[var(--color-text-muted)]" aria-hidden="true">
                    {isActive ? "—" : ""}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
