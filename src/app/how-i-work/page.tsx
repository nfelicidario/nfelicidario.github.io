import type { Metadata } from "next";

export const metadata: Metadata = { title: "How I work" };

export default function HowIWork() {
  return (
    <div className="container-x">
      <section className="mx-auto max-w-6xl pt-10 md:pt-16">
        <h1 className="max-w-[16ch] text-[clamp(36px,6vw,72px)] font-bold text-ink">
          In March 2026, my job changed shape.
        </h1>
        <p className="measure mt-6 text-[17px]">
          Before, a Figma design doc for nearly every change, handed to engineers. After,
          production code on a branch the engineers build from. Same judgment, shorter
          loop. This page is coming together; the case study on making the team faster
          is where the organizational side lives.
        </p>
      </section>
    </div>
  );
}
