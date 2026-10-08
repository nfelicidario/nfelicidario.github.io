import Link from "next/link";
import type { Metadata } from "next";
import { Artifact, Beat, CaseHero, Hindsight, NextCase, Outcome, Tldr } from "@/components/case/CaseLayout";
import { LookShift } from "@/components/work/rcs-studio/LookShift";
import { RcsStudioStage } from "@/components/work/rcs-studio/hero/RcsStudioStage";
import { Simplify } from "@/components/work/rcs-studio/Simplify";
import { ThesisVsReality } from "@/components/work/rcs-studio/ThesisVsReality";
import { ThreeUsers } from "@/components/work/rcs-studio/ThreeUsers";
import { VibesLogo } from "@/components/VibesLogo";

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
        pov="Customer"
        brand={<VibesLogo className="h-full w-auto" />}
        title="We built the second step first"
        lede="RCS Studio launched as a flow builder for developers, and beta customers showed me the product was really the step before it."
        meta={[
          { label: "Role", value: "Sole product designer" },
          { label: "Team", value: "Engineering manager, three engineers" },
          { label: "Timeline", value: "Aug 2025 to Jul 2026" },
          { label: "Stack", value: "Figma, then TypeScript, React, Claude Code" },
        ]}
        stage={<RcsStudioStage />}
      />

      <Tldr
        items={[
          "Vibes' first customer-facing, self-serve product in a decade, and the first thing the company ever put on the public internet.",
          "The founding bet was that provisioning would take care of itself. Customers showed me it was the whole first step, so I repositioned the product around it before beta.",
          "Now the portal for every RCS agent Vibes provisions: 450-plus, in one to three weeks against months for competitors.",
          "It proved customers would sign up and try things on their own. I'm now working with the head of product on a company-wide self-serve entry point.",
        ]}
      />

      <Beat
        chapter="Chapter 1"
        title="The bet"
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
          RCS is the successor to SMS: branded senders, rich cards, carousels, suggested replies. The bet was that an industry shift to RCS was coming on its own, every brand would soon have an agent, and all of them would need a builder to use its rich features. So a hackathon project became RCS Studio, a self-serve platform where any developer could sign up and build RCS message flows.
        </p>
        <p>
          For a company that had sold B2B through a sales team for twenty years, this was a lot of firsts. I joined in August 2025 to take over daily ownership from the head of design, and was running it independently by my third month.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 2"
        title="The question everyone asked"
        reverse
        artifact={
          <Artifact label="Thesis vs. reality" pill="Abstracted">
            <ThesisVsReality />
          </Artifact>
        }
      >
        <p>
          There was no single moment. The signal accumulated: early customer interviews, a lot of sales calls, usage data from early customers and self-serve users, and the competitive analysis I ran once the pattern was clear. Every conversation began with &ldquo;What is RCS?&rdquo; and &ldquo;How do I get started?&rdquo; Nobody arrived wanting to build a flow.
        </p>
        <p>
          Getting started meant provisioning: a brand and agent registered, verified, and approved by each carrier, over weeks of email. RCS was so new that the plumbing had to come first. We had built the second step of the product and skipped the first.
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
        chapter="Chapter 4"
        title="Making the case"
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
          The engineering manager pushed back, and leadership&apos;s vision was still to push the boundaries of RCS. A provisioning platform looked like a detour into operations tooling.
        </p>
        <p>
          I didn&apos;t argue it. I built a proof of concept of the provisioning flow, put it in front of our operations team, and brought their reaction back. That reaction is what moved the engineering manager. He was clear-eyed that a company our size would not out-build the big messaging incumbents, but we could be the fastest at the part everyone struggles with, because we understood it best. A flow builder competes with one feature of the incumbents. A provisioning platform competes on the thing customers actually get stuck on.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 5"
        title="The builder, demoted and simplified"
        artifact={
          <Artifact label="The builder, before and after" pill="Abstract shapes">
            <Simplify />
          </Artifact>
        }
      >
        <p>
          The builder stayed, but as the second step, and a second step can&apos;t be the hardest part of the product. Internal interviews showed consistent confusion with the original state builder. Most beta users didn&apos;t use it correctly or at all, drop-off clustered inside it, and intake questions were mostly &ldquo;how does this work.&rdquo;
        </p>
        <p>
          I cut most of the optionality from the default path and moved advanced capability behind progressive disclosure, so three steps got people to a working flow. Today the builder is mostly a demo engine, with a handful of power users, and making it easier is still open work.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 6"
        title="A look for different users"
        reverse
        artifact={
          <Artifact label="Type, spacing, color" pill="Abstract tiles">
            <LookShift />
          </Artifact>
        }
      >
        <p>
          The inherited design system was built for a marketing product: large type, generous spacing, and a primary color plus several secondary colors used freely. A multi-step form for someone who has never heard of carrier approval needed a smaller scale, tighter spacing, and color reserved for the next step. The impetus was user feedback, internal and external; the liberties I took to answer it went past the existing system.
        </p>
        <p>
          The drift got noticed, and the concern about two products diverging was fair. I reviewed each change with the head of design and fed what landed back into the shared system. Customers and sales described the result as elegant and modern, and that direction is what the company&apos;s next-generation products are now being designed on.
        </p>
      </Beat>

      <Beat
        chapter="Chapter 7"
        title="What it proved"
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
          For the first seven months I worked the way most product designers do: a Figma design doc for nearly every change, broken into epics and stories, with a roadmap the product organization still uses for executive reviews. From March 2026 I shipped production TypeScript alongside the engineers: sign-up, sign-in, and the customer-facing provisioning flows.
        </p>
        <p>
          We gated the last step on purpose. Anyone could sign up and spin up an agent in Test Mode, and launching it meant a conversation with sales. Some did exactly that. Others got an agent into Test Mode and never booked the call, which told us the self-serve path worked and where it still leaked.
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
          customers would sign up and get an agent running on their own, something the company had never
          seen. That changed its direction, and I&apos;m now working with the head of product on a company-wide
          self-serve entry point.
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
