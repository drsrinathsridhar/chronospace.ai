import { env } from "@/lib/env";

export const siteConfig = {
  name: "ChronoSpace",
  url: env.NEXT_PUBLIC_SITE_URL,
  description:
    "ChronoSpace is building AI to digitize the physical world - full 4D capture of real geometry over time, from any angle, at any moment.",
  nav: [
    { href: "#problem", label: "Problem" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#applications", label: "Applications" },
    { href: "#research", label: "Research" },
  ],
  links: {
    // TODO: swap for the real enquiry destination once it exists.
    contact: "mailto:hello@chronospace.ai",
  },
} as const;
