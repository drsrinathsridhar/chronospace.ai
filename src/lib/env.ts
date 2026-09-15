import { z } from "zod";

// The one variable the app reads. Every absolute URL the site emits - the
// metadataBase, the canonical link, og:url, the sitemap's <loc>, robots.txt
// - is built from it (src/site.config.ts), so a wrong value here is wrong
// everywhere. Production shipped with the variable unset on Vercel and the
// localhost default went out as the canonical (client feedback, round 3,
// slide 9c), so the value is now resolved down a chain: the explicit
// NEXT_PUBLIC_SITE_URL first (set it in the Vercel project once the launch
// domain exists), then the two hostnames Vercel puts into every build -
// VERCEL_PROJECT_PRODUCTION_URL, the stable production hostname (present on
// preview builds too, which is right: a preview must not be canonical), then
// VERCEL_URL, the deployment's own hostname - and localhost only when none of
// them is set, which means a local build. Vercel's hostnames come without a
// scheme; they are always served over https.
const EnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

function httpsOrigin(host: string | undefined) {
  return host ? `https://${host}` : undefined;
}

export const env = EnvSchema.parse({
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ||
    httpsOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    httpsOrigin(process.env.VERCEL_URL) ||
    undefined,
});
