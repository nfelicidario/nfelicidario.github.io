import type { Meta } from "@/components/case/CaseLayout";
import { MetaBand } from "@/components/case/CaseLayout";

/** The intro under the RCS Studio hero: the meta band. The product name sits in the header row above the stage. */
export function RcsIntro({ meta }: { meta: Meta[] }) {
  return <MetaBand meta={meta} />;
}
