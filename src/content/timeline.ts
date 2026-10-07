export type Milestone = {
  when: string;
  what: string;
  /** internal case-study link: makes the whole row clickable */
  href?: string;
  /** small external links revealed on hover (press, announcements, live products) */
  links?: { label: string; href: string; kind?: "press" | "web" }[];
  /** detail lines revealed on hover or focus */
  sub?: string[];
};

/** Most recent first. */
export const recent: Milestone[] = [
  {
    when: "Q3 2026",
    what: "RCS Studio reached general availability at Vibes, designed and built end to end.",
    sub: [
      "Owned the design, requirements, roadmap, and production code.",
      "The company's first self-serve product in a decade.",
    ],
    href: "/work/rcs-studio/",
  },
  {
    when: "Q1 2026",
    what: "First production merge with Claude Code at Vibes. Design and build stopped being separate.",
    sub: ["Now ships on par with the team's engineers."],
    href: "/work/making-the-team-faster/",
  },
  {
    when: "Q4 2023",
    what: "Stride raised a $750,000 seed round led by Lightbank.",
    sub: ["Made the deck, prototype, and product video for the raise."],
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
    when: "Q4 2020",
    what: "Completed Capital One's coding bootcamp, then shipped production frontend code there.",
    sub: ["Vue.js and Node.js for a servicing platform used by 1,000+ agents."],
  },
  {
    when: "Q1 2020",
    what: "Co-founded Stride, B2B coaching delivered inside Slack and Microsoft Teams.",
    sub: [
      "Founding product designer; owned product, design, brand, and marketing.",
      "Grew from 1 to 20 clients over five years.",
    ],
  },
  {
    when: "Q3 2018",
    what: "Design intern at PerkSpot. Prototyped a Chrome extension to prove an idea to the CEO.",
    sub: [
      "The idea came from conversations with sales, account management, and support.",
      "Learned JavaScript, HTML, and CSS to build the proof of concept.",
      "Shipped after the internship ended. 100,000+ users today.",
    ],
    links: [
      {
        label: "Chrome Web Store",
        href: "https://chromewebstore.google.com/detail/perkspot-save-while-you-s/ecnfmmdoiiihbbpenbgdienmdpejbmdj",
        kind: "web",
      },
    ],
  },
  {
    when: "2016",
    what: "Founded Step on Poverty, a 501(c)(3), with other high schoolers in Troy, Michigan.",
    sub: [
      "Started after serving as youth advisers for Leadership Troy.",
      "9,000+ pairs of shoes by Oct 2017, resold by micro-enterprises in developing nations.",
      "Guidance and funding for students' projects; websites for three Troy nonprofits.",
    ],
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
    what: "Digital marketing modernization for local businesses, many with no online presence at all.",
    sub: ["It did not last. An early lesson in the gap between a real need and a paying one."],
  },
  {
    when: "2015",
    what: "Served as webmaster for two nonprofits.",
    sub: ["Youngest member on both boards."],
  },
];

export const origin: Milestone = {
  when: "2013",
  what: "Self-taught visual design foundations: fliers, posters, and brand pieces for local nonprofits.",
  sub: ["High school years, 2012 to 2016."],
};
