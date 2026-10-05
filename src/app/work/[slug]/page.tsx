import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return { title: p?.title ?? "Work" };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <div className="container-x">
      <section className="mx-auto max-w-6xl pt-10 md:pt-16">
        <div className="label mb-3">
          {p.org} · {p.years}
        </div>
        <h1 className="max-w-[16ch] text-[clamp(36px,6vw,72px)] font-bold text-ink">
          {p.title}
        </h1>
        <p className="measure mt-6 text-[17px]">{p.summary}</p>
        <p className="measure mt-6 text-[15px] text-muted">
          Case study in progress. The full story, with artifacts, lands here soon.
        </p>
      </section>
    </div>
  );
}
