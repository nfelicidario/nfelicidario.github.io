import Link from "next/link";
import type { ReactNode } from "react";
import { projects } from "@/content/projects";

export type Meta = { label: string; value: string };

export function CaseHero({
  kicker,
  title,
  lede,
  meta,
  stage,
  artifact,
}: {
  kicker: string;
  title: string;
  lede: string;
  meta: Meta[];
  /** full-width hero stage (preferred): see HeroStage */
  stage?: ReactNode;
  /** legacy: a side artifact next to the title */
  artifact?: ReactNode;
}) {
  if (stage) {
    return (
      <section className="mx-auto max-w-6xl pt-6 pb-14 md:pt-8 md:pb-16">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <div className="label text-accent">{kicker}</div>
        </div>
        {stage}
        <div className="mt-14 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-start md:mt-16">
          <div>
            <h1 className="max-w-[18ch] text-[clamp(28px,3.6vw,42px)] font-bold text-ink">{title}</h1>
            <p className="mt-4 max-w-[52ch] text-[16px]">{lede}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-rule pt-4 text-[13.5px] md:border-t-0 md:border-l md:pl-6 md:pt-0">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="label mb-0.5">{m.label}</dt>
                <dd className="font-medium text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    );
  }
  return (
    <section className="mx-auto grid max-w-6xl gap-10 pt-10 pb-16 md:grid-cols-[1fr_1fr] md:items-center md:pt-16 md:pb-20">
      <div>
        <div className="label mb-3 text-accent">{kicker}</div>
        <h1 className="max-w-[16ch] text-[clamp(32px,4.4vw,52px)] font-bold text-ink">{title}</h1>
        <p className="mt-5 max-w-[48ch] text-[16px] md:text-[17px]">{lede}</p>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-rule pt-5 text-[13.5px]">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="label mb-0.5">{m.label}</dt>
              <dd className="font-medium text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {artifact && <div>{artifact}</div>}
    </section>
  );
}

export function Tldr({ items }: { items: string[] }) {
  return (
    <section className="mx-auto max-w-6xl pb-6" aria-label="Summary">
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((t) => (
          <li key={t} className="bubble border border-rule bg-surface px-5 py-4 text-[14.5px] text-body">
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Beat({
  chapter,
  title,
  children,
  artifact,
  reverse = false,
}: {
  chapter?: string;
  title: string;
  children: ReactNode;
  artifact?: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto max-w-6xl border-t border-rule py-14 md:py-16">
      <div
        className={`grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-start ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          {chapter && <div className="label mb-3 text-accent">{chapter}</div>}
          <h2 className="text-[26px] font-bold text-ink md:text-[30px]">{title}</h2>
          <div className="mt-4 grid max-w-[52ch] gap-3 text-[15.5px] [&>p]:text-body">{children}</div>
        </div>
        {artifact && <div className="min-w-0">{artifact}</div>}
      </div>
    </section>
  );
}

export function Artifact({
  label,
  pill,
  children,
  className = "",
}: {
  label?: string;
  pill?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`bubble overflow-hidden border border-rule bg-surface ${className}`}>
      {(label || pill) && (
        <figcaption className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
          <span className="label">{label}</span>
          {pill && (
            <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] font-medium text-muted">{pill}</span>
          )}
        </figcaption>
      )}
      <div className="p-4 md:p-5">{children}</div>
    </figure>
  );
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="bubble border border-rule bg-surface p-4">
          <div className="num font-display text-[26px] font-bold tracking-[-0.02em] text-ink">{s.value}</div>
          <div className="mt-1 text-[12.5px] text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function Outcome({ title = "Outcome", stats, children }: { title?: string; stats: { value: string; label: string }[]; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl border-t border-rule py-14 md:py-16">
      <h2 className="mb-6 text-[26px] font-bold text-ink md:text-[30px]">{title}</h2>
      <Stats items={stats} />
      {children && <div className="mt-6 grid max-w-[62ch] gap-3 text-[15.5px] [&>p]:text-body">{children}</div>}
    </section>
  );
}

export function Hindsight({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl border-t border-rule py-14 md:py-16">
      <h2 className="text-[26px] font-bold text-ink md:text-[30px]">With hindsight</h2>
      <div className="mt-4 grid max-w-[62ch] gap-3 text-[15.5px] [&>p]:text-body">{children}</div>
    </section>
  );
}

export function NextCase({ slug }: { slug: string }) {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <section className="mx-auto max-w-6xl border-t border-rule py-12">
      <div className="label mb-3">Next case study</div>
      <Link href={`/work/${p.slug}/`} className="group grid gap-1">
        <span className="text-[24px] font-bold text-ink group-hover:text-accent">{p.title} →</span>
        <span className="text-[14.5px] text-muted">{p.summary}</span>
      </Link>
    </section>
  );
}
