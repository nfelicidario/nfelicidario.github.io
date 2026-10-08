/**
 * THE HAPPY PATH, in plain words (one line per step: what the viewer sees, then what they click)
 *
 *  1. Demo RCS. The phone opens a new thread: the agent's logo, name, and description at the
 *     top, the date, the agent typing, "Check out these sweet new deals at {name} this week!",
 *     typing again, then a carousel of three deal cards (each with a price and its own button:
 *     "Yes, please!", "Feed the family", "Sip the season") and, right behind it, two chips,
 *     "Find location" and "View full menu". CLICK any card's button. The reply shows on the
 *     right in the brand color, the agent types, and an upsell card lands: "Make it a meal?"
 *     with "Yes, and checkout" and "No thanks". CLICK "Yes, and checkout". The reply shows, the
 *     agent types, and an order confirmation card lands (order number, items, total, pickup
 *     time, "Track my order"), with "Reorder" and "Give feedback" chips under it.
 *  2. Demo RCS, ordered. The name, logo, and brand color fields update the phone live.
 *     CLICK "Make it live".
 *  3. Sign up. A short form: name, work email, password. CLICK "Create account".
 *  4. Brand. Legal name, website, and contact email, prefilled from step 1. The phone shows
 *     the agent details screen filling in. CLICK "Continue".
 *  5. Agent. Display name, logo, color, and description, with Google's limits. CLICK "Continue".
 *  6. Campaign. Use case, sample message, opt-in method, and volume. PICK an opt-in method,
 *     then CLICK "Submit for review". (Submitting without an opt-in shows the carrier error.)
 *  7. Review. The timeline runs on its own; nothing to click.
 *  8. Live. The same deals from the real, verified agent. CLICK a card's button, then
 *     "Yes, and checkout", to order again.
 *
 * Clicking anything else inside the prototype pulses a blue outline on the next thing to
 * click. Form fields, Replay, the color swatch, the cards, and the chips under the
 * confirmation never trigger it. "Find location" and "View full menu" are not the happy path:
 * tapping either pulses the card buttons.
 *
 * ----------------------------------------------------------------------------------------
 *
 * The RCS Studio hero's demo script: every line of copy and every timing the prototype
 * plays, in one place. The hero imports from here, so editing this file is enough.
 *
 * How to edit safely:
 *  - Keep chip and card button labels under 25 characters (Google's limit; longer labels are
 *    cut off).
 *  - Keep the `step` and `phase` names in FRAMES exactly as they are, and keep every frame:
 *    the hero looks frames up by those names. Change `ms` freely (how long autoplay holds a
 *    frame, in milliseconds). `auto` marks the frames that advance on their own in
 *    interactive mode too (a reply arriving), so leave it where it is.
 *  - Keep the agent name under 40 characters and descriptions under 100 (Google's limits).
 *  - The brand color is #RRGGBB. Any color is accepted; the demo form does not check contrast.
 *  - Mock data only: invented businesses, people, prices, and numbers. Nothing from a real
 *    customer.
 *  - Card art: each card names a drawn illustration (`art`, see ./art.tsx) and a `photo`
 *    path. Drop photos into public/work/rcs-studio/cards/ with these names to replace the
 *    illustrations: burgers.jpg, family-bundle.jpg, pumpkin-shake.jpg, meal.jpg,
 *    confirmed.jpg. A photo is used only once the browser has loaded it, so a missing file
 *    simply leaves the drawing in place.
 */

import { clampLabel, type SuggestionKind } from "@/components/phone";

/* ------------------------------------------------------------- the agent */

/** what autoplay builds in step 1 */
export const AGENT = {
  /** the name autoplay types into the agent name field */
  name: "Poblano's Mexican Grill",
  /** the brand color autoplay picks */
  color: "#C2410C",
  /** the color the form starts on before anyone picks one */
  defaultColor: "#1F4FE0",
  /** the logo autoplay drops in: "mark" is the drawn fork-and-knife, "none" keeps the monogram */
  logo: "mark" as "mark" | "none",
};

/* --------------------------------------------------------- phone copy */

/** labels are capped at Google's 25 characters, counted in code points so an emoji is never cut in half */
const label = (s: string) => clampLabel(s);

/** the five illustrations in ./art.tsx */
export type ArtKey = "burgers" | "family" | "shake" | "meal" | "confirmed";

/** a card's media: the drawing, replaced by the photo at `photo` once that file exists */
export type CardMedia = { art: ArtKey; photo?: string };

/** where the owner drops photos; file names are listed in the header */
const PHOTOS = "/work/rcs-studio/cards";

/** one deal card in the carousel */
export type Deal = {
  title: string;
  /** one line under the title */
  text: string;
  /** USD; the confirmation adds these up */
  price: number;
  /** the button inside the card, under 25 characters including its emoji */
  cta: string;
  /** what the user's reply says after tapping the button */
  reply: string;
  media: CardMedia;
};

export type ChipAction = { label: string; kind?: SuggestionKind; emoji?: string };

/** what the phone says in the Messages thread */
export const PHONE_COPY = {
  /** the day divider above the first message */
  timestamp: "Today · 11:30 AM",
  /** the agent's opening line in step 1; it names the business while there is a name */
  opener: (name: string) => {
    const n = name.trim();
    return n ? `Check out these sweet new deals at ${n} this week!` : "Check out these sweet new deals this week!";
  },
  /** the three deal cards, in carousel order */
  deals: [
    {
      title: "Two-for-one burgers",
      text: "Buy a classic burger, get a second one free. Through Sunday.",
      price: 8.49,
      cta: label("🍔 Yes, please!"),
      reply: "I'll take the two-for-one burgers",
      media: { art: "burgers", photo: `${PHOTOS}/burgers.jpg` },
    },
    {
      title: "Family bundle",
      text: "Four entrees, two large sides, and a gallon of lemonade.",
      price: 29.99,
      cta: label("👨‍👩‍👧 Feed the family"),
      reply: "I'll take the family bundle",
      media: { art: "family", photo: `${PHOTOS}/family-bundle.jpg` },
    },
    {
      title: "Pumpkin spice shake",
      text: "Back for fall only, with whipped cream and cinnamon.",
      price: 4.29,
      cta: label("🎃 Sip the season"),
      reply: "I'll take the pumpkin spice shake",
      media: { art: "shake", photo: `${PHOTOS}/pumpkin-shake.jpg` },
    },
  ] as Deal[],
  /** the two actions under the carousel; real controls, not the happy path */
  dealChips: [
    { label: label("Find location"), kind: "location" },
    { label: label("View full menu"), kind: "url" },
  ] as ChipAction[],
  /** the upsell card after the first reply */
  upsell: {
    title: "Make it a meal?",
    text: "Add a medium drink and seasoned fries.",
    price: 3.49,
    yes: label("🍟 Yes, and checkout"),
    no: label("No thanks"),
    /** what the user's reply says after each button */
    yesReply: "Yes, and checkout",
    noReply: "No thanks",
    media: { art: "meal", photo: `${PHOTOS}/meal.jpg` } as CardMedia,
  },
  /** the order confirmation card */
  confirmation: {
    orderNumber: "4821",
    title: (orderNumber: string) => `Order #${orderNumber} confirmed`,
    addon: "Medium drink and seasoned fries",
    pickup: "Pickup today at 12:10 PM",
    /** the suggested action in the card; "url" draws the globe */
    track: label("Track my order"),
    media: { art: "confirmed", photo: `${PHOTOS}/confirmed.jpg` } as CardMedia,
  },
  /** the two chips under the confirmation, each with an emoji as its leading glyph */
  afterChips: [
    { label: label("Reorder"), emoji: "🔁" },
    { label: label("Give feedback"), emoji: "📝" },
  ] as ChipAction[],
  /** the dashed placeholder bubble while there is no sample message yet */
  ghost: "Your first message shows up here.",
  /** the status line under the agent name while the agent is not yet verified */
  subtitle: {
    preview: "Preview",
    review: "In carrier review",
  },
  /** the agent details screen while the provisioning form is still empty */
  info: {
    description: "A line about your business and what you send.",
    phone: "+1 555 010 0199",
    website: "yourbrand.example",
    email: "hello@yourbrand.example",
  },
};

/** USD, two decimals */
export const money = (n: number) => `$${n.toFixed(2)}`;

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
  description: (name: string) => `Weekly deals, pickup orders, and order updates from ${name}.`,
  /** the campaign's sample message, also the live agent's first message */
  sample: (name: string) => `Hi Sam, it's ${name}. ${PHONE_COPY.opener("")} Reply STOP to opt out.`,
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
  yours: "Demo RCS",
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
  // step 1: the thread opens from the top (agent info, date), the agent types, sends the
  // opener, types again, sends the deal carousel, and the two chips follow right behind it
  // (one short beat, not a pause of their own). The viewer taps a card's button ("tap", the
  // reply lands and the agent types), the upsell card arrives ("upsell", the viewer taps
  // "Yes, and checkout"), the reply lands and the agent types ("checkout"), and the
  // confirmation card arrives ("confirmed"). Then autoplay names, colors, and logos the agent.
  // The opening frames are `auto` so the thread plays itself in interactive mode too (and
  // again after the form's Replay); "chips" and "upsell" wait for the viewer.
  // Each typing moment (typing1, typing2, tap, checkout) holds long enough for the dots'
  // wave to be seen (one loop is 1.1 s; 700 ms shows all three dots rise).
  { step: "yours", phase: "typing1", ms: 900, auto: true },
  { step: "yours", phase: "opener", ms: 450, auto: true },
  { step: "yours", phase: "typing2", ms: 700, auto: true },
  { step: "yours", phase: "carousel", ms: 150, auto: true },
  { step: "yours", phase: "chips", ms: 1200 },
  { step: "yours", phase: "tap", ms: 900, auto: true },
  { step: "yours", phase: "upsell", ms: 1600 },
  { step: "yours", phase: "checkout", ms: 900, auto: true },
  { step: "yours", phase: "confirmed", ms: 1800 },
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
  // live: the same deals from the real agent, already in the thread; the viewer orders again
  { step: "live", phase: "live", ms: 1600 },
  { step: "live", phase: "tapped", ms: 900, auto: true },
  { step: "live", phase: "upsell", ms: 1600 },
  { step: "live", phase: "checkout", ms: 900, auto: true },
  { step: "live", phase: "confirmed", ms: 3800 },
];

/* --------------------------------------------------------- happy path */

/**
 * The one thing to click at each moment, in story order. `target` is the id the hero puts
 * on that control (`data-target`); when the viewer clicks anything else inside the prototype,
 * the control with the current target pulses. Which moment is current is decided by the hero
 * from its state (see `happyTarget` there); this list is the order and the copy.
 */
export type HappyMoment = {
  step: Step;
  /** the `data-target` id of the control */
  target: "card-cta" | "checkout" | "make-live" | "create-account" | "continue" | "opt-in" | "submit";
  /** what the viewer sees */
  sees: string;
  /** what the viewer clicks */
  clicks: string;
};

export const HAPPY_PATH: HappyMoment[] = [
  { step: "yours", target: "card-cta", sees: "The agent announces the week's deals and sends three cards.", clicks: "Tap the button on any card" },
  { step: "yours", target: "checkout", sees: "The reply lands and the agent offers to make it a meal.", clicks: "Tap Yes, and checkout" },
  { step: "yours", target: "make-live", sees: "The order is confirmed. Name, logo, and color update the phone.", clicks: "Press Make it live" },
  { step: "signup", target: "create-account", sees: "A short sign-up form.", clicks: "Press Create account" },
  { step: "brand", target: "continue", sees: "The brand, prefilled from step 1; the agent details screen fills in.", clicks: "Press Continue" },
  { step: "agent", target: "continue", sees: "The agent, prefilled, with Google's limits inline.", clicks: "Press Continue" },
  { step: "campaign", target: "opt-in", sees: "The campaign form; the opt-in method is still empty.", clicks: "Pick an opt-in method" },
  { step: "campaign", target: "submit", sees: "The campaign form, complete.", clicks: "Press Submit for review" },
  { step: "live", target: "card-cta", sees: "The same deals from the live, verified agent.", clicks: "Tap the button on any card" },
  { step: "live", target: "checkout", sees: "The upsell, from the live agent.", clicks: "Tap Yes, and checkout" },
];
