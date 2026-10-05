/* Abstract tiles. Type scale, spacing and color only. No real screens. */

const inheritedSwatches = ["#e5484d", "#f5a524", "#30a46c", "#8e4ec6", "#0091ff", "#e93d82"];

export function LookShift() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="bubble-sm border border-dashed border-rule bg-bg p-4">
        <div className="label mb-3">Inherited · built for a marketing platform</div>
        <div className="rounded-[10px] border border-rule bg-surface p-5">
          <div className="font-display text-[26px] leading-none font-bold tracking-[-0.03em] text-ink">Headline</div>
          <div className="mt-4 h-2.5 w-4/5 rounded-full bg-raised" />
          <div className="mt-3 h-2.5 w-3/5 rounded-full bg-raised" />
          <div className="mt-6 flex flex-wrap gap-2">
            {inheritedSwatches.map((c) => (
              <span key={c} aria-hidden="true" className="h-7 w-14 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="mt-6 h-6 w-28 rounded-full bg-raised" />
        </div>
        <ul className="mt-3 grid gap-1 text-[12.5px] text-muted">
          <li>Large type scale</li>
          <li>Generous spacing</li>
          <li>Primary plus several secondary colors, used freely</li>
        </ul>
      </div>

      <div className="bubble-sm border border-accent bg-accent-soft/40 p-4">
        <div className="label mb-3 text-accent">New direction · built for a dense builder</div>
        <div className="rounded-[10px] border border-rule bg-surface p-3">
          <div className="font-display text-[15px] leading-none font-bold tracking-[-0.02em] text-ink">Headline</div>
          <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2">
            <div className="h-1.5 w-11/12 rounded-full bg-raised" />
            <span className="h-4 w-12 rounded-full bg-accent" />
          </div>
          <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-raised" />
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-7 rounded-[6px] border border-rule bg-bg" />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-5 rounded-[6px] border border-rule bg-bg" />
            ))}
          </div>
        </div>
        <ul className="mt-3 grid gap-1 text-[12.5px] text-muted">
          <li>Smaller type scale, more on screen</li>
          <li>Tighter spacing</li>
          <li>Color reserved for calls to action</li>
        </ul>
      </div>
    </div>
  );
}
