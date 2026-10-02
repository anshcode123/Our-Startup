/**
 * Single source of truth for content that appears in more than one
 * component (Navigation + Footer share NAV_LINKS; Contact + Footer share
 * CONTACT) or more than one file (SITE_URL is used by app/layout.js,
 * app/robots.js, and app/sitemap.js). Edit here rather than in each file.
 *
 * CONTACT.email is a placeholder built from the site's own domain — swap
 * it for a real inbox when one exists. The rest are left empty on
 * purpose: we don't have real handles yet, and empty ones are simply
 * hidden (see Contact.jsx / Footer.jsx) rather than shown as dead links.
 */

// The intended production domain — DNS/deployment may not be fully
// pointed at it yet. Update this one line once that's confirmed; every
// place that needs the site's absolute URL (metadata, robots, sitemap)
// reads from here.
export const SITE_URL = "https://AKIVRO.dev";

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
];

export const CONTACT = {
  email: "anshulrohilla39@gmail.com", // TODO: replace with the real inbox
  whatsapp: "", // e.g. "https://wa.me/15555555555" — fill in once available
  linkedin: "", // e.g. "https://linkedin.com/company/anshul-dev"
  github: "", // e.g. "https://github.com/anshul-dev"
  instagram: "", // e.g. "https://instagram.com/AKIVRO.dev"
};
