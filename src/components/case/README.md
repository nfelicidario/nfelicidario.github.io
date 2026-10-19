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

Slide-like story format (RCS Studio uses it; other case studies still use `Beat`): `SixtySeconds` under the hero (centred `heading`, default "Summary", above the card; problem, the work, the result, stats, three takeaways), then `Beats` (centred `heading`, default "The full story") wrapping numbered `StoryBeat`s. Each `StoryBeat` takes `id` (anchor), `title`, one `visual` (an `Artifact`), three to five bullets as children (`Bullets`), optionally a full-width `after` slot under the body (slide 1 puts its timeline there), and an optional long version in `deeper` (shown behind "Go deeper"; RCS Studio no longer uses it). `StoryBeat` also takes `layout` (split, split-reverse, stack, wide), for stack `visualFirst` (visual between the title and the body) and `align` ("center" by default, "left" for a slide-like layout), `subtitle` for the slide's short name in the eyebrow after the number (the rail uses it as the slide's name), and `framed` (default true: the whole slide is an outlined card on the surface colour, slides wrap their content and have no dividers; false restores the older open layout with dividers and a minimum height). `visual` is optional: a slide without one is heading plus bullets, which is how RCS Studio's outcome and hindsight slides work. The eyebrow reads "n · subtitle" in one muted colour. The side rail starts at the first slide's centre, catches at the viewport centre, and stops at the last slide's centre. `Beats` draws the progress rail (a vertical rail on the left at large widths that starts at the first slide's centre and catches at the viewport centre, a compact top rail below that), tracks the current beat, and wires the arrow keys (Down or Right next, Up or Left previous). `Outcome` and `Hindsight` take `align="center"`. Import from `@/components/case/Story`.

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

## Stage footer (added Oct 7)
The stage footer is a 3-column row under the stage: label · [step dots + current step name + prototype actions] · tier control.
Prototypes publish into the middle column with `useHeroFooter()` from HeroStage.tsx:
```tsx
const footer = useHeroFooter();
useEffect(() => {
  footer.set({ steps: ["Make it yours", "Sign up", "Provision", "Review", "Live"], current: stepIndex,
    actions: [{ label: "Replay", icon: <RotateCcw size={12} />, onClick: reset },
              { label: "Skip to live", icon: <SkipForward size={12} />, onClick: skip, hidden: autoplay || isLive }] });
  return () => footer.set(null);
}, [stepIndex, autoplay, isLive]);
```
Do not render step eyebrows or control buttons inside the prototype; the footer owns them.
