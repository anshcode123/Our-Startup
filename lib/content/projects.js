/**
 * Real project data for the Work/Portfolio section. Kept separate from
 * components/site/Work.jsx and ProjectCard.jsx so content, presentation,
 * and asset paths don't get tangled together.
 *
 * Add real projects as they become available, in this shape:
 *
 *   {
 *     id: "project-01",              // unique slug — also used as the
 *                                     // public/assets/projects/<id>/ folder
 *     title: "Project name",
 *     category: "Website" | "Mobile app" | "Custom software" | "SaaS",
 *     description: "One or two honest sentences about the project.",
 *     image: "/assets/projects/project-01/cover.jpg", // optional — omit
 *                                     // to keep the CSS placeholder visual
 *     technologies: ["Next.js", "PostgreSQL"],
 *     link: "https://example.com",   // optional — omit if there's nothing
 *                                     // public to link to
 *   }
 *
 * IMPORTANT: only real, delivered projects belong here. No invented
 * clients, screenshots, or results — see components/site/Work.jsx for how
 * an empty array renders a clean "coming soon" placeholder state instead.
 */
export const PROJECTS = [];
