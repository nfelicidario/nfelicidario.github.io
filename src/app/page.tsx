import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { earlier, now, projects } from "@/content/projects";

const ledger = [
  { when: "Jul 2026", what: "RCS Studio went GA. Vibes' first self-serve product in a decade.", href: "/work/rcs-studio/" },
  { when: "2026", what: "Provisioning rebuilt: 8 hours of ops work per request down to 90 minutes.", href: "/work/provisioning/" },
  { when: "Mar 2026", what: "First production merge. Now shipping on par with the team's engineers.", href: "/work/making-the-team-faster/" },
  { when: "2020–25", what: "Co-founded Stride. Monthly active users 2% to 22% after Tracks.", href: "/work/stride/" },
];

export default function Home() {
  return (
    <div className="container-x">
      <section className="mx-auto grid max-w-6xl gap-8 pt-8 pb-10 md:grid-cols-[1.1fr_1fr] md:items-end md:pt-12">
        <div>
          <h1 className="max-w-[15ch] text-[clamp(34px,4.6vw,58px)] font-bold text-ink">
            Product designer who <span className="text-accent">ships the code.</span>
          </h1>
          <p className="mt-4 max-w-[46ch] text-[16px] md:text-[17px]">
            Senior product designer at Vibes, co-founder of Stride, in Chicago. I find the
            product a company should have built, then build it, in production TypeScript
            alongside the engineers.
          </p>
        </div>
        <ol className="grid gap-1.5 border-t border-rule pt-4 md:border-t-0 md:pt-0">
          {ledger.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group grid grid-cols-[72px_1fr] items-baseline gap-3 rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-raised"
              >
                <span className="label num">{l.when}</span>
                <span className="text-[14.5px] text-body group-hover:text-ink">{l.what}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl" aria-labelledby="work">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="work" className="text-[22px] font-bold text-ink">
            Work
          </h2>
          <span className="label">4 case studies · 2025–26 first</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} />
          ))}
        </div>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {earlier.map((e) => (
            <li
              key={e.org}
              className="grid grid-cols-[1fr_auto] items-baseline gap-3 rounded-xl border border-dashed border-rule px-4 py-3 text-[14px]"
            >
              <span>
                <b className="font-semibold text-ink">{e.org}</b>
                <span className="text-muted"> · {e.line}</span>
              </span>
              <span className="label">{e.years}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-14 max-w-6xl" aria-labelledby="now">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="now" className="text-[22px] font-bold text-ink">
            Now
          </h2>
          <span className="label">In progress · updated weekly</span>
        </div>
        <div className="bubble grid grid-cols-[auto_1fr] items-start gap-4 border border-rule bg-accent-soft p-5">
          <span
            aria-hidden="true"
            className="mt-2 block h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_22%,transparent)]"
          />
          <div>
            <div className="label mb-1">{now.date}</div>
            <h3 className="text-[19px] font-bold text-ink">{now.title}</h3>
            <p className="mt-1.5 max-w-[70ch] text-[15px]">{now.body}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
