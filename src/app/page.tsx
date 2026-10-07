import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { VibesIcon } from "@/components/VibesIcon";
import { Timeline } from "@/components/Timeline";
import { earlier, now, projects } from "@/content/projects";
import { more, origin, recent } from "@/content/timeline";

const tags = [
  "Co-founder, 2x",
  "Founding designer",
  "0 → 1",
  "Shipped to GA",
  "Production TypeScript",
  "Prototypes over handoffs",
  "Roadmaps & PRDs",
  "Agentic SDLC",
  "Design systems",
];

export default function Home() {
  return (
    <div className="container-x">
      <section className="mx-auto grid max-w-6xl gap-10 pt-10 pb-20 md:grid-cols-[1.1fr_1fr] md:items-center md:pt-16 md:pb-24">
        <div>
          <h1 className="max-w-[15ch] text-[clamp(34px,4.6vw,58px)] font-bold text-ink">
            Product designer who <span className="text-accent">ships code.</span>
          </h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-1.5 text-[15px] md:text-[16px]">
            <span>Senior Product Designer @</span>
            <span className="inline-flex items-center gap-1 text-ink">
              <VibesIcon className="h-[1.05em] w-auto text-accent" />
              Vibes
            </span>
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-rule bg-surface px-2.5 py-1 text-[12.5px] text-body"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-rule pt-4 md:border-t-0 md:pt-0">
          <Timeline recent={recent} more={more} origin={origin} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl" aria-labelledby="work">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 id="work" className="text-[22px] font-bold text-ink">
            Work
          </h2>
          <span className="label">4 case studies · 2025–26 first</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} />
          ))}
        </div>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
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

      <section className="mx-auto mt-24 max-w-6xl" aria-labelledby="hiw">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 id="hiw" className="text-[22px] font-bold text-ink">
            How I work
          </h2>
          <Link href="/how-i-work/" className="label hover:text-ink">
            Read the full page →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
          <div className="bubble border border-rule bg-surface p-4">
            <div className="label mb-2">Before · Aug 2025 – Feb 2026</div>
            <p className="text-[14.5px]">
              A Figma design doc for nearly every change. Epics and stories, handoff, then
              design QA on the build.
            </p>
          </div>
          <div className="bubble border border-accent bg-surface p-4">
            <div className="label mb-2 text-accent">After · Mar 2026 →</div>
            <p className="text-[14.5px]">
              Prototype in code with mock data, deployed to a shared environment. Engineers
              point Claude Code at my branch. What ships matches.
            </p>
          </div>
          <div className="bubble border border-rule bg-surface p-4">
            <div className="label mb-2">What spread</div>
            <p className="text-[14.5px]">
              The planning flow about half the org now runs on. Roadmap and review formats
              used from IC updates to board meetings.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl" aria-labelledby="now">
        <div className="mb-5 flex items-baseline justify-between">
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

      <section className="mx-auto mt-24 max-w-6xl" aria-labelledby="about">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 id="about" className="text-[22px] font-bold text-ink">
            About
          </h2>
          <Link href="/about/" className="label hover:text-ink">
            More →
          </Link>
        </div>
        <p className="measure text-[15.5px]">
          I started in graphic design, learned to code to ship my own ideas, and spent five
          years as a startup co-founder before joining Vibes. I cover the whole loop:
          strategy, design, and production code.
        </p>
      </section>
    </div>
  );
}
