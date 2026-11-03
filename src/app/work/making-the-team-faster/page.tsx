import type { Metadata } from "next";
import { VibesLogo } from "@/components/VibesLogo";
import { CaseHero, MetaBand, NextCase } from "@/components/case/CaseLayout";
import { Banner, Beats, Bullets, SixtySeconds, StoryBeat, StoryLink } from "@/components/case/Story";
import { Building2, CircleAlert, GitPullRequestArrow, Lightbulb, Network, Users } from "lucide-react";
import { TeamFasterStage } from "@/components/work/making-the-team-faster/hero/TeamFasterStage";
import { IssueHierarchy, PlanningFlow } from "@/components/work/making-the-team-faster/PlanningFlow";
import { Pipeline } from "@/components/work/making-the-team-faster/Pipeline";
import { BranchAsSpec } from "@/components/work/making-the-team-faster/BranchAsSpec";
import { Formats, SystemMerge } from "@/components/work/making-the-team-faster/Formats";
import { ReCreated } from "@/components/work/making-the-team-faster/slides/ReCreated";
import { ThreeLevels, ThreeParts } from "@/components/work/making-the-team-faster/slides/ThreeLevels";
import { Handoff } from "@/components/work/making-the-team-faster/slides/Handoff";
import { Walkthrough } from "@/components/work/making-the-team-faster/slides/Walkthrough";
import { AiReadable } from "@/components/work/making-the-team-faster/slides/AiReadable";
import { DeckPlaybook } from "@/components/work/making-the-team-faster/slides/DeckPlaybook";
import { ExpectedOutcomes } from "@/components/work/making-the-team-faster/slides/ExpectedOutcomes";

export const metadata: Metadata = {
  title: "AI modernization",
  description:
    "Vibes needed people to show what working with AI looks like. I rebuilt how product design works around AI, then carried the same model across product and technology and the whole company.",
};

const meta = [
  {
    label: "Role",
    value: (
      <ul className="grid gap-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Product designer</li>
        <li>Led the change for product design</li>
      </ul>
    ),
  },
  {
    label: "Team",
    value: (
      <ul className="grid gap-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Engineering manager</li>
        <li>My design and development team</li>
        <li>Product and technology leads</li>
        <li>Marketing, for the brand</li>
      </ul>
    ),
  },
  { label: "Timeline", value: "Aug 2025 – Present" },
  {
    label: "Stack",
    value: (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Claude Code</li>
        <li>Claude Design</li>
        <li>Linear</li>
        <li>GitLab CI/CD</li>
        <li>Figma</li>
        <li>React</li>
      </ul>
    ),
  },
];

export default function MakingTheTeamFaster() {
  return (
    <div className="container-x">
      <CaseHero
        kicker="Vibes · 2025–26"
        product="AI modernization"
        pov="The whole company"
        brand={<VibesLogo className="h-full w-auto" />}
        title="Show what working with AI looks like"
        lede="As Vibes adopted AI, it needed people to show what working with AI actually looks like, not just to have access to the tools. I led that change for product design and carried it outward at three levels."
        meta={meta}
        intro={<MetaBand meta={meta} />}
        stage={<TeamFasterStage />}
      />

      <SixtySeconds
        lede={
          <>
            <strong>AI modernization</strong> at Vibes: as the company adopted AI, it needed people to show what working with AI actually
            looks like. I rebuilt how product design works around AI, then carried the same model across product and technology and the
            whole company
          </>
        }
        problem={[
          "Product design, and the workflows around it, were built for a pre-AI way of working: static files engineering rebuilt by hand, work tracked differently from team to team, decks formatted slide by slide",
          "Each step re-created work instead of building on it, which slowed delivery and lost detail along the way",
          "It left AI with nothing consistent to work from. The tools had changed; the way we worked hadn't",
        ]}
        work={[
          "Changed product design so its output is working software: merge requests, a prototype environment per branch, and the prototype as the reference",
          "Moved product and technology onto one shared tracker that people and AI agents both use, and personally moved the product team",
          {
            text: "Carried the same principle outward at three levels:",
            plain: true,
            sub: [
              <span key="team" className="inline-flex items-center gap-2"><Users size={14} className="text-accent" aria-hidden="true" />My design and development team</span>,
              <span key="org" className="inline-flex items-center gap-2"><Network size={14} className="text-accent" aria-hidden="true" />Product and technology</span>,
              <span key="company" className="inline-flex items-center gap-2"><Building2 size={14} className="text-accent" aria-hidden="true" />Company-wide</span>,
            ],
          },
        ]}
        result={[
          "A modern product design function: design ships working software, so handoffs are fewer and closer to the real product",
          "Change at three levels, which shows the approach scales beyond one team's habits",
          "A repeatable playbook for AI adoption: audit, separate process from tooling, prove it publicly, then scale",
          "Product design positioned as a driver of the company's AI adoption, not just a user of it",
        ]}
        stats={[
          { value: "3", label: "levels of change: one team, product and technology, the company" },
          { value: "~½", label: "of product and technology planning on the one tracker" },
          { value: "2", label: "of the product's largest changes shipped from a prototype branch" },
          { value: "1 wk", label: "to build the company's deck design system" },
        ]}
        takeawaysLabel="Changes to how I work"
        takeaways={[
          {
            lead: "Prove it in public.",
            text: "A high-stakes example everyone sees, the All Hands deck, does more than any pitch. Inside the team, a prototype developers can click through did the same.",
          },
          {
            lead: "Separate process from tooling.",
            text: "Most of what looked like a process problem just needed a better template or a shared environment. Sorting the two first gets the most output from the fewest edits.",
          },
          {
            lead: "Measure the before, earlier.",
            text: "Moving people between tools and habits is change management, and the gains are easier to show when the starting point was captured.",
          },
        ]}
      />

      <Beats>
        <StoryBeat
          id="the-problem"
          title="Built for a pre-AI way of working"
          subtitle="The problem"
          layout="stack"
          align="left"
          visualFirst
          visual={<ReCreated />}
          after={
            <Banner icon={<CircleAlert size={17} />} label="The problem">
              Each step re-created work instead of building on it. It slowed delivery, lost detail along the way, and left AI with nothing
              consistent to work from. The tools had changed; the way we worked hadn&apos;t.
            </Banner>
          }
        >
          <Bullets
            items={[
              "Design lived in static files that engineering had to rebuild by hand",
              "Work was tracked differently from team to team",
              "Company presentations were formatted slide by slide",
              "Companies are trying to work out how to modernize their design functions for the AI era. At Vibes, that change needed someone to start it",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="the-solution"
          title="One shared source, at three levels"
          subtitle="The solution"
          layout="stack"
          align="left"
          visualFirst
          visual={<ThreeLevels />}
          after={
            <div className="grid gap-5">
              <Banner icon={<Lightbulb size={17} />} label="The principle">
                Give people and AI one shared source to build from, and stop re-creating work at every handoff.
              </Banner>
              <ThreeParts />
            </div>
          }
        >
          <Bullets
            items={[
              "Rebuild how product design works around AI, then extend that model across the company",
              "Within the design and development team, design delivers working code and live prototypes instead of static files",
              "Across product and technology, all work runs through one shared system that people and AI agents can both use",
              "Company-wide, a design system lets anyone produce on-brand presentations with AI",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="handoff"
          title="Hand off merge requests, not Figma files"
          note="Level 1: the design function"
          icon={<GitPullRequestArrow size={20} />}
          subtitle="Modernizing product design"
          railTitle="MRs, not Figma files"
          layout="stack"
          align="left"
          visualFirst
          visual={<Handoff />}
        >
          <Bullets
            items={[
              "The biggest change was to the design function itself. Traditionally, designers produce static mockups and engineers rebuild them",
              "I changed product design so that its output is working software: design is delivered as merge requests, not a file to interpret",
              "The rebuild step is gone. Developers pick up the MR and build on it, instead of recreating what they see in Figma",
              "Designers now work in the real medium, with real constraints, and the line between design and development is much thinner",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="environments"
          title="Every prototype gets its own URL"
          note="Prototype environments in CI/CD"
          subtitle="Modernizing product design"
          railTitle="Prototype environments"
          layout="stack"
          align="left"
          visualFirst
          visual={<Pipeline />}
        >
          <Bullets
            items={[
              "I pushed for prototype environments in the pipeline: open a merge request, trigger a deploy that does not merge, and the branch is live at a shareable URL",
              "Each prototype branch deploys to its own environment, so product, design, and engineering look at the same working thing",
              "A draft is enough. The branch can be mock data and placeholder copy, and it is still closer to the product than a picture of it",
              <>
                The provisioning pages in the <StoryLink href="/work/provisioning/">Vibes Admin</StoryLink> case study went through this flow, built directly
                from my branch
              </>,
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="reference"
          title="Kick off, walk through, then the prototype is the reference"
          note="The high-fidelity reference stays interactive"
          subtitle="Modernizing product design"
          railTitle="The prototype as the reference"
          layout="stack"
          align="left"
          visualFirst
          visual={<Walkthrough />}
          after={
            <div>
              <div className="label mb-3">Prototype branch next to what shipped</div>
              <BranchAsSpec />
            </div>
          }
        >
          <Bullets
            items={[
              "I lead with a kickoff and a video walkthrough. The walkthrough orients developers on the why and the flow",
              "Afterwards the walkthrough or the prototype URL serves as the ongoing reference. There is no design doc to keep in sync",
              "The prototype stays the high-fidelity reference: interactive, running on real constraints, the closest thing to the shipped experience, closer than any Figma file",
              "The engineers point their coding agents at my branch, and what ships is visually identical with the real data model behind it",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="one-tracker"
          title="One tracker for product and technology"
          note="Level 2: product and technology"
          icon={<Network size={20} />}
          subtitle="One tracker"
          railTitle="One tracker"
          layout="stack"
          align="left"
          visualFirst
          visual={<PlanningFlow />}
          after={
            <div>
              <div className="label mb-3">How work relates</div>
              <IssueHierarchy />
            </div>
          }
        >
          <Bullets
            items={[
              "My team was the first at Vibes to move onto Linear. I set the standard for how initiatives, projects, and issues relate, and the six stages a project moves through",
              "Open and Planned belong to product, Shaping belongs to the engineering pod with product in the room, and nothing enters In Progress until there is shared understanding and the issues to show for it",
              "I partnered with the engineering manager to extend it to the rest of product and technology, and the flow spread because it made the handoff between product thinking and engineering shaping explicit",
              "I personally moved the product team: set up the projects and workflows, moved the existing work over, and helped people get comfortable with it",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="ai-readable"
          title="Make work readable by AI"
          note="One place, one structure, so agents can help"
          subtitle="One tracker"
          railTitle="Readable by AI"
          layout="stack"
          align="left"
          visualFirst
          visual={<AiReadable />}
        >
          <Bullets
            items={[
              "With all work in one place and a consistent structure, agents can draft issues, summarize status, and connect work to code",
              "The same structure people plan in is the structure AI reads from, so nothing has to be rewritten for the agent",
              "Roadmaps and progress come straight from the tracker instead of meetings and spreadsheets",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="decks"
          title="Agentic slide decks"
          note="Level 3: the whole company"
          icon={<Building2 size={20} />}
          subtitle="Agentic slide decks"
          railTitle="Agentic slide decks"
          layout="stack"
          align="left"
          visualFirst
          visual={<DeckPlaybook />}
        >
          <Bullets
            items={[
              "I audited the current state: collected existing decks, listed the recurring problems, off-brand layouts and hours spent on formatting, and reviewed the tools and templates people already use",
              "With stakeholders, I separated process changes from operational changes: what needs a new way of working, and what just needs better templates",
              "Then I proved it in public: the company's quarterly All Hands deck, built with the design system, so the whole company saw the result on a real, high-stakes deck",
              "Next, the system extends to every other slide type, with the templates teams actually need",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="formats"
          title="The formats that went everywhere first"
          note="The roadmap and sprint review, before the system"
          subtitle="Agentic slide decks"
          railTitle="The formats"
          layout="stack"
          align="left"
          visualFirst
          visual={<Formats />}
          after={
            <div>
              <div className="label mb-3">Two sources, one system</div>
              <SystemMerge />
            </div>
          }
        >
          <Bullets
            items={[
              "Early on I built a roadmap format and a sprint review format for my team. They were adopted outward, from individual contributor updates to board meetings",
              "The company's design language lived in two places that did not talk: a product design system in Figma and code, and a marketing identity in old decks",
              "I combined them into one system in Claude Design: product's concise, UX-first language with marketing's visual identity",
              "The All Hands deck is the first template. Sales, business review, and marketing templates follow, with workshops and videos",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="the-outcome"
          title="What it changes"
          subtitle="Expected outcomes"
          layout="stack"
          align="left"
          visualFirst
          visual={<ExpectedOutcomes />}
        >
          <Bullets
            items={[
              "A modern product design function: design ships working software, so handoffs are fewer and closer to the real product. This is the operating model companies are actively trying to build",
              "Change at three levels, from one team to product and technology to the company, which shows it scales beyond a single team's habits",
              "A repeatable playbook for AI adoption: audit, separate process from tooling, prove it publicly, then scale. Other teams can follow it",
              "These projects are the reference examples for how Vibes works with AI, and position product design as a driver of the company's AI adoption, not just a user of it",
            ]}
          />
        </StoryBeat>

        <StoryBeat id="retro" title={"What I'd do differently"} subtitle="Retro" layout="stack" align="left">
          <Bullets
            items={[
              "What worked: leading with a public, high-stakes example, the All Hands deck, did more than any pitch could. Prototypes developers can click through did the same within the team",
              "What was hard: moving people between tools and habits is a change-management problem. The rest of the design team still works through Figma handoff; I have set up their environments, and showing them how I build a feature is the next step, and it is mine to do",
              "What I'd do differently: measure the before earlier, so the gains are easier to show",
              "What's next: spread the patterns to other teams, connect them, so a prototype branch creates and links its issues automatically, and write the playbook down",
            ]}
          />
        </StoryBeat>
      </Beats>

      <NextCase slug="stride" />
    </div>
  );
}
