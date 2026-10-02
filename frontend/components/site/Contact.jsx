import { CONTACT } from "@/lib/siteConfig";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: CONTACT.linkedin },
  { label: "GitHub", href: CONTACT.github },
  { label: "Instagram", href: CONTACT.instagram },
].filter((social) => social.href);

/**
 * Direct contact links only — no backend form (see lib/siteConfig.js for
 * where to fill in real details as they become available). Social links
 * only render when a real URL has been provided.
 */
export default function Contact() {
  return (
    <section id="contact" className="relative border-t border-white/5 bg-ink px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Contact</p>
        <h2 className="mt-3 text-4xl text-white sm:text-5xl">Let&apos;s talk.</h2>
        <p className="mt-4 text-white/50">
          Reach out directly — we&apos;ll get back to you as soon as we can.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white transition-colors hover:bg-white hover:text-black"
          >
            {CONTACT.email}
          </a>

          {CONTACT.whatsapp && (
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
            >
              WhatsApp
            </a>
          )}
        </div>

        {SOCIAL_LINKS.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/50">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline transition-colors hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
