import { siteConfig } from "@/site.config";
import { CtaLink } from "@/components/cta-link";
import { RevealScope } from "@/components/reveal-scope.client";
import { ConnectForm } from "./connect-form.client";

// The contact page's single screen, both doors side by side: the ask on the
// left - the same "tell us where you sit" the footer makes - with the
// calendar as the fast lane for teams ready to talk, and the lightweight
// form on the right for everyone who isn't. Nothing else competes with the
// two actions.
//
// The header stack shimmers in reading order, the two columns' blocks on
// the beats after it, left before right.

export function Connect() {
  return (
    <section className="pt-navbar-rest section-container flex min-h-svh flex-col justify-center">
      <RevealScope className="grid gap-16 py-20 lg:grid-cols-2 lg:gap-10">
        <div className="flex max-w-117.25 flex-col items-start">
          <p
            className="type-nav text-muted shimmer-in"
            style={{ "--beat": 0, "--shimmer-ink": "var(--muted)" }}
          >
            Connect with us
          </p>

          <h1
            className="type-display-xs sm:type-display-sm lg:type-display-lg shimmer-in mt-5 text-balance"
            style={{ "--beat": 1 }}
          >
            Tell us where you sit
          </h1>

          <p
            className="type-body-xl shimmer-in mt-10 text-pretty opacity-60"
            style={{ "--beat": 2 }}
          >
            Teams with a physical process worth recording, and teams training
            models that need real-world 4D data - leave your email and sector
            and we&apos;ll come back with a capture proposal.
          </p>

          <div
            className="border-line sweep-in mt-10 flex w-full flex-col gap-5 border-t pt-10"
            style={{ "--beat": 3 }}
          >
            <p className="type-nav text-muted">Ready to talk now?</p>
            <CtaLink
              href={siteConfig.links.calendly}
              target="_blank"
              rel="noreferrer"
              variant="outline"
              className="w-full max-w-84.75"
            >
              Book a call
            </CtaLink>
            <p className="type-body-sm opacity-60">
              Or write to us directly:{" "}
              <a
                href={siteConfig.links.email}
                className="text-ink underline underline-offset-4 hover:no-underline"
              >
                hello@chronospace.ai
              </a>
            </p>
          </div>
        </div>

        <div className="sweep-in" style={{ "--beat": 4 }}>
          <ConnectForm />
        </div>
      </RevealScope>
    </section>
  );
}
