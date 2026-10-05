import type { Metadata } from "next";
import { Gate } from "@/components/Gate";
import blob from "@/content/gated/demo.json";

export const metadata: Metadata = { title: "Gated demo", robots: { index: false } };

export default function GatedDemo() {
  return (
    <div className="container-x">
      <section className="mx-auto max-w-6xl pt-10 md:pt-16">
        <div className="label mb-3">Demo · not linked from the site</div>
        <h1 className="max-w-[16ch] text-[clamp(36px,6vw,72px)] font-bold text-ink">
          Passphrase gate
        </h1>
        <p className="measure mt-6 mb-8 text-[17px]">
          A test page for the encryption approach. The content below exists in the repo
          only as an encrypted blob.
        </p>
        <Gate blob={blob} title="Gated demo" />
      </section>
    </div>
  );
}
