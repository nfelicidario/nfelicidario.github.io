import type { Metadata } from "next";
import { Artifact, Beat, CaseHero, Hindsight, NextCase, Outcome, Tldr } from "@/components/case/CaseLayout";
import { IssueHierarchy, PlanningFlow } from "@/components/work/making-the-team-faster/PlanningFlow";
import { Adoption } from "@/components/work/making-the-team-faster/Adoption";
import { Pipeline } from "@/components/work/making-the-team-faster/Pipeline";
import { BranchAsSpec } from "@/components/work/making-the-team-faster/BranchAsSpec";
import { Formats, SystemMerge } from "@/components/work/making-the-team-faster/Formats";

export const metadata: Metadata = { title: "Making the team faster" };

export default function MakingTheTeamFaster() {
  return (
    <div className="container-x">
      <CaseHero
        kicker="Vibes · Aug 2025 to present"
        title="Making the team faster"
        lede="Not a product story. A story about changing how an organization plans, builds, and communicates, one team at a time, with no mandate to do any of it."
        meta={[
          { label: "Role", value: "Product designer. No title for this; it spread because it worked." },
          { label: "Scope", value: "My team first, then product and technology, then the company" },
          { label: "Timeline", value: "Aug 2025 to present" },
          { label: "Tools", value: "Linear, GitLab CI, Claude Code, Claude Design, Figma" },
        ]}
        artifact={
          <Artifact label="The six-stage project flow" pill="Interactive · mock projects">
            <PlanningFlow />
          </Artifact>
        }
      />

      <Tldr
        items={[
          "Set the planning flow my team used as the first team on Linear. About half the product and technology organization now runs on it.",
          "Replaced Figma handoff on my team with prototypes in code, deployed to shared environments. Two of the product's largest changes shipped from my branch.",
          "My roadmap and sprint review formats are used from individual contributor updates to board meetings. The next version is a company design system in Claude Design, built in a week.",
          "Every piece here spread the same way: it worked on one team first, and other teams asked for it.",
        ]}
      />

      <Beat
        chapter="Act 1 · Plan"
        title="The guinea pigs"
        artifact={
          <Artifact label="How work relates" pill="Mock data">
            <IssueHierarchy />
          </Artifact>
        }
      >
        <p>
          When the engineering manager moved my team onto Linear, we were the first team at Vibes to leave
          Jira, the tool we had used before. I took the workflow: how initiatives, projects, and issues relate,
          and what a project&apos;s stages should be.
        </p>
        <p>
          We landed on six. Open and Planned belong to product, Shaping belongs to the engineering pod with
          product in the room, and nothing enters In Progress until there is shared understanding and the
          issues to show for it.
        </p>
      </Beat>

      <Beat
        chapter="Act 1 · Plan"
        title="It spread"
        reverse
        artifact={
          <Artifact label="Adoption of the flow" pill="Abstract · not to scale">
            <Adoption />
          </Artifact>
        }
      >
        <p>
          The flow worked because it made the handoff between product thinking and engineering shaping explicit
          instead of implied. A second team migrated onto it whole, and about half of product and technology
          now runs the same way, with the rest moving.
        </p>
        <p>
          I am now working with the head of product and the head of design on the product team&apos;s own
          Linear space, so planning happens in one place and projects flow to the teams that build them.
        </p>
      </Beat>

      <Beat
        chapter="Act 2 · Build"
        title="The handoff that stopped happening"
        artifact={
          <Artifact label="The CI step" pill="Diagram">
            <Pipeline />
          </Artifact>
        }
      >
        <p>
          Handoff is where design intent dies. On my team we replaced it with a CI step: open a merge request,
          trigger a deploy that does not merge, and a working version is live in a shared environment for anyone
          to click through.
        </p>
        <p>Ten environments, split evenly between the engineers and me.</p>
      </Beat>

      <Beat
        chapter="Act 2 · Build"
        title="Branch as spec"
        reverse
        artifact={
          <Artifact label="Prototype branch vs. shipped" pill="Interactive · abstract tiles">
            <BranchAsSpec />
          </Artifact>
        }
      >
        <p>
          Two of the product&apos;s largest changes went through it. I prototyped each one in code with mock
          data, the engineers pointed their Claude Code sessions at my branch, and what shipped is visually
          identical with the real data model behind it.
        </p>
        <p>
          The branch is the spec. There is no design doc to keep in sync, and the questions that used to
          surface in design QA get answered while the prototype is still mine.
        </p>
      </Beat>

      <Beat
        chapter="Act 3 · Communicate"
        title="The formats that went everywhere"
        artifact={
          <Artifact label="Templates" pill="Mock content">
            <Formats />
          </Artifact>
        }
      >
        <p>
          Early on I built a roadmap format and a sprint review format for my team. They were adopted outward:
          the product team uses the roadmap with their teams and with executives, the sprint review format runs
          across product and technology, and a variant of it is how senior leadership reports across itself.
        </p>
        <p>
          The same formats now appear in individual contributor updates and in board meetings. I taught the
          product team to use them.
        </p>
      </Beat>

      <Beat
        chapter="Act 3 · Communicate"
        title="One system, in Claude Design"
        reverse
        artifact={
          <Artifact label="Two sources, one system" pill="In progress">
            <SystemMerge />
          </Artifact>
        }
      >
        <p>
          The company&apos;s design language lived in two places that did not talk: a product design system
          scattered across Figma and component code, and a marketing identity scattered across old decks, both
          of them tribal knowledge.
        </p>
        <p>
          I combined them into one system in Claude Design in a week: product&apos;s concise, UX-first language
          with marketing&apos;s visual identity, drawing on previous All Hands decks and feedback from marketing
          and design. The first template is the All Hands deck, for an upcoming All Hands; sales, business
          review, and marketing templates are next, with workshops and videos to go with them.
        </p>
      </Beat>

      <Outcome
        stats={[
          { value: "About half", label: "of product and technology on the planning flow" },
          { value: "10", label: "shared prototyping environments" },
          { value: "2", label: "of the product's largest changes shipped from the prototype branch" },
          { value: "1 week", label: "to build the company design system in Claude Design" },
        ]}
      >
        <p>
          The roadmap and sprint review formats are used from individual contributor updates to board meetings.
          None of this came with a mandate. Each piece was adopted because it worked on one team and the next
          team asked for it.
        </p>
      </Outcome>

      <Hindsight>
        <p>
          What has not moved yet: the rest of the design team. The engineers were on board immediately, but Git
          and draft merge requests are new to the rest of the design team, and their work still goes through
          Figma handoff. I have set up their local environments. The next step is showing them how I build a
          feature, which is the harder part, and it is mine to do.
        </p>
        <p>
          Enthusiasm at the top does not make a tool usable for the people doing the work. Every adoption here
          happened because the thing worked on one team first and other teams asked for it. The part I am still
          working on is the hardest: bringing the rest of my own discipline with me.
        </p>
      </Hindsight>

      <NextCase slug="stride" />
    </div>
  );
}
