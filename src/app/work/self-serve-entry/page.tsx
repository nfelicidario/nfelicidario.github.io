import type { Metadata } from "next";
import { NextCase } from "@/components/case/CaseLayout";

export const metadata: Metadata = { title: "Self-serve entry point" };

/* Placeholder. This work is in progress; the page will grow as a log rather than a finished case study. */
export default function Page() {
  return (
    <div className="container-x">
      <section className="mx-auto max-w-6xl pt-14 md:pt-16">
        <div className="label text-accent">Vibes · 2026 · In progress</div>
        <h1 className="mt-3 text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em] text-ink">A company-wide self-serve entry point</h1>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-body">
          RCS Studio proved that customers will sign up and get started on their own. I&apos;m now working with the head of product on a single
          self-serve entry point for Vibes, built as a surface of the existing products rather than a standalone brand, with a theming layer from
          day one. This page will fill in as the work ships.
        </p>
      </section>
      <NextCase slug="stride" />
    </div>
  );
}
