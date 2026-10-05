import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <div className="container-x">
      <section className="mx-auto max-w-6xl pt-10 md:pt-16">
        <h1 className="max-w-[16ch] text-[clamp(36px,6vw,72px)] font-bold text-ink">
          Nolan Felicidario
        </h1>
        <p className="measure mt-6 text-[17px]">
          Senior product designer at Vibes in Chicago. Co-founder and founding product
          designer at Stride for five years before that, and a frontend engineer at
          Capital One. I cover the whole loop: strategy, design, and production code.
        </p>
      </section>
    </div>
  );
}
