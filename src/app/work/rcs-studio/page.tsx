import type { Metadata } from "next";
import { Artifact, CaseHero, NextCase } from "@/components/case/CaseLayout";
import { Banner, Beats, Bullets, SixtySeconds, Span, StoryBeat, StoryLink } from "@/components/case/Story";
import { CircleAlert } from "lucide-react";
import { RcsIntro } from "@/components/work/rcs-studio/Intro";
import { Proof } from "@/components/work/rcs-studio/Proof";
import { BetsTimeline, TheBet } from "@/components/work/rcs-studio/TheBet";
import { RcsStudioStage } from "@/components/work/rcs-studio/hero/RcsStudioStage";
import { SignalSources } from "@/components/work/rcs-studio/SignalSources";
import { AgentTracking } from "@/components/work/rcs-studio/AgentTracking";
import { ApiAccess } from "@/components/work/rcs-studio/ApiAccess";
import { AuditToForm } from "@/components/work/rcs-studio/AuditToForm";
import { TheSolution } from "@/components/work/rcs-studio/TheSolution";
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
        lede="RCS Studio launched as a tool for building RCS message flows. But a customer can't send anything until their agent is provisioned, and that part had been an afterthought. I repositioned the product around getting an agent live, and it became the way every Vibes customer gets one."
        meta={meta}
        intro={<RcsIntro meta={meta} />}
        stage={<RcsStudioStage />}
      />

      <SixtySeconds
        lede="RCS Studio starts as a flow builder, giving users the ability to create app-like experiences from RCS features and data connections, delivered inside their native messaging app."
        problem={[
          <>Users can&apos;t send flows to customers without a live RCS agent</>,
          <>Provisioning, getting an RCS agent live, is complex, manual, and doesn&apos;t scale</>,
          "It cost deals and kept us out of the conversation for larger ones",
        ]}
        work={[
          "Owned requirements, roadmap, and design",
          "Repositioned the product around provisioning",
          "Prototyped the new provisioning experience to win over the skeptics",
          {
            text: "Delivered provisioning for customers in three tasks:",
            sub: [
              "Audited the process, then replaced a bare form with a guided one",
              "Agent tracking: a launch timeline and brand, agent, and campaign statuses",
              "APIs and self-serve credentials for provisioning and messaging",
            ],
          },
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
          title="Vibes goes all in on RCS"
          subtitle="The bets"
          layout="stack"
          align="left"
          visualFirst
          visual={<TheBet />}
          after={<BetsTimeline />}
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
          title="A demo that couldn't send"
          subtitle="The problem"
          layout="stack"
          align="left"
          visualFirst
          visual={
            <Banner icon={<CircleAlert size={17} />} label="The problem">
              Users can&apos;t send anything to customers until their RCS agent is provisioned.
            </Banner>
          }
          after={<SignalSources />}
        >
          <Bullets
            items={[
              "Without a live RCS agent, RCS Studio is essentially an in-depth demo",
              "Technical builders were not the ones buying",
              <>Prospects&apos; first question after the demo: &ldquo;Cool demo, now how do I send to customers?&rdquo;</>,
              <>Our answer was complex, manual, and didn&apos;t scale, so it cost deals and kept us out of the conversation for larger ones</>,
              "Provisioning was the unlock: once a customer could get an agent live on their own, the demo became a product and the flow builder became step two",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="the-solution"
          title="Provisioning for customers"
          subtitle="The solution"
          layout="stack"
          align="left"
          visualFirst
          visual={<TheSolution />}
        >
          <Bullets
            items={[
              "Not everyone agreed that provisioning should lead, so instead of arguing I built a prototype of the provisioning flow",
              "I put it in front of the operations team, the people provisioning by hand, and their reaction won over the skeptics",
              "The reframe that stuck: a flow builder competes with one feature of the incumbents, while a provisioning platform competes with the incumbents",
              "Provisioning became step one for everyone: customers get an agent live on their own, and the operations team gets one place to see submissions instead of email threads",
              "Three tasks followed: an audit that led to a guided form, agent tracking, and APIs with self-serve credentials",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="task-audit"
          title="From a bare form to a guided one"
          subtitle="Task 1 · Audit"
          layout="stack"
          align="left"
          visualFirst
          visual={<AuditToForm />}
        >
          <Bullets
            items={[
              "I audited how a customer actually got an agent live: a bare form with no validation and no guidance, instructions in supporting Word documents, and corrections over email threads",
              "The audit set the next step: a guided form with step-by-step instructions and validation guardrails, so submissions come in right the first time",
              "Each field explains what the third-party partners will check, so the customer fixes problems before review instead of after",
              <>
                Behind it, a read layer over submissions for the operations team, who had no tooling at all. Automating their side is{" "}
                <StoryLink href="/work/provisioning/">the next case study</StoryLink>
              </>,
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="task-tracking"
          title="Know where your agent is"
          subtitle="Task 2 · Tracking"
          layout="stack"
          align="left"
          visualFirst
          visual={<AgentTracking />}
        >
          <Bullets
            items={[
              "Before, the only way to know where an agent stood was to ask, and every status update was an email",
              "A launch progression timeline shows the whole path from submission to live, and where the agent is on it today",
              "Brand, agent, and campaign each carry their own status, because each is reviewed separately by the third-party partners",
              "Every status says what happens next and who is holding it, so customers stop asking and the operations team stops answering",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="task-apis"
          title="Provision and send by API"
          subtitle="Task 3 · APIs"
          layout="stack"
          align="left"
          visualFirst
          visual={<ApiAccess />}
        >
          <Bullets
            items={[
              "Technical developers wanted to provision and send without touching the UI",
              "A self-serve credential experience: create, label, and rotate keys for Test or Live, with no ticket to anyone",
              "A provisioning API that mirrors the form, so a brand, agent, and campaign can be registered and tracked from code",
              "A messaging API that unlocks once the agent is live, which is also where the flow builder lives on, as step two",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="what-it-proved"
          title="What it proved"
          subtitle="The proof"
          layout="stack"
          align="left"
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

        <StoryBeat id="the-outcome" title="Self-serve is now the direction" subtitle="The outcome" layout="stack" align="left">
          <Bullets
            items={[
              "RCS Studio is now the portal for every RCS agent Vibes provisions",
              "It proved that customers would sign up and get an agent running on their own, something the company had never seen",
              <>That changed the company&apos;s direction, and I&apos;m now working with the head of product on a company-wide self-serve entry point</>,
            ]}
          />
        </StoryBeat>

        <StoryBeat id="hindsight" title={"What I'd do differently"} subtitle="With hindsight" layout="stack" align="left">
          <Bullets
            items={[
              <>Build RCS Studio as a surface of Vibes&apos; existing products, not a standalone brand on its own domain</>,
              "The early vision tried to be too much, and the industry was never going to adopt RCS as fast as we believed",
              "Build a theming layer on day one, so the design exploration was contained instead of noticed",
              <>The self-serve work I&apos;m doing now is partly both corrections, and I&apos;m glad to be the one building it</>,
            ]}
          />
        </StoryBeat>
      </Beats>

      <NextCase slug="provisioning" />
    </div>
  );
}
