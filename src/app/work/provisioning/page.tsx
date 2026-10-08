import type { Metadata } from "next";
import { VibesLogo } from "@/components/VibesLogo";
import { Artifact, Beat, CaseHero, Hindsight, NextCase, Outcome, Tldr } from "@/components/case/CaseLayout";
import { Gate } from "@/components/Gate";
import blob from "@/content/gated/provisioning.json";
import { VibesAdminStage } from "@/components/work/provisioning/hero/VibesAdminStage";
import { IntakeForm } from "@/components/work/provisioning/IntakeForm";
import { RequestsVsSubmissions } from "@/components/work/provisioning/RequestsVsSubmissions";
import { Generalizes } from "@/components/work/provisioning/Generalizes";

export const metadata: Metadata = {
  title: "The user nobody designed for",
  description:
    "Provisioning at Vibes ran on ten portals and an inbox. I shadowed operations, then designed and shipped the customer intake and the internal admin that replaced it.",
};

const processSteps: { step: string; written: boolean }[] = [
  { step: "Customer emails a request to the shared inbox", written: true },
  { step: "Register the brand and agent in the registry console", written: true },
  { step: "Resize the logo and banner to each console's limits", written: false },
  { step: "Email details to the verification vendor", written: true },
  { step: "Email campaign details to each carrier, one template each", written: false },
  { step: "Chase the customer for every missing field", written: false },
  { step: "Track every request by hand in a spreadsheet", written: false },
  { step: "Build the weekly status report for the customer", written: false },
];

const aiAssists = [
  { name: "Prefill from website URL", what: "Reads the customer's site and drafts brand and agent details for them to correct.", stage: "Beta" },
  { name: "Campaign review suggestions", what: "Checks campaign fields against carrier best practices before anything is submitted.", stage: "Testing" },
  { name: "Image optimization", what: "Fits uploaded logos and banners to each console's size and ratio limits.", stage: "Testing" },
];

export default function ProvisioningPage() {
  return (
    <div className="container-x">
      <CaseHero
        kicker="Vibes · 2026"
        pov="Operations"
        brand={<VibesLogo className="h-full w-auto" />}
        title="The user nobody designed for"
        lede="Every RCS agent a customer created still had to be provisioned by hand across ten portals and an inbox. I made our operations team my closest partner, then designed and shipped the customer intake and the internal admin that replaced the inbox."
        meta={[
          { label: "Role", value: "Product designer and builder" },
          { label: "Partners", value: "Messaging operations, the engineering manager, three engineers" },
          { label: "Timeline", value: "Late 2025 to present" },
          { label: "Stack", value: "TypeScript, React, Claude Code" },
        ]}
        stage={<VibesAdminStage />}
      />

      <Tldr
        items={[
          "Every RCS agent at Vibes used to be provisioned by hand: ten portals, coordinated over email, no validation, no visibility for the customer.",
          "I designed and shipped a guided customer intake and the internal admin that replaced it.",
          "Operations effort per request went from 8 hours to 90 minutes, measured by the operations director. Portals per request from 10 to 6, on the way to 1.",
          "The pattern is now the standard for every sender type Vibes offers. Toll-free shipped to alpha on it; 10DLC and short code are next.",
        ]}
      />

      <Beat
        chapter="Chapter 1 · The user nobody designed for"
        title="Ten portals, a spreadsheet, and an inbox"
        artifact={
          <Artifact label="What the customer never saw" pill="Abstract">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="bubble-sm border border-rule bg-raised p-3">
                <div className="label mb-2">The customer saw</div>
                <ul className="grid gap-1.5 text-[13px] text-body">
                  <li>A &quot;create agent&quot; button</li>
                  <li>An email thread</li>
                  <li>A wait with no status</li>
                </ul>
              </div>
              <div className="bubble-sm border border-rule bg-surface p-3">
                <div className="label mb-2">Operations did</div>
                <ul className="grid gap-1.5 text-[13px] text-body">
                  <li>Registered the brand and agent in a console</li>
                  <li>Emailed a verification vendor</li>
                  <li>Emailed each carrier a different template</li>
                  <li>Chased every missing field by hand</li>
                  <li>Tracked it all in a spreadsheet</li>
                </ul>
              </div>
            </div>
          </Artifact>
        }
      >
        <p>
          RCS Studio was built for customers, but every agent a customer created still had to be provisioned by our messaging operations team. A brand and agent registered in one console, details emailed to a verification vendor, campaign information emailed to each carrier, and every missing field chased with the customer over email.
        </p>
        <p>Ten portals, a spreadsheet, and tribal knowledge. The customer saw none of it.</p>
      </Beat>

      <Beat
        chapter="Chapter 2 · Learning the process"
        title="I ran the process myself until I could draw it"
        reverse
        artifact={
          <Artifact label="Process map, condensed" pill="From shadowing">
            <ol className="grid gap-1.5">
              {processSteps.map((s, i) => (
                <li key={s.step} className="grid grid-cols-[22px_1fr_auto] items-center gap-2 text-[13px]">
                  <span className="num text-muted">{i + 1}.</span>
                  <span className="text-body">{s.step}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                      s.written ? "bg-raised text-muted" : "bg-warn-soft text-warn"
                    }`}
                  >
                    {s.written ? "documented" : "unwritten"}
                  </span>
                </li>
              ))}
            </ol>
          </Artifact>
        }
      >
        <p>
          Operations became my closest partner. I shadowed provisioning requests end to end, interviewed the team, and ran the flow myself in a test environment with mock data until I could draw the whole thing from memory.
        </p>
        <p>The map had steps nobody had written down.</p>
      </Beat>

      <Beat
        chapter="Chapter 3 · The argument"
        title="Don't build software around a process that keeps changing"
        artifact={
          <Artifact label="The pushback, and the answer">
            <blockquote className="grid gap-4">
              <p className="bubble border border-rule bg-raised px-4 py-3 text-[15px] text-body">
                &quot;It changes every month. Build it and we&apos;ll be rebuilding it.&quot;
              </p>
              <p className="bubble-me justify-self-end border border-accent bg-accent-soft px-4 py-3 text-[15px] text-ink">
                &quot;It changes because it lives in people&apos;s heads. Write it down as software and it stops changing by accident.&quot;
              </p>
            </blockquote>
            <p className="mt-3 text-[12px] text-muted">Paraphrased from the conversations, not a transcript.</p>
          </Artifact>
        }
      >
        <p>
          The pushback, held loosely by the CTO and the engineering manager, was reasonable: don&apos;t build software around a process that keeps changing. My position was that it kept changing because it lived in people&apos;s heads, and the company couldn&apos;t scale RCS on an inbox.
        </p>
        <p>
          I didn&apos;t win it in a meeting. I worked out the admin concept with the engineering manager until the vision was something you could look at.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 4 · The customer side"
        title="A guided intake instead of an email thread"
        reverse
        artifact={
          <Artifact label="Guided intake, abstracted" pill="Mock data">
            <IntakeForm />
          </Artifact>
        }
      >
        <p>
          The intake replaced email with a guided form: inline validation, field-level explanations, a progress tracker through the stages, and copy written for someone who has never heard of carrier approval. Submitted requests show up in a table of sender types with a status.
        </p>
        <p>
          Statuses are coarse today because the upstream systems were never built to report them. As those integrations land, the customer gets stage-level detail and next steps.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 5 · Requests versus submissions"
        title="One request, several submissions"
        artifact={
          <Artifact label="Data model" pill="Diagram">
            <RequestsVsSubmissions />
          </Artifact>
        }
      >
        <p>
          The insight that changed the architecture came late: a customer makes one request, but operations makes several submissions, one per third party, each with its own contract.
        </p>
        <p>
          I helped shape the structure so that each third-party form is a template prefilled from the customer&apos;s request, and operations only adds what&apos;s missing. It removes the copy-and-paste entirely.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 6 · Built in code"
        title="The prototype branch was the spec"
        reverse
        artifact={
          <Artifact label="How submissions shipped">
            <ol className="grid gap-2 sm:grid-cols-3">
              {[
                { k: "My branch", v: "Submissions prototyped in code with mock data, deployed to a shared environment." },
                { k: "Their sessions", v: "Engineers pointed Claude Code at the branch and wired the real API and data model." },
                { k: "Production", v: "What shipped looks identical to the prototype." },
              ].map((s, i) => (
                <li key={s.k} className={`bubble-sm border p-3 ${i === 2 ? "border-accent bg-accent-soft" : "border-rule bg-raised"}`}>
                  <div className="label mb-1">{s.k}</div>
                  <p className="text-[13px] text-body">{s.v}</p>
                </li>
              ))}
            </ol>
          </Artifact>
        }
      >
        <p>
          I shipped the provisioning pages and the details page in production. For submissions, I prototyped the flow in code with mock data, and the engineers pointed their Claude Code sessions at my branch.
        </p>
        <p>What shipped looks identical, with the real API and data model behind it.</p>
      </Beat>

      <Beat
        chapter="Chapter 7 · It generalizes"
        title="A brand, a campaign, and the sender-specific details"
        artifact={
          <Artifact label="Same shape, two sender types" pill="Diagram">
            <Generalizes />
          </Artifact>
        }
      >
        <p>
          Toll-free provisioning reused the brand concept and the campaign review step and shipped to alpha in a fraction of the time. The target shape for every sender type is now the same: a brand, a campaign, and the sender-specific details.
        </p>
        <p>10DLC and short code follow.</p>
      </Beat>

      <Beat
        chapter="Chapter 8 · AI in the flow"
        title="Three assists, none of them shipped yet"
        reverse
        artifact={
          <Artifact label="AI assists" pill="In beta or testing">
            <ul className="grid gap-2">
              {aiAssists.map((a) => (
                <li key={a.name} className="bubble-sm grid grid-cols-[1fr_auto] items-start gap-3 border border-rule bg-raised p-3">
                  <div>
                    <div className="text-[13.5px] font-semibold text-ink">{a.name}</div>
                    <p className="mt-0.5 text-[12.5px] text-body">{a.what}</p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">{a.stage}</span>
                </li>
              ))}
            </ul>
          </Artifact>
        }
      >
        <p>
          Three AI assists are in beta or testing: prefilling agent details from the customer&apos;s website URL, reviewing campaign fields against best practices before submission, and optimizing uploaded logos and banners.
        </p>
        <p>Each one is designed as a draft the customer or operations can overwrite, not an answer.</p>
      </Beat>

      <Beat chapter="Chapter 9 · The admin side" title="The admin, recreated">
        <p>
          The admin surfaces everything a customer submitted, by API or by form, in one place, with accounts management alongside: create, edit, upgrade, impersonate, suspend. Operations exports or copies from there instead of hunting across portals.
        </p>
        <p>
          Because it is an internal, auth-walled tool, the recreation below is passphrase protected and uses mock data only.
        </p>
      </Beat>
      <section className="mx-auto max-w-6xl pb-14 md:pb-16">
        <Gate blob={blob} title="Provisioning admin, recreated with mock data" />
      </section>

      <Outcome
        stats={[
          { value: "8h → 90m", label: "operations effort per request, measured by the operations director" },
          { value: "10 → 6", label: "portals per request, with 1 as the target" },
          { value: "4 → 7", label: "operations team on this work, as demand grew" },
          { value: "3", label: "AI assists in beta or testing" },
        ]}
      >
        <p>
          The operations director measured the before and after. Demand grew and the team on this work grew with it, without the process breaking.
        </p>
      </Outcome>

      <Hindsight>
        <p>
          I&apos;d have separated customer requests from third-party submissions on day one. It&apos;s the abstraction the whole process hangs on, and it took months to see.
        </p>
        <p>
          Finding it earlier would have saved the operations team real time, and it turned out to be a gap across the company, not just this product.
        </p>
      </Hindsight>

      <NextCase slug="making-the-team-faster" />
    </div>
  );
}
