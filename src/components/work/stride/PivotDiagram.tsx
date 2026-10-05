function Person({
  title,
  role,
  accent = false,
}: {
  title: string;
  role: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`bubble-sm grid grid-cols-[28px_1fr] items-start gap-2.5 border p-2.5 ${
        accent ? "border-accent bg-accent-soft" : "border-rule bg-surface"
      }`}
    >
      <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden="true">
        <circle cx="14" cy="14" r="14" fill={accent ? "var(--accent)" : "var(--raised)"} />
        <circle cx="14" cy="11" r="4.5" fill={accent ? "var(--surface)" : "var(--muted)"} />
        <path d="M5.5 24c1.5-5 5-7 8.5-7s7 2 8.5 7" fill={accent ? "var(--surface)" : "var(--muted)"} />
      </svg>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold leading-tight text-ink">{title}</div>
        <div className="mt-0.5 text-[12px] leading-snug text-muted">{role}</div>
      </div>
    </div>
  );
}

function Arrow({ dashed = false, label }: { dashed?: boolean; label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-1 text-muted">
      <svg viewBox="0 0 24 40" className="h-8 w-5" aria-hidden="true">
        <path
          d="M12 2v30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray={dashed ? "3 3" : undefined}
        />
        <path d="M6 28l6 8 6-8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {label && <span className="text-[11px] italic">{label}</span>}
    </div>
  );
}

export function PivotDiagram() {
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_1.35fr]">
      {/* Before */}
      <div>
        <div className="label mb-2">Before · come to us</div>
        <div className="bubble-sm border border-dashed border-rule p-3 text-center text-[13px] text-body">
          Their own Slack workspace
        </div>
        <Arrow dashed label="leave it" />
        <div className="bubble-sm border border-rule bg-raised p-3 text-center">
          <div className="text-[13px] font-semibold text-ink">A Stride-owned workspace</div>
          <div className="mt-0.5 text-[12px] text-muted">plus a personal goals dashboard</div>
        </div>
        <Arrow />
        <Person title="A coach" role="in a channel that is not theirs" />
        <p className="mt-3 text-[12.5px] text-muted">
          One user: an individual who signs up alone. Few came, fewer stayed.
        </p>
      </div>

      {/* After */}
      <div>
        <div className="label mb-2 text-accent">After · go where they already are</div>
        <div className="bubble-sm border border-accent p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-ink">The company&apos;s own Slack or Teams</span>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
              Stride installed
            </span>
          </div>
          <div className="grid gap-2">
            <Person
              title="Chief People Officer, VP of People"
              role="Buys it. Holds the budget, wants a lever for the whole team."
              accent
            />
            <Person title="Manager" role="Sponsors it. Sees coaching as how their people grow." />
            <Person title="Individual contributor" role="Uses it. DMs a coach without leaving the thread they were in." />
          </div>
          <div className="bubble-sm mt-2 grid grid-cols-[auto_1fr] items-center gap-2 bg-raised px-3 py-2 text-[12.5px]">
            <span className="rounded bg-surface px-1.5 py-0.5 text-[10.5px] font-semibold text-muted">DM</span>
            <span className="text-body">
              Live coaching in text, with a video call when the conversation needs it.
            </span>
          </div>
        </div>
        <p className="mt-3 text-[12.5px] text-muted">
          Three users, not one. The person who pays is no longer the person who types.
        </p>
      </div>
    </div>
  );
}
