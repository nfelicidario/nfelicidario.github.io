import type { Metadata } from "next";
import { VibesLogo } from "@/components/VibesLogo";
import { CaseHero, MetaBand, NextCase } from "@/components/case/CaseLayout";
import { Banner, Beats, Bullets, Define, Definition, SixtySeconds, StoryBeat, StoryLink } from "@/components/case/Story";
import { CircleAlert, Layers, LayoutTemplate, Palette, Repeat, Shapes } from "lucide-react";
import { NexusStage } from "@/components/work/design-system/hero/NexusStage";
import { TwoLooks } from "@/components/work/design-system/slides/TwoLooks";
import { EightSteps, Promotion } from "@/components/work/design-system/slides/Promotion";
import { FirstWin } from "@/components/work/design-system/slides/FirstWin";
import { IconLibrary } from "@/components/work/design-system/slides/IconLibrary";
import { DirectionVote } from "@/components/work/design-system/slides/DirectionVote";
import { TokenLayers } from "@/components/work/design-system/slides/TokenLayers";
import { CoreComponents } from "@/components/work/design-system/slides/CoreComponents";
import { PagePatterns } from "@/components/work/design-system/slides/PagePatterns";
import { Rollout } from "@/components/work/design-system/slides/Rollout";
import { PromotionPractice } from "@/components/work/design-system/slides/PromotionPractice";
import { NexusOutcomes } from "@/components/work/design-system/slides/NexusOutcomes";

export const metadata: Metadata = {
  title: "Design system",
  description:
    "Platform and RCS Studio looked like two companies. I made Studio's design direction the standard for every Vibes app, promoted up through Nexus, starting with icons.",
};

const meta = [
  {
    label: "Role",
    value: (
      <ul className="grid gap-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Product designer</li>
        <li>Design system lead</li>
      </ul>
    ),
  },
  {
    label: "Team",
    value: (
      <ul className="grid gap-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Head of design</li>
        <li>Design, product, and engineering leads from both products</li>
        <li>Sales and marketing (brand view)</li>
      </ul>
    ),
  },
  { label: "Timeline", value: "2026 – Present" },
  {
    label: "Stack",
    value: (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Figma</li>
        <li>Storybook</li>
        <li>React</li>
        <li>TypeScript</li>
        <li>Tailwind</li>
        <li>Lucide</li>
        <li>Radix</li>
        <li>Code Connect</li>
      </ul>
    ),
  },
];

export default function DesignSystemPage() {
  return (
    <div className="container-x">
      <CaseHero
        kicker="Vibes · 2026"
        product="Nexus"
        pov="Every Vibes app"
        brand={<VibesLogo className="h-full w-auto" />}
        title="One look, promoted up"
        lede="Platform and RCS Studio looked like they came from two different companies. I made Studio's design direction the standard for every Vibes app, and made Nexus the place it lives."
        meta={meta}
        intro={<MetaBand meta={meta} />}
        stage={<NexusStage />}
      />

      <SixtySeconds
        lede={
          <>
            <strong>Nexus</strong> is Vibes&apos; shared design system. This is the plan that makes RCS Studio&apos;s design direction the
            standard for every Vibes app, by promoting Studio&apos;s work up into Nexus
          </>
        }
        problem={[
          "Platform and RCS Studio look like they come from two different companies",
          "Platform grew over many years without a shared design foundation, so every team made its own visual choices",
          "It works, but it looks dated next to Studio, and sales often skips showing the UI in demos",
        ]}
        work={[
          "Audited Nexus and the UI of both products, and scored the candidates for a first win",
          "Rebuilt the icon library on Lucide and migrated Studio to it, the first promotion",
          {
            text: "Set up promotion as the way the system grows, in three parts:",
            plain: true,
            sub: [
              <span key="foundations" className="inline-flex items-center gap-2"><Palette size={14} className="text-accent" aria-hidden="true" />Foundations: direction, tokens, components</span>,
              <span key="patterns" className="inline-flex items-center gap-2"><LayoutTemplate size={14} className="text-accent" aria-hidden="true" />Patterns: the app shell, templates, repeating patterns</span>,
              <span key="practice" className="inline-flex items-center gap-2"><Repeat size={14} className="text-accent" aria-hidden="true" />Practice: adoption in layers, and promotion as a habit</span>,
            ],
          },
        ]}
        result={[
          "One icon standard now serves every app, with a build check that keeps it that way",
          "A current-state audit and a prioritized roadmap for the rest",
          "Nexus is fed by the product evolving fastest, so it stays current instead of falling behind",
          "A pattern is built once in Studio and promoted, instead of rebuilt in each app",
        ]}
        stats={[
          { value: "1", label: "icon standard, serving every Vibes app" },
          { value: "8", label: "steps in the plan, icons first" },
          { value: "18", label: "design ideas to agree on, before any exact values" },
          { value: "3", label: "token layers: raw, role, component" },
        ]}
        takeawaysLabel="Changes to how I work"
        takeaways={[
          {
            lead: "Pick the win that depends on nothing.",
            text: "Icons appear on every page, carry little risk, and wait on no other decision. Landing them first made the promotion model real before anyone had to agree on a colour.",
          },
          {
            lead: "Prototype the direction.",
            text: "People react to real UI, not to mockups. Nexus next lives in Storybook, so every idea in the review is something you can click.",
          },
          {
            lead: "Promote, don't port.",
            text: "Porting pages one by one is how Platform fell behind. Promoting shared pieces into the system improves the look everywhere at once, and keeps it improving.",
          },
        ]}
      />

      <Beats>
        <StoryBeat
          id="the-problem"
          title="Two products, two companies"
          subtitle="The problem"
          layout="stack"
          align="left"
          visualFirst
          visual={<TwoLooks />}
          after={
            <Banner icon={<CircleAlert size={17} />} label="The problem">
              The Platform look works, but it looks dated next to Studio, and sales teams often skip showing the UI in demos.
            </Banner>
          }
        >
          <Bullets
            items={[
              "Platform grew over many years without a shared design foundation underneath it, so every team made its own visual choices",
              <>
                <Define def="Vibes' shared design system: the components, tokens, and icons the apps are meant to build from.">Nexus</Define> existed, but it
                was built for a mobile marketer: large sizing, many colours at once, and no clear next step
              </>,
              <>
                <StoryLink href="/work/rcs-studio/">RCS Studio</StoryLink> iterated fast on customer and internal feedback and drifted from Nexus. The drift got
                noticed, and so did the look: customers and sales called it modern and clean
              </>,
              "Two products, evolving separately, were pulling further apart with every release",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="the-solution"
          title="Promote up, not page by page"
          subtitle="The solution"
          layout="stack"
          align="left"
          visualFirst
          visual={
            <Definition term="promotion" respelling="pro·mo·tion">
              Taking a component or pattern an app built for itself and moving it up into Nexus, so every app gets it through the system.
            </Definition>
          }
          after={
            <div className="grid gap-5">
              <Promotion />
              <EightSteps />
            </div>
          }
        >
          <Bullets
            items={[
              "Make RCS Studio's design direction the standard for all Vibes apps, and make Nexus the place it lives",
              "As Studio builds new components and patterns, anything that should be shared gets promoted up into Nexus",
              "The look improves everywhere through the system, not page by page, and Nexus stays current because the fastest-moving product feeds it",
              "Eight steps, ordered so each one unblocks the next, with icons first",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="first-win"
          title="Assess the current state, pick the first win"
          subtitle="Step 1"
          railTitle="Pick the first win"
          layout="stack"
          align="left"
          visualFirst
          visual={<FirstWin />}
        >
          <Bullets
            items={[
              "I took stock of Nexus: its components, tokens, and icons, and which ones each app actually uses, duplicates, or overrides",
              "I took stock of the UI: key pages in Platform and Studio, and every inconsistency in colour, type size, spacing, button style, and icons",
              "I scored the possible first projects on visibility, risk, effort, and what they depend on. Icons came out on top",
              "Deliverables: a current-state audit and a prioritized roadmap",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="icons"
          title="Rebuild the icon library"
          note="One standard, every app"
          icon={<Shapes size={20} />}
          subtitle="Step 2"
          railTitle="Rebuild the icon library"
          layout="stack"
          align="left"
          visualFirst
          visual={<IconLibrary />}
        >
          <Bullets
            items={[
              "I adopted Lucide as the base, with its style rules: a 24×24 canvas, 2px stroke, rounded ends and corners, and colour that follows the text",
              "I split out what isn't an icon. Flags, logos, and illustrations each get their own category instead of sharing one set with UI icons",
              "I mapped every old icon to its Lucide equivalent, and drew the custom ones, toll-free for example, to the same rules with no exceptions",
              "A build check rejects any icon that breaks the rules, search tags come from Lucide's tags, product words, and the old names, and a manifest tracks where each icon came from, so a Lucide upgrade never overwrites a custom change",
              "Deliverables: the core icons package, its docs, a rename map and migration guide, and Studio's migration. This was the first promotion",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="direction"
          title="Agree on a design direction"
          note="Big ideas before exact values"
          subtitle="Step 3"
          railTitle="Agree on a direction"
          layout="stack"
          align="left"
          visualFirst
          visual={<DirectionVote />}
        >
          <Bullets
            items={[
              "The audit has 18 ideas in two groups, look and feel and page patterns. Each shows Nexus today next to Nexus next",
              "The right people in the room: design, product, and engineering leads from both products, plus sales and marketing for the brand view",
              "Each idea gets a vote, agree, agree with changes, or not yet, with the notes recorded",
              "The ideas are shown on a working prototype, Nexus next in Storybook, so people react to real UI rather than mockups",
              "Deliverable: an agreed design direction, written up as a short set of design principles",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="tokens"
          title="Set the foundations"
          note="Tokens in layers, one source for design and code"
          icon={<Palette size={20} />}
          subtitle="Step 4"
          railTitle="Set the foundations"
          layout="stack"
          align="left"
          visualFirst
          visual={<TokenLayers />}
        >
          <Bullets
            items={[
              "Colour: a neutral scale, brand colours, and status colours, assigned to roles like surface, text, and border, and structured so dark mode can come later",
              "Type, spacing, and shape: a type scale with set weights and line heights, a 4px spacing scale, radius, shadows, motion, focus rings, and breakpoints",
              "Three layers: raw values feed role tokens, which feed component tokens. Changing a brand colour is then a one-line change",
              "Automated contrast checks against WCAG 2.2 AA, and the same tokens publish to code and to Figma variables",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="components"
          title="Rebuild the core components"
          note="Accessible primitives, one API, every state"
          icon={<Layers size={20} />}
          subtitle="Step 5"
          railTitle="Rebuild the core components"
          layout="stack"
          align="left"
          visualFirst
          visual={<CoreComponents />}
        >
          <Bullets
            items={[
              "Start with the most-used components: buttons, inputs, selects, checkboxes and radios, tabs, toasts, badges, and tooltips",
              "Build on accessible primitives, so keyboard use, focus, and screen readers work by default",
              "Keep the API consistent: sizes, variants, and states are named the same way across every component",
              "Every state is documented in Storybook with visual regression tests, and matched to a Figma component linked with Code Connect",
              "Old components retire gradually, with deprecation warnings and a clear replacement for each",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="patterns"
          title="Add page patterns and layouts"
          note="Where promotion matters most"
          icon={<LayoutTemplate size={20} />}
          subtitle="Step 6"
          railTitle="Add page patterns"
          layout="stack"
          align="left"
          visualFirst
          visual={<PagePatterns />}
        >
          <Bullets
            items={[
              "The app shell: navigation, header, and page header",
              "Page templates for list, detail, settings, form, and dashboard pages, each with its empty, error, and loading states",
              "The repeating patterns: the list toolbar, the date range picker, bulk actions, and pagination",
              "Content guidelines: sentence case, voice and tone, and how to write an error message",
              "These come mostly from Studio's proven patterns, so this is the step that promotion exists for",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="adoption"
          title="Adopt across products"
          note="Studio first, then Platform, in layers"
          subtitle="Step 7"
          railTitle="Adopt across products"
          layout="stack"
          align="left"
          visualFirst
          visual={<Rollout />}
        >
          <Bullets
            items={[
              "Studio first. It's closest to the direction, so it tests the system with the least change",
              "Then Platform, starting with the pages sales demos most and the busiest pages according to analytics",
              "In layers: swap tokens and icons app-wide first, cheap with a broad visual payoff, then replace components, then rebuild pages on the templates",
              "Migration guides, automated code changes where possible, and adoption tracked page by page",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="practice"
          title="Keep promoting"
          note="An ongoing practice, not a project"
          icon={<Repeat size={20} />}
          subtitle="Step 8"
          railTitle="Keep promoting"
          layout="stack"
          align="left"
          visualFirst
          visual={<PromotionPractice />}
        >
          <Bullets
            items={[
              "Every component gets a tier: app-only, shared across a product's own apps, or Nexus",
              "What qualifies: needed, or likely needed, by two or more apps; stable; tokens only; accessible",
              "The path: propose, review, generalize, land in Nexus, then the source app switches to the Nexus version",
              "A small design system group, design and engineering from each product, reviews proposals, and Nexus releases properly: version numbers, a changelog, and release notes",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="the-outcome"
          title="Nexus stays current"
          subtitle="The outcome"
          layout="stack"
          align="left"
          visualFirst
          visual={<NexusOutcomes />}
        >
          <Bullets
            items={[
              "One icon standard serves every app today, and the build check keeps it that way",
              "Nexus evolves with the product instead of falling behind it, because the fastest-moving product feeds it",
              "A pattern is built once and shared, and Platform gets Studio's improvements as they're promoted",
              "As the system fills out, teams start new features from Nexus parts, and promotion drops from a constant flow to an occasional, deliberate step for genuinely new needs",
            ]}
          />
        </StoryBeat>
      </Beats>

      <NextCase slug="making-the-team-faster" />
    </div>
  );
}
