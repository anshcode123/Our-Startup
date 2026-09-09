/**
 * Single source of truth for content that appears in more than one
 * component (Navigation + Footer share NAV_LINKS; Contact + Footer share
 * CONTACT). Edit here rather than in the components.
 *
 * CONTACT.email is a placeholder built from the site's own domain — swap
 * it for a real inbox when one exists. The rest are left empty on
 * purpose: we don't have real handles yet, and empty ones are simply
 * hidden (see Contact.jsx / Footer.jsx) rather than shown as dead links.
 */
export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
];

export const CONTACT = {
  email: "hello@anshul.dev", // TODO: replace with the real inbox
  whatsapp: "", // e.g. "https://wa.me/15555555555" — fill in once available
  instagram: "", // e.g. "https://instagram.com/anshul.dev"
  linkedin: "", // e.g. "https://linkedin.com/company/anshul-dev"
};
