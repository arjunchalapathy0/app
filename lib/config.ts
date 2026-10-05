// Swap this one constant to re-target the page at a different trade,
// e.g. "plumbing business", "HVAC company", "dental practice", "salon".
export const TRADE = "home service business";

export const SITE_NAME = "Missed Call Calculator";
export const SITE_DESCRIPTION = `See how much revenue your ${TRADE} loses to missed calls every month, and how to get it back automatically.`;

// Stored with each lead so you can tell which page/trade it came from.
export const LEAD_SOURCE = `missed-call-calculator:${TRADE}`;

// Placeholder until you publish a real privacy policy.
export const PRIVACY_POLICY_URL = "#privacy-policy";

export const copy = {
  heroTitle: "How much are missed calls costing your business?",
  heroSubtitle: `Plug in a few numbers about your ${TRADE} and see the revenue walking out the door.`,
  formTitle: "Get this fixed automatically",
  formSubtext:
    "A text goes out within seconds of every missed call, so you stop losing jobs to the next business that picks up.",
  formButton: "Show me how",
  thankYouTitle: "Thanks, you're on the list!",
  thankYouBody: `We'll be in touch shortly with a quick walkthrough of how automatic missed-call text-back works for your ${TRADE}.`,
  privacyNote:
    "We only use your details to contact you about missed-call text-back. No spam, and we never sell your information.",
} as const;
