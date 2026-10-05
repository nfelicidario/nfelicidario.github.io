export type Project = {
  slug: string;
  title: string;
  summary: string;
  org: string;
  years: string;
  metric: string;
  /** two cool hues for the placeholder thumbnail until the artifact exists */
  hues: [string, string];
  status?: "live" | "draft";
};

export const projects: Project[] = [
  {
    slug: "rcs-studio",
    title: "RCS Studio",
    summary:
      "The company built a flow builder for developers. Customers needed onboarding. I repositioned the product around provisioning right before beta.",
    org: "Vibes",
    years: "2025–26",
    metric: "450+ agents",
    hues: ["#1f4fe0", "#0b1b33"],
    status: "draft",
  },
  {
    slug: "provisioning",
    title: "The user nobody designed for",
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
    title: "Making the team faster",
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
    title: "Three times the product was wrong",
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
