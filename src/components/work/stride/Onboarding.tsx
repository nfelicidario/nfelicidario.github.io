function Step({
  n,
  who,
  what,
  mine,
  last,
}: {
  n: number;
  who: string;
  what: string;
  mine?: boolean;
  last?: boolean;
}) {
  return (
    <li className="grid grid-cols-[28px_1fr] gap-3">
      <div className="flex flex-col items-center">
        <span
          className={`num flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
            mine ? "bg-accent text-surface" : "border border-rule bg-surface text-muted"
          }`}
        >
          {n}
        </span>
        {!last && <span className="w-px flex-1 border-l border-dashed border-rule" />}
      </div>
      <div className="pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13.5px] font-semibold text-ink">{who}</span>
          {mine && (
            <span className="rounded-full bg-accent-soft px-1.5 py-px text-[10.5px] font-semibold text-accent">
              I designed this
            </span>
          )}
        </div>
        <p className="text-[13px] leading-snug text-body">{what}</p>
      </div>
    </li>
  );
}

/** Beat 4: the journey starts before the app does. */
export function JourneyMap() {
  return (
    <ol className="text-[13.5px]">
      <Step n={1} who="Our CEO briefs the people leader" what="A sales call closes. The buyer now has to explain Stride to their team." />
      <Step
        n={2}
        who="The people leader emails their team"
        what="Co-branded email and a one-page explainer, so the first impression is set before anyone opens Slack."
        mine
      />
      <Step n={3} who="The employee opens Stride in Slack or Teams" what="It is already installed. They did not choose it, so they do not know what it is for." />
      <Step n={4} who="A welcome message" what="One message, then silence. This is where the first week went quiet." mine />
      <Step n={5} who="Drop-off" what="No reason to come back until a session was booked for them." last />
    </ol>
  );
}

function Msg({ when, title, lines }: { when: string; title: string; lines: string[] }) {
  return (
    <div className="bubble-sm border border-rule bg-surface p-3">
      <div className="label mb-1">{when}</div>
      <div className="text-[13.5px] font-semibold text-ink">{title}</div>
      <ul className="mt-1 grid gap-0.5 text-[12.5px] text-body">
        {lines.map((l) => (
          <li key={l}>· {l}</li>
        ))}
      </ul>
    </div>
  );
}

/** Beat 5: one big message versus a phased welcome. */
export function PhasedOnboarding() {
  const bars = [100, 88, 94, 70, 92, 60, 85, 78, 90, 55];
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
      <div>
        <div className="label mb-2">What I argued for</div>
        <div className="bubble-sm border border-dashed border-rule bg-raised p-3">
          <div className="text-[13.5px] font-semibold text-ink">Everything, on day one</div>
          <div className="mt-2 grid gap-1.5" aria-hidden="true">
            {bars.map((w, i) => (
              <span key={i} className="block h-2 rounded-full bg-rule" style={{ width: `${w}%` }} />
            ))}
          </div>
          <p className="mt-2 text-[12.5px] text-muted">What Stride is, how to ask, what to ask, when to use it, who the coaches are.</p>
        </div>
        <p className="mt-2 text-[12.5px] italic text-muted">
          A co-founder: &ldquo;Too much up front, and people drop.&rdquo; Also right.
        </p>
      </div>
      <div>
        <div className="label mb-2 text-accent">What we shipped</div>
        <div className="grid gap-2">
          <Msg
            when="Day one"
            title="A light welcome"
            lines={["What Stride is, in two lines", "One thing to try today"]}
          />
          <Msg
            when="A few days in"
            title="How to ask"
            lines={["Three example questions people bring", "Coaches reply in the thread"]}
          />
          <Msg
            when="End of week one"
            title="When to use it"
            lines={["Before a hard conversation", "After a review", "Book a video session if you want more"]}
          />
        </div>
      </div>
    </div>
  );
}
