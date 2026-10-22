import type { Metadata } from "next";
import { NextCase } from "@/components/case/CaseLayout";

export const metadata: Metadata = { title: "Design system" };

/* Placeholder. The full story, prototype, and slides come later. */
export default function Page() {
  return (
    <div className="container-x">
      <section className="mx-auto max-w-6xl pt-14 md:pt-16">
        <div className="label text-accent">Vibes · 2025–26 · Case study in progress</div>
        <h1 className="mt-3 text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em] text-ink">A quieter design system for step-by-step products</h1>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-body">
          The inherited system was built for a marketing product: large type, generous spacing, and color used freely. RCS Studio walks
          people through provisioning one step at a time, so I went smaller and tighter and reserved color for the next step. The drift got
          noticed, so I reviewed each change with the head of design and fed what landed back into the shared system. It is now the direction
          for the company&apos;s next-generation products.
        </p>
      </section>
      <NextCase slug="making-the-team-faster" />
    </div>
  );
}
