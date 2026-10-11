export type Project = {
  slug: string;
  title: string;
  summary: string;
  org: string;
  years: string;
  metric: string;
  /** two cool hues, used as a fallback behind the media */
  hues: [string, string];
  status?: "live" | "draft";
  /** recorded hero loop, shown grayscale until hover */
  gif: string;
  /** what it is, two lines */
  bullets: string[];
  /** what happened, two lines */
  outcomes: string[];
};

export const projects: Project[] = [
  {
    slug: "rcs-studio",
    title: "RCS Studio",
    gif: "/work/rcs-studio/hero.gif",
    bullets: [
      "Self-serve product for provisioning and building RCS agents.",
      "Owned requirements, roadmap, design, and production code.",
    ],
    outcomes: [
      "GA in July 2026, Vibes' first self-serve product ever.",
      "500+ agents provisioned, in one to three weeks each.",
    ],
    summary:
      "The company built a flow builder for developers. Customers needed onboarding. I repositioned the product around provisioning right before beta.",
    org: "Vibes",
    years: "2025–26",
    metric: "500+ agents",
    hues: ["#1f4fe0", "#0b1b33"],
    status: "draft",
  },
  {
    slug: "provisioning",
    title: "Vibes Admin",
    gif: "/work/provisioning/hero.gif",
    bullets: [
      "Guided customer intake replacing an email-driven process.",
      "Internal admin for accounts, the provisioning queue, and submissions.",
    ],
    outcomes: [
      "8 hours to 90 minutes of operations effort per request.",
      "10 portals to 6, heading to 1.",
    ],
    summary:
      "Provisioning ran on ten portals and an inbox. I shadowed operations, then designed and shipped the intake and the admin that replaced it.",
    org: "Vibes",
    years: "2026",
    metric: "8h → 90m",
    hues: ["#2c8c6a", "#0f3b2c"],
    status: "draft",
  },
  {
    slug: "making-the-team-faster",
    title: "Agentic SDLC",
    gif: "/work/making-the-team-faster/hero.gif",
    bullets: [
      "Planning flow set as the first team on Linear.",
      "Prototypes in code deployed to shared environments instead of handoff.",
    ],
    outcomes: [
      "About half the product and technology org runs on the flow.",
      "Two of the largest features shipped from a prototype branch.",
    ],
    summary:
      "No mandate, one willing team. The planning flow half the org now runs on, handoff replaced by prototypes in code, templates used from IC to board.",
    org: "Vibes",
    years: "2025–26",
    metric: "½ the org on Linear",
    hues: ["#5b7bd6", "#1b2a4a"],
    status: "draft",
  },
  {
    slug: "stride",
    title: "Stride",
    gif: "/work/stride/hero.gif",
    bullets: [
      "B2B coaching delivered inside Slack and Microsoft Teams.",
      "Co-founder and founding designer across product, brand, and marketing.",
    ],
    outcomes: [
      "Monthly active users from 2% to 22% of seats.",
      "1 to 20 clients, and a $750,000 seed round.",
    ],
    summary:
      "Five years as co-founder and founding designer. A B2B pivot, a phased onboarding, and the microlearning product that finally sold.",
    org: "Stride",
    years: "2020–25",
    metric: "2% → 22% MAU",
    hues: ["#3c5bd6", "#7a3cd6"],
    status: "draft",
  },
];

export const earlier = [
  {
    org: "Capital One",
    line: "Multi-case servicing workflows for 1,000+ agents, 28% faster",
    years: "2020–23",
  },
  {
    org: "PerkSpot",
    line: "Intern-built Chrome extension proof of concept, now 100k users",
    years: "2018",
  },
];

export const now = {
  date: "Week of Sep 29, 2026",
  title: "Rebuilding this site in code",
  body: "Replacing a Squarespace portfolio with this one: Next.js, static export, GitHub Pages, built with Claude Code. Four case studies are drafted and landing one at a time. The source is public.",
};
