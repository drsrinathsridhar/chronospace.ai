import { z } from "zod";

// Every public URL is derived from this origin. Production builds require it
// explicitly so a missing deployment setting cannot publish localhost or a
// preview hostname as the canonical URL.
const SiteUrl = z.url().refine((value) => new URL(value).origin === value, {
  message: "NEXT_PUBLIC_SITE_URL must be an origin without a path",
});

const EnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: SiteUrl,
});

function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NODE_ENV === "production" && !value) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is required for production builds (for example https://chronospace.ai)",
    );
  }
  return value || "http://localhost:3000";
}

export const env = EnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: siteUrl(),
});
