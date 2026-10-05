type Kind = "Learn" | "Apply" | "Reflect";

const monthOne: { title: string; kind: Kind }[] = [
  { title: "What trust actually measures", kind: "Learn" },
  { title: "The two kinds of safety", kind: "Learn" },
  { title: "Reading the room in a thread", kind: "Apply" },
  { title: "Psychological safety is built in small moments", kind: "Learn" },
  { title: "Reward the question", kind: "Apply" },
  { title: "Name your own mistake first", kind: "Apply" },
  { title: "Repair after a bad meeting", kind: "Apply" },
  { title: "Your trust ledger", kind: "Reflect" },
];

const months = [
  { name: "Month 1", theme: "Foundations", count: 8 },
  { name: "Month 2", theme: "Practice with your team", count: 8 },
  { name: "Month 3", theme: "Make it stick", count: 7 },
];

const catalog = [
  "Inclusive leadership",
  "Listening blindspots",
  "Leading through change",
  "Unconscious bias",
  "Allyship",
  "Critical conversations",
  "Burnout",
  "Leading with empathy",
  "Building trust and safety",
];

const TOTAL = 23;
const DONE = 4;

/** Learning number at which each month begins (0, 8, 16). */
const starts = months.map((_, i) => months.slice(0, i).reduce((sum, m) => sum + m.count, 0));

export function TrackProgress() {
  return (
    <div className="text-[13.5px]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="label text-accent">Track</div>
          <div className="text-[17px] font-bold text-ink">Building Trust &amp; Safety</div>
        </div>
        <div className="num text-[12.5px] text-muted">
          {TOTAL} micro-learnings · 3 months · Tue and Thu
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[12px] text-muted">
          <span>Progress</span>
          <span className="num font-medium text-ink">
            {DONE} of {TOTAL}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-valuenow={DONE}
          aria-label="Learnings completed"
          className="mt-1 h-2 overflow-hidden rounded-full bg-raised"
        >
          <div className="h-full rounded-full bg-accent" style={{ width: `${(DONE / TOTAL) * 100}%` }} />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {months.map((m, mi) => {
          const start = starts[mi];
          return (
            <div key={m.name}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">
                  {m.name} <span className="font-normal text-muted">· {m.theme}</span>
                </span>
                <span className="flex gap-1" aria-label={`${m.count} learnings`}>
                  {Array.from({ length: m.count }, (_, i) => {
                    const n = start + i + 1;
                    const done = n <= DONE;
                    return (
                      <span
                        key={n}
                        title={`Learning ${n} · ${i % 2 === 0 ? "Tuesday" : "Thursday"}`}
                        className={`h-2.5 w-2.5 rounded-full ${
                          done ? "bg-accent" : "border border-rule bg-surface"
                        }`}
                      />
                    );
                  })}
                </span>
              </div>
              {mi === 0 && (
                <ol className="mt-2 grid gap-1 border-l border-rule pl-3">
                  {monthOne.map((l, i) => {
                    const n = i + 1;
                    const current = n === DONE;
                    return (
                      <li
                        key={l.title}
                        className={`grid grid-cols-[24px_1fr_auto] items-baseline gap-2 ${
                          n < DONE ? "text-muted" : current ? "text-ink" : "text-body"
                        }`}
                      >
                        <span className="num text-[12px] text-muted">{n}</span>
                        <span className={current ? "font-semibold" : ""}>
                          {l.title}
                          {current && (
                            <span className="ml-2 rounded-full bg-accent-soft px-1.5 py-px text-[10.5px] font-semibold text-accent">
                              today
                            </span>
                          )}
                        </span>
                        <span className="label text-[10px]">{l.kind}</span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-rule pt-3">
        <div className="label mb-1.5">One of 20 tracks, including</div>
        <ul className="flex flex-wrap gap-1.5">
          {catalog.map((c) => (
            <li
              key={c}
              className={`rounded-full border px-2 py-0.5 text-[12px] ${
                c === "Building trust and safety"
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-rule bg-surface text-body"
              }`}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
