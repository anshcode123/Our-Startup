"use client";

import { NAV_LINKS, CONTACT } from "@/lib/siteConfig";
import { scrollToSection } from "@/lib/scrollToSection";

const SOCIALS = [
  { label: "Instagram", href: CONTACT.instagram },
  { label: "LinkedIn", href: CONTACT.linkedin },
  { label: "WhatsApp", href: CONTACT.whatsapp },
  { label: "Email", href: CONTACT.email ? `mailto:${CONTACT.email}` : "" },
].filter((social) => social.href);

export default function Footer() {
  function handleClick(event, href) {
    event.preventDefault();
    scrollToSection(href);
  }

  return (
    <footer className="relative border-t border-white/10 bg-ink px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <p className="text-sm font-medium tracking-wide text-white">ANSHUL.DEV</p>
          <p className="mt-3 text-sm text-white/40">
            Building digital products for businesses ready to move forward.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-2 text-sm text-white/50">
            {[...NAV_LINKS, { label: "Contact", href: "#contact" }].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {SOCIALS.length > 0 && (
          <ul className="flex flex-col gap-2 text-sm text-white/50">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={social.label === "Email" ? undefined : "_blank"}
                  rel={social.label === "Email" ? undefined : "noopener noreferrer"}
                  className="transition-colors hover:text-white"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mx-auto mt-12 max-w-6xl text-xs text-white/25">
        © {new Date().getFullYear()} Anshul.dev
      </p>
    </footer>
  );
}
