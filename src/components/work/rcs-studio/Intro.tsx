import type { Meta } from "@/components/case/CaseLayout";
import { MetaList } from "@/components/case/CaseLayout";
import { projects } from "@/content/projects";

/**
 * The intro under the RCS Studio hero: the product name, then a centered two-column container
 * (Overview bullets, Outcome bullets), then a ruled band of role, team, timeline, and stack with
 * their icons.
 */
const p = projects.find((x) => x.slug === "rcs-studio")!;

const overview = [
  "Vibes' entry into RCS, the successor to SMS, and the first product customers could sign up for on their own.",
  "Provisioning: how a business gets a verified RCS agent. The brand and agent are registered and approved by Google and the carriers, so messages arrive from a verified, branded sender instead of a bare phone number.",
  "Building: app-like experiences inside the message thread, with rich cards, carousels, and suggested replies, connected to live business data through API integrations.",
  p.bullets[1],
];

export function RcsIntro({ meta }: { meta: Meta[] }) {
  return (
    <div className="mt-14 md:mt-16">
      <h2 className="text-center text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.02em] text-ink">{p.title}</h2>
      <div className="mx-auto mt-7 grid max-w-4xl gap-8 md:grid-cols-[1.4fr_1fr] md:gap-12">
        <div>
          <div className="label mb-2">Overview</div>
          <ul className="grid gap-2 pl-5 text-[15px] text-body marker:text-rule" style={{ listStyle: "disc" }}>
            {overview.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="label mb-2">Outcome</div>
          <ul className="grid gap-2 pl-5 text-[15px] text-body marker:text-accent" style={{ listStyle: "disc" }}>
            {p.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </div>
      <MetaList
        meta={meta}
        columns={4}
        className="mt-10 border-y border-rule py-5 md:gap-x-8 md:[&>div+div]:border-l md:[&>div+div]:border-rule md:[&>div+div]:pl-6"
      />
    </div>
  );
}
