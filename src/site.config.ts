import { env } from "@/lib/env";

export const siteConfig = {
  name: "ChronoSpace",
  // The client's own line, as it reads in the title tag and the manifest:
  // "ChronoSpace — AI to digitize the physical world" (round 3, slide 9c).
  tagline: "AI to digitize the physical world",
  url: env.NEXT_PUBLIC_SITE_URL,
  description:
    "ChronoSpace is building AI to digitize the physical world - full 4D capture of real geometry over time, from any angle, at any moment.",
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
