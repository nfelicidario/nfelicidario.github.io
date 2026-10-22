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
        <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-body">This case study is written last. Nothing here yet.</p>
      </section>
      <NextCase slug="stride" />
    </div>
  );
}
