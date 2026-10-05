import { ProjectCard } from "@/components/ProjectCard";
import { earlier, now, projects } from "@/content/projects";

const tags = ["0 → 1", "Production TypeScript", "Prototypes in code", "Agentic SDLC", "Chicago"];

export default function Home() {
  return (
    <div className="container-x">
      <section className="mx-auto max-w-6xl pt-10 pb-12 text-center md:pt-16">
        <h1 className="mx-auto max-w-[14ch] text-[clamp(44px,8.5vw,112px)] font-bold text-ink">
          Product designer who{" "}
          <span className="text-accent">ships the code.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[52ch] text-[17px] md:text-[19px]">
          Senior product designer at Vibes, co-founder of Stride. I find the product a
          company should have built, then build it, in production TypeScript alongside
          the engineers.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {tags.map((t) => (
            <li
              key={t}
              className="bubble-sm border border-rule bg-surface px-3 py-1.5 text-[13px] text-body"
            >
              {t}
            </li>
          ))}
        </ul>
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
              className="bubble-sm grid grid-cols-[1fr_auto] items-baseline gap-3 border border-dashed border-rule px-4 py-3 text-[14px]"
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
