"use client";

import { useEffect, useRef, useState } from "react";
import { getLenis, ScrollTrigger } from "@/lib/animations";
import { scrollToSection } from "@/lib/scrollToSection";
import { NAV_LINKS } from "@/lib/siteConfig";
import Logo from "./Logo";

/**
 * Fixed, blurred-on-scroll navigation. Reuses the shared Lenis instance
 * for in-page scrolling (via scrollToSection) and a single lightweight
 * ScrollTrigger for the "has the visitor scrolled" background toggle —
 * no per-frame React state updates.
 */
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(null);
  const scrolledRef = useRef(false);
  const menuButtonRef = useRef(null);
  const firstMenuLinkRef = useRef(null);

  // Background toggle — only calls setState when the boolean actually flips.
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: () => {
        const isScrolled = window.scrollY > 40;
        if (isScrolled !== scrolledRef.current) {
          scrolledRef.current = isScrolled;
          setScrolled(isScrolled);
        }
      },
    });
    return () => trigger.kill();
  }, []);

  // Active-section indication.
  useEffect(() => {
    const triggers = NAV_LINKS.map((link) => {
      const section = document.querySelector(link.href);
      if (!section) return null;
      return ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActiveHref(link.href);
        },
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  // Lock the shared scroll engine (not just CSS) while the mobile menu is
  // open, so the page genuinely can't scroll behind it.
  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      firstMenuLinkRef.current?.focus();
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  function handleNavClick(event, href) {
    event.preventDefault();
    setMenuOpen(false);
    scrollToSection(href);
  }

  const mobileLinks = [...NAV_LINKS, { label: "Contact", href: "#contact" }];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-ink/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          className="text-sm"
          aria-label="Anshul.dev — home"
        >
          <Logo className="text-sm" />
        </a>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`link-underline transition-colors hover:text-white ${
                  activeHref === link.href ? "text-accent" : "text-white/60"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, "#contact")}
          className="group hidden items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black md:inline-flex"
        >
          Let&apos;s Talk
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
        >
          <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-white/10 bg-ink px-6 py-6 md:hidden">
          <ul className="flex flex-col gap-1 text-base text-white/80">
            {mobileLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  ref={i === 0 ? firstMenuLinkRef : undefined}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block py-2.5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 text-sm text-white"
          >
            Let&apos;s Talk →
          </a>
        </div>
      )}
    </header>
  );
}
