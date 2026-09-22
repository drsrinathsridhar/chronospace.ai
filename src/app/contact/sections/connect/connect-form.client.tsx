"use client";

import { useActionState } from "react";
import { CtaArrowIcon } from "@/icons/generated";
import { submitEnquiry, type EnquiryState } from "./actions";
import { sectors } from "./sectors";

// The lightweight half of the ask: email, sector, send. The form is a ledger
// of ruled cells in the site's cell grammar -
// label riding the top of each cell, the control under it, the action as
// the last cell in the call-to-action's own accent block.
//
// Submission goes through a server action (actions.ts) via useActionState:
// no client fetch code, works before hydration, and the reply lands in the
// same column - the ledger swaps for the acknowledgement once it's sent.

const initial: EnquiryState = { status: "idle" };

const cell = "flex flex-col gap-4 px-6 py-5 transition-colors duration-150";
const label = "type-nav text-muted";
const control =
  "type-body-lg text-ink w-full bg-transparent focus:outline-none";

export function ConnectForm() {
  const [state, action, pending] = useActionState(submitEnquiry, initial);

  if (state.status === "sent") {
    return (
      <div
        aria-live="polite"
        className="border-line flex h-full flex-col justify-center gap-6 border p-10"
      >
        <h2 className="type-title-lg">Logged. We&apos;ll be in touch</h2>
        <p className="type-body-lg opacity-60">
          Your note is with the team - expect a reply within a few days with the
          next step, or a capture proposal where the fit is already clear.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="border-line divide-line divide-y border">
      <div className={`${cell} focus-within:bg-paper`}>
        <label htmlFor="enquiry-email" className={label}>
          Email
        </label>
        <input
          id="enquiry-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={`${control} placeholder:text-muted`}
        />
      </div>

      <div className={`${cell} focus-within:bg-paper`}>
        <label htmlFor="enquiry-sector" className={label}>
          Sector of interest
        </label>
        <div className="relative">
          <select
            id="enquiry-sector"
            name="sector"
            required
            defaultValue=""
            className={`${control} appearance-none pr-8`}
          >
            <option value="" disabled className="bg-paper text-muted">
              Pick the closest one
            </option>
            {sectors.map((sector) => (
              <option key={sector} value={sector} className="bg-paper">
                {sector}
              </option>
            ))}
          </select>
          <CtaArrowIcon
            width={8}
            height={10}
            aria-hidden
            className="text-muted pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 rotate-90"
          />
        </div>
      </div>

      {state.status === "error" && (
        <p aria-live="polite" className="type-label text-accent px-6 py-4">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-accent text-accent-foreground focus-visible:outline-ink group flex h-15 w-full items-center justify-between overflow-clip px-4 pt-8 pb-4 focus-visible:outline-2 focus-visible:-outline-offset-4 disabled:opacity-60"
      >
        <span className="type-button">
          {pending ? "Sending" : "Send enquiry"}
        </span>
        <CtaArrowIcon
          width={8}
          height={10}
          className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
        />
      </button>
    </form>
  );
}
