/**
 * The RCS Studio hero's demo script: every line of copy and every timing the prototype
 * plays, in one place. The hero imports from here, so editing this file is enough.
 *
 * How to edit safely:
 *  - Keep chip labels under 25 characters (Google's limit; longer labels are cut off).
 *  - Keep the `step` and `phase` names in FRAMES exactly as they are, and keep every frame:
 *    the hero looks frames up by those names. Change `ms` freely (how long autoplay holds a
 *    frame, in milliseconds). `auto` marks the frames that advance on their own in
 *    interactive mode too (a reply arriving), so leave it where it is.
 *  - Keep the agent name under 40 characters and descriptions under 100 (Google's limits).
 *  - The brand color is #RRGGBB and must pass 4.5:1 on white; the hero blocks the CTA otherwise.
 *  - Mock data only: invented businesses, people, and numbers. Nothing from a real customer.
 */

import { MAX_LABEL } from "@/components/phone";

/* ------------------------------------------------------------- the agent */

/** what autoplay builds in step 1 */
export const AGENT = {
  /** the name autoplay types into the agent name field */
  name: "Poblano's Mexican Grill",
  /** the brand color autoplay picks; must pass 4.5:1 on white */
  color: "#C2410C",
  /** the color the form starts on before anyone picks one */
  defaultColor: "#1F4FE0",
  /** the logo autoplay drops in: "mark" is the drawn fork-and-knife, "none" keeps the monogram */
  logo: "mark" as "mark" | "none",
};

/* --------------------------------------------------------- phone copy */

/** what the phone says in the Messages thread */
export const PHONE_COPY = {
  /** the day divider above the first message */
  timestamp: "Today · 9:30 AM",
  /** the agent's opening line in step 1; `name` is the agent name typed so far */
  greeting: (name: string) => `Hi Sam, it's ${name}. The Tuesday Family Box is back this week.`,
  /** used in the greeting before a name has been typed */
  fallbackName: "your agent",
  /** the rich card under the greeting */
  card: {
    title: "Tuesday Family Box",
    meta: "$32",
    text: "Four entrees, two sides, and two house sauces. Pickup only.",
  },
  /** the dashed placeholder bubble while there is no sample message yet */
  ghost: "Your first message shows up here.",
  /** the status line under the agent name while the agent is not yet verified */
  subtitle: {
    preview: "Preview",
    review: "In carrier review",
  },
};

/* ------------------------------------------------------------- chips */

export type Chip = { label: string; reply: string };

/** labels are capped at Google's 25 characters */
const chip = (label: string, reply: string): Chip => ({ label: label.slice(0, MAX_LABEL), reply });

/** step 1, the demo agent: each chip and the reply the agent sends back */
export const YOURS_CHIPS: Chip[] = [
  chip("Order for pickup", "Done. Your box will be ready Tuesday at 5:30 pm. Reply CHANGE to pick another time."),
  chip("What's in it?", "Four entrees, two sides, and two house sauces. Feeds four."),
  chip("Remind me Tuesday", "Will do. I'll text you Tuesday morning."),
];

/** the live agent at the end: each chip and the reply it sends back */
export const LIVE_CHIPS: Chip[] = [
  chip("BOX", "Reserved. One Tuesday Family Box, ready at 5:30 pm. Reply CHANGE to pick another time."),
  chip("See the menu", "Here's this week's menu. Tap any item to add it to a pickup order."),
  chip("Not this week", "No problem. I'll check back next Tuesday."),
];

/* ------------------------------------------------------ form values */

export type Field =
  | "agentName"
  | "color"
  | "name"
  | "email"
  | "password"
  | "legalName"
  | "website"
  | "contact"
  | "description"
  | "useCase"
  | "sample"
  | "optIn"
  | "volume";
export type Values = Record<Field, string>;

/**
 * What every field holds when the story starts. Empty strings are prefilled later from the
 * agent name (see PREFILL), or chosen during the campaign step (optIn).
 */
export const FORM_DEFAULTS: Values = {
  agentName: "Nolan's Restaurant",
  color: AGENT.defaultColor,
  name: "Sam Rivera",
  email: "",
  password: "burritos-2026",
  legalName: "",
  website: "",
  contact: "",
  description: "",
  useCase: "Promotions and offers",
  sample: "",
  optIn: "",
  volume: "Up to 10,000 a month",
};

/** the opt-in method autoplay picks after the validation error */
export const AUTO_OPT_IN = "Keyword on a web form";

/** how the later steps prefill from the agent name chosen in step 1 */
export const PREFILL = {
  /** stands in for the agent name while the field is empty */
  fallbackName: "Your agent",
  /** the website from the name's slug (letters and digits only) */
  site: (slug: string) => `${slug || "yourbrand"}.example`,
  /** the sign-up email and the brand contact email */
  email: (site: string) => `sam@${site}`,
  legalName: (name: string) => `${name} LLC`,
  /** the agent description; the hero trims it to 100 characters */
  description: (name: string) => `Weekly specials, pickup orders, and reminders from ${name}.`,
  /** the campaign's sample message, also the live agent's first message */
  sample: (name: string) => `Hi Sam, it's ${name}. The Tuesday Family Box is back this week. Reply BOX to reserve one.`,
};

/** the choices in the campaign step's dropdowns */
export const OPTIONS = {
  useCases: ["Promotions and offers", "Order updates", "Appointment reminders", "Account alerts"],
  optIns: ["Keyword on a web form", "Checkbox at checkout", "In-store sign-up", "Reply to an SMS"],
  volumes: ["Up to 1,000 a month", "Up to 10,000 a month", "Up to 100,000 a month", "More than 100,000 a month"],
} as const;

/* ---------------------------------------------------- status and cards */

/** the status pill in the provisioning pane */
export const STATUS = { draft: "Draft", submitted: "Submitted", live: "Live" } as const;
export type Status = (typeof STATUS)[keyof typeof STATUS];

/** the review timeline after submitting */
export const REVIEW_TIMELINE = [
  { label: "Submitted", sub: "Just now", state: "done" },
  { label: "Reviewing", sub: "Carriers verify the brand and campaign", state: "active" },
  { label: "Live", sub: "Usually one to three weeks", state: "todo" },
] as const;

/** the card after the account is created */
export const SIGNUP_SUCCESS = { title: "Account created", body: "Setting up your workspace." };

/** the card at the end of the story */
export const END_CARD = { title: "Agent live.", body: "Average time to provision: one to three weeks." };

/* ------------------------------------------------------------- frames */

/** the seven steps of the story, as the stage footer names them */
export type Step = "yours" | "signup" | "brand" | "agent" | "campaign" | "submitted" | "live";

export const STEP_LABELS: Record<Step, string> = {
  yours: "Make it yours",
  signup: "Sign up",
  brand: "Brand",
  agent: "Agent",
  campaign: "Campaign",
  submitted: "Review",
  live: "Live",
};

/** one moment of the story: a step, a phase within it, and how long autoplay holds it */
export type Frame = { step: Step; phase: string; ms: number; auto?: boolean };

/**
 * The story, in order. Do not rename or remove frames; change `ms` to retime them.
 * `auto` frames advance by themselves in interactive mode as well.
 */
export const FRAMES: Frame[] = [
  // step 1: the demo thread; the viewer taps a chip, then names, colors, and logos the agent
  { step: "yours", phase: "idle", ms: 900 },
  { step: "yours", phase: "tap", ms: 800, auto: true },
  { step: "yours", phase: "replied", ms: 1500 },
  { step: "yours", phase: "name", ms: 2600 },
  { step: "yours", phase: "color", ms: 900 },
  { step: "yours", phase: "logo", ms: 1200 },
  { step: "yours", phase: "cta", ms: 900 },
  // step 2: the sign-up form fills one field at a time
  { step: "signup", phase: "empty", ms: 700 },
  { step: "signup", phase: "name", ms: 650 },
  { step: "signup", phase: "email", ms: 650 },
  { step: "signup", phase: "password", ms: 900 },
  { step: "signup", phase: "success", ms: 1500, auto: true },
  // step 3: provisioning, brand first
  { step: "brand", phase: "empty", ms: 600 },
  { step: "brand", phase: "legalName", ms: 700 },
  { step: "brand", phase: "website", ms: 1500 },
  { step: "brand", phase: "contact", ms: 1200 },
  // then the agent, prefilled from step 1
  { step: "agent", phase: "prefilled", ms: 3000 },
  // then the campaign: filled, rejected for the missing opt-in, fixed
  { step: "campaign", phase: "filled", ms: 1400 },
  { step: "campaign", phase: "invalid", ms: 1500 },
  { step: "campaign", phase: "fixed", ms: 1100 },
  // carrier review
  { step: "submitted", phase: "reviewing", ms: 2500, auto: true },
  // live: the same thread from the real agent
  { step: "live", phase: "live", ms: 1600 },
  { step: "live", phase: "tapped", ms: 900, auto: true },
  { step: "live", phase: "replied", ms: 3800 },
];
