export type Milestone = {
  when: string;
  what: string;
  href?: string;
};

/** Most recent first. The last entry is the origin and is always shown. */
export const recent: Milestone[] = [
  { when: "Jul 2026", what: "RCS Studio went GA. Vibes' first self-serve product in a decade.", href: "/work/rcs-studio/" },
  { when: "Mar 2026", what: "First production merge with Claude Code. Now shipping on par with the team's engineers.", href: "/work/making-the-team-faster/" },
  { when: "Feb 2026", what: "RCS Studio beta. Repositioned around provisioning right before launch.", href: "/work/rcs-studio/" },
];

export const more: Milestone[] = [
  { when: "Aug 2025", what: "Joined Vibes as the sole designer on RCS Studio." },
  { when: "2025", what: "Provisioning rebuilt: ops effort per request from 8 hours to 90 minutes.", href: "/work/provisioning/" },
  { when: "2023", what: "Shipped multi-case servicing workflows at Capital One, 28% faster for 1,000+ agents." },
  { when: "2022", what: "Development Journey Tracks at Stride took monthly active users from 2% to 22%.", href: "/work/stride/" },
  { when: "2020", what: "Co-founded Stride. Pivoted from a standalone workspace to a Slack and Teams integration." },
  { when: "2018", what: "Built a Chrome extension proof of concept at PerkSpot. It shipped and now has 100k users." },
];

export const origin: Milestone = {
  when: "2016",
  what: "Taught myself graphic design making fliers for student orgs and local nonprofits.",
};
