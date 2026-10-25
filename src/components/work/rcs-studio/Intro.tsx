import type { Meta } from "@/components/case/CaseLayout";
import { MetaList } from "@/components/case/CaseLayout";

/** The intro under the RCS Studio hero: a ruled band of role, team, timeline, and stack. The product name sits in the header row above the stage. */
export function RcsIntro({ meta }: { meta: Meta[] }) {
  return (
    <div className="mt-12 md:mt-14">
      <MetaList
        meta={meta}
        columns={4}
        className="border-y border-rule py-5 md:gap-x-8 md:[&>div+div]:border-l md:[&>div+div]:border-rule md:[&>div+div]:pl-6"
      />
    </div>
  );
}
