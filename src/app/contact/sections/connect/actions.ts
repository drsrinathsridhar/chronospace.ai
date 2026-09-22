"use server";

import { sectors } from "./sectors";

// The enquiry's server half. Validation mirrors the form's own constraints -
// the browser enforces them first, this enforces them for everyone else.

export type EnquiryState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const email = String(formData.get("email") ?? "").trim();
  const sector = String(formData.get("sector") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "That email doesn't look complete - check it and send again.",
    };
  }

  if (!sectors.includes(sector as (typeof sectors)[number])) {
    return {
      status: "error",
      message: "Pick the sector closest to yours.",
    };
  }

  // TODO: deliver to the real inbox / CRM once one exists. Until then the
  // enquiry is acknowledged and logged on the server so nothing is silently
  // dropped during review.
  console.log("[enquiry]", {
    email,
    sector,
    at: new Date().toISOString(),
  });

  return { status: "sent" };
}
