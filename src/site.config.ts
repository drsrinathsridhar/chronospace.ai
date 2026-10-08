import { env } from "@/lib/env";

export const siteConfig = {
  name: "ChronoSpace",
  tagline: "World Models for the Physical World",
  url: env.NEXT_PUBLIC_SITE_URL,
  description:
    "ChronoSpace is building world models for the physical world - full 4D capture of real geometry over time, from any angle, at any moment.",
  // Root-anchored so the anchors also work from routes other than the home
  // page (the contact page renders the same header).
  nav: [
    { href: "/#problem", label: "About" },
    { href: "/#product", label: "Features" },
    { href: "/#science", label: "Research and Insights" },
    { href: "/#team", label: "Team" },
  ],
  links: {
    contact: "/contact",
    email: "mailto:contact@chronospace.ai",
    // TODO: point at the real company profile once it exists.
    linkedin: "https://www.linkedin.com/company/chronospace-ai",
    // TODO: link the legal documents once they are published.
    terms: "#",
    privacy: "#",
    madeBy: "https://tonik.com",
  },
} as const;
