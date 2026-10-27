import type { Metadata } from "next";
import { VibesLogo } from "@/components/VibesLogo";
import { CaseHero, MetaBand, NextCase } from "@/components/case/CaseLayout";
import { Banner, Beats, Bullets, SixtySeconds, Span, StoryBeat, StoryLink } from "@/components/case/Story";
import { BookOpen, CircleAlert, FileOutput, ListChecks, UserCog } from "lucide-react";
import { Gate } from "@/components/Gate";
import blob from "@/content/gated/provisioning.json";
import { VibesAdminStage } from "@/components/work/provisioning/hero/VibesAdminStage";
import { Generalizes } from "@/components/work/provisioning/Generalizes";
import { RequestsVsSubmissions } from "@/components/work/provisioning/RequestsVsSubmissions";
import { OpsToday } from "@/components/work/provisioning/slides/OpsToday";
import { Pillars, ThreeFeatureSets } from "@/components/work/provisioning/slides/Pillars";
import { AuditMap } from "@/components/work/provisioning/slides/AuditMap";
import { AccountManagement } from "@/components/work/provisioning/slides/AccountManagement";
import { CaptureToBrief } from "@/components/work/provisioning/slides/CaptureToBrief";
import { SubmissionsSearch } from "@/components/work/provisioning/slides/SubmissionsSearch";
import { AdminOutcomes } from "@/components/work/provisioning/slides/AdminOutcomes";
import { FutureFeatures } from "@/components/work/provisioning/slides/FutureFeatures";

export const metadata: Metadata = {
  title: "Vibes Admin",
  description:
    "Provisioning at Vibes ran on ten portals and an inbox. I shadowed operations, then designed and shipped the customer intake and the internal admin that replaced it.",
};

const TIMELINE = [
  { at: "Late 2025", what: "Shadowing" },
  { at: "Early 2026", what: "Accounts" },
  { at: "2026", what: "Shipping" },
];

const meta = [
  {
    label: "Role",
    value: (
      <ul className="grid gap-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Product designer</li>
        <li>Builder, in production code</li>
      </ul>
    ),
  },
  {
    label: "Team",
    value: (
      <ul className="grid gap-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Operations team, my closest partner</li>
        <li>Engineering manager</li>
        <li>Three engineers</li>
      </ul>
    ),
  },
  { label: "Timeline", value: <Span points={TIMELINE} direction="vertical" /> },
  {
    label: "Stack",
    value: (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 pl-4 marker:text-rule" style={{ listStyle: "disc" }}>
        <li>Figma</li>
        <li>React</li>
        <li>TypeScript</li>
        <li>Claude Code</li>
        <li>Linear</li>
        <li>GitLab</li>
      </ul>
    ),
  },
];

export default function ProvisioningPage() {
  return (
    <div className="container-x">
      <CaseHero
        kicker="Vibes · 2026"
        product="Vibes Admin"
        pov="Operations"
        brand={<VibesLogo className="h-full w-auto" />}
        title="The user nobody designed for"
        lede="Every RCS agent a customer created still had to be provisioned by hand across ten portals and an inbox. I made our operations team my closest partner, then designed and shipped the customer intake and the internal admin that replaced the inbox."
        meta={meta}
        intro={<MetaBand meta={meta} />}
        stage={<VibesAdminStage />}
      />

      <SixtySeconds
        lede={
          <>
            <strong>Vibes Admin</strong> is the internal tool our operations team uses to provision every sender a customer requests. It
            captures the request, cleans it, and turns it into the submissions each third-party partner needs
          </>
        }
        problem={[
          "Every RCS agent was provisioned by hand across ten portals and an inbox",
          "Ops copied customer emails into partner forms, chased missing fields, and tracked it all in a spreadsheet",
          "It couldn't scale, it wasted hours on every request, and it invited human error on both sides",
        ]}
        work={[
          "Shadowed and interviewed the operations team, then owned the design and shipped the provisioning pages in production code",
          {
            text: "Modernized the operational process, supported by three feature sets to start:",
            plain: true,
            sub: [
              <span key="accounts" className="inline-flex items-center gap-2"><UserCog size={14} className="text-accent" aria-hidden="true" />Account management</span>,
              <span key="brief" className="inline-flex items-center gap-2"><FileOutput size={14} className="text-accent" aria-hidden="true" />Capture to brief</span>,
              <span key="subs" className="inline-flex items-center gap-2"><ListChecks size={14} className="text-accent" aria-hidden="true" />Submissions and search</span>,
            ],
          },
        ]}
        result={[
          "Every agent Vibes provisions now comes in through the new flow, as structured data instead of an email",
          "About an hour cut from every agent's provisioning time",
          "The same shape now provisions toll-free, with 10DLC and Short Code next",
          "The split between customer requests and partner submissions became the company's standard",
        ]}
        stats={[
          { value: "10 → 6", label: "portals per request, with 1 as the target" },
          { value: "~1 hr", label: "cut from every RCS agent's provisioning time" },
          { value: "100%", label: "of agents provisioned through the new flow" },
          { value: "88%", label: "of provisioning accounts moved in within weeks" },
          { value: "4 → 7", label: "people on the operations team, as demand grew" },
        ]}
        takeawaysLabel="Changes to how I work"
        takeaways={[
          {
            lead: "Shadow before you sketch.",
            text: "The map had steps nobody had written down. I would not have found them in a requirements doc.",
          },
          {
            lead: "Collect it, then transform it.",
            text: "Structured input is the foundation. Once a request is data, every automation after it becomes possible.",
          },
          {
            lead: "The branch is the spec.",
            text: "I prototype in the codebase, and the engineers point their sessions at my branch. Output matches the prototype, with real data behind it.",
          },
        ]}
      />

      <Beats>
        <StoryBeat
          id="the-problem"
          title="Every agent, by hand"
          subtitle="The problem"
          layout="stack"
          align="left"
          visualFirst
          visual={
            <Banner icon={<BookOpen size={17} />} label="Provisioning">
              Getting a sender live: registering the brand, the sender, and its first campaign with the third-party partners who approve them.
              For RCS the sender is an agent; for SMS it is a toll-free number, a 10DLC number, or a short code.
            </Banner>
          }
          after={
            <div className="grid gap-5">
              <OpsToday />
              <Banner icon={<CircleAlert size={17} />} label="The problem">
                It can&apos;t scale, it wastes hours on every request, and it&apos;s prone to human error, on the customer&apos;s side and on ours.
              </Banner>
            </div>
          }
        >
          <Bullets
            items={[
              "RCS Studio gave customers a product, but every agent they created still had to be provisioned by our operations team",
              "Ops copied each request into a registry console, a verification vendor's inbox, and each carrier's portal or email template",
              "Every missing field was chased over email, and every request was tracked by hand in a spreadsheet",
              "The customer saw a button, an email thread, and a wait with no status",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="the-solution"
          title="Modernize the operational process"
          subtitle="The solution"
          layout="stack"
          align="left"
          visualFirst
          visual={<Pillars />}
          after={<ThreeFeatureSets />}
        >
          <Bullets
            items={[
              "Not everyone agreed. The view at the top, held loosely, was that an ever-changing ops process shouldn't be turned into software",
              {
                text: "My stance: the process was a disaster, the tribal knowledge had to come out, and modernizing it was the only way to scale and chase larger business",
                sub: ["I built out the admin page idea with the engineering manager, the vision became visible, and the argument ended"],
              },
              "Due to the nature of the industry, the steps with third-party partners stay manual for now, so the plan modernizes everything around them",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="the-audit"
          title="I ran the process until I could draw it"
          subtitle="The audit"
          layout="stack"
          align="left"
          visualFirst
          visual={<AuditMap />}
        >
          <Bullets
            items={[
              "Operations became my closest partner: I shadowed requests end to end, interviewed the team, and ran the flow in a test environment with mock data",
              "The map had steps nobody had written down, and a wait of about a week on verification in the middle of it",
              "The finding that set the scope: because the partner steps stay manual, validating, cleaning, and guiding customer input is itself a huge improvement",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="feature-accounts"
          title="Account management"
          note="Accounts, users, and a way in"
          icon={<UserCog size={20} />}
          subtitle="Feature set"
          railTitle="Account management"
          layout="stack"
          align="left"
          visualFirst
          visual={<AccountManagement />}
        >
          <Bullets
            items={[
              "Ops needed to create and edit customer accounts without an engineer, and to add users to them",
              "I designed the accounts page in Figma, early 2026, before the team worked in code",
              "Adding a user runs through a makeshift impersonation: ops signs in as the account to set it up, until a real invite flow ships",
              "It is a high-level view today, on purpose, because the provisioning pages carried the urgency",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="feature-brief"
          title="Capture to brief"
          note="Input, edits, and a PDF brief"
          icon={<FileOutput size={20} />}
          subtitle="Feature set"
          railTitle="Capture to brief"
          layout="stack"
          align="left"
          visualFirst
          visual={<CaptureToBrief />}
        >
          <Bullets
            items={[
              "I designed the capture: every customer field, from the guided form or the API, lands in one structured record instead of an email",
              "Ops can edit the record in place, so a correction is a field change, not another thread",
              "The record transforms into a PDF brief, the document compliance review and the partners actually need",
              "I shipped the provisioning pages and the details page in production code",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="feature-submissions"
          title="Submissions and search"
          note="One request, several submissions"
          icon={<ListChecks size={20} />}
          subtitle="Feature set"
          railTitle="Submissions and search"
          layout="stack"
          align="left"
          visualFirst
          visual={<RequestsVsSubmissions />}
          after={<SubmissionsSearch />}
        >
          <Bullets
            items={[
              "One customer request becomes several partner submissions, each with its own template and a few fields of its own",
              "I prototyped the submissions page in code, and my branch was what the engineers pointed their sessions at",
              "Templates prefill each partner's form from the main submission, so ops adds only what is missing instead of copying and pasting",
              "Advanced search finds any request or submission by customer, sender type, partner, or status",
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="inside-the-admin"
          title="Inside the admin"
          subtitle="The prototype"
          layout="stack"
          align="left"
          visual={<Gate blob={blob} title="Provisioning admin, recreated with mock data" />}
        >
          <Bullets items={["The admin, recreated with mock data. It is behind a passphrase, since it shows internal workflows."]} />
        </StoryBeat>

        <StoryBeat
          id="the-outcome"
          title="Operations time is going down"
          subtitle="The outcome"
          layout="stack"
          align="left"
          visualFirst
          visual={<AdminOutcomes />}
        >
          <Bullets
            items={[
              "Every agent Vibes provisions now comes in through the new flow, as structured data",
              "The operations team grew from four to seven on this work as demand grew, without the process breaking",
              "Customers see statuses instead of an email thread",
              <>
                The customer side of this story is the <StoryLink href="/work/rcs-studio/">RCS Studio</StoryLink> case study
              </>,
            ]}
          />
        </StoryBeat>

        <StoryBeat
          id="whats-next"
          title={"What's next"}
          subtitle="Still going"
          railTitle="What's next"
          layout="stack"
          align="left"
          visualFirst
          visual={<FutureFeatures />}
          after={
            <div>
              <div className="label mb-3">Every sender type, one shape</div>
              <Generalizes />
            </div>
          }
        >
          <Bullets
            items={[
              "Toll-free is in alpha on the same shape, with 10DLC and Short Code next",
              "Every sender type becomes brand, campaign, and sender-specific details, so each new one ships faster than the last",
              "Advanced templates, triage support, and provisioning requests are the next three feature sets",
            ]}
          />
        </StoryBeat>

        <StoryBeat id="hindsight" title={"What I'd do differently"} subtitle="With hindsight" layout="stack" align="left">
          <Bullets
            items={[
              "Separate customer requests from third-party submissions on day one. It is the abstraction the whole process hangs on, and it took months to see",
              "Finding it earlier would have saved the operations team real time, and it turned out to be a gap across the company, not just this product",
              "Abstract and standardize from the beginning, so each sender type is a variation instead of a new process",
            ]}
          />
        </StoryBeat>
      </Beats>

      <NextCase slug="making-the-team-faster" />
    </div>
  );
}
