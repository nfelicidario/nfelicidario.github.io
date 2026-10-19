import type { Metadata } from "next";
import { Artifact, CaseHero, Hindsight, NextCase, Outcome } from "@/components/case/CaseLayout";
import { Beats, Bullets, SixtySeconds, Span, StoryBeat, StoryLink } from "@/components/case/Story";
import { BadgeCheck, Network } from "lucide-react";
import { RcsIntro } from "@/components/work/rcs-studio/Intro";
import { LookShift } from "@/components/work/rcs-studio/LookShift";
import { Proof } from "@/components/work/rcs-studio/Proof";
import { PrototypeToReframe } from "@/components/work/rcs-studio/PrototypeToReframe";
import { BetsTimeline, TheBet } from "@/components/work/rcs-studio/TheBet";
import { WhoWasAsking } from "@/components/work/rcs-studio/WhoWasAsking";
import { RcsStudioStage } from "@/components/work/rcs-studio/hero/RcsStudioStage";
import { Simplify } from "@/components/work/rcs-studio/Simplify";
import { ThreeUsers } from "@/components/work/rcs-studio/ThreeUsers";
import { VibesLogo } from "@/components/VibesLogo";

export const metadata: Metadata = { title: "RCS Studio" };

const TIMELINE = [
  { at: "Aug 2025", what: "Joined" },
  { at: "Feb 2026", what: "Beta" },
  { at: "Jul 2026", what: "GA" },
];

const meta = [
  {
    label: "Role",
    value: (
      <ul className="grid gap-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Product designer</li>
        <li>Acting product manager</li>
      </ul>
    ),
  },
  {
    label: "Team",
    value: (
      <ul className="grid gap-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Engineering manager</li>
        <li>Three engineers</li>
        <li>No dedicated PM for most of the project</li>
      </ul>
    ),
  },
  { label: "Timeline", value: <Span points={TIMELINE} direction="vertical" /> },
  {
    label: "Stack",
    value: (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Figma</li>
        <li>Storybook</li>
        <li>React</li>
        <li>TypeScript</li>
        <li>Claude Code</li>
        <li>
          <s className="text-muted">Jira</s> Linear
        </li>
        <li>AWS</li>
        <li>Datadog</li>
        <li>GitLab</li>
      </ul>
    ),
  },
];

export default function Page() {
  return (
    <div className="container-x">
      <CaseHero
        kicker="Vibes · 2025–26"
        product="RCS Studio"
        pov="Customer"
        brand={<VibesLogo className="h-full w-auto" />}
        title="We built the second step first"
        lede="RCS Studio launched as a tool for building RCS message flows. But a customer can't send anything until their agent is provisioned, and nobody had built that part. I repositioned the product around getting an agent live, and it became the way every Vibes customer gets one."
        meta={meta}
        intro={<RcsIntro meta={meta} />}
        stage={<RcsStudioStage />}
      />

      <SixtySeconds
        lede="RCS Studio is Vibes' self-serve platform for getting a business onto RCS, the richer successor to SMS."
        terms={[
          {
            icon: <BadgeCheck size={15} />,
            title: "Provisioning",
            text: "Getting a business sender (ex: RCS agent) registered, verified, and approved by the appropriate third parties.",
          },
          {
            icon: <Network size={15} />,
            title: "Flow building",
            text: "App-like experiences built from RCS features and data connections, delivered inside a user's native messaging app.",
          },
        ]}
        problem={[
          "Launched as a flow builder for developers",
          { text: "Buyers asked:", sub: ["What is RCS?", "Why is it better than SMS?", "How do we get started?"] },
          "Provisioning was missing",
        ]}
        work={[
          "Owned requirements, roadmap, and design",
          "Repositioned the product around provisioning, with the flow builder as step two",
          "Prototyped the new provisioning experience to win over the skeptics",
          "Contributed to the provisioning flows in production code",
        ]}
        result={[
          "Vibes' first proof that customers want to sign up and get started on their own",
          "Provisioning now extends to TFN, with 10DLC and Short Code next",
          "The design direction now leads the company's next-generation products",
        ]}
        stats={[
          { value: "1st", label: "public sign-up at Vibes" },
          { value: "1st", label: "self-serve product at Vibes" },
          { value: "1st", label: "new Vibes product in roughly a decade" },
          { value: "500+", label: "RCS agents provisioned through RCS Studio" },
          { value: "1–3 wks", label: "to provision, compared to several months for competitors" },
        ]}
        takeawaysLabel="What changed how I work"
        takeaways={[
          {
            lead: "Prototype the argument.",
            text: "I build a proof of concept, or several, as a visual talking point, collaborate with the team on what works and what doesn't, and iterate.",
          },
          {
            lead: "Push the boundaries.",
            text: "Mobile marketing has its standards and Vibes has its habits. RCS Studio pushed past both and unlocked a lot of new findings.",
          },
          {
            lead: "Prototype in the codebase.",
            text: "I open a branch with the UI, and the engineers build off of it.",
          },
        ]}
      />

      <Beats>
        <StoryBeat
          id="the-bets"
          title="The bets"
          layout="stack"
          visualFirst
          visual={
            <Artifact>
              <TheBet />
            </Artifact>
          }
          after={
            <div className="mx-auto max-w-4xl border-t border-rule pt-8">
              <BetsTimeline />
            </div>
          }
        >
          <Bullets
            items={[
              "Vibes believes in a future where RCS replaces SMS",
              "A hackathon project around a flow builder laid the foundation for what is now RCS Studio",
              <>To back the bet that developers will lead, RCS Studio became Vibes&apos; first self-serve product</>,
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="the-question"
          title="Buyers asked a different question"
          layout="split"
          visual={
            <Artifact label="Who was asking, and what for" pill="Abstracted">
              <WhoWasAsking />
            </Artifact>
          }
        >
          <Bullets
            items={[
              <>A few technical builders did arrive wanting to build flows, but they weren&apos;t the ones deciding</>,
              <>The buyers who signed off asked: What is RCS? Why is it better than SMS? How do we get started?</>,
              "Getting started meant provisioning: a brand and agent registered and approved by third-party partners, over weeks of email handled by hand",
              "The signal built up across customer interviews, sales calls, usage data, and a competitive analysis",
              "We had built the second step of the product and skipped the first",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="two-customers"
          title="Two customers, and the team behind them"
          layout="split-reverse"
          visual={
            <Artifact label="Who the product is for now" pill="Personas">
              <ThreeUsers />
            </Artifact>
          }
        >
          <Bullets
            items={[
              "With provisioning first, the product had two customers instead of one",
              "Marketing operations people needed an agent for a campaign and had never written code",
              "Technical builders wanted the flow builder once an agent existed",
              "Right before beta, I split the product around those two",
              <>
                Behind both sat our operations team, provisioning by hand. Their tooling is{" "}
                <StoryLink href="/work/provisioning/">the next case study</StoryLink>
              </>,
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="making-the-case"
          title="A prototype instead of a debate"
          layout="stack"
          visual={
            <Artifact label="From prototype to reframe" pill="Abstract shapes">
              <PrototypeToReframe />
            </Artifact>
          }
        >
          <Bullets
            items={[
              "Not everyone agreed that provisioning should lead: the product had launched as a flow builder, and a provisioning platform has a different first screen",
              "Instead of arguing, I built a prototype of the provisioning flow",
              "I put it in front of the operations team, the people provisioning by hand, and their reaction won over the skeptics",
              "The reframe that stuck: a flow builder competes with one feature of the incumbents, while a provisioning platform competes with the incumbents",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="the-builder"
          title="Three steps to a working flow"
          layout="wide"
          visual={
            <Artifact label="The builder, before and after" pill="Abstract shapes">
              <Simplify />
            </Artifact>
          }
        >
          <Bullets
            items={[
              <>The builder stayed as the second step, and a second step can&apos;t be the hardest part of the product</>,
              <>Most beta users didn&apos;t use the original state builder correctly, or at all</>,
              "I cut optionality from the default path and moved advanced capability behind progressive disclosure",
              "Three steps now get people to a working flow",
              "Today the builder is mostly a demo engine, with a handful of power users",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="a-new-look"
          title="Color saved for the next step"
          layout="split-reverse"
          visual={
            <Artifact label="Same step, two systems" pill="Abstract tiles">
              <LookShift />
            </Artifact>
          }
        >
          <Bullets
            items={[
              "The inherited design system was built for a marketing product: large type, generous spacing, and color used freely",
              "RCS Studio walks people through provisioning one step at a time, so I went smaller and tighter and reserved color for the next step",
              "The drift got noticed, so I reviewed each change with the head of design and fed what landed back into the shared system",
              "Customers and sales called the result elegant and modern",
              <>It is now the direction for the company&apos;s next-generation products</>,
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="what-it-proved"
          title="What it proved"
          layout="stack"
          visual={
            <Artifact label="What it proved">
              <Proof />
            </Artifact>
          }
        >
          <Bullets
            items={[
              "Anyone could sign up and get an agent into Test Mode on their own, and launching meant a conversation with sales",
              "Some booked the call, and some got to Test Mode and never did, which showed where self-serve still leaked",
              <>It is the company&apos;s first proof that customers will sign up and get started on their own</>,
              "For the first seven months I worked from a Figma design doc for nearly every change, with a roadmap the product organization still uses for executive reviews",
              "From March 2026 I shipped production TypeScript alongside the engineers: sign-up, sign-in, and the customer-facing provisioning flows",
            ]}
          />
        </StoryBeat>
      </Beats>

      <Outcome align="center">
        <p>
          RCS Studio is now the portal for every RCS agent Vibes provisions. More importantly, it proved that
          customers would sign up and get an agent running on their own, something the company had never
          seen. That changed its direction, and I&apos;m now working with the head of product on a company-wide
          self-serve entry point.
        </p>
      </Outcome>

      <Hindsight align="center">
        <p>
          I&apos;d have built RCS Studio as a surface of Vibes&apos; existing products, not a standalone brand on
          its own domain. The early vision tried to be too much, and the industry was never going to adopt RCS
          as fast as we believed.
        </p>
        <p>
          I&apos;d also have built a theming layer on day one, so the design exploration was contained instead
          of noticed. The self-serve work I&apos;m doing now is partly both corrections, and I&apos;m glad to be
          the one building it.
        </p>
      </Hindsight>

      <NextCase slug="provisioning" />
    </div>
  );
}
