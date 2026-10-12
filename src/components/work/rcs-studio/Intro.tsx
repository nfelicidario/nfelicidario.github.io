import type { Meta } from "@/components/case/CaseLayout";
import { MetaList } from "@/components/case/CaseLayout";

/** The intro under the RCS Studio hero: the product name over a ruled band of role, team, timeline, and stack. */
export function RcsIntro({ meta }: { meta: Meta[] }) {
  return (
    <div className="mt-14 md:mt-16">
      <h2 className="text-center text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.02em] text-ink">RCS Studio</h2>
      <MetaList
        meta={meta}
        columns={4}
        className="mt-8 border-y border-rule py-5 md:gap-x-8 md:[&>div+div]:border-l md:[&>div+div]:border-rule md:[&>div+div]:pl-6"
      />
    </div>
  );
}
