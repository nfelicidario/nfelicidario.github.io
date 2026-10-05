/**
 * Adoption of the planning flow, as abstract blocks. Not to scale and not a
 * team count: each column is the same twelve blocks, filled to show "one team",
 * "two teams", and "about half."
 */
const TOTAL = 12;

const columns: { when: string; who: string; filled: number; moving: number }[] = [
  { when: "First", who: "My team, the first on Linear", filled: 1, moving: 0 },
  { when: "Then", who: "A second team migrated whole", filled: 2, moving: 0 },
  { when: "Now", who: "About half of product and technology", filled: 6, moving: 6 },
];

export function Adoption() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-3">
        {columns.map((c, ci) => {
          const last = ci === columns.length - 1;
          return (
            <div key={c.when} className="grid gap-2.5">
              <div className="label">{c.when}</div>
              <div
                className="grid grid-cols-3 gap-1"
                role="img"
                aria-label={`${c.who}: ${c.filled} of ${TOTAL} blocks filled`}
              >
                {Array.from({ length: TOTAL }).map((_, i) => {
                  const on = i < c.filled;
                  const moving = !on && i < c.filled + c.moving;
                  return (
                    <span
                      key={i}
                      className={`aspect-square rounded-[5px] border ${
                        on
                          ? "border-accent bg-accent"
                          : moving
                            ? "border-dashed border-accent/70 bg-accent-soft"
                            : "border-rule bg-raised"
                      }`}
                    />
                  );
                })}
              </div>
              <p className={`text-[12.5px] leading-snug ${last ? "font-medium text-ink" : ""}`}>{c.who}</p>
            </div>
          );
        })}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-muted">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-accent" aria-hidden="true" /> On the flow
        </li>
        <li className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-[3px] border border-dashed border-accent/70 bg-accent-soft"
            aria-hidden="true"
          />
          Moving
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-rule bg-raised" aria-hidden="true" /> Not yet
        </li>
      </ul>
    </div>
  );
}
