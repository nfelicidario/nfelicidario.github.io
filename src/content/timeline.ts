export type Milestone = {
  when: string;
  what: string;
  /** internal case-study link: makes the whole row clickable */
  href?: string;
  /** small external links shown after the text (press, announcements) */
  links?: { label: string; href: string }[];
};

/** Most recent first. */
export const recent: Milestone[] = [
  {
    when: "Jul 2026",
    what: "RCS Studio went GA, Vibes' first self-serve product in a decade. I owned it end to end.",
    href: "/work/rcs-studio/",
  },
  {
    when: "Mar 2026",
    what: "First production merge with Claude Code at Vibes. Now shipping on par with the team's engineers.",
    href: "/work/making-the-team-faster/",
  },
  {
    when: "2023",
    what: "Stride raised a $750,000 seed round. I made the deck, prototype, and product video behind it.",
    links: [
      {
        label: "Built In Chicago",
        href: "https://www.builtinchicago.org/articles/stride-raises-750k-career-development",
      },
    ],
  },
];

export const more: Milestone[] = [
  {
    when: "2020",
    what: "Shipped production frontend code at Capital One after its bootcamp. Design and build stopped being separate.",
  },
  { when: "2020", what: "Co-founded Stride." },
  {
    when: "2018",
    what: "Learned to code at PerkSpot to prove a Chrome extension idea to the CEO. Shipped after I left. 100k+ users.",
  },
  {
    when: "2018",
    what: "Founded the Michigan Fishing team at the University of Michigan. Built its brand, site, and merch while running it.",
  },
  {
    when: "2016",
    what: "Co-founded Step on Poverty with four other high schoolers in Troy, MI. 9,000+ pairs of shoes by 2017.",
    links: [
      {
        label: "Oakland Press",
        href: "https://www.theoaklandpress.com/2017/10/27/troy-organization-collecting-gently-used-shoes-to-benefit-developing-nations/",
      },
      {
        label: "C&G News (archived)",
        href: "https://web.archive.org/web/20171105134527/http://www.candgnews.com/news/Teencharitycollects9000pairsofshoesforneedy",
      },
    ],
  },
  {
    when: "2015",
    what: "Started a business modernizing local orgs' digital marketing. It failed. First lesson in what people pay for.",
  },
  {
    when: "2015",
    what: "Became webmaster for two nonprofits I belonged to, and the youngest member of their boards.",
  },
];

export const origin: Milestone = {
  when: "2013",
  what: "Taught myself visual design making fliers, posters, and brand pieces for local nonprofits. Still how I learn.",
};
