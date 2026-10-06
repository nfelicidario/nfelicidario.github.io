# Case study building blocks

Shared, read-only for story agents. Compose a case study page from these:

```tsx
import { CaseHero, Tldr, Beat, Artifact, Outcome, Hindsight, NextCase } from "@/components/case/CaseLayout";

export default function Page() {
  return (
    <div className="container-x">
      <CaseHero kicker="Stride · 2020–2025" title="..." lede="..." meta={[{label:"Role", value:"..."}]} artifact={<MyHeroArtifact />} />
      <Tldr items={["...", "...", "...", "..."]} />
      <Beat chapter="Chapter 1 · Finding the customer" title="..." artifact={<Artifact label="..." pill="Mock data">...</Artifact>}>
        <p>Two to four sentences.</p>
      </Beat>
      <Outcome stats={[{value:"2% → 22%", label:"monthly active users"}]}><p>optional</p></Outcome>
      <Hindsight><p>...</p></Hindsight>
      <NextCase slug="provisioning" />
    </div>
  );
}
```

Rules:
- Text per beat: 2–4 sentences. The artifact carries the rest.
- `Artifact` is the only frame for visuals. Put custom interactive components inside it.
- Use design tokens via Tailwind classes: `text-ink`, `text-body`, `text-muted`, `bg-surface`, `bg-raised`, `border-rule`, `text-accent`, `bg-accent-soft`. Utilities: `label`, `num`, `bubble`, `bubble-sm`, `measure`.
- Headings use the display font automatically. Never add new fonts.
- Motion: `motion/react` is installed. Per-beat, never ambient. Respect reduced motion (globals.css already shortens animations).
- No images from outside the project. Recreate with JSX/SVG and mock data.

## Hero stage (added Oct 6)
Every case study hero is a full-width `HeroStage` (src/components/case/HeroStage.tsx) with four tiers of the same story:
interactive prototype → autoplay animation → GIF (recorded later) → 3–5 stills in a carousel.
Pass it as `stage={<HeroStage label="..." interactive={<Proto />} autoplay={<Proto autoplay />} stills={[{render:<Frame1/>, caption:"..."}]} />}` to `CaseHero`.
Build prototypes so ONE component serves both tiers: accept an `autoplay?: boolean` prop that drives the same states on a timer (loop), and export static frame components (or a `frames` array) for the stills. Icons: `lucide-react` only. Prototypes must fill the stage (position absolute inset 0, or h-full w-full), work at 16:9, and degrade to something readable at 360px wide.
