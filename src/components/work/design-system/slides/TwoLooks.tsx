"use client";

import { MockPage } from "../hero/MockPage";

/* Slide 1: the same kind of page in Platform and in RCS Studio, side by side, and what each look costs. */

export function TwoLooks() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <figure>
        <div className="aspect-[16/10] overflow-hidden rounded-[12px] border border-rule">
          <MockPage tone="today" app="Platform" compact />
        </div>
        <figcaption className="mt-2 px-0.5 text-[13px] leading-snug text-muted">
          <span className="font-semibold text-ink">Platform.</span> Grew over many years without a shared foundation, so every team made its own visual choices. Several colours at once, heavy borders, and type sized for a mobile marketer.
        </figcaption>
      </figure>
      <figure>
        <div className="aspect-[16/10] overflow-hidden rounded-[12px] border border-rule">
          <MockPage tone="next" app="RCS Studio" compact />
        </div>
        <figcaption className="mt-2 px-0.5 text-[13px] leading-snug text-muted">
          <span className="font-semibold text-ink">RCS Studio.</span> A neutral scale, one accent reserved for the next step, softer corners, and smaller, tighter type. Received as modern and clean, by customers and by sales.
        </figcaption>
      </figure>
    </div>
  );
}
