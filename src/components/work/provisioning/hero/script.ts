/**
 * THE HAPPY PATH, in plain words (one line per step: what the viewer sees, then what they click)
 *
 *  1. Before. A process diagram: Ops at the left, four sender types fanning right. The RCS
 *     branch is drawn in full, 14 steps snaking across three rows; TFN, 10DLC, and Short Code
 *     are collapsed stubs. Hover or focus any step for its full text. Nothing to click; after
 *     a moment an email arrives.
 *  2. A request. An email card slides into the corner: "Request for RCS agent" from Poblano's
 *     Mexican Grill. CLICK "Acknowledge". The diagram zooms into the RCS branch and the card
 *     offers "Get started". CLICK "Get started".
 *  3. The old way. Fourteen mock screens, one at a time: an email, Google's RBM console, the
 *     internal credentials portal, the verification vendor by email, a week of waiting, campaign
 *     info by email, Verizon by email, the AT&T portal, the T-Mobile portal, other carriers,
 *     carrier testing by spreadsheet, the billing spreadsheet, the internal tracking platform,
 *     and the status email. A tally in the corner counts portals, emails, days, and Ops time.
 *     CLICK the one action on each screen ("Send", "Create agent", "Copy credentials",
 *     "Submit", or "Next"). After the last screen, a short interstitial card closes the old
 *     way: "That was the old way: 10 portals, 6+ emails, about 8 hours of Ops time per
 *     request. Here's the vision." CLICK "See the vision".
 *  4. The vision. A clean diagram: the customer, one Vibes Admin, four sender types, and
 *     auto-generated submissions to every third party, with Ops reviewing from one place.
 *     Nothing to click; after a moment the same email arrives.
 *  5. A request. The same email card. CLICK "Open in Vibes Admin".
 *  6. Vibes Admin. Two panes: the customer's request on the left, one submission per third
 *     party on the right. Open a row to see its prefilled template and how "Marketing" maps to
 *     each party's own use-case list; add what is still missing. CLICK "Submit all". The
 *     statuses flip to Submitted one after another, then carriers review for a moment.
 *  7. Live. The request flips to Live. 1 portal, 0 emails, about 90 minutes of Ops time.
 *
 * Steps 1 to 3 are the BEFORE half (the old way) and steps 4 to 7 the AFTER half (Vibes
 * Admin). Every card carries a BEFORE or AFTER stamp in its top-left corner, the page's POV
 * badge follows the half, and the before half renders in a cooler, desaturated tone.
 *
 * Clicking anything else inside the prototype pulses a blue outline on the next thing to
 * click. The diagram's steps, the use-case dropdown, the submission rows, and the "Add"
 * buttons never trigger it.
 *
 * ----------------------------------------------------------------------------------------
 *
 * The Vibes Admin hero's script: every line of copy, every step of the old process, every
 * mock screen, every submission template, and every timing, in one place. The hero imports
 * from here, so editing this file is enough.
 *
 * How to edit safely:
 *  - Keep the `step` and `phase` names in FRAMES exactly as they are, and keep every frame:
 *    the hero looks frames up by those names. Change `ms` freely (how long autoplay holds a
 *    frame, in milliseconds). `auto` marks the frames that advance on their own in
 *    interactive mode too (an email arriving, carriers reviewing), so leave it where it is.
 *  - SCREENS must stay 14 long, in the order of the old process; the old-way frames are
 *    generated from it, and the "wrap" interstitial is the last frame of the old step.
 *  - Mock data only: an invented customer, invented people, invented values. The numbers in
 *    the counters (10 portals, 6+ emails, 8 hours, 90 minutes) are the approved ones.
 */

/* ---------------------------------------------------------------- steps */

/** the seven steps of the story, as the stage footer names them */
export type Step = "before" | "request" | "old" | "vision" | "request2" | "admin" | "live";

export const STEP_ORDER: Step[] = ["before", "request", "old", "vision", "request2", "admin", "live"];

export const STEP_LABELS: Record<Step, string> = {
  before: "Before",
  request: "A request",
  old: "The old way",
  vision: "The vision",
  request2: "A request, again",
  admin: "Vibes Admin",
  live: "Live",
};

/** which half of the story a step belongs to: the old way, or Vibes Admin */
export type Half = "before" | "after";

export const HALF: Record<Step, Half> = {
  before: "before",
  request: "before",
  old: "before",
  vision: "after",
  request2: "after",
  admin: "after",
  live: "after",
};

/** the stamp in the top-left corner of every card, and the phase on the page's POV badge */
export const HALF_LABELS: Record<Half, string> = { before: "Before", after: "After" };

/** the fixed part of the page's POV badge while the hero runs */
export const POV_LABEL = "Operations";

/* ------------------------------------------------------------- customer */

/** the fictional customer behind the request */
export const CUSTOMER = {
  name: "Poblano's Mexican Grill",
  legalName: "Poblano's Mexican Grill LLC",
  website: "poblanos.example",
  contact: "sam@poblanos.example",
  agent: "Poblano's Mexican Grill",
  description: "Weekly deals, pickup orders, and order updates.",
  sample: "Hi Sam, it's Poblano's. Two-for-one burgers through Sunday. Reply STOP to opt out.",
};

/** the email notification card (steps 2 and 5) */
export const EMAIL = {
  subject: "Request for RCS agent",
  from: CUSTOMER.name,
  body: "We'd like an RCS agent for weekly deals and order updates. What do you need from us?",
  acknowledge: "Acknowledge",
  getStarted: "Get started",
  openAdmin: "Open in Vibes Admin",
};

/* ------------------------------------------------------- before diagram */

/** the counters in the corner of the before and vision diagrams */
export const COUNTERS = {
  before: "10 portals · 6+ emails · about 8 hours of Ops time per request",
  vision: "1 portal · 90 minutes of Ops time per request",
};

export const DIAGRAM_TITLES = {
  before: "Provisioning an RCS agent, by hand",
  vision: "Provisioning through Vibes Admin",
};

/** what a node in the old-process diagram is: its icon and tint */
export type OldVariant = "team" | "customer" | "email" | "portal" | "wait" | "spreadsheet" | "vendor" | "carrier" | "decision";

export type OldStep = {
  /** the first line on the node */
  label: string;
  /** the second line: which system or channel */
  sub: string;
  variant: OldVariant;
  /** the full step, shown in the tooltip */
  text: string;
};

/** the 14 steps of provisioning an RCS agent by hand, in order */
export const OLD_STEPS: OldStep[] = [
  { label: "Agent request", sub: "Email from customer", variant: "customer", text: "Customer requests a test agent, by email." },
  { label: "Ask for brand info", sub: "Email", variant: "email", text: "Ops emails the customer for brand and agent info." },
  {
    label: "Create test agent",
    sub: "RBM console, creds portal",
    variant: "portal",
    text: "Ops opens Google's RBM console and creates a test agent, then opens the internal credentials portal to get API credentials to send back to the customer.",
  },
  { label: "Launch request", sub: "Email from customer", variant: "customer", text: "Customer tests, then emails a launch request." },
  { label: "Verify the brand", sub: "Vendor, by email", variant: "vendor", text: "Ops emails brand and agent info to a verification vendor." },
  { label: "Wait about a week", sub: "Collect campaign info", variant: "wait", text: "Wait, about a week. Meanwhile Ops collects campaign info from the customer by email." },
  { label: "Carrier launch", sub: "RBM console", variant: "portal", text: "Verified: Ops returns to Google's console, starts the carrier launch, and fills in the campaign info." },
  { label: "Verizon", sub: "Email, with token", variant: "carrier", text: "Ops emails Verizon the campaign info and the verification token." },
  { label: "AT&T", sub: "Portal", variant: "carrier", text: "Ops opens AT&T's portal and submits the campaign info." },
  { label: "T-Mobile", sub: "Portal", variant: "carrier", text: "Ops opens T-Mobile's portal and submits the campaign info." },
  { label: "Other carriers", sub: "Portals and emails", variant: "carrier", text: "Other carrier portals and emails." },
  {
    label: "Carrier testing",
    sub: "Spreadsheet, portal",
    variant: "spreadsheet",
    text: "Ops collects carrier testing info from the customer (RCS-specific; the customer must build flows first), then sends it to AT&T, T-Mobile, and Google by spreadsheet or portal.",
  },
  {
    label: "Billing, tracking",
    sub: "Spreadsheet, platform",
    variant: "spreadsheet",
    text: "Ops logs the new sender in the billing spreadsheet and enables it in the internal tracking platform.",
  },
  {
    label: "Status, rejections",
    sub: "Email, throughout",
    variant: "decision",
    text: "Throughout: status emails to the customer, chasing missing info, handling rejections; finally the \"you're live\" email.",
  },
];

/** the three collapsed branches under the RCS one */
export const STUBS: { name: string; note: string; tag: string }[] = [
  { name: "TFN", note: "Similar shape, to be mapped", tag: "coming" },
  { name: "10DLC", note: "Similar shape, to be mapped", tag: "coming" },
  { name: "Short Code", note: "Similar shape, to be mapped", tag: "coming" },
];

/* ------------------------------------------------------- vision diagram */

/** the four sender types and the third parties each one submits to, auto-generated */
export const VISION = {
  ops: { label: "Ops", sub: "Reviews from one place" },
  customer: { label: "Customer", sub: "One request" },
  admin: { label: "Vibes Admin", sub: "One request, many submissions" },
  senders: [
    { label: "RCS", parties: ["Verification vendor", "Google RBM", "Verizon", "AT&T", "T-Mobile"] },
    { label: "TFN", parties: ["Verification, carriers"] },
    { label: "10DLC", parties: ["Registry, carriers"] },
    { label: "Short Code", parties: ["Carriers"] },
  ],
  partiesLabel: "Auto-generated submissions",
};

/* --------------------------------------------------------- old-way screens */

export type ScreenKind = "compose" | "console" | "portal" | "wait" | "sheet";
export type ScreenIcon = "mail" | "console" | "key" | "shield" | "clock" | "radio" | "table" | "activity";

export type Tally = { portal: number; email: number; day: number; minutes: number };

export type Screen = {
  /** the header strip: what you are in */
  title: string;
  icon: ScreenIcon;
  kind: ScreenKind;
  /** the one primary action */
  action: string;
  /** compose: the envelope */
  to?: string;
  subject?: string;
  body?: string[];
  /** console and portal: label and value rows */
  fields?: { label: string; value: string }[];
  /** sheet: a small grid, first row is the header */
  rows?: string[][];
  /** wait: how many of the seven days are done */
  days?: number;
  /** the tally after this screen */
  tally: Tally;
};

export const TALLY_MAX = { portal: 10, email: 6, day: 21 };

/** the interstitial that closes the old way, between step 3 and step 4 */
export const WRAP = {
  title: "That was the old way: 10 portals, 6+ emails, about 8 hours of Ops time per request.",
  next: "Here's the vision.",
  action: "See the vision",
};

/** the fourteen screens of the old way, in order */
export const SCREENS: Screen[] = [
  {
    title: "Email",
    icon: "mail",
    kind: "compose",
    action: "Send",
    to: CUSTOMER.contact,
    subject: "Re: Request for RCS agent",
    body: ["Thanks for reaching out. To set up a test agent we need:", "legal business name, website, agent name, logo, and a short description.", "Reply here and we'll get started."],
    tally: { portal: 0, email: 1, day: 1, minutes: 20 },
  },
  {
    title: "Google RBM console",
    icon: "console",
    kind: "console",
    action: "Create agent",
    fields: [
      { label: "Agent name", value: CUSTOMER.agent },
      { label: "Brand", value: CUSTOMER.legalName },
      { label: "Description", value: CUSTOMER.description },
      { label: "Logo", value: "poblanos-224.png" },
      { label: "Region", value: "North America" },
      { label: "Billing category", value: "Conversational" },
    ],
    tally: { portal: 1, email: 1, day: 2, minutes: 65 },
  },
  {
    title: "Internal credentials portal",
    icon: "key",
    kind: "portal",
    action: "Copy credentials",
    fields: [
      { label: "Agent ID", value: "agent-7f3a-poblanos" },
      { label: "API key", value: "vb_live_••••••••••••4k2q" },
      { label: "Webhook secret", value: "••••••••••••••••" },
      { label: "Environment", value: "Test" },
    ],
    tally: { portal: 2, email: 1, day: 2, minutes: 80 },
  },
  {
    title: "Verification vendor, by email",
    icon: "shield",
    kind: "compose",
    action: "Send",
    to: "verify@vendor.example",
    subject: "Brand verification: Poblano's Mexican Grill",
    body: ["Please verify the attached brand and agent for RCS.", `Legal name: ${CUSTOMER.legalName}. Website: ${CUSTOMER.website}.`, "Agent name and description attached."],
    tally: { portal: 2, email: 2, day: 4, minutes: 110 },
  },
  {
    title: "Waiting, day 1 to 7",
    icon: "clock",
    kind: "wait",
    action: "Next",
    days: 7,
    body: ["Waiting on the verification vendor. Meanwhile, collecting campaign info from the customer by email."],
    tally: { portal: 2, email: 2, day: 11, minutes: 110 },
  },
  {
    title: "Campaign info, by email",
    icon: "mail",
    kind: "compose",
    action: "Send",
    to: CUSTOMER.contact,
    subject: "Campaign details for carrier launch",
    body: ["You're verified. For the carrier launch we need:", "use case, sample message, opt-in method, and expected volume.", "Reply here with the details."],
    tally: { portal: 2, email: 3, day: 11, minutes: 135 },
  },
  {
    title: "Verizon, by email",
    icon: "radio",
    kind: "compose",
    action: "Send",
    to: "rcs-launch@carrier.example",
    subject: "RCS campaign: Poblano's Mexican Grill",
    body: ["Campaign info and verification token attached.", "Use case: Marketing. Volume: up to 10,000 a month.", "Token: VT-••••-7Q2A."],
    tally: { portal: 2, email: 4, day: 12, minutes: 165 },
  },
  {
    title: "AT&T portal",
    icon: "radio",
    kind: "portal",
    action: "Submit",
    fields: [
      { label: "Brand", value: CUSTOMER.legalName },
      { label: "Campaign type", value: "Marketing, Promotional" },
      { label: "Sample message", value: CUSTOMER.sample },
      { label: "Opt-in", value: "Keyword on a web form" },
      { label: "Volume", value: "Up to 10,000 a month" },
    ],
    tally: { portal: 3, email: 4, day: 12, minutes: 205 },
  },
  {
    title: "T-Mobile portal",
    icon: "radio",
    kind: "portal",
    action: "Submit",
    fields: [
      { label: "Brand", value: CUSTOMER.legalName },
      { label: "Use cases", value: "Marketing, Promotions and offers, Loyalty programs" },
      { label: "Sample message", value: CUSTOMER.sample },
      { label: "Opt-in", value: "Keyword on a web form" },
      { label: "Volume", value: "Up to 10,000 a month" },
    ],
    tally: { portal: 4, email: 4, day: 13, minutes: 245 },
  },
  {
    title: "Other carriers",
    icon: "radio",
    kind: "portal",
    action: "Submit",
    fields: [
      { label: "Carrier", value: "Regional carrier, portal" },
      { label: "Carrier", value: "Regional carrier, portal" },
      { label: "Carrier", value: "Regional carrier, portal" },
      { label: "Carrier", value: "Regional carrier, email" },
    ],
    tally: { portal: 7, email: 5, day: 14, minutes: 315 },
  },
  {
    title: "Carrier testing, spreadsheet",
    icon: "table",
    kind: "sheet",
    action: "Submit",
    rows: [
      ["Flow", "Test number", "Carrier", "Status"],
      ["Welcome", "+1 555 010 0142", "AT&T", "Sent"],
      ["Deals", "+1 555 010 0142", "T-Mobile", "Sent"],
      ["Order update", "+1 555 010 0199", "Google", "Pending"],
    ],
    tally: { portal: 8, email: 5, day: 18, minutes: 375 },
  },
  {
    title: "Billing spreadsheet",
    icon: "table",
    kind: "sheet",
    action: "Next",
    rows: [
      ["Account", "Sender", "Type", "Start"],
      ["Nolan's Restaurant", "Nolan's Restaurant", "RCS", "Day 3"],
      ["Poblano's", CUSTOMER.agent, "RCS", "Day 19"],
      ["", "", "", ""],
    ],
    tally: { portal: 9, email: 5, day: 19, minutes: 405 },
  },
  {
    title: "Internal tracking platform",
    icon: "activity",
    kind: "console",
    action: "Submit",
    fields: [
      { label: "Account", value: CUSTOMER.name },
      { label: "Sender", value: CUSTOMER.agent },
      { label: "Channel", value: "RCS" },
      { label: "Enabled", value: "Yes" },
    ],
    tally: { portal: 10, email: 5, day: 20, minutes: 440 },
  },
  {
    title: "Status email to customer",
    icon: "mail",
    kind: "compose",
    action: "Send",
    to: CUSTOMER.contact,
    subject: "You're live",
    body: ["Your RCS agent is approved by the carriers and live.", "Thanks for your patience over the past three weeks."],
    tally: { portal: 10, email: 6, day: 21, minutes: 480 },
  },
];

/* ----------------------------------------------------------- Vibes Admin */

export const USE_CASES = ["Multi-use", "Transactional", "Marketing", "2FA"] as const;
export type UseCase = (typeof USE_CASES)[number];

/** the request's fields, as the left pane shows them */
export const REQUEST_FIELDS: { label: string; value: string }[] = [
  { label: "Brand", value: CUSTOMER.legalName },
  { label: "Website", value: CUSTOMER.website },
  { label: "Agent name", value: CUSTOMER.agent },
  { label: "Description", value: CUSTOMER.description },
  { label: "Sample message", value: CUSTOMER.sample },
  { label: "Opt-in", value: "Keyword on a web form" },
  { label: "Volume", value: "Up to 10,000 a month" },
];

/** the request's use case when the story starts */
export const DEFAULT_USE_CASE: UseCase = "Marketing";

export type SubmissionId = "vendor" | "google" | "verizon" | "att" | "tmobile";

/** how the request's use case lands in one party's template */
export type UseCaseMapping =
  | { kind: "checks"; options: string[]; checked: Record<UseCase, string[]> }
  | { kind: "value"; label: string; value: Record<UseCase, string> };

export type Submission = {
  id: SubmissionId;
  name: string;
  /** fields prefilled straight from the request */
  mapped: { label: string; value: string }[];
  /** fields the request does not have, with the value "Add" fills in */
  missing: { id: string; label: string; fill: string }[];
  useCase?: UseCaseMapping;
};

export const SUBMISSIONS: Submission[] = [
  {
    id: "vendor",
    name: "Verification vendor",
    mapped: [
      { label: "Legal name", value: CUSTOMER.legalName },
      { label: "Website", value: CUSTOMER.website },
      { label: "Contact", value: CUSTOMER.contact },
    ],
    missing: [{ id: "vendor-reg", label: "Business registration number", fill: "US-55-0192837" }],
  },
  {
    id: "google",
    name: "Google RBM",
    mapped: [
      { label: "Agent name", value: CUSTOMER.agent },
      { label: "Description", value: CUSTOMER.description },
      { label: "Logo", value: "poblanos-224.png" },
    ],
    missing: [{ id: "google-banner", label: "Banner image", fill: "poblanos-banner.png" }],
  },
  {
    id: "verizon",
    name: "Verizon",
    mapped: [
      { label: "Brand", value: CUSTOMER.legalName },
      { label: "Sample message", value: CUSTOMER.sample },
    ],
    missing: [],
    useCase: {
      kind: "value",
      label: "Campaign type",
      value: { "Multi-use": "Mixed", Transactional: "Transactional", Marketing: "Promotional", "2FA": "Authentication" },
    },
  },
  {
    id: "att",
    name: "AT&T",
    mapped: [
      { label: "Brand", value: CUSTOMER.legalName },
      { label: "Opt-in", value: "Keyword on a web form" },
    ],
    missing: [],
    useCase: {
      kind: "checks",
      options: ["Marketing", "Promotional", "Transactional", "Customer care", "Delivery", "Two-factor", "Surveys", "Alerts"],
      checked: {
        "Multi-use": ["Marketing", "Transactional", "Customer care"],
        Transactional: ["Transactional", "Delivery"],
        Marketing: ["Marketing", "Promotional"],
        "2FA": ["Two-factor"],
      },
    },
  },
  {
    id: "tmobile",
    name: "T-Mobile",
    mapped: [
      { label: "Brand", value: CUSTOMER.legalName },
      { label: "Volume", value: "Up to 10,000 a month" },
    ],
    missing: [],
    useCase: {
      kind: "checks",
      options: [
        "Account notifications",
        "Appointment reminders",
        "Customer care",
        "Delivery notifications",
        "Fraud alerts",
        "Marketing",
        "Polls and surveys",
        "Promotions and offers",
        "Security alerts",
        "Loyalty programs",
        "Order updates",
        "Two-factor codes",
      ],
      checked: {
        "Multi-use": ["Marketing", "Customer care", "Order updates", "Account notifications"],
        Transactional: ["Account notifications", "Delivery notifications", "Order updates"],
        Marketing: ["Marketing", "Promotions and offers", "Loyalty programs"],
        "2FA": ["Two-factor codes", "Security alerts"],
      },
    },
  },
];

/** the row autoplay opens to show the mapping */
export const AUTO_EXPAND: SubmissionId = "tmobile";

/** the status pills */
export const STATUS = { draft: "Draft", submitted: "Submitted", live: "Live" } as const;
export type Status = (typeof STATUS)[keyof typeof STATUS];

export const ADMIN_COPY = {
  product: "Vibes Admin",
  crumb: "Requests",
  requestTitle: "RCS agent request",
  submissions: "Submissions",
  submitAll: "Submit all",
  reviewing: "Carriers reviewing",
  prefilled: "Prefilled from the request",
  add: "Add",
  mapsTo: (useCase: string) => `Use case "${useCase}" maps to`,
};

/** the card at the end of the story */
export const END_CARD = { title: "RCS agent live.", body: "1 portal, 0 emails, about 90 minutes of Ops time." };

/* ------------------------------------------------------------- frames */

/** one moment of the story: a step, a phase within it, and how long autoplay holds it */
export type Frame = { step: Step; phase: string; ms: number; auto?: boolean };

/** how long autoplay holds each old-way screen */
export const SCREEN_MS = 900;

/**
 * The story, in order. Do not rename or remove frames; change `ms` to retime them.
 * `auto` frames advance by themselves in interactive mode as well.
 */
export const FRAMES: Frame[] = [
  // step 1: the diagram; the email arrives on its own
  { step: "before", phase: "diagram", ms: 3200, auto: true },
  // step 2: the email card, then the zoom into the RCS branch
  { step: "request", phase: "email", ms: 1800 },
  { step: "request", phase: "zoom", ms: 2000 },
  // step 3: one frame per screen, "s1" to "s14", then the interstitial that closes the old way
  ...SCREENS.map((_, k) => ({ step: "old" as Step, phase: `s${k + 1}`, ms: SCREEN_MS })),
  { step: "old", phase: "wrap", ms: 1600 },
  // step 4: the vision; the email arrives again on its own
  { step: "vision", phase: "diagram", ms: 3600, auto: true },
  // step 5: the same email, now opened in Vibes Admin
  { step: "request2", phase: "email", ms: 2000 },
  // step 6: the admin, a row opened to show the mapping, the missing fields added, submit, review
  { step: "admin", phase: "draft", ms: 1400 },
  { step: "admin", phase: "expand", ms: 2600 },
  { step: "admin", phase: "added", ms: 1400 },
  { step: "admin", phase: "submitting", ms: 1500, auto: true },
  { step: "admin", phase: "reviewing", ms: 2000, auto: true },
  // step 7: live
  { step: "live", phase: "live", ms: 3800 },
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
  target: "acknowledge" | "get-started" | "screen-action" | "see-vision" | "open-admin" | "submit-all";
  /** what the viewer sees */
  sees: string;
  /** what the viewer clicks */
  clicks: string;
};

export const HAPPY_PATH: HappyMoment[] = [
  { step: "request", target: "acknowledge", sees: "An email arrives over the diagram: a request for an RCS agent.", clicks: "Press Acknowledge" },
  { step: "request", target: "get-started", sees: "The diagram zooms into the RCS branch.", clicks: "Press Get started" },
  { step: "old", target: "screen-action", sees: "One of fourteen screens; the tally counts up.", clicks: "Press the screen's one action" },
  { step: "old", target: "see-vision", sees: "The old way, summed up: 10 portals, 6+ emails, about 8 hours of Ops time per request.", clicks: "Press See the vision" },
  { step: "request2", target: "open-admin", sees: "The same email, over the vision.", clicks: "Press Open in Vibes Admin" },
  { step: "admin", target: "submit-all", sees: "The request and its five prefilled submissions.", clicks: "Press Submit all" },
];
