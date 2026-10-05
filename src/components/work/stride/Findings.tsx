function Card({
  kicker,
  title,
  body,
  tone = "default",
}: {
  kicker: string;
  title: string;
  body: string;
  tone?: "default" | "accent";
}) {
  return (
    <div
      className={`bubble-sm border p-3.5 ${
        tone === "accent" ? "border-accent bg-accent-soft" : "border-rule bg-surface"
      }`}
    >
      <div className={`label mb-1 ${tone === "accent" ? "text-accent" : ""}`}>{kicker}</div>
      <div className="text-[14.5px] font-semibold leading-snug text-ink">{title}</div>
      <p className="mt-1 text-[13px] leading-snug text-body">{body}</p>
    </div>
  );
}

/** Beat 2: what the interviews said. */
export function TwoReasons() {
  return (
    <div className="grid gap-3">
      <Card
        kicker="Finding 1 · friction"
        title="Nobody leaves their own workspace to reach a coach."
        body="Switching to a second Slack to send one message was enough to stop the message from being sent."
      />
      <Card
        kicker="Finding 2 · the buyer"
        title="The people who valued coaching were not the individuals using it."
        body="Managers, VPs of People, and Chief People Officers saw it as a lever for their teams. They also held the budget."
        tone="accent"
      />
      <p className="text-[12.5px] text-muted">From user interviews with the early adopters we had. Paraphrased.</p>
    </div>
  );
}

/** Beat 6: who the low engagement hurt. */
export function WhatsWrong() {
  return (
    <div className="grid gap-3">
      <div className="bubble-sm border border-warn bg-warn-soft px-3.5 py-2.5 text-[13.5px] font-semibold text-ink">
        Low weekly engagement
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card kicker="Sales" title="Can't show value" body="No usage story to tell a prospect in the second meeting." />
        <Card
          kicker="Client relations"
          title="Can't retain or upsell"
          body="Renewal conversations started from a weak number."
        />
        <Card
          kicker="Users"
          title="Miss the benefit"
          body="Paying for coaching they had forgotten they had."
        />
      </div>
    </div>
  );
}

/** Beat 7: insights to strategy, and the two metrics set before design. */
export function InsightsToStrategy() {
  const rows = [
    ["Users forgot the platform existed", "Remind them, inside the tool they already use"],
    ["Users didn't know what to bring to a coach", "Prompt topics, so there is always something to ask"],
    ["Users didn't see how coaching applied to their job", "Personalize to role and to what the company cares about"],
  ];
  return (
    <div className="grid gap-4 text-[13.5px]">
      <div>
        <div className="mb-2 grid grid-cols-[1fr_1fr] gap-3">
          <span className="label">Insight</span>
          <span className="label text-accent">Strategy</span>
        </div>
        <ul className="grid gap-2">
          {rows.map(([i, s]) => (
            <li key={i} className="grid grid-cols-[1fr_1fr] gap-3">
              <span className="bubble-sm border border-rule bg-surface px-3 py-2 text-body">{i}</span>
              <span className="bubble-sm border border-accent bg-accent-soft px-3 py-2 text-ink">{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-rule pt-3">
        <div className="label mb-2">Metrics, set before any design</div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="bubble-sm border border-rule bg-surface px-3 py-2">
            <div className="font-semibold text-ink">Weekly engagement</div>
            <div className="text-[12.5px] text-muted">Quantitative. Goal: 10% over baseline.</div>
          </div>
          <div className="bubble-sm border border-rule bg-surface px-3 py-2">
            <div className="font-semibold text-ink">Platform utility</div>
            <div className="text-[12.5px] text-muted">Qualitative. Sentiment in post-session surveys and interviews.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Beat 8: what the MVP returned. */
export function MvpScorecard() {
  const items: [string, string, "ok" | "warn"][] = [
    ["+9%", "weekly engagement, against a 10% goal", "ok"],
    ["2 weeks", "then users dropped off", "warn"],
    ["Flat", "satisfaction did not move", "warn"],
    ["“Generic”", "the word in nearly every reply", "warn"],
  ];
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map(([v, l, tone]) => (
        <li
          key={l}
          className={`bubble-sm border px-3 py-2 ${
            tone === "ok" ? "border-ok bg-ok-soft" : "border-rule bg-surface"
          }`}
        >
          <div className="num text-[17px] font-bold tracking-[-0.02em] text-ink">{v}</div>
          <div className="text-[12px] leading-snug text-muted">{l}</div>
        </li>
      ))}
    </ul>
  );
}
