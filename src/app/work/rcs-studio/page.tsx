import type { Metadata } from "next";
import { Artifact, CaseHero, Hindsight, NextCase, Outcome } from "@/components/case/CaseLayout";
import { Beats, SixtySeconds, Span, StoryBeat, StoryLink } from "@/components/case/Story";
import { BadgeCheck, Blocks } from "lucide-react";
import { RcsIntro } from "@/components/work/rcs-studio/Intro";
import { LookShift } from "@/components/work/rcs-studio/LookShift";
import { Proof } from "@/components/work/rcs-studio/Proof";
import { PrototypeToReframe } from "@/components/work/rcs-studio/PrototypeToReframe";
import { TheBet } from "@/components/work/rcs-studio/TheBet";
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
            text: "Getting a business sender, such as an RCS agent, registered, verified, and approved by the appropriate third parties.",
          },
          {
            icon: <Blocks size={15} />,
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
          { value: "500+", label: "RCS agents provisioned through RCS Studio" },
          { value: "1–3 wks", label: "to provision, compared to several months for competitors" },
          { value: "1st", label: "public sign-up at Vibes" },
          { value: "1st", label: "self-serve product at Vibes" },
          { value: "1st", label: "new Vibes product in roughly a decade" },
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
          id="the-bet"
          title="The bet"
          layout="stack"
          visualFirst
          visual={
            <Artifact label="The founding bet" pill="Three assumptions">
              <TheBet />
            </Artifact>
          }
          deeper={
            <>
              <p>
                RCS is the successor to SMS: branded senders, rich cards, carousels, suggested replies. The bet was that an industry shift to RCS was coming on its own, every brand would soon have an agent, and all of them would need a builder to use its rich features. So a hackathon project became RCS Studio, a self-serve platform where any developer could sign up and build RCS message flows.
              </p>
              <p>
                For a company that had sold B2B through a sales team for twenty years, this was a lot of firsts. I joined in August 2025 to take over daily ownership from the head of design, and was running it independently by my third month.
              </p>
            </>
          }
        >
          <p>
            Vibes had sold B2B through a sales team for twenty years. The bet was that brands would move to RCS on their own and every new agent would need a builder for its rich features. So a hackathon project became RCS Studio, the company&apos;s first self-serve product. I joined in August 2025 as its product designer and acting product manager.
          </p>
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
          deeper={
            <>
              <p>
                There was no single moment. The signal built up across early customer interviews, a lot of sales calls, usage data from early customers and self-serve users, and the competitive analysis I ran once the pattern was clear. A few technical builders did arrive wanting to build flows. They were rarely the people choosing whether their company adopted RCS.
              </p>
              <p>
                The people choosing wanted to understand RCS first: what it was, what it could do that SMS couldn&apos;t, and how to get started. Getting started meant provisioning, a brand and agent registered and approved by third-party partners over weeks of email. RCS was so new that the plumbing had to come first. We had built the second step of the product and skipped the first.
              </p>
            </>
          }
        >
          <p>
            A few people did want to build flows, but they weren&apos;t the ones deciding. The people who signed off asked &ldquo;What is RCS?&rdquo;, &ldquo;Why is it better than SMS?&rdquo;, and &ldquo;How do we get started?&rdquo; Getting started meant provisioning: weeks of email with third-party partners, handled by hand. We had built the second step and skipped the first.
          </p>
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
          deeper={
            <>
              <p>
                Once provisioning was the real first step, the product had two customers, not one. Marketing operations people who needed an agent provisioned for a campaign and had never written code, and the technical builders we had designed for, who wanted the flow builder once an agent existed. Right before beta I split the product around those two.
              </p>
              <p>
                Behind both of them was a third group: our own operations team, doing the provisioning work by hand. Designing for them became its own project, told in{" "}
                <StoryLink href="/work/provisioning/">the next case study</StoryLink>.
              </p>
            </>
          }
        >
          <p>
            With provisioning first, the product had two customers. Marketing operations people needed an agent for a campaign and had never written code. Technical builders wanted the flow builder once an agent existed. Right before beta, I split the product around them. Behind both sat our operations team, doing the work by hand. Their tooling is{" "}
            <StoryLink href="/work/provisioning/">the next case study</StoryLink>.
          </p>
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
          deeper={
            <>
              <p>
                Not everyone agreed that provisioning should come first. The product had launched as a flow builder, and a provisioning platform was a different product with a different first screen.
              </p>
              <p>
                I didn&apos;t argue it. I built a prototype of the new flow and brought it to the operations team, the people doing provisioning by hand, and their reaction won over the skeptics. The reframe that stuck was this: a flow builder competes with one feature of the incumbents, and a provisioning platform competes with the incumbents.
              </p>
            </>
          }
        >
          <p>
            Not everyone agreed that provisioning should lead. Instead of arguing, I built a prototype of the provisioning flow and put it in front of our operations team. Their reaction won over the skeptics. The reframe was simple. A flow builder competes with one feature of the incumbents. A provisioning platform competes with the incumbents.
          </p>
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
          deeper={
            <>
              <p>
                The builder stayed, but as the second step. Most beta users didn&apos;t use the original state builder correctly or at all, and someone who had just gotten an agent through provisioning shouldn&apos;t hit the hardest part of the product next.
              </p>
              <p>
                I cut optionality from the default path and moved advanced capability behind progressive disclosure, so three steps got people to a working flow. Today the builder is mostly a demo engine, with a handful of power users.
              </p>
            </>
          }
        >
          <p>
            The builder stayed as the second step, and a second step can&apos;t be the hardest part of the product. Most beta users didn&apos;t use the original state builder correctly or at all. I cut optionality from the default path and moved advanced capability behind progressive disclosure, so three steps got people to a working flow.
          </p>
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
          deeper={
            <>
              <p>
                The inherited design system was built for a marketing product: large type, generous spacing, and a primary color plus several secondary colors used freely. RCS Studio walks people through provisioning one step at a time, so I went to a smaller scale and tighter spacing, and reserved color for the next step.
              </p>
              <p>
                The drift got noticed. I reviewed each change with the head of design and fed what landed back into the shared system. Customers and sales called the result elegant and modern, and it is now the direction for the company&apos;s next-generation products.
              </p>
            </>
          }
        >
          <p>
            The inherited design system was built for a marketing product: large type, generous spacing, and color used freely. I went smaller and tighter, and reserved color for the next step. The drift got noticed, so I reviewed each change with the head of design and fed it back. It is now the direction for the company&apos;s next-generation products.
          </p>
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
          deeper={
            <>
              <p>
                Anyone could sign up and spin up an agent in Test Mode, and launching it meant a conversation with sales. Some customers did exactly that. Others got an agent into Test Mode and never booked the call, which showed where the self-serve path still leaked.
              </p>
              <p>
                My own work changed shape along the way. For the first seven months I worked from a Figma design doc for nearly every change, broken into epics and stories, with a roadmap the product organization still uses for executive reviews. From March 2026 I shipped production TypeScript alongside the engineers: sign-up, sign-in, and the customer-facing provisioning flows.
              </p>
            </>
          }
        >
          <p>
            Anyone could sign up and get an agent into Test Mode on their own. Launching meant a conversation with sales. Some booked it. Some got to Test Mode and never did, which showed where self-serve still leaked. It is the company&apos;s first proof that customers will sign up and get started on their own.
          </p>
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
