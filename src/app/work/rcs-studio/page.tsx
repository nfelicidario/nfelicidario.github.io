import Link from "next/link";
import type { Metadata } from "next";
import { Artifact, Beat, CaseHero, Hindsight, NextCase, Outcome, Tldr } from "@/components/case/CaseLayout";
import { LookShift } from "@/components/work/rcs-studio/LookShift";
import { RcsStudioStage } from "@/components/work/rcs-studio/hero/RcsStudioStage";
import { Simplify } from "@/components/work/rcs-studio/Simplify";
import { ThesisVsReality } from "@/components/work/rcs-studio/ThesisVsReality";
import { ThreeUsers } from "@/components/work/rcs-studio/ThreeUsers";
import { ToggleTool } from "@/components/ToggleTool";

export const metadata: Metadata = { title: "RCS Studio" };

const firsts = [
  { k: "First", v: "public sign-up" },
  { k: "First", v: "self-serve product" },
  { k: "First", v: "new product in roughly a decade" },
];

const shipped = [
  {
    label: "Aug 2025 to Feb 2026",
    items: [
      "A Figma design doc for nearly every change, broken into epics and stories",
      "A roadmap the product organization still uses for executive reviews",
      "The beta landing page end to end: design, copy, legal pages, lead capture for sales",
    ],
  },
  {
    label: "Mar 2026 onward",
    accent: true,
    items: [
      "Production TypeScript alongside the engineers",
      "Sign-up and sign-in",
      "Customer-facing provisioning flows and most of the internal admin",
    ],
  },
];

export default function Page() {
  return (
    <div className="container-x">
      <CaseHero
        kicker="Vibes · 2025–26"
        title="We built the second step first"
        lede="RCS Studio started as a f        lede="RCS Studio launched as a flow builder for developers, and beta customers showed me the product was really the step before it."
        heading={
          <ToggleTool
            id="rcs-h1"
            label="Headline"
            variants={[
              {
                name: "Fact",
                render: (
                  <>
                    <h1 className="max-w-[18ch] text-[clamp(28px,3.6vw,42px)] font-bold text-ink">We built the second step first</h1>
                    <p className="mt-4 max-w-[52ch] text-[16px]">RCS Studio launched as a flow builder for developers, and beta customers showed me the product was really the step before it.</p>
                  </>
                ),
              },
              {
                name: "Lesson",
                render: (
                  <>
                    <h1 className="max-w-[18ch] text-[clamp(28px,3.6vw,42px)] font-bold text-ink">The first step was the product</h1>
                    <p className="mt-4 max-w-[52ch] text-[16px]">Nobody arrived wanting to build a message flow. They wanted an agent that could send one, so I repositioned the product around getting there.</p>
                  </>
                ),
              },
              {
                name: "Outcome",
                render: (
                  <>
                    <h1 className="max-w-[18ch] text-[clamp(28px,3.6vw,42px)] font-bold text-ink">The pivot that made self-serve work at Vibes</h1>
                    <p className="mt-4 max-w-[52ch] text-[16px]">A hackathon flow builder became the portal for every RCS agent Vibes provisions, and the proof that customers would sign up without a sales call.</p>
                  </>
                ),
              },
            ]}
          />
        }
e", value: "Sole product designer" },
          { label: "Team", value: "Engineering manager, three engineers" },
          { label: "Timeline", value: "Aug 2025 to Jul 2026" },
          { label: "Stack", value: "Figma, then TypeScript, React, Claude Code" },
        ]}
        stage={<RcsStudioStage />}
      />

      <Tldr
        items={[
          "Vibes' first customer-facing, self-serve product in a decade, and the first thing the company ever put on the public internet.",
          "The founding thesis was wrong. I learned that from beta customers and repositioned the product around provisioning instead of flow building.",
          "Now the portal for every RCS agent Vibes provisions: 450-plus, in one to three weeks against months for competitors.",
          "It proved self-serve works at Vibes. I'm now working with the head of product on a company-wide self-serve entry point.",
        ]}
      />

      <Beat
        chapter="Chapter 1 · The bet"
        title="A hackathon project with a thesis"
        artifact={
          <Artifact label="A lot of firsts for a twenty-year B2B company">
            <ul className="grid gap-2">
              {firsts.map((f) => (
                <li key={f.v} className="bubble-sm flex items-baseline gap-3 border border-rule bg-bg px-4 py-3">
                  <span className="label text-accent">{f.k}</span>
                  <span className="text-[15px] font-semibold text-ink">{f.v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12.5px] text-muted">Everything before this had been sold through a sales team.</p>
          </Artifact>
        }
      >
        <p>
          RCS is the successor to SMS: branded senders, rich cards, carousels, suggested replies. Vibes
          believed developers would be the ones to prove it, so a hackathon project became RCS Studio, a
          self-serve platform where any developer could sign up and build RCS message flows.
        </p>
        <p>
          For a company that had sold B2B through a sales team for twenty years, this was a lot of firsts. I
          joined in August 2025 to take over daily ownership from the head of design, and was running it
          independently by my third month.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 2 · What the market said"
        title="Nobody arrived wanting to build a flow"
        reverse
        artifact={
          <Artifact label="Thesis vs. reality" pill="Abstracted">
            <ThesisVsReality />
          </Artifact>
        }
      >
        <p>
          The thesis didn&apos;t survive contact with customers. I ran a partner beta with two companies who got
          hands-on support in exchange for interviews, and read everything else we could get: sign-up data,
          support tickets, and what sales and account teams were hearing on calls.
        </p>
        <p>
          Every conversation started the same way: &ldquo;What is RCS?&rdquo; and &ldquo;How do I get
          started?&rdquo; Getting started meant provisioning, a brand and agent registered, verified, and
          approved by each carrier, and it all happened over email across weeks. The flow builder answered a
          question nobody was asking yet.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 3"
        title="Two customers, not one developer"
        artifact={
          <Artifact label="Who actually showed up" pill="Personas">
            <ThreeUsers />
          </Artifact>
        }
      >
        <p>
          Once provisioning was the real first step, the product had two customers, not one. Marketing
          operations people who needed an agent provisioned for a campaign and had never written code, and
          the technical builders we had designed for, who wanted the flow builder once an agent existed.
          Right before beta I split the product around those two.
        </p>
        <p>
          Behind both of them was a third group: our own operations team, doing the provisioning work by
          hand. Designing for them became its own project, told in{" "}
          <Link href="/work/provisioning/" className="text-body underline decoration-rule underline-offset-2 transition-colors hover:text-accent hover:decoration-accent">
            the next case study
          </Link>
          .
        </p>
        <p>
          Right before beta I split the product around the first two and started designing for the third. The
          internal tooling became its own project, which is the next case study.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 4 · The pushback"
        title="&ldquo;What are we even building here?&rdquo;"
        reverse
        artifact={
          <Artifact label="The reframe that aligned the team">
            <div className="grid gap-3">
              <div className="bubble-sm border border-dashed border-rule bg-bg p-4">
                <div className="label mb-1.5">A flow builder</div>
                <p className="text-[14px] text-muted">Competes with one feature of the incumbents.</p>
                <div className="mt-3 h-2 w-1/5 rounded-full bg-raised" />
              </div>
              <div className="bubble-sm border border-accent bg-accent-soft/40 p-4">
                <div className="label mb-1.5 text-accent">A provisioning platform</div>
                <p className="text-[14px] text-ink">Competes with the incumbents.</p>
                <div className="mt-3 h-2 w-full rounded-full bg-accent" />
              </div>
            </div>
          </Artifact>
        }
      >
        <p>
          The engineering manager pushed back, and leadership&apos;s vision was still to push the boundaries of
          RCS. A provisioning platform looked like a detour into operations tooling.
        </p>
        <p>
          I didn&apos;t argue it. I built a proof of concept of the provisioning flow, put it in front of our
          operations team, and brought their reaction back. Then I made the strategic case: a flow builder
          competes with one feature of the incumbents, while a provisioning platform competes with the
          incumbents themselves.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 5 · Simplifying the builder"
        title="It made sense if you&apos;d built it"
        artifact={
          <Artifact label="The builder, before and after" pill="Abstract shapes">
            <Simplify />
          </Artifact>
        }
      >
        <p>
          The original builder was called the state builder, and internal interviews showed consistent
          confusion. Most beta users didn&apos;t use it correctly or at all, drop-off clustered inside it, and
          intake questions were mostly &ldquo;how does this work.&rdquo;
        </p>
        <p>
          I cut most of the optionality from the default path and moved advanced capability behind progressive
          disclosure. Three steps got people to a working flow; everything else stayed one click away.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 6 · Finding the look"
        title="The design system was built for a different product"
        reverse
        artifact={
          <Artifact label="Type, spacing, color" pill="Abstract tiles">
            <LookShift />
          </Artifact>
        }
      >
        <p>
          RCS Studio inherited a design system built for a marketing platform: large type, generous spacing,
          and a primary color plus several secondary colors used freely. For a dense builder and a multi-step
          provisioning flow it didn&apos;t work, so we drifted toward a smaller type scale, tighter spacing, and
          color reserved for calls to action.
        </p>
        <p>
          The drift got noticed, and the concern about two products diverging was fair. I reviewed each change
          with the head of design and fed what landed back into the shared system, and several of those
          components were adopted. What came out of it is the direction the company&apos;s next-generation
          products are now being designed on.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 7 · What I shipped"
        title="Figma docs, then production code"
        artifact={
          <Artifact label="How the work changed shape">
            <div className="grid gap-3 sm:grid-cols-2">
              {shipped.map((s) => (
                <div
                  key={s.label}
                  className={`bubble-sm border p-4 ${s.accent ? "border-accent bg-accent-soft/40" : "border-rule bg-bg"}`}
                >
                  <div className={`label mb-2 ${s.accent ? "text-accent" : ""}`}>{s.label}</div>
                  <ul className="grid gap-1.5 text-[13px] text-body">
                    {s.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Artifact>
        }
      >
        <p>
          For the first seven months I worked the way most product designers do: a Figma design doc for nearly
          every change, broken into epics and stories, with a roadmap the product organization still uses for
          executive reviews. For beta I owned the landing page end to end, including copy and the legal pages.
        </p>
        <p>
          In March 2026 we got Claude Code. From then on I shipped production TypeScript alongside the
          engineers: the sign-up and sign-in experience, customer-facing provisioning flows, and most of the
          internal admin.
        </p>
      </Beat>

      <Outcome
        stats={[
          { value: "450+", label: "RCS agents provisioned through RCS Studio" },
          { value: "1–3 wks", label: "to provision, against months for competitors" },
          { value: "Feb → Jul", label: "2026, beta to general availability" },
          { value: "Month 3", label: "running the product independently" },
        ]}
      >
        <p>
          RCS Studio is now the portal for every RCS agent Vibes provisions. More importantly, it proved that
          self-serve works here: leads come in, try things, and convert without a sales call first.
        </p>
        <p>
          That changed the company&apos;s direction. I&apos;m now working with the head of product on a
          company-wide self-serve entry point.
        </p>
      </Outcome>

      <Hindsight>
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
