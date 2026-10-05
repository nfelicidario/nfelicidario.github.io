type Block = { title: string; shared: boolean; fields: string[] };

const columns: { sender: string; stage: string; blocks: Block[] }[] = [
  {
    sender: "RCS",
    stage: "in production",
    blocks: [
      { title: "Brand", shared: true, fields: ["Name", "Website", "Logo", "Contact"] },
      { title: "Campaign", shared: true, fields: ["Use case", "Sample messages", "Opt-in", "Review"] },
      { title: "RCS agent details", shared: false, fields: ["Agent name", "Banner", "Brand color", "Rich card samples"] },
    ],
  },
  {
    sender: "Toll-free",
    stage: "in alpha",
    blocks: [
      { title: "Brand", shared: true, fields: ["Name", "Website", "Logo", "Contact"] },
      { title: "Campaign", shared: true, fields: ["Use case", "Sample messages", "Opt-in", "Review"] },
      { title: "Toll-free details", shared: false, fields: ["Number", "Monthly volume", "Opt-in proof", "Help keyword"] },
    ],
  },
];

export function Generalizes() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {columns.map((c) => (
          <div key={c.sender} className="grid gap-2">
            <div className="flex items-baseline justify-between gap-2 px-1">
              <span className="text-[14px] font-semibold text-ink">{c.sender}</span>
              <span className="label">{c.stage}</span>
            </div>
            {c.blocks.map((b) => (
              <div
                key={b.title}
                className={`bubble-sm border p-3 ${b.shared ? "border-accent bg-accent-soft" : "border-rule bg-raised"}`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-semibold text-ink">{b.title}</span>
                  <span className={`text-[10.5px] font-semibold tracking-[0.06em] uppercase ${b.shared ? "text-accent" : "text-muted"}`}>
                    {b.shared ? "shared" : "sender-specific"}
                  </span>
                </div>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {b.fields.map((f) => (
                    <li key={f} className="rounded-full bg-surface px-2 py-0.5 text-[11.5px] text-body">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted">
        <span>Same shape next:</span>
        {["10DLC", "Short code"].map((s) => (
          <span key={s} className="rounded-full border border-dashed border-rule px-2 py-0.5">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
