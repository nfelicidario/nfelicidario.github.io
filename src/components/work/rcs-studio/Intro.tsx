import type { Meta } from "@/components/case/CaseLayout";
import { MetaList } from "@/components/case/CaseLayout";
import { projects } from "@/content/projects";

/**
 * The intro under the RCS Studio hero: a centered column with the product name, the Work card's
 * bullets plus one line of context, and the outcome, then a ruled band of role, team, timeline,
 * and stack with their icons.
 */
const p = projects.find((x) => x.slug === "rcs-studio")!;

const context = "Vibes' entry into RCS, the successor to SMS, and the first product it sold without a sales team.";

export function RcsIntro({ meta }: { meta: Meta[] }) {
  return (
    <div className="mt-14 md:mt-16">
      <div className="mx-auto max-w-[56ch]">
        <h2 className="text-center text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.02em] text-ink">{p.title}</h2>
        <ul className="mt-5 grid gap-2 pl-5 text-[15.5px] text-body marker:text-rule" style={{ listStyle: "disc" }}>
          <li>{context}</li>
          {p.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="mt-5">
          <div className="label mb-2">Outcome</div>
          <ul className="grid gap-2 pl-5 text-[15.5px] text-body marker:text-accent" style={{ listStyle: "disc" }}>
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
